import { Vector3 } from 'three'

class PlayerControls {
    constructor(object) {

        this.object = object.mesh
        this.moveSpeed = 0.1
        this.turnSpeed = 0.03
        this.direction = new Vector3( 0, 0, -1 )
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

    update() {

        // Robot rotation
        if( this.keys.a || this.keys.ArrowLeft ) {
            this.object.rotation.y += this.turnSpeed
        }

        if( this.keys.d || this.keys.ArrowRight ) {
            this.object.rotation.y -= this.turnSpeed
        }

        // Calculating direction vector
        this.direction.set( 0, 0, -1 ).applyEuler( this.object.rotation ) 

        // Move forwards/backwards
        if( this.keys.w || this.keys.ArrowUp ) {
            this.object.position.add( this.direction.clone().multiplyScalar( this.moveSpeed ) )
        }

        if( this.keys.s || this.keys.ArrowDown ) {
            this.object.position.add( this.direction.clone().multiplyScalar( -this.moveSpeed ) )
        }
    }
}

export { PlayerControls }