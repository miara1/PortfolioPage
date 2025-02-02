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
        // Tworzenie geometrii i materiału
        this.geometry = new BoxGeometry(size, size, size)
        
        if (texture) {
            const textureLoader = new TextureLoader()
            const cubeTexture = textureLoader.load(texture)
            this.material = new MeshStandardMaterial({ map: cubeTexture})
        } else {
            this.material = new MeshStandardMaterial({ color: color})
        }
        

        this.mesh = new Mesh(this.geometry, this.material)

        // Ustawienie pozycji
        this.mesh.position.set(position.x, position.y, position.z)

        // Dodanie do sceny
        scene.add(this.mesh)
    }

    // Metoda do obracania sześcianu
    rotateXY(speedX = 0.01, speedY = 0.01) {
        this.mesh.rotation.x += speedX
        this.mesh.rotation.y += speedY
    }

    getPosition() {
        console.log(`Pozycja obiektu: x=${this.mesh.position.x}, y=${this.mesh.position.y}, z=${this.mesh.position.z}`);
    }
}

export { Cube }

