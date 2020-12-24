import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { RouterStateUrl } from './router.model';

const LANG_PARAM = ':lang';

@Injectable()
export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  private prevRoute: string | null = null;
  private prevPage: number | null = null;

  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let routeSnapshot: ActivatedRouteSnapshot = routerState.root;
    let route = '';
    while (routeSnapshot.firstChild) {
      routeSnapshot = routeSnapshot.firstChild;

      const path = routeSnapshot.routeConfig?.path;
      route = route.concat(!!path && LANG_PARAM !== path ? `/${path}` : '');
    }

    const { params, data, queryParams: queryParamsWithPage } = routeSnapshot;
    const { page, ...queryParams } = queryParamsWithPage;

    const state = {
      url: routerState.url,
      route,
      prevRoute: this.prevRoute,
      queryParams,
      params,
      data,
      page: +page || null,
      prevPage: this.prevPage,
    };
    this.prevRoute = state.route;
    this.prevPage = state.page;

    return state;
  }
}
