
import React from 'react';

const UserGroupRouter = [
  {
    path: 'userGroup.edit',
    Component: React.lazy(() => import('containers/UserGroup')),
    modalOptions: { title: '', width: 750 }
  }
];

export default UserGroupRouter;