import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

const CustomButtonWrapper = ({
  disabled,
  title,
  buttonProps,
  handleClick
}) => {
  const { t } = useTranslation();
  return (
    <Button
      onClick={handleClick}
      {...buttonProps}
      disabled={buttonProps?.disabled || disabled}
    >
      {t(title)}
    </Button>
  );
};

export default CustomButtonWrapper;
