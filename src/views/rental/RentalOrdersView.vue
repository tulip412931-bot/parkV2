<script setup>
import { ref, computed } from 'vue'
import { generateOrders, fmt } from '@/composables/useDemoData'
import ModalOverlay from '@/components/ModalOverlay.vue'

const allData = generateOrders(38)

const filters = ref({
  dateStart: '',
  dateEnd: '',
  type: '',
  status: '',
  search: ''
})
const currentPage = ref(1)
const pageSize = 12

function doSearch() {
  currentPage.value = 1
}

function handleExport() {
  alert('导出功能开发中')
}

const filtered = computed(() => {
  return allData.filter(row => {
    if (filters.value.type && row.type !== filters.value.type) return false
    if (filters.value.status && row.status !== filters.value.status) return false
    if (filters.value.dateStart && row.startDate < filters.value.dateStart) return false
    if (filters.value.dateEnd && row.startDate > filters.value.dateEnd) return false
    if (filters.value.search) {
      const s = filters.value.search.toLowerCase()
      if (!row.orderNo.toLowerCase().includes(s) && !row.client.toLowerCase().includes(s) && !row.property.toLowerCase().includes(s)) return false
    }
    return true
  })
})

const totalCount = computed(() => filtered.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const cur = currentPage.value
  let s = Math.max(1, cur - 2)
  let e = Math.min(total, s + 4)
  s = Math.max(1, e - 4)
  for (let i = s; i <= e; i++) pages.push(i)
  return pages
})

const summaryTotal = computed(() => filtered.value.reduce((sum, r) => sum + r.contractAmount, 0))
const summaryDeposit = computed(() => filtered.value.reduce((sum, r) => sum + r.deposit, 0))
const summaryPending = computed(() => summaryTotal.value - summaryDeposit.value)

function typeBadge(type) {
  return type === '租赁' ? 'badge-blue' : 'badge-purple'
}

function statusBadge(status) {
  if (status === '待签约') return 'badge-orange'
  if (status === '已签约') return 'badge-green'
  if (status === '已履约') return 'badge-blue'
  if (status === '已解约') return 'badge-red'
  return 'badge-gray'
}

// Detail modal
const showDetail = ref(false)
const detailOrder = ref(null)

function openDetail(row) {
  detailOrder.value = row
  showDetail.value = true
}
</script>

<template>
  <div style="max-width:1400px">
    <div class="card">
      <div class="card-header">
        <div class="card-title">租售订单管理</div>
        <button class="btn btn-primary">新增订单</button>
      </div>

      <div class="filter-bar">
        <input v-model="filters.dateStart" type="date" class="form-input" style="width:150px;min-width:auto" />
        <span style="color:#9ca3af">至</span>
        <input v-model="filters.dateEnd" type="date" class="form-input" style="width:150px;min-width:auto" />
        <select v-model="filters.type" class="form-select">
          <option value="">全部类型</option>
          <option value="租赁">租赁</option>
          <option value="出售">出售</option>
        </select>
        <select v-model="filters.status" class="form-select">
          <option value="">全部状态</option>
          <option value="待签约">待签约</option>
          <option value="已签约">已签约</option>
          <option value="已履约">已履约</option>
          <option value="已解约">已解约</option>
        </select>
        <input v-model="filters.search" class="form-input" placeholder="搜索订单/客户/房源" style="min-width:180px" />
        <div class="flex gap-1">
          <button class="btn btn-primary" @click="doSearch">查询</button>
          <button class="btn btn-default" @click="handleExport">导出</button>
        </div>
      </div>

      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>订单编号</th>
              <th>关联房源</th>
              <th>客户名称</th>
              <th>业务类型</th>
              <th>合同金额</th>
              <th>定金</th>
              <th>起止日期</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedData" :key="row.id">
              <td class="font-semibold">{{ row.orderNo }}</td>
              <td>{{ row.property }}</td>
              <td class="truncate" style="max-width:180px">{{ row.client }}</td>
              <td><span class="badge" :class="typeBadge(row.type)">{{ row.type }}</span></td>
              <td class="font-num">¥{{ fmt(row.contractAmount) }}</td>
              <td class="font-num">¥{{ fmt(row.deposit) }}</td>
              <td>{{ row.startDate }}{{ row.endDate ? ' ~ ' + row.endDate : '' }}</td>
              <td><span class="badge" :class="statusBadge(row.status)">{{ row.status }}</span></td>
              <td>
                <div class="flex gap-1">
                  <button v-if="row.status === '待签约'" class="btn btn-text btn-sm">签约</button>
                  <button class="btn btn-text btn-sm" @click="openDetail(row)">查看</button>
                  <button class="btn btn-text btn-sm">收款</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="summary-row">
        <div class="summary-item">
          <span class="summary-label">合同总额</span>
          <span class="summary-value">¥{{ fmt(summaryTotal) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">已收定金</span>
          <span class="summary-value">¥{{ fmt(summaryDeposit) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">待收款</span>
          <span class="summary-value" style="color:var(--danger)">¥{{ fmt(summaryPending) }}</span>
        </div>
      </div>

      <div class="pagination">
        <div class="pagination-info">共 {{ totalCount }} 条</div>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="currentPage--">&lsaquo;</button>
          <button v-for="p in visiblePages" :key="p" class="pagination-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="currentPage++">&rsaquo;</button>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <ModalOverlay :show="showDetail" @close="showDetail = false">
      <div class="modal modal-lg" v-if="detailOrder">
        <div class="modal-header">
          <div class="modal-title">订单详情 - {{ detailOrder.orderNo }}</div>
          <button class="modal-close" @click="showDetail = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">订单编号</label>
              <div class="form-input" style="background:var(--gray-50);border-color:transparent">{{ detailOrder.orderNo }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">关联房源</label>
              <div class="form-input" style="background:var(--gray-50);border-color:transparent">{{ detailOrder.property }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">客户名称</label>
              <div class="form-input" style="background:var(--gray-50);border-color:transparent">{{ detailOrder.client }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">业务类型</label>
              <div class="form-input" style="background:var(--gray-50);border-color:transparent">
                <span class="badge" :class="typeBadge(detailOrder.type)">{{ detailOrder.type }}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">合同金额</label>
              <div class="form-input" style="background:var(--gray-50);border-color:transparent">¥{{ fmt(detailOrder.contractAmount) }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">定金</label>
              <div class="form-input" style="background:var(--gray-50);border-color:transparent">¥{{ fmt(detailOrder.deposit) }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">起始日期</label>
              <div class="form-input" style="background:var(--gray-50);border-color:transparent">{{ detailOrder.startDate }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">结束日期</label>
              <div class="form-input" style="background:var(--gray-50);border-color:transparent">{{ detailOrder.endDate || '—' }}</div>
            </div>
            <div class="form-group">
              <label class="form-label">状态</label>
              <div class="form-input" style="background:var(--gray-50);border-color:transparent">
                <span class="badge" :class="statusBadge(detailOrder.status)">{{ detailOrder.status }}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">创建时间</label>
              <div class="form-input" style="background:var(--gray-50);border-color:transparent">{{ detailOrder.createTime }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showDetail = false">关闭</button>
        </div>
      </div>
    </ModalOverlay>
  </div>
</template>

<style scoped>
</style>
