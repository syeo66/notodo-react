import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import { addDays, format, isSameDay, parseISO, subDays } from 'date-fns'
import { isAfter, sub } from 'date-fns/esm'
import { loader } from 'graphql.macro'
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Button, Input, Label } from '../../components/Form'
import TodoEntry from '../../components/TodoEntry'
import TodoList from '../../components/TodoList'
import { AUTH_EXPIRY, AUTH_TOKEN, DATE_FORMAT, REFRESH_EXPIRY, REFRESH_TOKEN } from '../../constants'
import { DesignToken } from '../../design-tokens'

const todosQuery = loader('./graphql/todos.graphql')
const refreshTokenQuery = loader('./graphql/refreshToken.graphql')
const createTodoMutation = loader('./graphql/createTodo.graphql')
const updateTodoMutation = loader('./graphql/updateTodo.graphql')

const DateBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${DesignToken.dateHeader.padding};
  font-size: ${DesignToken.dateHeader.fontSize};
`

const DateBarButton = styled(Button)`
  margin: 0 1rem;
`

const NewTodoBar = styled.div`
  display: flex;
  align-items: center;

  ${Button} {
    margin-right: ${DesignToken.defaultPadding};
  }

  form {
    width: 100%;
  }
`

const AddButton = styled(Button)`
  position: fixed;
  bottom: ${DesignToken.defaultPadding};
  right: ${DesignToken.defaultPadding};
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

  // TODO: get rid of the cursor -> only use the id
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

  const [doRefreshToken] = useLazyQuery(refreshTokenQuery, {
    fetchPolicy: 'network-only',
    onCompleted: loadedData => {
      if (loadedData?.refresh?.token) {
        const { token, tokenExpiry, refreshToken: newRefreshToken, refreshTokenExpiry } = loadedData.refresh
        localStorage.setItem(AUTH_TOKEN, token)
        localStorage.setItem(AUTH_EXPIRY, tokenExpiry)
        localStorage.setItem(REFRESH_TOKEN, newRefreshToken)
        localStorage.setItem(REFRESH_EXPIRY, refreshTokenExpiry)
      }
    },
  })

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

  const handleDoneToggle = useCallback(
    (id?: string, pos?: number) => {
      const now = new Date()
      Object.freeze(now)

      if (isSameDay(now, currentDate)) {
        //  toggles done flag/date
        updateTodo({
          variables: {
            id: id || selectedId,
            todo: {
              doneAt: data.todos[pos || cursor].doneAt === null ? now : null,
            },
          },
        })
      }
    },
    [currentDate, cursor, data, selectedId, updateTodo]
  )

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.Esc) {
        // cancel creation
        setIsCreating(false)
      }

      if (isCreating) {
        // stop capturing key if we create a new todo
        return
      }

      if (e.keyCode === KeyCode.Space) {
        // Space toggles done flag/date
        handleDoneToggle()
      }

      if (e.keyCode === KeyCode.c || e.keyCode === KeyCode.n) {
        // create a new todo
        setIsCreating(true)
      }

      dateKeyCodeHandler({ keyCode: e.keyCode, setCurrentDate })
    },
    [handleDoneToggle, isCreating]
  )

  const handlePrevDate = useCallback(() => setCurrentDate(prev => subDays(prev, 1)), [])
  const handleNextDate = useCallback(() => setCurrentDate(prev => addDays(prev, 1)), [])
  const handleCurrentDate = useCallback(() => setCurrentDate(new Date()), [])
  const handleAddTodo = useCallback(() => setIsCreating(true), [])
  const handleCloseTodo = useCallback(() => setIsCreating(false), [])

  // Make sure the cursor is never beyond the last entry
  useEffect(() => {
    if (todosLength && cursor > todosLength - 1) {
      setCursor(todosLength - 1)
    }
  }, [cursor, todosLength])

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

  useEffect(() => {
    // TODO: make token handling generic
    const i = setInterval(() => {
      const tokenExpiry = localStorage.getItem(AUTH_EXPIRY)
      const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN)

      // refresh token when expiry is within the next 3 minutes
      if (currentRefreshToken && isAfter(new Date(), sub(new Date(tokenExpiry || ''), { minutes: 3 }))) {
        doRefreshToken({ variables: { refreshToken: currentRefreshToken } })
      }

      // Logout if no AUTH_TOKEN is available or it has been expired
      if (
        !localStorage.getItem(AUTH_TOKEN) ||
        (!tokenExpiry && localStorage.getItem(AUTH_TOKEN)) ||
        isAfter(new Date(), new Date(tokenExpiry || ''))
      ) {
        localStorage.removeItem(AUTH_TOKEN)
        history.push('/')
      }
    }, 5000)
    return () => clearInterval(i)
  }, [history, doRefreshToken])

  return (
    <>
      <DateBar>
        <DateBarButton small onClick={handlePrevDate}>
          ⇐
        </DateBarButton>
        <span onDoubleClick={handleCurrentDate}>{format(currentDate, DATE_FORMAT)}</span>
        <DateBarButton small onClick={handleNextDate}>
          ⇒
        </DateBarButton>
      </DateBar>
      <TodoList>
        {!!data &&
          data.todos.map(({ id, title, doneAt }: Todo, pos: number) => {
            const handleTodoToggle = () => {
              setSelectedId(id)
              setCursor(pos)
              handleDoneToggle(id, pos)
            }

            return (
              <TodoEntry
                key={id}
                title={title}
                doneAt={doneAt ? parseISO(doneAt) : undefined}
                onSelect={handleTodoToggle}
                isSelected={id === selectedId}
              />
            )
          })}
        {isCreating && (
          <NewTodoBar>
            <Button title="Cancel" onClick={handleCloseTodo}>
              x
            </Button>
            <form onSubmit={handleCreateTodo}>
              <Label>
                Create a New Todo
                <Input autoFocus onChange={handleNewTodoChange} />
              </Label>
            </form>
          </NewTodoBar>
        )}
      </TodoList>
      {!isCreating && (
        <AddButton onClick={handleAddTodo} title="Add entry">
          +
        </AddButton>
      )}
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
