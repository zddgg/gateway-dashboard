import axios from 'axios';
import { HttpResponse, PaginationRes } from '@/types/global';

export interface EnterpriseRecord {
  enterpriseId: string;
  enterpriseName: string;
  status: string;
}

export interface EnterpriseParams extends Partial<EnterpriseRecord> {
  current: number;
  pageSize: number;
}

export function queryEnterpriseList(params: EnterpriseParams) {
  return axios.post<HttpResponse<PaginationRes<EnterpriseRecord>>>(
    '/admin/enterprise/list',
    params
  );
}

export function createEnterprise(params: EnterpriseRecord) {
  return axios.post<HttpResponse>('/admin/enterprise/create', params);
}

export function deleteByEnterpriseId(params: EnterpriseRecord) {
  return axios.post<HttpResponse>('/admin/enterprise/delete', params);
}

export function updateEnterprise(params: EnterpriseRecord) {
  return axios.post<HttpResponse>('/admin/enterprise/update', params);
}

export function queryEnterpriseDetail(params: EnterpriseRecord) {
  return axios.post<HttpResponse<EnterpriseRecord>>(
    '/admin/enterprise/detail',
    params
  );
}
