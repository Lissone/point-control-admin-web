import Head from 'next/head'
import { useRouter } from 'next/router'

import { IUser } from '@interfaces/user'

import { setupAPIClient } from '@services/api'

import { Layout } from '@components/Layout'
import { RecordNotFound } from '@components/shared/RecordNotFound'
import { UserForm } from '@components/UserForm'

import { withSSRAuth } from '@utils/withSSRAuth'

interface UserProps {
  user: IUser | null
}

export default function User({ user }: UserProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>PointControl - {user ? user.name : 'Usuário'}</title>
      </Head>

      <Layout>
        {!user ? (
          <RecordNotFound title="Usuário" message="Usuário não encontrado" />
        ) : (
          <UserForm
            read
            heading={user.name}
            values={user}
            onHandleCancel={() => router.push('/user')}
          />
        )}
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const { email } = ctx.params

  try {
    const { data: user } = await apiClient.get<IUser>(`/user/${email}`)
    return {
      props: {
        user
      }
    }
  } catch {
    return {
      props: {
        user: null
      }
    }
  }
})
