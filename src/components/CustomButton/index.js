import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { CustomButtonStyles } from './styles';

const CustomButton = ({ 
  title="Hoàn thành", 
  color="danger", 
  variant="solid", 
  ...props 
}) => {
  const { t } = useTranslation();
  return (
    <CustomButtonStyles className="custom-button">
      <Button 
        color={color}
        variant={variant}
        {...props} 
      >
        {t(title)}
      </Button>
    </CustomButtonStyles>
  );
};

export default CustomButton;
