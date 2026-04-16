<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useDemoData } from '@/composables/useDemoData'

const {
  statCards,
  weekDays,
  trafficBarData,
  trafficLineData,
  propertyPieData,
  recentAccessRecords,
  todoItems
} = useDemoData()

const today = new Date()
const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

const trafficChartRef = ref(null)
const pieChartRef = ref(null)
let trafficChart = null
let pieChart = null

function iconSvg(icon) {
  const icons = {
    building: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>',
    area: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
    people: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    house: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    contract: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    leads: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>'
  }
  return icons[icon] || ''
}

function todoColor(type) {
  if (type === 'error') return '#dc2626'
  if (type === 'warning') return '#d97706'
  return '#2563eb'
}

function todoBg(type) {
  if (type === 'error') return '#fef2f2'
  if (type === 'warning') return '#fffbeb'
  return '#eff6ff'
}

function initCharts() {
  if (trafficChartRef.value) {
    trafficChart = echarts.init(trafficChartRef.value)
    trafficChart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1e293b', fontSize: 12 }
      },
      legend: {
        data: ['通行人次', '趋势'],
        top: 10,
        right: 10,
        textStyle: { color: '#6b7280', fontSize: 12 }
      },
      grid: { left: 50, right: 20, top: 50, bottom: 30 },
      xAxis: {
        type: 'category',
        data: weekDays,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: { color: '#6b7280' }
      },
      series: [
        {
          name: '通行人次',
          type: 'bar',
          data: trafficBarData,
          barWidth: 28,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#93c5fd' }
            ]),
            borderRadius: [4, 4, 0, 0]
          }
        },
        {
          name: '趋势',
          type: 'line',
          data: trafficLineData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#f59e0b', width: 2 },
          itemStyle: { color: '#f59e0b' }
        }
      ]
    })
  }

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1e293b', fontSize: 12 }
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { color: '#6b7280', fontSize: 12 }
      },
      color: ['#2563eb', '#f59e0b', '#10b981', '#94a3b8'],
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            fontSize: 11,
            color: '#fff',
            fontWeight: 600
          },
          data: propertyPieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
          }
        }
      ]
    })
  }
}

function handleResize() {
  trafficChart?.resize()
  pieChart?.resize()
}

onMounted(async () => {
  await nextTick()
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trafficChart?.dispose()
  pieChart?.dispose()
})
</script>

<template>
  <div class="dashboard">
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h2 class="banner-title">坤煌产业园智慧管理平台</h2>
        <p class="banner-info">{{ dateStr }} &nbsp;|&nbsp; 重庆市江津区双福街道</p>
      </div>
      <div class="banner-decor">
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
          <rect x="10" y="20" width="20" height="50" rx="2" fill="rgba(255,255,255,0.15)"/>
          <rect x="35" y="10" width="20" height="60" rx="2" fill="rgba(255,255,255,0.1)"/>
          <rect x="60" y="25" width="20" height="45" rx="2" fill="rgba(255,255,255,0.12)"/>
          <rect x="85" y="15" width="20" height="55" rx="2" fill="rgba(255,255,255,0.08)"/>
        </svg>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="stat-grid">
      <div v-for="card in statCards" :key="card.label" class="stat-card">
        <div class="stat-icon" :style="{ background: card.color + '15', color: card.color }" v-html="iconSvg(card.icon)"></div>
        <div class="stat-info">
          <div class="stat-value">{{ card.value }}<span class="stat-unit">{{ card.unit }}</span></div>
          <div class="stat-label">{{ card.label }}</div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="chart-row">
      <div class="chart-card">
        <div class="card-header">
          <h3 class="card-title">近7日通行趋势</h3>
        </div>
        <div ref="trafficChartRef" class="chart-container"></div>
      </div>
      <div class="chart-card chart-card-sm">
        <div class="card-header">
          <h3 class="card-title">房源状态分布</h3>
        </div>
        <div ref="pieChartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- Data Row -->
    <div class="data-row">
      <!-- Recent access records -->
      <div class="data-card">
        <div class="card-header">
          <h3 class="card-title">最近通行记录</h3>
          <router-link to="/app/access/records" class="card-link">查看全部</router-link>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>姓名</th>
              <th>所属企业</th>
              <th>类型</th>
              <th>方向</th>
              <th>通道</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in recentAccessRecords" :key="record.time + record.name">
              <td class="text-gray">{{ record.time }}</td>
              <td class="text-bold">{{ record.name }}</td>
              <td>{{ record.company }}</td>
              <td>
                <span class="type-badge" :class="record.type === '员工' ? 'badge-blue' : 'badge-orange'">
                  {{ record.type }}
                </span>
              </td>
              <td>
                <span :class="record.direction === '进入' ? 'text-green' : 'text-orange'">
                  {{ record.direction }}
                </span>
              </td>
              <td class="text-gray">{{ record.gate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Todo list -->
      <div class="data-card todo-card">
        <div class="card-header">
          <h3 class="card-title">待办事项</h3>
          <span class="todo-count">{{ todoItems.length }} 项</span>
        </div>
        <div class="todo-list">
          <div
            v-for="(item, idx) in todoItems"
            :key="idx"
            class="todo-item"
            :style="{ borderLeftColor: todoColor(item.type), background: todoBg(item.type) }"
          >
            <div class="todo-text">{{ item.text }}</div>
            <span class="todo-module">{{ item.module }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1400px;
}

/* Welcome Banner */
.welcome-banner {
  background: linear-gradient(135deg, #1e40af, #2563eb, #3b82f6);
  border-radius: 12px;
  padding: 28px 32px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.banner-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.banner-info {
  font-size: 13px;
  opacity: 0.8;
}

.banner-decor {
  opacity: 0.5;
}

/* Stat Cards */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.stat-unit {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  margin-left: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

/* Chart Row */
.chart-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.card-link {
  font-size: 12px;
  color: #2563eb;
  text-decoration: none;
}

.card-link:hover {
  text-decoration: underline;
}

.chart-container {
  width: 100%;
  height: 280px;
}

/* Data Row */
.data-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
}

.data-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.data-table td {
  padding: 10px 10px;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #f8fafc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.text-gray { color: #9ca3af; }
.text-bold { font-weight: 600; color: #111827; }
.text-green { color: #16a34a; }
.text-orange { color: #d97706; }

.type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.badge-blue {
  background: #eff6ff;
  color: #2563eb;
}

.badge-orange {
  background: #fffbeb;
  color: #d97706;
}

/* Todo */
.todo-count {
  font-size: 12px;
  color: #9ca3af;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 3px solid;
}

.todo-text {
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
}

.todo-module {
  font-size: 11px;
  color: #9ca3af;
  flex-shrink: 0;
  margin-left: 12px;
}

/* Responsive */
@media (max-width: 1200px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .chart-row,
  .data-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
