// 航班调整调减
export const columns = [
    {
        key: 'airline',
        label: '航司',width:'45px',
    },
    {
        key: 'R',
        label: '计划/实际调减',
        display: ({row}) => {
            return row.A + '/' + row.actualA;
        },
    },
    {
        key: 'A',
        label: '计划/实际调整',
        display: ({row}) => {
            return row.R + '/' + row.actualR;
        },
    },
];
// 恢复阶段运行决策
export const columnsRunDecision = [
    {
        key: "flightNo",
        label: "航司",width:'50px'
    },
    {
        slot: "staStd",
        label: "计划时间"

    },
    {
        slot: "displayRouter",
        label: "航线"

    },
    {
        key: "flightStatusText",
        label: "运营状态",width:'60px'
    }
];

