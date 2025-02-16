import { checkLoadModelThenAnimate } from "../objects/loadStaticGLTFModels"
import { animate } from "../animation/Animation"
import { startRandomBots } from "../animation/BotTravel"
import { initPlayer } from "../objects/Player";

export function Start() {
    checkLoadModelThenAnimate().then(() => {

        // Initialize player
        initPlayer();
        
        // Start bots
        startRandomBots();

        // Start main animation loop
        animate();
    });
}