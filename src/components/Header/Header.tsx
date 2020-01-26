import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { Button } from '../Form'
import { AUTH_TOKEN } from '../../constants'

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
