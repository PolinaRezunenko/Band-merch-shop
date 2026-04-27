import { defineStore } from 'pinia'
import { supabase } from '../config/supabase'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        profile: null,
        loading: true
    }),
    
    getters: {
        isLoggedIn: (state) => !!state.user,
        isAdmin: (state) => state.profile?.is_admin || false
    },
    
    actions: {
        async init() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                this.user = user
                if (user) {
                    await this.loadProfile()
                }
            } catch (error) {
                console.error('Ошибка инициализации:', error)
            } finally {
                this.loading = false
            }
        },
        
        async loadProfile() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single()
    
    console.log('Загрузка профиля:', data, 'Ошибка:', error)
    
    if (data) {
        this.profile = data
        console.log('is_admin:', data.is_admin)
    }
},
        
        async register(email, password, firstName, lastName) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            })
            
            if (error) throw error
            
            if (data.user) {
                // Создаем профиль
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    first_name: firstName,
                    last_name: lastName
                })
            }
            
            return data
        },
        
        async login(email, password) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            
            if (error) throw error
            
            this.user = data.user
            await this.loadProfile()
            return data
        },
        
        async logout() {
            await supabase.auth.signOut()
            this.user = null
            this.profile = null
        },
        
        async updateProfile(updates) {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', this.user.id)
            
            if (error) throw error
            
            await this.loadProfile()
        },
        
        async changePassword(newPassword) {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })
            
            if (error) throw error
        }
    }
})