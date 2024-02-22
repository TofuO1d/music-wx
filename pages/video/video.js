// pages/video/video.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    navId:'',
    videoList:[],
    videoId:'',//标识视频id
    videoUpdateTime:[],
    isTriggered: false,
    arr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();
  },

  async getVideoGroupListData(){
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0,14),
      navId: videoGroupListData.data[0].id
    });
    this.getVideoList(this.data.navId);
  },
//获取视频列表数据
  async getVideoList(navId){
    let videoListData = await request
    ('/video/group',{id:navId});
    wx.hideLoading();
   
    let index = 0;
    let videoList =videoListData.datas.map(item => {
      item.id = index++
      return item;
      })
    console.log(videoListData)
    this.setData({
      videoList,
       //关闭下拉更新
      isTriggered: false
    })
  },

  changeNav(event){
    let navId = event.currentTarget.id;
    this.setData({
      navId:navId*1,//转回成number类型
      videoList:''
    })
    wx.showLoading({
      title: '正在加载'
    })
    this.getVideoList(this.data.navId);
  },
  //点击播放/继续播放时触发
  handlePlay(event){
    let vid = event.currentTarget.id;
    //点击视频时把上一个点击的视频停掉
    //this.vid !== vid && this.videoContext && this.videoContext.stop();
    //this.vid = vid
    this.setData({
      videoId:vid
    })
    this.videoContext = wx.createVideoContext(vid);
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime);
    }
    
  },
  //监听视频播放进度的问题
  handleTimeUpdate(event){
    let videoTimeObj = {vid:event.currentTarget.id,currentTime:event.detail.currentTime};
    let {videoUpdateTime} = this.data;
     /**
   * 思路：判断记录播放时长的videoUpdateTime数组中是否有当前视频的播放记录
   * 1、如果有，在原有的播放记录中修改稿播放时间为当前的播放时间
   * 2、如果没有，需要在数组中添加当前视频的播放记录
   */
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if(videoItem){
    videoItem.currentTime = videoTimeObj.currentTime
    }else{
    videoUpdateTime.push(videoTimeObj);
    }
    //更新
    this.setData({
      videoUpdateTime
    })
  },
  handleEnded(event){
    //移出记录
    let {videoUpdateTime} = this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id),1);
    this.setData({
      videoUpdateTime
    })
  },
  //自定义刷新的回调函数
  handleRefresher(){
    this.getVideoList(this.data.navId)
  },
  //下拉触底更新
  async handleToLower() {  //上拉加载
    let arr = this.data.arr
    let trigger = console.log('抛出的记录点');
    arr.push(trigger)
    let start = 0;
    for (let i = 0; i < arr.length; i++) {
      start++
    }
    let navId = this.data.navId
    let getVideoMoreListData = await request('/video/group', { id: navId, offset: start })
    let index = 0
    let videoMoreList = getVideoMoreListData.datas.map(item => {
      item.id = index++
      return item
    })
    let videoList = this.data.videoList
    videoList.push(...videoMoreList)
    this.setData({
      videoList
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
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