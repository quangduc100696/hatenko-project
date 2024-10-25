import styled from 'styled-components';
import { Drawer } from 'antd';

export const DrawerWrapper = styled(Drawer)`
  .ant-drawer-body {
    height: 100%;
    padding: 0 !important;
    overflow: hidden;
  }
  
  .drawer-content-wrapper {
    height: 100%;
  }

  .drawer-content {
    height: calc(100vh - 110px);
    padding: 16px 24px;
    overflow-y: auto;
    overflow-x: hidden;

    ::-webkit-scrollbar {
      width: 6px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      border-radius: 10px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.scrollbar.thumb};
      border-radius: 10px;
    }
  }

  .ant-time-picker-input,
  textarea,
  .ant-input,
  .ant-select-selection,
  .ant-cascader-picker,
  .ant-input-number,
  .ant-select-dropdown-menu,
  .ant-select-dropdown,
  .ant-select-dropdown-menu-vertical,
  .ant-picker,
  .ant-input-affix-wrapper {
    background: ${({ theme }) => theme.background.input};
    border: 1px solid ${({ theme }) => theme.background.input};
  }

  .ant-select-selector {
    background: ${({ theme }) => theme.background.input} !important;
    border: 1px solid ${({ theme }) => theme.background.input} !important;
  }

  .ant-calendar-picker,
  .ant-select,
  .ant-input-number,
  .ant-picker {
    width: 100%;
  }

  .ant-form-item-label {
    label {
      font-weight: bold;
      &:after {
        content: '';
      }
    }
  }
`;

export const FooterStyles = styled.div`
  height: 50px;

  display: flex;
  background: #fff;

  button {
    height: 100%;
    font-size: 16px;
  }

  .footer-drawer-btn {
    height: 100%;
    text-transform: uppercase;
    border: none;
    border-radius: 0 !important;
  }

  .cancel-button {
    background-color: ${({ theme }) => theme.drawer?.cancelBtnBg};
    color: ${({ theme }) => theme.text.mainL1};
    &:hover {
      background-color: ${({ theme }) => `${theme.drawer?.cancelBtnBg}50`};
      color: ${({ theme }) => theme.text.mainL1} !important;
    }
  }
`;

export const HeaderStyles = styled.div`
  height: 60px;
  background: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.text.primaryButtonTextColor};
  padding: 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;

  .drawer-header-title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
