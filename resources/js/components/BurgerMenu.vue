<template>
    <div class="burger-wrapper">
        <!-- Кнопка бургера -->
        <button class="burger-btn" @click="isOpen = !isOpen">
            <!-- ТВОЯ SVG иконка бургера -->
            <img 
                v-if="!isOpen" 
                src="/images/icons/burger.svg" 
                alt="Меню" 
                class="burger-icon"
                :style="{ filter: iconFilter }"
            >
            <!-- Крестик когда открыто -->
            <span v-else class="close-icon" :style="{ color: iconColor }">✕</span>
        </button>

        <!-- Оверлей (затемнение) -->
        <div v-if="isOpen" class="burger-overlay" @click="isOpen = false"></div>

        <!-- Выезжающее меню на белом фоне -->
        <nav :class="['burger-menu', { open: isOpen }]">
            <div class="burger-header">
                <span class="burger-logo">МЕНЮ</span>
                <button class="burger-close" @click="isOpen = false">✕</button>
            </div>
            
            <ul class="burger-list">
                <li><router-link to="/" @click="isOpen = false">Главная</router-link></li>
                <li><router-link to="/catalog" @click="isOpen = false">Каталог</router-link></li>
                <li><router-link to="/new" @click="isOpen = false">Новинки</router-link></li>
                
                <li class="burger-divider"></li>
                <li class="burger-subtitle">Коллекции</li>
                <li><router-link to="/catalog/thats-the-spirit" @click="isOpen = false">That's The Spirit</router-link></li>
                <li><router-link to="/catalog/post-human" @click="isOpen = false">POST HUMAN: NeX GEn</router-link></li>
                <li><router-link to="/catalog/eras" @click="isOpen = false">ERAS</router-link></li>
                <li><router-link to="/catalog/tour" @click="isOpen = false">TOUR</router-link></li>
                
                <li class="burger-divider"></li>
                <li class="burger-subtitle">Категории</li>
                <li><router-link to="/catalog/t-shirts" @click="isOpen = false">Футболки</router-link></li>
                <li><router-link to="/catalog/hoodies" @click="isOpen = false">Худи и свитшоты</router-link></li>
                <li><router-link to="/catalog/accessories" @click="isOpen = false">Аксессуары</router-link></li>
                <li><router-link to="/catalog/vinyl" @click="isOpen = false">Винил</router-link></li>
                <li><router-link to="/catalog/cd" @click="isOpen = false">CD-диски</router-link></li>
                
                <li class="burger-divider"></li>
                <li><router-link to="/about" @click="isOpen = false">О нас</router-link></li>
                <li><router-link to="/contacts" @click="isOpen = false">Контакты</router-link></li>
                <li><router-link to="/favorites" @click="isOpen = false">Избранное</router-link></li>
                <li><router-link to="/profile" @click="isOpen = false">Личный кабинет</router-link></li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'BurgerMenu',
    data() {
        return {
            isOpen: false
        }
    },
    computed: {
        iconColor() {
            const path = this.$route.path
            // На главной и каталоге - белая иконка
            if (path === '/' || path.startsWith('/catalog')) {
                return '#ffffff'
            }
            // На остальных - чёрная иконка
            return '#000000'
        },
        iconFilter() {
            const path = this.$route.path
            // На главной и каталоге - белая иконка
            if (path === '/' || path.startsWith('/catalog')) {
                return 'brightness(0) invert(1)'
            }
            // На остальных - чёрная иконка
            return 'brightness(0)'
        }
    },
    watch: {
        '$route'() {
            this.isOpen = false
        }
    }
}
</script>

<style scoped>
.burger-wrapper {
    z-index: 200;
}

.burger-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.burger-icon {
    width: 26px;
    height: 26px;
    transition: filter 0.3s;
}

.close-icon {
    font-size: 1.5rem;
    line-height: 1;
}

.burger-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 150;
}

/* Меню на белом фоне */
.burger-menu {
    position: fixed;
    top: 0;
    left: -350px;
    width: 320px;
    height: 100vh;
    background: #ffffff;
    z-index: 160;
    transition: left 0.3s ease;
    overflow-y: auto;
    padding: 2rem;
    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
}

.burger-menu.open {
    left: 0;
}

.burger-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0;
}

.burger-logo {
    color: #000;
    font-weight: 700;
    letter-spacing: 3px;
    font-size: 1.1rem;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
}

.burger-close {
    background: none;
    border: none;
    color: #000;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    transition: opacity 0.2s;
}

.burger-close:hover {
    opacity: 0.6;
}

.burger-list {
    list-style: none;
    padding: 0;
}

.burger-list li {
    margin-bottom: 0.2rem;
}

.burger-list a {
    display: block;
    color: #333;
    text-decoration: none;
    padding: 0.8rem 0;
    font-size: 0.9rem;
    transition: color 0.2s;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
}

.burger-list a:hover {
    color: #000;
    font-weight: 600;
}

.burger-subtitle {
    color: #999;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    padding: 1rem 0 0.5rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
}

.burger-divider {
    height: 1px;
    background: #e0e0e0;
    margin: 0.5rem 0;
}

@media (max-width: 768px) {
    .burger-menu {
        width: 280px;
        padding: 1.5rem;
    }
}
</style>