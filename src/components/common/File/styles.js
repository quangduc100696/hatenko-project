import styled from 'styled-components';

export const FileListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

export const FileWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border.whiteLilac};
  border-radius: 12px;
  padding: 12px 16px;
`;

export const FileIcon = styled.div`
  margin-right: 12px;

  svg {
    font-size: 26px;
  }
`;

export const FileText = styled.div`
  color: ${({ theme }) => theme.color.deepCove};
  display: flex;
  align-items: center;

  > span {
    margin-right: 8px;
    line-height: 1;
  }

  > div {
    display: flex;
    align-items: center;

    span {
      &:first-child {
        display: inline-block;
        max-width: 125px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 0;
      }
    }
  }
`;

export const FileAction = styled.div`
  > span {
    display: inline-block;
    padding: 9px;
    box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.1),
      0px 4px 20px -2px rgba(50, 50, 71, 0.08);
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.white};
    cursor: pointer;
    margin-left: 16px;

    svg {
      font-size: 24px;
    }
  }
`;
