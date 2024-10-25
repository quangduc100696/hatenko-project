import styled from 'styled-components';
import { Modal } from 'antd';

export const ModalWrapper = styled(Modal)`
  min-height: 30%;
  max-width: calc(100vw - 16px);

  .ant-modal-header {
    border: none;
    height: 70px;
  }

  .header-modal {
    .anticon {
      margin-right: 20px;
      color: ${({ theme }) => theme.palette.primary};
    }
    font-weight: bold;
    font-size: 20px;
  }

  &.reset-padding-top-body .ant-modal-body {
    padding-top: 0;
  }

  &.reset-padding-bottom-body .ant-modal-body {
    padding-bottom: 0;
  }

  &.modal-scroll-y .ant-modal-body {
    max-height: 70vh;
    overflow-y: auto;
  }

  .ant-modal-title,
  .ant-modal-close,
  .ant-modal-close-icon {
    font-size: 18px;
  }

  .multi-upload-wrapper .ant-form-item:not(:first-child) {
    display: none;
  }
  .multi-upload-wrapper .ant-form-item:first-child {
    margin-bottom: 10px;
  }

  .ant-time-picker-input,
  textarea,
  .ant-input,
  .ant-input-affix-wrapper,
  .ant-select-selection,
  .ant-cascader-picker,
  .ant-input-number,
  .ant-select-dropdown-menu,
  .ant-select-dropdown,
  .ant-select-dropdown-menu-vertical {
    background: ${({ theme }) => theme.background.input};
    border: 1px solid ${({ theme }) => theme.background.input};
  }

  .ant-select-selector {
    background: ${({ theme }) => theme.background.input} !important;
    border: 1px solid ${({ theme }) => theme.background.input} !important;
  }

  .ant-modal-footer {
    border: none;
    padding: 24px;
    button:not(:first-child) {
      margin-left: 15px !important;
    }
    button[disabled] {
      background: ${({ theme }) => theme.palette.primary};
      color: #fff;
    }
    button {
      min-width: 150px;
    }
    .cancel-button {
      background: ${({ theme }) => theme.text.grey5};
      border-color: ${({ theme }) => theme.text.grey5};
      &:hover,
      &:focus {
        color: inherit !important;
      }
    }
  }
  .ant-calendar-picker,
  .ant-select {
    width: 100%;
  }

  .ant-input-number {
    width: 100%;
  }
  .ant-form-item .ant-form-explain {
    margin-top: 2px;
  }

  .ant-form-item-label {
    label {
      font-weight: 600;
      &:after {
        content: '';
      }
    }
  }
`;
