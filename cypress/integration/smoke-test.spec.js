describe('Smoke tests', () => {
  // not the most efficient way of doing this
  beforeEach(() => {
    // makes API request clear todos from json server
    cy.request('GET', '/api/todos') //will give response with all the todos
      .its('body')// body object, array of todos
      .each(todo => cy.request('DELETE', `/api/todos/${todo.id}`)) //make a delete req for every todo
  })

  context('With no todos', () => {
    it.only('Saves new todos', () => {
      // expected length of the todos array after adding the new todo
      const items = [
        { text: 'Buy Milk', expectedLength: 1 },
        { text: 'Buy Eggs', expectedLength: 2 },
        { text: 'Buy Bread', expectedLength: 3 }

      ]

      cy.visit('/')
      cy.server()
      cy.route('POST', 'api/todos')//listen to the route not stubbed, will actually be part of the e2e test
        .as('create')

      cy.wrap(items)
        .each(todo => {
          cy.focused()
            .type(todo.text)
            .type('{enter}')

          cy.wait('@create') //tells cypress to wait for the API call to respond and not fail the test if it takes longer than 4 seconds

          cy.get('.todo-list li')
            .should('have.length', todo.expectedLength)
        })

    })
  })



})