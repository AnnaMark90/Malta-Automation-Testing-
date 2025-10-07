function checkPageDownload() {
  cy.on('window:alert', (alertText) => {
    expect(alertText)
      .to.equal(
        'Please press OK and wait when the download is complete :)'
    )
  })
  cy.get('.container')
  .should('be.visible')
}

describe('Modal Download', () => {
  it('Modal is successfully downloaded', () => {
    cy.visit('/')
    checkPageDownload()
  })
  it('Logo is downloaded successfully', () => {
    cy.visit('/')
    checkPageDownload()
    cy.get('img[src="img/logo.png"]')
      .should('have.attr', 'alt', 'logo')
      .should('be.visible')
  })
  it('Following numbers are shown', () => {
    cy.visit('/')
    checkPageDownload()
    const expectedIslands = ['13','6','15-16','11','9','10','8','5','12','4','14']
    const unExpectedIslands = ['102','103']
    expectedIslands.forEach((num) => {
      cy.contains('div', `Island №${num}`).should('exist')
    })
    unExpectedIslands.forEach((num) =>{
      cy.contains('div', `Island №${num}`).should('not.exist')
    })
  });
  it('Camera links are clickable', () => {
    cy.visit('/')
    checkPageDownload()
    cy.get('.icon').should('exist')
    cy.get('a.popup-link').each(($link) => {            
        cy.wrap($link).click({ force: true })    
      })
  });
  it('Camera links open image', () => {
    cy.visit('/')
    checkPageDownload()
    cy.get('a.popup-link').each(($link) => {
      cy.wrap($link).click({ force: true })
      cy.get('.popup.open', { timeout: 10000 }).should('exist').and('be.visible').within(() => {
        cy.get('.popup__image img').should('be.visible').and(($img) => {
          const img = $img[0]
          expect(img.src).to.match(/^https?:\/\//)
          expect(img.naturalWidth).to.be.greaterThan(40)
          expect(img.naturalHeight).to.be.greaterThan(40)
          expect(img.complete).to.be.true
        })
      })
      cy.get('.popup.open .popup__close').click({ force: true })
    })
  })
  // Camera links show more than 1 photo
  it('Each camera link opens and closes popup',()=>{ 
    cy.visit('/')
    checkPageDownload()
    cy.get('.icon').should('exist')
    cy.get('a.popup-link').each(($link)=>{
      cy.wrap($link).click({force:true})
    })
    cy.get('.popup.open').last().within(()=>{
      cy.get('.popup__close').should('exist').and('be.visible').click({force:true})
    })
  })
})
