import { Badge } from 'antd';
import { OpenMenuFIcon } from 'icons/FontIcons';
import { Link } from 'react-router-dom';
import useCollapseSidebar from 'hooks/useCollapseSidebar';
import SearchInput from './SearchInput';
import ServiceSelect from './ServiceSelect';
import HeaderWrapper from './styles';
import CustomButton from 'components/CustomButton';
import { BellFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import UserInfo from './UserInfo';
import { useLocation, useNavigate } from 'react-router';
import { HASH_MODAL } from 'configs/constant';

const Header = () => {

  const { isCollapseSidebar, toggleCollapse } = useCollapseSidebar();
  const navigate = useNavigate();
  const { search } = useLocation();

  const onClickBooking = () => {
    navigate({ search, hash: `${HASH_MODAL}/booking/create` })
  }

  return (
    <HeaderWrapper className="header">
      <div className="leftHeader">
        <OpenMenuFIcon
          className={`trigger ${isCollapseSidebar ? '' : 'reverse-trigger'}`}
          onClick={toggleCollapse}
        />
        <div>
          <ServiceSelect />
        </div>
        <div className="div-search-customer">
          <SearchInput />
        </div>
      </div>
      <div className="rightHeader">
        <CustomButton
          title="button.expense"
          onClick={()=> navigate('/customer/transactions')}
          icon={<MinusOutlined />}
          type='primary'
        />
         <CustomButton
          title="button.booking"
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
