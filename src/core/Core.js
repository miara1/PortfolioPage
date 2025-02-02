import { 
    Scene,
    GridHelper,
    TextureLoader,
    AmbientLight, 
    PerspectiveCamera,
    WebGLRenderer,
    Vector3
} from 'three'
import { OrbitControls } from '../controls/OrbitControls.js'
// Tworzenie sceny
const scene = new Scene()

// Tworzenie kamery
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set( -5, -5, -5 )
camera.lookAt( 0, 0, 0 )

// Tworzenie renderera
const canvas = document.querySelector("canvas.webgl")
const renderer = new WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// Adjust size on window resize event
function onWindowResize() {
    // Adjust camera aspect
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    // Adjust render
    renderer.setSize(window.innerWidth, window.innerHeight)
}
// Create resize event listener
window.addEventListener('resize', onWindowResize)

// Tworzenie świateł
const ambientLight = new AmbientLight(0xffffff) // Światło otoczenia
scene.add( ambientLight )

// Background texture
const backgroundTexture = new TextureLoader().load('../../static/Kosmos.bmp')
scene.background = backgroundTexture

// Dragging the screen
const controls = new OrbitControls( camera, renderer.domElement )
controls.enableRotate = false
controls.enableZoom = false
controls.enablePan = false
controls.maxPolarAngle = Math.PI / 2
controls.screenSpacePanning = true;

function followRotationWithOrbit( objectMesh = null ) {
    if( objectMesh ) {
    const offset = new Vector3( 0, 5, 10 ); // Pozycja kamery za obiektem
    offset.applyQuaternion(objectMesh.quaternion); // Obracamy offset zgodnie z rotacją obiektu
    camera.position.copy(objectMesh.position.clone().add(offset)); // Nowa pozycja kamery

    controls.target.copy(objectMesh.position); // Ustawienie `OrbitControls` na obiekt
    controls.update(); // Aktualizacja `OrbitControls`
    }
}

// Horizontal grid
const gridHelper = new GridHelper(200, 50)
scene.add(gridHelper)

export { 
    scene,
    camera,
    renderer,
    controls,
    followRotationWithOrbit
}
