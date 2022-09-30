import { Box, Flex } from '@chakra-ui/react'
import { ReactNode } from 'react'

import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        {children}
      </Flex>
    </Box>
  )
}
