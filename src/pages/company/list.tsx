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
import { RiAddLine, RiPencilLine } from 'react-icons/ri'

import { ICompany } from '@interfaces/company'

import { api } from '@services/api'

import { useAuth } from '@contexts/AuthContext'

import { Layout } from '@components/Layout'
import { Pagination } from '@components/Pagination'

import { withSSRAuth } from '@utils/withSSRAuth'

interface CompaniesListState {
  isLoading: boolean
  error?: boolean
  companies?: ICompany[]
}

export default function CompaniesList() {
  const { user } = useAuth()
  const toast = useToast()
  const [state, setState] = useState<CompaniesListState>({ isLoading: false })

  useEffect(() => {
    async function getCompanies() {
      try {
        setState({ isLoading: true })
        const { data: companies } = await api.get('/company')
        setState({ isLoading: false, companies })
      } catch {
        setState({ isLoading: false, error: true })
      }
    }

    getCompanies().catch((err) => {
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
        <title>PointControl | Lista de Empresas</title>
      </Head>

      <Layout>
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Empresas
            </Heading>

            <NextLink href="/company/create" passHref>
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

          <CompaniesListContent state={state} />
        </Box>
      </Layout>
    </>
  )
}

interface CompaniesListContentProps {
  state: CompaniesListState
}

function CompaniesListContent({ state }: CompaniesListContentProps) {
  const [page, setPage] = useState(1)
  const { isLoading, error, companies } = state

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

  if (error || !companies) {
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
            <Th>CNPJ</Th>
            {isWideVersion && <Th>Razão Social</Th>}
            <Th w="8" />
          </Tr>
        </Thead>

        <Tbody>
          {companies.map((company) => (
            <Tr key={company.cnpj}>
              <Td>
                <Text fontWeight="bold">{company.cnpj}</Text>
              </Td>
              {isWideVersion && <Td>{company.name}</Td>}
              <Td>
                <NextLink href={`/company/edit/${company.cnpj}`} passHref>
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
        totalCountOfRegisters={companies.length}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  )
}

export const getServerSideProps = withSSRAuth(async () => ({
  props: {}
}))
