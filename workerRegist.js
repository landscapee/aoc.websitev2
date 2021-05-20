import postal from 'postal';
import {get} from 'lodash';
import Fpms from 'worker-loader!./worker/process/process.js';
class workerRegist{
    constructor(){}
    start(){
        this.worker = new Fpms();
        const channel = postal.channel("Worker");
        channel.subscribe('#', (data, envelope) => {
            this.worker.postMessage({
                channel: get(envelope, 'channel'),
                topic: get(envelope, 'topic'),
                data: get(envelope, 'data')
            });
        })
        this.worker.onmessage = (event) => {
            postal.publish({
                channel: get(event, 'data.channel'),
                topic: get(event, 'data.topic'),
                data: get(event, 'data.data')
            })
        }
    }
};
export default workerRegist;
