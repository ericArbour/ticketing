import axios, { AxiosInstance } from 'axios';
import { IncomingMessage } from 'http';

export function buildIsoAxios(req?: IncomingMessage): AxiosInstance {
  if (typeof window === 'undefined')
    // We are on the server
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req ? req.headers : null,
    });

  return axios;
}
