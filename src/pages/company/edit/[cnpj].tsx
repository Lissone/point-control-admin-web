import { useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { CompanyCreateUpdateDTO, ICompany } from '@interfaces/company'
import { UserRole } from '@interfaces/user'

import { api, setupAPIClient } from '@services/api'

import { CompanyForm } from '@components/CompanyForm'
import { Layout } from '@components/Layout'
import { RecordNotFound } from '@components/shared/RecordNotFound'

import { withSSRAuth } from '@utils/withSSRAuth'

interface EditCompanyProps {
  company: ICompany | null
}

export default function EditCompany({ company }: EditCompanyProps) {
  const router = useRouter()
  const toast = useToast()

  const handleUpdateCompany = async (values: CompanyCreateUpdateDTO) => {
    api
      .put(`/company/${company.cnpj}`, values)
      .then(() => {
        toast({
          title: 'Empresa atualizada!',
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
        <title>PointControl - Edição de Empresa</title>
      </Head>

      <Layout>
        {!company ? (
          <RecordNotFound title="Edição de Empresa" message="Empresa não encontrada" />
        ) : (
          <CompanyForm
            update
            values={company}
            heading="Edição de Empresa"
            onHandleSubmit={handleUpdateCompany}
            onHandleCancel={() => router.push('/company')}
          />
        )}
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx)
    const { cnpj } = ctx.params

    try {
      const { data: company } = await apiClient.get<ICompany>(`/company/${cnpj}`)
      return {
        props: {
          company
        }
      }
    } catch {
      return {
        props: {
          company: null
        }
      }
    }
  },
  { roles: [UserRole.GlobalAdmin] }
)
