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

  // var geometry = new THREE.BoxGeometry(boxSize, boxSize/4, boxSize);
  var geometry = new THREE.PlaneGeometry(boxSize, boxSize);
  geometry.rotateX(Math.PI/2);

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x0587fa,
    side: THREE.DoubleSide,
    // wireframe: true
  });

  // Align the skybox to the floor (which is at y=0).
  skybox = new THREE.Mesh(geometry, material);
  // skybox.position.y = boxSize/8;
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
var startPage;
var startPageHover;
var playBtn;
var playBtnHover;
var showstartHoverEffect = true;

function showStartPage() {
  var loader = new THREE.TextureLoader();
  loader.load('img/start-page.png', function(texture){
    var geometry = new THREE.PlaneGeometry( 1.344, 0.75, 32 );
    var material = new THREE.MeshBasicMaterial( {
      map: texture,
      //color: 0xffff00,
      side: THREE.DoubleSide,
      //opacity:0.6,
      transparent: true
    } );
    startPage = new THREE.Mesh( geometry, material );
    startPage.position.set(0, controls.userHeight, -0.5)
    scene.add( startPage );
  });
  var loader = new THREE.TextureLoader();
  loader.load('img/play-normal.png', function(texture){
    var geometry = new THREE.PlaneGeometry( 0.212, 0.056, 32 );
    var material = new THREE.MeshBasicMaterial( {
      map: texture,
      //color: 0xffff00,
      side: THREE.DoubleSide,
      //opacity:0.6,
      transparent: true
    } );
    playBtn = new THREE.Mesh( geometry, material );
    playBtn.position.set(0, controls.userHeight-0.25, -0.48)
    scene.add( playBtn );
  });
  var loader = new THREE.TextureLoader();
  loader.load('img/play-hover.png', function(texture){
    var geometry = new THREE.PlaneGeometry( 0.212, 0.056, 32 );
    var material = new THREE.MeshBasicMaterial( {
      map: texture,
      //color: 0xffff00,
      side: THREE.DoubleSide,
      opacity:0,
      transparent: true
    } );
    playBtnHover = new THREE.Mesh( geometry, material );
    playBtnHover.position.set(0, controls.userHeight-0.25, -0.46)
    scene.add( playBtnHover );
  });
}

function pureRemoveMesh(mesh) {
  if (!mesh) {
    return;
  }
  var it = setInterval(function() {
    mesh.material.opacity -= 0.1;
    if (mesh.material.opacity <= 0) {
      window.clearInterval(it);
      scene.remove(mesh);
      console.log(startPage)
    }
  },20);
}

function removeStartPage() {
  showstartHoverEffect = true;
  pureRemoveMesh(startPage);
  startPage = null;
  pureRemoveMesh(playBtn);
  playBtn = null;
  pureRemoveMesh(playBtnHover);
  playBtnHover = null;
}


document.addEventListener("touchstart",function(e){
  if (playBtn && playBtnHover) {
    var intersects = raycaster.intersectObject( playBtn );
    if (intersects.length) {
      console.log('game start!')
      removeStartPage()
    }
  }
  console.log(e)
}, false);



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
var monster1 = null;
//var monster2 = null;
//var monster3 = null;
//var monster4 = null;
var keyboard1 = null;//键盘初始状态
var keyboard2 = null;//键盘状态2
var keyboard3 = null;//键盘状态3

var shoot1 = null;//子弹
var boom1 = null;//大招
var boom2 = null;//大招提示
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
var boom2Loaded=false;//判断加载是否完成
var pointer1Loaded=false;

var monsterGroup = new THREE.Object3D();
var Monster_Material = new THREE.MeshNormalMaterial();
//ObjLoader.setMaterials(Monster_Material);

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
  var keyboardGeometry = new THREE.BoxGeometry(1/3, 0.1, 0);
  var mesh = new THREE.Mesh( keyboardGeometry,material );
  keyboard1 = mesh;
  //console.log(mesh)
  scene.add( mesh );
  keyboardloaded=true;
});
var texture2 = THREE.ImageUtils.loadTexture("img/keyboard2.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:texture2});
  material.transparent=true;
  material.opacity=0;
  var keyboardGeometry = new THREE.BoxGeometry(1/3, 0.1, 0);
  var mesh = new THREE.Mesh( keyboardGeometry,material );
  keyboard2 = mesh;
  scene.add( mesh );
  keyboardloaded2=true;
});
var texture3 = THREE.ImageUtils.loadTexture("img/keyboard3.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:texture3});
  material.transparent=true;
  material.opacity=1;
  var keyboardGeometry = new THREE.BoxGeometry(1/3, 0.1, 0);
  var mesh = new THREE.Mesh( keyboardGeometry,material );
  keyboard3 = mesh;
  scene.add( mesh );
  keyboardloaded3=true;
});
var shoot = THREE.ImageUtils.loadTexture("img/shoot.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:shoot});
  material.transparent=true;
  //material.opacity=0;
  var shootGeometry = new THREE.BoxGeometry( 0.3, 0.3,0);
  //console.log(shootGeometry)
  var mesh = new THREE.Mesh( shootGeometry,material );
  shoot1 = mesh;
  scene.add( mesh );
  shoot1Loaded=true;
});
var boomTip = THREE.ImageUtils.loadTexture("img/boom.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:boomTip});
  material.transparent=true;
  //material.opacity=0;
  var boom2Geometry = new THREE.BoxGeometry( 0.7, 0.4,0);
  console.log(boom2Geometry)
  var mesh = new THREE.Mesh( boom2Geometry,material );
  boom2 = mesh;
  //scene.add( mesh );
  boom2Loaded=true;
});

ObjLoader.load('asset_src/boom.obj', function (boom) {//爆炸特效
  //boom = boom.children[0];
  boom.material = new THREE.MeshBasicMaterial({
    color: 0xF00000,
    //shading: THREE.FlatShading,
  });
  //boom.position.x = -1;
  //console.log(boom)
  boom.scale.set(0.25,0.25,0.25)
  //boom.material.opacity.set(0)
  boom.position.y = controls.userHeight;
  boom.position.z = -1.2;
  boom1 = boom;
  boomLoaded = true;
  scene.add(boom);
}, onProgress, onError);

var monsterGroup = [];
var Monster_Spawn_Number = 10;
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
    RealMonster.lookAt(camera.position);
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
    RealMonster.lookAt(camera.position);
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
    RealMonster.lookAt(camera.position);
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
    RealMonster.lookAt(camera.position);
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
  // monsterGroup.forEach(function (value) {
  //   monsterDisplayGroup.add(value);
  // });
  var monster = monsterGroup.pop();
  monsterDisplayGroup.add(monster);
};

var removeMonster = function () {
  monsterDisplayGroup.children.pop();
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
      if (interpolation >= 0.5) {
        mon.position.y += 0.001;
        mon.position.x += 0.001;
        mon.rotation.y += Math.PI / 2 / 200;
      } else {
        mon.position.y -= 0.001;
        mon.position.x -= 0.001;
        mon.rotation.y -= Math.PI / 2 / 200;
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

// ObjLoader.load('asset_src/box(2).obj', function (cabinet) {
//   cabinet.material = new THREE.MeshLambertMaterial({
//     color: new THREE.Color(6, 135, 250)
//   });
//
//   //阵列的长宽个数
//   var matrixW = 10;
//   var matrixH = 10;
//
//   //阵列中心空缺的长宽个数
//   var vacancyW = 3;
//   var vacancyH = 3;
//
//   //辅助运算的变量
//   var outsideLeft = (matrixW - vacancyW)/2;
//   var outsideRight = matrixW - outsideLeft;
//   var outsideTop = (matrixH - vacancyH)/2;
//   var outsideBottom = matrixH - outsideTop;
//
//   //循环生成阵列
//   for (var i = 0; i < matrixW; i++) {
//     for (var j = 0; j < matrixH; j++) {
//       if (i >= outsideLeft && i <= outsideRight && j >= outsideTop && j <= outsideBottom) {
//         continue;
//       }
//       var newPbj = cabinet.clone();
//       newPbj.position.x = -boxSize/2 + (i + 0.5) * boxSize/matrixW;
//       newPbj.position.z = -boxSize/2 + (j + 0.5) * boxSize/matrixH;
//       newPbj.rotateX(- Math.PI/2);
//
//       scene.add(newPbj);
//     }
//   }
// }, onProgress, onError);

function addCabinet() {
  var cabinetGroup = new THREE.Object3D();
  var geometry = new THREE.BoxGeometry(4,12,4);

  var texture = new THREE.TextureLoader().load( "img/cabinet-bg.png" );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 3 );

  var material = new THREE.MeshPhongMaterial({
    map: texture,
    color: 0xffffff,
    // transparent: true,
    // opacity: 1,
    // wireframe: true
  });
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.y = 5

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
      if (i >= outsideLeft && i < outsideRight && j >= outsideTop && j < outsideBottom) {
        continue;
      }
      var newPbj = mesh.clone();
      newPbj.position.x = -boxSize/2 + (i + 0.5) * boxSize/matrixW;
      newPbj.position.z = -boxSize/2 + (j + 0.5) * boxSize/matrixH;
      // newPbj.rotateX(- Math.PI/2);

      cabinetGroup.add(newPbj);
    }
  }

  // mesh.position.z = -6;
  // cabinetGroup.add(mesh);

  scene.add(cabinetGroup);
}

addCabinet();
//----------------------Cabinet---------------------------

//
var GUIControl = {
  start: function () {
    startMonsterSpawn();
  },
  showStartPage: function () {
    showStartPage();
  },
  removeStartPage: function () {
    removeStartPage();
  },
  add: function () {
    addMonster();
  },
  remove: function () {
    removeMonster();
  }
};

var gui = new dat.GUI();
gui.add(GUIControl, 'start');
gui.add(GUIControl, 'showStartPage');
gui.add(GUIControl, 'removeStartPage');
gui.add(GUIControl, 'add');
gui.add(GUIControl, 'remove');

var stats = new Stats();
document.body.appendChild( stats.dom );

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
  stats.update();
  tween.update(timestamp);

  var direction = camera.getWorldDirection();
//  console.log(direction); // 方向输出

  raycaster.setFromCamera(mouse, camera );

  // calculate objects intersecting the picking ray
  if (isMonsterSpawn) {
    var intersects = raycaster.intersectObjects( monsterDisplayGroup.children );

    intersects.length > 0 ? console.log(intersects) : ''; // 鼠标指向
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

  if (playBtn&&playBtnHover) {
    var intersects = raycaster.intersectObject( playBtn );
    var step = 0.02;
    if (intersects.length) {
      if (showstartHoverEffect) {
        playBtnHover.material.opacity -= step;
        if (playBtnHover.material.opacity<=0) {
          showstartHoverEffect = false;
        }
      } else {
        playBtnHover.material.opacity += step;
        if (playBtnHover.material.opacity>=1) {
          showstartHoverEffect = true;
        }
      }
    } else if (playBtnHover) {
      playBtnHover.material.opacity = 0;
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
    //boom1.updateMatrix();
    boom1.translateX( 1 );
    boom1.translateZ( - 1 );
    //console.log(boom1.material)
    //console.log(boom1)
    //changeKeyboard(keyboard1,keyboard2,1000)
  }
  if(boom2Loaded){
    boom2.position.copy( camera.position );// 复制位置
    boom2.rotation.copy( camera.rotation );// 复制视角偏移角度
    boom2.translateY( -0.25 );
    boom2.translateZ( -1.5 );
  }

  //键盘随视角移动
  if(keyboardloaded) {

    keyboard1.position.copy(camera.position);// 复制位置
    keyboard1.rotation.copy(camera.rotation);// 复制视角偏移角度
    //keyboard1.updateMatrix();
    keyboard1.translateY(-0.2);
    keyboard1.translateZ(-0.4);
  }
  if(keyboardloaded2){
    keyboard2.position.copy(camera.position);
    keyboard2.rotation.copy(camera.rotation);
    //keyboard2.updateMatrix();
    keyboard2.translateY(-0.2);
    keyboard2.translateZ(-0.4);
  }
  if(keyboardloaded3){
    keyboard3.position.copy( camera.position );
    keyboard3.rotation.copy( camera.rotation );
    //keyboard3.updateMatrix();
    keyboard3.translateY( - 0.2 );
    keyboard3.translateZ( - 0.4 );
    changeKeyboard(keyboard3,keyboard2,30)
  }
  if(shoot1Loaded){
    shoot1.position.copy( camera.position );
    shoot1.rotation.copy( camera.rotation );
    shoot1.translateY( - 0.27 );//-0.2~0
    shoot1.translateZ( - 0.5);
    if(shootCount==0){
      shootStartPos=shoot1.position;
      shootBigger(shoot1,2,2,2);
    }

    var endPostion=new THREE.Vector3(0,1.6,-6)
    shootFly(shoot1,shootStartPos,endPostion,shootFlag,shootCount)
    //shootFly(boom1,shootStartPos,endPostion,shootFlag,shootCount)
    shootCount=(shootCount+1)%shootFlag;
  }
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

function shootBigger(shoot,width,height,deep){//子弹对象
  //shoot.scale.set(width,height,deep)
  //changeKeyboard(keyboard3,keyboard2,60)
}

function shootFly(shoot,startPos,endPos,flag,count){//子弹对象,初始位置,目标点位置,过渡帧数,计时器
  var position=new THREE.Vector3(startPos.x+(endPos.x-startPos.x)*count/flag,startPos.y+(endPos.y-startPos.y)*count/flag,startPos.z+(endPos.z-startPos.z)*count/flag);
  shoot.position.copy( position );
  shoot.rotation.copy( camera.rotation );
  shoot.translateY( -0.27+ 0.27*count/flag );//-0.2~0
}