import styled from 'styled-components';
import { Button } from 'antd';

const ButtonWrapper = styled(Button)`
  position: absolute !important;
  top: 0;
  font-size: 20px !important;
  border: none !important;
  left: -20px;
  border-radius: 50% !important;
  z-index: 1;
`;

export default ButtonWrapper;
