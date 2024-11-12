import React, { useEffect } from "react"

export const useMount = (callback) => {
  useEffect(() => {
    callback();
    /* eslint-disable-next-line */
  }, []);
}

/* useUnmount(() => console.log("useUnmount")) */
export const useUnmount = (callback) => {
  const callbackRef = React.useRef(callback)
  callbackRef.current = callback
  useEffect(() => {
    return () => {
      callbackRef.current()
    }
  }, []);
}

/* const [count, setCount] = useSetState(initState) 
*  setCount({ name: 'medium' })
*/
export const useSetState = (initState) => {
  const [ state, setState ] = React.useState(initState)
  const setMergeState = (value) => setState((prevValue) => {
    const newValue = typeof value === 'function' ? value(prevValue) : value
    return newValue ? { ...prevValue, ...newValue } : prevValue
  })
  return [ state, setMergeState ]
}

/*
const [ count, setCount ] = React.useState(0)
useUpdateEffect(() => {
  console.log('Count changed', count)
}, [ count ])
*/
export const useUpdateEffect = function (effectCallback, deps = [])  {

  const isFirstMount = React.useRef(false)
  useEffect(() => {
    return () => {
      isFirstMount.current = false
    }
  }, []);
  
  useEffect(() => {
    /* Không thực thi code cho lần đầu tiên watch */
    if (!isFirstMount.current) {
      isFirstMount.current = true
    } else {
      return effectCallback()
    }
    /* eslint-disable-next-line */
  }, deps);
}

/*
useEffectAsync(async () => {
  const books = await fetchBooks();
  setBooks(books);
});
*/
export function useEffectAsync(effect, inputs = []) {
  useEffect(() => {
    return effect();
    /* eslint-disable-next-line */
  }, inputs);
}
