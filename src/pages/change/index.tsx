import { Layout } from '@components/Layout'

import { withSSRAuth } from '@utils/withSSRAuth'

export default function Change() {
  return <Layout>{null}</Layout>
}

export const getServerSideProps = withSSRAuth(async () => ({
  redirect: {
    destination: '/change/password',
    permanent: false
  }
}))
