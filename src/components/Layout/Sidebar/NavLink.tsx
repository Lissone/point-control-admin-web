import {
  Icon,
  Link as ChakraLink,
  Text,
  LinkProps as ChakraLinkProps
} from '@chakra-ui/react'
import { ReactNode, ElementType } from 'react'

import { ActiveLink } from '@components/shared/ActiveLink'

interface NavLinkProps extends ChakraLinkProps {
  icon: ElementType
  children: ReactNode
  href: string
}

export function NavLink({ icon, children, href, ...rest }: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref>
      <ChakraLink display="flex" align="center" {...rest}>
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">
          {children}
        </Text>
      </ChakraLink>
    </ActiveLink>
  )
}
