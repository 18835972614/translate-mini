// pages/history/history.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        logs: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onShow() {
        try {
            const logs = await wx.getStorage({ key: "historyLog" });
            this.setData({ logs: logs.data })
        } catch (error) {
            console.log(error)
        }
    },
    clearHistory() {
        wx.clearStorage();
          this.setData({logs: []})
    }
})