import { useLocation, useNavigate } from 'react-router';
import { EditOutlined } from '@ant-design/icons';
import { HASH_MODAL } from 'configs/constant';
import CustomButtonIcon from '../CustomButtonIcon';

const EditButton = ({
  title = 'button.edit',
  handleClick,
  resource = '',
  record,
  id,
  suffixEditLink = 'edit',
}) => {

  const location = useLocation();
  const navigate = useNavigate();
  
  const handleClickEdit = () => {
    if (handleClick) {
      handleClick();
    } else {
      navigate({
        search: location.search,
        hash: `${HASH_MODAL}/${resource}/${id}/${suffixEditLink}`,
      }, {state: record});
    }
  };
  return (
    <CustomButtonIcon
      className="edit-button-icon-wrapper"
      title={title}
      handleClick={handleClickEdit}
      icon={<EditOutlined />}
    />
  );
};

export default EditButton;
