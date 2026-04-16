<script setup>
import { ref, computed } from 'vue'

const filterYear = ref('2025')
const filterMonth = ref('06')
const filterProject = ref('')
const filterBuilding = ref('')
const currentPage = ref(1)
const pageSize = 10

const summaryData = { total: '¥156,800.00', cumulative: '¥1,245,600.00', reduction: '¥3,200.00' }

const buildings = ['1栋','2栋','3栋','4栋','5栋']
const projects = ['物业费','水费','电费','停车费','空调费']
const statuses = ['已出账', '待确认', '已减免']
const customers = ['重庆智联科技','鼎盛机械','华创电子','朗讯通信','博雅装饰','天宇物流','星辰广告','锐达信息','嘉和贸易','中天建设',
  '远航科技','盛世文化','金桥投资','鸿运商贸','蓝海网络','创新材料','宏图置业','卓越教育','汇丰实业','恒达电气',
  '明德咨询','新世纪传媒','正源环保','瑞丰食品','同方科技','东方物业','安信保险','利达工贸','佳诚科技','永盛实业',
  '龙翔电子','旭日能源','华美装饰','中科信息','天成地产','国盛证券','融信金融','绿洲农业','长虹电器','康达医药']

const allData = Array.from({ length: 40 }, (_, i) => {
  const bld = buildings[i % 5]
  const floor = Math.floor(i / 5) + 1
  const room = `${bld}-${floor}${String((i % 4) + 1).padStart(2, '0')}`
  const proj = projects[i % 5]
  const area = (50 + Math.random() * 200).toFixed(2)
  const amount = (parseFloat(area) * (proj === '物业费' ? 4.5 : proj === '电费' ? 1.2 : proj === '水费' ? 0.8 : proj === '停车费' ? 3.0 : 2.5)).toFixed(2)
  return {
    id: i + 1, room, customer: customers[i], project: proj, area,
    amount, period: `2025-06-01 ~ 2025-06-30`,
    status: statuses[i % 3]
  }
})

const filteredData = computed(() => {
  return allData.filter(r => {
    if (filterProject.value && r.project !== filterProject.value) return false
    if (filterBuilding.value && !r.room.startsWith(filterBuilding.value)) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize))
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})
const showStart = computed(() => (currentPage.value - 1) * pageSize + 1)
const showEnd = computed(() => Math.min(currentPage.value * pageSize, filteredData.value.length))

function statusBadge(s) {
  if (s === '已出账') return 'badge-blue'
  if (s === '待确认') return 'badge-orange'
  return 'badge-gray'
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">应收月度统计</h1>
      <p class="page-subtitle">财务管理 - 月度应收账单明细</p>
    </div>

    <div class="filter-bar">
      <input v-model="filterYear" type="number" min="2020" max="2030" class="form-input" style="width:90px" />
      <span class="text-gray">年</span>
      <select v-model="filterMonth" class="form-select" style="min-width:80px">
        <option v-for="m in 12" :key="m" :value="String(m).padStart(2,'0')">{{ m }}月</option>
      </select>
      <select v-model="filterProject" class="form-select">
        <option value="">全部收费项目</option>
        <option v-for="p in projects" :key="p">{{ p }}</option>
      </select>
      <select v-model="filterBuilding" class="form-select">
        <option value="">全部楼宇</option>
        <option v-for="b in buildings" :key="b">{{ b }}</option>
      </select>
      <div class="filter-actions">
        <button class="btn btn-primary">查询</button>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-icon" style="background:var(--primary-bg);color:var(--primary)">¥</div>
        <div class="stat-card-content">
          <div class="stat-card-label">本月应收总额</div>
          <div class="stat-card-value font-num">{{ summaryData.total }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:var(--success-bg);color:var(--success)">Σ</div>
        <div class="stat-card-content">
          <div class="stat-card-label">累计应收</div>
          <div class="stat-card-value font-num">{{ summaryData.cumulative }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:var(--warning-bg);color:var(--warning)">-</div>
        <div class="stat-card-content">
          <div class="stat-card-label">减免金额</div>
          <div class="stat-card-value font-num">{{ summaryData.reduction }}</div>
        </div>
      </div>
    </div>

    <div class="data-table-card">
      <div class="data-table-header">
        <div><span class="data-table-title">应收明细</span><span class="data-table-count">共 {{ filteredData.length }} 条</span></div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>房号</th><th>客户名称</th><th>收费项目</th><th>计费面积(㎡)</th><th>应收金额</th><th>账单周期</th><th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedData" :key="row.id">
              <td class="font-medium">{{ row.room }}</td>
              <td>{{ row.customer }}</td>
              <td><span class="tag">{{ row.project }}</span></td>
              <td class="font-num">{{ row.area }}</td>
              <td class="font-num font-semibold">¥{{ parseFloat(row.amount).toLocaleString() }}</td>
              <td class="text-gray text-sm">{{ row.period }}</td>
              <td><span class="badge" :class="statusBadge(row.status)">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="data-table-footer">
        <div class="pagination">
          <div class="pagination-info">显示 {{ showStart }}-{{ showEnd }} 条，共 {{ filteredData.length }} 条</div>
          <div class="pagination-controls">
            <button class="pagination-btn" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
            <button v-for="p in totalPages" :key="p" class="pagination-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
            <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card-icon {
  width: 48px; height: 48px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 700; flex-shrink: 0;
}
</style>
