import { animate } from "../animation/Animation"
import { scene, clock, gltfLoader } from "../core/Core"
import { 
    showLoadingScreen,
    hideLoadingScreen,
    onLoadModelError
} from "../core/LoadingScreen"

import { AnimationMixer, LoopRepeat } from "three"

const modelUrls = [
    { url: "../../static/GLTFModels/Tables/scene.gltf", position: { x: 0, y: 0, z: -5 }, scale: 5, animation: null },
];

const mixers = [];


// Load model function with specified position and scale. Check if loaded correctly.
function loadModel(modelData) {
    return new Promise((resolve, reject) => {
        gltfLoader.load(modelData.url, (gltf) => {
            const model = gltf.scene;
            const modelPosition = modelData.position;
            const modelScale = modelData.scale;

            // Set specified position and scale
            model.position.set( modelPosition.x, modelPosition.y, modelPosition.z);
            model.scale.set( modelScale, modelScale, modelScale );
            scene.add( model );

            // Log succes to console
            console.log( `Model loaded succesfully: ${modelData.url}` );

            // Check for the specified animation. Load if exists
            if( modelData.animation ) {

                const mixer = new AnimationMixer( model );
                const animation = gltf.animations.find(anim => anim.name === modelData.animation );

                if ( animation ) {

                    const action = mixer.clipAction( animation );
                    action.play();

                    mixers.push( mixer );

                    console.log( `Animation "${modelData.animation}" started` );
                } else {
                    console.warn( `Cannot find animation ${modelData.animation}` );
                }

            }

            resolve(gltf.scene);

        }, undefined, ( error ) => {

            // Log error to console
            console.error( `Error loading model: ${modelData.url}`, error );
            reject( error );
        });
    });
}

// Update loaded animations
export function updateAnimations() {
    if( mixers.length() > 0 ) mixers.forEach(mixer => mixer.update(0.008));
}

// Wait for all models to load, then start main animation loop
export function checkLoadModelThenAnimate() {

    // Show loading screen while loading models
    showLoadingScreen();

    // Load models, checking if correct
    Promise.all( modelUrls.map( loadModel ) )
    .then(() => {

        console.log( "All models loaded succesfully!" );

        // Hide loading screen
        hideLoadingScreen();

        // Start main animation loop
        animate();
    })
    .catch( error => {
        
        // Show model loading error message on the screen
        console.error( "Error while loading models:", error );
        onLoadModelError();
    });
}