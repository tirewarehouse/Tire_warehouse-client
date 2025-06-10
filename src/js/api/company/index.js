const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getCompanies = async () => {
  const res = await fetch(`${BASE_URL}/api/company/companies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const postCompany = async (request = {}) => {
  const res = await fetch(`${BASE_URL}/api/company/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data;
};

export const deleteCompany = async (id = null) => {
  const res = await fetch(`${BASE_URL}/api/company/companies/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
