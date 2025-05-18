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
import { CohoiConfig } from './CohoiConfig';
import { ListKhoConfig } from './KhoConfig';
import { ListInstockConfig } from './TrongkhoConfig';
import { ListWareHouseConfig } from './ListKhoConfig';
import { ListCustomerRetailConfig } from './CustomerRetailConfig';
import { WareHouseConfig } from './WareHouseConfig';
import { ListAcountConfig } from './ListAcountConnfig';
import { ListAcountGroupConfig } from './ListUserGroupConfig';
import { CohoiNotTakeConfig } from './CohoiNotTakeConfig';
import { DuyetTienConfig } from './DuyetTienConfig';
import { ListUserSystemConfig } from './ListUserSysTemConfig';


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
    LeadTookCareConfig,
    CohoiConfig,
    ListKhoConfig,
    ListInstockConfig,
    ListWareHouseConfig,
    ListCustomerRetailConfig,
    WareHouseConfig,
    ListAcountConfig,
    ListAcountGroupConfig,
    CohoiNotTakeConfig,
    DuyetTienConfig,
    ListUserSystemConfig
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
    { element: () => <Navigate to="/error-404"/> }
];

export default routes;
