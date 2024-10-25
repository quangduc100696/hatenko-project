import ButtonIcon from './ButtonIcon';
import { CustomButtonIconWrapper } from './styles';

const CustomButtonIcon = ({
  handleClick,
  icon,
  title,
  buttonProps,
  className,
}) => {
  return (
    <CustomButtonIconWrapper
      className={`custom-button-icon-wrapper ${className || ''}`}
    >
      <ButtonIcon
        title={title}
        handleClick={handleClick}
        buttonProps={buttonProps}
        icon={icon}
      />
    </CustomButtonIconWrapper>
  );
};

export default CustomButtonIcon;
