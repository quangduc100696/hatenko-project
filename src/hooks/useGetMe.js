import { useContext } from 'react';
import MyContext from 'DataContext';

function useGetMe() {
    const { user, setMyData } = useContext(MyContext)
    return {
        user,
        setMe: (me) => setMyData(pre => ({...pre, user: me})),
    };
}

export default useGetMe;
