import { SweeperRobot } from "../objects/SweeperRobot.js"
import {
    SEGMENT_COUNT,
    SEGMENT_TRAVEL_LENGTH,
    ROT_MINUS_Z,
    ROT_Z,
    
} from "../core/Constants.js";



const sweeperStartPos = [
    { x: -10, y: -1, z: -45.5, rot: ROT_Z },
    { x: -10, y: -1, z: 15.5, rot: ROT_MINUS_Z },
    { x: 15, y: -1, z: 0, rot: -Math.PI/2}
];

const i = 1;

let sweeperOne = null;

function startRandomBots() {
    sweeperOne = new SweeperRobot( sweeperStartPos[i].x, sweeperStartPos[i].y, sweeperStartPos[i].z, 0, -1, 0, "Scene" );
    setInterval(() =>{
        console.log( "A bot has appeared!" );

        // Random index from sweeperStartPos array
        let randomIndex = Math.floor( Math.random() * sweeperStartPos.length );

        // Random turn direction "Left" or "Right"
        let randomDirection = Math.random() < 0.5 ? "Left" : "Right";

        // Random travel length
        let randomTravelLength = Math.floor( Math.random() * SEGMENT_COUNT + 1 );

        sweeperOne.setPosition( sweeperStartPos[randomIndex] );
        sweeperOne.startMoving( SEGMENT_TRAVEL_LENGTH * randomTravelLength, randomDirection);
    }, 10000);
}

export { sweeperOne, startRandomBots };