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
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <path d="M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20Z" stroke="#999" stroke-width="2" fill="none"/>
                    <path d="M18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20C16 19.4477 16.4477 19 17 19C17.5523 19 18 19.4477 18 20Z" stroke="#999" stroke-width="2" fill="none"/>
                </svg>
                <p>Корзина пуста</p>
                <router-link to="/catalog" class="btn-to-catalog">Перейти в каталог</router-link>
            </div>

            <div class="checkout-form" v-if="cartItems.length > 0">
                <h2 class="form-title">Оформление заказа</h2>
                
                <div v-if="error" class="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12M12 16H12.01" stroke="#cc0000" stroke-width="2" stroke-linecap="round"/>
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="#cc0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    </svg>
                    {{ error }}
                </div>

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
                            <div class="phone-input">
                                <span class="phone-prefix">+7</span>
                                <input 
                                    type="tel" 
                                    v-model="form.phone" 
                                    placeholder="(999) 999-99-99"
                                    @input="formatPhone"
                                >
                            </div>
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
                        <label class="radio-label">
                            <input type="radio" v-model="form.payment" value="card">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="6" width="20" height="12" rx="2" stroke="#666" stroke-width="1.5" fill="none"/>
                                <path d="M2 10H22" stroke="#666" stroke-width="1.5"/>
                                <path d="M6 14H8" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <span>Оплата картами Visa/MasterCard онлайн</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" v-model="form.payment" value="cash">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="#666" stroke-width="1.5" fill="none"/>
                                <path d="M12 6V18" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M9 9H13C14.1 9 15 9.9 15 11C15 12.1 14.1 13 13 13H9" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                <path d="M12 13V15" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <span>Оплата наличными</span>
                        </label>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Способ доставки</h3>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" v-model="form.delivery" value="cdek">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6C3 4.9 3.9 4 5 4Z" stroke="#666" stroke-width="1.5" fill="none"/>
                                <path d="M3 8H21" stroke="#666" stroke-width="1.5"/>
                            </svg>
                            <span>СДЭК до пункта выдачи - 300 руб.</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" v-model="form.delivery" value="pochta">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3L12 12L21 3" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                <path d="M3 21H21" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M3 3V15C3 16.1 3.9 17 5 17H19C20.1 17 21 16.1 21 15V3" stroke="#666" stroke-width="1.5" fill="none"/>
                            </svg>
                            <span>Почтой России - 250 руб.</span>
                        </label>
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
    inject: ['notify'],
    data() {
        return {
            coupon: '',
            discount: 0,
            submitLoading: false,
            error: '',
            form: {
                firstName: '', lastName: '', email: '', phone: '',
                city: '', address: '', payment: 'card', delivery: '', comment: ''
            }
        }
    },
    computed: {
        cartItems() { return useCartStore().items },
        totalPrice() { return useCartStore().totalPrice },
        breadcrumbs() { return [{ label: 'Корзина', link: '/cart' }, { label: 'Оформление заказа', link: null }] },
        authStore() { return useAuthStore() }
    },
    async mounted() {
        await this.loadProfileData()
    },
    methods: {
        removeItem(productId, size) { useCartStore().removeFromCart(productId, size) },
        updateQuantity({ id, size, quantity }) { useCartStore().updateQuantity(id, size, quantity) },
        clearCart() {
            if (confirm('Очистить корзину?')) {
                useCartStore().clearCart()
                if (this.notify) this.notify.info('Корзина очищена', 'Все товары удалены')
            }
        },
        applyCoupon() {
            if (this.coupon.trim()) {
                this.discount = 500
                if (this.notify) this.notify.success('Купон применён!', 'Скидка 500 ₽')
            }
        },
        
        formatPhone(event) {
            let value = this.form.phone.replace(/\D/g, '')
            if (value.length > 10) value = value.slice(0, 10)
            let formatted = ''
            for (let i = 0; i < value.length; i++) {
                if (i === 0) formatted += '('
                if (i === 3) formatted += ') '
                if (i === 6) formatted += '-'
                if (i === 8) formatted += '-'
                formatted += value[i]
            }
            this.form.phone = formatted
        },
        
        async loadProfileData() {
            if (this.authStore.user && this.authStore.profile) {
                const profile = this.authStore.profile
                this.form.firstName = profile.first_name || ''
                this.form.lastName = profile.last_name || ''
                this.form.email = this.authStore.user.email || ''
                this.form.phone = profile.phone || ''
                this.form.city = profile.city || ''
                this.form.address = profile.address || ''
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
                
                if (!userId) {
                    const password = 'Pass' + Math.random().toString(36).slice(-8) + '!'
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email: this.form.email, 
                        password: password,
                        options: {
                            data: {
                                first_name: this.form.firstName,
                                last_name: this.form.lastName,
                                phone: this.form.phone
                            }
                        }
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
                        const { error: profileError } = await supabase
                            .from('profiles')
                            .insert({
                                id: userId,
                                email: this.form.email,
                                first_name: this.form.firstName,
                                last_name: this.form.lastName,
                                phone: this.form.phone,
                                city: this.form.city,
                                address: this.form.address
                            })
                        
                        if (profileError) {
                            console.error('Ошибка сохранения профиля:', profileError)
                        }
                        
                        authStore.user = signUpData.user
                        await authStore.loadProfile()
                        if (this.notify) this.notify.success('Аккаунт создан!', 'Данные отправлены на email')
                    }
                } else {
                    const { error: updateError } = await supabase
                        .from('profiles')
                        .update({
                            first_name: this.form.firstName,
                            last_name: this.form.lastName,
                            phone: this.form.phone,
                            city: this.form.city,
                            address: this.form.address
                        })
                        .eq('id', userId)
                    
                    if (updateError) {
                        console.error('Ошибка обновления профиля:', updateError)
                    }
                    
                    await authStore.loadProfile()
                }
                
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
                
                if (this.notify) this.notify.success('Заказ оформлен!', `Номер: #${order.id}`)
                
                setTimeout(() => this.$router.push('/profile'), 2000)
                
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
.checkout-container { max-width: 1200px; margin: 0 auto; }
.checkout-title { font-family: 'Raleway', sans-serif; font-size: 48px; color: #000; margin: 30px 0; }

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
.cart-empty svg { margin-bottom: 20px; }
.btn-to-catalog { display: inline-block; margin-top: 20px; padding: 14px 40px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; }

.checkout-form { margin-top: 60px; border-top: 2px solid #000; padding-top: 40px; }
.form-title { font-family: 'Raleway', sans-serif; font-size: 32px; margin-bottom: 40px; }
.error-message { background: #ffe6e6; color: #cc0000; padding: 15px; border-radius: 4px; margin-bottom: 30px; display: flex; align-items: center; gap: 10px; }
.form-section { margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #eee; }
.form-section h3 { font-family: 'Mulish-regular', sans-serif; font-size: 20px; margin-bottom: 20px; font-weight: 600; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 14px; color: #666; }
.form-group input { padding: 14px 16px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }

/* Стили для поля телефона с префиксом */
.phone-input {
    display: flex;
    align-items: center;
}

.phone-prefix {
    padding: 14px 16px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-right: none;
    border-radius: 4px 0 0 4px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #333;
}

.phone-input input {
    border-radius: 0 4px 4px 0;
    flex: 1;
}

.radio-group { display: flex; flex-direction: column; gap: 15px; }
.radio-label { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 15px; }
.radio-label input[type="radio"] { width: 20px; height: 20px; accent-color: #000; margin: 0; }
.radio-label svg { flex-shrink: 0; }
.comment-input { width: 100%; padding: 14px 16px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; }
.btn-submit { font-family: 'Mulish-regular', sans-serif; font-size: 16px; width: 100%; padding: 18px; background: #000; color: #fff; border: none; border-radius: 4px; font-weight: 400; cursor: pointer; margin-top: 20px; }
.btn-submit:hover { background: #333; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 1024px) { .checkout-container { padding: 40px 20px; } }
@media (max-width: 780px) { .checkout-container { padding: 30px 20px; } }
@media (max-width: 480px) { .checkout-container { padding: 20px 15px; } }

@media (max-width: 768px) {
    .cart-layout { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
    .checkout-title { font-size: 32px; }
}

@media (max-width: 480px) {
    .checkout-title { font-size: 24px; margin: 20px 0; }
    .cart-layout { gap: 20px; margin-bottom: 30px; }
    .cart-summary { position: static; }
    .summary-block { padding: 20px; }
    .form-title { font-size: 24px; margin-bottom: 25px; }
    .form-grid { gap: 15px; }
    .form-section { margin-bottom: 25px; padding-bottom: 20px; }
    .form-section h3 { font-size: 18px; }
    .btn-submit { padding: 16px; font-size: 14px; }
    .coupon-block { flex-direction: column; gap: 8px; }
    .btn-coupon { width: 100%; }
    .phone-prefix { padding: 12px 14px; }
}

@media (max-width: 390px) {
    .checkout-container { padding: 20px 10px; }
    .checkout-title { font-size: 22px; }
    .cart-empty { padding: 60px 20px; }
    .cart-empty svg { width: 48px; height: 48px; }
    .phone-prefix { padding: 10px 12px; font-size: 13px; }
}
</style>