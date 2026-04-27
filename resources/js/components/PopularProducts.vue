<template>
    <section class="section-popular" v-if="products.length > 0">
        <div class="section-container">
            <h2 class="section-title">{{ title }}</h2>
            <div class="products-grid">
                <ProductCard 
                    v-for="product in products" 
                    :key="product.id" 
                    :product="product"
                />
            </div>
        </div>
    </section>
</template>

<script>
import { supabase } from '../config/supabase'
import ProductCard from './ProductCard.vue'

export default {
    name: 'PopularProducts',
    components: { ProductCard },
    props: {
        title: {
            type: String,
            default: 'Самое популярное сейчас'
        },
        filter: {
            type: String,
            default: 'all'  // 'all', 'hot', 'new'
        },
        limit: {
            type: Number,
            default: 4
        }
    },
    data() {
        return { products: [] }
    },
    async mounted() {
        try {
            let query = supabase.from('products').select('*')
            
            if (this.filter === 'hot') {
                query = query.eq('is_hot', true)
            } else if (this.filter === 'new') {
                query = query.eq('is_new', true)
            }
            
            const { data, error } = await query.limit(this.limit)
            
            if (error) throw error
            this.products = data || []
        } catch (err) {
            console.error('Ошибка загрузки товаров:', err)
        }
    }
}
</script>

<style scoped>
.section-popular {
    background: #ffffff;
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 0;
}

.section-container {
    max-width: 1200px;
    margin: 0 auto;
}

.section-title {
    font-family: 'Ruberoid', sans-serif;
    font-weight: 500;
    font-size: 40px;
    color: #0a0a0a;
    letter-spacing: -0.5px;
    position: relative;
    display: inline-block;
    margin-bottom: 32px;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 2px;
    background: #000000;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

@media (max-width: 768px) {
    .products-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
    .products-grid { grid-template-columns: 1fr; }
}
</style>