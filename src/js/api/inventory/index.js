const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const postInventoryIn = async (request = {}) => {
  const res = await fetch(`${BASE_URL}/api/inventory/in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};

export const getCheckLocation = async (params = {}) => {
  const res = await fetch(`${BASE_URL}/api/inventory/check-location?${new URLSearchParams(params).toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const getCheckLocations = async (params = {}) => {
  const res = await fetch(`${BASE_URL}/api/inventory/check-locations?${new URLSearchParams(params).toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const getInventoryDetails = async (params = {}) => {
  const res = await fetch(`${BASE_URL}/api/inventory/get-detail?${new URLSearchParams(params).toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const getCheckCarNumber = async (params = {}) => {
  const res = await fetch(`${BASE_URL}/api/inventory/check-car?${new URLSearchParams(params).toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const putInventoryUpdate = async (carNumber = null, request = {}) => {
  const res = await fetch(`${BASE_URL}/api/inventory/update/${carNumber}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};

export const putUpdateStock = async (request = {}) => {
  const res = await fetch(`${BASE_URL}/api/inventory/update-stock`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};

export const deleteStock = async (params = {}) => {
  const res = await fetch(`${BASE_URL}/api/inventory/delete-stock?${new URLSearchParams(params).toString()}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
