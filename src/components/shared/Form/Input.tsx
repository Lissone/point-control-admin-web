/* eslint-disable react/function-component-definition */
import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input as ChakraInput,
  InputProps as ChakraInputProps
} from '@chakra-ui/react'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'
import { v4 as uuid } from 'uuid'

interface InputProps extends ChakraInputProps {
  name: string
  label?: string
  error?: FieldError
  mask?: string
  maskChar?: string
}

export const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, ...rest },
  ref
) => (
  <FormControl isInvalid={!!error}>
    {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

    <ChakraInput
      id={uuid() + name}
      name={name}
      focusBorderColor="blue.700"
      bgColor="gray.900"
      variant="filled"
      size="lg"
      _hover={{
        bgColor: 'gray.900'
      }}
      ref={ref}
      {...rest}
    />

    {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
  </FormControl>
)

export const Input = forwardRef(InputBase)
