import styled from 'styled-components';

export const SummaryCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background.content};
  border-radius: 8px;
  height: 100%;
  align-items: inherit;

  .summary-card {
    &__title {
      color: #444;
      font-size: 16px;
    }
    &__value {
      color: #000000;
      font-size: 22px;
      line-height: 22px;
      font-weight: 700;
    }
    &__icon {
      transform: rotate(270deg);
      font-size: 16px;
      line-height: 16px;
      color: white;
    }
  }

  .vInfo {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .row-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
  }
  #hexagon {
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotate(90deg);
    width: 30px;
    height: 20px;
  }

  #hexagon:before {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: -8px;
    left: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 8px solid ${({ backgroundShape }) => backgroundShape};
  }

  #hexagon:after {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    bottom: -8px;
    left: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 8px solid ${({ backgroundShape }) => backgroundShape};
  }
`;
