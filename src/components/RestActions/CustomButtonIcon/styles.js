import styled from 'styled-components';

export const CustomButtonIconWrapper = styled.div`
  .ant-btn::not(.ant-btn-dangerous) {
    color: ${({ theme }) => theme.text.primary};
  }

  .ant-btn {
    border: 0px !important;
    height: 32px !important;
    width: 32px;
    padding: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    &:hover {
      background: transparent;
      transform: scale(1.1, 1.1);
      color: ${({ theme }) => theme.palette.primary} !important;
    }
    &:focus {
      background: transparent;
      transform: scale(1.1, 1.1);
      color: ${({ theme }) => theme.palette.primary} !important;
    }
    .anticon {
      font-size: 20px;
    }
    &[disabled] > i {
      color: ${({ theme }) => theme.background.disabled};
    }
  }

  .normal-action-wrapper {
    position: relative;
  }

  .action-feature-icon {
    position: absolute;
    top: -5px;
    right: -7px;
    font-size: 18px;
    color: ${({ theme }) => theme.subscriptions.colorIcon};
  }
`;
