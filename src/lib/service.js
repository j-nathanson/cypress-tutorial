import axios from "axios";

// implicit return from axios
export const saveTodo = (todo) => axios.post('http://localhost:3030/api/todos', todo)
