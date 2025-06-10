const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getCompanies = async () => {
  const res = await fetch(`${BASE_URL}/api/options/companies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const getTypes = async () => {
  const res = await fetch(`${BASE_URL}/api/options/types`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
