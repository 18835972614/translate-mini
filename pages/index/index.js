// index.js
import { languages } from '../../constants/index'
import { translateFunc } from '../../utils/util';
Page({
    data: {
        enableLanguages: languages,
        selectLanVisible: false,
        active: languages[0],
        lanValue: '',
        translateRes: ''
    },
    selectLanHandle() {
        this.setData({ selectLanVisible: !this.data.selectLanVisible })
    },
    async selectOnChange(e) {
        const target = e.target;
        const selectValue = target.dataset.value;
        const { lanValue } = this.data;
        const active = this.data.enableLanguages.find(item => item.value === selectValue);
        this.setData({ active, selectLanVisible: false })
        await this.translateRequest(lanValue, active);
    },
    async getStorage() {
        try {
            const historyLogRes = await wx.getStorage({ key: "historyLog" });
            return historyLogRes?.data ?? [];
        } catch (error) {
            await wx.setStorage({
                key: "historyLog",
                data: []
            })
            return []
        }
    },
    async translateRequest(lanValue, active) {
        try {
            const res = await translateFunc(lanValue, 'auto', active.value);
            const historyLogRes = await this.getStorage();
            await wx.setStorage({
                key: "historyLog",
                data: [{ timer: res.timer, text: res.trans_result }, ...historyLogRes].filter(e => e.timer && e.text)
            })
            this.setData({ translateRes: res.trans_result })

        } catch (error) {
            console.log(error, 'rerre')
            // this.setData({ translateRes: error })
        }
    },
    async textareaOnBlur(e) {
        const { lanValue, active } = this.data;
        await this.translateRequest(lanValue, active)
    },
    resClick() {
        this.setData({ selectLanVisible: false })
    }
});
