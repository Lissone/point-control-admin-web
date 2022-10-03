import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { AbsenceCreateUpdateDTO, AbsenceStatus, IAbsence } from '@interfaces/absence'
import { IEmployee } from '@interfaces/employee'

import { api } from '@services/api'

import { useAuth } from '@contexts/AuthContext'

import { Input, Select, Textarea } from '@components/shared/Form'

type FormValuesType = Partial<AbsenceCreateUpdateDTO> & Partial<IAbsence>

interface AbsenceFormProps {
  heading: string
  read?: boolean
  create?: boolean
  review?: boolean
  update?: boolean
  values?: FormValuesType
  onHandleCancel?: () => void
  onHandleSubmit?: (values: AbsenceCreateUpdateDTO) => Promise<void>
}

export function AbsenceForm({
  heading,
  values,
  read = false,
  create = false,
  review = false,
  update = false,
  onHandleCancel = () => undefined,
  onHandleSubmit = () => undefined
}: AbsenceFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [employees, setEmployees] = useState<IEmployee[]>([])

  const statusOptions =
    read || create || update
      ? [
          { label: 'Negado', value: 0 },
          { label: 'Em Análise', value: 1 },
          { label: 'Aprovado', value: 2 }
        ]
      : [
          { label: 'Aprovado', value: 2 },
          { label: 'Negado', value: 0 }
        ]

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    async function loadInputEmployees() {
      const { data } = await api.get('/employee')
      setEmployees(data)
    }

    // eslint-disable-next-line no-console
    loadInputEmployees().catch((err) => console.error(err))
  }, [user])

  const handleCreateUpdate: SubmitHandler<AbsenceCreateUpdateDTO> = async (
    formValues
  ) => {
    await onHandleSubmit({
      ...formValues,
      status: Number(formValues.status),
      description: formValues.description === '' ? null : formValues.description,
      justification: formValues.justification === '' ? null : formValues.justification
    })
  }

  if (!read && !create && !update && !review) {
    router.push('/absence')
    return null
  }

  if ((read || update || review) && !values) {
    router.push('/absence')
    return null
  }

  return (
    <Box
      as="form"
      flex="1"
      borderRadius={8}
      bg="gray.800"
      p={['6', '8']}
      onSubmit={handleSubmit(handleCreateUpdate)}
    >
      <Heading size="lg" fontWeight="normal">
        {heading}
      </Heading>

      <Divider my="6" borderColor="gray.700" />

      <VStack spacing="8">
        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
          <Select
            name="status"
            label="Status"
            isDisabled={read || create}
            options={statusOptions.map((status) => ({
              label: status.label,
              value: status.value,
              selected: status.value === values.status
            }))}
            error={formState.errors.status}
            {...register('status', {
              value: values.status,
              disabled: read || create
            })}
          />
          <Input
            name="type"
            label="Tipo"
            isDisabled={read}
            defaultValue={values.type}
            error={formState.errors.type}
            {...register('type')}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
          {create && employees.length > 0 && (
            <Select
              name="employeeCpf"
              label="Funcionário"
              options={employees.map((employee) => ({
                label: employee.name,
                value: employee.cpf
              }))}
              error={formState.errors.employeeCpf}
              {...register('employeeCpf')}
            />
          )}
          <Textarea
            name="description"
            label="Descrição"
            isDisabled={read}
            defaultValue={values.description}
            {...register('description')}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
          <Input
            name="startTime"
            type="time"
            label="Horário de inicio"
            placeholder="Selecione o horário"
            isDisabled={read}
            defaultValue={values.startTime}
            style={{ colorScheme: 'dark' }}
            error={formState.errors.startTime}
            {...register('startTime')}
          />
          <Input
            name="endTime"
            type="time"
            label="Horário de retorno"
            placeholder="Selecione o horário"
            isDisabled={read}
            defaultValue={values.endTime}
            style={{ colorScheme: 'dark' }}
            error={formState.errors.endTime}
            {...register('endTime')}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
          {(update || review || (read && values.justification)) && (
            <Textarea
              name="justification"
              label="Justificativa"
              isDisabled={read}
              defaultValue={values.justification}
              error={formState.errors.justification}
              {...register('justification')}
            />
          )}
        </SimpleGrid>
      </VStack>

      <Flex mt="8" justify="flex-end">
        <HStack spacing="4">
          <Button type="button" onClick={onHandleCancel} colorScheme="whiteAlpha">
            {read ? 'Voltar' : 'Cancelar'}
          </Button>
          {!read && (
            <Button
              type="submit"
              colorScheme="green"
              isLoading={formState.isSubmitting}
              isDisabled={!formState.isDirty}
            >
              {create ? 'Salvar' : 'Atualizar'}
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}

const validationSchema = yup.object().shape({
  status: yup.string().required('Status obrigatório'),
  type: yup.string().required('Tipo obrigatório'),
  employeeCpf: yup.string().when('status', {
    is: String(AbsenceStatus.AguardandoAnalise),
    then: (schema) => schema.required('Funcionário obrigatório')
  }),
  description: yup.string(),
  startTime: yup.string().required('Horário de inicio obrigatório'),
  endTime: yup.string().required('Horário de retorno obrigatório'),
  justification: yup.string().when('status', {
    is: String(AbsenceStatus.Negado),
    then: (schema) => schema.required('Status obrigatório')
  })
})
