

export const runNewStart = (posWorker) => {
    posWorker.subscribe('RunNewStart.Change.Sync', (data) => {
    })
}

export const runNewStop = (posWorker) => {
    posWorker.unsubscribe('RunNewStart.Change.Sync')
}


