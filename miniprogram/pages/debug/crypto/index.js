const { crypto: {md5, encryptString, decryptString} } = require('../../../utils/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    encode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  GoEncode(){
    const encode = md5(this.data.key)
    this.setData({
      encode: encode.toString()
    })
  },
  toAes(){
    const key = '1234'
    const encode = encryptString(this.data.key, key)
    const decode = decryptString(encode, key)
    this.setData({
      encodeKey: encode,
      decode: decode
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})