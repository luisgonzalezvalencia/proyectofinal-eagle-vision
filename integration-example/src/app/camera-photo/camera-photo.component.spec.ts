import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraPhotoComponent } from './camera-photo.component';

describe('CameraPhotoComponent', () => {
  let component: CameraPhotoComponent;
  let fixture: ComponentFixture<CameraPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraPhotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
