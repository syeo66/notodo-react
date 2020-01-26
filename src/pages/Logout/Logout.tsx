import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { AUTH_TOKEN } from '../../constants'

const Logout = () => {
  const history = useHistory()

  useEffect(() => {
    localStorage.removeItem(AUTH_TOKEN)
    history.push('/login')
  }, [history])

  return <>Bye-bye</>
}

export default Logout
