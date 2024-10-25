import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import RestFiledItemWithLabelWrapper from './style';

const RestFieldItemWithLabel = ({
  record,
  name = '',
  label,
  elementCustom,
  hasControlItem,
}) => {

  const { t } = useTranslation();
  const content = elementCustom || get(record, name) || t('error.waitingUpdate');

  return (
    <RestFiledItemWithLabelWrapper className="ant-form-item">
      <div className="ant-form-item-label">
        <label>{t(label)}</label>
      </div>
      { hasControlItem ? (
        <div className="ant-form-item-control">
          <div className="ant-form-item-control-input">
            { elementCustom || get(record, name) || t('error.waitingUpdate')}
          </div>
        </div>
      ) : (
        <div>{content}</div>
      )}
    </RestFiledItemWithLabelWrapper>
  );
};

export default RestFieldItemWithLabel;
