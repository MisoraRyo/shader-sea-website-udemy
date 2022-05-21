import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";

import skyimage from './textures/sky.jpg';


const gui = new dat.GUI({ width: 300 });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const skytexture = textureLoader.load(skyimage);

scene.background = skytexture;



// Geometry
const geometry = new THREE.PlaneGeometry(5, 5, 128, 128);


// color
const colorObject = {};
colorObject.depthColor = "#2d81ae";
colorObject.surfaceColor  = "#66c1f9";


// Material
//const material = new THREE.MeshBasicMaterial();
const material = new THREE.ShaderMaterial({
  uniforms:{
    uWaveLenght: { value: 0.2 },
    uFrequency: { value: new THREE.Vector2(5.0, 2.5) },
    uTime: {value: 0.0},
    uWaveSpeed : {value: 1.0 },
    uDepthColor : {value: new THREE.Color(colorObject.depthColor)},
    surfaceColor : {value: new THREE.Color(colorObject.surfaceColor)},
    uColorOffset: {value: 0.14},
    uColorMutiplier: {value: 9.6},
    uSmallWaveElavation:{value: 0.15},
    uSmallWaveFrequency:{value: 4.0},
    uSmallWaveSpeed:{value: 0.2},
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});




//デバッグ
const params = {
	cssColor: '#ff00ff',
	rgbColor: { r: 0, g: 0.2, b: 0.4 },
	customRange: [ 0, 127, 255 ],
};
gui.add(material.uniforms.uWaveLenght, "value")
.min(0)
.max(1)
.step(0.01)
.name("uWaveLenght");
//　↓　vec2なので.valueがいる
gui.add(material.uniforms.uFrequency.value, "x")
.min(0)
.max(10)
.step(0.01)
.name("uFrequencyX");
gui.add(material.uniforms.uFrequency.value, "y")
.min(0)
.max(10)
.step(0.01)
.name("uFrequencyY");
//
gui.add(material.uniforms.uWaveSpeed, "value")
.min(0)
.max(10)
.step(0.01)
.name("uWaveSpeed");
// color
gui.addColor(colorObject, "depthColor")
.onChange(()=>{
  material.uniforms.uDepthColor.value.set(colorObject.depthColor);
});
gui.addColor(colorObject, "surfaceColor")
.onChange(()=>{
  material.uniforms.surfaceColor.value.set(colorObject.surfaceColor);
});
//
gui.add(material.uniforms.uColorOffset, "value")
.min(0)
.max(1)
.step(0.01)
.name("uColorOffset");
gui.add(material.uniforms.uColorMutiplier, "value")
.min(0)
.max(30)
.step(0.01)
.name("uColorMutiplier");
//
gui.add(material.uniforms.uSmallWaveElavation, "value")
.min(0)
.max(1)
.step(0.01)
.name("uSmallWaveElavation");
gui.add(material.uniforms.uSmallWaveFrequency, "value")
.min(0)
.max(10)
.step(0.01)
.name("uSmallWaveFrequency");
gui.add(material.uniforms.uSmallWaveSpeed, "value")
.min(0)
.max(30)
.step(0.01)
.name("uSmallWaveSpeed");

gui.show(false);


// Mesh
//const mesh = new THREE.Mesh(geometry, material);
const mesh = new THREE.Points(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.0, 0.23, 0.0);
scene.add(camera);

// Controls
//const controls = new OrbitControls(camera, canvas);
//controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  //カメラを周回させる
  camera.position.x = Math.sin(elapsedTime*0.14) * 3.0;
  camera.position.z = Math.cos(elapsedTime*0.14) * 3.0;

  camera.lookAt( Math.cos(elapsedTime), Math.sin(elapsedTime)*0.4, Math.sin(elapsedTime)*0.4)

  //controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
