import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class View {
  hasCancel = true;
  hasEdit = true;
  hasDelete = true;
  isView = true;
  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  async activate(params) {
    const decoded = Base64Helper.decode(params.id);
    var id = decoded;
    this.data = await this.service.getById(id);

    const monthOrder = [
      "JANUARI", "FEBRUARI", "MARET", "APRIL",
      "MEI", "JUNI", "JULI", "AGUSTUS",
      "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
    ];


    this.data.Items = this.data.Items
      .sort((a, b) => {
        return monthOrder.indexOf(a.Month) - monthOrder.indexOf(b.Month);
      });

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