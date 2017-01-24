import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { YoutubeMedia } from '../youtube-media/youtube-media';
import './youtube-list.scss';

@Component({
  selector: 'youtube-list',
  template: `
  <ul class="list-unstyled clearfix">
    <li class="youtube-list-item" *ngFor="let media of list">
      <youtube-media
        [media]="media"
        (play)="playSelectedVideo(media)"
        (queue)="queueSelectedVideo(media)"
        (add)="addVideo(media)">
      </youtube-media>
    </li>
  </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YoutubeList {
  @Input() list: GoogleApiYouTubeVideoResource[] = [];
  @Output() play = new EventEmitter();
  @Output() queue = new EventEmitter();
  @Output() add = new EventEmitter();

  constructor() {}

  playSelectedVideo(media) {
    this.play.next(media);
  }

  queueSelectedVideo(media) {
    this.queue.next(media);
  }

  addVideo(media) {
    this.add.next(media);
  }
}
