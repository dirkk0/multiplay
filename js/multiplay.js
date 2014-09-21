window.onload=function(){

// best way to un-global this ...?
socket = io.connect();


            Math.seedrandom('def')

            var players = [];

            var stats;

            scene = '';
            var camera, renderer //, scene;
            var geometry, material, mesh;
            var controls;

            var objects = [];

            var ray;
            var camera;

            var blocker = document.getElementById( 'blocker' );
            var instructions = document.getElementById( 'instructions' );

            // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

            if ( havePointerLock ) {

                var element = document.body;

                var pointerlockchange = function ( event ) {

                    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

                        controls.enabled = true;

                        blocker.style.display = 'none';

                    } else {

                        controls.enabled = false;

                        blocker.style.display = '-webkit-box';
                        blocker.style.display = '-moz-box';
                        blocker.style.display = 'box';

                        instructions.style.display = '';

                    }

                }

                var pointerlockerror = function ( event ) {

                    instructions.style.display = '';

                }

                // Hook pointer lock state change events
                document.addEventListener( 'pointerlockchange', pointerlockchange, false );
                document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
                document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

                document.addEventListener( 'pointerlockerror', pointerlockerror, false );
                document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
                document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

                instructions.addEventListener( 'click', function ( event ) {

                    instructions.style.display = 'none';

                    // Ask the browser to lock the pointer
                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                    if ( /Firefox/i.test( navigator.userAgent ) ) {

                        var fullscreenchange = function ( event ) {

                            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                                document.removeEventListener( 'fullscreenchange', fullscreenchange );
                                document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                                element.requestPointerLock();
                            }

                        }

                        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                        element.requestFullscreen();

                    } else {

                        element.requestPointerLock();

                    }

                }, false );

            } else {

                instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

            }




// var toggle = false;
// var onKeyUp = function ( event ) {
//     switch( event.keyCode ) {
//         case 66: // b
//         console.log('toogggle')
//             toggle = !toggle;
//             break;
//     }
// };
// document.addEventListener( 'keyup', onKeyUp, false );


            init();
            animate();

            function init() {
me = getUrlVars()["me"];

angle = parseFloat(getUrlVars()["angle"], 10);
if (isNaN(angle)) {
    angle = 0.0;
}
console.log(angle)

slave = getUrlVars()["slave"];
if (!slave) slave = 0



                camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );

                scene = new THREE.Scene();
                scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
                scene.fog.color.setHSL( 0.6, 0, 1 );

                controls = new THREE.PointerLockControls( camera );
                scene.add( controls.getObject() );
                if (slave === 0)
                {
                    ray = new THREE.Raycaster();
                    ray.ray.direction.set( 0, -1, 0 );

                }



                var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
                light.position.set( 1, 1, 1 );
                scene.add( light );

                var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
                light.position.set( -1, - 0.5, -1 );
                scene.add( light );
                
                // floor

                geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
                geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

                for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

                    var vertex = geometry.vertices[ i ];
                    vertex.x += Math.random() * 20 - 10;
                    vertex.y += Math.random() * 2;
                    vertex.z += Math.random() * 20 - 10;

                }

                for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

                    var face = geometry.faces[ i ];
                    face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
                    face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
                    face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

                }

                material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
                // material = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505, perPixel: true } );;

                ground = new THREE.Mesh( geometry, material );
                ground.receiveShadow = true
                scene.add( ground );

                // // objects

                geometry = new THREE.BoxGeometry( 20, 20, 20 );

                for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

                    var face = geometry.faces[ i ];
                    face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
                    face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
                    face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

                }

                for ( var i = 0; i < 500; i ++ ) {

                    material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

                    var mesh = new THREE.Mesh( geometry, material );
                    mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
                    mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
                    mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

                    mesh.receiveShadow = true;
                    mesh.castShadow = true;
                    scene.add( mesh );

                    material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

                    objects.push( mesh );

                }

                //




    createThing = function(name) {  
        var p = new THREE.Mesh(
            new THREE.BoxGeometry(5, 10, 5),
            new THREE.MeshBasicMaterial({
                color: 0x0000ff,
                wireframe: false
            })
        );
        p.castShadow = true;
        p.receiveShadow = true;
        p.name = name
        scene.add( p );
        p.position.y = 300;
        p.position.z = 0;

        players.push(name)
    }

    deleteThing = function(name) {
        scene.remove(scene.getObjectByName(name))
    }


    socket.on('m4', function(data) {
        // new player
        obj = JSON.parse(data);
        console.log('received new player: ' + obj.name)
        // CREATE SPRITE HERE
        createThing(obj.name)
    });

    socket.on('m6', function(data) {
        // newly connected, get player list
        obj = JSON.parse(data);
        console.log('get player list: ' + obj)
        obj.forEach(function(entry) {
            createThing(entry);
        });
    });

    socket.on('m5', function(data) {
        // delete player
        obj = JSON.parse(data);
        console.log('delete player: ' + obj.name)
        // CREATE SPRITE HERE
        deleteThing(obj.name)
    });

    socket.on('m2', function(data) {
        // receive coordinates and rotation
        obj = JSON.parse(data);

    if (slave == obj.n)
    {
        // console.log(angle)
        camera.parent.parent.position.x = obj.cx;
        camera.parent.parent.position.y = obj.cy;
        camera.parent.parent.position.z = obj.cz;
        camera.parent.rotation.x = obj.rx;
        camera.parent.parent.rotation.y = obj.ry + angle;
    }
    else
    {
        scene.getObjectByName( obj.n).position.x = obj.cx;
        scene.getObjectByName( obj.n).position.y = obj.cy;
        scene.getObjectByName( obj.n).position.z = obj.cz;
        scene.getObjectByName( obj.n).rotation.x = obj.rx;
        scene.getObjectByName( obj.n).rotation.y = obj.ry;
        scene.getObjectByName( obj.n).rotation.z = obj.rz;
    }
    });

yawObject = '';

function getUrlVars() {
    var vars = {}, parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) { vars[key] = value;});
    return vars;
  }


socket.on('connect', function() { 
    console.log( me +' connected to server');
    socket.emit('m3', JSON.stringify({'name': me}))

if (!slave == 0){
    // controls.enabled = true;
    blocker.style.display = 'none';
}


});
socket.on('disconnect', function() { 
    console.log('disconnected from server'); 
});


if (window.WebGLRenderingContext)
    renderer = new THREE.WebGLRenderer();
                // renderer = new THREE.WebGLRenderer( { antialias: true } );
else
    renderer = new THREE.CanvasRenderer();

                renderer.setSize( window.innerWidth, window.innerHeight );
                document.body.appendChild( renderer.domElement );

                renderer.setClearColor( scene.fog.color, 1 );

                renderer.gammaInput = true;
                renderer.gammaOutput = true;

                renderer.shadowMapEnabled = true;
                renderer.shadowMapCullFace = THREE.CullFaceBack;

                stats = new Stats();
                setInterval( function () {
                    stats.begin();
                    // your code goes here
                    stats.end();
                }, 1000 / 60 );
                document.body.appendChild( stats.domElement );

                effect = new THREE.AnaglyphEffect( renderer );
                effect.setSize( window.innerWidth, window.innerHeight  );

                window.addEventListener( 'resize', onWindowResize, false );

            }

            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );
                effect.setSize( window.innerWidth, window.innerHeight  );

            }
            function animate() {

                requestAnimationFrame( animate );

                if (slave === 0)
                {
                    controls.isOnObject( false );

                    ray.ray.origin.copy( controls.getObject().position );
                    ray.ray.origin.y -= 10;

                    var intersections = ray.intersectObjects( objects );

                    if ( intersections.length > 0 ) {
                        var distance = intersections[ 0 ].distance;
                        if ( distance > 0 && distance < 10 ) {
                            controls.isOnObject( true );
                        }
                    }

                    controls.update();
// if (me === 'u2')
// {
//     console.log(camera)
// }

                }


                renderer.render( scene, camera );
            }
        }
