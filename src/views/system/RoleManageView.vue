<script setup>
import { ref } from 'vue'

const showPermModal = ref(false)
const permRoleName = ref('')

const roles = ref([
  { id: 1, name: '系统管理员', code: 'ADMIN', desc: '拥有系统全部权限', users: 2, enabled: true, created: '2025-01-15' },
  { id: 2, name: '财务主管', code: 'FIN_MGR', desc: '财务模块管理权限', users: 3, enabled: true, created: '2025-02-10' },
  { id: 3, name: '收费员', code: 'CASHIER', desc: '收费业务操作权限', users: 4, enabled: true, created: '2025-02-10' },
  { id: 4, name: '客服专员', code: 'CS_STAFF', desc: '客服工单与投诉处理', users: 3, enabled: true, created: '2025-03-05' },
  { id: 5, name: '招商专员', code: 'BD_STAFF', desc: '招商租赁业务操作', users: 5, enabled: true, created: '2025-03-20' },
  { id: 6, name: '物业经理', code: 'PM_MGR', desc: '物业运营管理权限', users: 2, enabled: true, created: '2025-04-01' },
  { id: 7, name: '安保主管', code: 'SEC_MGR', desc: '安保通行管理权限', users: 1, enabled: false, created: '2025-05-12' },
  { id: 8, name: '保洁主管', code: 'CLN_MGR', desc: '保洁服务管理权限', users: 1, enabled: false, created: '2025-06-08' },
])

const permTree = [
  { label: '收费管理', checked: false, children: [
    { label: '收费中心', checked: false }, { label: '账单管理', checked: false },
    { label: '收费记录', checked: false }, { label: '收费设置', checked: false },
  ]},
  { label: '财务管理', checked: false, children: [
    { label: '财务报表', checked: false }, { label: '应收管理', checked: false },
    { label: '收款日报', checked: false }, { label: '欠费管理', checked: false },
  ]},
  { label: '房产资源', checked: false, children: [
    { label: '房源管理', checked: false }, { label: '资源类型', checked: false }, { label: '房产统计', checked: false },
  ]},
  { label: '招商租赁', checked: false, children: [
    { label: '招商房源', checked: false }, { label: '线索管理', checked: false },
    { label: '匹配推荐', checked: false }, { label: '招商进度', checked: false },
  ]},
  { label: '系统管理', checked: false, children: [
    { label: '员工管理', checked: false }, { label: '组织机构', checked: false },
    { label: '角色管理', checked: false }, { label: '操作日志', checked: false },
  ]},
]

function openPerm(role) {
  permRoleName.value = role.name
  showPermModal.value = true
}
function closePerm() { showPermModal.value = false }
function toggleEnabled(role) { role.enabled = !role.enabled }
</script>

<template>
  <div class="role-manage">
    <div class="page-header">
      <h1 class="page-title">角色管理</h1>
      <p class="page-subtitle">管理系统角色与权限配置</p>
    </div>

    <div class="filter-bar">
      <div class="filter-actions" style="margin-left:0;">
        <button class="btn btn-primary">新建角色</button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>角色名称</th><th>角色编码</th><th>描述</th><th>用户数</th>
              <th>状态</th><th>创建时间</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in roles" :key="r.id">
              <td class="font-medium">{{ r.name }}</td>
              <td class="font-num text-gray">{{ r.code }}</td>
              <td>{{ r.desc }}</td>
              <td>{{ r.users }}</td>
              <td>
                <span class="badge" :class="r.enabled ? 'badge-green' : 'badge-gray'" style="cursor:pointer;" @click="toggleEnabled(r)">
                  <span class="badge-dot" :class="r.enabled ? 'green' : 'gray'"></span>{{ r.enabled ? '启用' : '停用' }}
                </span>
              </td>
              <td class="text-gray text-sm">{{ r.created }}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">编辑</button>
                  <button class="btn btn-text btn-sm" @click="openPerm(r)">权限配置</button>
                  <button class="btn btn-text btn-sm danger">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Permission config modal -->
    <div v-if="showPermModal" class="modal-overlay" @click.self="closePerm">
      <div class="modal modal-lg">
        <div class="modal-header">
          <span class="modal-title">权限配置 - {{ permRoleName }}</span>
          <button class="modal-close" @click="closePerm">&times;</button>
        </div>
        <div class="modal-body">
          <div v-for="mod in permTree" :key="mod.label" class="perm-module">
            <div class="perm-parent">
              <input type="checkbox" v-model="mod.checked" />
              <span class="font-medium">{{ mod.label }}</span>
            </div>
            <div class="perm-children">
              <label v-for="ch in mod.children" :key="ch.label" class="perm-child">
                <input type="checkbox" v-model="ch.checked" />
                <span>{{ ch.label }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="closePerm">取消</button>
          <button class="btn btn-primary" @click="closePerm">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-manage { max-width: 1400px; }
.perm-module { margin-bottom: 16px; }
.perm-parent { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--gray-100); }
.perm-children { display: flex; flex-wrap: wrap; gap: 4px 20px; padding: 8px 0 0 24px; }
.perm-child { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--gray-700); cursor: pointer; padding: 4px 0; }
</style>
