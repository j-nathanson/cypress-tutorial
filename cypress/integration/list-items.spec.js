describe('List items', () => {
    beforeEach(() => {
        cy.seedAndVisit() // start a server and make GET request with todos items from fixtures
    })

    it('properly displays completed items', () => {
        // filter li items that only have 'completed' class
        // assert that their is 1 item and has the word "Eggs"
        // then find the toggle checkbox class
        // assert that it is checked
        cy.get('.todo-list li')
            .filter('.completed')
            .should('have.length', 1)
            .and('contain', 'Eggs')
            .find('.toggle')
            .should('be.checked')
    })

    it('Shows remaining todos in the footer', () => {
        cy.get('.todo-count')
            .should('contain', 3)
    })

    it('Removes a todo', () => {
        // listen for this route
        cy.route({
            url: '/api/todos/1',
            method: 'DELETE',
            status: 200,
            response: {}
        })

        // get todo list, get the first item, find the delete button through it class name 'destroy, and click on it

        // the delete button only appears on hover so we must invoke it inorder to click on it
        cy.get('.todo-list li')
            .as('list')//alias

        cy.get('@list')
            .first()
            .find('.destroy')
            .invoke('show') //This command is used to invoke functions yielded from the previous subject.
            .click()


        cy.get('@list')
            .should('have.length', 3)
            .and('not.contain', 'Milk')
    })

    it.only('Marks an incomplete item complete', () => {
        // currently first todo item in fixtures is NOT complete
        // cypress object comes loaded with lodash
        // NOTE use 'fixture' instead of 'fixtureS'
        cy.fixture('todos')
            .then(todos => {
                const target = Cypress._.head(todos) //first item of todos
                cy.route(
                    'PUT',
                    `/api/todos/${target.id}`,
                    Cypress._.merge(target, { isComplete: true })
                )
                // updates the todo with new isComplete value?
            })

        // make alias for the first todo item
        cy.get('.todo-list li')
            .first()
            .as('first-todo')

        // assert that it's toggle box is checked, i.e isComplete is true
        cy.get('@first-todo')
            .find('.toggle')
            .click()
            .should('be.checked')

        // assert it has completed class
        cy.get('@first-todo')
            .should('have.class', 'completed')

        // assert count is 2
        cy.get('.todo-count')
            .should('contain', 2)
    })
})