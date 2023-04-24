import { writeMessage, prepareMessage, resetPersonDetails, getJwtTokenFromStorage } from "./utils.js";
import { graves, planets } from "./data.js";

var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
  container: "container",
  width: width,
  height: height,
});

var layer = new Konva.Layer();

export var konvaText = new Konva.Text({
  x: 100,
  y: 400,
  fontFamily: "Calibri",
  fontSize: 24,
  text: "",
  fill: "green",
});

var planetsLayer = new Konva.Layer();
var circlesLayer = new Konva.Layer();
var messageLayer = new Konva.Layer();
var gravesLayer = new Konva.Layer();

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

      graveOverlay.on("mouseover", async function () {
        graveOverlay.fill("#FFFFFF");
        writeMessage(key);
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
            var message = prepareMessage(data);
            console.log(message);
            writeMessage(message);
          })
          .catch((error) => {
            // Handle any errors
            console.error(error);
          });
      });
      graveOverlay.on("click", async function () {
        console.log("clicked: " + key);
      });

      graveOverlay.on("mouseout", function () {
        graveOverlay.fill("green");
        writeMessage("");
        resetPersonDetails();
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

  messageLayer.add(konvaText);
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
