import { Flex, Button, Stack, Link as ChakraLink } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { SignInData, useAuth } from '@contexts/AuthContext'

import { Input } from '@components/shared/Form'

import { withSSRGuest } from '@utils/withSSRGuest'

export default function SignIn() {
  const { signIn } = useAuth()

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const handleSignIn: SubmitHandler<SignInData> = async (values) => {
    signIn(values).catch((err: any) => {
      setError('email', {})
      setError('password', { type: 'custom', message: err.message as string })
    })
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
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing={4}>
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

            <Link href="/identity/confirmation">
              <ChakraLink textAlign="center" color="whiteAlpha.800">
                Esqueceu sua senha?
              </ChakraLink>
            </Link>
          </Stack>
        </Flex>
      </Flex>
    </>
  )
}

const validationSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
  password: yup.string().required('Senha obrigatória')
})

export const getServerSideProps = withSSRGuest(async () => ({
  props: {}
}))
