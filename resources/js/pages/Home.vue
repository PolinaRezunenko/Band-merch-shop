<template>
    <div class="home">
        <!-- Hero баннер -->
        <section class="hero" style="background-image: url('/images/hero-bg.png')">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1 class="hero-title">ОФИЦИАЛЬНЫЙ МЕРЧ <br>BRING ME THE HORIZON</h1>
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
                <div class="categories-left">
                    <router-link to="/catalog/t-shirts" class="category-card category-card-large">
                        <img src="/images/categories/t-shirts.png" alt="Футболки" loading="lazy">
                        <span>Футболки</span>
                    </router-link>
                    <router-link to="/catalog/hoodies" class="category-card category-card-large">
                        <img src="/images/categories/hoodies.png" alt="Худи" loading="lazy">
                        <span>Худи</span>
                    </router-link>
                </div>
                <div class="categories-right">
                    <router-link to="/catalog/accessories" class="category-card category-card-small">
                        <img src="/images/categories/accessories.png" alt="Аксессуары" loading="lazy">
                        <span>Аксессуары</span>
                    </router-link>
                    <router-link to="/catalog/vinyl" class="category-card category-card-small">
                        <img src="/images/categories/vinyl.png" alt="Винил" loading="lazy">
                        <span>Винил</span>
                    </router-link>
                    <router-link to="/catalog/cd" class="category-card category-card-small">
                        <img src="/images/categories/cd.png" alt="CD-диски" loading="lazy">
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
import { useProductsStore } from '../stores/products'
import { computed, onMounted } from 'vue'
import PopularProducts from '../components/PopularProducts.vue'
import ProductCard from '../components/ProductCard.vue'
import DiscountBanner from '../components/DiscountBanner.vue'

export default {
    name: 'HomePage',
    components: { PopularProducts, ProductCard, DiscountBanner },
    setup() {
        const store = useProductsStore()
        
        const newProducts = computed(() => store.newProducts.slice(0, 4))
        
        onMounted(async () => {
            await store.fetchAllProducts()
        })
        
        return { newProducts }
    }
}
</script>

<style scoped>
/* Все ваши стили остаются БЕЗ ИЗМЕНЕНИЙ */
.hero {
    height: 768px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    position: relative;
    width: 100%;
}
.hero::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.25);
}
.hero-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 286px 20px 171px 0px;
}
.hero-title {
    font-family: 'Zen Antique', serif;
    font-size: 66px;
    color: #fff;
    margin-bottom: 40px;
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
    border: 2px solid #fff;
}
.hero-divider {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 80px;
    background: #fff;
    border-radius: 51px;
    z-index: 2;
}
.home { background: #fff; }
.section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 20px;
}
.section-header { margin-bottom: 2rem; }
.section-title {
    font-family: 'Ruberoid', sans-serif;
    font-weight: 500;
    font-size: 40px;
    color: #0a0a0a;
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
    background: #000;
}
.products-grid {
    max-width: 1200px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}
.categories-layout {
    display: flex;
    gap: 16px;
    max-width: 1200px;
    margin: 0 auto;
}
.categories-left {
    display: flex;
    gap: 16px;
    flex: 1;
}
.categories-right {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 384px;
}
.category-card {
    position: relative;
    display: block;
    text-decoration: none;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s;
}
.category-card:hover { transform: translateY(-4px); }
.category-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0; left: 0;
}
.category-card span {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 16px;
    font-family: 'Inter', sans-serif;
    font-size: 40px;
    color: #fff;
    text-transform: uppercase;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
}
.category-card-large {
    flex: 1;
    height: 471px;
}
.category-card-small {
    flex: 1;
    height: 142px;
}
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
.subscribe-form button {
    padding: 14px 28px;
    background: #000;
    color: #fff;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
}
.subscribe-form button:hover { background: #333; }

@media (max-width: 1200px) {
    .products-grid { grid-template-columns: repeat(3, 1fr); }
    .hero-title { font-size: 52px; }
}
@media (max-width: 1024px) {
    .hero { height: 550px; }
    .hero-content { padding: 200px 20px 120px 60px; }
    .hero-title { font-size: 42px; }
    .categories-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }
    .categories-left, .categories-right {
        display: contents;
    }
    .category-card-large { height: 250px; }
    .category-card-small { height: 160px; }
}
@media (max-width: 780px) {
    .hero { height: 450px; }
    .hero-content { padding: 180px 20px 100px 20px; }
    .hero-title { font-size: 36px; }
    .hero-btn { padding: 14px 24px; width: auto; height: auto; font-size: 13px; }
    .hero-divider { height: 60px; bottom: -30px; border-radius: 40px; }
    .products-grid { grid-template-columns: repeat(2, 1fr); }
    .section-title { font-size: 28px; }
    .categories-layout { gap: 10px; }
    .category-card-large { height: 200px; }
    .category-card-small { height: 140px; }
    .category-card span { font-size: 28px; }
    .section-discount { height: 320px; margin: 0 20px; }
    .discount-content h3 { font-size: 32px; }
}
@media (max-width: 480px) {
    .hero { height: 380px; }
    .hero-content { padding: 150px 20px 80px 20px; }
    .hero-title { font-size: 28px; }
    .hero-btn { padding: 12px 20px; font-size: 12px; }
    .hero-divider { height: 40px; bottom: -20px; border-radius: 25px; }
    .products-grid { grid-template-columns: 1fr; }
    .section-title { font-size: 24px; }
    .categories-layout { grid-template-columns: 1fr; }
    .category-card-large { height: 200px; }
    .category-card-small { height: 130px; }
    .category-card span { font-size: 24px; }
    .section-discount { height: 360px; margin: 0 10px; }
    .discount-content h3 { font-size: 26px; }
    .discount-content p { font-size: 13px; }
    .subscribe-form { flex-direction: column; gap: 10px; }
    .subscribe-form input { width: 100%; }
    .subscribe-form button { width: 100%; }
}
@media (max-width: 1024px) {
    .section-new .products-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }
}
@media (max-width: 780px) {
    .section-new .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
}
@media (max-width: 480px) {
    .section-new .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
}
@media (max-width: 390px) {
    .section-new .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
}
@media (max-width: 1024px) {
    .section { padding: 3rem 20px; }
}
@media (max-width: 780px) {
    .section { padding: 2.5rem 20px; }
}
@media (max-width: 480px) {
    .section { padding: 2rem 15px; }
}
</style>