<script setup>
import { ref } from 'vue'

const groups = ref([
  {
    title: '收费参数',
    items: [
      { label: '逾期滞纳金比例', value: '0.05%', desc: '每日按欠费金额百分比计算' },
      { label: '账单生成提前天数', value: '5 天', desc: '每月账单提前生成的天数' },
      { label: '欠费催缴间隔', value: '30 天', desc: '自动发送催费通知的间隔' },
      { label: '最大滞纳金上限', value: '欠费金额的20%', desc: '滞纳金不超过此比例' },
    ]
  },
  {
    title: '账单参数',
    items: [
      { label: '账单日', value: '每月1日', desc: '每月生成账单的日期' },
      { label: '账单展示周期', value: '12 个月', desc: '历史账单保留展示的月数' },
      { label: '自动核销', value: '开启', desc: '到账后自动核销对应账单' },
    ]
  },
  {
    title: '系统参数',
    items: [
      { label: '微信支付商户号', value: 'MCH20240001****', desc: '微信支付对接商户号' },
      { label: '系统维护时间', value: '每周日 02:00-04:00', desc: '系统定期维护时间窗口' },
      { label: '数据备份频率', value: '每日', desc: '系统数据自动备份频率' },
    ]
  },
  {
    title: '通知参数',
    items: [
      { label: '短信通知开关', value: '开启', desc: '是否启用短信通知' },
      { label: '微信推送开关', value: '开启', desc: '是否启用微信模板消息推送' },
      { label: '邮件通知开关', value: '关闭', desc: '是否启用邮件通知' },
      { label: '站内信保留天数', value: '90 天', desc: '站内信自动清理的保留天数' },
    ]
  },
])
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">参数设置</h1>
      <p class="page-subtitle">系统运行参数配置与管理</p>
    </div>

    <div v-for="group in groups" :key="group.title" class="card mb-3">
      <div class="card-header">
        <h3 class="card-title">{{ group.title }}</h3>
      </div>
      <div class="param-list">
        <div v-for="item in group.items" :key="item.label" class="param-row">
          <div class="param-info">
            <div class="font-medium">{{ item.label }}</div>
            <div class="text-sm text-gray">{{ item.desc }}</div>
          </div>
          <div class="param-value">
            <span class="font-semibold">{{ item.value }}</span>
            <button class="btn btn-text btn-sm">编辑</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
.param-list { border-top: 1px solid var(--gray-100); }
.param-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--gray-100); }
.param-row:last-child { border-bottom: none; }
.param-value { display: flex; align-items: center; gap: 12px; }
</style>
