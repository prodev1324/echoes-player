import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InfiniteScrollModule } from 'angular2-infinite-scroll';
// import { InfiniteScrollModule } from './directives/infinite-scroll';
import { YoutubePlayerModule } from 'ng2-youtube-player';
// import { YoutubePlayerModule } from './components/yt-player';
import { CORE_COMPONENTS } from './components';
import { PIPES } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    YoutubePlayerModule,
    InfiniteScrollModule,
  ],
  declarations: [
    ...CORE_COMPONENTS,
    ...PIPES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ...CORE_COMPONENTS,
    ...PIPES,
    InfiniteScrollModule,
    YoutubePlayerModule,
  ],
  providers: [

  ]
})
export class SharedModule { }
