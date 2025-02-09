import { 
    scene,
    camera,
    renderer,
    followRotationWithOrbit,
    clock
} from "../core/Core.js"

import { Cube } from "../objects/Cube.js"
import { player } from "../objects/Player.js"
import { sweeperOne, startRandomBots } from "./BotTravel.js"

const segmentCount = 2;


const cube = new Cube({color: "red", size: 1, position: {x: -4, y: 0, z: -10 * segmentCount}});
const cube2 = new Cube({texture: "../../static/MojaTwarz.jpg", size: 1.5, position: {x: 4, y: 2, z:0}});

const initObstacles = [ cube.mesh, cube2.mesh ];

player.addObstacles(initObstacles);

startRandomBots();


let i = 0;

function animate() {
    
    // Add cube animation
    cube.rotateXY(0.05, 0.1);
    cube2.rotateXY(0.01, 0.02);

    cube.mesh.position.x += (50 - ((i++) % 101))/100;

    // Renderowanie sceny
    renderer.render(scene, camera);

    player.update();
    followRotationWithOrbit( player.object );

    // Update sweeper animations
    sweeperOne.updateSweeperAnimation();
    sweeperOne.makeSweeperMove();

    requestAnimationFrame(animate);
}

export { animate };
