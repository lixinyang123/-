const request = require("request");
const mpg = require('mpg123');

var loginUrl = "http://localhost:3000/login/cellphone?phone=15937905153&password=lxy15937905153";
var searchUrl = "http://localhost:3000/search?keywords=";

var cookies,songUrl,currentMusic = null;
var musicList = new Array();
var player = new mpg.MpgPlayer();

//搜索音乐
function searchMusic(musicName,callback) {

    songUrl  = searchUrl+musicName;

    request.get(loginUrl,(err,res,body)=>{

        cookies =  res.headers["set-cookie"];

        for(var i=0;i<cookies.length;i++){
            console.log(cookies[i]);
        }

        getSearchResult(callback);
    });
}

function getSearchResult(callback){
    var options = {
        headers: {
            'Cookie': cookies
        }
    };

    request.get(songUrl,options,function(err,res,body){
        callback(body);
    });
}

function play(musicId){

    addMusic(musicId);
    
    if(currentMusic==null){
        var url = "http://music.163.com/song/media/outer/url?id="+musicId+".mp3";
        player.play(url);
        currentMusic = musicId;
        getPlayState();
    }
}

function playNext(){
    try{
        musicList.shift();
        var musicId  = musicList[0];
        var url = "http://music.163.com/song/media/outer/url?id="+musicId+".mp3";
        player.play(url);
        currentMusic = musicId;
        setTimeout(getPlayState,1000);
    }
    catch(err){
        throw 'error';
    }
}

function getPlayState(){
    player.getProgress((progress)=>{
        progress = Math.round(progress*100);
        if(progress>=99){
            player.stop();
            console.log("播放下一首");
            currentMusic = null;
            playNext();
        }
        else{
            setTimeout(getPlayState,100);
        }
    });
}

function addMusic(musicId){
    musicList.push(musicId);
}

module.exports={
    play,
    searchMusic,
    playNext,
    musicList,
};
