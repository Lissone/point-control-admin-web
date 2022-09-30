import decode from 'jwt-decode'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next'
import { destroyCookie, parseCookies } from 'nookies'

import { AuthTokenError } from './errors/AuthTokenError'
import { validateUserPermission } from './validateUserPermission'

interface WithSSRAuthOptions {
  permissions?: string[]
  roles?: string[]
}

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptions
): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)
    const token = cookies['@PointControlAdmin.token']

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    if (options) {
      const user = decode<{ role: string }>(token)
      const { roles } = options

      const userHasValidPermissions = validateUserPermission({ user, roles })
      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }
    }

    try {
      return await fn(ctx)
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, '@PointControlAdmin.token')
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  }
}
