<script setup>
import { ref } from 'vue'

const chargeItems = ['物业费', '租金', '水费', '电费', '停车费', '垃圾处理费', '公共能耗费', '维修基金']
const billingMethods = ['按面积计费', '按户计费', '按用量计费', '固定金额', '按面积计费', '按户计费', '按用量计费', '固定金额']

const rules = ref(Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `${chargeItems[i]}自动账单`,
  item: chargeItems[i],
  area: '坤煌（长寿）食品产业园',
  building: i % 2 === 0 ? '全部楼宇' : `${['A', 'B', 'C'][i % 3]}栋`,
  method: billingMethods[i],
  day: [1, 1, 5, 5, 10, 15, 20, 25][i],
  enabled: i < 5
})))

function toggleRule(rule) { rule.enabled = !rule.enabled }
function deleteRule(id) { rules.value = rules.value.filter(r => r.id !== id) }
</script>

<template>
  <div>
    <div class="page-header flex justify-between items-center">
      <div>
        <h1 class="page-title">自动生成账单</h1>
        <p class="page-subtitle">配置账单自动生成规则，定时批量生成</p>
      </div>
      <button class="btn btn-primary">+ 新建规则</button>
    </div>

    <div class="page-note mb-3">
      自动账单将在每月指定日期凌晨02:00自动执行，生成后可在账单列表中查看。
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>规则名称</th><th>收费项目</th><th>管理区</th><th>楼宇</th>
            <th>计费方式</th><th>生成日</th><th>状态</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rules" :key="r.id">
            <td class="font-medium">{{ r.name }}</td>
            <td>{{ r.item }}</td>
            <td>{{ r.area }}</td>
            <td>{{ r.building }}</td>
            <td>{{ r.method }}</td>
            <td>每月{{ r.day }}号</td>
            <td>
              <span class="badge" :class="r.enabled ? 'badge-green' : 'badge-gray'">
                {{ r.enabled ? '启用' : '停用' }}
              </span>
            </td>
            <td class="table-actions">
              <button class="btn btn-sm btn-default">编辑</button>
              <button class="btn btn-sm" :class="r.enabled ? 'btn-default' : 'btn-success'" @click="toggleRule(r)">
                {{ r.enabled ? '停用' : '启用' }}
              </button>
              <button class="btn btn-sm btn-text danger" @click="deleteRule(r.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
