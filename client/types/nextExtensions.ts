import { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';

type WithIsoAxios = {
  isoAxios: AxiosInstance;
};

type WithCurrentUser = {
  currentUser: any;
};

export type GetInitialPropsArg = NextPageContext &
  WithIsoAxios &
  WithCurrentUser;
