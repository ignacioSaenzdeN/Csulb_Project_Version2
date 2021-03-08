import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountResetValidateComponent } from './account-reset-validate.component';

describe('AccountResetValidateComponent', () => {
  let component: AccountResetValidateComponent;
  let fixture: ComponentFixture<AccountResetValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountResetValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountResetValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
