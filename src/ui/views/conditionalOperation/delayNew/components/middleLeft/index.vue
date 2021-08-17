<template>
	<div class="middleLeftIndex">
		<div class="flightStatus">
			<div class="flightStatusItem" v-for="opt in pageObj" :key="opt.key">
				<icon-svg :iconClass="opt.icon"></icon-svg>
				<div class="rightContent">
					<div class="first fo">{{getData(opt.key)}} <span>架次</span></div>
					<div class="second">{{opt.name}}</div>
				</div>
			</div>
		</div>
		<div class="warnRunway item">
			<MDRSWarning></MDRSWarning>
			<Runway></Runway>
		</div>
	</div>
</template>

<script>
     import PostalStore from "@ui_lib/postalStore";
    let postalStore = new PostalStore();
    import Runway from '../../../components/runway'
    import MDRSWarning from '../../../components/MDRSWarning'

    export default {
        name: "index",
        components: {Runway, MDRSWarning},
        data() {
            return {
                pageObj: [
                    {name: '未登机', icon: 'weidengji', key: 'boardingFlight'},
                    {name: '已登机', icon: 'yidengji', key: 'boardingNotCloseDoor'},
                    {name: '已关舱', icon: 'guancangmen', key: 'closeDoor'},
                    {name: '推出滑行', icon: 'tchx', key: 'launchTaxiing'},
                ],
                boardingSts: {

				},//登机统计
            }
        },
        computed: {
            getData() {
                return (key) => {
                    let data = this.boardingSts[key]
                    return data === 0 ? data : data || '--'
                }
            }
        },
        methods: {},
        created() {
        },
		mounted(){
            postalStore.sub('page.delayNewLeft.data', ({data}) => {
				this.boardingSts=data
                console.log(data,1111);
            });
		},
    }
</script>

<style lang="scss" scoped>
	.middleLeftIndex {
		width: 100%;
		height: 100%;
		display: flex;
		color: #fff;
		.flightStatus {
			width: 175px;
			margin-right: 12px;
			flex: 1 1 auto;
			padding: 4px 12px 12px 12px;
			background: rgba(25, 37, 60, 0.81);
			border-radius: 5px;

			.flightStatusItem {
				height: 25%;
				padding: 12px 0 5px 0;
				display: flex;
				align-items: center;
				border-bottom: 1px #111926 solid;
				.rightContent {
					line-height: 20px;
				}
				svg {
					width: 46px;
					height: 46px;
					margin-right: 12px;
				}
				.first {
					font-size: 22px;
					span {
						font-size: 12px;
						color: rgba(255, 255, 255, 0.51);
					}
				}
				.second {
					color: rgba(255, 255, 255, 0.62);
				}
			}
		}
		.warnRunway {

			width: calc(100% - 187px);
			flex: 1 1 auto;
			height: 100%;
			display: flex;
			flex-direction: column;
			& > div {
				border-radius: 5px;
				height: calc(50% - 7px);
				background: rgba(25, 37, 60, 0.8);
			}
			& > div:nth-child(2) {
				margin-top: 14px;
			}
		}
	}
</style>