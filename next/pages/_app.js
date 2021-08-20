import { DefaultSeo } from 'next-seo';
import { Fragment } from 'react'
import { AlertProvider } from "../lib/providers/alert-provider";
import { ToastProvider } from "../lib/providers/toast-provider";
import { TooltipProvider } from "../lib/providers/tooltip-provider";
import { AuthProvider } from "../lib/providers/auth-provider";
import "../style/style.scss";
import config from 'next/config';



export default function App({ Component, pageProps }) {
  const Layout = Component.Layout ? Component.Layout : Fragment;
  const layoutProps = Component.LayoutProps ? Component.LayoutProps : {};
  const { publicRuntimeConfig: { seo: { title, siteName } } } = config();
  return (
    <>
      <DefaultSeo
        titleTemplate="%s"
        defaultTitle={title}
        openGraph={{
          type: 'website',
          locale: 'vi_VN',
          site_name: siteName,
        }}
      />
      <TooltipProvider>
        <ToastProvider>
          <AlertProvider>
            <AuthProvider>
                <Layout {...layoutProps}>
                  <Component {...pageProps} />
                </Layout>
            </AuthProvider>
          </AlertProvider>
        </ToastProvider>
      </TooltipProvider>
    </>
  );
}
