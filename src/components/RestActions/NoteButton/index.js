import { Tooltip } from 'antd';
import { DailyExpenseFIcon } from 'components/common/Icons/FontIcons';
import { NoteWrapper } from './styles';

const NoteButton = ({ title }) => {
  return (
    <NoteWrapper>
      <Tooltip placement="left" title={title ? title : false}>
        <DailyExpenseFIcon className="note-icon" />
      </Tooltip>
    </NoteWrapper>
  );
};

export default NoteButton;
