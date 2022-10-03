import Head from 'next/head'
import { useRouter } from 'next/router'

import { IAbsence } from '@interfaces/absence'

import { setupAPIClient } from '@services/api'

import { AbsenceForm } from '@components/AbsenceForm'
import { Layout } from '@components/Layout'
import { RecordNotFound } from '@components/shared/RecordNotFound'

import { withSSRAuth } from '@utils/withSSRAuth'

interface AbsenceProps {
  absence: IAbsence | null
}

export default function Absence({ absence }: AbsenceProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>PointControl - Ausência</title>
      </Head>

      <Layout>
        {!absence ? (
          <RecordNotFound
            title="Ausência"
            message="Ausência de funcionário não encontrada"
          />
        ) : (
          <AbsenceForm
            read
            heading="Ausência"
            values={absence}
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
