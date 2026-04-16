<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

/* Progress cards */
const progressCards = [
  { title: '年度目标', current: 36, target: 50, unit: '套', pct: 72, color: '#2563eb', gradient: 'linear-gradient(90deg, #3b82f6, #2563eb)' },
  { title: '本月线索', current: 28, target: 20, unit: '条', pct: 140, color: '#16a34a', note: '超额完成' },
  { title: '转化率', current: 38.6, target: 35, unit: '%', pct: 110, color: '#16a34a', note: '已达标' }
]

/* Kanban columns */
const kanbanCols = [
  {
    title: '待租', count: 15, color: '#6b7280', bg: '#f3f4f6',
    items: [
      { code: 'KH-A-302', area: '280㎡', client: '', days: 12 },
      { code: 'KH-B-105', area: '150㎡', client: '', days: 25 },
      { code: 'KH-C-401', area: '520㎡', client: '', days: 35 },
      { code: 'KH-D-203', area: '180㎡', client: '', days: 8 }
    ]
  },
  {
    title: '洽谈中', count: 8, color: '#2563eb', bg: '#eff6ff',
    items: [
      { code: 'KH-A-501', area: '350㎡', client: '重庆博创智能', days: 5 },
      { code: 'KH-B-308', area: '200㎡', client: '成都天宇信息', days: 8 },
      { code: 'KH-C-102', area: '420㎡', client: '深圳前海云端', days: 3 }
    ]
  },
  {
    title: '待签约', count: 4, color: '#ea580c', bg: '#fff7ed',
    items: [
      { code: 'KH-A-205', area: '300㎡', client: '北京中科创新', days: 2 },
      { code: 'KH-D-106', area: '160㎡', client: '上海盛泰金融', days: 4 },
      { code: 'KH-B-402', area: '280㎡', client: '广州粤海电商', days: 1 }
    ]
  },
  {
    title: '已签约', count: 36, color: '#16a34a', bg: '#f0fdf4',
    items: [
      { code: 'KH-A-301', area: '450㎡', client: '重庆星辰科技', days: 0 },
      { code: 'KH-B-201', area: '320㎡', client: '四川云图数据', days: 0 },
      { code: 'KH-C-103', area: '280㎡', client: '重庆智远物联', days: 0 },
      { code: 'KH-D-501', area: '500㎡', client: '成都蓝海软件', days: 0 }
    ]
  }
]

/* Warning alerts */
const alerts = [
  { text: 'C栋3层 已超30天未成交', level: 'warning' },
  { text: 'B栋1层 已超25天未成交，建议调整策略', level: 'warning' },
  { text: 'D栋2层 客户跟进超期，请尽快联系', level: 'info' }
]

/* ECharts */
const chartRef = ref(null)
let chartInstance = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['目标', '实际'], top: 4 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月'] },
    yAxis: { type: 'value', name: '套' },
    series: [
      { name: '目标', type: 'bar', data: [12, 12, 13, 13], itemStyle: { color: '#bfdbfe', borderRadius: [4, 4, 0, 0] } },
      { name: '实际', type: 'bar', data: [10, 11, 9, 6], itemStyle: { color: '#2563eb', borderRadius: [4, 4, 0, 0] } }
    ]
  })
}

function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  nextTick(initChart)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<template>
  <div class="page-view">
    <div class="card">
      <h3 class="card-title" style="margin-bottom:20px">招商进度管理</h3>

      <!-- Progress cards -->
      <div class="progress-cards">
        <div v-for="(pc, i) in progressCards" :key="i" class="progress-card">
          <div class="pc-header">
            <span class="pc-title">{{ pc.title }}</span>
            <span v-if="pc.note" class="pc-note" :style="{ color: pc.color }">{{ pc.note }}</span>
          </div>
          <div class="pc-value">
            <span class="pc-current" :style="{ color: pc.color }">{{ pc.current }}</span>
            <span class="pc-target">/ {{ pc.target }}{{ pc.unit }}</span>
          </div>
          <div class="pc-bar-bg">
            <div class="pc-bar-fill" :style="{ width: Math.min(pc.pct, 100) + '%', background: pc.gradient || pc.color }"></div>
          </div>
          <div class="pc-pct">{{ pc.pct }}%</div>
        </div>
      </div>
    </div>

    <!-- Kanban board -->
    <div class="card" style="margin-top:20px">
      <h3 class="card-title" style="margin-bottom:16px">招商看板</h3>
      <div class="kanban-scroll">
        <div class="kanban-board">
          <div v-for="col in kanbanCols" :key="col.title" class="kanban-col">
            <div class="kanban-col-header" :style="{ background: col.bg, borderLeftColor: col.color }">
              <span class="kanban-col-title" :style="{ color: col.color }">{{ col.title }}</span>
              <span class="kanban-count-badge" :style="{ background: col.color }">{{ col.count }}</span>
            </div>
            <div class="kanban-col-body">
              <div v-for="(item, idx) in col.items" :key="idx" class="kanban-item">
                <div class="ki-top">
                  <span class="ki-code">{{ item.code }}</span>
                  <span class="ki-area">{{ item.area }}</span>
                </div>
                <div v-if="item.client" class="ki-client">{{ item.client }}</div>
                <div class="ki-days" v-if="item.days > 0">{{ item.days }}天</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly chart -->
    <div class="card" style="margin-top:20px">
      <h3 class="card-title" style="margin-bottom:16px">各月招商完成情况</h3>
      <div ref="chartRef" class="chart-box"></div>
    </div>

    <!-- Warning alerts -->
    <div class="card" style="margin-top:20px">
      <h3 class="card-title" style="margin-bottom:12px">预警提醒</h3>
      <div class="alert-list">
        <div v-for="(a, i) in alerts" :key="i" class="alert-item" :class="a.level">
          <span class="alert-dot"></span>
          {{ a.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-view { max-width: 1400px; }
.progress-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.progress-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 18px;
}
.pc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.pc-title { font-size: 14px; font-weight: 600; color: #374151; }
.pc-note { font-size: 12px; font-weight: 600; }
.pc-value { margin-bottom: 10px; }
.pc-current { font-size: 28px; font-weight: 800; }
.pc-target { font-size: 14px; color: #6b7280; margin-left: 4px; }
.pc-bar-bg { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
.pc-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
.pc-pct { font-size: 12px; color: #6b7280; margin-top: 4px; text-align: right; }

.kanban-scroll { overflow-x: auto; }
.kanban-board { display: flex; gap: 14px; min-width: 900px; }
.kanban-col { flex: 1; min-width: 210px; }
.kanban-col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px 8px 0 0;
  border-left: 3px solid;
}
.kanban-col-title { font-size: 14px; font-weight: 700; }
.kanban-count-badge {
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
}
.kanban-col-body {
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 120px;
}
.kanban-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px 12px;
}
.ki-top { display: flex; justify-content: space-between; align-items: center; }
.ki-code { font-weight: 700; font-size: 13px; color: #111827; }
.ki-area { font-size: 12px; color: #6b7280; }
.ki-client { font-size: 12px; color: #2563eb; margin-top: 4px; }
.ki-days { font-size: 11px; color: #9ca3af; margin-top: 4px; }

.alert-list { display: flex; flex-direction: column; gap: 8px; }
.alert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 13px;
}
.alert-item.warning { background: #fff7ed; color: #c2410c; }
.alert-item.info { background: #eff6ff; color: #1d4ed8; }
.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.alert-item.warning .alert-dot { background: #f97316; }
.alert-item.info .alert-dot { background: #3b82f6; }

@media (max-width: 768px) {
  .progress-cards { grid-template-columns: 1fr; }
}
</style>
