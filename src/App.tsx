import { useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import { ToastProvider } from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import SiteNav from './components/SiteNav'
import TabBar from './components/TabBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Maisons from './pages/Maisons'
import Maison from './pages/Maison'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Me from './pages/Me'
import About from './pages/About'
import NotFound from './pages/NotFound'

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
        <ToastProvider>
          <BrowserRouter>
            <ScrollToTop />
            <SiteNav />
            <Routes>
              <Route element={<TabLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/maisons" element={<Maisons />} />
                <Route path="/maison/:id" element={<Maison />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/me" element={<Me />} />
              </Route>
              {/* 详情页与结算页有自己的吸底操作栏，不显示 Tab */}
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </StoreProvider>
    </ErrorBoundary>
  )
}
