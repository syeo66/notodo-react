import React from 'react'
import styled from 'styled-components'

import { Input, Label, Button } from '../../components/Form'

import { DesignToken } from '../../design-tokens'

const Panel = styled.div`
  padding: ${DesignToken.defaultPadding};
  background-color: ${props => props.theme.panel.backgroundColor};
  border-radius: ${DesignToken.defaultBorderRadius};
`

const LoginPanel = styled(Panel)`
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
`

const Login = () => {
  return (
    <LoginPanel>
      <Label>
        Username
        <Input />
      </Label>
      <Label>
        Password
        <Input type="password" />
      </Label>
      <Button>Login</Button>
    </LoginPanel>
  )
}

export default Login
