import Vue from 'vue'
import Vuex from 'vuex'
import sysMsg from "./modules/sys-msg.js"
import getters from './getters';

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: [sysMsg],
    getters
})
export default store
