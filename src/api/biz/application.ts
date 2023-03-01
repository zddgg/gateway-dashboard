import axios from 'axios';
import { HttpResponse, PaginationRes } from '@/types/global';

export interface ApplicationRecord {
  appId: string;
  appName: string;
  appKey: string;
  appSecret: string;
  enterpriseId: string;
  cryptorEnable: string;
  requestSecretId: string;
  responseSecretId: string;
  status: string;
}

export interface ApplicationParams extends Partial<ApplicationRecord> {
  current: number;
  pageSize: number;
}

export function queryApplicationList(params: ApplicationParams) {
  return axios.post<HttpResponse<PaginationRes<ApplicationRecord>>>(
    '/admin/application/list',
    params
  );
}

export function createApplication(params: ApplicationRecord) {
  return axios.post<HttpResponse>('/admin/application/create', params);
}

export function deleteByAppId(params: ApplicationRecord) {
  return axios.post<HttpResponse>('/admin/application/delete', params);
}

export function updateApplication(params: ApplicationRecord) {
  return axios.post<HttpResponse>('/admin/application/update', params);
}

export function queryApplicationDetail(params: ApplicationRecord) {
  return axios.post<HttpResponse<ApplicationRecord>>(
    '/admin/application/detail',
    params
  );
}
