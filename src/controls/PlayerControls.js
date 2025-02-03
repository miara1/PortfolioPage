import { Vector3, Clock, Box3 } from 'three'

class PlayerControls {
    constructor( object, obstacles ) {

        this.object = object.mesh
        this.obstacles = obstacles

        this.velocity = new Vector3( 0, 0, 0 )
        this.acceleration = 40.0
        this.maxSpeed = 10.0
        this.frictionLinear = 0.90

        this.angularVelocity = 0
        this.angularAcceleration = 7.0
        this.maxAngularSpeed = 1.5
        this.frictionAngular = 0.90
        
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

        this.clock = new Clock()
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
    checkCollision( newPosition ) {

        // Create Box3 for player
        const playerBox = new Box3().setFromObject( this.object )
        playerBox.translate( newPosition.clone().sub( this.object.position ) )

        for( const obstacle of this.obstacles ) {

            // Get obstacle mesh
            const obstacleMesh = obstacle.mesh

            // Check if obstacle has geometry
            if (!obstacleMesh.geometry) {
                console.warn('Obstacle has no geometry, skipping:', obstacle);
                continue;
            }

            const obstacleBox = new Box3().setFromObject( obstacleMesh )
            if( playerBox.intersectsBox( obstacleBox ) ) {
                return true
            }

        }
        return false
    }

    update() {
        // Time in seconds since last frame
        const deltaTime = this.clock.getDelta()

        // Robot rotation
        if( this.keys.a || this.keys.ArrowLeft ) {
            this.angularVelocity += this.angularAcceleration * deltaTime
        }

        if( this.keys.d || this.keys.ArrowRight ) {
            this.angularVelocity -= this.angularAcceleration * deltaTime
        }

        // Rotation speed limit
        this.angularVelocity = Math.max( -this.maxAngularSpeed, Math.min( this.maxAngularSpeed, this.angularVelocity ) )

        // Update robot orientation
        this.object.rotation.y += this.angularVelocity * deltaTime

        // Calculating direction vector
        let direction = new Vector3( 0, 0, -1 )
        direction.applyEuler( this.object.rotation )

        // Temporary variable for calculating next position
        let nextPosition = this.object.position.clone()

        // Move forwards/backwards
        if( this.keys.w || this.keys.ArrowUp ) {
           this.velocity.add( direction.clone().multiplyScalar( this.acceleration * deltaTime ) )
        }

        if( this.keys.s || this.keys.ArrowDown ) {
            this.velocity.add( direction.clone().multiplyScalar( -this.acceleration * deltaTime ) )
        }

        // Speed limit
        this.velocity.clampLength( 0, this.maxSpeed )

        // Friction ( slowing down )
        this.velocity.multiplyScalar( this.frictionLinear )
        this.angularVelocity *= this.frictionAngular

        // Calculating next position
        nextPosition.add( this.velocity.clone().multiplyScalar( deltaTime ) )

        // If no collision detected update robot position
        if( !this.checkCollision( nextPosition ) ) {
            this.object.position.copy( nextPosition )
        }

        // Update robot position
        // this.object.position.add( this.velocity.clone().multiplyScalar( deltaTime ) )

    }
}

export { PlayerControls }