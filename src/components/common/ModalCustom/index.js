import { ModalWrapper } from './styles';
import HeaderModal from './Header';

const ModalCustom = ({
  width = 800,
  title,
  icon,
  cancelButtonProps,
  className,
  isScrollY,
  resetPaddingTopBody = true,
  resetPaddingBottomBody = true,
  ...props
}) => (
  <ModalWrapper
    width={width}
    destroyOnClose
    maskClosable={false}
    {...(title && {
      title: <HeaderModal icon={icon} title={title} />,
    })}
    cancelButtonProps={{ className: 'cancel-button', ...cancelButtonProps }}
    className={`${className || ''} ${isScrollY ? 'modal-scroll-y' : ''} ${
      resetPaddingBottomBody ? 'reset-padding-bottom-body' : ''
    } ${resetPaddingTopBody ? 'reset-padding-top-body' : ''}`}
    {...props}
  />
);

export default ModalCustom;
