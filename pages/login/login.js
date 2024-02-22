// pages/login/login.js
/*
 1、收集表单信息
 2、前端验证
  1）验证用户信息是否合法
  2）不通过就提示用户，不需要发请求
  3）通过了就发请求（携带账号密码）给服务器  
 3、后端验证 
  1）验证用户是否存在
  2）用户不存在直接返回，够足前端该用户不存在
  3）用户存在还需要验证密码是否正确
  4）密码不正确，显示密码不正确
  5）密码正确，登录成功（携带用户的相关信息）
 */
import request from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleInput(event){
    let type = event.currentTarget.id;
    this.setData({
      [type]:event.detail.value
    })
  },
  async login(){
    let {phone,password} = this.data;
    if(!phone){
     wx.showToast({
       title: '手机号不能为空',
       icon:'none'
     })
     return;
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon:'none'
      })
      return;
  }
  if(!password){
    wx.showToast({
      title: '密码不能为空',
      icon: 'none'
    })
    return;
  }

    // wx.showToast({
    //   title: '登录成功',
    // })
  // 后端验证
  let result = await request('/login/cellphone',{phone,password,isLogin:true});
  if(result.code === 200){
    wx.showToast({
      title: '登录成功',
    })
    console.log(result);
    //将用户信息存储到本地
    wx.setStorageSync("userInfo", JSON.stringify(result.profile))
    wx.reLaunch({
      url: '/pages/personal/personal',
    })

  }else if(result.code === 400){
    wx.showToast({
      title: '手机号错误',
      icon:'none'
    })
  }else if(result.code === 502){
    wx.showToast({
      title: '密码错误',
      icon:'none'
    })
  }else{
    wx.showToast({
      title: '登录失败',
      icon: 'none'
    })
  }
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