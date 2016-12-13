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
