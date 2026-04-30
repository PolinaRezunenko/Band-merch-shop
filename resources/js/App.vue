<template>
    <div id="app">
        <header :class="['header', isLightTheme ? 'header-light' : 'header-dark']">
            <div class="header-container">
                <div class="header-left">
                    <BurgerMenu />
                    <nav class="nav-main">
                        <router-link to="/">Главная</router-link>
                        <router-link to="/catalog">Каталог</router-link>
                        <router-link to="/new">Новинки</router-link>
                    </nav>
                </div>

                <router-link to="/" class="logo-center">
                    <img src="/images/icons/logo.svg" alt="Logo" class="logo-img">
                </router-link>

                <div class="header-right">
                    <!-- Кнопка поиска -->
                    <button class="icon-btn" @click="showSearch = true">
                        <img src="/images/icons/search.svg" alt="Поиск" class="icon-img">
                    </button>
                    <router-link to="/favorites" class="icon-btn">
                        <img src="/images/icons/fav.svg" alt="Избранное" class="icon-img">
                    </router-link>
                    <button class="icon-btn" @click="handleProfileClick">
                        <img src="/images/icons/lk.svg" alt="Профиль" class="icon-img">
                    </button>
                    <router-link to="/cart" class="icon-btn cart-btn">
                        <img src="/images/icons/cart.svg" alt="Корзина" class="icon-img">
                        <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
                    </router-link>
                </div>
            </div>
        </header>

        <!-- Модальное окно поиска -->
        <SearchModal :isVisible="showSearch" @close="showSearch = false" />

        <!-- Модальное окно авторизации -->
        <AuthModal 
            :isVisible="showAuthModal" 
            @close="showAuthModal = false"
            @success="onAuthSuccess"
        />

        <main>
            <router-view />
        </main>
        
        <div class="divider-strip"></div>
        
        <footer class="footer">
            <div class="footer-grid">
                <div class="footer-col">
                    <router-link to="/" class="logo">
                        <img src="/images/icons/logofooter.svg" alt="Logo" class="logo-img">
                    </router-link>
                    <p>Ваш поставщик в мир лимитированного ассортимента с доставкой по всему миру</p>
                    <div class="social-links">
                        <a href="https://t.me/ecosavonry" class="social-link telegram" target="_blank">
                            <img src="/images/icons/tg.svg" alt="tg" >
                        </a>
                        <a href="https://vk.com/savonry_beauty" class="social-link vk" target="_blank">
                            <img src="/images/icons/vk.svg" alt="vk">
                        </a>
                    </div>
                </div>
                <div class="footer-col">
                    <h4>Каталог</h4>
                    <router-link to="/catalog/t-shirts">Футболки</router-link>
                    <router-link to="/catalog/hoodies">Худи и свитшоты</router-link>
                    <router-link to="/catalog/accessories">Аксессуары</router-link>
                    <router-link to="/catalog/vinyl">Винил</router-link>
                    <router-link to="/catalog/cd">CD-диски</router-link>
                </div>
                <div class="footer-col">
                    <h4>Меню</h4>
                    <router-link to="/about">О нас</router-link>
                    <router-link to="/contacts">Контакты</router-link>
                    <router-link to="/favorites">Избранное</router-link>
                    <button class="footer-link-btn" @click="handleProfileClick">Личный кабинет</button>
                </div>
                <div class="footer-col">
                    <h4>Поддержка</h4>
                    <router-link to="/delivery">Доставка</router-link>
                    <router-link to="/payment">Оплата</router-link>
                    <router-link to="/faq">Частые вопросы</router-link>
                    <router-link to="/contacts">Клиентский сервис</router-link>
                    <router-link to="/track">Отследить заказ</router-link>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2025 Band Merch. Все права защищены.</p>
            </div>
        </footer>
        <!-- Контейнер для уведомлений -->
<div class="notification-container">
  <NotificationToast ref="notificationRef" />
</div>

        <NotificationToast ref="notificationRef" />
    </div>
</template>

<script>
import { useCartStore } from './stores/cart'
import { useAuthStore } from './stores/auth'
import { ref, onMounted, provide } from 'vue'
import NotificationToast from './components/NotificationToast.vue'
import BurgerMenu from './components/BurgerMenu.vue'
import AuthModal from './components/AuthModal.vue'
import SearchModal from './components/SearchModal.vue'

export default {
    name: 'App',
    components: { NotificationToast, BurgerMenu, AuthModal, SearchModal },
    setup() {
        const notificationRef = ref(null)
        
        const notify = {
            success: (title, message) => notificationRef.value?.success(title, message),
            error: (title, message) => notificationRef.value?.error(title, message),
            info: (title, message) => notificationRef.value?.info(title, message)
        }
        
        provide('notify', notify)
        return { notificationRef }
    },
    data() {
        return {
            showAuthModal: false,
            showSearch: false
        }
    },
    computed: {
        isLightTheme() {
            const currentPath = this.$route.path
            if (currentPath === '/' || currentPath.startsWith('/catalog')) return true
            return false
        },
        cartCount() {
            return useCartStore().totalItems
        }
    },
    watch: {
        '$route'() {
            window.scrollTo(0, 0)
        }
    },
    methods: {
        handleProfileClick() {
            const authStore = useAuthStore()
            if (authStore.isLoggedIn) {
                this.$router.push('/profile')
            } else {
                this.showAuthModal = true
            }
        },
        onAuthSuccess() {
            this.showAuthModal = false
            this.$router.push('/profile')
        }
    }
}
</script>

<style>
/* СБРОС */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Montserrat', 'Arial', sans-serif;
    background: #ffffff;
    color: #7B7B7B;
    min-height: 100vh;
}

.social-links {
    gap: 17px;
    display: flex;
    margin-bottom: 87px;
}

#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* ========== ШАПКА ========== */
.header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 0;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 97px;
}

/* СЛЕВА */
.header-left {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex: 1;
}

.nav-main {
    display: flex;
    gap: 2rem;
}

.nav-main a {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-decoration: none;
    transition: opacity 0.3s;
}

/* ЦЕНТР */
.logo-center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-decoration: none;
}

.logo-img {
    height: 66px;
    width: auto;
}

/* СПРАВА */
.header-right {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    flex: 1;
    justify-content: flex-end;
}

.icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
}

.icon-img {
    width: 22px;
    height: 22px;
}

.cart-count {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 15px;
    height: 15px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    font-weight: 700;
}

/* ===== СВЕТЛАЯ ШАПКА ===== */
.header-light {
    background: transparent;
    border-bottom: none;
    position: absolute;
}

.header-light .nav-main a { color: #fff; }
.header-light .nav-main a:hover,
.header-light .nav-main a.router-link-active { 
    opacity: 0.8;
    text-decoration: underline;
}
.header-light .logo-img {
    filter: brightness(0) invert(1);
}
.header-light .icon-img {
    filter: brightness(0) invert(1);
}
.header-light .cart-count {
    background: #ffffff;
    color: #000000;
}

/* ===== ТЁМНАЯ ШАПКА ===== */
.header-dark {
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    position: sticky;
}

.header-dark .nav-main a { color: #000; }
.header-dark .nav-main a:hover,
.header-dark .nav-main a.router-link-active { 
    opacity: 0.7;
    text-decoration: underline;
}
.header-dark .logo-img {
    filter: brightness(0);
}
.header-dark .icon-img {
    filter: brightness(0);
}
.header-dark .cart-count {
    background: #000;
    color: #fff;
}

/* ОСНОВНОЙ КОНТЕНТ */
main { flex: 1; }

.divider-strip {
    height: 4px;
    background: #0a0a0a;
    max-width: 1200px;
    margin: 60px auto 0;
}

/* ФУТЕР */
.footer {
    background: #ffffff;
    border-top: 1px solid #ffffff;
    padding: 3rem 2rem 1rem;
    margin-top: auto;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-col h4 {
    color: #000000;
    margin-bottom: 18px;
    font-family: 'Ruberoid', sans-serif;
    font-size: 22.89px;
    letter-spacing: 1px;
}

.footer-col a,
.footer-link-btn {
    color: #000000;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
    font-size: 16px;
    transition: color 0.3s;
    font-family: 'Inter', sans-serif;
}

.footer-link-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-align: left;
}

.footer-col a:hover,
.footer-link-btn:hover { 
    color: #444444; 
}

.footer-col p {
    color: #7B7B7B;
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    margin-bottom: 22px;
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #222;
    color: #666;
    font-size: 0.8rem;
}

@media (max-width: 768px) {
    .nav-main { display: none; }
    .header-container { padding: 0 1rem; }
    .footer-grid { grid-template-columns: 1fr; }
}
</style>