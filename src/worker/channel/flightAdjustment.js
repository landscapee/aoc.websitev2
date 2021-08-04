import {flightAdjustmentStart, flightAdjustmentStop} from "@/worker/manage/flightAdjustment";
let worker;

export const init = (worker_) => {
  worker = worker_;
  worker.subscribe('Page.FlightAdjustment.Start',()=>{
    flightAdjustmentStart(worker);
  });

  worker.subscribe('Page.FlightAdjustment.Stop',()=>{
    flightAdjustmentStop(worker);
  });
}