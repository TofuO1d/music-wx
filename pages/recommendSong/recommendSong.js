// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    //获取每日推荐的数据
    this.getRecommendList();
    //订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType',(msg,type)=>{
      let {recommendList,index}=this.data;
      if(type === 'pre'){//上一首
        if(index === 0){
          index = recommendList.length
        }
        index -=1;

      }else{//下一首
        if(index === recommendList.length - 1){
          index = -1;
        }
        index +=1
      }
      this.setData({
        index
      })
      let musicId = recommendList[index].id
      //将id回传给送detail页面
      PubSub.publish('musicId',musicId);
      console.log(msg,type);
    });
  },

  async getRecommendList(){
    //获取每日推荐的数据
    let recommendListData = await request('/recommend/songs');
    this.setData({
      recommendList: recommendListData.recommend
    })
  },
//跳转到歌曲详情页
  toSongDetail(event){
    let {song,index} = event.currentTarget.dataset;
    this.setData({
      index
    })
    //路由跳转传参：query参数
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+song.id
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