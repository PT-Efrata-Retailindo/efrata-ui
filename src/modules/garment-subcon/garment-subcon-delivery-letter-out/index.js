export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: true, title: 'List' },
            { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View' },
            { route: 'edit/:id', moduleId: './edit', name: 'edit', nav: false, title: 'Edit' },
            { route: 'excel', moduleId: './excel', name: 'excel', nav: false, title: 'Excel: SJ Subcon' }
        ]);
        this.router = router;
    }
}