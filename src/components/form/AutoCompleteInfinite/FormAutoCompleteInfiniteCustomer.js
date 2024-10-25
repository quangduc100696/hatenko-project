import { useGetAllCustomersSimpleQuery } from 'hooks/useData';
import FormAutoCompleteInfinite from './FormAutoCompleteInfinite';

const FormAutoCompleteInfiniteCustomer = props => {
  return (
    <FormAutoCompleteInfinite
      useGetAllQuery={useGetAllCustomersSimpleQuery}
      name="customerId"
      valueProp="id"
      titleProp="name"
      {...props}
    />
  );
};

export default FormAutoCompleteInfiniteCustomer;
