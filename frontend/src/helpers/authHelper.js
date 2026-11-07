export const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});
