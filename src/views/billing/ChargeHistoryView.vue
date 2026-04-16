<script setup>
import { ref, computed } from 'vue'

const dateFrom = ref('2026-04-01')
const dateTo = ref('2026-04-16')
const payMethod = ref('全部')
const operator = ref('全部')
const keyword = ref('')
const currentPage = ref(1)
const pageSize = 10

const payMethods = ['全部', '现金', '微信', '支付宝', '银行转账']
const operators = ['全部', '张丽华', '李明辉', '王秀英', '陈建国', '刘小红']
const rooms = ['03-14-01','03-14-02','03-14-03','03-14-04','03-14-05','4-1-01','4-1-02','4-1-03','物业-01','物业-02']
const names = ['重庆星辰科技有限公司','四川云图数据有限公司','重庆智远物联有限公司','成都蓝海软件有限公司','重庆鼎新能源科技有限公司','贵州云算大数据有限公司']
const fees = ['物业费','租金','水费','电费','停车费','公摊水费','公摊电费','垃圾清运费']
const methods = ['现金','微信','支付宝','银行转账']
const ops = ['张丽华','李明辉','王秀英','陈建国','刘小红']

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
const r = rng(99)
function pad(n) { return String(n).padStart(2, '0') }

const records = Array.from({ length: 50 }, (_, i) => {
  const day = Math.floor(r() * 16) + 1
  const hour = Math.floor(r() * 10) + 8
  const min = Math.floor(r() * 60)
  const sec = Math.floor(r() * 60)
  return {
    id: i + 1,
    serialNo: 'PAY' + String(20260400001 + i),
    time: `2026-04-${pad(day)} ${pad(hour)}:${pad(min)}:${pad(sec)}`,
    room: rooms[Math.floor(r() * rooms.length)],
    customer: names[Math.floor(r() * names.length)],
    feeType: fees[Math.floor(r() * fees.length)],
    amount: Math.round((r() * 15000 + 100) * 100) / 100,
    method: methods[Math.floor(r() * methods.length)],
    operator: ops[Math.floor(r() * ops.length)]
  }
}).sort((a, b) => b.time.localeCompare(a.time))

const filtered = computed(() => {
  return records.filter(rec => {
    if (payMethod.value !== '全部' && rec.method !== payMethod.value) return false
    if (operator.value !== '全部' && rec.operator !== operator.value) return false
    if (keyword.value && !rec.customer.includes(keyword.value) && !rec.room.includes(keyword.value) && !rec.serialNo.includes(keyword.value)) return false
    return true
  })
})

const totalAmount = computed(() => filtered.value.reduce((s, r) => s + r.amount, 0))
const totalCount = computed(() => filtered.value.length)
const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize) || 1)
const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }

const methodBadge = { '现金': 'badge-green', '微信': 'badge-green', '支付宝': 'badge-blue', '银行转账': 'badge-purple' }
</script>

<template>
  <div class="charge-history">
    <div class="page-header">
      <h1 class="page-title">收费历史记录</h1>
      <p class="page-subtitle">查看和管理所有收费流水</p>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <input v-model="dateFrom" type="date" class="form-input" style="width:140px;" />
      <span class="text-gray">~</span>
      <input v-model="dateTo" type="date" class="form-input" style="width:140px;" />
      <select v-model="payMethod" class="form-select"><option v-for="m in payMethods" :key="m">{{ m }}</option></select>
      <select v-model="operator" class="form-select"><option v-for="o in operators" :key="o">{{ o }}</option></select>
      <div class="search-input-wrapper">
        <span class="search-input-icon">&#128269;</span>
        <input v-model="keyword" class="form-input" placeholder="搜索流水号/客户/房号" />
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>流水号</th><th>收费时间</th><th>房号</th><th>客户名称</th><th>收费项目</th><th>收费金额</th><th>支付方式</th><th>操作人</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="rec in pagedRecords" :key="rec.id">
              <td class="font-num">{{ rec.serialNo }}</td>
              <td class="text-gray text-sm">{{ rec.time }}</td>
              <td class="font-medium">{{ rec.room }}</td>
              <td class="truncate" style="max-width:160px;">{{ rec.customer }}</td>
              <td>{{ rec.feeType }}</td>
              <td class="font-num text-success">¥{{ fmt(rec.amount) }}</td>
              <td><span class="badge" :class="methodBadge[rec.method]">{{ rec.method }}</span></td>
              <td>{{ rec.operator }}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">查看</button>
                  <button class="btn btn-text btn-sm">打印</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div class="summary-row">
        <div class="summary-item"><span class="summary-label">合计收费</span><span class="summary-value text-success">¥{{ fmt(totalAmount) }}</span></div>
        <div class="summary-item"><span class="summary-label">笔数</span><span class="summary-value">{{ totalCount }}</span></div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <span class="pagination-info">共 {{ filtered.length }} 条记录</span>
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
.charge-history { max-width: 1400px; }
</style>
