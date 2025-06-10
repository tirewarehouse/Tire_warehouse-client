const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getWarehouses = async () => {
  const res = await fetch(`${BASE_URL}/api/warehouse/warehouses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const postWarehouse = async (request = {}) => {
  const res = await fetch(`${BASE_URL}/api/warehouse/warehouses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await res.json();
  return data;
};

export const deleteWarehouse = async (id = null) => {
  const res = await fetch(`${BASE_URL}/api/warehouse/warehouses/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const putWarehouse = async (id = null, request = {}) => {
  const res = await fetch(`${BASE_URL}/api/warehouse/warehouses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};
