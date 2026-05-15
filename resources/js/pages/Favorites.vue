<template>
    <div class="page">
        <div class="container">
            <!-- Хлебные крошки -->
            <Breadcrumbs :items="breadcrumbs" />
            <h1>Избранное</h1>
            <div class="products-grid" v-if="favStore.items.length > 0">
                <ProductCard 
                    v-for="product in favStore.items" 
                    :key="product.id" 
                    :product="product"
                />
            </div>
            <p v-else class="empty">Нет избранных товаров</p>
        </div>
        <DiscountBanner />
    </div>
</template>

<script>
import { useFavoritesStore } from '../stores/favorites'
import { inject } from 'vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import ProductCard from '../components/ProductCard.vue'
import DiscountBanner from '../components/DiscountBanner.vue'


export default {
    name: 'FavoritesPage',
    components: { Breadcrumbs, ProductCard, DiscountBanner },
    inject: ['notify'],
    data() {
        return { favStore: useFavoritesStore() }
    },
    computed: {
        breadcrumbs() { return [{ label: 'Избранное', link: null }] }
    },
    methods: {
        toggleFavorite(product) {
            const favStore = useFavoritesStore()
            favStore.toggleFavorite(product)
            if (favStore.isFavorite(product.id)) {
                this.notify.success('В избранном!', product.name)
            } else {
                this.notify.info('Удалено', 'Товар удален из избранного')
            }
        }
    }
}
</script>

<style scoped>
.page { background: #fff; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; }
.container h1 { 
    font-family: 'Raleway', sans-serif; 
    color: #0a0a0a; 
    margin-top: 30px;
    margin-bottom: 30px; 
    font-size: 48px; 
}

/* 4 колонки на десктопе */
.products-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 20px; 
}
.empty { 
    color: #999; 
    text-align: center; 
    padding: 64px; 
    font-size: 18px; 
}

/* ========== АДАПТИВ ========== */

/* Планшеты (1024px) - 3 колонки */
@media (max-width: 1024px) {
    .container { padding: 40px 20px; }
    .container h1 { font-size: 40px; }
    .products-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }
}

/* Планшеты вертикально (780px) - 2 колонки */
@media (max-width: 780px) {
    .container { padding: 30px 20px; }
    .container h1 { font-size: 32px; margin: 25px 0; }
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
    .empty { padding: 48px; font-size: 16px; }
}

/* Мобильные телефоны (480px) - 2 колонки */
@media (max-width: 480px) {
    .container { padding: 20px 15px; }
    .container h1 { font-size: 28px; margin: 20px 0; }
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    .empty { padding: 40px; font-size: 14px; }
}

/* Очень маленькие (390px) - 2 колонки */
@media (max-width: 390px) {
    .container { padding: 15px 12px; }
    .container h1 { font-size: 24px; margin: 15px 0; }
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
    .empty { padding: 30px; font-size: 14px; }
}
</style>