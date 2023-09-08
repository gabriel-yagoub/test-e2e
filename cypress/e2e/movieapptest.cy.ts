beforeEach(() => {
  cy.visit("/");
});

describe("Checks UI functionality", () => {
  it("Check if input is found", () => {
    cy.get("input").should("exist");
  });
  
  it("Check if button is found", () => {
    cy.get("button").should("exist");
  });
  
  it("Check that input works", () => {
    cy.get("input").type("The Matrix").should("have.value", "The Matrix");
  });

  it("Check that button works", () => {
    cy.get("input").type("The Matrix");
    cy.get("button").click();
    cy.get("h3").contains("The Matrix").should("exist");
  });
});

describe("Checks API functionality", () => {
  it("Check that the API is called", () => {
    cy.get("input").type("The Matrix");
    cy.get("button").click();
    cy.get("h3").contains("The Matrix").should("exist");
    cy.get("h3").contains("The Matrix Reloaded").should("exist");
    cy.get("h3").contains("The Matrix Revolutions").should("exist");
  });

  it("Get result from API if search is successful", () => {
    cy.get("input").type("The Matrix");
    cy.get("button").click();
    cy.get("h3").contains("The Matrix").should("exist");
  });

  it("Get error message if no result found", () => {
    cy.get("input").type("asasdasdasd");
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa").should("exist");
  });
  
  it("Get error message if search field is left empty", () => {
    cy.get("input").type(" ");
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa").should("exist");
  });
});

describe("Checks mock API functionality", () => {
  it("Get result from mock API if search is successful", () => {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=*", {fixture:"mockMovieList"}).as("mockMovieList");
    cy.get("input").type("American Beauty");
    cy.get("button").click();
    cy.get("h3").contains("American Beauty").should("exist");
    cy.get("h3").contains("Shawshank Redemption").should("exist");
    cy.get("h3").contains("The Sixth Sense").should("exist");
  });

  it("Get error message if no result found", () => {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=*", {fixture:"mockError"}).as("mockError");
    cy.get("input").type("dasafsasfas").should("have.value", "dasafsasfas");
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa").should("exist");
  });

  it("Get error message if search field is left empty", () => {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=*", {fixture:"mockError"}).as("mockError");
    cy.get("input").type(" ").should("have.value", " ");
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa").should("exist");
  });

  it("Test if URL is correct", () => {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=*", {fixture:"mockMovieList"}).as("mockMovieList");
    cy.get("input").type("Shawshank Redemption").should("have.value", "Shawshank Redemption");
    cy.get("button").click();
    const expectedUrl = "http://omdbapi.com/?apikey=416ed51a&s=Shawshank%20Redemption";
    cy.wait("@mockMovieList").its("request.url").should("eq", expectedUrl);
  });
});