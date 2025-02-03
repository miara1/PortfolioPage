import { 
    scene,
    camera,
    renderer,
    followRotationWithOrbit
} from "../core/Core.js"

import {
    FactoryEnvironment
} from "../objects/FactoryRoom.js"

import { Cube } from "../objects/Cube.js"
import { Sphere } from "../objects/Sphere.js"
import { PlayerControls } from "../controls/PlayerControls.js"





const cube = new Cube({color: "red", size: 1, position: {x: -4, y: 0, z: -3}})
const cube2 = new Cube({texture: "../../static/MojaTwarz.jpg", size: 1.5, position: {x: 4, y: 2, z:0}})

const sphere = new Sphere({ texture: "/static/MojaTwarz.jpg", radius: 1.5, position: {x: 0, y: 1, z: 0}})

const factoryRoom = new FactoryEnvironment( renderer )

const obstacles = [ cube, cube2 ]

const player = new PlayerControls( sphere, obstacles )

cube.getPosition()
cube2.getPosition()

function animate() {
    
    // Add cube animation
    cube.rotateXY(0.05, 0.1)
    cube2.rotateXY(0.01, 0.02)

    // sphere.rotateY0.01)

    // Renderowanie sceny
    renderer.render(scene, camera)

    player.update()
    followRotationWithOrbit( sphere.mesh )


    // sphere.mesh.position.x += 0.03



    requestAnimationFrame(animate)
}

export { animate }
