import {
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Link as ChakraLink,
  Spinner,
  VStack,
  Icon
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { SubmitHandler, useForm, FormState, Control } from 'react-hook-form'
import { FiAlertTriangle } from 'react-icons/fi'
import * as yup from 'yup'

import { api } from '@services/api'

import { useAuth } from '@contexts/AuthContext'

import { PinInput } from '@components/shared/Form/PinInput'

import { withSSRGuest } from '@utils/withSSRGuest'

interface TokenState {
  isLoading: boolean
  error?: boolean
  token?: string
}

interface FormValues {
  code: string
}

export default function ValidateToken() {
  const router = useRouter()
  const { validateIdentity } = useAuth()

  const [tokenState, setTokenState] = useState<TokenState>({ isLoading: true })
  const token = router.query.token as string

  const { control, formState, handleSubmit, setError } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    async function getValidatedToken() {
      try {
        await api.get(`/user/validate/token/${token}`)
        setTokenState({ isLoading: false, token })
      } catch {
        setTokenState({ isLoading: false, error: true })
      }
    }

    getValidatedToken()
  }, [token])

  const handleValidateIdentity: SubmitHandler<{ code: string }> = async ({ code }) => {
    try {
      await validateIdentity({ token, code })
    } catch (err: any) {
      setError('code', { type: 'custom', message: err.message })
    }
  }

  return (
    <>
      <Head>
        <title>PointControl - Confirmação do código</title>
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
          onSubmit={handleSubmit(handleValidateIdentity)}
        >
          <Stack spacing={6}>
            <ValidateTokenContent
              state={tokenState}
              formState={formState}
              codeControl={control}
            />

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

interface ValidateTokenContentProps {
  state: TokenState
  formState: FormState<FormValues>
  codeControl: Control<FormValues, object>
}

function ValidateTokenContent({
  state,
  formState,
  codeControl
}: ValidateTokenContentProps) {
  const { isLoading, error, token } = state

  if (isLoading) {
    return (
      <Flex justify="center" align="center">
        <Spinner />
      </Flex>
    )
  }

  if (error || !token) {
    return (
      <VStack justify="center" spacing={4}>
        <Icon as={FiAlertTriangle} fontSize={48} color="red.500" />
        <Text color="red.500">Código inexistente!</Text>
      </VStack>
    )
  }

  return (
    <Stack spacing={6}>
      <Heading size="lg" fontWeight="normal" textAlign="center">
        Confirme seu código
      </Heading>

      <PinInput
        name="code"
        pinLength={6}
        control={codeControl}
        error={formState.errors.code}
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
    </Stack>
  )
}

const validationSchema = yup.object().shape({
  code: yup.string().required('Código obrigatório').min(6, 'Mínimo 6 dígitos')
})

export const getServerSideProps = withSSRGuest(async () => ({
  props: {}
}))
