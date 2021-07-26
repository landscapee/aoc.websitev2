
const flight = {
    namespaced: true,
    state: {
        showTOBTToolTip: false,
        showAdvance: false,
        delayOptions: [],
        statusOptions: [],
        flightRemoteSel: {}
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
        updateFlightRemoteOptions: (state, data) => {
            state.flightRemoteSel = _.extend({}, state.flightRemoteSel, data)
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
