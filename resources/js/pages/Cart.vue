<template>
    <div class="cart-page">
        <div class="cart-container">
            <!-- Хлебные крошки -->
            <Breadcrumbs :items="breadcrumbs" />

            <h1 class="cart-title">Корзина</h1>

            <div class="cart-layout" v-if="cartItems.length > 0">
                <!-- Список товаров -->
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

                <!-- Итого -->
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
                        Добавьте в корзину товаров на {{ (5000 - totalPrice).toLocaleString() }} ₽ и получите бесплатную доставку
                    </div>
                    <div class="free-shipping-success" v-else>
                        ✅ У вас бесплатная доставка!
                    </div>
                </div>
            </div>

            <!-- Пустая корзина -->
            <div v-else class="cart-empty">
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
    /* padding: 40px 20px; */
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

/* Заголовок корзины */
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

/* Итого */
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
}

.free-shipping-success {
    margin-top: 15px;
    color: #00aa00;
    font-size: 14px;
    text-align: center;
    font-family: 'Inter', sans-serif;
}

/* Пустая корзина */
.cart-empty {
    text-align: center;
    padding: 80px 20px;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    color: #999;
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

@media (max-width: 768px) {
    .cart-layout {
        grid-template-columns: 1fr;
    }
    
    .cart-summary {
        position: static;
    }
    
    .cart-title {
        font-size: 28px;
    }
}
</style>