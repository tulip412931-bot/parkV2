<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const chartRef = ref(null)
let chartInstance = null

const stats = [
  { label: '本月开票数量', value: '1,286', change: '+12.5%', dir: 'up', icon: 'receipt', color: '#1677ff', bg: '#e6f4ff' },
  { label: '本月开票金额', value: '¥3.86万', change: '+8.3%', dir: 'up', icon: 'money', color: '#52c41a', bg: '#f6ffed' },
  { label: '待处理发票', value: '23', change: '', dir: '', icon: 'pending', color: '#fa8c16', bg: '#fff7e6' },
  { label: '本月已作废', value: '5', change: '-2.1%', dir: 'down', icon: 'cancel', color: '#ff4d4f', bg: '#fff2f0' }
]

const quickActions = [
  { label: '立即开票', path: '/app/invoice', icon: 'edit', color: '#1677ff', bg: '#e6f4ff' },
  { label: '发票查询', path: '/app/manage', icon: 'search', color: '#52c41a', bg: '#f6ffed' },
  { label: '发票查验', path: '/app/verify', icon: 'shield', color: '#fa8c16', bg: '#fff7e6' },
  { label: '统计分析', path: '/app/stats', icon: 'chart', color: '#722ed1', bg: '#f9f0ff' }
]

function goTo(path) {
  router.push(path)
}

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  const days = ['4/10', '4/11', '4/12', '4/13', '4/14', '4/15', '4/16']
  const invoiceCounts = [186, 205, 178, 212, 195, 168, 142]
  const amounts = [5.2, 6.1, 4.8, 6.5, 5.8, 4.5, 3.9]

  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['开票数量', '开票金额(万元)'],
      top: 0,
      textStyle: { fontSize: 12, color: '#8c8c8c' }
    },
    grid: { left: 50, right: 50, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: days,
      axisLine: { lineStyle: { color: '#d9d9d9' } },
      axisLabel: { color: '#8c8c8c', fontSize: 12 }
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        nameTextStyle: { color: '#8c8c8c', fontSize: 11 },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLabel: { color: '#8c8c8c', fontSize: 12 }
      },
      {
        type: 'value',
        name: '万元',
        nameTextStyle: { color: '#8c8c8c', fontSize: 11 },
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#8c8c8c', fontSize: 12 }
      }
    ],
    series: [
      {
        name: '开票数量',
        type: 'bar',
        data: invoiceCounts,
        barWidth: 24,
        itemStyle: { color: '#1677ff', borderRadius: [4, 4, 0, 0] }
      },
      {
        name: '开票金额(万元)',
        type: 'line',
        yAxisIndex: 1,
        data: amounts,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#52c41a', width: 2 },
        itemStyle: { color: '#52c41a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82,196,26,0.15)' },
            { offset: 1, color: 'rgba(82,196,26,0)' }
          ])
        }
      }
    ]
  })
}

function handleResize() {
  chartInstance && chartInstance.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance && chartInstance.dispose()
})
</script>

<template>
  <div class="dashboard">
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <h2>重庆盛创普通科技有限公司</h2>
      <p>纳税人识别号：91500116MAEWH3TL90 · 欢迎使用电子发票服务平台</p>
    </div>

    <!-- Stat Cards -->
    <div class="stat-cards">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-icon" :style="{ background: s.bg, color: s.color }">
          <svg v-if="s.icon === 'receipt'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/></svg>
          <svg v-if="s.icon === 'money'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
          <svg v-if="s.icon === 'pending'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          <svg v-if="s.icon === 'cancel'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
        </div>
        <div class="stat-info">
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-value">{{ s.value }}</div>
          <div v-if="s.change" class="stat-change" :class="s.dir">
            {{ s.dir === 'up' ? '&#9650;' : '&#9660;' }} {{ s.change }}
          </div>
        </div>
      </div>
    </div>

    <!-- Chart + Quick Actions -->
    <div class="dashboard-row">
      <div class="chart-section card">
        <div class="card-title">近7日开票趋势</div>
        <div ref="chartRef" class="chart-box"></div>
      </div>
      <div class="actions-section card">
        <div class="card-title">快捷操作</div>
        <div class="quick-grid">
          <div
            v-for="a in quickActions"
            :key="a.path"
            class="quick-item"
            @click="goTo(a.path)"
          >
            <div class="quick-icon" :style="{ background: a.bg, color: a.color }">
              <svg v-if="a.icon === 'edit'" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              <svg v-if="a.icon === 'search'" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <svg v-if="a.icon === 'shield'" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              <svg v-if="a.icon === 'chart'" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
            </div>
            <span class="quick-label">{{ a.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.welcome-banner {
  background: linear-gradient(135deg, #1677ff 0%, #4096ff 100%);
  border-radius: 8px;
  padding: 28px 32px;
  color: #fff;
  margin-bottom: 16px;
}

.welcome-banner h2 {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.welcome-banner p {
  font-size: 13px;
  opacity: 0.85;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  display: flex;
  align-items: flex-start;
  gap: 16px;
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

.stat-info { flex: 1; }

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  color: #141414;
  line-height: 1.2;
}

.stat-change {
  font-size: 12px;
  margin-top: 4px;
  font-family: 'DM Sans', sans-serif;
}

.stat-change.up { color: #52c41a; }
.stat-change.down { color: #ff4d4f; }

.dashboard-row {
  display: flex;
  gap: 16px;
}

.chart-section {
  flex: 1;
  min-width: 0;
}

.chart-box {
  width: 100%;
  height: 320px;
}

.actions-section {
  width: 320px;
  flex-shrink: 0;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #f0f0f0;
}

.quick-item:hover {
  border-color: #1677ff;
  box-shadow: 0 2px 8px rgba(22,119,255,0.1);
  transform: translateY(-2px);
}

.quick-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-label {
  font-size: 13px;
  font-weight: 500;
  color: #434343;
}
</style>
