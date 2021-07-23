<template>
  <input @blur="onBlur" @keydown.enter="onBlur" type="text">
</template>

<script>
import {some} from "lodash";

export default {
  name: "timeInput",
  props:['onChange', 'day'],
  data(){
    return{
      
    }
  },
  methods:{
    onBlur(e) {
      const testCfg = [{ query: '$gt', reg: new RegExp(/^>(20|21|22|23|[0-1]\d)[0-5]\d$/) }, { query: '$gte', reg: new RegExp(/^>=(20|21|22|23|[0-1]\d)[0-5]\d$/) }, { query: '$lt', reg: new RegExp(/^<(20|21|22|23|[0-1]\d)[0-5]\d$/) }, { query: '$lte', reg: new RegExp(/^<=(20|21|22|23|[0-1]\d)[0-5]\d$/) }, { query: '$eq', reg: new RegExp(/^(20|21|22|23|[0-1]\d)[0-5]\d$/) }, { query: '$between', reg: new RegExp(/^(20|21|22|23|[0-1]\d)[0-5]\d-(20|21|22|23|[0-1]\d)[0-5]\d$/) }];
      
      let tar,
          value,
          result = {};
      let onCh = this.onChange;
      tar = e.target;
      value = tar.value;

      if (value == '') {
        onCh && onCh('');
        return;
      }

      let query;
      some(testCfg, (test) => {
        let right = test.reg.test(value);
        if (right) {
          query = test.query;
        }
        return right;
      });
      if (query) {
        if (query == '$between') {
          let start = value.split('-')[0];
          start = start.slice(0, 2) + ':' + start.slice(2, 4);
          start = Date.parse(`${this.day} ${start}`);

          let end = value.split('-')[1];
          end = end.slice(0, 2) + ':' + end.slice(2, 4);
          end = Date.parse(`${this.day} ${end}`);

          if (start >= end) end = end + 86400000;
          result[query] = [start, end];
        } else {
          let time = value.match(/\d+/g)[0];
          time = time.slice(0, 2) + ':' + time.slice(2, 4);
          result[query] = Date.parse(`${this.day} ${time}`);
        }
      } else {
        result = false;
      }

      onCh && onCh(result);
    }
  }
}
</script>

<style scoped>

</style>