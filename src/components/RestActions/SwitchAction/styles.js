import styled from 'styled-components';

const SwitchActionStyles = styled.div`
  .switch-action-wrapper {
    position: relative;
    display: inline-flex;
  }

  .action-feature-icon {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 18px;
    color: ${({ theme }) => theme.subscriptions.colorIcon};
  }
`;

export default SwitchActionStyles;
