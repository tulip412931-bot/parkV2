<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('bill_detail')
const currentPage = ref(1)
const pageSize = 10
const filterDateStart = ref('2026-01-01')
const filterDateEnd = ref('2026-04-16')

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }
function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const rooms = ['A-101','A-203','B-105','B-302','C-401','A-506','B-208','C-103','A-312','C-205']
const customers = ['张伟','李娜','王强','刘洋','陈静','赵敏','孙磊','周芳','吴刚','郑华']
const feeItems = ['物业费','租金','水费','电费','停车费']
const payMethods = ['现金','微信','支付宝','银行转账','POS刷卡']
const buildings = ['A栋','B栋','C栋','D栋','E栋']
const ticketTypes = ['收据','发票','定额票据','电子发票','手工票据']

const r1 = rng(10001)
const billDetail = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, billNo: 'BILL-' + String(20260001 + i), room: rooms[i], customer: customers[i],
  feeItem: feeItems[Math.floor(r1() * feeItems.length)], amount: Math.round(r1() * 8000 + 200),
  payMethod: payMethods[Math.floor(r1() * payMethods.length)],
  time: `2026-03-${pad(Math.floor(r1() * 28) + 1)} ${pad(Math.floor(r1() * 10) + 8)}:${pad(Math.floor(r1() * 60))}`
}))

const r2 = rng(10101)
const buildingDaily = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, date: `2026-04-${pad(i + 1)}`, building: buildings[Math.floor(r2() * buildings.length)],
  count: Math.floor(r2() * 50) + 5, amount: Math.round(r2() * 50000 + 2000)
}))

const r3 = rng(10201)
const feeByPayMethod = feeItems.map((item, i) => {
  const cash = Math.round(r3() * 30000 + 1000)
  const wechat = Math.round(r3() * 40000 + 2000)
  const alipay = Math.round(r3() * 20000 + 1000)
  const bank = Math.round(r3() * 50000 + 5000)
  return { id: i + 1, feeItem: item, cash, wechat, alipay, bank, total: cash + wechat + alipay + bank }
})

const r4 = rng(10301)
const customerByFee = customers.map((cust, i) => {
  const property = Math.round(r4() * 5000 + 500)
  const rent = Math.round(r4() * 20000 + 3000)
  const water = Math.round(r4() * 500 + 50)
  const electric = Math.round(r4() * 800 + 100)
  return { id: i + 1, customer: cust, property, rent, water, electric, total: property + rent + water + electric }
})

const r5 = rng(10401)
const ticketSummary = ticketTypes.map((type, i) => ({
  id: i + 1, type, issued: Math.floor(r5() * 200) + 50,
  used: Math.floor(r5() * 150) + 30, voided: Math.floor(r5() * 10) + 1,
  remaining: Math.floor(r5() * 80) + 10
}))

const tabs = [
  { key: 'bill_detail', label: '账单收费明细', data: billDetail },
  { key: 'building_daily', label: '楼栋收款按日汇总', data: buildingDaily },
  { key: 'fee_pay', label: '按收费项目分支付方式汇总', data: feeByPayMethod },
  { key: 'cust_fee', label: '按客户分收费项目汇总', data: customerByFee },
  { key: 'ticket', label: '票据汇总', data: ticketSummary }
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
      <h1 class="page-title">自定义报表</h1>
      <p class="page-subtitle">财务管理 - 多维度自定义报表查询</p>
    </div>
    <div class="filter-bar">
      <input v-model="filterDateStart" type="date" class="form-input" />
      <span class="text-gray">至</span>
      <input v-model="filterDateEnd" type="date" class="form-input" />
      <div class="filter-actions"><button class="btn btn-primary">查询</button><button class="btn btn-default">导出</button></div>
    </div>
    <div class="card">
      <div class="tabs">
        <div v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @click="switchTab(t.key)">{{ t.label }}</div>
      </div>
      <div class="table-wrapper">
        <table class="data-table" v-if="activeTab === 'bill_detail'">
          <thead><tr><th>账单号</th><th>房号</th><th>客户</th><th>收费项目</th><th>金额</th><th>支付方式</th><th>时间</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-num">{{ r.billNo }}</td><td>{{ r.room }}</td><td>{{ r.customer }}</td><td>{{ r.feeItem }}</td><td class="font-num text-success">¥{{ fmt(r.amount) }}</td><td><span class="badge badge-green">{{ r.payMethod }}</span></td><td class="text-gray text-sm">{{ r.time }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'building_daily'">
          <thead><tr><th>日期</th><th>楼栋</th><th>收款笔数</th><th>收款金额</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.date }}</td><td>{{ r.building }}</td><td class="font-num">{{ r.count }}</td><td class="font-num text-success">¥{{ fmt(r.amount) }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'fee_pay'">
          <thead><tr><th>收费项目</th><th>现金</th><th>微信</th><th>支付宝</th><th>银行</th><th>合计</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.feeItem }}</td><td class="font-num">¥{{ fmt(r.cash) }}</td><td class="font-num">¥{{ fmt(r.wechat) }}</td><td class="font-num">¥{{ fmt(r.alipay) }}</td><td class="font-num">¥{{ fmt(r.bank) }}</td><td class="font-num font-semibold">¥{{ fmt(r.total) }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'cust_fee'">
          <thead><tr><th>客户</th><th>物业费</th><th>租金</th><th>水费</th><th>电费</th><th>合计</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.customer }}</td><td class="font-num">¥{{ fmt(r.property) }}</td><td class="font-num">¥{{ fmt(r.rent) }}</td><td class="font-num">¥{{ fmt(r.water) }}</td><td class="font-num">¥{{ fmt(r.electric) }}</td><td class="font-num font-semibold">¥{{ fmt(r.total) }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else>
          <thead><tr><th>票据类型</th><th>已开数</th><th>已用数</th><th>作废数</th><th>剩余数</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.type }}</td><td class="font-num">{{ r.issued }}</td><td class="font-num text-success">{{ r.used }}</td><td class="font-num text-danger">{{ r.voided }}</td><td class="font-num text-primary">{{ r.remaining }}</td></tr></tbody>
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
