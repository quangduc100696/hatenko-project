import styled from 'styled-components';

const FormStyles = styled.div`
  .form-list {
    &__list-item {
      position: relative;
      padding: 15px;
      border: 2px dashed ${({ theme }) => theme.border.default};
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
