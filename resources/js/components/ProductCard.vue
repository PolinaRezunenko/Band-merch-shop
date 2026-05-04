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
                <img src="/images/icons/plus.svg" alt="Добавить" class="action-icon">
            </button>
        </div>

        <!-- Фото -->
        <router-link :to="'/product/' + product.id" class="product-image-link">
            <img 
                :src="product.image_url" 
                :alt="product.name" 
                class="product-image"
                @error="handleImageError"
            >
        </router-link>

        <!-- Инфо -->
        <div class="product-info">
            <router-link :to="'/product/' + product.id" class="product-name">
                {{ product.name }}
            </router-link>
            
            <span class="product-price">{{ product.price.toLocaleString() }} ₽</span>
            
            <!-- Кнопка В корзину -->
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
</template>

<script>
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
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
            isFavorite: false           
        }
    },
    mounted() {
        if (this.product.sizes && this.product.sizes.length > 0) {
            this.selectedSize = this.product.sizes[0]
        }
        this.checkCartQuantity()
        this.checkFavorite()            
    },
    methods: {
        handleImageError(event) {
            event.target.src = 'https://placehold.co/600x600/f5f5f5/0a0a0a?text=Нет+фото'
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
        }
    }
}
</script>

<style scoped>
.product-card {
    position: relative;
    width: 284px;
    height: 490px;
    background: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s;
    border: 1px solid #D6D6D6;
    border-radius: 13px;
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
    font-size: 13.5px;
    font-weight: 600;
    letter-spacing: 0px;
    width: fit-content;
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
    height: 28px;
    width: 28px;
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
    font-family: 'Roboto Mono-Medium', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #0a0a0a;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: -0.5px;
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
    font-family: 'Roboto Mono-Regular', sans-serif;
    font-size: 16px;
    color: #0a0a0a;
    font-weight: 400;
    margin-bottom: 8px;
}

/* Кнопка В корзину и счётчик — прижаты к низу */
.btn-add,
.btn-add-counter {
    margin-top: auto;
}

/* Кнопка В корзину */
.btn-add {
    width: 244px;
    height: 44px;
    background: transparent;
    color: #000000;
    border: 1px solid black;
    border-radius: 5px;
    font-family: 'Roboto Mono-Medium', sans-serif;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-add:hover {
    background: #000000;
    color: #ffffff;
}

/* Счётчик "В корзине" */
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
    font-family: 'Roboto Mono-Medium', sans-serif;
    font-size: 16px;
    font-weight: 600;
}
</style>