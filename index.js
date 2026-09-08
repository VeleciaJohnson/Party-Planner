const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "Party Planner";
const app = document.querySelector("#app");

const state = {
  parties: [],
  selectedParty: null,
  error: null,
};

// Fetch all parties and update state
async function getParties() {
  try {
    const response = await fetch(`${API_URL}/${COHORT}/events`);

    if (!response.ok) {
      throw new Error("Could not fetch parties.");
    }

    const result = await response.json();

    state.parties = result.data;
    state.error = null;

    render();
  } catch (error) {
    console.error(error);

    state.error = error.message;
    render();
  }
}

// Fetch one party by its ID and update state
async function getParty(id) {
  try {
    const response = await fetch(`${API_URL}/${COHORT}/events/${id}`);

    if (!response.ok) {
      throw new Error("Could not fetch party details.");
    }

    const result = await response.json();

    state.selectedParty = result.data;
    state.error = null;

    render();
  } catch (error) {
    console.error(error);

    state.error = error.message;
    render();
  }
}

// Component: Heading
function PartyPlannerHeader() {
  const heading = document.createElement("h1");
  heading.textContent = "Party Planner";

  return heading;
}

// Component: List of party buttons
function PartyList() {
  const section = document.createElement("section");
  section.classList.add("party-list");

  const heading = document.createElement("h2");
  heading.textContent = "Upcoming Parties";

  const list = document.createElement("ul");

  state.parties.forEach((party) => {
    const listItem = document.createElement("li");
    const button = document.createElement("button");

    button.textContent = party.name;

    // Extension: style the selected party differently
    if (state.selectedParty && state.selectedParty.id === party.id) {
      button.classList.add("selected-party");
    }

    button.addEventListener("click", () => {
      getParty(party.id);
    });

    listItem.append(button);
    list.append(listItem);
  });

  section.append(heading, list);

  return section;
}

// Component: Message displayed before a party is selected
function NoPartySelected() {
  const message = document.createElement("p");

  message.textContent = "Select a party to see its details.";
  message.classList.add("no-party-selected");

  return message;
}

// Component: Details for the currently selected party
function SelectedPartyDetails() {
  const section = document.createElement("section");
  section.classList.add("party-details");

  const heading = document.createElement("h2");
  heading.textContent = state.selectedParty.name;

  const id = document.createElement("p");
  id.textContent = `ID: ${state.selectedParty.id}`;

  const date = document.createElement("p");
  const formattedDate = new Date(state.selectedParty.date).toLocaleString();
  date.textContent = `Date: ${formattedDate}`;

  const description = document.createElement("p");
  description.textContent = `Description: ${state.selectedParty.description}`;

  const location = document.createElement("p");
  location.textContent = `Location: ${state.selectedParty.location}`;

  section.append(heading, id, date, description, location);

  return section;
}

// Component: Right-hand section that changes based on selectedParty state
function PartyDetails() {
  const section = document.createElement("section");
  section.classList.add("details-container");

  const heading = document.createElement("h2");
  heading.textContent = "Party Details";

  section.append(heading);

  if (!state.selectedParty) {
    section.append(NoPartySelected());
  } else {
    section.append(SelectedPartyDetails());
  }

  return section;
}

// Component: Error display
function ErrorMessage() {
  const errorMessage = document.createElement("p");

  errorMessage.textContent = `Error: ${state.error}`;
  errorMessage.classList.add("error-message");

  return errorMessage;
}

// Main render function: rebuilds the page whenever state changes
function render() {
  app.innerHTML = "";

  const main = document.createElement("main");
  main.classList.add("container");

  main.append(PartyPlannerHeader());

  if (state.error) {
    main.append(ErrorMessage());
  }

  const content = document.createElement("div");
  content.classList.add("content");

  content.append(PartyList(), PartyDetails());

  main.append(content);
  app.append(main);
}

// Initial API request
getParties();