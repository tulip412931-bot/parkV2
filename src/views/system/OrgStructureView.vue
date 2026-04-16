<script setup>
import { ref } from 'vue'

const orgTree = [
  { id: 1, name: '重庆坤煌企业管理有限公司', children: [
    { id: 2, name: '坤煌物业', children: [
      { id: 3, name: '综合管理部' },
      { id: 4, name: '财务部' },
      { id: 5, name: '工程部' },
      { id: 6, name: '客服部' },
      { id: 7, name: '安保部' },
      { id: 8, name: '保洁部' },
    ]},
    { id: 9, name: '坤煌招商', children: [
      { id: 10, name: '招商一部' },
      { id: 11, name: '招商二部' },
    ]},
  ]}
]

const selectedOrg = ref(orgTree[0].children[0])
const expanded = ref([1, 2])

const orgInfo = ref({
  name: '坤煌物业',
  code: 'KH-WY',
  parent: '重庆坤煌企业管理有限公司',
  leader: '陈强',
  phone: '023-68001234',
  desc: '负责园区物业管理运营服务'
})

const departments = [
  { id: 3, name: '综合管理部', leader: '陈强', count: 5 },
  { id: 4, name: '财务部', leader: '张伟', count: 4 },
  { id: 5, name: '工程部', leader: '吴杰', count: 6 },
  { id: 6, name: '客服部', leader: '刘艳妮', count: 3 },
  { id: 7, name: '安保部', leader: '王磊', count: 8 },
  { id: 8, name: '保洁部', leader: '孙娜', count: 10 },
]

function toggleExpand(id) {
  const idx = expanded.value.indexOf(id)
  idx >= 0 ? expanded.value.splice(idx, 1) : expanded.value.push(id)
}
function isExpanded(id) { return expanded.value.includes(id) }
function selectOrg(node) { selectedOrg.value = node }
</script>

<template>
  <div class="org-page">
    <div class="page-header">
      <h1 class="page-title">组织机构</h1>
      <p class="page-subtitle">管理公司组织架构与部门信息</p>
    </div>

    <div class="org-layout">
      <!-- Left tree panel -->
      <div class="card org-tree-panel">
        <div class="card-header">
          <span class="card-title">机构树</span>
        </div>
        <div class="tree">
          <template v-for="root in orgTree" :key="root.id">
            <div class="tree-node" @click="selectOrg(root)">
              <span class="tree-toggle" @click.stop="toggleExpand(root.id)">{{ root.children ? (isExpanded(root.id) ? '&#9660;' : '&#9654;') : '&nbsp;&nbsp;' }}</span>
              <span class="tree-label" :class="{ active: selectedOrg.id === root.id }">{{ root.name }}</span>
            </div>
            <template v-if="isExpanded(root.id) && root.children">
              <template v-for="child in root.children" :key="child.id">
                <div class="tree-node depth-1" @click="selectOrg(child)">
                  <span class="tree-toggle" @click.stop="toggleExpand(child.id)">{{ child.children ? (isExpanded(child.id) ? '&#9660;' : '&#9654;') : '&nbsp;&nbsp;' }}</span>
                  <span class="tree-label" :class="{ active: selectedOrg.id === child.id }">{{ child.name }}</span>
                </div>
                <template v-if="isExpanded(child.id) && child.children">
                  <div v-for="leaf in child.children" :key="leaf.id" class="tree-node depth-2" @click="selectOrg(leaf)">
                    <span class="tree-toggle">&nbsp;&nbsp;</span>
                    <span class="tree-label" :class="{ active: selectedOrg.id === leaf.id }">{{ leaf.name }}</span>
                  </div>
                </template>
              </template>
            </template>
          </template>
        </div>
      </div>

      <!-- Right detail panel -->
      <div class="org-detail">
        <div class="card mb-2">
          <div class="card-header">
            <span class="card-title">{{ selectedOrg.name }}</span>
            <div class="btn-group">
              <button class="btn btn-primary btn-sm">新建子机构</button>
              <button class="btn btn-default btn-sm">编辑</button>
              <button class="btn btn-danger btn-sm">删除</button>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">名称</label>
              <input class="form-input" :value="orgInfo.name" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">编码</label>
              <input class="form-input" :value="orgInfo.code" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">上级机构</label>
              <input class="form-input" :value="orgInfo.parent" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">负责人</label>
              <input class="form-input" :value="orgInfo.leader" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">联系电话</label>
              <input class="form-input" :value="orgInfo.phone" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">描述</label>
              <input class="form-input" :value="orgInfo.desc" readonly />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">下属部门</span>
            <span class="text-gray text-sm">共 {{ departments.length }} 个部门</span>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>部门名称</th><th>负责人</th><th>人数</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="d in departments" :key="d.id">
                  <td class="font-medium">{{ d.name }}</td>
                  <td>{{ d.leader }}</td>
                  <td>{{ d.count }} 人</td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-text btn-sm">编辑</button>
                      <button class="btn btn-text btn-sm danger">删除</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.org-page { max-width: 1400px; }
.org-layout { display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: start; }
.org-tree-panel { min-height: 400px; }
.tree { padding: 4px 0; }
.tree-node { display: flex; align-items: center; gap: 4px; padding: 6px 8px; cursor: pointer; border-radius: var(--radius); transition: background 0.15s; }
.tree-node:hover { background: var(--gray-100); }
.tree-node.depth-1 { padding-left: 24px; }
.tree-node.depth-2 { padding-left: 44px; }
.tree-toggle { font-size: 10px; color: var(--gray-400); width: 16px; text-align: center; flex-shrink: 0; }
.tree-label { font-size: 13px; color: var(--gray-700); }
.tree-label.active { color: var(--primary); font-weight: 600; }
@media (max-width: 900px) { .org-layout { grid-template-columns: 1fr; } }
</style>
