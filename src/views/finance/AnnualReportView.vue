<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('recv_annual')
const currentPage = ref(1)
const pageSize = 6
const filterYear = ref('')

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const years = [2020, 2021, 2022, 2023, 2024, 2025]
const feeItems = ['物业费','租金','水费','电费','停车费','空调费']

const r1 = rng(7001)
const recvAnnual = years.map((y, i) => ({
  id: i + 1, year: y, feeItem: feeItems[i],
  amount: Math.round(r1() * 2000000 + 500000), yoy: (r1() * 20 - 5).toFixed(1)
}))

const r2 = rng(7101)
const arrearsAnnual = years.map((y, i) => ({
  id: i + 1, year: y, amount: Math.round(r2() * 500000 + 50000),
  count: Math.floor(r2() * 100) + 10, rate: (r2() * 20 + 5).toFixed(1)
}))

const r3 = rng(7201)
const collectedAnnual = years.map((y, i) => ({
  id: i + 1, year: y, feeItem: feeItems[i],
  amount: Math.round(r3() * 1800000 + 400000), yoy: (r3() * 20 - 5).toFixed(1)
}))

const r4 = rng(7301)
const rateAnnual = years.map((y, i) => {
  const recv = Math.round(r4() * 2000000 + 500000)
  const paid = Math.round(recv * (r4() * 0.2 + 0.7))
  return { id: i + 1, year: y, receivable: recv, collected: paid,
    rate: ((paid / recv) * 100).toFixed(1), yoy: (r4() * 10 - 3).toFixed(1)
  }
})

const r5 = rng(7401)
const goalCompletion = years.map((y, i) => {
  const target = Math.round(r5() * 2000000 + 800000)
  const actual = Math.round(target * (r5() * 0.3 + 0.65))
  return { id: i + 1, year: y, target, actual, completion: ((actual / target) * 100).toFixed(1) }
})

const tabs = [
  { key: 'recv_annual', label: '应收年度统计', data: recvAnnual },
  { key: 'arrears_annual', label: '欠费年度统计', data: arrearsAnnual },
  { key: 'collected_annual', label: '已收费用年度统计', data: collectedAnnual },
  { key: 'rate_annual', label: '收费率年度统计', data: rateAnnual },
  { key: 'goal', label: '收费目标完成率', data: goalCompletion }
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
      <h1 class="page-title">年度报表</h1>
      <p class="page-subtitle">财务管理 - 年度收费与目标完成分析</p>
    </div>
    <div class="filter-bar">
      <select v-model="filterYear" class="form-select">
        <option value="">全部年份</option>
        <option v-for="y in [2020,2021,2022,2023,2024,2025,2026]" :key="y" :value="String(y)">{{ y }}年</option>
      </select>
      <div class="filter-actions"><button class="btn btn-primary">查询</button><button class="btn btn-default">导出</button></div>
    </div>
    <div class="card">
      <div class="tabs">
        <div v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @click="switchTab(t.key)">{{ t.label }}</div>
      </div>
      <div class="table-wrapper">
        <table class="data-table" v-if="activeTab === 'recv_annual'">
          <thead><tr><th>年份</th><th>收费项目</th><th>应收金额</th><th>同比%</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.year }}</td><td>{{ r.feeItem }}</td><td class="font-num">¥{{ fmt(r.amount) }}</td><td :class="r.yoy >= 0 ? 'text-success' : 'text-danger'">{{ r.yoy > 0 ? '+' : '' }}{{ r.yoy }}%</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'arrears_annual'">
          <thead><tr><th>年份</th><th>欠费金额</th><th>欠费户数</th><th>欠费率</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.year }}</td><td class="font-num text-danger">¥{{ fmt(r.amount) }}</td><td class="font-num">{{ r.count }}</td><td><span class="badge badge-red">{{ r.rate }}%</span></td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'collected_annual'">
          <thead><tr><th>年份</th><th>收费项目</th><th>已收金额</th><th>同比%</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.year }}</td><td>{{ r.feeItem }}</td><td class="font-num text-success">¥{{ fmt(r.amount) }}</td><td :class="r.yoy >= 0 ? 'text-success' : 'text-danger'">{{ r.yoy > 0 ? '+' : '' }}{{ r.yoy }}%</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'rate_annual'">
          <thead><tr><th>年份</th><th>应收</th><th>已收</th><th>收费率</th><th>同比</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.year }}</td><td class="font-num">¥{{ fmt(r.receivable) }}</td><td class="font-num text-success">¥{{ fmt(r.collected) }}</td><td><span class="badge badge-blue">{{ r.rate }}%</span></td><td :class="r.yoy >= 0 ? 'text-success' : 'text-danger'">{{ r.yoy > 0 ? '+' : '' }}{{ r.yoy }}%</td></tr></tbody>
        </table>
        <table class="data-table" v-else>
          <thead><tr><th>年份</th><th>目标金额</th><th>实际金额</th><th>完成率%</th><th>进度</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.year }}</td><td class="font-num">¥{{ fmt(r.target) }}</td><td class="font-num text-success">¥{{ fmt(r.actual) }}</td><td><span class="badge" :class="r.completion >= 100 ? 'badge-green' : r.completion >= 80 ? 'badge-blue' : 'badge-orange'">{{ r.completion }}%</span></td>
            <td><div class="progress-bar"><div class="progress-fill" :style="{ width: Math.min(r.completion, 100) + '%' }" :class="r.completion >= 100 ? 'bg-success' : r.completion >= 80 ? 'bg-primary' : 'bg-warning'"></div></div></td></tr></tbody>
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
.progress-bar { width: 120px; height: 8px; background: var(--gray-200); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
.bg-success { background: var(--success); }
.bg-primary { background: var(--primary); }
.bg-warning { background: var(--warning); }
</style>
