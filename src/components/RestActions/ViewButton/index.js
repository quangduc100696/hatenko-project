import { EyeOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import CustomButtonIcon from '../CustomButtonIcon';
import { useNavigateSearch } from 'hooks/useNavigateSearch';

const ViewButton = ({
  title = 'button.view',
  handleClick,
  rootPath,
  id,
}) => {

  const navigateSearch = useNavigateSearch();
  const location = useLocation();
  const handleClickView = () => {
    if (handleClick) {
      handleClick();
      return;
    }
    navigateSearch(rootPath || location.pathname, { id });
  };

  return (
    <CustomButtonIcon
      title={title}
      handleClick={handleClickView}
      icon={<EyeOutlined />}
    />
  );
};

export default ViewButton;
