var config = {
  rotate: 0,
  x: 0,
  y: 0,
  z: 0,
  rotate_x: 0,
  rotate_y: 0,
  camera_x: 4,
  camera_y: 4,
  camera_z: 10,
  spin: false,

  adicionaCubo: function () {
    addCubo();
  },
  triangulo: 0,

  criarVertice: function () {
    // console.log(`indices antes: ${arrays_pyramid.indices}`);
    // console.log(`arrays_pyramid.position antes: ${arrays_pyramid.position}`);
    var n = config.triangulo * 3;
    var inicio = nodeInfosByName[
      `${selectedObject}`
    ].format.position.data.slice(0, n * 3);
    var temp = nodeInfosByName[`${selectedObject}`].format.position.data.slice(
      n * 3,
      (n + 3) * 3
    );
    var resto = nodeInfosByName[`${selectedObject}`].format.position.data.slice(
      (n + 3) * 3,
      nodeInfosByName[`${selectedObject}`].format.position.data.length
    );
    var newind = [];
    //arrays_pyramid.position = [...inicio, ...resto];
    nodeInfosByName[`${selectedObject}`].format.position.data = [...inicio];

    var a = temp.slice(0, 3);
    var b = temp.slice(3, 6);
    var c = temp.slice(6, 9);
    var d = calculaMeioDoTriangulo([...a, ...b, ...c]);

    var nTex = config.triangulo * 3;
    var inicioTex = nodeInfosByName[
      `${selectedObject}`
    ].format.texcoord.data.slice(0, nTex * 2);
    var tempTex = nodeInfosByName[
      `${selectedObject}`
    ].format.texcoord.data.slice(nTex * 2, (nTex + 3) * 2);
    var restoTex = nodeInfosByName[
      `${selectedObject}`
    ].format.texcoord.data.slice(
      (nTex + 3) * 2,
      nodeInfosByName[`${selectedObject}`].format.texcoord.data.length
    );
    var at = tempTex.slice(0, 2);
    var bt = tempTex.slice(2, 4);
    var ct = tempTex.slice(4, 6);
    var dt = calculaMeioDaTextura([...at, ...bt, ...ct]);
    //arrays_pyramid.texcoord = [...inicioTex, ...restoTex];
    //console.log(`dt: ${dt}`);
    nodeInfosByName[`${selectedObject}`].format.texcoord.data = [...inicioTex];

    // arrays_pyramid.position = new Float32Array([
    //   ...arrays_pyramid.position,
    //   ...d,
    // ]);
    // console.log(`arrays_pyramid.position: ${arrays_pyramid.position}`);

    // var novotri = [...a, ...d, ...b];
    var novotri = [...b, ...d, ...a];
    var novatexcoord = [...bt, ...dt, ...at];

    console.log(`novotri: ${novotri}`);
    nodeInfosByName[`${selectedObject}`].format.position.data = [
      ...nodeInfosByName[`${selectedObject}`].format.position.data,
      ...novotri,
    ];
    nodeInfosByName[`${selectedObject}`].format.texcoord.data = [
      ...nodeInfosByName[`${selectedObject}`].format.texcoord.data,
      ...novatexcoord,
    ];

    // novotri = [...b, ...d, ...c];
    novotri = [...c, ...d, ...b];
    novatexcoord = [...ct, ...dt, ...bt];

    console.log(`novotri: ${novotri}`);
    nodeInfosByName[`${selectedObject}`].format.position.data = [
      ...nodeInfosByName[`${selectedObject}`].format.position.data,
      ...novotri,
    ];
    nodeInfosByName[`${selectedObject}`].format.texcoord.data = [
      ...nodeInfosByName[`${selectedObject}`].format.texcoord.data,
      ...novatexcoord,
    ];

    // novotri = [...c, ...d, ...a];
    novotri = [...a, ...d, ...c];
    novatexcoord = [...at, ...dt, ...ct];

    console.log(`novotri: ${novotri}`);
    nodeInfosByName[`${selectedObject}`].format.position.data = [
      ...nodeInfosByName[`${selectedObject}`].format.position.data,
      ...novotri,
    ];
    nodeInfosByName[`${selectedObject}`].format.texcoord.data = [
      ...nodeInfosByName[`${selectedObject}`].format.texcoord.data,
      ...novatexcoord,
    ];

    nodeInfosByName[`${selectedObject}`].format.position.data = [
      ...nodeInfosByName[`${selectedObject}`].format.position.data,
      ...resto,
    ];
    nodeInfosByName[`${selectedObject}`].format.texcoord.data = [
      ...nodeInfosByName[`${selectedObject}`].format.texcoord.data,
      ...restoTex,
    ];

    console.log(
      `position depois dos triangulos: ${
        nodeInfosByName[`${selectedObject}`].format.position.data
      }`
    );
    //console.log(arrays_pyramid.position.length);

    for (
      let index = 0;
      index <
      nodeInfosByName[`${selectedObject}`].format.position.data.length / 3;
      index++
    ) {
      newind = [...newind, index];
    }
    nodeInfosByName[`${selectedObject}`].format.indices.data = newind;

    //console.log(`indices: ${arrays_pyramid.indices}`);

    // console.log(`arrays_pyramid.position: ${arrays_pyramid.position}`);

    nodeInfosByName[`${selectedObject}`].format.normal.data = [];
    for (
      let index = 0;
      index < nodeInfosByName[`${selectedObject}`].format.normal.data;
      index++
    ) {
      nodeInfosByName[`${selectedObject}`].format.normal.data = [
        ...nodeInfosByName[`${selectedObject}`].format.normal.data,
        0,
      ];
    }
    nodeInfosByName[`${selectedObject}`].format.normal.data = calculateNormal(
      nodeInfosByName[`${selectedObject}`].format.position.data,
      nodeInfosByName[`${selectedObject}`].format.indices.data
    );
    //mapTexture();
    nodeInfosByName[`${selectedObject}`].node.drawInfo.bufferInfo =
      twgl.createBufferInfoFromArrays(
        gl,
        nodeInfosByName[`${selectedObject}`].format
      );

    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};
    scene = makeNode(objeto);
    objects.forEach(function (object) {
      object.drawInfo.uniforms.u_texture = tex[config.textura];
    });

    listOfVertices = [];
    for (
      let index = 0;
      index <
      nodeInfosByName[`${selectedObject}`].format.position.data.length / 3;
      index++
    ) {
      listOfVertices = [...listOfVertices, index];
    }

    gui.destroy();
    gui = null;
  },
  //time: 0.0,
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
  luzx: 5.8,
  luzy: 4.5,
  luzz: 8.1,
  shininess: 300.0,
  camera_1: false,
  camera_2: false,
  camera_3: false,
  luzIndex: 0,
  tx: 0,
  ty: 0,
  tz: 0,
  textura: "rochosa",
  vertice2: 0,
  coordv: 0,
  coordu: 0,
  obj: 0,
};

var folder_vertice;
var folder_camera;
var folder_matrix;
var folder_luz;
var folder_triangulo;
var folder_coordTex;

//fixed cameras variables
var cam1Position = [4, 4, 10];
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
  folder_matrix.add(config, "x", -10, 10, 0.5);
  folder_matrix.add(config, "y", -10, 10, 0.5);
  folder_matrix.add(config, "z", -10, 10, 0.5);

  folder_matrix.add(config, "rotate_x", -1000, 1000, 0.01);
  folder_matrix.add(config, "rotate_y", -1000, 1000, 0.01);
  folder_matrix.add(config, "spin");

  folder_matrix.add(config, "scalex", -10, 10, 0.1);
  folder_matrix.add(config, "scaley", -10, 10, 0.1);
  folder_matrix.add(config, "scalez", -10, 10, 0.1);

  folder_camera
    .add(config, "camera_1")
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
      config.camera_1 = false;
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
      config.camera_1 = false;
      config.camera_2 = false;
      config.camera_x = cam3Position[0];
      config.camera_y = cam3Position[1];
      config.camera_z = cam3Position[2];
      gui.updateDisplay();
    });

  folder_camera.add(config, "camera_x", -50, 50, 0.01).onChange(function () {
    if (config.camera_1) cam1Position[0] = config.camera_x;
    else if (config.camera_2) cam2Position[0] = config.camera_x;
    else if (config.camera_3) cam3Position[0] = config.camera_x;
  });
  folder_camera.add(config, "camera_y", -50, 50, 0.01).onChange(function () {
    if (config.camera_1) cam1Position[1] = config.camera_y;
    else if (config.camera_2) cam2Position[1] = config.camera_y;
    else if (config.camera_3) cam3Position[1] = config.camera_y;
  });
  folder_camera.add(config, "camera_z", -50, 50, 0.01).onChange(function () {
    if (config.camera_1) cam1Position[2] = config.camera_z;
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
  folder_triangulo.add(config, "criarVertice");
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
  folder_luz.add(config, "luzIndex", listOfLights).onChange(function () {
    config.luzx = arrLuz[config.luzIndex].position.x;
    config.luzy = arrLuz[config.luzIndex].position.y;
    config.luzz = arrLuz[config.luzIndex].position.z;
    palette.corLuz = arrLuz[config.luzIndex].color;
    palette.corSpec = arrLuz[config.luzIndex].spec;

    gui.updateDisplay();
  });
  folder_luz.add(config, "luzx", -20, 20, 0.01).onChange(function () {
    arrLuz[config.luzIndex].position.x = config.luzx;
  });
  folder_luz.add(config, "luzy", -20, 20, 0.01).onChange(function () {
    arrLuz[config.luzIndex].position.y = config.luzy;
  });
  folder_luz.add(config, "luzz", -20, 20, 0.01).onChange(function () {
    arrLuz[config.luzIndex].position.z = config.luzz;
  });
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

  folder_luz.add(config, "textura", listTex).onChange(function () {
    objects.forEach(function (object) {
      object.drawInfo.uniforms.u_texture = tex[config.textura];
    });
  });
  folder_luz.addColor(palette, "corLuz").onChange(function () {
    arrLuz[config.luzIndex].color = palette.corLuz;
  });

  folder_luz.addColor(palette, "corSpec").onChange(function () {
    arrLuz[config.luzIndex].spec = palette.corSpec;
  });
  gui.add(config, "obj", listOfObjects).onChange(function () {
    selectedObject = config.obj;
    config.scalex = nodeInfosByName[`${selectedObject}`].trs.scale[0];
    config.scaley = nodeInfosByName[`${selectedObject}`].trs.scale[1];
    config.scalez = nodeInfosByName[`${selectedObject}`].trs.scale[2];
    config.x = nodeInfosByName[`${selectedObject}`].trs.translation[0];
    config.y = nodeInfosByName[`${selectedObject}`].trs.translation[1];
    config.z = nodeInfosByName[`${selectedObject}`].trs.translation[2];
    config.rotate_x = nodeInfosByName[`${selectedObject}`].trs.rotation[0];
    config.rotate_y = nodeInfosByName[`${selectedObject}`].trs.rotation[1];

    gui.updateDisplay();
    // gui = null;
  });
  gui.add(config, "adicionaCubo");
};
