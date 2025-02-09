import { SweeperRobot } from "../objects/SweeperRobot.js"

const SEGMENT_TRAVEL_LENGTH = 20;
const ROT_MINUS_Z = Math.PI;
const ROT_Z = 0;

const sweeperStartPos = [
    { x: -10, y: -1, z: -45.5, rot: ROT_Z },
    { x: -10, y: -1, z: 15.5, rot: ROT_MINUS_Z },
    { x: 15, y: -1, z: 0, rot: -Math.PI/2}
];

var i = 1;

const sweeperOne = new SweeperRobot( sweeperStartPos[i].x, sweeperStartPos[i].y, sweeperStartPos[i].z, 0, -1, 0, "Scene" );

function startRandomBots() {
    setInterval(() =>{
        console.log( "A bot has appeared!" );

        sweeperOne.setPosition( sweeperStartPos[i] );
        sweeperOne.startMoving( SEGMENT_TRAVEL_LENGTH * 2, "Right");
        
        i = (i+1) % 3;
    }, 10000);
}

export { sweeperOne, startRandomBots };