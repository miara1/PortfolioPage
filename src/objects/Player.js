import { PlayerControls } from "../controls/PlayerControls.js"
import { Sphere } from "../objects/Sphere.js"
import { factoryRoom } from "./FactoryRoom.js"

// Creating player object. In this case a test sphere
const sphere = new Sphere({ texture: "/static/MojaTwarz.jpg", radius: 1.5, position: {x: 0, y: 0.566, z: 0}});

// Mesh of a factory, used for defining room bouderies
const factoryMesh = factoryRoom.getRoom();

export const player = new PlayerControls( sphere, factoryMesh );