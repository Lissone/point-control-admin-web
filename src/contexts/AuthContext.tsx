/* eslint-disable react/jsx-no-constructed-context-values */
import Router from 'next/router'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { createContext, ReactNode, useContext, useState, useEffect } from 'react'

import { IUser } from '@interfaces/user'

import { api } from '@services/api'

export interface SignInData {
  email: string
  password: string
}

interface SignInDataResponse {
  user: IUser
  token: string
  tokenExpires: number
}

export interface ResetPasswordInfo {
  name: string
  email: string
}

interface ValidateIdentityInfo {
  token: string
  code: string
}

interface AuthContextType {
  user: IUser | null
  signIn: (data: SignInData) => Promise<void>
  signOut: () => void
  changePassword: (newPassword: string) => Promise<void>
  resetPassword: (info: ResetPasswordInfo) => Promise<void>
  validateIdentity: (info: ValidateIdentityInfo) => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const { '@PointControlAdmin.token': token } = parseCookies()

    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      api.get('/user/recover').then(({ data }) => setUser(data.user))
    }
  }, [])

  const signIn = async ({ email, password }: SignInData) => {
    try {
      const { data } = await api.post<SignInDataResponse>('/user/login/admin', {
        email,
        password
      })

      api.defaults.headers['Authorization'] = `Bearer ${data.token}`

      setCookie(undefined, '@PointControlAdmin.token', data.token, {
        maxAge: data.tokenExpires
      })

      setUser(data.user)

      if (data.user.firstAccess) Router.push('/change/password')
      else Router.push('/dashboard')
    } catch (err: any) {
      switch (err.response.data.message) {
        case 'User not found':
          throw new Error('Usuário não cadastrado!')
        case 'Invalid password':
          throw new Error('Senha inválida!')
        default:
          throw new Error(err as string)
      }
    }
  }

  const resetPassword = async (info: ResetPasswordInfo) => {
    try {
      const { data } = await api.post<{ token: string }>(
        '/user/reset/password/admin',
        info
      )
      Router.push(`/validate/token/${data.token}`)
    } catch (err: any) {
      throw new Error(err.response.data.message as string)
    }
  }

  const validateIdentity = async (info: ValidateIdentityInfo) => {
    try {
      const { data } = await api.post<SignInDataResponse>('/user/validate/identity', info)

      api.defaults.headers['Authorization'] = `Bearer ${data.token}`

      setCookie(undefined, '@PointControlAdmin.token', data.token, {
        maxAge: data.tokenExpires
      })

      setUser(data.user)

      Router.push('/change/password')
    } catch (err: any) {
      throw new Error(err.response.data.message)
    }
  }

  const changePassword = async (newPassword: string) => {
    const { data } = await api.patch('/user/change/password/admin', { newPassword })
    setUser(data)

    Router.push('/dashboard')
  }

  const signOut = () => {
    destroyCookie(undefined, '@PointControlAdmin.token')
    setUser(null)

    Router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        changePassword,
        resetPassword,
        validateIdentity
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
