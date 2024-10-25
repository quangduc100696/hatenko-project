import styled from 'styled-components';

const CollapseWrapperStyles = styled.div`
  position: relative;
  height: 100%;
  .col-info {
    /* padding-right: 20px !important; */
    z-index: 1;
  }

  .collapsed-container {
    transform: scale(0);
    width: 0;
    height: 0;
    flex: 0 !important;
  }

  .row-collapsed-detail {
    .col-info {
      transform-origin: top left;
      transition: all 0.3s;
    }

    .col-right {
      transform-origin: top left;
      transition: all 0.3s;
    }
  }

  @media only screen and (max-width: 992px) {
    .row-collapsed-detail {
      display: flex;
      flex-wrap: wrap;
      /* .col-info {
        padding-right: 0 !important;
      } */
      .col-right {
        width: 100%;
      }
    }
  }
`;

export default CollapseWrapperStyles;
