import './Welcome.css';
import React from 'react'
import { Link } from "react-router-dom"

const Welcome = () => {
  return (
    <div className='wel-con'>
      <h1>Welcome</h1>
      <div className='wel-det'>
        <Link className='reg' to="/register">Register</Link>
        <br />
        <Link className='log' to="/login">Login</Link>
      </div>
    </div>
  )
}

export default Welcome