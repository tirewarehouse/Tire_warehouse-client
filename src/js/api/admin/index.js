const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const postLogin = async (request = {}) => {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};

export const postAddAdmin = async (request = {}) => {
  const res = await fetch(`${BASE_URL}/api/admin/add-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};

export const putUpdateAdmin = async (request = {}) => {
  const res = await fetch(`${BASE_URL}/api/admin/update-admin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};

export const deleteAdmin = async (params = {}) => {
  const res = await fetch(`${BASE_URL}/api/admin/delete-admin?name=${params.name}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return data;
};

export const getAdmins = async (params = {}) => {
  const res = await fetch(`${BASE_URL}/api/admin/get-admins`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};
