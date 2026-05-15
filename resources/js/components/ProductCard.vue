<template>
    <div class="product-card">
        <!-- Бейджи слева друг под другом -->
        <div class="card-badges">
            <span v-if="product.is_hot" class="badge badge-hot">🔥 HOT</span>
            <span v-if="product.is_new" class="badge badge-new">NEW</span>
        </div>
        
        <!-- Иконки справа -->
        <div class="card-actions">
            <button class="btn-favorite" @click="toggleFavorite">
                <img 
                    :src="isFavorite ? '/images/icons/heart-filled.svg' : '/images/icons/heart.svg'" 
                    alt="Избранное" 
                    class="action-icon"
                >
            </button>
            <button class="btn-quick-add" @click="increaseQuantity">
                <img src="/images/icons/plus.svg" alt="Добавить в корзину" class="action-icon">
            </button>
        </div>

        <!-- Фото -->
        <router-link :to="'/product/' + product.id" class="product-image-link">
            <img 
                :src="mainImage" 
                :alt="mainAltText" 
                class="product-image"
                loading="lazy"
                @error="handleImageError"
            >
        </router-link>

        <!-- Инфо -->
        <div class="product-info">
            <router-link :to="'/product/' + product.id" class="product-name">
                {{ product.name }}
            </router-link>
            
            <span class="product-price">{{ formatPrice(product.price) }} ₽</span>
            
            <!-- Кнопка В корзину -->
            <div class="product-action">
                <button v-if="quantity === 0" class="btn-add" @click="increaseQuantity">
                    В корзину
                </button>
                <!-- Счётчик -->
                <div v-else class="btn-add-counter">
                    <button class="counter-btn" @click="decreaseQuantity">−</button>
                    <span class="counter-text">В корзине {{ quantity }}</span>
                    <button class="counter-btn" @click="increaseQuantity">+</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
import { supabase } from '../config/supabase'
import { inject } from 'vue'

export default {
    name: 'ProductCard',
    inject: ['notify'],
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            selectedSize: null,
            quantity: 0,
            isFavorite: false,
            mainImage: '',
            mainAltText: ''
        }
    },
    async mounted() {
        if (this.product.sizes && this.product.sizes.length > 0) {
            this.selectedSize = this.product.sizes[0]
        }
        this.checkCartQuantity()
        this.checkFavorite()
        await this.loadMainImage()
    },
    methods: {
        async loadMainImage() {
            try {
                const { data, error } = await supabase
                    .from('product_images')
                    .select('image_url, alt_text')
                    .eq('product_id', this.product.id)
                    .eq('is_main', true)
                    .single()
                
                if (data && !error) {
                    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
                    this.mainImage = `${supabaseUrl}/storage/v1/object/public/product-images/${data.image_url}`
                    this.mainAltText = data.alt_text || this.product.name
                } else {
                    this.mainImage = this.product.image_url
                    this.mainAltText = this.product.name
                }
            } catch (err) {
                this.mainImage = this.product.image_url
                this.mainAltText = this.product.name
            }
        },
        handleImageError(event) {
            event.target.src = 'https://placehold.co/400x400/f5f5f5/0a0a0a?text=Нет+фото'
            event.target.alt = 'Изображение недоступно'
        },
        checkFavorite() {
            const favStore = useFavoritesStore()
            this.isFavorite = favStore.isFavorite(this.product.id)
        },
        checkCartQuantity() {
            const cartStore = useCartStore()
            const item = cartStore.items.find(
                i => i.id === this.product.id && i.selectedSize === this.selectedSize
            )
            if (item) {
                this.quantity = item.quantity
            }
        },
        increaseQuantity() {
            this.quantity++
            const cartStore = useCartStore()
            cartStore.addToCart(this.product, this.selectedSize)
            if (this.notify) this.notify.success('Добавлено в корзину!', this.product.name)
        },
        decreaseQuantity() {
            if (this.quantity > 0) {
                this.quantity--
                const cartStore = useCartStore()
                if (this.quantity === 0) {
                    cartStore.removeFromCart(this.product.id, this.selectedSize)
                    if (this.notify) this.notify.info('Удалено', 'Товар удален из корзины')
                } else {
                    cartStore.updateQuantity(this.product.id, this.selectedSize, this.quantity)
                }
            }
        },
        toggleFavorite() {
            const favStore = useFavoritesStore()
            favStore.toggleFavorite(this.product)
            this.isFavorite = favStore.isFavorite(this.product.id)
            
            if (this.isFavorite) {
                if (this.notify) this.notify.success('В избранном!', this.product.name)
            } else {
                if (this.notify) this.notify.info('Удалено', 'Товар удален из избранного')
            }
        },
        formatPrice(price) {
            return Number(price).toLocaleString('ru-RU')
        }
    }
}
</script>

<style scoped>
.product-card {
    position: relative;
    background: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s;
    border: 1px solid #D6D6D6;
    border-radius: 13px;
    width: 100%;
    height: 100%;
    min-height: 380px;
}

.product-card:hover {
    transform: translateY(-4px);
}

/* Бейджи слева — друг под другом */
.card-badges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 3;
}

.badge {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0px;
    width: fit-content;
    padding: 2px 6px;
    border-radius: 4px;
}

.badge-new {
    background: #ffffff;
    color: #F84343;
}

.badge-hot {
    background: #ffffff;
    color: #F84343;
}

/* Контейнер иконок справа */
.card-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 3;
}

.btn-favorite {
    height: 28px;
    width: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    background: none;
    border: none;
    padding: 0;
}

.btn-quick-add {
    height: 28px;
    width: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    background: none;
    border: none;
    padding: 0;
}

.action-icon {
    height: 24px;
    width: 24px;
}

/* Фото */
.product-image-link {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    margin: 45px auto 10px;
    overflow: hidden;
    flex-shrink: 0;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transition: transform 0.5s;
    background: #f5f5f5;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

/* Инфо - растягивается на всю доступную высоту */
.product-info {
    text-align: center;
    width: 100%;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-name {
    display: block;
    font-family: 'Roboto Mono';
    font-size: 14px;
    font-weight: 500;
    color: #0a0a0a;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: -2%;
    overflow: hidden;
    margin: 0 auto 6px;
    line-height: 1.3;
    max-height: 42px;
}

.product-name:hover {
    color: #979797;
}

.product-price {
    display: block;
    font-family: 'Roboto Mono';
    font-size: 14px;
    color: #0a0a0a;
    font-weight: 400;
    margin-bottom: 12px;
}

/* Контейнер для кнопки - прижимается к низу */
.product-action {
    margin-top: auto;
    width: 100%;
}

/* Кнопка В корзину */
.btn-add {
    width: 100%;
    padding: 10px;
    background: transparent;
    color: #000000;
    border: 1px solid black;
    border-radius: 5px;
    font-family: 'Roboto Mono';
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-add:hover {
    background: #000000;
    color: #ffffff;
}

/* Счётчик "В корзине" */
.btn-add-counter {
    width: 100%;
    padding: 8px 10px;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    border-radius: 5px;
}

.counter-btn {
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.counter-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.counter-text {
    color: #fff;
    font-family: 'Roboto Mono';
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
}

/* ========== АДАПТИВ ========== */

/* Планшеты */
@media (max-width: 1024px) {
    .product-card {
        min-height: 360px;
    }
    .product-name {
        font-size: 13px;
    }
    .product-price {
        font-size: 13px;
    }
}

/* Мобильные (780px) */
@media (max-width: 780px) {
    .product-card {
        min-height: 340px;
        padding: 8px;
    }
    
    .product-image-link {
        margin: 40px auto 8px;
    }
    
    .product-name {
        font-size: 12px;
        max-height: 36px;
        margin-bottom: 4px;
    }
    
    .product-price {
        font-size: 12px;
        margin-bottom: 10px;
    }
    
    .btn-add {
        padding: 8px;
        font-size: 11px;
    }
    
    .btn-add-counter {
        padding: 6px 8px;
    }
    
    .counter-text {
        font-size: 10px;
    }
    
    .counter-btn {
        width: 24px;
        height: 24px;
        font-size: 14px;
    }
    
    .badge {
        font-size: 10px;
        padding: 2px 4px;
    }
    
    .action-icon {
        height: 20px;
        width: 20px;
    }
    
    .btn-favorite, .btn-quick-add {
        height: 24px;
        width: 24px;
    }
}

/* Маленькие телефоны (480px) */
@media (max-width: 480px) {
    .product-card {
        min-height: 320px;
        padding: 6px;
    }
    
    .product-image-link {
        margin: 35px auto 6px;
    }
    
    .product-name {
        font-size: 11px;
        max-height: 32px;
    }
    
    .product-price {
        font-size: 11px;
        margin-bottom: 8px;
    }
    
    .btn-add {
        padding: 6px;
        font-size: 10px;
    }
    
    .counter-text {
        font-size: 9px;
    }
    
    .counter-btn {
        width: 22px;
        height: 22px;
        font-size: 12px;
    }
}

/* Очень маленькие (390px) */
@media (max-width: 390px) {
    .product-card {
        min-height: 250px;
        padding: 5px;
    }
    
    .product-image-link {
        margin: 30px auto 5px;
    }
    
    .product-name {
        font-size: 10px;
        max-height: 28px;
        line-height: 1.2;
    }
    
    .product-price {
        font-size: 10px;
        margin-bottom: 6px;
    }
    
    .product-action {
        margin-top: auto;
    }
    
    .btn-add {
        padding: 5px;
        font-size: 9px;
    }
    
    .counter-text {
        font-size: 8px;
    }
    
    .counter-btn {
        width: 20px;
        height: 20px;
        font-size: 11px;
    }
    
    .badge {
        font-size: 9px;
        padding: 1px 3px;
    }
    
    .action-icon {
        height: 18px;
        width: 18px;
    }
    
    .btn-favorite, .btn-quick-add {
        height: 22px;
        width: 22px;
    }
}
</style>