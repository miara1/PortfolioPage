import { 
    BoxGeometry,
    MeshStandardMaterial,
    TextureLoader,
    Mesh,
    BackSide
} from 'three'
import { scene } from "../core/Core.js"

class Cube {
    constructor({color = "blue", texture = null, size = 1, position = { x: 0, y: 0, z: 0 }}) {
        // Create geometry and material
        this.geometry = new BoxGeometry(size, size, size);
        
        if (texture) {
            const textureLoader = new TextureLoader();
            const cubeTexture = textureLoader.load(texture);
            this.material = new MeshStandardMaterial({ map: cubeTexture});
        } else {
            this.material = new MeshStandardMaterial({ color: color});
        }
        

        this.mesh = new Mesh(this.geometry, this.material);

        // Set cube position
        this.mesh.position.set(position.x, position.y, position.z);

        // Add cube to the scene
        scene.add(this.mesh);
    }

    // Method for rotating the cube
    rotateXY(speedX = 0.01, speedY = 0.01) {
        this.mesh.rotation.x += speedX;
        this.mesh.rotation.y += speedY;
    }

    // Method for getting cube's position
    getPosition() {
        console.log(`Pozycja obiektu: x=${this.mesh.position.x}, y=${this.mesh.position.y}, z=${this.mesh.position.z}`);
    }
}

export { Cube };

