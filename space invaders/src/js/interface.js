var config = {
  player_skin: "spaceship",
  enemy1_skin: "spaceinvader2",
  enemy2_skin: "spaceinvaderW",
  modo_fps: false,
};

//fixed cameras variables
var cam1Position = [0, -10, 30];

const loadGUI = () => {
  gui = new dat.GUI();
  gui.add(config, "player_skin", listTex).onChange(function () {
    nodeInfosByName["player"].node.drawInfo.uniforms.u_texture =
      tex[config.player_skin];
  });
  gui.add(config, "enemy1_skin", enemyListTex).onChange(function () {
    for (let i = 7; i < 14; i++) {
      nodeInfosByName[`space_invader_${i}`].node.drawInfo.uniforms.u_texture =
        tex[config.enemy1_skin];
    }
  });
  gui.add(config, "enemy2_skin", enemyListTex).onChange(function () {
    for (let i = 0; i < 7; i++) {
      nodeInfosByName[`space_invader_${i}`].node.drawInfo.uniforms.u_texture =
        tex[config.enemy2_skin];
    }
  });
  gui.add(config, "modo_fps");
};
