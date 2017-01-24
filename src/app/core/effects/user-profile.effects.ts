import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { UserProfileActions, GoogleBasicProfile } from '../store/user-profile';

import { UserProfile } from '../services/user-profile.service';
import { Authorization } from '../services/authorization.service';

@Injectable()
export class UserProfileEffects {

  constructor(
    private actions$: Actions,
    private userProfileActions: UserProfileActions,
    private userProfile: UserProfile,
    private auth: Authorization
  ) { }

  @Effect()
  updateToken$ = this.actions$
    .ofType(UserProfileActions.UPDATE_TOKEN)
    .map(action => action.payload)
    .map((token: string) => this.auth.accessToken = token)
    .switchMap(token => this.userProfile.getPlaylists(true))
    .map(response => this.userProfileActions.updateData(response));


  @Effect()
  addUserPlaylists$ = this.actions$
    .ofType(UserProfileActions.UPDATE)
    .map(action => action.payload)
    .map((data: any) => this.userProfileActions.addPlaylists(data.items));

  @Effect()
  updateNextPageToken$ = this.actions$
    .ofType(UserProfileActions.UPDATE)
    .map(action => action.payload)
    .map(data => {
      const nextPageToken = data.nextPageToken;
      return nextPageToken
        ? this.userProfileActions.updatePageToken(data.nextPageToken)
        : this.userProfileActions.userProfileCompleted();
    });

  @Effect()
  getMorePlaylists$ = this.actions$
    .ofType(UserProfileActions.UPDATE_NEXT_PAGE_TOKEN)
    .map(action => action.payload)
    .switchMap((pageToken: string) => {
      this.userProfile.updatePageToken(pageToken);
      return this.userProfile.getPlaylists(false);
    })
    .map(response => this.userProfileActions.updateData(response));

  @Effect()
  userProfileRecieved$ = this.actions$
    .ofType(UserProfileActions.USER_PROFILE_RECIEVED)
    .map(action => action.payload)
    .map(profile  => this.userProfile.toUserJson(profile))
    .map((profile: GoogleBasicProfile) => this.userProfileActions.updateUserProfile(profile));
}
