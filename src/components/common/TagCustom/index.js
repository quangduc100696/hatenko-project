import { useTranslation } from 'react-i18next';
import TagCustomWrapper from './styles';

const TagCustom = ({ text, name, IconCPN, ...props }) => {
  const { t } = useTranslation();
  return (
    <TagCustomWrapper {...props}>
      {IconCPN && <IconCPN />}
      <div>{name || t(text || '')}</div>
    </TagCustomWrapper>
  );
};

export default TagCustom;
