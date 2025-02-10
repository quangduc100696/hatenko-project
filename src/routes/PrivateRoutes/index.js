import React from 'react';
import { Navigate } from 'react-router-dom';
import FuseUtils from 'utils/FuseUtils';
import { authRoles } from 'auth';
import { LoginConfig } from './AuthConfig';
import { HomeConfig } from './HomeConfig';
import { ProductConfig } from './ProductConfig';
import { LeadConfig } from './LeadConfig';
import { LeadNotTakeConfig } from './LeadNotTakeConfig'
import { LeadTookCareConfig } from './LeadTookCareConfig';

const OrderPage = React.lazy(() => import('pages/order'));
const SaleConfig = {
    auth    : authRoles.admin,
    routes  : [
        { path     : '/sale/order', element: <OrderPage /> }
    ]
};

const routeConfigs = [
    LoginConfig,
    ProductConfig,
    SaleConfig,
    HomeConfig,
    LeadConfig,
    LeadNotTakeConfig,
    LeadTookCareConfig
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
    { element: () => <Navigate to="/error-404"/> }
];

export default routes;
