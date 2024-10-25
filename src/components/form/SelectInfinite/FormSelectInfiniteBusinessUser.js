import { useGetAllBusinessUsersQuery } from 'hooks/useData';
import FormSelectInfinite from './FormSelectInfinite';

const FormSelectInfiniteBusinessUser = props => {
  return (
    <FormSelectInfinite
      useGetAllQuery={useGetAllBusinessUsersQuery}
      name="assigneeId"
      valueProp="id"
      titleProp="fullName"
      searchKey="fullName"
      filterField="id"
      {...props}
    />
  );
};

export default FormSelectInfiniteBusinessUser;
