<script setup>
import { ref, computed } from 'vue'

const filterRentMin = ref('')
const filterRentMax = ref('')
const filterAreaMin = ref('')
const filterAreaMax = ref('')
const filterBuilding = ref('')
const filterLayout = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const showOfflineModal = ref(false)
const offlineReason = ref('')
const offlineTarget = ref(null)
const editingId = ref(null)

const form = ref({ code:'', building:'', room:'', area:'', layout:'', facing:'', facilities:[], rent:'', price:'', deposit:'', remark:'' })
const facilityOptions = ['空调','网络','家具','停车位','独立卫生间','电梯']

const buildings = ['A栋','B栋','C栋','D栋','E栋']
const layouts = ['单间','一室一厅','两室一厅','开间','整层','标准间']
const statusList = ['待租售','洽谈中','已租售','已下架']

const properties = ref([
  { id:1, code:'FY2024001', building:'A栋', room:'101', area:120, layout:'标准间', facing:'南', facilities:['空调','网络','电梯'], rent:4500, price:85, deposit:'押一付三', status:'待租售' },
  { id:2, code:'FY2024002', building:'A栋', room:'203', area:85, layout:'单间', facing:'东南', facilities:['空调','网络'], rent:3200, price:62, deposit:'押一付三', status:'洽谈中' },
  { id:3, code:'FY2024003', building:'A栋', room:'305', area:200, layout:'整层', facing:'南', facilities:['空调','网络','家具','电梯'], rent:8500, price:160, deposit:'面议', status:'已租售' },
  { id:4, code:'FY2024004', building:'B栋', room:'102', area:65, layout:'开间', facing:'西', facilities:['空调','网络'], rent:2400, price:45, deposit:'押二付一', status:'待租售' },
  { id:5, code:'FY2024005', building:'B栋', room:'201', area:150, layout:'两室一厅', facing:'南', facilities:['空调','网络','家具','停车位'], rent:6000, price:110, deposit:'押一付三', status:'已租售' },
  { id:6, code:'FY2024006', building:'B栋', room:'302', area:95, layout:'一室一厅', facing:'东', facilities:['空调','网络','独立卫生间'], rent:3800, price:70, deposit:'押一付三', status:'洽谈中' },
  { id:7, code:'FY2024007', building:'C栋', room:'101', area:300, layout:'整层', facing:'南', facilities:['空调','网络','家具','停车位','电梯'], rent:12000, price:230, deposit:'面议', status:'待租售' },
  { id:8, code:'FY2024008', building:'C栋', room:'205', area:110, layout:'标准间', facing:'北', facilities:['空调','网络'], rent:4000, price:78, deposit:'押一付三', status:'已下架' },
  { id:9, code:'FY2024009', building:'C栋', room:'308', area:75, layout:'单间', facing:'东南', facilities:['空调','网络','独立卫生间'], rent:2800, price:55, deposit:'押二付一', status:'待租售' },
  { id:10, code:'FY2024010', building:'D栋', room:'102', area:180, layout:'两室一厅', facing:'南', facilities:['空调','网络','家具','电梯'], rent:7200, price:135, deposit:'押一付三', status:'已租售' },
  { id:11, code:'FY2024011', building:'D栋', room:'203', area:60, layout:'开间', facing:'西南', facilities:['空调','网络'], rent:2200, price:42, deposit:'押一付三', status:'待租售' },
  { id:12, code:'FY2024012', building:'D栋', room:'305', area:130, layout:'标准间', facing:'东', facilities:['空调','网络','家具'], rent:5200, price:98, deposit:'押一付三', status:'洽谈中' },
  { id:13, code:'FY2024013', building:'E栋', room:'101', area:250, layout:'整层', facing:'南', facilities:['空调','网络','家具','停车位','独立卫生间','电梯'], rent:10000, price:195, deposit:'面议', status:'已租售' },
  { id:14, code:'FY2024014', building:'E栋', room:'202', area:90, layout:'一室一厅', facing:'北', facilities:['空调','网络'], rent:3500, price:66, deposit:'押二付一', status:'待租售' },
  { id:15, code:'FY2024015', building:'A栋', room:'401', area:105, layout:'标准间', facing:'东南', facilities:['空调','网络','电梯'], rent:4200, price:80, deposit:'押一付三', status:'洽谈中' },
  { id:16, code:'FY2024016', building:'B栋', room:'403', area:70, layout:'单间', facing:'西', facilities:['空调','网络'], rent:2600, price:50, deposit:'押一付三', status:'已下架' },
  { id:17, code:'FY2024017', building:'C栋', room:'401', area:160, layout:'两室一厅', facing:'南', facilities:['空调','网络','家具','停车位'], rent:6500, price:120, deposit:'押一付三', status:'已租售' },
  { id:18, code:'FY2024018', building:'D栋', room:'401', area:88, layout:'一室一厅', facing:'东', facilities:['空调','网络','独立卫生间'], rent:3400, price:64, deposit:'押一付三', status:'待租售' },
  { id:19, code:'FY2024019', building:'E栋', room:'301', area:220, layout:'整层', facing:'南', facilities:['空调','网络','家具','电梯'], rent:9000, price:175, deposit:'面议', status:'洽谈中' },
  { id:20, code:'FY2024020', building:'E栋', room:'402', area:100, layout:'标准间', facing:'北', facilities:['空调','网络'], rent:3800, price:72, deposit:'押一付三', status:'待租售' },
])

const filtered = computed(() => {
  return properties.value.filter(p => {
    if (filterBuilding.value && p.building !== filterBuilding.value) return false
    if (filterLayout.value && p.layout !== filterLayout.value) return false
    if (filterStatus.value && p.status !== filterStatus.value) return false
    if (filterRentMin.value && p.rent < Number(filterRentMin.value)) return false
    if (filterRentMax.value && p.rent > Number(filterRentMax.value)) return false
    if (filterAreaMin.value && p.area < Number(filterAreaMin.value)) return false
    if (filterAreaMax.value && p.area > Number(filterAreaMax.value)) return false
    return true
  })
})

const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))
const paged = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function statusClass(s) {
  return { '待租售':'badge-blue','洽谈中':'badge-orange','已租售':'badge-green','已下架':'badge-gray' }[s] || 'badge-gray'
}

function openAdd() {
  editingId.value = null
  form.value = { code:'', building:'A栋', room:'', area:'', layout:'标准间', facing:'南', facilities:[], rent:'', price:'', deposit:'押一付三', remark:'' }
  showModal.value = true
}

function openEdit(p) {
  editingId.value = p.id
  form.value = { code:p.code, building:p.building, room:p.room, area:p.area, layout:p.layout, facing:p.facing, facilities:[...p.facilities], rent:p.rent, price:p.price, deposit:p.deposit, remark:'' }
  showModal.value = true
}

function saveForm() {
  if (editingId.value) {
    const idx = properties.value.findIndex(p => p.id === editingId.value)
    if (idx >= 0) Object.assign(properties.value[idx], form.value)
  } else {
    properties.value.unshift({ id: Date.now(), ...form.value, status:'待租售' })
  }
  showModal.value = false
}

function toggleOnline(p) {
  if (p.status === '已下架') { p.status = '待租售' }
  else { offlineTarget.value = p; offlineReason.value = ''; showOfflineModal.value = true }
}

function confirmOffline() {
  if (offlineTarget.value) offlineTarget.value.status = '已下架'
  showOfflineModal.value = false
}

function toggleTop(p) { const idx = properties.value.indexOf(p); if (idx > 0) { properties.value.splice(idx, 1); properties.value.unshift(p) } }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">租赁房源管理</h1>
      <p class="page-subtitle">管理园区所有租赁房源信息，支持上架、下架及编辑操作</p>
    </div>

    <div class="filter-bar">
      <select v-model="filterBuilding" class="form-select"><option value="">全部楼宇</option><option v-for="b in buildings" :key="b" :value="b">{{ b }}</option></select>
      <select v-model="filterLayout" class="form-select"><option value="">全部户型</option><option v-for="l in layouts" :key="l" :value="l">{{ l }}</option></select>
      <select v-model="filterStatus" class="form-select"><option value="">全部状态</option><option v-for="s in statusList" :key="s" :value="s">{{ s }}</option></select>
      <input v-model="filterRentMin" class="form-input" style="min-width:100px;width:100px" placeholder="租金最低" />
      <span class="text-gray">-</span>
      <input v-model="filterRentMax" class="form-input" style="min-width:100px;width:100px" placeholder="租金最高" />
      <input v-model="filterAreaMin" class="form-input" style="min-width:100px;width:100px" placeholder="面积最小" />
      <span class="text-gray">-</span>
      <input v-model="filterAreaMax" class="form-input" style="min-width:100px;width:100px" placeholder="面积最大" />
      <div class="filter-actions">
        <button class="btn btn-primary" @click="openAdd">+ 新建房源</button>
        <button class="btn btn-default">导出</button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>房源编号</th><th>位置</th><th>面积(㎡)</th><th>户型</th><th>朝向</th><th>配套设施</th><th>租金(元/月)</th><th>售价(万元)</th><th>押付方式</th><th>状态</th><th>操作</th>
          </tr></thead>
          <tbody>
            <tr v-for="p in paged" :key="p.id">
              <td class="font-semibold">{{ p.code }}</td>
              <td>{{ p.building }}{{ p.room }}</td>
              <td class="font-num">{{ p.area }}</td>
              <td>{{ p.layout }}</td>
              <td>{{ p.facing }}</td>
              <td><span v-for="f in p.facilities" :key="f" class="tag">{{ f }}</span></td>
              <td class="font-num">{{ p.rent.toLocaleString() }}</td>
              <td class="font-num">{{ p.price }}</td>
              <td>{{ p.deposit }}</td>
              <td>
                <span class="badge" :class="statusClass(p.status)">{{ p.status }}</span>
                <span v-if="p.status==='已租售'" class="tag" style="margin-left:4px;background:#f0fdf4;color:#16a34a">已归档</span>
              </td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm" @click="openEdit(p)">编辑</button>
                  <button class="btn btn-text btn-sm" @click="toggleOnline(p)">{{ p.status==='已下架'?'上架':'下架' }}</button>
                  <button class="btn btn-text btn-sm" @click="toggleTop(p)">置顶</button>
                  <button class="btn btn-text btn-sm">查看</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination-info">共 {{ filtered.length }} 条记录</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage<=1" @click="currentPage--">&lt;</button>
          <button v-for="pg in totalPages" :key="pg" class="pagination-btn" :class="{active:pg===currentPage}" @click="currentPage=pg">{{ pg }}</button>
          <button class="pagination-btn" :disabled="currentPage>=totalPages" @click="currentPage++">&gt;</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
      <div class="modal modal-lg">
        <div class="modal-header">
          <span class="modal-title">{{ editingId ? '编辑房源' : '新建房源' }}</span>
          <button class="modal-close" @click="showModal=false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group"><label class="form-label required">房源编号</label><input v-model="form.code" class="form-input" placeholder="如 FY2024021" /></div>
            <div class="form-group"><label class="form-label required">楼宇</label><select v-model="form.building" class="form-select"><option v-for="b in buildings" :key="b" :value="b">{{ b }}</option></select></div>
            <div class="form-group"><label class="form-label required">房号</label><input v-model="form.room" class="form-input" placeholder="如 101" /></div>
            <div class="form-group"><label class="form-label required">面积(㎡)</label><input v-model="form.area" class="form-input" type="number" /></div>
            <div class="form-group"><label class="form-label">户型</label><select v-model="form.layout" class="form-select"><option v-for="l in layouts" :key="l" :value="l">{{ l }}</option></select></div>
            <div class="form-group"><label class="form-label">朝向</label><select v-model="form.facing" class="form-select"><option v-for="d in ['东','南','西','北','东南','西南','东北','西北']" :key="d" :value="d">{{ d }}</option></select></div>
            <div class="form-group"><label class="form-label required">租金(元/月)</label><input v-model="form.rent" class="form-input" type="number" /></div>
            <div class="form-group"><label class="form-label required">售价(万元)</label><input v-model="form.price" class="form-input" type="number" /></div>
            <div class="form-group"><label class="form-label">押付方式</label><select v-model="form.deposit" class="form-select"><option v-for="d in ['押一付三','押二付一','面议']" :key="d" :value="d">{{ d }}</option></select></div>
            <div class="form-group full-width">
              <label class="form-label">配套设施</label>
              <div class="flex gap-2" style="flex-wrap:wrap">
                <label v-for="f in facilityOptions" :key="f" style="display:inline-flex;align-items:center;gap:4px;font-size:13px;cursor:pointer">
                  <input type="checkbox" :value="f" v-model="form.facilities" /> {{ f }}
                </label>
              </div>
            </div>
            <div class="form-group full-width"><label class="form-label">备注</label><textarea v-model="form.remark" class="form-textarea" rows="2"></textarea></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showModal=false">取消</button>
          <button class="btn btn-primary" @click="saveForm">保存</button>
        </div>
      </div>
    </div>

    <!-- Offline Reason Modal -->
    <div v-if="showOfflineModal" class="modal-overlay" @click.self="showOfflineModal=false">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">下架原因</span>
          <button class="modal-close" @click="showOfflineModal=false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label required">请输入下架原因</label><textarea v-model="offlineReason" class="form-textarea" rows="3" placeholder="请说明下架原因..."></textarea></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showOfflineModal=false">取消</button>
          <button class="btn btn-danger" @click="confirmOffline">确认下架</button>
        </div>
      </div>
    </div>
  </div>
</template>
