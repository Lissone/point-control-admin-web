import { Layout } from '@components/Layout'

import { withSSRAuth } from '@utils/withSSRAuth'

export default function Employee() {
  return <Layout>{null}</Layout>
}

export const getServerSideProps = withSSRAuth(async () => ({
  redirect: {
    destination: '/employee/list',
    permanent: false
  }
}))
