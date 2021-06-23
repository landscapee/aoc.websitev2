<template>
    <div class="reduceFlightLists showBox">
        <div class="title">
            <div class="name alib">调减航班</div>
            <div class="title_right fo">
                <span class="fo">20</span>/50
            </div>
        </div>

        <div class="content">
            <div id="flightDelay_charts"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.reduceFlightLists {
    margin: 15px 0;
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        .name {
            color: #fff;
            line-height: 30px;
            display: flex;
            align-items: center;
            margin-right: 15px;
            font-size: 18px;
        }
        .name:before {
            content: '';
            display: inline-block;
            height: 16px;
            width: 4px;
            background: #0566ff;
            border-radius: 1px;
            margin-right: 5px;
        }
        .title_right {
            span {
                color: #0566ff;
            }
        }
    }
}
</style>