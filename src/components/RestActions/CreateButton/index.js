import { PlusOutlined } from '@ant-design/icons';
import CustomButton from 'components/CustomButton';

const CreateButton = ({
  title = 'button.create',
  handleClick,
}) => {
  return (
    <CustomButton
      title={title}
      onClick={handleClick}
      icon={<PlusOutlined />}
      type='primary'
    />
  );
};

export default CreateButton;
