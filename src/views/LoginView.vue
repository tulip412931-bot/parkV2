<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import ToastContainer from '@/components/ToastContainer.vue'

const router = useRouter()
const { showToast } = useToast()

const username = ref('admin')
const password = ref('123456')
const rememberMe = ref(true)
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    showToast('请输入用户名和密码', 'warning')
    return
  }
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 600))
  loading.value = false
  showToast('登录成功，欢迎回来！', 'success')
  setTimeout(() => {
    router.push('/app/dashboard')
  }, 300)
}
</script>

<template>
  <div class="login-page">
    <!-- Geometric pattern overlay -->
    <div class="pattern-overlay">
      <svg class="pattern-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.06)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <polygon points="0,0 400,0 200,300" fill="url(#g1)" />
        <polygon points="600,100 900,0 1000,250 700,300" fill="rgba(255,255,255,0.03)" />
        <polygon points="100,500 350,400 400,700 150,750" fill="rgba(255,255,255,0.04)" />
        <polygon points="800,400 1200,350 1200,700 900,600" fill="rgba(255,255,255,0.03)" />
        <circle cx="150" cy="150" r="80" fill="rgba(255,255,255,0.02)" />
        <circle cx="1050" cy="600" r="120" fill="rgba(255,255,255,0.025)" />
        <polygon points="500,500 650,450 700,650 550,680" fill="rgba(255,255,255,0.02)" />
      </svg>
    </div>

    <div class="login-card">
      <!-- Logo area -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect x="4" y="16" width="12" height="24" rx="2" fill="#2563eb"/>
            <rect x="20" y="8" width="12" height="32" rx="2" fill="#1d4ed8"/>
            <rect x="36" y="20" width="4" height="20" rx="1" fill="#3b82f6"/>
            <rect x="0" y="20" width="4" height="20" rx="1" fill="#3b82f6"/>
            <rect x="6" y="4" width="8" height="8" rx="2" fill="#60a5fa"/>
            <rect x="22" y="0" width="8" height="4" rx="1" fill="#93c5fd"/>
          </svg>
        </div>
        <h1 class="logo-title">坤煌产业园</h1>
        <p class="logo-subtitle">智慧管理平台</p>
      </div>

      <!-- Login form -->
      <div class="form-section">
        <div class="input-group">
          <label class="input-label">用户名</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <input
              v-model="username"
              type="text"
              placeholder="请输入用户名"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">密码</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <div class="options-row">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            记住我
          </label>
        </div>

        <button
          class="login-btn"
          :class="{ loading: loading }"
          :disabled="loading"
          @click="handleLogin"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-else>登 录</span>
        </button>
      </div>

      <div class="card-footer">
        重庆坤煌产业发展有限公司
      </div>
    </div>

    <ToastContainer />
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #2563eb 100%);
  position: relative;
  overflow: hidden;
}

.pattern-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.pattern-svg {
  width: 100%;
  height: 100%;
}

.login-card {
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 16px;
  width: 440px;
  max-width: 92vw;
  padding: 48px 40px 32px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  animation: cardIn 0.5s ease;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo-section {
  text-align: center;
  margin-bottom: 36px;
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: #eff6ff;
  border-radius: 16px;
  margin-bottom: 16px;
}

.logo-title {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.logo-subtitle {
  font-size: 14px;
  color: #64748b;
  letter-spacing: 4px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 14px;
  transition: all 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-icon {
  flex-shrink: 0;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 0;
  font-size: 14px;
  color: #1e293b;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.options-row {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #2563eb;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 6px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 4px;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.card-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
  font-size: 12px;
  color: #94a3b8;
  letter-spacing: 1px;
}
</style>
