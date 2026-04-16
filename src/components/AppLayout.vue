<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ToastContainer from '@/components/ToastContainer.vue'

const route = useRoute()
const router = useRouter()

const sidebarCollapsed = ref(false)

const expandedGroups = ref({
  access: false,
  rental: false,
  leasing: false,
  billing: false,
  finance: false,
  property: false,
  system: false,
  finlease: false,
  invoice: false
})

function toggleGroup(group) {
  expandedGroups.value[group] = !expandedGroups.value[group]
}

function isActive(path) {
  return route.path === path
}

function isGroupActive(prefix) {
  return route.path.startsWith(prefix)
}

const breadcrumb = computed(() => {
  return route.meta?.breadcrumb || ['首页']
})

const notificationCount = ref(5)

function handleLogout() {
  router.push('/login')
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Auto-expand group based on current route
watch(() => route.path, (path) => {
  if (path.startsWith('/app/access')) expandedGroups.value.access = true
  if (path.startsWith('/app/rental')) expandedGroups.value.rental = true
  if (path.startsWith('/app/leasing')) expandedGroups.value.leasing = true
  if (path.startsWith('/app/billing')) expandedGroups.value.billing = true
  if (path.startsWith('/app/finance')) expandedGroups.value.finance = true
  if (path.startsWith('/app/property')) expandedGroups.value.property = true
  if (path.startsWith('/app/system')) expandedGroups.value.system = true
  if (path.startsWith('/app/finlease')) expandedGroups.value.finlease = true
  if (path.startsWith('/app/invoice')) expandedGroups.value.invoice = true
}, { immediate: true })

const navGroups = [
  {
    key: 'billing', label: '收费管理', icon: 'billing', prefix: '/app/billing',
    children: [
      { label: '收费看板', path: '/app/billing/dashboard' },
      { label: '收费中心', path: '/app/billing/center', group: '前台收费' },
      { label: '预存费', path: '/app/billing/predeposit', group: '前台收费' },
      { label: '交款申请', path: '/app/billing/payment-apply', group: '前台收费' },
      { label: '催费中心', path: '/app/billing/reminder', group: '前台收费' },
      { label: '收费历史记录', path: '/app/billing/history', group: '前台收费' },
      { label: '客户零头账户', path: '/app/billing/odd-account', group: '前台收费' },
      { label: '生成账单', path: '/app/billing/generate', group: '应收管理' },
      { label: '自动生成账单', path: '/app/billing/auto-bill', group: '应收管理' },
      { label: '账单管理', path: '/app/billing/bills', group: '应收管理' },
      { label: '减免申请', path: '/app/billing/reduction', group: '应收管理' },
      { label: '固定金额分摊', path: '/app/billing/amort', group: '应收管理' },
      { label: '费用调整记录', path: '/app/billing/fee-adjust', group: '应收管理' },
      { label: '指定减免金额统计', path: '/app/billing/designated-reduction', group: '应收管理' },
      { label: '退款管理', path: '/app/billing/refund', group: '退款管理' },
      { label: '仪表抄表', path: '/app/billing/meter', group: '仪表抄表' },
      { label: '票据管理', path: '/app/billing/invoice', group: '票据管理' },
      { label: '收费项目定义', path: '/app/billing/settings', group: '收费设置' },
      { label: '收费标准设置', path: '/app/billing/standard', group: '收费设置' },
      { label: '收费标准绑定统计', path: '/app/billing/bind-stats', group: '收费设置' },
      { label: '支付方式配置', path: '/app/billing/payment-method', group: '收费设置' }
    ]
  },
  {
    key: 'invoice', label: '票通发票', icon: 'invoice', prefix: '/app/invoice',
    children: [
      { label: '发票看板', path: '/app/invoice/dashboard' },
      { label: '发票开具', path: '/app/invoice/create' },
      { label: '发票管理', path: '/app/invoice/manage' },
      { label: '发票查验', path: '/app/invoice/verify' },
      { label: '统计分析', path: '/app/invoice/stats' },
      { label: '发票设置', path: '/app/invoice/settings' }
    ]
  },
  {
    key: 'finlease', label: '招商租赁', icon: 'store', prefix: '/app/finlease',
    children: [
      { label: '租赁房源管理', path: '/app/finlease/properties', group: '租赁房源管理' },
      { label: '洽谈与合同', path: '/app/finlease/negotiation', group: '收入合同管理' },
      { label: '租售订单管理', path: '/app/finlease/orders', group: '收入合同管理' },
      { label: '租售统计报表', path: '/app/finlease/report', group: '合同报表' }
    ]
  },
  {
    key: 'finance', label: '财务管理', icon: 'finance', prefix: '/app/finance',
    children: [
      { label: '常用报表', path: '/app/finance/common', group: '常用报表' },
      { label: '综合报表', path: '/app/finance/report', group: '常用报表' },
      { label: '应收月度统计', path: '/app/finance/receivable', group: '常用报表' },
      { label: '已收费用日报', path: '/app/finance/collection', group: '常用报表' },
      { label: '费用报表', path: '/app/finance/fee-report', group: '费用报表' },
      { label: '月报表', path: '/app/finance/monthly', group: '月报表' },
      { label: '保证金', path: '/app/finance/deposit', group: '保证金' },
      { label: '年度报表', path: '/app/finance/annual', group: '年度报表' },
      { label: '欠费统计', path: '/app/finance/arrears', group: '欠费报表' },
      { label: '欠费报表', path: '/app/finance/arrears-report', group: '欠费报表' },
      { label: '费用减免统计', path: '/app/finance/reduction', group: '费用减免统计' },
      { label: '自定义报表', path: '/app/finance/custom', group: '自定义报表' },
      { label: '目标管理', path: '/app/finance/goal', group: '目标管理' }
    ]
  },
  {
    key: 'access', label: '门禁管理', icon: 'shield', prefix: '/app/access',
    children: [
      { label: '员工通行管理', path: '/app/access/employee' },
      { label: '访客通行管理', path: '/app/access/visitor' },
      { label: '门禁记录与统计', path: '/app/access/records' }
    ]
  },
  {
    key: 'rental', label: '租售板块', icon: 'building', prefix: '/app/rental',
    children: [
      { label: '房源信息管理', path: '/app/rental/properties' },
      { label: '租售意向管理', path: '/app/rental/intention' },
      { label: '租售订单管理', path: '/app/rental/orders' },
      { label: '租售数据统计', path: '/app/rental/stats' }
    ]
  },
  {
    key: 'leasing', label: '招租板块', icon: 'megaphone', prefix: '/app/leasing',
    children: [
      { label: '招租房源管理', path: '/app/leasing/properties' },
      { label: '招商线索管理', path: '/app/leasing/leads' },
      { label: '招商智能匹配', path: '/app/leasing/matching' },
      { label: '招商进度管理', path: '/app/leasing/progress' },
      { label: '招商数据分析', path: '/app/leasing/stats' }
    ]
  },
  {
    key: 'property', label: '房产资源', icon: 'property', prefix: '/app/property',
    children: [
      { label: '物业资源管理', path: '/app/property/resources', group: '房产资源管理' },
      { label: '资源类型管理', path: '/app/property/types', group: '房产资源管理' },
      { label: '管家管理', path: '/app/property/steward', group: '房产资源管理' },
      { label: '房产资源平面图', path: '/app/property/floorplan', group: '房产资源统计' },
      { label: '微信绑定状态统计', path: '/app/property/wechat-bind', group: '房产资源统计' },
      { label: '车位状态统计', path: '/app/property/parking', group: '房产资源统计' },
      { label: '房间绑定业主统计', path: '/app/property/room-bind', group: '房产资源统计' },
      { label: '房态统计', path: '/app/property/stats', group: '房产资源统计' }
    ]
  },
  {
    key: 'system', label: '系统管理', icon: 'settings', prefix: '/app/system',
    children: [
      { label: '系统初始化', path: '/app/system/init', group: '系统设置' },
      { label: '操作日志', path: '/app/system/logs', group: '系统设置' },
      { label: '轮播图设置', path: '/app/system/banner', group: '系统设置' },
      { label: '参数设置', path: '/app/system/params', group: '系统设置' },
      { label: '打印模板管理', path: '/app/system/print-template', group: '系统设置' },
      { label: '组织机构', path: '/app/system/org', group: '组织架构' },
      { label: '用户组织设置', path: '/app/system/user-org', group: '组织架构' },
      { label: '员工管理', path: '/app/system/employees', group: '组织架构' },
      { label: '权限管理', path: '/app/system/permission', group: '组织架构' },
      { label: '自定义用户组', path: '/app/system/custom-group', group: '组织架构' },
      { label: '消息接收设置', path: '/app/system/message', group: '消息设置' },
      { label: '合同模板管理', path: '/app/system/contract-template', group: '合同设置' },
      { label: '角色管理', path: '/app/system/roles', group: '角色管理' }
    ]
  }
]
</script>

<template>
  <div class="app-layout" :class="{ collapsed: sidebarCollapsed }">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="8" width="7" height="14" rx="1" fill="#fff"/>
            <rect x="11" y="4" width="7" height="18" rx="1" fill="rgba(255,255,255,0.8)"/>
            <rect x="20" y="10" width="2" height="12" rx="0.5" fill="rgba(255,255,255,0.6)"/>
            <rect x="4" y="2" width="4" height="4" rx="1" fill="rgba(255,255,255,0.6)"/>
          </svg>
        </div>
        <div v-show="!sidebarCollapsed" class="sidebar-logo-text-wrap">
          <div class="sidebar-logo-text">坤煌产业园</div>
          <div class="sidebar-logo-sub">智慧管理平台</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <!-- Dashboard -->
        <router-link to="/app/dashboard" class="nav-item" :class="{ active: isActive('/app/dashboard') }">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </span>
          <span v-show="!sidebarCollapsed" class="nav-label">首页</span>
        </router-link>

        <!-- Nav groups -->
        <div v-for="group in navGroups" :key="group.key" class="nav-group">
          <div
            class="nav-item nav-group-header"
            :class="{ 'group-active': isGroupActive(group.prefix) }"
            @click="toggleGroup(group.key)"
          >
            <span class="nav-icon">
              <!-- Shield icon for access -->
              <svg v-if="group.icon === 'shield'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <!-- Building icon for rental -->
              <svg v-if="group.icon === 'building'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>
              </svg>
              <!-- Megaphone icon for leasing -->
              <svg v-if="group.icon === 'megaphone'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
              </svg>
              <!-- Billing icon -->
              <svg v-if="group.icon === 'billing'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <!-- Finance icon -->
              <svg v-if="group.icon === 'finance'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20M8 15h2M14 15h2"/>
              </svg>
              <!-- Property icon -->
              <svg v-if="group.icon === 'property'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <!-- Settings icon -->
              <svg v-if="group.icon === 'settings'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <!-- Store icon for finlease -->
              <svg v-if="group.icon === 'store'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><path d="M3 9l1.5-5h15L21 9"/><path d="M12 9v12"/>
              </svg>
              <!-- Invoice icon for 票通发票 -->
              <svg v-if="group.icon === 'invoice'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
            </span>
            <span v-show="!sidebarCollapsed" class="nav-label">{{ group.label }}</span>
            <span v-show="!sidebarCollapsed" class="nav-chevron" :class="{ expanded: expandedGroups[group.key] }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>
          <Transition name="expand">
            <div v-show="expandedGroups[group.key] && !sidebarCollapsed" class="nav-children">
              <router-link
                v-for="child in group.children"
                :key="child.path"
                :to="child.path"
                class="nav-item nav-child"
                :class="{ active: isActive(child.path) }"
              >
                <span class="nav-dot"></span>
                <span class="nav-label">{{ child.label }}</span>
              </router-link>
            </div>
          </Transition>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="collapse-btn" @click="toggleSidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: sidebarCollapsed ? 'rotate(180deg)' : '' }">
            <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
          </svg>
          <span v-show="!sidebarCollapsed">收起菜单</span>
        </button>
      </div>
    </aside>

    <!-- Header -->
    <header class="app-header" :class="{ collapsed: sidebarCollapsed }">
      <div class="header-left">
        <div class="header-breadcrumb">
          <template v-for="(crumb, idx) in breadcrumb" :key="idx">
            <span :class="{ 'breadcrumb-current': idx === breadcrumb.length - 1 }">{{ crumb }}</span>
            <span v-if="idx < breadcrumb.length - 1" class="breadcrumb-sep">/</span>
          </template>
        </div>
      </div>
      <div class="header-right">
        <button class="header-action notification-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
        </button>
        <div class="header-user">
          <div class="header-avatar">管</div>
          <span class="header-username">物业管理员</span>
        </div>
        <button class="header-action logout-btn" title="退出登录" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Content -->
    <main class="app-main" :class="{ collapsed: sidebarCollapsed }">
      <router-view />
    </main>

    <ToastContainer />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.25s ease;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 8px;
  flex-shrink: 0;
}

.sidebar-logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563eb, #0891b2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-logo-text-wrap {
  overflow: hidden;
  white-space: nowrap;
}

.sidebar-logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.sidebar-logo-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  margin-top: 1px;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 4px 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  margin-bottom: 2px;
  user-select: none;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.nav-item.active {
  background: #2563eb;
  color: #fff;
  font-weight: 500;
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-group-header {
  justify-content: flex-start;
}

.nav-group-header.group-active {
  color: rgba(255, 255, 255, 0.9);
}

.nav-chevron {
  margin-left: auto;
  display: flex;
  align-items: center;
  transition: transform 0.25s ease;
  flex-shrink: 0;
}

.nav-chevron.expanded {
  transform: rotate(180deg);
}

.nav-children {
  overflow: hidden;
}

.nav-child {
  padding-left: 42px;
  font-size: 13px;
}

.nav-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.nav-child.active .nav-dot {
  background: #fff;
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Sidebar footer */
.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.collapse-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  white-space: nowrap;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
}

/* Header */
.app-header {
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 90;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: left 0.25s ease;
}

.app-header.collapsed {
  left: 64px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9ca3af;
}

.breadcrumb-current {
  color: #111827;
  font-weight: 500;
}

.breadcrumb-sep {
  color: #d1d5db;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-action {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #6b7280;
  background: transparent;
  position: relative;
  border: none;
}

.header-action:hover {
  background: #f3f4f6;
  color: #374151;
}

.notification-btn .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  background: #dc2626;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #fff;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.header-user:hover {
  background: #f3f4f6;
}

.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #0891b2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.header-username {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

/* Main content */
.app-main {
  margin-left: 240px;
  margin-top: 60px;
  padding: 24px;
  min-height: calc(100vh - 60px);
  background: #f1f5f9;
  transition: margin-left 0.25s ease;
}

.app-main.collapsed {
  margin-left: 64px;
}
</style>
