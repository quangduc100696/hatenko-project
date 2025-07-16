import { useGetAllStockQuery } from 'hooks/useData';
import FormSelectInfinite from './FormSelectInfinite';

const FormInfiniteStock = props => {
  return (
    <FormSelectInfinite
      useGetAllQuery={useGetAllStockQuery}
      name="stockId"
      valueProp="id"
      titleProp="name"
      searchKey="name"
      filterField="id"
      initialFilter={{page: 1}}
      {...props}
    />
  );
};

export default FormInfiniteStock;
