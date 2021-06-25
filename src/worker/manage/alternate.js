

 export const alternateConfigStart = (posWorker) => {
    posWorker.subscribe('Alternate.Change.Sync', (data) => {
    })
}

export const alternateConfigStop = (posWorker) => {
    posWorker.unsubscribe('Alternate.Change.Sync')
}


