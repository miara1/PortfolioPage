import { scene, clock, gltfLoader } from "../core/Core"
import { AnimationMixer, LoopRepeat } from "three"
import { player } from "./Player"
import { Mesh, MeshStandardMaterial, BoxGeometry } from "three"

const SWEEPER_URL = "../../static/GLTFModels/SweeperRobot/scene.gltf";
const SWEEPER_SCALE = 2;
const SWEEPER_ROTATION_PER_FRAME = 1;


export class SweeperRobot {
    constructor(sX = 0, sY = 0, sZ = 0, eX = 0, eY = 0, eZ = 0, animation = "Rest Pose") {
        this.modelData = [{ startPos: { x: sX, y: sY, z: sZ }, endPos: { x: eX, y: eY, z: eZ } }];
        this.animation = animation;
        this.mixer = null;
        this.model = null;

        this.currDistance = 0;
        this.currRotation = 0;
        this.targetDistance = 0;
        this.targetDirection = "";
        this.extraMoveDistance = 30;
        this.isMoving = false;

        this.loadModel();
    }

    // Load sweeper model and animation if existent. Add model to the scene, and player obstacles
    loadModel() {
        gltfLoader.load(SWEEPER_URL, (sweeper) => {
            const model = sweeper.scene;
            this.model = model;

            model.position.set(this.modelData[0].startPos.x, this.modelData[0].startPos.y, this.modelData[0].startPos.z);
            model.rotation.y += Math.PI;
            model.scale.set(SWEEPER_SCALE, SWEEPER_SCALE, SWEEPER_SCALE);
            scene.add(model);

            this.addSweeperToPlayerObstacles();

            if (sweeper.animations.length > 0) {

                this.mixer = new AnimationMixer( model );
                const animationExists = sweeper.animations.find(anim => anim.name === this.animation );

                if( animationExists ) {

                const action = this.mixer.clipAction(animationExists);
                action.play();
                
                console.log( `Animation "${animationExists}" started` );
                }
                
            } else {
                console.warn( `Cannot find animation, or no animation specified` );
            }

        })
    }

    // Update animation of the sweeper
    updateSweeperAnimation() {
        if( this.mixer ) this.mixer.update(0.008);
    }

    // Returns the 3D mesh of a sweeper 
    getSweeperMesh() {
        return this.model;
    }

    /// Adds the sweeper's mesh to the player's obstacle list
    addSweeperToPlayerObstacles() {
        if( !this.model ) {
            console.warn( "Model not loaded yet!" );
            return;
        }

        let sweeperMesh = null;
        this.model.traverse((child) => {
            if (child.isMesh) {
                sweeperMesh = child;
            }
        })

        if( !sweeperMesh || !sweeperMesh.geometry ) {
            
            sweeperMesh = new Mesh(
                new BoxGeometry( 1, 1, 1 ),
                new MeshStandardMaterial({ color: 0xff0000})
            );

            sweeperMesh.position.copy(this.model.position);
            this.model.add(sweeperMesh);

        }

        player.addObstacles(sweeperMesh);

    }

    // Move the sweeper forward
    moveSweeperForward( valPerFrame ) {
        if( this.model ) {
            this.model.position.x += Math.sin(this.model.rotation.y) * valPerFrame;
            this.model.position.z += Math.cos(this.model.rotation.y) * valPerFrame;
        }
    }

    // Rotates the sweeper right by a given number of degrees
    rotateSweeperDegreeRight( degrees ) {

        if( this.model ) {

            const rotVal = ( degrees * Math.PI ) / 180;
            this.model.rotation.y -= rotVal;
        }
    }

    // Rotates the sweeper left by a given number of degrees
    rotateSweeperDegreeLeft( degrees ) {

        if( this.model ) {

            const rotVal = ( degrees * Math.PI ) / 180;
            this.model.rotation.y += rotVal;
        }
    }

    // Initializes movement by resetting variables and setting target distance and direction
    startMoving( distance, turnDirectionStr ) {

        this.targetDirection = turnDirectionStr;
        this.targetDistance = distance;
        this.currDistance = 0;
        this.currRotation = 0;
        this.isMoving = true;
    }

    // Sets sweeper's x, y, z and rotation position
    setPosition({ x, y, z, rot }) {
        if(this.model) {
        this.model.position.set( x, y, z );
        this.model.rotation.y = rot;
        }
    }

    // Controls the movement and rotation of the sweeper based on its target distance and direction
    makeSweeperMove() {
        if ( !this.isMoving ) return;

        if( this.currDistance < this.targetDistance ) {
            
            this.moveSweeperForward( 0.1 );
            this.currDistance += 0.1;     

        } else if( this.targetDirection === "Left" && this.currRotation < 90 ) {

            this.rotateSweeperDegreeLeft( SWEEPER_ROTATION_PER_FRAME );
            this.moveSweeperForward( 0.1 );
            this.currRotation += SWEEPER_ROTATION_PER_FRAME;

        } else if( this.targetDirection === "Right" && this.currRotation < 90 ) {

            this.rotateSweeperDegreeRight( SWEEPER_ROTATION_PER_FRAME );
            this.moveSweeperForward( 0.1 );
            this.currRotation += SWEEPER_ROTATION_PER_FRAME;

        } else if( this.currDistance < this.targetDistance + this.extraMoveDistance ) {
         
            this.moveSweeperForward( 0.1 );
            this.currDistance += 0.1;
        
        } else {
            this.isMoving = false;
        }

    }
}