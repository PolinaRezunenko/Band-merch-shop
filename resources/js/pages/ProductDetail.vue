<template>
    <div class="product-page" v-if="!loading">
        <!-- Хлебные крошки -->
        <div class="breadcrumbs-wrapper">
            <div class="breadcrumbs-container">
                <Breadcrumbs :items="breadcrumbs" />
            </div>
        </div>

        <div class="product-container">
            <div class="product-layout">
                <!-- Левая колонка: Галерея -->
                <div class="product-gallery-col">
                    <!-- Главное изображение -->
                    <div class="main-image-wrapper">
                        <img 
                            :src="currentImage" 
                            :alt="product.name" 
                            class="main-image"
                        >
                    </div>

                    <!-- Слайдер миниатюр -->
                    <div class="thumbnail-slider" v-if="productImages.length > 1">
                        <button 
                            v-for="(img, index) in productImages" 
                            :key="index"
                            :class="['thumbnail-btn', { active: currentImageIndex === index }]"
                            @click="currentImageIndex = index"
                        >
                            <img :src="img" :alt="product.name + ' ' + (index + 1)" class="thumbnail-img">
                        </button>
                    </div>
                </div>

                <!-- Правая колонка: Информация -->
                <div class="product-info-col">
                    <!-- Название -->
                    <h1 class="product-title">{{ product.name }}</h1>
                    
                    <!-- Описание -->
                    <p class="product-description">{{ product.description }}</p>
                    
                    <!-- Характеристики -->
                    <div class="product-details">
                        <p>100 % хлопок.</p>
                        <p>Стирка при 30 °C с вещами похожего цвета. Не сушить в стиральной машине. Гладить с изнаночной стороны на низкой температуре.</p>
                    </div>

                    <!-- Таблица размеров -->
                    <div class="size-guide">
                        <button @click="showSizeTable = !showSizeTable" class="size-table-link">
                            Таблица размеров {{ showSizeTable ? '▲' : '▼' }}
                        </button>
                        
                        <div v-if="showSizeTable" class="size-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Размер</th>
                                        <th>S</th>
                                        <th>M</th>
                                        <th>L</th>
                                        <th>XL</th>
                                        <th>XXL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Грудь (см)</td>
                                        <td>48-50</td>
                                        <td>51-53</td>
                                        <td>54-56</td>
                                        <td>57-59</td>
                                        <td>60-62</td>
                                    </tr>
                                    <tr>
                                        <td>Длина (см)</td>
                                        <td>66-68</td>
                                        <td>69-71</td>
                                        <td>72-74</td>
                                        <td>75-77</td>
                                        <td>78-80</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Выбор размера -->
                    <div class="product-size" v-if="product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Универсальный'">
                        <h4>Размер</h4>
                        <div class="size-options">
                            <button 
                                v-for="size in product.sizes" 
                                :key="size"
                                :class="['size-btn', { active: selectedSize === size }]"
                                @click="selectedSize = size"
                            >
                                {{ size }}
                            </button>
                        </div>
                    </div>

                    <!-- Цена и корзина -->
                    <div class="product-price-block">
                        <div class="price-row">
                            <span class="current-price">{{ formatPrice(product.price) }} ₽</span>
                            <span v-if="product.old_price" class="old-price">{{ formatPrice(product.old_price) }} ₽</span>
                        </div>
                    </div>

                    <!-- Действия -->
                    <div class="product-actions">
                        <QuantityCounter v-model="quantity" />
                        <button class="btn-add-to-cart" @click="addToCart">
                            В корзину
                        </button>
                    </div>

                    <!-- Доставка -->
                    <div class="delivery-info">
                        <p>🚚 Бесплатная доставка при заказе от 5 000 ₽</p>
                        <p>📦 Доставка: 3-7 рабочих дней</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Самое популярное -->
        <PopularProducts />
        
        <!-- Скидка -->
        <DiscountBanner />
    </div>
    
    <div v-else class="loading-page">
        <p>Загрузка товара...</p>
    </div>
</template>

<script>
import { supabase } from '../config/supabase'
import { useCartStore } from '../stores/cart'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import QuantityCounter from '../components/QuantityCounter.vue'
import PopularProducts from '../components/PopularProducts.vue'
import DiscountBanner from '../components/DiscountBanner.vue'

export default {
    name: 'ProductDetailPage',
    components: {
        Breadcrumbs,
        QuantityCounter,
        PopularProducts,
        DiscountBanner
    },
    data() {
        return {
            product: {},
            selectedSize: null,
            quantity: 1,
            loading: true,
            showSizeTable: false,
            isFavorite: false,
            currentImageIndex: 0,
            productImages: []
        }
    },
    computed: {
        currentImage() {
            return this.productImages[this.currentImageIndex] || this.product.image_url
        },
        breadcrumbs() {
            const catNames = { 
                1: 'Футболки', 
                2: 'Худи и свитшоты', 
                3: 'Аксессуары', 
                4: 'Винил', 
                5: 'CD-диски' 
            }
            const catSlugs = { 
                1: 't-shirts', 
                2: 'hoodies', 
                3: 'accessories', 
                4: 'vinyl', 
                5: 'cd' 
            }
            
            const crumbs = [
                { label: 'Каталог', link: '/catalog' }
            ]
            
            // Добавляем коллекцию если есть
            if (this.product.collection_name) {
                crumbs.push({ 
                    label: this.product.collection_name, 
                    link: null 
                })
            }
            
            // Добавляем категорию
            if (this.product.category_id) {
                crumbs.push({ 
                    label: catNames[this.product.category_id] || 'Каталог', 
                    link: '/catalog/' + (catSlugs[this.product.category_id] || '') 
                })
            }
            
            // Добавляем название товара
            crumbs.push({ 
                label: this.product.name || 'Товар', 
                link: null 
            })
            
            return crumbs
        }
    },
    async mounted() {
        await this.loadProduct()
        window.scrollTo(0, 0)
    },
    methods: {
        async loadProduct() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, collections(name)')
                    .eq('id', this.$route.params.id)
                    .single()
                
                if (error) throw error
                
                if (data) {
                    this.product = data
                    // Добавляем имя коллекции
                    if (data.collections) {
                        this.product.collection_name = data.collections.name
                    }
                    
                    // Создаем массив изображений
                    this.productImages = [
                        data.image_url,
                        data.image_url,
                        data.image_url,
                        data.image_url
                    ]
                    
                    if (data.sizes && data.sizes.length > 0) {
                        this.selectedSize = data.sizes[0]
                    }
                }
            } catch (err) {
                console.error('Ошибка загрузки товара:', err)
                this.$router.push('/catalog')
            } finally {
                this.loading = false
            }
        },
        formatPrice(price) {
            return Number(price).toLocaleString('ru-RU')
        },
        addToCart() {
            const cartStore = useCartStore()
            cartStore.addToCart(this.product, this.selectedSize, this.quantity)
        },
        toggleFavorite() {
            this.isFavorite = !this.isFavorite
        }
    }
}
</script>

<style scoped>
/* Общие стили */
.product-page {
    background: #ffffff;
    min-height: 100vh;
}

/* Хлебные крошки */
.breadcrumbs-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px 0;
}

.breadcrumbs-container {
    max-width: 1200px;
}

/* Контейнер товара */
.product-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 3rem;
}

.loading-page {
    background: #ffffff;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 1.2rem;
}

/* Основной layout */
.product-layout {
    display: grid;
    grid-template-columns: 488px 1fr;
    gap: 40px;
    align-items: start;
    margin-top: 30px;
}

/* Левая колонка - Галерея */
.product-gallery-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.main-image-wrapper {
    width: 488px;
    height: 488px;
    border-radius: 8px;
    overflow: hidden;
    background: #f5f5f5;
}

.main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Слайдер миниатюр */
.thumbnail-slider {
    display: flex;
    gap: 16px;
    justify-content: flex-start;
}

.thumbnail-btn {
    width: 120px;
    height: 120px;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    background: #f5f5f5;
    transition: border-color 0.3s;
}

.thumbnail-btn.active {
    border-color: #000;
}

.thumbnail-btn:hover {
    border-color: #666;
}

.thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Правая колонка - Информация */
.product-info-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Название */
.product-title {
    font-family: 'Zen Antique', serif;
    font-size: 32px;
    color: #000;
    margin: 0;
    line-height: 1.2;
    text-transform: uppercase;
}

/* Описание */
.product-description {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    margin: 0;
}

/* Характеристики */
.product-details {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #999;
    line-height: 1.8;
}

.product-details p {
    margin-bottom: 8px;
}

/* Таблица размеров */
.size-guide {
    margin: 10px 0;
}

.size-table-link {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #000;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    font-weight: 500;
}

.size-table {
    margin-top: 16px;
    overflow-x: auto;
}

.size-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
}

.size-table th,
.size-table td {
    padding: 12px;
    text-align: center;
    border: 1px solid #e0e0e0;
    color: #333;
}

.size-table th {
    background: #f5f5f5;
    color: #000;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
}

.size-table td:first-child {
    text-align: left;
    color: #666;
}

/* Размер */
.product-size h4 {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #000;
    margin-bottom: 12px;
    font-weight: 600;
}

.size-options {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.size-btn {
    padding: 12px 20px;
    background: #fff;
    border: 1px solid #e0e0e0;
    color: #333;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
}

.size-btn:hover {
    border-color: #000;
    color: #000;
}

.size-btn.active {
    background: #000;
    color: #fff;
    border-color: #000;
}

/* Цена */
.product-price-block {
    margin: 10px 0;
}

.price-row {
    display: flex;
    align-items: baseline;
    gap: 16px;
}

.current-price {
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #000;
}

.old-price {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    color: #999;
    text-decoration: line-through;
}

/* Действия */
.product-actions {
    display: flex;
    gap: 16px;
    align-items: center;
}

.btn-add-to-cart {
    flex: 1;
    padding: 16px 32px;
    background: #000;
    color: #fff;
    border: none;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    transition: all 0.3s;
}

.btn-add-to-cart:hover {
    background: #333;
}

/* Доставка */
.delivery-info {
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #eee;
}

.delivery-info p {
    font-family: 'Inter', sans-serif;
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
}

.delivery-info p:last-child {
    margin-bottom: 0;
}

/* Адаптивность */
@media (max-width: 1024px) {
    .product-layout {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .main-image-wrapper {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
    }
    
    .thumbnail-slider {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .product-title {
        font-size: 24px;
    }
    
    .thumbnail-btn {
        width: 80px;
        height: 80px;
    }
    
    .product-actions {
        flex-direction: column;
    }
    
    .btn-add-to-cart {
        width: 100%;
    }
    
    .breadcrumbs-wrapper {
        padding: 20px 20px 0;
    }
}
</style>