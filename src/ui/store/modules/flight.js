
const flight = {
    namespaced: true,
    state: {
        showTOBTToolTip: false,
        showAdvance: false,
        delayOptions: [],
        statusOptions: [],
    },
    mutations: {
        toggleTOBTVisibility: (state,data)=>{
            state.showTOBTToolTip = data
        },
        toggleShowAdvance: (state,data)=>{
            state.showAdvance = data
        },
        getAbnormalOptions: (state, data) => {
            state.delayOptions = data
        },
        getStatusOptions: (state, data) => {
            state.statusOptions = data
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
