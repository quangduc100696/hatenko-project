import styled from 'styled-components';

const TagCustomWrapper = styled.div`
  border: none;
  align-items: center;
  display: inline-flex;
  line-height: 26px;
  border-radius: 8px;
  padding: 4px 8px;
  overflow: hidden;
  max-width: 100%;
  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
  .anticon {
    /* font-size: 16px; */
    margin-right: 5px;
  }
`;

export default TagCustomWrapper;
