const getLocalStorageByKey = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const setLocalStorageByKey = (key: string, data: Record<string, unknown>) => {
  localStorage.setItem(key, JSON.stringify(data));
};
