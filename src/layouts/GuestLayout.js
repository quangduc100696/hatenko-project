import React, { Suspense } from 'react';
import { Layout } from 'antd';
import Loading from 'components/Loading';
import { useStore } from 'DataContext';
import { useRoutes } from "react-router-dom";

const GuestLayout = (props) => {
    const { routes } = useStore();
    return (
        <Layout>
            <Layout.Content>
                <Suspense fallback={<Loading/>}>
                    { useRoutes(routes) }
                    { props.children }
                </Suspense>
            </Layout.Content>
        </Layout>
    );
};

export default GuestLayout;
