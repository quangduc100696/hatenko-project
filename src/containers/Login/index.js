import { useTranslation } from 'react-i18next';
import { Button, Form, Input } from 'antd';
import FormInput from 'components/form/FormInput';
import { LockIcon, SmsIcon } from 'components/common/Icons/SVGIcons';
import useLogin from 'hooks/useLogin';
import { Link } from 'react-router-dom';

function Login() {
  
  const { loading, login } = useLogin();
  const { t } = useTranslation();
  const [ form ] = Form.useForm();

  return (
    <div>
      <div className="auth-service-layout__title-wrapper">
        <div className="auth-service-layout__main-title">
          {t('login.title')}
        </div>
        <div className="auth-service-layout__min-title">
          {t('login.botTitle')}
        </div>
      </div>
      <Form layout="vertical" onFinish={login} form={form}>
        <FormInput
          name="username"
          label="input.email.label"
          placeholder="login.enterYourEmail"
          required
          messageRequire="input.email.validateMsg.required"
          rules={[
            {
              type: 'email',
              message: t('input.email.validateMsg.invalid'),
            },
          ]}
          size="large"
          prefix={<SmsIcon />}
        />
        <FormInput
          name="password"
          label="input.password.label"
          placeholder="login.enterYourPassword"
          required
          messageRequire="input.password.validateMsg.required"
          ContentComponent={Input.Password}
          size="large"
          prefix={<LockIcon />}
        />
        <div className="actions">
          <Link to="/forgot-password" className="forgot-password">
            {t('forgotPassword.title')}
          </Link>
        </div>
        <div className="btn-auth">
          <Button
            className="submit-btn w-full booking-antd-btn-primary"
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            {t('login.loginBtn')}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Login;
