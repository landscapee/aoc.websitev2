
const flight = {
    namespaced: true,
    state: {
        showTOBTToolTip: false,
        delayOptions: []
    },
    mutations: {
        toggleTOBTVisibility: (state,data)=>{
            state.showTOBTToolTip = data
        },
        getAbnormalOptions: (state, data) => {
            state.delayOptions = data
        }

    },
    actions: {

    },
    getters: {
        getTOBTVisibility:(state)=>{
            return state.showTOBTToolTip
        },

    }
}

export default flight
