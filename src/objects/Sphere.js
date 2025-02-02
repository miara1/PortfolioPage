import { 
    SphereGeometry,
    MeshStandardMaterial,
    TextureLoader,
    Mesh,
    BackSide
} from 'three'
import { scene } from "../core/Core.js"

class Sphere {
    constructor({color = "green", texture = null, radius = 1, position = { x: 0, y: 0, z: 0 }}) {
        // Create sphere geometry
        this.geometry = new SphereGeometry(radius)

        // Load texture if specified, else use color
        if (texture) {
            const textureLoader = new TextureLoader()
            const sphereTexture = textureLoader.load(texture)
            this.material = new MeshStandardMaterial({ map: sphereTexture, side: BackSide})
        } else {
            this.material = new MeshStandardMaterial({ color: color})
        }

        // Create mesh
        this.mesh = new Mesh(this.geometry, this.material)

        // Set object position
        this.mesh.position.set(position.x, position.y, position.z)
    
        scene.add(this.mesh)
    }

    rotateY(speedY = 0.01) {
        this.mesh.rotation.y += speedY
    }
}

export{ Sphere }