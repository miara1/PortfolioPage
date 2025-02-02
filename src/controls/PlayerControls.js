import { Vector3, Clock, Box3 } from 'three'

class PlayerControls {
    constructor(object) {

        this.object = object.mesh
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

        // Update robot position
        this.object.position.add( this.velocity.clone().multiplyScalar( deltaTime ) )

    }
}

export { PlayerControls }