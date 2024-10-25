import { Avatar } from 'antd';
import { ProfileOutlineIcon } from 'components/common/Icons/SVGIcons';
import { PlusCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AddUserPointStyles } from './styles';

const AddUserPoint = ({
  item,
  title = 'button.addAssignee',
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <AddUserPointStyles {...props} className="add-user pointer">
      <div className="add-user__avatar-wrapper">
        <Avatar src={item?.avatar} icon={<ProfileOutlineIcon />} />
        <PlusCircleFilled className="add-user__add-icon" />
      </div>
      {item?.id ? (
        <div className="add-user__name">
          <div className="fw-600">{item?.fullName}</div>
          <div className="text-secondary ellipsis-t">{item?.email}</div>
        </div>
      ) : (
        <div className="fw-600 add-user__add-title">{t(title)}</div>
      )}
    </AddUserPointStyles>
  );
};

export default AddUserPoint;
