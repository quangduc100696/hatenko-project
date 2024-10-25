import React from 'react';
import { withTheme } from 'styled-components';
import { ContentStyles } from './styles';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const ContentOverlay = ({ handleAddEmoji }) => {
  return (
    <ContentStyles>
      <Picker
        data={data}
        onEmojiSelect={handleAddEmoji}
      />
    </ContentStyles>
  );
};

export default withTheme(ContentOverlay);
