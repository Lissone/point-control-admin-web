import Head from 'next/head'
import { useRouter } from 'next/router'

import { IEmployee } from '@interfaces/employee'

import { setupAPIClient } from '@services/api'

import { EmployeeForm } from '@components/EmployeeForm'
import { Layout } from '@components/Layout'

import { withSSRAuth } from '@utils/withSSRAuth'

interface EmployeeProps {
  employee: IEmployee
}

export default function Employee({ employee }: EmployeeProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>PointControl | {employee.name}</title>
      </Head>

      <Layout>
        <EmployeeForm
          read
          heading={employee.name}
          values={employee}
          onHandleCancel={() => router.push('/employee')}
        />
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const { cpf } = ctx.params
  const { data: employee } = await apiClient.get<IEmployee>(`/employee/${cpf}`)

  return {
    props: {
      employee
    }
  }
})
