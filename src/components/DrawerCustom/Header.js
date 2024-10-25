import { CloseSquareOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { HeaderStyles } from './styles';

const Header = ({ title, onClose }) => {
  const { t } = useTranslation();
  return (
    <HeaderStyles>
      <div className="drawer-header-title">{t(title)}</div>
      <CloseSquareOutlined
        onClick={onClose}
        className="drawer-header-icon"
        type="close-square"
      />
    </HeaderStyles>
  );
};

export default Header;
