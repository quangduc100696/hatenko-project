import React from 'react';
import { Navigate } from 'react-router-dom';
import FuseUtils from 'utils/FuseUtils';
import { LoginConfig } from './AuthConfig';
import { HomeConfig } from './HomeConfig';
import { ProductConfig } from './ProductConfig';

const routeConfigs = [
    LoginConfig,
    ProductConfig,
    HomeConfig
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
    { element: () => <Navigate to="/error-404"/> }
];

export default routes;
