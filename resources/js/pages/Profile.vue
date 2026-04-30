<template>
    <div class="profile-page" v-if="authStore.user">
        <div class="profile-container">
            <Breadcrumbs :items="[{ label: 'Личный кабинет', link: null }]" />
            
            <h1>Личный кабинет</h1>
            
            <div class="profile-layout">
                <!-- Боковое меню -->
                <aside class="profile-sidebar">
                    <nav class="profile-nav">
                        <button 
                            :class="{ active: activeSection === 'profile' }"
                            @click="activeSection = 'profile'"
                        >Профиль</button>
                        <button 
                            :class="{ active: activeSection === 'orders' }"
                            @click="activeSection = 'orders'"
                        >История заказов</button>
                        <button 
                            :class="{ active: activeSection === 'favorites' }"
                            @click="activeSection = 'favorites'"
                        >Избранное</button>
                        <button 
                            :class="{ active: activeSection === 'settings' }"
                            @click="activeSection = 'settings'"
                        >Настройки</button>
                        
                        <!-- Кнопка админ-панели (только для админа) -->
                        <button 
                            v-if="authStore.isAdmin"
                            class="btn-admin"
                            @click="$router.push('/admin')"
                        >
                            👑 Админ-панель
                        </button>
                        
                        <button @click="handleLogout" class="btn-logout">Выйти</button>
                    </nav>
                </aside>
                
                <!-- Контент -->
                <div class="profile-content">
                    <!-- Профиль -->
                    <div v-if="activeSection === 'profile'" class="profile-section">
                        <h2>Мои данные</h2>
                        
                        <div v-if="authStore.isAdmin" class="admin-badge">
                            👑 Администратор
                        </div>
                        
                        <form @submit.prevent="updateProfile" class="profile-form">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Имя</label>
                                    <input v-model="profileForm.firstName" type="text">
                                </div>
                                <div class="form-group">
                                    <label>Фамилия</label>
                                    <input v-model="profileForm.lastName" type="text">
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input v-model="profileForm.email" type="email" disabled>
                                </div>
                                <div class="form-group">
                                    <label>Телефон</label>
                                    <input v-model="profileForm.phone" type="tel">
                                </div>
                                <div class="form-group">
                                    <label>Город</label>
                                    <input v-model="profileForm.city" type="text">
                                </div>
                                <div class="form-group">
                                    <label>Адрес</label>
                                    <input v-model="profileForm.address" type="text">
                                </div>
                            </div>
                            
                            <button type="submit" class="btn-save">Сохранить изменения</button>
                        </form>
                    </div>
                    
                    <!-- История заказов -->
                    <div v-if="activeSection === 'orders'" class="orders-section">
                        <h2>История заказов</h2>
                        
                        <div v-if="orders.length === 0" class="empty">
                            У вас пока нет заказов
                        </div>
                        
                        <div v-else class="orders-list">
                            <div v-for="order in orders" :key="order.id" class="order-card">
                                <div class="order-header">
                                    <span>Заказ №{{ order.id }}</span>
                                    <span :class="['order-status', 'status-' + order.status]">
                                        {{ getStatusText(order.status) }}
                                    </span>
                                    <span>{{ formatDate(order.created_at) }}</span>
                                </div>
                                <div class="order-items">
                                    <div v-for="item in order.order_items" :key="item.id" class="order-item">
                                        <img :src="item.image_url" :alt="item.product_name">
                                        <span>{{ item.product_name }}</span>
                                        <span>{{ item.quantity }} шт.</span>
                                        <span>{{ item.price?.toLocaleString() }} ₽</span>
                                    </div>
                                </div>
                                <div class="order-total">
                                    Итого: {{ order.total_price?.toLocaleString() }} ₽
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Избранное -->
                    <div v-if="activeSection === 'favorites'" class="favorites-section">
                        <h2>Избранное</h2>
                        
                        <div v-if="favorites.length === 0" class="empty">
                            У вас пока нет избранных товаров
                        </div>
                        
                        <div v-else class="favorites-grid">
                            <ProductCard 
                                v-for="product in favorites" 
                                :key="product.id" 
                                :product="product"
                            />
                        </div>
                    </div>
                    
                    <!-- Настройки -->
                    <div v-if="activeSection === 'settings'" class="settings-section">
                        <h2>Настройки</h2>
                        
                        <form @submit.prevent="changePassword" class="password-form">
                            <h3>Сменить пароль</h3>
                            <div class="form-group">
                                <label>Новый пароль</label>
                                <input v-model="passwordForm.newPassword" type="password">
                            </div>
                            <div class="form-group">
                                <label>Повторите пароль</label>
                                <input v-model="passwordForm.confirmPassword" type="password">
                            </div>
                            <button type="submit" class="btn-save">Сменить пароль</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import { inject } from 'vue'
import { supabase } from '../config/supabase'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import ProductCard from '../components/ProductCard.vue'

export default {
    name: 'ProfilePage',
    components: { Breadcrumbs, ProductCard },
    inject: ['notify'],
    data() {
        return {
            activeSection: 'profile',
            orders: [],
            profileForm: {
                firstName: '', lastName: '', email: '', phone: '', city: '', address: ''
            },
            passwordForm: { newPassword: '', confirmPassword: '' }
        }
    },
    computed: {
        authStore() { return useAuthStore() },
        favorites() { return useFavoritesStore().items }
    },
    async mounted() {
        if (this.authStore.user) {
            await this.loadProfileData()
            await this.loadOrders()
        }
    },
    methods: {
        async loadProfileData() {
            if (this.authStore.profile) {
                this.profileForm = {
                    firstName: this.authStore.profile.first_name || '',
                    lastName: this.authStore.profile.last_name || '',
                    email: this.authStore.user?.email || '',
                    phone: this.authStore.profile.phone || '',
                    city: this.authStore.profile.city || '',
                    address: this.authStore.profile.address || ''
                }
            }
        },
        async loadOrders() {
            const { data } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .eq('user_id', this.authStore.user.id)
                .order('created_at', { ascending: false })
            if (data) this.orders = data
        },
        async updateProfile() {
            try {
                await this.authStore.updateProfile({
                    first_name: this.profileForm.firstName,
                    last_name: this.profileForm.lastName,
                    phone: this.profileForm.phone,
                    city: this.profileForm.city,
                    address: this.profileForm.address
                })
                this.notify?.success('Сохранено!', 'Профиль обновлен')
            } catch (error) { this.notify?.error('Ошибка', error.message) }
        },
        async changePassword() {
            if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
                this.notify?.error('Ошибка', 'Пароли не совпадают'); return
            }
            try {
                await this.authStore.changePassword(this.passwordForm.newPassword)
                this.notify?.success('Готово!', 'Пароль изменен')
                this.passwordForm.newPassword = ''; this.passwordForm.confirmPassword = ''
            } catch (error) { this.notify?.error('Ошибка', error.message) }
        },
        async handleLogout() {
            await this.authStore.logout()
            this.notify?.info('До свидания!', 'Вы вышли из системы')
            this.$router.push('/')
        },
        getStatusText(status) {
            const s = { pending: 'В обработке', processing: 'Обрабатывается', shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменен' }
            return s[status] || status
        },
        formatDate(date) { return new Date(date).toLocaleDateString('ru-RU') }
    }
}
</script>

<style scoped>
.profile-page {
    background: #fff;
    min-height: 100vh;
}

.profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

h1 {
    font-family: 'Zen Antique', serif;
    font-size: 36px;
    margin: 30px 0;
}

.profile-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 40px;
}

.profile-sidebar {
    position: sticky;
    top: 120px;
}

.profile-nav {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.profile-nav button {
    padding: 12px 20px;
    border: none;
    background: #f5f5f5;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    border-radius: 4px;
    transition: all 0.2s;
}

.profile-nav button.active {
    background: #000;
    color: #fff;
}

.profile-nav button:hover {
    background: #e0e0e0;
}

.profile-nav button.active:hover {
    background: #333;
}

.btn-admin {
    background: #000 !important;
    color: #fff !important;
    font-weight: 600;
    margin-top: 10px;
}

.btn-admin:hover {
    background: #333 !important;
}

.btn-logout {
    color: #cc0000 !important;
    margin-top: 20px;
}

.admin-badge {
    display: inline-block;
    background: #000;
    color: #fff;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    margin-bottom: 20px;
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    color: #666;
}

.form-group input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.btn-save {
    padding: 14px 40px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    font-size: 14px;
}

.btn-save:hover {
    background: #333;
}

.empty {
    color: #999;
    text-align: center;
    padding: 40px;
}

/* Заказы */
.order-card {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.order-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-weight: 600;
}

.order-status {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-processing { background: #cce5ff; color: #004085; }
.status-shipped { background: #d4edda; color: #155724; }
.status-delivered { background: #d4edda; color: #155724; }
.status-cancelled { background: #f8d7da; color: #721c24; }

.order-items { margin: 15px 0; }

.order-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}

.order-item img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

.order-total {
    text-align: right;
    font-weight: 700;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.favorites-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

@media (max-width: 768px) {
    .profile-layout {
        grid-template-columns: 1fr;
    }
    .form-grid {
        grid-template-columns: 1fr;
    }
    .favorites-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>