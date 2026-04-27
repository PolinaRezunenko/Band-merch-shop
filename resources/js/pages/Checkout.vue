<template>
    <div class="checkout-page">
        <div class="checkout-container">
            <Breadcrumbs :items="breadcrumbs" />
            <h1 class="checkout-title">Корзина</h1>

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
                        <div class="coupon-block">
                            <input v-model="coupon" placeholder="Код купона" class="coupon-input">
                            <button @click="applyCoupon" class="btn-coupon">Применить</button>
                        </div>
                        <div class="summary-total">
                            <span>Итого:</span>
                            <span class="total-price">{{ (totalPrice - discount).toLocaleString() }} ₽</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="cart-empty">
                <p>Корзина пуста</p>
                <router-link to="/catalog" class="btn-to-catalog">Перейти в каталог</router-link>
            </div>

            <!-- Форма -->
            <div class="checkout-form" v-if="cartItems.length > 0">
                <h2 class="form-title">Оформление заказа</h2>
                
                <div v-if="error" class="error-message">{{ error }}</div>

                <div class="form-section">
                    <h3>Контактные данные</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Имя *</label>
                            <input type="text" v-model="form.firstName" placeholder="Имя">
                        </div>
                        <div class="form-group">
                            <label>Фамилия *</label>
                            <input type="text" v-model="form.lastName" placeholder="Фамилия">
                        </div>
                        <div class="form-group">
                            <label>E-mail *</label>
                            <input type="email" v-model="form.email" placeholder="E-mail">
                        </div>
                        <div class="form-group">
                            <label>Телефон</label>
                            <input type="tel" v-model="form.phone" placeholder="+7 (999) 999-99-99">
                        </div>
                        <div class="form-group">
                            <label>Город</label>
                            <input type="text" v-model="form.city" placeholder="Город">
                        </div>
                        <div class="form-group">
                            <label>Адрес</label>
                            <input type="text" v-model="form.address" placeholder="Адрес">
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Способ оплаты</h3>
                    <div class="radio-group">
                        <label class="radio-label"><input type="radio" v-model="form.payment" value="card"><span>Оплата картами Visa/MasterCard онлайн</span></label>
                        <label class="radio-label"><input type="radio" v-model="form.payment" value="cash"><span>Оплата наличными</span></label>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Способ доставки</h3>
                    <div class="radio-group">
                        <label class="radio-label"><input type="radio" v-model="form.delivery" value="cdek"><span>СДЭК до пункта выдачи - 300 руб.</span></label>
                        <label class="radio-label"><input type="radio" v-model="form.delivery" value="pochta"><span>Почтой России - 250 руб.</span></label>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Комментарий</h3>
                    <textarea v-model="form.comment" placeholder="Комментарий к заказу" class="comment-input" rows="3"></textarea>
                </div>

                <button class="btn-submit" @click="submitOrder" :disabled="submitLoading">
                    {{ submitLoading ? 'Оформление...' : 'Подтвердить заказ' }}
                </button>
            </div>
        </div>

        <PopularProducts title="Самое популярное сейчас" filter="hot" :limit="4" />
        <DiscountBanner />
    </div>
</template>

<script>
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../config/supabase'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import CartItem from '../components/CartItem.vue'
import PopularProducts from '../components/PopularProducts.vue'
import DiscountBanner from '../components/DiscountBanner.vue'

export default {
    name: 'CheckoutPage',
    components: { Breadcrumbs, CartItem, PopularProducts, DiscountBanner },
    data() {
        return {
            coupon: '',
            discount: 0,
            submitLoading: false,
            error: '',
            form: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                city: '',
                address: '',
                payment: 'card',
                delivery: '',
                comment: ''
            }
        }
    },
    computed: {
        cartItems() {
            return useCartStore().items
        },
        totalPrice() {
            return useCartStore().totalPrice
        },
        breadcrumbs() {
            return [
                { label: 'Корзина', link: '/cart' },
                { label: 'Оформление заказа', link: null }
            ]
        }
    },
    methods: {
        removeItem(productId, size) {
            useCartStore().removeFromCart(productId, size)
        },
        updateQuantity({ id, size, quantity }) {
            useCartStore().updateQuantity(id, size, quantity)
        },
        clearCart() {
            if (confirm('Очистить корзину?')) {
                useCartStore().clearCart()
            }
        },
        applyCoupon() {
            if (this.coupon.trim()) {
                this.discount = 500
                alert('Купон применён!')
            }
        },
        
        async submitOrder() {
            this.error = ''
            
            if (!this.form.firstName) { this.error = 'Введите имя'; return }
            if (!this.form.lastName) { this.error = 'Введите фамилию'; return }
            if (!this.form.email) { this.error = 'Введите email'; return }
            if (!this.form.delivery) { this.error = 'Выберите доставку'; return }
            
            this.submitLoading = true
            
            try {
                const cartStore = useCartStore()
                const authStore = useAuthStore()
                
                let userId = authStore.user?.id || null
                
                // Авторегистрация если не авторизован
                if (!userId) {
                    const password = 'Pass' + Math.random().toString(36).slice(-8) + '!'
                    
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email: this.form.email,
                        password: password
                    })
                    
                    if (signUpError) {
                        if (signUpError.message.includes('already')) {
                            this.error = 'Этот email уже зарегистрирован. Войдите в аккаунт.'
                            this.submitLoading = false
                            return
                        }
                        throw signUpError
                    }
                    
                    if (signUpData.user) {
                        userId = signUpData.user.id
                        
                        // Профиль
                        await supabase.from('profiles').insert({
                            id: userId,
                            first_name: this.form.firstName,
                            last_name: this.form.lastName,
                            phone: this.form.phone,
                            city: this.form.city,
                            address: this.form.address
                        })
                        
                        // Авторизуем
                        authStore.user = signUpData.user
                        await authStore.loadProfile()
                    }
                }
                
                // Создаем заказ
                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        user_id: userId,
                        status: 'pending',
                        total_price: cartStore.totalPrice - this.discount,
                        discount: this.discount,
                        payment_method: this.form.payment,
                        delivery_method: this.form.delivery,
                        first_name: this.form.firstName,
                        last_name: this.form.lastName,
                        email: this.form.email,
                        phone: this.form.phone,
                        city: this.form.city,
                        address: this.form.address,
                        comment: this.form.comment
                    })
                    .select('id')
                    .single()
                
                if (orderError) throw orderError
                
                // Товары
                const items = cartStore.items.map(item => ({
                    order_id: order.id,
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    size: item.selectedSize,
                    price: item.price,
                    image_url: item.image_url
                }))
                
                await supabase.from('order_items').insert(items)
                
                cartStore.clearCart()
                
                alert(`Заказ №${order.id} оформлен!`)
                this.$router.push('/profile')
                
            } catch (err) {
                console.error('Ошибка:', err)
                this.error = err.message || 'Ошибка оформления'
            } finally {
                this.submitLoading = false
            }
        }
    }
}
</script>

<style scoped>
.checkout-page { background: #fff; min-height: 100vh; }
.checkout-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.checkout-title { font-family: 'Zen Antique', serif; font-size: 36px; color: #000; margin: 30px 0; text-transform: uppercase; }

.cart-layout { display: grid; grid-template-columns: 1fr 400px; gap: 40px; margin-bottom: 60px; }
.cart-header { display: flex; justify-content: flex-end; margin-bottom: 20px; }
.btn-clear { background: none; border: none; color: #999; font-size: 14px; cursor: pointer; text-decoration: underline; font-family: 'Inter', sans-serif; }
.cart-summary { position: sticky; top: 120px; }
.summary-block { background: #f9f9f9; padding: 30px; border-radius: 8px; border: 1px solid #eee; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-family: 'Inter', sans-serif; font-size: 16px; color: #333; }
.coupon-block { display: flex; gap: 10px; margin: 20px 0; }
.coupon-input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 4px; }
.btn-coupon { padding: 12px 20px; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.summary-total { display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid #ddd; font-size: 18px; font-weight: 600; }
.total-price { font-size: 24px; font-weight: 700; }

.cart-empty { text-align: center; padding: 80px; color: #999; }
.btn-to-catalog { display: inline-block; margin-top: 20px; padding: 14px 40px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; }

.checkout-form { margin-top: 60px; border-top: 2px solid #000; padding-top: 40px; }
.form-title { font-family: 'Zen Antique', serif; font-size: 32px; margin-bottom: 40px; }
.error-message { background: #ffe6e6; color: #cc0000; padding: 15px; border-radius: 4px; margin-bottom: 30px; }
.form-section { margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #eee; }
.form-section h3 { font-family: 'Inter', sans-serif; font-size: 20px; margin-bottom: 20px; font-weight: 600; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 14px; color: #666; }
.form-group input { padding: 14px 16px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
.radio-group { display: flex; flex-direction: column; gap: 15px; }
.radio-label { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 15px; }
.radio-label input[type="radio"] { width: 20px; height: 20px; accent-color: #000; }
.comment-input { width: 100%; padding: 14px 16px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; }
.btn-submit { width: 100%; padding: 18px; background: #000; color: #fff; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; text-transform: uppercase; cursor: pointer; margin-top: 20px; }
.btn-submit:hover { background: #333; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 768px) {
    .cart-layout { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
}
</style>