<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('cash')
const currentPage = ref(1)
const pageSize = 10
const filterDateStart = ref('2026-01-01')
const filterDateEnd = ref('2026-04-16')

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }
function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const rooms = ['A-101','A-203','B-105','B-302','C-401','A-506','B-208','C-103','A-312','C-205']
const customers = ['张伟','李娜','王强','刘洋','陈静','赵敏','孙磊','周芳','吴刚','郑华']
const operators = ['张丽华','李明辉','王秀英','陈建国','刘小红']
const feeItems = ['物业费','租金','水费','电费','停车费','空调费','网络费']
const payMethods = ['现金','微信','支付宝','银行转账','POS刷卡']
const statuses = ['成功','已退款']

const r1 = rng(4001)
const cashRecords = Array.from({ length: 10 }, (_, i) => ({ id: i + 1,
  receiptNo: 'REC' + String(20260001 + i), room: rooms[i], customer: customers[i],
  feeItem: feeItems[Math.floor(r1() * feeItems.length)], amount: Math.round(r1() * 8000 + 200),
  time: `2026-03-${pad(Math.floor(r1() * 28) + 1)} ${pad(Math.floor(r1() * 10) + 8)}:${pad(Math.floor(r1() * 60))}`,
  operator: operators[Math.floor(r1() * operators.length)]
}))

const r2 = rng(4101)
const wechatRecords = Array.from({ length: 10 }, (_, i) => ({ id: i + 1,
  tradeNo: 'WX' + String(4200000000 + Math.floor(r2() * 99999)), room: rooms[i], customer: customers[i],
  amount: Math.round(r2() * 6000 + 100),
  time: `2026-03-${pad(Math.floor(r2() * 28) + 1)} ${pad(Math.floor(r2() * 10) + 8)}:${pad(Math.floor(r2() * 60))}`,
  status: r2() > 0.1 ? '成功' : '已退款'
}))

const r3 = rng(4201)
const preDepositRecords = Array.from({ length: 10 }, (_, i) => {
  const type = r3() > 0.5 ? '充值' : '消费'
  const amt = Math.round(r3() * 5000 + 100)
  return { id: i + 1, room: rooms[i], customer: customers[i], type, amount: amt,
    balance: Math.round(r3() * 20000 + 500),
    time: `2026-03-${pad(Math.floor(r3() * 28) + 1)} ${pad(Math.floor(r3() * 10) + 8)}:${pad(Math.floor(r3() * 60))}`
  }
})

const r4 = rng(4301)
const depositRecords = Array.from({ length: 10 }, (_, i) => {
  const type = r4() > 0.4 ? '收取' : '退还'
  return { id: i + 1, room: rooms[i], customer: customers[i], type,
    amount: Math.round(r4() * 10000 + 1000),
    time: `2026-03-${pad(Math.floor(r4() * 28) + 1)} ${pad(Math.floor(r4() * 10) + 8)}:${pad(Math.floor(r4() * 60))}`,
    operator: operators[Math.floor(r4() * operators.length)]
  }
})

const r5 = rng(4401)
const contractRecords = Array.from({ length: 10 }, (_, i) => {
  const recv = Math.round(r5() * 50000 + 5000)
  const paid = Math.round(recv * (r5() * 0.3 + 0.6))
  return { id: i + 1, contractNo: 'HT-2026-' + pad(i + 1), customer: customers[i],
    feeItem: feeItems[Math.floor(r5() * feeItems.length)], receivable: recv, collected: paid, arrears: recv - paid
  }
})

const r6 = rng(4501)
const chargeSummary = Array.from({ length: 10 }, (_, i) => {
  const recv = Math.round(r6() * 300000 + 50000)
  const paid = Math.round(recv * (r6() * 0.3 + 0.6))
  return { id: i + 1, feeItem: feeItems[i % feeItems.length], receivable: recv, collected: paid,
    arrears: recv - paid, rate: ((paid / recv) * 100).toFixed(1)
  }
})

const r7 = rng(4601)
const totalAmt = payMethods.reduce((s) => s + Math.round(r7() * 200000 + 10000), 0)
const r7b = rng(4601)
const payMethodSummary = payMethods.map((m, i) => {
  const amt = Math.round(r7b() * 200000 + 10000)
  const count = Math.floor(r7b() * 200) + 20
  return { id: i + 1, method: m, count, amount: amt, ratio: (r7b() * 30 + 5).toFixed(1) }
})

const tabs = [
  { key: 'cash', label: '现金收款明细', data: cashRecords },
  { key: 'wechat', label: '微信支付明细', data: wechatRecords },
  { key: 'predeposit', label: '预存款收支明细', data: preDepositRecords },
  { key: 'deposit', label: '保证金收退明细', data: depositRecords },
  { key: 'contract', label: '合同费用汇总表', data: contractRecords },
  { key: 'charge_summary', label: '收费汇总表', data: chargeSummary },
  { key: 'pay_method', label: '收费按支付方式汇总表', data: payMethodSummary }
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
      <h1 class="page-title">费用报表</h1>
      <p class="page-subtitle">财务管理 - 各类费用收支明细与汇总</p>
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
        <table class="data-table" v-if="activeTab === 'cash'">
          <thead><tr><th>收据号</th><th>房号</th><th>客户</th><th>收费项目</th><th>金额</th><th>收款时间</th><th>操作人</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-num">{{ r.receiptNo }}</td><td>{{ r.room }}</td><td>{{ r.customer }}</td><td>{{ r.feeItem }}</td><td class="font-num text-success">¥{{ fmt(r.amount) }}</td><td class="text-gray text-sm">{{ r.time }}</td><td>{{ r.operator }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'wechat'">
          <thead><tr><th>交易号</th><th>房号</th><th>客户</th><th>金额</th><th>支付时间</th><th>状态</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-num">{{ r.tradeNo }}</td><td>{{ r.room }}</td><td>{{ r.customer }}</td><td class="font-num text-success">¥{{ fmt(r.amount) }}</td><td class="text-gray text-sm">{{ r.time }}</td><td><span class="badge" :class="r.status === '成功' ? 'badge-green' : 'badge-orange'">{{ r.status }}</span></td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'predeposit'">
          <thead><tr><th>房号</th><th>客户</th><th>类型</th><th>金额</th><th>余额</th><th>时间</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td>{{ r.room }}</td><td>{{ r.customer }}</td><td><span class="badge" :class="r.type === '充值' ? 'badge-green' : 'badge-orange'">{{ r.type }}</span></td><td class="font-num">¥{{ fmt(r.amount) }}</td><td class="font-num text-primary">¥{{ fmt(r.balance) }}</td><td class="text-gray text-sm">{{ r.time }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'deposit'">
          <thead><tr><th>房号</th><th>客户</th><th>类型</th><th>金额</th><th>时间</th><th>操作人</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td>{{ r.room }}</td><td>{{ r.customer }}</td><td><span class="badge" :class="r.type === '收取' ? 'badge-blue' : 'badge-orange'">{{ r.type }}</span></td><td class="font-num">¥{{ fmt(r.amount) }}</td><td class="text-gray text-sm">{{ r.time }}</td><td>{{ r.operator }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'contract'">
          <thead><tr><th>合同编号</th><th>客户</th><th>费用项目</th><th>应收</th><th>已收</th><th>欠费</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-num">{{ r.contractNo }}</td><td>{{ r.customer }}</td><td>{{ r.feeItem }}</td><td class="font-num">¥{{ fmt(r.receivable) }}</td><td class="font-num text-success">¥{{ fmt(r.collected) }}</td><td class="font-num text-danger">¥{{ fmt(r.arrears) }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'charge_summary'">
          <thead><tr><th>收费项目</th><th>应收总额</th><th>已收总额</th><th>欠费总额</th><th>收费率</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.feeItem }}</td><td class="font-num">¥{{ fmt(r.receivable) }}</td><td class="font-num text-success">¥{{ fmt(r.collected) }}</td><td class="font-num text-danger">¥{{ fmt(r.arrears) }}</td><td><span class="badge badge-blue">{{ r.rate }}%</span></td></tr></tbody>
        </table>
        <table class="data-table" v-else>
          <thead><tr><th>支付方式</th><th>笔数</th><th>金额</th><th>占比%</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.method }}</td><td class="font-num">{{ r.count }}</td><td class="font-num text-success">¥{{ fmt(r.amount) }}</td><td><span class="badge badge-blue">{{ r.ratio }}%</span></td></tr></tbody>
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
