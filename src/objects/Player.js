import { PlayerControls } from "../controls/PlayerControls.js"
import { gltfLoader } from "../core/Core.js";
import { Sphere } from "../objects/Sphere.js"
import { factoryRoom } from "./FactoryRoom.js"
import { scene } from "../core/Core.js";
import { PLAYER_OBJECT_NAME, ROT_MINUS_Z } from "../core/Constants.js";

// Creating player object. In this case a test sphere
// const sphere = new Sphere({ texture: "/static/MojaTwarz.jpg", radius: 1.5, position: {x: 0, y: 0.566, z: 0}});

export let player = null;

export function initPlayer() {

    // Get player model by name
    let playerModel = scene.getObjectByName(PLAYER_OBJECT_NAME);
    playerModel.rotation.y += ROT_MINUS_Z;
    // Mesh of a factory, used for defining room bouderies
    const factoryMesh = factoryRoom.getRoom();

        if(playerModel) {
            player = new PlayerControls( playerModel, factoryMesh );
            console.log("Player model loaded!");
        } else {
            console.log("Can't load robot model as a player");
        }
}

export function getPlayer() {
    return player;
}



