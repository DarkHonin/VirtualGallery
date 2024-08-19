export interface BaseInputProps {
  type?: 'text' | 'int' | 'float' | 'email' | 'textarea' | 'image' | 'password' | 'select'
  required?: boolean
  label?: string
  placeholder?: string
  modelValue: string | number | boolean | undefined | null | Object | Object[] | number[]
}

export interface TextAreaProps extends BaseInputProps {
  type?: 'textarea'
  modelValue: string | undefined
}

export interface ImageInputProps extends BaseInputProps {
  type?: 'image'
  modelValue: string | File | undefined
}

export interface SelectInputProps extends BaseInputProps {
  type?: 'select'
  modelValue: number | Object | string | undefined | number[] | Object[] | string[]
  item_value?: string
  item_label?: string
  options: any[]
  multiple?: boolean
}
