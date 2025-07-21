import { useGetAllCustomersSimpleQuery } from 'hooks/useData';
import FormSelectInfinite from './FormSelectInfinite';

const FormSelectInfiniteCustomer = ({ 
  name = "customerId", 
  ...props
}) => {
  return (
    <FormSelectInfinite
      useGetAllQuery={useGetAllCustomersSimpleQuery}
      name={name}
      valueProp="id"
      titleProp="name"
      searchKey='name'
      filterField='id'
      {...props}
    />
  );
};

export default FormSelectInfiniteCustomer;
