import { Box, Flex, Heading, Text } from '@chakra-ui/react'

interface RecordNotFoundProps {
  title: string
  message: string
}

export function RecordNotFound({ title, message }: RecordNotFoundProps) {
  return (
    <Box flex="1" borderRadius={8} bg="gray.800" p="8">
      <Flex mb="8" align="center">
        <Heading size="lg" fontWeight="normal">
          {title}
        </Heading>
      </Flex>

      <Flex justify="center">
        <Text color="red.500">{message}</Text>
      </Flex>
    </Box>
  )
}
