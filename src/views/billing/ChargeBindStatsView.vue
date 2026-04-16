<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { standard: '物业费-A栋', project: '物业费', building: 'A栋', rooms: 24, bound: 24, rate: '100%' },
  { standard: '物业费-B栋', project: '物业费', building: 'B栋', rooms: 18, bound: 18, rate: '100%' },
  { standard: '租金-A栋', project: '租金', building: 'A栋', rooms: 24, bound: 20, rate: '83.3%' },
  { standard: '租金-B栋', project: '租金', building: 'B栋', rooms: 18, bound: 15, rate: '83.3%' },
  { standard: '水费-全园区', project: '水费', building: '全部', rooms: 56, bound: 56, rate: '100%' },
  { standard: '电费-全园区', project: '电费', building: '全部', rooms: 56, bound: 56, rate: '100%' },
  { standard: '停车费', project: '停车费', building: '全部', rooms: 30, bound: 22, rate: '73.3%' },
  { standard: '垃圾清运费', project: '垃圾清运费', building: '全部', rooms: 56, bound: 50, rate: '89.3%' },
])
const filterProject = ref('')
const filtered = computed(() => {
  if (!filterProject.value) return items.value
  return items.value.filter(i => i.project === filterProject.value)
})
</script>
<template>
  <div class="page-view">
    <div class="page-header"><div><h2 class="page-title">收费标准绑定统计</h2><p class="page-subtitle">查看各收费标准与房间的绑定情况</p></div></div>
    <div class="card">
      <div class="filter-bar">
        <select v-model="filterProject" class="form-select"><option value="">全部收费项目</option><option>物业费</option><option>租金</option><option>水费</option><option>电费</option><option>停车费</option><option>垃圾清运费</option></select>
      </div>
      <div class="table-wrapper">
        <table class="data-table"><thead><tr><th>标准名称</th><th>收费项目</th><th>适用楼宇</th><th>应绑房间数</th><th>已绑定数</th><th>绑定率</th></tr></thead>
        <tbody><tr v-for="(r,i) in filtered" :key="i"><td class="font-medium">{{ r.standard }}</td><td>{{ r.project }}</td><td>{{ r.building }}</td><td class="font-num">{{ r.rooms }}</td><td class="font-num">{{ r.bound }}</td><td><span :class="r.rate==='100%'?'badge badge-green':'badge badge-orange'">{{ r.rate }}</span></td></tr></tbody></table>
      </div>
    </div>
  </div>
</template>
<style scoped>.page-view{max-width:1400px}</style>
