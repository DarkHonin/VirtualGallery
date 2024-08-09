export enum LayoutEdgeDirection {
  top,
  left,
  right,
  bottom
}

export interface LayoutBaseProps {
  stick?: (keyof typeof LayoutEdgeDirection)[]
}

export interface LayoutSplitProps extends LayoutBaseProps {
  direction?: 'horizontal' | 'vertical'
  cells?: number
}
