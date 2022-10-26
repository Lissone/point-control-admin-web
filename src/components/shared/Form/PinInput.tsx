/* eslint-disable react/function-component-definition */
import {
  FormControl,
  FormErrorMessage,
  HStack,
  PinInput as ChakraPinInput,
  PinInputField as ChakraPinInputField,
  PinInputProps as ChakraPinInputProps
} from '@chakra-ui/react'
import { FieldError, Controller, Control } from 'react-hook-form'

interface PinInputProps<TFieldValues> extends Omit<ChakraPinInputProps, 'children'> {
  name: string
  control: Control<TFieldValues>
  pinLength: number
  error?: FieldError
}

export const PinInput = ({
  name,
  pinLength,
  control,
  error = null
}: PinInputProps<any>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { ref, ...restField } }) => (
      <FormControl isInvalid={!!error}>
        <HStack justify="space-between">
          <ChakraPinInput
            size="lg"
            type="number"
            focusBorderColor="blue.700"
            errorBorderColor="red.500"
            isInvalid={!!error}
            variant="filled"
            {...restField}
          >
            {[...Array(pinLength)].map((value, index) => (
              <ChakraPinInputField
                key={`${name}[${index + 1}]`}
                type="number"
                bgColor="gray.900"
                _hover={{
                  bgColor: 'gray.900'
                }}
                ref={ref}
                {...restField}
              />
            ))}
          </ChakraPinInput>
        </HStack>

        {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </FormControl>
    )}
  />
)
