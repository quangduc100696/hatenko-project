import { useTranslation } from 'react-i18next';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import UserInfoStyles from './styles';

const UserWrapper = ({
  item,
  avatarProp = 'avatar',
  nameProp = 'name',
  noteProp,
  customNote,
  disabled,
  path,
  size,
}) => {
  const { t } = useTranslation();
  const element = (
    <div className="user-info-wrapper">
      <Avatar size={size} src={item?.[avatarProp]} icon={<UserOutlined />} />
      <div className="user-content">
        <div className="user-name ellipsis-2-t">
          {item?.[nameProp] || t('error.waitingUpdate')}
        </div>
        <div className="user-note">
          {noteProp ? item?.[noteProp] : customNote}
        </div>
      </div>
    </div>
  );

  return (
    <UserInfoStyles>
      {!path || disabled ? (
        element
      ) : (
        <Link className="link-default" to={path}>
          {element}
        </Link>
      )}
    </UserInfoStyles>
  );
};

export default UserWrapper;
