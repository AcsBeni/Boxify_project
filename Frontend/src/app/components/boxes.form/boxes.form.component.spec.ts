import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesFormComponent } from './boxes.form.component';

describe('BoxesFormComponent', () => {
  let component: BoxesFormComponent;
  let fixture: ComponentFixture<BoxesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
