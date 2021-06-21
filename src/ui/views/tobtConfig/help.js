export const calTypeConfig = {
    original: '始发航班',
    overStation: '过站航班',
};

export const flowTypeConfig = {
    CRS: '西南区域流控',
    CDM: '本场流控',
};
export const tableConfig = [
    {
        type: 'index',
        width: '20px',label: '序号',
        key:'ind'
    },
    {
        width: '50px',type: 'slot',key: 'associatedAirport',
        label: '机场',
    },
    {
        width: '50px',type: 'simple',key: 'timeRangeStart',
        label: '开始时段',
    },
    {
        width: '50px',type: 'simple',key: 'timeRangeEnd',
        label: '结束时段',

    },
    {
        width: '50px',type: 'simple',key: 'calType',
        label: '计算类型',
        display:(row)=>calTypeConfig[row.calType]||'--'
    },
    {
        width: '50px',type: 'simple',key: 'flowType',
        label: '流控类型',
        display:(row)=>flowTypeConfig[row.flowType]||'--'
    },
    {
        width: '50px',type: 'simple',key: 'calValue',
        label: '值',
    },
    {
        width: '30px',type: 'slot',key: 'operation',
        label: '操作',
    },
]