<template>
    <div class="component-scroll-container" ref="coScrollBox">
        <div class="co-scroll-view-container" ref="coScrollView"
             :style="{transform:`translate(${-wtop}%, ${-htop}%)`}"
        >
            <slot></slot>
        </div>
        <div class="co-scroll_landscape_track" v-show="scrollSwitchX">
            <div class="co-scroll_thumb" :class="[coScrollThumbActive(0)]" ref="coScrollLThumb" :style="{width:`${wratio*100}%`, transform:`translateX(${wScrollOffset || 0}%)`}"></div>
        </div>
        <div class="co-scroll_portrait_track" v-show="scrollSwitchY">
            <div class="co-scroll_thumb" :class="coScrollThumbActive(1)" ref="coScrollPThumb" :style="{height:`${hratio*100}%`, transform:`translateY(${hScrollOffset || 0}%)`}"></div>
        </div>
    </div>
</template>

<script>
    import { extend, map, debounce } from 'lodash';
    export default {
        name:'ScrollBox',
        props: {
            scrollConfig: {
                type: Array
            },
            loaded: {
                type: Boolean
            },
            resize: {
                type: Boolean
            },
            sWidth: {
                type:Number
            },
        },
        data() {
            return {
                log: new this.$logger('component.scrollbox'),
                scrollSwitchX:false,
                scrollSwitchY:false,
                wratio:0,
                hratio:0,
                container:null,
                view:null,
                box:null,
                thumbX:null,
                thumbY:null,
                vr:null,
                br:null,
                ltt:0,
                ptt:0,
                htop:0,
                wtop:0,
                hScrollOffset:0,
                wScrollOffset:0,
                dragX:false,
                dragY:false,
                activeX: false,
                activeY: false,
                activeStatus:false,
                activeTimer:null,
                pmx:null,
                pmy:null,

            }
        },
        watch: {
            '$route': {
                handler(to) {
                    this.init();
                },
                immediate: true
            },
            resize: {
                handler(status){
                    if(status) {
                        this.init(true);
                    }
                },
                immediate:true
            },
            loaded: {
                handler(status){
                    if(status) {
                        this.init();
                    }
                },
                immediate:true
            },
            sWidth: {
                handler(w){
                    if(w) {
                    }
                },
                immediate:true
            }
        },
        mounted() {
            this.view = this.$refs['coScrollView'];
            this.box = this.$refs['coScrollBox'];
            this.thumbX = this.$refs['coScrollLThumb'];
            this.thumbY = this.$refs['coScrollPThumb'];

            this.view.addEventListener('mousewheel', this.handleMouseWheel);
            this.thumbX.addEventListener('mousedown', this.thumbXMouseDown);
            this.thumbY.addEventListener('mousedown', this.thumbYMouseDown);
            document.body.addEventListener('mouseup', this.handleMouseUp);
            document.body.addEventListener('mousemove', this.handleMouseMove);
            // this.initDynamicTable();
        },
        beforeDestroy() {
            this.view.removeEventListener('mousewheel', this.handleMouseWheel);
            this.thumbX.removeEventListener('mousedown', this.thumbXMouseDown);
            this.thumbY.removeEventListener('mousedown', this.thumbYMouseDown);
            document.body.removeEventListener('mouseup', this.handleMouseUp);
            document.body.removeEventListener('mousemove', this.handleMouseMove);
        },
        methods: {
            // initDynamicTable() {
            //     let trs = this.view.getElementsByTagName('tr');
            //     if(trs.length > 0) {
            //         map(trs, row => {
            //             let nodes = row.querySelectorAll('.adv-body-col');
            //             map(nodes, node => {
            //                 node.dataset.html = node.innerHTML;
            //                 if(tr.top > rr.top + rr.height || rr.bottom - rr.height > tr.bottom) {
            //                     node.innerHTML = '';
            //                 }
            //             });
            //         })
            //     }
            // },
            // dynamicDisplayTable() {
            //     let trs = this.view.getElementsByTagName('tr');
            //     if(trs.length > 0) {
            //         map(trs, row => {
            //             let tr = this.view.parentNode.getBoundingClientRect();
            //             let rr = row.getBoundingClientRect();
            //             let nodes = row.querySelectorAll('.adv-body-col');
            //             map(nodes, node => {
            //                 if(tr.top > rr.top + rr.height || rr.bottom - rr.height > tr.bottom) {
            //                     node.innerHTML = '';
            //                 }
            //
            //                 if(!node.innerHTML && node.dataset.html){
            //                     node.innerHTML = node.dataset.html;
            //                 }
            //             });
            //         })
            //     }
            // },
            handleMouseWheel(e) {
                e.preventDefault();
                this.activeStatus = true;
                this.moveThumb(e.deltaX*0.4, e.deltaY*0.4)
                // this.dynamicDisplayTable();
                if(this.activeTimer) {
                    clearTimeout(this.activeTimer);
                }
                this.activeTimer = setTimeout(() => {
                    this.activeX = false;
                    this.activeY = false;
                    this.activeStatus = false;
                }, 1000);
            },
            thumbXMouseDown(e) {
                this.dragX = true;
                this.activeStatus = true;
            },
            thumbYMouseDown(e) {
                this.dragY = true;
                this.activeStatus = true;
            },
            handleMouseUp(e)  {
                this.dragX = false;
                this.dragY = false;

                if(this.activeTimer) {
                    clearTimeout(this.activeTimer);
                }
                this.activeTimer = setTimeout(() => {
                    this.activeX = false;
                    this.activeY = false;
                    this.activeStatus = false;
                }, 2000);
            },
            handleMouseMove(e) {
                if(this.dragX) {
                    e.preventDefault();
                    this.moveThumb(e.movementX, 0)
                    this.activeX = true;
                }

                if(this.dragY) {
                    e.preventDefault();
                    this.moveThumb(0, e.movementY)
                    this.activeY = true;
                }
            },
            init(resize) {
                if(resize) {
                    extend(this, {
                        ltt:this.ltt || 0,
                        ptt:this.ptt || 0,
                        htop:this.htop || 0,
                        wtop:this.wtop || 0,
                        hScrollOffset:this.hScrollOffset || 0,
                        wScrollOffset:this.wScrollOffset || 0,
                    });
                }else {
                    extend(this, {
                        ltt: 0,
                        ptt: 0,
                        htop: 0,
                        wtop: 0,
                        hScrollOffset: 0,
                        wScrollOffset: 0,
                    });

                }


                if(!this.view || !this.box) {
                    setTimeout(() => {
                        this.init();
                    }, 1000);
                    return;
                }

                // let crt = this.view.childNodes[0].getBoundingClientRect();
                // this.view.style['width'] = crt.width/13.76 + 'rem';
                // this.view.style['height'] = crt.height/13.76 + 'rem';
                // this.log.info('crt', crt, this.box.getBoundingClientRect())
                // let h;
                // if(this.vr) {
                //     h = this.vr.height;
                // }

                this.vr = this.view.getBoundingClientRect();
                this.br = this.box.getBoundingClientRect();


                if(this.scrollConfig[1]) {
                    this.hratio = this.br.height/this.vr.height;

                    if(this.hratio >= 1) {
                        this.hratio = 1;
                        this.scrollSwitchY = false;
                    }else {
                        this.scrollSwitchY = true;
                    }
                }

                if(this.scrollConfig[0]) {
                    // this.wratio = this.br.width/this.vr.width;
                    this.wratio = this.br.width/(this.sWidth || this.vr.width);
                    this.log.info('scroll', this.wratio, this.sWidth)
                    if(this.wratio >= 1) {
                        this.wratio = 1;
                        this.scrollSwitchX = false;
                    }else {
                        this.scrollSwitchX = true;
                    }
                }

            },
            moveThumb(mx, my) {
                if(this.scrollConfig[1] && this.br) {
                    this.activeY = true;
                    this.ptt = this.ptt + my < 0 ? 0 : this.ptt + my;

                    if(this.ptt/this.br.height > (1 - this.hratio)) {
                        this.ptt = this.br.height*(1 - this.hratio);
                    }

                    // if(this.ptt/this.br.height > (1 - this.hratio - 0.2)) {
                    //     this.$emit('handlePageLoad');
                    // }

                    this.htop = this.ptt / (this.br.height) * 100;
                    this.hScrollOffset = this.htop/this.hratio;
                }

                if(this.scrollConfig[0] && this.br) {
                    this.activeX = true;
                    this.ltt = this.ltt + mx < 0 ? 0 : this.ltt + mx;
                    if(this.ltt/this.br.width > (1 - this.wratio)) {
                        this.ltt = this.br.width*(1 - this.wratio);
                    }
                    this.wtop = this.ltt / (this.br.width) * 100;
                    this.wScrollOffset = this.wtop/this.wratio;
                    this.$emit('handleXThumbOffset', this.wScrollOffset);
                }

            },
            coScrollThumbActive(t) {
                if(t == 0) {
                    return this.activeX ? 'co-s_active':'';
                }

                if(t == 1) {
                    return this.activeY ? ['co-s_active']:[];
                }
            },
        }
    }
</script>

<style lang="scss">
.component-scroll-container {
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    overflow:hidden;

    .co-scroll-view-container {
        position:relative;
        overflow:hidden;
        display:inline-block;
        min-width: 100%;
    }

    .co-scroll_portrait_track {
        position:absolute;
        top:0;
        right:0;
        bottom:0;
        width:10px;
        z-index:1;
        /*background-color:rgba(0,0,0, .5);*/

        .co-scroll_thumb {
            position:absolute;
            top:0;
            right:0;
            width:8px;
            background-color:rgba(25, 25, 25, .1);
            border-radius:8px;
            /*transition:background-color .1s linear;*/
        }

        .co-s_active {
            background-color:rgba(25, 25, 25, .7);
        }
    }

    .co-scroll_landscape_track {
        position:absolute;
        bottom:0;
        right:0;
        left:0;
        height:15px;
        z-index:1;

        .co-scroll_thumb {
            position:absolute;
            top:0;
            bottom:0;
            height:13px;
            background-color:rgba(25, 25, 25, .1);
            border-radius:8px;
            /*transition:background-color .1s linear;*/
        }

        .co-s_active {
            background-color:rgba(25, 25, 25, .7);
        }
    }
}
</style>
