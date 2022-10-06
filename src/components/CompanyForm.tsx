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
import { SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import * as yup from 'yup'

import { CompanyCreateUpdateDTO, ICompany } from '@interfaces/company'

import { Input } from '@components/shared/Form'

type FormValuesType = Partial<CompanyCreateUpdateDTO> & Partial<ICompany>

interface CompanyFormProps {
  heading: string
  create?: boolean
  update?: boolean
  values?: FormValuesType
  onHandleCancel?: () => void
  onHandleSubmit?: (values: CompanyCreateUpdateDTO) => Promise<void>
}

export function CompanyForm({
  heading,
  values,
  create = false,
  update = false,
  onHandleCancel = () => undefined,
  onHandleSubmit = () => undefined
}: CompanyFormProps) {
  const router = useRouter()

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const handleCreateUpdate: SubmitHandler<CompanyCreateUpdateDTO> = async (
    formValues
  ) => {
    let cnpj: string
    if (update) {
      cnpj = values.cnpj
    } else {
      cnpj = formValues.cnpj.replace(/\D/g, '')
      const cnpjError = validateCnpj(cnpj)
      if (cnpjError) {
        setError('cnpj', { type: 'custom', message: cnpjError })
        return
      }
    }

    await onHandleSubmit({ ...formValues, cnpj })
  }

  if (!create && !update) {
    router.push('/company')
    return null
  }

  if (update && !values) {
    router.push('/company')
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
            mask="99.999.999/9999-99"
            maskChar={null}
            name="cnpj"
            label="CNPJ"
            defaultValue={values.cnpj}
            error={formState.errors.cnpj}
            {...register('cnpj', { disabled: update })}
          />
          <Input
            name="name"
            label="Razão Social"
            defaultValue={values.name}
            error={formState.errors.name}
            {...register('name')}
          />
        </SimpleGrid>
      </VStack>

      <Flex mt="8" justify="flex-end">
        <HStack spacing="4">
          <Button type="button" onClick={onHandleCancel} colorScheme="whiteAlpha">
            Cancelar
          </Button>
          <Button
            type="submit"
            colorScheme="green"
            isLoading={formState.isSubmitting}
            isDisabled={!formState.isDirty}
          >
            {create ? 'Salvar' : 'Atualizar'}
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}

const validateCnpj = (cnpj: string) => {
  if (cnpj.length < 14) return 'Mínimo 14 dígitos'
  else if (cnpj.length > 14) return 'Máximo 14 dígitos'
}

const validationSchema = yup.object().shape({
  cnpj: yup.string(),
  name: yup.string().required('Razão Social obrigatória')
})
