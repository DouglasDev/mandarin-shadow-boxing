let sentenceList={
'imEatingRice':{
      file:'sentence_audio/wo_zai_chi_mifan.mp3',
      english:'I am eating rice.',
      englishLiteral:'I now eat rice.',
      zhongwen:'我 在 吃 米饭。',
      pinyin:'Wǒ zài chī mǐfàn.',
      startTimes:[305, 470, 683, 896],
      endTime:1600
},
'iWentForAWalkInThePark':{
      file:'sentence_audio/wo_qu_gongyuan.mp3',
      english:'I went for a walk in the park.',
      englishLiteral:'I go park walk finish steps.',
      zhongwen:'我 去 公园 散 了 步。',
      pinyin:'Wǒ qù gōngyuán sàn le bù.',
      startTimes:[364,538,768,1190,1372,1595],
      endTime:1900
},
'liveinbigcity':{
      file:'sentence_audio/wo_zhu_zai_da_chengshi_li.mp3',
      english:'I live in a big city.',
      englishLiteral:'I live at one big city inside.',
      zhongwen:'我 住 在 一个 大 城市 里。',
      pinyin:'Wǒ zhù zài yīgè dà chéngshì lǐ.',
      startTimes:[260,430,616,818,1025,1237,1712],
      endTime:1972
},
'toomuchcoffee':{
      file:'sentence_audio/ta_kafei_he.mp3',
      english:'You drink too much coffee.',
      englishLiteral:'You coffee drink adverb too much particle.',
      zhongwen:'你 咖啡 喝 得 太 多 了。',
      pinyin:'Nǐ kāfēi hē dé tài duō le.',
      startTimes:[250,407,743,865,1000,1225,1410],
      endTime:1657
},
'dogrunsfast':{
      file:'sentence_audio/zhe_gou_pao_de.mp3',
      english:'This dog runs very fast!',
      englishLiteral:'This dog run adverb very fast exclaim!',
      zhongwen:'这 狗 跑 得 多 快 啊！',
      pinyin:'Zhè gǒu pǎo dé duō kuài a!',
      startTimes:[265,453,680,845,980,1180,1428],
      endTime:1659
}
};


let currentWord=0,
    reps=10;


function start(){
  let sentence = $( "#sentence-selector" ).val()

  if (sentence!=null){
    sentence = sentenceList[sentence];

    currentWord=0,
    reps=10;

  //setup audio
    let spritesArray=generateSpritesArray(sentence.startTimes,sentence.endTime);
    let sentenceAudio=generateSentenceAudio(sentence.file,spritesArray,sentence.pinyin);

  //setup sentence text
    let englishLiteralArray=generateWordArray(sentence.englishLiteral);
    let zhongwenArray=generateWordArray(sentence.zhongwen);
    let pinyinArray=generateWordArray(sentence.pinyin);

    $('#english').text(sentence.english);
    $('#englishLiteral').text(englishLiteralArray[0]);
    $('#zhongwen').text(zhongwenArray[0]);
    $('#pinyin').text(pinyinArray[0]);

    $('#reps_left').text(reps);

    $('#skip').prop('disabled',false);
    $('#skip').css('color', 'black');
    $('#skip').text('skip');

  //remove previous button events
    $("#next-rep").unbind('click')
    $("#skip").unbind('click')


  //setup button events
    $( "#next-rep" ).click(function() {

      if (reps>0){reps-=1;}
      $('#reps_left').text(reps);

      sentenceAudio.play('sprite'+currentWord.toString());

      if (reps==0 && currentWord<englishLiteralArray.length-1){ 
        $('#skip').text('continue');  
      }

    });


    $( "#skip" ).click(function() {

      if (currentWord<englishLiteralArray.length-1){
        $('#skip').text('skip');
        currentWord+=1;
        reps=10;
        $('#english').text(sentence.english);
        $('#englishLiteral').text(englishLiteralArray[currentWord]);
        $('#zhongwen').text(zhongwenArray[currentWord]);
        $('#pinyin').text(pinyinArray[currentWord]);
      }
      else{
        $('#skip').text('keep practicing!');
        $('#skip').prop('disabled',true);
        $('#skip').css('color', 'gray');
      }

    });
  }
}

function stringArrayToString(arr,joinString){
  if (Array.isArray(arr)){
    return arr.join(joinString); 
  }
  else{
    return arr;
  }
}


function generateWordArray(sentenceString){
  sentence= sentenceString.split(' ');
  let wordArray=[];
  //first add whole sentence
  wordArray.push(sentenceString);
  //then add individual words;
  for (let word=0; word<sentence.length; word++){
    wordArray.push(stringArrayToString(sentence[word],' '));
  }
  //last add sentence parts
  for (let word=0; word<sentence.length; word++){
    wordArray.push(stringArrayToString(sentence.slice(0, word+1),' '));
  }
  return wordArray;
}

function generateSpritesArray(startTimes,endTime){
  let spritesArray=[];
    //sprite format: [start time,duration] (in ms)
  let offsetEnd=0//150;
  let offsetBegin=20//60;

  //whole sentence sprite
  spritesArray.push([startTimes[0],(endTime-startTimes[0])]);
  //individual word sprite
  for (let n=0;n<startTimes.length;n++){
    if (n==startTimes.length-1){
          //calculate duration of final sprite
      spritesArray.push([startTimes[n]-offsetBegin,(endTime-startTimes[n])]);
    }
    else{
          //calculate duration of all other sprites
      spritesArray.push([startTimes[n]-offsetBegin,(startTimes[n+1]-startTimes[n])-offsetEnd]);
    }
  }
  //sentence fragment sprites
  for (let n=0;n<startTimes.length;n++){
    if (n==startTimes.length-1){
          //calculate duration of final sprite
      spritesArray.push([startTimes[0]-offsetBegin,(endTime-startTimes[0])]);
    }
    else{
          //calculate duration of all other sprites
      spritesArray.push([startTimes[0]-offsetBegin,(startTimes[n+1]-startTimes[0])-offsetEnd]);
    }
  }
  return spritesArray;
}

function generateSentenceAudio(file,spritesArray){

  let spriteNames=[]
  for (let n=0; n<spritesArray.length; n++){
    spriteNames.push('sprite'+n.toString())
  }

  let spriteObject={};

  spriteNames.forEach((word,index)=>{
    spriteObject[word]=spritesArray[index];
    }
  )

  let sentenceAudio = new Howl({
    rate:1.0,
    src: [file],
    sprite: spriteObject
  });

  return sentenceAudio;
}


// function stringToSpaces(str){
//   spaces=' '
//   return spaces.repeat(str.length)
// }