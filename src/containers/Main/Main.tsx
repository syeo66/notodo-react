import React from 'react'
import styled from 'styled-components'

import { DesignToken } from '../../design-tokens'
import TodoEntry from '../../components/TodoEntry'

interface MainContainerProps {
  className?: string
}

const DateBar = styled.div`
  display: flex;
  justify-content: center;
  padding: ${DesignToken.dateHeader.padding};
  font-size: ${DesignToken.dateHeader.fontSize};
`

const MainContainer: React.FC<MainContainerProps> = ({ className }) => {
  return (
    <main className={className}>
      <DateBar>⇐ 22.06.1974 ⇒</DateBar>
      <TodoEntry isDone />
      <TodoEntry isDone />
      <TodoEntry isSelected />
      <TodoEntry />
      <TodoEntry />
    </main>
  )
}

const Main = styled(MainContainer)`
  max-width: ${DesignToken.maxWidth};
  width: 100%;
  margin: 0 auto;
`

export default Main
