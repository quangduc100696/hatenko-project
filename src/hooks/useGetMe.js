import { useContext } from 'react';
import MyContext from 'DataContext';

function useGetMe() {
    const { user, setMyData } = useContext(MyContext)
    const ruleManagers = ["ROLE_ADMIN", "ROLE_MANAGER"];
    return {
        user,
        isUser: () => (user?.userProfiles ?? []).map(i => i.type).includes("ROLE_USER"),
        isLeader: () => (user?.userProfiles ?? []).map(i => i.type).includes("ROLE_LEADER"),
        isLeader: () => (user?.userProfiles ?? []).some((r) => ruleManagers.includes(r.type)),
        setMe: (me) => setMyData(pre => ({ ...pre, user: me })),
    };
}

export default useGetMe;
