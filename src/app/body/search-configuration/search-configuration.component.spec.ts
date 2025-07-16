import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchConfigurationComponent } from './search-configuration.component';

describe('SearchConfigurationComponent', () => {
  let component: SearchConfigurationComponent;
  let fixture: ComponentFixture<SearchConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
