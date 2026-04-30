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
                            📦 Заказы
                        </button>
                        <button :class="{ active: activeTab === 'products' }" @click="activeTab = 'products'">
                            🛍️ Товары
                        </button>
                        <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">
                            👥 Пользователи
                        </button>
                        <button :class="{ active: activeTab === 'stats' }" @click="activeTab = 'stats'">
                            📊 Статистика
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
                                    <td>#{{ order.id }}</td>
                                    <td>{{ formatDate(order.created_at) }}</td>
                                    <td>{{ order.first_name }} {{ order.last_name }}</td>
                                    <td>{{ order.total_price?.toLocaleString() }} ₽</td>
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
                                        <button @click="deleteOrder(order.id)" class="btn-small btn-delete">🗑️</button>
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
                                            <td>{{ item.product_name }}</td>
                                            <td>{{ item.size || '—' }}</td>
                                            <td>{{ item.price?.toLocaleString() }} ₽</td>
                                            <td>{{ item.quantity }}</td>
                                            <td>{{ (item.price * item.quantity).toLocaleString() }} ₽</td>
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
                                    <td>{{ product.id }}</td>
                                    <td><img :src="product.image_url" width="50" height="50" style="object-fit:cover;"></td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ product.price?.toLocaleString() }} ₽</td>
                                    <td>{{ getCategoryName(product.category_id) }}</td>
                                    <td>
                                        <button @click="toggleStock(product)" class="btn-toggle">
                                            {{ product.in_stock ? '✅' : '❌' }}
                                        </button>
                                    </td>
                                    <td>
                                        <button @click="editProduct(product)" class="btn-small">✏️</button>
                                        <button @click="deleteProduct(product.id)" class="btn-small btn-delete">🗑️</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <!-- Форма добавления/редактирования товара (модалка) -->
                        <div v-if="showProductForm" class="modal-overlay" @click="showProductForm = false">
                            <div class="modal-content" @click.stop>
                                <h3>{{ editingProduct ? 'Редактировать товар' : 'Добавить товар' }}</h3>
                                <button @click="showProductForm = false" class="modal-close">✕</button>
                                
                                <div class="form-grid-admin">
                                    <div class="form-group">
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
                                            <option :value="2">Худи и свитшоты</option>
                                            <option :value="3">Аксессуары</option>
                                            <option :value="4">Винил</option>
                                            <option :value="5">CD-диски</option>
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
                                    <div class="form-group">
                                        <label>URL фото</label>
                                        <input v-model="productForm.image_url" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Размеры (через запятую)</label>
                                        <input v-model="productForm.sizes" class="form-input" placeholder="S,M,L,XL">
                                    </div>
                                    <div class="form-group">
                                        <label>Описание</label>
                                        <textarea v-model="productForm.description" class="form-input" rows="3"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label>
                                            <input type="checkbox" v-model="productForm.in_stock"> В наличии
                                        </label>
                                    </div>
                                    <div class="form-group">
                                        <label>
                                            <input type="checkbox" v-model="productForm.is_new"> Новинка
                                        </label>
                                    </div>
                                    <div class="form-group">
                                        <label>
                                            <input type="checkbox" v-model="productForm.is_hot"> Хит
                                        </label>
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
                                    <td>{{ user.id?.slice(0, 8) }}...</td>
                                    <td>{{ user.first_name }} {{ user.last_name }}</td>
                                    <td>{{ user.email || '—' }}</td>
                                    <td>{{ user.phone || '—' }}</td>
                                    <td>
                                        <button @click="toggleAdmin(user)" class="btn-toggle">
                                            {{ user.is_admin ? '✅' : '❌' }}
                                        </button>
                                    </td>
                                    <td>
                                        <button @click="deleteUser(user.id)" class="btn-small btn-delete">🗑️</button>
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
                                <div class="stat-number">{{ stats.totalOrders }}</div>
                                <div class="stat-label">Всего заказов</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">{{ stats.totalRevenue?.toLocaleString() }} ₽</div>
                                <div class="stat-label">Общая выручка</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">{{ stats.totalProducts }}</div>
                                <div class="stat-label">Товаров</div>
                            </div>
                            <div class="stat-card">
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
                const { data: authUsers } = await supabase.auth.admin?.listUsers().catch(() => ({ data: { users: [] } }))
                this.users = data.map(profile => ({
                    ...profile,
                    email: authUsers?.users?.find(u => u.id === profile.id)?.email || '—'
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
            if (!confirm('Удалить пользователя?')) return
            await supabase.from('profiles').delete().eq('id', id)
            await this.loadUsers()
            await this.loadStats()
        },
        
        getCategoryName(id) {
            const cats = { 1: 'Футболки', 2: 'Худи', 3: 'Аксессуары', 4: 'Винил', 5: 'CD' }
            return cats[id] || '—'
        },
        formatDate(date) { return new Date(date).toLocaleDateString('ru-RU') }
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
.filters select { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }

.btn-add { padding: 12px 24px; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 20px; font-size: 14px; }

.admin-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.admin-table th { text-align: left; padding: 12px; background: #f5f5f5; font-weight: 600; }
.admin-table td { padding: 12px; border-bottom: 1px solid #eee; }
.admin-table select { padding: 6px; border: 1px solid #ddd; border-radius: 4px; }

.btn-small { padding: 5px 10px; background: #f5f5f5; border: none; cursor: pointer; border-radius: 4px; font-size: 16px; margin: 0 3px; }
.btn-delete:hover { background: #ffe6e6; }
.btn-toggle { background: none; border: none; cursor: pointer; font-size: 18px; }

/* Модалки */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; padding: 30px; border-radius: 12px; max-width: 700px; width: 90%; max-height: 80vh; overflow-y: auto; position: relative; }
.modal-close { position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; }
.order-info { margin: 20px 0; }
.order-info p { margin-bottom: 8px; font-size: 14px; }

.form-grid-admin { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label { font-size: 13px; color: #666; }
.form-input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
.btn-submit-admin { width: 100%; padding: 14px; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-top: 15px; }

/* Статистика */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.stat-card { background: #f9f9f9; padding: 30px; border-radius: 12px; text-align: center; }
.stat-number { font-size: 32px; font-weight: 700; color: #000; }
.stat-label { font-size: 14px; color: #666; margin-top: 8px; }

.no-access { text-align: center; padding: 100px; }

@media (max-width: 768px) {
    .admin-layout { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .form-grid-admin { grid-template-columns: 1fr; }
}
</style>      а этот файл админ панель так и остается?