import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarDataflowComponent } from './side-bar-dataflow.component';

describe('SideBarDataflowComponent', () => {
  let component: SideBarDataflowComponent;
  let fixture: ComponentFixture<SideBarDataflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarDataflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarDataflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
