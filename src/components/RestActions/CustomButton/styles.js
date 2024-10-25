import styled from 'styled-components';

export const CustomButtonStyles = styled.div`
  button[disabled] > i {
    color: ${({ theme }) => theme.background.disabled};
  }

  .normal-action-wrapper {
    position: relative;
  }

  .action-feature-icon {
    position: absolute;
    top: -12px;
    right: -10px;
    font-size: 20px;
    color: ${({ theme }) => theme.subscriptions.colorIcon};
  }
`;
