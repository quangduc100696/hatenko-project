import { useGetAllCustomersSimpleQuery } from 'hooks/useData';
import FormSelectInfinite from './FormSelectInfinite';

const FormSelectInfiniteCustomer = props => {
  return (
    <FormSelectInfinite
      useGetAllQuery={useGetAllCustomersSimpleQuery}
      name="customerId"
      valueProp="id"
      titleProp="name"
      searchKey='name'
      filterField='id'
      {...props}
    />
  );
};

export default FormSelectInfiniteCustomer;
