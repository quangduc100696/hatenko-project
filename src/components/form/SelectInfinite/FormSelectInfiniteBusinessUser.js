import { useGetAllBusinessUsersQuery } from 'hooks/useData';
import FormSelectInfinite from './FormSelectInfinite';

const FormSelectInfiniteBusinessUser = ({ 
  name="assigneeId", 
  ...props
}) => {
  return (
    <FormSelectInfinite
      useGetAllQuery={useGetAllBusinessUsersQuery}
      name={name}
      valueProp="id"
      titleProp="fullName"
      searchKey="fullName"
      filterField="id"
      {...props}
    />
  );
};

export default FormSelectInfiniteBusinessUser;
