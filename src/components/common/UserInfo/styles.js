import styled from 'styled-components';

const UserInfoStyles = styled.div`
  .user-info-wrapper {
    display: flex;
    align-items: center;
    .user-content {
      flex: 1;
      overflow: hidden;
    }
    .ant-avatar {
      margin-right: 10px;
    }
    .user-note {
      font-size: 12px;
      color: ${({ theme }) => theme.text.mainL1};
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`;

export default UserInfoStyles;
