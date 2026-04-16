<script setup>
import { ref, computed } from 'vue'

const searchKey = ref('')
const areaFilter = ref('全部')
const entityFilter = ref('全部')
const currentPage = ref(1)
const pageSize = 10
const selectedIds = ref([])

const areas = ['全部', '坤煌（长寿）食品产业园', '坤煌（江津）双福园区']
const entities = ['全部', '重庆坤煌企业管理有限公司', '重庆坤煌物业管理有限公司']

const employees = [
  { id: 1, name: '刘艳妮', username: 'liuyanni', role: '客服', phone: '18702367813', area: '坤煌（长寿）食品产业园', entity: '重庆坤煌物业管理有限公司', dept: '客服部', enabled: true },
  { id: 2, name: '系统管理员', username: 'kunhuanghongze', role: '系统管理员', phone: '15823312945', area: '全部管理区', entity: '重庆坤煌企业管理有限公司', dept: '综合管理部', enabled: true },
  { id: 3, name: '张伟', username: 'zhangwei', role: '财务主管', phone: '13512345678', area: '坤煌（长寿）食品产业园', entity: '重庆坤煌企业管理有限公司', dept: '财务部', enabled: true },
  { id: 4, name: '李敏', username: 'limin', role: '收费员', phone: '13698765432', area: '坤煌（江津）双福园区', entity: '重庆坤煌物业管理有限公司', dept: '财务部', enabled: true },
  { id: 5, name: '王磊', username: 'wanglei', role: '安保主管', phone: '15098761234', area: '坤煌（长寿）食品产业园', entity: '重庆坤煌物业管理有限公司', dept: '安保部', enabled: true },
  { id: 6, name: '赵丽', username: 'zhaoli', role: '招商专员', phone: '13887654321', area: '坤煌（江津）双福园区', entity: '重庆坤煌企业管理有限公司', dept: '招商部', enabled: false },
  { id: 7, name: '陈强', username: 'chenqiang', role: '物业经理', phone: '18765432109', area: '坤煌（长寿）食品产业园', entity: '重庆坤煌物业管理有限公司', dept: '综合管理部', enabled: true },
  { id: 8, name: '周婷', username: 'zhouting', role: '客服专员', phone: '15234567890', area: '坤煌（江津）双福园区', entity: '重庆坤煌物业管理有限公司', dept: '客服部', enabled: true },
  { id: 9, name: '吴杰', username: 'wujie', role: '工程主管', phone: '13345678901', area: '坤煌（长寿）食品产业园', entity: '重庆坤煌物业管理有限公司', dept: '工程部', enabled: true },
  { id: 10, name: '孙娜', username: 'sunna', role: '保洁主管', phone: '18656789012', area: '坤煌（江津）双福园区', entity: '重庆坤煌物业管理有限公司', dept: '保洁部', enabled: false },
]

const filtered = computed(() => {
  return employees.filter(e => {
    if (searchKey.value && !e.name.includes(searchKey.value) && !e.username.includes(searchKey.value) && !e.phone.includes(searchKey.value)) return false
    if (areaFilter.value !== '全部' && e.area !== areaFilter.value) return false
    if (entityFilter.value !== '全部' && e.entity !== entityFilter.value) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize) || 1)
const pagedData = computed(() => {
  const s = (currentPage.value - 1) * pageSize
  return filtered.value.slice(s, s + pageSize)
})

function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
function toggleAll(e) {
  selectedIds.value = e.target.checked ? pagedData.value.map(r => r.id) : []
}
function isAllChecked() { return pagedData.value.length > 0 && pagedData.value.every(r => selectedIds.value.includes(r.id)) }
</script>

<template>
  <div class="emp-manage">
    <div class="page-header">
      <h1 class="page-title">员工管理</h1>
      <p class="page-subtitle">管理系统用户账户与权限分配</p>
    </div>

    <div class="filter-bar">
      <div class="search-input-wrapper">
        <span class="search-input-icon">&#128269;</span>
        <input v-model="searchKey" class="form-input" placeholder="快速搜索（姓名/用户名/手机号）" />
      </div>
      <select v-model="areaFilter" class="form-select">
        <option v-for="a in areas" :key="a">{{ a }}</option>
      </select>
      <select v-model="entityFilter" class="form-select">
        <option v-for="e in entities" :key="e">{{ e }}</option>
      </select>
      <div class="filter-actions">
        <button class="btn btn-primary">新建</button>
        <button class="btn btn-default">导入员工</button>
        <button class="btn btn-danger" :disabled="selectedIds.length === 0">批量删除</button>
        <button class="btn btn-default">导出Excel</button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:40px"><input type="checkbox" :checked="isAllChecked()" @change="toggleAll" /></th>
              <th>姓名</th><th>用户名</th><th>角色</th><th>手机号</th>
              <th>可见管理区</th><th>可见会计主体</th><th>所属部门</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in pagedData" :key="emp.id">
              <td><input type="checkbox" :value="emp.id" v-model="selectedIds" /></td>
              <td class="font-medium">{{ emp.name }}</td>
              <td class="text-gray">{{ emp.username }}</td>
              <td><span class="badge badge-blue">{{ emp.role }}</span></td>
              <td class="font-num">{{ emp.phone }}</td>
              <td class="truncate" style="max-width:180px;">{{ emp.area }}</td>
              <td class="truncate" style="max-width:180px;">{{ emp.entity }}</td>
              <td>{{ emp.dept }}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">编辑</button>
                  <button class="btn btn-text btn-sm" :class="emp.enabled ? 'danger' : ''">{{ emp.enabled ? '禁用' : '启用' }}</button>
                  <button class="btn btn-text btn-sm">更多</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination-info">共 {{ filtered.length }} 条记录</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="setPage(currentPage - 1)">&lt;</button>
          <button v-for="p in totalPages" :key="p" class="pagination-btn" :class="{ active: currentPage === p }" @click="setPage(p)">{{ p }}</button>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="setPage(currentPage + 1)">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emp-manage { max-width: 1400px; }
</style>
