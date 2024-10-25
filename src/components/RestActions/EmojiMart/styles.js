import styled from 'styled-components';

export const EmojiMartStyles = styled.div`
  .btn-emoji {
    border: none;
    background: transparent;
    box-shadow: none;
    &:hover,
    &:focus {
      background: transparent;
    }
    .anticon {
      font-size: 20px;
      line-height: 15px;
    }
  }
`;

export const ContentStyles = styled.div`
  min-height: 450px;
  min-width: 370px;
  position: relative;
  display: flex;

  .emoji-mart {
    margin: auto;
  }

  .emoji-loading {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .emoji-mart-preview-name,
  .emoji-mart-preview-shortnames,
  .emoji-mart-preview-emoticons {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
