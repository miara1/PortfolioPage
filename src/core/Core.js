import { 
    Scene,
    GridHelper,
    TextureLoader,
    AmbientLight, 
    PerspectiveCamera,
    WebGLRenderer,
    Vector3,
    Clock,
    Raycaster
} from 'three'
import { OrbitControls } from '../controls/OrbitControls.js'
import { GLTFLoader } from '../Loaders/GLTFLoader.js'

// Create clock
const clock = new Clock();

// Create scene
const scene = new Scene();

// Create GLTF loader
const gltfLoader = new GLTFLoader();

// Create camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set( -5, -5, -5 );
camera.lookAt( 0, 0, 0 );

// Create renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Adjust size on window resize event
function onWindowResize() {
    // Adjust camera aspect
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Adjust render
    renderer.setSize(window.innerWidth, window.innerHeight);
}
// Create resize event listener
window.addEventListener('resize', onWindowResize);

// Create lights
const ambientLight = new AmbientLight(0xffffff); // ambient light
scene.add( ambientLight );

// Background texture
const backgroundTexture = new TextureLoader().load('../../static/Kosmos.bmp');
scene.background = backgroundTexture;

// Orbit control
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;
controls.screenSpacePanning = true;

// Create raycaster for collision detection
const raycaster = new Raycaster();
const rayOrigin = new Vector3(); // Ray start position
const rayDirection = new Vector3(); // Ray direction

function followRotationWithOrbit( objectMesh = null, obstacle = null ) {
    if( objectMesh ) {
        const offset = new Vector3( 0, 5, 10 ); // Camera position behind object
        offset.applyQuaternion(objectMesh.quaternion); // Rotate offset with camera rotation
        
        let newCameraPos = objectMesh.position.clone().add(offset); // New camera position

        // Set raycaster for the camera to check for collision with the room
        rayOrigin.copy( objectMesh.position );
        rayDirection.copy(newCameraPos).sub(rayOrigin).normalize();
        raycaster.set( rayOrigin, rayDirection );

        //Check for collision
        const intersects = raycaster.intersectObject( obstacle, true )
        if( intersects.length > 0 ) {

            // Collision point
            const hitPoint = intersects[0].point;
            // Distance from the wall
            const hitDistance = intersects[0].distance;
            console.log( "Dystans do sciany", hitDistance )

            if( hitDistance < 11.55 ) {

                // If ray hits the wall, set the camera before the wall
                const cameraHitOffset = rayDirection.clone().multiplyScalar(-0.5); // Odwrócenie kierunku
                newCameraPos.copy(hitPoint).add(cameraHitOffset);
            }


        }

        camera.position.copy(newCameraPos);
        controls.target.copy(objectMesh.position); // Set `OrbitControls` for the object
        controls.update(); // Update `OrbitControls`
    }
}

// Horizontal grid
const gridHelper = new GridHelper(400, 100);
scene.add(gridHelper);

export { 
    scene,
    camera,
    renderer,
    controls,
    clock,
    gltfLoader,
    followRotationWithOrbit
};
