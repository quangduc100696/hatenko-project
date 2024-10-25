import CustomButtonWrapper from './CustomButtonWrapper';
import { CustomButtonStyles } from './styles';

const CustomButton = ({ title, handleClick, buttonProps }) => (
  <CustomButtonStyles className="custom-button">
    <CustomButtonWrapper
        title={title}
        handleClick={handleClick}
        buttonProps={buttonProps}
      />
  </CustomButtonStyles>
);

export default CustomButton;
