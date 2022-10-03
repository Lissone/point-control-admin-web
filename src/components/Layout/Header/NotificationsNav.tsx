import { HStack, Icon } from '@chakra-ui/react'
import { RiLogoutBoxRLine } from 'react-icons/ri'

import { useAuth } from '@contexts/AuthContext'

export function NotificationsNav() {
  const { signOut } = useAuth()

  return (
    <HStack
      spacing={['6', '8']}
      mx={['6', '8']}
      pr={['6', '8']}
      py="1"
      color="gray.300"
      borderRightWidth={1}
      borderColor="gray.700"
    >
      <Icon
        as={RiLogoutBoxRLine}
        aria-label="Sair"
        fontSize="20"
        onClick={signOut}
        _hover={{ color: 'red', cursor: 'pointer' }}
      />
    </HStack>
  )
}
