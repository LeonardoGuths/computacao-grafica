var config = {
  modo_fps: false,
};

//fixed cameras variables
var cam1Position = [0, -10, 30];

const loadGUI = () => {
  gui = new dat.GUI();
  gui.add(config, "modo_fps");
};
