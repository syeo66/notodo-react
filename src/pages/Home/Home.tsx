import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { AUTH_TOKEN } from '../../constants'
import { Font, FontSize } from '../../design-tokens'

const HomeView = styled.div`
  font-family: ${Font.bold};
  font-size: ${FontSize.xxl};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: ${props => props.theme.backgroundColor};
  div {
    transform: scale(0.75) rotate(0deg);
    animation: home 1.5s;
    font-size: 200%;
  }

  @keyframes home {
    from {
      transform: scale(0.01) rotate(-60deg);
      animation-timing-function: ease-in;
    }
    50% {
      transform: scale(0.25) rotate(20deg);
    }
    75% {
      transform: scale(1) rotate(20deg);
    }
    to {
      transform: scale(0.75) rotate(0deg);
      animation-timing-function: ease-out;
    }
  }
`

const Home = () => {
  const history = useHistory()

  useEffect(() => {
    const to = setTimeout(() => {
      const authToken = localStorage.getItem(AUTH_TOKEN)
      if (authToken) {
        history.push('/app')
      }
    }, 2500)
    return () => clearTimeout(to)
  }, [history])

  return (
    <HomeView>
      <div>ToNoToDo</div>
    </HomeView>
  )
}

export default Home
