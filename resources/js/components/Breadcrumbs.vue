<template>
    <nav class="breadcrumbs">
        <router-link to="/">Главная</router-link>
        <span class="separator">/</span>
        <template v-for="(crumb, index) in items" :key="index">
            <router-link v-if="crumb.link" :to="crumb.link">{{ crumb.label }}</router-link>
            <span v-else class="current">{{ crumb.label }}</span>
            <span v-if="index < items.length - 1" class="separator">/</span>
        </template>
    </nav>
</template>

<script>
export default {
    name: 'Breadcrumbs',
    props: {
        items: {
            type: Array,
            required: true
            // [{ label: 'Каталог', link: '/catalog' }, { label: 'Футболки', link: null }]
        }
    }
}
</script>

<style scoped>
.breadcrumbs {
    padding: 1rem 0;
    font-size: 0.85rem;
    color: #999;
}

.breadcrumbs a {
    color: #999;
    text-decoration: none;
    transition: color 0.3s;
}

.breadcrumbs a:hover {
    color: #4b4b4b;
}

.separator {
    margin: 0 0.5rem;
    color: #555;
}

.current {
    color: #000000;
}
</style>