<template>
    <div class="admin-page" v-if="authStore.user">
        <div class="admin-container">
            <Breadcrumbs :items="[{ label: 'Админ-панель', link: null }]" />
            
            <h1>Админ-панель</h1>
            
            <div class="admin-layout">
                <!-- Боковое меню -->
                <aside class="admin-sidebar">
                    <nav class="admin-nav">
                        <button :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6H21V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V6Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                <path d="M8 4V6" stroke="currentColor" stroke-width="2"/>
                                <path d="M16 4V6" stroke="currentColor" stroke-width="2"/>
                                <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            <span>Заказы</span>
                        </button>
                        <button :class="{ active: activeTab === 'products' }" @click="activeTab = 'products'">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M20 7H4C3.44772 7 3 7.44772 3 8V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V8C21 7.44772 20.5523 7 20 7Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            <span>Товары</span>
                        </button>
                        <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" stroke-width="2" fill="none"/>
                                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                            <span>Пользователи</span>
                        </button>
                        <button :class="{ active: activeTab === 'stats' }" @click="activeTab = 'stats'">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4" y="14" width="4" height="6" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                <rect x="10" y="8" width="4" height="12" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                <rect x="16" y="2" width="4" height="18" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                            </svg>
                            <span>Статистика</span>
                        </button>
                    </nav>
                </aside>
                
                <!-- Контент -->
                <div class="admin-content">
                    
                    <!-- ===== ЗАКАЗЫ ===== -->
                    <div v-if="activeTab === 'orders'">
                        <h2>Заказы</h2>
                        
                        <div class="filters">
                            <select v-model="orderFilter" @change="loadOrders">
                                <option value="all">Все</option>
                                <option value="pending">В обработке</option>
                                <option value="processing">Обрабатываются</option>
                                <option value="shipped">Отправлены</option>
                                <option value="delivered">Доставлены</option>
                                <option value="cancelled">Отменены</option>
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
                                    <td data-label="ID">#{{ order.id }}</td>
                                    <td data-label="Дата">{{ formatDate(order.created_at) }}</td>
                                    <td data-label="Клиент">{{ order.first_name }} {{ order.last_name }}</td>
                                    <td data-label="Сумма">{{ order.total_price?.toLocaleString() }} ₽</td>
                                    <td data-label="Статус">
                                        <select v-model="order.status" @change="updateOrderStatus(order)">
                                            <option value="pending">В обработке</option>
                                            <option value="processing">Обрабатывается</option>
                                            <option value="shipped">Отправлен</option>
                                            <option value="delivered">Доставлен</option>
                                            <option value="cancelled">Отменен</option>
                                        </select>
                                    </td>
                                    <td data-label="Действия">
                                        <button @click="showOrderDetails(order)" class="btn-small">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                        </button>
                                        <button @click="deleteOrder(order.id)" class="btn-small btn-delete">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 7H20" stroke="currentColor" stroke-width="2"/>
                                                <path d="M10 11V16" stroke="currentColor" stroke-width="2"/>
                                                <path d="M14 11V16" stroke="currentColor" stroke-width="2"/>
                                                <path d="M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7" stroke="currentColor" stroke-width="2" fill="none"/>
                                                <path d="M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <!-- Детали заказа (модалка) -->
                        <div v-if="selectedOrder" class="modal-overlay" @click="selectedOrder = null">
                            <div class="modal-content" @click.stop>
                                <h3>Заказ #{{ selectedOrder.id }}</h3>
                                <button @click="selectedOrder = null" class="modal-close">✕</button>
                                <div class="order-info">
                                    <p><strong>Клиент:</strong> {{ selectedOrder.first_name }} {{ selectedOrder.last_name }}</p>
                                    <p><strong>Email:</strong> {{ selectedOrder.email }}</p>
                                    <p><strong>Телефон:</strong> {{ selectedOrder.phone || '—' }}</p>
                                    <p><strong>Город:</strong> {{ selectedOrder.city || '—' }}</p>
                                    <p><strong>Адрес:</strong> {{ selectedOrder.address || '—' }}</p>
                                    <p><strong>Доставка:</strong> {{ selectedOrder.delivery_method }}</p>
                                    <p><strong>Оплата:</strong> {{ selectedOrder.payment_method }}</p>
                                </div>
                                <h4>Товары:</h4>
                                <table class="admin-table">
                                    <thead>
                                        <tr><th>Товар</th><th>Размер</th><th>Цена</th><th>Кол-во</th><th>Сумма</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in selectedOrder.items" :key="item.id">
                                            <td data-label="Товар">{{ item.product_name }}</td>
                                            <td data-label="Размер">{{ item.size || '—' }}</td>
                                            <td data-label="Цена">{{ item.price?.toLocaleString() }} ₽</td>
                                            <td data-label="Кол-во">{{ item.quantity }}</td>
                                            <td data-label="Сумма">{{ (item.price * item.quantity).toLocaleString() }} ₽</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ===== ТОВАРЫ ===== -->
                    <div v-if="activeTab === 'products'">
                        <h2>Товары</h2>
                        <button @click="openAddProduct" class="btn-add">+ Добавить товар</button>
                        
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
                                    <td data-label="ID">{{ product.id }}</td>
                                    <td data-label="Фото"><img :src="getAdminProductImage(product)" width="40" height="40" style="object-fit:cover; border-radius:4px;" @error="e => e.target.src='https://placehold.co/40x40/f5f5f5/0a0a0a?text=Нет'"></td>
                                    <td data-label="Название">{{ product.name }}</td>
                                    <td data-label="Цена">{{ product.price?.toLocaleString() }} ₽</td>
                                    <td data-label="Категория">{{ getCategoryName(product.category_id) }}</td>
                                    <td data-label="В наличии">
                                        <button @click="toggleStock(product)" class="btn-toggle">
                                            <svg v-if="product.in_stock" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </button>
                                    </td>
                                    <td data-label="Действия">
                                        <button @click="editProduct(product)" class="btn-small">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                        </button>
                                        <button @click="deleteProduct(product.id)" class="btn-small btn-delete">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 7H20" stroke="currentColor" stroke-width="2"/>
                                                <path d="M10 11V16" stroke="currentColor" stroke-width="2"/>
                                                <path d="M14 11V16" stroke="currentColor" stroke-width="2"/>
                                                <path d="M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7" stroke="currentColor" stroke-width="2" fill="none"/>
                                                <path d="M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <!-- Форма добавления/редактирования товара -->
                        <div v-if="showProductForm" class="modal-overlay" @click="showProductForm = false">
                            <div class="modal-content" @click.stop>
                                <h3>{{ editingProduct ? 'Редактировать товар' : 'Добавить товар' }}</h3>
                                <button @click="showProductForm = false" class="modal-close">✕</button>
                                
                                <div class="form-grid-admin">
                                    <div class="form-group full-width">
                                        <label>Название</label>
                                        <input v-model="productForm.name" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Цена</label>
                                        <input v-model.number="productForm.price" type="number" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Старая цена</label>
                                        <input v-model.number="productForm.old_price" type="number" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Категория</label>
                                        <select v-model.number="productForm.category_id" class="form-input">
                                            <option :value="1">Футболки</option>
                                            <option :value="2">Худи</option>
                                            <option :value="3">Аксессуары</option>
                                            <option :value="4">Винил</option>
                                            <option :value="5">CD</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Коллекция</label>
                                        <select v-model.number="productForm.collection_id" class="form-input">
                                            <option :value="null">Без коллекции</option>
                                            <option :value="1">That's The Spirit</option>
                                            <option :value="2">POST HUMAN</option>
                                            <option :value="3">ERAS</option>
                                            <option :value="4">TOUR</option>
                                        </select>
                                    </div>
                                    <div class="form-group full-width">
                                        <label>URL фото</label>
                                        <input v-model="productForm.image_url" class="form-input">
                                    </div>
                                    <div class="form-group full-width">
                                        <label>Размеры (через запятую)</label>
                                        <input v-model="productForm.sizes" class="form-input" placeholder="S,M,L,XL">
                                    </div>
                                    <div class="form-group full-width">
                                        <label>Описание</label>
                                        <textarea v-model="productForm.description" class="form-input" rows="3"></textarea>
                                    </div>
                                    <div class="form-group checkbox-group">
                                        <label><input type="checkbox" v-model="productForm.in_stock"> В наличии</label>
                                        <label><input type="checkbox" v-model="productForm.is_new"> Новинка</label>
                                        <label><input type="checkbox" v-model="productForm.is_hot"> Хит</label>
                                    </div>
                                </div>
                                
                                <button @click="saveProduct" class="btn-submit-admin">
                                    {{ editingProduct ? 'Сохранить' : 'Добавить товар' }}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ===== ПОЛЬЗОВАТЕЛИ ===== -->
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
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td data-label="ID">{{ user.id?.slice(0, 8) }}...</td>
                                    <td data-label="Имя">{{ user.first_name }} {{ user.last_name }}</td>
                                    <td data-label="Email">{{ user.email || '—' }}</td>
                                    <td data-label="Телефон">{{ user.phone || '—' }}</td>
                                    <td data-label="Админ">
                                        <button @click="toggleAdmin(user)" class="btn-toggle">
                                            <svg v-if="user.is_admin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </button>
                                    </td>
                                    <td data-label="Действия">
                                        <button @click="deleteUser(user.id)" class="btn-small btn-delete">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 7H20" stroke="currentColor" stroke-width="2"/>
                                                <path d="M10 11V16" stroke="currentColor" stroke-width="2"/>
                                                <path d="M14 11V16" stroke="currentColor" stroke-width="2"/>
                                                <path d="M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7" stroke="currentColor" stroke-width="2" fill="none"/>
                                                <path d="M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="currentColor" stroke-width="2" fill="none"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- ===== СТАТИСТИКА ===== -->
                    <div v-if="activeTab === 'stats'">
                        <h2>Статистика</h2>
                        
                        <div class="stats-grid">
                            <div class="stat-card">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 6H21V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V6Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                    <path d="M8 4V6" stroke="currentColor" stroke-width="2"/>
                                    <path d="M16 4V6" stroke="currentColor" stroke-width="2"/>
                                    <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
                                </svg>
                                <div class="stat-number">{{ stats.totalOrders }}</div>
                                <div class="stat-label">Всего заказов</div>
                            </div>
                            <div class="stat-card">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 1V23" stroke="currentColor" stroke-width="2"/>
                                    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2"/>
                                </svg>
                                <div class="stat-number">{{ stats.totalRevenue?.toLocaleString() }} ₽</div>
                                <div class="stat-label">Общая выручка</div>
                            </div>
                            <div class="stat-card">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 7H4C3.44772 7 3 7.44772 3 8V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V8C21 7.44772 20.5523 7 20 7Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" stroke-width="2"/>
                                </svg>
                                <div class="stat-number">{{ stats.totalProducts }}</div>
                                <div class="stat-label">Товаров</div>
                            </div>
                            <div class="stat-card">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" stroke-width="2" fill="none"/>
                                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                </svg>
                                <div class="stat-number">{{ stats.totalUsers }}</div>
                                <div class="stat-label">Пользователей</div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
    
    <div v-else class="no-access">
        <p>Загрузка...</p>
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
            stats: { totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalUsers: 0 },
            selectedOrder: null,
            orderFilter: 'all',
            showProductForm: false,
            editingProduct: null,
            productForm: {
                name: '', price: 0, old_price: null, category_id: 1, collection_id: null,
                image_url: '', sizes: 'S,M,L,XL', description: '', in_stock: true, is_new: false, is_hot: false
            }
        }
    },
    computed: {
        authStore() { return useAuthStore() }
    },
    async mounted() {
        await this.loadOrders()
        await this.loadProducts()
        await this.loadUsers()
        await this.loadStats()
    },
    methods: {
        async loadOrders() {
            let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
            if (this.orderFilter !== 'all') query = query.eq('status', this.orderFilter)
            const { data } = await query
            if (data) this.orders = data
        },
        async loadProducts() {
            const { data } = await supabase.from('products').select('*').order('id')
            if (data) this.products = data
        },
        async loadUsers() {
            const { data } = await supabase.from('profiles').select('*')
            if (data) {
                this.users = data.map(profile => ({
                    ...profile,
                    email: profile.email || '—',
                    phone: profile.phone || '—'
                }))
            }
        },
        async loadStats() {
            const { data: orders } = await supabase.from('orders').select('total_price')
            const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true })
            const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
            
            this.stats.totalOrders = orders?.length || 0
            this.stats.totalRevenue = orders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0
            this.stats.totalProducts = totalProducts || 0
            this.stats.totalUsers = totalUsers || 0
        },
        
        async updateOrderStatus(order) {
            await supabase.from('orders').update({ status: order.status }).eq('id', order.id)
        },
        async deleteOrder(id) {
            if (!confirm('Удалить заказ?')) return
            await supabase.from('order_items').delete().eq('order_id', id)
            await supabase.from('orders').delete().eq('id', id)
            await this.loadOrders()
        },
        showOrderDetails(order) {
            this.selectedOrder = { ...order, items: order.order_items || [] }
        },
        
        async toggleStock(product) {
            await supabase.from('products').update({ in_stock: !product.in_stock }).eq('id', product.id)
            product.in_stock = !product.in_stock
        },
        async deleteProduct(id) {
            if (!confirm('Удалить товар?')) return
            await supabase.from('products').delete().eq('id', id)
            await this.loadProducts()
            await this.loadStats()
        },
        openAddProduct() {
            this.editingProduct = null
            this.productForm = { name: '', price: 0, old_price: null, category_id: 1, collection_id: null, image_url: '', sizes: 'S,M,L,XL', description: '', in_stock: true, is_new: false, is_hot: false }
            this.showProductForm = true
        },
        editProduct(product) {
            this.editingProduct = product
            this.productForm = {
                name: product.name, price: product.price, old_price: product.old_price,
                category_id: product.category_id, collection_id: product.collection_id,
                image_url: product.image_url, sizes: Array.isArray(product.sizes) ? product.sizes.join(',') : product.sizes,
                description: product.description || '', in_stock: product.in_stock,
                is_new: product.is_new, is_hot: product.is_hot
            }
            this.showProductForm = true
        },
        async saveProduct() {
            const data = {
                name: this.productForm.name,
                price: this.productForm.price,
                old_price: this.productForm.old_price || null,
                category_id: this.productForm.category_id,
                collection_id: this.productForm.collection_id || null,
                image_url: this.productForm.image_url,
                sizes: this.productForm.sizes.split(',').map(s => s.trim()),
                description: this.productForm.description,
                in_stock: this.productForm.in_stock,
                is_new: this.productForm.is_new,
                is_hot: this.productForm.is_hot
            }
            
            if (this.editingProduct) {
                await supabase.from('products').update(data).eq('id', this.editingProduct.id)
            } else {
                await supabase.from('products').insert(data)
            }
            
            this.showProductForm = false
            await this.loadProducts()
            await this.loadStats()
        },
        
        async toggleAdmin(user) {
            await supabase.from('profiles').update({ is_admin: !user.is_admin }).eq('id', user.id)
            user.is_admin = !user.is_admin
        },
        async deleteUser(id) {
            if (!confirm('Удалить пользователя?')) return            await supabase.from('profiles').delete().eq('id', id)
            await this.loadUsers()
            await this.loadStats()
        },
        
        getCategoryName(id) {
            const cats = { 1: 'Футболки', 2: 'Худи', 3: 'Аксессуары', 4: 'Винил', 5: 'CD' }
            return cats[id] || '—'
        },
        formatDate(date) { return new Date(date).toLocaleDateString('ru-RU') },
        getAdminProductImage(product) {
            return product.image_url || 'https://placehold.co/50x50/f5f5f5/0a0a0a?text=Нет'
        }
    }
}
</script>

<style scoped>
.admin-page { background: #fff; min-height: 100vh; }
.admin-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
h1 { font-family: 'Raleway', sans-serif; font-size: 36px; margin: 30px 0; }

.admin-layout { display: grid; grid-template-columns: 220px 1fr; gap: 40px; }
.admin-sidebar { position: sticky; top: 120px; }
.admin-nav { display: flex; flex-direction: column; gap: 5px; }
.admin-nav button { 
    padding: 12px 16px; 
    border: none; 
    background: #f5f5f5; 
    text-align: left; 
    cursor: pointer; 
    border-radius: 8px; 
    font-size: 14px; 
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s;
    width: 100%;
}
.admin-nav button svg { flex-shrink: 0; width: 18px; height: 18px; }
.admin-nav button.active { background: #000; color: #fff; }
.admin-nav button.active svg { stroke: #fff; }

.admin-content h2 { font-size: 24px; margin-bottom: 20px; }
.filters { margin-bottom: 20px; }
.filters select { padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }

.btn-add { 
    padding: 10px 20px; 
    background: #000; 
    color: #fff; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
    margin-bottom: 20px; 
    font-size: 14px;
}

.admin-table { 
    width: 100%; 
    border-collapse: collapse; 
    font-size: 13px;
}
.admin-table th { 
    text-align: left; 
    padding: 12px; 
    background: #f5f5f5; 
    font-weight: 600;
}
.admin-table td { 
    padding: 12px; 
    border-bottom: 1px solid #eee;
}
.admin-table select { 
    padding: 6px 10px; 
    border: 1px solid #ddd; 
    border-radius: 6px;
}

.btn-small { 
    padding: 5px 8px; 
    background: #f5f5f5; 
    border: none; 
    cursor: pointer; 
    border-radius: 6px; 
    margin: 0 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.btn-small svg { stroke: #333; width: 14px; height: 14px; }
.btn-delete:hover { background: #ffe6e6; }
.btn-toggle { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; }

/* Модалки */
.modal-overlay { 
    position: fixed; 
    top: 0; 
    left: 0; 
    right: 0; 
    bottom: 0; 
    background: rgba(0,0,0,0.5); 
    z-index: 2000; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    padding: 20px;
}
.modal-content { 
    background: #fff; 
    padding: 25px; 
    border-radius: 16px; 
    max-width: 700px; 
    width: 100%; 
    max-height: 80vh; 
    overflow-y: auto; 
    position: relative;
}
.modal-close { 
    position: absolute; 
    top: 15px; 
    right: 15px; 
    background: none; 
    border: none; 
    font-size: 24px; 
    cursor: pointer;
}
.order-info { margin: 20px 0; }
.order-info p { margin-bottom: 8px; font-size: 14px; }

.form-grid-admin { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.full-width { grid-column: span 2; }
.form-group label { font-size: 13px; color: #666; }
.form-input { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
.form-input:focus { outline: none; border-color: #000; }
.checkbox-group { display: flex; flex-direction: row; gap: 20px; align-items: center; flex-wrap: wrap; }
.checkbox-group label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
.btn-submit-admin { 
    width: 100%; 
    padding: 12px; 
    background: #000; 
    color: #fff; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
    font-size: 14px; 
    margin-top: 15px;
}

/* Статистика */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.stat-card { 
    background: #f9f9f9; 
    padding: 20px; 
    border-radius: 12px; 
    text-align: center;
}
.stat-card svg { margin-bottom: 10px; stroke: #000; }
.stat-number { font-size: 28px; font-weight: 700; color: #000; }
.stat-label { font-size: 13px; color: #666; margin-top: 5px; }

.no-access { text-align: center; padding: 100px; }

/* ========== АДАПТИВ ДЛЯ 1024px ========== */
@media (max-width: 1024px) {
    .admin-container { padding: 30px 20px; }
    h1 { font-size: 32px; margin: 20px 0; }
}

/* ========== АДАПТИВ ДЛЯ 780px ========== */
@media (max-width: 780px) {
    .admin-container { padding: 25px 16px; }
    h1 { font-size: 28px; }
    
    .admin-layout { 
        grid-template-columns: 1fr; 
        gap: 20px;
    }
    
    .admin-sidebar { 
        position: static;
    }
    
    .admin-nav { 
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .admin-nav button { 
        flex: 1 1 auto;
        justify-content: center;
        padding: 10px 14px;
        font-size: 13px;
        white-space: nowrap;
    }
    
    .admin-nav button svg { width: 16px; height: 16px; }
    
    .admin-content h2 { font-size: 22px; }
    
    /* Таблицы превращаются в карточки */
    .admin-table thead {
        display: none;
    }
    
    .admin-table tbody tr {
        display: block;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 10px;
        padding: 10px;
        background: #fff;
    }
    
    .admin-table tbody td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 10px;
        border-bottom: 1px solid #f0f0f0;
        gap: 10px;
        font-size: 13px;
    }
    
    .admin-table tbody td:last-child {
        border-bottom: none;
    }
    
    .admin-table tbody td::before {
        content: attr(data-label);
        font-weight: 600;
        font-size: 12px;
        color: #666;
        flex-shrink: 0;
        min-width: 80px;
    }
    
    .stats-grid { 
        grid-template-columns: repeat(2, 1fr); 
        gap: 12px;
    }
    
    .stat-card { padding: 15px; }
    .stat-number { font-size: 24px; }
    .stat-card svg { width: 28px; height: 28px; }
    
    .form-grid-admin { grid-template-columns: 1fr; }
    .form-group.full-width { grid-column: span 1; }
}

/* ========== АДАПТИВ ДЛЯ 480px ========== */
@media (max-width: 480px) {
    .admin-container { padding: 20px 12px; }
    h1 { font-size: 24px; margin: 15px 0; }
    
    .admin-nav button { 
        padding: 8px 12px;
        font-size: 12px;
        flex: 1 1 calc(50% - 8px);
        white-space: normal;
    }
    
    .admin-content h2 { font-size: 20px; margin-bottom: 15px; }
    
    .btn-add { 
        width: 100%;
        text-align: center;
        padding: 10px;
        font-size: 13px;
    }
    
    .filters select { 
        width: 100%;
        padding: 8px;
    }
    
    .admin-table tbody td {
        padding: 6px 10px;
        font-size: 12px;
    }
    
    .admin-table tbody td::before {
        min-width: 70px;
        font-size: 11px;
    }
    
    .stats-grid { gap: 10px; }
    .stat-card { padding: 12px; }
    .stat-number { font-size: 20px; }
    .stat-label { font-size: 11px; }
    .stat-card svg { width: 24px; height: 24px; margin-bottom: 6px; }
    
    .modal-content { padding: 20px; margin: 0 10px; }
    .modal-content h3 { font-size: 18px; }
    .order-info p { font-size: 12px; }
    
    .checkbox-group { flex-direction: column; align-items: flex-start; gap: 8px; }
    .form-input { padding: 8px 10px; font-size: 13px; }
    .btn-submit-admin { padding: 10px; font-size: 13px; }
}

/* ========== АДАПТИВ ДЛЯ 390px ========== */
@media (max-width: 390px) {
    .admin-container { padding: 15px 10px; }
    h1 { font-size: 22px; }
    
    .admin-nav button { 
        padding: 6px 10px;
        font-size: 11px;
        flex: 1 1 100%;
    }
    
    .admin-content h2 { font-size: 18px; }
    
    .admin-table tbody td {
        padding: 5px 8px;
        font-size: 11px;
        flex-wrap: wrap;
    }
    
    .admin-table tbody td::before {
        min-width: 65px;
        font-size: 10px;
    }
    
    .stats-grid { gap: 8px; }
    .stat-card { padding: 10px; }
    .stat-number { font-size: 18px; }
    
    .btn-small { padding: 3px 5px; }
    .btn-small svg { width: 12px; height: 12px; }
    
    .modal-content { padding: 15px; }
    .modal-close { top: 12px; right: 12px; font-size: 20px; }
}
</style>