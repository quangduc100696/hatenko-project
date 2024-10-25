import styled from 'styled-components';

const BadgeCustomStyles = styled.div`
  .badge-dot {
    margin-right: 6px;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: ${({ color }) => color};
    display: inline-block;
  }
  color: ${({ color }) => color};
  word-wrap: nowrap;
`;

export default BadgeCustomStyles;
