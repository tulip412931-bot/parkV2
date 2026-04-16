<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const dateStart = ref('')
const dateEnd = ref('')
const quickPeriod = ref('month')

function setQuick(period) {
  quickPeriod.value = period
}

function doSearch() {
  // filter placeholder
}

// Chart refs
const trendRef = ref(null)
const statusRef = ref(null)
const buildingRef = ref(null)
const sourceRef = ref(null)

let trendChart = null
let statusChart = null
let buildingChart = null
let sourceChart = null

function initCharts() {
  // 1. Stacked bar - rental vs sale trend
  if (trendRef.value) {
    trendChart = echarts.init(trendRef.value)
    trendChart.setOption({
      tooltip: { trigger: 'axis', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#1e293b', fontSize: 12 } },
      legend: { data: ['租赁', '出售'], top: 8, right: 10, textStyle: { color: '#6b7280', fontSize: 12 } },
      grid: { left: 50, right: 20, top: 50, bottom: 30 },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月'], axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#6b7280' } },
      yAxis: { type: 'value', name: '万元', axisLine: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#6b7280' } },
      series: [
        {
          name: '租赁', type: 'bar', stack: 'total', data: [45, 52, 68, 72], barWidth: 32,
          itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#3b82f6' }, { offset: 1, color: '#93c5fd' }]), borderRadius: [0, 0, 0, 0] }
        },
        {
          name: '出售', type: 'bar', stack: 'total', data: [28, 35, 42, 38], barWidth: 32,
          itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#8b5cf6' }, { offset: 1, color: '#c4b5fd' }]), borderRadius: [4, 4, 0, 0] }
        }
      ]
    })
  }

  // 2. Donut - property status
  if (statusRef.value) {
    statusChart = echarts.init(statusRef.value)
    statusChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}套 ({d}%)', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#1e293b', fontSize: 12 } },
      legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: '#6b7280', fontSize: 12 } },
      color: ['#f59e0b', '#2563eb', '#f97316', '#8b5cf6'],
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['35%', '50%'], avoidLabelOverlap: false,
        label: { show: true, position: 'inside', formatter: '{c}', fontSize: 12, color: '#fff', fontWeight: 600 },
        data: [
          { value: 18, name: '待租' },
          { value: 27, name: '已租' },
          { value: 9, name: '待售' },
          { value: 6, name: '已售' }
        ],
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' } }
      }]
    })
  }

  // 3. Grouped bar - building absorption
  if (buildingRef.value) {
    buildingChart = echarts.init(buildingRef.value)
    buildingChart.setOption({
      tooltip: { trigger: 'axis', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#1e293b', fontSize: 12 } },
      legend: { data: ['已租', '待租'], top: 8, right: 10, textStyle: { color: '#6b7280', fontSize: 12 } },
      grid: { left: 50, right: 20, top: 50, bottom: 30 },
      xAxis: { type: 'category', data: ['A栋', 'B栋', 'C栋', 'D栋', 'E栋'], axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#6b7280' } },
      yAxis: { type: 'value', name: '套', axisLine: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#6b7280' } },
      series: [
        { name: '已租', type: 'bar', data: [8, 6, 5, 4, 4], barWidth: 20, itemStyle: { color: '#2563eb', borderRadius: [4, 4, 0, 0] } },
        { name: '待租', type: 'bar', data: [3, 4, 3, 3, 2], barWidth: 20, itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] } }
      ]
    })
  }

  // 4. Pie - customer source
  if (sourceRef.value) {
    sourceChart = echarts.init(sourceRef.value)
    sourceChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {d}%', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#1e293b', fontSize: 12 } },
      legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: '#6b7280', fontSize: 12 } },
      color: ['#2563eb', '#10b981', '#f59e0b', '#ef4444'],
      series: [{
        type: 'pie', radius: '65%', center: ['35%', '50%'],
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 12, color: '#374151' },
        data: [
          { value: 35, name: '线上咨询' },
          { value: 28, name: '线下登记' },
          { value: 22, name: '客户推荐' },
          { value: 15, name: '外部推广' }
        ],
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' } }
      }]
    })
  }
}

function handleResize() {
  trendChart?.resize()
  statusChart?.resize()
  buildingChart?.resize()
  sourceChart?.resize()
}

onMounted(async () => {
  await nextTick()
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  statusChart?.dispose()
  buildingChart?.dispose()
  sourceChart?.dispose()
})
</script>

<template>
  <div style="max-width:1400px">
    <div class="page-note warn">
      <span>&#9888;</span>
      <span>独立数据统计体系，与物业收费模块无数据关联</span>
    </div>

    <!-- Filter -->
    <div class="filter-bar mb-3">
      <input v-model="dateStart" type="date" class="form-input" style="width:150px;min-width:auto" />
      <span style="color:#9ca3af">至</span>
      <input v-model="dateEnd" type="date" class="form-input" style="width:150px;min-width:auto" />
      <div class="quick-btns">
        <button :class="{ active: quickPeriod === 'month' }" @click="setQuick('month')">本月</button>
        <button :class="{ active: quickPeriod === 'quarter' }" @click="setQuick('quarter')">本季</button>
        <button :class="{ active: quickPeriod === 'year' }" @click="setQuick('year')">本年</button>
      </div>
      <button class="btn btn-primary" @click="doSearch">查询</button>
    </div>

    <!-- Stat Cards -->
    <div class="stat-cards mb-3">
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#eff6ff;color:#2563eb">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">房源去化率</div>
          <div class="stat-card-value">72.3<span class="stat-card-unit">%</span></div>
          <div class="stat-card-trend up">&#9650; 较上月+3.2%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#f5f3ff;color:#7c3aed">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">租售总额</div>
          <div class="stat-card-value">¥286.5<span class="stat-card-unit">万</span></div>
          <div class="stat-card-trend up">&#9650; 较上月+12.6%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#f0fdf4;color:#16a34a">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">定金收取</div>
          <div class="stat-card-value">¥42.8<span class="stat-card-unit">万</span></div>
          <div class="stat-card-trend up">&#9650; 较上月+5.1%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#fff7ed;color:#ea580c">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">客户转化率</div>
          <div class="stat-card-value">38.6<span class="stat-card-unit">%</span></div>
          <div class="stat-card-trend down">&#9660; 较上月-1.8%</div>
        </div>
      </div>
    </div>

    <!-- Charts 2x2 -->
    <div class="chart-grid">
      <div class="chart-card">
        <div class="chart-card-header">
          <div class="chart-card-title">租售额趋势</div>
        </div>
        <div ref="trendRef" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header">
          <div class="chart-card-title">房源状态占比</div>
        </div>
        <div ref="statusRef" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header">
          <div class="chart-card-title">各楼栋去化</div>
        </div>
        <div ref="buildingRef" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header">
          <div class="chart-card-title">客户来源</div>
        </div>
        <div ref="sourceRef" class="chart-box"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
