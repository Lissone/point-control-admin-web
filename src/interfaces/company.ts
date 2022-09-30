/* eslint-disable import/no-cycle */
import { IEmployee } from './employee'

export interface ICompany {
  cnpj: string
  name: string
  createdAt: Date
  updatedAt: Date
  employees?: IEmployee[]
}

export interface CompanyCreateUpdateDTO {
  cnpj: string
  name: string
}
