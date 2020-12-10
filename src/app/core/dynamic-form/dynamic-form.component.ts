import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { take, map, skipWhile, distinctUntilChanged } from 'rxjs/operators';

import { FormsEntity, FormsFacade } from './data-access-forms';
import { FormConfig } from './dynamic-form-config';

const FORM_VALID = 'VALID';

@UntilDestroy()
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dynamic-form',
  template: `
    <form
      *ngrxLet="form$ as form"
      [id]="form.formId"
      [formGroup]="formGroup"
      (ngSubmit)="onSubmitForm(form.model)"
      novalidate
    >
      <formly-form
        [form]="formGroup"
        [fields]="config.fields"
        [model]="form.model"
        [options]="config.options"
        (modelChange)="onModelChange($event, form.model)"
      ></formly-form>
      <ng-content></ng-content>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-input-rename
  @Input('form') formGroup = new FormGroup({});
  @Input() config: FormConfig;
  @Output() submitForm = new EventEmitter<any>();
  @Output() modelChanges = new EventEmitter<any>();

  form$: Observable<FormsEntity>;

  constructor(private formsFacade: FormsFacade) {}

  ngOnInit(): void {
    this.formGroup.statusChanges
      .pipe(
        map((status) => status === FORM_VALID),
        skipWhile((valid) => !valid),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe((valid) => this.formsFacade.updateFormValid(this.config.formId, valid));
  }

  ngOnChanges(): void {
    this.form$ = this.formsFacade.formById$(this.config.formId);

    this.form$.pipe(take(1)).subscribe((form) => {
      if (!form || this.config.reset) {
        this.formsFacade.initForm(
          this.config.formId,
          this.config.initialModel,
          this.config.filter || this.config.filterOnSubmit
        );
      } else {
        this.formsFacade.reuseForm(this.config.formId, form.model, this.config.filter);
      }
    });

    this.config.disable ? this.formGroup.disable() : this.formGroup.enable();
  }

  onModelChange(newModel: any, currModel: any): void {
    if (JSON.stringify(newModel) !== JSON.stringify(currModel)) {
      this.formsFacade.updateFormModel(this.config.formId, newModel, this.config.filter);
      this.modelChanges.emit(newModel);
    }
  }

  onSubmitForm(model: any): void {
    this.formsFacade.submitForm(this.config.formId, model, this.config.initialModel, this.config.filterOnSubmit);
    this.submitForm.emit(model);
  }
}
