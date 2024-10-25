import styled from 'styled-components';

const RestFilterStyles = styled.div`
  margin-bottom: 10px;
  .ant-form-item {
    margin-bottom: 10px !important;
  }
  .row-filter {
    .ant-form-item-control-input-content > input,
    .ant-select-selector,
    .ant-picker {
      border: 1px solid transparent;
      ${'' /* background: #EDF1F6;  */}
      :hover, :focus {
        border: 1px solid ${({ theme }) => theme.palette.primary};
      }
    }
    .ant-form-item-label {
      display: none;
    }
    .ant-input-number,
    .ant-picker {
      width: 100%;
    }
    .ant-select-selection__rendered {
      height: 32px;
    }
    .ant-form-item-control {
      line-height: 32px;
    }
  }
  .clearButton {
    background: ${({ theme }) => theme.background.content};
    color: ${({ theme }) => theme.palette.primary};
    border: 1px solid ${({ theme }) => theme.palette.primary};
    box-sizing: border-box;
  }
  .row-action-bottom {
    display: flex;
    button {
      width: 50%;
      margin-bottom: 10px;
    }
    .filterButton {
      margin-right: 16px;
    }
  }
  .col-export-excel {
    text-align: right;
    .ant-btn {
      border-color: transparent !important;
    }
    .anticon {
      font-size: 22px;
    }
  }
`;

export default RestFilterStyles;
