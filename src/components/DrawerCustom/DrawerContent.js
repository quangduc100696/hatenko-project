import Header from './Header';
import Footer from './Footer';

const DrawerContent = ({
  title,
  onClose,
  onOk,
  okButtonProps,
  cancelButtonProps,
  okText,
  children,
  footer
}) => {
  return (
    <div className="drawer-content-wrapper">
      { title && <Header onClose={onClose} title={title} /> }
      <div className="drawer-content">{children}</div>
      { footer || (
        <Footer
          onClose={onClose}
          onOk={onOk}
          okButtonProps={okButtonProps}
          cancelButtonProps={cancelButtonProps}
          okText={okText}
        />
      )}
    </div>
  );
};

export default DrawerContent;
