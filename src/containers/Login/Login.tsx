import React from 'react'
import styled from 'styled-components'

import { Input } from '../../components/Form'

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
      <div>
        <label>
          Username
          <Input />
        </label>
      </div>
      <div>
        <label>
          Password
          <Input type="password" />
        </label>
      </div>
    </LoginPanel>
  )
}

export default Login
