describe("Input Form", () => {
    // before each test
    beforeEach(() => {
        // open page in the browser
        cy.visit('/')
    })
    it('focuses input on load', () => {

        // test fails originally, couldn't find a focused class
        // cypress will retry until it times out
        cy.focused()
            .should('have.class', 'new-todo')
    })

    // test will run by itself independent of other tests
    // 'only' will only run this specific test
    it('accepts input', () => {
        const typedText = 'Buy Milk'
        // // open page in the browser
        // cy.visit('http://localhost:3030')

        // get input by class, enter text, make assertion
        cy.get('.new-todo')
            .type(typedText)
            .should('have.value', typedText)
    })

    // way of group test
    context('Form submission', () => {
        beforeEach(() => {
            cy.server() //start a server to stub responses
        })


        it('Add  a new Todo on submit', () => {
            const itemText = 'Buy eggs'

            cy.route('POST', '/api/todos', {
                name: itemText,
                id: 1,
                isComplete: false
            })
            cy.get('.new-todo')
                .type(itemText)
                .type('{enter}') //press enter key
                .should('have.value', '') //input should have cleared value

            cy.get('.todo-list li')
                .should('have.length', 1)
                .and('contain', itemText)
        })


        it('Shows an error message on a failed submission', () => {
            cy.route({
                url: '/api/todos',
                method: 'POST',
                status: 500,
                response: {}
            })

            cy.get('.new-todo')
                .type('{enter}') //press enter key

            // Assertions listed doesn't exist and error message is visable
            cy.get('.todo-list li')
                .should('not.exist')

            cy.get('.error')
                .should('be.visible')
        })
    })
})