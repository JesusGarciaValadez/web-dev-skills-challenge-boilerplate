import './bootstrap';
import { createApp } from 'vue'
import App from './components/App.vue'

const app = createApp(App)
app.mount('#app')

// Add a class to body when Vue is mounted
app.mixin({
    mounted() {
        document.body.classList.add('vue-mounted')
    }
})
