import { useNavigate } from 'react-router-dom';
import DeleteButton from '../DeleteButton';
import useDeleteMutation from 'hooks/useDeleteMutation';

const DeleteMutationButton = ({
  deleteMutation,
  record,
  formatOnSubmit = record => ({
    id: record?.id,
  }),
  rootPathList,
  rootPathDelete,
  ...props
}) => {

  const [ deleteRecord ] = useDeleteMutation();
  const navigate = useNavigate();

  const deleteItem = () => {
    if(deleteMutation) {
      return deleteMutation(record);
    }
    return deleteRecord({
      api: rootPathDelete,
      input: formatOnSubmit(record),
      update: (data) => {
        if (rootPathList) {
          navigate("/" + rootPathList);
        }
      }
    });
  };

  return (
    <DeleteButton 
      deleteItem={deleteItem} 
      record={record} 
      {...props} 
    />
  );
};

export default DeleteMutationButton;
