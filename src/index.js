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
// 怪物存储数组
var monsterGroup = [];
// GAME_OVER_DISPLAY_LOGO
var GAME_END_LOGO = null;

/*
 * 粒子系统
 * 属性：
 *   particles：粒子系统的引用对象
 * 方法：
 *   boom: 无参数，开始爆炸效果
 **/
var pointsSystem = createPoints();

var hudSize = 0.8;
var GAME_END_LOGO_SIZE = 50;

// Create a VR manager helper to enter and exit VR mode.
var params = {
  hideButton: false, // Default: false.
  isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);

// 结束游戏
var GAME_OVER_USER_HEIGHT = 40;
var GAME_OVER_FLAG = false;

var INITIAL_MONSTER_NUMBER = 10;
var MAX_MONSTER_NUMBER = 50;
var MAX_MONSTER_NUMBER_STORAGE = 200;
var MONSTER_APPEAR_PER_SECOND = 0.5;
var LOCK_TIME = 1000;

//分数
var SCORE = 0;
var SCORE_PER_MONSTER = 1;

var isMonsterSpawn = false;
var monsterDisplayGroup = new THREE.Object3D();
scene.add(monsterDisplayGroup);

// monster spawn point
// 怪物生成点
var Monster_Spawn_Points = [];
[1, 1.4, 2, 1.7, 1.8, 2, 3, 4, 1.5, 4, 3.7].forEach(function (radius) {
  var MonsterGeoMetry = new THREE.CircleGeometry(radius, 20);
  MonsterGeoMetry.rotateX(Math.PI / 2);
  for (var n = 1; n <= 19; n++) {
    var spawnPoint = MonsterGeoMetry.vertices[n];
    spawnPoint.y += 5 - radius;
    Monster_Spawn_Points.push(spawnPoint);
  }
});

addSkybox();
addCabinet();
addHUD();
addAisLogo();
createMonsterGroup();

// 显示开始画面
showStartPage();

var monsterDanceSteps = [];
var addMonster = function () {
  if (isMonsterSpawn && monsterGroup.length > 0 && monsterDisplayGroup.children.length < MAX_MONSTER_NUMBER) {
    var monster = monsterGroup.pop();
    if (monster.position.y < 1) {
      monster.position.y = 1;
    }
    monsterDanceSteps.push([monster.position.y, true]);
    monsterDisplayGroup.add(monster);
  }
};

var removeMonster = function (monster) {
  createBoom(new THREE.Vector3(0,0,0), monster.position).shoot(function () {
    pointsSystem.particles.position.copy(monster.position);
    pointsSystem.boom();
    monster.visible = false;
    SCORE += SCORE_PER_MONSTER;
  });
};

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
  loader.load( 'fonts/gentilis_regular.typeface.json', function ( font ) {
    var textGeo = new THREE.TextGeometry( score, {
      font: font,
      size: 0.08,
      height: 0,
      curveSegments: 12,
    });
    var xfix = -0.04;
    if (score>99) {
      xfix = -0.07
    }
    var textMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
    gameOverPageText = new THREE.Mesh( textGeo, textMaterial );
    gameOverPageText.position.set(xfix, controls.userHeight + 0.08, -0.48);
    gameOverPageText.lookAt(camera.position);
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

  gameplay();
}

function gameplay() {
  isMonsterSpawn = true;
  setInterval(function () {
    addMonster();
  }, 500);
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

var keyboard = [];//键盘状态
var keyboardloaded=[false,false,false];//判断加载是否完成
var texture1 = THREE.ImageUtils.loadTexture("img/keyboard1.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:texture1});
  material.transparent=true;
  material.opacity=0;
  var keyboardGeometry = new THREE.BoxGeometry(2, 0.6, 0);
  var mesh = new THREE.Mesh( keyboardGeometry,material );
  keyboard[0] = mesh;
  //console.log(mesh)
  scene.add( mesh );
  keyboardloaded[0]=true;
});
var texture2 = THREE.ImageUtils.loadTexture("img/keyboard2.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:texture2});
  material.transparent=true;
  material.opacity=0;
  var keyboardGeometry = new THREE.BoxGeometry(2, 0.6, 0);
  var mesh = new THREE.Mesh( keyboardGeometry,material );
  keyboard[1]  = mesh;
  scene.add( mesh );
  keyboardloaded[1]=true;
});
var texture3 = THREE.ImageUtils.loadTexture("img/keyboard3.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:texture3});
  material.transparent=true;
  material.opacity=1;
  var keyboardGeometry = new THREE.BoxGeometry(2, 0.6, 0);
  var mesh = new THREE.Mesh( keyboardGeometry,material );
  keyboard[2]  = mesh;
  scene.add( mesh );
  keyboardloaded[2]=true;
});
var shoot1 = null;//子弹
var boom1 = null;//大招
var boom2 = null;//大招提示
var pointer1=null;//准星

var shoot1Loaded=false;//判断加载是否完成
var boomLoaded=false;//判断加载是否完成
var boom2Loaded=false;//判断加载是否完成
var pointer1Loaded=false;


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
  material.opacity=0;
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
    transparent:true,
    opacity:0
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

//游戏结束逻辑
function createGameOver() {
  //正前方视野方向
  var resetPose = [0, 0, 0, 1];
  //正下方视野方向
  var endPose = [-0.7071067690849304, 0, 0, 0.7071067690849304];

  var height = controls.userHeight;
  var deltaH = GAME_OVER_USER_HEIGHT - height;

  var overTween = new TWEEN.Tween(resetPose)
    .to(endPose, 2000)
    .easing(TWEEN.Easing.Quintic.Out)
    .onUpdate(function(interpolation) {
      controls.update(this);
      controls.userHeight = height + interpolation * deltaH;
    })
    .onComplete(function () {

    });

  return {
    over: function () {
      scene.add(GAME_END_LOGO);
      GAME_OVER_FLAG = !GAME_OVER_FLAG;

      // var pose = controls.getPose();
      // if (pose && pose.orientation) {
      //   var resetPoseTween = new TWEEN.Tween(pose.orientation)
      //     .to(resetPose, 2000)
      //     // .easing(TWEEN.Easing.Exponential.In)
      //     .onUpdate(function(interpolation) {
      //       controls.update(this);
      //     })
      //     .chain(overTween)
      //     .start();
      // } else {
        overTween.start();
      // }
    }
  }
}

/*
* 游戏结束控制器
* 方法:
*   over: 无参数，开始结束流程。视野强制回到正前方并开始结束流程
* */
var gameOver = createGameOver();

var keyBoardSystem = createKeyboard;

var startPostion=new THREE.Vector3(0,1.6, -1);
var endPostion=new THREE.Vector3(0,1.6,-16);
var boomFly=createBoom;

var GUIControl = {
  showStartPage: function () {
    showStartPage();
  },
  showEndPage: function () {
    showEndPage(111);
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
  logVRPose: function () {
    console.log()
  },
  gameover: function () {
    gameOver.over();
  },
  pointsBoom: function () {
    pointsSystem.boom();
  },
  keyBoardAisToAs: function () {
    keyBoardSystem(3,1).boom();
  },
  keyBoardAisToI: function () {
    keyBoardSystem(3,2).boom();
  },
  keyBoardAsToAis: function () {
    keyBoardSystem(1,3).boom();
  },
  bigBoom: function () {
    boomFly(startPostion,endPostion).boom();
  },
  hideTip:function(){
    boomFly(startPostion,endPostion).tipHide();
  },
  showTip:function(){
    boomFly(startPostion,endPostion).tipShow();
  },
  shootFly: function () {
    boomFly(startPostion,endPostion).shoot();
},
};

var gui = new dat.GUI();
gui.add(GUIControl, 'showStartPage');
gui.add(GUIControl, 'removeStartPage');
gui.add(GUIControl, 'showEndPage');
gui.add(GUIControl, 'removeEndPage');
gui.add(GUIControl, 'playMusic');
gui.add(GUIControl, 'add');
gui.add(GUIControl, 'remove');
gui.add(GUIControl, 'pointsBoom');
gui.add(GUIControl, 'keyBoardAisToAs');
gui.add(GUIControl, 'keyBoardAisToI');
gui.add(GUIControl, 'keyBoardAsToAis');
gui.add(GUIControl, 'bigBoom');
gui.add(GUIControl, 'showTip');
gui.add(GUIControl, 'hideTip');
gui.add(GUIControl, 'shootFly');
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

var cursorOnMonster = [null, 0];
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
      cursorOnMonster[0] = null;
      cursorOnMonster[1] = 0;
      hud.position.x = 0;
      hud.position.y = -1;
      hud.position.z = 0;
    }


    if (intersects.length > 0) {
      hud.position.x = intersects[0].object.position.x;
      hud.position.y = intersects[0].object.position.y;
      hud.position.z = intersects[0].object.position.z;
      if (intersects[0].object.uuid == cursorOnMonster[0]) {
        if (cursorOnMonster[1] == 0) {
          cursorOnMonster[1] = timestamp;
        }
        if (timestamp - cursorOnMonster[1] > LOCK_TIME) {
          cursorOnMonster[0] = null;
          cursorOnMonster[1] = 0;
          removeMonster(intersects[0].object);
        }
      } else {
        cursorOnMonster[0] = intersects[0].object.uuid;
        cursorOnMonster[1] = timestamp;
      }
    }
  }

  if (playBtn&&playBtnHover) {
    var intersects = raycaster.intersectObject( playBtn );
    var step = 0.04;
    if (intersects.length) {
      if (!startPageTimeOut) {
        startPageTimeOut = setTimeout(function() {
          removeStartPage();
        }, 1000)
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
    //boom1.rotation.copy( camera.rotation );
    boom1.translateX( 0 );
    boom1.translateZ( - 1 );
  }
  if(boom2Loaded){
    boom2.position.copy( camera.position );// 复制位置
    boom2.rotation.copy( camera.rotation );// 复制视角偏移角度
    boom2.translateY( -0.25 );
    boom2.translateZ( -1.5 );
  }

  //键盘随视角移动
  for(var i=0;i<3;i++){
    if(keyboardloaded[i]){
      keyboard[i].position.copy( camera.position );
      keyboard[i].rotation.copy( camera.rotation );
      keyboard[i].translateY( -0.25 );
      keyboard[i].translateZ( - 1 );
    }
  }

  if(shoot1Loaded){
    //shoot1.position.copy( camera.position );
    //shoot1.rotation.copy( camera.rotation );
    shoot1.translateY( - 0.27 );//-0.2~0
    shoot1.translateZ( - 0.5);
    //if(shootCount==0){
      //shootStartPos=shoot1.position;
      //endPostion=new THREE.Vector3(0,1.6,-16)
    //}

    //shootFly(shoot1,shootStartPos,endPostion,shootFlag,shootCount)
    //shootCount=(shootCount+1)%shootFlag;
  }

  if (GAME_OVER_FLAG) {
    // controls.resetPose();

    // camera.lookAt(new THREE.Vector3(0, 0, 0));

    // controls.update(new Float32Array([-0.7071030139923096, 0.0023139973636716604, 0.0023139973636716604, 0.7071030139923096]));
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

// 键盘系统
function createKeyboard(key1,key2) {//初始键盘对象,最终键盘对象
  var keyboardOpacityTween = new TWEEN.Tween({ opacity: 0 })
    .to({ opacity: 1 }, 800)
    .easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function(interpolation) {
      keyboard[key1-1].material.opacity = 1 - interpolation;
      keyboard[key2-1].material.opacity =  interpolation;
    })
    .onComplete(function () {
      keyboard[key1-1].material.opacity = 0;
      keyboard[key2-1].material.opacity = 1;
    });
  return {
    boom: function () {
      keyboardOpacityTween.start();
    },
    particles: key1,
    particles2: key2
  }
}

// 子弹系统
function createBoom(startPos,endPos) {//初始键盘对象,最终键盘对象
  var hideTween = new TWEEN.Tween({ opacity: 0 })//提示hide
    .to({ opacity: 1 }, 800)
    .easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function(interpolation) {
      boom2.material.opacity = 1-interpolation;
    })
    .onComplete(function () {
      boom2.material.opacity = 0;
    });
  var showTween = new TWEEN.Tween({ opacity: 0 })//提示显示
    .to({ opacity: 1 }, 800)
    //.easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function(interpolation) {
      boom2.material.opacity = interpolation;
    })
    .onComplete(function () {
      boom2.material.opacity = 1;
    });

  var shootFlyTween = new TWEEN.Tween({ count: 0 })//子弹
    .to({ count: 1 }, 800)
    //.easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function(count) {
      var position=new THREE.Vector3(startPos.x+(endPos.x-startPos.x)*count,startPos.y+(endPos.y-startPos.y)*count,startPos.z+(endPos.z-startPos.z)*count);
      shoot1.rotation.copy( camera.rotation );
      shoot1.position.copy( position );
      shoot1.translateY( -0.27+ 0.27*count );//-0.2~0
      shoot1.material.opacity = 1;
    })
    .onComplete(function () {
      shoot1.position.copy( endPos );
      shoot1.rotation.copy( camera.rotation );
      shoot1.translateY( 0 );
      shoot1.material.opacity = 0;
    });
  var boomFlyTween = new TWEEN.Tween({ count: 0 })//大招
    .to({ count: 1 }, 800)
    //.easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function(count) {
      var position=new THREE.Vector3(startPos.x+(endPos.x-startPos.x)*count,startPos.y+(endPos.y-startPos.y)*count,startPos.z+(endPos.z-startPos.z)*count);
      boom1.rotation.copy( camera.rotation );
      boom1.position.copy( position );
      boom1.rotateX(-1*Math.PI*count);
      boom1.translateY( -0.27+ 0.27*count );//-0.2~0
      boom1.material.opacity = 1;
    })
    .onComplete(function () {
      boom1.position.copy( endPos );
      boom1.rotation.copy( camera.rotation );
      boom1.rotateX(-1*Math.PI);
      boom1.translateY( 0 );
      boom1.material.opacity = 0;
    });
  return {
    boom: function () {
      boom1.material.opacity = 1;
      boom1.rotation.copy( camera.rotation );
      boomFlyTween.start();
    },
    tipHide:function(){
      hideTween.start();
    },
    tipShow:function(){
      showTween.start();
    },
    shoot: function (callback) {
      shoot1.material.opacity = 1;
      shoot1.rotation.copy( camera.rotation );
      shootFlyTween.onComplete(callback).start();
    }
  }
}


