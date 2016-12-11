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
var Gun_Geometry = new THREE.BoxGeometry(0.5, 0.5, 2);
var Gun_Material = new THREE.MeshNormalMaterial();
var gun = new THREE.Mesh(Gun_Geometry, Gun_Material);

// Create Laser Object
var Laser_Geometry = new THREE.CylinderGeometry( 1, 1, 20, 32 );
var Laser_Material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var cylinder = new THREE.Mesh( Laser_Geometry, Laser_Material );
scene.add( cylinder );

//
gun.position.set(-0.5, controls.userHeight - 0.5, 0);

//scene.add(gun);
//----------------------Model---------------------------

//----------------------Monster---------------------------

// monster spawn point
// 怪物生成点
var Monster_Spawn_Points = [];
[4, 7, 11].forEach(function (var_radius) {
  var MonsterGeoMetry = new THREE.SphereGeometry(var_radius, 25, 5);
  for (var n = 52; n <= 77; n++) {
    Monster_Spawn_Points.push(MonsterGeoMetry.vertices[n]);
  }
});
console.log(Monster_Spawn_Points);

for (var i=0; i< Monster_Spawn_Points.length; i++) {
  var geometry2 = new THREE.BoxGeometry(0.3, 0.5, 0.5);
  var material2 = new THREE.MeshNormalMaterial();
  var cube2 = new THREE.Mesh(geometry2, material2);
//  var SphereLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshNormalMaterial());
//  console.log(Monster_Spawn_Points[i]);
  cube2.position.x = Monster_Spawn_Points[i].x;
  cube2.position.y = Monster_Spawn_Points[i].y;
  cube2.position.z = Monster_Spawn_Points[i].z;
  scene.add(cube2);
}



var onProgress = function ( xhr ) {
  if ( xhr.lengthComputable ) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log( Math.round(percentComplete, 2) + '% downloaded' );
  }
};

var onError = function (xhr) {

};

var ObjLoader = new THREE.OBJLoader();
var monster1 = null;
var monster2 = null;
var monster3 = null;
var monster4 = null;
var keyboard1 = null;//键盘初始状态
var keyboard2 = null;//键盘状态2
var keyboard3 = null;//键盘状态3
var boom = null;//键盘
var shoot1 = null;//子弹
var boom1 = null;//大招
var pointer1=null;//准星

var Monster1_is_loaded = false;
var Monster2_is_loaded = false;
var Monster3_is_loaded = false;
var Monster4_is_loaded = false;
var keyboardloaded=false;//判断加载是否完成
var keyboardloaded2=false;//判断加载是否完成
var keyboardloaded3=false;//判断加载是否完成
var shoot1Loaded=false;//判断加载是否完成
var boomLoaded=false;//判断加载是否完成
var pointer1Loaded=false;

var monsterGroup = new THREE.Object3D();
var Monster_Material = new THREE.MeshNormalMaterial();
//ObjLoader.setMaterials(Monster_Material);

var texture = THREE.ImageUtils.loadTexture("img/keyboard.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:texture});
  material.transparent=true;
  material.opacity=1;
  var keyboardGeometry = new THREE.BoxGeometry(0.5, 0, 0.125);
  var mesh = new THREE.Mesh( keyboardGeometry,material );
  keyboard1 = mesh;
  //console.log(mesh)
  scene.add( mesh );
  keyboardloaded=true;
});
var pointer = THREE.ImageUtils.loadTexture("img/sight-bead-white.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:pointer});
  material.transparent=true;
  material.opacity=1;
  var pointerGeometry = new THREE.BoxGeometry(0.125, 0.125, 0);
  var mesh = new THREE.Mesh( pointerGeometry,material );
  pointer1 = mesh;
  scene.add( mesh );
  pointer1Loaded=true;
});
var texture1 = THREE.ImageUtils.loadTexture("img/keyboard1.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:texture1});
  material.transparent=true;
  material.opacity=0;
  var keyboardGeometry = new THREE.BoxGeometry(0.5, 0, 0.125);
  var mesh = new THREE.Mesh( keyboardGeometry,material );
  keyboard2 = mesh;
  scene.add( mesh );
  keyboardloaded2=true;
});
var texture2 = THREE.ImageUtils.loadTexture("img/keyboard2.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:texture2});
  material.transparent=true;
  material.opacity=0;
  var keyboardGeometry = new THREE.BoxGeometry(0.5, 0, 0.125);
  var mesh = new THREE.Mesh( keyboardGeometry,material );
  keyboard3 = mesh;
  //scene.add( mesh );
  keyboardloaded3=true;
});
var shoot = THREE.ImageUtils.loadTexture("img/shoot.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:shoot});
  material.transparent=true;
  //material.opacity=0;
  var shootGeometry = new THREE.BoxGeometry( 0.1, 0.1,0);
  var mesh = new THREE.Mesh( shootGeometry,material );
  shoot1 = mesh;
  scene.add( mesh );
  shoot1Loaded=true;
});
ObjLoader.load('asset_src/boom.obj', function (boom) {//爆炸特效
  boom.material = new THREE.MeshLambertMaterial();
  //boom.position.x = -1;
  //boom.position.y = controls.userHeight;
  //boom.position.z = -2.2;
  //boom.rotation.y = 90;
  //monsterGroup.add(boom);
  boom1 = boom;
  scene.add(boom);

  boomLoaded = true;
}, onProgress, onError);
ObjLoader.load('asset_src/a.obj', function (monster) {
  monster.material = new THREE.MeshLambertMaterial();
  monster.position.y = controls.userHeight;
  monster.position.z = -1.2;
//  monster.lookAt(camera.position);
//  monster.position.x = -1;
  monster.rotateX(Math.PI);
//  monster.rotation.y = 90;
  monsterGroup.add(monster);
  monster1 = monster;

  var BoxGeometry = new THREE.BoxGeometry(5, 5, 5);
  var BoxMaterial = new THREE.MeshLambertMaterial();
  var Box = new THREE.Mesh(BoxGeometry, BoxMaterial);
  Box.position.y = controls.userHeight;
  Box.position.z = -1.2;
  scene.add(Box);

  Monster1_is_loaded = true;
}, onProgress, onError);
ObjLoader.load('asset_src/b.obj', function (monster) {
  monster.material = new THREE.MeshLambertMaterial();
  monster.position.y = controls.userHeight;
  monster.position.z = -1.5;
  monster.position.x = -1;
//  monster.lookAt(camera.position);
//  monster.rotateX(Math.PI);
//  monster.rotation.y = 90;

  monsterGroup.add(monster);
  monster2 = monster;
  Monster2_is_loaded = true;
}, onProgress, onError);
ObjLoader.load('asset_src/c.obj', function (monster) {
  monster.material = new THREE.MeshLambertMaterial();
  monster.position.y = controls.userHeight;
  monster.position.z = -1.2;
  monster.position.x = -2;
//  monster.lookAt(camera.position);
//  monster.rotateX(Math.PI);
//  monster.rotation.y = 90;

  monsterGroup.add(monster);
  monster3 = monster;
  Monster3_is_loaded = true;
}, onProgress, onError);
ObjLoader.load('asset_src/d.obj', function (monster) {
  monster.material = new THREE.MeshLambertMaterial();
  monster.position.y = controls.userHeight;
  monster.position.z = -1.2;
  monster.position.x = -3;
  monster.rotateX(Math.PI);
//  monster.lookAt(camera.position);
//  monster.rotation.y = 90;

  monsterGroup.add(monster);
  monster4 = monster;
  Monster4_is_loaded = true;
}, onProgress, onError);

var isMonsterSpawn = false;
var startMonsterSpawn = function () {
  scene.add(monsterGroup);
  isMonsterSpawn = true;
};


//----------------------Monster---------------------------

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
  }
};

var gui = new dat.GUI();
gui.add(GUIControl, 'start');

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);
window.addEventListener('mousemove', onMouseMove, true);

// Request animation frame loop function
var lastRender = 0;
var cursor = new THREE.Vector2(0, 0);
var shootCount=0;//子弹计时器
var shootFlag=75;//子弹帧数
var shootStartPos=null;
function animate(timestamp) {
  var direction = camera.getWorldDirection();
  gun.lookAt(direction);
//  console.log(direction); // 方向输出

  raycaster.setFromCamera(mouse, camera );

  // calculate objects intersecting the picking ray
  if (isMonsterSpawn) {
    var intersects = raycaster.intersectObjects( monsterGroup.children, true );

    intersects.length > 0 ? console.log(intersects) : ''; // 鼠标指向

    for ( var i = 0; i < intersects.length; i++ ) {

      intersects[ i ].object.material.color.set( 0xff0000 );

    }
  }
//  const monsters = [];
//  scene.children.forEach(function (value) {
//    if (!(value.geometry instanceof THREE.BoxGeometry)) {
//      monsters.push(value);
//    }
//  });
//  console.log(monsters);



  monster1.rotation.y += 0.01;
  monster2.rotation.y += 0.01;
  monster3.rotation.y += 0.01;
  monster4.rotation.y += 0.01;

  var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  controls.update();
  // Render the scene through the manager.
  manager.render(scene, camera, timestamp);
  effect.render(scene, camera);
  //准星随视角移动
  if(pointer1Loaded){
    pointer1.position.copy( camera.position );// 复制位置
    pointer1.rotation.copy( camera.rotation );// 复制视角偏移角度
    //pointer1.translateY( 0.3 );
    pointer1.translateZ( - 1.5 );
  }
  if(boomLoaded){
    boom1.position.copy( camera.position );// 复制位置
    boom1.rotation.copy( camera.rotation );// 复制视角偏移角度
    boom1.updateMatrix();
    boom1.translateY( - 0.3 );
    boom1.translateZ( - 0.45 );
    //console.log(boom1)
    //changeKeyboard(keyboard1,keyboard2,1000)
  }
  //键盘随视角移动
  if(keyboardloaded){

    keyboard1.position.copy( camera.position );// 复制位置
    keyboard1.rotation.copy( camera.rotation );// 复制视角偏移角度
    //keyboard1.updateMatrix();
    keyboard1.translateY( - 0.3 );
    keyboard1.translateZ( - 0.45 );

    keyboard2.position.copy( camera.position );
    keyboard2.rotation.copy( camera.rotation );
    //keyboard2.updateMatrix();
    keyboard2.translateY( - 0.3 );
    keyboard2.translateZ( - 0.45 );
    //changeKeyboard(keyboard1,keyboard2,1000)
  }
  if(shoot1Loaded){
    shoot1.position.copy( camera.position );
    shoot1.rotation.copy( camera.rotation );
    //boom1.position.copy( camera.position );
    //boom1.rotation.copy( camera.rotation );
    //shoot1.updateMatrix();
    shoot1.translateY( - 0.27 );//-0.2~0
    shoot1.translateZ( - 0.5);
    if(shootCount==0){
      shootStartPos=shoot1.position;
      //console.log(shootStartPos)
    }
    shootFly(shoot1,shootStartPos,monster1.position,shootFlag,shootCount)
    shootFly(boom1,shootStartPos,monster1.position,shootFlag,0)
    shootCount=(shootCount+1)%shootFlag;
    //changeKeyboard(keyboard1,keyboard2,1000)
  }
  //var shootStartPosition=camera.position,shootEndPosition=monster1.position;
  //shootLine(shootStartPosition,shootEndPosition,shootFlag,shootCount)
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

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

//  mouse.x = 0;
//  mouse.y = 0;

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

function changeKeyboard(key1,key2,flag){//初始键盘对象,最终键盘对象,过渡帧数
  //key1.material.opacity=1;
  //key2.material.opacity=0;
  if(key1.material.opacity>0){
    key1.material.opacity-=1/flag;
    key2.material.opacity+=1/flag;
  }else{
    key1.material.opacity=0;
    key2.material.opacity=1;
  }
}

function shootFly(shoot,startPos,endPos,flag,count){//子弹对象,初始位置,目标点位置,过渡帧数,计时器
  var position=new THREE.Vector3(startPos.x+(endPos.x-startPos.x)*count/flag,startPos.y+(endPos.y-startPos.y)*count/flag,startPos.z+(endPos.z-startPos.z)*count/flag);
  shoot.position.copy( position );
  shoot.rotation.copy( camera.rotation );
  shoot.updateMatrix();
  shoot.translateY( -0.27+ 0.27*count/flag );//-0.2~0
}