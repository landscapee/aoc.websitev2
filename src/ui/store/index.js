import Vue from 'vue'
import Vuex from 'vuex'
import sysMsg from "./modules/sys-msg.js"
import getters from './getters';
import flight from "./modules/flight";

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {sysMsg, flight},
    getters
})
export default store
