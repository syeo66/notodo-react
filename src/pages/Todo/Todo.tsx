import { useQuery } from '@apollo/react-hooks'
import { format, parseISO } from 'date-fns'
import { loader } from 'graphql.macro'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import TodoEntry from '../../components/TodoEntry'
import { AUTH_TOKEN, DATE_FORMAT } from '../../constants'
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
  const [selectedId, setSelectedId] = useState('')
  const [cursor, setCursor] = useState(0)

  const history = useHistory()

  const { data } = useQuery(todosQuery)

  const todosLength = data && data.todos && data.todos.length

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.keyCode === 38 && cursor > 0) {
        setCursor(prev => prev - 1)
      }
      if (e.keyCode === 40 && cursor < todosLength - 1) {
        setCursor(prev => prev + 1)
      }
    },
    [cursor, todosLength]
  )

  useEffect(() => {
    if (!localStorage.getItem(AUTH_TOKEN)) {
      history.push('/')
    }
  }, [history])

  // Make sure the cursor is never beyond the last entry
  useEffect(() => {
    if (cursor > todosLength - 1) {
      setCursor(todosLength - 1)
    }
  }, [cursor, todosLength])

  // Choose the selectedId depending in the cursor position
  // TODO: This should/could be done in handleKeyDown
  useEffect(() => {
    if (data && data.todos && data.todos[cursor]) {
      setSelectedId(data.todos[cursor].id)
    }
  }, [cursor, data])

  // onLoad select the first entry
  useEffect(() => {
    if (selectedId === '' && !!data && !!data.todos[0]) {
      setSelectedId(data.todos[0].id)
    }
  }, [selectedId, data])

  // initialize the keyup event listeners
  useEffect(() => {
    window.addEventListener('keyup', handleKeyDown)

    return () => {
      window.removeEventListener('keyup', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <>
      <DateBar>⇐ {format(currentDate, DATE_FORMAT)} ⇒</DateBar>
      {!!data &&
        data.todos.map(({ id, title, doneAt }: Todo, pos: number) => (
          <TodoEntry
            key={id}
            title={title}
            doneAt={doneAt ? parseISO(doneAt) : undefined}
            isSelected={id === selectedId}
          />
        ))}
    </>
  )
}

export default Todo
