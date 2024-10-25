import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import ButtonWrapper from './styles';

const ToggleButton = ({ isCollapse, handleToggle }) => (
  <ButtonWrapper
    className="extra-button"
    icon={isCollapse ? <RightCircleOutlined /> : <LeftCircleOutlined />}
    onClick={handleToggle}
  />
);

export default ToggleButton;
