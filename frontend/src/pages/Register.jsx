import React from 'react'
import UserForm from '../components/UserForm'

function Register() {
  return (
    <>
      <UserForm route="/api/user/register/" method="register" />
    </>
  )
}

export default Register