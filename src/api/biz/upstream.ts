import axios from 'axios';
import { HttpResponse, PaginationRes } from '@/types/global';

export interface UpstreamRecord {
  upstreamId: string;
  upstreamName: string;
  upstreamType: string;
  httpAddress: string;
  discoveryType: string;
  status: string;
}

export interface UpstreamParams extends Partial<UpstreamRecord> {
  current: number;
  pageSize: number;
}

export function queryUpstreamList(params: UpstreamParams) {
  return axios.post<HttpResponse<PaginationRes<UpstreamRecord>>>(
    '/admin/upstream/list',
    params
  );
}

export function createUpstream(params: UpstreamRecord) {
  return axios.post<HttpResponse>('/admin/upstream/create', params);
}

export function deleteByUpstreamId(params: UpstreamRecord) {
  return axios.post<HttpResponse>('/admin/upstream/delete', params);
}

export function updateUpstream(params: UpstreamRecord) {
  return axios.post<HttpResponse>('/admin/upstream/update', params);
}

export function queryUpstreamDetail(params: UpstreamRecord) {
  return axios.post<HttpResponse<UpstreamRecord>>(
    '/admin/upstream/detail',
    params
  );
}
