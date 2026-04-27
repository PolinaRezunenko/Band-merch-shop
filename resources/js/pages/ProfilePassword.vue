<template>
    <div class="profile-page">
        <div class="profile-container">
            <Breadcrumbs :items="[ { label: 'Личный кабинет', link: '/profile' }, { label: 'Смена пароля', link: null }]" />
            
            <div class="profile-layout">
                <aside class="profile-sidebar">
                    <h3>Привет, Анна!</h3>
                    <nav>
                        <router-link to="/profile" class="sidebar-link">Профиль</router-link>
                        <router-link to="/profile/password" class="sidebar-link active">Смена пароля</router-link>
                        <router-link to="/profile/orders" class="sidebar-link">История заказов</router-link>
                        <router-link to="/profile" class="sidebar-link">E-mail рассылка</router-link>
                    </nav>
                    <button class="btn-logout">Выход</button>
                </aside>

                <div class="profile-main">
                    <h2>Смена пароля</h2>
                    <form @submit.prevent="changePassword">
                        <input type="password" v-model="oldPassword" placeholder="Старый пароль">
                        <input type="password" v-model="newPassword" placeholder="Новый пароль">
                        <input type="password" v-model="confirmPassword" placeholder="Повторите новый пароль">
                        <button type="submit" class="btn-save">Сохранить изменения</button>
                    </form>
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
    name: 'ProfilePasswordPage',
    components: { Breadcrumbs, DiscountBanner },
    data() { return { oldPassword: '', newPassword: '', confirmPassword: '' } },
    methods: {
        changePassword() { alert('Пароль изменён!') }
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
.profile-main input { width: 100%; padding: 0.8rem; margin-bottom: 1rem; background: #1a1a1a; border: 1px solid #333; color: #fff; border-radius: 6px; }
.btn-save { background: #ff4444; color: #fff; border: none; padding: 0.9rem 2rem; border-radius: 6px; cursor: pointer; font-weight: 600; }
@media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } }
</style>