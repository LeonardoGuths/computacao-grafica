"use strict";

var teste = 1;
var gui;
var qtd_triangulos = 0;

var VAO;
var cubeBufferInfo;
var objectsToDraw = [];
var objects = [];
var nodeInfosByName = {};
var scene;
var objeto = {};
var countF = 0;
var countC = 0;
var programInfo;
var wireframe = false;
var arrays_pyramid;
var gl;
var aspect;
var projectionMatrix;
var cameraMatrix;
var viewMatrix;
var viewProjectionMatrix = degToRad(0);
var adjust;
var speed;
var c;
var fieldOfViewRadians;
var temp;
var listOfVertices = [];
var listOfLights = [0, 1, 2];
var palette = {
  corLuz: [255, 255, 255], // RGB array
  corCubo: [255, 255, 255], // RGB array
  corSpec: [255, 255, 255], // RGB array
};
var tex;
var selectedCamera = 0;
var deltaTime = 0;
var then;
var selectedObject = 0;
var listOfObjects = [0];
var index = 1;
var darTiro = false;
var startTiro = true;
var barreiraLife = [3, 3, 3, 3];
var praEsquerda = false;
var chanceDeAtirar = 0;
var inimigoAtirou = false;
var startTiroInimigo = true;
var inimigoAtirador = 0;
var atingiuBarreira = false;
var atingiuTiro = false;
var youLose = false;
var enemiesKilled = [0];
var listTex = ["spaceship", "valeu"];
var enemyListTex = [
  "spaceinvaderW",
  "spaceinvader2",
  "cg_book",
  "wireframeW",
  "toto",
];

let youwinAudio = new Audio(
  "http://127.0.0.1:5500/space%20invaders/index.html"
);

var arrLuz = [
  new Luz([0, 2.25, 20], [100, 100, 100], [255, 255, 255], 5000),
  new Luz([0, -20, 20], [255, 255, 255], [255, 255, 255], 5000),
  new Luz([0, -20, 0], [0, 0, 0], [255, 255, 255], 5000),
];

//CAMERA VARIABLES
var cameraPosition;
var target;
var up;

function makeNode(nodeDescription) {
  var trs = new TRS();
  var node = new Node(trs);
  nodeInfosByName[nodeDescription.name] = {
    trs: trs,
    node: node,
    format: nodeDescription.format,
  };
  trs.translation = nodeDescription.translation || trs.translation;
  trs.rotation = nodeDescription.rotation || trs.rotation;
  if (nodeDescription.draw !== false) {
    const bufferInfo = twgl.createBufferInfoFromArrays(
      gl,
      nodeDescription.format
    );

    const vertexArray = twgl.createVAOFromBufferInfo(
      gl,
      programInfo,
      bufferInfo
    );
    node.drawInfo = {
      uniforms: {
        u_color: [0.4, 0.4, 0.4, 1],
        u_texture: nodeDescription.texture,
      },
      format: nodeDescription.format,
      programInfo: programInfo,
      bufferInfo: bufferInfo,
      vertexArray: vertexArray,
      boundingBox: nodeDescription.boundingBox,
    };

    objectsToDraw.push(node.drawInfo);
    objects.push(node);
  }
  makeNodes(nodeDescription.children).forEach(function (child) {
    child.setParent(node);
  });
  return node;
}

function makeNodes(nodeDescriptions) {
  return nodeDescriptions ? nodeDescriptions.map(makeNode) : [];
}
function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  tex = twgl.createTextures(gl, {
    spaceinvaderW: {
      src: "./texture/spaceinvaderW.png",
    },
    spaceinvader2: {
      src: "./texture/spaceinvader2.png",
    },
    toto: {
      src: "./texture/toto.jpg",
    },
    credito: {
      src: "./texture/credito.png",
    },
    credito2: {
      src: "./texture/credito2.png",
    },
    credito3: {
      src: "./texture/credito3.png",
    },
    credito4: {
      src: "./texture/credito4.png",
    },
    wireframeW: {
      src: "./texture/wireframeW.png",
    },
    spaceship: {
      src: "./texture/spaceship.png",
    },
    cg_book: {
      src: "./texture/cg_book.png",
    },
    valeu: {
      src: "./texture/valeu.png",
    },
    barrier1: {
      src: "./texture/barrier1.png",
    },
    barrier1_1: {
      src: "./texture/barrier1_1.png",
    },
    barrier1_2: {
      src: "./texture/barrier1_2.png",
    },
    barrier2: {
      src: "./texture/barrier2.png",
    },
    barrier2_1: {
      src: "./texture/barrier2_1.png",
    },
    barrier2_2: {
      src: "./texture/barrier2_2.png",
    },
    shot: {
      src: "./texture/shot.png",
    },
    shot_i: {
      src: "./texture/shot_i.png",
    },
    you_died: {
      src: "./texture/you_died.png",
    },
    venceu: {
      src: "./texture/venceu.jpg",
    },
  });
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

  // loadGUI(gl);

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");

  //cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 1);
  //console.log(arrays_cube5.position.reverse());
  // var buf = [];
  // for (let index = 0; index < arrays_cube5.position.length; index = index + 3) {
  //   buf = [
  //     arrays_cube5.position[index],
  //     arrays_cube5.position[index + 1],
  //     arrays_cube5.position[index + 2],
  //     ...buf,
  //   ];
  // }
  //console.log(`${buf}`);

  arrays_pyramid = arrays_cube6;

  arrays_pyramid.barycentric = calculateBarycentric(
    arrays_pyramid.position.length
  );

  arrays_pyramid.normal = calculateNormal(
    arrays_pyramid.position,
    arrays_pyramid.indices
  );

  cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_pyramid);

  // setup GLSL program

  programInfo = twgl.createProgramInfo(gl, [vs3luz, fs3luz]);
  //console.log(programInfo);

  VAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);

  listOfVertices = arrays_pyramid.indices;

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  fieldOfViewRadians = degToRad(60);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};
  const arrayCube = createArray("cube");
  console.log(arrayCube);

  // World object with all the nodes
  objeto = {
    name: "Center of the world",
    draw: false,
    children: [
      {
        name: "space_invaders",
        draw: false,
        translation: [0, 0, 0],
        children: [
          {
            name: "space_invader_0",
            draw: true,
            translation: [-7.5, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvaderW,
            format: arrayCube,
          },
          {
            name: "space_invader_1",
            draw: true,
            translation: [-5.0, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvaderW,
            format: arrayCube,
          },
          {
            name: "space_invader_2",
            draw: true,
            translation: [-2.5, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvaderW,
            format: arrayCube,
          },
          {
            name: "space_invader_3",
            draw: true,
            translation: [0.0, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvaderW,
            format: arrayCube,
          },
          {
            name: "space_invader_4",
            draw: true,
            translation: [2.5, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvaderW,
            format: arrayCube,
          },
          {
            name: "space_invader_5",
            draw: true,
            translation: [5.0, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvaderW,
            format: arrayCube,
          },
          {
            name: "space_invader_6",
            draw: true,
            translation: [7.5, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvaderW,
            format: arrayCube,
          },
          {
            name: "space_invader_7",
            draw: true,
            translation: [-7.5, 2.5, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvader2,
            format: arrayCube,
          },
          {
            name: "space_invader_8",
            draw: true,
            translation: [-5.0, 2.5, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvader2,
            format: arrayCube,
          },
          {
            name: "space_invader_9",
            draw: true,
            translation: [-2.5, 2.5, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvader2,
            format: arrayCube,
          },
          {
            name: "space_invader_10",
            draw: true,
            translation: [0.0, 2.5, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvader2,
            format: arrayCube,
          },
          {
            name: "space_invader_11",
            draw: true,
            translation: [2.5, 2.5, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvader2,
            format: arrayCube,
          },
          {
            name: "space_invader_12",
            draw: true,
            translation: [5.0, 2.5, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvader2,
            format: arrayCube,
          },
          {
            name: "space_invader_13",
            draw: true,
            translation: [7.5, 2.5, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
            texture: tex.spaceinvader2,
            format: arrayCube,
          },
        ],
      },
      {
        name: "player",
        draw: true,
        translation: [0, -20, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.spaceship,
        format: arrayCube,
      },
      {
        name: "barreira0",
        draw: true,
        translation: [-5, -15, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.barrier2,
        format: arrayCube,
      },
      {
        name: "barreira1",
        draw: true,
        translation: [-3, -15, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.barrier1,
        format: arrayCube,
      },
      {
        name: "barreira2",
        draw: true,
        translation: [3, -15, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.barrier2,
        format: arrayCube,
      },
      {
        name: "barreira3",
        draw: true,
        translation: [5, -15, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.barrier1,
        format: arrayCube,
      },
      {
        name: "tiro",
        draw: true,
        translation: [0, 9999, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.shot,
        format: arrayCube,
      },
      {
        name: "tiro_i",
        draw: true,
        translation: [0, 9999, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.shot_i,
        format: arrayCube,
      },
      {
        name: "endgame",
        draw: true,
        translation: [72, 72, 72],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.venceu,
        format: arrayCube,
      },
      {
        name: "creditos1",
        draw: true,
        translation: [14.5, -25, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.credito,
        format: arrayCube,
      },
      {
        name: "creditos2",
        draw: true,
        translation: [18, -25, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.credito2,
        format: arrayCube,
      },
      {
        name: "creditos3",
        draw: true,
        translation: [21.5, -25, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.credito3,
        format: arrayCube,
      },
      {
        name: "creditos4",
        draw: true,
        translation: [25, -25, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
        texture: tex.credito4,
        format: arrayCube,
      },
    ],
  };

  console.log(objeto);
  scene = makeNode(objeto);
  console.log(objectsToDraw);

  objects.forEach(function (object) {
    object.drawInfo.uniforms.u_lightWorldPosition0 = [
      arrLuz[0].position.x,
      arrLuz[0].position.y,
      arrLuz[0].position.z,
    ];
    object.drawInfo.uniforms.u_lightWorldPosition1 = [
      arrLuz[1].position.x,
      arrLuz[1].position.y,
      arrLuz[1].position.z,
    ];
    object.drawInfo.uniforms.u_lightWorldPosition2 = [
      arrLuz[2].position.x,
      arrLuz[2].position.y,
      arrLuz[2].position.z,
    ];

    object.drawInfo.uniforms.u_lightColor0 = [
      convertToZeroOne(arrLuz[0].color[0], 0, 255),
      convertToZeroOne(arrLuz[0].color[1], 0, 255),
      convertToZeroOne(arrLuz[0].color[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_lightColor1 = [
      convertToZeroOne(arrLuz[1].color[0], 0, 255),
      convertToZeroOne(arrLuz[1].color[1], 0, 255),
      convertToZeroOne(arrLuz[1].color[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_lightColor2 = [
      convertToZeroOne(arrLuz[2].color[0], 0, 255),
      convertToZeroOne(arrLuz[2].color[1], 0, 255),
      convertToZeroOne(arrLuz[2].color[2], 0, 255),
    ];

    object.drawInfo.uniforms.u_specularColor0 = [
      convertToZeroOne(arrLuz[0].spec[0], 0, 255),
      convertToZeroOne(arrLuz[0].spec[1], 0, 255),
      convertToZeroOne(arrLuz[0].spec[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_specularColor1 = [
      convertToZeroOne(arrLuz[1].spec[0], 0, 255),
      convertToZeroOne(arrLuz[1].spec[1], 0, 255),
      convertToZeroOne(arrLuz[1].spec[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_specularColor2 = [
      convertToZeroOne(arrLuz[2].spec[0], 0, 255),
      convertToZeroOne(arrLuz[2].spec[1], 0, 255),
      convertToZeroOne(arrLuz[2].spec[2], 0, 255),
    ];
  });
  //temp = mapAllVertices(arrays_pyramid.position, arrays_pyramid.indices);
  //console.log(mapAllVertices(arrays_pyramid.position, arrays_pyramid.indices));
  //cameraPosition = [4, 4, 10];
  // cameraPosition = arrCameras[0].cameraPosition;
  cameraPosition = [0, -10, 30];
  target = [0, -10, 0];
  up = [0, 1, 0];

  const temp = arrays_pyramid.position.slice(
    config.vertice * 3,
    config.vertice * 3 + 3
  );

  config.vx = temp[0];
  config.vy = temp[1];
  config.vz = temp[2];
  //mapTexture();
  requestAnimationFrame(drawScene);
  //console.log(objects);
  // Draw the scene.
}

function drawScene(now) {
  now *= 0.001;
  deltaTime = now - then;
  then = now;
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  listOfVertices = arrays_pyramid.indices;

  if (gui == null) loadGUI(gl);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // Compute the projection matrix
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);
  // Compute the camera's matrix using look at.
  if (youLose || enemiesKilled[0] >= 14) {
    if (youLose)
      nodeInfosByName["endgame"].node.drawInfo.uniforms.u_texture =
        tex.you_died;

    if (enemiesKilled >= 14) {
    }

    cameraPosition[0] = 72;
    cameraPosition[1] = 72;
    cameraPosition[2] = 78;

    arrLuz[1].position.x = 2000;
    arrLuz[1].position.y = 2000;
    arrLuz[1].position.z = 5000;
    arrLuz[1].shine = 99999;
    arrLuz[0].color = [0, 0, 0];
    arrLuz[2].color = [0, 0, 0];

    nodeInfosByName["endgame"].trs.rotation[1] = now / 5;

    target = [70, 75, 0];
    nodeInfosByName["endgame"].trs.scale[0] = 1.75;
    nodeInfosByName["endgame"].trs.scale[1] = 1.75;
    nodeInfosByName["endgame"].trs.scale[2] = 0.15;
  } else if (config.modo_fps) {
    cameraPosition[0] = nodeInfosByName["player"].trs.translation[0];

    if (cameraPosition[1] > -22) cameraPosition[1] -= 0.5;
    if (cameraPosition[1] < -22) cameraPosition[1] += 0.5;

    if (cameraPosition[2] > 2) cameraPosition[2] -= 0.5;
    if (cameraPosition[2] < 2) cameraPosition[2] += 0.5;

    target = [nodeInfosByName["player"].trs.translation[0], -10, 0];
  } else {
    if (cameraPosition[0] > cam1Position[0]) cameraPosition[0] -= 0.5;
    if (cameraPosition[0] < cam1Position[0]) cameraPosition[0] += 0.5;

    if (cameraPosition[1] > cam1Position[1]) cameraPosition[1] -= 0.5;
    if (cameraPosition[1] < cam1Position[1]) cameraPosition[1] += 0.5;

    if (cameraPosition[2] > cam1Position[2]) cameraPosition[2] -= 0.5;
    if (cameraPosition[2] < cam1Position[2]) cameraPosition[2] += 0.5;

    target = [0, -10, 0];
  }

  up = [0, 1, 0];
  cameraMatrix = m4.lookAt(cameraPosition, target, up);

  // Make a view matrix from the camera matrix.
  viewMatrix = m4.inverse(cameraMatrix);

  viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  if (darTiro) {
    if (startTiro) {
      startTiro = false;
      arrLuz[2].color = [255, 0, 0];

      nodeInfosByName["tiro"].trs.translation = [
        nodeInfosByName["player"].trs.translation[0],
        nodeInfosByName["player"].trs.translation[1],
        nodeInfosByName["player"].trs.translation[2],
      ];
    }

    if (nodeInfosByName["tiro"].trs.translation[1] < 15)
      nodeInfosByName["tiro"].trs.translation[1] += 0.5;

    if (nodeInfosByName["tiro"].trs.translation[1] >= 15) {
      darTiro = false;
      startTiro = true;
      removerTiro(nodeInfosByName["tiro"]);
      arrLuz[2].color = [0, 0, 0];
    }
  }

  if (!inimigoAtirou) {
    chanceDeAtirar = Math.random();
    if (chanceDeAtirar > 0.98) inimigoAtirou = true;
  } else chanceDeAtirar = 0;

  // console.log(inimigoAtirou);

  if (inimigoAtirou && enemiesKilled < 14) {
    if (startTiroInimigo) {
      startTiroInimigo = false;
      // arrLuz[2].color = [255, 0, 0];

      inimigoAtirador = Math.floor(Math.random() * 14);
      console.log("el atirador: " + inimigoAtirador);
      nodeInfosByName["tiro_i"].trs.translation = [
        nodeInfosByName[`space_invader_${inimigoAtirador}`].trs.translation[0] +
          nodeInfosByName[`space_invaders`].trs.translation[0],
        nodeInfosByName[`space_invader_${inimigoAtirador}`].trs.translation[1] +
          nodeInfosByName[`space_invaders`].trs.translation[1],
        nodeInfosByName[`space_invader_${inimigoAtirador}`].trs.translation[2] +
          nodeInfosByName[`space_invaders`].trs.translation[2],
      ];
    }

    if (
      nodeInfosByName["tiro_i"].trs.translation[1] > -35 &&
      nodeInfosByName["tiro_i"].trs.translation[1] < 1000
    ) {
      nodeInfosByName["tiro_i"].trs.translation[1] -= 0.5;
      // console.log(nodeInfosByName["tiro_i"].trs.translation[1]);
      for (let index = 0; index < 4; index++) {
        if (
          checkColision2(
            nodeInfosByName[`barreira${index}`].trs.translation,
            nodeInfosByName["tiro_i"].trs.translation
          )
        ) {
          atingiuBarreira = true;
          nodeInfosByName["tiro_i"].trs.translation[1] -= 1;
          console.log("bati na barreira");
          // console.log(nodeInfosByName["tiro_i"].trs.translation[1]);
        }
      }
      if (
        checkColision3(
          nodeInfosByName["tiro"].trs.translation,
          nodeInfosByName["tiro_i"].trs.translation
        )
      ) {
        atingiuTiro = true;
      }
    }

    if (
      nodeInfosByName["tiro_i"].trs.translation[1] <= -35 ||
      atingiuBarreira ||
      atingiuTiro
    ) {
      // console.log("TESTE");
      inimigoAtirou = false;
      startTiroInimigo = true;
      atingiuBarreira = false;
      atingiuTiro = false;
      if (nodeInfosByName["tiro_i"].trs.translation[1] <= -35) {
        removerTiro(nodeInfosByName["tiro_i"]);
      }
    }
  }

  nodeInfosByName["tiro"].trs.scale = [0.2, 1, 0.2];
  nodeInfosByName["tiro_i"].trs.scale = [0.2, 1, 0.2];

  nodeInfosByName["creditos1"].trs.scale = [2, 1, 0.2];
  nodeInfosByName["creditos2"].trs.scale = [2, 1, 0.2];
  nodeInfosByName["creditos3"].trs.scale = [2, 1, 0.2];
  nodeInfosByName["creditos4"].trs.scale = [2, 1, 0.2];

  nodeInfosByName["creditos1"].trs.rotation[0] = now / 2;
  nodeInfosByName["creditos2"].trs.rotation[1] = now / 2;
  nodeInfosByName["creditos3"].trs.rotation[2] = now / 2;
  nodeInfosByName["creditos4"].trs.rotation[0] = now / 2;

  arrLuz[2].position.x = nodeInfosByName["tiro"].trs.translation[0];
  arrLuz[2].position.y = nodeInfosByName["tiro"].trs.translation[1];
  arrLuz[2].position.z = nodeInfosByName["tiro"].trs.translation[2];

  if (praEsquerda) {
    nodeInfosByName["space_invaders"].trs.translation[0] -= 0.05;

    if (nodeInfosByName["space_invaders"].trs.translation[0] < -5) {
      praEsquerda = false;
    }
  } else {
    nodeInfosByName["space_invaders"].trs.translation[0] += 0.05;

    if (nodeInfosByName["space_invaders"].trs.translation[0] > 5) {
      praEsquerda = true;
    }
  }

  adjust;
  speed = 3;

  computeMatrixEnemy(nodeInfosByName, nodeInfosByName["tiro"], enemiesKilled);
  computeMatrixBarrier(nodeInfosByName, nodeInfosByName["tiro"], barreiraLife);
  computeMatrixBarrier(
    nodeInfosByName,
    nodeInfosByName["tiro_i"],
    barreiraLife
  );
  computeMatrixPlayer(nodeInfosByName["player"], nodeInfosByName["tiro_i"]);
  computeMatrixShots(nodeInfosByName["tiro"], nodeInfosByName["tiro_i"]);

  // Update all world matrices in the scene graph
  scene.updateWorldMatrix();

  // Compute all the matrices for rendering
  objects.forEach(function (object) {
    object.drawInfo.uniforms.u_matrix = m4.multiply(
      viewProjectionMatrix,
      object.worldMatrix
    );
    object.drawInfo.uniforms.u_lightWorldPosition0 = [
      arrLuz[0].position.x,
      arrLuz[0].position.y,
      arrLuz[0].position.z,
    ];
    object.drawInfo.uniforms.u_lightWorldPosition1 = [
      arrLuz[1].position.x,
      arrLuz[1].position.y,
      arrLuz[1].position.z,
    ];
    object.drawInfo.uniforms.u_lightWorldPosition2 = [
      arrLuz[2].position.x,
      arrLuz[2].position.y,
      arrLuz[2].position.z,
    ];

    object.drawInfo.uniforms.u_lightColor0 = [
      convertToZeroOne(arrLuz[0].color[0], 0, 255),
      convertToZeroOne(arrLuz[0].color[1], 0, 255),
      convertToZeroOne(arrLuz[0].color[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_lightColor1 = [
      convertToZeroOne(arrLuz[1].color[0], 0, 255),
      convertToZeroOne(arrLuz[1].color[1], 0, 255),
      convertToZeroOne(arrLuz[1].color[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_lightColor2 = [
      convertToZeroOne(arrLuz[2].color[0], 0, 255),
      convertToZeroOne(arrLuz[2].color[1], 0, 255),
      convertToZeroOne(arrLuz[2].color[2], 0, 255),
    ];

    object.drawInfo.uniforms.u_color = [
      convertToZeroOne(palette["corCubo"][0], 0, 255),
      convertToZeroOne(palette["corCubo"][1], 0, 255),
      convertToZeroOne(palette["corCubo"][2], 0, 255),
      1,
    ];
    // console.log(object.drawInfo.uniforms.u_lightColor);
    // console.log(object.drawInfo.uniforms.u_color);
    object.drawInfo.uniforms.u_specularColor0 = [
      convertToZeroOne(arrLuz[0].spec[0], 0, 255),
      convertToZeroOne(arrLuz[0].spec[1], 0, 255),
      convertToZeroOne(arrLuz[0].spec[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_specularColor1 = [
      convertToZeroOne(arrLuz[1].spec[0], 0, 255),
      convertToZeroOne(arrLuz[1].spec[1], 0, 255),
      convertToZeroOne(arrLuz[1].spec[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_specularColor2 = [
      convertToZeroOne(arrLuz[2].spec[0], 0, 255),
      convertToZeroOne(arrLuz[2].spec[1], 0, 255),
      convertToZeroOne(arrLuz[2].spec[2], 0, 255),
    ];

    object.drawInfo.uniforms.u_color = [
      convertToZeroOne(palette["corCubo"][0], 0, 255),
      convertToZeroOne(palette["corCubo"][1], 0, 255),
      convertToZeroOne(palette["corCubo"][2], 0, 255),
      1,
    ];

    object.drawInfo.uniforms.u_lightColor0 = [
      convertToZeroOne(arrLuz[0].color[0], 0, 255),
      convertToZeroOne(arrLuz[0].color[1], 0, 255),
      convertToZeroOne(arrLuz[0].color[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_lightColor1 = [
      convertToZeroOne(arrLuz[1].color[0], 0, 255),
      convertToZeroOne(arrLuz[1].color[1], 0, 255),
      convertToZeroOne(arrLuz[1].color[2], 0, 255),
    ];

    object.drawInfo.uniforms.u_shininess0 = arrLuz[0].shine;
    object.drawInfo.uniforms.u_shininess1 = arrLuz[1].shine;
    object.drawInfo.uniforms.u_shininess2 = arrLuz[2].shine;

    object.drawInfo.uniforms.u_world = object.worldMatrix;

    object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(
      m4.inverse(object.worldMatrix)
    );

    object.drawInfo.uniforms.u_viewWorldPosition = cameraPosition;

    // object.drawInfo.uniforms.u_shininess = config.shininess;

    // object.drawInfo.uniforms.u_texture = tex[config.textura];
  });

  // ------ Draw the objects --------

  twgl.drawObjectList(gl, objectsToDraw);

  requestAnimationFrame(drawScene);
}

main();
