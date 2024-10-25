import { Layout } from 'antd';
import I18n from 'i18next';
import PrivateLayoutWrapper from './styles';
import Header from './Header';
import SideBar from './SideBar';
import Impersonation from './Impersonation';
import OverlayCollapse from './OverlayCollapse';
import MyRoutes from 'routes';

const { Content, Footer } = Layout;
const PrivateLayout = (props) => {
  return (
    <PrivateLayoutWrapper>
      <Layout hasSider className="layout-window-view">
        <SideBar />
        <OverlayCollapse />
        <Layout className="site-layout">
          <Header />
          <Content className="site-layout-background">
            <Impersonation />
            <div className="content" id="status">
              <MyRoutes />
            </div>
            <Footer className="footer">
              {I18n.t('appInfo.footer', { currentYear: new Date().getFullYear(), })}
            </Footer>
          </Content>
        </Layout>
      </Layout>
    </PrivateLayoutWrapper>
  )
}

export default PrivateLayout;