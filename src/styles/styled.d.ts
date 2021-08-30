import 'styled-components'

import theme from './theme'

export type Theme = typeof theme

declare module 'styled-component' {
  export interface DefaultTheme extends Theme {}
}
