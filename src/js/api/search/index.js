const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getSearch = async (keyword = "", warehouse = "") => {
  const res = await fetch(`${BASE_URL}/api/search?keyword=${keyword}&warehouse=${warehouse}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const getSearchAll = async () => {
  const res = await fetch(`${BASE_URL}/api/search/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const postSearch = async (request = {}) => {
  const res = await fetch(`${BASE_URL}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};

export const getSearchWarehouseInventory = async (warehouse = "") => {
  const res = await fetch(`${BASE_URL}/api/search/warehouse?warehouse=${warehouse}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
