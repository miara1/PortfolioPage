import { 
    scene,
    camera,
    renderer,
    followRotationWithOrbit,
} from "../core/Core.js"

import { player } from "../objects/Player.js"
import { sweeperOne } from "./BotTravel.js"
import { factoryRoom } from "../objects/FactoryRoom.js"

const room = factoryRoom.getRoom();

function animate() {

    // Renderowanie sceny
    renderer.render(scene, camera);

    player.update();
    followRotationWithOrbit( player.object, room );

    // Update sweeper animations
    sweeperOne.updateSweeperAnimation();
    sweeperOne.makeSweeperMove();

    requestAnimationFrame(animate);
}

export { animate };
