import {
  Flex,
  Heading,
  Stack,
  Button,
  Link as ChakraLink,
  Text,
  HStack,
  useToast
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { ResetPasswordInfo, useAuth } from '@contexts/AuthContext'

import { Input } from '@components/shared/Form'

import { withSSRGuest } from '@utils/withSSRGuest'

export default function IdentityConfirmation() {
  const { resetPassword } = useAuth()
  const toast = useToast()

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const handleConfirmIdentity: SubmitHandler<ResetPasswordInfo> = async (values) => {
    resetPassword(values)
      .then(() => {
        toast({
          title: 'Código de confirmação enviado para seu e-mail!',
          description: values.email,
          status: 'success',
          duration: 3000,
          isClosable: true
        })
      })
      .catch((err: any) => {
        setError('name', {})
        setError('email', { type: 'custom', message: err.message as string })
      })
  }

  return (
    <>
      <Head>
        <title>PointControl - Confirmação de identidade</title>
      </Head>

      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Flex
          as="form"
          w="100%"
          maxW={450}
          bg="gray.800"
          p={8}
          borderRadius={8}
          flexDirection="column"
          onSubmit={handleSubmit(handleConfirmIdentity)}
        >
          <Stack spacing={4}>
            <Heading size="lg" fontWeight="normal">
              Confirme sua identidade
            </Heading>

            <Input
              name="name"
              label="Nome"
              error={formState.errors.name}
              {...register('name')}
            />
            <Input
              name="email"
              label="E-mail"
              error={formState.errors.email}
              {...register('email')}
            />

            <Button
              type="submit"
              mt={6}
              size="lg"
              colorScheme="green"
              isLoading={formState.isSubmitting}
            >
              Confirmar
            </Button>

            <HStack align="center" justify="center">
              <Text color="whiteAlpha.800">Lembrou sua senha?</Text>
              <Link href="/">
                <ChakraLink align="center" textAlign="center" color="blue.600">
                  Faça seu login
                </ChakraLink>
              </Link>
            </HStack>
          </Stack>
        </Flex>
      </Flex>
    </>
  )
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('Digite um e-mail válido')
})

export const getServerSideProps = withSSRGuest(async () => ({
  props: {}
}))
