var width = window.innerWidth;
var height = window.innerHeight;
var jwt = "";

function writeMessage(message) {
  text.text(message);
}

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

async function getJwtTokenFromStorage() {
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

var stage = new Konva.Stage({
  container: "container",
  width: width,
  height: height,
});

var layer = new Konva.Layer();

var text = new Konva.Text({
  x: 10,
  y: 10,
  fontFamily: "Calibri",
  fontSize: 24,
  text: "",
  fill: "white",
});

var planetsLayer = new Konva.Layer();
var circlesLayer = new Konva.Layer();
var messageLayer = new Konva.Layer();
var gravesLayer = new Konva.Layer();

var graves = {
  AA1: {
    x: 700,
    y: 126,
    width: 100,
    height: 50,
  },
  AA2: {
    x: 900,
    y: 126,
    width: 100,
    height: 50,
  },
  AA3: {
    x: 1100,
    y: 127,
    width: 100,
    height: 50,
  },
  AA4: {
    x: 1300,
    y: 127,
    width: 100,
    height: 50,
  },
};

var planets = {
  Mercury: {
    x: 46,
    y: 126,
    radius: 32,
  },
  Venus: {
    x: 179,
    y: 126,
    radius: 79,
  },
  Earth: {
    x: 366,
    y: 127,
    radius: 85,
  },
  Mars: {
    x: 515,
    y: 127,
    radius: 45,
  },
};

var imageObj = new Image();
imageObj.onload = function () {
  // draw shape overlays
  for (var pubKey in graves) {
    (function () {
      var key = pubKey;
      var grave = graves[key];

      var graveOverlay = new Konva.Rect({
        x: grave.x,
        y: grave.y,
        width: grave.width,
        height: grave.height,
        fill: "green",
      });

      graveOverlay.on("mouseover", function () {
        graveOverlay.fill("#FFFFFF");
        writeMessage(key);
      });
      graveOverlay.on("click", async function () {
        console.log("clicked: " + key);

        await getJwtTokenFromStorage();

        fetch("http://localhost:50001/graves?location=" + key, {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + localStorage.getItem("gravesAPI_JWT"),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            // Do something with the data
            console.log(data);
          })
          .catch((error) => {
            // Handle any errors
            console.error(error);
          });

        // writeMessage("clicked MF");
      });
      graveOverlay.on("mouseout", function () {
        graveOverlay.fill("green");
        writeMessage("");
      });

      gravesLayer.add(graveOverlay);
    })();
  }

  // draw shape overlays
  for (var pubKey in planets) {
    (function () {
      var key = pubKey;
      var planet = planets[key];

      var planetOverlay = new Konva.Circle({
        x: planet.x,
        y: planet.y,
        radius: planet.radius,
      });

      planetOverlay.on("mouseover", function () {
        planetOverlay.fill("#FFFFFF");
        writeMessage(key);
      });
      planetOverlay.on("click", function () {
        console.log("clicked: " + key);

        fetch("http://localhost:50001/graves?location=" + key)
          .then((response) => response.json())
          .then((data) => {
            // Do something with the data
            console.log(data);
          })
          .catch((error) => {
            // Handle any errors
            console.error(error);
          });

        // writeMessage("clicked MF");
      });
      planetOverlay.on("mouseout", function () {
        planetOverlay.fill("#FFFFFF00");
        writeMessage("");
      });

      circlesLayer.add(planetOverlay);
    })();
  }

  var checkbox = document.getElementById("checkbox");
  checkbox.addEventListener(
    "click",
    function () {
      var shapes = circlesLayer.getChildren();

      // flip show property
      for (var n = 0; n < shapes.length; n++) {
        var shape = shapes[n];
        var f = shape.fill();
        shape.fill(f == "red" ? null : "red");
      }
    },
    false
  );

  messageLayer.add(text);
  stage.add(planetsLayer);
  stage.add(circlesLayer);
  stage.add(messageLayer);
  stage.add(gravesLayer);

  // draw planets
  var planetsImage = new Konva.Image({
    image: imageObj,
  });
  planetsLayer.add(planetsImage);
};
imageObj.src = "../assets/planets.png";
