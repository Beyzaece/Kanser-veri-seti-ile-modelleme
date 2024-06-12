import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

camera.position.z = 25;

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

let controls;
controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();

let correlationCoefficients;
fetch('data.json')
.then(response => response.json())
.then(data => {
  correlationCoefficients = data;
  console.log(correlationCoefficients);
})
.catch(error => {
  console.error('Veri yüklenirken hata oluştu:', error);
});

loader.load(
  'models/heart/scene.gltf',
  function (gltf) {
    const heart = gltf.scene;
    heart.scale.set(10, 10, 10);
    scene.add(heart);

    heart.traverse(function (child) {
      if (child.isMesh) {
        child.material.transparent = true;
      }
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
      event.preventDefault();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(heart.children, true);

      if (intersects.length > 0) {
        console.log('Heart clicked!');
        if (correlationCoefficients) {
          const sortedFactors = Object.keys(correlationCoefficients).sort((a, b) => {
            return Math.abs(correlationCoefficients[b]) - Math.abs(correlationCoefficients[a]);
          });
          showFactors(sortedFactors, heart);
        }
      }
    }

    window.addEventListener('click', onMouseClick, false);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.onmousemove = (e) => {
  const mouseX = e.clientX;
}
function showFactors(factors, heart) {
  const container = document.getElementById('factorsContainer');
  container.innerHTML = '';

  // Sayfanın ortasını bul
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const numNodes = factors.length;
  const maxRadius = 400; // Maksimum yarıçap
  const minRadius = 200; // Minimum yarıçap
  const angleInterval = (2 * Math.PI) / numNodes;

  const factorDivs = [];

  for (let i = 0; i < numNodes; i++) {
    const factor = factors[i];
    const angle = i * angleInterval;
    const radius = minRadius + (maxRadius - minRadius) * (i / numNodes);

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const factorDiv = document.createElement('div');
    factorDiv.className = 'factor';
    factorDiv.textContent = factor;
    factorDiv.style.position = 'absolute';
    factorDiv.style.left = x + 'px';
    factorDiv.style.top = y + 'px';

    setTimeout(() => {
      container.appendChild(factorDiv);
    }, i * 1000); // Her bir faktör arasında 1 saniye bekleyin
  }
}


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();