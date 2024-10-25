import { useTranslation } from 'react-i18next';
import { DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import CustomButtonIcon from '../CustomButtonIcon';

const DeleteButton = ({
  title = 'button.delete',
  deleteItem,
  needPermissions,
  customTitle,
  record,
  nameProp = 'name',
  customMessage,
  isEmphasized,
}) => {

  const { t } = useTranslation();
  const handleDelete = () =>
    Modal.confirm({
      title: `${t('popup.alertDelete')} ${t(
        customTitle || '',
      )}`,
      content: (
        <div className={isEmphasized ? 'text-red' : ''}>
          {t('popup.alertDeleteDes', {
            customMessage: customMessage ? t(customMessage) : record?.[nameProp],
            interpolation: {
              escapeValue: false,
            }
          })}
        </div>
      ),
      okText: t('button.ok'),
      cancelText: t('button.cancel'),
      zIndex: 100000,
      onOk: () => {
        return deleteItem();
      },
    }
  );

  return (
    <CustomButtonIcon
      className="delete-button-icon-wrapper"
      title={title}
      handleClick={handleDelete}
      needPermissions={needPermissions}
      disabledPermission
      icon={<DeleteOutlined />}
      buttonProps={{
        danger: true,
      }}
    />
  );
};

export default DeleteButton;
