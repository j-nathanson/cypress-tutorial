describe('Footer', () => {
    context('with a single todo', () => {
        it('displays a singular todo in count', () => {
            cy.seedAndVisit([{ id: 1, name: 'Buy milk', isComplete: false }]) // use only one todo item
            cy.get('.todo-count')
                .should('contain', '1 todo left')
        })
    })

    context('with multiple todos', () => {
        beforeEach(() => {
            cy.seedAndVisit() //default 4 items
        })

        it('displays plural todos in count', () => {
            cy.get('.todo-count')
                .should('contain', '3 todos left') //one will be completed
        })

        it('handles filter links', () => {
            //should only show uncompleted tasks
            //should only show completed tasks
            const filters = [
                { link: 'Active', expectedLength: 3 },
                { link: 'Completed', expectedLength: 1 },
                { link: 'All', expectedLength: 4 }

            ]
            cy.wrap(filters) //context of cypress
                .each(filter => {
                    cy.contains(filter.link)
                        .click()

                    cy.get('.todo-list li')
                        .should('have.length', filter.expectedLength)
                })
        })
    })
})