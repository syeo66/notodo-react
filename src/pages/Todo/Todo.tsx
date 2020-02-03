import React, { useState, useEffect } from 'react'
import { loader } from 'graphql.macro'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'
import { parseISO, format } from 'date-fns'

import { DesignToken } from '../../design-tokens'
import TodoEntry from '../../components/TodoEntry'
import { DATE_FORMAT } from '../../constants'

const todosQuery = loader('./graphql/todos.graphql')

const DateBar = styled.div`
  display: flex;
  justify-content: center;
  padding: ${DesignToken.dateHeader.padding};
  font-size: ${DesignToken.dateHeader.fontSize};
`

interface Todo {
  id: string
  title: string
  createdAt: string
  scheduledAt: string
  doneAt: string
}

const Todo: React.FC = () => {
  const [currentDate] = useState(new Date())
  const [selectdId, setSelectedId] = useState('')
  const { data } = useQuery(todosQuery)

  useEffect(() => {
    if (selectdId === '' && !!data && !!data.todos[0]) {
      setSelectedId(data.todos[0].id)
    }
  }, [selectdId, data])

  return (
    <>
      <DateBar>⇐ {format(currentDate, DATE_FORMAT)} ⇒</DateBar>
      {!!data &&
        data.todos.map(({ id, title, doneAt }: Todo) => (
          <TodoEntry
            key={id}
            title={title}
            doneAt={doneAt ? parseISO(doneAt) : undefined}
            isSelected={selectdId === id}
          />
        ))}
    </>
  )
}

export default Todo
