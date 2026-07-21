import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DeptEmployeeSelect from '../../components/business/DeptEmployeeSelect';
import { TeaCategory, OrderStatus } from '../../types';
import type { CustomerItem } from '../../types';
import { getSalesDefaultPrice, getPersonalMinPrice } from '../../data/prices';
import { teaProducts } from '../../data/teaProducts';
import { getEmployeeName } from '../../data/organization';
import { customerItems, CUSTOMER_TYPE_LABELS as GLOBAL_CUSTOMER_LABELS, generateOrderContactId } from '../../data/customers';
import { platformItems } from '../../data/platforms';
import { streamers } from '../../data/streamers';
import { generateCustomerCode } from '../../utils/customerCode';
import { orderData, type SalesOrderRecord } from './SalesOrders';

/* ── 工具函数 ── */
function categoryToTeaCategory(category: string): TeaCategory {
  const prefix = category.split('-')[0];
  const map: Record<string, TeaCategory> = {
    '绿茶': TeaCategory.GREEN, '红茶': TeaCategory.RED, '青茶': TeaCategory.OOLONG,
    '白茶': TeaCategory.WHITE, '黄茶': TeaCategory.YELLOW, '黑茶': TeaCategory.DARK,
    '花草茶': TeaCategory.FLOWER,
  };
  return map[prefix] ?? TeaCategory.GREEN;
}

function formatMoney(n: number): string {
  return `¥${n.toLocaleString('en-US')}`;
}

/* 价格来源标签 */
const SOURCE_LABELS: Record<'vip' | 'sales' | 'market', string> = {
  vip: 'VIP', sales: '销售', market: '市场',
};
const SOURCE_COLORS: Record<'vip' | 'sales' | 'market', string> = {
  vip: '#CB405D', sales: 'var(--color-module-current-base)', market: 'var(--color-text-tertiary)',
};

/* ── 客户类型 ── */
type CustomerType = 'direct' | 'channel' | 'personal' | 'platform' | 'guest';

const CUSTOMER_TYPE_DROPDOWN_OPTIONS: { value: CustomerType; label: string }[] = [
  { value: 'direct', label: '直营客户（企业）' },
  { value: 'channel', label: '渠道客户（企业）' },
  { value: 'personal', label: '个人客户' },
  { value: 'platform', label: '平台客户' },
  { value: 'guest', label: '游客客户' },
];

export default function SalesOrderCreate() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  // 基础订单字段
  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [actualSalesPrice, setActualSalesPrice] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [remark, setRemark] = useState('');
  const [contactSelect, setContactSelect] = useState<string>('');

  // 客户搜索与选择
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerType, setCustomerType] = useState<CustomerType | ''>('');
  const [newCustomerShortName, setNewCustomerShortName] = useState('');

  // 跟单人 / 带货人
  const [followerId, setFollowerId] = useState('');
  const [streamerId, setStreamerId] = useState('');

  // 计算下一个订单编号
  const nextNumber = useMemo(() => {
    const maxNum = orderData.reduce((max, o) => {
      const num = parseInt(o.code.split('-').pop() || '0', 10);
      return num > max ? num : max;
    }, 0);
    return maxNum + 1;
  }, []);

  // 构建客户选项列表
  const allCustomerOptions = useMemo(() => {
    const customers = customerItems.map(c => ({ id: c.id, name: c.shortName || c.name, type: c.type }));
    const platforms = platformItems.map(p => ({ id: p.id, name: p.shortName || p.name, type: 'platform' as const }));
    return [...customers, ...platforms];
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return allCustomerOptions;
    return allCustomerOptions.filter(c => c.name.includes(customerSearch));
  }, [customerSearch, allCustomerOptions]);

  const handleSelectCustomer = (selectedId: string) => {
    if (selectedId === 'new') {
      setIsNewCustomer(true);
      setCustomerId('');
      setCustomerType('');
      setNewCustomerShortName('');
    } else {
      setIsNewCustomer(false);
      setCustomerId(selectedId);
      const selected = allCustomerOptions.find(c => c.id === selectedId);
      if (selected) {
        setCustomerType(selected.type);
      }
    }
    setShowCustomerDropdown(false);
    setCustomerSearch('');
  };

  const handleClearCustomer = () => {
    setCustomerId('');
    setIsNewCustomer(false);
    setCustomerType('');
    setNewCustomerShortName('');
    setCustomerSearch('');
    setShowCustomerDropdown(false);
  };

  // 选中客户的详细信息
  const selectedCustomerInfo = useMemo(() => {
    if (!customerId || isNewCustomer) return null;
    const customer = customerItems.find(c => c.id === customerId);
    if (customer) {
      const hostName = customer.hostId
        ? (customer.hostType === 'streamer' ? streamers.find(s => s.id === customer.hostId)?.name : getEmployeeName(customer.hostId))
        : undefined;
      return { hostName: hostName ?? '—', contactPerson: customer.contactPerson || '—', contactPhone: customer.contactPhone || '—', level: customer.level || '—' };
    }
    const platform = platformItems.find(p => p.id === customerId);
    if (platform) {
      const hostName = platform.hostId
        ? (platform.hostType === 'streamer' ? streamers.find(s => s.id === platform.hostId)?.name : getEmployeeName(platform.hostId))
        : undefined;
      return { hostName: hostName ?? '—', contactPerson: platform.contactPerson || '—', contactPhone: platform.contactPhone || '—', level: '—' };
    }
    return null;
  }, [customerId, isNewCustomer]);

  const selectedCustomer = useMemo(() => customerItems.find(c => c.id === customerId) || null, [customerId]);
  const isDirectCustomer = selectedCustomer?.type === 'direct';
  const orderContactOptions = selectedCustomer?.orderContacts || [];

  const selectedProduct = teaProducts.find(p => p.id === productId);
  const marketPrice = selectedProduct?.marketPrice ?? 0;
  const hasCustomer = !!(customerId || isNewCustomer);
  const defaultResult = productId && hasCustomer
    ? (customerId ? getSalesDefaultPrice(productId, customerId) : { price: selectedProduct?.salesPrice || marketPrice, source: 'sales' as const })
    : null;
  const defaultPrice = defaultResult?.price ?? 0;
  const priceSource = defaultResult?.source ?? 'market';

  // 销售实价自动带出默认价
  useEffect(() => {
    if (productId && hasCustomer) {
      if (customerId) {
        const { price } = getSalesDefaultPrice(productId, customerId);
        setActualSalesPrice(String(price));
      } else {
        setActualSalesPrice(String(selectedProduct?.salesPrice || marketPrice));
      }
    } else {
      setActualSalesPrice('');
    }
  }, [productId, customerId, isNewCustomer]);

  // 直营客户下单人联动
  useEffect(() => {
    setContactSelect('');
    if (isDirectCustomer && orderContactOptions.length === 1) {
      const only = orderContactOptions[0];
      setContactSelect(only.id);
      setContactPerson(only.name);
      setContactPhone(only.phone || '');
      setDeliveryAddress(only.address || '');
    }
  }, [customerId]);

  const handleContactSelectChange = (id: string) => {
    setContactSelect(id);
    if (id === 'new') {
      setContactPerson('');
      setContactPhone('');
      setDeliveryAddress('');
    } else {
      const contact = orderContactOptions.find(c => c.id === id);
      if (contact) {
        setContactPerson(contact.name);
        setContactPhone(contact.phone || '');
        setDeliveryAddress(contact.address || '');
      }
    }
  };

  const qtyNum = Number(quantity) || 0;
  const actualNum = Number(actualSalesPrice) || 0;
  const amountNum = qtyNum * actualNum;

  // 个人客户最低销售价校验：销售实价不得低于该客户等级对应的最低销售价
  const personalMinPrice = useMemo(() => {
    if (!isNewCustomer && customerId && selectedCustomer?.type === 'personal' && productId) {
      return getPersonalMinPrice(productId, selectedCustomer.level || 'C级');
    }
    return 0;
  }, [isNewCustomer, customerId, selectedCustomer, productId]);
  const isBelowMinPrice = personalMinPrice > 0 && actualNum < personalMinPrice;

  const canSave = (isNewCustomer ? (!!customerType && !!newCustomerShortName.trim()) : !!customerId) && !!productId && qtyNum > 0 && actualNum > 0 && !!orderDate && !isBelowMinPrice;

  const getScenarioByType = (type: CustomerType): number => {
    const map: Record<CustomerType, number> = { direct: 1, channel: 3, personal: 4, platform: 5, guest: 6 };
    return map[type];
  };

  const handleReset = () => {
    setCustomerId(''); setProductId(''); setQuantity(''); setActualSalesPrice('');
    setContactPerson(''); setContactPhone(''); setDeliveryAddress(''); setRemark('');
    setContactSelect(''); setCustomerSearch(''); setShowCustomerDropdown(false);
    setIsNewCustomer(false); setCustomerType(''); setNewCustomerShortName('');
    setFollowerId(''); setStreamerId('');
    setOrderDate(new Date().toISOString().slice(0, 10));
  };

  const handleSave = () => {
    if (!canSave || !selectedProduct) return;
    if (isNewCustomer && !customerType) return;
    const now = new Date();
    const timeStr = `${orderDate} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const customerName = isNewCustomer
      ? newCustomerShortName.trim()
      : (allCustomerOptions.find(c => c.id === customerId)?.name ?? '新客户');
    const followerName = followerId ? getEmployeeName(followerId) : undefined;
    const streamerName = streamerId ? streamers.find(s => s.id === streamerId)?.name : undefined;

    let orderHostId: string | undefined;
    let orderHostType: 'employee' | 'streamer' | undefined;
    let orderHostName: string | undefined;
    if (isNewCustomer) {
      const newCustId = `c_${Date.now()}`;
      const newCustomer: CustomerItem = {
        id: newCustId,
        name: newCustomerShortName.trim(),
        shortName: newCustomerShortName.trim(),
        customerCode: generateCustomerCode(customerType as CustomerType, newCustomerShortName.trim(), customerItems.length + 1),
        type: customerType as CustomerType,
        region: '', province: '', city: '', district: '',
        contactPerson: contactPerson || '', contactPhone: contactPhone || '', contactEmail: '', contactAddress: deliveryAddress || '',
        level: 'B级', orders: 1, totalAmount: amountNum, platformIds: [],
        cooperationDate: orderDate, status: 'active',
        settlementMethod: '月结', taxNo: '', source: '线上咨询', remark: '由销售订单新增',
        bankAccounts: [], invoiceInfos: [],
      };
      customerItems.push(newCustomer);
    } else {
      const customer = customerItems.find(c => c.id === customerId);
      if (customer) {
        orderHostId = customer.hostId;
        orderHostType = customer.hostType;
        orderHostName = customer.hostId
          ? (customer.hostType === 'streamer' ? streamers.find(s => s.id === customer.hostId)?.name : getEmployeeName(customer.hostId))
          : undefined;

        if (isDirectCustomer && contactPerson && !orderContactOptions.find(c => c.name === contactPerson)) {
          const newContact = {
            id: generateOrderContactId(customer.id, (customer.orderContacts?.length || 0) + 1),
            name: contactPerson,
            phone: contactPhone || undefined,
            address: deliveryAddress || undefined,
            remark: '由销售订单自动添加',
            autoCreated: true,
          };
          if (!customer.orderContacts) customer.orderContacts = [];
          customer.orderContacts.push(newContact);
        }
      } else {
        const platform = platformItems.find(p => p.id === customerId);
        if (platform) {
          orderHostId = platform.hostId;
          orderHostType = platform.hostType;
          orderHostName = platform.hostId
            ? (platform.hostType === 'streamer' ? streamers.find(s => s.id === platform.hostId)?.name : getEmployeeName(platform.hostId))
            : undefined;
        }
      }
    }

    const order: SalesOrderRecord = {
      id: `so_${Date.now()}`,
      code: `SO-2025-${String(nextNumber).padStart(4, '0')}`,
      customer: customerName,
      customerType: customerType as CustomerType,
      product: selectedProduct.name,
      teaCategory: categoryToTeaCategory(selectedProduct.category),
      quantity: `${qtyNum} ${selectedProduct.packageUnit}`,
      unitPrice: `¥${actualNum}/${selectedProduct.packageUnit}`,
      amount: formatMoney(amountNum),
      date: orderDate,
      status: OrderStatus.PENDING,
      contactPerson: contactPerson || '—',
      contactPhone: contactPhone || '—',
      deliveryAddress: deliveryAddress || '—',
      remark,
      followerId: followerId || undefined,
      followerName,
      streamerId: streamerId || undefined,
      streamerName,
      hostId: orderHostId,
      hostType: orderHostType,
      hostName: orderHostName,
      scenario: getScenarioByType(customerType as CustomerType),
      products: [{
        productId: selectedProduct.id,
        name: `${selectedProduct.name} — ${selectedProduct.grade}`,
        teaCategory: categoryToTeaCategory(selectedProduct.category),
        quantity: `${qtyNum} ${selectedProduct.packageUnit}`,
        marketPrice,
        defaultPrice,
        actualSalesPrice: actualNum,
        priceSource,
        amount: formatMoney(amountNum),
      }],
      timeline: [{ time: timeStr, event: '客户下单', operator: '系统' }],
    };
    orderData.unshift(order);
    setSaved(true);
  };

  // 保存成功后的提示条
  if (saved) {
    return (
      <>
        <ContentHeader title="销售下单" breadcrumbs={['销售', '销售下单']} />
        <div className="content-body">
          <Card style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <svg viewBox="0 0 48 48" fill="none" style={{ width: 56, height: 56, margin: '0 auto' }}>
                <circle cx="24" cy="24" r="22" fill="#E8F5E9" />
                <path d="M16 24l6 6 12-12" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>下单成功</h2>
            <p style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-6)' }}>
              销售订单已创建，订单编号 <span className="mono" style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-module-current-base)' }}>SO-2025-{String(nextNumber).padStart(4, '0')}</span>
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <Button variant="ghost" onClick={() => { handleReset(); setSaved(false); }}>继续下单</Button>
              <Button onClick={() => navigate('/sales/sales-orders')}>查看订单列表</Button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  const readOnlyPriceStyle: React.CSSProperties = {
    height: 34, display: 'flex', alignItems: 'center', padding: '0 var(--space-3)',
    border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg-tertiary)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
  };

  return (
    <>
      <ContentHeader
        title="销售下单"
        breadcrumbs={['销售', '销售下单']}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="ghost" onClick={() => navigate('/sales/sales-orders')}>返回订单列表</Button>
          </div>
        }
      />
      <div className="content-body">
        <Card style={{ padding: 'var(--space-6)' }}>
          {/* 客户与商品 */}
          <div className="drawer-section-title">客户与商品</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 2 }}>
              <label className="drawer-label">选择客户 *</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="filter-input"
                  style={{ width: '100%', paddingRight: 28 }}
                  value={isNewCustomer ? '新客户' : (allCustomerOptions.find(c => c.id === customerId)?.name || customerSearch)}
                  onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); if (e.target.value === '') { setCustomerId(''); setIsNewCustomer(false); } }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  placeholder="搜索或选择客户"
                />
                {(customerId || isNewCustomer || customerSearch) && (
                  <button type="button" onClick={handleClearCustomer} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-neutral-400)', fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
                )}
                {showCustomerDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: 240, overflowY: 'auto', background: '#fff', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '8px 12px', cursor: 'pointer', fontWeight: 500, color: '#0F64B5', borderBottom: '1px solid var(--color-border-secondary)' }} onClick={() => handleSelectCustomer('new')}>+ 新客户</div>
                    {filteredCustomers.map(c => (
                      <div key={c.id} style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => handleSelectCustomer(c.id)}>
                        <span>{c.name}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{GLOBAL_CUSTOMER_LABELS[c.type]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {isNewCustomer && (
              <div className="drawer-form-field">
                <label className="drawer-label">客户类型 *</label>
                <select className="filter-select" style={{ width: '100%' }} value={customerType} onChange={(e) => setCustomerType(e.target.value as CustomerType)}>
                  <option value="">请选择客户类型</option>
                  {CUSTOMER_TYPE_DROPDOWN_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            )}
          </div>
          {isNewCustomer && (
            <div className="drawer-form-row">
              <div className="drawer-form-field">
                <label className="drawer-label">客户简称 *</label>
                <input className="filter-input" style={{ width: '100%' }} value={newCustomerShortName} onChange={(e) => setNewCustomerShortName(e.target.value)} placeholder="请输入客户简称（将同步至客户管理）" />
              </div>
            </div>
          )}
          {selectedCustomerInfo && (
            <div style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-module-current-lightest)', border: '1px solid var(--color-module-current-light)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>主办人：</span><span style={{ fontWeight: 'var(--font-medium)' }}>{selectedCustomerInfo.hostName}</span></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>联系人：</span>{selectedCustomerInfo.contactPerson}</div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>联系电话：</span>{selectedCustomerInfo.contactPhone}</div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>等级：</span>{selectedCustomerInfo.level}</div>
            </div>
          )}

          {isDirectCustomer && (
            <div className="drawer-form-row">
              <div className="drawer-form-field">
                <label className="drawer-label">下单人</label>
                <select className="filter-select" style={{ width: '100%' }} value={contactSelect} onChange={(e) => handleContactSelectChange(e.target.value)}>
                  <option value="">请选择下单人</option>
                  {orderContactOptions.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.department ? `(${c.department})` : ''}</option>
                  ))}
                  <option value="new">+ 新增收件人</option>
                </select>
              </div>
            </div>
          )}
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">商品 *</label>
              <select className="filter-select" style={{ width: '100%' }} value={productId} onChange={(e) => setProductId(e.target.value)}>
                <option value="">请选择商品</option>
                {teaProducts.map((p) => <option key={p.id} value={p.id}>{p.name}（{p.brand}）</option>)}
              </select>
            </div>
          </div>
          {selectedProduct && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
              规格：{selectedProduct.spec} · 品牌：{selectedProduct.brand} · 包装单位：{selectedProduct.packageUnit}
            </div>
          )}

          {/* 价格信息 */}
          <div className="drawer-section-title">价格信息</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div>
              <label className="drawer-label">市场价</label>
              <div style={readOnlyPriceStyle} className="mono">{marketPrice ? formatMoney(marketPrice) : '—'}</div>
            </div>
            <div>
              <label className="drawer-label">默认价（带来源）</label>
              <div style={{ ...readOnlyPriceStyle, gap: 'var(--space-2)' }}>
                <span className="mono">{defaultPrice ? formatMoney(defaultPrice) : '—'}</span>
                {defaultPrice > 0 && (
                  <span style={{
                    padding: '0 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                    background: 'var(--color-neutral-0)', color: SOURCE_COLORS[priceSource], border: `1px solid ${SOURCE_COLORS[priceSource]}30`,
                  }}>{SOURCE_LABELS[priceSource]}</span>
                )}
              </div>
            </div>
            <div>
              <label className="drawer-label">销售实价（可调整）*</label>
              <input
                type="number"
                className="filter-input"
                style={{
                  width: '100%', height: 34,
                  borderColor: isBelowMinPrice ? '#CB405D' : 'var(--color-module-current-base)',
                  background: 'var(--color-module-current-lightest)',
                  fontWeight: 'var(--font-semibold)',
                  color: isBelowMinPrice ? '#CB405D' : 'var(--color-module-current-base)',
                }}
                value={actualSalesPrice}
                onChange={(e) => setActualSalesPrice(e.target.value)}
                placeholder="0"
                disabled={!productId || !hasCustomer}
              />
              {personalMinPrice > 0 && (
                <div style={{ fontSize: 'var(--text-xs)', marginTop: 4, color: isBelowMinPrice ? '#CB405D' : 'var(--color-text-tertiary)' }}>
                  {isBelowMinPrice
                    ? `⚠ 销售实价不得低于该客户等级（${selectedCustomer?.level}）最低销售价 ${formatMoney(personalMinPrice)}`
                    : `该客户等级（${selectedCustomer?.level}）最低销售价：${formatMoney(personalMinPrice)}`}
                </div>
              )}
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">数量 *</label>
              <input
                type="number"
                className="filter-input"
                style={{ width: '100%' }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="请输入数量"
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">金额（自动计算）</label>
              <div
                className="mono"
                style={{
                  height: 34, display: 'flex', alignItems: 'center', padding: '0 var(--space-3)',
                  border: '1px solid var(--color-module-current-base)', borderRadius: 'var(--radius-md)',
                  background: 'var(--color-module-current-lightest)', fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-bold)', color: 'var(--color-module-current-base)',
                }}
              >
                {amountNum > 0 ? formatMoney(amountNum) : '—'}
              </div>
            </div>
          </div>

          {/* 订单信息 */}
          <div className="drawer-section-title">订单信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">下单日期 *</label>
              <input type="date" className="filter-input" style={{ width: '100%' }} value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">联系人</label>
              <input className="filter-input" style={{ width: '100%' }} value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="请输入联系人" />
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">跟单人</label>
              <DeptEmployeeSelect value={followerId} onChange={setFollowerId} placeholder="选择员工" style={{ width: '100%' }} />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">带货人</label>
              <select className="filter-select" style={{ width: '100%' }} value={streamerId} onChange={(e) => setStreamerId(e.target.value)}>
                <option value="">请选择带货人</option>
                {streamers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">联系电话</label>
              <input className="filter-input" style={{ width: '100%' }} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="请输入联系电话" />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">收货地址</label>
              <input className="filter-input" style={{ width: '100%' }} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="请输入收货地址" />
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 1 }}>
              <label className="drawer-label">备注</label>
              <input className="filter-input" style={{ width: '100%' }} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="选填" />
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-secondary)' }}>
            <Button variant="ghost" onClick={handleReset}>重置</Button>
            <Button onClick={handleSave} disabled={!canSave}>确认下单</Button>
          </div>
        </Card>
      </div>
    </>
  );
}
