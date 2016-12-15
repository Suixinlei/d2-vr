//----------------------Cabinet---------------------------


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
  mesh.position.y = 5;

  //阵列的长宽个数
  var matrixW = 10;
  var matrixH = 10;

  //阵列中心空缺的长宽个数
  var vacancyW = 4;
  var vacancyH = 4;

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

  scene.add(cabinetGroup);
}


//----------------------Cabinet---------------------------


function addSkybox() {
  var skyboxTexture = new THREE.TextureLoader().load('img/box.png');
  skyboxTexture.wrapS = THREE.RepeatWrapping;
  skyboxTexture.wrapT = THREE.RepeatWrapping;
  skyboxTexture.repeat.set(boxSize, boxSize);

  // var geometry = new THREE.BoxGeometry(boxSize, boxSize/4, boxSize);
  var geometry = new THREE.PlaneGeometry(boxSize, boxSize);

  geometry.rotateX(Math.PI/2);

  var material = new THREE.MeshBasicMaterial({
    map: skyboxTexture,
    color: 0x0587fa,
    side: THREE.DoubleSide
  });

  // Align the skybox to the floor (which is at y=0).
  skybox = new THREE.Mesh(geometry, material);
  // skybox.position.y = boxSize/8;
  scene.add(skybox);
  // For high end VR devices like Vive and Oculus, take into account the stage
  // parameters provided.
  setupStage();
}

function addHUD() {
  var hudTexture = new THREE.TextureLoader().load('img/hover.png');
  var geometry = new THREE.PlaneGeometry(hudSize, hudSize, hudSize);
  var material = new THREE.MeshBasicMaterial({
    map: hudTexture,
    transparent: true,
    depthWrite: false,
    // color: 0x01BE00,
    side: THREE.DoubleSide
  });

  hud = new THREE.Mesh(geometry, material);
  hud.position.x = 0;
  hud.position.y = -10;
  hud.position.z = 0;
  scene.add(hud);
}


function addAisLogo() {
  var aisTexture = new THREE.TextureLoader().load('img/ais.png');
  var geometry = new THREE.PlaneGeometry(GAME_END_LOGO_SIZE, GAME_END_LOGO_SIZE);
  var material = new THREE.MeshBasicMaterial({
    map: aisTexture,
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
}

function createMonsterGroup() {
  var RealMonsterTexture = [new THREE.TextureLoader().load('img/monster1.png'), new THREE.TextureLoader().load('img/monster2.png'), new THREE.TextureLoader().load('img/monster3.png'), new THREE.TextureLoader().load('img/monster4.png')];

  for (var i=0; i<MAX_MONSTER_NUMBER_STORAGE; i++) {
    var RandomNumber = Helper.getRandomInt(0, Monster_Spawn_Points.length -1);
    var RandomSpawnPoint = Monster_Spawn_Points[RandomNumber];
    Monster_Spawn_Points.splice(RandomNumber, 1);
    var RealMonsterHitBoxGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    var RealMonsterHitBoxMaterial = new THREE.MeshBasicMaterial({
      map: RealMonsterTexture[i % 4],
      transparent: true,
      depthWrite: false
    });

    var RealMonsterHitBox = new THREE.Mesh(RealMonsterHitBoxGeometry, RealMonsterHitBoxMaterial);
    RealMonsterHitBox.position.x = RandomSpawnPoint.x;
    RealMonsterHitBox.position.y = RandomSpawnPoint.y + 1.6;
    RealMonsterHitBox.position.z = RandomSpawnPoint.z;

    RealMonsterHitBox.lookAt(camera.position);
    monsterGroup.push(RealMonsterHitBox);
  }
}

// 粒子系统
function createPoints() {
  var geometry = new THREE.Geometry();
  var texture = new THREE.TextureLoader().load( "img/point1.png" );
  var material = new THREE.PointsMaterial({
    size: 0.15,
    map: texture,
    // blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent : true,
    opacity: 1
  });
  console.log(material)

  for (var i = 0; i < 100; i++) {
    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 0.3 - 0.15;
    vertex.y = Math.random() * 0.3 - 0.15;
    vertex.z = Math.random() * 0.3 - 0.15;
    geometry.vertices.push( vertex );
  }

  var particles = new THREE.Points( geometry, material );
  particles.position.y = -1;
  scene.add(particles);

  var pointsTween = new TWEEN.Tween({ r: 1 })
    .to({ r: 1.055 }, 600)
    .easing(TWEEN.Easing.Exponential.Out)
    .onUpdate(function(interpolation) {
      var r = interpolation * 0.055 + 1;
      geometry.vertices.forEach(function (vertex) {
        vertex.multiplyScalar(r);
      });
      geometry.verticesNeedUpdate = true;
    })
    .onComplete(function () {
      geometry.vertices.forEach(function (vertex) {
        vertex.set(Math.random() * 0.3 - 0.15, Math.random() * 0.3 - 0.15, Math.random() * 0.3 - 0.15);
      });
      geometry.verticesNeedUpdate = true;
    });

  var pointsOpacityTween = new TWEEN.Tween({ opacity: 1 })
    .to({ opacity: 0 }, 600)
    .easing(TWEEN.Easing.Exponential.In)
    .onUpdate(function(interpolation) {
      material.opacity = (1 - interpolation) * 0.6;
      material.size = (1 - interpolation) * 0.2 + 0.1;
    })
    .onComplete(function () {
      // material.opacity = 1;
    });

  return {
    boom: function () {
      pointsTween.start();
      pointsOpacityTween.start();
    },
    particles: particles
  }
}