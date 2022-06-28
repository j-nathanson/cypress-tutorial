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
        it.only('Addas a new Todo on submit', () => {
            cy.get('.new-todo')
                .type('Buy eggs')
                .type('{enter}') //press enter key
        })
    })
})