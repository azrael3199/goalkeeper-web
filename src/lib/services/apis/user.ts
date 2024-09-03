import axiosInstance from './config';

export const userLogin = async (bearerToken: string) =>
  axiosInstance.get('/login', {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });

export const userRegister = async (bearerToken: string) =>
  axiosInstance.post(
    '/register',
    {},
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
    }
  );
