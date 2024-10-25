import { Menu, Layout } from 'antd';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from 'theme/constants';
import { ExclamationCircleOutlined, FolderOpenOutlined, SnippetsOutlined, UnorderedListOutlined } from '@ant-design/icons';
import SideBarStyles from './styles';
import { 
  ConfigFIcon, CustomerFIcon, DashboardFIcon, ExtraServiceFIcon, 
  IncomeFIcon, ReportFIcon, ReservationFIcon 
} from 'icons/FontIcons';
import defaultLogoMark from 'assets/images/logo-mark-default.svg';
import useCollapseSidebar from 'hooks/useCollapseSidebar';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}
const { Sider } = Layout;

function SideBar() {

  const { t } = useTranslation();
  const { isCollapseSidebar: collapsed, toggleCollapse } = useCollapseSidebar();

  const items = [
    getItem(<Link to="/">{t('sideBar.dashboard')}</Link>, 'home', <DashboardFIcon />),
    getItem(<Link to="/">{t('sideBar.reservations')}</Link>, 'order.list', <ReservationFIcon />),
    getItem(<Link to="/">{t('sideBar.customers')}</Link>, 'lead', <CustomerFIcon />),
    getItem(<Link to="/">{t('sideBar.transactions')}</Link>, 'transactions', <IncomeFIcon />),
    getItem(<Link to="/">{t('sideBar.extraServiceOrders')}</Link>, 'extraServiceOrders', <ExtraServiceFIcon />),
    getItem(<Link to="/">{t('sideBar.contracts')}</Link>, 'contracts', <FolderOpenOutlined />),
    getItem(<Link to="/">{t('sideBar.incidents')}</Link>, 'incidents', <ExclamationCircleOutlined />),
    getItem(<Link to="/">{t('sideBar.reports')}</Link>, 'reports', <ReportFIcon />),
    getItem(<Link to="/">{t('sideBar.config')}</Link>, 'resource', <ConfigFIcon />),
    getItem('Khách hàng', 'customer', <SnippetsOutlined /> , [
      getItem(<Link to="/customer/persional"> Cá nhân</Link>, 'persional', <UnorderedListOutlined />),
      getItem(<Link to="/customer/companies"> Doanh nghiệp</Link>, 'companies ', <CustomerFIcon />)
    ])
  ]

  return (
    <SideBarStyles>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sidebar"
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        width={SIDEBAR_WIDTH}
        theme="light"
      >
        <div className="logo" onClick={toggleCollapse}>
          <img alt="" src={collapsed ? defaultLogoMark : '/logo.png'}/>
        </div>
        <Menu
          mode="inline"
          items={items}
        />
      </Sider>
    </SideBarStyles>
  );
}

export default SideBar;
