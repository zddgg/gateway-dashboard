import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { HttpResponse } from '@/types/global';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<HttpResponse<LoginRes>>('/api/user/login', data);
}

export function logout() {
  return axios.post<HttpResponse<LoginRes>>('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<HttpResponse<UserState>>('/api/user/info');
}

export function getMenuList() {
  return axios.post<HttpResponse<RouteRecordNormalized[]>>('/api/user/menu');
}
