import { of } from 'rxjs/observable/of';
import { defer } from 'rxjs/observable/defer';
import { map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { UserProfileActions, GoogleBasicProfile } from '@store/user-profile';
import * as UserActions from '@store/user-profile';
import { toPayload } from '@utils/data.utils';

import { UserProfile } from '@core/services/user-profile.service';
import { Authorization } from '@core/services/authorization.service';

@Injectable()
export class UserProfileEffects {
  constructor(
    private actions$: Actions,
    private userProfileActions: UserProfileActions,
    private userProfile: UserProfile,
    private auth: Authorization
  ) {}

  @Effect()
  init$ = defer(() => this.auth.loadAuth()).pipe(
    map((googleUser: gapi.auth2.GoogleUser) => new UserActions.UserSigninSuccess(googleUser))
  );

  @Effect()
  updateToken$ = this.actions$.pipe(
    ofType(UserProfileActions.UPDATE_TOKEN),
    map(toPayload),
    map((token: string) => (this.auth.accessToken = token)),
    switchMap(token =>
      this.userProfile.getPlaylists(true).catch((error: Error) => {
        console.log(`error in fetching user's playlists ${error}`);
        return of(error);
      })
    ),
    map(response => this.userProfileActions.updateData(response))
  );

  @Effect()
  addUserPlaylists$ = this.actions$.pipe(
    ofType(UserProfileActions.UPDATE),
    map(toPayload),
    map((data: any) => this.userProfileActions.addPlaylists(data.items))
  );

  @Effect()
  updateNextPageToken$ = this.actions$.pipe(
    ofType(UserProfileActions.UPDATE),
    map(toPayload),
    map(
      ({ nextPageToken }: any) =>
        nextPageToken
          ? this.userProfileActions.updatePageToken(nextPageToken)
          : this.userProfileActions.userProfileCompleted()
    )
  );

  @Effect()
  getMorePlaylists$ = this.actions$.pipe(
    ofType(UserProfileActions.UPDATE_NEXT_PAGE_TOKEN),
    map(toPayload),
    tap((pageToken: string) => this.userProfile.updatePageToken(pageToken)),
    switchMap((pageToken: string) => this.userProfile.getPlaylists(false)),
    map(response => this.userProfileActions.updateData(response))
  );

  @Effect()
  userProfileRecieved$ = this.actions$.pipe(
    ofType(UserProfileActions.USER_PROFILE_RECIEVED),
    map(toPayload),
    map(profile => this.userProfile.toUserJson(profile)),
    map((profile: GoogleBasicProfile) => this.userProfileActions.updateUserProfile(profile))
  );

  // SIGN IN/OUT EFFECTS
  @Effect()
  userSignin$ = this.actions$.pipe(
    ofType(UserProfileActions.USER_SIGNIN),
    map(() => new UserActions.UserSigninStart())
  );

  @Effect()
  userSigninStart$ = this.actions$.pipe(
    ofType(UserProfileActions.USER_SIGNIN_START),
    switchMap(() => this.auth.signIn().catch(error => this.auth.handleFailedLogin(error))),
    map((response: any) => new UserActions.UserSigninSuccess(response))
  );

  @Effect({ dispatch: false })
  userSigninSuccess$ = this.actions$.pipe(
    ofType(UserProfileActions.USER_SIGNIN_SUCCESS),
    tap((response: any) => this.auth.setAuthTimer(response))
  );

  @Effect()
  updateTokenAfterSigninSuccess$ = this.actions$.pipe(
    ofType(UserProfileActions.USER_SIGNIN_SUCCESS),
    map(toPayload),
    map((googleUser: gapi.auth2.GoogleUser) => this.userProfileActions.updateToken(this.auth.extractToken(googleUser)))
  );

  @Effect()
  updateProfileAfterSigninSuccess$ = this.actions$.pipe(
    ofType(UserProfileActions.USER_SIGNIN_SUCCESS),
    map(toPayload),
    map((googleUser: gapi.auth2.GoogleUser) =>
      this.userProfileActions.userProfileRecieved(googleUser.getBasicProfile())
    )
  );

  @Effect()
  userSignout$ = this.actions$.pipe(
    ofType(UserProfileActions.USER_SIGNOUT),
    switchMap(() => this.auth.signOut()),
    map(() => new UserActions.UserSignoutSuccess())
  );

  @Effect({ dispatch: false })
  userSignoutSuccess$ = this.actions$.pipe(
    ofType(UserProfileActions.USER_SIGNOUT_SUCCESS),
    tap(() => this.auth.disposeAutoSignIn())
  );
}
