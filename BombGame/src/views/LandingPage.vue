<script setup>

</script>

<template>


  <v-col>
  <v-row>
    <h1>BombGame</h1>

  </v-row>

    <v-row>
      <div ref="canvasWrapper"></div>
    </v-row>

  </v-col>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default {
  mounted() {
    this.initThree();
  },
  methods: {
    initThree() {
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
      );
      camera.position.z = 3;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0); // Set the clear color to transparent

      this.$refs.canvasWrapper.appendChild(renderer.domElement);

      // Load the 3D model
      const loader = new GLTFLoader();
      loader.load(
          '../src/assets/test2.glb',
          (gltf) => {
            // Set the model's material to make it transparent
            gltf.scene.traverse((child) => {
              if (child.isMesh) {
                child.material.transparent = 1;
                child.material.opacity = 1; // Set the opacity (adjust as needed)
              }
            });

            // Add the model to the scene
            scene.add(gltf.scene);
          },
          undefined,
          (error) => {
            console.error(error);
          }
      );

      const directionalLight = new THREE.AmbientLight( 0x404040 );
      scene.add(directionalLight);

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
    },
  },
};
</script>

<style scoped>
</style>