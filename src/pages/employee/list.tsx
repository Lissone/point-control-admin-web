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
  useToast
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { RiAddLine, RiSearchLine, RiPencilLine } from 'react-icons/ri'

import { IEmployee } from '@interfaces/employee'

import { api } from '@services/api'

import { useAuth } from '@contexts/AuthContext'

import { Layout } from '@components/Layout'
import { Pagination } from '@components/Pagination'

import { withSSRAuth } from '@utils/withSSRAuth'

interface EmployeeListState {
  isLoading: boolean
  error?: boolean
  employees?: IEmployee[]
}

export default function EmployeeList() {
  const { user } = useAuth()
  const toast = useToast()
  const [state, setState] = useState<EmployeeListState>({ isLoading: false })

  useEffect(() => {
    async function getEmployees() {
      try {
        setState({ isLoading: true })

        const companyCnpj = user?.company?.cnpj
        const { data: employees } = await (companyCnpj
          ? api.get(`/employee/company/${companyCnpj}`)
          : api.get('/employee'))

        setState({ isLoading: false, employees })
      } catch {
        setState({ isLoading: false, error: true })
      }
    }

    getEmployees().catch((err) => {
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
        <title>PointControl | Lista de Funcionários</title>
      </Head>

      <Layout>
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Funcionários ({user?.company ? user?.company.name : 'Todas empresas'})
            </Heading>

            <NextLink href="/employee/create" passHref>
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

          <EmployeeListContent state={state} />
        </Box>
      </Layout>
    </>
  )
}

interface EmployeeListContentProps {
  state: EmployeeListState
}

function EmployeeListContent({ state }: EmployeeListContentProps) {
  const [page, setPage] = useState(1)
  const { isLoading, error, employees } = state

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

  if (error || !employees) {
    return (
      <Flex justify="center">
        <Text>Falha ao obter dados dos usuários</Text>
      </Flex>
    )
  }

  return (
    <>
      <Table colorScheme="whiteAlpha">
        <Thead>
          <Tr>
            <Th w="4" />
            {isWideVersion && <Th>CPF</Th>}
            <Th>Usuário</Th>
            {isWideVersion && <Th>Cargo</Th>}
            {isWideVersion && <Th>Entrada</Th>}
            {isWideVersion && <Th>Saída</Th>}
            <Th w="8" />
          </Tr>
        </Thead>

        <Tbody>
          {employees.map((employee) => (
            <Tr key={employee.cpf}>
              <Td>
                <NextLink href={`/employee/${employee.cpf}`} passHref>
                  <Icon
                    as={RiSearchLine}
                    aria-label="Visualizar"
                    fontSize="20"
                    _hover={{ color: 'blue.700', cursor: 'pointer' }}
                  />
                </NextLink>
              </Td>
              {isWideVersion && (
                <Td>
                  <Text fontWeight="bold">{employee.cpf}</Text>
                </Td>
              )}
              <Td px={['4', '4', '6']}>
                <Box>
                  <Text fontWeight="bold">{employee.name}</Text>
                  <Text fontSize="sm" color="gray.300">
                    {employee.email}
                  </Text>
                </Box>
              </Td>
              {isWideVersion && <Td>{employee.role}</Td>}
              {isWideVersion && <Td>{employee.entry}</Td>}
              {isWideVersion && <Td>{employee.exit}</Td>}
              <Td>
                <NextLink href={`/employee/edit/${employee.cpf}`} passHref>
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
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination
        totalCountOfRegisters={employees.length}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  )
}

export const getServerSideProps = withSSRAuth(async () => ({
  props: {}
}))
