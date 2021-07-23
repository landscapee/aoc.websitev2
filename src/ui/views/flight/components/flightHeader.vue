<template>
  <div class="d-flex header">
    <div :style="{width: pxtorem(parseInt(c.width)) + 'rem'}" :key="c.key" class="text-center" v-for="c in columns">
      <div class="headerItem">
        <i v-if="c.lock" @click="changeLockStatus(c, c.lock)" class="iconfont icon-suoding2 text-yellow font-xs cursor"></i>
        <i v-else @click="changeLockStatus(c, c.lock)" class="icon-lock-2 cursor"></i>
        {{c.text}}
        <span @click="changeSort(c.referenceTo || c.key)" :class="classNames('sort',{'d-none': !c.sort})">
        <i :class="classNames('iconfont icon-paixu icon-asc', {'text-blue-009': active(c) && order === 'asc',})" />
        <i :class="classNames('iconfont icon-paixu icon-dsc', {'text-blue-009': active(c) && order === 'desc',})" />

          <!--        <i class={descClassName} />-->
      </span>
      </div>
      <div v-if="showAdvance" class="searchWrapper">
        <div v-if="get(c,'search.type') === 'select'" class="search">
          <el-select @change="(v)=>selChange(v, c)" v-model="selValue['sel'+c.key]">
            <el-option
                :key="item.value + c.key"
                v-for="item in getSearchOptions(c)"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div v-else-if="get(c,'search.type') === 'cascader'" class="search">
          <el-cascader
              clearable
              :options="delayOptions"
              @change="(v)=>onCascadeSearch(v.join(','), get(c, 'search.searchKey') )"
          ></el-cascader>
        </div>

        <div v-else-if="get(c,'search.type') === 'time'" class="search">
          <timeInput :day="day" :onChange="(v) => timeChange(v, c.referenceTo || c.key)"></timeInput>
        </div>
        <div v-else-if="!get(c,'unConfigurable')" class="search">
          <input @input="inputChange($event, c)"></input>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {pxtorem} from "@ui_lib/viewSize";
import classNames from 'classnames';
import PostalStore from "@/ui/lib/postalStore";
import {get, isArray, isObject, map, toUpper} from 'lodash';
import timeInput from "@/ui/views/flight/components/timeInput";
import {memoryStore} from "@/worker/lib/memoryStore";
import moment from "moment";
let postalStore = new PostalStore();
export default {
  name: "flightHeader",
  props: ['columns', 'changeLockStatus', 'activeKey', 'order'],
  components: {timeInput},
  data(){
    let now = memoryStore.getItem('global').now
    return{
      inputValue: '',
      selValue: {},
      day : moment(now).format('YYYY-MM-DD')
    }
  },
  methods: {
    get,
    pxtorem,
    classNames,
    inputChange(e, col){
      let inputValue = e.target.value;
      let inputName = col.referenceTo || col.key;
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(() => {
        let query = ['delayType', 'fplRoute'].includes(inputName) ? inputValue : toUpper(inputValue);
        this.sendQuery(inputValue, inputName, { $regex: query });
        self.searchTimer = false;
      }, 800);
    },
    timeChange(v, inputName){
      this.sendQuery(v, inputName, v);
    },
    selChange(v, col){
      console.log(v)
      this.selValue['sel'+col.key] = v;
      let isRadio = get(col, 'search.radio');
      let inputName = col.referenceTo || col.key;
      let inputValue = v
      if (inputValue === 'true') inputValue = true;
      if (inputValue === 'false') inputValue = false;
      let query = { $eq: inputValue };
      if (inputName == 'mark') {
        if (inputValue == 'all') {
          this.headSearchQueries['markD'] && this.sendQuery('', 'markD', '');
          this.headSearchQueries['markV'] && this.sendQuery('', 'markV', '');
        } else {
          inputName = inputValue;
          query = { $eq: '1' };
          let oinputName = inputName == 'markD' ? 'markV' : 'markD';
          this.sendQuery(inputValue, inputName, query);
          this.headSearchQueries[oinputName] && this.sendQuery('', oinputName, '');
        }
      } else if (inputName == 'flightStatusText') {
        query = { $regex: inputValue };
        this.sendQuery(inputValue, inputName, query);
      } else if (isRadio && inputValue == '0') {
        // 处理radio查询 '否' 失败
        query = { $ne: '1' };
        this.sendQuery(inputValue, inputName, query);
      } else {
        this.sendQuery(inputValue, inputName, query);
      }
    },
    onCascadeSearch(value, key) {
      this.sendQuery(value, key, { $regex: value });
    },
    sendQuery(inputValue, inputName, query) {
      this.headSearchQueries = this.headSearchQueries || {};
      if (inputValue !== '') {
        if (isArray(inputName)) {
          this.headSearchQueries[inputName.join('-')] = query;
        } else {
          this.headSearchQueries[inputName] = query;
        }
      }
      if ((inputValue === '' || inputValue === 'all') && this.headSearchQueries[inputName]) {
        delete this.headSearchQueries[inputName];
      }
      if (isArray(inputName)) {
        if (inputValue === '' || (inputValue === 'all' && this.headSearchQueries[inputName.join('-')])) {
          delete this.headSearchQueries[inputName.join('-')];
        }
      }
      // console.log(this.headSearchQueries)
      this.sendSort({
        searchQueries: map(this.headSearchQueries, (v, key) => {
          if (key.indexOf('-') > -1) {
            return {
              $or: map(key.split('-'), (keyName) => {
                return { [keyName]: v };
              }),
            };
          } else {
            return { [key]: v };
          }
        }),
      });
    },

    sendSort(opts){
      postalStore.pub('Web', 'SendFilterOpt', opts)
    },

    getSearchOptions(col){
      let sOptions = [{ value: 'all', label: '全部' }];
      let remoteOptionField = get(col, 'search.remoteOptionField')
      let options = get(col, 'search.options');
      if (remoteOptionField) {
        map(this.$store.state.flight[remoteOptionField], (v) => {
          sOptions.push({ value: v, label: v });
        });
      } else if (options) {
        // sOptions = extend({ all: '全部' }, options);
        if (isArray(options)) {
          // sOptions = { all: '全部' };
          map(options, (v) => {
            if (isObject(v)) {
              sOptions.push(v);
              return;
            }
            sOptions.push({ value: v, label: v });
            // return (sOptions[v] = v);
          });
        } else {
          map(options, (v, k) => {
            sOptions.push({ value: k, label: v });
          });
        }
      }
      return sOptions
    },
    active(c){
      return this.activeKey === c.key || this.activeKey === c.referenceTo
    },
    changeSort(key) {
      let order;
      if (this.activeKey === key) {
        if (this.order === 'asc') {
          order = 'desc';
        }
        if (this.order === 'desc') {
          order = false;
          key = false;
        }
      } else {
        order = 'asc';
      }
      // let order = this.state.key == key ? (this.state.order == 'asc' ? 'desc' : 'asc') : 'asc';
      let sort = {
        key: key,
        order: order,
      };
      this.$emit('update:activeKey', key)
      this.$emit('update:order', order)
      if (!order && !key) {
        postalStore.pub('Web', 'SendFilterOpt', null)
      } else {
        postalStore.pub('Web', 'SendFilterOpt', {sort})
      }
    }
  },
  computed: {
    showAdvance: function (){
      return this.$store.state.flight.showAdvance
    },
    delayOptions: function (){
      return this.$store.state.flight.delayOptions
    },
  },
  mounted() {
    postalStore.sub('Web', 'ClearSort', () => {
      this.$emit('update:activeKey', '')
      this.$emit('update:order', '')
    });
    postalStore.sub('Web', 'Flight.SetDay', (v) => {
      //{day:'Today'} {day:'Today'}
      let now = memoryStore.getItem('global').now
      if (v.day === 'Tomorrow') {
        this.day = moment(now + 86400000).format('YYYY-MM-DD');
      } else if (v.day === 'Today') {
        this.day = moment(now).format('YYYY-MM-DD');
      } else {
        this.day = moment(now - 86400000).format('YYYY-MM-DD');
      }
    })
  },
  destroyed() {
    postalStore.unsubAll()
  }
}
</script>

<style scoped>

</style>