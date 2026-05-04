<template>
    <div class="catalog-page">
        <!-- Hero секция -->
        <section class="catalog-hero" style="background-image: url('/images/catalog-hero-bg.png')">
            <div class="catalog-hero-content">
                <h1 class="catalog-hero-title">КАТАЛОГ</h1>
            </div>
            <div class="hero-divider"></div>
        </section>

        <div class="catalog-container">
            <!-- Хлебные крошки -->
            <Breadcrumbs :items="breadcrumbs" />

            <div class="catalog-layout">
                <!-- Боковая панель фильтров -->
                <aside class="filters-sidebar">
                    <!-- Коллекции -->
                    <div class="filter-group">
                        <h4>Коллекции</h4>
                        <label v-for="col in collections" :key="col.slug" class="filter-checkbox">
                            <input type="checkbox" v-model="activeFilters.collections" :value="col.slug">
                            <span>{{ col.name }}</span>
                        </label>
                    </div>

                    <!-- Категории -->
                    <div class="filter-group">
                        <h4>Категории</h4>
                        <label v-for="cat in categories" :key="cat.slug" class="filter-checkbox">
                            <input type="checkbox" v-model="activeFilters.categories" :value="cat.slug">
                            <span>{{ cat.name }}</span>
                        </label>
                    </div>

                    <!-- Цена -->
                    <div class="filter-group">
                        <h4>Цена</h4>
                        <div class="price-inputs">
                            <input type="number" v-model="activeFilters.minPrice" placeholder="0" class="price-input">
                            <span>—</span>
                            <input type="number" v-model="activeFilters.maxPrice" placeholder="100000" class="price-input">
                        </div>
                    </div>

                    <!-- Кнопка сброса фильтров -->
                    <button class="reset-filters-btn" @click="resetFilters">Сбросить фильтры</button>
                </aside>

                <!-- Основной контент -->
                <div class="catalog-content">
                    <!-- Сортировка -->
                    <div class="sort-row">
                        <span>{{ filteredProducts.length }} товаров</span>
                        <select v-model="sortBy" @change="sortProducts">
                            <option value="newest">Новинки</option>
                            <option value="price-asc">Цена: по возрастанию</option>
                            <option value="price-desc">Цена: по убыванию</option>
                            <option value="popular">Популярные</option>
                        </select>
                    </div>

                    <!-- Сетка товаров -->
                    <div class="products-grid" v-if="filteredProducts.length > 0">
                        <ProductCard 
                            v-for="product in paginatedProducts" 
                            :key="product.id" 
                            :product="product"
                        />
                    </div>
                    <div v-else class="empty">Товаров не найдено</div>

                    <!-- Пагинация -->
                    <div class="pagination" v-if="totalPages > 1">
                        <button :disabled="currentPage === 1" @click="currentPage--">←</button>
                        <button 
                            v-for="page in totalPages" :key="page"
                            :class="{ active: currentPage === page }"
                            @click="currentPage = page"
                        >{{ page }}</button>
                        <button :disabled="currentPage === totalPages" @click="currentPage++">→</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Самое популярное сейчас -->
        <PopularProducts title="Самое популярное сейчас" filter="hot" :limit="4" />

        <DiscountBanner />
    </div>
</template>

<script>
import { supabase } from '../config/supabase'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import ProductCard from '../components/ProductCard.vue'
import DiscountBanner from '../components/DiscountBanner.vue'
import PopularProducts from '../components/PopularProducts.vue'

export default {
    name: 'CatalogPage',
    components: { Breadcrumbs, ProductCard, DiscountBanner, PopularProducts },
    data() {
        return {
            allProducts: [],
            collections: [
                { id: 1, name: "THAT'S THE SPIRIT 10TH ANNIVERSARY", slug: 'thats-the-spirit' },
                { id: 2, name: 'POST HUMAN: NeX GEn', slug: 'post-human' },
                { id: 3, name: 'ERAS', slug: 'eras' },
                { id: 4, name: 'TOUR', slug: 'tour' }
            ],
            categories: [
                { id: 1, name: 'Футболки', slug: 't-shirts' },
                { id: 2, name: 'Худи и свитшоты', slug: 'hoodies' },
                { id: 3, name: 'Аксессуары', slug: 'accessories' },
                { id: 4, name: 'Винил', slug: 'vinyl' },
                { id: 5, name: 'CD-диски', slug: 'cd' }
            ],
            sortBy: 'newest',
            currentPage: 1,
            perPage: 9,
            activeFilters: {
                collections: [],
                categories: [],
                sizes: [],
                minPrice: null,
                maxPrice: null
            },
            slugToCollectionId: {
                'thats-the-spirit': 1,
                'post-human': 2,
                'eras': 3,
                'tour': 4
            },
            slugToCategoryId: {
                't-shirts': 1,
                'hoodies': 2,
                'accessories': 3,
                'vinyl': 4,
                'cd': 5
            }
        }
    },
    computed: {
        filteredProducts() {
            let result = [...this.allProducts]

            // Фильтр по коллекциям
            if (this.activeFilters.collections.length > 0) {
                const colIds = this.activeFilters.collections
                    .map(slug => this.slugToCollectionId[slug])
                    .filter(Boolean)
                if (colIds.length > 0) {
                    result = result.filter(p => p.collection_id && colIds.includes(p.collection_id))
                }
            }

            // Фильтр по категориям
            if (this.activeFilters.categories.length > 0) {
                const catIds = this.activeFilters.categories
                    .map(slug => this.slugToCategoryId[slug])
                    .filter(Boolean)
                if (catIds.length > 0) {
                    result = result.filter(p => catIds.includes(p.category_id))
                }
            }

            // Фильтр по цене
            if (this.activeFilters.minPrice !== null && this.activeFilters.minPrice !== '' && !isNaN(this.activeFilters.minPrice)) {
                result = result.filter(p => p.price >= Number(this.activeFilters.minPrice))
            }
            if (this.activeFilters.maxPrice !== null && this.activeFilters.maxPrice !== '' && !isNaN(this.activeFilters.maxPrice) && Number(this.activeFilters.maxPrice) > 0) {
                result = result.filter(p => p.price <= Number(this.activeFilters.maxPrice))
            }

            return result
        },
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.perPage
            return this.filteredProducts.slice(start, start + this.perPage)
        },
        totalPages() {
            return Math.ceil(this.filteredProducts.length / this.perPage) || 1
        },
        breadcrumbs() {
            const crumbs = []
            
            // Если активен фильтр коллекции
            if (this.activeFilters.collections.length > 0) {
                const colSlug = this.activeFilters.collections[0]
                const col = this.collections.find(c => c.slug === colSlug)
                if (col) {
                    crumbs.push({ label: col.name, link: null })
                }
            }
            
            // Если активен фильтр категории
            if (this.activeFilters.categories.length > 0) {
                const catSlug = this.activeFilters.categories[0]
                const cat = this.categories.find(c => c.slug === catSlug)
                if (cat) {
                    crumbs.push({ label: cat.name, link: null })
                }
            }
            
            // Если нет активных фильтров - просто "Каталог"
            if (crumbs.length === 0) {
                crumbs.push({ label: 'Каталог', link: null })
            }
            
            return crumbs
        }
    },
    watch: {
        activeFilters: {
            deep: true,
            handler() {
                this.currentPage = 1
                this.updateUrl()
            }
        },
        '$route'() {
            this.applyFilterFromUrl()
        }
    },
    async mounted() {
        await this.loadProducts()
        this.applyFilterFromUrl()
    },
    methods: {
        async loadProducts() {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (!error && data) {
                this.allProducts = data
            }
        },
        
        applyFilterFromUrl() {
            const path = this.$route.path
            
            // Сброс фильтров
            this.activeFilters.collections = []
            this.activeFilters.categories = []
            
            // Проверяем коллекции
            const collectionSlugs = ['thats-the-spirit', 'post-human', 'eras', 'tour']
            for (const slug of collectionSlugs) {
                if (path.includes('/catalog/' + slug)) {
                    this.activeFilters.collections = [slug]
                    return
                }
            }
            
            // Проверяем категории
            const categorySlugs = ['t-shirts', 'hoodies', 'accessories', 'vinyl', 'cd']
            for (const slug of categorySlugs) {
                if (path.includes('/catalog/' + slug)) {
                    this.activeFilters.categories = [slug]
                    return
                }
            }
        },
        
        updateUrl() {
            let newPath = '/catalog'
            
            if (this.activeFilters.collections.length > 0) {
                newPath += '/' + this.activeFilters.collections[0]
            } else if (this.activeFilters.categories.length > 0) {
                newPath += '/' + this.activeFilters.categories[0]
            }
            
            if (this.$route.path !== newPath) {
                this.$router.replace(newPath)
            }
        },
        
        resetFilters() {
            this.activeFilters = {
                collections: [],
                categories: [],
                sizes: [],
                minPrice: null,
                maxPrice: null
            }
            this.$router.push('/catalog')
        },
        
        sortProducts() {
            switch(this.sortBy) {
                case 'price-asc': 
                    this.allProducts.sort((a, b) => a.price - b.price)
                    break
                case 'price-desc': 
                    this.allProducts.sort((a, b) => b.price - a.price)
                    break
                case 'newest': 
                    this.allProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    break
            }
        }
    }
}
</script>

<style scoped>
/* HERO */
.catalog-hero {
    height: 400px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    text-align: left;
}
.catalog-hero::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
}
.catalog-hero-content {
    position: relative;
    z-index: 2;
    padding-left: 120px;
    padding-bottom: 60px;
}
.catalog-hero-title {
    font-family: 'Zen Antique', serif;
    font-size: 68px;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 5px;
    margin: 0;
    margin-top: 282.5px;
}

/* ПОЛУКРУГЛЫЙ РАЗДЕЛИТЕЛЬ */
.hero-divider {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 100vw;
    max-width: 90%;
    height: 80px;
    background: #fff;
    border-radius: 51px;
    z-index: 3;
}

.catalog-page { background: #fff; min-height: 100vh; }
.catalog-container { 
    max-width: 1200px; 
    margin: 0 auto; 
    position: relative;
    z-index: 4;
}

/* Хлебные крошки - поверх разделителя */
.catalog-container :deep(.breadcrumbs) {
    position: relative;
    z-index: 5;
    background: transparent;
    padding: 1rem 0;
    margin-bottom: 10px;
}

/* Layout */
.catalog-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 40px;
    margin-top: 10px;
    position: relative;
    z-index: 4;
}

/* Боковая панель фильтров */
.filters-sidebar {
    margin-top: 25px;
    background: #ffffff;
    border-radius: 8px;
    height: fit-content;
}

.filter-group {
    margin-bottom: 25px;
    padding-bottom: 25px;
    border-bottom: 1px solid #e0e0e0;
}

.filter-group:last-of-type {
    border-bottom: none;
    margin-bottom: 20px;
    padding-bottom: 0;
}

.filter-group h4 {
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    color: #000;
    margin-bottom: 30px;
    letter-spacing: 1px;
}

.filter-checkbox {
    display: block;
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #333;
    cursor: pointer;
    transition: color 0.2s;
}

.filter-checkbox:hover {
    color: #000;
}

.filter-checkbox input {
    margin-right: 8px;
    cursor: pointer;
}

.price-inputs {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.price-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
}

.price-input:focus {
    border-color: #000;
}

.reset-filters-btn {
    width: 100%;
    padding: 12px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background-color 0.3s;
}

.reset-filters-btn:hover {
    background: #333;
}

/* Основной контент */
.catalog-content {
    min-width: 0;
}

/* Сортировка */
.sort-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    margin-bottom: 25px;
    border-bottom: 1px solid #eee;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #666;
}
.sort-row select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
}
.sort-row select:focus {
    border-color: #000;
}

/* Товары */
.products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    justify-items: center;
}
.empty {
    text-align: center;
    padding: 60px;
    color: #999;
    font-size: 16px;
}

/* Пагинация */
.pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 40px;
}
.pagination button {
    width: 40px;
    height: 40px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.2s;
}
.pagination button.active { background: #000; color: #fff; border-color: #000; }
.pagination button:disabled { opacity: 0.3; cursor: not-allowed; }
.pagination button:hover:not(:disabled):not(.active) { border-color: #000; }

/* Адаптивность */
@media (max-width: 1024px) {
    .catalog-layout {
        grid-template-columns: 220px 1fr;
        gap: 30px;
    }
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .catalog-hero-title {
        font-size: 62px;
    }
}

@media (max-width: 768px) {
    .catalog-layout {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .filters-sidebar {
        padding: 20px;
    }
    
    .filter-group {
        margin-bottom: 20px;
        padding-bottom: 20px;
    }
    
    .catalog-hero-content {
        padding-left: 30px;
        padding-bottom: 30px;
    }
    
    .catalog-hero-title {
        font-size: 56px;
        margin-top: 200px;
    }
}

@media (max-width: 640px) {
    .products-grid {
        grid-template-columns: 1fr;
    }
    .catalog-hero-title {
        font-size: 48px;
        margin-top: 180px;
    }
    .catalog-hero-content {
        padding-left: 20px;
        padding-bottom: 20px;
    }
}

/* 1920px */
@media (min-width: 1920px) {
    .hero-divider {
        width: 1920px;
    }
}

/* 1440px */
@media (min-width: 1440px) and (max-width: 1919px) {
    .hero-divider {
        width: 1920px;
    }
}

/* 1200px */
@media (min-width: 1200px) and (max-width: 1439px) {
    .hero-divider {
        width: 900px;
    }
}

/* 1024px (планшеты горизонтально) */
@media (min-width: 1024px) and (max-width: 1199px) {
    .hero-divider {
        width: 760px;
    }
}

/* 768px (планшеты вертикально) */
@media (min-width: 768px) and (max-width: 1023px) {
    .hero-divider {
        width: 90%;
        height: 60px;
        bottom: -30px;
        border-radius: 40px;
    }
}

/* 480px (большие телефоны) */
@media (min-width: 480px) and (max-width: 767px) {
    .hero-divider {
        width: 92%;
        height: 50px;
        bottom: -25px;
        border-radius: 30px;
    }
}

/* 320px (маленькие телефоны) */
@media (max-width: 479px) {
    .hero-divider {
        width: 94%;
        height: 40px;
        bottom: -20px;
        border-radius: 25px;
    }
}
</style>