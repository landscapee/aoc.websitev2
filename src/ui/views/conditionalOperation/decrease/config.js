import { map, get, filter, some } from 'lodash';
import React from 'react';
import classNames from 'classnames';
import Input from '../../../shares/input';

export const decreaseColunm = [
	{
		key: 'adjust',
		title: '调时/调减',
	},
	{
		key: 'total',
		title: '总数',
	},
	{
		key: 'CA',
		title: '国航',
	},
	{
		key: '3U',
		title: '川航',
	},
	{
		key: 'MU',
		title: '东航',
	},
	{
		key: 'CZ',
		title: '南航',
	},
	{
		key: 'EU',
		title: '成航',
	},
	{
		key: '8L',
		title: '祥鹏',
	},
	// {
	// 	key: 'other',
	// 	title: '其他',
	// },
];

export const recommendColumn = [
	{
		key: 'airline',
		title: '航司',
	},
	{
		key: 'R',
		title: '计划调减',
		custom: (row, ctx) => {
			if (ctx.state.currentInput === 'reduceNum' + row.airline) {
				return <Input onBlur={(e) => ctx.editPlan(e, 'totalPlanReduce', row)} name="editValue" value={ctx.state.editValue} onChange={ctx.onInputChange} className="default-input  table-input h-50" />;
			}
			return (
				<div
					onClick={() => {
						if (row.airline === '全部' || row.sendType !== 0) {
							return;
						}
						ctx.setState({ editValue: row.R });
						ctx.tdClick('reduceNum', row);
					}}>
					{row.R}
				</div>
			);
		},
	},
	{
		key: 'A',
		title: '计划调时',
		custom: (row, ctx) => {
			if (ctx.state.currentInput === 'exchangeNum' + row.airline) {
				return <Input onBlur={(e) => ctx.editPlan(e, 'totalPlanAdjust', row)} name="editValue" value={ctx.state.editValue} onChange={ctx.onInputChange} className="default-input table-input h-50" />;
			}
			return (
				<div
					onClick={() => {
						if (row.airline === '全部' || row.sendType !== 0) {
							return;
						}
						ctx.setState({ editValue: row.A });
						ctx.tdClick('exchangeNum', row);
					}}>
					{row.A}
				</div>
			);
		},
	},
	{
		key: '3u',
		title: '操作',
		custom: (row, ctx) => {
			let hasFinish = get(ctx, 'state.currentReduce.reduceInfo.status') == 1;
			let isTotalClickAble = some(ctx.state.suggestForEdit, (item) => item.sendType == '0' && item.airline !== '全部');
			isTotalClickAble = isTotalClickAble && row.airline === '全部';
			if (isTotalClickAble) {
				row.sendType = 0;
			} else if (row.airline === '全部') {
				row.sendType = 1;
			}
			return (
				<div className="d-flex justify-content-around">
					<span
						onClick={() => {
							let options;
							if (hasFinish || row.sendType != 0) {
								return;
							}
							if (row.airline === '全部') {
								options = filter(
									map(ctx.state.suggestForEdit, (item) => {
										if (item.sendType == 0) {
											return item.id;
										}
									}),
									(current) => current,
								);
							} else {
								options = [row.id];
							}
							ctx.setState({ selectedReduce: options, confirmShow: true, modalContent: '确认发送调时调减计划到航司?' });
						}}
						// sendType 0:未发送 1:已发送给航司 2:航司已发给指挥室
						className={classNames('iconfont icon-fasong ', { disabled: hasFinish || row.sendType != 0, pointer: !hasFinish && row.sendType == 0 })}
					/>
					{/*<span className={classNames('iconfont icon-xiaoxi1')} />*/}
				</div>
			);
		},
	},
];

export let airlineColumn = [
	{
		key: 'flightIndex',
		title: '序号',
		font: 'font-One',
		width: '5rem',
	},
	{
		key: 'flightNo',
		title: '航班号',
		width: '7rem',
	},
	{
		key: 'sta-std',
		title: '计划时间',
		width: '7rem',
	},
	{
		key: 'airlineCnName',
		title: '航司',
	},
	{
		key: 'flightType',
		title: '航班类型',
		width: '5rem',
	},
	{
		key: 'routes',
		title: '航线',
		width: '16rem',
		custom: (row) => {
			return row.displayRouter && row.displayRouter.join('→');
		},
	},
	{
		key: 'flightIndicator',
		title: '国际性质',
		width: '7rem',
	},
	// {
	// 	key: 'adjust',
	// 	title: '调时/调减',
	// },
];
