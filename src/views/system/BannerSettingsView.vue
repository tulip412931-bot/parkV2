<script setup>
import { ref } from 'vue'

const banners = ref([
  { id: 1, title: '园区春季招商活动', color: '#3b82f6', link: '/activity/spring', sort: 1, visible: true },
  { id: 2, title: '2024年度物业费缴纳通知', color: '#16a34a', link: '/notice/fee-2024', sort: 2, visible: true },
  { id: 3, title: '消防安全宣传月', color: '#dc2626', link: '/safety/fire', sort: 3, visible: true },
  { id: 4, title: '园区智慧停车系统上线', color: '#d97706', link: '/notice/parking', sort: 4, visible: false },
  { id: 5, title: '端午节放假通知', color: '#7c3aed', link: '/notice/holiday', sort: 5, visible: true },
])
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">轮播图设置</h1>
      <p class="page-subtitle">管理首页及小程序轮播图展示内容</p>
    </div>

    <div class="filter-bar">
      <div class="filter-actions">
        <button class="btn btn-primary">+ 添加轮播图</button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>图片预览</th><th>标题</th><th>链接地址</th><th>排序</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in banners" :key="row.id">
              <td><div class="banner-preview" :style="{ background: row.color }"><span>{{ row.title.slice(0, 4) }}</span></div></td>
              <td class="font-medium">{{ row.title }}</td>
              <td class="text-gray truncate" style="max-width:200px">{{ row.link }}</td>
              <td class="font-num">{{ row.sort }}</td>
              <td><span class="badge" :class="row.visible ? 'badge-green' : 'badge-gray'">{{ row.visible ? '显示' : '隐藏' }}</span></td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">编辑</button>
                  <button class="btn btn-text btn-sm danger">删除</button>
                  <button class="btn btn-text btn-sm">上移</button>
                  <button class="btn btn-text btn-sm">下移</button>
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
.banner-preview { width: 120px; height: 48px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 600; }
</style>
