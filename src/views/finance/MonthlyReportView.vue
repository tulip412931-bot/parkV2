<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('collected')
const currentPage = ref(1)
const pageSize = 12
const filterYear = ref('2025')

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }
function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const feeItems = ['物业费','租金','水费','电费','停车费','空调费','网络费']
const months = Array.from({ length: 12 }, (_, i) => `2025-${pad(i + 1)}`)

const r1 = rng(5001)
const collectedMonthly = months.map((m, i) => ({
  id: i + 1, month: m, feeItem: feeItems[i % feeItems.length],
  amount: Math.round(r1() * 80000 + 20000), count: Math.floor(r1() * 200) + 50,
  mom: (r1() * 16 - 5).toFixed(1)
}))

const r2 = rng(5101)
const incomeAlloc = months.map((m, i) => ({
  id: i + 1, month: m, feeItem: feeItems[i % feeItems.length],
  allocAmount: Math.round(r2() * 60000 + 10000),
  allocMethod: r2() > 0.5 ? '按月均摊' : '一次性确认'
}))

const r3 = rng(5201)
const summaryCards = [
  { label: '本月应收', value: '¥' + fmt(Math.round(r3() * 200000 + 80000)), color: 'var(--primary)', bg: 'var(--primary-bg)' },
  { label: '本月已收', value: '¥' + fmt(Math.round(r3() * 150000 + 50000)), color: 'var(--success)', bg: 'var(--success-bg)' },
  { label: '本月欠费', value: '¥' + fmt(Math.round(r3() * 50000 + 5000)), color: 'var(--danger)', bg: 'var(--danger-bg)' },
  { label: '收费率', value: (r3() * 20 + 70).toFixed(1) + '%', color: 'var(--warning)', bg: 'var(--warning-bg)' }
]

const r3b = rng(5211)
const monthlyStat = months.map((m, i) => {
  const recv = Math.round(r3b() * 200000 + 80000)
  const paid = Math.round(recv * (r3b() * 0.3 + 0.6))
  return { id: i + 1, month: m, receivable: recv, collected: paid, arrears: recv - paid,
    rate: ((paid / recv) * 100).toFixed(1)
  }
})

const r4 = rng(5301)
const momRate = months.map((m, i) => ({
  id: i + 1, month: m, chargeRate: (r4() * 20 + 70).toFixed(1),
  chargeMom: (r4() * 10 - 3).toFixed(1), arrearsRate: (r4() * 15 + 5).toFixed(1),
  arrearsMom: (r4() * 8 - 3).toFixed(1)
}))

const r5 = rng(5401)
const bizItems = ['物业服务收入','租赁收入','停车收入','广告收入','水电代收','维修服务','其他收入','物业管理费','公共能耗','绿化维护','安保费用','设备维护']
const bizStatus = bizItems.map((item, i) => {
  const monthly = Math.round(r5() * 100000 + 10000)
  const cumulative = Math.round(monthly * (r5() * 5 + 3))
  const budget = Math.round(cumulative * (r5() * 0.4 + 0.8))
  return { id: i + 1, item, monthly, cumulative, budget, completion: ((cumulative / budget) * 100).toFixed(1) }
})

const tabs = [
  { key: 'collected', label: '已收费用月统计', data: collectedMonthly },
  { key: 'alloc', label: '收入月度分摊', data: incomeAlloc },
  { key: 'monthly_stat', label: '月度收费统计', data: monthlyStat },
  { key: 'mom_rate', label: '按月环比收费率欠费率', data: momRate },
  { key: 'biz_status', label: '物业经营状况表', data: bizStatus }
]

const currentRecords = computed(() => tabs.find(t => t.key === activeTab.value)?.data || [])
const totalPages = computed(() => Math.ceil(currentRecords.value.length / pageSize) || 1)
const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return currentRecords.value.slice(start, start + pageSize)
})
function switchTab(key) { activeTab.value = key; currentPage.value = 1 }
function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">月报表</h1>
      <p class="page-subtitle">财务管理 - 月度收费统计与经营分析</p>
    </div>
    <div class="filter-bar">
      <select v-model="filterYear" class="form-select"><option v-for="y in [2023,2024,2025,2026]" :key="y" :value="String(y)">{{ y }}年</option></select>
      <div class="filter-actions"><button class="btn btn-primary">查询</button><button class="btn btn-default">导出</button></div>
    </div>

    <div v-if="activeTab === 'monthly_stat'" class="stat-cards">
      <div v-for="c in summaryCards" :key="c.label" class="stat-card">
        <div class="stat-card-icon" :style="{ background: c.bg, color: c.color }">¥</div>
        <div class="stat-card-content">
          <div class="stat-card-label">{{ c.label }}</div>
          <div class="stat-card-value font-num">{{ c.value }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="tabs">
        <div v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @click="switchTab(t.key)">{{ t.label }}</div>
      </div>
      <div class="table-wrapper">
        <table class="data-table" v-if="activeTab === 'collected'">
          <thead><tr><th>月份</th><th>收费项目</th><th>收费金额</th><th>笔数</th><th>环比%</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.month }}</td><td>{{ r.feeItem }}</td><td class="font-num text-success">¥{{ fmt(r.amount) }}</td><td class="font-num">{{ r.count }}</td><td :class="r.mom >= 0 ? 'text-success' : 'text-danger'">{{ r.mom > 0 ? '+' : '' }}{{ r.mom }}%</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'alloc'">
          <thead><tr><th>月份</th><th>收费项目</th><th>分摊金额</th><th>分摊方式</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.month }}</td><td>{{ r.feeItem }}</td><td class="font-num">¥{{ fmt(r.allocAmount) }}</td><td><span class="badge badge-blue">{{ r.allocMethod }}</span></td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'monthly_stat'">
          <thead><tr><th>月份</th><th>应收</th><th>已收</th><th>欠费</th><th>收费率</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.month }}</td><td class="font-num">¥{{ fmt(r.receivable) }}</td><td class="font-num text-success">¥{{ fmt(r.collected) }}</td><td class="font-num text-danger">¥{{ fmt(r.arrears) }}</td><td><span class="badge badge-blue">{{ r.rate }}%</span></td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'mom_rate'">
          <thead><tr><th>月份</th><th>收费率</th><th>环比</th><th>欠费率</th><th>环比</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.month }}</td><td><span class="badge badge-green">{{ r.chargeRate }}%</span></td><td :class="r.chargeMom >= 0 ? 'text-success' : 'text-danger'">{{ r.chargeMom > 0 ? '+' : '' }}{{ r.chargeMom }}%</td><td><span class="badge badge-red">{{ r.arrearsRate }}%</span></td><td :class="r.arrearsMom <= 0 ? 'text-success' : 'text-danger'">{{ r.arrearsMom > 0 ? '+' : '' }}{{ r.arrearsMom }}%</td></tr></tbody>
        </table>
        <table class="data-table" v-else>
          <thead><tr><th>项目</th><th>本月金额</th><th>累计金额</th><th>预算</th><th>完成率</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.item }}</td><td class="font-num">¥{{ fmt(r.monthly) }}</td><td class="font-num">¥{{ fmt(r.cumulative) }}</td><td class="font-num text-gray">¥{{ fmt(r.budget) }}</td><td><span class="badge" :class="r.completion >= 100 ? 'badge-green' : r.completion >= 80 ? 'badge-blue' : 'badge-orange'">{{ r.completion }}%</span></td></tr></tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination-info">共 {{ currentRecords.length }} 条记录</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="setPage(currentPage - 1)">&lt;</button>
          <button v-for="p in totalPages" :key="p" class="pagination-btn" :class="{ active: currentPage === p }" @click="setPage(p)">{{ p }}</button>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="setPage(currentPage + 1)">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs { overflow-x: auto; }
.stat-card-icon { width: 48px; height: 48px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; flex-shrink: 0; }
</style>
