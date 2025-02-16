/**
 * https://github.com/google/model-viewer/blob/master/packages/model-viewer/src/three-components/EnvironmentScene.ts
 */

import {
    BackSide,
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PointLight,
    Scene,
} from 'three'
import { scene } from '../core/Core'
import { SEGMENT_COUNT } from '../core/Constants'
import { gltfLoader } from '../core/Core'

const SEGMENT_LENGTH = 28.591;
const SEGMENT_WIDTH = 31.713;

class FactoryEnvironment extends Scene {

    static instance = null;

    constructor() {

        if( FactoryEnvironment.instance ) {
            return FactoryEnvironment.instance;
        }

        super();

        // Texture map
        this.loadedModels = new Map();

        gltfLoader.load("../../static/GLTFModels/FactoryWall/FactoryWall.gltf", (wall) => {
            this.loadedModels.set('factoryWall', wall.scene);
            console.log('FactoryWall loaded!', wall.scene.name);
        });

        gltfLoader.load("../../static/GLTFModels/FactoryFloor/factoryFloor.gltf", (floor) => {
            this.loadedModels.set('factoryFloor', floor.scene);
            console.log('FactoryFloor loaded!');
        });

        // Set room geometry and material
        const geometry = new BoxGeometry();
        geometry.deleteAttribute('uv');

        const roomMaterial = new MeshStandardMaterial({ color: 'grey', side: BackSide });
        const boxMaterial = new MeshStandardMaterial();

        // Calculate room Z position in world coorinates
        const roomZPosition = -( SEGMENT_COUNT * SEGMENT_LENGTH - SEGMENT_LENGTH ) / 2;

        const room = new Mesh(geometry, roomMaterial);
        room.position.set(0, 13.219, roomZPosition);
        room.scale.set(SEGMENT_WIDTH, 28.305, SEGMENT_COUNT * SEGMENT_LENGTH);
        this.add(room);

        this.room = room;

        // +z
        const light4 = new Mesh(geometry, createAreaLightMaterial(43));
        light4.position.set(- 0.462, 8.89, 14.520 + SEGMENT_LENGTH*SEGMENT_COUNT);
        light4.scale.set(4.38, 5.441, 0.088);
        this.add(light4);

        // -z
        const light5 = new Mesh(geometry, createAreaLightMaterial(20));
        light5.position.set(3.235, 11.486, - 12.541 - SEGMENT_LENGTH*SEGMENT_COUNT);
        light5.scale.set(2.5, 2.0, 0.1);
        this.add(light5);

        // +y
        const light6 = new Mesh(geometry, createAreaLightMaterial(100));
        light6.position.set(0.0, 20.0, 0.0);
        light6.scale.set(1.0, 0.1, 1.0);
        this.add(light6);

        // if( this.loadedModels.has( 'factoryWall' ) ) {

        //     const frontWallClone = this.loadedModels.get( 'factoryWall' ).clone();
            
        //     frontWallClone.position.set( 0, 14, 14.25 );
        //     frontWallClone.scale.set( 1.575, 1.6, 1.5 );
        //     frontWallClone.rotation.x = Math.PI/2;
        //     frontWallClone.rotation.z = 0;
        //     // model.roation.y = Math.PI/2;
        //     this.add( frontWallClone );
        
        //     console.log( "!!Front Wall model added!!" );

        //     const backWallClone = this.loadedModels.get( 'factoryWall' ).clone();
            
        //     backWallClone.position.set( 0, 14, 14.25 - SEGMENT_COUNT * 28.5 );
        //     backWallClone.scale.set( 1.575, 1.6, 1.5 );
        //     backWallClone.rotation.x = Math.PI/2;
        //     backWallClone.rotation.z = Math.PI;
        //     // model.roation.y = Math.PI/2;
        //     this.add( backWallClone );
        
        //     console.log( "!!Back Wall model added!!" );
        // } else {
        //     console.warn('!!!!There is no factory wall!!!!');
        // }

        gltfLoader.load( "../../static/GLTFModels/FactoryWall/FactoryWall.gltf", (wall) => {
            const model = wall.scene;
            
            model.position.set( 0, 14, 14.25 );
            model.scale.set( 1.575, 1.6, 1.5 );
            model.rotation.x = Math.PI/2;
            model.rotation.z = 0;
            // model.roation.y = Math.PI/2;
            this.add( model );
        
            console.log( "!!Wall model added!!" );
        } )

        gltfLoader.load( "../../static/GLTFModels/FactoryWall/FactoryWall.gltf", (wall) => {
            const model = wall.scene;
            
            model.position.set( 0, 14, 14.25 - SEGMENT_COUNT * 28.5 );
            model.scale.set( 1.575, 1.6, 1.5 );
            model.rotation.x = Math.PI/2;
            model.rotation.z = Math.PI;
            // model.roation.y = Math.PI/2;
            this.add( model );
        
            console.log( "!!Wall model added!!" );
        } )

        for (let i = 0; i < SEGMENT_COUNT; i++) {
            const zOffset = -i * SEGMENT_LENGTH; // Z axis offset
        
            const mainLight = new PointLight(0xffffff, 900, 28, 2);
            mainLight.position.set(0.418, 16.199, 0.300 + zOffset);
            this.add(mainLight);

            // -x right
            const light1 = new Mesh(geometry, createAreaLightMaterial(50));
            light1.position.set(-SEGMENT_WIDTH/2, 14.37, 8.208 + zOffset);
            light1.scale.set(0.1, 2.428, 2.739);
            this.add(light1);
        
            // -x left
            const light2 = new Mesh(geometry, createAreaLightMaterial(50));
            light2.position.set(-SEGMENT_WIDTH/2, 18.021, -8.207 + zOffset);
            light2.scale.set(0.1, 2.425, 2.751);
            this.add(light2);
        
            // +x
            const light3 = new Mesh(geometry, createAreaLightMaterial(17));
            light3.position.set(14.904, 12.198, -1.832 + zOffset);
            light3.scale.set(0.15, 4.265, 6.331);
            this.add(light3);

            gltfLoader.load( "../../static/GLTFModels/FactoryFloorYellowLines/factoryFloorYellowLine.gltf", (floor) => {
                const model = floor.scene;
                
                model.position.set( 0, -0.566, -( 2 + i * 32.55 ) );
                model.scale.set( 3.3, 3.3, 3.3 );
                this.add( model );
            
                console.log( "!!Floor model added!!" );
            } );

            gltfLoader.load( "../../static/GLTFModels/FactoryWall/FactoryWall.gltf", (wall) => {
                const model = wall.scene;
                
                model.position.set( -15.8, 14, -( 0.65 + i * 31.5) );
                model.scale.set( 1.575, 1.6, 1.5 );
                model.rotation.x = Math.PI/2;
                model.rotation.z = Math.PI/2;
                // model.roation.y = Math.PI/2;
                this.add( model );
            
                console.log( "!!Wall model added!!" );
            } );

            gltfLoader.load( "../../static/GLTFModels/FactoryWall/FactoryWall.gltf", (wall) => {
                const model = wall.scene;
                
                model.position.set( 15.8, 14, -( 0.65 + i * 31.5) );
                model.scale.set( 1.575, 1.6, 1.5 );
                model.rotation.x = Math.PI/2;
                model.rotation.z = -Math.PI/2;
                // model.roation.y = Math.PI/2;
                this.add( model );
            
                console.log( "!!Wall model added!!" );
            } );
        }

        scene.add(this);

        FactoryEnvironment.instance = this;
    }

    dispose() {

        const resources = new Set();

        this.traverse((object) => {

            if (object.isMesh) {

                resources.add(object.geometry);
                resources.add(object.material);

            }

        });

        for (const resource of resources) {

            resource.dispose();

        }

    }

    // Return room
    getRoom() {
        return this.room;
    }

    // Get instance of the class
    static getInstance() {
        if( !FactoryEnvironment.instance ) {
            FactoryEnvironment.instance = new FactoryEnvironment();
        }
        return FactoryEnvironment.instance;
    }

}

function createAreaLightMaterial(intensity) {

    const material = new MeshBasicMaterial();
    material.color.setScalar(intensity);
    return material;

}

// Create singleton of factory
const factoryRoom = FactoryEnvironment.getInstance();

export { FactoryEnvironment, factoryRoom };

