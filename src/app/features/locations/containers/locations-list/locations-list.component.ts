import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinct, map, switchMap, take } from 'rxjs/operators';

import { LazyModalService } from '@app/core/lazy-modal';
import { GAEventCategory, GoogleAnalyticsService } from '@app/core/google-analytics';
import {
  CharactersDialogComponent as CharactersDialogComponentType,
  CharacterDialogData,
} from '@app/modals/characters-dialog/characters-dialog.component';
import { LocationsActions, LocationsSelectors } from '@app/shared/data-access-locations';
import { Location } from '@app/shared/models';
import { TableConfig } from '@app/shared/components/table/table.component';

@UntilDestroy()
@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsListComponent implements OnInit, OnDestroy {
  locations$: Observable<TableConfig<Location>> = this.store.select(LocationsSelectors.getLocations).pipe(
    switchMap((locations: Location[]) =>
      this.translocoService.selectTranslateObject('LOCATIONS.FIELDS').pipe(
        take(1),
        map(
          (translateTitles): TableConfig<Location> => ({
            headers: {
              id: translateTitles.NUM,
              name: translateTitles.NAME,
              type: translateTitles.TYPE,
              dimension: translateTitles.DIMENSION,
            },
            data: locations,
            linkData: (location: Location) => `/locations/${location.id}`,
            actionsHeader: translateTitles.RESIDENTS,
          })
        )
      )
    )
  );
  loading$: Observable<boolean> = this.store.select(LocationsSelectors.getLoading);
  page$: Observable<number> = this.store.select(LocationsSelectors.getCurrentPage);
  pages$: Observable<number> = this.store.select(LocationsSelectors.getTotalPages);
  seoConfig$ = this.translocoService.selectTranslateObject('LOCATIONS.SEO');

  private readonly hoverLocation$ = new Subject<Location>();

  constructor(
    private readonly store: Store,
    private lazyModal: LazyModalService<CharactersDialogComponentType>,
    private googleAnalytics: GoogleAnalyticsService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    // Only dispatch on hover location during debounce time
    this.hoverLocation$
      .pipe(
        debounceTime(300),
        distinct(({ id }) => id),
        untilDestroyed(this)
      )
      .subscribe((location) => this.store.dispatch(LocationsActions.hoverLocationLine({ location })));
  }

  prefetchResidentsOnHover(location: Location): void {
    this.hoverLocation$.next(location);
  }

  async openResidentsDialog(location: Location): Promise<void> {
    const { CharactersDialogComponent } = await import(
      /* webpackPrefetch: true */
      '@app/modals/characters-dialog/characters-dialog.component'
    );
    this.lazyModal.open(CharactersDialogComponent, {
      title: location.name,
      characterIds: location.residents,
    } as CharacterDialogData);

    this.googleAnalytics.sendEvent({
      name: 'Open Characters Dialog Of Location',
      category: GAEventCategory.INTERACTION,
      label: location.name,
      value: location.id,
    });
  }

  ngOnDestroy(): void {
    this.lazyModal.close();
  }
}
