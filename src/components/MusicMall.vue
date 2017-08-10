<template>
  <div>
    <div class="wrap">
      <div class="box">
        <div class="play_box">
          <span class="num">
            {{currentId}}
            <span class="num-total">{{numbers}}</span>
          </span>
          <div class="music-mask"></div>
          <img ref="musicImg" :src="imgSrc" alt="">
          <button class="music-play" @click="toPlay"
                  :class="{'music-play':isPlaying,'music-pasue':!isPlaying}"
          ></button>
          <audio controls="controls" ref="audios" style="display: none"
                 src="../../static/media/小永远.mp3"></audio>

          <h2 class="artis">{{currentMusic.songer}}</h2>
          <h3 class="song-title">{{currentMusic.songName}}</h3>
        </div>
        <div class="music_list">
          <p class="slogan">没有什么不是一首歌不能平复的心情</p>
          <ul class="songs">
            <li :class="{ischeck:(currentId-1)===index}" v-for="(item,index) in songs" @dblclick="changeMusic(index)">
              {{ item.songName }}
              <span style="position: absolute; right:50px;">{{ item.songer }}</span>
            </li>
          </ul>
          <!--<div class="music_txt">
            <h3><< 流言飞语 >></h3>
            <h4>&nbsp&nbsp&nbsp&nbsp&nbspJust to stay your wish  </h4>
            <div class="barrage_box" ref="barrageBox" >
              <transition-group name="fade-in" tag="ul" >
                <li v-for="(item,index) in barrageList" :key="index">{{ item }}</li>
              </transition-group>
            </div>
            <input type="text" class="barrage_txt" ref="barrageTxt">
            <button class="barrage_btn" @click="toScreen">ENTER</button>
          </div>-->
          <music-barrage></music-barrage>
        </div>
      </div>
    </div>

  </div>

</template>
<script type="text-ecamscript-6">
 import axios from 'axios'
 import MusicBarrage from './MusicBarrage'
  export default{
    components:{
      MusicBarrage
    },
    data(){
      return {
        isPlaying: true,
        deg: 0,
        time:{},
        currentId:1,
        numbers:1,
        imgSrc:'',
        currentMusic:{
            songName:"小永远",
            songer:"没有小熊了",
            songImg:"music_1.gif",
            songurl:"../../static/media/小永远.mp3"
        },
        songs:[]
      }
    },
    mounted(){
      this.getImgSrc()
      this.getMusicList()
     },
    methods:{
      getMusicList(){
        axios.get('/musics').then((response)=>{
            let res = response.data
            if(res.status==0){
              this.songs = res.result.list
              this.numbers= res.result.count
            }else{
              this.songs = []
              this.numbers= 1
            }
          })
      },
      toPlay(){
        clearInterval(this.time)
        if(this.isPlaying){
          this.isPlaying = false
          this.$refs.audios.play()
          this.time = setInterval(()=>{
            this.deg++
            this.$refs.musicImg.style.transform =`rotate(${this.deg}deg)`
          },100)
        }else{
          this.isPlaying = true
          this.$refs.audios.pause()
          clearInterval(this.time)
        }
      },
      changeMusic(index){
        this.deg=0
        this.$refs.musicImg.style.transform ='rotate(0deg)'
        this.currentMusic= this.songs[index]
        this.$refs.audios.src ='../../static/media/'+ this.currentMusic.songurl
        this.getImgSrc()
        this.isPlaying = true
        this.toPlay()
        this.isPlaying = false
        this.currentId = index+1
      },
      getImgSrc(){
        this.imgSrc = '/static/img/'+this.currentMusic.songImg
      }
    }
  }
</script>
<style scoped>
  .music-box{
    width: 402px;
    height: 400px;
    position: absolute;
    left: 50%;
    top: 80px;
    margin-left: -200px ;
    color: #fff;
    border: 1px solid #fff;
  }
  .control-button--back{
    position: absolute;
    left: -70px;
    top: -30px;
  }

  .wrap{
    width:100%;
    height:100%;
    position:absolute;
    top:0;
    left:0;
    bottom:0;
    background-size: cover;
    background-position: center;
    transition: 2s;
  }
  .box{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -400px;
    margin-top: 60px;
    width: 1000px;
    height: 500px;
    z-index: 20;
  }
  .play_box{
    position:absolute;
    left: 20px;
    top: 50px;
    width: 400px;
    height: 400px;
    border-radius: 200px;
    color:#fff;
  }
  .play_box img{
    width: 100%;
    height: 100%;
    border-radius: 200px;
  }
  .num{
    position: absolute;
    font-size: 13vmin;
    top: -5vmin;
    left: -6vmin;
    white-space: nowrap;

  }
  .num-total{
    font-size: 8vmin;
    vertical-align: top;
  }
  .num-total:before{
    content: ' / ';
    vertical-align: top;
  }
  .artis{
    position: absolute;
    font-size: 6vmin;
    line-height: 0.8;
    bottom: 0;
    left: -5vmin;
    margin: 0 0 0.25em 0;
    white-space: nowrap;
  }
  .song-title{
    position: absolute;
    font-size: 3vmin;
    font-weight: normal;
    top: 100%;
    left: 5vmin;
    margin: 0.25em 0 0;
  }
  .music_list{
    position: absolute;
    right: 20px;
    top: 20px;
    width: 450px;
    height: 470px;
    overflow: hidden;
  }
  .music_list .slogan{
    position: absolute;
    left: 0;
    right:0;
    text-align: center;
    font-weight: bold;
    color:rgba(255,255,255,.8);
  }
  .music_list .songs{
    width: 100%;
    /*height: 100px;*/
    text-indent: 35px;
    color:#ffe5e6;
    font: 14px/25px "宋体";
    border: none;
    padding: 20px 0 ;
    border-radius: 20px ;
    overflow: hidden;
  }
  .music_list .songs li:hover{
    background: rgba(125,226,253,.3);
    border-radius: 50%;
  }
  .music_list span{
    display: inline-block;
    font-size: 12px;
  }
  .music_list .ischeck{

    border-radius: 50%;
    background: rgba(6,97,151,.3);
    font-weight: bold;
    font-size: 18px;
    color:rgba(231,100,105,.8);
  }

  .music-play,.music-pasue{
    position: absolute;
    margin: -42px 0 0 -42px;
    top: 50%;
    left: 50%;
    width: 84px;
    height: 84px;
    padding: 0;
    border-radius: 42px;
    background-color: rgba(255,255,255,0.3);
    background-repeat: no-repeat;
    background-position: center center;
    transition: .4s;
    border:none;
    outline:none
  }
  .music-play{
    background-image: url("../assets/images/music-play.png");
  }
  .music-pasue{
    background-image: url("../assets/images/music-pasue.png");
  }
  .music-play:hover{
    background-color: rgba(255,255,255,0.6);
  }
  .music-mask{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    transition: .3s;
    border-radius: 50%;
  }
  .music-mask:hover{
    background-color: rgba(47,47,47,.3);
  }


</style>
