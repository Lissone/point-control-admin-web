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
import { useEffect, useMemo, useState } from 'react'
import { RiAddLine, RiSearchLine, RiPencilLine } from 'react-icons/ri'

import { IEmployee } from '@interfaces/employee'
import { IUser } from '@interfaces/user'

import { api } from '@services/api'

import { useAuth } from '@contexts/AuthContext'

import { Layout } from '@components/Layout'
import { Pagination, registersPerPage } from '@components/Pagination'

import { withSSRAuth } from '@utils/withSSRAuth'

interface EmployeesListState {
  isLoading: boolean
  error?: boolean
  employees?: IEmployee[]
}

export default function EmployeesList() {
  const { user } = useAuth()
  const toast = useToast()
  const [state, setState] = useState<EmployeesListState>({ isLoading: false })

  useEffect(() => {
    async function getEmployees() {
      try {
        setState({ isLoading: true })
        const { data: employees } = await api.get('/employee')
        setState({ isLoading: false, employees })
      } catch (err: any) {
        setState({ isLoading: false, error: true })

        toast({
          title: err.response.data.error,
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      }
    }

    getEmployees()
  }, [toast])

  return (
    <>
      <Head>
        <title>PointControl - Lista de Funcionários</title>
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

          <EmployeesListContent state={state} user={user} />
        </Box>
      </Layout>
    </>
  )
}

interface EmployeesListContentProps {
  state: EmployeesListState
  user?: IUser
}

function EmployeesListContent({ state, user }: EmployeesListContentProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const { isLoading, error, employees } = state

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * registersPerPage
    const lastPageIndex = firstPageIndex + registersPerPage
    return employees ? employees.slice(firstPageIndex, lastPageIndex) : []
  }, [currentPage, employees])

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
        <Text color="red.500">Falha ao obter dados</Text>
      </Flex>
    )
  }

  if (employees.length === 0) {
    return (
      <Flex justify="center">
        <Text color="red.500">Nenhum funcionário cadastrado</Text>
      </Flex>
    )
  }

  const userHasCompany = !!user?.companyCnpj

  return (
    <>
      <Table colorScheme="whiteAlpha">
        <Thead>
          <Tr>
            <Th w="4" />
            {isWideVersion && <Th>CPF</Th>}
            <Th>Usuário</Th>
            {isWideVersion && !userHasCompany && <Th>Empresa</Th>}
            {isWideVersion && <Th>Cargo</Th>}
            {isWideVersion && userHasCompany && <Th>Entrada</Th>}
            {isWideVersion && userHasCompany && <Th>Saída</Th>}
            <Th w="8" />
          </Tr>
        </Thead>

        <Tbody>
          {currentData.map((employee) => (
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
              {isWideVersion && !userHasCompany && <Td>{employee.company.name}</Td>}
              {isWideVersion && <Td>{employee.role}</Td>}
              {isWideVersion && userHasCompany && <Td>{employee.entry}</Td>}
              {isWideVersion && userHasCompany && <Td>{employee.exit}</Td>}
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
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  )
}

export const getServerSideProps = withSSRAuth(async () => ({
  props: {}
}))
