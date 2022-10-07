import { useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { EmployeeCreateUpdateDTO } from '@interfaces/employee'

import { api } from '@services/api'

import { EmployeeForm } from '@components/EmployeeForm'
import { Layout } from '@components/Layout'

import { withSSRAuth } from '@utils/withSSRAuth'

export default function CreateEmployee() {
  const router = useRouter()
  const toast = useToast()

  const handleCreateEmployee = async (values: EmployeeCreateUpdateDTO) => {
    api
      .post('/employee', values)
      .then(() => {
        toast({
          title: 'Funcionário criado!',
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
        <title>PointControl - Cadastro de Funcionário</title>
      </Head>

      <Layout>
        <EmployeeForm
          create
          values={emptyForm}
          heading="Cadastro de Funcionário"
          onHandleSubmit={handleCreateEmployee}
          onHandleCancel={() => router.push('/employee')}
        />
      </Layout>
    </>
  )
}

const emptyForm: EmployeeCreateUpdateDTO = {
  cpf: '',
  name: '',
  email: '',
  companyCnpj: '',
  role: '',
  dtBirth: null,
  entry: '',
  exit: '',
  workingTime: 0,
  address: {
    street: '',
    district: '',
    city: '',
    state: ''
  }
}

export const getServerSideProps = withSSRAuth(async () => ({
  props: {}
}))
