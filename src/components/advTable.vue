<template>
    <div class="adv-table-container" :class="[relative?'adv-table_relative':'adv-table_absolute']" ref="advTableContainer" v-if="!resize">
        <div class="adv-table_main-container">
            <div class="adv-table_tool-container" v-if="toolbar"></div>
            <div class="adv-table_header-container" ref='advTabHeaderContainer' v-if="headerSwitch" :style="{transform:`translateX(${-offset[0] || 0}%)`}">
                <table border="0" cellspacing="0" cellpadding="0" ref="tabHeader" :style="{minWidth:`${scrollConfig && scrollConfig[0] == true?'':'100%'}`}">
                    <tr>
                        <th v-for="(hcell,i) in columns" :key="i"  :style="thCellStyle(hcell)">
                            <div v-if="hcell.toggle ? hcell.toggle($route, outParams) : true" class="adv-header-col">
                                <div v-if="hcell.type == 'selection'" class="selection-cell">
                                    <div class="selection-box" @click="handleSelectionCheckAll(columns)" v-if="!outParams.headerSelectionHide">
                                        <span :class="headerSelectionClass()"></span>
                                    </div>
                                </div>
                                <label v-else> {{hcell.label}} </label>
                            </div>
                        </th>
                    </tr>
                </table>
            </div>
            <div class="adv-table_search-container" ref='advTabSearchContainer' v-if="searchSwitch">
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <th v-for="(hcell,i) in columns" :key="i" :style="thCellStyle(hcell)">
                            <div class="adv-header-col" v-if="(hcell.toggle ? hcell.toggle($route, outParams) : true) && hcell.search">
                                <el-select v-model="hcell.search.value" placeholder="请选择" v-if="hcell.search.type == 'select'" clearable @change="e => handleDebounceSearchChange(e, hcell)">
                                    <el-option
                                            v-for="item in hcell.search.options()"
                                            :key="item.key"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                                <input v-else type="text" :placeholder="hcell.search.placeholder" @input="e => handleDebounceSearchChange(e, hcell)" @keydown.enter="e => handleSearchChange(e, hcell)"/>
                            </div>
                        </th>
                    </tr>
                </table>
            </div>
            <div class="adv-table_body-container" v-if="!relative" ref="tab_cur">
                <ScrollBox :scroll-config="[scrollConfig[0], scrollConfig[1]]" :s-width="scrollWidth()" :resize="resizeScroll" :loaded="loaded" @handlePageLoad="handlePageLoad" @handleXThumbOffset="handleXThumbOffset" >
                    <table border="0" cellspacing="0" cellpadding="0">
                        <template v-for="(row, ri) in tabData">
                                <tr v-if="rowSwitch(row, ri)"
                                    :ref="`row_${ri}`"
                                    @click="handlerRowClick($event, row, ri)"
                                    @dblclick="handledblClick(ri, row, $event)"
                                    @mouseover="hoverRowNumber = ri"
                                    :class="rowClassExtend(row, ri)"
                                    :style="rowStyleExtend(row, ri)">
                                    <td v-for="(col, ci) in columns"  :style="tdColStyle(col, row)" :ref="`${row.id}_${ci}`" :key="ci">
                                        <el-tooltip v-if="dynamicDisplay(row, ci) && col.toggle ? col.toggle($route, outParams) : true" :content="col.tip?col.tip(row):''" placement="top" :disabled="!(col.tip && col.tip(row))" transition="none" :open-delay="300">
                                            <div class="adv-body-col" :data-px="ci" :data-py="ri" :class="editPointClass(ci, ri)" @click="handlePointSet(row, col, ci, ri)" :title="col.tip?col.tip(row):''">
                                                <span v-if="col.type == 'index'" :style="{color:'#426c86'}"> {{ ri + 1 }} </span>
                                                <span v-if="col.type == 'simple'" class="cell-simple" :style="col.wordStyle ? col.wordStyle(row, outParams):{}" >
                                                    <template v-if="col.simpleContent">
                                                        <div style="display:flex;flex-flow:row;align-items: center;justify-content: space-between;padding:0 10px;">
                                                            <span>
                                                            <label v-for="(lab, labi) in col.simpleContent(row, col, ri)" :key="labi">
                                                                <label :style="lab.flag?{color:'red'}:{}">{{lab.txt}}</label><label v-if="!lab.end">,</label>
                                                            </label>&emsp;
                                                            </span>
                                                            <i class="fa fa-file-text"
                                                                v-if="syncSimpleContentIcon(row, col, ri)"
                                                                style="color:#3190f5;cursor:pointer;"
                                                                @click="handleInnerBtnClick(ri, row, $event, col)"
                                                                ></i>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        {{ syncDisplay(row, col, ri)}}
                                                    </template>
                                                </span>
                                                <span v-if="col.type == 'waybillCode'" class="text-link" :style="col.wordStyle ? col.wordStyle(row, outParams):{}" @click.stop="waybillDetailShow(row, col.wid,)"> {{ syncDisplay(row, col, ri)}} </span>

                                                <div v-if="col.type == 'selection'" class="selection-cell">
                                                    <div class="selection-box" @click.stop="handleSelectionCheckItem(row)"  v-if="col.switch?col.switch(row, outParams):true">
                                                        <span v-if="selectionItems[row.id]" class="selection-chk"></span>
                                                    </div>
                                                    <label v-else>{{col.display ? col.display(row) : ''}}, {{ri}}, {{outParams}}</label>
                                                </div>
                                                <div v-if="col.type == 'slot'">
                                                    <slot :name='col.key' :row="row" :index='ri'></slot>
                                                </div>
                                                <div v-if="col.type == 'switch'">
                                                    <el-switch
                                                            v-if="col.switch?col.switch(row, outParams):true"
                                                            v-model="row[col.key]"
                                                            active-color="#13ce66"
                                                            inactive-color="#ff4949"
                                                            @change="handleSwitchCheckedChange(row, col.key)"
                                                            :disabled="col.disabled?col.disabled(row, outParams):false"
                                                    >
                                                    </el-switch>
                                                </div>
                                                <template v-if="col.type == 'edit'">
                                                    <div class="edit-cell" @dblclick="handleToggleCellEditStatus(row, col, ri, ci,true)">
                                                        <template v-if="col.editConfig && col.editConfig.type == 'input'">
                                                            <input v-if="col.editConfig.switch(row, outParams, ri, ci, handlePoint, tabData)"
                                                                v-model="row[col.key]"
                                                                @keydown="handleEditCellKeyDown(row, col, ri, ci, col.key)"
                                                                @keydown.enter="e => handleEditCellEnter(row, ri, col.key)"
                                                                @blur="handleEditCellBlur(row, col, ri, ci, col.key)"
                                                                :style="inputStyleExtend(row, col, ri, ci)"
                                                                :disabled="col.editConfig.disabled && col.editConfig.disabled(row, outParams)"
                                                            />
                                                            <template v-else>
                                                                <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                            </template>
                                                        </template>

                                                        <template v-if="col.editConfig && col.editConfig.type == 'textarea'">
                                                            <el-input type="textarea" autosize v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)"
                                                                    v-model="row[col.key]"
                                                                    @keydown="handleEditCellKeyDown(row, col, ri, ci)"
                                                                    @blur="handleEditCellInput(row, ri, col.key)"
                                                                    :style="inputStyleExtend(row, col, ri, ci)"
                                                            />
                                                            <template v-else>
                                                                <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                            </template>
                                                        </template>

                                                        <template v-if="col.editConfig && col.editConfig.type == 'commodity'">
                                                            <template v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)">
                                                                <commodityName slot="commodityName"
                                                                            :outlet="col.editConfig.outlet"
                                                                            :commodity-names="row.commodityNameJson"
                                                                            :airline-code="outParams.airlineCode"
                                                                            @handleSyncSpecialCode="(code, ids) => handleSyncSpecialCode(code, ids, row)"
                                                                            @handleCommodityNameChange="d => handleCommodityNameChange(d, row)"
                                                                >
                                                                    <!-- @handleTab="handleTab" -->
                                                                </commodityName>
                                                            </template>
                                                            <template v-else>
                                                                <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                            </template>
                                                        </template>

                                                        <template v-if="col.editConfig && col.editConfig.type == 'forwarder'">
                                                            <template v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)">
                                                                <forwarderComponent
                                                                        :freightCode="row.freightCode"
                                                                        @syncConsignee="consignee => handleSyncConsignee(consignee, row)"
                                                                        @handleFreightCodeChange="code => handleFreightCodeChange(code, row)"
                                                                ></forwarderComponent>
                                                            </template>
                                                            <template v-else>
                                                                <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                            </template>
                                                        </template>

                                                        <template v-if="col.editConfig && col.editConfig.type == 'checkbox'">
                                                            <template v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)">
                                                                <el-checkbox :ref="`select_${col.key}_${ri}`" v-model="row[col.key]"></el-checkbox>
                                                            </template>
                                                            <template v-else>
                                                                <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                            </template>
                                                        </template>

                                                        <template v-if="col.editConfig && col.editConfig.type == 'select'">
                                                            <template v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)">
                                                                <el-select :ref="`select_${col.key}_${ri}`"
                                                                        :multiple="col.editConfig.multiple || false"
                                                                        filterable
                                                                        v-model="row[col.key]"
                                                                        placeholder="请选择"
                                                                        @blur="handleEditSelectBlur($event, `select_${col.key}_${ri}`)"
                                                                        @change="v => col.editConfig.handleChange(v, row, outParams)"
                                                                >
                                                                    <el-option
                                                                            v-for="item in col.editConfig.options(row, outParams)"
                                                                            :key="item.value"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                    </el-option>
                                                                </el-select>
                                                            </template>
                                                            <template v-else>
                                                                <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                            </template>
                                                        </template>
                                                    </div>
                                                </template>
                                                <template v-if="col.switch ? col.switch(row, params) : true && col.type == 'operate'" >
                                                    <div v-for="(operate, ind) in col.operates" :key="ind" class="operate-cell" >
                                                        <div v-if="operate.switch ? operate.switch(row, params) : true">
                                                            <template v-if="operate.type == 'button' || typeof(operate.type) == 'function' && operate.type(row) == 'button'">
                                                                <span class="badge-item" v-if="operate.badge && operate.badge(row)">{{operate.badge(row)}}</span>
                                                                <el-button
                                                                    size="mini"
                                                                    :type="operateType(operate, row, params)"
                                                                    :plain="operate.config && operate.config.plain"
                                                                    @click.native="handleButtonClick(ri, row, operate.event , $event, operate)"
                                                                    :disabled="operate.disabled?operate.disabled(row, outParams):false"
                                                                >
                                                                    <template v-if="operate.icon">
                                                                        <i :class="operate.icon"></i>&emsp;
                                                                    </template>
                                                                    {{ operate.display?operate.display(row):(operate.key?operate.map[row[operate.key]]:operate.value) }}
                                                                </el-button>
                                                            </template>

                                                            <div v-if="operate.type == 'icon' || typeof(operate.type) == 'function' && operate.type(row) == 'icon'"
                                                                :class="operate.noBorder?'operate-icon-noBorder':'operate-icon'" :style="operateStyleExtend(operate, row)"
                                                            >
                                                                <span class="badge-item" v-if="operate.badge && operate.badge(row)">{{operate.badge(row)}}</span>
                                                                <el-tooltip effect="dark" :enterable="false"  placement="right" :content="operate.tip" :disabled="!operate.tip">
                                                                    <i :class="typeof(operate.icon) == 'function'?operate.icon(row):operate.icon"
                                                                    @click.prevent="handleButtonClick(ri, row, operate.event, $event, operate)"
                                                                    @keydown.enter="handleButtonClick(ri, row, operate.event, $event, operate)"
                                                                    :style="iconStyleExtend(row, operate)"
                                                                    />
                                                                </el-tooltip>
                                                            </div>
                                                            <div v-if="operate.type == 'label'" @click.prevent="handleButtonClick(ri, row, operate.event, $event, operate)" >
                                                                <label :style="operateStyleExtend(operate, row)">{{operate.display?operate.display(row):operate.value}}</label>
                                                            </div>

                                                            <el-dropdown
                                                                    v-if="operate.type == 'dropDown' || typeof(operate.type) == 'function' && operate.type(row) == 'dropDown'"
                                                                    trigger="click"
                                                                    @command="(command) => {handleDropDownCommand(ri, row, command)}"
                                                            >
                                                                <el-button type="primary" size="mini" >
                                                                    {{ operate.value }}
                                                                    <i class="el-icon-arrow-down el-icon--right" />
                                                                </el-button>
                                                                <el-dropdown-menu slot="dropdown">
                                                                    <el-dropdown-item
                                                                            v-for="(item, di) in dropdownOptionsRegist(operate, row)"
                                                                            :command="item.event"
                                                                            :key="di"
                                                                    >
                                                                        <i class="" :class="item.icon" />
                                                                        <label>
                                                                            {{ item.key?item.map[row[item.key]]:item.label }}
                                                                        </label>
                                                                    </el-dropdown-item>
                                                                </el-dropdown-menu>
                                                            </el-dropdown>

                                                        </div>
                                                    </div>
                                                </template>
                                            </div>
                                        </el-tooltip>
                                    </td>
                                </tr>
                                <tr v-if="row.expand" >
                                    <td :colspan="syncColSpan(columns)" style="background-color:#f9f9f9;">
                                        <div class="adv-body-row-expand">
                                            <slot name="expand" :row="row" />
                                        </div>
                                    </td>
                                </tr>
                        </template>
                    </table>
                </ScrollBox>
            </div>
            <div class="adv-table_body-container" v-else>
                <table border="0" cellspacing="0" cellpadding="0">
                    <template v-for="(row, ri) in tabData">
                        <tr v-if="rowSwitch(row, ri)"
                            @click="handlerRowClick($event, row, ri)"
                            @dblclick="handledblClick(ri, row, $event)"
                            @mouseover="hoverRowNumber = ri"
                            :class="rowClassExtend(row, ri)"
                            :style="rowStyleExtend(row, ri)">

                            <td v-for="(col, ci) in columns"  :style="tdColStyle(col, row)" :ref="`${row.id}_${ci}`" v-if="dynamicDisplay(row, ci) && col.toggle?col.toggle($route, outParams):true">
                                <el-tooltip :content="col.tip?col.tip(row):''" placement="top" :disabled="!(col.tip && col.tip(row))" transition="none" :open-delay="300">
                                    <div class="adv-body-col" :data-px="ci" :data-py="ri" :class="editPointClass(ci, ri)" @click="handlePointSet(row, col, ci, ri)" :title="col.tip?col.tip(row):''">
                                        <span v-if="col.type == 'index'" > {{ ri + 1 }} </span>
                                        <span v-if="col.type == 'simple'"   :style="col.wordStyle ? col.wordStyle(row, outParams):{}"   class="cell-simple"> {{ syncDisplay(row, col, ri)}} </span>
                                        <span v-if="col.type == 'waybillCode'" class="text-link" :style="col.wordStyle ? col.wordStyle(row, outParams):{}" @click.stop="waybillDetailShow(row, col.wid,)">
                                        {{col.display?col.display(row, ri):(row[col.key] === 0?0:row[col.key] || (col.placeholder?col.placeholder:"－－"))}}
                                    </span>

                                        <div v-if="col.type == 'selection'" class="selection-cell">
                                            <div class="selection-box" @click.stop="handleSelectionCheckItem(row)" v-if="col.switch?col.switch(row, outParams):true">
                                                <span v-if="selectionItems[row.id]" class="selection-chk"></span>
                                            </div>
                                        </div>
                                        <div v-if="col.type == 'slot'">
                                            <slot :name='col.key' :row="row" :index='ri'></slot>
                                        </div>
                                        <div v-if="col.type == 'switch'">
                                            <el-switch v-if="col.switch?col.switch(row, outParams):true"
                                                       v-model="row[col.key]"
                                                       active-color="#13ce66"
                                                       inactive-color="#ff4949"
                                                       @change="handleSwitchCheckedChange(row, col.key)"
                                                       :disabled="col.disabled?col.disabled(row, outParms):false"
                                            >
                                            </el-switch>
                                        </div>
                                        <template v-if="col.type == 'edit'">
                                            <div class="edit-cell" @dblclick="handleToggleCellEditStatus(row, col, ri, ci, true)">
                                                <template v-if="col.editConfig && col.editConfig.type == 'input'">
                                                    <input v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)"
                                                           v-model="row[col.key]"
                                                           @keydown.enter="e => handleEditCellEnter(row, ri, col.key)"
                                                           @keydown="handleEditCellKeyDown(row, col, ri, ci)"
                                                           @blur="handleEditCellBlur(row, col, ri, ci)"
                                                           :style="inputStyleExtend(row, col, ri, ci)"
                                                           :disabled="col.editConfig.disabled && col.editConfig.disabled(row, outParams)"
                                                    />
                                                    <!--                                                    @input="handleEditCellInput(row, ri, col.key)"-->
                                                    <template v-else>
                                                        <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                    </template>
                                                </template>

                                                <template v-if="col.editConfig && col.editConfig.type == 'textarea'">
                                                    <el-input type="textarea" autosize v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)"
                                                              v-model="row[col.key]"
                                                              @blur="handleEditCellInput(row, ri, col.key)"
                                                              @keydown="handleEditCellKeyDown(row, col, ri, ci)"
                                                              :style="inputStyleExtend(row, col, ri, ci)"
                                                    />
                                                    <!--                                                    @blur="handleEditCellBlur(row, col, ri, ci)"-->
                                                    <!--                                                    @input="handleEditCellInput(row, ri, col.key)"-->
                                                    <template v-else>
                                                        <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                    </template>
                                                </template>

                                                <template  v-if="col.editConfig && col.editConfig.type == 'waybillCode'">
                                                    <template v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)">
                                                        <input
                                                                :ref="`waybillCodeFrist_${ri}`"
                                                                v-model="row.waybillCodeFirst"
                                                                type="text"
                                                                maxlength="3"
                                                                style="width:3.1rem;"
                                                                :style="handleValidatorStyleExtend(row.waybillCodeFirst, 'waybillCodeFirstSub')"
                                                                @keyup="handleWaybillFirstKeyUp($event, `waybillCodeSecond_${ri}`)"
                                                        >
                                                        <label style="margin:0 .2rem"> - </label>
                                                        <input
                                                                :ref="`waybillCodeSecond_${ri}`"
                                                                v-model="row.waybillCodeSecond"
                                                                style="width:6.14rem"
                                                                maxlength="8"
                                                                type="text"
                                                                :style="handleValidatorStyleExtend(row.waybillCodeSecond, 'waybillCodeSecondSub')"
                                                                @keyup="handleWaybillSecondKeyUp($event, `waybillCodeFrist_${ri}`)"
                                                        >
                                                    </template>
                                                    <template v-else>
                                                        <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                    </template>
                                                </template>

                                                <template v-if="col.editConfig && col.editConfig.type == 'commodity'">
                                                    <template v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)">
                                                        <commodityName slot="commodityName"
                                                                       :outlet="col.editConfig.outlet"
                                                                       :commodity-names="row.commodityNameJson"
                                                                       :airline-code="outParams.airlineCode"
                                                                       @handleSyncSpecialCode="(code, ids) => handleSyncSpecialCode(code, ids, row)"
                                                                       @handleCommodityNameChange="d => handleCommodityNameChange(d, row)"
                                                        >
                                                        </commodityName>
                                                    </template>
                                                    <template v-else>
                                                        <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                    </template>
                                                </template>

                                                <template v-if="col.editConfig && col.editConfig.type == 'forwarder'">
                                                    <template v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)">
                                                        <forwarderComponent
                                                                :freightCode="row.freightCode"
                                                                @syncConsignee="consignee => handleSyncConsignee(consignee, row)"
                                                                @handleFreightCodeChange="code => handleFreightCodeChange(code, row)"
                                                        ></forwarderComponent>
                                                    </template>
                                                    <template v-else>
                                                        <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                    </template>
                                                </template>

                                                <template v-if="col.editConfig && col.editConfig.type == 'checkbox'">
                                                    <template v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)">
                                                        <el-checkbox :ref="`select_${col.key}_${ri}`" v-model="row[col.key]"></el-checkbox>
                                                    </template>
                                                    <template v-else>
                                                        <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                    </template>
                                                </template>

                                                <template v-if="col.editConfig && col.editConfig.type == 'select'">
                                                    <template v-if="col.editConfig.switch(row, params, ri, ci, handlePoint)">
                                                        <el-select :ref="`select_${col.key}_${ri}`"
                                                                   :multiple="col.editConfig.multiple || false"
                                                                   v-model="row[col.key]"
                                                                   filterable
                                                                   placeholder="请选择"
                                                                   @blur="handleEditSelectBlur($event, `select_${col.key}_${ri}`)"
                                                                   @change="v => col.editConfig.handleChange(v, row, outParams)"
                                                        >
                                                            <el-option
                                                                    v-for="item in col.editConfig.options(row, outParams)"
                                                                    :key="item.value"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </template>
                                                    <template v-else>
                                                        <label style="text-overflow: ellipsis;white-space:normal;" class="cell-simple"> {{ syncDisplay(row, col, ri)}} </label>
                                                    </template>
                                                </template>
                                            </div>
                                        </template>
                                        <template>
                                            <div v-if="col.switch?col.switch(row, params):true && col.type == 'operate'" >
                                                <div v-if="operate.switch?operate.switch(row, params):true" v-for="(operate, ind) in col.operates" class="operate-cell" >
                                                    <el-button
                                                            v-if="operate.type == 'button' || typeof(operate.type) == 'function' && operate.type(row) == 'button'"
                                                            size="mini"
                                                            :type="operateType(operate, row, params)"
                                                            :plain="operate.config && operate.config.plain"
                                                            @click.native.stop="handleButtonClick(ri, row, operate.event, $event, operate)"
                                                            :disabled="operate.disabled?operate.disabled(row, outParams):false"
                                                    >
                                                        {{ operate.display?operate.display(row):(operate.key?operate.map[row[operate.key]]:operate.value) }}
                                                    </el-button>

                                                    <div v-if="operate.type == 'icon' || typeof(operate.type) == 'function' && operate.type(row) == 'icon'"
                                                         :class="operate.noBorder?'operate-icon-noBorder':'operate-icon'" :style="operateStyleExtend(operate, row)"
                                                    >
                                                        <el-tooltip effect="dark" :enterable="false"  placement="right" :content="operate.tip" :disabled="!operate.tip">
                                                            <i :class="typeof(operate.icon) == 'function'?operate.icon(row):operate.icon"
                                                               @click.prevent="handleButtonClick(ri, row, operate.event, $event, operate)"
                                                               @keydown.enter="handleButtonClick(ri, row, operate.event, $event, operate)"
                                                               :style="iconStyleExtend(row, operate)"/>
                                                        </el-tooltip>
                                                    </div>

                                                    <div v-if="operate.type == 'label'"
                                                         class="operate-label" :style="operateStyleExtend(operate, row)"
                                                         @click.prevent="handleButtonClick(ri, row, operate.event, $event, operate)"
                                                    >
                                                        <label>{{operate.display?operate.display(row):operate.value}}</label>
                                                    </div>
                                                    <el-dropdown
                                                            v-if="operate.type == 'dropDown' || typeof(operate.type) == 'function' && operate.type(row) == 'dropDown'"
                                                            trigger="click"
                                                            @command="(command) => {handleDropDownCommand(ri, row, command)}"
                                                    >
                                                        <el-button type="primary" size="mini" >
                                                            {{ operate.value }}
                                                            <i class="el-icon-arrow-down el-icon--right" />
                                                        </el-button>
                                                        <el-dropdown-menu slot="dropdown">
                                                            <el-dropdown-item v-for="(item, di) in dropdownOptionsRegist(operate, row)" :command="item.event" :key="di">
                                                                <i class="" :class="item.icon" />
                                                                <label> {{ item.key?item.map[row[item.key]]:item.label }} </label>
                                                            </el-dropdown-item>
                                                        </el-dropdown-menu>
                                                    </el-dropdown>
                                                </div>
                                            </div>

                                        </template>
                                    </div>
                                </el-tooltip>
                            </td>
                        </tr>
                        <tr v-if="row.expand" >
                            <td :colspan="columns.length">
                                <div class="adv-body-row-expand">
                                    <slot name="expand" :row="row" />
                                </div>
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
            <div class="adv-table_edit-container" ref='advTabEditContainer' v-if="editLine" :style="relative?{}:{boxShadow: '0 -0.07143rem 0.41629rem #adabab', border: 'solid 0.07143rem #b7b7b7'}">
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr :style="editRowStyleExtend">
                        <template v-for="(hcell, hi) in columns">
                            <td v-if="hcell.edit && hcell.toggle?hcell.toggle($route, outParams):true" :style="tdColStyle(hcell, editRowBind)">
                                <div class="adv-header-col p-cell" v-if="hcell.edit" :data-px="hi" :data-py="-1" :style="editPointStyle(hi, -1)" :class="editPointClass(hi, -1)"  @click="handlePointSet(editRowBind, hcell, hi, -1)">
                                    <label v-if="hcell.edit.type == 'simple'">
                                        {{hcell.edit.display?hcell.edit.display(editRowBind):(editRowBind[hcell.key] || '－－')}}
                                    </label>

                                    <input v-if="hcell.edit.type == 'input'"
                                        :ref="`editItem_${hcell.key}`"
                                        class="edit_input" v-model="editRowBind[hcell.key]"
                                        type="text"
                                        :disabled="hcell.edit.disabled ? hcell.edit.disabled(editRowBind) : false"
                                        :style="handleValidatorStyleExtend(editRowBind[hcell.key], hcell.edit.validator)"
                                        @input="e => handleEditValueChange(e, hcell)"
                                        @keydown.native="e => handleEditKeyDown(e, hcell)"
                                        :placeholder="hcell.placeholder"
                                    />
                                    <!--                        size="mini"-->

                                    <el-select v-if="hcell.edit.type == 'select'"
                                            :ref="`editItem_${hcell.key}`"
                                            :multiple="hcell.edit.multiple || false"
                                            v-model="editRowBind[hcell.key]"
                                            filterable
                                            placeholder="请选择"
                                            @blur="handleEditSelectBlur($event, `editItem_${hcell.key}`)"
                                            @change="v => hcell.edit.handleChange(v, editRowBind, outParams)"
                                            :popper-class="syncSelectDropdownClass(-1, hi, hcell.edit.options(editRowBind, outParams))"
                                            @focus="handlePointSet(editRowBind, hcell, hi, -1)"
                                    >
                                        <el-option
                                                v-for="item in hcell.edit.options(editRowBind, outParams)"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>

                                    <el-button v-if="hcell.edit.type == 'button'" size="mini" @click.native="handleEditButtonClick($event, hcell)"> {{ hcell.edit.value }} </el-button>
                                    <template v-if="hcell.edit.type == 'operate'" >
                                        <div v-for="(operate, ind) in hcell.edit.operates" class="operate-cell" :key="ind">
                                            <div  v-if="operate.switch ? operate.switch(editRowBind, params) : true">
                                                <el-button
                                                        v-if="operate.type == 'button'"
                                                        size="mini"
                                                        :type="operateType(operate, editRowBind, params)"
                                                        @click.prevent="handleEditOperateClick(operate.event, hcell, editRowBind)"
                                                        :disabled="operate.disabled?operate.disabled(editRowBind, params):false"
                                                >
                                                    {{ operate.display?operate.display(editRowBind):(operate.key?operate.map[editRowBind[operate.key]]:operate.value) }}
                                                </el-button>

                                                <div v-if="operate.type == 'icon' || typeof(operate.type) == 'function' && operate.type(editRowBind) == 'icon'"
                                                    class="operate-icon" :style="operateStyleExtend(operate, editRowBind)"
                                                    @click.prevent="handleEditOperateClick(operate.event, hcell, editRowBind)"
                                                >
                                                    <!--                                                @click.prevent="handleEditButtonClick($event, hcell)"-->
                                                    <el-tooltip effect="dark" :enterable="false"  placement="right" :content="operate.tip" :disabled="!operate.tip">
                                                        <i :class="typeof(operate.icon) == 'function'?operate.icon(editRowBind):operate.icon"
                                                        :style="iconStyleExtend(editRowBind, operate)"/>
                                                    </el-tooltip>
                                                </div>
                                                <div v-if="operate.type == 'label'" @click.prevent="handleEditButtonClick($event, hcell)" >
                                                    <label :style="operateStyleExtend(operate, editRowBind)">{{operate.display?operate.display(editRowBind):operate.value}}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </template>


                                    <template v-if="hcell.edit.type == 'waybillCode'">
                                        <input
                                                ref="editWaybillCodeFirst"
                                                v-model="editRowBind.waybillCodeFirst"
                                                type="text"
                                                maxlength="3"
                                                @focus="handleWaybillFirstFocus($event, 'editWaybillCodeSecond')"
                                                @keydown="handleWaybillFirstKeyDown"
                                                @keyup="handleWaybillFirstKeyUp($event, 'editWaybillCodeSecond')"
                                                style="width:3.1rem;"
                                                :style="handleValidatorStyleExtend(editRowBind.waybillCodeFirst, 'waybillCodeFirstSub')"
                                        >
                                        <label style="margin:0 .2rem"> - </label>
                                        <input
                                                ref="editWaybillCodeSecond"
                                                v-model="editRowBind.waybillCodeSecond"
                                                style="width:6.14rem"
                                                maxlength="8"
                                                type="text"
                                                @keyup="handleWaybillSecondKeyUp($event, 'editWaybillCodeFirst')"
                                                @keydown="handleWaybillSecondKeyDown"
                                                :style="handleValidatorStyleExtend(editRowBind.waybillCodeSecond, 'waybillCodeSecondSub')"
                                        >
                                    </template>

                                    <template v-if="hcell.edit.type == 'commodity'">
                                        <commodityName slot="commodityName"
                                                    :outlet="hcell.edit.outlet"
                                                    :type="hcell.edit.cargoType"
                                                    :commodity-names="editRowBind.commodityNameJson"
                                                    :airline-code="outParams.airlineCode"
                                                    @handleSyncSpecialCode="(code, ids) => handleSyncSpecialCode(code, ids, editRowBind)"
                                                    @handleCommodityNameChange="d => handleCommodityNameChange(d, editRowBind)"
                                                    @handleSetShortcutTablePoint="handlePointSet(editRowBind, hcell, hi, -1)"
                                        >
                                            <!--                                            @handleTab="handleFocusElement(9)"-->
                                            <!-- @handleTab="handleTab" -->
                                        </commodityName>
                                    </template>

                                    <template v-if="hcell.edit.type == 'forwarder'">
                                        <forwarderComponent
                                                :freightCode="editRowBind.freightCode"
                                                @syncConsignee="consignee => handleSyncConsignee(consignee, editRowBind)"
                                                @handleFreightCodeChange="code => handleFreightCodeChange(code, editRowBind)"
                                                @handleFocus="handlePointSet(editRowBind, hcell, hi, -1)"
                                        ></forwarderComponent>
                                        <!-- @handleTab="handleTab" -->
                                    </template>
                                    <template v-if="hcell.edit.type == 'slot'">
                                        <slot :name="hcell.edit.name" :row="editRowBind" />
                                    </template>
                                </div>
                            </td>
                            <td v-else-if="!hcell.edit && hcell.toggle?hcell.toggle($route, outParams):true" :style="tdColStyle(hcell, editRowBind)">
                                <div class="adv-header-col p-cell">
                                    <label>－－</label>
                                </div>
                            </td>
                        </template>
                    </tr>
                    <tr v-if="editRowBind.expand">
                        <td :colspan="columns.length">
                            <div class="adv-edit-row-expand">
                                <slot name="edit-expand" :row="editRowBind" />
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="adv-table_total-container" ref='advTabTotalContainer' v-if="totalLine">
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td :key="i" v-for="(hcell,i) in columns" :style="tdTotalColStyle(hcell)">
                            <!--            <td v-if="hcell.toggle?hcell.toggle($route):true" v-for="hcell in columns">-->
                            <div v-if="(hcell.toggle ? hcell.toggle($route, outParams) : true) && hcell.total" class="adv-header-col">
                                <label style="text-align:center">
                                    {{syncTotalDisplay(hcell)}}
                                </label>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="adv-table_foot-container">
            <div v-if="pagination" class="tab-pagination">
                <label class="select-num" v-if="pagination.selectNum || pagination.selectNum === 0">已选中&nbsp;{{pagination.selectNum}}&nbsp;条</label>
                <el-pagination
                        :small="pagination.small || false"
                        :pager-count="pagination.pageCount"
                        :background="pagination.noBg == true?false:true"
                        :current-page="pagination.page"
                        :page-sizes="pagination.map"
                        :page-size="pagination.size"
                        :layout="pagination.layout"
                        :total="pagination.total"
                        @size-change="handlePageSizeChange"
                        @current-change="handlePageCurrentChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
     import postal from 'postal';
    import validator from "validator";
    import { get, map, cloneDeep, compact, extend, find, debounce, omit, filter } from 'lodash';
     import ScrollBox from'@components/Scroll/scroll';

    export default {

        props: {
            id: {
                type: String,
                default: ''
            },
            tabData: {
                type: Array,
                default: () => {
                    return []
                }
            },
            params: {
                type:Object,
                default: () => {
                    return {};
                }
            },
            editRow: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            scrollConfig: {
                type: Array,
                default: () => {
                    return [false, true]
                }
            },
            pagination: {
                type: Object,
            },
            columnConfig: {
                type:Object
            },
            checkedRow: {
                type: Number
            },
            scollLoading: {
                type: Boolean
            },
            pageLoadLock: {
                type: Boolean
            },
            toolbar: {
                type: Boolean,
                default:false
            },
            searchSwitch: {
                type: Boolean,
                default:false
            },
            headerSwitch: {
                type: Boolean,
                default:true
            },
            relative: {
                type: Boolean,
                default:false
            },
            selection: {
                type: Array,
                default: () => {
                    return []
                }
            },
            totalLine: {
                type: Boolean,
                default: false
            },
            editLine: {
                type: Boolean,
                default: false
            },
            shortcut: {
                type: Boolean,
                default: false
            },
            handlePoint: {
                type: Array,
                default: () => {
                    return [0, 0]
                }
            },
        },
        data() {
            return {
                // log: new this.$logger('component.advTable'),
                move: false,
                current:0,
                size: 30,
                waybillDetailSwitch: false,
                waybillDetailId: '',
                resize:false,
                currentPage: 0,
                pageCount: 0,
                loaded:false,
                resizeScroll: false,
                selectionCheckAll:false,
                checkedRowNumber:null,
                hoverRowNumber: null,
                shortcutTableEventId:null,
                pageLoadLockTemp:this.pageLoadLock,
                pageLoadCount:1,
                selectionItems: {},
                searchItems: {},
                outParams: {},
                dataLength:0,
                offset: [0, 0],
                editNodes:[],
                currentEditNumber: 0,
                eventSub: null,
                editRowBind:null,
                uldModel: {
                    type:'',
                    code:'',
                    iata:'',
                    weight:0
                },
                editor:null
            }
        },
        watch:{
            searchSwitch(val) {
                if(!val) {
                    this.searchItems = {};
                    this.$emit('handleSearchChange', this.searchItems);
                }
            },
            scollLoading(n) {
                setTimeout(() => {
                    this.resizeScroll = true;
                    setTimeout(() => {
                        this.resizeScroll = false;
                    }, 0);
                }, 0)
            },
            editRow: {
                handler(d) {
                    this.editRowBind = d;
                },
                deep:true,
                immediate:true
            },
            tabData: {
                handler(data) {
                    this.total = data.length;
                    if(data.length != this.dataLength) {
                        this.selectionCheckAll = false;
                        this.selectionItems = {};
                        this.offset = [0, 0];
                        this.dataLength = data.length;
                        this.syncScrollBar();
                    }else {
                        setTimeout(() => {
                            this.resizeScroll = true;
                            setTimeout(() => {
                                this.resizeScroll = false;
                            }, 0);
                        }, 0)
                    }
                    this.editDefaultCheck();
                },
                deep:true,
                immediate: true,
            },
            params: {
                handler(n, o) {
                    this.outParams = n;
                    extend(this.outParams, {expired:this.$uuid()})
                },
                deep:true,
                immediate: true,
            },
            checkedRow: {
                handler(ind) {
                    this.checkedRowNumber = ind;
                },
                immediate:true
            },
            selection: {
                handler(arr) {
                    this.checkedSelection(arr);
                },
                immediate:true
            }
        },
        beforeDestroy() {
            this.removeEvent();
            // this.$refs['advTableContainer'].removeEventListener('mousewheel', this.handleMouseWheel, false);
        },
        beforeMount() {
            // this.columns = this.initColumns();
        },
        mounted() {
            this.syncScrollBar();
            this.removeEvent();
            this.registShortcutEvent();
            window.addEventListener('resize', this.reRender, false)
            // this.$refs['advTableContainer'].addEventListener('mousewheel', this.handleMouseWheel, false)
        },
        methods: {
            handleMouseWheel(e) {
                e.stopPropagation();
                e.preventDefault();
                if(this.move) {
                    return;
                }
                this.move = true;
                let move = e.deltaY;
                let speed = Math.abs(Math.floor(move/30));
                speed = speed < 1?1:speed;
                if(move > 0) {
                    this.current = this.current + speed >= this.total - 1? this.total - 1: this.current + speed;
                }
                if(move < 0) {
                    this.current = this.current - speed <= 0? 0: this.current - speed;
                }
                // this.log.info('testmove', move, move/30, speed);

                // let scooter = this.$refs['monitorBodyScooter'];
                // scooter.scrollTop = (this.current/(this.total  - 1))*scooter.scrollHeight;
                setTimeout(() => {
                    this.move = false;
                }, 30)
            },
            waybillDetailShow(row, wid) {
                this.waybillDetailId = get(row, wid, '');
                if (!this.waybillDetailId) {
                    this.$message({type: 'error', message: '没有查到该运单信息！'});
                    return;
                }
                // this.waybillDetailSwitch = true;
                postal.publish({
                    channel: 'Worker.Basis',
                    topic: 'Waybill.Detail',
                    data: {
                        wid:this.waybillDetailId,
                        config: this.outParams?this.outParams.waybillDetailConfig:{},
                        switch: true
                    }
                });
            },
            editDefaultCheck() {
                if(this.editLine) {
                    // this.$set(this.handlePoint, 0, 0);
                    // this.$set(this.handlePoint, 1, -1);
                    // this.handleFocusElement(39);
                }
            },
            removeEvent() {
                window.removeEventListener('resize', this.reRender);
            },
            handleToggleCellEditStatus(row, col, ri, ci, status) {
                this.editor = row;
                this.$set(this.handlePoint, 0, ci);
                this.$set(this.handlePoint, 1, ri);
                this.$set(this.tabData, ri, extend(row, {_edit: ci}));
                if(status) {
                    setTimeout(() => {
                        this.focusElement();
                    }, 0)
                }
                if(this.outParams && this.outParams.editStatusMap) {
                    this.$set(this.outParams.editStatusMap, col.key, status);
                }
            },
            handleEditCellEnter:debounce(function(row, ri, key) {
                this.$emit('handleEditCellEnter', { row, index:ri, key });
            }, 600),
            handleEditCellInput:debounce(function(row, ri, key) {
                this.$emit('handleEditCellInput', { row, index:ri, key });
            }, 600),
            handleEditCellKeyDown(row, col, ri, ci, key) {
                setTimeout(() => {
                    this.$emit('handleEditCellInput', { row, index:ri, key });
                    this.$forceUpdate();
                }, 0)
                return;
                setTimeout(() => {
                    if(ri != this.handlePoint[1] || ci != this.handlePoint[0]) {
                        this.handleToggleCellEditStatus(row, col, ri, ci, false);
                    }
                }, 0)
            },
            handleEditCellBlur(row, col, ri, ci) {
                this.$emit('handleEditCellBlur', { row, index:ri, key:col.key });
                // if(ri != this.handlePoint[1] || ci != this.handlePoint[0]) {
                //     this.handleToggleCellEditStatus(row, col, ri, ci, false);
                // }
            },
            handleWaybillFirstFocus(e, ref) {
                let sec = this.$refs[ref][0];
                let val = e.target.value;
                if(val.length == 3 || val.toUpperCase() === 'DN') {
                    sec.focus();
                }
            },
            handleWaybillFirstKeyUp(e, ref) {
                let val = e.target.value;
                let sec = this.$refs[ref][0];
                if(val.length == 3 || val.toUpperCase() === 'DN') {
                    sec.focus();
                }
            },
            handleWaybillFirstKeyDown(e) {
            },
            handleWaybillSecondKeyUp(e, ref) {
                let val = e.target.value;
                let fir = this.$refs[ref][0];
                switch(e.keyCode) {
                    case 8:
                        if(val === '') {
                            fir.value = fir.value.slice(0, -1);
                            setTimeout(() => {
                                fir.focus();
                            }, 0)
                        }
                        break;
                }
            },
            handleWaybillSecondKeyDown(e) {
            },
            handlePointSet(row, col, ci, ri) {
                if(ri == this.handlePoint[1] && ci == this.handlePoint[0]) {
                    return;
                }
                if(this.editor) {
                    this.$set(this.editor, '_edit', false);
                    this.editor = null;
                    // this.$emit('handleEditorValueChange', { row: row });
                }
                this.$set(this.handlePoint, 0, ci);
                this.$set(this.handlePoint, 1, ri);
            },
            blurElement() {
                let _blur = false;
                let eles = compact([
                    { ele:document.querySelector('.edit-point-flicker input'), type:0},
                    { ele:document.querySelector('.edit-point-flicker button'), type:0},
                    { ele:document.querySelector('.edit-point-flicker textarea'), type:0},
                    { ele:document.querySelector('.edit-point-flicker .cell-simple'), type:1},
                    { ele:document.querySelector('.edit-point-flicker .el-tooltip'), type:0},
                ]);

                map(eles, item => {
                    if(item.ele) {
                        _blur = true;
                    }
                    if(item.ele && item.type === 0) {
                        item.ele.blur();
                    }
                });
                return _blur;
            },
            focusElement() {
                let _focus = false;
                let eles = compact([
                    { ele:document.querySelector('.edit-point-flicker input'), type:0},
                    { ele:document.querySelector('.edit-point-flicker button'), type:0},
                    { ele:document.querySelector('.edit-point-flicker textarea'), type:0},
                    { ele:document.querySelector('.edit-point-flicker .cell-simple'), type:1},
                    { ele:document.querySelector('.edit-point-flicker .el-tooltip'), type:0},
                ]);

                map(eles, item => {
                    if(item.ele) {
                        _focus = true;
                    }
                    if(item.ele && item.type === 0) {
                        // this.log.info('keydonw11', '1231')
                        item.ele.focus();
                    }
                });
                return _focus;
            },
            handleFocusElement(code) {
                // ignore
                if(this.focusElement()) {
                    return;
                }

                let x = this.handlePoint[0];
                let y = this.handlePoint[1];
                let mx = this.columns.length;
                let my = this.tabData.length;
                switch(code) {
                    case 9:
                        this.$set(this.handlePoint, 0, x + 1 >= mx ? 0: x + 1);
                        break;
                    case 37:
                        this.$set(this.handlePoint, 0, x - 1 <= 0 ? mx -1: x - 1);
                        break;
                    case 39:
                        this.$set(this.handlePoint, 0, x + 1 >= mx ? 0: x + 1);
                        break;
                    //上
                    case 38:
                        this.$set(this.handlePoint, 1, y == -1?my-1:(y == 0?-1:y - 1));
                        break;
                    //下
                    case 40:
                        this.$set(this.handlePoint, 1, y == -1?0:(y == my -1 ?-1:y + 1));
                        break;
                }

                setTimeout(() => {
                    this.handleFocusElement(code);
                }, 0)
            },
            handlePointEvent(e) {
                e.stopPropagation();
                let x = this.handlePoint[0];
                let y = this.handlePoint[1];
                let mx = this.columns.length;
                let my = this.tabData.length;
                let move = false;
                let row = cloneDeep(this.tabData[y]);
                switch(e.keyCode) {
                    //ESC
                    case 27:
                        if(y != -1 && this.editor) {
                            this.$set(this.editor, '_edit', false);
                            this.editor = null;
                            this.$emit('handleEditorValueChange', {row: this.tabData[y]});
                        }
                        break;
                    //回车
                    case 13:
                        if(y != -1) {
                            if(this.editor) {
                                this.$set(this.editor, '_edit', false);
                                this.editor = null;
                                this.$emit('handleEditorValueChange', { row: this.tabData[y] });
                            }else {
                                this.$set(this.tabData, y, extend(row, {_edit: x}));
                                this.editor = this.tabData[y];
                                setTimeout(() => {
                                    this.focusElement();
                                }, 0)
                            }
                            this.$forceUpdate();
                        }
                        break;
                    //tab
                    case 9:
                        e.preventDefault();
                        if(y != -1 && this.editor) {
                            this.$set(this.editor, '_edit', false);
                            this.editor = null;
                            this.$emit('handleEditorValueChange', { row: this.tabData[y] });
                            this.$forceUpdate();
                        }
                        this.blurElement();
                        this.$set(this.handlePoint, 0, x + 1 >= mx ? 0: x + 1);
                        move = true;
                        break;
                    //左
                    case 37:
                        if(y != -1 && this.editor) {
                            this.$set(this.editor, '_edit', false);
                            this.editor = null;
                            this.$emit('handleEditorValueChange', { row: this.tabData[y] });
                            this.$forceUpdate();
                        }
                        this.blurElement();
                        this.$set(this.handlePoint, 0, x - 1 < 0 ? mx -1: x - 1);
                        move = true;
                        break;
                    //右
                    case 39:
                        if(y != -1 && this.editor) {
                            this.$set(this.editor, '_edit', false);
                            this.editor = null;
                            this.$emit('handleEditorValueChange', { row: this.tabData[y] });
                            this.$forceUpdate();
                        }
                        this.blurElement();
                        this.$set(this.handlePoint, 0, x + 1 >= mx ? 0: x + 1);
                        move = true;
                        break;
                    //上
                    case 38:
                        if(y != -1 && this.editor) {
                            this.$set(this.editor, '_edit', false);
                            this.editor = null;
                            this.$emit('handleEditorValueChange', { row: this.tabData[y] });
                            this.$forceUpdate();
                        }
                        this.blurElement();
                        this.$set(this.handlePoint, 1, y == -1?my-1:(y == 0?-1:y - 1));
                        break;
                    //下
                    case 40:
                        if(y != -1 && this.editor) {
                            this.$set(this.editor, '_edit', false);
                            this.editor = null;
                            this.$emit('handleEditorValueChange', { row: this.tabData[y] });
                            this.$forceUpdate();
                        }
                        this.blurElement();
                        this.$set(this.handlePoint, 1, y == -1?0:(y == my -1 ?-1:y + 1));
                        break;
                }
                if(y == -1){
                    setTimeout(() => {
                        this.handleFocusElement(e.keyCode);
                    }, 0)
                }
            },
            handleTab(e) {
                // this.log.info('yyy', this.currentEditNumber, e.target)
                this.currentEditNumber = Number(e.target.dataset.enum) + 1;
                if(this.editNodes[this.currentEditNumber]) {
                    // this.editNodes[this.currentEditNumber].focus();
                }
            },
            reRender() {
                // this.resize = true;
                // setTimeout(() => {
                //     this.resize = false;
                // }, 0)
            },
            handleCommodityNameChange(data, row) {
                this.$set(row, 'commodityNameJson', data);
                this.$set(row, 'commodityName', data.join(','));
            },
            handleSyncConsignee(consignee, row) {
                // this.$emit('handleSyncConsignee', consignee);
                this.$set(row, 'consignee', consignee? consignee.freightName: '');
                this.$set(row, 'forwarderPayType', consignee? consignee.chargeType: 0);
                this.$set(row, 'consigneePhone', consignee.contactsPhone);
                this.$set(row, 'freightId', consignee?consignee.id: '');
                this.$set(row, 'freightName', consignee?consignee.freightName: '');
            },
            handleFreightCodeChange(code, row) {
                this.$set(row, 'freightCode', code);
            },
            handleSyncSpecialCode(code, ids, row) {
                this.$set(row, 'specialCode', code);
                this.$set(row, 'commodityIds', ids);
            },
            handleEditOperateClick(evt, hcell, row) {
                if(evt) {
                    this.$emit(evt, { hcell, row });
                }
            },
            handleEditButtonClick(e, hcell) {
                if(hcell.edit.event) {
                    this.$emit(hcell.edit.event, { hcell});
                }

            },
            handleEditValueChange(e, hcell) {
                if(hcell.edit.handleSync) {
                    hcell.edit.handleSync(this.editRowBind);
                }
            },
            handleEditKeyDown(e, hcell) {
                if(e.keyCode == 83 && e.altKey) {
                    this.$emit('handleEditInsert');
                }

            },
            handleEditSelectBlur(e, ref) {
                return;
                try {
                    // if(this.$refs[`editItem_${hcell.key}`][0]) {
                    //     this.$refs[`editItem_${hcell.key}`][0].blur();
                    // }
                    if(this.$refs[ref][0]) {
                        this.$refs[ref][0].blur();
                    }
                }catch(e) {
                    // this.log.info('下拉失去焦点时出现异常', e);
                }
            },
            handleXThumbOffset(offset) {
                this.$set(this.offset, 0, offset);
            },
            handleDebounceSearchChange: debounce(function(e, cell) {
                this.handleSearchChange(e, cell);
            }, 300),
            handleSearchChange(e, cell) {
                if(cell.search.type == 'select') {
                    extend(this.searchItems, {
           [cell.key] : cell.search.format?cell.search.format(cell.search.value):cell.search.value
                    });
                }else {
                    extend(this.searchItems, {
                        [cell.key] : cell.search.format?cell.search.format(e.target.value):e.target.value
                    });
                }

                this.$emit('handleSearchChange', this.searchItems);
            } ,
            checkedSelection(arr) {
                if(!arr) {
                    return;
                }
                this.selectionItems = {};
                map(this.tabData, d => {
                    if(find(arr, item => item == d.id)) {
                        extend(this.selectionItems, {
                            [d.id] : d
                        });
                    }
                })

                this.$emit('handleSelectionChange', compact(map(this.selectionItems, item => {
                    return item?item:false;
                })));
            },
            handleSwitchCheckedChange(row, key) {
                this.$emit('handleSwitchCheckedChange', { row, key });
            },
            handleSelectionCheckItem(row) {
                // this.log.info(row);
                let item = this.selectionItems[row.id];
                extend(this.selectionItems, {
                    [row.id] : item?false:row
                });
                this.$forceUpdate();
                this.$emit('handleSelectionChange', compact(map(this.selectionItems, item => {
                    return item?item:false;
                })));
            },
            handleSelectionCheckAll(columns) {
                // this.log.info(this.selectionItems);
                this.selectionCheckAll = !this.selectionCheckAll;
                map(this.tabData, (d, i) => {
                    extend(this.selectionItems, {
                        [d.id] : this.selectionCheckAll?d:false
                    });
                })
                this.$emit('handleSelectionChange', compact(map(this.selectionItems, item => {
                    return item?item:false;
                })));
            },
            dynamicDisplay(row, ci) {
                // let row = this.$refs[rid];
                // this.log.info('scroll', row, row.getBoundingClientRect());
                return true;
            },
            handlePageLoad() {
                return;
                if(this.pageLoadLock) {
                    return;
                }

                this.pageLoadLock = true;
                this.handlePageCurrentChange(this.pageLoadCount + 1);
            },
            dropdownOptionsRegist(operate, row) {
                if(typeof(operate.options) == 'object') {
                    return operate.options;
                }else {
                    try {
                        return operate.options(row, this.outParams);
                    }catch(e) {
                        // this.log.info(e);
                    }
                }
            },
            registShortcutEvent() {
                if(!this.id) {
                    return;
                }
                this.$subscribeMap[this.id] && this.$subscribeMap[this.id].unsubscribe();
                this.$subscribeMap[this.id] = postal.subscribe({
                    channel: 'UI.Basis',
                    topic: 'Event.KeyDown',
                    callback: e => {
                        if(this.shortcut) {
                            // this.log.info(this.shortcut);
                            this.handlePointEvent(e);
                        }
                        this.$emit('handleShortcutEvent', {
                            event: e ,
                            checkedRowNumber: this.checkedRowNumber
                        });
                    }
                });
            },
            syncScrollBar() {
                setTimeout(() => {
                    this.loaded = true;
                    setTimeout(() => {
                        this.loaded = false;
                    }, 0);
                }, 0)
            },
            handlerRowClick(e, d, ind) {
                this.checkedRowNumber = ind;
                this.$emit('listenToCheckedChange', cloneDeep(d), d);
            },
            handledblClick(ind, row, e) {
                this.$emit('handledblClick', {
                    event: e,
                    index: ind,
                    row: row,
                    clone: cloneDeep(row)
                });
            },
            handleInnerBtnClick(ind, row, e, col) {
                if(!col.event) {
                    return;
                }
                this.$emit(col.event, {
                    index: ind,
                    row: row,
                    clone: cloneDeep(row)
                });
            },
            handleButtonClick(ind, row, event, e, operate) {
                if(operate.disabled && operate.disabled(row)) {
                    return;
                }

                let _event = event;
                if(typeof(event) == 'function') {
                    _event = event(row);
                }

                this.$emit(_event, {
                    event: e,
                    index: ind,
                    row: row,
                    clone: cloneDeep(row)
                });
            },
            handleDropDownCommand(ind, row, command) {
                this.$emit(command, {
                    index: ind,
                    row: row
                });
            },
            handlePageSizeChange(size) {
                this.$emit('handleSizeChange', size);
                this.checkedRowNumber = null;
                setTimeout(() => {
                    this.syncScrollBar();
                }, 0);
            },
            handlePageCurrentChange(cur) {
                this.$emit('handlePageChange', cur);
                this.checkedRowNumber = null;
                setTimeout(() => {
                    this.syncScrollBar();
                }, 0);
            },
            handleInsertScooterChange(id, row, ri, key) {
                let scooter = find(get(this.outParams, 'scooterOptions', []), scooter => scooter.id == id);
                if(scooter) {
                    extend(row, omit(cloneDeep(scooter), ['id']), {
                        scooterId: scooter.id
                    });
                    this.$emit('handleEditCellInput', { row:row, index:ri, key });
                }
            },
            handleClearInsertScooter(val) {
                if (!val) {
                    this.$set(this.outParams, 'scooterOptions', []);
                }
            },
            handleSearchScooters(condition) {
                return this.$axios({
                    url: '/api/inservice-product-departures/base-scooter/getUsableScootersForInstall',
                    data: {
                        current: 1,
                        size: 30,
                        filter: {
                            scooterCode: condition,
                            flightInfoId: this.outParams.flightInfoId
                        }
                    },
                    method: 'post'
                }).then(res => {
                    this.$set(this.outParams, 'scooterOptions', res.data.records);
                });
            }
        },
        computed: {
            syncSimpleContentIcon(row, col, ri) {
                return (row, col, ri) => {
                    return find(col.simpleContent(row, col, ri), item => item.flag);
                }
            },
            syncColSpan(columns) {
                return columns => {
                    return filter(columns, c => {
                        return  c.toggle?c.toggle(this.$route, this.outParams):true;
                    }).length;
                }
            },
            tempTabData() {
                return () => {
                    return this.tabData.slice(this.current, this.current + this.size);
                }
            },
            syncTotalDisplay(hcell) {
               return hcell  => {
                   let display = hcell.total && hcell.total.display?hcell.total.display(this.selectionItems, this.tabData, this.outParams):hcell.total.value;
                   return display;
                   // return col.substr?`${display.substring(0, col.substr)}`:display;
               }
            },
            syncDisplay(row, col, ri) {
               return (row, col, ri)  => {
                   let display = col.display?col.display(row, ri, this.outParams):(row[col.key] === 0?0:row[col.key] || (col.placeholder?col.placeholder:"－－"));
                   return display;
                   // return col.substr?`${display.substring(0, col.substr)}`:display;
               }
            },
            syncSelectDropdownClass(ri, ci, opts) {
                return (ri, ci, opts) => {
                    try{
                        return ri == this.handlePoint[1] && ci == this.handlePoint[0] && opts.length?'sel_dropdown-show':'sel_dropdown-hidden';
                    }catch(e) {
                        return '';
                    }
                }
            },
            operateStyleExtend(operate, row) {
                return (operate, row) => {
                    if(!operate.styleExtend) {
                        return {};
                    }

                    if(typeof(operate.styleExtend) == 'object') {
                        return operate.styleExtend;
                    }else {
                        return operate.styleExtend(row, this.outParams);
                    }
                }
            },
            operateType(operate, row, params) {
                return (operate, row, params) => {
                    if(!operate.config || !operate.config.type) {
                        return 'normal';
                    }

                    if(typeof(operate.config.type) == 'string') {
                        return operate.config.type;
                    }else {
                        return operate.config.type(row, params);
                    }
                }
            },
            handleValidatorStyleExtend(v, t) {
                return (v, t) => {
                    if(!t) {
                        return {};
                    }
                    let _validator = validator[t](v);
                    return {
                        backgroundColor:_validator.res?'':'#fff3f3',
                        color: _validator.res?'':'red'

                    };
                }
            },
            scrollWidth() {
                return () => {
                    if(this.$refs.tabHeader){
                        let body = this.$refs.tabHeader;
                        return body.getBoundingClientRect().width;
                    }
                    return 0;
                }
            },
            previewStyle() {
                return () => {
                    return {
                        // backgroundImage: `url(/fileShow/${this.previewURL})`
                    }
                };
            },
            columns:function() {
                if(this.id) {
                    return this.$store.getters.getTabColumns(this.id);
                }
                if(this.columnConfig) {
                    return this.columnConfig.columns;
                }
                return [];
            },
            headerSelectionClass() {
                return () => {
                    return [
                        this.selectionCheckAll?'selection-chk':''
                    ]
                }
            },
            // bodySelectionClass(row) {
            //     return row => {
            //         this.log.info('123', this.selectionItems[row.id])
            //         return [
            //             this.selectionItems[row.id]?'selection-chk':''
            //         ]
            //     }
            // },
            thCellStyle(c) {
                return function(c) {
                    let w = get(c, 'width', null);
                    w = w ? Number(w.slice(0, -2)) / 100 + 'rem': '';

                    let left = get(c, 'left', '.048rem');
                    let right = get(c, 'right', '.048rem');
                    return extend({
                        textAlign: get(c, 'align', 'center'),
                        width: w,
                        maxWidth: w,
                        minWidth: w,
                        padding: `.096rem ${right} .096rem ${left}`
                    }, c.extendHeaderStyle && c.extendHeaderStyle(this.outParams) || {})
                }
            },
            editPointClass(x, y) {
                return (x, y) => {
                    let isP = Number(x) == this.handlePoint[0] && Number(y) == this.handlePoint[1];
                    if(isP) {
                        // this.log.info('yyy#1', x, y, this.handlePoint)
                    }
                    return isP && this.shortcut?['edit-point-flicker']:[];
                }
            },
            editPointStyle(x, y) {
                return (x, y) => {
                    let isP = Number(x) == this.handlePoint[0] && Number(y) == this.handlePoint[1];
                    if(isP) {
                        // this.log.info('yyy#', x, y, this.handlePoint)
                    }
                    return {
                        border:isP && this.shortcut?'dashed 1px rgba(38, 139, 167, 1)':''
                    }
                }
            },
            tdTotalColStyle(c, row) {
                return function(c, row) {
                    let w = get(c, 'width', null);
                    w = w?Number(w.slice(0, -2))/ 100 + 'rem': '';

                    let left = get(c, 'left', '.024rem');
                    let right = get(c, 'right', '.024rem');
                    return extend({
                        textAlign: get(c, 'align', 'center'),
                        width: w,
                        maxWidth: w,
                        minWidth: w,
                        padding: `.024rem ${right} .024rem ${left}`
                    }, c.total && c.total.extendStyle && c.total.extendStyle(this.tabData, this.outParams) || {});
                }
            },
            tdColStyle(c, row) {
                return function(c, row) {
                    // if(!row) {
                    //     return {};
                    // }
                    let w = get(c, 'width', null);
                    w = w?Number(w.slice(0, -2)) / 100 + 'rem': '';

                    let left = get(c, 'left', '.024rem');
                    let right = get(c, 'right', '.024rem');
                    return extend({
                        textAlign: get(c, 'align', 'center'),
                        width: w,
                        maxWidth: w,
                        minWidth: w,
                        padding: `.024rem ${right} .024rem ${left}`
                    }, c.extendStyle && c.extendStyle(row, this.outParams) || {});
                }
            },
            rowClassExtend(row, ri) {
                return function(row, ri) {
                    let classExtend = [];
                    // classExtend.push(this.checkedRowNumber == ri?'adv-tab_row-checked':'');
                    return classExtend;
                }
            },
            inputStyleExtend(row, col, ri, ci) {
                return (row, col, ri, ci) => {
                    return col.editConfig.extendStyle && col.editConfig.extendStyle(row, this.outParams) || {};
                }
            },
            rowStyleExtend(row, ri, e) {
                return (row, ri, e) => {
                    let styleExtend = {};
                     let config ;
                    if(this.id) {
                        config = this.$store.getters.getTabConfig(this.id)
                    }
                    if(this.columnConfig) {
                        config= this.columnConfig.columns;
                    }
                    if(!config) {
                        return {};
                    }
                    extend(styleExtend, config.rowDefaultHeightLightExtend || {});
                    if(get(row, 'heightlight')) {
                        extend(styleExtend, {
                            backgroundColor:row.heightlight
                        });
                    }


                    if(ri == this.hoverRowNumber) {
                        extend(styleExtend, {
                            backgroundColor: '#2c3f6d'
                        }, config.rowHoverStyleExtend || {});
                    }

                    if(ri == this.checkedRowNumber) {
                        extend(styleExtend, {
                            backgroundColor: '#194955',
                        }, config.rowCheckedStyleExtend || {});
                    }

                    extend(styleExtend, config.rowDefaultStyleExtend || {}, config.rowStyleExtend?config.rowStyleExtend(row, this.outParams):{});

                    return styleExtend;

                }
            },
            rowSwitch(row, ri) {
                return function(row, ri) {
                    let config ;
                    if(this.id) {
                        config = this.$store.getters.getTabConfig(this.id)
                    }
                    if(this.columnConfig) {
                        config= this.columnConfig.columns;
                    }
                    if(config.switch) {
                        return config.switch(row, this.outParams);
                    }
                    return true;
                }
            },
            editRowStyleExtend() {
                let config ;
                if(this.id) {
                    config = this.$store.getters.getTabConfig(this.id)
                }
                if(this.columnConfig) {
                    config= this.columnConfig.columns;
                }
                if(!config) {
                    return {};
                }
                return config.editRowStyleExtend || {};
            },
            iconStyleExtend(row, operate) {
                return (row, operate) => {
                    let styleExtend = {
                        color:operate.color,
                        fontSize:operate.fontSize,
                    };
                    if(operate.disabled && operate.disabled(row)) {
                        extend(styleExtend, {
                            color:"#ccc",
                            pointerEvents: 'none'

                        })
                    }
                    return styleExtend;
                }
            },
        },
        components: {
            ScrollBox
        }
    }
</script>

<style lang='scss' scoped>
    .badge-item {
        position: absolute !important;
        background-color: #ff7500;
        border-radius: 100%;
        width: 20px;
        height: 20px;
        font-size: 11px;
        font-weight:800;
        color: #fff;
        line-height: 22px;
        text-align: center;
        top: 0;
        right: 0;
    }

    .adv-table_relative {
        position:relative;
    }

    .sel_dropdown-show {
        display:block;
    }

    .sel_dropdown-hidden {
        display:none;
    }

    .adv-table_absolute {
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
    }
    .el-select {
        width:100%;
        .el-select__input {
            border:none !important;
        }
    }

    .adbTab_preview-box {
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        width:600px;
        height:800px;
        background-color:#222;
        z-index:2001;

        div.preview-close {
            position:absolute;
            right:10px;
            top:10px;
            color:#222;
            font-size:20px;
            background-color: #fff;
            width: 20px;
            height: 20px;
            line-height:20px;
            text-align:center;
            border-radius:3px;
            cursor:pointer;
        }

    }

    @keyframes border-flicker {
        0% {
            border:dashed 1px rgba(38, 139, 167, .5);
        }
        50%{
            border:dashed 1px rgba(38, 139, 167, 1);
        }
        100%{
            border:dashed 1px rgba(38, 139, 167, .5);
        }
    }
    .edit-point-flicker {
        animation:border-flicker 2s infinite;
        background-color:rgba(192, 232, 255, .6);
    }

    .adv-table-container {
        display:flex;
        flex-grow:1;
        flex-flow:column;
        font-family: 'Fjalla One';
        color:#2d2d2d;


        button, input {
            outline:none;
        }

        .selection-cell {
            position:absolute;
            top:0;
            left:0;
            right:0;
            bottom:0;
            display:flex;
            align-items: center;
            justify-content: center;

            .selection-box {
                position:relative;
                width:15px;
                height:15px;
                border:solid 1px #3F9EFF;
                border-radius:3px;
                cursor:pointer;
                background-color: #fff;

                span {
                    position: absolute;
                    top:0;
                    left:0;
                    right:0;
                    bottom:0;
                    border: 1px solid #dcdfe6;
                    border-radius: 2px;
                    box-sizing: border-box;
                    background-color: #3F9EFF;
                    z-index: 1;
                }
                span.selection-chk {}

                span.selection-chk:after {
                    box-sizing: content-box;
                    content: "";
                    border: 1px solid #fff;
                    border-left: 0;
                    border-top: 0;
                    height: 7px;
                    width: 3px;
                    left: 4px;
                    position: absolute;
                    top: 1px;
                    transform: rotate(45deg);
                    transition: transform .15s ease-in .05s;
                    transform-origin: center;
                }
            }
        }


        .adv-table_main-container {
            position:relative;
            display:flex;
            flex-grow:1;
            flex-flow:column;
            border-radius: 3px;
            overflow: hidden;
             padding: 0;
            border: solid 1px #45547c;
            /*box-shadow: 0 1px 5px #293756;*/
            .adv-table_tool-container {
                position:relative;
                display:flex;
                flex-grow:0;
                height:30px;
                background-color:#545454;
                color:#fff;
                margin:0 0 1px 0;
            }

            .adv-table_header-container {
                position:relative;
                display:flex;
                flex-grow:0;
                /*box-shadow: 0 1px 8px #293756;*/
                border-bottom:solid 1px #45547c;

                z-index:1;
                /*普通表头*/
                table {
                    tr {
                        th {
                            background-color: #293756;
                            color: #fff;
                            font-size: 14px;
                             font-family: AlibabaPuHuiTiM;
                            font-weight: 400;
                            border-right:solid 1px #45547c;
                            height: 40px;
                            padding: 0!important;
                            .adv-header-col {
                                position: relative;
                                min-height: 40px;
                                line-height: 40px;
                                white-space: normal;
                                overflow: hidden;
                                width: 100%;
                                padding: 0;

                                label {
                                    margin: 0;
                                }
                            }
                        }

                        th:last-child {
                            border:none;
                        }
                    }
                }
            }

            .adv-table_search-container {
                position:relative;
                display:flex;
                flex-grow:0;
                table {
                    min-width:100%;
                    tr {
                        th {
                            background-color: #293756;
                            font-size: 14px;
                            font-weight: 400;
                            border-right:solid 1px #45547c;
                            border-bottom:solid 1px #45547c;
                            height: 40px;
                            padding: 0!important;

                            .adv-header-col {
                                position: relative;
                                min-height: 40px;
                                line-height: 40px;
                                white-space: normal;
                                overflow: hidden;
                                width: 100%;
                                padding: 0;
                                overflow:hidden;
                                input {
                                    width:100%;
                                }
                            }

                        }

                        th:last-child {
                            border:none;
                        }
                    }
                }
            }

            .adv-table_edit-container {
                position:relative;
                display:flex;
                flex-grow:0;
                box-shadow: 0 -1px 3px #adabab;
                z-index:1;

                table {
                    min-width:100%;
                    tr {
                        td {

                            font-size: 14px;
                            font-weight: 400;
                            border-right:solid 1px #45547c;
                            height: 40px;
                            padding: 0!important;
                            .adv-edit-row-expand {
                                position:relative;
                                width:100%;
                                background-color:#f3f3f3;
                            }
                            .adv-header-col {
                                position: relative;
                                min-height: 40px;
                                line-height: 40px;
                                white-space: normal;
                                overflow: hidden;
                                width: 100%;
                                padding: 3px;
                                border:dashed 1px rgba(91, 197, 206 ,0);
                                border-radius:3px;
                                overflow:hidden;
                                input {
                                    width:100%;
                                    text-align: center;
                                }

                                button {
                                    outline:none;
                                }

                                .operate-cell {
                                    display:inline-block;
                                    margin:0 5px;

                                    .operate-label {
                                        label {
                                            font-weight:bold;
                                            cursor:pointer;
                                        }
                                    }

                                    .operate-icon-noBorder {
                                        width:25px;
                                        height:25px;
                                        line-height:25px;
                                        text-align:center;
                                        cursor:pointer;
                                        i {
                                            font-size:1rem;
                                            &:hover {
                                                color:#404040;
                                            }
                                        }
                                        &>.el-input{
                                            &[readOnly]{
                                                border: none;
                                            }
                                        }
                                    }

                                    .operate-icon {
                                        width:25px;
                                        height:25px;
                                        line-height:25px;
                                        text-align:center;
                                        border-radius:3px;
                                        background-color:#F2F4F9;
                                        cursor:pointer;
                                        border:solid 1px #fff;
                                        i {
                                            font-size:1rem;
                                            &:hover {
                                                color:#404040;
                                            }
                                        }
                                        &>.el-input{
                                            &[readOnly]{
                                                border: none;
                                            }
                                        }
                                    }

                                    .operate-icon:hover {
                                        border:solid 1px #cce4fd;
                                    }

                                }
                            }

                        }
                        td:last-child {
                            border:none;
                        }
                    }
                }
            }

            .adv-table_total-container {
                position:relative;
                display:flex;
                flex-grow:0;

                table {
                    min-width:100%;
                    tr {
                        background-color:#162134;
                        /*background-color:#18263E;*/
                        td {
                            font-size: 14px;
                            font-weight: 400;

                             border-right: solid 1px #45547c !important;
                            height: 40px;
                            padding: 0!important;

                            .adv-header-col {
                                position: relative;
                                min-height: 40px;
                                line-height: 40px;
                                white-space: normal;
                                overflow: hidden;
                                width: 100%;
                                padding: 0;
                                overflow:hidden;
                                input {
                                    width:100%;
                                }

                                label {
                                    margin:0;
                                }
                            }

                        }

                        th:last-child {
                            border:none;
                        }
                    }
                }
            }
            /* 普通表格 body */
            .adv-table_body-container {
                position:relative;
                flex-grow:1;
                .cell-simple {
                    /*font-family: "MicrosoftYaHei QX";*/
                    /*font-size:14px;*/
                    /*font-weight:800;*/
                }
                table {
                    min-width:100%;
                    tr {
                        background-color:#162134;
                        position:relative;
                        transition:all .1s linear;
                        min-height:39px;
                        td {
                            border-right:solid 1px #45547c;
                            border-bottom:solid 1px #45547c;
                            font-size:14px;
                            overflow: hidden;
                            white-space: nowrap;
                            word-break: break-word;
                            color: #fff;
                            padding: 0 !important;
                            .adv-body-col {
                                position:relative;
                                min-height:38px;
                                line-height:38px;
                                white-space: normal;
                                overflow: hidden;
                                width: 100%;
                                padding: 0 3px!important;
                                border:dashed 1px rgba(91, 197, 206 ,0);
                                border-radius:3px;
                                .text-link {
                                    color: #1E5182;
                                    cursor:pointer;
                                }
                                .text-link:hover {
                                    text-decoration: underline;
                                    color:#1b7aab;
                                }

                                input {
                                    max-width:100%;
                                    height: 35px;
                                    background-color: rgb(16, 28, 47)!important;
                                    border:1px #37455c solid;
                                    color:#fff;
                                }

                                button {
                                    border:1px #37455c solid;
                                    background-color: rgb(16, 28, 47)!important;
                                    outline:none;
                                    color:#fff;
                                }
                                .tooltip-box {
                                    position:absolute;
                                    top:10px;
                                    left:0;
                                }


                                .edit-cell {
                                    min-height:30px;
                                    line-height:30px;
                                    display:flex;
                                    justify-content: center;
                                    align-items: center;

                                    input {
                                        display:block;
                                        position:relative;
                                        width:98%;
                                        margin:auto;
                                        /*padding:0 10px;*/
                                        text-align: center;
                                        background-color:#fffce2;
                                    }

                                    input:disabled {
                                        background-color:#f5f5f5;
                                        cursor: not-allowed;
                                    }

                                    .el-select__input {
                                        height:25px;
                                    }
                                }
                                .cell-preview {
                                    label {
                                        cursor:zoom-in;
                                    }
                                }

                                .operate-cell {
                                    display:inline-block;
                                    margin:0 5px;

                                    .operate-label {
                                        label {
                                            font-weight:bold;
                                            cursor:pointer;
                                        }
                                    }

                                    .operate-icon-noBorder {
                                        width:25px;
                                        height:25px;
                                        line-height:25px;
                                        text-align:center;
                                        cursor:pointer;
                                        i {
                                            font-size:1rem;
                                            &:hover {
                                                color:#404040;
                                            }
                                        }
                                        &>.el-input{
                                            &[readOnly]{
                                                border: none;
                                            }
                                        }
                                    }

                                    .operate-icon {
                                        width:25px;
                                        height:25px;
                                        line-height:25px;
                                        text-align:center;
                                        border-radius:3px;
                                        background-color:#F2F4F9;
                                        cursor:pointer;
                                        border:solid 1px #fff;
                                        i {
                                            font-size:1rem;
                                            &:hover {
                                                color:#404040;
                                            }
                                        }
                                        &>.el-input{
                                            &[readOnly]{
                                                border: none;
                                            }
                                        }
                                    }

                                    .operate-icon:hover {
                                        border:solid 1px #cce4fd;
                                        background-color: #fff;
                                        color:#618da2;
                                    }

                                }
                            }


                        }
                        td:last-child {
                            border:none;
                         }
                    }
                    tr:nth-child(odd) {
                        background-color:#18263E;
                    }


                    .adv-body-row-expand {
                        position:relative;
                        width:100%;
                         .adv-table_main-container {
                            border:none;
                            background:none;
                            padding:0!important;
                        }
                    }

                    /*.adv-tab_row-checked {*/
                    /*    background-color: rgba(107, 179, 243, 0.5);*/
                    /*}*/
                    .grey {
                        background: #EBEBEB;
                    }
                    .stick {
                        background: #F4D44B;
                    }
                    .heightlight-row {
                        background: #f0f9eb;
                    }


                }
            }
        }


        .adv-table_foot-container {
            position:relative;
            flex-grow:0;

            .tab-pagination {
                position:relative;
                height:50px;
                display:flex;
                align-items: center;
                justify-content: center;
                background: #fff;
                margin: 5px 0;
                border-radius: 3px;
                 box-shadow: 0 2px 3rem #bbb;
                border: solid 1px #ababab;
                .select-num{
                    display: inline-block;
                    // font-size: 0.92857rem;
                    // min-width: 2.53571rem;
                    // height: 2rem;
                    // line-height: 2rem;
                    vertical-align: top;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    color: #f00;
                    font-weight: 800;
                }
            }
        }
    }

</style>