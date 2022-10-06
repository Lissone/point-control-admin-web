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
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import * as yup from 'yup'

import { ICompany } from '@interfaces/company'
import { EmployeeCreateUpdateDTO, IEmployee } from '@interfaces/employee'

import { api } from '@services/api'

import { useAuth } from '@contexts/AuthContext'

import { Input, Select } from '@components/shared/Form'

type FormValuesType = Partial<EmployeeCreateUpdateDTO> & Partial<IEmployee>

interface EmployeeFormProps {
  heading: string
  read?: boolean
  create?: boolean
  update?: boolean
  values?: FormValuesType
  onHandleCancel?: () => void
  onHandleSubmit?: (values: EmployeeCreateUpdateDTO) => Promise<void>
}

export function EmployeeForm({
  heading,
  values,
  read = false,
  create = false,
  update = false,
  onHandleCancel = () => undefined,
  onHandleSubmit = () => undefined
}: EmployeeFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [companies, setCompanies] = useState<ICompany[]>([])

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const handleCreateUpdate: SubmitHandler<EmployeeCreateUpdateDTO> = async (
    formValues
  ) => {
    let cpf: string
    if (read || update) {
      cpf = values.cpf
    } else {
      cpf = formValues.cpf.replace(/\D/g, '')
      const cpfError = validateCpf(cpf)
      if (cpfError) {
        setError('cpf', { type: 'custom', message: cpfError })
        return
      }
    }

    await onHandleSubmit({ ...formValues, cpf })
  }

  useEffect(() => {
    async function loadInputCompanies() {
      const companyCnpj = user?.company?.cnpj
      const { data } = await (companyCnpj
        ? api.get(`/company/${companyCnpj}`)
        : api.get('/company'))
      setCompanies(Array.isArray(data) ? data : [data])
    }

    // eslint-disable-next-line no-console
    loadInputCompanies().catch((err) => console.error(err))
  }, [user])

  if (!read && !create && !update) {
    router.push('/employee')
    return null
  }

  if ((read || update) && !values) {
    router.push('/employee')
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
          <Input
            as={InputMask}
            mask="999.999.999-99"
            maskChar={null}
            name="cpf"
            label="CPF"
            isDisabled={read}
            defaultValue={values.cpf}
            error={formState.errors.cpf}
            {...register('cpf', { disabled: read || update })}
          />
          <Input
            name="name"
            label="Nome completo"
            isDisabled={read}
            defaultValue={values.name}
            error={formState.errors.name}
            {...register('name')}
          />
          <Input
            name="email"
            label="E-mail"
            isDisabled={read}
            defaultValue={values.email}
            error={formState.errors.email}
            {...register('email')}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
          <Select
            name="companyCnpj"
            label="Empresa"
            isDisabled={read}
            options={companies.map((company) => ({
              label: company.name,
              value: company.cnpj,
              selected: company.cnpj === values.companyCnpj
            }))}
            error={formState.errors.companyCnpj}
            {...register('companyCnpj', { value: values.companyCnpj })}
          />
          <Input
            name="role"
            label="Cargo"
            isDisabled={read}
            defaultValue={values.role}
            error={formState.errors.role}
            {...register('role')}
          />
          <Input
            name="dtBirth"
            type="date"
            label="Data de Nascimento"
            placeholder="Selecione a data"
            isDisabled={read}
            defaultValue={
              values.dtBirth ? format(new Date(values.dtBirth), 'yyyy-MM-dd') : ''
            }
            style={{ colorScheme: 'dark' }}
            error={formState.errors.dtBirth}
            {...register('dtBirth')}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
          <Input
            name="entry"
            type="time"
            label="Horário de entrada"
            placeholder="Selecione o horário"
            isDisabled={read}
            defaultValue={values.entry}
            style={{ colorScheme: 'dark' }}
            error={formState.errors.entry}
            {...register('entry')}
          />
          <Input
            name="exit"
            type="time"
            label="Horário de saída"
            placeholder="Selecione o horário"
            isDisabled={read}
            defaultValue={values.exit}
            style={{ colorScheme: 'dark' }}
            error={formState.errors.exit}
            {...register('exit')}
          />
          <Input
            name="workingTime"
            type="number"
            label="Carga horária"
            isDisabled={read}
            defaultValue={values.workingTime}
            error={formState.errors.workingTime}
            {...register('workingTime')}
          />
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

const validateCpf = (cpf: string) => {
  if (cpf.length < 11) return 'Mínimo 11 dígitos'
  else if (cpf.length > 11) return 'Máximo 11 dígitos'
}

// mesmo schema para Create e Update
const validationSchema = yup.object().shape({
  cpf: yup.string().min(11, 'Mínimo 11 dígitos'),
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  companyCnpj: yup.string().required('Empresa obrigatória'),
  role: yup.string().required('Cargo obrigatório'),
  dtBirth: yup.date().required('Data de nascimento obrigatória'),
  entry: yup.string().required('Horário de entrada obrigatório'),
  exit: yup.string().required('Horário de saída obrigatório'),
  workingTime: yup.number().required('Carga horária obrigatória')
})
