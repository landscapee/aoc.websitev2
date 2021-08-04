<template>
	<div class="box" :class="dialogFormVisible?'':'display'">
		<div class="title">
			<div class="titleLeft" >
				<div class="shuxian"></div>
				<div class="text">{{title}} </div>
			</div>
			<span @click="close" class="positionright cursor  ">×</span>
		</div>
		<div class="content">
			<ele-table :columnConfig="tableConfig" :table-data="data ">

			</ele-table>
		</div>


	</div>
</template>

<script>
    import {map } from 'lodash'
    import {popColumnObj} from './help'
    export default {
        name: "warning",
        data() {
            return {
                title:'',
                data:[],
                tableConfig:[],
                dialogFormVisible: false,
            }
        },
        methods: {

            close() {

                this.data='';
                this.title='';
                this.tableConfig=[];
                this.data=[];
                this.dialogFormVisible = false
            },
            open(title,key,type,hour) {

                this.title=title
                this.tableConfig=popColumnObj[key]||[]
                this.dialogFormVisible = true
				let obj={type}

                if(key!=='flightDelay'){
                    obj={type,hour}
				}
                console.log(key,obj);
                this.$request.get('adverse', 'delay/detailList', obj, false).then((res) => {
                    console.log(11,res);
                    this.data=res.data||[]
                })
            },
        },

    }
</script>
<style lang="scss" scoped>

.display{
	display: none!important;
}

	.box {
		width: 550px;
		background: #25395c;
		border-radius: 4px;
		display: block;
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 100;
		transform: translate(-50%, -50%);
		span {
			color: #fff
		}
		.title {
			position: relative;
			display: flex;
			justify-content: space-between;
			padding: 7px 30px 0 15px;
			.titleLeft {
				font-size: 14px;
				display: flex;
				align-items: center;
				.shuxian {
					width: 4px;
					height: 14px;
					background: #0566ff;
					border-radius: 1px;
				}
				.text {
					margin: 0 12px 0 8px;
				}

			}
			.right {


			}
			.positionright {
				height: 30px;
				width: 30px;
				background: #9e9e9e;
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				right: -8px;
				top: -8px;
				font-size: 24px;
				color: #25395c;
				border-radius: 100%;
			}
			.positionright:hover{
				background: #fff;
			}

		}
		.content {
			padding: 10px 15px;
			overflow-y: auto;
			color: #fff;
			height: 400px;
			width: 100%;

		}
	}




</style>


