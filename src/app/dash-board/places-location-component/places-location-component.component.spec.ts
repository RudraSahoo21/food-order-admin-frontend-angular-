import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesLocationComponentComponent } from './places-location-component.component';

describe('PlacesLocationComponentComponent', () => {
  let component: PlacesLocationComponentComponent;
  let fixture: ComponentFixture<PlacesLocationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacesLocationComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacesLocationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
