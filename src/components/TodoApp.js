import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import Footer from './Footer'
import { saveTodo, loadTodos, destroyTodo, updateTodo } from '../lib/service'
import { filterTodos } from '../lib/utils'


export default class TodoApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentTodo: '',
      todos: []
    }

    this.handleNewTodoChange = this.handleNewTodoChange.bind(this)
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentDidMount() {
    loadTodos()
      .then(({ data }) => this.setState({ todos: data }))
      .catch(() => this.setState({ error: true }))
  }

  handleNewTodoChange(evt) {
    this.setState({ currentTodo: evt.target.value })
  }

  handleTodoSubmit(evt) {
    evt.preventDefault();
    const newTodo = { name: this.state.currentTodo, isComplete: false }
    // make api call to db.json and set local state
    saveTodo(newTodo)
      .then(({ data }) => this.setState({
        todos: this.state.todos.concat(data),
        currentTodo: ''
      })
      )
      .catch(() => this.setState({ error: true }))
  }

  handleDelete(id) {
    destroyTodo(id)
      .then(() => this.setState({
        todos: this.state.todos.filter(t => t.id !== id)
      }))
  }

  handleToggle(id) {
    const targetTodo = this.state.todos.find(t => t.id === id)
    const updated = {
      ...targetTodo,
      isComplete: !targetTodo.isComplete
    }

    updateTodo(updated)
      .then(({ data }) => {
        // debugger
        // find index of the updated todo
        // const targetIndex = this.state.todos.findIndex(t => t.id === data.id)

        // copy todos and insert updated todo
        // const todos = [
        //   ...this.state.todos.slice(0, targetIndex),
        //   data,
        //   ...this.state.todos.slice(targetIndex + 1)
        // ]

        // copy todos version 2
        // if id equals the target id then change the todo
        const todos = this.state.todos.map(
          t => t.id === data.id ? data : t
        )

        // update existing todos
        this.setState({ todos: todos })
      })
  }
  render() {
    const remaining = this.state.todos.filter(t => !t.isComplete).length

    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error ? <span className='error' > Oh no! </span> : null}
            <TodoForm
              currentTodo={this.state.currentTodo}
              handleTodoSubmit={this.handleTodoSubmit}
              handleNewTodoChange={this.handleNewTodoChange}
            />
          </header>
          <section className="main">
            {/* ? paramter options */}
            <Route path='/:filter?' render={({ match }) =>
              <TodoList
                todos={filterTodos(match.params.filter, this.state.todos)}
                handleDelete={this.handleDelete}
                handleToggle={this.handleToggle}
              />
            } />
          </section>
          <Footer remaining={remaining} />
        </div>
      </Router>
    )
  }
}
