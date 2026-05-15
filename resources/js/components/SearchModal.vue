<template>
    <Transition name="modal">
        <div v-if="isVisible" class="search-overlay" @click="close">
            <div class="search-container" @click.stop>
                <div class="search-input-wrapper">
                    <input 
                        ref="searchInput"
                        v-model="query" 
                        type="text" 
                        placeholder="Поиск товаров..." 
                        class="search-input"
                        @input="search"
                        @keydown.esc="close"
                        @keydown.enter="goToResults"
                    >
                    <button class="search-close" @click="close">✕</button>
                </div>
                
                <!-- Результаты -->
                <div class="search-results" v-if="query.length >= 2">
                    <div v-if="results.length > 0" class="results-list">
                        <div 
                            v-for="product in results.slice(0, 8)" 
                            :key="product.id"
                            class="result-item"
                            @click="goToProduct(product.id)"
                        >
                            <img :src="getProductImage(product)" :alt="product.name" loading="lazy" class="result-image" @error="handleImageError">
                            <div class="result-info">
                                <span class="result-name">{{ product.name }}</span>
                                <span class="result-price">{{ product.price.toLocaleString() }} ₽</span>
                            </div>
                        </div>
                        
                        <div class="result-show-all" @click="goToResults" v-if="results.length > 8">
                            Показать все {{ results.length }} товаров
                        </div>
                    </div>
                    
                    <div v-else class="no-results">
                        Ничего не найдено
                    </div>
                </div>
                
                <!-- Популярные запросы -->
                <div class="popular-searches" v-if="query.length < 2">
                    <p class="popular-title">Популярные категории:</p>
                    <div class="popular-tags">
                        <span @click="searchCategory('t-shirts')" class="tag">Футболки</span>
                        <span @click="searchCategory('hoodies')" class="tag">Худи</span>
                        <span @click="searchCategory('accessories')" class="tag">Аксессуары</span>
                        <span @click="searchCategory('vinyl')" class="tag">Винил</span>
                        <span @click="searchCategory('cd')" class="tag">CD-диски</span>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script>
import { supabase } from '../config/supabase'

export default {
    name: 'SearchModal',
    props: {
        isVisible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close'],
    data() {
        return {
            query: '',
            results: [],
            productImagesCache: {}
        }
    },
    watch: {
        isVisible(val) {
            if (val) {
                this.$nextTick(() => {
                    this.$refs.searchInput?.focus()
                })
            } else {
                this.query = ''
                this.results = []
            }
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        
        async search() {
            if (this.query.length < 2) {
                this.results = []
                return
            }
            
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('name', `%${this.query}%`)
                    .limit(20)
                
                if (!error && data) {
                    this.results = data
                    // Загружаем главные фото для найденных товаров
                    this.loadMainImages(data)
                }
            } catch (err) {
                console.error('Ошибка поиска:', err)
            }
        },
        
        async loadMainImages(products) {
            for (const product of products) {
                try {
                    const { data } = await supabase
                        .from('product_images')
                        .select('image_url')
                        .eq('product_id', product.id)
                        .eq('is_main', true)
                        .single()
                    
                    if (data) {
                        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
                        this.productImagesCache[product.id] = `${supabaseUrl}/storage/v1/object/public/product-images/${data.image_url}`
                    }
                } catch (err) {
                    // Не найдено — будет использоваться product.image_url
                }
            }
        },
        
        getProductImage(product) {
            return this.productImagesCache[product.id] || product.image_url
        },
        
        handleImageError(event) {
            event.target.src = 'https://placehold.co/50x50/f5f5f5/0a0a0a?text=Нет+фото'
        },
        
        searchCategory(slug) {
            this.$emit('close')
            this.$router.push(`/catalog/${slug}`)
        },
        
        goToProduct(id) {
            this.$emit('close')
            this.$router.push(`/product/${id}`)
        },
        
        goToResults() {
            this.$emit('close')
            this.$router.push({ 
                path: '/catalog', 
                query: { search: this.query } 
            })
        }
    }
}
</script>

<style scoped>
.search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.98);
    z-index: 9999;
    display: flex;
    justify-content: center;
    padding-top: 120px;
}

.search-container {
    width: 100%;
    max-width: 700px;
    padding: 0 20px;
}

.search-input-wrapper {
    display: flex;
    align-items: center;
    border-bottom: 2px solid #000;
    padding-bottom: 15px;
    margin-bottom: 30px;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 24px;
    font-family: 'Inter', sans-serif;
    color: #000;
}

.search-input::placeholder {
    color: #999;
}

.search-close {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #999;
    padding: 10px;
    transition: color 0.2s;
}

.search-close:hover {
    color: #000;
}

.results-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 50vh;
    overflow-y: auto;
}

.result-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
}

.result-item:hover {
    background: #f5f5f5;
}

.result-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

.result-info {
    flex: 1;
}

.result-name {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    color: #000;
}

.result-price {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #666;
    font-weight: 600;
}

.result-show-all {
    text-align: center;
    padding: 15px;
    color: #000;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    cursor: pointer;
    border-top: 1px solid #eee;
    margin-top: 10px;
}

.no-results {
    text-align: center;
    padding: 40px;
    color: #999;
    font-family: 'Inter', sans-serif;
}

.popular-searches {
    text-align: center;
}

.popular-title {
    color: #999;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    margin-bottom: 15px;
}

.popular-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.tag {
    padding: 10px 20px;
    background: #f5f5f5;
    border-radius: 20px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    transition: all 0.2s;
}

.tag:hover {
    background: #000;
    color: #fff;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

@media (max-width: 640px) {
    .search-input {
        font-size: 18px;
    }
}
</style>