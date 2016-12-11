function createMusic(src, loop) {
  var au = document.createElement('audio');
  au.preload = 'auto';
  au.src = src;
  if (loop) {
    au.loop = 'loop';
  }
  return au;
}

function palyBackGroundMusic() {
  var au = createMusic('../asset_src/test-music.m4a', true);
  au.play();
  return au;
}

var bgMusic = palyBackGroundMusic();

setTimeout(function() {
  bgMusic.pause();
},10000)

setTimeout(function() {
  bgMusic.play();
},20000)


function palyKeyBoardMusic() {
  var au = createMusic('../asset_src/test-music2.m4a');
  au.play();
  return au;
}

//setTimeout(function() {
//  var kbMusic = palyKeyBoardMusic();
//},30000)

