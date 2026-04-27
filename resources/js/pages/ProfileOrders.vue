<template>
    <div class="profile-page">
        <div class="profile-container">
            <Breadcrumbs :items="[ { label: 'Личный кабинет', link: '/profile' }, { label: 'История заказов', link: null }]" />
            
            <div class="profile-layout">
                <aside class="profile-sidebar">
                    <h3>Привет, Анна!</h3>
                    <nav>
                        <router-link to="/profile" class="sidebar-link">Профиль</router-link>
                        <router-link to="/profile/password" class="sidebar-link">Смена пароля</router-link>
                        <router-link to="/profile/orders" class="sidebar-link active">История заказов</router-link>
                        <router-link to="/profile" class="sidebar-link">E-mail рассылка</router-link>
                    </nav>
                    <button class="btn-logout">Выход</button>
                </aside>

                <div class="profile-main">
                    <h2>История заказов</h2>
                    <table class="orders-table">
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Номер заказа</th>
                                <th>Сумма заказа</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order.id">
                                <td>{{ order.date }}</td>
                                <td>{{ order.number }}</td>
                                <td>{{ order.total.toLocaleString() }} ₽</td>
                                <td><span class="status-new">{{ order.status }}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <DiscountBanner />
    </div>
</template>

<script>
import Breadcrumbs from '../components/Breadcrumbs.vue'
import DiscountBanner from '../components/DiscountBanner.vue'

export default {
    name: 'ProfileOrdersPage',
    components: { Breadcrumbs, DiscountBanner },
    data() {
        return {
            orders: [
                { id: 1, date: '22.09.2023', number: '12345678', total: 1690, status: 'Новый заказ' }
            ]
        }
    }
}
</script>

<style scoped>
.profile-page { background: #0a0a0a; min-height: 100vh; }
.profile-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.profile-layout { display: grid; grid-template-columns: 250px 1fr; gap: 3rem; }
.profile-sidebar h3 { color: #fff; margin-bottom: 1.5rem; }
.sidebar-link { display: block; color: #999; text-decoration: none; padding: 0.7rem 0; border-bottom: 1px solid #222; }
.sidebar-link.active, .sidebar-link:hover { color: #ff4444; }
.btn-logout { margin-top: 2rem; background: none; border: 1px solid #333; color: #999; padding: 0.5rem 1rem; cursor: pointer; }
.profile-main h2 { color: #fff; margin-bottom: 1.5rem; }
.orders-table { width: 100%; border-collapse: collapse; }
.orders-table th, .orders-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #222; color: #999; }
.orders-table th { color: #fff; font-weight: 600; }
.status-new { color: #4caf50; }
@media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } }
</style>