import { Avatar, Flex, Skeleton, SkeletonCircle, Stack, Text } from '@chakra-ui/react'

import { useAuth } from '@contexts/AuthContext'

interface ProfileProps {
  showProfileData?: boolean
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { user } = useAuth()

  return (
    <Flex align="center">
      {showProfileData && (
        <Stack mr="4" textAlign="right" spacing={1}>
          <Skeleton
            startColor="gray.800"
            endColor="gray.700"
            height="20px"
            isLoaded={!!user}
          >
            <Text>{user?.name}</Text>
            <Text color="gray.300" fontSize="sm">
              {user?.email}
            </Text>
          </Skeleton>

          <Skeleton
            startColor="gray.800"
            endColor="gray.700"
            height="20px"
            isLoaded={!!user}
          >
            <Text color="gray.300" fontSize="sm">
              {user?.email}
            </Text>
          </Skeleton>
        </Stack>
      )}

      <SkeletonCircle
        size="12"
        startColor="gray.800"
        endColor="gray.700"
        isLoaded={!!user}
      >
        <Avatar size="md" name={user?.name} />
      </SkeletonCircle>
    </Flex>
  )
}
