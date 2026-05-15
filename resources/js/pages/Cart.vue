<template>
    <div class="cart-page">
        <div class="cart-container">
            <Breadcrumbs :items="breadcrumbs" />

            <h1 class="cart-title">Корзина</h1>

            <div class="cart-layout" v-if="cartItems.length > 0">
                <div class="cart-items">
                    <div class="cart-header">
                        <button class="btn-clear" @click="clearCart">Очистить корзину</button>
                    </div>

                    <CartItem 
                        v-for="item in cartItems" 
                        :key="item.id + '-' + item.selectedSize" 
                        :item="item"
                        @remove="removeItem"
                        @update-quantity="updateQuantity"
                    />
                </div>

                <div class="cart-summary">
                    <div class="summary-block">
                        <div class="summary-row">
                            <span>Сумма:</span>
                            <span>{{ totalPrice.toLocaleString() }} ₽</span>
                        </div>
                        
                        <div class="summary-row discount" v-if="discount > 0">
                            <span>Скидка:</span>
                            <span>-{{ discount.toLocaleString() }} ₽</span>
                        </div>

                        <div class="coupon-block">
                            <input v-model="coupon" placeholder="Код купона" class="coupon-input">
                            <button @click="applyCoupon" class="btn-coupon">Применить</button>
                        </div>

                        <div class="summary-total">
                            <span>Итого:</span>
                            <span class="total-price">{{ (totalPrice - discount).toLocaleString() }} ₽</span>
                        </div>

                        <router-link to="/checkout" class="btn-checkout">
                            Перейти к оформлению
                        </router-link>
                    </div>

                    <div class="free-shipping" v-if="totalPrice < 5000">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12L15 15" stroke="#ff4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="#ff4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                        </svg>
                        Добавьте в корзину товаров на {{ (5000 - totalPrice).toLocaleString() }} ₽ и получите бесплатную доставку
                    </div>
                    <div class="free-shipping-success" v-else>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="#00aa00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        У вас бесплатная доставка!
                    </div>
                </div>
            </div>

            <div v-else class="cart-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <path d="M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20Z" stroke="#999" stroke-width="2" fill="none"/>
                    <path d="M18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20C16 19.4477 16.4477 19 17 19C17.5523 19 18 19.4477 18 20Z" stroke="#999" stroke-width="2" fill="none"/>
                </svg>
                <p>Корзина пуста</p>
                <router-link to="/catalog" class="btn-to-catalog">Перейти в каталог</router-link>
            </div>
        </div>

        <PopularProducts title="Самое популярное сейчас" filter="hot" :limit="4" />
        <DiscountBanner />
    </div>
</template>

<script>
import { useCartStore } from '../stores/cart'
import { inject } from 'vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import CartItem from '../components/CartItem.vue'
import PopularProducts from '../components/PopularProducts.vue'
import DiscountBanner from '../components/DiscountBanner.vue'

export default {
    name: 'CartPage',
    components: { Breadcrumbs, CartItem, PopularProducts, DiscountBanner },
    inject: ['notify'],
    data() {
        return { coupon: '', discount: 0 }
    },
    computed: {
        cartItems() { return useCartStore().items },
        totalItems() { return useCartStore().totalItems },
        totalPrice() { return useCartStore().totalPrice },
        breadcrumbs() { return [{ label: 'Корзина', link: null }] }
    },
    methods: {
        removeItem(productId, size) { useCartStore().removeFromCart(productId, size) },
        updateQuantity({ id, size, quantity }) { useCartStore().updateQuantity(id, size, quantity) },
        clearCart() {
            if (confirm('Очистить корзину?')) {
                useCartStore().clearCart()
                this.notify.info('Корзина очищена', 'Все товары удалены')
            }
        },
        applyCoupon() {
            if (this.coupon.trim()) {
                this.discount = 1000
                this.notify.success('Купон применён!', 'Скидка 1000 ₽')
            }
        }
    }
}
</script>

<style scoped>
.cart-page {
    background: #ffffff;
    min-height: 100vh;
}

.cart-container {
    max-width: 1200px;
    margin: 0 auto;
}

.cart-title {
    font-family: 'Raleway', sans-serif; 
    color: #000;
    margin: 30px 0;
    font-size: 48px;
}

.cart-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 40px;
    align-items: start;
}

.cart-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.btn-clear {
    background: none;
    border: none;
    color: #999;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    font-family: 'Inter', sans-serif;
    transition: color 0.2s;
}

.btn-clear:hover {
    color: #000;
}

.cart-summary {
    position: sticky;
    top: 120px;
}

.summary-block {
    background: #f9f9f9;
    padding: 30px;
    border-radius: 8px;
    border: 1px solid #eee;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #333;
}

.summary-row.discount {
    color: #ff4444;
}

.coupon-block {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.coupon-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s;
}

.coupon-input:focus {
    border-color: #000;
}

.btn-coupon {
    padding: 12px 20px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.3s;
}

.btn-coupon:hover {
    background: #333;
}

.summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid #ddd;
    margin: 20px 0;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #000;
}

.total-price {
    font-size: 24px;
    font-weight: 700;
}

.btn-checkout {
    display: block;
    width: 100%;
    padding: 16px;
    background: #000;
    color: #fff;
    text-align: center;
    text-decoration: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 1px;
    font-family: 'Inter', sans-serif;
    transition: background 0.3s;
}

.btn-checkout:hover {
    background: #333;
}

.free-shipping {
    margin-top: 15px;
    color: #ff4444;
    font-size: 14px;
    text-align: center;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.free-shipping-success {
    margin-top: 15px;
    color: #00aa00;
    font-size: 14px;
    text-align: center;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.cart-empty {
    text-align: center;
    padding: 80px 20px;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    color: #999;
}

.cart-empty svg {
    margin-bottom: 20px;
}

.btn-to-catalog {
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

.btn-to-catalog:hover {
    background: #333;
}

@media (max-width: 1024px) { .cart-container { padding: 40px 20px; } }
@media (max-width: 780px) { .cart-container { padding: 30px 20px; } }
@media (max-width: 480px) { .cart-container { padding: 20px 15px; } }

@media (max-width: 768px) {
    .cart-layout { grid-template-columns: 1fr; }
    .cart-summary { position: static; }
    .cart-title { font-size: 32px; }
}

@media (max-width: 480px) {
    .cart-layout { gap: 20px; }
    .summary-block { padding: 20px; }
    .cart-title { font-size: 24px; }
    .btn-checkout { padding: 14px; font-size: 13px; }
    .coupon-block { flex-direction: column; gap: 8px; }
    .btn-coupon { width: 100%; text-align: center; }
}

@media (max-width: 390px) {
    .cart-container { padding: 20px 10px; }
    .cart-title { font-size: 22px; }
    .cart-empty svg { width: 48px; height: 48px; }
    .free-shipping, .free-shipping-success { font-size: 12px; }
}
</style>