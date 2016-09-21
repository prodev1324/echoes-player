import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store} from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { window } from '@angular/platform-browser/src/facade/browser';

import { YoutubePlayerService, NowPlaylistService, UserManager, Authorization } from '../core/services';
import { user, UserProfile } from '../core/store/user-manager';
import { EchoesState } from '../core/store';

import './user-area.less';

@Component({
	selector: 'user-area.user-area',
	template: `
	<article class="col-md-12">
		<h2>My Area - <small>My Playlists</small></h2>
		<p *ngIf="!isSignIn()" class="well lead">
			To view your playlists in youtube, you need to sign in.
			<button class="btn btn-lg btn-danger"
				(click)="signInUser()">
				<i class="fa fa-google-plus"></i> Sign In
			</button>
		</p>
		<section class="videos-list">
			<div class="list-unstyled ux-maker youtube-items-container clearfix">
				<youtube-playlist
					*ngFor="let playlist of playlists$ | async"
					[media]="playlist"
					(play)="playSelectedPlaylist(playlist)"
					(queue)="queueSelectedPlaylist(playlist)">
				</youtube-playlist>
			</div>
		</section>
	</article>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserArea implements OnInit {
	playlists$: Observable<GoogleApiYouTubePlaylistResource[]>;
	user$: Observable<UserProfile>;

	constructor(
		public youtubePlayer: YoutubePlayerService,
		private nowPlaylistService: NowPlaylistService,
		private userManager: UserManager,
		private authorization: Authorization,
		public store: Store<EchoesState>) {}

	ngOnInit () {
		this.playlists$ = this.store.select(state => state.user.playlists);
		this.user$ = this.store.select(state => state.user);
	}

	signInUser () {
		this.authorization.signIn();
	}

	isSignIn () {
		return this.authorization.isSignIn();
	}

	getPlaylists () {
		return this.userManager.getPlaylists(true);
	}

	playSelectedPlaylist (media: GoogleApiYouTubePlaylistResource) {
		this.userManager.fetchPlaylistItems(media.id)
			.then(response => {
				this.nowPlaylistService.queueVideos(response.items);
				this.youtubePlayer.playVideo(response.items[0]);
			});
		// this.youtubePlayer.playVideo(media);
		// this.queueSelectedVideo(media);
		// this.nowPlaylistService.updateIndexByMedia(media);
	}

	queueSelectedPlaylist (media: GoogleApiYouTubePlaylistResource) {
		// this.nowPlaylistService.queueVideo(media);
	}
}
