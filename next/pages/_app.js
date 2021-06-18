import { DefaultSeo } from 'next-seo';
import { Fragment } from 'react'
import { AlertProvider } from "../lib/providers/alert-provider";
import { ToastProvider } from "../lib/providers/toast-provider";
import { TooltipProvider } from "../lib/providers/tooltip-provider";
import { AuthProvider } from "../lib/providers/auth-provider";
import { CartProvider } from "../lib/providers/cart-provider";
import { ShopProvider } from "../lib/providers/shop-provider";
import "../style/style.scss";

export default function App({ Component, pageProps }) {
  const Layout = Component.Layout ? Component.Layout : Fragment;
  const layoutProps = Component.LayoutProps ? Component.LayoutProps : {};
  return (
    <>
      <DefaultSeo
        titleTemplate="%s | 3M Shop"
        defaultTitle="3M Shop"
        openGraph={{
          type: 'website',
          locale: 'vi_VN',
          site_name: '3mShop',
        }}
      />
      <TooltipProvider>
        <ToastProvider>
          <AlertProvider>
            <AuthProvider>
              <ShopProvider>
                <CartProvider>
                    <Layout {...layoutProps}>
                      <Component {...pageProps} />
                    </Layout>
                </CartProvider>
              </ShopProvider>
            </AuthProvider>
          </AlertProvider>
        </ToastProvider>
      </TooltipProvider>
    </>
  );
}
