<script setup>
import { ref, computed } from 'vue'

const dateFrom = ref('2026-04-01')
const dateTo = ref('2026-04-16')
const operatorFilter = ref('')
const moduleFilter = ref('全部')
const typeFilter = ref('全部')
const currentPage = ref(1)
const pageSize = 10

const modules = ['全部', '收费管理', '财务管理', '房产资源', '系统管理', '招商租赁']
const opTypes = ['全部', '新增', '编辑', '删除', '导出', '登录']
const typeBadge = { '新增': 'badge-green', '编辑': 'badge-blue', '删除': 'badge-red', '导出': 'badge-purple', '登录': 'badge-cyan' }

const operators = ['系统管理员', '刘艳妮', '张伟', '李敏', '王磊', '赵丽', '陈强', '周婷']
const ips = ['192.168.1.100', '192.168.1.101', '10.0.0.52', '192.168.1.200', '10.0.0.88', '192.168.2.15']
const mods = ['收费管理', '财务管理', '房产资源', '系统管理', '招商租赁']
const types = ['新增', '编辑', '删除', '导出', '登录']
const contents = [
  '新增收费账单 BILL20260401015', '编辑房源信息 03-14-02', '删除过期合同 HT20250312',
  '导出收费记录报表', '登录系统', '编辑员工信息 刘艳妮', '新增招商线索 成都蓝海软件',
  '删除欠费提醒记录', '导出财务月报表', '编辑角色权限 收费员',
  '新增物业费账单', '编辑租赁合同 HT20260301', '登录系统', '导出房源统计报表',
  '新增安保巡检记录', '编辑客户信息 重庆星辰科技', '删除草稿账单 BILL20260328005',
  '导出员工列表', '新增部门 招商三部', '编辑收费标准 停车费',
]
const results = ['成功', '成功', '成功', '成功', '失败', '成功', '成功', '成功', '成功', '成功']

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
const r = rng(99)

const logs = Array.from({ length: 40 }, (_, i) => {
  const h = Math.floor(r() * 12 + 8)
  const m = Math.floor(r() * 60)
  const d = Math.floor(r() * 16 + 1)
  const tp = types[Math.floor(r() * types.length)]
  return {
    id: 'LOG' + String(20260400001 + i),
    time: `2026-04-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`,
    operator: operators[Math.floor(r() * operators.length)],
    ip: ips[Math.floor(r() * ips.length)],
    module: mods[Math.floor(r() * mods.length)],
    type: tp,
    content: contents[Math.floor(r() * contents.length)],
    result: r() > 0.1 ? '成功' : '失败',
  }
})

const filtered = computed(() => {
  return logs.filter(l => {
    if (operatorFilter.value && !l.operator.includes(operatorFilter.value)) return false
    if (moduleFilter.value !== '全部' && l.module !== moduleFilter.value) return false
    if (typeFilter.value !== '全部' && l.type !== typeFilter.value) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize) || 1)
const pagedData = computed(() => {
  const s = (currentPage.value - 1) * pageSize
  return filtered.value.slice(s, s + pageSize)
})

function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }

function pageNums() {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const c = currentPage.value
  const pages = [1]
  if (c > 3) pages.push('...')
  for (let i = Math.max(2, c - 1); i <= Math.min(total - 1, c + 1); i++) pages.push(i)
  if (c < total - 2) pages.push('...')
  pages.push(total)
  return pages
}
</script>

<template>
  <div class="op-log">
    <div class="page-header">
      <h1 class="page-title">操作日志</h1>
      <p class="page-subtitle">查看系统操作记录与审计追踪</p>
    </div>

    <div class="filter-bar">
      <input v-model="dateFrom" type="date" class="form-input" style="width:140px;" />
      <span class="text-gray">~</span>
      <input v-model="dateTo" type="date" class="form-input" style="width:140px;" />
      <input v-model="operatorFilter" class="form-input" placeholder="操作人" style="width:120px;" />
      <select v-model="moduleFilter" class="form-select">
        <option v-for="m in modules" :key="m">{{ m }}</option>
      </select>
      <select v-model="typeFilter" class="form-select">
        <option v-for="t in opTypes" :key="t">{{ t }}</option>
      </select>
      <div class="filter-actions">
        <button class="btn btn-default">导出日志</button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>日志编号</th><th>操作时间</th><th>操作人</th><th>IP地址</th>
              <th>操作模块</th><th>操作类型</th><th>操作内容</th><th>操作结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in pagedData" :key="l.id">
              <td class="font-num text-gray text-sm">{{ l.id }}</td>
              <td class="text-gray text-sm">{{ l.time }}</td>
              <td class="font-medium">{{ l.operator }}</td>
              <td class="font-num text-gray">{{ l.ip }}</td>
              <td>{{ l.module }}</td>
              <td><span class="badge" :class="typeBadge[l.type] || 'badge-gray'">{{ l.type }}</span></td>
              <td class="truncate" style="max-width:240px;">{{ l.content }}</td>
              <td>
                <span class="badge" :class="l.result === '成功' ? 'badge-green' : 'badge-red'">
                  <span class="badge-dot" :class="l.result === '成功' ? 'green' : 'red'"></span>{{ l.result }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination-info">共 {{ filtered.length }} 条记录</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="setPage(currentPage - 1)">&lt;</button>
          <template v-for="p in pageNums()" :key="p">
            <span v-if="p === '...'" class="pagination-ellipsis">...</span>
            <button v-else class="pagination-btn" :class="{ active: currentPage === p }" @click="setPage(p)">{{ p }}</button>
          </template>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="setPage(currentPage + 1)">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.op-log { max-width: 1400px; }
.badge-cyan { background: #ecfeff; color: #0891b2; }
.pagination-ellipsis { display: flex; align-items: center; padding: 0 4px; color: var(--gray-400); font-size: 13px; }
</style>
