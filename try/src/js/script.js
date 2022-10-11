"use strict";

var vs = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fs = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;
uniform vec4 u_colorOffset;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult + u_colorOffset;
}
`;

var vsW = `
#version 300 es
	attribute vec2 a_position;
  attribute vec3 a_barycentric;
  uniform mat3 u_matrix;
  varying vec3 vbc;

void main() {
  vbc = a_barycentric;
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}
`;

var fsW = `#version 300 es
		precision mediump float;
		in vec3 vBaryCoord;

		out vec4 outColor;

		float edgeFactor(){
		    vec3 d = fwidth(vBaryCoord);
		    vec3 a3 = smoothstep(vec3(0.0), d*1.5, vBaryCoord);
		    return min(min(a3.x, a3.y), a3.z);
		}

		const float uLineWidth = 0.005;
		const float uFeather = 0.003;
		const vec4 uLineColor = vec4(0.0,0.0,0.0,1.0);
		const vec4 uFaceColor = vec4(0.5,0.5,0.5,0.8);

		void main(void){
			/*Simple idea of how to color the border*/
			if(any(lessThan(vBaryCoord, vec3(0.01)))){
			    outColor = uLineColor;
			}else{
			    outColor = uFaceColor;
			}
			
			//Set line width that always stays the same no matter the zoom.
			//outColor = mix(uLineColor, uFaceColor, edgeFactor());

			//How to set width and feathing, gets bigger/smaller based on zoom.
			//vec3 bcMix = smoothstep(vec3(uLineWidth),vec3(uLineWidth + uFeather),vBaryCoord);
			//float cmix = min(min(bcMix.x, bcMix.y), bcMix.z);
			//outColor = mix(uLineColor, uFaceColor, cmix);
		}
`;

const degToRad = (d) => (d * Math.PI) / 180;

const radToDeg = (r) => (r * 180) / Math.PI;

var config = {
  rotate: degToRad(20),
  x: 0,
  y: 0,
  z: 0,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  rotation: 0,
  anim: false,
  addCaixa: function () {
    countC++;

    objetoCubo.children.push({
      name: `cubo${countC}`,
      translation: [0, countC, 0],
    });

    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};
    scene = makeNode(objetoCubo);
    // scene = makeNode(objetoPiramide);
  },
  // addPiramide: function () {
  //   countP++;

  //   objetoPiramide.children.push({
  //     name: `piramide${countP}`,
  //     translation: [0, countP, 0],
  //   });

  //   objectsToDraw = [];
  //   objects = [];
  //   nodeInfosByName = {};
  //   scene = makeNode(objetoCubo);
  //   scene = makeNode(objetoPiramide);
  // },
};

const loadGUI = () => {
  const gui = new dat.GUI();
  gui.add(config, "rotate", 0, 20, 0.5);
  gui.add(config, "x", -10, 10, 0.5);
  gui.add(config, "y", -10, 10, 0.5);
  gui.add(config, "z", -10, 10, 0.5);
  gui.add(config, "scaleX", 0, 10, 0.1);
  gui.add(config, "scaleY", 0, 10, 0.1);
  gui.add(config, "scaleZ", 0, 10, 0.1);
  gui.add(config, "rotation", -1000, 1000, 10);
  gui.add(config, "anim");
  gui.add(config, "addCaixa");

  // gui.add(config, "addPiramide");
};

var TRS = function () {
  this.translation = [0, 0, 0];
  this.rotation = [0, 0, 0];
  this.scale = [1, 1, 1];
};

TRS.prototype.getMatrix = function (dst) {
  dst = dst || new Float32Array(16);
  var t = this.translation;
  var r = this.rotation;
  var s = this.scale;

  // compute a matrix from translation, rotation, and scale
  m4.translation(t[0], t[1], t[2], dst);
  m4.xRotate(dst, r[0], dst);
  m4.yRotate(dst, r[1], dst);
  m4.zRotate(dst, r[2], dst);
  m4.scale(dst, s[0], s[1], s[2], dst);
  return dst;
};

var Node = function (source) {
  this.children = [];
  this.localMatrix = m4.identity();
  this.worldMatrix = m4.identity();
  this.source = source;
};

Node.prototype.setParent = function (parent) {
  // remove us from our parent
  if (this.parent) {
    var ndx = this.parent.children.indexOf(this);
    if (ndx >= 0) {
      this.parent.children.splice(ndx, 1);
    }
  }

  // Add us to our new parent
  if (parent) {
    parent.children.push(this);
  }
  this.parent = parent;
};

Node.prototype.updateWorldMatrix = function (matrix) {
  var source = this.source;
  if (source) {
    source.getMatrix(this.localMatrix);
  }

  if (matrix) {
    // a matrix was passed in so do the math
    m4.multiply(matrix, this.localMatrix, this.worldMatrix);
  } else {
    // no matrix was passed in so just copy.
    m4.copy(this.localMatrix, this.worldMatrix);
  }

  // now process all the children
  var worldMatrix = this.worldMatrix;
  this.children.forEach(function (child) {
    child.updateWorldMatrix(worldMatrix);
  });
};

var cubeVAO;
var cubeBufferInfo;
var objectsToDraw = [];
var objects = [];
var nodeInfosByName = {};
var scene;
var objetoCubo = {};
var objetoPiramide = {};
var countF = 0;
var countC = 0;
var countP = 0;
var programInfo;
var animatex = 0;
var voltarx = false;
var animatey = 100;
var voltary = true;

function makeNode(nodeDescription) {
  var trs = new TRS();
  var node = new Node(trs);
  nodeInfosByName[nodeDescription.name] = {
    trs: trs,
    node: node,
  };
  trs.translation = nodeDescription.translation || trs.translation;
  if (nodeDescription.draw !== false) {
    node.drawInfo = {
      uniforms: {
        u_colorOffset: [0.2, 0.95, 0.2, 0],
        u_colorMult: [0.4, 0.4, 0.4, 1],
      },
      programInfo: programInfo,
      bufferInfo: cubeBufferInfo,
      vertexArray: cubeVAO,
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
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  loadGUI(gl);

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");

  //cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 1);
  var cubeArrays = {
    position: new Float32Array([
      -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,

      -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,

      -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,

      -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,

      1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,

      -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1,
    ]),
    indices: new Uint16Array([
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
    ]),
  };

  cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, cubeArrays);
  // cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 1);

  // setup GLSL program
  programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  // programInfo = twgl.createProgramInfo(gl, [vsW, fsW]);

  cubeVAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  var fieldOfViewRadians = degToRad(60);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  // Let's make all the nodes
  objetoCubo = {
    name: "cubo0",
    translation: [-5, 0, 0],
    children: [],
  };

  scene = makeNode(objetoCubo);

  // var pyramidArrays = {
  //   position: new Float32Array([
  //     0, 1, 0,

  //     -1, -1, 1,

  //     1, -1, 1,

  //     0, 1, 0,

  //     1, -1, 1,

  //     1, -1, -1,

  //     0, 1, 0,

  //     1, -1, -1,

  //     -1, -1, -1,

  //     0, 1, 0,

  //     -1, -1, -1,

  //     -1, -1, 1,
  //   ]),
  //   indices: new Uint16Array([
  //     0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 8, 4, 1, 8, 5, 2,
  //   ]),
  // };

  // cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, pyramidArrays);

  // // setup GLSL program
  // programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  // cubeVAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);

  // objetoPiramide = {
  //   name: "piramide0",
  //   translation: [5, 0, 0],
  //   children: [],
  // };

  // scene = makeNode(objetoPiramide);

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.001;

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);

    // Compute the camera's matrix using look at.
    var cameraPosition = [4, 3.5, 15];
    var target = [0, 3.5, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    var adjust;
    var speed = 3;
    var c = time * speed;
    var animatespeed = 0.1;

    adjust = degToRad(time * config.rotation);
    nodeInfosByName["cubo0"].trs.rotation[0] = adjust;
    nodeInfosByName["cubo0"].trs.translation = [config.x, config.y, config.z];
    nodeInfosByName["cubo0"].trs.scale = [
      config.scaleX,
      config.scaleY,
      config.scaleZ,
    ];

    if (config.anim) {
      nodeInfosByName["cubo0"].trs.translation = [
        animatex * animatespeed + config.x,
        animatey * animatespeed + config.y,
        0 + config.z,
      ];
      // if (config.anim) {
      //   nodeInfosByName["cubo0"].trs.translation = [
      //     animatex * animatespeed,
      //     animatey * animatespeed,
      //     0 + config.z,
      //   ];

      if (animatex >= -100 && !voltarx) {
        animatex++;
        if (animatex == 100) voltarx = true;
      } else {
        animatex--;
        if (animatex == -100) voltarx = false;
      }

      if (animatey >= -100 && !voltary) {
        animatey++;
        if (animatey == 100) voltary = true;
      } else {
        animatey--;
        if (animatey == -100) voltary = false;
      }
      console.log("aX: " + animatex);
      console.log("aY: " + animatey);
    }

    // Update all world matrices in the scene graph
    scene.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function (object) {
      object.drawInfo.uniforms.u_matrix = m4.multiply(
        viewProjectionMatrix,
        object.worldMatrix
      );
    });

    // ------ Draw the objects --------

    twgl.drawObjectList(gl, objectsToDraw);

    requestAnimationFrame(drawScene);
  }
}

main();
