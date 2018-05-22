import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CKEditorModule } from '../../../lib/ckeditor.module';
import { DemoFormComponent } from './demo-form.component';

describe('DemoFormComponent', () => {
  let component: DemoFormComponent;
  let fixture: ComponentFixture<DemoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoFormComponent ],
      imports: [ FormsModule, CKEditorModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
