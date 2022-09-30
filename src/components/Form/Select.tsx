/* eslint-disable react/function-component-definition */
import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps
} from '@chakra-ui/react'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'

interface SelectProps extends ChakraSelectProps {
  name: string
  options: {
    label: string
    value: string
    selected?: boolean
  }[]
  label?: string
  error?: FieldError
}

export const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { name, options, label, error = null, ...rest },
  ref
) => (
  <FormControl isInvalid={!!error}>
    {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

    <ChakraSelect
      id={name}
      name={name}
      focusBorderColor="blue.700"
      placeholder="Selecione uma opção"
      bgColor="gray.900"
      variant="filled"
      size="lg"
      ref={ref}
      {...rest}
    >
      {options.map((option) => (
        <option
          key={option.value}
          style={{ background: '#181B23' }}
          value={option.value}
          selected={option.selected}
        >
          {option.label}
        </option>
      ))}
    </ChakraSelect>

    {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
  </FormControl>
)

export const Select = forwardRef(SelectBase)
