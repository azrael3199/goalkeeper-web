import env from '@root/environment';
import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient();

const axiosInstance = axios.create({
  baseURL: env.httpBackendHost,
});

export default axiosInstance;
