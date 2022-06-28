Cypress.Commands.add('seedAndVisit', (seedData = 'fixture:todos') => {
    cy.server()
    cy.route('GET', '/api/todos', seedData) //json data from fixture
    // visit page after configuring route so stubed response is in place
    cy.visit('/')
})