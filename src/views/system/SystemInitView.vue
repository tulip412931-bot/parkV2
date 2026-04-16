<script setup>
import { ref } from 'vue'

const steps = ref([
  { name: '基础信息设置', desc: '配置园区基本信息、管理公司信息', status: 'done' },
  { name: '管理区创建', desc: '创建园区管理区域划分', status: 'done' },
  { name: '楼宇导入', desc: '导入楼宇数据（名称、层数、面积等）', status: 'done' },
  { name: '房间导入', desc: '导入房间数据（房号、面积、类型等）', status: 'done' },
  { name: '客户导入', desc: '导入客户信息（名称、联系人、合同等）', status: 'progress' },
  { name: '收费项目设置', desc: '配置物业费、水电费等收费项目', status: 'pending' },
  { name: '收费标准绑定', desc: '将收费标准绑定到房间或客户', status: 'pending' },
])

const doneCount = steps.value.filter(s => s.status === 'done').length
const progress = Math.round((doneCount / steps.value.length) * 100)

const statusIcon = { done: '\u2705', progress: '\u23F3', pending: '\u2B55' }
const statusLabel = { done: '已完成', progress: '进行中', pending: '未开始' }
const statusBadge = { done: 'badge-green', progress: 'badge-orange', pending: 'badge-gray' }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">系统初始化</h1>
      <p class="page-subtitle">按步骤完成系统基础数据配置</p>
    </div>

    <div class="card mb-3">
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold">初始化进度</span>
        <span class="font-semibold text-primary">{{ progress }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="text-sm text-gray mt-1">已完成 {{ doneCount }} / {{ steps.length }} 步</p>
    </div>

    <div class="steps-list">
      <div v-for="(step, i) in steps" :key="i" class="card mb-2 step-card" :class="'step-' + step.status">
        <div class="flex items-center gap-2">
          <span class="step-icon">{{ statusIcon[step.status] }}</span>
          <div style="flex:1">
            <div class="flex items-center gap-1">
              <span class="font-semibold">{{ i + 1 }}. {{ step.name }}</span>
              <span class="badge" :class="statusBadge[step.status]">{{ statusLabel[step.status] }}</span>
            </div>
            <p class="text-sm text-gray mt-1">{{ step.desc }}</p>
          </div>
          <button v-if="step.status === 'progress'" class="btn btn-primary btn-sm">继续配置</button>
          <button v-else-if="step.status === 'pending'" class="btn btn-default btn-sm" disabled>待开始</button>
          <button v-else class="btn btn-default btn-sm">查看</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar { height: 10px; background: var(--gray-200); border-radius: 5px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 5px; transition: width 0.4s ease; }
.step-card { padding: 20px; }
.step-icon { font-size: 22px; }
.step-done { border-left: 4px solid var(--success); }
.step-progress { border-left: 4px solid var(--warning); }
.step-pending { border-left: 4px solid var(--gray-300); }
</style>
