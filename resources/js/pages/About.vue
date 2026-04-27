<template>
    <div class="page">
        <div class="container">
            <h1>О нас</h1>
            <p>Магазин официального мерча музыкальной группы. Лучшее качество, уникальный дизайн.</p>
        </div>
        <DiscountBanner />
    </div>
</template>

<script>
import DiscountBanner from '../components/DiscountBanner.vue'
export default { name: 'AboutPage', components: { DiscountBanner } }
</script>

<style scoped>
.page { background: #0a0a0a; min-height: 100vh; }
.container { max-width: 800px; margin: 0 auto; padding: 3rem 2rem; }
.container h1 { color: #fff; margin-bottom: 1rem; }
.container p { color: #999; line-height: 1.8; }
</style>