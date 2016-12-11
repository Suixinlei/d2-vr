/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   笑斌 <xinlei.sxl@alibaba-inc.com>
 */
// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

var controls = new THREE.VRControls(camera);
controls.standing = true;
controls.standing = true;

// light
var ambient = new THREE.AmbientLight( 0x101030 );
ambient.position.y = controls.userHeight + 30;
scene.add( ambient );

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// raycaster
var raycaster = new THREE.Raycaster();
// Mouse Position
var mouse = new THREE.Vector2();


// Add a repeating grid as a skybox.
var boxSize = 100;
var hudSize = 0.6;
var loader = new THREE.TextureLoader();
loader.load('img/box.png', onTextureLoaded);

function onTextureLoaded(texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(boxSize, boxSize);

  var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x01BE00,
    side: THREE.BackSide
  });

  // Align the skybox to the floor (which is at y=0).
  skybox = new THREE.Mesh(geometry, material);
  skybox.position.y = boxSize/2;
  scene.add(skybox);

  // For high end VR devices like Vive and Oculus, take into account the stage
  // parameters provided.
  setupStage();
}

// Create a VR manager helper to enter and exit VR mode.
var params = {
  hideButton: false, // Default: false.
  isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);

//----------------------Model---------------------------

// Create Gun Object
// var Gun_Geometry = new THREE.BoxGeometry(0.5, 0.5, 2);
// var Gun_Material = new THREE.MeshNormalMaterial();
// var gun = new THREE.Mesh(Gun_Geometry, Gun_Material);

// Create Laser Object
// var Laser_Geometry = new THREE.CylinderGeometry( 1, 1, 20, 32 );
// var Laser_Material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
// var cylinder = new THREE.Mesh( Laser_Geometry, Laser_Material );
// scene.add( cylinder );

//
// gun.position.set(-0.5, controls.userHeight - 0.5, 0);

//scene.add(gun);
loader.load('img/hover.png', onHUDLoaded);
function onHUDLoaded(texture) {
  var geometry = new THREE.PlaneGeometry(hudSize, hudSize, hudSize);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    // color: 0x01BE00,
    side: THREE.DoubleSide
  });

  hud = new THREE.Mesh(geometry, material);
  scene.add(hud);
}

//----------------------Model---------------------------

//----------------------Monster---------------------------

// monster spawn point
// 怪物生成点
var Monster_Spawn_Points = [];
[2, 3, 5, 6].forEach(function (var_radius) {
  var MonsterGeoMetry = new THREE.SphereGeometry(var_radius, 25, 5);
  for (var n = 52; n <= 77; n++) {
    Monster_Spawn_Points.push(MonsterGeoMetry.vertices[n]);
  }
});
console.log(Monster_Spawn_Points);

var onProgress = function ( xhr ) {
  // if ( xhr.lengthComputable ) {
  //   var percentComplete = xhr.loaded / xhr.total * 100;
  //   console.log( Math.round(percentComplete, 2) + '% downloaded' );
  // }
};

var onError = function (xhr) {

};

var ObjLoader = new THREE.OBJLoader();

var monsterGroup = [];
var Monster_Spawn_Number = 25;
ObjLoader.load('asset_src/a.obj', function (monster) {
  monster.rotateX(Math.PI);
  for (var i = 0; i < Monster_Spawn_Number; i ++) {
    var RealMonster = monster.children[0].clone();
    var Monster_Material1 = new THREE.MeshBasicMaterial({
      color: 0xf4c60b,
      // emissive: 0x0587fa,
      // emissiveIntensity: 0.5,
      shading: THREE.FlatShading,
    });
    RealMonster.material = Monster_Material1;
    var RandomNumber = Helper.getRandomInt(0, Monster_Spawn_Points.length -1);
    var RandomSpawnPoint = Monster_Spawn_Points[RandomNumber];
    Monster_Spawn_Points.splice(RandomNumber, 1);
    RealMonster.position.x = RandomSpawnPoint.x;
    RealMonster.position.y = RandomSpawnPoint.y;
    RealMonster.position.z = RandomSpawnPoint.z;
    monsterGroup.push(RealMonster);
  }
  monster1 = monster;
  Monster1_is_loaded = true;
}, onProgress, onError);
ObjLoader.load('asset_src/b.obj', function (monster) {
  for (var i = 0; i < Monster_Spawn_Number; i ++) {
    var RealMonster = monster.children[0].clone();
    var Monster_Material2 = new THREE.MeshBasicMaterial({
      color: 0xea6c00,
      shading: THREE.FlatShading,
    });
    RealMonster.material = Monster_Material2;
    var RandomNumber = Helper.getRandomInt(0, Monster_Spawn_Points.length -1);
    var RandomSpawnPoint = Monster_Spawn_Points[RandomNumber];
    Monster_Spawn_Points.splice(RandomNumber, 1);
    RealMonster.position.x = RandomSpawnPoint.x;
    RealMonster.position.y = RandomSpawnPoint.y;
    RealMonster.position.z = RandomSpawnPoint.z;
    monsterGroup.push(RealMonster);
  }
  Monster2_is_loaded = true;
}, onProgress, onError);
ObjLoader.load('asset_src/c.obj', function (monster) {
  for (var i = 0; i < Monster_Spawn_Number; i ++) {
    var RealMonster = monster.children[0].clone();
    var Monster_Material3 = new THREE.MeshBasicMaterial({
      color: 0xa452cb,
      shading: THREE.FlatShading,
    });
    RealMonster.material = Monster_Material3;
    var RandomNumber = Helper.getRandomInt(0, Monster_Spawn_Points.length -1);
    var RandomSpawnPoint = Monster_Spawn_Points[RandomNumber];
    Monster_Spawn_Points.splice(RandomNumber, 1);
    RealMonster.position.x = RandomSpawnPoint.x;
    RealMonster.position.y = RandomSpawnPoint.y;
    RealMonster.position.z = RandomSpawnPoint.z;
    monsterGroup.push(RealMonster);
  }
}, onProgress, onError);
ObjLoader.load('asset_src/d.obj', function (monster) {
  for (var i = 0; i < Monster_Spawn_Number; i ++) {
    var RealMonster = monster.children[0].clone();
    var Monster_Material4 = new THREE.MeshBasicMaterial({
      color: 0x20cdab,
      shading: THREE.FlatShading,
    });
    RealMonster.material = Monster_Material4;
    var RandomNumber = Helper.getRandomInt(0, Monster_Spawn_Points.length -1);
    var RandomSpawnPoint = Monster_Spawn_Points[RandomNumber];
    Monster_Spawn_Points.splice(RandomNumber, 1);
    RealMonster.position.x = RandomSpawnPoint.x;
    RealMonster.position.y = RandomSpawnPoint.y;
    RealMonster.position.z = RandomSpawnPoint.z;
    monsterGroup.push(RealMonster);
  }
}, onProgress, onError);

var isMonsterSpawn = false;
var monsterDisplayGroup = new THREE.Object3D();
var startMonsterSpawn = function () {
  scene.add(monsterDisplayGroup);
  isMonsterSpawn = true;
};

var addMonster = function () {
  monsterGroup.forEach(function (value) {
    monsterDisplayGroup.add(value);
  });
  // var monster = monsterGroup.pop();
  // monsterDisplayGroup.add(monster);
};


//----------------------Monster---------------------------

var monsterShock = { x: 0, y: 0, z: 0 };
var tween = new TWEEN.Tween(monsterShock)
  .to({ x: 100, y: 100, z: 100 }, 1000)
  .repeat(Infinity)//无限重复
  .yoyo(true)//到达to的值后回到from的值
  .onUpdate(function(interpolation) {
    //interpolation 值域在[0,1]，this指向了monsterShock
    var monsterArr = monsterDisplayGroup.children;
    monsterArr.forEach(function (mon) {
      if (interpolation > 0.5) {
        mon.position.y += 0.001;
      } else {
        mon.position.y -= 0.001;
      }
    });
  })
  .start();

//----------------------Cabinet---------------------------
var hemiLight;
hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

ObjLoader.load('asset_src/box(2).obj', function (cabinet) {
  cabinet.material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(6, 135, 250)
  });

  //阵列的长宽个数
  var matrixW = 10;
  var matrixH = 10;

  //阵列中心空缺的长宽个数
  var vacancyW = 3;
  var vacancyH = 3;

  //辅助运算的变量
  var outsideLeft = (matrixW - vacancyW)/2;
  var outsideRight = matrixW - outsideLeft;
  var outsideTop = (matrixH - vacancyH)/2;
  var outsideBottom = matrixH - outsideTop;

  //循环生成阵列
  for (var i = 0; i < matrixW; i++) {
    for (var j = 0; j < matrixH; j++) {
      if (i >= outsideLeft && i <= outsideRight && j >= outsideTop && j <= outsideBottom) {
        continue;
      }
      var newPbj = cabinet.clone();
      newPbj.position.x = -boxSize/2 + (i + 0.5) * boxSize/matrixW;
      newPbj.position.z = -boxSize/2 + (j + 0.5) * boxSize/matrixH;
      newPbj.rotateX(- Math.PI/2);

      scene.add(newPbj);
    }
  }
//  cabinet.position.z = 0;
//  cabinet.position.x = 0;
//
//  cabinet.rotateX(- Math.PI/2);


//  scene.add(cabinet);
}, onProgress, onError);
//----------------------Cabinet---------------------------

//
var GUIControl = {
  start: function () {
    startMonsterSpawn();
  },
  add: function () {
    addMonster();
  }
};

var gui = new dat.GUI();
gui.add(GUIControl, 'start');
gui.add(GUIControl, 'add');

var stats = new Stats();
document.body.appendChild( stats.dom );

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);
window.addEventListener('mousemove', onMouseMove, true);

// Request animation frame loop function
var lastRender = 0;
var cursor = new THREE.Vector2(0, 0);
function animate(timestamp) {
  stats.update();
  tween.update(timestamp);

  var direction = camera.getWorldDirection();
//  console.log(direction); // 方向输出

  raycaster.setFromCamera(mouse, camera );

  // calculate objects intersecting the picking ray
  if (isMonsterSpawn) {
    var intersects = raycaster.intersectObjects( monsterDisplayGroup.children );

    intersects.length > 0 ? console.log(intersects) : ''; // 鼠标指向
    console.log(intersects);
    if (intersects.length == 0) {
      hud.position.x = 0;
      hud.position.y = -1;
      hud.position.z = 0;
    }

    for ( var i = 0; i < intersects.length; i++ ) {

      hud.position.x = intersects[i].object.position.x;
      hud.position.y = intersects[i].object.position.y;
      hud.position.z = intersects[i].object.position.z;
      // intersects[ i ].object.material.color.set( 0xff0000 );
    }
  }

  // monsterDisplayGroup.children.map(function (monster) {
  //   monster.rotation.y += 0.01;
  //   return monster;
  // });

  hud.lookAt(camera.position);

  var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  controls.update();
  // Render the scene through the manager.
  manager.render(scene, camera, timestamp);
  effect.render(scene, camera);

  vrDisplay.requestAnimationFrame(animate);
}

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

 mouse.x = 0;
 mouse.y = 0;

//  console.log('mouse', mouse); // 鼠标位置

}

var vrDisplay;

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
  navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
      if (vrDisplay.stageParameters) {
        setStageDimensions(vrDisplay.stageParameters);
      }
      vrDisplay.requestAnimationFrame(animate);
    }
  });
}

function setStageDimensions(stage) {
  // Make the skybox fit the stage.
  var material = skybox.material;
  scene.remove(skybox);

  // Size the skybox according to the size of the actual stage.
  var geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
  skybox = new THREE.Mesh(geometry, material);

  // Place it on the floor.
  skybox.position.y = boxSize/2;
  scene.add(skybox);

  // Place the cube in the middle of the scene, at user height.
  cube.position.set(0, controls.userHeight, 0);
}