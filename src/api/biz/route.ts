import axios from 'axios';
import { HttpResponse, PaginationRes } from '@/types/global';

export interface RouteRecord {
  routeId: string;
  routeName: string;
  routePath: string;
  routeVersion: string;
  status: string;
  upstreamId: string;
}

export interface RouteParams extends Partial<RouteRecord> {
  current: number;
  pageSize: number;
}

export function queryRouteList(params: RouteParams) {
  return axios.post<HttpResponse<PaginationRes<RouteRecord>>>(
    '/admin/route/list',
    params
  );
}

export function createRoute(params: RouteRecord) {
  return axios.post<HttpResponse>('/admin/route/create', params);
}

export function deleteByRouteId(params: RouteRecord) {
  return axios.post<HttpResponse>('/admin/route/delete', params);
}

export function updateRoute(params: RouteRecord) {
  return axios.post<HttpResponse>('/admin/route/update', params);
}

export function queryRouteDetail(params: RouteRecord) {
  return axios.post<HttpResponse<RouteRecord>>('/admin/route/detail', params);
}
