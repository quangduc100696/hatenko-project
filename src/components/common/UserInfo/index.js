import UserWrapper from './UserWrapper';

const UserInfo = ({ path, ...props }) => {
  return <UserWrapper path={path} {...props} />
};

export default UserInfo;
