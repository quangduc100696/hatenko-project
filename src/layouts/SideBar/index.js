import { Menu, Layout } from 'antd';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from 'theme/constants';
import {
  FolderOpenOutlined,
  UnorderedListOutlined,
  PieChartOutlined,
  GroupOutlined,
  RiseOutlined,
  PullRequestOutlined,
  UngroupOutlined,
  DollarCircleFilled,
  OrderedListOutlined,
  DeploymentUnitOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
  AuditOutlined,
  OpenAIOutlined
} from '@ant-design/icons';

import { ConfigFIcon, CustomerFIcon, DashboardFIcon, IncomeFIcon, ReportFIcon, ReservationFIcon } from 'icons/FontIcons';
import defaultLogoMark from 'assets/images/logo-mark-default.svg';
import useCollapseSidebar from 'hooks/useCollapseSidebar';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import SideBarStyles from './styles';
import useGetMe from 'hooks/useGetMe';

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}
const { Sider } = Layout;

const roleUserSale = "ROLE_SALE";
const roleUserAdmin = "ROLE_ADMIN";
const roleUser = "ROLE_USER"
function SideBar() {

  const { user: profile } = useGetMe();
  const { t } = useTranslation();
  const { isCollapseSidebar: collapsed, toggleCollapse } = useCollapseSidebar();

  const newRoleUser = profile?.userProfiles?.map(item => item?.type);
  const hasAdminRole = newRoleUser.some(role => role === roleUserAdmin);
  const hasSaleRole = newRoleUser.some(role => role === roleUserSale);
  const hasUserRole = newRoleUser.some(role => role === roleUser);
  const shouldHideLeadLinks = (hasSaleRole || hasUserRole) && !hasAdminRole;

  const items = [
    getItem(<Link to="/sale/report-common">{t('sideBar.dashboard')}</Link>, 'home', <DashboardFIcon />),
    getItem(<Link to="/project/list">Dự án</Link>, 'project_list', <PieChartOutlined />),
    getItem(<Link to="/lead">Lead</Link>, 'tong_lead', <FolderOpenOutlined />),

    !shouldHideLeadLinks && getItem('Chưa chăm sóc', 'chua_cham_soc', <FolderOpenOutlined />, [
      getItem(<Link to="/customer-service/lead">Lead</Link>, "lead_chua_cham_doc", <ScheduleOutlined />),
      getItem(<Link to="/customer-service/co-hoi">Cơ hội</Link>, "co_hoi_chua_cham_soc", <AppstoreOutlined />),
      getItem(<Link to="/customer-service/hoan-thanh">Đơn hoàn thành</Link>, "don_hang_hoan_thanh", <AuditOutlined />),
      getItem(<Link to="/customer-service/su-co">Đơn sự cố</Link>, "don_hang_su_co", <ScheduleOutlined />),
    ].filter(Boolean)),

    !shouldHideLeadLinks && getItem('Đã chăm sóc', 'da_cham_soc', <FolderOpenOutlined />, [
      getItem(<Link to="/customer-lead/lead">Lead</Link>, "lead_da_cham_soc", <ScheduleOutlined />),
      getItem(<Link to="/customer-service/co-hoi-cham-soc">Cơ hội</Link>, "co_hoi_da_cham_soc", <AppstoreOutlined />),
      getItem(<Link to="/customer-service/order">Đơn hàng</Link>, "don_hang_da_hoan_thanh", <AuditOutlined />),
    ].filter(Boolean)),

    getItem(<Link to="/sale/co-hoi"> Cơ hội </Link>, 'co_hoi', <IncomeFIcon />),
    getItem('Đơn hàng', 'order_solve', <DollarCircleFilled />, [
      getItem(<Link to="/sale/order">D/S Đơn hàng</Link>, 'list_order', <UnorderedListOutlined />),
      getItem(<Link to="/sale/cancellations">D/S đơn hủy</Link>, 'care-order', <ReservationFIcon />)
    ]),
    getItem(<Link to="/sale/drag-drop-order">Quy Trình</Link>, 'quy_trinh_don_hang', <DashboardFIcon />),
    getItem('Kế toán', 'need_solve', <DollarCircleFilled />, [
      getItem(<Link to="/ke-toan/confirm">Duyệt tiền</Link>, 'list_order_update', <UnorderedListOutlined />),
      getItem(<Link to="/ke-toan/cong-no">Công nợ</Link>, 'can_giai_quyet', <ReservationFIcon />)
    ]),
    getItem(<Link to="/ai-agent">Ai Agent</Link>, 'ai-agent', <OpenAIOutlined />),
    getItem('Khách hàng', 'client', <CustomerFIcon />, [
      getItem(<Link to="/sale/m-customer">Khách lẻ</Link>, 'customer', <GroupOutlined />),
      getItem(<Link to="/sale/m-enterprice">Doanh nghiệp</Link>, 'enterprice', <GroupOutlined />)
    ]),
    getItem('Kho vận', 'warehouse', <OrderedListOutlined />, [
      getItem(<Link to="/warehouse/trong-kho"> Trong kho </Link>, 'tt-theo-don', <UnorderedListOutlined />),
      getItem(<Link to="/warehouse/xuat-kho"> Xuất kho </Link>, 'xk-theo-don', <UnorderedListOutlined />),
      getItem(<Link to="/warehouse/da-giao"> Đã giao </Link>, 'da-giao-theo-don', <UnorderedListOutlined />),
      getItem(<Link to="/warehouse/nhap-kho">Nhập kho</Link>, 'n.kho', <DeploymentUnitOutlined />),
      getItem(<Link to="/warehouse/danh-sach-kho">Danh sách kho</Link>, 'd.s.kho', <DeploymentUnitOutlined />)
    ]),
    getItem(<Link to="/sale-kpi/list"> Kpi</Link>, 'Kpi', <RiseOutlined />),
    getItem(<Link to="/data/bot-collection">Bot dữ liệu</Link>, 'bot_data', <PullRequestOutlined />),
    getItem(<Link to="/product"> Sản phẩm</Link>, 'product_list', <UngroupOutlined />),
    getItem('Tài khoản', 'tai_khoan', <ReportFIcon />, [
      getItem(<Link to="/user/group">Team</Link>, 'user_group', <ConfigFIcon />),
      getItem(<Link to="/user/list-system"> Tài khoản hệ thống</Link>, 'user_system', <ConfigFIcon />)
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
          <img alt="" src={collapsed ? defaultLogoMark : '/logo.png'} />
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
