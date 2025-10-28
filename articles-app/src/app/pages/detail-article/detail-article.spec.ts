import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArticle } from './detail-article';

describe('DetailArticle', () => {
  let component: DetailArticle;
  let fixture: ComponentFixture<DetailArticle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailArticle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailArticle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
