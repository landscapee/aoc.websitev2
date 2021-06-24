/***************************拆分server 测试环境********************************/
// let locationHost = '173.101.1.30'; // 双流测试
// let locationHost = location.hostname;
// let port = process.env.ENVIROMENT === 'test' ? '6080' : '6070';
// console.log('env', process.env.ENVIROMENT);
let locationHost = '173.101.1.30';
// let port = location.port;
let port = 6075;
// let port = '6075'; // 双流测试
// let locationHost = '173.100.1.133';
let serverPreset = 'api/';
// let serverPreset = '';

export const servers = [
    {
        name: 'Flight', //航班动态
        host: locationHost,
        port: port,
        channel: serverPreset + 'flight/endpointWisely',
    },
    {
        name: 'Situation', //监控池子+首页
        host: locationHost,
        port: port,
        channel: serverPreset + 'situation/endpointWisely',
    },
    {
        name: 'Delays', //大面积延误
        host: locationHost,
        port: port,
        channel: serverPreset + 'delays/endpointWisely',
    },
    {
        name: 'RunwayWeather', //跑道天气
        host: locationHost,
        port: port,
        channel: serverPreset + 'runwayweather/endpointWisely',
    },
    {
        name: 'MSG',
        host: locationHost,
        port: port,
        channel: serverPreset + 'notice/endpointWisely',
    },
    {
        name: 'Adverse',
        host: locationHost,
        port: port,
        channel: serverPreset + 'adverse-condition/endpointWisely',
    },
    {
        name: 'Resource',
        host: locationHost,
        port: port,
        channel: serverPreset + 'resource/endpointWisely',
    },
];

export const httpConfig = {
    flight: {
        host: locationHost,
        port: port,
        path: serverPreset + 'flight',
    },
    situation: {
        host: locationHost,
        port: port,
        path: serverPreset + 'situation',
    },
    delays: {
        host: locationHost,
        port: port,
        path: serverPreset + 'delays',
    },
    milestone: {
        host: locationHost,
        port: port,
        path: serverPreset + 'milestone',
    },
    other: {
        host: locationHost,
        port: port,
        path: serverPreset + 'milestone/operation/report',
    },
    weatherTips: {
        host: locationHost,
        port: port,
        path: serverPreset + 'weather',
    },
    login: {
        host: locationHost,
        port: port,
        path: 'api-login/sso/login',
    },
    msg: {
        host: locationHost,
        port: port,
        path: serverPreset + 'notice',
    },
    statistics: {
        host: locationHost,
        port: port,
        path: serverPreset + 'statistics',
    },
    adverse: {
        host: locationHost,
        port: port,
        path: serverPreset + 'adverse-condition',
    },
};
