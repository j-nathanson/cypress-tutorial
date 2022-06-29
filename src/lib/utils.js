export const filterTodos = (filter, todos) => {

    return filter ? todos.filter(todo => todo.isComplete === (filter === 'completed'))
        : todos
}