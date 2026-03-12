import { useEffect, useState } from "react";
import { storage } from "../utils/storage";

const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(() => storage.get(key, defaultValue));

  useEffect(() => {
    storage.set(key, state);
  }, [key, state]);

  return [state, setState];
};

export default usePersistedState;
