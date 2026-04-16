<script setup>
import { ref } from 'vue'

const notifications = ref([
  { type: '欠费提醒', sms: true, email: false, internal: true, wechat: true, receiver: '财务部全员', enabled: true },
  { type: '账单生成', sms: false, email: true, internal: true, wechat: true, receiver: '财务主管', enabled: true },
  { type: '退款通知', sms: true, email: true, internal: true, wechat: false, receiver: '财务主管、系统管理员', enabled: true },
  { type: '合同到期', sms: true, email: false, internal: true, wechat: true, receiver: '招商专员、物业经理', enabled: true },
  { type: '催费提醒', sms: true, email: false, internal: true, wechat: true, receiver: '收费员', enabled: false },
  { type: '系统公告', sms: false, email: false, internal: true, wechat: false, receiver: '全部用户', enabled: true },
])
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">消息接收设置</h1>
      <p class="page-subtitle">配置各类通知的接收方式与接收人</p>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>通知类型</th><th>短信</th><th>邮件</th><th>站内信</th><th>微信</th><th>接收人</th><th>状态</th></tr>
          </thead>
          <tbody>
            <tr v-for="(n, i) in notifications" :key="i">
              <td class="font-medium">{{ n.type }}</td>
              <td><input type="checkbox" v-model="n.sms" style="width:16px;height:16px;accent-color:var(--primary)" /></td>
              <td><input type="checkbox" v-model="n.email" style="width:16px;height:16px;accent-color:var(--primary)" /></td>
              <td><input type="checkbox" v-model="n.internal" style="width:16px;height:16px;accent-color:var(--primary)" /></td>
              <td><input type="checkbox" v-model="n.wechat" style="width:16px;height:16px;accent-color:var(--primary)" /></td>
              <td class="truncate" style="max-width:200px">{{ n.receiver }}</td>
              <td><span class="badge" :class="n.enabled ? 'badge-green' : 'badge-gray'">{{ n.enabled ? '启用' : '停用' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary">保存设置</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
</style>
