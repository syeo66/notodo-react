import React from 'react'
import styled from 'styled-components'

import { DesignToken } from '../../design-tokens'
import TodoEntry from '../../components/TodoEntry'

const DateBar = styled.div`
  display: flex;
  justify-content: center;
  padding: ${DesignToken.dateHeader.padding};
  font-size: ${DesignToken.dateHeader.fontSize};
`

const Todo: React.FC = () => {
  return (
    <>
      <DateBar>⇐ 22.06.1974 ⇒</DateBar>
      <TodoEntry isDone />
      <TodoEntry isDone />
      <TodoEntry isSelected />
      <TodoEntry />
      <TodoEntry />
    </>
  )
}

export default Todo
