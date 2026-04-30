<template>
    <div class="home">
        <!-- Hero баннер -->
        <section class="hero" style="background-image: url('/images/hero-bg.png')">
    <div class="hero-overlay"></div>
    <div class="hero-content">
        <h1 class="hero-title">ПОГРУЗИТЕСЬ В МИР<br>СТИЛЬНЫХ НОВИНОК!</h1>
        <router-link to="/catalog" class="hero-btn">Перейти в каталог</router-link>
    </div>

    <!-- Полукруглый разделитель -->
            <div class="hero-divider"></div>
</section>

       <!-- Самое популярное сейчас -->
<PopularProducts title="Самое популярное сейчас" filter="hot" :limit="4" />

<!-- Новинки -->
<section class="section section-new">
    <div class="section-header">
        <h2 class="section-title">Новинки</h2>
    </div>
    <div class="products-grid">
        <ProductCard 
            v-for="product in newProducts"   
            :key="product.id" 
            :product="product"
        />
    </div>
</section>
<!-- Категории каталога -->
<section class="section section-categories">

    <div class="categories-layout">
        <!-- Две большие карточки слева (рядом) -->
        <div class="categories-left">
            <router-link to="/catalog/t-shirts" class="category-card category-card-large">
                <img src="/images/categories/t-shirts.png" alt="Футболки">
                <span>Футболки</span>
            </router-link>
            <router-link to="/catalog/hoodies" class="category-card category-card-large">
                <img src="/images/categories/hoodies.png" alt="Худи">
                <span>Худи</span>
            </router-link>
        </div>
        <!-- Три маленькие карточки справа (колонка) -->
        <div class="categories-right">
            <router-link to="/catalog/accessories" class="category-card category-card-small">
                <img src="/images/categories/accessories.png" alt="Аксессуары">
                <span>Аксессуары</span>
            </router-link>
            <router-link to="/catalog/vinyl" class="category-card category-card-small">
                <img src="/images/categories/vinyl.png" alt="Винил">
                <span>Винил</span>
            </router-link>
            <router-link to="/catalog/cd" class="category-card category-card-small">
                <img src="/images/categories/cd.png" alt="CD-диски">
                <span>CD-диски</span>
            </router-link>
        </div>
    </div>
</section>

        <!-- Скидка 7% -->
    <DiscountBanner />
    </div>
</template>

<script>
import { supabase } from '../config/supabase'
import PopularProducts from '../components/PopularProducts.vue'
import ProductCard from '../components/ProductCard.vue'
import DiscountBanner from '../components/DiscountBanner.vue'

export default {
    name: 'HomePage',
    components: { PopularProducts, ProductCard, DiscountBanner },
    data() {
        return {
            newProducts: [],
            email: '',
            loading: true
        }
    },
    async mounted() {
        await this.loadNewProducts()
    },
    methods: {
        async loadNewProducts() {
            const { data } = await supabase.from('products').select('*').eq('is_new', true).limit(4)
            this.newProducts = data || []
            this.loading = false
        },
        subscribe() {
            alert('Спасибо за подписку!')
            this.email = ''
        }
    }
}
</script>

<style scoped>
/* HERO БАННЕР */
.hero {
    height: 768px;
    background: url('/images/hero-bg.jpg') center/cover no-repeat;
    display: flex;
    align-items: flex-start;  /* прижимаем к верху */
    justify-content: flex-start; /* прижимаем влево */
    text-align: left; /* текст слева */
    position: relative;
}

.hero-content {
    position: relative;
    z-index: 1;
    padding: 286px 542px 171px 120px;
}


.hero::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.25);
}

/* ПОЛУКРУГЛЫЙ РАЗДЕЛИТЕЛЬ */
.hero-divider {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    width: 1440px;
    height: 80px;
    background: #fff;
    border-radius: 51px;
    z-index: 2;
}



.hero-title {
    font-family: 'Zen Antique', serif;
    font-size: 66px;
    color: #fff;
    margin-bottom: 40px;
    letter-spacing: 0px;
    text-transform: uppercase;
    line-height: 100%;
}


.hero-btn {
    font-family: 'Inter', sans-serif;
    padding: 20px 32px;
    color: #5E5E5E;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s;
    background-color: #fff;
    border-radius: 13px;
    width: 183px;
    height: 56px;
}

.hero-btn:hover {
    background: transparent;
    color: #ffffff;
    border: 2px solid rgb(255, 255, 255);
}

/* Белая область */
.home {
    background: #fff;
}

/* СЕКЦИИ */
.section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 0;
}

.section-popular {
    background: #fff;
}

.section-new {
    background: #fff;
}

.section-header {
    margin-bottom: 2rem;
}

.section-title {
   font-family: 'Ruberoid', sans-serif;
    font-weight: 500;
    font-size: 40px;
    color: #0a0a0a;
    letter-spacing: -2%;
    position: relative;
    display: inline-block;
}
.section-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 2px;
    background: #000000;
}


/* СЕКЦИИ */


/* СЕТКА ТОВАРОВ */
.products-grid {
    max-width: 1200px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

/* СЕКЦИЯ КАТАЛОГ */
.section-categories {
    background: #fff;
}

.categories-layout {
    display: flex;
    gap: 16px;
    max-width: 1200px;
    height: 471px;
}

/* Левая колонка — две карточки РЯДОМ */
.categories-left {
    display: flex;
    gap: 16px;
    flex: 1;
}

/* Правая колонка — три карточки ДРУГ ПОД ДРУГОМ */
.categories-right {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 384px;
}

/* Карточки */
.category-card {
    position: relative;
    display: block;
    text-decoration: none;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s;
}

.category-card:hover {
    transform: translateY(-4px);
}

.category-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
}

.category-card span {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    font-family: 'Inter', sans-serif;
    font-size: 40px;
    font-weight: 400;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
}

/* Большая карточка */
.category-card-large {
    flex: 1;
    height: 471px;
}

/* Маленькая карточка */
.category-card-small {
    flex: 1;
    height: 142px;
}

/* СЕКЦИЯ СКИДКИ */
.section-discount {
    position: relative;
    max-width: 1200px;
    height: 333px;
    margin: 0 auto;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    overflow: hidden;
}





.discount-content h3 {
    font-family: 'Ruberoid', sans-serif;
    font-weight: 500;
    font-size: 40px;
    color: #fff;
    margin-bottom: 16px;
    text-transform: uppercase;
}

.discount-content p {
    font-family: 'Inter', sans-serif;
    color: #fff;
    max-width: 500px;
    margin: 0 auto 24px;
    font-size: 15px;
    line-height: 1.5;
    opacity: 0.9;
}

.subscribe-form {
    display: flex;
    gap: 12px;
    max-width: 450px;
    margin: 0 auto;
}

.subscribe-form input {
    flex: 1;
    padding: 14px 20px;
    background: #fff;
    border: none;
    color: #333;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    border-radius: 8px;
    outline: none;
}

.subscribe-form input::placeholder {
    color: #999;
}

.subscribe-form button {
    padding: 14px 28px;
    background: #7f7f7f;
    color: #fff;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.3s;
}

.subscribe-form button:hover {
    background: #8f8f8f;
}

/* АДАПТИВКА */
@media (max-width: 1200px) {
    .products-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    .hero-title {
        font-size: 3rem;
    }
}

@media (max-width: 768px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .hero-title {
        font-size: 2.2rem;
    }
    .hero {
        min-height: 400px;
    }
}

@media (max-width: 480px) {
    .products-grid {
        grid-template-columns: 1fr;
    }
    .hero-title {
        font-size: 1.8rem;
    }
    .subscribe-form {
        flex-direction: column;
    }
}
</style>