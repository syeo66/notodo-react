import { ApolloProvider } from '@apollo/react-hooks'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

import { client } from './apollo'
import Header from './components/Header'
import { DesignToken } from './design-tokens'
import darkTheme from './themes/dark'
import defaultTheme from './themes/default'

const Login = lazy(() => import('./pages/Login'))
const Logout = lazy(() => import('./pages/Logout'))
const Registration = lazy(() => import('./pages/Registration'))
const Todo = lazy(() => import('./pages/Todo'))

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
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    const mml = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkTheme(mml.matches)

    const mediaListener = (ev: MediaQueryListEvent) => setIsDarkTheme(ev.matches)
    mml.addListener(mediaListener)

    return () => mml.removeListener(mediaListener)
  }, [])

  const theme = isDarkTheme ? darkTheme : defaultTheme

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router>
          <AppContainer>
            <Header />
            <Main>
              <Switch>
                <Suspense fallback={<></>}>
                  <Route path="/login" exact component={Login} />
                  <Route path="/logout" exact component={Logout} />
                  <Route path="/register" exact component={Registration} />
                  <Route path="/app" exact component={Todo} />
                  <Route path="/" exact component={Login} />
                </Suspense>
              </Switch>
            </Main>
          </AppContainer>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
