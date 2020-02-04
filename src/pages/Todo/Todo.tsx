import { useQuery } from '@apollo/react-hooks'
import { format, parseISO } from 'date-fns'
import { loader } from 'graphql.macro'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import TodoEntry from '../../components/TodoEntry'
import { DATE_FORMAT } from '../../constants'
import { DesignToken } from '../../design-tokens'

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
