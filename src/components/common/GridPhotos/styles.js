import styled from 'styled-components';

const GridPhotosWrapper = styled.div`
  margin: -4px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  .ant-empty {
    width: 100%;
  }
  .photo-item-wrapper {
    min-width: 100px;
    padding: 4px;
    overflow-y: hidden;
    box-sizing: border-box;
    flex-basis: 0px;
    overflow-x: hidden;
    position: relative;
    flex-grow: 1;
    display: block;
    .photo-item {
      padding-top: 100%;
      position: relative;
      width: 100%;
      height: 0;
      display: block;
      .photo-item-main {
        min-height: 0;
        padding-right: 0;
        box-sizing: border-box;
        padding-bottom: 0;
        position: absolute;
        margin-bottom: 0;
        right: 0;
        margin-top: 0;
        top: 0;
        padding-top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        bottom: 0;
        min-width: 0;
        margin-left: 0;
        align-items: stretch;
        flex-shrink: 1;
        z-index: 0;
        margin-right: 0;
        flex-direction: column;
        flex-grow: 1;
        padding-left: 0;
        border-style: solid;
        border-width: 0;
        .a-photo-item {
          padding-right: 0;
          box-sizing: border-box;
          padding-bottom: 0;
          margin-bottom: 0;
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
          position: relative;
          margin-top: 0;
          width: 100%;
          padding-top: 0;
          text-align: inherit;
          margin-left: 0;
          color: inherit;
          background-color: transparent;
          touch-action: manipulation;
          height: 100%;
          margin-right: 0;
          padding-left: 0;
          display: block;
          border-left: 0;
          border-top: 0;
          border-right: 0;
          border-bottom: 0;
          list-style: none;
          outline: none;
          text-decoration: none;
          .image-photo-item {
          }
        }
      }
    }
  }
  .image-photo-item,
  .photo-overlay {
    border-bottom-right-radius: 8px;
    border-top-left-radius: 8px;
    box-sizing: border-box;
    border-top-right-radius: 8px;
    border-bottom-left-radius: 8px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-left: 1px solid var(--media-inner-border);
    border-top: 1px solid var(--media-inner-border);
    border-bottom: 1px solid var(--media-inner-border);
    border-right: 1px solid var(--media-inner-border);
    cursor: pointer;
  }
  .photo-overlay {
    position: absolute;
    background: rgba(69, 158, 255, 0.6);
    .pics-number {
      white-space: nowrap;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #ffffff;
      font-weight: bold;
      font-size: 32px;
      line-height: 1;
    }
  }
`;

export default GridPhotosWrapper;

export const ModalContentStyles = styled.div`
  padding-top: 25px;
  margin-left: -24px;
  margin-right: -24px;
  ${'' /* height: 540px; */}

  .ant-carousel {
    height: 100%;
    .slick-slide {
      & > div {
        & > div {
          ${'' /* height: 540px; */}
          display: flex !important;
          justify-content: center;
          align-items: center;
          img {
            ${'' /* max-height: 540px; */}
            object-fit: contain;
          }
        }
      }
    }
  }

  .left-arrow,
  .right-arrow {
    position: absolute;
    top: 50%;
    font-size: 28px;
    z-index: 9;
    color: #ccc;
    opacity: 0.75;
  }

  .left-arrow {
    left: 10px;
  }

  .right-arrow {
    right: 10px;
  }
`;
