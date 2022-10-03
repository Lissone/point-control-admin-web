/* eslint-disable import/no-cycle */
import { IAbsence } from './absence'
import { ICompany } from './company'

export interface IPoint {
  id: number
  employeeCpf: string
  createdAt: Date
  updatedAt: Date
  employee: IEmployee
}

export interface IAddress {
  id: number
  street: string
  district: string
  city: string
  state: string
  employeeCpf: string
  createdAt: Date
  updatedAt: Date
  employee: IEmployee
}

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
  absences?: IAbsence[]
  points?: IPoint[]
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
