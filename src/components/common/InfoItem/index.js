import ItemInfoStyles from './styles';

const InfoItem = ({ IconCPN, value, iconProps }) => {
  return (
    <ItemInfoStyles className="info-item-common">
      <IconCPN {...iconProps} />
      <span className="info-item-common__value">
        { value || 'N/A' }
      </span>
    </ItemInfoStyles>
  );
};

export default InfoItem;
