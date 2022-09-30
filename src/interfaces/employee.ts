/* eslint-disable import/no-cycle */
import { IAddress, ICompany } from './user'

export interface IEmployee {
  cpf: string
  name: string
  email: string
  password: string
  dtBirth: Date
  entry: string
  exit: string
  workingTime: number
  role: string
  companyCnpj?: string
  createdAt: Date
  updatedAt: Date
  company?: ICompany
  address?: IAddress
}

export interface EmployeeCreateUpdateDTO {
  cpf: string
  name: string
  email: string
  companyCnpj: string
  role: string
  dtBirth: Date
  entry: string
  exit: string
  workingTime: number
}
