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

interface AuthContextType {
  user: IUser | null
  signIn: (data: SignInData) => Promise<void>
  signOut: () => void
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

  async function signIn({ email, password }: SignInData) {
    try {
      const { data } = await api.post('/user/login/admin', {
        email,
        password
      })

      api.defaults.headers['Authorization'] = `Bearer ${data.token}`

      setCookie(undefined, '@PointControlAdmin.token', data.token, {
        maxAge: data.tokenExpires
      })

      setUser(data.user)

      Router.push('/dashboard')
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

  function signOut() {
    destroyCookie(undefined, '@PointControlAdmin.token')
    setUser(null)

    Router.push('../')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
