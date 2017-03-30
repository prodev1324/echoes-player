import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import './player-search.scss';

@Component({
  selector: 'player-search',
  template: `
    <form class="navbar-form form-search" id="media-explorer"
      #form="ngForm"
      (ngSubmit)="onSearch(mediaSearch.value)">
      <div class="form-group clearfix">
        <input placeholder="Explore Media" id="media-search"
          typeahead (typeaheadSelected)="handleSelectSuggestion($event)"
          type="search" class="form-control" autocomplete="off"
          [value]="query.query" #mediaSearch name="mediaSearch"
          (input)="onQueryChange(mediaSearch.value)"
          >
        <button class="btn btn-transparent btn-submit" type="submit" title="search with echoes">
          <i class="fa fa-search"></i>
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerSearch {
  @Input() query;
  @Output() change = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() typing = new EventEmitter<string>();

  @ViewChild('mediaSearch') mediaSearch;

  constructor() { }

  onQueryChange(query: string) {
    this.change.emit(query);
  }

  onSearch(query: string) {
    const _query = query || this.mediaSearch.element.nativeElement.value;
    this.mediaSearch.element.nativeElement.blur();
    this.search.emit(_query);
  }

  handleSelectSuggestion(suggestion: string) {
    this.selectSuggestion(suggestion);
  }

  selectSuggestion(suggestion: string) {
    this.onSearch(suggestion);
  }
}
