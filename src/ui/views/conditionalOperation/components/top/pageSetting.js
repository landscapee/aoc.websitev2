// 低能见运行
export const runningNewObj=[
    { name: '', key: '', icon: '', deal: 'runningNew0', style: { background: '#3280e7' } },
    { name: '备降外场',click:'alternateLanding', key: 'weatherStat.alternateLanding',unit:'架次', icon: 'bjwc', class:'cursor',style: { background: '#32c8e7' } },
    { name: '取消航班',click:'cancelOpen', key: 'weatherStat.cancel', icon: 'qxhb', unit:'架次', class:'cursor',style: { background: '#24ca87' } },
    { name: '预测积压情况', key: 'estimatedBacklog', icon: 'yjjyqk',  unit:'架次',style: { background: '#5d9d52' } },
    {
        name: '',
        key: 'flightIndicator',
        icon: 'hbzbyc',
        deal: 'runningNew4',
        style: { background: '#5f3fb0' },
    },
    {
        name: '最近一次跑道使用间隔',
        key: 'indicator.spaceIndicator.space',
        icon: 'zjycpdsyjg',
        unit:'架次',
        style: { background: '#8f35aa' },
    },
];
// 气象灾害
export const weatherNewObj=[
    { name: '', key: '', icon: '', deal: 'weather0',classBox:'weather0',  style: { background: '#3280e7' } },
    { name: '备降外场',click:'alternateLanding', key: 'weatherStat.alternateLanding',unit:'架次', icon: 'bjwc', class:'cursor',style: { background: '#32c8e7' } },
    { name: '取消航班',click:'cancelOpen', key: 'weatherStat.cancel', icon: 'qxhb', unit:'架次', class:'cursor',style: { background: '#24ca87' } },
    { name: '预测积压情况', key: 'estimatedBacklog', icon: 'yjjyqk',  unit:'架次',style: { background: '#5d9d52' } },
    {
        name: '',
        key: 'flightIndicator',
        icon: 'hbzbyc',
        deal: 'runningNew4',
        style: { background: '#5f3fb0' },
    },
    {
        name: '最近一次跑道使用间隔',
        key: 'indicator.spaceIndicator.space',
        icon: 'zjycpdsyjg',
        unit:'架次',
        style: { background: '#8f35aa' },
    },
];
// 大面积延误
export const delayNewObj=[
    { name: '', key: '', icon: '', deal: 'weather0', style: { background: '#3280e7' } },
    { name: '备降外场',click:'alternateLanding', key: 'weatherStat.alternateLanding',unit:'架次', icon: 'bjwc', class:'cursor',style: { background: '#32c8e7' } },
    { name: '取消航班',click:'cancelOpen', key: 'weatherStat.cancel', icon: 'qxhb', unit:'架次', class:'cursor',style: { background: '#24ca87' } },
    { name: '预测积压情况', key: 'estimatedBacklog', icon: 'yjjyqk',  unit:'架次',style: { background: '#5d9d52' } },
    {
        name: '',
        key: 'flightIndicator',
        icon: 'hbzbyc',
        deal: 'runningNew4',
        style: { background: '#5f3fb0' },
    },
    {
        name: '出港旅客数量指标',
        key: 'indicator.spaceIndicator.space',
        icon: 'lgsl',
        unit:'人',
        style: { background: '#783bbd' },
    }, {
        name: '最近一次跑道使用间隔',
        key: 'indicator.spaceIndicator.space',
        icon: 'zjycpdsyjg',
        unit:'架次',
        style: { background: '#8f35aa' },
    },
];
export default{runningNewObj,weatherNewObj,delayNewObj}