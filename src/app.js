import { Aurelia, inject, computedFrom } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { AuthStep } from './utils/auth-step';
import routes from './routes/index';

@inject(AuthService)

export class App {
  constructor(authService) {
    this.authService = authService;
  }

  attached() {
    // Hide the initial splash screen when the app is fully loaded
    setTimeout(() => {
      const splash = document.querySelector('.splash');
      if (splash) {
        splash.style.opacity = '0';
        splash.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
          splash.style.display = 'none';
        }, 500);
      }
    }, 1000);
  }

  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.addPipelineStep('authorize', AuthStep);
    config.map(routes);
    this.router = router;
  }

  @computedFrom('authService.authenticated')
  get isAuthenticated() {
    return this.authService.authenticated;
  }
}
