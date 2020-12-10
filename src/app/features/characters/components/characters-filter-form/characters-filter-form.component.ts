import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DynamicFormField, FormConfig, generateFilterForm, SelectOption } from '@app/core/dynamic-form';
import { CharacterGender, CharacterSpecies, CharacterStatus, FormIds } from '@app/shared/models';

const row = (fieldGroup: DynamicFormField[]) => DynamicFormField.fieldRow(fieldGroup, 'grid grid-cols-4 mt-4 gap-6');
const fieldClass = 'col-span-2 sm:col-span-1';

@Component({
  selector: 'app-characters-filter-form',
  templateUrl: './characters-filter-form.component.html',
  styleUrls: ['./characters-filter-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersFilterFormComponent implements OnInit {
  form = new FormGroup({});
  formConfig: FormConfig = generateFilterForm({
    formId: FormIds.FORM_CHARACTERS_FILTER_ID,
    fields: [
      row([
        DynamicFormField.input('name', { translate: true, label: 'CHARACTERS.FIELDS.NAME' }, { className: fieldClass }),
        DynamicFormField.select(
          'status',
          {
            translate: true,
            label: 'CHARACTERS.FIELDS.STATUS',
            placeholder: 'CHARACTERS.PLACEHOLDERS.STATUS',
            options: this._status$,
          },
          { className: fieldClass }
        ),
        DynamicFormField.select(
          'gender',
          {
            translate: true,
            label: 'CHARACTERS.FIELDS.GENDER',
            placeholder: 'CHARACTERS.PLACEHOLDERS.GENDER',
            options: this._genders$,
          },
          { className: fieldClass }
        ),
        DynamicFormField.select(
          'species',
          {
            translate: true,
            label: 'CHARACTERS.FIELDS.SPECIES',
            placeholder: 'CHARACTERS.PLACEHOLDERS.SPECIES',
            options: this._species$,
          },
          { className: fieldClass }
        ),
      ]),
    ],
  });

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {}

  resetFilter(): void {
    this.form.reset();
  }

  private get _status$(): Observable<SelectOption[]> {
    return this.translocoService.selectTranslateObject('CHARACTERS.STATUS').pipe(
      map((translated) => [
        {
          value: CharacterStatus.alive,
          label: translated[CharacterStatus.alive.toUpperCase()],
        },
        {
          value: CharacterStatus.dead,
          label: translated[CharacterStatus.dead.toUpperCase()],
        },
        {
          value: CharacterStatus.unknown,
          label: translated[CharacterStatus.unknown.toUpperCase()],
        },
      ])
    );
  }

  private get _genders$(): Observable<SelectOption[]> {
    return this.translocoService.selectTranslateObject('CHARACTERS.GENDER').pipe(
      map((translated) => [
        {
          value: CharacterGender.male,
          label: translated[CharacterGender.male.toUpperCase()],
        },
        {
          value: CharacterGender.female,
          label: translated[CharacterGender.female.toUpperCase()],
        },
        {
          value: CharacterGender.genderless,
          label: translated[CharacterGender.genderless.toUpperCase()],
        },
        {
          value: CharacterGender.unknown,
          label: translated[CharacterGender.unknown.toUpperCase()],
        },
      ])
    );
  }

  private get _species$(): Observable<SelectOption[]> {
    return this.translocoService.selectTranslateObject('CHARACTERS.SPECIES').pipe(
      map((translated) => [
        {
          value: CharacterSpecies.alien,
          label: translated[CharacterSpecies.alien.toUpperCase()],
        },
        {
          value: CharacterSpecies.animal,
          label: translated[CharacterSpecies.animal.toUpperCase()],
        },
        {
          value: CharacterSpecies.human,
          label: translated[CharacterSpecies.human.toUpperCase()],
        },
        {
          value: CharacterSpecies.humanoid,
          label: translated[CharacterSpecies.humanoid.toUpperCase()],
        },
        {
          value: CharacterSpecies.mytholog,
          label: translated[CharacterSpecies.mytholog.toUpperCase()],
        },
        {
          value: CharacterSpecies.poopybutthole,
          label: translated[CharacterSpecies.poopybutthole.toUpperCase()],
        },
        {
          value: CharacterSpecies.robot,
          label: translated[CharacterSpecies.robot.toUpperCase()],
        },
        {
          value: CharacterSpecies.vampire,
          label: translated[CharacterSpecies.vampire.toUpperCase()],
        },
        {
          value: CharacterSpecies.cronenberg,
          label: translated[CharacterSpecies.cronenberg.toUpperCase()],
        },
        {
          value: CharacterSpecies.disease,
          label: translated[CharacterSpecies.disease.toUpperCase()],
        },
        {
          value: CharacterSpecies.unknown,
          label: translated[CharacterSpecies.unknown.toUpperCase()],
        },
      ])
    );
  }
}
