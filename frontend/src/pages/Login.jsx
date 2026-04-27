import React from 'react'
import UserForm from '../components/UserForm'

function Login() {
  return (
    <>
      <UserForm route="/api/token/" method="login" />
    </>
  )
}

export default Login