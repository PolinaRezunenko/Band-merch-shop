<template>
    <div class="category-page">
        <div class="category-container">
            <Breadcrumbs :items="breadcrumbs" />
            
            <h1 class="category-title">{{ categoryName }}</h1>

            <div class="category-layout">
                <FilterSidebar :current-category="$route.params.category" @filter-change="applyFilters" />

                <div class="category-products">
                    <div class="products-toolbar">
                        <span class="products-count">{{ filteredProducts.length }} товаров</span>
                        <select v-model="sortBy" class="sort-select" @change="sortProducts">
                            <option value="newest">Новинки</option>
                            <option value="price-asc">Цена: по возрастанию</option>
                            <option value="price-desc">Цена: по убыванию</option>
                            <option value="popular">Популярные</option>
                        </select>
                    </div>

                    <div class="products-grid" v-if="filteredProducts.length > 0">
                        <ProductCard 
                            v-for="product in filteredProducts" 
                            :key="product.id" 
                            :product="product"
                        />
                    </div>
                    <div v-else class="empty">Товаров не найдено</div>
                </div>
            </div>
        </div>

        <DiscountBanner />
    </div>
</template>

<script>
import { supabase } from '../config/supabase'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import FilterSidebar from '../components/FilterSidebar.vue'
import ProductCard from '../components/ProductCard.vue'
import DiscountBanner from '../components/DiscountBanner.vue'

const CATEGORY_NAMES = {
    't-shirts': 'Футболки',
    'hoodies': 'Худи и свитшоты',
    'accessories': 'Аксессуары',
    'vinyl': 'Винил',
    'cd': 'CD-диски'
}

const SLUG_TO_CATEGORY_ID = {
    't-shirts': 1,
    'hoodies': 2,
    'accessories': 3,
    'vinyl': 4,
    'cd': 5
}

export default {
    name: 'CatalogCategoryPage',
    components: {
        Breadcrumbs,
        FilterSidebar,
        ProductCard,
        DiscountBanner
    },
    data() {
        return {
            products: [],
            sortBy: 'newest',
            filters: {
                sizes: [],
                minPrice: null,
                maxPrice: null
            }
        }
    },
    computed: {
        categorySlug() {
            return this.$route.params.category
        },
        categoryName() {
            return CATEGORY_NAMES[this.categorySlug] || 'Категория'
        },
        breadcrumbs() {
    return [
        { label: 'Каталог', link: '/catalog' },
        { label: this.categoryName, link: null }
    ]
},
        filteredProducts() {
            let result = [...this.products]
            
            if (this.filters.sizes.length > 0) {
                result = result.filter(p => 
                    p.sizes && p.sizes.some(s => this.filters.sizes.includes(s))
                )
            }
            
            if (this.filters.minPrice !== null) {
                result = result.filter(p => p.price >= this.filters.minPrice)
            }
            if (this.filters.maxPrice !== null && this.filters.maxPrice > 0) {
                result = result.filter(p => p.price <= this.filters.maxPrice)
            }
            
            return result
        }
    },
    watch: {
        '$route.params.category'() {
            this.loadProducts()
        }
    },
    async mounted() {
        await this.loadProducts()
    },
    methods: {
        async loadProducts() {
            const categoryId = SLUG_TO_CATEGORY_ID[this.categorySlug]
            
            try {
                let query = supabase.from('products').select('*')
                
                if (categoryId) {
                    query = query.eq('category_id', categoryId)
                }
                
                const { data, error } = await query.order('created_at', { ascending: false })
                
                if (error) throw error
                
                this.products = data || []
            } catch (err) {
                console.error('Ошибка загрузки товаров:', err)
                this.products = []
            }
        },
        applyFilters(filters) {
            this.filters = filters
        },
        sortProducts() {
            switch(this.sortBy) {
                case 'price-asc':
                    this.products.sort((a, b) => a.price - b.price)
                    break
                case 'price-desc':
                    this.products.sort((a, b) => b.price - a.price)
                    break
                case 'newest':
                    this.products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    break
            }
        },

    }
}
</script>

<style scoped>
.category-page {
    background: #fff;
    min-height: 100vh;
}

.category-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem 3rem;
}

.category-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: #0a0a0a;
    margin-bottom: 2rem;
    letter-spacing: 3px;
    text-transform: uppercase;
}

.category-layout {
    display: flex;
    gap: 2rem;
}

.category-products {
    flex: 1;
}

.products-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}

.products-count {
    color: #666;
    font-size: 0.9rem;
}

.sort-select {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: #fff;
    color: #333;
    font-size: 0.85rem;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.empty {
    text-align: center;
    padding: 3rem;
    color: #999;
    font-size: 1.1rem;
}

@media (max-width: 1024px) {
    .category-layout {
        flex-direction: column;
    }
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .products-grid {
        grid-template-columns: 1fr;
    }
}
</style>