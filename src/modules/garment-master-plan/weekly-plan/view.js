import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class View {
  hasCancel = true;
  hasEdit = true;
  hasDelete = true;

  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  async activate(params) {
      const decoded = Base64Helper.decode(params.id);
      var id = decoded;
      this.data = await this.service.getById(id);
      var totalUsedEH = this.data.Items.reduce(
        (acc, cur) => acc + cur.UsedEH
        ,0
      );
      this.hasDelete = totalUsedEH == 0;
  }

  cancel(event) {
    this.router.navigateToRoute('list');
  }

  edit(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute('edit', { id: encoded });
  }

  delete(event) {
    this.service.delete(this.data)
        .then(result => {
          this.cancel();
        });
  }  
}