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

import { IUser, UserRoleLabel } from '@interfaces/user'

import { api } from '@services/api'

import { useAuth } from '@contexts/AuthContext'

import { Layout } from '@components/Layout'
import { Pagination } from '@components/Pagination'

import { withSSRAuth } from '@utils/withSSRAuth'

interface UsersListState {
  isLoading: boolean
  error?: boolean
  users?: IUser[]
}

export default function UsersList() {
  const { user } = useAuth()
  const toast = useToast()
  const [state, setState] = useState<UsersListState>({ isLoading: false })

  useEffect(() => {
    async function getUsers() {
      try {
        setState({ isLoading: true })
        const { data: users } = await api.get('/user')
        setState({ isLoading: false, users })
      } catch {
        setState({ isLoading: false, error: true })
      }
    }

    getUsers().catch((err) => {
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
        <title>PointControl | Lista de Usuários</title>
      </Head>

      <Layout>
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
            </Heading>

            <NextLink href="/user/create" passHref>
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

          <UsersListContent state={state} />
        </Box>
      </Layout>
    </>
  )
}

interface UsersListContentProps {
  state: UsersListState
}

function UsersListContent({ state }: UsersListContentProps) {
  const [page, setPage] = useState(1)
  const { isLoading, error, users } = state

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

  if (error || !users) {
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
            <Th>Usuário</Th>
            {isWideVersion && <Th>Cargo</Th>}
            {isWideVersion && <Th>Empresa</Th>}
            <Th w="8" />
          </Tr>
        </Thead>

        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>
                <NextLink href={`/user/${user.email}`} passHref>
                  <Icon
                    as={RiSearchLine}
                    aria-label="Visualizar"
                    fontSize="20"
                    _hover={{ color: 'blue.700', cursor: 'pointer' }}
                  />
                </NextLink>
              </Td>
              <Td px={['4', '4', '6']}>
                <Box>
                  <Text fontWeight="bold">{user.name}</Text>
                  <Text fontSize="sm" color="gray.300">
                    {user.email}
                  </Text>
                </Box>
              </Td>
              {isWideVersion && <Td>{UserRoleLabel[user.role]}</Td>}
              {isWideVersion && <Td>{user.company ? user.company.name : '-'}</Td>}
              <Td>
                <NextLink href={`/user/edit/${user.email}`} passHref>
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
        totalCountOfRegisters={users.length}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  )
}

export const getServerSideProps = withSSRAuth(async () => ({
  props: {}
}))
