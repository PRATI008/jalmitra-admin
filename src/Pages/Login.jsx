import React from 'react'
import { NavLink } from 'react-router-dom'
import "../Pages/CSS/Login.css"
const Login = () => {
  return (
  <>
 <div className="login-main-outer">
  <div className="login-left-outer">

  </div>
  <div className="login-right-outer">
   <h1 className='Login-heading'>Login</h1>
 

 <div className="login-card">
  <label htmlFor=""> Email:</label>
   <input type="email" placeholder='enter email' />
   <label htmlFor="">  Password:</label>
 <input type="password" placeholder='enter password' />
 <NavLink to='/dashboard' className='login-btn'> <button>Login</button></NavLink>

 </div>
  </div>
 </div>
   </>
  )
}

export default Login