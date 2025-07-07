import styled from 'styled-components';
import { Modal, Row } from 'antd';

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
  .ant-col .ant-form-item {
    margin-bottom: 0px !important;
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

export const FormPriceStyle = styled.div`
  .form-list__list-item .ant-form-item {
    margin-bottom: 0px !important;
  }
`

export const SKUContent = styled.div`
  .ant-typography {
    margin-bottom: 0px;
  }
`

export const ModaleCreateCohoiStyle = styled(Modal)`

  .ant-input-number {
    width: 100%;
  }
  .ant-modal-title {
    background: #ffc016;
    padding: 15px;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }
  .ant-modal-content {
    padding: 0;
  }
`

export const ContainerSerchSp = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  background: #fff;
  width: 30%;
  z-index: 999;
  min-height: 50px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 5px;
  margin-top: 5px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  .wrap-search-sp {
    display: flex; 
    align-items: center; 
    justify-content: flex-start;
    gap: 10px;
    padding-bottom: 10px; 
    margin-bottom: 5px; 
    border-bottom: 1px solid #dbdbdb; 
    cursor: pointer;
    flex-direction: column; 
    padding: 10px;
    transition: background-color 0.3s ease-in-out;
    &:hover {
      background: #FFC016;
      color: #fff;
    }
  }
  .btn_wrap-sp {
    width: 15%; 
    padding-top: 5px; 
    padding-left: 5px; 
    border-right: 1px solid #dbdbdb; 
    display: flex; 
    align-items: center; 
    justify-content: center;
  }
`
