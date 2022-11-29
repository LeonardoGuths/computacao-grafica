const calculateBarycentric = (length) => {
  const n = length / 9;
  const barycentric = [];
  for (let i = 0; i < n; i++) barycentric.push(1, 0, 0, 0, 1, 0, 0, 0, 1);
  return new Float32Array(barycentric);
};

const degToRad = (d) => (d * Math.PI) / 180;

const radToDeg = (r) => (r * 180) / Math.PI;

const calculaMeioDoTriangulo = (arr) => {
  const x = (arr[0] + arr[3] + arr[6]) / 3;
  const y = (arr[1] + arr[4] + arr[7]) / 3;
  const z = (arr[2] + arr[5] + arr[8]) / 3;

  return [x, y, z];
};

const calculaMeioDaTextura = (arr) => {
  const u = (arr[0] + arr[2] + arr[4]) / 3;
  const v = (arr[1] + arr[3] + arr[5]) / 3;
  return [u, v];
};

const crossProduct = (a, b) => {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
};

const somaNormal = (v, n) => {
  return [v[0] + n[0], v[1] + n[1], v[2] + n[2]];
};

const calculaMeioDoTrianguloIndices = (arr) => {
  // arr contem os indices dos vertices q formam o triangulo que quero adicionar um vertice no meio
  const x =
    (arrays_pyramid.position[arr[0] * 3] +
      arrays_pyramid.position[arr[1] * 3] +
      arrays_pyramid.position[arr[2] * 3]) /
    3;
  const y =
    (arrays_pyramid.position[arr[0] * 3 + 1] +
      arrays_pyramid.position[arr[1] * 3 + 1] +
      arrays_pyramid.position[arr[2] * 3 + 1]) /
    3;
  const z =
    (arrays_pyramid.position[arr[0] * 3 + 2] +
      arrays_pyramid.position[arr[1] * 3 + 2] +
      arrays_pyramid.position[arr[2] * 3 + 2]) /
    3;

  return [x, y, z];
};

const compareArray = (array1, array2) =>
  array1[0] == array2[0] && array1[1] == array2[1] && array1[2] == array2[2];

const alreadyExist = (array, index) =>
  (exist = array.find((item) => item == index));

const mapAllVertices = (position, indices) => {
  let mapVertices = {};

  let pontos = [],
    faces = [];

  for (let i = 0; i < position.length; i += 3) {
    pontos.push([position[i], position[i + 1], position[i + 2]]);
  }

  for (let i = 0; i < indices.length; i += 3) {
    faces.push([indices[i], indices[i + 1], indices[i + 2]]);
  }

  let batata = {};

  for (let i = 0, j = 0; i < position.length; i += 3, j++) {
    mapVertices[j] = [j];
    batata[j] = [];
  }

  for (let index in mapVertices) {
    faces.map((item) => {
      item.map((vertice) => {
        if (compareArray(pontos[mapVertices[index]], pontos[vertice]))
          if (!alreadyExist(batata[index], vertice))
            batata[index].push(vertice);

        return batata;
      });
    });
  }

  return batata;
};

const computeMatrix = (matrix, config) => {
  matrix.trs.translation = [config.x, config.y, config.z];
  matrix.trs.rotation = [
    degToRad(config.rotate_x),
    degToRad(config.rotate_y),
    degToRad(0),
  ];
  matrix.trs.scale = [config.scalex, config.scaley, config.scalez];
};

const computeMatrixCuboVertice = (matrix, config) => {
  matrix.trs.translation = [config.vx, config.vy, config.vz];
  matrix.trs.rotation = [degToRad(0), degToRad(0), degToRad(0)];
  matrix.trs.scale = [0.1, 0.1, 0.1];
};
const convertToZeroOne = (old_value, old_min, old_max) => {
  return (old_value - old_min) / (old_max - old_min);
};

const mapTexture = () => {
  //console.log(arrays_pyramid.texcoord);
  var count = 0;
  for (let i = 0; i < arrays_pyramid.position.length; i = i + 3) {
    if (arrays_pyramid.normal[i] != 0) {
      // se x diff de zero
      arrays_pyramid.texcoord[count] = arrays_pyramid.position[i + 2];
      arrays_pyramid.texcoord[count + 1] = arrays_pyramid.position[i + 1];
    } else {
      if (arrays_pyramid.normal[i + 1] != 0) {
        // se y diff
        arrays_pyramid.texcoord[count] = arrays_pyramid.position[i + 2];
        arrays_pyramid.texcoord[count + 1] = arrays_pyramid.position[i];
      } else {
        arrays_pyramid.texcoord[count] = arrays_pyramid.position[i + 1];
        arrays_pyramid.texcoord[count + 1] = arrays_pyramid.position[i];
      }
    }
    count += 2;
  }
  //console.log(arrays_pyramid.texcoord);
};

const moveVertice = function () {
  var n = config.vertice;
  var mapVertices = mapAllVertices(
    nodeInfosByName[`${selectedObject}`].format.position.data,
    nodeInfosByName[`${selectedObject}`].format.indices.data
  );
  var temp = mapVertices[n];

  for (let index = 0; index < temp.length; index++) {
    nodeInfosByName[`${selectedObject}`].format.position.data[temp[index] * 3] =
      config.vx;
    nodeInfosByName[`${selectedObject}`].format.position.data[
      temp[index] * 3 + 1
    ] = config.vy;
    nodeInfosByName[`${selectedObject}`].format.position.data[
      temp[index] * 3 + 2
    ] = config.vz;
  }

  nodeInfosByName[`${selectedObject}`].format.normal.data = calculateNormal(
    nodeInfosByName[`${selectedObject}`].format.position.data,
    nodeInfosByName[`${selectedObject}`].format.indices.data
  );
  // cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, nodeInfosByName[`${selectedObject}`].format);
  nodeInfosByName[`${selectedObject}`].node.drawInfo.bufferInfo =
    twgl.createBufferInfoFromArrays(
      gl,
      nodeInfosByName[`${selectedObject}`].format
    );

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};
  //objeto.children.texture = tex[config.textura];
  //console.log(objeto);
  scene = makeNode(objeto);
  objects.forEach(function (object) {
    object.drawInfo.uniforms.u_texture = tex[config.textura];
  });
};

const moveTriangulo = function () {
  var n = config.triangulo;
  var mapVertices = mapAllVertices(
    nodeInfosByName[`${selectedObject}`].format.position.data,
    nodeInfosByName[`${selectedObject}`].format.indices.data
  );
  var temp = [
    ...mapVertices[n * 3],
    ...mapVertices[n * 3 + 3],
    ...mapVertices[n * 3 + 6],
  ];

  temp = [...new Set(temp)];

  for (let index = 0; index < temp.length; index++) {
    nodeInfosByName[`${selectedObject}`].format.position.data[
      temp[index] * 3
    ] += config.tx;
    nodeInfosByName[`${selectedObject}`].format.position.data[
      temp[index] * 3 + 1
    ] += config.ty;
    nodeInfosByName[`${selectedObject}`].format.position.data[
      temp[index] * 3 + 2
    ] += config.tz;
  }

  arrays_pyramid.normal = calculateNormal(
    nodeInfosByName[`${selectedObject}`].format.position.data,
    nodeInfosByName[`${selectedObject}`].format.indices.data
  );
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
};

const createArray = (type) => {
  const copyFormat =
    type == "cube"
      ? JSON.parse(JSON.stringify(arrays_cube6))
      : JSON.parse(JSON.stringify(pyramidFormat));

  let cubeNormal = calculateNormal(copyFormat.position, copyFormat.indices);

  const newArray = {
    position: { numComponents: 3, data: copyFormat.position },
    indices: { numComponents: 3, data: copyFormat.indices },
    normal: { numComponents: 3, data: cubeNormal },
    texcoord: { numComponents: 2, data: copyFormat.texcoord },
  };

  newArray.barycentric = calculateBarycentric(newArray.position.data.length);

  return newArray;
};

var ypos,
  zpos = 0;

function addCubo() {
  const updatedValues = objeto.children.map((item) => {
    let name = item.name;

    item.translation = nodeInfosByName[name].trs.translation;
    item.rotation = nodeInfosByName[name].trs.rotation;
    item.format = nodeInfosByName[name].format;
    return item;
  });

  objeto.children = [...updatedValues];

  const newArray = createArray("cube");

  zpos -= 2;

  objeto.children.push({
    name: `${index}`,
    draw: true,
    type: "cube",
    translation: [0, 0, zpos],
    rotation: [degToRad(0), degToRad(0), degToRad(0)],
    format: newArray,
    texture: tex.spaceinvaderW,
    children: [],
  });
  console.log(nodeInfosByName);
  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  scene = makeNode(objeto);
  console.log(nodeInfosByName);

  listOfObjects.push(`${index}`);

  index += 1;
  //console.log(nodeInfosByName);
  //console.log(objectsToDraw);

  gui.destroy();
  gui = null;
}

const checkColision = (obj, shot) => {
  var size = 1.3; // size representa o raio do sceneDescription

  // testa se y é positivo
  if (shot[1] >= 0) {
    if (shot[0] > obj[0] - size && shot[0] < obj[0] + size) {
      if (shot[1] > obj[1] - size) {
        //colidiu
        console.log("colidiu+");
        return true;
      }
    }
  } else {
    if (shot[0] > obj[0] - size && shot[0] < obj[0] + size) {
      if (shot[1] > obj[1] + size) {
        //colidiu
        console.log("colidiu-");

        return true;
      }
    }
  }
  return false;
};

const checkColision2 = (obj, shot) => {
  if (
    shot[0] < obj[0] + 1.5 &&
    shot[0] + 1.5 > obj[0] &&
    shot[1] < obj[1] + 1.5 &&
    1.5 + shot[1] > obj[1]
  ) {
    return true;
  } else {
    return false;
  }
};

const checkColision3 = (obj, shot) => {
  if (
    shot[0] < obj[0] + 0.5 &&
    shot[0] + 0.5 > obj[0] &&
    shot[1] < obj[1] + 1.5 &&
    1.5 + shot[1] > obj[1]
  ) {
    return true;
  } else {
    return false;
  }
};

const computeMatrixPlayer = (player, tiro) => {
  if (checkColision2(player.trs.translation, tiro.trs.translation)) {
    removerTiro(tiro);
    youLose = true;
    console.log("PERDEU");
  }
};

const computeMatrixShots = (tiro, tiro_i) => {
  if (checkColision3(tiro.trs.translation, tiro_i.trs.translation)) {
    removerTiro(tiro);
    tiro_i.trs.translation[1] = 9990;
  }
};

const computeMatrixEnemy = (nodes, tiro, enemiesKilled) => {
  for (let index = 0; index < 14; index++) {
    enemyTranslation = [
      nodes[`space_invader_${index}`].trs.translation[0] +
        nodes[`space_invaders`].trs.translation[0],
      nodes[`space_invader_${index}`].trs.translation[1],
      nodes[`space_invader_${index}`].trs.translation[2],
    ];
    if (checkColision2(enemyTranslation, tiro.trs.translation)) {
      removerTiro(tiro);
      nodes[`space_invader_${index}`].trs.translation[1] = -9999;
      enemiesKilled[0] += 1;
      console.log(enemiesKilled[0]);
    }
  }
};

const computeMatrixBarrier = (nodes, tiro, barreiraLife) => {
  for (let index = 0; index < 4; index++) {
    if (
      checkColision2(
        nodes[`barreira${index}`].trs.translation,
        tiro.trs.translation
      )
    ) {
      removerTiro(tiro);
      arrLuz[2].color = [0, 0, 0];

      barreiraLife[index] -= 1;

      if (index == 0 || index == 2) {
        if (barreiraLife[index] == 2) {
          nodes[`barreira${index}`].node.drawInfo.uniforms.u_texture =
            tex.barrier2_1;
        } else if (barreiraLife[index] == 1) {
          nodes[`barreira${index}`].node.drawInfo.uniforms.u_texture =
            tex.barrier2_2;
        } else if (barreiraLife[index] <= 0) {
          nodes[`barreira${index}`].trs.translation[1] = -9999;
        }
      } else {
        if (barreiraLife[index] == 2) {
          nodes[`barreira${index}`].node.drawInfo.uniforms.u_texture =
            tex.barrier1_1;
        } else if (barreiraLife[index] == 1) {
          nodes[`barreira${index}`].node.drawInfo.uniforms.u_texture =
            tex.barrier1_2;
        } else if (barreiraLife[index] <= 0) {
          nodes[`barreira${index}`].trs.translation[1] = -9999;
        }
      }
      console.log(barreiraLife);
      // objectsToDraw = [];
      // objects = [];
      // nodeInfosByName = {};
      // scene = makeNode(objeto);
    }
  }
};

const removerTiro = (tiro) => {
  tiro.trs.translation[1] = 9999;
  // arrLuz[2].color = [0, 0, 0];
};

canvas.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "ArrowRight":
      nodeInfosByName["player"].trs.translation[0] += 0.5;
      break;
    case "ArrowLeft":
      nodeInfosByName["player"].trs.translation[0] -= 0.5;
      break;
    case " ":
      darTiro = true;
      break;

    default:
      console.log(e.key);
      break;
  }
});
