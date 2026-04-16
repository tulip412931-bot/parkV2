import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/app',
    component: () => import('@/components/AppLayout.vue'),
    redirect: '/app/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: '首页', breadcrumb: ['首页'] }
      },
      // 收费管理
      {
        path: 'billing/dashboard',
        name: 'BillingDashboard',
        component: () => import('@/views/billing/BillingDashboardView.vue'),
        meta: { title: '收费看板', breadcrumb: ['收费管理', '收费看板'] }
      },
      {
        path: 'billing/center',
        name: 'ChargeCenter',
        component: () => import('@/views/billing/ChargeCenterView.vue'),
        meta: { title: '收费中心', breadcrumb: ['收费管理', '收费中心'] }
      },
      {
        path: 'billing/bills',
        name: 'BillManage',
        component: () => import('@/views/billing/BillManageView.vue'),
        meta: { title: '账单管理', breadcrumb: ['收费管理', '账单管理'] }
      },
      {
        path: 'billing/history',
        name: 'ChargeHistory',
        component: () => import('@/views/billing/ChargeHistoryView.vue'),
        meta: { title: '收费历史记录', breadcrumb: ['收费管理', '收费历史记录'] }
      },
      {
        path: 'billing/settings',
        name: 'ChargeSettings',
        component: () => import('@/views/billing/ChargeSettingsView.vue'),
        meta: { title: '收费项目定义', breadcrumb: ['收费管理', '收费项目定义'] }
      },
      // 招商租赁（财务租赁模块）
      {
        path: 'finlease/properties',
        name: 'LeaseProperty',
        component: () => import('@/views/finlease/LeasePropertyView.vue'),
        meta: { title: '租赁房源管理', breadcrumb: ['招商租赁', '租赁房源管理'] }
      },
      {
        path: 'finlease/negotiation',
        name: 'LeaseNegotiation',
        component: () => import('@/views/finlease/LeaseNegotiationView.vue'),
        meta: { title: '洽谈与合同', breadcrumb: ['招商租赁', '洽谈与合同'] }
      },
      {
        path: 'finlease/orders',
        name: 'LeaseOrder',
        component: () => import('@/views/finlease/LeaseOrderView.vue'),
        meta: { title: '租售订单管理', breadcrumb: ['招商租赁', '租售订单管理'] }
      },
      {
        path: 'finlease/report',
        name: 'LeaseReport',
        component: () => import('@/views/finlease/LeaseReportView.vue'),
        meta: { title: '租售统计报表', breadcrumb: ['招商租赁', '租售统计报表'] }
      },
      // 财务管理
      {
        path: 'finance/report',
        name: 'FinanceReport',
        component: () => import('@/views/finance/FinanceReportView.vue'),
        meta: { title: '综合报表', breadcrumb: ['财务管理', '综合报表'] }
      },
      {
        path: 'finance/receivable',
        name: 'Receivable',
        component: () => import('@/views/finance/ReceivableView.vue'),
        meta: { title: '应收月度统计', breadcrumb: ['财务管理', '应收月度统计'] }
      },
      {
        path: 'finance/collection',
        name: 'CollectionDaily',
        component: () => import('@/views/finance/CollectionDailyView.vue'),
        meta: { title: '已收费用日报', breadcrumb: ['财务管理', '已收费用日报'] }
      },
      {
        path: 'finance/arrears',
        name: 'Arrears',
        component: () => import('@/views/finance/ArrearsView.vue'),
        meta: { title: '欠费统计', breadcrumb: ['财务管理', '欠费统计'] }
      },
      // 门禁管理
      {
        path: 'access/employee',
        name: 'EmployeeAccess',
        component: () => import('@/views/access/EmployeeAccessView.vue'),
        meta: { title: '员工通行管理', breadcrumb: ['门禁管理', '员工通行管理'] }
      },
      {
        path: 'access/visitor',
        name: 'VisitorAccess',
        component: () => import('@/views/access/VisitorAccessView.vue'),
        meta: { title: '访客通行管理', breadcrumb: ['门禁管理', '访客通行管理'] }
      },
      {
        path: 'access/records',
        name: 'AccessRecords',
        component: () => import('@/views/access/AccessRecordsView.vue'),
        meta: { title: '门禁记录与统计', breadcrumb: ['门禁管理', '门禁记录与统计'] }
      },
      // 租售板块
      {
        path: 'rental/properties',
        name: 'RentalProperties',
        component: () => import('@/views/rental/RentalPropertiesView.vue'),
        meta: { title: '房源信息管理', breadcrumb: ['租售板块', '房源信息管理'] }
      },
      {
        path: 'rental/intention',
        name: 'RentalIntention',
        component: () => import('@/views/rental/RentalIntentionView.vue'),
        meta: { title: '租售意向管理', breadcrumb: ['租售板块', '租售意向管理'] }
      },
      {
        path: 'rental/orders',
        name: 'RentalOrders',
        component: () => import('@/views/rental/RentalOrdersView.vue'),
        meta: { title: '租售订单管理', breadcrumb: ['租售板块', '租售订单管理'] }
      },
      {
        path: 'rental/stats',
        name: 'RentalStats',
        component: () => import('@/views/rental/RentalStatsView.vue'),
        meta: { title: '租售数据统计', breadcrumb: ['租售板块', '租售数据统计'] }
      },
      // 招租板块
      {
        path: 'leasing/properties',
        name: 'LeasingProperties',
        component: () => import('@/views/leasing/LeasingPropertiesView.vue'),
        meta: { title: '招租房源管理', breadcrumb: ['招租板块', '招租房源管理'] }
      },
      {
        path: 'leasing/leads',
        name: 'LeasingLeads',
        component: () => import('@/views/leasing/LeasingLeadsView.vue'),
        meta: { title: '招商线索管理', breadcrumb: ['招租板块', '招商线索管理'] }
      },
      {
        path: 'leasing/matching',
        name: 'LeasingMatching',
        component: () => import('@/views/leasing/LeasingMatchingView.vue'),
        meta: { title: '招商智能匹配', breadcrumb: ['招租板块', '招商智能匹配'] }
      },
      {
        path: 'leasing/progress',
        name: 'LeasingProgress',
        component: () => import('@/views/leasing/LeasingProgressView.vue'),
        meta: { title: '招商进度管理', breadcrumb: ['招租板块', '招商进度管理'] }
      },
      {
        path: 'leasing/stats',
        name: 'LeasingStats',
        component: () => import('@/views/leasing/LeasingStatsView.vue'),
        meta: { title: '招商数据分析', breadcrumb: ['招租板块', '招商数据分析'] }
      },
      // 房产资源
      {
        path: 'property/resources',
        name: 'PropertyResource',
        component: () => import('@/views/property/PropertyResourceView.vue'),
        meta: { title: '物业资源管理', breadcrumb: ['房产资源', '物业资源管理'] }
      },
      {
        path: 'property/types',
        name: 'ResourceType',
        component: () => import('@/views/property/ResourceTypeView.vue'),
        meta: { title: '资源类型管理', breadcrumb: ['房产资源', '资源类型管理'] }
      },
      {
        path: 'property/stats',
        name: 'PropertyStats',
        component: () => import('@/views/property/PropertyStatsView.vue'),
        meta: { title: '房态统计', breadcrumb: ['房产资源', '房态统计'] }
      },
      // 系统管理
      {
        path: 'system/employees',
        name: 'EmployeeManage',
        component: () => import('@/views/system/EmployeeManageView.vue'),
        meta: { title: '员工管理', breadcrumb: ['系统管理', '员工管理'] }
      },
      {
        path: 'system/org',
        name: 'OrgStructure',
        component: () => import('@/views/system/OrgStructureView.vue'),
        meta: { title: '组织机构', breadcrumb: ['系统管理', '组织机构'] }
      },
      {
        path: 'system/roles',
        name: 'RoleManage',
        component: () => import('@/views/system/RoleManageView.vue'),
        meta: { title: '角色管理', breadcrumb: ['系统管理', '角色管理'] }
      },
      {
        path: 'system/logs',
        name: 'OperationLog',
        component: () => import('@/views/system/OperationLogView.vue'),
        meta: { title: '操作日志', breadcrumb: ['系统管理', '操作日志'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
