/**
 * Authorization Roles
 */
const authRoles = {
    admin: '*',
    user: ['ROLE_DBA'],
    partner: ['ROLE_PARTNER'],
    provider: ['ROLE_PROVIDER'],
    sale: ['ROLE_SALE'],
    customer: ['ROLE_CUSTOMER'],
    cskh: ['ROLE_CSKH'],
    onlyGuest: []
};

export default authRoles;
