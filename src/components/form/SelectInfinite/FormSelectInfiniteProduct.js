import { useGetAllProductQuery } from 'hooks/useData';
import FormSelectInfinite from './FormSelectInfinite';

const FormSelectInfiniteProduct = props => {
  return (
    <FormSelectInfinite
      useGetAllQuery={useGetAllProductQuery}
      name="productId"
      valueProp="id"
      titleProp="name"
      searchKey="name"
      filterField="id"
      {...props}
    />
  );
};

export default FormSelectInfiniteProduct;
