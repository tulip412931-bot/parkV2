<script setup>
import { ref } from 'vue'

const selectedOrg = ref('综合管理部')
const orgTree = [
  { name: '重庆坤煌企业管理有限公司', children: [
    { name: '综合管理部' }, { name: '财务部' }, { name: '招商部' }, { name: '工程部' }
  ]},
  { name: '重庆坤煌物业管理有限公司', children: [
    { name: '客服部' }, { name: '安保部' }, { name: '保洁部' }, { name: '维修部' }
  ]},
]

const allUsers = [
  { id: 1, username: 'admin', name: '系统管理员', role: '系统管理员', phone: '15823312945', org: '综合管理部' },
  { id: 2, username: 'zhangwei', name: '张伟', role: '财务主管', phone: '13512345678', org: '财务部' },
  { id: 3, username: 'limin', name: '李敏', role: '收费员', phone: '13698765432', org: '财务部' },
  { id: 4, username: 'chenqiang', name: '陈强', role: '物业经理', phone: '18765432109', org: '综合管理部' },
  { id: 5, username: 'wanglei', name: '王磊', role: '安保主管', phone: '15098761234', org: '安保部' },
  { id: 6, username: 'zhouting', name: '周婷', role: '客服专员', phone: '15234567890', org: '客服部' },
  { id: 7, username: 'wujie', name: '吴杰', role: '工程主管', phone: '13345678901', org: '工程部' },
  { id: 8, username: 'liuyanni', name: '刘艳妮', role: '客服', phone: '18702367813', org: '客服部' },
]

const filteredUsers = ref([])
function selectOrg(name) {
  selectedOrg.value = name
  filteredUsers.value = allUsers.filter(u => u.org === name)
}
selectOrg('综合管理部')
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">用户组织设置</h1>
      <p class="page-subtitle">管理组织架构及用户归属关系</p>
    </div>

    <div class="layout-split">
      <div class="card left-panel">
        <h3 class="card-title mb-2">组织架构</h3>
        <div v-for="org in orgTree" :key="org.name" class="org-group">
          <div class="org-parent font-medium">{{ org.name }}</div>
          <div v-for="child in org.children" :key="child.name" class="org-child" :class="{ active: selectedOrg === child.name }" @click="selectOrg(child.name)">
            {{ child.name }}
          </div>
        </div>
      </div>
      <div class="card right-panel">
        <div class="flex items-center justify-between mb-2">
          <h3 class="card-title">{{ selectedOrg }} - 用户列表</h3>
          <button class="btn btn-primary btn-sm">+ 添加用户到组织</button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>用户名</th><th>姓名</th><th>角色</th><th>手机号</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="u in filteredUsers" :key="u.id">
                <td class="text-gray">{{ u.username }}</td>
                <td class="font-medium">{{ u.name }}</td>
                <td><span class="badge badge-blue">{{ u.role }}</span></td>
                <td class="font-num">{{ u.phone }}</td>
                <td>
                  <div class="table-actions">
                    <button class="btn btn-text btn-sm">移除</button>
                    <button class="btn btn-text btn-sm">调整</button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0"><td colspan="5" class="table-empty">该组织暂无用户</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
.layout-split { display: flex; gap: 20px; }
.left-panel { width: 280px; flex-shrink: 0; }
.right-panel { flex: 1; }
.org-group { margin-bottom: 12px; }
.org-parent { padding: 8px 12px; color: var(--gray-600); font-size: 13px; }
.org-child { padding: 8px 12px 8px 28px; font-size: 13px; border-radius: var(--radius); cursor: pointer; transition: var(--transition); }
.org-child:hover { background: var(--gray-100); }
.org-child.active { background: var(--primary); color: var(--white); font-weight: 500; }
</style>
