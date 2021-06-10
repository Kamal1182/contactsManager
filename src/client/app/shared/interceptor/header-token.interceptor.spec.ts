import { TestBed } from '@angular/core/testing';

import { HeaderTokenInterceptor } from './header-token.interceptor';

describe('HeaderTokenInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HeaderTokenInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HeaderTokenInterceptor = TestBed.inject(HeaderTokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
