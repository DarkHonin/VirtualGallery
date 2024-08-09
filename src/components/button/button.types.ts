import type { BaseLoaderProps } from '../loader/loader.types'

export interface BaseButtonProps extends BaseLoaderProps {
  type?: 'submit' | 'button'
  disabled?: boolean
  label?: string
  color?: 'primary' | 'positive' | 'negative'
}
