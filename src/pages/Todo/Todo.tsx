import { useMutation, useQuery } from '@apollo/react-hooks'
import { addDays, format, isSameDay, parseISO, subDays } from 'date-fns'
import { loader } from 'graphql.macro'
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Input, Label } from '../../components/Form'
import TodoEntry from '../../components/TodoEntry'
import TodoList from '../../components/TodoList'
import { AUTH_TOKEN, DATE_FORMAT } from '../../constants'
import { DesignToken } from '../../design-tokens'

const todosQuery = loader('./graphql/todos.graphql')
const createTodoMutation = loader('./graphql/createTodo.graphql')
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
  Esc = 27,
  Up = 38,
  Down = 40,
  Left = 37,
  Right = 39,
  Space = 32,
  c = 67,
  h = 72,
  n = 78,
}

const Todo: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedId, setSelectedId] = useState('')
  const [cursor, setCursor] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [todoText, setTodoText] = useState('')

  const history = useHistory()

  const { data, refetch } = useQuery(todosQuery, {
    onCompleted: loadedData => {
      const initialTodo = loadedData.todos.find((t: { doneAt: string | null }) => !t.doneAt)
      if (!initialTodo) {
        return
      }
      setSelectedId(initialTodo.id)
      setCursor(data.todos.indexOf(initialTodo))
    },
    variables: { date: isSameDay(currentDate, new Date()) ? null : currentDate },
  })
  const [updateTodo] = useMutation(updateTodoMutation)
  const [createTodo] = useMutation(createTodoMutation)

  const todosLength = data && data.todos && data.todos.length

  const handleCreateTodo = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (!todoText || todoText.trim().length <= 0) {
        return
      }
      createTodo({
        variables: {
          todo: {
            scheduledAt: isSameDay(currentDate, new Date()) ? null : currentDate,
            title: todoText.trim(),
          },
        },
      }).then(() => {
        refetch()
        setTodoText('')
        setIsCreating(false)
      })
    },
    [createTodo, currentDate, refetch, todoText]
  )

  const handleNewTodoChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.currentTarget.value.trim())
  }, [])

  const handleRepeatableKey = useCallback(
    (e: KeyboardEvent) => {
      if (isCreating) {
        // stop capturing key if we create a new todo
        return
      }
      cursorKeyCodeHandler({ cursor, end: todosLength, keyCode: e.keyCode, setCursor })
    },
    [cursor, isCreating, todosLength]
  )

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const now = new Date()
      Object.freeze(now)

      if (e.keyCode === KeyCode.Esc) {
        // cancel creation
        setIsCreating(false)
      }

      if (isCreating) {
        // stop capturing key if we create a new todo
        return
      }

      if (isSameDay(now, currentDate) && e.keyCode === KeyCode.Space) {
        // Space toggles done flag/date
        updateTodo({
          variables: {
            id: selectedId,
            todo: { doneAt: data.todos[cursor].doneAt === null ? now : null, title: data?.todos[cursor].title },
          },
        })
      }

      if (e.keyCode === KeyCode.c || e.keyCode === KeyCode.n) {
        // create a new todo
        setIsCreating(true)
      }

      dateKeyCodeHandler({ keyCode: e.keyCode, setCurrentDate })
    },
    [currentDate, cursor, data, isCreating, selectedId, updateTodo]
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

  // initialize the keyup event listeners
  useEffect(() => {
    window.addEventListener('keyup', handleKey)
    window.addEventListener('keydown', handleRepeatableKey)

    return () => {
      window.removeEventListener('keyup', handleKey)
      window.removeEventListener('keydown', handleRepeatableKey)
    }
  }, [handleKey, handleRepeatableKey])

  return (
    <>
      <DateBar>⇐ {format(currentDate, DATE_FORMAT)} ⇒</DateBar>
      <TodoList>
        {!!data &&
          data.todos.map(({ id, title, doneAt }: Todo, pos: number) => (
            <TodoEntry
              key={id}
              title={title}
              doneAt={doneAt ? parseISO(doneAt) : undefined}
              isSelected={id === selectedId}
            />
          ))}
        {isCreating && (
          <form onSubmit={handleCreateTodo}>
            <Label>
              Create a New Todo
              <Input autoFocus onChange={handleNewTodoChange} />
            </Label>
          </form>
        )}
      </TodoList>
    </>
  )
}

type UseStateParam<T> = (param: T | ((state: T) => T)) => void

const dateKeyCodeHandler = ({ keyCode, setCurrentDate }: { keyCode: number; setCurrentDate: UseStateParam<Date> }) => {
  if (keyCode === KeyCode.h) {
    setCurrentDate(new Date())
  }
  if (keyCode === KeyCode.Left) {
    setCurrentDate(prev => subDays(prev, 1))
  }
  if (keyCode === KeyCode.Right) {
    setCurrentDate(prev => addDays(prev, 1))
  }
}

const cursorKeyCodeHandler = ({
  keyCode,
  cursor,
  end,
  setCursor,
}: {
  keyCode: number
  cursor: number
  end: number
  setCursor: UseStateParam<number>
}) => {
  if (keyCode === KeyCode.Up && cursor > 0) {
    setCursor(prev => prev - 1)
  }
  if (keyCode === KeyCode.Down && cursor < end - 1) {
    setCursor(prev => prev + 1)
  }
}

export default Todo
