import React from 'react'
import styled from 'styled-components'

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
  return (
    <HomeView>
      <div>ToNoToDo</div>
    </HomeView>
  )
}

export default Home
