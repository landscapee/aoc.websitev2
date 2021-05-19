import postal from 'postal';
import {get} from 'lodash';
import '../manage/manage';

const channel = postal.channel('web.aoc')
channel.subscribe('#', (data, envelope) => {
    self.postMessage({
        channel: get(envelope, 'channel'),
        topic: get(envelope, 'topic'),
        data: get(envelope, 'data', [])
    });
});

self.onmessage = (event) => {
    postal.publish({
        channel: get(event, 'data.channel'),
        topic: get(event, 'data.topic'),
        data: get(event, 'data.data')
    });
};