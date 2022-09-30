import { useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { EmployeeCreateUpdateDTO, IEmployee } from '@interfaces/employee'

import { api, setupAPIClient } from '@services/api'

import { EmployeeForm } from '@components/EmployeeForm'
import { Layout } from '@components/Layout'

import { withSSRAuth } from '@utils/withSSRAuth'

interface EditEmployeeProps {
  employee: IEmployee
}

export default function EditEmployee({ employee }: EditEmployeeProps) {
  const router = useRouter()
  const toast = useToast()

  const handleUpdateEmployee = async (values: EmployeeCreateUpdateDTO) => {
    api
      .put(`/employee/${employee.cpf}`, values)
      .then(() => {
        toast({
          title: 'Funcionário atualizado!',
          description: values.name,
          status: 'success',
          duration: 3000,
          isClosable: true
        })

        router.push('/employee')
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
        <title>PointControl | Edição de Funcionário</title>
      </Head>

      <Layout>
        <EmployeeForm
          update
          values={employee}
          heading="Edição de Funcionário"
          onHandleSubmit={handleUpdateEmployee}
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
