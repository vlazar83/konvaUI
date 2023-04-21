var width = window.innerWidth;
var height = window.innerHeight;

function writeMessage(message) {
  text.text(message);
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

  // draw planets
  var planetsImage = new Konva.Image({
    image: imageObj,
  });
  planetsLayer.add(planetsImage);
};
imageObj.src = "../assets/planets.png";
