import { useState } from 'react';
import i18next from 'i18next';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { ImpersonationStyles } from './styles';

function Impersonation() {
  
  const [visibleText, setVisibleText] = useState(true);
  const onToggle = () => setVisibleText(!visibleText);

  return sessionStorage.getItem('sessionToken') ? (
    <ImpersonationStyles>
      {visibleText ? (
        <div>
          <RightCircleOutlined onClick={onToggle} />

          <span className="impersonation-text">
            {i18next.t('button.loginBySupperAdmin')}
          </span>
        </div>
      ) : (
        <LeftCircleOutlined onClick={onToggle} />
      )}
    </ImpersonationStyles>
  ) : null;
}

export default Impersonation;
