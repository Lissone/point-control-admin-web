import Head from 'next/head'
import { useRouter } from 'next/router'

import { IUser } from '@interfaces/user'

import { setupAPIClient } from '@services/api'

import { Layout } from '@components/Layout'
import { UserForm } from '@components/UserForm'

import { withSSRAuth } from '@utils/withSSRAuth'

interface UserProps {
  user: IUser
}

export default function User({ user }: UserProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>PointControl | {user.name}</title>
      </Head>

      <Layout>
        <UserForm
          read
          heading={user.name}
          values={user}
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