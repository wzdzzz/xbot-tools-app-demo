import type {ReactNode} from "react";

export type RouteMeta = {
  requiresAuth?: boolean;
  requiresGuest?: boolean;
}

export type AppRoute = {
  path: string;
  element?: ReactNode;
  meta: RouteMeta;
  children?: AppRoute[];
}