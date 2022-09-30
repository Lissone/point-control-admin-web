interface ValidateUserPermissionParams {
  user: { role: string }
  roles: string[]
}

export function validateUserPermission({ user, roles }: ValidateUserPermissionParams) {
  return roles.includes(user.role)
}
