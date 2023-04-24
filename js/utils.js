import { konvaText } from "./script.js";

var personDetails = "";
var jwt = "";

async function getJwtToken() {
  await fetch("https://dev-sm4ylq004f4gs18a.eu.auth0.com/oauth/token", {
    method: "POST",
    body: JSON.stringify({
      audience: "https://gravesAPI",
      grant_type: "client_credentials",
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization:
        "Basic RFc4T0JBbXdZc244VWlsaEpXMzk2WFh6aUdIWU5lTHA6bmo4VUJPU1RqbXZqN0pLTndIODZqT294UHJxTXl3UkNDZE43R0NhTGhOcDI4UHZzcjh0Y1hOWmFpOFl2Q1hmeQ==",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      jwt = json.access_token;
      localStorage.setItem("gravesAPI_JWT", jwt);
      localStorage.setItem("gravesAPI_JWT_TIMESTAMP", Date.now());
    });
}

export async function getJwtTokenFromStorage() {
    await delay(1000);
  if (localStorage.getItem("gravesAPI_JWT") == undefined || localStorage.getItem("gravesAPI_JWT") == null) {
    await getJwtToken();
  } else {
    // check if expired
    var oldTimestamp = localStorage.getItem("gravesAPI_JWT_TIMESTAMP");
    if (Number(oldTimestamp) + 86400000 <= Date.now()) {
      await getJwtToken();
    }
  }
}

export function writeMessage(message) {
    konvaText.text(message);
}

export function prepareMessage(graveData) {
  var message = "";
  if (graveData[0] != undefined) {
    graveData[0].persons.forEach(getPersons);
    message = "location: " + graveData[0].location + "\n";
    message = message + personDetails;
    message = message + "note: " + graveData[0].note;
    return message;
  }
}

function getPersons(person) {
  personDetails = personDetails + person.name + ": " + person.bornDate + " - " + person.deathDate + ";\n";
}
export function resetPersonDetails() {
    personDetails = "";
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }