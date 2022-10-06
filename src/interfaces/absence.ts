/* eslint-disable import/no-cycle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { IEmployee } from './employee'

export enum AbsenceStatus {
  Negado = 0,
  AguardandoAnalise = 1,
  Aprovado = 2
}

export const AbsenceStatusLabel = {
  [AbsenceStatus.Negado]: 'Negado',
  [AbsenceStatus.AguardandoAnalise]: 'Em Análise',
  [AbsenceStatus.Aprovado]: 'Aprovado'
}

export interface IAbsence {
  id: number
  status: AbsenceStatus
  type: string
  description: string | null
  startTime: Date
  endTime: Date
  employeeCpf: string
  justification: string | null
  createdAt: Date
  updatedAt: Date
  employee: IEmployee
}

export interface AbsenceCreateUpdateDTO {
  status: AbsenceStatus
  type: string
  description: string | null
  startTime: Date
  endTime: Date
  justification: string | null
  employeeCpf?: string | null
}
