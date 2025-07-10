import { useGetAllProviderQuery } from 'hooks/useData';
import FormSelectInfinite from './FormSelectInfinite';

const FormSelectInfiniteProvider = props => {
  return (
    <FormSelectInfinite
      useGetAllQuery={useGetAllProviderQuery}
      name="providerId"
      valueProp="id"
      titleProp="name"
      searchKey="name"
      filterField="id"
      {...props}
    />
  );
};

export default FormSelectInfiniteProvider;
