<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('annual_goal')
const currentPage = ref(1)
const pageSize = 10

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }
function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const areas = ['A区','B区','C区']
const buildings = ['A1栋','A2栋','B1栋','B2栋','C1栋','C2栋','A3栋','B3栋','C3栋','A4栋']
const months = Array.from({ length: 12 }, (_, i) => `2026-${pad(i + 1)}`)

const r1 = rng(11001)
const annualGoal = Array.from({ length: 10 }, (_, i) => {
  const target = Math.round(r1() * 2000000 + 500000)
  const done = Math.round(target * (r1() * 0.4 + 0.5))
  return {
    id: i + 1, year: 2024 + Math.floor(i / areas.length),
    area: areas[i % areas.length], target, done,
    rate: ((done / target) * 100).toFixed(1)
  }
})

const r2 = rng(11101)
const monthlyGoal = Array.from({ length: 10 }, (_, i) => {
  const target = Math.round(r2() * 200000 + 50000)
  const actual = Math.round(target * (r2() * 0.4 + 0.6))
  return {
    id: i + 1, month: months[i % 12], area: areas[i % areas.length],
    target, actual, rate: ((actual / target) * 100).toFixed(1)
  }
})

const r3 = rng(11201)
const rentalGoal = Array.from({ length: 10 }, (_, i) => {
  const totalArea = Math.round(r3() * 5000 + 2000)
  const planArea = Math.round(totalArea * (r3() * 0.3 + 0.6))
  const planRate = ((planArea / totalArea) * 100).toFixed(1)
  const actualRate = (parseFloat(planRate) + (r3() * 10 - 5)).toFixed(1)
  return {
    id: i + 1, area: areas[i % areas.length], building: buildings[i],
    totalArea, planArea, planRate, actualRate
  }
})

const tabs = [
  { key: 'annual_goal', label: '年度收费目标管理', data: annualGoal },
  { key: 'monthly_goal', label: '月度应收目标管理', data: monthlyGoal },
  { key: 'rental_goal', label: '计划出租率管理', data: rentalGoal }
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
      <h1 class="page-title">目标管理</h1>
      <p class="page-subtitle">财务管理 - 收费目标与出租率目标管理</p>
    </div>
    <div class="filter-bar">
      <div class="filter-actions">
        <button class="btn btn-primary">设置目标</button>
        <button class="btn btn-default">导出</button>
      </div>
    </div>
    <div class="card">
      <div class="tabs">
        <div v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @click="switchTab(t.key)">{{ t.label }}</div>
      </div>
      <div class="table-wrapper">
        <table class="data-table" v-if="activeTab === 'annual_goal'">
          <thead><tr><th>年度</th><th>管理区</th><th>目标金额</th><th>已完成</th><th>完成率%</th><th>操作</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.year }}</td><td>{{ r.area }}</td><td class="font-num">¥{{ fmt(r.target) }}</td><td class="font-num text-success">¥{{ fmt(r.done) }}</td><td><span class="badge" :class="r.rate >= 100 ? 'badge-green' : r.rate >= 80 ? 'badge-blue' : 'badge-orange'">{{ r.rate }}%</span></td><td><button class="btn btn-text btn-sm">编辑</button></td></tr></tbody>
        </table>
        <table class="data-table" v-else-if="activeTab === 'monthly_goal'">
          <thead><tr><th>月份</th><th>管理区</th><th>目标金额</th><th>实际应收</th><th>达成率%</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.month }}</td><td>{{ r.area }}</td><td class="font-num">¥{{ fmt(r.target) }}</td><td class="font-num">¥{{ fmt(r.actual) }}</td><td><span class="badge" :class="r.rate >= 100 ? 'badge-green' : r.rate >= 80 ? 'badge-blue' : 'badge-orange'">{{ r.rate }}%</span></td></tr></tbody>
        </table>
        <table class="data-table" v-else>
          <thead><tr><th>管理区</th><th>楼宇</th><th>总面积</th><th>计划出租面积</th><th>计划出租率</th><th>实际出租率</th><th>操作</th></tr></thead>
          <tbody><tr v-for="r in pagedRecords" :key="r.id"><td class="font-medium">{{ r.area }}</td><td>{{ r.building }}</td><td class="font-num">{{ r.totalArea }}m²</td><td class="font-num">{{ r.planArea }}m²</td><td><span class="badge badge-blue">{{ r.planRate }}%</span></td><td><span class="badge" :class="parseFloat(r.actualRate) >= parseFloat(r.planRate) ? 'badge-green' : 'badge-orange'">{{ r.actualRate }}%</span></td><td><button class="btn btn-text btn-sm">编辑</button></td></tr></tbody>
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
