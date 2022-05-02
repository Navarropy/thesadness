import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AnimationMixer } from "three";
import * as dat from "dat.gui";
import ScrollTrigger from "gsap";

gsap.registerPlugin(ScrollTrigger);

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

// Materials

const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);

// Mesh
const loader = new GLTFLoader();
let mixer;
let model;
let camera;
let root;
loader.load("/imported/girl/scene.gltf", (gltf) => {
  gltf.scene.position.set(-4, 0, 0);
  gltf.scene.position.set(0, -1.5, 0);

  gltf.scene.rotation.y = 4.7;
  gltf.scene.rotation.x = -0.2;

  root = gltf;
  model = gltf.scene;

  console.log(`Lights:`);
  console.log(gltf);
  console.log(`///////////////////////////////////`);

  // Anki - Importar a câmera do GLTF.
  camera = root.cameras[0];
  camera.aspect = sizes.width / sizes.height;

  scene.add(model);

  mixer = new AnimationMixer(model);
  const clips = gltf.animations;
  const action = mixer.clipAction(clips[1]);
  action.play();

  camera.updateProjectionMatrix();
});

// Lights

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.physicallyCorrectLights = true;
});

/**
 * Camera
 */
// Base camera

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll Animation
 */

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects

  // Anki - Usar o modelo fora do loader.
  if (camera != null) {
    camera.updateProjectionMatrix();
    let delta = clock.getDelta();
    if (mixer) {
      mixer.update(0.003);
    }
    renderer.render(scene, camera);
  } else {
    console.log("camera not ready yet.");
  }

  // Update Orbital Controls
  // controls.update();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
