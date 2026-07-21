import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import { CurrencyProvider } from './lib/currency'
import { ToastProvider } from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import SiteNav from './components/SiteNav'
import TabBar from './components/TabBar'
import Footer from './components/Footer'
import Home from './pages/Home'

// 除首页外全部按路由切包：单包 645KB 对一个内容站太重，首跳只该付首页的钱。
// fallback 是一块安静的纸白——加载本身也要「昂贵地慢」，不闪骨架屏
const Collection = lazy(() => import('./pages/Collection'))
const Maisons = lazy(() => import('./pages/Maisons'))
const Maison = lazy(() => import('./pages/Maison'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Orders = lazy(() => import('./pages/Orders'))
const Me = lazy(() => import('./pages/Me'))
const Vitrine = lazy(() => import('./pages/Vitrine'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** 底部 Tab 布局：首页 / 目录 / 品牌屋 / 购物车 / 订单 / 我的。页脚跟着这一组走 */
function TabLayout() {
  return (
    <>
      <Outlet />
      <Footer />
      <TabBar />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <CurrencyProvider>
        <ToastProvider>
          <BrowserRouter>
            <ScrollToTop />
            <SiteNav />
            <Suspense fallback={<div className="min-h-dvh" />}>
            <Routes>
              <Route element={<TabLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/maisons" element={<Maisons />} />
                <Route path="/maison/:id" element={<Maison />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/me" element={<Me />} />
                <Route path="/vitrine" element={<Vitrine />} />
              </Route>
              {/* 详情页与结算页有自己的吸底操作栏，不显示 Tab */}
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
        </CurrencyProvider>
      </StoreProvider>
    </ErrorBoundary>
  )
}
