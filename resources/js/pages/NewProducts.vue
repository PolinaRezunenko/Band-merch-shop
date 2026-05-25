<template>
    <div class="new-products-page">
        <div class="new-products-container">
            <Breadcrumbs :items="[{ label: 'Новинки', link: null }]" />
            
            <h1>Новинки</h1>
            <p class="subtitle">Самые свежие поступления мерча Bring Me The Horizon</p>
            
            <div class="products-grid" v-if="products.length > 0">
                <ProductCard 
                    v-for="product in products" 
                    :key="product.id" 
                    :product="product"
                />
            </div>
            
            <div v-else class="empty">
                <p>Новинок пока нет</p>
                <router-link to="/catalog" class="btn-catalog">Перейти в каталог</router-link>
            </div>
        </div>
        
        <DiscountBanner />
    </div>
</template>

<script>
import { supabase } from '../config/supabase'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import ProductCard from '../components/ProductCard.vue'
import DiscountBanner from '../components/DiscountBanner.vue'

export default {
    name: 'NewProductsPage',
    components: { Breadcrumbs, ProductCard, DiscountBanner },
    data() {
        return {
            products: [],
            loading: true
        }
    },
    async mounted() {
        await this.loadNewProducts()
    },
    methods: {
        async loadNewProducts() {
            const { data } = await supabase
                .from('products')
                .select('id, name, price, old_price, image_url, is_new, is_hot, sizes')
                .eq('is_new', true)
                .order('created_at', { ascending: false })
                .limit(12)
            this.products = data || []
            this.loading = false
        }
    }
}
</script>

<style scoped>
.new-products-page { background: #fff; min-height: 100vh; }
.new-products-container { max-width: 1200px; margin: 0 auto; }

h1 {
    font-family: 'Raleway', sans-serif; 
    color: #0a0a0a; 
    margin-top: 30px;
    margin-bottom: 30px; 
    font-size: 48px; 
}

.subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #666;
    margin-bottom: 40px;
}

/* 4 колонки на десктопе */
.products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.empty {
    text-align: center;
    padding: 80px 20px;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    color: #999;
}

.btn-catalog {
    display: inline-block;
    margin-top: 20px;
    padding: 14px 40px;
    background: #000;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background 0.3s;
}
.btn-catalog:hover { background: #333; }

@media (max-width: 1024px) {
    .new-products-container { padding: 40px 20px; }
    .products-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }
    h1 { font-size: 40px; }
}

@media (max-width: 780px) {
    .new-products-container { padding: 30px 20px; }
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
    h1 { font-size: 32px; }
    .subtitle { font-size: 14px; margin-bottom: 30px; }
}

@media (max-width: 480px) {
    .new-products-container { padding: 20px 15px; }
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    h1 { font-size: 28px; margin: 20px 0; }
    .subtitle { font-size: 13px; margin-bottom: 20px; }
}

@media (max-width: 390px) {
    .new-products-container { padding: 15px 12px; }
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
    h1 { font-size: 24px; }
}
</style>