import { useCallback } from 'react';
import { useStore } from 'DataContext';
import { ACTIONS } from 'configs';

function useCollapseSidebar() {
    const { isCollapse, dispatch } = useStore();
    const toggleCollapse = useCallback(() => {
        dispatch({ type: ACTIONS.TOOGLE_COLLAPSE, data: !isCollapse });
    }, [isCollapse, dispatch]);

    return {
        isCollapseSidebar: isCollapse,
        toggleCollapse,
    };
}

export default useCollapseSidebar;
