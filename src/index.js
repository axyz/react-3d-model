import React, {Component} from 'react'
const THREE = require('three');
const OrbitControls = require('./controls/orbit-controls')(THREE)
require('./loaders/obj-loader')(THREE);

let eventAttached = false;
function initializeThrottledResize() {
    if (eventAttached) return;
    var throttle = function(type, name) {
        console.log('attaching event')
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                window.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        window.addEventListener(type, func);
        eventAttached = true;
    };

    throttle('resize', 'throttled-resize');
}


export default class extends Component {
    constructor(props) {
        super(props);

        this.init = this.init.bind(this);
        this.animate = this.animate.bind(this);
        this.updateCamera = this.updateCamera.bind(this);
        this.updateRenderer = this.updateRenderer.bind(this);
    }

    componentDidMount() {
        const { updateOnResize } = this.props;

        if (updateOnResize) {
            initializeThrottledResize();
            window.addEventListener('throttled-resize', () => {
                this.updateCamera();
                this.updateRenderer();
            });
        }

        this.init();
        this.animate();
    }

    componentDidUpdate() {
        this.updateCamera();
        this.updateRenderer();
    }

    init() {
        const {
            width = this.node.clientWidth,
            height = this.node.clientHeight,
        } = this.props;

        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 1000);
        this.camera.position.z = 250;
        /* this.camera.position.y = 250;*/
        this.controls = new OrbitControls(this.camera, this.node, {
            minDistance: 150,
            maxDistance: 250,
        });

	      this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('0xffffff');







        var ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
				this.scene.add( ambientLight );


        this.manager = new THREE.LoadingManager();
				this.manager.onProgress = function(item, loaded, total) {
					console.log(item, loaded, total);
				};
				this.textureLoader = new THREE.TextureLoader( this.manager );
				/* this.texture = this.textureLoader.load( 'https://threejs.org/examples/textures/UV_Grid_Sm.jpg' );*/
				this.texture = this.textureLoader.load( 'http://localhost:8080/Shoe_Orange.jpg' );
        this.texture.anisotropy = 16;

				// model
				const onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						const percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};
				const onError = function ( xhr ) {};
				this.loader = new THREE.OBJLoader( this.manager );
				/* this.loader.load( 'https://threejs.org/examples/obj/male02/male02.obj', object => {*/
				this.loader.load( 'http://localhost:8080/Shoe_Orange.obj', object => {
					object.traverse( child => {
						if ( child instanceof THREE.Mesh ) {
							child.material.map = this.texture;
						}
					} );
            // offset to center object
					  /* object.position.y = - 95;*/
					this.scene.add( object );
				}, onProgress, onError );




	      this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
	      this.material = new THREE.MeshNormalMaterial();
        this.material.map = this.texture;

	      this.mesh = new THREE.Mesh(this.geometry, this.material);
	      this.scene.add(this.mesh);




	      this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	      this.renderer.setSize( width, height );
	      this.node.appendChild( this.renderer.domElement );
    }

    updateCamera() {
        const {
            width = this.node.clientWidth,
            height = this.node.clientHeight,
        } = this.props;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    updateRenderer() {
        const {
            width = this.node.clientWidth,
            height = this.node.clientHeight,
        } = this.props;

	      this.renderer.setSize( width, height );
    }

    animate() {
        window.requestAnimationFrame( this.animate );
	      this.renderer.render( this.scene, this.camera );
    }

    render() {
        return <div style={this.props.style} ref={(el) => this.node = el}>
            <h2>Welcome to React components</h2>
        </div>
    }
}
