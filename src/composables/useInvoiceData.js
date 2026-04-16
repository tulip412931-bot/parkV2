import { ref } from 'vue'

export const COMPANIES = [
  '重庆腾讯信息技术有限公司',
  '重庆百度科技有限公司',
  '重庆京东科技有限公司',
  '四川华为技术有限公司',
  '成都阿里巴巴科技有限公司',
  '重庆美团信息技术有限公司',
  '重庆字节跳动科技有限公司',
  '贵州茅台酒股份有限公司',
  '重庆长安汽车股份有限公司',
  '重庆小米通讯技术有限公司',
  '重庆网易科技有限公司',
  '重庆中建三局有限公司'
]

export const PRODUCTS = [
  { name: '*信息技术服务*软件开发服务费', spec: '', unit: '项', price: 15000, rate: 6 },
  { name: '*信息技术服务*技术咨询服务费', spec: '', unit: '次', price: 8000, rate: 6 },
  { name: '*信息技术服务*云计算服务费', spec: '标准版', unit: '月', price: 3600, rate: 6 },
  { name: '*现代服务*企业管理咨询费', spec: '', unit: '项', price: 25000, rate: 6 },
  { name: '*电子产品*笔记本电脑', spec: 'ThinkPad T14', unit: '台', price: 6599, rate: 13 },
  { name: '*电子产品*打印机', spec: 'HP M281', unit: '台', price: 2899, rate: 13 },
  { name: '*办公用品*办公桌椅', spec: '标准款', unit: '套', price: 1580, rate: 13 },
  { name: '*办公用品*A4打印纸', spec: '80g/500张', unit: '箱', price: 128, rate: 13 }
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)]
}

function padCode(n, len) {
  return String(n).padStart(len, '0')
}

export function fmt(n) {
  return '¥' + Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function numToCN(n) {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const intUnits = ['', '拾', '佰', '仟']
  const bigUnits = ['', '万', '亿']

  if (n === 0) return '零元整'

  const num = Math.round(n * 100)
  const intPart = Math.floor(num / 100)
  const decPart = num % 100
  const jiao = Math.floor(decPart / 10)
  const fen = decPart % 10

  let result = ''

  if (intPart > 0) {
    const intStr = String(intPart)
    const len = intStr.length
    const groups = []
    for (let i = len; i > 0; i -= 4) {
      const start = Math.max(0, i - 4)
      groups.unshift(intStr.slice(start, i))
    }

    for (let g = 0; g < groups.length; g++) {
      const group = groups[g]
      const bigIdx = groups.length - 1 - g
      let groupStr = ''
      let zeroFlag = false

      for (let i = 0; i < group.length; i++) {
        const d = parseInt(group[i])
        const unitIdx = group.length - 1 - i
        if (d === 0) {
          zeroFlag = true
        } else {
          if (zeroFlag) {
            groupStr += '零'
            zeroFlag = false
          }
          groupStr += digits[d] + intUnits[unitIdx]
        }
      }

      if (groupStr) {
        result += groupStr + bigUnits[bigIdx]
      }
    }

    result += '元'
  }

  if (jiao === 0 && fen === 0) {
    result += '整'
  } else {
    if (jiao > 0) {
      result += digits[jiao] + '角'
    } else if (intPart > 0) {
      result += '零'
    }
    if (fen > 0) {
      result += digits[fen] + '分'
    }
  }

  return result
}

export function generateInvoices(n = 50) {
  const invoices = []
  const now = new Date()

  for (let i = 0; i < n; i++) {
    const product = pick(PRODUCTS)
    const qty = randInt(1, 5)
    const amount = +(product.price * qty / (1 + product.rate / 100)).toFixed(2)
    const tax = +(product.price * qty - amount).toFixed(2)
    const total = +(amount + tax).toFixed(2)

    const daysAgo = randInt(0, 365)
    const date = new Date(now.getTime() - daysAgo * 86400000)
    const dateStr = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0')

    const rand = Math.random()
    let status, statusColor
    if (rand < 0.8) {
      status = '正常'
      statusColor = 'green'
    } else if (rand < 0.9) {
      status = '已作废'
      statusColor = 'red'
    } else {
      status = '已冲红'
      statusColor = 'orange'
    }

    invoices.push({
      id: i + 1,
      code: '050003' + padCode(randInt(500000, 999999), 6),
      num: padCode(randInt(10000000, 99999999), 8),
      date: dateStr,
      buyer: pick(COMPANIES),
      product: product.name,
      qty,
      unitPrice: product.price,
      rate: product.rate,
      amount,
      tax,
      total,
      status,
      statusColor
    })
  }

  invoices.sort((a, b) => b.date.localeCompare(a.date))
  return invoices
}

export function useInvoiceData() {
  const invoices = ref(generateInvoices(50))

  function refresh(n = 50) {
    invoices.value = generateInvoices(n)
  }

  return {
    invoices,
    refresh,
    COMPANIES,
    PRODUCTS,
    fmt,
    numToCN,
    generateInvoices
  }
}
