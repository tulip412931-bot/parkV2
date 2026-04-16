<script setup>
import { ref } from 'vue'

const selectedRole = ref('系统管理员')
const roles = ['系统管理员', '财务主管', '收费员', '招商专员', '物业经理', '客服专员', '安保主管']

const modules = ref([
  { name: '收费管理', perms: ['查看', '新增', '编辑', '删除', '导出'], checked: ['查看', '新增', '编辑', '删除', '导出'] },
  { name: '财务管理', perms: ['查看', '新增', '编辑', '删除', '导出'], checked: ['查看', '新增', '编辑', '导出'] },
  { name: '房产资源', perms: ['查看', '新增', '编辑', '删除', '导出'], checked: ['查看', '新增', '编辑', '删除', '导出'] },
  { name: '系统管理', perms: ['查看', '新增', '编辑', '删除', '导出'], checked: ['查看', '新增', '编辑', '删除', '导出'] },
  { name: '招商租赁', perms: ['查看', '新增', '编辑', '删除', '导出'], checked: ['查看', '编辑'] },
])

function togglePerm(mod, perm) {
  const idx = mod.checked.indexOf(perm)
  if (idx >= 0) mod.checked.splice(idx, 1)
  else mod.checked.push(perm)
}

function toggleAll(mod) {
  if (mod.checked.length === mod.perms.length) mod.checked = []
  else mod.checked = [...mod.perms]
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">权限管理</h1>
      <p class="page-subtitle">配置角色权限与功能模块访问控制</p>
    </div>

    <div class="layout-split">
      <div class="card left-panel">
        <h3 class="card-title mb-2">角色列表</h3>
        <div v-for="r in roles" :key="r" class="role-item" :class="{ active: selectedRole === r }" @click="selectedRole = r">
          {{ r }}
        </div>
      </div>
      <div class="card right-panel">
        <div class="flex items-center justify-between mb-2">
          <h3 class="card-title">{{ selectedRole }} - 权限配置</h3>
          <div class="btn-group">
            <button class="btn btn-primary btn-sm">保存</button>
            <button class="btn btn-default btn-sm">重置</button>
          </div>
        </div>
        <div class="perm-modules">
          <div v-for="mod in modules" :key="mod.name" class="perm-module">
            <div class="perm-module-header">
              <label class="perm-check">
                <input type="checkbox" :checked="mod.checked.length === mod.perms.length" @change="toggleAll(mod)" />
                <span class="font-semibold">{{ mod.name }}</span>
              </label>
            </div>
            <div class="perm-items">
              <label v-for="p in mod.perms" :key="p" class="perm-check">
                <input type="checkbox" :checked="mod.checked.includes(p)" @change="togglePerm(mod, p)" />
                <span>{{ p }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
.layout-split { display: flex; gap: 20px; }
.left-panel { width: 220px; flex-shrink: 0; }
.right-panel { flex: 1; }
.role-item { padding: 10px 14px; border-radius: var(--radius); cursor: pointer; font-size: 14px; margin-bottom: 4px; transition: var(--transition); }
.role-item:hover { background: var(--gray-100); }
.role-item.active { background: var(--primary); color: var(--white); font-weight: 500; }
.perm-module { border: 1px solid var(--gray-200); border-radius: var(--radius); margin-bottom: 12px; overflow: hidden; }
.perm-module-header { padding: 12px 16px; background: var(--gray-50); border-bottom: 1px solid var(--gray-200); }
.perm-items { display: flex; gap: 24px; padding: 12px 16px; flex-wrap: wrap; }
.perm-check { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; }
.perm-check input { width: 16px; height: 16px; accent-color: var(--primary); }
</style>
