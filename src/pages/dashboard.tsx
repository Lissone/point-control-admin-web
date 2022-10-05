import { Box, SimpleGrid, Text, theme, VStack } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { PointsOfDayTable } from '@components/Dashboard/PointsOfDayTable'
import { Layout } from '@components/Layout'

import { withSSRAuth } from '@utils/withSSRAuth'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false
})

const options: ApexOptions = {
  chart: {
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    },
    foreColor: theme.colors.gray[500]
  },
  grid: {
    show: false
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    enabled: false
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600]
    },
    axisTicks: {
      color: theme.colors.gray[600]
    },
    categories: [
      '2021-03-18T00:00:00.000Z',
      '2021-03-19T00:00:00.000Z',
      '2021-03-20T00:00:00.000Z',
      '2021-03-21T00:00:00.000Z',
      '2021-03-22T00:00:00.000Z',
      '2021-03-23T00:00:00.000Z',
      '2021-03-24T00:00:00.000Z'
    ]
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3
    }
  }
}

const series = [{ name: 'series1', data: [31, 120, 50, 28, 85, 108, 250] }]

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>PointControl - Dashboard</title>
      </Head>

      <Layout>
        <Box flex="1" borderRadius={8} p={['6', '8']}>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
                <Text fontSize="lg" mb="4">
                  Pontos batidos hoje
                </Text>
                <PointsOfDayTable />
              </Box>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
                <Text fontSize="lg" mb="4">
                  Pontos batidos na semana
                </Text>
                <Chart options={options} series={series} type="area" height={160} />
              </Box>

              <Box p="8" bg="gray.800" borderRadius={8} pb="4">
                <Text fontSize="lg" mb="4">
                  Taxa de pontos por funcionário
                </Text>
                <Chart options={options} series={series} type="area" height={160} />
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async () => ({
  props: {}
}))
