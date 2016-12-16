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
var ambient = new THREE.AmbientLight(0x101030);
ambient.position.y = camera.position.y + 30;
scene.add(ambient);

var hemiLight;
hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 500, 0);
scene.add(hemiLight);

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// raycaster
var raycaster = new THREE.Raycaster();
// Mouse Position
var mouse = new THREE.Vector2();

// Add a repeating grid as a skybox.
var boxSize = 100;
// 瞄准框
var hud;
// 地板
var skybox;
// 怪物存储数组
var monsterGroup = [];
// GAME_OVER_DISPLAY_LOGO
var GAME_END_LOGO = null;
// 已经死亡的怪物
var MONSTER_ARE_DEAD = {};
// 怪物生成点
var Monster_Spawn_Points = [];
// erfan
var bgMusic;
var startPageGroup;
var startPageTimeOut;
var gameOverPage;
var gameOverPageText;
var playBtn;
var playBtnHover;
var showstartHoverEffect = true;
var zuilan;

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
// 锁定时间
var LOCK_TIME = 500;
// 游戏结束后的延时
var GAME_OVER_RELOAD_DELAY = 10000;
// 大招一次性杀死的怪物数
var UNIQUE_SKILL_KILL_NUMBER = 10;
// 大招延时
var WAIT_FOR_UNIQUE_SKILL = 10000;
// 游戏时间
var GAME_TIME = 60000;
// 是否显示游戏开始画面
var DISPLAY_START_PAGE = false;

var startPostion = new THREE.Vector3(0, 1.6, 0);
var endPostion = new THREE.Vector3(0, 1.6, -16);

//分数
var SCORE = 0;
var SCORE_PER_MONSTER = 1;

function addMonsterSpawnPoints() {
  var circleHeight = [4.5, 3.6, 3.5, 2.8, 3, 2.6, 2.5, 2, 1.5, 1];
  [1.5, 1.4, 2, 1.7, 1.8, 2, 4, 4, 3.6, 4, 3.7].forEach(function (radius, index) {
    var circleDot = 20 + index * 5;
    var MonsterGeoMetry = new THREE.CircleGeometry(radius, circleDot);
    MonsterGeoMetry.rotateX(Math.PI / 2);
    for (var n = 1; n <= circleDot - 2; n++) {
      var spawnPoint = MonsterGeoMetry.vertices[n];
      spawnPoint.y += circleHeight[index];
      Monster_Spawn_Points.push(spawnPoint);
    }
  });
}
addMonsterSpawnPoints();

// Monster_Spawn_Points.forEach((point) => {
//   var monster1_Geometry = new THREE.CircleGeometry(1, 20);
//   var circle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshNormalMaterial({ color: 0xff0000 }));
//   circle.position.copy(point);
//   circle.lookAt(camera.position);
//   scene.add(circle);
// });

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

// 添加地板
addSkybox();
// 添加机柜
addCabinet();
// 添加 瞄准框
addHUD();
// 添加AIS LOGO
addAisLogo();
// 创建怪物存储
createMonsterGroup();
// 显示开始画面
showStartPage();

function addZuilanPic() {
  var zuilanTexture = new THREE.TextureLoader().load('img/zuilan.png');
  var geometry = new THREE.PlaneGeometry(2.028, 2.068, 32);
  var material = new THREE.MeshBasicMaterial({
    map: zuilanTexture,
    //color: 0xffff00,
    side: THREE.DoubleSide,
    //opacity:0.6,
    transparent: true,
    depthWrite: false
  });
  zuilan = new THREE.Mesh(geometry, material);
  zuilan.position.set(0, 10, 0);
  zuilan.lookAt(camera.position);
  scene.add(zuilan);
}
addZuilanPic();

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
  if (MONSTER_ARE_DEAD[monster.uuid] === 1) {
    MONSTER_ARE_DEAD[monster.uuid] = 0;
    keyBoardSystem(3, 2).boom();
    createBoom(monster.position).shoot(function () {
      pointsSystem.particles.position.copy(monster.position);
      pointsSystem.boom();
      monster.visible = false;
      shoot1.material.opacity = 0;
      SCORE += SCORE_PER_MONSTER;
      keyBoardSystem(2, 3).boom();
      monster.parent.children.forEach((childMonster, index) => {
        var uuid = monster.uuid;
        if (childMonster.uuid === uuid) {
          monster.parent.children.splice(index, 1);
        }
      })
    });
  }
};

var uniqueSkill = function () {
  boomFly(endPostion).tipShow();
  doLisenVoiceInput(function () {
    playMusic('boom');
    keyBoardSystem(3, 1).boom();
    for (var killMonsterNo = 0; killMonsterNo < UNIQUE_SKILL_KILL_NUMBER; killMonsterNo++) {
      var monster = monsterDisplayGroup.children[killMonsterNo];
      if (monster) {
        boomFly(monster.position, boom1[killMonsterNo]).boom((function (killMonsterNo) {
          boom1[killMonsterNo].material.opacity = 0;
          //boom1[killMonsterNo].position = startPostion;
          boom1[killMonsterNo].position.set(new THREE.Vector3(0, -1.6, -110));
          monsterDisplayGroup.children.splice(0, 10);
          boomFly(endPostion).tipHide();
        })(killMonsterNo));
      }
    }
    keyBoardSystem(1, 3).boom();

    setTimeout(uniqueSkill, WAIT_FOR_UNIQUE_SKILL);
  });
};

//游戏结束逻辑
function createGameOver() {
  //正前方视野方向
  var resetPose = [0, 0, 0, 1];
  //正下方视野方向
  var endPose = [-0.7071067690849304, 0, 0, 0.7071067690849304];

  var height = controls.userHeight;
  var deltaH = GAME_OVER_USER_HEIGHT - height;

  var overTween = new TWEEN.Tween(resetPose)
    .to(endPose, 3000)
    .easing(TWEEN.Easing.Quintic.Out)
    .onUpdate(function (interpolation) {
      controls.update(this);
      controls.userHeight = height + interpolation * deltaH;
    });

  return {
    over: function (callback) {
      scene.add(GAME_END_LOGO);
      GAME_OVER_FLAG = !GAME_OVER_FLAG;
      playMusic('gameover');
      overTween.onComplete(callback).start();
    }
  }
}



function showEndPage(score) {
  var direction = camera.getWorldDirection();
  var loader = new THREE.TextureLoader();
  loader.load('img/game-over.png', function (texture) {
    var geometry = new THREE.PlaneGeometry(1.344, 0.75, 32);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      //color: 0xffff00,
      side: THREE.DoubleSide,
      //opacity:0.6,
      transparent: true
    });
    gameOverPage = new THREE.Mesh(geometry, material);
    var len = 0.5;
    //gameOverPage.position.set(direction.x * len, controls.userHeight +  len* direction.y, 0);
    gameOverPage.lookAt(camera.position);
    gameOverPage.position.set(-0.01, controls.userHeight + len * direction.y, 0);
    scene.add(gameOverPage);

    var loader = new THREE.FontLoader();
    loader.load('fonts/iconfont_number.typeface.json', function (font) {
      //loader.load( 'fonts/gentilis_regular.typeface.json', function ( font ) {
      score = parseInt(score);
      var textGeo = new THREE.TextGeometry(score, {
        font: font,
        size: 0.06,
        height: 0,
        curveSegments: 12,
      });
      var xfix = -0.057;
      if (score > 99) {
        xfix = -0.085
      } else if (score < 10) {
        xfix = -0.035;
      }
      var textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
      gameOverPageText = new THREE.Mesh(textGeo, textMaterial);
      gameOverPageText.position.set(xfix + gameOverPage.position.x, gameOverPage.position.y + 0.02, +gameOverPage.position.z - 0.08);
      gameOverPageText.rotateX(-Math.PI / 2);
      //gameOverPageText.lookAt(camera.position);
      scene.add(gameOverPageText);
    });

    setTimeout(function () {
      location.reload();
    }, GAME_OVER_RELOAD_DELAY)
  });
  bgMusic && bgMusic.pause();
  playMusic('score');
}

function removeStartPage() {
  showstartHoverEffect = true;
  scene.remove(startPageGroup);
  startPageGroup = null;

  if (!bgMusic) {
    bgMusic = playMusic('background');
  } else {
    bgMusic.play();
  }
  gameplay();
}

function gameplay() {
  isMonsterSpawn = true;
  keyBoardSystem(2, 3).showKeyBoard();
  setInterval(function () {
    addMonster();
  }, 500);
  setTimeout(function () {
    keyBoardSystem(1, 3).hideKeyBoard();
    boomFly(endPostion).tipHide();
    scene.remove(zuilan);
    gameOver.over(function () {
      fetch('/new_record?record=' + SCORE);
      // 移除 AIS LOGO
      GAME_END_LOGO.material.opacity = 0;
      scene.remove(GAME_END_LOGO);
      // 显示结束画面与分数
      showEndPage(SCORE);
    });
  }, GAME_TIME);
  setTimeout(function () {
    // 调用声音输入
    uniqueSkill();
  }, WAIT_FOR_UNIQUE_SKILL);
}

function removeEndPage() {
  scene.remove(gameOverPage);
  scene.remove(gameOverPageText);
  gameOverPage = null;
  gameOverPageText = null;
}

//----------------------Monster---------------------------

var ObjLoader = new THREE.OBJLoader();

var shoot1 = null;//子弹
var boom1 = [];//大招
var boom1Length = 10;
var boom2 = null;//大招提示
var center0 = new THREE.Group();//准星
var shoot1Loaded = false;//判断加载是否完成
var boomLoaded = [];//判断加载是否完成
var boom2Loaded = false;//判断加载是否完成
var boom2Out=new THREE.Group();
var pointerTexture = new THREE.TextureLoader().load('img/sight-bead-white.png');
var material = new THREE.MeshBasicMaterial({
  map: pointerTexture,
  transparent: true,
  opacity: 1,
  depthWrite: false,
  side: THREE.DoubleSide
});

var pointerGeometry = new THREE.PlaneGeometry(0.07, 0.07);
var mesh = new THREE.Mesh( pointerGeometry,material );
center0.add(mesh);
mesh.position.z = -0.8;
center0.position.x = 0;
center0.position.y = 1.6;
center0.position.z = 0;
scene.add( center0 );

var keyboard = [];//键盘状态
var keyboardOut = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];//键盘状态
var keyboardloaded = [false, false, false];//判断加载是否完成
var texture1 = THREE.ImageUtils.loadTexture("img/keyboard1.png", null, function (t) {
  var material = new THREE.MeshBasicMaterial({map: texture1});
  material.transparent = true;
  material.opacity = 0;
  var keyboardGeometry = new THREE.BoxGeometry(1.6, 0.5, 0);
  var mesh = new THREE.Mesh(keyboardGeometry, material);
  keyboard[0] = mesh;
  center0.add(mesh);
  mesh.position.z = -0.7;
  mesh.position.y = -0.25;
  center0.add(mesh);
  //keyboardOut[0].position.x = 0;
  //keyboardOut[0].position.y = 1.6;
  //keyboardOut[0].position.z = 0;
  //
  //scene.add(keyboardOut[0]);
  keyboardloaded[0] = true;
});
var texture2 = THREE.ImageUtils.loadTexture("img/keyboard2.png", null, function (t) {
  var material = new THREE.MeshBasicMaterial({map: texture2});
  material.transparent = true;
  material.opacity = 0;
  var keyboardGeometry = new THREE.BoxGeometry(1.6, 0.5, 0);
  var mesh = new THREE.Mesh( keyboardGeometry,material );
  keyboard[1]=mesh;
  center0.add(mesh);
  mesh.position.z = -0.7;
  mesh.position.y = -0.25;
  center0.add(mesh);
  //keyboardOut[1].position.x = 0;
  //keyboardOut[1].position.y = 1.6;
  //keyboardOut[1].position.z = 0;
  //scene.add(keyboardOut[1]);
  keyboardloaded[1] = true;
});
var texture3 = THREE.ImageUtils.loadTexture("img/keyboard3.png", null, function (t) {
  var material = new THREE.MeshBasicMaterial({map: texture3});
  material.transparent = true;
  material.opacity = 0;
  var keyboardGeometry = new THREE.BoxGeometry(1.6, 0.5, 0);
  var mesh = new THREE.Mesh(keyboardGeometry, material);
  keyboard[2] = mesh;
  center0.add(mesh);
  mesh.position.z = -0.7;
  mesh.position.y = -0.25;
  center0.add(mesh);
  //keyboardOut[2].position.x = 0;
  //keyboardOut[2].position.y = 1.6;
  //keyboardOut[2].position.z = 0;
  //scene.add(keyboardOut[2]);
  keyboardloaded[2] = true;
});

var shoot = THREE.ImageUtils.loadTexture("img/shoot.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:shoot});
  material.transparent=true;
  //material.opacity=0;
  var shootGeometry = new THREE.BoxGeometry( 0.3, 0.3,0);
  //console.log(shootGeometry)
  var mesh = new THREE.Mesh( shootGeometry,material );
  shoot1 = mesh;
  scene.add(mesh);
  shoot1Loaded = true;
});

var boomTip = THREE.ImageUtils.loadTexture("img/boom.png",null,function(t) {
  var material = new THREE.MeshBasicMaterial({map:boomTip});
  material.transparent=true;
  material.opacity=0;
  var boom2Geometry = new THREE.BoxGeometry( 0.21, 0.12,0);
  var mesh = new THREE.Mesh( boom2Geometry,material );
  boom2 = mesh;
  mesh.position.z = -0.7;
  mesh.position.y = -0.28;
  center0.add(mesh);
  //boom2Out.position.x = 0;
  //boom2Out.position.y = 1.6;
  //boom2Out.position.z = 0;
  //scene.add( boom2Out );
  boom2Loaded=true;
});

for (var i = 0; i < boom1Length; i++) {
  ObjLoader.load('asset_src/boom.obj', function (boom) {//爆炸特效
    boom = boom.children[0];
    boom.material = new THREE.MeshLambertMaterial({
      color: 0xFF3399,
      transparent: true,
      opacity: 0
    });
    boom.scale.set(1, 1, 1);
    boom.position.y = controls.userHeight;
    boom.position.z = -2.2;
    var len = boom1.length;
    boom1[len] = boom;
    boomLoaded[len] = true;
    scene.add(boom);
  });
}


//----------------------Monster---------------------------

var monsterShock = {1: 1};
var monsterDanceRange = 0.05;
var tween = new TWEEN.Tween(monsterShock)
  .to({1: 2}, 1000)
  .repeat(Infinity)//无限重复
  .yoyo(true)//到达to的值后回到from的值
  .onUpdate(function (interpolation) {
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


/*
 * 游戏结束控制器
 * 方法:
 *   over: 无参数，开始结束流程。视野强制回到正前方并开始结束流程
 * */
var gameOver = createGameOver();

var keyBoardSystem = createKeyboard;

var boomFly = createBoom;

var GUIControl = {
  showEndPage: function () {
    showEndPage(186);
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
    keyBoardSystem(1, 3).hideKeyBoard();
    gameOver.over(function () {
      GAME_END_LOGO.material.opacity = 0;
      scene.remove(GAME_END_LOGO);
      showEndPage(123);
    });
  },
  pointsBoom: function () {
    pointsSystem.boom();
  },
  keyBoardAisToAs: function () {
    keyBoardSystem(3, 1).boom();
  },
  keyBoardAisToI: function () {
    keyBoardSystem(3, 2).boom();
  },
  keyBoardAsToAis: function () {
    keyBoardSystem(1, 3).boom();
  },
  keyBoardHide: function () {
    keyBoardSystem(1, 3).hideKeyBoard();
  },
  bigBoom: function () {
    boomFly(endPostion, boom1[1]).boom();
  },
  hideTip: function () {
    boomFly(endPostion).tipHide();
  },
  showTip: function () {
    boomFly(endPostion).tipShow();
  },
  shootFly: function () {
    boomFly(endPostion).shoot();
  },
  uniqueSkill: function () {
    uniqueSkill();
  }
};

var gui = new dat.GUI();
gui.close();
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
gui.add(GUIControl, 'keyBoardHide');
gui.add(GUIControl, 'uniqueSkill');

var stats = new Stats();
document.body.appendChild(stats.dom);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

// Request animation frame loop function
var lastRender = 0;
var cursor = new THREE.Vector2(0, 0);
var shootCount = 0;//子弹计时器
var shootFlag = 75;//子弹帧数
var shootStartPos = null;

var cursorOnMonster = [null, 0];
function animate(timestamp) {
  stats.update();
  TWEEN.update(timestamp);

  raycaster.setFromCamera(mouse, camera);

  if (isMonsterSpawn) {
    var intersects = raycaster.intersectObjects(monsterDisplayGroup.children);
    // intersects.length > 0 ? console.log(intersects) : ''; // 鼠标指向
    if (intersects.length == 0) {
      cursorOnMonster[0] = null;
      cursorOnMonster[1] = 0;
      hud.position.x = 0;
      hud.position.y = -10;
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
        if (timestamp - cursorOnMonster[1] >= LOCK_TIME && !(intersects[0].object.uuid in MONSTER_ARE_DEAD)) {
          MONSTER_ARE_DEAD[intersects[0].object.uuid] = 1;
          removeMonster(intersects[0].object);
          cursorOnMonster[0] = null;
          cursorOnMonster[1] = 0;
        }
      } else {
        cursorOnMonster[0] = intersects[0].object.uuid;
        cursorOnMonster[1] = timestamp;
      }
    }
  }

  if (DISPLAY_START_PAGE) {
    var intersects = raycaster.intersectObject(playBtn);
    var step = 0.04;
    if (intersects.length) {
      if (!startPageTimeOut) {
        startPageTimeOut = setTimeout(function () {
          removeStartPage();
        }, 1000)
      }
      if (showstartHoverEffect) {
        playBtnHover.material.opacity -= step;
        if (playBtnHover.material.opacity <= 0) {
          showstartHoverEffect = false;
        }
      } else {
        playBtnHover.material.opacity += step;
        if (playBtnHover.material.opacity >= 1) {
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

  hud.lookAt(camera.position);

  var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  var pose = controls.getPose();
  //if(boom2Loaded){
  //  boom2Out.quaternion.fromArray(pose.orientation);
  //}

  if (center0) {
    if (pose.orientation) {
      center0.quaternion.fromArray(pose.orientation);
    }
  }
  //键盘随视角移动
  //for(var i=0;i<3;i++){
  //  if(keyboardloaded[i]){
  //    if (pose.orientation) {
  //      keyboardOut[i].quaternion.fromArray(pose.orientation);
  //    }
  //  }
  //}

  //if (shoot1Loaded) {
  //  shoot1.translateY(-0.27);//-0.2~0
  //  shoot1.translateZ(-0.5);
  //}

  // 用于在游戏结束时接管camera
  if (!GAME_OVER_FLAG) {
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


// 键盘系统
function createKeyboard(key1, key2) {//初始键盘对象,最终键盘对象
  var keyboardOpacityTween = new TWEEN.Tween({opacity: 0})
    .to({opacity: 1}, 200)
    .easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function (interpolation) {
      keyboard[key1 - 1].material.opacity = 1 - interpolation;
      keyboard[key2 - 1].material.opacity = interpolation;
    })
    .onComplete(function () {
      keyboard[key1 - 1].material.opacity = 0;
      keyboard[key2 - 1].material.opacity = 1;
    });
  var keyboardHideAllTween = new TWEEN.Tween({opacity: 0})
    .to({opacity: 1}, 200)
    .easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function (interpolation) {
      keyboard[0].material.opacity = 1 - interpolation;
      keyboard[1].material.opacity = 1 - interpolation;
      keyboard[2].material.opacity = 1 - interpolation;
    })
    .onComplete(function () {
      keyboard[0].material.opacity = 0;
      keyboard[1].material.opacity = 0;
      keyboard[2].material.opacity = 0;
    });
  var keyboardShowAllTween = new TWEEN.Tween({opacity: 0})
    .to({opacity: 1}, 200)
    .easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function (interpolation) {
      keyboard[2].material.opacity = interpolation;
    })
    .onComplete(function () {
      keyboard[2].material.opacity = 1;
    });
  return {
    boom: function () {
      keyboardOpacityTween.start();
    },
    hideKeyBoard: function () {
      keyboardHideAllTween.start();
    },
    showKeyBoard: function () {
      keyboardShowAllTween.start();
    },
    particles: key1,
    particles2: key2
  }
}

var boomLength = 0;
// 子弹系统
function createBoom(endPos, boomObj) {//子弹最终对象1个,炸弹最终目标,炸弹obj
  var startPos = startPostion;
  var hideTween = new TWEEN.Tween({opacity: 0})//提示hide
    .to({opacity: 1}, 800)
    .easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function (interpolation) {
      boom2.material.opacity = 1 - interpolation;
    })
    .onComplete(function () {
      boom2.material.opacity = 0;
    });
  var showTween = new TWEEN.Tween({opacity: 0})//提示显示
    .to({opacity: 1}, 800)
    //.easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function (interpolation) {
      boom2.material.opacity = interpolation;
    })
    .onComplete(function () {
      boom2.material.opacity = 1;
    });

  var shootFlyTween = new TWEEN.Tween({count: 0})//子弹
    .to({count: 1}, 300)
    //.easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function (count) {
      var position = new THREE.Vector3(startPos.x + (endPos.x - startPos.x) * count, startPos.y + (endPos.y - startPos.y) * count, startPos.z + (endPos.z - startPos.z) * count);
      shoot1.rotation.copy(camera.rotation);
      shoot1.position.copy(position);
      shoot1.translateY(-0.27 + 0.27 * count);//-0.2~0
      //shoot1.material.opacity = 1;
    })
    .onComplete(function () {
      shoot1.position.copy(endPos);
      shoot1.rotation.copy(camera.rotation);
      shoot1.translateY(0);
      shoot1.material.opacity = 0;
    });
  var boomFlyTween = new TWEEN.Tween({count: 0})//大招
    .to({count: 1}, 500)
    //.easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function (count) {
      var position = new THREE.Vector3(startPos.x + (endPos.x - startPos.x) * count, startPos.y + (endPos.y - startPos.y) * count, startPos.z + (endPos.z - startPos.z) * count);
      boomObj.rotation.copy(camera.rotation);
      boomObj.position.copy(position);
      boomObj.rotateX(-1 * Math.PI * count);
      boomObj.translateY(-0.27 + 0.27 * count);//-0.2~0
    })
    .onComplete(function () {
      boomObj.position.copy(endPos);
      boomObj.rotation.copy(camera.rotation);
      boomObj.rotateX(-1 * Math.PI);
      boomObj.translateY(0);
      boomObj.material.opacity = 0;
    });
  return {
    boom: function (callback) {
      boomObj.material.opacity = 1;
      //boomObj.rotation.copy(camera.rotation);
      if (callback) {
        boomFlyTween.onComplete(callback).start();
      } else {
        boomFlyTween.start();
      }
    },
    tipHide: function () {
      hideTween.start();
    },
    tipShow: function () {
      showTween.start();
    },
    shoot: function (callback) {
      shoot1.material.opacity = 1;
      shoot1.rotation.copy(camera.rotation);
      if (callback) {
        shootFlyTween.onComplete(callback).start();
      } else {
        shootFlyTween.start();
      }
    }
  }
}


var vrDisplay;

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
  navigator.getVRDisplays().then(function (displays) {
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
  skybox.position.y = boxSize / 2;
  scene.add(skybox);

  // Place the cube in the middle of the scene, at user height.
  // cube.position.set(0, controls.userHeight, 0);
}


