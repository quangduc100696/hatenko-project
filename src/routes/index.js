import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import privateRoutes from './PrivateRoutes';
import Loading from 'components/Loading';

function MyRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      { useRoutes(privateRoutes) }
    </Suspense>
  );
}

export default React.memo(MyRoutes);
