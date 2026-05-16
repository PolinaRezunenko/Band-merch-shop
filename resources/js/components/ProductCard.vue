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
/* ========== БОЛЬШИЕ ЭКРАНЫ (1920px, 1440px, 1200px, 1024px) ========== */
.product-card {
    position: relative;
    background: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s;
    border: 1px solid #D6D6D6;
    border-radius: 13px;
    width: 284px;
    height: 490px;
}

.product-card:hover {
    transform: translateY(-4px);
}

/* Бейджи */
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
    width: fit-content;
    padding: 2px 6px;
    border-radius: 4px;
}

.badge-new, .badge-hot {
    background: #ffffff;
    color: #F84343;
}

/* Иконки справа */
.card-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 3;
}

.btn-favorite, .btn-quick-add {
    height: 28px;
    width: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
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
    width: 244px;
    height: 256px;
    margin: 64px auto 10px;
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

/* Инфо */
.product-info {
    text-align: center;
    width: 244px;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-name {
    display: block;
    font-family: 'Roboto Mono';
    font-size: 16px;
    font-weight: 500;
    color: #0a0a0a;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: -2%;
    width: 233px;
    height: 42px;
    overflow: hidden;
    margin: 0 auto 8px;
}

.product-name:hover {
    color: #979797;
}

.product-price {
    display: block;
    font-family: 'Roboto Mono';
    font-size: 16px;
    color: #0a0a0a;
    font-weight: 400;
    margin-bottom: 8px;
}

.product-action {
    margin-top: auto;
    width: 100%;
}

.btn-add {
    width: 244px;
    height: 44px;
    background: transparent;
    color: #000000;
    border: 1px solid black;
    border-radius: 5px;
    font-family: 'Roboto Mono';
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-add:hover {
    background: #000000;
    color: #ffffff;
}

.btn-add-counter {
    width: 244px;
    height: 44px;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
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
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
}

/* ========== АДАПТИВ ========== */

/* 1024px */
@media (max-width: 1024px) {
    .product-card {
        width: 100%;
        height: auto;
        min-height: 420px;
    }
    
    .product-image-link {
        width: 70%;
        height: auto;
        aspect-ratio: 1 / 1;
        margin: 50px auto 10px;
    }
    
    .product-info {
        width: 90%;
    }
    
    .product-name {
        width: 100%;
        height: auto;
        font-size: 14px;
        margin-bottom: 6px;
    }
    
    .product-price {
        font-size: 14px;
        margin-bottom: 6px;
    }
    
    .btn-add, .btn-add-counter {
        width: 100%;
        height: 42px;
        font-size: 14px;
    }
}

/* 780px */
@media (max-width: 780px) {
    .product-card {
        min-height: 360px;
        padding: 8px;
    }
    
    .product-image-link {
        width: 75%;
        margin: 35px auto 8px;
    }
    
    .product-name {
        font-size: 12px;
        margin-bottom: 4px;
    }
    
    .product-price {
        font-size: 12px;
        margin-bottom: 4px;
    }
    
    .btn-add, .btn-add-counter {
        height: 38px;
        font-size: 12px;
    }
    
    .counter-text {
        font-size: 12px;
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

/* 480px - фиксированная высота 280px */
@media (max-width: 480px) {
    .product-card {
        width: 100%;
        height: 280px;
        min-height: auto;
        padding: 6px;
    }
    
    .product-image-link {
        width: 80%;
        height: auto;
        aspect-ratio: 1 / 1;
        margin: 20px auto 6px;
    }
    
    .product-name {
        font-size: 11px;
        margin-bottom: 3px;
        height: auto;
        max-height: 28px;
    }
    
    .product-price {
        font-size: 11px;
        margin-bottom: 3px;
    }
    
    .btn-add, .btn-add-counter {
        height: 32px;
        font-size: 11px;
    }
    
    .btn-add-counter {
        padding: 0 8px;
    }
    
    .counter-text {
        font-size: 10px;
    }
    
    .counter-btn {
        width: 22px;
        height: 22px;
        font-size: 12px;
    }
}

/* 390px - ДОБАВИТЬ ЭТОТ БЛОК! */
@media (max-width: 390px) {
    .product-card {
        width: 100%;
        height: 230px !important; /* ← фиксированная высота для 390px */
        min-height: auto;
        padding: 4px;
    }
    
    .product-image-link {
        width: 75%;
        margin: 12px auto 4px;
    }
    
    .product-name {
        font-size: 10px;
        margin-bottom: 2px;
        max-height: 22px;
    }
    
    .product-price {
        font-size: 10px;
        margin-bottom: 2px;
    }
    
    .btn-add, .btn-add-counter {
        height: 26px;
        font-size: 9px;
    }
    
    .btn-add-counter {
        padding: 0 5px;
    }
    
    .counter-text {
        font-size: 8px;
    }
    
    .counter-btn {
        width: 18px;
        height: 18px;
        font-size: 10px;
    }
    
    .badge {
        font-size: 7px;
        padding: 1px 2px;
    }
    
    .action-icon {
        height: 14px;
        width: 14px;
    }
    
    .btn-favorite, .btn-quick-add {
        height: 18px;
        width: 18px;
    }
}
</style>