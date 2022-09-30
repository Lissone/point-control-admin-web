import { useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { IUser, UserCreateUpdateDTO } from '@interfaces/user'

import { api, setupAPIClient } from '@services/api'

import { Layout } from '@components/Layout'
import { UserForm } from '@components/UserForm'

import { withSSRAuth } from '@utils/withSSRAuth'

interface EditUserProps {
  user: IUser
}

export default function EditUser({ user }: EditUserProps) {
  const router = useRouter()
  const toast = useToast()

  const handleUpdateUser = async (values: UserCreateUpdateDTO) => {
    api
      .put(`/user/${user.email}`, values)
      .then(() => {
        toast({
          title: 'Usuário atualizado!',
          description: values.name,
          status: 'success',
          duration: 3000,
          isClosable: true
        })

        router.push('/user')
      })
      .catch((err) => {
        toast({
          title: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      })
  }

  return (
    <>
      <Head>
        <title>PointControl | Edição de Usuário</title>
      </Head>

      <Layout>
        <UserForm
          update
          values={user}
          heading="Edição de Usuário"
          onHandleSubmit={handleUpdateUser}
          onHandleCancel={() => router.push('/user')}
        />
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const { email } = ctx.params
  const { data: user } = await apiClient.get<IUser>(`/user/${email}`)

  return {
    props: {
      user
    }
  }
})
