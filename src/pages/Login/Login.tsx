import React, { useCallback, useState, useEffect } from 'react'
import { loader } from 'graphql.macro'
import styled from 'styled-components'
import { useLazyQuery } from '@apollo/react-hooks'
import Color from 'color'

import { Input, Label, Button } from '../../components/Form'

import { DesignToken } from '../../design-tokens'
import ErrorMessage from '../../components/ErrorMessage'
import { useHistory } from 'react-router-dom'
import { AUTH_TOKEN } from '../../constants'

const loginQuery = loader('./graphql/login.graphql')

const Panel = styled.div`
  padding: ${DesignToken.defaultPadding};
  border: 1px solid ${props => props.theme.panel.backgroundColor};
  box-shadow: 0 2px 15px
      ${props =>
        Color(props.theme.panel.backgroundColor)
          .alpha(0.4)
          .string()},
    0 0 5px
      ${props =>
        Color(props.theme.panel.backgroundColor)
          .alpha(0.6)
          .string()};
  border-radius: ${DesignToken.defaultBorderRadius};
`

const LoginPanel = styled(Panel)`
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
`

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loginAction, { error, loading, data }] = useLazyQuery(loginQuery)

  const history = useHistory()

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      loginAction({ variables: { username, password } })
    },
    [username, password, loginAction]
  )
  const handleUsernameChange = useCallback(e => setUsername(e.currentTarget.value), [])
  const handlePasswordChange = useCallback(e => setPassword(e.currentTarget.value), [])

  useEffect(() => {
    if (data && data.login && data.login.token) {
      localStorage.setItem(AUTH_TOKEN, data.login.token)
    }
    if (localStorage.getItem(AUTH_TOKEN)) {
      history.push('/app')
    }
  }, [data, history])

  return (
    <LoginPanel>
      {error && <ErrorMessage>Please check your credentials and try again.</ErrorMessage>}
      <form onSubmit={handleSubmit}>
        <Label>
          Username
          <Input name="username" value={username} placeholder={'the_guy'} onChange={handleUsernameChange} autoFocus />
        </Label>
        <Label>
          Password
          <Input
            type="password"
            name="password"
            value={password}
            placeholder={'your-secure-password'}
            onChange={handlePasswordChange}
          />
        </Label>
        <Button disabled={loading || password === '' || username === ''} type="submit">
          {!loading ? 'Login' : 'Logging in...'}
        </Button>
      </form>
    </LoginPanel>
  )
}

export default Login
