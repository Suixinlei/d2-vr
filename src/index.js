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
ambient.position.y = camera.position.y + 30;
scene.add( ambient );

var hemiLight;
hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// raycaster
var raycaster = new THREE.Raycaster();
// Mouse Position
var mouse = new THREE.Vector2();

// Add a repeating grid as a skybox.
var boxSize = 100;
var hud;
var skybox;
var hudSize = 0.4;
var loader = new THREE.TextureLoader();

// Create a VR manager helper to enter and exit VR mode.
var params = {
  hideButton: false, // Default: false.
  isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);

// 结束游戏
var GAME_OVER_USER_HEIGHT = 40;
var GAME_OVER_FLAG = false;

addSkybox();
addCabinet();
addHUD();

//----------------------Model---------------------------

// GAME_OVER_DISPLAY_LOGO
var GAME_END_LOGO = null;
var GAME_END_LOGO_SIZE = 50;
loader.load('img/ais.png', function (texture) {
  var geometry = new THREE.PlaneGeometry(GAME_END_LOGO_SIZE, GAME_END_LOGO_SIZE);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  GAME_END_LOGO = new THREE.Mesh(geometry, material);
  GAME_END_LOGO.position.y = 1;
  GAME_END_LOGO.position.x = 0;
  GAME_END_LOGO.position.z = 0;
  GAME_END_LOGO.rotation.x = Math.PI / 2;
  GAME_END_LOGO.rotation.y = Math.PI;
  GAME_END_LOGO.rotation.z = Math.PI;
});



//----------------------Model---------------------------
// erfan
var bgMusic;
var startPageTimeOut;
var startPage;
var gameOverPage;
var gameOverPageText;
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
    playBtn.position.set(0, controls.userHeight-0.15, -0.48)
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
    playBtnHover.position.set(0, controls.userHeight-0.15, -0.48)
    scene.add( playBtnHover );
  });
}

function showEndPage(score) {
  var direction = camera.getWorldDirection();
  var loader = new THREE.TextureLoader();
  loader.load('img/game-over.png', function(texture){
    var geometry = new THREE.PlaneGeometry( 1.344, 0.75, 32 );
    var material = new THREE.MeshBasicMaterial( {
      map: texture,
      //color: 0xffff00,
      side: THREE.DoubleSide,
      //opacity:0.6,
      transparent: true
    } );
    gameOverPage = new THREE.Mesh( geometry, material );
    var len = 0.5;
    gameOverPage.position.set(direction.x * len, controls.userHeight +  len* direction.y, len * direction.z);
    gameOverPage.lookAt(camera.position);
    scene.add( gameOverPage );
  });

  var loader = new THREE.FontLoader();
  loader.load( 'fonts/iconfont_number.typeface.json', function ( font ) {
    var textGeo = new THREE.TextGeometry( score, {
      font: font,
      size: 0.08,
      height: 0,
      curveSegments: 12,
    });

    var textMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
    gameOverPageText = new THREE.Mesh( textGeo, textMaterial );
    gameOverPageText.position.set(-0.07, controls.userHeight + 0.08, -0.48);
    //gameOverPageText.lookAt(camera.position);
    scene.add( gameOverPageText );
    console.log(gameOverPageText)
  } );


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

function removeEndPage() {
  pureRemoveMesh(gameOverPage);
  gameOverPage = null;
}


document.addEventListener("touchstart",function(e){
  if (playBtn && playBtnHover) {
    var intersects = raycaster.intersectObject( playBtn );
    if (intersects.length) {
      console.log('game start!')
      removeStartPage();
      if (!bgMusic) {
        bgMusic = playMusic('background');
      }
    }
  }
}, false);

//document.body.addEventListener("click",function(e){
//  console.log(e)
//  console.log(palyBackGroundMusic)
//  //var bgMusic = palyBackGroundMusic();
//  document.getElementById('audio').play();
//  //var au = document.createElement('audio');
//  //au.preload = 'auto';
//  //au.src = './asset_src/test-music.m4a';
//  //
//  //au.loop = 'loop';
//  //au.play();
//}, false);



//----------------------Monster---------------------------

// monster spawn point
// 怪物生成点
var Monster_Spawn_Points = [];
[1, 1.4, 2, 1.7].forEach(function (radius) {
  var MonsterGeoMetry = new THREE.CircleGeometry(radius, 20);
  MonsterGeoMetry.rotateX(Math.PI / 2);
  for (var n = 1; n <= 19; n++) {
    var spawnPoint = MonsterGeoMetry.vertices[n];
    spawnPoint.y = radius / 4;
    Monster_Spawn_Points.push(spawnPoint);
  }
});

var onProgress = function ( xhr ) {
  // if ( xhr.lengthComputable ) {
  //   var percentComplete = xhr.loaded / xhr.total * 100;
  //   console.log( Math.round(percentComplete, 2) + '% downloaded' );
  // }
};

var onError = function (xhr) {
  console.log(xhr);
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
  pointer1.position.z = -3;
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
  var keyboardGeometry = new THREE.BoxGeometry(2, 0.6, 0);
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
  //console.log(boom2Geometry)
  var mesh = new THREE.Mesh( boom2Geometry,material );
  boom2 = mesh;
  scene.add( mesh );
  boom2Loaded=true;
});

ObjLoader.load('asset_src/boom.obj', function (boom) {//爆炸特效
  boom = boom.children[0];
  boom.material = new THREE.MeshLambertMaterial({
    color: 0xFF3399,
    //shading: THREE.FlatShading,
  });
  //boom.position.x = -1;
  //console.log(boom)
  boom.scale.set(1,1,1)
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

    var RealMonsterHitBoxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    var RealMonsterHitBoxMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false
    });

    var RealMonsterHitBox = new THREE.Mesh(RealMonsterHitBoxGeometry, RealMonsterHitBoxMaterial);
    RealMonsterHitBox.position.x = RandomSpawnPoint.x;
    RealMonsterHitBox.position.y = RandomSpawnPoint.y + 1.6;
    RealMonsterHitBox.position.z = RandomSpawnPoint.z;

    RealMonster.lookAt(camera.position);
    RealMonsterHitBox.add(RealMonster);
    monsterGroup.push(RealMonsterHitBox);
  }
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

    var RealMonsterHitBoxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    var RealMonsterHitBoxMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false
    });

    var RealMonsterHitBox = new THREE.Mesh(RealMonsterHitBoxGeometry, RealMonsterHitBoxMaterial);
    RealMonsterHitBox.position.x = RandomSpawnPoint.x;
    RealMonsterHitBox.position.y = RandomSpawnPoint.y + 1.6;
    RealMonsterHitBox.position.z = RandomSpawnPoint.z;

    RealMonster.lookAt(camera.position);
    RealMonsterHitBox.add(RealMonster);
    monsterGroup.push(RealMonsterHitBox);
  }
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

    var RealMonsterHitBoxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    var RealMonsterHitBoxMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false
    });

    var RealMonsterHitBox = new THREE.Mesh(RealMonsterHitBoxGeometry, RealMonsterHitBoxMaterial);
    RealMonsterHitBox.position.x = RandomSpawnPoint.x;
    RealMonsterHitBox.position.y = RandomSpawnPoint.y + 1.6;
    RealMonsterHitBox.position.z = RandomSpawnPoint.z;

    RealMonster.lookAt(camera.position);
    RealMonsterHitBox.add(RealMonster);
    monsterGroup.push(RealMonsterHitBox);
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

    var RealMonsterHitBoxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    var RealMonsterHitBoxMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false
    });

    var RealMonsterHitBox = new THREE.Mesh(RealMonsterHitBoxGeometry, RealMonsterHitBoxMaterial);
    RealMonsterHitBox.position.x = RandomSpawnPoint.x;
    RealMonsterHitBox.position.y = RandomSpawnPoint.y + 1.6;
    RealMonsterHitBox.position.z = RandomSpawnPoint.z;

    RealMonster.lookAt(camera.position);
    RealMonsterHitBox.add(RealMonster);
    monsterGroup.push(RealMonsterHitBox);
  }
}, onProgress, onError);

var isMonsterSpawn = false;
var monsterDisplayGroup = new THREE.Object3D();
var startMonsterSpawn = function () {
  scene.add(monsterDisplayGroup);
  isMonsterSpawn = true;
};

var monsterDanceSteps = [];
var addMonster = function () {
  var monster = monsterGroup.pop();
  if (monster.position.y < 1) {
    monster.position.y = 1;
  }
  monsterDanceSteps.push([monster.position.y, true]);
  monsterDisplayGroup.add(monster);
};

var removeMonster = function () {
  monsterDisplayGroup.children.pop();
};


//----------------------Monster---------------------------

var monsterShock = { 1:1 };
var monsterDanceRange = 0.05;
var tween = new TWEEN.Tween(monsterShock)
  .to({ 1:2 }, 1000)
  .repeat(Infinity)//无限重复
  .yoyo(true)//到达to的值后回到from的值
  .onUpdate(function(interpolation) {
    var self = this;
    //interpolation 值域在[0,1]，this指向了monsterShock
    var monsterArr = monsterDisplayGroup.children;
    monsterArr.forEach(function (mon, index) {
      if (monsterDanceSteps[index][0] - monsterDanceRange > mon.position.y) {
        monsterDanceSteps[index][1] = true;
      }
      if (monsterDanceSteps[index][0] + monsterDanceRange < mon.position.y) {
        monsterDanceSteps[index][1] = false;
      }

      if (monsterDanceSteps[index][0] - monsterDanceRange <= mon.position.y <= monsterDanceSteps[index][0] + monsterDanceRange) {
        if (monsterDanceSteps[index][1]) {
          mon.position.y += 0.01;
        } else {
          mon.position.y -= 0.01;
        }
      }
    });
  })
  .start();

// 粒子系统
function createPoints() {
  var geometry = new THREE.Geometry();
  var texture = new THREE.TextureLoader().load( "img/point1.png" );
  var material = new THREE.PointsMaterial({
    size: 0.5,
    map: texture,
    // blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent : true,
    opacity: 1
  });

  for (var i = 0; i < 100; i++) {
    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 0.5 - 0.25;
    vertex.y = Math.random() * 0.5 - 0.25;
    vertex.z = Math.random() * 0.5 - 0.25;
    geometry.vertices.push( vertex );
  }

  var particles = new THREE.Points( geometry, material );

  particles.position.z = -10;
  scene.add(particles);

  var pointsTween = new TWEEN.Tween({ r: 1 })
    .to({ r: 1.065 }, 800)
    .easing(TWEEN.Easing.Exponential.Out)
    .onUpdate(function(interpolation) {
      var r = interpolation * 0.065 + 1;
      geometry.vertices.forEach(function (vertex) {
        vertex.multiplyScalar(r);
      });
      geometry.verticesNeedUpdate = true;
    })
    .onComplete(function () {
      geometry.vertices.forEach(function (vertex) {
        vertex.set(Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25);
      });
      geometry.verticesNeedUpdate = true;
    });

  var pointsOpacityTween = new TWEEN.Tween({ opacity: 1 })
    .to({ opacity: 0 }, 800)
    .easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function(interpolation) {
      material.opacity = 1 - interpolation;
    })
    .onComplete(function () {
      material.opacity = 1;
    });

  return {
    boom: function () {
      pointsTween.start();
      pointsOpacityTween.start();
    },
    particles: particles
  }
}
/*
* 粒子系统
* 属性：
*   particles：粒子系统的引用对象
* 方法：
*   boom: 无参数，开始爆炸效果
**/
var pointsSystem = createPoints();

//
var GUIControl = {
  start: function () {
    startMonsterSpawn();
  },
  showStartPage: function () {
    showStartPage();
  },
  showEndPage: function () {
    showEndPage(184);
  },
  removeStartPage: function () {
    removeStartPage();
  },
  removeEndPage: function () {
    removeEndPage();
  },
  playMusic: function () {
    playMusic('success');
  },
  add: function () {
    addMonster();
  },
  remove: function () {
    removeMonster();
  },
  gameover: function () {
    scene.add(GAME_END_LOGO);
    GAME_OVER_FLAG = !GAME_OVER_FLAG;
  },
  pointsBoom: function () {
    pointsSystem.boom();
  }
};

var gui = new dat.GUI();
gui.add(GUIControl, 'start');
gui.add(GUIControl, 'showStartPage');
gui.add(GUIControl, 'removeStartPage');
gui.add(GUIControl, 'showEndPage');
gui.add(GUIControl, 'removeEndPage');
gui.add(GUIControl, 'playMusic');
gui.add(GUIControl, 'add');
gui.add(GUIControl, 'remove');
gui.add(GUIControl, 'pointsBoom');
gui.add(GUIControl, 'gameover');

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
  TWEEN.update(timestamp);

  var direction = camera.getWorldDirection();

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
    var step = 0.04;
    if (intersects.length) {
      if (!startPageTimeOut) {
        startPageTimeOut = setTimeout(function() {
          removeStartPage();
        }, 3000)
      }
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
      clearTimeout(startPageTimeOut);
      startPageTimeOut = null;
      playBtnHover.material.opacity = 0;
    }
  } else {
    clearTimeout(startPageTimeOut);
    startPageTimeOut = null;
  }

  if (gameOverPage) {
    var len = 0.5;
    gameOverPage.position.set(direction.x * len, controls.userHeight +  len* direction.y, len * direction.z);
    gameOverPage.lookAt(camera.position);
  }

  hud.lookAt(camera.position);

  var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  //准星随视角移动
  if(pointer1Loaded){
    // pointer1.position.copy( camera.position );// 复制位置
    // pointer1.rotation.copy( camera.rotation );// 复制视角偏移角度
    // //pointer1.translateY( 0.3 );
    // pointer1.translateZ( - 1.5 );
  }
  //if(shootCount%3==0){
    if(pointer1Loaded){
      pointer1.position.copy( camera.position );// 复制位置
      pointer1.rotation.copy( camera.rotation );// 复制视角偏移角度
      //pointer1.translateY( 0.3 );
      pointer1.translateZ( - 1.5 );
    }
  //}
  if(boomLoaded){
    boom1.position.copy( camera.position );// 复制位置
    boom1.rotation.copy( camera.rotation );// 复制视角偏移角度
    //boom1.updateMatrix();
    boom1.translateX( 0 );
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
    keyboard3.translateY( -0.25 );
    keyboard3.translateZ( - 1 );
    //changeKeyboard(keyboard3,keyboard2,30)
  }
  if(shoot1Loaded){
    shoot1.position.copy( camera.position );
    shoot1.rotation.copy( camera.rotation );
    shoot1.translateY( - 0.27 );//-0.2~0
    shoot1.translateZ( - 0.5);
    var endPostion=new THREE.Vector3(0,1.6,-16)
    var endPostion2=new THREE.Vector3(1,1.6,-16)
    if(shootCount==0){
      shootStartPos=shoot1.position;
      shootBigger(boom1,shootStartPos,endPostion2,shootFlag,shootCount);
    }

    var endPostion=new THREE.Vector3(0,1.6,-6);
    shootFly(shoot1,shootStartPos,endPostion,shootFlag,shootCount)
    boomFly(boom1,shootStartPos,endPostion,shootFlag,shootCount)
    //shootFly(boom1,shootStartPos,endPostion,shootFlag,shootCount)
    shootCount=(shootCount+1)%shootFlag;
  }

  if (GAME_OVER_FLAG) {
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    if (controls.userHeight < GAME_OVER_USER_HEIGHT) {
      controls.userHeight += 1;
    }
    controls.update(new Float32Array([-0.7071030139923096, 0.0023139973636716604, 0.0023139973636716604, 0.7071030139923096]));
  } else {
    controls.update();
  }

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
  // cube.position.set(0, controls.userHeight, 0);
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
//大招
function shootBigger(shoot,startPos,endPos,flag,count){//子弹对象
  shoot.material.opacity=1;
  boomFly(shoot,startPos,endPos,flag,count);
}
function showBoomTip(shoot,flag,count){//子弹对象
  shoot.material.opacity=1;
}
function shootFly(shoot,startPos,endPos,flag,count){//子弹对象,初始位置,目标点位置,过渡帧数,计时器
  var position=new THREE.Vector3(startPos.x+(endPos.x-startPos.x)*count/flag,startPos.y+(endPos.y-startPos.y)*count/flag,startPos.z+(endPos.z-startPos.z)*count/flag);
  shoot.position.copy( position );
  shoot.rotation.copy( camera.rotation );
  shoot.translateY( -0.27+ 0.27*count/flag );//-0.2~0
}

function boomFly(shoot,startPos,endPos,flag,count){//子弹对象,初始位置,目标点位置,过渡帧数,计时器
  var position=new THREE.Vector3(startPos.x+(endPos.x-startPos.x)*count/flag,startPos.y+(endPos.y-startPos.y)*count/flag,startPos.z+(endPos.z-startPos.z)*count/flag);
  shoot.position.copy( position );
  shoot.rotation.copy( camera.rotation );
  shoot.rotateX(-1*Math.PI*count/flag );
  shoot.translateY( -0.27+ 0.27*count/flag );//-0.2~0
}