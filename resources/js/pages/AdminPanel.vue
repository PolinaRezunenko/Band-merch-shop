<template>
    <div v-if="loading">Загрузка...</div>

<div class="admin-page" v-else-if="isAdmin">
        <div class="admin-container">
            <Breadcrumbs :items="[{ label: 'Админ-панель', link: null }]" />
            
            <h1>Админ-панель</h1>
            
            <div class="admin-layout">
                <!-- Боковое меню -->
                <aside class="admin-sidebar">
                    <nav class="admin-nav">
                        <button :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
                            📦 Заказы
                        </button>
                        <button :class="{ active: activeTab === 'products' }" @click="activeTab = 'products'">
                            🛍️ Товары
                        </button>
                        <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">
                            👥 Пользователи
                        </button>
                    </nav>
                </aside>
                
                <!-- Контент -->
                <div class="admin-content">
                    <!-- Заказы -->
                    <div v-if="activeTab === 'orders'">
                        <h2>Заказы</h2>
                        
                        <div class="filters">
                            <select v-model="orderFilter" @change="loadOrders">
                                <option value="all">Все</option>
                                <option value="pending">В обработке</option>
                                <option value="processing">Обрабатываются</option>
                                <option value="shipped">Отправлены</option>
                                <option value="delivered">Доставлены</option>
                            </select>
                        </div>
                        
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Дата</th>
                                    <th>Клиент</th>
                                    <th>Сумма</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in orders" :key="order.id">
                                    <td>#{{ order.id }}</td>
                                    <td>{{ formatDate(order.created_at) }}</td>
                                    <td>{{ order.first_name }} {{ order.last_name }}</td>
                                    <td>{{ order.total_price.toLocaleString() }} ₽</td>
                                    <td>
                                        <select v-model="order.status" @change="updateOrderStatus(order)">
                                            <option value="pending">В обработке</option>
                                            <option value="processing">Обрабатывается</option>
                                            <option value="shipped">Отправлен</option>
                                            <option value="delivered">Доставлен</option>
                                            <option value="cancelled">Отменен</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button @click="showOrderDetails(order)" class="btn-small">📋</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <!-- Детали заказа -->
                        <div v-if="selectedOrder" class="order-details-modal">
                            <div class="modal-content">
                                <h3>Заказ #{{ selectedOrder.id }}</h3>
                                <button @click="selectedOrder = null" class="close-btn">✕</button>
                                
                                <div class="order-info">
                                    <p><strong>Клиент:</strong> {{ selectedOrder.first_name }} {{ selectedOrder.last_name }}</p>
                                    <p><strong>Email:</strong> {{ selectedOrder.email }}</p>
                                    <p><strong>Телефон:</strong> {{ selectedOrder.phone || 'Не указан' }}</p>
                                    <p><strong>Город:</strong> {{ selectedOrder.city || 'Не указан' }}</p>
                                    <p><strong>Адрес:</strong> {{ selectedOrder.address || 'Не указан' }}</p>
                                    <p><strong>Доставка:</strong> {{ selectedOrder.delivery_method }}</p>
                                    <p><strong>Оплата:</strong> {{ selectedOrder.payment_method }}</p>
                                    <p><strong>Комментарий:</strong> {{ selectedOrder.comment || 'Нет' }}</p>
                                </div>
                                
                                <h4>Товары:</h4>
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Товар</th>
                                            <th>Размер</th>
                                            <th>Цена</th>
                                            <th>Кол-во</th>
                                            <th>Сумма</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in selectedOrder.items" :key="item.id">
                                            <td>{{ item.product_name }}</td>
                                            <td>{{ item.size || '-' }}</td>
                                            <td>{{ item.price.toLocaleString() }} ₽</td>
                                            <td>{{ item.quantity }}</td>
                                            <td>{{ (item.price * item.quantity).toLocaleString() }} ₽</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Товары -->
                    <div v-if="activeTab === 'products'">
                        <h2>Товары</h2>
                        <button @click="showAddProduct = true" class="btn-add">+ Добавить товар</button>
                        
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Фото</th>
                                    <th>Название</th>
                                    <th>Цена</th>
                                    <th>Категория</th>
                                    <th>В наличии</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="product in products" :key="product.id">
                                    <td>{{ product.id }}</td>
                                    <td><img :src="product.image_url" width="50"></td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ product.price.toLocaleString() }} ₽</td>
                                    <td>{{ getCategoryName(product.category_id) }}</td>
                                    <td>{{ product.in_stock ? '✅' : '❌' }}</td>
                                    <td>
                                        <button @click="toggleStock(product)" class="btn-small">
                                            {{ product.in_stock ? '❌' : '✅' }}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Пользователи -->
                    <div v-if="activeTab === 'users'">
                        <h2>Пользователи</h2>
                        
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Имя</th>
                                    <th>Email</th>
                                    <th>Телефон</th>
                                    <th>Админ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td>{{ user.id?.slice(0, 8) }}...</td>
                                    <td>{{ user.first_name }} {{ user.last_name }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>{{ user.phone || '-' }}</td>
                                    <td>{{ user.is_admin ? '✅' : '❌' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div v-else class="no-access">
        <p>Доступ запрещен</p>
        <router-link to="/">На главную</router-link>
    </div>
</template>

<script>
import { supabase } from '../config/supabase'
import { useAuthStore } from '../stores/auth'
import Breadcrumbs from '../components/Breadcrumbs.vue'

export default {
    name: 'AdminPanel',
    components: { Breadcrumbs },
    data() {
        return {
            activeTab: 'orders',
            orders: [],
            products: [],
            users: [],
            selectedOrder: null,
            orderFilter: 'all',
            showAddProduct: false,
            isAdmin: false,
            loading: true
        }
    },
    computed: {
        authStore() {
            return useAuthStore()
        }
    },
    async mounted() {
        // Ждем инициализацию
        await this.authStore.init()
        
        console.log('User:', this.authStore.user)
        console.log('Profile:', this.authStore.profile)
        console.log('isAdmin:', this.authStore.isAdmin)
        
        if (this.authStore.isAdmin) {
            this.isAdmin = true
            await this.loadOrders()
            await this.loadProducts()
            await this.loadUsers()
        }
        
        this.loading = false
    },
    methods: {
        async loadOrders() {
            let query = supabase
                .from('orders')
                .select('*, order_items(*)')
                .order('created_at', { ascending: false })
            
            if (this.orderFilter !== 'all') {
                query = query.eq('status', this.orderFilter)
            }
            
            const { data } = await query
            if (data) this.orders = data
        },
        
        async loadProducts() {
            const { data } = await supabase
                .from('products')
                .select('*')
                .order('id')
            if (data) this.products = data
        },
        
        async loadUsers() {
            const { data: profiles } = await supabase
                .from('profiles')
                .select('*')
            
            if (profiles) {
                this.users = profiles
            }
        },
        
        async updateOrderStatus(order) {
            await supabase
                .from('orders')
                .update({ status: order.status })
                .eq('id', order.id)
        },
        
        async toggleStock(product) {
            await supabase
                .from('products')
                .update({ in_stock: !product.in_stock })
                .eq('id', product.id)
            
            product.in_stock = !product.in_stock
        },
        
        showOrderDetails(order) {
            this.selectedOrder = {
                ...order,
                items: order.order_items || []
            }
        },
        
        getCategoryName(id) {
            const cats = { 1: 'Футболки', 2: 'Худи', 3: 'Аксессуары', 4: 'Винил', 5: 'CD' }
            return cats[id] || 'Н/Д'
        },
        
        formatDate(date) {
            return new Date(date).toLocaleDateString('ru-RU')
        }
    }
}
</script>
<style scoped>
.admin-page { background: #fff; min-height: 100vh; }
.admin-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
h1 { font-family: 'Zen Antique', serif; font-size: 36px; margin: 30px 0; }

.admin-layout { display: grid; grid-template-columns: 220px 1fr; gap: 40px; }

.admin-sidebar { position: sticky; top: 120px; }
.admin-nav { display: flex; flex-direction: column; gap: 5px; }
.admin-nav button { padding: 15px; border: none; background: #f5f5f5; text-align: left; cursor: pointer; border-radius: 4px; font-size: 14px; font-family: 'Inter', sans-serif; }
.admin-nav button.active { background: #000; color: #fff; }

.admin-content h2 { font-size: 24px; margin-bottom: 20px; }

.filters { margin-bottom: 20px; }
.filters select { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }

.btn-add { padding: 12px 24px; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 20px; font-size: 14px; }

.admin-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.admin-table th { text-align: left; padding: 12px; background: #f5f5f5; font-weight: 600; }
.admin-table td { padding: 12px; border-bottom: 1px solid #eee; }
.admin-table select { padding: 6px; border: 1px solid #ddd; border-radius: 4px; }

.btn-small { padding: 5px 10px; background: #f5f5f5; border: none; cursor: pointer; border-radius: 4px; font-size: 16px; }

.order-details-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; padding: 30px; border-radius: 8px; max-width: 700px; width: 90%; max-height: 80vh; overflow-y: auto; position: relative; }
.close-btn { position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; }
.order-info { margin: 20px 0; }
.order-info p { margin-bottom: 8px; font-size: 14px; }

.no-access { text-align: center; padding: 100px; }
.no-access a { color: #000; }

@media (max-width: 768px) {
    .admin-layout { grid-template-columns: 1fr; }
}
</style>