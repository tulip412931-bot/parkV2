<script setup>
import { ref, computed } from 'vue'
import { generateInvoices, fmt } from '@/composables/useInvoiceData'
import { showToast } from '@/composables/useToast'

const activeTab = ref('sales')
const allInvoices = ref(generateInvoices(86))

const filterType = ref('')
const filterStatus = ref('')
const searchText = ref('')
const dateFrom = ref('2025-04-01')
const dateTo = ref('2026-04-16')

const currentPage = ref(1)
const pageSize = 15

const filtered = computed(() => {
  return allInvoices.value.filter(inv => {
    if (filterType.value && !inv.product.includes(filterType.value === 'electronic' ? '服务' : filterType.value === 'special' ? '产品' : '')) {
      if (filterType.value !== 'all') return true
    }
    if (filterStatus.value) {
      if (filterStatus.value === 'normal' && inv.status !== '正常') return false
      if (filterStatus.value === 'void' && inv.status !== '已作废') return false
      if (filterStatus.value === 'red' && inv.status !== '已冲红') return false
    }
    if (searchText.value) {
      const s = searchText.value.toLowerCase()
      if (!inv.buyer.toLowerCase().includes(s) && !inv.num.includes(s) && !inv.code.includes(s)) return false
    }
    return true
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))
const pagedInvoices = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const cur = currentPage.value
  const range = 2
  for (let i = Math.max(1, cur - range); i <= Math.min(total, cur + range); i++) {
    pages.push(i)
  }
  return pages
})

function goPage(p) {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

function handleSearch() {
  currentPage.value = 1
  showToast('查询完成', 'success')
}

function handleExport() {
  showToast('导出成功，共导出 ' + filtered.value.length + ' 条记录', 'success')
}

// Detail modal
const showDetail = ref(false)
const detailInv = ref(null)

function viewDetail(inv) {
  detailInv.value = inv
  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
}

function downloadInv(inv) {
  showToast('发票 ' + inv.num + ' 下载中...', 'info')
}

function emailInv(inv) {
  showToast('已发送至客户邮箱', 'success')
}

function redInv(inv) {
  showToast('冲红申请已提交', 'success')
}

function badgeClass(status) {
  if (status === '正常') return 'badge badge-green'
  if (status === '已作废') return 'badge badge-red'
  return 'badge badge-orange'
}
</script>

<template>
  <div class="manage-page">
    <!-- Tabs -->
    <div class="tab-bar">
      <div class="tab-item" :class="{ active: activeTab === 'sales' }" @click="activeTab = 'sales'">销项发票</div>
      <div class="tab-item" :class="{ active: activeTab === 'purchase' }" @click="activeTab = 'purchase'">进项发票</div>
    </div>

    <!-- Filter Bar -->
    <div class="card">
      <div class="filter-bar">
        <input v-model="dateFrom" type="date" class="form-input" style="width:140px" />
        <span style="color:#8c8c8c">至</span>
        <input v-model="dateTo" type="date" class="form-input" style="width:140px" />
        <select v-model="filterType" class="form-select" style="width:150px">
          <option value="">全部类型</option>
          <option value="electronic">电子普票</option>
          <option value="special">电子专票</option>
          <option value="full">全电发票</option>
        </select>
        <select v-model="filterStatus" class="form-select" style="width:120px">
          <option value="">全部状态</option>
          <option value="normal">正常</option>
          <option value="void">已作废</option>
          <option value="red">已冲红</option>
        </select>
        <input v-model="searchText" type="text" class="form-input" placeholder="发票号码/购买方" style="width:200px" />
        <button class="btn btn-primary" @click="handleSearch">查询</button>
        <button class="btn" @click="handleExport">导出</button>
      </div>

      <!-- Data Table -->
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>发票代码</th>
              <th>发票号码</th>
              <th>开票日期</th>
              <th>购买方</th>
              <th>金额</th>
              <th>税额</th>
              <th>价税合计</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in pagedInvoices" :key="inv.id">
              <td class="col-num">{{ inv.code }}</td>
              <td class="col-num">{{ inv.num }}</td>
              <td>{{ inv.date }}</td>
              <td>{{ inv.buyer }}</td>
              <td class="col-num">{{ fmt(inv.amount) }}</td>
              <td class="col-num">{{ fmt(inv.tax) }}</td>
              <td class="col-num" style="font-weight:600">{{ fmt(inv.total) }}</td>
              <td><span :class="badgeClass(inv.status)">{{ inv.status }}</span></td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm" @click="viewDetail(inv)">查看</button>
                  <button class="btn btn-sm" @click="downloadInv(inv)">下载</button>
                  <button class="btn btn-sm" @click="emailInv(inv)">邮件</button>
                  <button v-if="inv.status === '正常'" class="btn btn-sm" style="color:#ff4d4f" @click="redInv(inv)">冲红</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <span>共 {{ filtered.length }} 条</span>
        <div class="page-list">
          <button class="page-btn" :disabled="currentPage === 1" @click="goPage(currentPage - 1)">&lt;</button>
          <button
            v-for="p in displayPages"
            :key="p"
            class="page-btn"
            :class="{ active: p === currentPage }"
            @click="goPage(p)"
          >{{ p }}</button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="goPage(currentPage + 1)">&gt;</button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="showDetail && detailInv" class="modal-overlay" @click.self="closeDetail">
        <div class="detail-modal">
          <div class="modal-header">
            <h3>发票详情</h3>
            <button class="modal-close" @click="closeDetail">&times;</button>
          </div>
          <div class="modal-body">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">发票代码</span>
                <span class="detail-value">{{ detailInv.code }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">发票号码</span>
                <span class="detail-value">{{ detailInv.num }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">开票日期</span>
                <span class="detail-value">{{ detailInv.date }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">状态</span>
                <span :class="badgeClass(detailInv.status)">{{ detailInv.status }}</span>
              </div>
              <div class="detail-item full">
                <span class="detail-label">购买方</span>
                <span class="detail-value">{{ detailInv.buyer }}</span>
              </div>
              <div class="detail-item full">
                <span class="detail-label">商品名称</span>
                <span class="detail-value">{{ detailInv.product }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">数量</span>
                <span class="detail-value">{{ detailInv.qty }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">单价</span>
                <span class="detail-value">{{ fmt(detailInv.unitPrice) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">金额</span>
                <span class="detail-value">{{ fmt(detailInv.amount) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">税率</span>
                <span class="detail-value">{{ detailInv.rate }}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">税额</span>
                <span class="detail-value">{{ fmt(detailInv.tax) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">价税合计</span>
                <span class="detail-value" style="color:#ff4d4f;font-weight:700;font-size:16px">{{ fmt(detailInv.total) }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn" @click="downloadInv(detailInv)">下载</button>
            <button class="btn btn-primary" @click="closeDetail">关闭</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.manage-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.col-num {
  font-family: 'DM Sans', sans-serif;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.detail-modal {
  background: #fff;
  border-radius: 12px;
  width: 600px;
  max-width: 92vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  animation: slideUp 0.25s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: 20px;
  color: #8c8c8c;
  cursor: pointer;
  border-radius: 6px;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #141414;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.full {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 12px;
  color: #8c8c8c;
}

.detail-value {
  font-size: 14px;
  color: #141414;
  font-weight: 500;
}
</style>
