import Vue from 'vue'
import Vuex from 'vuex'
import sysMsg from "./modules/sys-msg.js"

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: [sysMsg]
})
export default store
