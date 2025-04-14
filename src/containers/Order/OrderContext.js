// OrderContext.tsx
import { createContext, useContext, useState } from "react";

const OrderContext = createContext(null);

export const useOrderContext = () => useContext(OrderContext);

export const OrderProvider = ({ children, data }) => {
    const [listSp, setListSp] = useState(data?.details || []);
    const [customer, setCustomer] = useState({});

  return (
    <OrderContext.Provider value={{ listSp, customer, setListSp, setCustomer }}>
      {children}
    </OrderContext.Provider>
  );
};
