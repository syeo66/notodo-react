import { useLazyQuery } from '@apollo/react-hooks'
import Color from 'color'
import { loader } from 'graphql.macro'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import ErrorMessage from '../../components/ErrorMessage'
import { Button, Input, Label } from '../../components/Form'
import { AUTH_TOKEN } from '../../constants'
import { DesignToken } from '../../design-tokens'

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
  width: calc(100% - ${DesignToken.defaultPadding} * 2);
  max-width: 20rem;
  margin: ${DesignToken.defaultPadding} auto;
`

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loginAction, { error, loading, data }] = useLazyQuery(loginQuery)

  const history = useHistory()

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      loginAction({ variables: { password, username } })
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
