<template>
    <svg class="svg-icon" aria-hidden="true" :style="{color:iconColor}">
        <use :xlink:href="'#icon-'+iconClass"></use>
    </svg>
</template>

<script>
export default {
    name: 'icon-svg',
    props: {
        iconClass: {
            type: String,
            required: true,
        },
        iconColor: {
            type: String,
            required: false,
        },
    },
}
</script>