import { UserRole } from '@interfaces/user'

import { Layout } from '@components/Layout'

import { withSSRAuth } from '@utils/withSSRAuth'

export default function User() {
  return <Layout>{null}</Layout>
}

export const getServerSideProps = withSSRAuth(
  async () => ({
    redirect: {
      destination: '/user/list',
      permanent: false
    }
  }),
  { roles: [UserRole.GlobalAdmin] }
)
