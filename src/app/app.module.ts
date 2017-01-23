import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
// import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { App } from './app.component';
// import { AppState, InteralStateType } from './app.service';

// COMPONENTS
import { APP_CORE_MODULES } from './core/components';
import { APP_FEATURE_MODULES } from './app.feature.modules';

import { CoreModule } from './core';
import { SharedModule } from './shared';
// SERVICES
// import { APP_SERVICES } from './core/services';

// import { NOTIFY_PROVIDERS, NOTIFY_GLOBAL_OPTIONS } from '@ngrx/notify';
// import { BOOTSTRAP_TO_ACTION_PROVIDER } from './ngrx-state.decorator';

// Application wide providers
const APP_PROVIDERS = [
  // AppState,
  // APP_SERVICES
  // BOOTSTRAP_TO_ACTION_PROVIDER
  // NOTIFY_PROVIDERS
];

// type StoreType = {
//   state: InternalStateType,
//   restoreInputValues: () => void,
//   disposeOldHosts: () => void
// };

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    SharedModule,
    CoreModule,

    ...APP_CORE_MODULES,
    ...APP_FEATURE_MODULES
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {
  // constructor(public appRef: ApplicationRef, public appState: AppState) {}

  // hmrOnInit(store: StoreType) {
  //   if (!store || !store.state) return;
  //   console.log('HMR store', JSON.stringify(store, null, 2));
  //   // set state
  //   this.appState._state = store.state;
  //   // set input values
  //   if ('restoreInputValues' in store) {
  //     let restoreInputValues = store.restoreInputValues;
  //     setTimeout(restoreInputValues);
  //   }

  //   this.appRef.tick();
  //   delete store.state;
  //   delete store.restoreInputValues;
  // }

  // hmrOnDestroy(store: StoreType) {
  //   const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
  //   // save state
  //   const state = this.appState._state;
  //   store.state = state;
  //   // recreate root elements
  //   store.disposeOldHosts = createNewHosts(cmpLocation);
  //   // save input values
  //   store.restoreInputValues  = createInputTransfer();
  //   // remove styles
  //   removeNgStyles();
  // }

  // hmrAfterDestroy(store: StoreType) {
  //   // display new elements
  //   store.disposeOldHosts();
  //   delete store.disposeOldHosts;
  // }

}

