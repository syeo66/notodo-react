import styled from 'styled-components'

import { DesignToken } from '../../design-tokens'

const TodoList = styled.section`
  overflow-y: auto;
  height: calc(100% - ${DesignToken.defaultPadding} * 2);
`

export default TodoList
