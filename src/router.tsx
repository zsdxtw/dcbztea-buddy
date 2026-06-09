import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/ContentArea';

/* ── 页面组件 ── */
import DashboardOverview from './pages/dashboard/DashboardOverview';
import DashboardTodo from './pages/dashboard/DashboardTodo';
import DashboardShortcuts from './pages/dashboard/DashboardShortcuts';
import DashboardNotifications from './pages/dashboard/DashboardNotifications';
import DashboardOperationLog from './pages/dashboard/DashboardOperationLog';

import PurchaseOverview from './pages/purchase/PurchaseOverview';
import PurchaseOrders from './pages/purchase/PurchaseOrders';
import PurchaseInbound from './pages/purchase/PurchaseInbound';
import PurchaseQuality from './pages/purchase/PurchaseQuality';
import PurchaseSuppliers from './pages/purchase/PurchaseSuppliers';
import PurchaseReturn from './pages/purchase/PurchaseReturn';
import PurchasePriceTrend from './pages/purchase/PurchasePriceTrend';

import SalesOverview from './pages/sales/SalesOverview';
import SalesOrders from './pages/sales/SalesOrders';
import SalesQuotations from './pages/sales/SalesQuotations';
import SalesOutbound from './pages/sales/SalesOutbound';
import SalesCustomers from './pages/sales/SalesCustomers';
import SalesReturn from './pages/sales/SalesReturn';
import SalesPerformance from './pages/sales/SalesPerformance';

import InventoryOverview from './pages/inventory/InventoryOverview';
import InventoryStock from './pages/inventory/InventoryStock';
import InventoryTraceability from './pages/inventory/InventoryTraceability';
import InventoryCheck from './pages/inventory/InventoryCheck';
import InventorySettings from './pages/inventory/InventorySettings';
import InventoryLocation from './pages/inventory/InventoryLocation';
import InventoryInboundRecord from './pages/inventory/InventoryInboundRecord';
import InventoryOutboundRecord from './pages/inventory/InventoryOutboundRecord';
import InventoryAlertSettings from './pages/inventory/InventoryAlertSettings';

import ProductOverview from './pages/product/ProductOverview';
import ProductTeaCategory from './pages/product/ProductTeaCategory';
import ProductTeaList from './pages/product/ProductTeaList';
import ProductManageTea from './pages/product/ProductManageTea';
import ProductManageTeaware from './pages/product/ProductManageTeaware';
import ProductManagePeripheral from './pages/product/ProductManagePeripheral';
import ProductManageOther from './pages/product/ProductManageOther';
import ProductTeaDetail from './pages/product/ProductTeaDetail';
import ProductCategoryTea from './pages/product/ProductCategoryTea';
import ProductCategoryTeaware from './pages/product/ProductCategoryTeaware';
import ProductCategoryPeripheral from './pages/product/ProductCategoryPeripheral';
import ProductCategoryOther from './pages/product/ProductCategoryOther';
import ProductBrand from './pages/product/ProductBrand';
import ProductBrandDetail from './pages/product/ProductBrandDetail';

import FinanceOverview from './pages/finance/FinanceOverview';
import FinanceReceivable from './pages/finance/FinanceReceivable';
import FinanceRecords from './pages/finance/FinanceRecords';
import FinanceReconciliation from './pages/finance/FinanceReconciliation';
import FinanceCollection from './pages/finance/FinanceCollection';
import FinancePayment from './pages/finance/FinancePayment';
import FinanceExpense from './pages/finance/FinanceExpense';
import FinanceInvoice from './pages/finance/FinanceInvoice';
import FinanceAccount from './pages/finance/FinanceAccount';

import StatisticsSales from './pages/statistics/StatisticsSales';
import StatisticsBrandAnalysis from './pages/statistics/StatisticsBrandAnalysis';
import StatisticsPurchase from './pages/statistics/StatisticsPurchase';
import StatisticsInventory from './pages/statistics/StatisticsInventory';
import StatisticsFinance from './pages/statistics/StatisticsFinance';
import StatisticsTeaCategory from './pages/statistics/StatisticsTeaCategory';
import StatisticsYearOnYear from './pages/statistics/StatisticsYearOnYear';

import SettingsSystem from './pages/settings/SettingsSystem';
import SettingsRoles from './pages/settings/SettingsRoles';
import SettingsLogs from './pages/settings/SettingsLogs';
import SettingsAbout from './pages/settings/SettingsAbout';
import SettingsUserManagement from './pages/settings/SettingsUserManagement';
import SettingsDataBackup from './pages/settings/SettingsDataBackup';
import SettingsUnit from './pages/settings/SettingsUnit';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      /* ── 工作台 ── */
      { path: 'dashboard', element: <DashboardOverview /> },
      { path: 'dashboard/overview', element: <DashboardOverview /> },
      { path: 'dashboard/todo', element: <DashboardTodo /> },
      { path: 'dashboard/shortcuts', element: <DashboardShortcuts /> },
      { path: 'dashboard/dashboard-notifications', element: <DashboardNotifications /> },
      { path: 'dashboard/dashboard-operation-log', element: <DashboardOperationLog /> },
      /* ── 采购 ── */
      { path: 'purchase', element: <PurchaseOverview /> },
      { path: 'purchase/purchase-overview', element: <PurchaseOverview /> },
      { path: 'purchase/purchase-orders', element: <PurchaseOrders /> },
      { path: 'purchase/purchase-inbound', element: <PurchaseInbound /> },
      { path: 'purchase/purchase-quality', element: <PurchaseQuality /> },
      { path: 'purchase/purchase-suppliers', element: <PurchaseSuppliers /> },
      { path: 'purchase/purchase-return', element: <PurchaseReturn /> },
      { path: 'purchase/purchase-price-trend', element: <PurchasePriceTrend /> },
      /* ── 销售 ── */
      { path: 'sales', element: <SalesOverview /> },
      { path: 'sales/sales-overview', element: <SalesOverview /> },
      { path: 'sales/sales-orders', element: <SalesOrders /> },
      { path: 'sales/sales-quotations', element: <SalesQuotations /> },
      { path: 'sales/sales-outbound', element: <SalesOutbound /> },
      { path: 'sales/sales-customers', element: <SalesCustomers /> },
      { path: 'sales/sales-return', element: <SalesReturn /> },
      { path: 'sales/sales-performance', element: <SalesPerformance /> },
      /* ── 仓储 ── */
      { path: 'inventory', element: <InventoryOverview /> },
      { path: 'inventory/inventory-overview', element: <InventoryOverview /> },
      { path: 'inventory/inventory-stock', element: <InventoryStock /> },
      { path: 'inventory/inventory-traceability', element: <InventoryTraceability /> },
      { path: 'inventory/inventory-check', element: <InventoryCheck /> },
      { path: 'inventory/inventory-settings', element: <InventorySettings /> },
      { path: 'inventory/inventory-location', element: <InventoryLocation /> },
      { path: 'inventory/inventory-inbound-record', element: <InventoryInboundRecord /> },
      { path: 'inventory/inventory-outbound-record', element: <InventoryOutboundRecord /> },
      { path: 'inventory/inventory-alert-settings', element: <InventoryAlertSettings /> },
      /* ── 商品 ── */
      { path: 'product', element: <ProductOverview /> },
      { path: 'product/product-overview', element: <ProductOverview /> },
      { path: 'product/product-manage', element: <Navigate to="product-manage-tea" replace /> },
      { path: 'product/product-category', element: <Navigate to="product-category-tea" replace /> },
      { path: 'product/product-manage-tea', element: <ProductManageTea /> },
      { path: 'product/product-manage-teaware', element: <ProductManageTeaware /> },
      { path: 'product/product-manage-peripheral', element: <ProductManagePeripheral /> },
      { path: 'product/product-manage-other', element: <ProductManageOther /> },
      { path: 'product/product-tea-detail/:id', element: <ProductTeaDetail /> },
      { path: 'product/product-tea-category', element: <ProductTeaCategory /> },
      { path: 'product/product-tea-seven', element: <ProductTeaCategory /> },
      { path: 'product/product-tea-list', element: <ProductTeaList /> },
      { path: 'product/product-category-tea', element: <ProductCategoryTea /> },
      { path: 'product/product-category-teaware', element: <ProductCategoryTeaware /> },
      { path: 'product/product-category-peripheral', element: <ProductCategoryPeripheral /> },
      { path: 'product/product-category-other', element: <ProductCategoryOther /> },
      { path: 'product/product-brand', element: <ProductBrand /> },
      { path: 'product/product-brand/:id', element: <ProductBrandDetail /> },
      /* ── 财务 ── */
      { path: 'finance', element: <FinanceOverview /> },
      { path: 'finance/finance-overview', element: <FinanceOverview /> },
      { path: 'finance/finance-receivable', element: <FinanceReceivable /> },
      { path: 'finance/finance-records', element: <FinanceRecords /> },
      { path: 'finance/finance-reconciliation', element: <FinanceReconciliation /> },
      { path: 'finance/finance-collection', element: <FinanceCollection /> },
      { path: 'finance/finance-payment', element: <FinancePayment /> },
      { path: 'finance/finance-expense', element: <FinanceExpense /> },
      { path: 'finance/finance-invoice', element: <FinanceInvoice /> },
      { path: 'finance/finance-account', element: <FinanceAccount /> },
      /* ── 统计 ── */
      { path: 'statistics', element: <StatisticsSales /> },
      { path: 'statistics/statistics-sales', element: <StatisticsSales /> },
      { path: 'statistics/statistics-brand', element: <StatisticsBrandAnalysis /> },
      { path: 'statistics/statistics-purchase', element: <StatisticsPurchase /> },
      { path: 'statistics/statistics-inventory', element: <StatisticsInventory /> },
      { path: 'statistics/statistics-finance', element: <StatisticsFinance /> },
      { path: 'statistics/statistics-tea-category', element: <StatisticsTeaCategory /> },
      { path: 'statistics/statistics-year-on-year', element: <StatisticsYearOnYear /> },
      /* ── 系统 ── */
      { path: 'settings', element: <SettingsSystem /> },
      { path: 'settings/settings-system', element: <SettingsSystem /> },
      { path: 'settings/settings-roles', element: <SettingsRoles /> },
      { path: 'settings/settings-logs', element: <SettingsLogs /> },
      { path: 'settings/settings-about', element: <SettingsAbout /> },
      { path: 'settings/settings-user-management', element: <SettingsUserManagement /> },
      { path: 'settings/settings-data-backup', element: <SettingsDataBackup /> },
      { path: 'settings/settings-unit', element: <SettingsUnit /> },
    ],
  },
]);
