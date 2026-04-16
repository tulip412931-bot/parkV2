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
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
