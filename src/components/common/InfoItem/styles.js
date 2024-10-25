import styled from 'styled-components';

const ItemInfoStyles = styled.div`
  line-height: 16px;
  display: flex;
  align-items: center;
  &.info-item-common + &.info-item-common {
    margin-top: 16px;
  }
  .info-item-common__value {
    word-break: break-word;
  }
  .anticon {
    margin-right: 10px;
  }
`;

export default ItemInfoStyles;
