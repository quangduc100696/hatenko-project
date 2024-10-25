import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { FooterStyles } from './styles';

const Footer = ({
  onClose,
  onOk,
  okButtonProps,
  cancelButtonProps,
  okText = 'button.save',
}) => {
  const { t } = useTranslation();
  return (
    <FooterStyles className="footer-drawer">
      <Button
        onClick={onClose}
        className="footer-drawer-btn w-50 cancel-button"
        {...cancelButtonProps}
      >
        {t('button.cancel')}
      </Button>
      <Button
        onClick={onOk}
        className="footer-drawer-btn w-50"
        type="primary"
        {...okButtonProps}
      >
        {t(okText)}
      </Button>
    </FooterStyles>
  );
};

export default Footer;
