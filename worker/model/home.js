
export const start = (posWorker) => {
  posWorker.subscribe('Flight.Change.Sync',(data)=>{

  })
}

export const stop = (posWorker) => {
  posWorker.unsubscribe('Flight.Change.Sync')
}




export const flight_home = (posWorker, data) => {
  posWorker.publish('Web','flight.home',data)
}
// 月度放行正常率目标
export const flight_monthClearance = (posWorker, data) => {
  posWorker.publish('Web','flight.monthClearance',data)
}
// 最近实际落地航班
export const flight_lastestAta = (posWorker, data) => {
  posWorker.publish('Web','flight.lastestAta',data)
}
// 最近实际起飞航班
export const flight_lastestAtd = (posWorker, data) => {
  posWorker.publish('Web','flight.lastestAtd',data)
}
// 运行
export const flight_FlightStatistic = (posWorker, data) => {
  posWorker.publish('Web','flight.FlightStatistic',data)
}
// 走廊口方向放行率
export const flight_direction = (posWorker, data) => {
  posWorker.publish('Web','flight.direction',data)
}




//积压
export const flight_delay_backStatus = (posWorker, data) => {
  posWorker.publish('Web','flight.delay.backStatus',data)
}


