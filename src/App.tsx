import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Todo from './containers/Todo'
import Login from './containers/Login'
import Registration from './containers/Registration'

import { DesignToken } from './design-tokens'

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

const Main = styled.main`
  max-width: ${DesignToken.maxWidth};
  width: 100%;
  margin: 0 auto;
`

const App: React.FC = () => {
  const theme = false ? darkTheme : defaultTheme

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContainer>
          <Main>
            <Switch>
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Registration} />
              <Route path="/app" component={Todo} />
            </Switch>
          </Main>
        </AppContainer>
      </Router>
    </ThemeProvider>
  )
}

export default App
