import './Todos.css'
import React, { useEffect, useReducer } from 'react'
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"

const API_BASE = "https://dark-plum-hen-yoke.cyclic.app";
// const API_BASE = "http://localhost:5000";

function setState(state, action) {
  switch (action.type) {
    case 'todos':
      return { ...state, todos: action.value };
    case 'todoText':
      return { ...state, todoText: action.value };
    case 'isErr':
      return { ...state, err: action.value };
    default:
      return state;
  }
}

const Todos = () => {

  const navigate = useNavigate();
  const [state, dispatch] = useReducer(setState, { todos: [], todoText: "", err: false });

  const persist = async (newTodos) => {
    const token = localStorage.getItem("profile");
    await axios.post(API_BASE + "/todos", {
      token: token,
      todoItems: newTodos
    })
      .catch((error) => dispatch({ type: 'isErr', value: error.response.data.message }));
  }

  useEffect(() => {
    const token = localStorage.getItem("profile");
    axios.get(API_BASE + "/todos", {
      headers: {
        "authorization": `Bearer ${token}`
      }
    })
      .then((todos) => dispatch({ type: 'todos', value: todos.data }))
      .catch((error) => dispatch({ type: 'isErr', value: error.response.data.message }));

  }, [])
  const addTodo = (e) => {
    e.preventDefault();
    if (!state.todoText) return;
    const newTodo = { checked: false, text: state.todoText }
    const newTodos = [...state.todos, newTodo];
    dispatch({ type: 'todos', value: newTodos });
    dispatch({ type: 'todoText', value: "" })
    persist(newTodos);
  }
  const deleteAll = (e) => {
    e.preventDefault();
    if (state.todos.length === 0) return
    var answer = window.confirm("Do you want to delete all todos?");
    if (answer) {
      dispatch({ type: 'todos', value: [] });
      persist([]);
    }
    else
      return;
  }
  const toggleHandler = (index) => {
    var todo = window.confirm('Press ok to delete the TODO: ' + (state.todos[index].text))

    if (todo) {
      const newList = [...state.todos];
      newList.splice(index, 1);
      dispatch({ type: 'todos', value: newList });
      persist(newList);
    }
  }

  function logOut() {
    localStorage.removeItem("profile");
    navigate('/')
  }

  return (
    <>{state.err && <Link to='/login'>Session Expired Login please...</Link>}
      {!state.err && <><div className="container">
        <div className="heading">
          <h1>To-Do List</h1>
        </div>
        <div className="todo-form">
          <input type="text" onChange={(e) => dispatch({ type: 'todoText', value: e.target.value })} value={state.todoText} required placeholder='add your task . . .' autoFocus />
          <button onClick={addTodo}>Add</button>
          <button className='delete-all' onClick={deleteAll}>DeleteAll</button>
        </div>
        {state.todos.length === 0 && <><h1 className='task-empty' >No tasks added</h1><br />
          <Link href='/how-to-use' className='how-to-use'>how to use..?</Link>
        </>}
        <div className='outer-div'>
          {state.todos.length !== 0 && <ol className='todo-list'>
            {state.todos.map((todo, index) => (
              <div key={index}>
                <li onClick={() => toggleHandler(index)}>{todo.text}</li>
              </div>
            ))}
          </ol>}
        </div>
      </div>
        <button id='log-out' onClick={logOut}>Logout</button></>}
    </>
  )
}

export default Todos;