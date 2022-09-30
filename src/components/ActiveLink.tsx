import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { cloneElement, ReactElement } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement
  shouldMathExactHref?: boolean
}

export function ActiveLink({
  children,
  shouldMathExactHref = false,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter()

  let isActive = false

  if (shouldMathExactHref && (asPath === rest.href || asPath === rest.as)) {
    isActive = true
  }

  if (
    !shouldMathExactHref &&
    (asPath.startsWith(String(rest.href)) || asPath.startsWith(String(rest.as)))
  ) {
    isActive = true
  }

  return (
    <Link {...rest}>
      {cloneElement(children, {
        color: isActive ? 'green.400' : 'gray.50'
      })}
    </Link>
  )
}
