<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const filterArea = ref('')
const filterBuilding = ref('')

const pieChartRef = ref(null)
const barChartRef = ref(null)
let pieChart = null
let barChart = null

const summaryCards = [
  { label: '总资源数', value: 128, unit: '间', color: '#2563eb' },
  { label: '已出租', value: 76, unit: '间', color: '#16a34a' },
  { label: '空置', value: 30, unit: '间', color: '#d97706' },
  { label: '已出售', value: 22, unit: '间', color: '#6b7280' },
  { label: '出租率', value: '59.4', unit: '%', color: '#0891b2' }
]

const buildingStats = [
  { building: 'A栋', total: 24, rented: 15, vacant: 6, sold: 3, rentRate: '62.5', vacantRate: '25.0' },
  { building: 'B栋', total: 22, rented: 14, vacant: 5, sold: 3, rentRate: '63.6', vacantRate: '22.7' },
  { building: 'C栋', total: 20, rented: 12, vacant: 4, sold: 4, rentRate: '60.0', vacantRate: '20.0' },
  { building: 'D栋', total: 18, rented: 10, vacant: 5, sold: 3, rentRate: '55.6', vacantRate: '27.8' },
  { building: 'E栋', total: 22, rented: 13, vacant: 5, sold: 4, rentRate: '59.1', vacantRate: '22.7' },
  { building: 'F栋', total: 22, rented: 12, vacant: 5, sold: 5, rentRate: '54.5', vacantRate: '22.7' }
]

const pieData = [
  { value: 38, name: '商铺' },
  { value: 28, name: '办公室' },
  { value: 22, name: '仓库' },
  { value: 18, name: '车位' },
  { value: 14, name: '厂房' },
  { value: 8, name: '配套用房' }
]

function initCharts() {
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}间 ({d}%)', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#1e293b', fontSize: 12 } },
      legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: '#6b7280', fontSize: 12 } },
      color: ['#2563eb', '#0891b2', '#f59e0b', '#10b981', '#8b5cf6', '#94a3b8'],
      series: [{
        type: 'pie', radius: ['42%', '68%'], center: ['35%', '50%'],
        label: { show: true, position: 'inside', formatter: '{d}%', fontSize: 11, color: '#fff', fontWeight: 600 },
        data: pieData,
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } }
      }]
    })
  }

  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
    barChart.setOption({
      tooltip: { trigger: 'axis', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#1e293b', fontSize: 12 } },
      legend: { data: ['空置', '已出租', '已出售'], top: 10, right: 10, textStyle: { color: '#6b7280', fontSize: 12 } },
      grid: { left: 50, right: 20, top: 50, bottom: 30 },
      xAxis: { type: 'category', data: buildingStats.map(b => b.building), axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#6b7280' } },
      yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#6b7280' } },
      color: ['#f59e0b', '#2563eb', '#94a3b8'],
      series: [
        { name: '空置', type: 'bar', stack: 'total', data: buildingStats.map(b => b.vacant), barWidth: 32, itemStyle: { borderRadius: [0, 0, 0, 0] } },
        { name: '已出租', type: 'bar', stack: 'total', data: buildingStats.map(b => b.rented) },
        { name: '已出售', type: 'bar', stack: 'total', data: buildingStats.map(b => b.sold), itemStyle: { borderRadius: [4, 4, 0, 0] } }
      ]
    })
  }
}

function handleResize() {
  pieChart?.resize()
  barChart?.resize()
}

onMounted(async () => {
  await nextTick()
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  pieChart?.dispose()
  barChart?.dispose()
})
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">房态统计</h1>
      <p class="page-subtitle">坤煌食品产业园 - 资源状态总览与数据分析</p>
    </div>

    <div class="filter-bar">
      <select v-model="filterArea" class="form-select">
        <option value="">全部管理区</option>
        <option>坤煌（长寿）食品产业园</option>
      </select>
      <select v-model="filterBuilding" class="form-select">
        <option value="">全部楼宇</option>
        <option>A栋</option><option>B栋</option><option>C栋</option>
        <option>D栋</option><option>E栋</option><option>F栋</option>
      </select>
    </div>

    <!-- Summary Cards -->
    <div class="stat-cards">
      <div v-for="card in summaryCards" :key="card.label" class="stat-card">
        <div class="stat-card-icon" :style="{ background: card.color + '15', color: card.color, fontSize: '20px' }">&#9632;</div>
        <div class="stat-card-content">
          <div class="stat-card-label">{{ card.label }}</div>
          <div class="stat-card-value">{{ card.value }}<span class="stat-card-unit">{{ card.unit }}</span></div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="chart-grid mb-3">
      <div class="chart-card">
        <div class="chart-card-header">
          <h3 class="chart-card-title">资源类型分布</h3>
        </div>
        <div ref="pieChartRef" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header">
          <h3 class="chart-card-title">楼宇资源状态</h3>
        </div>
        <div ref="barChartRef" class="chart-box"></div>
      </div>
    </div>

    <!-- Building Stats Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">楼宇统计明细</span>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>楼宇</th><th>总间数</th><th>已出租</th><th>空置</th>
              <th>已出售</th><th>出租率</th><th>空置率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in buildingStats" :key="row.building">
              <td class="font-medium">{{ row.building }}</td>
              <td class="font-num">{{ row.total }}</td>
              <td class="font-num text-success">{{ row.rented }}</td>
              <td class="font-num text-warning">{{ row.vacant }}</td>
              <td class="font-num text-gray">{{ row.sold }}</td>
              <td class="font-num"><span class="badge badge-green">{{ row.rentRate }}%</span></td>
              <td class="font-num"><span class="badge badge-orange">{{ row.vacantRate }}%</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="summary-row">
        <div class="summary-item"><span class="summary-label">合计总间数</span><span class="summary-value">128</span></div>
        <div class="summary-item"><span class="summary-label">合计已出租</span><span class="summary-value text-success">76</span></div>
        <div class="summary-item"><span class="summary-label">合计空置</span><span class="summary-value text-warning">30</span></div>
        <div class="summary-item"><span class="summary-label">合计已出售</span><span class="summary-value">22</span></div>
        <div class="summary-item"><span class="summary-label">综合出租率</span><span class="summary-value text-primary">59.4%</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
</style>
