<script setup>
import { ref, computed } from 'vue'
import { generateIntentions } from '@/composables/useDemoData'
import { useToast } from '@/composables/useToast'
import ModalOverlay from '@/components/ModalOverlay.vue'

const { showToast } = useToast()
const allData = generateIntentions(45)

const filters = ref({
  dateStart: '',
  dateEnd: '',
  level: '',
  status: '',
  search: ''
})
const currentPage = ref(1)
const pageSize = 15

function doSearch() {
  currentPage.value = 1
}

const filtered = computed(() => {
  return allData.filter(row => {
    if (filters.value.level && row.level !== filters.value.level) return false
    if (filters.value.status && row.status !== filters.value.status) return false
    if (filters.value.dateStart && row.visitDate < filters.value.dateStart) return false
    if (filters.value.dateEnd && row.visitDate > filters.value.dateEnd) return false
    if (filters.value.search) {
      const s = filters.value.search.toLowerCase()
      if (!row.clientName.includes(s) && !row.phone.includes(s) && !row.targetProperty.toLowerCase().includes(s)) return false
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

function levelBadge(level) {
  if (level === '高') return 'badge-red'
  if (level === '中') return 'badge-orange'
  return 'badge-gray'
}

function statusBadge(status) {
  if (status === '新线索') return 'badge-blue'
  if (status === '跟进中') return 'badge-orange'
  if (status === '已签约') return 'badge-green'
  if (status === '已放弃') return 'badge-gray'
  return 'badge-gray'
}

// Follow-up modal
const showFollowUp = ref(false)
const followUpTarget = ref(null)
const followUpForm = ref({
  content: '',
  nextDate: '',
  level: ''
})

function openFollowUp(row) {
  followUpTarget.value = row
  followUpForm.value = { content: '', nextDate: '', level: row.level }
  showFollowUp.value = true
}

function saveFollowUp() {
  if (!followUpForm.value.content) {
    showToast('请输入跟进内容', 'warning')
    return
  }
  if (followUpTarget.value) {
    followUpTarget.value.level = followUpForm.value.level
    followUpTarget.value.status = '跟进中'
  }
  showFollowUp.value = false
  showToast('跟进记录保存成功', 'success')
}
</script>

<template>
  <div style="max-width:1400px">
    <div class="card">
      <div class="card-header">
        <div class="card-title">租售意向管理</div>
        <button class="btn btn-primary">新增意向</button>
      </div>

      <div class="filter-bar">
        <input v-model="filters.dateStart" type="date" class="form-input" style="width:150px;min-width:auto" />
        <span style="color:#9ca3af">至</span>
        <input v-model="filters.dateEnd" type="date" class="form-input" style="width:150px;min-width:auto" />
        <select v-model="filters.level" class="form-select">
          <option value="">全部等级</option>
          <option value="高">高</option>
          <option value="中">中</option>
          <option value="低">低</option>
        </select>
        <select v-model="filters.status" class="form-select">
          <option value="">全部状态</option>
          <option value="新线索">新线索</option>
          <option value="跟进中">跟进中</option>
          <option value="已签约">已签约</option>
          <option value="已放弃">已放弃</option>
        </select>
        <input v-model="filters.search" class="form-input" placeholder="搜索客户/电话/房源" style="min-width:180px" />
        <button class="btn btn-primary" @click="doSearch">查询</button>
      </div>

      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>客户姓名</th>
              <th>联系电话</th>
              <th>目标房源</th>
              <th>意向价格</th>
              <th>看房日期</th>
              <th>意向等级</th>
              <th>状态</th>
              <th>跟进专员</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedData" :key="row.id">
              <td class="font-semibold">{{ row.clientName }}</td>
              <td class="font-num">{{ row.phone }}</td>
              <td>{{ row.targetProperty }}</td>
              <td class="font-num">{{ row.intentPrice }}元/㎡/月</td>
              <td>{{ row.visitDate }}</td>
              <td><span class="badge" :class="levelBadge(row.level)">{{ row.level }}</span></td>
              <td><span class="badge" :class="statusBadge(row.status)">{{ row.status }}</span></td>
              <td>{{ row.assignee }}</td>
              <td class="text-gray">{{ row.createTime }}</td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-text btn-sm" @click="openFollowUp(row)">跟进</button>
                  <button class="btn btn-text btn-sm">编辑</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

    <!-- Follow-up Modal -->
    <ModalOverlay :show="showFollowUp" @close="showFollowUp = false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">跟进记录 - {{ followUpTarget?.clientName }}</div>
          <button class="modal-close" @click="showFollowUp = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label required">跟进内容</label>
            <textarea v-model="followUpForm.content" class="form-textarea" rows="4" placeholder="请输入跟进内容"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">下次跟进日期</label>
              <input v-model="followUpForm.nextDate" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">调整等级</label>
              <select v-model="followUpForm.level" class="form-select">
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showFollowUp = false">取消</button>
          <button class="btn btn-primary" @click="saveFollowUp">保存</button>
        </div>
      </div>
    </ModalOverlay>
  </div>
</template>

<style scoped>
</style>
