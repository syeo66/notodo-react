import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { AUTH_TOKEN } from '../../constants'
import { Font } from '../../design-tokens'
import { Button } from '../Form'

interface HeaderComponentProps {
  className?: string
}

const OpacityHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    opacity: ${({ isHidden }: { isHidden: boolean }) => (isHidden ? 0 : 1)};
    transition: opacity 2s;
  }

  &:hover {
    h1 {
      opacity: 1;
    }
  }
`

const HeaderTitle = styled.h1`
  margin: 0;
  padding: 0;
  font-family: ${Font.bold};
`

const HeaderComponent: React.FC<HeaderComponentProps> = ({ className }) => {
  const [isHidden, setIsHidden] = useState(false)

  const history = useHistory()
  const isLoggedIn = !!localStorage.getItem(AUTH_TOKEN)

  useEffect(() => {
    const toh = setTimeout(() => setIsHidden(true), 3000)
    return () => clearTimeout(toh)
  }, [])

  const handleLogout = useCallback(() => history.push('/logout'), [history])

  return (
    <OpacityHeader className={className} isHidden={isHidden}>
      <HeaderTitle>ToNoToDo</HeaderTitle>
      {isLoggedIn && <Button onClick={handleLogout}>Logout</Button>}
    </OpacityHeader>
  )
}

const Header = styled(HeaderComponent)`
  positon: absolute;
  left: 0;
  right: 0;
  top: 0;
`

export default Header
