import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EchoesState } from '../store';
import { getActiveTrackId$, getNowPlaylist$ } from '../store/reducers';
import { NowPlaylistActions, NowPlaylistInterface } from '../store/now-playlist';
import { YoutubeVideosInfo } from './youtube-videos-info.service';

@Injectable()
export class NowPlaylistService {
  public playlist$ = this.store.let(getNowPlaylist$);
  public activeTrackId$ = this.store.let(getActiveTrackId$);

  constructor(
    public store: Store<EchoesState>,
    private youtubeVideosInfo: YoutubeVideosInfo,
    private nowPlaylistActions: NowPlaylistActions
  ) {}

  queueVideo(mediaId: string) {
    return this.youtubeVideosInfo.api
      .list(mediaId)
      .map(items => items[0]);
  }

  queueVideos(medias: GoogleApiYouTubeVideoResource[]) {
    this.store.dispatch({ type: NowPlaylistActions.QUEUE_VIDEOS, payload: medias });
  }

  removeVideo(media) {
    this.store.dispatch(this.nowPlaylistActions.removeVideo(media));
  }

  selectVideo(media) {
    this.store.dispatch({ type: NowPlaylistActions.SELECT, payload: media });
  }

  updateFilter(filter: string) {
    this.store.dispatch({ type: NowPlaylistActions.FILTER_CHANGE, payload: filter });
  }

  clearPlaylist() {
    this.store.dispatch({ type: NowPlaylistActions.REMOVE_ALL });
  }

  selectNextIndex() {
    this.store.dispatch(this.nowPlaylistActions.selectNext());
  }

  selectPreviousIndex() {
    this.store.dispatch(this.nowPlaylistActions.selectPrevious());
  }

  trackEnded() {
    this.store.dispatch(this.nowPlaylistActions.mediaEnded());
  }

  getCurrent() {
    let media;
    this.playlist$.take(1).subscribe(playlist => {
      media = playlist.videos.find(video => video.id === playlist.selectedId);
    });
    return media;
  }

  updateIndexByMedia(mediaId: string) {
    this.store.dispatch(this.nowPlaylistActions.updateIndexByMedia(mediaId));
  }

  isInLastTrack(): boolean {
    let nowPlaylist: NowPlaylistInterface;
    this.playlist$.take(1).subscribe(_nowPlaylist => nowPlaylist = _nowPlaylist);
    const currentVideoId = nowPlaylist.selectedId;
    const indexOfCurrentVideo = nowPlaylist.videos.findIndex(video => video.id === currentVideoId);
    const isCurrentLast = indexOfCurrentVideo + 1 === nowPlaylist.videos.length;
    return isCurrentLast;
  }
}
