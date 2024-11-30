import { useGetAllCustomersSimpleQuery } from 'hooks/useData';
import FormAutoCompleteInfinite from './FormAutoCompleteInfinite';

const FormAutoCompleteCustomer = props => {
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

export default FormAutoCompleteCustomer;
