<template>
    <div class="about-page">
        <div class="about-container">
            <Breadcrumbs :items="[{ label: 'О нас', link: null }]" />
            
            <h1>О нас</h1>
            
            <div class="about-content">
                <!-- Баннер -->
                <div class="about-banner">
                    <img src="/images/about-banner.jpg" alt="BMTH Store" @error="handleImageError">
                </div>
                
                <!-- Текст -->
                <div class="about-text">
                    <h2>BMTH Store — официальный мерч</h2>
                    <p>BMTH Store — это официальный интернет-магазин брендированной продукции группы Bring Me The Horizon. Мы предлагаем только оригинальный мерч: футболки, худи, свитшоты, аксессуары, виниловые пластинки и CD-диски.</p>
                    
                    <h3>Почему выбирают нас</h3>
                    <ul>
                        <li>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Только оригинальная продукция
                        </li>
                        <li>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Прямые поставки от производителя
                        </li>
                        <li>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Доставка по всей России (3-7 рабочих дней)
                        </li>
                        <li>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Бесплатная доставка при заказе от 5 000 ₽
                        </li>
                        <li>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Удобный возврат и обмен
                        </li>
                        <li>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Поддержка 24/7 через форму обратной связи
                        </li>
                    </ul>
                    
                    <h3>Наша миссия</h3>
                    <p>Мы стремимся сделать качественный мерч доступным для каждого фаната. Каждый товар в нашем каталоге проходит проверку качества, чтобы вы получали только лучшие вещи с символикой любимой группы.</p>
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
    name: 'AboutPage',
    components: { Breadcrumbs, DiscountBanner },
    methods: {
        handleImageError(event) {
            event.target.style.display = 'none'
        }
    }
}
</script>

<style scoped>
.about-page { background: #fff; min-height: 100vh; }
.about-container { max-width: 1200px; margin: 0 auto; }

h1 {
   font-family: 'Raleway', sans-serif; 
    color: #0a0a0a; 
    margin-top: 30px;
    margin-bottom: 30px; 
    font-size: 48px; 
}

.about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
}

.about-banner img {
    width: 100%;
    border-radius: 12px;
}

.about-text h2 {
    font-family: 'Inter', sans-serif;
    font-size: 28px;
    color: #000;
    margin-bottom: 20px;
    font-weight: 700;
}

.about-text h3 {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    color: #000;
    margin: 30px 0 15px;
    font-weight: 600;
}

.about-text p {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #555;
    line-height: 1.7;
    margin-bottom: 20px;
}

.about-text ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.about-text ul li {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    color: #333;
    padding: 12px 16px;
    background: #f9f9f9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.about-text ul li svg {
    flex-shrink: 0;
}

@media (max-width: 1024px) { .about-container { padding: 40px 20px; } }
@media (max-width: 780px) { .about-container { padding: 30px 20px; } }
@media (max-width: 480px) { .about-container { padding: 20px 15px; } }

@media (max-width: 768px) {
    .about-content { grid-template-columns: 1fr; gap: 30px; }
    .about-text h2 { font-size: 24px; }
    h1 { font-size: 32px; }
}

@media (max-width: 390px) {
    h1 { font-size: 28px; }
    .about-text ul li { font-size: 13px; padding: 10px 12px; }
    .about-text ul li svg { width: 16px; height: 16px; }
}
</style>