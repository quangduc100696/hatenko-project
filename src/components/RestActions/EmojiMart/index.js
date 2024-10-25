import { Popover, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { EmojiMartStyles } from './styles';
import ContentOverlay from './ContentOverlay';

const EmojiMart = ({ handleAddEmoji, placement = 'topRight' }) => {
  return (
    <EmojiMartStyles className="emoji-mart-wrapper">
      <Popover
        content={<ContentOverlay handleAddEmoji={handleAddEmoji} />}
        trigger="click"
        placement={placement}
      >
        <Button icon={<SmileOutlined />} className="btn-emoji" />
      </Popover>
    </EmojiMartStyles>
  );
};

export default EmojiMart;
