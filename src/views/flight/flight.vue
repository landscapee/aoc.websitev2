<template>
    <div>
        <el-button>22222</el-button>
    </div>
</template>

<script>
    import postal from 'postal';
  export default {
    data() {
      return {}
    },
    components: {
      // 'com-glob-head': () =>
      //   import(/*webpackChunkName:"com-globHead"*/ '../components/com-glob-head'),
    },
    mounted() {



      postal.publish({
        channel: 'Worker',
        topic: 'Page.Flight.Start',
        data: ''
      })
    },
    beforeDestroy() {
      postal.publish({
        channel: 'Worker',
        topic: 'Page.Flight.Stop',
        data: ''
      })
    },
    methods: {},
  }
</script>
