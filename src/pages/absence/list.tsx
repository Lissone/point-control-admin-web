import {
  Box,
  Flex,
  Heading,
  Button,
  Icon,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  useBreakpointValue,
  Spinner,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@chakra-ui/react'
import { format } from 'date-fns'
import Head from 'next/head'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { AiOutlineFileSearch } from 'react-icons/ai'
import { RiAddLine, RiSearchLine, RiPencilLine } from 'react-icons/ri'

import { AbsenceStatus, AbsenceStatusLabel, IAbsence } from '@interfaces/absence'

import { api } from '@services/api'

import { useAuth } from '@contexts/AuthContext'

import { Layout } from '@components/Layout'
import { Pagination } from '@components/Pagination'

import { withSSRAuth } from '@utils/withSSRAuth'

interface AbsencesListState {
  isLoading: boolean
  error?: boolean
  allAbsences?: IAbsence[]
  absencesToReview?: IAbsence[]
}

export default function AbsencesList() {
  const { user } = useAuth()
  const toast = useToast()
  const [state, setState] = useState<AbsencesListState>({ isLoading: false })

  useEffect(() => {
    async function getAbsences() {
      try {
        setState((prevState) => ({ ...prevState, isLoading: true }))
        const [{ data: allAbsences }, { data: absencesToReview }] = await Promise.all([
          api.get('/absence'),
          api.get(`/absence/status/${AbsenceStatus.AguardandoAnalise}`)
        ])
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          allAbsences,
          absencesToReview
        }))
      } catch {
        setState((prevState) => ({ ...prevState, isLoading: false, error: true }))
      }
    }

    getAbsences().catch((err) => {
      toast({
        title: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    })
  }, [toast, user])

  return (
    <>
      <Head>
        <title>PointControl - Ausências</title>
      </Head>

      <Layout>
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Ausências
            </Heading>

            <NextLink href="/absence/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="green"
                cursor="pointer"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar novo
              </Button>
            </NextLink>
          </Flex>

          <Tabs variant="line" borderColor="gray.700">
            <TabList>
              <Tab>Em Análise</Tab>
              <Tab>Todas</Tab>
            </TabList>
            <TabPanels mt={6}>
              <TabPanel>
                <AbsencesTableToReview state={state} />
              </TabPanel>
              <TabPanel>
                <AbsencesTable state={state} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Layout>
    </>
  )
}

interface AbsencesTableProps {
  state: AbsencesListState
}

function AbsencesTableToReview({ state }: AbsencesTableProps) {
  const [page, setPage] = useState(1)
  const { isLoading, error, absencesToReview } = state

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  if (isLoading) {
    return (
      <Flex justify="center">
        <Spinner />
      </Flex>
    )
  }

  if (error || !absencesToReview) {
    return (
      <Flex justify="center">
        <Text color="red.500">Falha ao obter dados</Text>
      </Flex>
    )
  }

  if (absencesToReview.length === 0) {
    return (
      <Flex justify="center">
        <Text color="red.500">Nenhuma ausência pendente para análise</Text>
      </Flex>
    )
  }

  return (
    <>
      <Table colorScheme="whiteAlpha">
        <Thead>
          <Tr>
            <Th w="8" />
            <Th>Usuário</Th>
            <Th>Tipo</Th>
            {isWideVersion && <Th>Horário de inicio</Th>}
            {isWideVersion && <Th>Horário de saída</Th>}
          </Tr>
        </Thead>

        <Tbody>
          {absencesToReview.map((absence) => (
            <Tr key={absence.id}>
              <Td>
                <NextLink href={`/absence/review/${absence.id}`} passHref>
                  <Button
                    as="a"
                    size="sm"
                    fontSize="sm"
                    colorScheme="blue"
                    cursor="pointer"
                    leftIcon={<Icon as={AiOutlineFileSearch} fontSize="16" />}
                  >
                    Analisar
                  </Button>
                </NextLink>
              </Td>
              <Td px={['4', '4', '6']}>
                <Box>
                  <Text fontWeight="bold">{absence.employee.name}</Text>
                  <Text fontSize="sm" color="gray.300">
                    {absence.employee.email}
                  </Text>
                </Box>
              </Td>
              <Td>{absence.type}</Td>
              {isWideVersion && (
                <Td>{format(new Date(absence.startTime), 'dd/MM/yyyy HH:MM')}</Td>
              )}
              {isWideVersion && (
                <Td>{format(new Date(absence.endTime), 'dd/MM/yyyy HH:MM')}</Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination
        totalCountOfRegisters={absencesToReview.length}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  )
}

function AbsencesTable({ state }: AbsencesTableProps) {
  const [page, setPage] = useState(1)
  const { isLoading, error, allAbsences } = state

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  if (isLoading) {
    return (
      <Flex justify="center">
        <Spinner />
      </Flex>
    )
  }

  if (error || !allAbsences) {
    return (
      <Flex justify="center">
        <Text color="red.500">Falha ao obter dados</Text>
      </Flex>
    )
  }

  if (allAbsences.length === 0) {
    return (
      <Flex justify="center">
        <Text color="red.500">Nenhuma ausência encontrada</Text>
      </Flex>
    )
  }

  return (
    <>
      <Table colorScheme="whiteAlpha">
        <Thead>
          <Tr>
            <Th w="4" />
            <Th>Status</Th>
            <Th>Usuário</Th>
            {isWideVersion && <Th>Tipo</Th>}
            {isWideVersion && <Th>Horário de inicio</Th>}
            {isWideVersion && <Th>Horário de saída</Th>}
            {isWideVersion && <Th w="8" />}
          </Tr>
        </Thead>

        <Tbody>
          {allAbsences.map((absence) => (
            <Tr key={absence.id}>
              <Td>
                <NextLink href={`/absence/${absence.id}`} passHref>
                  <Icon
                    as={RiSearchLine}
                    aria-label="Visualizar"
                    fontSize="20"
                    _hover={{ color: 'blue.700', cursor: 'pointer' }}
                  />
                </NextLink>
              </Td>
              <Td>
                <StatusLabel status={absence.status} />
              </Td>
              <Td px={['4', '4', '6']}>
                <Box>
                  <Text fontWeight="bold">{absence.employee.name}</Text>
                  <Text fontSize="sm" color="gray.300">
                    {absence.employee.email}
                  </Text>
                </Box>
              </Td>
              {isWideVersion && <Td>{absence.type}</Td>}
              {isWideVersion && (
                <Td>{format(new Date(absence.startTime), 'dd/MM/yyyy HH:MM')}</Td>
              )}
              {isWideVersion && (
                <Td>{format(new Date(absence.endTime), 'dd/MM/yyyy HH:MM')}</Td>
              )}
              {isWideVersion && (
                <Td>
                  <NextLink href={`/absence/edit/${absence.id}`} passHref>
                    <Button
                      as="a"
                      size="sm"
                      fontSize="sm"
                      colorScheme="blue"
                      cursor="pointer"
                      leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                    >
                      Editar
                    </Button>
                  </NextLink>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination
        totalCountOfRegisters={allAbsences.length}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  )
}

interface StatusLabelProps {
  status: AbsenceStatus
}

function StatusLabel({ status }: StatusLabelProps) {
  if (status === AbsenceStatus.Aprovado) {
    return (
      <Text fontWeight="bold" color="green.500">
        {AbsenceStatusLabel[status]}
      </Text>
    )
  }

  if (status === AbsenceStatus.Negado) {
    return (
      <Text fontWeight="bold" color="red.500">
        {AbsenceStatusLabel[status]}
      </Text>
    )
  }

  return (
    <Text fontWeight="bold" color="gray.400">
      {AbsenceStatusLabel[status]}
    </Text>
  )
}

export const getServerSideProps = withSSRAuth(async () => ({
  props: {}
}))
