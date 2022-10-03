/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable import/no-cycle */
import { ICompany } from './company'

export enum UserRole {
  GlobalAdmin = 'global.admin',
  Client = 'client'
}

export const UserRoleLabel = {
  [UserRole.GlobalAdmin]: 'Admin Global',
  [UserRole.Client]: 'Cliente'
}

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  role: string
  companyCnpj?: string | null
  createdAt: Date
  updatedAt: Date
  company?: ICompany
}

export interface UserCreateUpdateDTO {
  name: string
  email: string
  role: string
  companyCnpj: string | null
}
