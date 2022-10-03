import { Stack } from '@chakra-ui/react'
import { BiCog } from 'react-icons/bi'
import {
  RiDashboardLine,
  RiContactsLine,
  RiUserUnfollowLine,
  RiUserStarLine,
  RiBuildingLine
} from 'react-icons/ri'

import { UserRole } from '@interfaces/user'

import { UserCanSee } from '@components/shared/UserCanSee'

import { NavLink } from './NavLink'
import { NavSection } from './NavSection'

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink href="/dashboard" icon={RiDashboardLine}>
          Dashboard
        </NavLink>

        <NavLink href="/employee" icon={RiContactsLine}>
          Funcionários
        </NavLink>

        <NavLink href="/absence" icon={RiUserUnfollowLine}>
          Ausências
        </NavLink>

        <NavLink href="/config" icon={BiCog}>
          Configurações
        </NavLink>
      </NavSection>

      <UserCanSee roles={[UserRole.GlobalAdmin]}>
        <NavSection title="ADMIN">
          <NavLink href="/user" icon={RiUserStarLine}>
            Usuários
          </NavLink>

          <NavLink href="/company" icon={RiBuildingLine}>
            Empresas
          </NavLink>
        </NavSection>
      </UserCanSee>
    </Stack>
  )
}
