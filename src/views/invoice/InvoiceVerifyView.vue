<script setup>
import { ref } from 'vue'
import { showToast } from '@/composables/useToast'

const activeTab = ref('verify')

// Verify form
const verifyCode = ref('050002400111')
const verifyNum = ref('24780952')
const verifyDate = ref('2026-04-10')
const verifyCheck = ref('389210')

const loading = ref(false)
const showResult = ref(false)

const result = ref({
  code: '050002400111',
  num: '24780952',
  date: '2026-04-10',
  seller: '重庆盛创普通科技有限公司',
  buyer: '重庆腾讯信息技术有限公司',
  amount: '¥8,500.00',
  tax: '¥510.00',
  total: '¥9,010.00',
  status: '正常'
})

function doVerify() {
  if (!verifyCode.value || !verifyNum.value) {
    showToast('请填写完整的发票信息', 'warning')
    return
  }
  loading.value = true
  showResult.value = false
  showToast('正在查验中...', 'info')

  setTimeout(() => {
    loading.value = false
    showResult.value = true
    showToast('查验完成', 'success')
  }, 800)
}

// History
const history = ref([
  { id: 1, code: '050002400111', num: '24780952', date: '2026-04-10', status: '正常', time: '2026-04-16 09:32:15' },
  { id: 2, code: '050003600822', num: '31456789', date: '2026-04-08', status: '正常', time: '2026-04-15 14:21:08' },
  { id: 3, code: '050003500317', num: '28901234', date: '2026-03-25', status: '已作废', time: '2026-04-14 10:15:42' },
  { id: 4, code: '050002400156', num: '24890123', date: '2026-03-18', status: '正常', time: '2026-04-12 16:48:33' },
  { id: 5, code: '050003700445', num: '35678901', date: '2026-03-10', status: '已冲红', time: '2026-04-10 11:05:27' }
])

function statusBadge(status) {
  if (status === '正常') return 'badge badge-green'
  if (status === '已作废') return 'badge badge-red'
  return 'badge badge-orange'
}
</script>

<template>
  <div class="verify-page">
    <!-- Tabs -->
    <div class="tab-bar">
      <div class="tab-item" :class="{ active: activeTab === 'verify' }" @click="activeTab = 'verify'">发票查验</div>
      <div class="tab-item" :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">查验历史</div>
    </div>

    <!-- Verify Tab -->
    <div v-if="activeTab === 'verify'">
      <div class="card">
        <div class="card-title">发票查验信息</div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">发票代码</label>
            <input v-model="verifyCode" type="text" class="form-input" placeholder="请输入发票代码" />
          </div>
          <div class="form-group">
            <label class="form-label">发票号码</label>
            <input v-model="verifyNum" type="text" class="form-input" placeholder="请输入发票号码" />
          </div>
          <div class="form-group">
            <label class="form-label">开票日期</label>
            <input v-model="verifyDate" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">校验码后6位 / 金额</label>
            <input v-model="verifyCheck" type="text" class="form-input" placeholder="请输入校验码后6位或金额" />
          </div>
        </div>
        <div style="margin-top:20px;text-align:center">
          <button class="btn btn-primary btn-lg" :disabled="loading" @click="doVerify">
            <span v-if="loading" class="spinner"></span>
            <span v-else>立即查验</span>
          </button>
        </div>
      </div>

      <!-- Verify Result -->
      <div v-if="showResult" class="card verify-result">
        <div class="result-header">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#52c41a">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>查验通过</span>
          <span :class="statusBadge(result.status)" style="margin-left:auto">{{ result.status }}</span>
        </div>
        <div class="result-grid">
          <div class="result-item">
            <span class="label">发票代码</span>
            <span class="value">{{ result.code }}</span>
          </div>
          <div class="result-item">
            <span class="label">发票号码</span>
            <span class="value">{{ result.num }}</span>
          </div>
          <div class="result-item">
            <span class="label">开票日期</span>
            <span class="value">{{ result.date }}</span>
          </div>
          <div class="result-item">
            <span class="label">状态</span>
            <span class="value">{{ result.status }}</span>
          </div>
          <div class="result-item">
            <span class="label">销售方</span>
            <span class="value">{{ result.seller }}</span>
          </div>
          <div class="result-item">
            <span class="label">购买方</span>
            <span class="value">{{ result.buyer }}</span>
          </div>
          <div class="result-item">
            <span class="label">金额</span>
            <span class="value num">{{ result.amount }}</span>
          </div>
          <div class="result-item">
            <span class="label">税额</span>
            <span class="value num">{{ result.tax }}</span>
          </div>
          <div class="result-item full">
            <span class="label">价税合计</span>
            <span class="value total">{{ result.total }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- History Tab -->
    <div v-if="activeTab === 'history'">
      <div class="card">
        <div class="card-title">查验历史记录</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>发票代码</th>
              <th>发票号码</th>
              <th>开票日期</th>
              <th>查验状态</th>
              <th>查验时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in history" :key="h.id">
              <td>{{ h.id }}</td>
              <td class="col-num">{{ h.code }}</td>
              <td class="col-num">{{ h.num }}</td>
              <td>{{ h.date }}</td>
              <td><span :class="statusBadge(h.status)">{{ h.status }}</span></td>
              <td>{{ h.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verify-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.verify-result {
  border: 2px solid #52c41a;
  background: #f6ffed;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #52c41a;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-item.full {
  grid-column: 1 / -1;
}

.result-item .label {
  font-size: 12px;
  color: #8c8c8c;
}

.result-item .value {
  font-size: 14px;
  color: #141414;
  font-weight: 500;
}

.result-item .value.num {
  font-family: 'DM Sans', sans-serif;
}

.result-item .value.total {
  font-family: 'DM Sans', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #ff4d4f;
}

.col-num {
  font-family: 'DM Sans', sans-serif;
}
</style>
