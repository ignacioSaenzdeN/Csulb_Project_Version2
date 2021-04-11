import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshotChartComponent } from './snapshot-chart.component';

describe('SnapshotChartComponent', () => {
  let component: SnapshotChartComponent;
  let fixture: ComponentFixture<SnapshotChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapshotChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
