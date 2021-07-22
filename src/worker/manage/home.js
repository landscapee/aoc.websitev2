

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
// 流量信息
export const flight_traffic = (posWorker, data) => {
  posWorker.publish('Web','flight.traffic',data)
}
//下小时预计放行
export const flight_estimateCtotRelease = (posWorker, data) => {
  posWorker.publish('Web','flight.estimateCtotRelease',data)
}
//综合速率
export const flight_runwayTraffic = (posWorker, data) => {
  posWorker.publish('Web','flight.runwayTraffic',data)
}
//跑道
export const flight_runwayModels = (posWorker, data) => {
  posWorker.publish('Web','flight.runwayModels',data)
}
//积压
export const flight_delay_backStatus = (posWorker, data) => {
  posWorker.publish('Web','flight.delay.backStatus',data)
}


