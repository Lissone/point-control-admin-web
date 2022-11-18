import { Flex, Button, Stack, Heading } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAuth } from '@contexts/AuthContext'

import { Input } from '@components/shared/Form'

import { withSSRAuth } from '@utils/withSSRAuth'

interface FormValues {
  newPassword: string
  newPasswordConfirmation: string
}

export default function ChangePassword() {
  const { changePassword } = useAuth()

  const { register, setError, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const handleChangePassword: SubmitHandler<FormValues> = async (values) => {
    try {
      await changePassword(values.newPassword)
    } catch (err: any) {
      setError('newPassword', {})
      setError('newPasswordConfirmation', { type: 'custom', message: err.message })
    }
  }

  return (
    <>
      <Head>
        <title>PointControl - Login</title>
      </Head>

      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Flex
          as="form"
          w="100%"
          maxW={360}
          bg="gray.800"
          p={8}
          borderRadius={8}
          flexDirection="column"
          onSubmit={handleSubmit(handleChangePassword)}
        >
          <Stack spacing={4}>
            <Heading size="lg" fontWeight="normal">
              Alterar senha
            </Heading>

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
          </Stack>

          <Button
            type="submit"
            mt={6}
            size="lg"
            colorScheme="blue"
            isLoading={formState.isSubmitting}
          >
            Trocar senha
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

const validationSchema = yup.object().shape({
  newPassword: yup.string().required('Senha obrigatória').min(6, 'Mínimo 6 caracteres'),
  newPasswordConfirmation: yup
    .string()
    .oneOf([null, yup.ref('newPassword')], 'As senhas precisam ser iguais')
})

export const getServerSideProps = withSSRAuth(async () => ({
  props: {}
}))
