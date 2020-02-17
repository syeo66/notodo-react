import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Button } from '../../components/Form'
import { AUTH_TOKEN } from '../../constants'
import { Font, FontSize } from '../../design-tokens'

const HomeView = styled.div`
  font-family: ${Font.bold};
  font-size: ${FontSize.xxl};
  display: flex;
  flex-direction: column;
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

  button {
    animation: buttonFade 2s;
    opacity: 1;
    transform: scale(1);
  }

  @keyframes buttonFade {
    from {
      opacity: 0;
    }

    75% {
      opacity: 0;
      transform: scale(1);
    }

    87% {
      transform: scale(1.2);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
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
  const authToken = localStorage.getItem(AUTH_TOKEN)

  useEffect(() => {
    const to = setTimeout(() => {
      if (authToken) {
        history.push('/app')
      }
    }, 2500)
    return () => clearTimeout(to)
  }, [authToken, history])

  return (
    <HomeView>
      <div>ToNoToDo</div>
      {!authToken && (
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      )}
    </HomeView>
  )
}

export default Home
