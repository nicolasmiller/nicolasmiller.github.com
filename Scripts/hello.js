var camera, scene, renderer;
var geometry, material, mesh;
var scale = 0.01;
var num_cubes = 50;
var cubes = [];
var scatter = 1000;
var extent = 0.5;

init();
animate();

function rand_int_range(x, y) {
    return Math.floor((Math.random() * Math.abs(x - y)) + Math.min(x, y));
}

function rand_rotation(extent) {
    return (Math.random() * extent) - (extent / 2);
}

function init() {
    var i = 0,
      size = rand_int_range(100, 400);

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.z = 1000;

		scene = new THREE.Scene();

		geometry = new THREE.CubeGeometry( size, size, size );
		material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );

    for(; i < num_cubes; i++) {
		    mesh = new THREE.Mesh( geometry, material );
        mesh.position.x += rand_int_range(-scatter, scatter);
        mesh.position.y += rand_int_range(-scatter, scatter);
        mesh.position.z += rand_int_range(-scatter, scatter);
        cubes.push(
            {
                mesh: mesh,
                x_rot: rand_rotation(extent),
                y_rot: rand_rotation(extent),
                z_rot: rand_rotation(extent)
            });
		    scene.add(mesh);
    }

		renderer = new THREE.CanvasRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild( renderer.domElement );
    console.log(mesh);
}

function animate() {
    var i = 0;

		// note: three.js includes requestAnimationFrame shim
		requestAnimationFrame( animate );
    for(; i < num_cubes; i++) {
        cubes[i].mesh.rotation.x += cubes[i].x_rot
        cubes[i].mesh.rotation.y += cubes[i].y_rot
    }

//		mesh.rotation.x += 0.05;
//		mesh.rotation.y += 0.06;
    // mesh.rotation.z += 0.03;
    // if(mesh.scale.x >= 2 || mesh.scale.x <= 0.99) {
    //     scale *= -1;
    // }

		// mesh.scale.x += scale;
		// mesh.scale.y += scale;
		// mesh.scale.z += scale;

		renderer.render( scene, camera );

}
