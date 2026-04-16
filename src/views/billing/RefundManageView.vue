<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('center')
const keyword = ref('')
const currentPage = ref(1)
const pageSize = 10

const rooms = ['03-14-01','03-14-02','03-14-03','03-14-04','03-14-05','4-1-01','4-1-02','4-1-03','物业-01','物业-02']
const names = ['重庆星辰科技有限公司','四川云图数据有限公司','重庆智远物联有限公司','成都蓝海软件有限公司','重庆鼎新能源科技有限公司','贵州云算大数据有限公司']
const reasons = ['多收退款', '合同终止退款', '费用重复收取', '客户搬迁退款', '优惠政策补退', '押金退还']
const methods = ['原路退回', '银行转账', '现金退款', '微信退款']
const statusList = ['待审核', '已退款', '已驳回']
const statusBadge = { '待审核': 'badge-orange', '已退款': 'badge-green', '已驳回': 'badge-red' }

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }

function genRecords(seed, count, completed) {
  const r = rng(seed)
  return Array.from({ length: count }, (_, i) => {
    const day = Math.floor(r() * 16) + 1, hour = Math.floor(r() * 10) + 8, min = Math.floor(r() * 60)
    const status = completed ? (r() > 0.15 ? '已退款' : '已驳回') : statusList[Math.floor(r() * statusList.length)]
    const rec = {
      id: i + 1, no: 'REF' + String(completed ? 20260300001 : 20260400001 + i),
      room: rooms[Math.floor(r() * rooms.length)],
      customer: names[Math.floor(r() * names.length)],
      amount: Math.round((r() * 8000 + 100) * 100) / 100,
      reason: reasons[Math.floor(r() * reasons.length)],
      applyTime: `2026-04-${pad(day)} ${pad(hour)}:${pad(min)}:00`,
      status
    }
    if (completed) {
      rec.completeTime = `2026-04-${pad(Math.min(day + Math.floor(r() * 3) + 1, 16))} ${pad(hour)}:${pad(min)}:00`
      rec.method = methods[Math.floor(r() * methods.length)]
    }
    return rec
  }).sort((a, b) => b.applyTime.localeCompare(a.applyTime))
}

const centerRecords = genRecords(701, 15, false)
const historyRecords = genRecords(801, 15, true)

const currentRecords = computed(() => activeTab.value === 'center' ? centerRecords : historyRecords)
const filtered = computed(() => {
  return currentRecords.value.filter(rec => {
    if (keyword.value && !rec.customer.includes(keyword.value) && !rec.room.includes(keyword.value) && !rec.no.includes(keyword.value)) return false
    return true
  })
})
const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize) || 1)
const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
function switchTab(tab) { activeTab.value = tab; currentPage.value = 1; keyword.value = '' }
</script>

<template>
  <div class="refund-manage">
    <div class="page-header">
      <h1 class="page-title">退款管理</h1>
      <p class="page-subtitle">退款审批与退款记录查询</p>
    </div>

    <div class="card">
      <div class="tabs">
        <div class="tab-item" :class="{ active: activeTab === 'center' }" @click="switchTab('center')">退款中心<span class="tab-count">{{ centerRecords.length }}</span></div>
        <div class="tab-item" :class="{ active: activeTab === 'history' }" @click="switchTab('history')">退款记录<span class="tab-count">{{ historyRecords.length }}</span></div>
      </div>

      <div class="filter-bar" style="margin-bottom:16px;">
        <div class="search-input-wrapper">
          <span class="search-input-icon">&#128269;</span>
          <input v-model="keyword" class="form-input" placeholder="搜索编号/客户/房号" />
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>退款编号</th><th>房号</th><th>客户名称</th><th>退款金额</th><th>退款原因</th><th>申请时间</th>
              <th v-if="activeTab === 'history'">完成时间</th>
              <th v-if="activeTab === 'history'">退款方式</th>
              <th>状态</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rec in pagedRecords" :key="rec.id">
              <td class="font-num">{{ rec.no }}</td>
              <td class="font-medium">{{ rec.room }}</td>
              <td class="truncate" style="max-width:150px;">{{ rec.customer }}</td>
              <td class="font-num text-danger">¥{{ fmt(rec.amount) }}</td>
              <td>{{ rec.reason }}</td>
              <td class="text-gray text-sm">{{ rec.applyTime }}</td>
              <td v-if="activeTab === 'history'" class="text-gray text-sm">{{ rec.completeTime }}</td>
              <td v-if="activeTab === 'history'">{{ rec.method }}</td>
              <td><span class="badge" :class="statusBadge[rec.status]">{{ rec.status }}</span></td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">查看</button>
                  <button v-if="activeTab === 'center' && rec.status === '待审核'" class="btn btn-text btn-sm text-success">审批</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
.refund-manage { max-width: 1400px; }
</style>
