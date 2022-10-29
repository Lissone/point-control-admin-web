import { useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { UserCreateUpdateDTO, UserRole } from '@interfaces/user'

import { api } from '@services/api'

import { Layout } from '@components/Layout'
import { UserForm } from '@components/UserForm'

import { withSSRAuth } from '@utils/withSSRAuth'

export default function CreateUser() {
  const router = useRouter()
  const toast = useToast()

  const handleCreateUser = async (values: UserCreateUpdateDTO) => {
    api
      .post('/user', values)
      .then(() => {
        toast({
          title: 'Usuário criado!',
          description: values.name,
          status: 'success',
          duration: 3000,
          isClosable: true
        })

        router.push('/user')
      })
      .catch((err) => {
        toast({
          title: err.response.data.error,
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      })
  }

  return (
    <>
      <Head>
        <title>PointControl - Cadastro de Usuário</title>
      </Head>

      <Layout>
        <UserForm
          create
          values={emptyForm}
          heading="Cadastro de Usuário"
          onHandleSubmit={handleCreateUser}
          onHandleCancel={() => router.push('/user')}
        />
      </Layout>
    </>
  )
}

const emptyForm: UserCreateUpdateDTO = {
  name: '',
  email: '',
  role: null,
  companyCnpj: null
}

export const getServerSideProps = withSSRAuth(
  async () => ({
    props: {}
  }),
  { roles: [UserRole.GlobalAdmin] }
)
