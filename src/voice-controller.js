/*
 * voice output
 */

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
  var au = createMusic('./asset_src/test-music.m4a', true);
  au.play();
  return au;
}

//var bgMusic = palyBackGroundMusic();

//setTimeout(function() {
//  bgMusic.pause();
//}, 10000)
//
//setTimeout(function() {
//  bgMusic.play();
//}, 20000)


function palyKeyBoardMusic() {
  var au = createMusic('../asset_src/test-music2.m4a');
  au.play();
  return au;
}

//setTimeout(function() {
//  var kbMusic = palyKeyBoardMusic();
//},30000)


/*
 * voice input
 */

function doLisenVoiceInput(callback) {
  var julius = new Julius('./voxforge/sample.dfa', './voxforge/sample.dict', {
    //verbose: true,
    //transfer:true
  });
  julius.onrecognition = function(sentence, score) {
    console.log(sentence, score);
    //if (/^[BC]ALL/.test(sentence)) {
    if (/ALL/.test(sentence)) {
      console.log('爆')
      callback && callback();
    } else {
      //document.getElementById('text').innerText = sentence
    }
  };
  julius.onfail = function(){
    console.log('fail....')
  }
  console.log('record start, please input...')
  return julius;
}

var voiceInput = doLisenVoiceInput(function(){
  removeStartPage();
});
