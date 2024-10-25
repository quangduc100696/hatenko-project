import React, { useMemo } from 'react';
import { useStore } from "DataContext";
import InAppNotify from './InAppNotify';
import ContainerLayouts from "./ContainerLayout";

const MainLayout = (props) => {

    const { user } = useStore();
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