import { useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { AbsenceCreateUpdateDTO, AbsenceStatus } from '@interfaces/absence'

import { api } from '@services/api'

import { AbsenceForm } from '@components/AbsenceForm'
import { Layout } from '@components/Layout'

import { withSSRAuth } from '@utils/withSSRAuth'

export default function CreateAbsence() {
  const router = useRouter()
  const toast = useToast()

  const handleCreateAbsence = async (values: AbsenceCreateUpdateDTO) => {
    api
      .post('/absence', values)
      .then(() => {
        toast({
          title: 'Ausência criada!',
          description: values.type,
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
        <title>PointControl - Cadastro de Empresa</title>
      </Head>

      <Layout>
        <AbsenceForm
          create
          values={emptyForm}
          heading="Cadastro de Ausência"
          onHandleSubmit={handleCreateAbsence}
          onHandleCancel={() => router.push('/absence')}
        />
      </Layout>
    </>
  )
}

const emptyForm: AbsenceCreateUpdateDTO = {
  status: AbsenceStatus.AguardandoAnalise,
  type: '',
  employeeCpf: null,
  description: '',
  startTime: null,
  endTime: null,
  justification: ''
}

export const getServerSideProps = withSSRAuth(async () => ({
  props: {}
}))
