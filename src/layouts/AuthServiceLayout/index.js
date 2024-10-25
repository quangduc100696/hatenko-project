import { Layout } from 'antd';
import IntroAuth from 'assets/images/intro-auth.svg';
import ContentAuth from 'assets/images/content-auth.svg';
import PublicLayoutWrapper from './styles';
const { Content } = Layout;

const PublicLayout = ({ children }) => (
  <PublicLayoutWrapper>
    <Layout className="layout">
      <Content className="main-img">
        <img src={ContentAuth} id="content" alt="Content Auth" />
        <img src={IntroAuth} id="intro" alt="Intro Auth" />
      </Content>
      <div className="main-content">
        <img alt="" src="/logo.png" className="auth-service-layout__logo" />
        <div className="auth-service-layout__content">{children}</div>
      </div>
    </Layout>
  </PublicLayoutWrapper>
);

export default PublicLayout;
