<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('receipt')
const currentPage = ref(1)
const pageSize = 15
const filterDateStart = ref('2026-01-01')
const filterDateEnd = ref('2026-04-16')

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }
function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const rooms = ['A-101','A-203','B-105','B-302','C-401','A-506','B-208','C-103','A-312','C-205','B-401','A-108','C-306','B-502','A-415']
const customers = ['张伟','李娜','王强','刘洋','陈静','赵敏','孙磊','周芳','吴刚','郑华','马超','黄丽','林峰','何婷','徐明']
const operators = ['张丽华','李明辉','王秀英','陈建国','刘小红']
const payMethods = ['现金','微信','支付宝','银行转账','POS刷卡']

const r1 = rng(6001)
const receiptRecords = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1, receiptNo: 'DP-R-' + String(20260001 + i), room: rooms[i], customer: customers[i],
  amount: Math.round(r1() * 20000 + 2000), payMethod: payMethods[Math.floor(r1() * payMethods.length)],
  time: `2026-03-${pad(Math.floor(r1() * 28) + 1)} ${pad(Math.floor(r1() * 10) + 8)}:${pad(Math.floor(r1() * 60))}`,
  operator: operators[Math.floor(r1() * operators.length)]
}))

const r2 = rng(6101)
const changeRecords = Array.from({ length: 15 }, (_, i) => {
  const type = r2() > 0.45 ? '收取' : '退还'
  return {
    id: i + 1, no: 'DP-C-' + String(20260001 + i), room: rooms[i], customer: customers[i],
    type, amount: Math.round(r2() * 15000 + 1000),
    time: `2026-03-${pad(Math.floor(r2() * 28) + 1)} ${pad(Math.floor(r2() * 10) + 8)}:${pad(Math.floor(r2() * 60))}`
  }
})

const r3 = rng(6201)
const refundRecords = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1, refundNo: 'DP-RF-' + String(20260001 + i), room: rooms[i], customer: customers[i],
  amount: Math.round(r3() * 12000 + 1000), refundMethod: payMethods[Math.floor(r3() * payMethods.length)],
  time: `2026-03-${pad(Math.floor(r3() * 28) + 1)} ${pad(Math.floor(r3() * 10) + 8)}:${pad(Math.floor(r3() * 60))}`,
  approver: operators[Math.floor(r3() * operators.length)]
}))

const tabs = [
  { key: 'receipt', label: '保证金收款明细', data: receiptRecords },
  { key: 'change', label: '保证金收退明细', data: changeRecords },
  { key: 'refund', label: '保证金退款明细', data: refundRecords }
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
      <h1 class="page-title">保证金报表</h1>
      <p class="page-subtitle">财务管理 - 保证金收款、收退及退款明细</p>
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
        <table class="data-table" v-if="activeTab === 'receipt'">
          <thead><tr><th>收款编号</th><th>房号</th><th>客户</th><th>金额</th><th>支付方式</th><th>收款时间</th><th>操作人</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-num">{{ r.receiptNo }}</td><td>{{ r.room }}</td><td>{{ r.customer }}</td><td class="font-num text-success">¥{{ fmt(r.amount) }}</td><td><span class="badge badge-blue">{{ r.payMethod }}</span></td><td class="text-gray text-sm">{{ r.time }}</td><td>{{ r.operator }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'change'">
          <thead><tr><th>编号</th><th>房号</th><th>客户</th><th>类型</th><th>金额</th><th>时间</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-num">{{ r.no }}</td><td>{{ r.room }}</td><td>{{ r.customer }}</td><td><span class="badge" :class="r.type === '收取' ? 'badge-green' : 'badge-orange'">{{ r.type }}</span></td><td class="font-num">¥{{ fmt(r.amount) }}</td><td class="text-gray text-sm">{{ r.time }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else>
          <thead><tr><th>退款编号</th><th>房号</th><th>客户</th><th>退款金额</th><th>退款方式</th><th>时间</th><th>审批人</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-num">{{ r.refundNo }}</td><td>{{ r.room }}</td><td>{{ r.customer }}</td><td class="font-num text-danger">¥{{ fmt(r.amount) }}</td><td><span class="badge badge-blue">{{ r.refundMethod }}</span></td><td class="text-gray text-sm">{{ r.time }}</td><td>{{ r.approver }}</td></tr></tbody>
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
