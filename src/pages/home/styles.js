import styled from 'styled-components';

export const HomeWrapper = styled.div`
  width: 100%;
  height: 100%;
`

export const DashboardWrapper = styled.div`
  max-width: 1234px;
  height: 100%;
  margin: 0 auto;
  .title {
    .text {
      margin-left: 15px;
    }
  }
  .pestional-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    > img {
      width: 100px;
      height: 100px;
    }
  }
  .pestional {
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;

    .pestional-item {
      margin-bottom: 5px;
      font-size: 17px;
    }
  }
  .s-start{
    justify-content: start !important;
  }
`
