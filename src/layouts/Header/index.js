import { Badge } from 'antd';
import { OpenMenuFIcon } from 'icons/FontIcons';
import { Link } from 'react-router-dom';
import useCollapseSidebar from 'hooks/useCollapseSidebar';
import SearchInput from './SearchInput';
import ServiceSelect from './ServiceSelect';
import HeaderWrapper from './styles';
import CustomButton from 'components/CustomButton';
import { BellFilled, PlusOutlined } from '@ant-design/icons';
import UserInfo from './UserInfo';
import { HASH_MODAL } from 'configs/constant';
import useServiceId from 'hooks/useServiceId';
import { InAppEvent } from 'utils/FuseUtils';

const Header = () => {

  const { isCollapseSidebar, toggleCollapse } = useCollapseSidebar();
  const { serviceId, setServiceId } = useServiceId();

  const onClickBooking = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/order.edit',
    title: 'Tạo mới đơn hàng',
    data: {}
  });

  return (
    <HeaderWrapper className="header">
      <div className="leftHeader">
        <OpenMenuFIcon
          className={`trigger ${isCollapseSidebar ? '' : 'reverse-trigger'}`}
          onClick={toggleCollapse}
        />
        <div>
          <ServiceSelect serviceId={serviceId} setServiceId={setServiceId}/>
        </div>
        <div className="div-search-customer">
          <SearchInput serviceId={serviceId} setServiceId={setServiceId}/>
        </div>
      </div>
      <div className="rightHeader">
         <CustomButton
          title="button.fastBooking"
          onClick={onClickBooking}
          icon={<PlusOutlined />}
          type='primary'
        />
        <Link to="/notifications" className="link-noti">
          <Badge count={0}>
            <BellFilled className="icon-noti" />
          </Badge>
        </Link>
        <UserInfo />
      </div>
    </HeaderWrapper>
  );
};

export default Header;
