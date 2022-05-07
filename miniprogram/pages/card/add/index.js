const { getCard } = require('../../../api')
const { getCardManager } = require('../../../class/card')
Page({
  data: {
    card: {
      id: '',
      encrypted: false,
      image: [
        {url: '/static/images/add.svg'}
      ],
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.id){
      this.data.card.id = options.id
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    if(!this.data.card.id) return
    
    wx.showLoading({
      title: 'load card'
    })
    const res = await getCard({
      id: this.data.card.id
    })
    const setData = {
      'card.id': res._id,
      'card.image': res.image,
      'card.encrypted': res.encrypted
    }
    if(res.encrypted){
      const cardManager = await getCardManager()
      setData['card.image'] = []
      for (const pic of res.image) {
        const {imagePath} = await cardManager.decryptImage(pic)
        pic._url = pic.url
        pic.url = imagePath
        setData['card.image'].push(pic)
      }
    }
    this.setData(setData)
    wx.hideLoading()
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  hasSelectedPic(){
    return this.data.card.image.map(e=>e.url.endsWith('add.svg')).filter(e=>e).length === 0
  },
  async goSaveCard(){
    if(!this.hasSelectedPic()) return
    wx.showLoading({
      title: '上传中'
    })
    this.saveCard()
    .then(res=>{
      wx.nextTick(()=>{
        wx.showToast({
          title: 'ok',
        })
      })
    }).catch((error)=>{
      console.log(error);
      wx.nextTick(()=>{
        wx.showToast({
          title: error.message || 'savePic ERROR',
          icon: 'error'
        })
      })
    }).finally(wx.hideLoading)
  },

  async saveCard(){
    const cardManager = await getCardManager()
    return cardManager.save(this.data.card)
  },
  
  async goTapPic(e){
    const index = e.currentTarget.dataset.index
    try {
      const cardManager = await getCardManager()
      const picPath = await cardManager.choosePic()
      if(!picPath) return
      
      const key = `card.image[${index}].url`
      this.setData({
        [key]: picPath
      })
    } catch (error) {
      wx.showToast({
        title: error.message || error.toString(),
        icon: "error"
      })
    }
  },
  addCardPic(){
    const idx = this.data.card.image.length
    if(idx == 1){
      this.setData({
        'card.image': this.data.card.image.concat({url: '/static/images/add.svg'})
      })
    }else{
      this.setData({
        'card.image': this.data.card.image.slice(0,-1)
      })
    }
  },
  keepEncrypt(){
    this.setData({
      'card.encrypted': !this.data.card.encrypted
    })
  },
  previewPic(){
    wx.previewImage({
      urls: this.data.card.image.map(e=>e.url),
    })
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