import axios from 'axios';
import { HttpResponse, PaginationRes } from '@/types/global';

export interface SecretRecord {
  secretId: string;
  secretName: string;
  secretType: string;
  secretKey: string;
  publicKey: string;
  privateKey: string;
  encodingType: string;
  status: string;
}

export interface SecretParams extends Partial<SecretRecord> {
  current: number;
  pageSize: number;
}

export function querySecretList(params: SecretParams) {
  return axios.post<HttpResponse<PaginationRes<SecretRecord>>>(
    '/admin/secret/list',
    params
  );
}

export function createSecret(params: SecretRecord) {
  return axios.post<HttpResponse>('/admin/secret/create', params);
}

export function deleteBySecretId(params: SecretRecord) {
  return axios.post<HttpResponse>('/admin/secret/delete', params);
}

export function updateSecret(params: SecretRecord) {
  return axios.post<HttpResponse>('/admin/secret/update', params);
}

export function querySecretDetail(params: SecretRecord) {
  return axios.post<HttpResponse<SecretRecord>>('/admin/secret/detail', params);
}
