import { ReactNode } from 'react'

import { useAuth } from '@contexts/AuthContext'

import { validateUserPermission } from '@utils/validateUserPermission'

interface UserCanSeeProps {
  roles: string[]
  children: ReactNode
}

export function UserCanSee({ roles, children }: UserCanSeeProps) {
  const { user } = useAuth()
  if (!user) return null

  const userCanSeeComponent = validateUserPermission({ user: { role: user.role }, roles })
  if (!userCanSeeComponent) return null

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}
