<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('books')
const currentPage = ref(1)
const pageSize = 10

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }

const bookStatuses = ['使用中', '已用完', '未启用']
const bookStatusBadge = { '使用中': 'badge-green', '已用完': 'badge-gray', '未启用': 'badge-blue' }
const invoiceTypes = ['收据', '发票']
const operators = ['张丽华', '李明辉', '王秀英', '陈建国', '刘小红']
const damageReasons = ['打印损坏', '书写错误', '纸张破损', '打印机故障', '信息填写有误']

const r1 = rng(1001)
const bookRecords = Array.from({ length: 12 }, (_, i) => {
  const type = invoiceTypes[Math.floor(r1() * 2)]
  const startNo = 100001 + i * 50
  const total = 50
  const used = Math.floor(r1() * 50)
  const day = Math.floor(r1() * 28) + 1
  return {
    id: i + 1, bookNo: 'BK' + String(2026001 + i), type,
    startNo: String(startNo), endNo: String(startNo + total - 1),
    usedCount: used, remainCount: total - used,
    receiver: operators[Math.floor(r1() * operators.length)],
    receiveDate: `2026-${pad(Math.floor(r1() * 4) + 1)}-${pad(day)}`,
    status: used >= total ? '已用完' : used > 0 ? '使用中' : '未启用'
  }
})

const r2 = rng(1101)
const damageRecords = Array.from({ length: 8 }, (_, i) => {
  const day = Math.floor(r2() * 16) + 1
  return {
    id: i + 1, invoiceNo: String(100001 + Math.floor(r2() * 600)),
    type: invoiceTypes[Math.floor(r2() * 2)],
    reason: damageReasons[Math.floor(r2() * damageReasons.length)],
    time: `2026-04-${pad(day)} ${pad(Math.floor(r2() * 10) + 8)}:${pad(Math.floor(r2() * 60))}:00`,
    registrant: operators[Math.floor(r2() * operators.length)]
  }
})

const r3 = rng(1201)
const detailStatuses = ['已开具', '已作废']
const detailStatusBadge = { '已开具': 'badge-green', '已作废': 'badge-red' }
const detailRecords = Array.from({ length: 15 }, (_, i) => {
  const day = Math.floor(r3() * 16) + 1
  return {
    id: i + 1, invoiceNo: String(100001 + i),
    type: invoiceTypes[Math.floor(r3() * 2)],
    chargeNo: 'PAY' + String(20260400001 + Math.floor(r3() * 50)),
    amount: Math.round((r3() * 10000 + 100) * 100) / 100,
    time: `2026-04-${pad(day)} ${pad(Math.floor(r3() * 10) + 8)}:${pad(Math.floor(r3() * 60))}:00`,
    issuer: operators[Math.floor(r3() * operators.length)],
    status: r3() > 0.15 ? '已开具' : '已作废'
  }
})

const tabData = { books: bookRecords, damage: damageRecords, detail: detailRecords }
const currentRecords = computed(() => tabData[activeTab.value])
const totalPages = computed(() => Math.ceil(currentRecords.value.length / pageSize) || 1)
const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return currentRecords.value.slice(start, start + pageSize)
})

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
function switchTab(tab) { activeTab.value = tab; currentPage.value = 1 }
</script>

<template>
  <div class="invoice-manage">
    <div class="page-header">
      <h1 class="page-title">票据管理</h1>
      <p class="page-subtitle">票据本管理、损毁登记和票据明细查询</p>
    </div>

    <div class="card">
      <div class="tabs">
        <div class="tab-item" :class="{ active: activeTab === 'books' }" @click="switchTab('books')">票据本管理<span class="tab-count">{{ bookRecords.length }}</span></div>
        <div class="tab-item" :class="{ active: activeTab === 'damage' }" @click="switchTab('damage')">损毁票据登记<span class="tab-count">{{ damageRecords.length }}</span></div>
        <div class="tab-item" :class="{ active: activeTab === 'detail' }" @click="switchTab('detail')">票据明细<span class="tab-count">{{ detailRecords.length }}</span></div>
      </div>

      <div class="table-wrapper">
        <!-- Tab 1: 票据本管理 -->
        <table class="data-table" v-if="activeTab === 'books'">
          <thead><tr><th>票据本编号</th><th>票据类型</th><th>起始号</th><th>结束号</th><th>已用数</th><th>剩余数</th><th>领用人</th><th>领用日期</th><th>状态</th></tr></thead>
          <tbody>
            <tr v-for="rec in pagedRecords" :key="rec.id">
              <td class="font-num">{{ rec.bookNo }}</td>
              <td>{{ rec.type }}</td>
              <td class="font-num">{{ rec.startNo }}</td>
              <td class="font-num">{{ rec.endNo }}</td>
              <td class="font-num">{{ rec.usedCount }}</td>
              <td class="font-num">{{ rec.remainCount }}</td>
              <td>{{ rec.receiver }}</td>
              <td class="text-gray text-sm">{{ rec.receiveDate }}</td>
              <td><span class="badge" :class="bookStatusBadge[rec.status]">{{ rec.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <!-- Tab 2: 损毁票据登记 -->
        <table class="data-table" v-else-if="activeTab === 'damage'">
          <thead><tr><th>票据号</th><th>票据类型</th><th>损毁原因</th><th>登记时间</th><th>登记人</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="rec in pagedRecords" :key="rec.id">
              <td class="font-num">{{ rec.invoiceNo }}</td>
              <td>{{ rec.type }}</td>
              <td>{{ rec.reason }}</td>
              <td class="text-gray text-sm">{{ rec.time }}</td>
              <td>{{ rec.registrant }}</td>
              <td><button class="btn btn-text btn-sm">查看</button></td>
            </tr>
          </tbody>
        </table>
        <!-- Tab 3: 票据明细 -->
        <table class="data-table" v-else>
          <thead><tr><th>票据号</th><th>票据类型</th><th>关联收费单</th><th>金额</th><th>开具时间</th><th>开具人</th><th>状态</th></tr></thead>
          <tbody>
            <tr v-for="rec in pagedRecords" :key="rec.id">
              <td class="font-num">{{ rec.invoiceNo }}</td>
              <td>{{ rec.type }}</td>
              <td class="font-num">{{ rec.chargeNo }}</td>
              <td class="font-num text-success">¥{{ fmt(rec.amount) }}</td>
              <td class="text-gray text-sm">{{ rec.time }}</td>
              <td>{{ rec.issuer }}</td>
              <td><span class="badge" :class="detailStatusBadge[rec.status]">{{ rec.status }}</span></td>
            </tr>
          </tbody>
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
.invoice-manage { max-width: 1400px; }
</style>
