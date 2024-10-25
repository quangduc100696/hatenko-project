import { Calendar } from 'antd';
import HeaderCalender from './HeaderCalender';
import dayjs from 'dayjs';
import moment from 'moment';
import { FORMAT_DATE_INPUT } from 'configs';

const CalendarPicker = ({ value, onChange }) => {
  return (
    <Calendar
      headerRender={HeaderCalender}
      defaultValue={dayjs(moment(value).format(FORMAT_DATE_INPUT))}
      fullscreen={false}
      onChange={onChange}
    />
  );
};

export default CalendarPicker;
