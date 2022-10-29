import { useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { CompanyCreateUpdateDTO } from '@interfaces/company'
import { UserRole } from '@interfaces/user'

import { api } from '@services/api'

import { CompanyForm } from '@components/CompanyForm'
import { Layout } from '@components/Layout'

import { withSSRAuth } from '@utils/withSSRAuth'

export default function CreateCompany() {
  const router = useRouter()
  const toast = useToast()

  const handleCreateCompany = async (values: CompanyCreateUpdateDTO) => {
    api
      .post('/company', values)
      .then(() => {
        toast({
          title: 'Empresa criada!',
          description: values.name,
          status: 'success',
          duration: 3000,
          isClosable: true
        })

        router.push('/company')
      })
      .catch((err) => {
        toast({
          title: err.response.data.error,
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      })
  }

  return (
    <>
      <Head>
        <title>PointControl - Cadastro de Empresa</title>
      </Head>

      <Layout>
        <CompanyForm
          create
          values={emptyForm}
          heading="Cadastro de Empresa"
          onHandleSubmit={handleCreateCompany}
          onHandleCancel={() => router.push('/company')}
        />
      </Layout>
    </>
  )
}

const emptyForm: CompanyCreateUpdateDTO = {
  cnpj: '',
  name: ''
}

export const getServerSideProps = withSSRAuth(
  async () => ({
    props: {}
  }),
  { roles: [UserRole.GlobalAdmin] }
)
