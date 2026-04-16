<script setup>
import { ref, computed } from 'vue'

const filterDate = ref('2025-06-15')
const filterPayment = ref('')
const filterOperator = ref('')

const paymentMethods = ['现金', '微信', '支付宝', '银行转账']
const operators = ['张丽', '王强', '李明', '赵芳']
const projects = ['物业费', '水费', '电费', '停车费', '空调费']
const customers = ['重庆智联科技','鼎盛机械','华创电子','朗讯通信','博雅装饰','天宇物流','星辰广告','锐达信息','嘉和贸易','中天建设',
  '远航科技','盛世文化','金桥投资','鸿运商贸','蓝海网络','创新材料','宏图置业','卓越教育','汇丰实业','恒达电气',
  '明德咨询','新世纪传媒','正源环保','瑞丰食品','同方科技','东方物业','安信保险','利达工贸','佳诚科技','永盛实业']
const buildings = ['1栋','2栋','3栋','4栋','5栋']

const allData = Array.from({ length: 30 }, (_, i) => {
  const h = 8 + Math.floor(i * 0.4)
  const m = String(Math.floor(Math.random() * 60)).padStart(2, '0')
  const s = String(Math.floor(Math.random() * 60)).padStart(2, '0')
  const bld = buildings[i % 5]
  const floor = (i % 8) + 1
  const room = `${bld}-${floor}${String((i % 4) + 1).padStart(2, '0')}`
  const amount = (200 + Math.random() * 4800).toFixed(2)
  const pm = paymentMethods[i % 4]
  return {
    id: i + 1,
    time: `${h}:${m}:${s}`,
    receipt: `RC2025061500${String(i + 1).padStart(2, '0')}`,
    room, customer: customers[i],
    project: projects[i % 5],
    amount: parseFloat(amount), payment: pm,
    operator: operators[i % 4]
  }
})

const filteredData = computed(() => {
  return allData.filter(r => {
    if (filterPayment.value && r.payment !== filterPayment.value) return false
    if (filterOperator.value && r.operator !== filterOperator.value) return false
    return true
  })
})

const todayTotal = computed(() => filteredData.value.reduce((s, r) => s + r.amount, 0))
const todayCount = computed(() => filteredData.value.length)

function totalByMethod(method) {
  return filteredData.value.filter(r => r.payment === method).reduce((s, r) => s + r.amount, 0)
}

const summaryCards = computed(() => [
  { label: '今日收费总额', value: `¥${todayTotal.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: 'var(--primary)', bg: 'var(--primary-bg)' },
  { label: '今日收费笔数', value: todayCount.value, color: 'var(--secondary)', bg: 'var(--secondary-bg)' },
  { label: '现金收款', value: `¥${totalByMethod('现金').toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: 'var(--success)', bg: 'var(--success-bg)' },
  { label: '微信收款', value: `¥${totalByMethod('微信').toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#22c55e', bg: '#f0fdf4' },
  { label: '支付宝收款', value: `¥${totalByMethod('支付宝').toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#3b82f6', bg: '#eff6ff' },
  { label: '银行转账', value: `¥${totalByMethod('银行转账').toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: 'var(--warning)', bg: 'var(--warning-bg)' }
])

function payBadge(p) {
  if (p === '现金') return 'badge-green'
  if (p === '微信') return 'badge-green'
  if (p === '支付宝') return 'badge-blue'
  return 'badge-orange'
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">已收费用日报</h1>
      <p class="page-subtitle">财务管理 - 每日收费明细汇总</p>
    </div>

    <div class="filter-bar">
      <input v-model="filterDate" type="date" class="form-input" />
      <select v-model="filterPayment" class="form-select">
        <option value="">全部支付方式</option>
        <option v-for="p in paymentMethods" :key="p">{{ p }}</option>
      </select>
      <select v-model="filterOperator" class="form-select">
        <option value="">全部操作人</option>
        <option v-for="o in operators" :key="o">{{ o }}</option>
      </select>
      <div class="filter-actions">
        <button class="btn btn-primary">查询</button>
        <button class="btn btn-default">导出日报</button>
      </div>
    </div>

    <div class="stat-cards" style="grid-template-columns:repeat(3,1fr)">
      <div v-for="c in summaryCards" :key="c.label" class="stat-card">
        <div class="stat-card-icon" :style="{ background: c.bg, color: c.color }">¥</div>
        <div class="stat-card-content">
          <div class="stat-card-label">{{ c.label }}</div>
          <div class="stat-card-value font-num" style="font-size:20px">{{ c.value }}</div>
        </div>
      </div>
    </div>

    <div class="data-table-card">
      <div class="data-table-header">
        <div><span class="data-table-title">收费明细</span><span class="data-table-count">共 {{ filteredData.length }} 笔</span></div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>时间</th><th>收据号</th><th>房号</th><th>客户名称</th><th>收费项目</th><th>收费金额</th><th>支付方式</th><th>操作人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredData" :key="row.id">
              <td class="text-gray">{{ row.time }}</td>
              <td class="font-num text-sm">{{ row.receipt }}</td>
              <td class="font-medium">{{ row.room }}</td>
              <td>{{ row.customer }}</td>
              <td><span class="tag">{{ row.project }}</span></td>
              <td class="font-num font-semibold">¥{{ row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</td>
              <td><span class="badge" :class="payBadge(row.payment)">{{ row.payment }}</span></td>
              <td>{{ row.operator }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="data-table-footer">
        <div class="summary-row">
          <div class="summary-item">
            <span class="summary-label">合计：</span>
            <span class="summary-value font-num">¥{{ todayTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div v-for="pm in paymentMethods" :key="pm" class="summary-item">
            <span class="summary-label">{{ pm }}：</span>
            <span class="summary-value font-num">¥{{ totalByMethod(pm).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card-icon {
  width: 44px; height: 44px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700; flex-shrink: 0;
}
</style>
