import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutModif } from './ajout-modif';

describe('AjoutModif', () => {
  let component: AjoutModif;
  let fixture: ComponentFixture<AjoutModif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutModif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutModif);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
