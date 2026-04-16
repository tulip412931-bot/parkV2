<script setup>
import { ref, computed } from 'vue'
import { COMPANIES_IN_PARK, generateVisitors } from '@/composables/useDemoData'
import { useToast } from '@/composables/useToast'
import ModalOverlay from '@/components/ModalOverlay.vue'

const { showToast } = useToast()

const allVisitors = ref(generateVisitors(60))

const activeTab = ref('全部')
const tabs = ['全部', '待核销', '已通过', '已过期']
const tabStatusMap = { '全部': null, '待核销': '待核销', '已通过': '已通过', '已过期': '已过期' }

const filterDateFrom = ref('')
const filterDateTo = ref('')
const filterCompany = ref('')
const filterStatus = ref('')
const searchText = ref('')

const page = ref(1)
const pageSize = 12

function doSearch() { page.value = 1 }

const filteredVisitors = computed(() => {
  let list = allVisitors.value
  const tabStatus = tabStatusMap[activeTab.value]
  if (tabStatus) list = list.filter(v => v.status === tabStatus)
  if (filterCompany.value) list = list.filter(v => v.hostCompany === filterCompany.value)
  if (filterStatus.value) list = list.filter(v => v.status === filterStatus.value)
  if (filterDateFrom.value) list = list.filter(v => v.validFrom >= filterDateFrom.value)
  if (filterDateTo.value) list = list.filter(v => v.validTo <= filterDateTo.value)
  if (searchText.value.trim()) {
    const q = searchText.value.trim().toLowerCase()
    list = list.filter(v => v.name.includes(q) || v.phone.includes(q) || v.hostName.includes(q))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredVisitors.value.length / pageSize)))
const pagedVisitors = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredVisitors.value.slice(start, start + pageSize)
})

function tabCount(tab) {
  const s = tabStatusMap[tab]
  if (!s) return allVisitors.value.length
  return allVisitors.value.filter(v => v.status === s).length
}

function switchTab(tab) { activeTab.value = tab; page.value = 1 }

function statusBadge(status) {
  if (status === '已通过') return 'badge badge-green'
  if (status === '待核销') return 'badge badge-orange'
  if (status === '已过期') return 'badge badge-gray'
  if (status === '已拒绝') return 'badge badge-red'
  return 'badge badge-gray'
}

function verifyVisitor(v) {
  v.status = '已通过'
  showToast(`访客「${v.name}」已核销放行`, 'success')
}

function visiblePages() {
  const total = totalPages.value
  const cur = page.value
  const pages = []
  for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) pages.push(i)
  return pages
}

// Modal
const showModal = ref(false)
const gates = ['东门', '西门', '南门', '北门']
const purposes = ['商务洽谈', '面试', '送货', '维修', '参观']
const durations = ['2小时', '4小时', '8小时', '1天', '3天', '7天']

const form = ref({ name: '', phone: '', company: '', host: '', purpose: '', duration: '', gates: [] })

function openModal() {
  form.value = { name: '', phone: '', company: '', host: '', purpose: '', duration: '', gates: [] }
  showModal.value = true
}

function toggleGate(g) {
  const idx = form.value.gates.indexOf(g)
  if (idx >= 0) form.value.gates.splice(idx, 1)
  else form.value.gates.push(g)
}

function submitInvite() {
  if (!form.value.name || !form.value.phone || !form.value.company || !form.value.host || !form.value.purpose || !form.value.duration || form.value.gates.length === 0) {
    showToast('请填写完整的邀访信息', 'warning')
    return
  }
  const newVisitor = {
    id: allVisitors.value.length + 1,
    name: form.value.name,
    phone: form.value.phone,
    idCard: '',
    company: '',
    hostCompany: form.value.company,
    hostName: form.value.host,
    purpose: form.value.purpose,
    qrCode: 'QR' + String(Math.floor(100000000 + Math.random() * 900000000)),
    validFrom: new Date().toISOString().slice(0, 10),
    validTo: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    status: '待核销',
    gate: form.value.gates.join('、')
  }
  allVisitors.value.unshift(newVisitor)
  showModal.value = false
  showToast(`邀访码已生成，访客「${form.value.name}」`, 'success')
}
</script>

<template>
  <div class="page-view">
    <div class="page-header flex justify-between items-center">
      <div>
        <h2 class="page-title">访客通行管理</h2>
        <p class="page-subtitle">管理园区访客预约、核销与通行权限</p>
      </div>
      <button class="btn btn-primary" @click="openModal">+ 生成邀访码</button>
    </div>

    <div class="card mb-3">
      <div class="filter-bar">
        <input type="date" v-model="filterDateFrom" class="form-input" style="min-width:140px" />
        <span class="text-gray">至</span>
        <input type="date" v-model="filterDateTo" class="form-input" style="min-width:140px" />
        <select v-model="filterCompany" class="form-select">
          <option value="">全部被访企业</option>
          <option v-for="c in COMPANIES_IN_PARK" :key="c.name" :value="c.name">{{ c.name }}</option>
        </select>
        <select v-model="filterStatus" class="form-select">
          <option value="">全部状态</option>
          <option value="待核销">待核销</option>
          <option value="已通过">已通过</option>
          <option value="已过期">已过期</option>
          <option value="已拒绝">已拒绝</option>
        </select>
        <input v-model="searchText" class="form-input" placeholder="搜索访客/被访人" style="min-width:180px" @keyup.enter="doSearch" />
        <button class="btn btn-primary" @click="doSearch">查询</button>
      </div>

      <div class="tabs">
        <div v-for="tab in tabs" :key="tab" class="tab-item" :class="{ active: activeTab === tab }" @click="switchTab(tab)">
          {{ tab }}<span class="tab-count">{{ tabCount(tab) }}</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>访客姓名</th>
              <th>手机号</th>
              <th>被访企业</th>
              <th>被访人</th>
              <th>来访事由</th>
              <th>有效时段</th>
              <th>通行门岗</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in pagedVisitors" :key="v.id">
              <td class="font-medium">{{ v.name }}</td>
              <td class="font-num">{{ v.phone }}</td>
              <td class="truncate" style="max-width:160px">{{ v.hostCompany }}</td>
              <td>{{ v.hostName }}</td>
              <td>{{ v.purpose }}</td>
              <td class="font-num text-sm">{{ v.validFrom }} ~ {{ v.validTo }}</td>
              <td>{{ v.gate }}</td>
              <td><span :class="statusBadge(v.status)">{{ v.status }}</span></td>
              <td>
                <div class="table-actions">
                  <button v-if="v.status === '待核销'" class="btn btn-text btn-sm" @click="verifyVisitor(v)">核销放行</button>
                  <button class="btn btn-text btn-sm">查看</button>
                </div>
              </td>
            </tr>
            <tr v-if="pagedVisitors.length === 0">
              <td colspan="9" class="table-empty">暂无匹配的访客数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination-info">共 {{ filteredVisitors.length }} 条记录，第 {{ page }} / {{ totalPages }} 页</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="page <= 1" @click="page--">&lt;</button>
          <button v-for="p in visiblePages()" :key="p" class="pagination-btn" :class="{ active: p === page }" @click="page = p">{{ p }}</button>
          <button class="pagination-btn" :disabled="page >= totalPages" @click="page++">&gt;</button>
        </div>
      </div>
    </div>

    <!-- Invite Modal -->
    <ModalOverlay :show="showModal" @close="showModal = false">
      <div class="modal" style="min-width:520px">
        <div class="modal-header">
          <span class="modal-title">生成邀访码</span>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label required">访客姓名</label>
              <input v-model="form.name" class="form-input" placeholder="请输入访客姓名" />
            </div>
            <div class="form-group">
              <label class="form-label required">手机号</label>
              <input v-model="form.phone" class="form-input" placeholder="请输入手机号" />
            </div>
            <div class="form-group">
              <label class="form-label required">被访企业</label>
              <select v-model="form.company" class="form-select">
                <option value="">请选择企业</option>
                <option v-for="c in COMPANIES_IN_PARK" :key="c.name" :value="c.name">{{ c.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">被访人</label>
              <input v-model="form.host" class="form-input" placeholder="请输入被访人姓名" />
            </div>
            <div class="form-group">
              <label class="form-label required">来访事由</label>
              <select v-model="form.purpose" class="form-select">
                <option value="">请选择事由</option>
                <option v-for="p in purposes" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">有效时长</label>
              <select v-model="form.duration" class="form-select">
                <option value="">请选择时长</option>
                <option v-for="d in durations" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label class="form-label required">通行门岗</label>
              <div class="gate-checkboxes">
                <label v-for="g in gates" :key="g" class="checkbox-label" @click.prevent="toggleGate(g)">
                  <span class="checkbox-box" :class="{ checked: form.gates.includes(g) }">
                    <span v-if="form.gates.includes(g)" class="checkbox-tick">&#10003;</span>
                  </span>
                  {{ g }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showModal = false">取消</button>
          <button class="btn btn-primary" @click="submitInvite">确认生成</button>
        </div>
      </div>
    </ModalOverlay>
  </div>
</template>

<style scoped>
.page-view { max-width: 1400px; }
.gate-checkboxes {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--gray-700);
  user-select: none;
}
.checkbox-box {
  width: 18px;
  height: 18px;
  border: 1.5px solid var(--gray-300);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  background: #fff;
  font-size: 12px;
}
.checkbox-box.checked {
  background: var(--primary);
  border-color: var(--primary);
}
.checkbox-tick {
  color: #fff;
  font-size: 12px;
  line-height: 1;
}
</style>
