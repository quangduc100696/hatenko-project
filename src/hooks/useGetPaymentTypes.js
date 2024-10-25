import { useEffect, useState } from 'react';
import CardService from 'services/CardService';

export const useGetPaymentTypes = () => {

    const [ paymentTypes, setMyData ] = useState([]);
    useEffect(() => {
        Promise.resolve(CardService.getPaymentMethod()).then(setMyData);
    }, [setMyData]);

    return { 
        paymentTypes 
    };
}
