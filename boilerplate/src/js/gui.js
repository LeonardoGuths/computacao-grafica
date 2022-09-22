var config = { rotate: degToRad(20), x: 0, y: 0 };

const loadGUI = () => {
  const gui = new dat.GUI();
  gui.add(config, "rotate", 0, 20, 0.5);
  gui.add(config, "x", -150, 150, 5);
  gui.add(config, "y", -100, 100, 5);
};
