import { Flex, Button, Stack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { SignInData, useAuth } from '@contexts/AuthContext'

import { Input } from '@components/shared/Form'

import { withSSRGuest } from '@utils/withSSRGuest'

const formSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
  password: yup.string().required('Senha obrigatória')
})

export default function Home() {
  const { signIn } = useAuth()
  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(formSchema)
  })

  const handleSignIn: SubmitHandler<SignInData> = async (values) => {
    try {
      await signIn(values)
    } catch (err: any) {
      setError('email', {})
      setError('password', { type: 'custom', message: err.message as string })
    }
  }

  return (
    <>
      <Head>
        <title>PointControl | Login</title>
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
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing={4}>
            <Input
              name="email"
              type="text"
              label="E-mail"
              error={formState.errors.email}
              {...register('email')}
            />
            <Input
              name="password"
              type="password"
              label="Senha"
              error={formState.errors.password}
              {...register('password')}
            />
          </Stack>

          <Button
            type="submit"
            mt={6}
            size="lg"
            colorScheme="green"
            isLoading={formState.isSubmitting}
          >
            Entrar
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps = withSSRGuest(async () => ({
  props: {}
}))
