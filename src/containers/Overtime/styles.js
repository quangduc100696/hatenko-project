import styled from 'styled-components';
import { Row } from 'antd';

const FormStyles = styled(Row)`
  .form-list {
    &__list-item {
      position: relative;
      padding: 15px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    &__remove-button {
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 25px;
    }
  }
`;

export default FormStyles;


export const TableStyle = styled.div`
  border: 1px solid #ddd; 
  padding: 20px; 
  border-radius: 5px;
  .table-bordered {
    width: 100%;
    border: 1px solid #ddd;
  }
  .btn_success {
    color: #fff;
    background-color: #5cb85c;
    border-color: #4cae4c;
  }
  .btn-warning {
    margin-left: 10px;
    color: #fff;
    background-color: #f0ad4e;
    border-color: #eea236;
  }
  .btn-blur {
    color: #fff;
    background-color: #5bc0de;
    border-color: #46b8da;
  }
  .table-bordered > tbody > tr > td {
    border-right: 1px solid #ddd;
    padding: 10px;
  }
  .btn-primary {
    color: #fff;
    background-color: #337ab7;
    border-color: #2e6da4;
    margin-top: 3px;
  }
`