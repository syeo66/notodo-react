import { useMutation, useQuery } from '@apollo/react-hooks'
import { addDays, format, isSameDay, parseISO, subDays } from 'date-fns'
import { loader } from 'graphql.macro'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import TodoEntry from '../../components/TodoEntry'
import { AUTH_TOKEN, DATE_FORMAT } from '../../constants'
import { DesignToken } from '../../design-tokens'

const todosQuery = loader('./graphql/todos.graphql')
const updateTodoMutation = loader('./graphql/updateTodo.graphql')

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

enum KeyCode {
  Up = 38,
  Down = 40,
  Left = 37,
  Right = 39,
  Space = 32,
  h = 72,
  n = 78,
}

interface SorterInput {
  doneAt: string
}

const Todo: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedId, setSelectedId] = useState('')
  const [cursor, setCursor] = useState(0)

  const history = useHistory()

  const { data } = useQuery(todosQuery, {
    variables: { date: isSameDay(currentDate, new Date()) ? null : currentDate },
  })
  const [updateTodo] = useMutation(updateTodoMutation)

  const todosLength = data && data.todos && data.todos.length

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.Space) {
        updateTodo({
          variables: {
            id: selectedId,
            todo: { doneAt: data.todos[cursor].doneAt === null ? new Date() : null, title: data?.todos[cursor].title },
          },
        })
      }
      if (e.keyCode === KeyCode.h) {
        setCurrentDate(new Date())
      }
      if (e.keyCode === KeyCode.Left) {
        setCurrentDate(prev => subDays(prev, 1))
      }
      if (e.keyCode === KeyCode.Right) {
        setCurrentDate(prev => addDays(prev, 1))
      }
      if (e.keyCode === KeyCode.Up && cursor > 0) {
        setCursor(prev => prev - 1)
      }
      if (e.keyCode === KeyCode.Down && cursor < todosLength - 1) {
        setCursor(prev => prev + 1)
      }
    },
    [cursor, data, selectedId, todosLength, updateTodo]
  )

  useEffect(() => {
    if (!localStorage.getItem(AUTH_TOKEN)) {
      history.push('/')
    }
  }, [history])

  // Make sure the cursor is never beyond the last entry
  useEffect(() => {
    if (todosLength && cursor > todosLength - 1) {
      setCursor(todosLength - 1)
    }
  }, [cursor, todosLength])

  // Choose the selectedId depending in the cursor position
  // TODO: This should/could be done in handleKey
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
    window.addEventListener('keyup', handleKey)

    return () => {
      window.removeEventListener('keyup', handleKey)
    }
  }, [handleKey])

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
