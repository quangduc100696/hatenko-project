import { createGlobalStyle } from 'styled-components';
import { CLASS_UTILITY } from './utilities';

export const GlobalStyle = createGlobalStyle`
  ${CLASS_UTILITY}
  .form-item-d-none {
    margin-bottom: 0 !important;
    .ant-form-item-control-input {
      display: none;
    }
  }
  /* css selection */
  .loading-select {
    text-align: center;
    margin: auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loading-select-option {
    min-height: 0!important;
    padding: 0!important;
  }
  .text-primary {
    color: ${({ theme }) => theme.text.primaryButtonTextColor} !important;
  }

  .text-secondary {
    color: ${({ theme }) => theme.text.mainL2};
  }

  .link-default {
    color: ${({ theme }) => theme.text.primary} !important;
    &:hover,
    &:focus {
      color: ${({ theme }) => theme.palette.primary} !important;
    }
  }

  .gradientBackground {
    background-image: ${({ theme }) =>
      `linear-gradient(90deg, ${theme.palette.lightPrimary}, ${theme.palette.primary})`};
  }

  .responsive-pagination-top {
    @media only screen and (min-width: 1100px) {
      .pagination-table-col {
        width: 65%;
      }
      .actions-table-col {
        width: 35%;
      }
    }

    @media only screen and (max-width: 1099px) {
      .pagination-top-row {
        flex-direction: column;
      }
      .pagination-table-col {
        width: 100%;
      }
      .actions-table-col {
        width: 100%;
        .action-buttons-show {
          margin-top: 15px;
        }
      }
    }
  }

  .btn-grey {
    background: ${({ theme }) => theme.text.grey5} !important;
    border-color: ${({ theme }) => theme.text.grey5} !important;
  }

  .btn-second-primary {
    background: ${({ theme }) => theme.color.blueSecondary} !important;
    border-color: transparent !important;
    color: #fff !important;
    &:hover, &:focus {
      background: ${({ theme }) => theme.color.blueSecondary} !important;
      color: #fff !important;
      opacity: 0.85;
    }
  }

  .btn-grey {
    background: ${({ theme }) => theme.text.grey5} !important;
    border-color: ${({ theme }) => theme.text.grey5} !important;
  }

  .btn-transparent {
    background: transparent !important;
    border-color: transparent !important;
  }

  .wrapper-relative {
    flex-grow: 1;
    position: relative;
  }

  .wrapper-absolute {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
  }

  .box-wrapper {
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
  }

  .search-input, .search-input .ant-input {
    background: ${({ theme }) => theme.background.input} !important;
    border: 1px solid ${({ theme }) => theme.background.input} !important;
  } 

  .btn-overflow-hidden {
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
    max-width: 100% !important;
    > span:not(.anticon) {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .error {
    color: ${({ theme }) => theme.color.error};
  }

  .success {
    color: ${({ theme }) => theme.color.success};
  }

  .bg-infor {
    background-color: ${({ theme }) => theme.color.infoDefault}; 
  }

  .bg-sun {
    background-color: ${({ theme }) => theme.border.sun}; 
  }
  .hidden {
    display: none !important;
  }
  .my__content {
    margin-top: 20px;
  }
  .line-dash {
    background: #f4f4f4;
    border-top: 1px dashed red;
  }
  .btn-next {
    background-color: #faad14;
    border-color: #faad14;
    padding: 0px 40px;
    text-transform: uppercase;
    color: #000 !important;
    border-radius: 20px;
    float: right;
  }
`;
