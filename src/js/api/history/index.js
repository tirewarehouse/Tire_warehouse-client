const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getHistories = async () => {
  const res = await fetch(`${BASE_URL}/api/history/histories`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};

export const postHistory = async (request = {}) => {
  const res = await fetch(`${BASE_URL}/api/history/histories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};

export const deleteHistory = async (id = null) => {
  const res = await fetch(`${BASE_URL}/api/history/histories/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return data;
};

export const putHistory = async (id = null, request = {}) => {
  const res = await fetch(`${BASE_URL}/api/history/histories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};
