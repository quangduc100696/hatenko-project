import React, { useReducer, useCallback, useEffect } from 'react'
import { ACTIONS, CHANGE_STORE } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import routes from 'routes/PrivateRoutes';

const DataContext = React.createContext();

const actions =  { 
  [ACTIONS.ADD_USER] : 'user',
  [ACTIONS.REMOVE_USER]: 'user',
  [ACTIONS.TOOGLE_COLLAPSE]: 'isCollapse',
  [ACTIONS.F5_LIST]: 'f5List'
};

function storeReducer(state, action) {
  const { data, type } = action;
  const varible = actions[type];
  return !varible ? state : {
    ...state,
    [varible]: data
  }
}

export const DataProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(storeReducer, {
    routes: routes , isCollapse: false
  })
  const value = {...state, dispatch};
  const handleEventChange = useCallback( ({ type, data }) => {
      dispatch({type, data});
  }, [dispatch]);

  useEffect( () => {
      /* InAppEvent.emit(CHANGE_STORE, { type: 'user', data: data }); */
      InAppEvent.addEventListener(CHANGE_STORE, handleEventChange);
      return () => {
          InAppEvent.removeListener(CHANGE_STORE, handleEventChange);
      };
  }, [handleEventChange]);

  return (
    <DataContext.Provider value={value}>
      { children }
    </DataContext.Provider>
  )
}

export function useStore() {
  const context = React.useContext(DataContext)
  if (context === undefined) {
    throw new Error('useCount must be used within a StoreProvider')
  }
  return context
}

export default DataContext;