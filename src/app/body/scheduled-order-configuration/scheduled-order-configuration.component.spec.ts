import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledOrderConfigurationComponent } from './scheduled-order-configuration.component';

describe('ScheduledOrderConfigurationComponent', () => {
  let component: ScheduledOrderConfigurationComponent;
  let fixture: ComponentFixture<ScheduledOrderConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledOrderConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledOrderConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
