import { useState } from 'react';
import SwitchAction from '../SwitchAction';

const SwitchMutationAction = ({
  editMutation,
  record,
  name,
  ...props
}) => {

  const [ checked, setChecked ] = useState(record[name] === '1');
  const onChange = (value) => {
    setChecked(pre => !pre);
    editMutation({...record, [name]: value ? '1' : '2'})
  };

  return (
    <SwitchAction
      onChange={onChange}
      checked={checked}
      {...props}
    />
  );
};

export default SwitchMutationAction;
