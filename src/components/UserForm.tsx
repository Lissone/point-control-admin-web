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
import { FormEvent, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { ICompany } from '@interfaces/company'
import { IEmployee } from '@interfaces/employee'
import { IUser, UserCreateUpdateDTO, UserRole } from '@interfaces/user'

import { api } from '@services/api'

import { useAuth } from '@contexts/AuthContext'

import { Input, Select } from '@components/shared/Form'

type FormValuesType = Partial<UserCreateUpdateDTO> & Partial<IUser>

interface UserFormProps {
  heading: string
  read?: boolean
  create?: boolean
  update?: boolean
  values?: FormValuesType
  onHandleCancel?: () => void
  onHandleSubmit?: (values: UserCreateUpdateDTO) => Promise<void>
}

export function UserForm({
  heading,
  values,
  read = false,
  create = false,
  update = false,
  onHandleCancel = () => undefined,
  onHandleSubmit = () => undefined
}: UserFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [companies, setCompanies] = useState<ICompany[]>([])
  const [employees, setEmployees] = useState<IEmployee[]>([])

  const roles = [
    { label: 'Admin Global', value: 'global.admin' },
    { label: 'Cliente', value: 'client' }
  ]

  const { register, handleSubmit, setValue, watch, formState } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const formRole: string = watch('role')
  const formCompanyCnpj: string = watch('companyCnpj')
  const isCompanySelectShow = !formRole || formRole === UserRole.Client
  const isEmployeeSelectShow =
    formCompanyCnpj && formRole === UserRole.Client && employees.length > 0 && create

  useEffect(() => {
    async function loadInputCompanies() {
      const { data } = await api.get('/company')
      setCompanies(data)
    }

    // eslint-disable-next-line no-console
    loadInputCompanies().catch((err) => console.error(err))
  }, [user])

  const handleCreateUpdate: SubmitHandler<UserCreateUpdateDTO> = async (formValues) => {
    await onHandleSubmit({
      name: formValues.name,
      email: formValues.email,
      role: formValues.role,
      companyCnpj: formValues.companyCnpj === '' ? null : formValues.companyCnpj
    })
  }

  const onClickSelectCompany = async (event: FormEvent<HTMLSelectElement>) => {
    const companyCnpj = event.currentTarget.value
    if (companyCnpj) {
      const { data } = await api.get(`/employee/company/${companyCnpj}`)
      setEmployees(data)
    }
  }

  const onClickSelectEmployee = (event: FormEvent<HTMLSelectElement>) => {
    const employee = event.currentTarget.value
    if (employee) {
      const { name, email } = JSON.parse(employee)
      setValue('name', name)
      setValue('email', email)
    }
  }

  const onClickSelectRole = (event: FormEvent<HTMLSelectElement>) => {
    const role = event.currentTarget.value
    if (role === UserRole.GlobalAdmin) {
      setValue('name', '')
      setValue('email', '')
    }
  }

  if (!read && !create && !update) {
    router.push('/user')
    return null
  }

  if ((read || update) && !values) {
    router.push('/user')
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
            name="role"
            label="Cargo"
            isDisabled={read}
            onClick={onClickSelectRole}
            options={roles.map((role) => ({
              label: role.label,
              value: role.value,
              selected: role.value === values.role
            }))}
            error={formState.errors.role}
            {...register('role', { value: values.role })}
          />

          {isCompanySelectShow && (
            <Select
              name="companyCnpj"
              label="Empresa"
              isDisabled={read}
              onClick={onClickSelectCompany}
              options={companies.map((company) => ({
                label: company.name,
                value: company.cnpj,
                selected: company.cnpj === values.companyCnpj
              }))}
              error={formState.errors.companyCnpj}
              {...register('companyCnpj', { value: values.companyCnpj })}
            />
          )}

          {isEmployeeSelectShow && (
            <Select
              name="employee"
              label="Funcionário"
              onClick={onClickSelectEmployee}
              options={employees.map((employee) => ({
                label: employee.name,
                value: JSON.stringify({
                  name: employee.name,
                  email: employee.email
                })
              }))}
              {...register('employee')}
            />
          )}
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
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

// mesmo schema para Create e Update
const validationSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  companyCnpj: yup
    .string()
    .required('Empresa obrigatória')
    .when('role', {
      is: UserRole.GlobalAdmin,
      then: (schema) => schema.notRequired()
    }),
  role: yup.string().required('Cargo obrigatório')
})
