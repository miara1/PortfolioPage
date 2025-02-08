import { Vector3, Box3, Raycaster } from 'three'
import { clock } from '../core/Core'

class PlayerControls {
    constructor(object, room) {

        this.object = object.mesh
        this.obstacles = []
        this.room = room

        this.velocity = new Vector3(0, 0, 0)
        this.acceleration = 40.0
        this.maxSpeed = 10.0
        this.frictionLinear = 0.90

        this.angularVelocity = 0
        this.angularAcceleration = 7.0
        this.maxAngularSpeed = 1.5
        this.frictionAngular = 0.90

        this.gravity = new Vector3(0, -9.81, 0)
        this.isGrounded = false

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            ArrowUp: false,
            ArrowLeft: false,
            ArrowDown: false,
            ArrowRight: false
        }

        this.setupEventListeners()
    }

    setupEventListeners() {

        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase()
            if (this.keys.hasOwnProperty(key)) {
                this.keys[key] = true;
            }
        })

        document.addEventListener('keyup', (event) => {
            const key = event.key.toLowerCase()
            if (this.keys.hasOwnProperty(key)) {
                this.keys[key] = false
            }
        })
    }

    // Check for collision with specified obstacles
    // If collision is detected returns true
    // Else returns false
    checkCollisionObstacles(newPosition) {

        // Create Box3 for player
        const playerBox = new Box3().setFromObject(this.object)
        playerBox.translate(newPosition.clone().sub(this.object.position))

        for (const obstacle of this.obstacles) {


            // Check if obstacle has geometry
            if (!obstacle.geometry) {
                console.warn('Obstacle has no geometry, skipping:', obstacle);
                continue;
            }

            const obstacleBox = new Box3().setFromObject(obstacle)
            if (playerBox.intersectsBox(obstacleBox)) {
                return true
            }

        }
        return false
    }

    // Check for collision with the walls of the room
    // Returns true if collision was detected
    // Else returns false
    checkCollisionRoom(direction) {
        const raycaster = new Raycaster()
        const position = this.object.position.clone()

        const forward = direction.clone()
        const backward = direction.clone().negate()
        const right = new Vector3(1, 0, 0).applyEuler(this.object.rotation)
        const left = right.clone().negate()
        const down = new Vector3(0, -1, 0)

        const directions = { forward, backward, right, left, down }

        for (const [key, dir] of Object.entries(directions)) {
            raycaster.set(position, dir)
            const intersects = raycaster.intersectObject(this.room, true)

            if (intersects.length > 0 && intersects[0].distance <= 1.5) {
                return key
            }

        }
        return null
    }

    update() {
        // Time in seconds since last frame
        const deltaTime = clock.getDelta()

        // Robot rotation
        if (this.keys.a || this.keys.ArrowLeft) {
            this.angularVelocity += this.angularAcceleration * deltaTime
        }

        if (this.keys.d || this.keys.ArrowRight) {
            this.angularVelocity -= this.angularAcceleration * deltaTime
        }

        // Rotation speed limit
        this.angularVelocity = Math.max(-this.maxAngularSpeed, Math.min(this.maxAngularSpeed, this.angularVelocity))

        // Update robot orientation
        this.object.rotation.y += this.angularVelocity * deltaTime

        // Calculating direction vector
        let direction = new Vector3(0, 0, -1)
        direction.applyEuler(this.object.rotation)

        // Temporary variable for calculating next position
        let nextPosition = this.object.position.clone()

        // Check collision direction
        const collision = this.checkCollisionRoom( direction.clone() )

        // Move forwards/backwards
        if ((this.keys.w || this.keys.ArrowUp) && collision !== "forward") {
            this.velocity.add(direction.clone().multiplyScalar(this.acceleration * deltaTime))
        }

        if ((this.keys.s || this.keys.ArrowDown) && collision !== "backward") {
            this.velocity.add(direction.clone().multiplyScalar(-this.acceleration * deltaTime))
        }

        // Speed limit
        this.velocity.clampLength(0, this.maxSpeed)

        // Friction ( slowing down )
        this.velocity.multiplyScalar(this.frictionLinear)
        this.angularVelocity *= this.frictionAngular

        // Calculating next position
        nextPosition.add(this.velocity.clone().multiplyScalar(deltaTime))

        if( !collision || collision !== "down") {
            this.velocity.add( this.velocity.add( new Vector3( 0, -9.81 * deltaTime, 0 ) ) )
            this.isGrounded = false
        } else {
            this.velocity.y = 0
            this.isGrounded = true
        }
        // If no collision detected update robot position
        if ( !this.checkCollisionObstacles(nextPosition) && ( collision === "down" || collision === null ) ) {
            this.object.position.copy(nextPosition)
        } else {
            if (collision === "forward") {
                // Move the player slightly backwards if collision is forward
                this.velocity.set( 0, 0, 0 )
                this.object.position.add(direction.clone().negate().multiplyScalar(0.25))

            } else if (collision === "backward") {
                 // Move the player slightly forward if collision is backward
                 this.velocity.set( 0, 0, 0 )
                 this.object.position.add(direction.clone().multiplyScalar(0.25))

            } else if( collision === "right" ) {
                // Move playeer slightly left if collision is right
                this.velocity.set( 0, 0, 0 )
                this.object.position.add(new Vector3( -0.1, 0, 0.1 ).applyEuler(this.object.rotation))
            } else if( collision === "left" ) {
                // Move playeer slightly right if collision is left
                this.velocity.set( 0, 0, 0 )
                this.object.position.add(new Vector3( 0.1, 0, 0.1 ).applyEuler(this.object.rotation))
            } else {
                this.velocity.reflect(direction)
                this.velocity.multiplyScalar(1.5)
            }

        }

    }

    addObstacles( obstacle ) {
        // Initialize obstaces tab if empty
        if( !this.obstacles ) {
            this.obstacles = []
        }

        // Obstacle is always converted to an array
        ([]).concat.apply( obstacle ).forEach( obj => {
            this.obstacles.push( obj )
            console.log( "Obstacle added:", obj )
        })
    }
}

export { PlayerControls }