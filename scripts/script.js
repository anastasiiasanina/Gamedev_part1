import * as THREE from 'three'
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  const obstacles = [];
  
  const keys = {
    W: {
      pressed: false
    },
    A: {
      pressed: false
    },
    S: {
      pressed: false
    },
    D: {
      pressed: false
    }
  }

  window.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'Space':
        cube.velocity.y = 0.2
        break
      case 'KeyW':
        keys.W.pressed = true
        break
      case 'KeyA':
        keys.A.pressed = true
        break
      case 'KeyS':
        keys.S.pressed = true
        break
      case 'KeyD':
        keys.D.pressed = true
        break
    }
  })

  window.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyW':
        keys.W.pressed = false
        break
      case 'KeyA':
        keys.A.pressed = false
        break
      case 'KeyS':
        keys.S.pressed = false
        break
      case 'KeyD':
        keys.D.pressed = false
        break
    }
  })

  class GeometryElement extends THREE.Mesh {
    constructor({
      width,
      height,
      depth,
      color,
      velocity,
      position 
    }) {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshStandardMaterial({ color });
      super(geometry, material);

      this.width = width
      this.height = height
      this.depth = depth
      this.velocity = velocity

      this.position.set(position.x, position.y, position.z)
      this.bottom = this.position.y - this.height / 2
      this.top = this.position.y + this.height / 2

      this.right = this.position.x + this.width / 2
      this.left = this.position.x - this.width / 2

      this.front = this.position.z + this.depth / 2
      this.back = this.position.z - this.depth / 2
    }

    addBouncing() {
      this.velocity.y += -0.01;
    
      if (
        checkBoundaries({
          fig1: this,
          fig2: platform
        })
      ) {
        console.log(this.velocity.y)
        this.velocity.y *= 0.7;
        this.velocity.y = -this.velocity.y
      } else {
        this.position.y += this.velocity.y
      };
    }

    changePosition(platform) {
      this.bottom = this.position.y - this.height / 2
      this.top = this.position.y + this.height / 2

      this.right = this.position.x + this.width / 2
      this.left = this.position.x - this.width / 2

      this.front = this.position.z + this.depth / 2
      this.back = this.position.z - this.depth / 2

      this.position.x += this.velocity.x
      this.position.z += this.velocity.z

      this.addBouncing();
    }
  }

  const moveCube = () => {
    cube.velocity.x = 0
    cube.velocity.z = 0
    
    if (keys.A.pressed) cube.velocity.x = -0.06
    else if (keys.D.pressed) cube.velocity.x = 0.06

    if (keys.S.pressed) cube.velocity.z = 0.06
    else if (keys.W.pressed) cube.velocity.z = -0.06
  }

  const checkBoundaries = ({ fig1, fig2 }) => {
    const xCollision = fig1.right >= fig2.left && fig1.left <= fig2.right
    const yCollision = fig1.bottom + fig1.velocity.y <= fig2.top && fig1.top >= fig2.bottom
    const zCollision = fig1.front >= fig2.back && fig1.back <= fig2.front

    return xCollision && yCollision && zCollision
  }

  const cube = new GeometryElement({
    width: 1,
    height: 1,
    depth: 1,
    color: '#00ff00',
    velocity: {
      x: 0,
      y: -0.01,
      z: 0
    },
    position: {
      x: 0,
      y: 0,
      z: 0
    }
  });
  cube.castShadow = true;
  scene.add(cube);

  const platform = new GeometryElement({
    width: 10,
    height: 0.5,
    depth: 50,
    color: '#0369a1',
    velocity: {
      x: 0,
      y: 0,
      z: 0
    },
    position: {
      x: 0,
      y: -2,
      z: 0
    }
  });
  platform.receiveShadow = true;
  scene.add(platform);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.y = 3;
  light.position.z = 1;
  light.castShadow = true;
  scene.add(light);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5))

  camera.position.z = 5

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    moveCube();
    cube.changePosition(platform);
  }
  animate()