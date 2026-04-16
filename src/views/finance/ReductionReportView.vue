<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('detail')
const currentPage = ref(1)
const pageSize = 20
const filterDateStart = ref('2026-01-01')
const filterDateEnd = ref('2026-04-16')

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }
function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const rooms = ['A-101','A-203','B-105','B-302','C-401','A-506','B-208','C-103','A-312','C-205','B-401','A-108','C-306','B-502','A-415','B-601','C-102','A-207','B-303','C-504']
const customers = ['张伟','李娜','王强','刘洋','陈静','赵敏','孙磊','周芳','吴刚','郑华','马超','黄丽','林峰','何婷','徐明','蒋涛','曹颖','袁飞','邓雪','唐辉']
const feeItems = ['物业费','租金','水费','电费','停车费','空调费','网络费']
const approvers = ['李总监','王经理','张主管','陈经理','赵主任']
const reductionReasons = ['困难减免','空置减免','促销优惠','协商减免','长期客户优惠','政策减免','装修期减免','特殊申请']

const r1 = rng(9001)
const detailRecords = Array.from({ length: 20 }, (_, i) => {
  const original = Math.round(r1() * 10000 + 500)
  const reduced = Math.round(original * (r1() * 0.5 + 0.1))
  return {
    id: i + 1, room: rooms[i], customer: customers[i],
    feeItem: feeItems[Math.floor(r1() * feeItems.length)],
    original, reduced,
    reason: reductionReasons[Math.floor(r1() * reductionReasons.length)],
    approver: approvers[Math.floor(r1() * approvers.length)],
    time: `2026-${pad(Math.floor(r1() * 4) + 1)}-${pad(Math.floor(r1() * 28) + 1)}`
  }
})

const r2 = rng(9101)
const summaryRecords = feeItems.map((item, i) => {
  const count = Math.floor(r2() * 30) + 3
  const total = Math.round(r2() * 200000 + 10000)
  const recvRatio = (r2() * 8 + 1).toFixed(1)
  return { id: i + 1, feeItem: item, count, total, recvRatio }
})

const tabs = [
  { key: 'detail', label: '费用减免明细', data: detailRecords },
  { key: 'summary', label: '费用减免汇总', data: summaryRecords }
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
      <h1 class="page-title">费用减免统计</h1>
      <p class="page-subtitle">财务管理 - 费用减免明细与汇总分析</p>
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
        <table class="data-table" v-if="activeTab === 'detail'">
          <thead><tr><th>房号</th><th>客户</th><th>收费项目</th><th>原金额</th><th>减免金额</th><th>减免原因</th><th>审批人</th><th>时间</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.room }}</td><td>{{ r.customer }}</td><td>{{ r.feeItem }}</td><td class="font-num">¥{{ fmt(r.original) }}</td><td class="font-num text-danger">-¥{{ fmt(r.reduced) }}</td><td><span class="badge badge-orange">{{ r.reason }}</span></td><td>{{ r.approver }}</td><td class="text-gray text-sm">{{ r.time }}</td></tr></tbody>
        </table>
        <table class="data-table" v-else>
          <thead><tr><th>收费项目</th><th>减免笔数</th><th>减免总额</th><th>占应收比%</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.feeItem }}</td><td class="font-num">{{ r.count }}</td><td class="font-num text-danger">¥{{ fmt(r.total) }}</td><td><span class="badge badge-orange">{{ r.recvRatio }}%</span></td></tr></tbody>
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
