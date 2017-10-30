import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IAppSettings } from './app-layout.reducer';
import { EchoesState } from '../reducers';

export function getAppLayout$(state$: Store<EchoesState>): Observable<IAppSettings> {
  return state$.select(state => state.appLayout);
}

export function getAppVersion$(state$: Store<EchoesState>): Observable<any> {
  return state$.select(state => state.appLayout.version);
}

export function getSidebarCollapsed$(state$: Store<EchoesState>): Observable<boolean> {
  return state$.select(state => state.appLayout.sidebarExpanded);
}
