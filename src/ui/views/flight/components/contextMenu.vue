<template>
  <div ref="root" :class="classNames('contextMenu', {'d-none': !show})">
    <div @click="clickItem(item.name, flight)" class="contextItem" v-for="item in menus">
      <i :class="classNames(`iconfont icon-${item.icon}`)" />
      <span> {{ item.text }} </span>
    </div>
  </div>
</template>

<script>
import classNames from "classnames";
import PostalStore from "@/ui/lib/postalStore";
let postalStore = new PostalStore();
const menus = {
  publish: { icon: 'daochu', name: 'publish', text: '批量添加到关注池' },
  unSelectAll: { icon: 'guanbi01', name: 'unSelectAll', text: '批量取消选择' },
  selectAll: { icon: 'gouxuan01', name: 'selectAll', text: '批量选择' },
};
export default {
  name: "contextMenu",
  props: ['clickItem'],
  data(){
    return{
      menus,
      show: false,
      flight: {}
    }
  },
  mounted() {
    postalStore.sub('Web', 'OnContextMenu', data => {
      this.show = true
      let e = data.event;
      this.flight = data.flight
      this.handleContextMenu(e.clientX, e.clientY)
    });

    document.addEventListener('click', this._handleClick);
    document.addEventListener('scroll', this._handleScroll);
  },
  destroyed() {
    document.removeEventListener('click', this._handleClick);
    document.removeEventListener('scroll', this._handleScroll);
  },
  methods: {
    classNames,
    _handleClick(e){
      const wasOutside = !(e.target.contains === this.$refs.root);
      (wasOutside && this.show) && (this.show = false)
    },
    _handleScroll(){
      this.show = false
    },
    handleContextMenu(clientX, clientY){
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const rootW = this.$refs.root.offsetWidth;
      const rootH = this.$refs.root.offsetHeight;

      const right = screenW - clientX > rootW;
      const left = !right;
      const top = screenH - clientY > rootH;
      const bottom = !top;

      if (right) {
        this.$refs.root.style.left = `${clientX + 5}px`;
      }

      if (left) {
        this.$refs.root.style.left = `${clientX - rootW - 5}px`;
      }

      if (top) {
        this.$refs.root.style.top = `${clientY + 5}px`;
      }

      if (bottom) {
        this.$refs.root.style.top = `${clientY - rootH - 5}px`;
      }
    }
  }
}
</script>

<style scoped>

</style>