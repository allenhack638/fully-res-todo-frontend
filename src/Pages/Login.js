import "./Login.css"
import React, { useReducer } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://dark-plum-hen-yoke.cyclic.app";
// const API_BASE = "http://localhost:5000";

export function setState(state, action) {
  switch (action.type) {
    case 'email':
      return { ...state, email: action.value, isError: "" };
    case 'name':
      return { ...state, name: action.value, isError: "" };
    case 'pass':
      return { ...state, pass: action.value, isError: "" };
    case 'isError':
      return { ...state, isError: action.value };
    default:
      return state;
  }
}

const Login = () => {

  const navigate = useNavigate();

  const [state, dispatch] = useReducer(setState, { name: "", email: "", pass: "", isError: null })

  const submitHandler = async (e) => {
    e.preventDefault();

    await axios.post(API_BASE + "/login", {
      headers: {
        "Content-Type": "application/json"
      },
      body: state,
    })
      .then((res) => {
        localStorage.setItem("profile", res.data.token);
        navigate("/todos");
      })

      .catch((error) => {
        dispatch({ type: 'isError', value: error.response.data.message })
      })
  }
  return (
    <div className='main-req'>
      <h1>Login</h1>
      {state.isError && <p className='error-reg'>&#10060;{state.isError}</p>}
      <form onSubmit={submitHandler} className="reg-form">

        <div className='inputs'>
          <label>Enter email id:</label>
          <input className='input' type="email" placeholder='Email' onChange={(e) => dispatch({ type: 'email', value: e.target.value })} value={state.email} required autoFocus autoComplete="on" />
        </div>
        <div className='inputs'>
          <label>Enter password:</label>
          <input className='input' type="password" placeholder='password' onChange={(e) => dispatch({ type: 'pass', value: e.target.value })} value={state.pass} required autoComplete="on" />
          <a href='/reset-pass'>forgot password</a>
        </div>

        <button type='submit' className='butt'>Login</button>
        <a href="/register">not a user? register</a>
      </form>
    </div>
  )
}

export default Login