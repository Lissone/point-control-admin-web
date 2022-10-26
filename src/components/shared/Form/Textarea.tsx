/* eslint-disable react/function-component-definition */
import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps
} from '@chakra-ui/react'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'
import { v4 as uuid } from 'uuid'

interface TextareaProps extends ChakraTextareaProps {
  name: string
  label?: string
  error?: FieldError
}

export const TextareaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = ({ name, label, error = null, ...rest }, ref) => (
  <FormControl isInvalid={!!error}>
    {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

    <ChakraTextarea
      id={`${uuid()}-${name}`}
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

export const Textarea = forwardRef(TextareaBase)
