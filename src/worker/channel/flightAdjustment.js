import {flightAdjustmentStart, flightAdjustmentStop} from "@/worker/manage/flightAdjustment";
import {memoryStore} from "@/worker/lib/memoryStore";
let worker, client;
let clientObj = {};

/*
* 检查服务是否在线
* */
export const checkClient = (clientField) => {
  return new Promise((resolve) => {
    setInterval(() => {
      if (clientObj[clientField]) {
        resolve();
      }
    }, 50);
  });
};

export const init = (worker_) => {
  worker = worker_;
  worker.subscribe('Adverse.Network.Connected', (c) => {
    clientObj.AdverseClient = c;

  });
  worker.subscribe('Page.FlightAdjustment.Start',()=>{
    flightAdjustmentStart(worker);
    checkClient('AdverseClient').then(() => {
      clientObj.AdverseClient.sub('/adverse-condition/wd/flights', (data) => {
        memoryStore.setItem('FlightByHours', { adjustReduceFlights: data });
        worker.publish('Worker', 'FlightsByHours.Ws.Sync', data)
      })
    })
  });

  worker.subscribe('Page.FlightAdjustment.Stop',()=>{
    flightAdjustmentStop(worker);
  });
}