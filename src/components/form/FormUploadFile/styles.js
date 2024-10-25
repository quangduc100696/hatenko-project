import styled from 'styled-components';
import { Col, Modal } from 'antd';

export const FormMultiUploadWrapper = styled.div`
  .image-upload {
    height: 50px;
  }
  .uploadArea {
    margin: auto;
    height: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    .anticon {
      color: ${({ theme }) => theme.text.secondary};
      font-size: 60px !important;
    }
    color: ${({ theme }) => theme.text.secondary};
  }

  .ant-upload.ant-upload-drag .ant-upload-btn {
    height: auto;
    padding: 15px;
  }

  .ant-upload.ant-upload-drag {
    width: 100%;
    height: 100%;
    background: transparent;
    border: 3px dashed ${({ theme }) => theme.border.default};
    color: ${({ theme }) => theme.text.secondary};
    top: 0;
    .overlayImage {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: 300ms ease all;
      img {
        transition: 300ms ease all;
        width: 200px;
        height: 200px;
        transform: scale(0.5);
      }
    }
    &:hover {
      .uploadArea {
        .anticon {
          color: ${({ theme }) => theme.palette.primary};
        }
        color: ${({ theme }) => theme.palette.primary};
      }
    }
  }
  .ant-upload.ant-upload-drag-hover {
    .overlayImage {
      opacity: 1;
      img {
        transform: scale(1);
      }
    }
  }
  .upload-image-wrapper {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .uploadImage {
    display: inline-flex;
    text-align: center;
    vertical-align: middle;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    overflow: hidden;
    margin: 5px;
    position: relative;
    z-index: 2;
    min-width: 100px;
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    background: ${({ theme }) => theme.background.content};
    .lbSetDefault {
      background: ${({ theme }) => theme.background.disabled};
      color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
      cursor: pointer;
      visibility: hidden;
      &.active {
        visibility: visible;
        background: ${({ theme }) => theme.palette.primary};
      }
      &:hover {
        visibility: visible;
        background: ${({ theme }) => theme.palette.primary};
      }
    }
    .image {
      border: 1px solid ${({ theme }) => theme.border.default};
      min-width: 100px;
      width: ${({ width }) => width};
      height: ${({ height }) => height};
      border-radius: 4px;
      object-fit: ${({ objectFit }) => objectFit};
    }
    .overlay {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 5px;
      bottom: 0px;
      min-width: 100px;
      width: ${({ width }) => width};
      height: ${({ height }) => height};
      display: flex;
      z-index: 2;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.3);
      visibility: hidden;
      &:hover {
        visibility: visible;
        & ~ .lbSetDefault {
          visibility: visible;
        }
      }
      .anticon {
        color: #fff;
        font-size: 24px;
        margin: 5px;
      }
    }
    &:hover {
      .overlay {
        visibility: visible;
      }
    }
    .image:hover ~ .overlay {
      visibility: visible;
    }
    .loading,
    .icon-file {
      position: absolute;
      font-size: 20px;
    }
    .error {
      color: ${({ theme }) => theme.color.red};
    }
    .file-item {
      border: 1px solid ${({ theme }) => theme.border.default};
      min-width: 100px;
      width: ${({ width }) => width};
      height: ${({ height }) => height};
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-file {
      padding: 10px;
      color: ${({ theme }) => theme.palette.primary};
      background: ${({ theme }) => theme.palette.primary}40;
      border-radius: 50%;
    }
    .file-name {
      margin-top: 5px;
    }
  }
  .selectedImage {
    max-height: 100%;
  }
`;

export const ModalViewStyles = styled(Modal)`
  .ant-modal-close-x {
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .ant-modal-body {
    padding-top: 40px;
  }
`;

export const YoutubeVideoItem = styled(Col)`
  display: inline;
  position: relative;
  .close-icon {
    font-size: medium;
    position: absolute;
    top: -6px;
    right: 0;
    background-color: white;
    border-radius: 60%;
    border: 1px solid white;
    cursor: pointer;
  }
`;
