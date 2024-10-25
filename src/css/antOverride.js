import { createGlobalStyle } from 'styled-components';

export const AntOverrideStyles = createGlobalStyle`
  .ant-carousel .slick-dots li {
    button {
      background: ${({ theme }) => theme.palette.primary} !important;
    }
    &.slick-active button {
      background: ${({ theme }) => theme.palette.primary} !important;
    }
  }                   
  .ant-form-item-required::before {
    content: none!important;
  }

  .ant-form-item-required::after {
    display: inline-block !important;
    margin-left: 4px !important;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*' !important;
  }

  .ant-modal-confirm .ant-modal-confirm-btns {
    display: flex;
    justify-content: flex-end;
  }
  .ant-modal-confirm .ant-modal-body {
    padding: 24px!important;
  }
  
  .ant-btn-primary {
    color: ${({ theme }) => theme.text.primaryButtonTextColor} !important;
  }

  .ant-btn-transparent {
    border-color: transparent !important;
  }

  .ant-radio-disabled + span {
    color: #1f2933;
  }

  .ant-checkbox-inner {
    border-radius: 4px !important;
  }

  .ant-checkbox:not(.ant-checkbox-checked) .ant-checkbox-inner, .ant-radio:not(.ant-radio-checked) .ant-radio-inner {
    border-color: ${({ theme }) => theme.border.checkboxInner} !important;
  }

  /** Fix style calendar of date picker */
  .ant-calendar-disabled-cell.ant-calendar-today .ant-calendar-date {
    color: rgba(0, 0, 0, 0.4) !important;
    border-color: transparent !important;
  }

  .ant-empty-image svg {
    max-width: 100%;
  }

  .ant-pagination-item-active {
    background: ${({ theme }) => theme.palette.primary} !important;
    border-color: transparent !important;
    a {
      color: ${({ theme }) => theme.text.primaryButtonTextColor} !important;
    }
  }

  /* ---------------*/
  .ant-row::before {
    display: flex;
  }
  
  .ant-table-filter-dropdown {
    @media (max-width: 1600px) {
      height: 160px;
      overflow: auto;
    }
  }

  .ant-tabs-nav .ant-tabs-tab {
    font-weight: bold;
  }

  /* START Style global table */
  .ant-table-thead > tr > th {
    font-size: 12px;
  }

  .ant-table-filter-dropdown {
    height: auto !important;
  }

  .ant-table-tbody > tr.ant-table-row {
    background: #ffffff;
  }
  
  .ant-table-tbody > tr > td {
    font-size: 12px;
    border-bottom-color: transparent !important;
  }

  .ant-table-tbody > tr:nth-child(2n + 1) > td {
    background-color: #FAFAFB;
  }

  .ant-table-tbody > tr.ant-table-row:hover > td:not(.ant-table-cell-fix-right) {
    background: ${({ theme }) => `${theme.palette.primary}20`} !important;
  }

  td.ant-table-cell-fix-right::before {
    content: '';
    position: absolute;
    display: block;
    opacity: 0;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    transition: opacity 0.3s;
    background: ${({ theme }) => `${theme.palette.primary}20`};
  }

  .ant-table-tbody > tr.ant-table-row:hover > td.ant-table-cell-fix-right {
    background-color: #fff;
    &::before {
      opacity: 1;
    }
  }

  .ant-table-thead th:before {
    content: none !important;
  }

  /* END Style global table */

  /** Fix hidden crow icon - task subscription */
  .ant-tabs {
    overflow: unset !important;
  }
`;
