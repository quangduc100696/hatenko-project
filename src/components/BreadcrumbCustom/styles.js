import styled from 'styled-components';

export const BreadcrumbWrapper = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 20px;

  .breadcrumb-item {
    &__name {
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
    }
    &__link {
      cursor: pointer;
      &:hover {
        color: ${({ theme }) => theme.palette.primary} !important;
      }
    }
  }

  .antd-breadcrumb > span:last-child {
    color: ${({ theme }) => theme.palette.primary} !important;
  }
`;
