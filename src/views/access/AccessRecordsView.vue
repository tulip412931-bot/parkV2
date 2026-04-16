<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { COMPANIES_IN_PARK, generateAccessRecords, fmt } from '@/composables/useDemoData'
import { useToast } from '@/composables/useToast'
import * as echarts from 'echarts'

const { showToast } = useToast()

const activeTab = ref('通行记录')
const mainTabs = ['通行记录', '统计报表', '异常预警']

// ===================== Tab 1: Access Records =====================
const allRecords = ref(generateAccessRecords(200))

const recFilterDateFrom = ref('')
const recFilterDateTo = ref('')
const recFilterType = ref('')
const recFilterGate = ref('')
const recFilterResult = ref('')
const recSearchText = ref('')
const recPage = ref(1)
const recPageSize = 20

function recDoSearch() { recPage.value = 1 }

const filteredRecords = computed(() => {
  let list = allRecords.value
  if (recFilterType.value) list = list.filter(r => r.type === recFilterType.value)
  if (recFilterGate.value) list = list.filter(r => r.gate === recFilterGate.value)
  if (recFilterResult.value) list = list.filter(r => r.result === recFilterResult.value)
  if (recFilterDateFrom.value) list = list.filter(r => r.time >= recFilterDateFrom.value)
  if (recFilterDateTo.value) list = list.filter(r => r.time.slice(0, 10) <= recFilterDateTo.value)
  if (recSearchText.value.trim()) {
    const q = recSearchText.value.trim().toLowerCase()
    list = list.filter(r => r.personName.includes(q) || r.company.toLowerCase().includes(q))
  }
  return list
})

const recTotalPages = computed(() => Math.max(1, Math.ceil(filteredRecords.value.length / recPageSize)))
const pagedRecords = computed(() => {
  const start = (recPage.value - 1) * recPageSize
  return filteredRecords.value.slice(start, start + recPageSize)
})

function recVisiblePages() {
  const total = recTotalPages.value
  const cur = recPage.value
  const pages = []
  for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) pages.push(i)
  return pages
}

function typeBadge(type) {
  return type === '员工' ? 'badge badge-blue' : 'badge badge-orange'
}
function resultBadge(result) {
  return result === '通过' ? 'badge badge-green' : 'badge badge-red'
}

function handleExport() {
  showToast('通行记录导出成功', 'success')
}

// ===================== Tab 2: Statistics =====================
const statCards = [
  { label: '今日通行', value: '342', unit: '人次', color: '#2563eb' },
  { label: '本月通行', value: '8,652', unit: '人次', color: '#7c3aed' },
  { label: '访客到访', value: '486', unit: '人次', color: '#059669' },
  { label: '异常次数', value: '12', unit: '次', color: '#dc2626' }
]

let lineChart = null
let barChart = null
const lineChartRef = ref(null)
const barChartRef = ref(null)

function initCharts() {
  nextTick(() => {
    if (lineChartRef.value && !lineChart) {
      lineChart = echarts.init(lineChartRef.value)
      lineChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['员工', '访客'], bottom: 0 },
        grid: { top: 20, right: 20, bottom: 40, left: 50 },
        xAxis: { type: 'category', data: ['4/10', '4/11', '4/12', '4/13', '4/14', '4/15', '4/16'], boundaryGap: false },
        yAxis: { type: 'value' },
        series: [
          { name: '员工', type: 'line', smooth: true, data: [260, 290, 275, 320, 340, 165, 220], areaStyle: { opacity: 0.1 }, color: '#2563eb' },
          { name: '访客', type: 'line', smooth: true, data: [45, 62, 38, 56, 72, 28, 35], areaStyle: { opacity: 0.1 }, color: '#d97706' }
        ]
      })
    }
    if (barChartRef.value && !barChart) {
      barChart = echarts.init(barChartRef.value)
      const companies = COMPANIES_IN_PARK.map(c => c.name.replace(/有限公司$/, ''))
      const values = [186, 142, 98, 167, 125, 78, 112, 64]
      barChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { top: 10, right: 20, bottom: 10, left: 140, containLabel: false },
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: companies, inverse: true, axisLabel: { fontSize: 11 } },
        series: [{ type: 'bar', data: values, barWidth: 18, itemStyle: { borderRadius: [0, 4, 4, 0], color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#2563eb' }, { offset: 1, color: '#3b82f6' }]) } }]
      })
    }
  })
}

function handleResize() {
  lineChart?.resize()
  barChart?.resize()
}

watch(activeTab, (val) => {
  if (val === '统计报表') {
    nextTick(() => initCharts())
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  if (activeTab.value === '统计报表') initCharts()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  lineChart?.dispose()
  barChart?.dispose()
})

// ===================== Tab 3: Alerts =====================
const alerts = ref([
  { id: 1, time: '2026-04-16 14:23:15', type: '无权限通行尝试', location: '东门3号闸机', desc: '未授权人员尝试刷卡进入，已拦截', status: '已处理' },
  { id: 2, time: '2026-04-16 11:08:42', type: '门禁设备离线', location: '西门1号闸机', desc: '设备通信中断超过5分钟，疑似网络故障', status: '待处理' },
  { id: 3, time: '2026-04-16 09:35:20', type: '访客核销异常', location: '南门访客通道', desc: '访客二维码重复核销，可能存在转借行为', status: '待处理' },
  { id: 4, time: '2026-04-15 17:42:33', type: '尾随报警', location: '北门2号闸机', desc: '红外检测到单次刷卡多人通过', status: '已处理' },
  { id: 5, time: '2026-04-15 15:18:07', type: '强行闯入', location: '东门1号闸机', desc: '闸机未开启状态下检测到强行通过行为', status: '已处理' },
  { id: 6, time: '2026-04-15 10:22:51', type: '门禁设备离线', location: '南门2号闸机', desc: '设备断电，已通知维修人员', status: '已处理' },
  { id: 7, time: '2026-04-14 16:55:19', type: '无权限通行尝试', location: '西门2号闸机', desc: '已注销员工卡片尝试进入，已拦截', status: '待处理' },
  { id: 8, time: '2026-04-14 08:30:44', type: '尾随报警', location: '东门2号闸机', desc: '连续两次检测到尾随通行', status: '待处理' }
])

function alertTypeBadge(type) {
  if (type === '强行闯入' || type === '无权限通行尝试') return 'badge badge-red'
  return 'badge badge-orange'
}
function alertStatusBadge(status) {
  return status === '已处理' ? 'badge badge-green' : 'badge badge-orange'
}
function handleAlert(alert) {
  alert.status = '已处理'
  showToast(`预警「${alert.type}」已处理`, 'success')
}
</script>

<template>
  <div class="page-view">
    <div class="page-header">
      <h2 class="page-title">门禁记录与统计</h2>
      <p class="page-subtitle">查看通行记录、统计报表与异常预警</p>
    </div>

    <div class="tabs">
      <div v-for="tab in mainTabs" :key="tab" class="tab-item" :class="{ active: activeTab === tab }" @click="activeTab = tab">{{ tab }}</div>
    </div>

    <!-- Tab 1: Records -->
    <div v-if="activeTab === '通行记录'" class="card">
      <div class="filter-bar">
        <input type="date" v-model="recFilterDateFrom" class="form-input" style="min-width:140px" />
        <span class="text-gray">至</span>
        <input type="date" v-model="recFilterDateTo" class="form-input" style="min-width:140px" />
        <select v-model="recFilterType" class="form-select">
          <option value="">全部类型</option>
          <option value="员工">员工</option>
          <option value="访客">访客</option>
        </select>
        <select v-model="recFilterGate" class="form-select">
          <option value="">全部门岗</option>
          <option value="东门">东门</option>
          <option value="西门">西门</option>
          <option value="南门">南门</option>
          <option value="北门">北门</option>
        </select>
        <select v-model="recFilterResult" class="form-select">
          <option value="">全部结果</option>
          <option value="通过">通过</option>
          <option value="拒绝">拒绝</option>
        </select>
        <input v-model="recSearchText" class="form-input" placeholder="搜索姓名/企业" style="min-width:180px" @keyup.enter="recDoSearch" />
        <div class="filter-actions">
          <button class="btn btn-primary" @click="recDoSearch">查询</button>
          <button class="btn btn-default" @click="handleExport">导出</button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>姓名</th>
              <th>类型</th>
              <th>所属企业</th>
              <th>通行门岗</th>
              <th>核验方式</th>
              <th>结果</th>
              <th>原因</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in pagedRecords" :key="r.id">
              <td class="font-num text-sm">{{ r.time }}</td>
              <td class="font-medium">{{ r.personName }}</td>
              <td><span :class="typeBadge(r.type)">{{ r.type }}</span></td>
              <td class="truncate" style="max-width:160px">{{ r.company }}</td>
              <td>{{ r.gate }}</td>
              <td>{{ r.method }}</td>
              <td><span :class="resultBadge(r.result)">{{ r.result }}</span></td>
              <td class="text-gray">{{ r.reason || '-' }}</td>
            </tr>
            <tr v-if="pagedRecords.length === 0">
              <td colspan="8" class="table-empty">暂无匹配的通行记录</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination-info">共 {{ filteredRecords.length }} 条记录，第 {{ recPage }} / {{ recTotalPages }} 页</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="recPage <= 1" @click="recPage--">&lt;</button>
          <button v-for="p in recVisiblePages()" :key="p" class="pagination-btn" :class="{ active: p === recPage }" @click="recPage = p">{{ p }}</button>
          <button class="pagination-btn" :disabled="recPage >= recTotalPages" @click="recPage++">&gt;</button>
        </div>
      </div>
    </div>

    <!-- Tab 2: Statistics -->
    <div v-if="activeTab === '统计报表'">
      <div class="stats-grid mb-3">
        <div v-for="s in statCards" :key="s.label" class="stat-card">
          <div class="stat-card-icon" :style="{ background: s.color + '15', color: s.color }">
            <span style="font-size:22px">&#9679;</span>
          </div>
          <div class="stat-card-content">
            <div class="stat-card-label">{{ s.label }}</div>
            <div class="stat-card-value">{{ s.value }}<span class="stat-card-unit">{{ s.unit }}</span></div>
          </div>
        </div>
      </div>
      <div class="chart-grid mb-3">
        <div class="chart-card">
          <div class="chart-card-header"><span class="chart-card-title">近7日通行趋势</span></div>
          <div ref="lineChartRef" class="chart-box"></div>
        </div>
        <div class="chart-card">
          <div class="chart-card-header"><span class="chart-card-title">各企业通行量</span></div>
          <div ref="barChartRef" class="chart-box"></div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Alerts -->
    <div v-if="activeTab === '异常预警'" class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>预警时间</th>
              <th>预警类型</th>
              <th>位置</th>
              <th>描述</th>
              <th>处理状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in alerts" :key="a.id">
              <td class="font-num text-sm">{{ a.time }}</td>
              <td><span :class="alertTypeBadge(a.type)">{{ a.type }}</span></td>
              <td>{{ a.location }}</td>
              <td style="max-width:280px">{{ a.desc }}</td>
              <td><span :class="alertStatusBadge(a.status)">{{ a.status }}</span></td>
              <td>
                <div class="table-actions">
                  <button v-if="a.status === '待处理'" class="btn btn-text btn-sm" @click="handleAlert(a)">处理</button>
                  <button class="btn btn-text btn-sm">查看</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-view { max-width: 1400px; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
</style>
