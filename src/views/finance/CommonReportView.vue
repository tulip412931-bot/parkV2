<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('arrears_monthly')
const currentPage = ref(1)
const pageSize = 10
const filterMonth = ref('2026-03')
const filterArea = ref('')

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }
function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const rooms = ['A-101','A-203','B-105','B-302','C-401','A-506','B-208','C-103','A-312','C-205']
const customers = ['张伟','李娜','王强','刘洋','陈静','赵敏','孙磊','周芳','吴刚','郑华']
const areas = ['A区','B区','C区']
const feeItems = ['物业费','租金','水费','电费','停车费','空调费','网络费','垃圾处理费','绿化费','维修基金']
const payMethods = ['现金','微信','支付宝','银行转账','POS刷卡']

const r1 = rng(3001)
const arrearsMonthly = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, month: `2025-${pad(i + 3)}`,
  count: Math.floor(r1() * 50) + 10, amount: Math.round(r1() * 80000 + 5000),
  rate: (r1() * 20 + 5).toFixed(1), yoy: (r1() * 10 - 3).toFixed(1)
}))

const r2 = rng(3101)
const comprehensiveRate = Array.from({ length: 10 }, (_, i) => {
  const recv = Math.round(r2() * 200000 + 50000)
  const paid = Math.round(recv * (r2() * 0.3 + 0.6))
  return {
    id: i + 1, area: areas[i % 3], receivable: recv, collected: paid,
    arrears: recv - paid, rate: ((paid / recv) * 100).toFixed(1), yoy: (r2() * 10 - 3).toFixed(1)
  }
})

const r3 = rng(3201)
const arrearsDetail = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, room: rooms[i], customer: customers[i],
  feeItem: feeItems[Math.floor(r3() * feeItems.length)],
  amount: Math.round(r3() * 10000 + 500), months: Math.floor(r3() * 12) + 1
}))

const r4 = rng(3301)
const receivableDetail = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, room: rooms[i], customer: customers[i],
  feeItem: feeItems[Math.floor(r4() * feeItems.length)],
  amount: Math.round(r4() * 15000 + 1000), period: `2025-${pad(Math.floor(r4() * 6) + 1)} ~ 2025-${pad(Math.floor(r4() * 6) + 7)}`
}))

const r5 = rng(3401)
const summaryReport = Array.from({ length: 10 }, (_, i) => {
  const recv = Math.round(r5() * 300000 + 50000)
  const paid = Math.round(recv * (r5() * 0.3 + 0.6))
  return {
    id: i + 1, feeItem: feeItems[i], receivable: recv, collected: paid,
    arrears: recv - paid, rate: ((paid / recv) * 100).toFixed(1)
  }
})

const r6 = rng(3501)
const listDetail = Array.from({ length: 10 }, (_, i) => {
  const day = Math.floor(r6() * 28) + 1
  return {
    id: i + 1, room: rooms[i], customer: customers[i],
    feeItem: feeItems[Math.floor(r6() * feeItems.length)],
    amount: Math.round(r6() * 8000 + 200),
    payMethod: payMethods[Math.floor(r6() * payMethods.length)],
    time: `2026-03-${pad(day)} ${pad(Math.floor(r6() * 10) + 8)}:${pad(Math.floor(r6() * 60))}`
  }
})

const tabs = [
  { key: 'arrears_monthly', label: '欠费月度统计', data: arrearsMonthly },
  { key: 'comprehensive', label: '综合收费率报表', data: comprehensiveRate },
  { key: 'arrears_detail', label: '欠收报表', data: arrearsDetail },
  { key: 'receivable', label: '应收报表', data: receivableDetail },
  { key: 'summary', label: '应收已收欠收汇总表', data: summaryReport },
  { key: 'list', label: '清单明细', data: listDetail }
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
      <h1 class="page-title">常用报表</h1>
      <p class="page-subtitle">财务管理 - 常用报表汇总查询</p>
    </div>
    <div class="filter-bar">
      <select v-model="filterArea" class="form-select"><option value="">全部管理区</option><option v-for="a in areas" :key="a">{{ a }}</option></select>
      <input v-model="filterMonth" type="month" class="form-input" />
      <div class="filter-actions"><button class="btn btn-primary">查询</button><button class="btn btn-default">导出</button></div>
    </div>
    <div class="card">
      <div class="tabs">
        <div v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @click="switchTab(t.key)">{{ t.label }}</div>
      </div>
      <div class="table-wrapper">
        <table class="data-table" v-if="activeTab === 'arrears_monthly'">
          <thead><tr><th>月份</th><th>欠费户数</th><th>欠费金额</th><th>欠费率</th><th>同比</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.month }}</td><td class="font-num">{{ r.count }}</td><td class="font-num text-danger">¥{{ fmt(r.amount) }}</td><td><span class="badge badge-red">{{ r.rate }}%</span></td><td :class="r.yoy >= 0 ? 'text-danger' : 'text-success'">{{ r.yoy > 0 ? '+' : '' }}{{ r.yoy }}%</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'comprehensive'">
          <thead><tr><th>管理区</th><th>应收</th><th>已收</th><th>欠费</th><th>收费率%</th><th>同比%</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.area }}</td><td class="font-num">¥{{ fmt(r.receivable) }}</td><td class="font-num text-success">¥{{ fmt(r.collected) }}</td><td class="font-num text-danger">¥{{ fmt(r.arrears) }}</td><td><span class="badge badge-blue">{{ r.rate }}%</span></td><td :class="r.yoy >= 0 ? 'text-success' : 'text-danger'">{{ r.yoy > 0 ? '+' : '' }}{{ r.yoy }}%</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'arrears_detail'">
          <thead><tr><th>房号</th><th>客户</th><th>收费项目</th><th>欠费金额</th><th>欠费月数</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.room }}</td><td>{{ r.customer }}</td><td>{{ r.feeItem }}</td><td class="font-num text-danger">¥{{ fmt(r.amount) }}</td><td class="font-num">{{ r.months }}个月</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'receivable'">
          <thead><tr><th>房号</th><th>客户</th><th>收费项目</th><th>应收金额</th><th>账单周期</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.room }}</td><td>{{ r.customer }}</td><td>{{ r.feeItem }}</td><td class="font-num">¥{{ fmt(r.amount) }}</td><td class="text-gray text-sm">{{ r.period }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'summary'">
          <thead><tr><th>收费项目</th><th>应收合计</th><th>已收合计</th><th>欠收合计</th><th>收费率</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.feeItem }}</td><td class="font-num">¥{{ fmt(r.receivable) }}</td><td class="font-num text-success">¥{{ fmt(r.collected) }}</td><td class="font-num text-danger">¥{{ fmt(r.arrears) }}</td><td><span class="badge badge-blue">{{ r.rate }}%</span></td></tr></tbody>
        </table>
        <table class="data-table" v-else>
          <thead><tr><th>房号</th><th>客户</th><th>收费项目</th><th>金额</th><th>支付方式</th><th>时间</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.room }}</td><td>{{ r.customer }}</td><td>{{ r.feeItem }}</td><td class="font-num">¥{{ fmt(r.amount) }}</td><td><span class="badge badge-green">{{ r.payMethod }}</span></td><td class="text-gray text-sm">{{ r.time }}</td></tr></tbody>
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
