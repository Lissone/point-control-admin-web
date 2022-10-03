import { useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { AbsenceCreateUpdateDTO, IAbsence } from '@interfaces/absence'

import { api, setupAPIClient } from '@services/api'

import { AbsenceForm } from '@components/AbsenceForm'
import { Layout } from '@components/Layout'
import { RecordNotFound } from '@components/shared/RecordNotFound'

import { withSSRAuth } from '@utils/withSSRAuth'

interface ReviewAbsenceProps {
  absence: IAbsence | null
}

export default function ReviewAbsence({ absence }: ReviewAbsenceProps) {
  const router = useRouter()
  const toast = useToast()

  const handleUpdateAbsence = async (values: AbsenceCreateUpdateDTO) => {
    api
      .put(`/absence/${absence.id}`, values)
      .then(() => {
        toast({
          title: 'Ausência analisada!',
          description: absence.employee.name,
          status: 'success',
          duration: 3000,
          isClosable: true
        })

        router.push('/absence')
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
        <title>PointControl - Análise de Ausência</title>
      </Head>

      <Layout>
        {!absence ? (
          <RecordNotFound
            title="Análise de Ausência"
            message="Ausência de funcionário não encontrada"
          />
        ) : (
          <AbsenceForm
            review
            heading={`Análise de Ausência - ${absence.employee.name}`}
            values={{ ...absence, status: null }}
            onHandleSubmit={handleUpdateAbsence}
            onHandleCancel={() => router.push('/absence')}
          />
        )}
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const { id } = ctx.params

  try {
    const { data: absence } = await apiClient.get<IAbsence>(`/absence/${id}`)
    return {
      props: {
        absence
      }
    }
  } catch {
    return {
      props: {
        absence: null
      }
    }
  }
})
