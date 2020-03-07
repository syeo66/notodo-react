import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { AUTH_EXPIRY, AUTH_TOKEN, REFRESH_EXPIRY, REFRESH_TOKEN } from '../../constants'

const Logout = () => {
  const history = useHistory()

  useEffect(() => {
    localStorage.removeItem(AUTH_TOKEN)
    localStorage.removeItem(AUTH_EXPIRY)
    localStorage.removeItem(REFRESH_TOKEN)
    localStorage.removeItem(REFRESH_EXPIRY)
    history.push('/')
  }, [history])

  return <>Bye-bye</>
}

export default Logout
