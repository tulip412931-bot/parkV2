<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('by_duration')
const currentPage = ref(1)
const pageSize = 15
const filterArea = ref('')

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }
function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const areas = ['A区','B区','C区']
const rooms = ['A-101','A-203','B-105','B-302','C-401','A-506','B-208','C-103','A-312','C-205','B-401','A-108','C-306','B-502','A-415']
const customers = ['张伟','李娜','王强','刘洋','陈静','赵敏','孙磊','周芳','吴刚','郑华','马超','黄丽','林峰','何婷','徐明']
const feeItems = ['物业费','租金','水费','电费','停车费','空调费','网络费']
const reasons = ['经济困难','对服务不满','房屋空置','纠纷未解决','联系不上','外出未归','忘记缴费','拒绝缴费']

const durationRanges = ['1-30天','31-60天','61-90天','91-180天','181-365天','1-2年','2-3年','3年以上']
const r1 = rng(8001)
const byDuration = durationRanges.map((range, i) => {
  const count = Math.floor(r1() * 50) + 5
  const amount = Math.round(r1() * 200000 + 5000)
  return { id: i + 1, range, count, amount, ratio: (r1() * 25 + 2).toFixed(1) }
})

const r2 = rng(8101)
const agingDetail = Array.from({ length: 15 }, (_, i) => {
  const startDay = Math.floor(r2() * 28) + 1
  const startMonth = Math.floor(r2() * 12) + 1
  return {
    id: i + 1, room: rooms[i], customer: customers[i],
    feeItem: feeItems[Math.floor(r2() * feeItems.length)],
    amount: Math.round(r2() * 15000 + 500),
    startDate: `2025-${pad(startMonth)}-${pad(startDay)}`,
    agingDays: Math.floor(r2() * 500) + 30
  }
})

const amountRanges = ['0-500元','500-1000元','1000-3000元','3000-5000元','5000-10000元','10000-30000元','30000-50000元','50000元以上']
const r3 = rng(8201)
const byAmount = amountRanges.map((range, i) => {
  const count = Math.floor(r3() * 40) + 3
  const amount = Math.round(r3() * 300000 + 2000)
  return { id: i + 1, range, count, amount, ratio: (r3() * 25 + 2).toFixed(1) }
})

const r4 = rng(8301)
const byReason = reasons.map((reason, i) => {
  const count = Math.floor(r4() * 30) + 2
  const amount = Math.round(r4() * 150000 + 3000)
  return { id: i + 1, reason, count, amount, ratio: (r4() * 20 + 3).toFixed(1) }
})

const tabs = [
  { key: 'by_duration', label: '欠费按时长分阶统计', data: byDuration },
  { key: 'aging', label: '欠费账龄明细表', data: agingDetail },
  { key: 'by_amount', label: '欠费按金额分阶统计', data: byAmount },
  { key: 'by_reason', label: '欠费原因统计', data: byReason }
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
      <h1 class="page-title">欠费报表</h1>
      <p class="page-subtitle">财务管理 - 欠费分阶、账龄及原因统计分析</p>
    </div>
    <div class="filter-bar">
      <select v-model="filterArea" class="form-select"><option value="">全部管理区</option><option v-for="a in areas" :key="a">{{ a }}</option></select>
      <div class="filter-actions"><button class="btn btn-primary">查询</button><button class="btn btn-default">导出</button></div>
    </div>
    <div class="card">
      <div class="tabs">
        <div v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @click="switchTab(t.key)">{{ t.label }}</div>
      </div>
      <div class="table-wrapper">
        <table class="data-table" v-if="activeTab === 'by_duration'">
          <thead><tr><th>时长区间</th><th>户数</th><th>金额</th><th>占比%</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.range }}</td><td class="font-num">{{ r.count }}</td><td class="font-num text-danger">¥{{ fmt(r.amount) }}</td><td><span class="badge badge-orange">{{ r.ratio }}%</span></td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'aging'">
          <thead><tr><th>房号</th><th>客户</th><th>收费项目</th><th>欠费金额</th><th>欠费起始日</th><th>账龄天数</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.room }}</td><td>{{ r.customer }}</td><td>{{ r.feeItem }}</td><td class="font-num text-danger">¥{{ fmt(r.amount) }}</td><td class="text-gray text-sm">{{ r.startDate }}</td><td class="font-num"><span class="badge" :class="r.agingDays > 180 ? 'badge-red' : r.agingDays > 90 ? 'badge-orange' : 'badge-blue'">{{ r.agingDays }}天</span></td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'by_amount'">
          <thead><tr><th>金额区间</th><th>户数</th><th>金额</th><th>占比%</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.range }}</td><td class="font-num">{{ r.count }}</td><td class="font-num text-danger">¥{{ fmt(r.amount) }}</td><td><span class="badge badge-orange">{{ r.ratio }}%</span></td></tr></tbody>
        </table>
        <table class="data-table" v-else>
          <thead><tr><th>欠费原因</th><th>户数</th><th>金额</th><th>占比%</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.reason }}</td><td class="font-num">{{ r.count }}</td><td class="font-num text-danger">¥{{ fmt(r.amount) }}</td><td><span class="badge badge-orange">{{ r.ratio }}%</span></td></tr></tbody>
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
</style>
