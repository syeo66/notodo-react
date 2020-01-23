import React from 'react'
import styled, { ThemeProvider } from 'styled-components'

import { DesignToken } from './design-tokens'
import Main from './containers/Main'

import darkTheme from './themes/dark'
import defaultTheme from './themes/default'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - ${DesignToken.defaultPadding} * 2);

  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.backgroundColor};

  padding: ${DesignToken.defaultPadding};
`

const App: React.FC = () => {
  const theme = true ? darkTheme : defaultTheme

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Main />
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
