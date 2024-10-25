import styled from 'styled-components';

export const AddUserPointStyles = styled.div`
  display: flex;
  align-items: center;
  .add-user {
    &__avatar-wrapper {
      position: relative;
      display: inline-block;
      margin-right: 6px;
      .booking-antd-avatar {
        border: 1px dashed ${({ theme }) => theme.text.grey4};
        color: ${({ theme }) => theme.text.grey3} !important;
        background: #fff !important;
      }
    }
    &__add-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      color: ${({ theme }) => theme.palette.primary};
    }
    &__add-title {
      color: ${({ theme }) => theme.text.secondary};
    }
  }
`;
