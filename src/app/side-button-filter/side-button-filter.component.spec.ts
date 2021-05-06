import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideButtonFilterComponent } from './side-button-filter.component';

describe('SideButtonFilterComponent', () => {
  let component: SideButtonFilterComponent;
  let fixture: ComponentFixture<SideButtonFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideButtonFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideButtonFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
