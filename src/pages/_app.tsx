import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'

import { AuthProvider } from '@contexts/AuthContext'
import { SidebarDrawerProvider } from '@contexts/SidebarDrawerContext'

import { theme } from '@styles/theme'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <SidebarDrawerProvider>
          <Component {...pageProps} />
        </SidebarDrawerProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}
