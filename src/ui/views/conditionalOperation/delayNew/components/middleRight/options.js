import {map, get} from 'lodash'

export const optionsPie = (mySeriesData) =>{
    let seriesData = [
        {
            name: '值机人数',
            value: '21',
        },
        {
            name: '安检人数',
            value: '11',
        },
        {
            name: '登机人数',
            value: '14',
        },
    ];
    let colorList = ['#24ca87', '#9964ff', '#0566ff'];
    let option = {

        tooltip: {
            trigger: 'item',
            borderColor: 'rgba(255,255,255,.3)',
            backgroundColor: 'rgba(13,5,30,.6)',
            borderWidth: 1,
            padding: 5,
            formatter: function(parms) {
                let str = parms.marker + '' + parms.data.name + '</br>' + '数量：' + parms.data.value + '人</br>' + '占比：' + parms.percent + '%';
                return str;
            },
        },

        series: [
            {
                type: 'pie',
                z: 3,
                // center: ['62%', '50%'],
                radius: ['45%', '60%'],
                clockwise: true,
                avoidLabelOverlap: true,
                hoverOffset: 15,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            return colorList[params.dataIndex];
                        },
                    },
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{a|{b}\n{d}%}',
                    padding: [20, 10, 0, 0],
                    rich: {

                        a: {
                            color: '#fff',
                            padding: [20, -80, 0, -80],
                        },
                    },
                },
                labelLine: {
                    normal: {
                        length: 30,
                        length2: 60,
                        lineStyle: {
                            width: 1,
                        },
                    },
                },
                data: mySeriesData || seriesData,
            },
        ],
    };
    return option;
}
