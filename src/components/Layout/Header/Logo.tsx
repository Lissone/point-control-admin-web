import { HStack, Image, Text, useBreakpointValue } from '@chakra-ui/react'

export function Logo() {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true
  })

  return (
    <HStack w="64">
      <Image src="/favicon.png" w={isWideVersion ? 10 : 12} />
      {isWideVersion && (
        <Text fontSize={['xl', '2xl', '3xl']} fontWeight="bold" letterSpacing="tight">
          Point Control
        </Text>
      )}
    </HStack>
  )
}
