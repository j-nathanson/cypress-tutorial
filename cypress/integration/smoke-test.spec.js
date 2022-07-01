describe('Smoke tests', () => {
  // not the most efficient way of doing this
  beforeEach(() => {
    // makes API request clear todos from json server
    cy.request('GET', '/api/todos') //will give response with all the todos
      .its('body')// body object, array of todos
      .each(todo => cy.request('DELETE', `/api/todos/${todo.id}`)) //make a delete req for every todo
  })

  context('With no todos', () => {
    it('Saves new todos', () => {
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

  context('With active todos', () => {
    beforeEach(() => {
      // preset data into json.db
      cy.fixture('todos')
        .each(todo => {
          const newTodo = Cypress._.merge(todo, { isComplete: false }) //override default  isComplete property

          // make an http request
          cy.request('POST', 'api/todos', newTodo)
        })
      cy.visit('/')
    })

    it('Loads existing data from the DB', () => {
      cy.get('.todo-list li')
        .should('have.length', 4)
    })

    it('Deletes todos', () => {
      cy.server()
      cy.route('DELETE', '/api/todos/*')
        .as('delete') //use wildcard* in place of an id

      cy.get('.todo-list li')
        .each($el => {
          cy.wrap($el)
            .find('.destroy')
            .invoke('show')
            .click()

          cy.wait('@delete')
        })
        .should('not.exist')
    })

    it('Toggles todos', () => {
      const clickAndWait = ($el) => {
        cy.wrap($el)
          .as('item')
          .find('.toggle')
          .click() //triggers api call and adds/removes 'completed' class to item

        cy.wait('@update')
      }
      cy.server()
      cy.route('PUT', '/api/todos/*')
        .as('update')

      cy.get('.todo-list li')
        // toggle to completed
        .each($el => {
          clickAndWait($el)
          cy.get('@item')
            .should('have.class', 'completed')
        })
        // toggle to uncompleted
        .each($el => {
          clickAndWait($el)
          cy.get('@item')
            .should('not.have.class', 'completed')
        })
    })
  })
})