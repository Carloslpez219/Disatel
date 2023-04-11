import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrabajarEmergentesPage } from './trabajar-emergentes.page';

describe('TrabajarEmergentesPage', () => {
  let component: TrabajarEmergentesPage;
  let fixture: ComponentFixture<TrabajarEmergentesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrabajarEmergentesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrabajarEmergentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
