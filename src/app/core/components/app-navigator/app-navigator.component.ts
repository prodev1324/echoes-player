import { Router } from '@angular/router';
import { EchoesState } from '../../store';
import { Store } from '@ngrx/store';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { getSearchType$, CSearchTypes } from '../../../core/store/player-search';

@Component({
  selector: 'app-navigator',
  styleUrls: ['./app-navigator.scss'],
  template: `
  <div class="list-group"
    [class.closed]="closed">
    <button class="list-group-item ux-maker"
      *ngFor="let route of routes;"
      (click)="go(route.link)">
      <icon [name]="route.icon"></icon>
      <span class="text">{{ route.label }}</span>
    </button>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavigatorComponent implements OnInit {
  @Input() closed = false;
  @Input() searchType = CSearchTypes.VIDEO;

  public searchType$ = this.store.let(getSearchType$);
  public routes = [
    { link: 'search', icon: 'music', label: 'Explore' }
    // { link: '/user', icon: 'heart', label: 'My Profile' }
  ];

  constructor(
    private store: Store<EchoesState>,
    private router: Router
  ) { }

  ngOnInit() {
  }

  go(link) {
    this.router.navigate([`/${link}/${this.searchType}s`]);
  }
}
