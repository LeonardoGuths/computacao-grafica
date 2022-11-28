var config = {
  rotate: 0,
  // x: 0,
  // y: 0,
  // z: 0,
  rotate_x: 0,
  rotate_y: 0,
  camera_x: 0,
  camera_y: -10,
  camera_z: 30,
  spin: false,

  adicionaCubo: function () {
    addCubo();
  },
  triangulo: 0,

  targetx: 0,
  targety: 0,
  targetz: 0,
  upVectorx: 0,
  upVectory: 1,
  upVectorz: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  vertice: 0,

  scalex: 1.0,
  scaley: 1.0,
  scalez: 1.0,
  listVertices: 1,
  // luzx: 5.8,
  // luzy: 4.5,
  // luzz: 8.1,
  shininess: 300.0,
  cam_space_invaders: true,
  camera_2: false,
  camera_3: false,
  luzIndex: 0,
  tx: 0,
  ty: 0,
  tz: 0,
  vertice2: 0,
  coordv: 0,
  coordu: 0,
  modo_fps: false,
};

var folder_vertice;
var folder_camera;
var folder_matrix;
var folder_luz;
var folder_triangulo;
var folder_coordTex;

//fixed cameras variables
var cam1Position = [0, -10, 30];
var cam2Position = [1.5, 1.5, 3];
var cam3Position = [-3, -2, -5];

const loadGUI = () => {
  gui = new dat.GUI();
  folder_vertice = gui.addFolder("Vertices e triangulos");
  folder_camera = gui.addFolder("Cameras");
  folder_luz = gui.addFolder("Luzes e texturas");
  folder_matrix = gui.addFolder("Matrizes");
  folder_triangulo = folder_vertice.addFolder("Triangulos");
  folder_coordTex = folder_luz.addFolder("Coordenadas textura");
  folder_luz.open();
  // folder_matrix
  //   .add(config, "rotate", 0, 360, 0.5)
  //   .listen()
  //   .onChange(function () {
  //     nodeInfosByName["0"].trs.rotation[0] = degToRad(config.rotate);
  //     // A ANIMACAO DE GIRAR SOBREPOE ESSA ALTERACAO TODA VEZ Q RENDERIZA
  //     // TEM Q USAR OU UM OU OUTRO
  //   });
  // folder_matrix.add(config, "x", -10, 10, 0.5);
  // folder_matrix.add(config, "y", -10, 10, 0.5);
  // folder_matrix.add(config, "z", -10, 10, 0.5);

  folder_matrix.add(config, "rotate_x", -1000, 1000, 0.01);
  folder_matrix.add(config, "rotate_y", -1000, 1000, 0.01);
  folder_matrix.add(config, "spin");

  folder_matrix.add(config, "scalex", -10, 10, 0.1);
  folder_matrix.add(config, "scaley", -10, 10, 0.1);
  folder_matrix.add(config, "scalez", -10, 10, 0.1);

  folder_camera
    .add(config, "cam_space_invaders")
    .listen()
    .onChange(function () {
      config.camera_2 = false;
      config.camera_3 = false;
      config.camera_x = cam1Position[0];
      config.camera_y = cam1Position[1];
      config.camera_z = cam1Position[2];
      gui.updateDisplay();
    });
  folder_camera
    .add(config, "camera_2")
    .listen()
    .onChange(function () {
      config.cam_space_invaders = false;
      config.camera_3 = false;
      config.camera_x = cam2Position[0];
      config.camera_y = cam2Position[1];
      config.camera_z = cam2Position[2];
      gui.updateDisplay();
    });
  folder_camera
    .add(config, "camera_3")
    .listen()
    .onChange(function () {
      config.cam_space_invaders = false;
      config.camera_2 = false;
      config.camera_x = cam3Position[0];
      config.camera_y = cam3Position[1];
      config.camera_z = cam3Position[2];
      gui.updateDisplay();
    });

  folder_camera.add(config, "camera_x", -50, 50, 0.01).onChange(function () {
    if (config.cam_space_invaders) cam1Position[0] = config.camera_x;
    else if (config.camera_2) cam2Position[0] = config.camera_x;
    else if (config.camera_3) cam3Position[0] = config.camera_x;
  });
  folder_camera.add(config, "camera_y", -50, 50, 0.01).onChange(function () {
    if (config.cam_space_invaders) cam1Position[1] = config.camera_y;
    else if (config.camera_2) cam2Position[1] = config.camera_y;
    else if (config.camera_3) cam3Position[1] = config.camera_y;
  });
  folder_camera.add(config, "camera_z", -50, 50, 0.01).onChange(function () {
    if (config.cam_space_invaders) cam1Position[2] = config.camera_z;
    else if (config.camera_2) cam2Position[2] = config.camera_z;
    else if (config.camera_3) cam3Position[2] = config.camera_z;
  });

  folder_camera.add(config, "upVectorx", -1, 1, 0.1).onChange(function () {
    arrCameras[selectedCamera].up = [
      config.upVectorx,
      config.upVectory,
      config.upVectorz,
    ];
  });
  folder_camera.add(config, "upVectory", -1, 1, 0.1).onChange(function () {
    arrCameras[selectedCamera].up = [
      config.upVectorx,
      config.upVectory,
      config.upVectorz,
    ];
  });

  folder_camera.add(config, "upVectorz", -1, 1, 0.1).onChange(function () {
    arrCameras[selectedCamera].up = [
      config.upVectorx,
      config.upVectory,
      config.upVectorz,
    ];
  });

  folder_triangulo.add(config, "triangulo", 0, 20, 1);
  // folder_triangulo.add(config, "criarVertice");
  folder_triangulo.add(config, "tx", -5, 5, 0.1).onChange(function () {
    config.ty = 0;
    config.tz = 0;
    gui.updateDisplay();
    moveTriangulo();
  });
  folder_triangulo.add(config, "ty", -5, 5, 0.1).onChange(function () {
    config.tx = 0;
    config.tz = 0;
    gui.updateDisplay();
    moveTriangulo();
  });
  folder_triangulo.add(config, "tz", -5, 5, 0.1).onChange(function () {
    config.tx = 0;
    config.ty = 0;
    gui.updateDisplay();
    moveTriangulo();
  });
  // gui
  //   .add(config, "time", 0, teste)
  //   .listen()
  //   .onChange(function () {
  //     //config.rotate = config.time + 1;

  //     gui.updateDisplay();
  //   });
  folder_camera.add(config, "targetx", -10, 10, 0.01).onChange(function () {
    arrCameras[selectedCamera].target = [
      config.targetx,
      config.targety,
      config.targetz,
    ];
  });
  folder_camera.add(config, "targety", -10, 10, 0.01).onChange(function () {
    arrCameras[selectedCamera].target = [
      config.targetx,
      config.targety,
      config.targetz,
    ];
  });
  folder_camera.add(config, "targetz", -10, 10, 0.01).onChange(function () {
    arrCameras[selectedCamera].target = [
      config.targetx,
      config.targety,
      config.targetz,
    ];
  });

  folder_vertice.add(config, "vertice", listOfVertices).onChange(function () {
    const temp = nodeInfosByName[
      `${selectedObject}`
    ].format.position.data.slice(config.vertice * 3, config.vertice * 3 + 3);

    config.vx = temp[0];
    config.vy = temp[1];
    config.vz = temp[2];

    gui.updateDisplay();
  });
  // folder_vertice.add(config, "vertice").onChange(function () {
  //   const temp = arrays_pyramid.position.slice(
  //     config.vertice * 3,
  //     config.vertice * 3 + 3
  //   );

  //   config.vx = temp[0];
  //   config.vy = temp[1];
  //   config.vz = temp[2];

  //   gui.updateDisplay();
  // });
  folder_vertice.add(config, "vx", -10, 10, 0.1).onChange(function () {
    moveVertice();
  });
  folder_vertice.add(config, "vy", -10, 10, 0.1).onChange(function () {
    moveVertice();
  });
  folder_vertice.add(config, "vz", -10, 10, 0.1).onChange(function () {
    moveVertice();
  });
  // folder_luz.add(config, "luzIndex", listOfLights).onChange(function () {
  //   config.luzx = arrLuz[config.luzIndex].position.x;
  //   config.luzy = arrLuz[config.luzIndex].position.y;
  //   config.luzz = arrLuz[config.luzIndex].position.z;
  //   palette.corLuz = arrLuz[config.luzIndex].color;
  //   palette.corSpec = arrLuz[config.luzIndex].spec;

  //   gui.updateDisplay();
  // });
  // folder_luz.add(config, "luzx", -20, 20, 0.01).onChange(function () {
  //   arrLuz[config.luzIndex].position.x = config.luzx;
  // });
  // folder_luz.add(config, "luzy", -20, 20, 0.01).onChange(function () {
  //   arrLuz[config.luzIndex].position.y = config.luzy;
  // });
  // folder_luz.add(config, "luzz", -20, 20, 0.01).onChange(function () {
  //   arrLuz[config.luzIndex].position.z = config.luzz;
  // });
  folder_luz.add(config, "shininess", 0, 3000, 0.1).onChange(function () {
    arrLuz[config.luzIndex].shine = config.shininess;
  });

  folder_coordTex.add(config, "vertice2", listOfVertices).onChange(function () {
    const temp = nodeInfosByName[
      `${selectedObject}`
    ].format.texcoord.data.slice(config.vertice2 * 2, config.vertice2 * 2 + 2);
    config.coordu = temp[0];
    config.coordv = temp[1];
    gui.updateDisplay();
  });
  folder_coordTex.add(config, "coordu").onChange(function () {
    changeTexCoord();
  });
  folder_coordTex.add(config, "coordv").onChange(function () {
    changeTexCoord();
  });

  // folder_luz.add(config, "textura", listTex).onChange(function () {
  //   objects.forEach(function (object) {
  //     object.drawInfo.uniforms.u_texture = tex[config.textura];
  //   });
  // });
  folder_luz.addColor(palette, "corLuz").onChange(function () {
    arrLuz[config.luzIndex].color = palette.corLuz;
  });

  folder_luz.addColor(palette, "corSpec").onChange(function () {
    arrLuz[config.luzIndex].spec = palette.corSpec;
  });

  gui.add(config, "modo_fps");
};
