import {
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useToast
} from '@chakra-ui/react'
import { format } from 'date-fns'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { RiSearchLine } from 'react-icons/ri'

import { IPoint } from '@interfaces/employee'

import { api } from '@services/api'

import { Pagination } from '@components/Pagination'

interface PointsListState {
  isLoading: boolean
  error?: boolean
  points?: IPoint[]
}

export function PointsOfDayTable() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [state, setState] = useState<PointsListState>({ isLoading: false })

  useEffect(() => {
    async function getCompanies() {
      try {
        setState({ isLoading: true })
        const today = format(new Date(), 'yyyy-MM-dd')
        const { data: points } = await api.get(`/point/${today}`)
        setState({ isLoading: false, points })
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
  }, [toast])

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  if (state.isLoading) {
    return (
      <Flex justify="center">
        <Spinner />
      </Flex>
    )
  }

  if (state.error || !state.points) {
    return (
      <Flex justify="center">
        <Text color="red.500">Falha ao obter dados</Text>
      </Flex>
    )
  }

  if (state.points.length === 0) {
    return (
      <Flex justify="center">
        <Text color="red.500">Nenhum ponto batido hoje</Text>
      </Flex>
    )
  }

  return (
    <>
      <Table colorScheme="whiteAlpha">
        <Thead>
          <Tr>
            <Th>Usuário</Th>
            <Th>Ponto batido</Th>
            {isWideVersion && <Th w="8" />}
          </Tr>
        </Thead>

        <Tbody>
          {state.points.map((point) => (
            <Tr key={point.id}>
              <Td px={['4', '4', '6']}>
                <Box>
                  <Text fontWeight="bold">{point.employee.name}</Text>
                  <Text fontSize="sm" color="gray.300">
                    {point.employee.email}
                  </Text>
                </Box>
              </Td>
              <Td>{format(new Date(point.createdAt), 'dd/MM/yyyy - HH:MM')}</Td>
              {isWideVersion && (
                <Td>
                  <NextLink href={`/employee/${point.employeeCpf}`} passHref>
                    <Button
                      as="a"
                      size="sm"
                      fontSize="sm"
                      colorScheme="blue"
                      cursor="pointer"
                      leftIcon={<Icon as={RiSearchLine} fontSize="16" />}
                    >
                      Detalhes Funcionário
                    </Button>
                  </NextLink>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination
        totalCountOfRegisters={state.points.length}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  )
}
