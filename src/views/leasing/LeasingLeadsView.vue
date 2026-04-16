<script setup>
import { ref, computed } from 'vue'
import { generateLeads, fmt } from '@/composables/useDemoData'
import { useToast } from '@/composables/useToast'
import ModalOverlay from '@/components/ModalOverlay.vue'

const { showToast } = useToast()

const allLeads = ref(generateLeads(65))

const activeTab = ref('全部')
const tabs = ['全部', '高意向', '跟进中', '已转化']

const filterDateStart = ref('')
const filterDateEnd = ref('')
const filterSource = ref('')
const filterLevel = ref('')
const filterStatus = ref('')
const searchText = ref('')
const page = ref(1)
const pageSize = 15

const sources = ['平台咨询', '线下登记', '客户推荐', '外部推广']
const levels = ['高意向', '中意向', '低意向']
const statuses = ['新线索', '跟进中', '已转化', '已关闭']

function doSearch() { page.value = 1 }
function doExport() { showToast('导出任务已创建，请稍后查看', 'success') }

const tabFilterMap = { '全部': null, '高意向': 'level', '跟进中': 'status', '已转化': 'status' }
const tabValueMap = { '高意向': '高意向', '跟进中': '跟进中', '已转化': '已转化' }

const filteredLeads = computed(() => {
  let list = allLeads.value
  if (activeTab.value !== '全部') {
    const field = tabFilterMap[activeTab.value]
    const val = tabValueMap[activeTab.value]
    list = list.filter(l => l[field] === val)
  }
  if (filterSource.value) list = list.filter(l => l.source === filterSource.value)
  if (filterLevel.value) list = list.filter(l => l.level === filterLevel.value)
  if (filterStatus.value) list = list.filter(l => l.status === filterStatus.value)
  if (filterDateStart.value) list = list.filter(l => l.createTime >= filterDateStart.value)
  if (filterDateEnd.value) list = list.filter(l => l.createTime <= filterDateEnd.value + ' 23:59:59')
  if (searchText.value.trim()) {
    const q = searchText.value.trim().toLowerCase()
    list = list.filter(l => l.companyName.toLowerCase().includes(q) || l.contactPerson.includes(q) || l.phone.includes(q))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredLeads.value.length / pageSize)))
const pagedLeads = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredLeads.value.slice(start, start + pageSize)
})

function tabCount(tab) {
  if (tab === '全部') return allLeads.value.length
  const field = tabFilterMap[tab]
  const val = tabValueMap[tab]
  return allLeads.value.filter(l => l[field] === val).length
}

function switchTab(tab) {
  activeTab.value = tab
  page.value = 1
}

function sourceBadge(s) {
  if (s === '平台咨询') return 'badge badge-blue'
  if (s === '线下登记') return 'badge badge-purple'
  if (s === '客户推荐') return 'badge badge-green'
  return 'badge badge-orange'
}

function levelBadge(l) {
  if (l === '高意向') return 'badge badge-red'
  if (l === '中意向') return 'badge badge-orange'
  return 'badge badge-gray'
}

function statusBadge(s) {
  if (s === '新线索') return 'badge badge-blue'
  if (s === '跟进中') return 'badge badge-orange'
  if (s === '已转化') return 'badge badge-green'
  return 'badge badge-gray'
}

function visiblePages() {
  const total = totalPages.value
  const cur = page.value
  const pages = []
  const start = Math.max(1, cur - 2)
  const end = Math.min(total, cur + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
}

/* Follow-up modal */
const showFollowModal = ref(false)
const followTarget = ref(null)
const followNote = ref('')
const followDate = ref('')
const followLevel = ref('')

function openFollow(lead) {
  followTarget.value = lead
  followNote.value = ''
  followDate.value = ''
  followLevel.value = lead.level
  showFollowModal.value = true
}

function saveFollow() {
  if (followTarget.value) {
    followTarget.value.status = '跟进中'
    if (followLevel.value) followTarget.value.level = followLevel.value
  }
  showFollowModal.value = false
  showToast('跟进记录已保存', 'success')
}

function doAssign(lead) {
  showToast(`线索「${lead.companyName}」已分配`, 'success')
}

function doConvert(lead) {
  lead.status = '已转化'
  showToast(`线索「${lead.companyName}」已转化`, 'success')
}
</script>

<template>
  <div class="page-view">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">招商线索管理</h3>
        <button class="btn btn-primary">+ 新增线索</button>
      </div>

      <div class="filter-bar">
        <input v-model="filterDateStart" type="date" class="form-input" />
        <input v-model="filterDateEnd" type="date" class="form-input" />
        <select v-model="filterSource" class="form-select">
          <option value="">全部来源</option>
          <option v-for="s in sources" :key="s" :value="s">{{ s }}</option>
        </select>
        <select v-model="filterLevel" class="form-select">
          <option value="">全部意向</option>
          <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
        </select>
        <select v-model="filterStatus" class="form-select">
          <option value="">全部状态</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
        <input v-model="searchText" class="form-input" placeholder="搜索企业/联系人/电话" @keyup.enter="doSearch" />
        <button class="btn btn-primary" @click="doSearch">查询</button>
        <button class="btn btn-default" @click="doExport">导出</button>
      </div>

      <div class="tabs">
        <div
          v-for="tab in tabs"
          :key="tab"
          class="tab-item"
          :class="{ active: activeTab === tab }"
          @click="switchTab(tab)"
        >
          {{ tab }}<span class="tab-count">{{ tabCount(tab) }}</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>企业名称</th>
              <th>联系人</th>
              <th>电话</th>
              <th>来源</th>
              <th>行业</th>
              <th>需求面积</th>
              <th>预算</th>
              <th>意向等级</th>
              <th>状态</th>
              <th>跟进专员</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in pagedLeads" :key="lead.id">
              <td class="truncate" style="max-width:160px">{{ lead.companyName }}</td>
              <td>{{ lead.contactPerson }}</td>
              <td class="font-num">{{ lead.phone }}</td>
              <td><span :class="sourceBadge(lead.source)">{{ lead.source }}</span></td>
              <td>{{ lead.industry }}</td>
              <td class="font-num">{{ fmt(lead.needArea) }}㎡</td>
              <td class="font-num">{{ lead.budget }}元/㎡/月</td>
              <td><span :class="levelBadge(lead.level)">{{ lead.level }}</span></td>
              <td><span :class="statusBadge(lead.status)">{{ lead.status }}</span></td>
              <td>{{ lead.assignee }}</td>
              <td class="font-num">{{ lead.createTime.slice(0, 10) }}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm" @click="openFollow(lead)">跟进</button>
                  <button class="btn btn-text btn-sm" @click="doAssign(lead)">分配</button>
                  <button class="btn btn-text btn-sm" @click="doConvert(lead)">转化</button>
                </div>
              </td>
            </tr>
            <tr v-if="pagedLeads.length === 0">
              <td colspan="12" class="table-empty">暂无匹配的线索数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination-info">共 {{ filteredLeads.length }} 条记录，第 {{ page }} / {{ totalPages }} 页</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="page <= 1" @click="page--">&lt;</button>
          <button
            v-for="p in visiblePages()"
            :key="p"
            class="pagination-btn"
            :class="{ active: p === page }"
            @click="page = p"
          >{{ p }}</button>
          <button class="pagination-btn" :disabled="page >= totalPages" @click="page++">&gt;</button>
        </div>
      </div>
    </div>

    <!-- Follow-up Modal -->
    <ModalOverlay :show="showFollowModal" @close="showFollowModal = false">
      <div class="modal-inner">
        <h3 class="modal-title">跟进记录 - {{ followTarget?.companyName }}</h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label>跟进内容</label>
            <textarea v-model="followNote" class="form-input" rows="4" placeholder="请输入跟进记录..."></textarea>
          </div>
          <div class="form-group">
            <label>下次跟进日期</label>
            <input v-model="followDate" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label>意向等级</label>
            <select v-model="followLevel" class="form-select">
              <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showFollowModal = false">取消</button>
          <button class="btn btn-primary" @click="saveFollow">保存</button>
        </div>
      </div>
    </ModalOverlay>
  </div>
</template>

<style scoped>
.page-view { max-width: 1400px; }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.modal-inner {
  padding: 24px;
  min-width: 500px;
}
.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
