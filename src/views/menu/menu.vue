<template>
    <div>
        <el-button @click="toPage">1111</el-button>
    </div>
</template>

<script>
export default {
    methods: {
        toPage() {
            this.$router.push('/flight')
        },
    },
}
</script>
