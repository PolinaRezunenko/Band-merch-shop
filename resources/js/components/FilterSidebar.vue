<!-- <template>
    <aside class="filter-sidebar">
        <!-- Категории -->
        <div class="filter-block">
            <h4 class="filter-title">Категории</h4>
            <ul class="filter-list">
                <li v-for="cat in categories" :key="cat.slug">
                    <router-link 
                        :to="'/catalog/' + cat.slug"
                        :class="{ active: currentCategory === cat.slug }"
                    >
                        {{ cat.name }}
                    </router-link>
                </li>
            </ul>
        </div>

        <!-- Цена -->
        <div class="filter-block">
            <h4 class="filter-title">Цена</h4>
            <div class="price-range">
                <input 
                    type="number" 
                    v-model.number="minPrice" 
                    placeholder="0"
                    class="price-input"
                >
                <span class="price-separator">—</span>
                <input 
                    type="number" 
                    v-model.number="maxPrice" 
                    placeholder="100000"
                    class="price-input"
                >
            </div>
            <button class="btn-apply" @click="applyPrice">Применить</button>
        </div>

        <!-- Размер -->
        <div class="filter-block">
            <h4 class="filter-title">Размер</h4>
            <div class="size-grid">
                <button 
                    v-for="size in sizes" 
                    :key="size"
                    :class="['size-btn', { active: selectedSizes.includes(size) }]"
                    @click="toggleSize(size)"
                >
                    {{ size }}
                </button>
            </div>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'FilterSidebar',
    props: {
        currentCategory: String
    },
    emits: ['filter-change'],
    data() {
        return {
            categories: [
                { name: 'Футболки', slug: 't-shirts' },
                { name: 'Худи', slug: 'hoodies' },
                { name: 'Аксессуары', slug: 'accessories' },
                { name: 'Винил', slug: 'vinyl' },
                { name: 'CD-диски', slug: 'cd' }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Универсальный'],
            selectedSizes: [],
            minPrice: null,
            maxPrice: null
        }
    },
    methods: {
        toggleSize(size) {
            const index = this.selectedSizes.indexOf(size)
            if (index > -1) {
                this.selectedSizes.splice(index, 1)
            } else {
                this.selectedSizes.push(size)
            }
            this.emitFilters()
        },
        applyPrice() {
            this.emitFilters()
        },
        emitFilters() {
            this.$emit('filter-change', {
                sizes: this.selectedSizes,
                minPrice: this.minPrice,
                maxPrice: this.maxPrice
            })
        }
    }
}
</script>

<style scoped>
.filter-sidebar {
    width: 250px;
    flex-shrink: 0;
}

.filter-block {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #222;
}

.filter-block:last-child {
    border-bottom: none;
}

.filter-title {
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1rem;
    color: #fff;
}

.filter-list {
    list-style: none;
}

.filter-list li {
    margin-bottom: 0.5rem;
}

.filter-list a {
    color: #999;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s;
    display: block;
    padding: 0.3rem 0;
}

.filter-list a:hover,
.filter-list a.active {
    color: #ff4444;
}

.price-range {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.8rem;
}

.price-input {
    width: 90px;
    padding: 0.5rem;
    background: #1a1a1a;
    border: 1px solid #333;
    color: #fff;
    font-size: 0.85rem;
    border-radius: 4px;
    outline: none;
}

.price-input:focus {
    border-color: #ff4444;
}

.price-separator {
    color: #666;
}

.btn-apply {
    width: 100%;
    padding: 0.6rem;
    background: #ff4444;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: background 0.3s;
}

.btn-apply:hover {
    background: #cc0000;
}

.size-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.size-btn {
    padding: 0.4rem 0.8rem;
    background: #1a1a1a;
    border: 1px solid #333;
    color: #999;
    font-size: 0.8rem;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
}

.size-btn:hover {
    border-color: #ff4444;
    color: #fff;
}

.size-btn.active {
    background: #ff4444;
    border-color: #ff4444;
    color: #fff;
}

@media (max-width: 768px) {
    .filter-sidebar {
        width: 100%;
    }
}
</style> -->