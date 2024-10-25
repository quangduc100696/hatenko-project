import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { CustomButtonStyles } from './styles';

const CustomButton = ({ title, ...props }) => {
  const { t } = useTranslation();
  return (
    <CustomButtonStyles className="custom-button">
      <Button {...props} >
        {t(title)}
      </Button>
    </CustomButtonStyles>
  );
};

export default CustomButton;
