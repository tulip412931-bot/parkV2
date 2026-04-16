<script setup>
import { ref } from 'vue'

const groups = ref([
  { id: 1, name: '财务审核组', desc: '负责财务相关审批和复核', members: 5, created: '2024-01-10', creator: '系统管理员' },
  { id: 2, name: '招商运营组', desc: '负责园区招商与客户对接', members: 8, created: '2024-02-15', creator: '系统管理员' },
  { id: 3, name: '物业巡检组', desc: '日常物业巡检与问题上报', members: 12, created: '2024-03-01', creator: '陈强' },
  { id: 4, name: '工程维修组', desc: '负责园区设施设备维修', members: 6, created: '2024-04-20', creator: '吴杰' },
  { id: 5, name: '客户服务组', desc: '处理客户投诉与服务请求', members: 10, created: '2024-05-15', creator: '刘艳妮' },
  { id: 6, name: '安保值班组', desc: '园区安保轮班及应急处理', members: 15, created: '2024-06-01', creator: '王磊' },
])
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">自定义用户组</h1>
      <p class="page-subtitle">创建和管理自定义用户分组</p>
    </div>

    <div class="filter-bar">
      <div class="filter-actions">
        <button class="btn btn-primary">+ 新建用户组</button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>用户组名称</th><th>描述</th><th>成员数</th><th>创建时间</th><th>创建人</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="g in groups" :key="g.id">
              <td class="font-medium">{{ g.name }}</td>
              <td class="text-gray">{{ g.desc }}</td>
              <td class="font-num">{{ g.members }}</td>
              <td>{{ g.created }}</td>
              <td>{{ g.creator }}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">编辑</button>
                  <button class="btn btn-text btn-sm">查看成员</button>
                  <button class="btn btn-text btn-sm danger">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
</style>
