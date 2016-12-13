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

function playMusic(kind) {
  var src;
  var loop;
  switch (kind) {
    case 'background' :
      src =  'background.mp3';
      loop = true;
      break;
    case 'boom' :
      src =  'boom.wav';
      break;
    case '321' :
      src =  '321.wav';
      break;
    case 'aoh' :
      src =  'aoh.mp3';
      break;
    case 'bi' :
      src =  'bi.wav';
      break;
    case 'shot' :
      src =  'one-shot.wav';
      break;
    case 'right' :
      src =  'right.wav';
      break;
    case 'success' :
      src =  'success.wav';
      break;
  }
  if (!src) {
    return null;
  }
  var au = createMusic('./asset_src/' + src, loop);
  au.play();
  return au;
}

var bgMusic = playMusic('background');

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

//artyom.on(['报', '包', '爆', '宝', '抱', '保', '饱', '暴', '薄']).then(function(i) {
//  console.log('爆炸啦');
//});
//
//
//artyom.initialize({
//  lang: "zh-CN", // GreatBritain english
//  //lang: "en-GB", // GreatBritain english
//  continuous: true, // Listen forever
//  soundex: true,// Use the soundex algorithm to increase accuracy
//  debug: true, // Show messages in the console
//  //executionKeyword: "and do it now",
//  listen: true // Start to listen commands !
//});