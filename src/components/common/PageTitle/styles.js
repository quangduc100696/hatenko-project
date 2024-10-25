import styled from 'styled-components';

export default styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 30px;
  align-items: center;
  height: fit-content;
  transition: padding-left 0.3s ease 0.1s, padding-right 0.3s ease 0.1s,
    position 0 ease 0.3s;
  .extraAction {
    margin-bottom: 0.5em;
    margin-left: 15px;
  }
  .page-title {
    &__left {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    &__title {
      font-size: 28px;
      font-weight: bold;
      color: ${({ theme }) => theme.text.primary};
    }
    &__desc {
      font-size: 14px;
      line-height: 23px;
      color: #808da4;
      white-space: break-spaces;
    }
  }
`;
