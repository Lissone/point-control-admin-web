import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  useToast,
  VStack
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAuth } from '@contexts/AuthContext'

import { Layout } from '@components/Layout'
import { Input } from '@components/shared/Form'

interface FormValues {
  newPassword: string
  newPasswordConfirmation: string
}

export default function Config() {
  const { changePassword } = useAuth()
  const toast = useToast()

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const handleChangePassword: SubmitHandler<FormValues> = async (values) => {
    try {
      await changePassword(values.newPassword)
      toast({
        title: 'Senha alterada!',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch (err: any) {
      toast({
        title: err.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  return (
    <Layout>
      <Box flex="1" borderRadius={8} bg="gray.800" p="8">
        <Flex mb="8" align="center">
          <Heading size="lg" fontWeight="normal">
            Alterar senha
          </Heading>
        </Flex>

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          onSubmit={handleSubmit(handleChangePassword)}
        >
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                name="newPassword"
                label="Nova senha"
                type="password"
                error={formState.errors.newPassword}
                {...register('newPassword')}
              />
              <Input
                name="newPasswordConfirmation"
                label="Confirme sua senha"
                type="password"
                error={formState.errors.newPasswordConfirmation}
                {...register('newPasswordConfirmation')}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button
                type="submit"
                colorScheme="green"
                isLoading={formState.isSubmitting}
                isDisabled={!formState.isDirty}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Box>
    </Layout>
  )
}

const validationSchema = yup.object().shape({
  newPassword: yup.string().required('Senha obrigatória').min(6, 'Mínimo 6 caracteres'),
  newPasswordConfirmation: yup
    .string()
    .oneOf([null, yup.ref('newPassword')], 'As senhas precisam ser iguais')
})
