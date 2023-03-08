import React, {  useContext, useReducer } from 'react'
import { useNavigate,Link } from "react-router-dom";
import { CredentialContext } from '../App';
import { setState } from './Login';
import './Register.css'

const API_BASE = "https://dark-plum-hen-yoke.cyclic.app";
// const API_BASE = "http://localhost:5000";

const Register = () => {
    const [state, dispatch] = useReducer(setState, { name: "", email: "", pass: "", isError: null })
    const navigate = useNavigate();

    const [, setCredentials] = useContext(CredentialContext);

    const handleErrors = async (res) => {
        if (!res.ok) {
            const { message } = await res.json();
            throw Error(message);
        }
        return res.json();
    }
    const submitHandler = async (e) => {
        e.preventDefault();

        const { email, pass, name } = state;
        await fetch(API_BASE + "/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email, pass: pass,name:name
            })
        })
            .then(handleErrors)
            .then(() => {
                setCredentials({
                    email, pass,name
                })
                navigate("/login");
            })
            .catch((error) => {
                dispatch({ type: 'isError', value: error.message })
            })
    }
    return (
        <div className='main-req'>
            <h1>Register</h1>
            {state.isError && <p className='error-reg'>&#10060;{state.isError}</p>}
            <form onSubmit={submitHandler} className="reg-form">
                <div className='inputs'>
                    <label>Enter name:</label>
                    <input className='input' type="text" placeholder='Name' onChange={(e) => dispatch({ type: 'name', value: e.target.value })} value={state.name} required autoFocus autoComplete='on' />
                </div>

                <div className='inputs'>
                    <label>Enter email id:</label>
                    <input className='input' type="email" placeholder='Email' onChange={(e) => dispatch({ type: 'email', value: e.target.value })} value={state.email} required autoComplete='on' />
                </div>
                <div className='inputs'>
                    <label>Enter password:</label>
                    <input className='input' type="password" placeholder='password' onChange={(e) => dispatch({ type: 'pass', value: e.target.value })} value={state.pass} required autoComplete='on' />
                </div>

                <button type='submit' className='butt'>Register</button>
                <Link to="/login">already a user? Login</Link>
            </form>
        </div>
    )
}

export default Register