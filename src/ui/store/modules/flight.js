
const flight = {
    namespaced: true,
    state: {
       showTOBTToolTip: false
    },
    mutations: {
        toggleTOBTVisibility: (state,data)=>{
            state.showTOBTToolTip = data
        },

    },
    getters: {
        getTOBTVisibility:(state)=>{
            return state.showTOBTToolTip
        },

    }
}

export default flight
