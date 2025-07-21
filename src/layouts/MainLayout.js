import React, { useEffect, useMemo } from 'react';
import { useStore } from "DataContext";
import InAppNotify from './InAppNotify';
import ContainerLayouts from "./ContainerLayout";
import OrderService from 'services/OrderService';

const MainLayout = (props) => {

    const { user } = useStore();
    useEffect(() => {
        OrderService.fetchStatus();
        return () => OrderService.empty();
    }, []);
    
    const menoInAppNotify = useMemo( () => {
        return (<InAppNotify />)
    }, []);
    const Layout = ContainerLayouts[user?.id ? 'PrivateLayout' : 'GuestLayout'];

    return <>
        <Layout {...props}/>
        { menoInAppNotify }
    </>
}

export default MainLayout;