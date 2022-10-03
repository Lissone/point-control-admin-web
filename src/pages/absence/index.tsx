import { Layout } from '@components/Layout'

import { withSSRAuth } from '@utils/withSSRAuth'

export default function Absence() {
  return <Layout>{null}</Layout>
}

export const getServerSideProps = withSSRAuth(async () => ({
  redirect: {
    destination: '/absence/list',
    permanent: false
  }
}))
