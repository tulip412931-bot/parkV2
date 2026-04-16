<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('全部')
const tabs = ['全部','待签约','已签约','已履约','已解约']
const searchCode = ref('')
const searchCustomer = ref('')
const searchProperty = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const showTermModal = ref(false)
const termTarget = ref(null)
const termReason = ref('')

const orders = ref([
  { id:1, code:'DD2024001', property:'A栋101 / 120㎡ / 标准间', propertyCode:'FY2024001', customer:'重庆智汇科技有限公司', type:'租赁', amount:'4,500元/月', deposit:'13,500元', signTime:'2024-11-05', status:'已签约' },
  { id:2, code:'DD2024002', property:'B栋201 / 150㎡ / 两室一厅', propertyCode:'FY2024005', customer:'成都盛达物流集团', type:'出售', amount:'110万元', deposit:'50,000元', signTime:'2024-10-30', status:'已履约' },
  { id:3, code:'DD2024003', property:'A栋305 / 200㎡ / 整层', propertyCode:'FY2024003', customer:'江津新材料科技公司', type:'租赁', amount:'8,500元/月', deposit:'25,500元', signTime:'2024-10-22', status:'已签约' },
  { id:4, code:'DD2024004', property:'D栋102 / 180㎡ / 两室一厅', propertyCode:'FY2024010', customer:'重庆万达商业管理公司', type:'出售', amount:'135万元', deposit:'60,000元', signTime:'2024-10-27', status:'已履约' },
  { id:5, code:'DD2024005', property:'E栋101 / 250㎡ / 整层', propertyCode:'FY2024013', customer:'成都天府科创有限公司', type:'出售', amount:'195万元', deposit:'80,000元', signTime:'2024-10-20', status:'已履约' },
  { id:6, code:'DD2024006', property:'C栋101 / 300㎡ / 整层', propertyCode:'FY2024007', customer:'重庆鼎盛实业有限公司', type:'租赁', amount:'12,000元/月', deposit:'36,000元', signTime:'', status:'待签约' },
  { id:7, code:'DD2024007', property:'B栋302 / 95㎡ / 一室一厅', propertyCode:'FY2024006', customer:'重庆华通电子有限公司', type:'租赁', amount:'3,800元/月', deposit:'', signTime:'', status:'待签约' },
  { id:8, code:'DD2024008', property:'C栋401 / 160㎡ / 两室一厅', propertyCode:'FY2024017', customer:'重庆渝创投资有限公司', type:'租赁', amount:'6,500元/月', deposit:'19,500元', signTime:'2024-11-02', status:'已解约' },
  { id:9, code:'DD2024009', property:'D栋305 / 130㎡ / 标准间', propertyCode:'FY2024012', customer:'江津永辉超市有限公司', type:'租赁', amount:'5,200元/月', deposit:'15,000元', signTime:'', status:'待签约' },
  { id:10, code:'DD2024010', property:'E栋301 / 220㎡ / 整层', propertyCode:'FY2024019', customer:'成都新锐广告有限公司', type:'租赁', amount:'9,000元/月', deposit:'27,000元', signTime:'', status:'待签约' },
  { id:11, code:'DD2024011', property:'A栋401 / 105㎡ / 标准间', propertyCode:'FY2024015', customer:'重庆中启信息技术公司', type:'租赁', amount:'4,200元/月', deposit:'', signTime:'', status:'待签约' },
  { id:12, code:'DD2024012', property:'E栋202 / 90㎡ / 一室一厅', propertyCode:'FY2024014', customer:'四川锦程教育集团', type:'租赁', amount:'3,500元/月', deposit:'', signTime:'', status:'待签约' },
  { id:13, code:'DD2024013', property:'D栋203 / 60㎡ / 开间', propertyCode:'FY2024011', customer:'重庆利通机械公司', type:'租赁', amount:'2,200元/月', deposit:'', signTime:'', status:'待签约' },
  { id:14, code:'DD2024014', property:'E栋402 / 100㎡ / 标准间', propertyCode:'FY2024020', customer:'四川众合电气有限公司', type:'租赁', amount:'3,800元/月', deposit:'', signTime:'', status:'待签约' },
  { id:15, code:'DD2024015', property:'B栋102 / 65㎡ / 开间', propertyCode:'FY2024004', customer:'重庆双福物业管理公司', type:'租赁', amount:'2,400元/月', deposit:'', signTime:'', status:'待签约' },
  { id:16, code:'DD2024016', property:'A栋203 / 85㎡ / 单间', propertyCode:'FY2024002', customer:'四川蓝海贸易公司', type:'租赁', amount:'3,200元/月', deposit:'9,000元', signTime:'', status:'待签约' },
  { id:17, code:'DD2024017', property:'C栋308 / 75㎡ / 单间', propertyCode:'FY2024009', customer:'重庆嘉禾商贸有限公司', type:'租赁', amount:'2,800元/月', deposit:'', signTime:'', status:'待签约' },
  { id:18, code:'DD2024018', property:'D栋401 / 88㎡ / 一室一厅', propertyCode:'FY2024018', customer:'江津恒信科技有限公司', type:'租赁', amount:'3,400元/月', deposit:'', signTime:'', status:'待签约' },
  { id:19, code:'DD2024019', property:'B栋201 / 150㎡ / 车位', propertyCode:'FY2024005', customer:'成都盛达物流集团', type:'出售', amount:'8万元', deposit:'', signTime:'2024-11-10', status:'已签约' },
  { id:20, code:'DD2024020', property:'A栋101 / 120㎡ / 储物间', propertyCode:'FY2024001', customer:'重庆智汇科技有限公司', type:'租赁', amount:'800元/月', deposit:'', signTime:'2024-11-20', status:'已签约' },
])

const filtered = computed(() => {
  return orders.value.filter(o => {
    if (activeTab.value !== '全部' && o.status !== activeTab.value) return false
    if (searchCode.value && !o.code.includes(searchCode.value)) return false
    if (searchCustomer.value && !o.customer.includes(searchCustomer.value)) return false
    if (searchProperty.value && !o.propertyCode.includes(searchProperty.value)) return false
    return true
  })
})

const counts = computed(() => {
  const c = { total:orders.value.length, '待签约':0, '已签约':0, '已履约':0, '已解约':0 }
  orders.value.forEach(o => { if (c[o.status] !== undefined) c[o.status]++ })
  return c
})

const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))
const paged = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function statusClass(s) { return { '待签约':'badge-orange','已签约':'badge-blue','已履约':'badge-green','已解约':'badge-red' }[s] || 'badge-gray' }

function openTerm(o) { termTarget.value = o; termReason.value = ''; showTermModal.value = true }

function confirmTerm() {
  if (termTarget.value) termTarget.value.status = '已解约'
  showTermModal.value = false
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">租售订单管理</h1>
      <p class="page-subtitle">管理园区所有租售订单，跟踪订单签约及履约状态</p>
    </div>

    <div class="stat-cards">
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">订单总数</div><div class="stat-card-value font-num">{{ counts.total }}</div></div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:#fffbeb;color:#d97706">&#9998;</div><div class="stat-card-content"><div class="stat-card-label">待签约</div><div class="stat-card-value font-num">{{ counts['待签约'] }}</div></div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:#eff6ff;color:#2563eb">&#9745;</div><div class="stat-card-content"><div class="stat-card-label">已签约</div><div class="stat-card-value font-num">{{ counts['已签约'] }}</div></div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:#f0fdf4;color:#16a34a">&#10003;</div><div class="stat-card-content"><div class="stat-card-label">已履约</div><div class="stat-card-value font-num">{{ counts['已履约'] }}</div></div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:#fef2f2;color:#dc2626">&#10007;</div><div class="stat-card-content"><div class="stat-card-label">已解约</div><div class="stat-card-value font-num">{{ counts['已解约'] }}</div></div></div>
    </div>

    <div class="tabs">
      <div v-for="t in tabs" :key="t" class="tab-item" :class="{active:activeTab===t}" @click="activeTab=t;currentPage=1">
        {{ t }} <span class="tab-count">{{ t==='全部'?orders.length:counts[t]||0 }}</span>
      </div>
    </div>

    <div class="filter-bar">
      <input v-model="searchCode" class="form-input" placeholder="订单编号搜索" style="min-width:140px" />
      <input v-model="searchCustomer" class="form-input" placeholder="客户名称搜索" style="min-width:140px" />
      <input v-model="searchProperty" class="form-input" placeholder="房源编号" style="min-width:130px" />
      <input v-model="dateStart" class="form-input" type="date" style="min-width:140px" />
      <span class="text-gray">至</span>
      <input v-model="dateEnd" class="form-input" type="date" style="min-width:140px" />
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>订单编号</th><th>房源信息</th><th>客户名称</th><th>订单类型</th><th>金额</th><th>定金</th><th>签约时间</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="o in paged" :key="o.id">
              <td class="font-semibold">{{ o.code }}</td>
              <td class="truncate" style="max-width:200px" :title="o.property">{{ o.property }}</td>
              <td>{{ o.customer }}</td>
              <td><span class="badge" :class="o.type==='租赁'?'badge-blue':'badge-purple'">{{ o.type }}</span></td>
              <td class="font-num">{{ o.amount }}</td>
              <td class="font-num">{{ o.deposit || '-' }}</td>
              <td class="text-gray">{{ o.signTime || '-' }}</td>
              <td><span class="badge" :class="statusClass(o.status)">{{ o.status }}</span></td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">查看</button>
                  <button v-if="o.status==='待签约'" class="btn btn-text btn-sm" @click="o.status='已签约'">签约确认</button>
                  <button v-if="o.status==='已签约'" class="btn btn-text btn-sm danger" @click="openTerm(o)">解约</button>
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

    <!-- Terminate Modal -->
    <div v-if="showTermModal" class="modal-overlay" @click.self="showTermModal=false">
      <div class="modal">
        <div class="modal-header"><span class="modal-title">解约确认</span><button class="modal-close" @click="showTermModal=false">&times;</button></div>
        <div class="modal-body">
          <div class="page-note warn">解约后该订单将标记为已解约状态，相关记录将保留以供查询。</div>
          <div class="form-group"><label class="form-label required">解约原因</label><textarea v-model="termReason" class="form-textarea" rows="3" placeholder="请输入解约原因..."></textarea></div>
        </div>
        <div class="modal-footer"><button class="btn btn-default" @click="showTermModal=false">取消</button><button class="btn btn-danger" @click="confirmTerm">确认解约</button></div>
      </div>
    </div>
  </div>
</template>
