// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request.js'
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    song:{},
    musicId:'',
    musicLink:'',
    currentTime:'00:00',
    durationTime: '00:00',
    currentWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //option：用于接收query参数
    //原生小程序中路由传参，对参数的长度有限制，如果过长会截取
    let musicId = options.musicId;
    console.log(options);
    console.log(musicId);
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId);
    /*
    控制音频的实例去监听音乐的播放和暂停
    */

    //判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      //修改当前页音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }
    this.backgroundAudioManager =wx.getBackgroundAudioManager();
    //监视音乐播放与暂停与停止
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
        this.changePlayState(false);
    });
    this.backgroundAudioManager.onStop(() => {
        this.changePlayState(false);
    });
    this.backgroundAudioManager.onEnded(() => {
      //自动切换到下一首音乐，并自动播放，进度条还原为零
      PubSub.subscribe('musicId', (msg, musicId) => {
        console.log(musicId);
        this.getMusicInfo(musicId);
        this.musicControl(true, musicId)
        //取消订阅
        PubSub.unsubscribe('musicId');
      })
      PubSub.publish('switchType','next');
      this.setData({
        currentWidth: 0 ,
        currentTime: '00:00',
      })
    });
    this.backgroundAudioManager.onTimeUpdate(()=>{
      //格式化实时的播放时间
    
      let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss');
      let currentWidth = (this.backgroundAudioManager.currentTime/ this.backgroundAudioManager.duration)* 450
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },
  //封装播放状态的方法
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    //修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  handleMusicPlay(){
    let isPlay = !this.data.isPlay;
    
    let { musicId,musicLink } = this.data;
    this.musicControl(isPlay,musicId,musicLink);
  },
  //控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink){
    if(isPlay){
      if(!musicLink){
        let musicLinkData = await request('/song/url', { id: musicId });
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        })
      }
      
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
      console.log(this.data.song.name);
      console.log(musicLink);
    }else{
      this.backgroundAudioManager.pause();
    }
  },
  async getMusicInfo(musicId){
    let songData = await request('/song/detail',{ids:musicId});
    let durationTime = moment(songData.songs[0].dt).format('mm:ss');
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  //点击切歌回调
  handleSwitch(event){
    let type = event.currentTarget.id;
    //关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    PubSub.subscribe('musicId',(msg,musicId) => {
      console.log(musicId);
      this.getMusicInfo(musicId);
      this.musicControl(true,musicId)
      //取消订阅
      PubSub.unsubscribe('musicId');
    })
    //发布消息数据给recommendSong页面
    PubSub.publish('switchType', type)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})