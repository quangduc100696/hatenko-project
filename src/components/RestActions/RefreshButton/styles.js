import styled from 'styled-components';
import { Button } from 'antd';

const RefreshButtonStyles = styled(Button)`
  width: 100%;
  border: none !important;
  background: none !important;
  box-shadow: none !important;
  color: ${({ theme }) => theme.palette.primary} !important;
  font-weight: bold !important;
  font-size: 12px !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  .anticon {
    display: flex;
    font-size: 16px;
  }
  span:not(.anticon) {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export default RefreshButtonStyles;
