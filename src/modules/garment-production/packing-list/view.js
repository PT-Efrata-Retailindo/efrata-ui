import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";

@inject(Router, Service)
export class View {
  hasCancel = true;
  isView = true;
  hasDelete = true;
  hasEdit = true;
  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  formOptions = {
    cancelText: "Kembali",
    editText: "Ubah",
    deleteText: "Hapus",
  };

  async activate(params) {
    var id = params.id;
    this.data = await this.service.getById(id);
    var idx = 0;

    if (this.data.measurements) {
      for (var i of this.data.measurements) {
        i.MeasurementIndex = idx;
        idx++;
      }
    }

    if (this.data.items) {
      for (const item of this.data.items) {
        item.buyerAgent = this.data.buyerAgent;
        item.section = this.data.section;
        this.sumSubTotal(item);
      }
    }

    switch (this.data.status) {
      case "DRAFT":
      // this.hasDelete = true;
      case "DRAFT_APPROVED_SHIPPING":
        // this.hasEdit = true;
        break;
      case "CREATED":
        this.hasEdit = true;
        this.hasDelete = true;
        break;
      case "POSTED":
        this.hasEdit = true;
        this.hasDelete = true;
        break;
      case "REJECTED_MD":
        this.hasEdit = true;
        this.hasDelete = true;
        break;
      case "REJECTED_SHIPPING_UNIT":
        this.hasEdit = true;
        this.hasDelete = true;
        break;
      default:
        this.hasEdit = null;
        this.hasDelete = null;
        break;
    }

    switch (this.data.status) {
      case "REJECTED_MD":
        this.alertInfo =
          "<strong>Alasan Reject oleh Md:</strong> " +
          (this.data.statusActivities.slice(-1)[0] || {}).remark;
        break;
      case "REJECTED_SHIPPING_UNIT":
        this.alertInfo =
          "<strong>Alasan Reject oleh Shipping:</strong> " +
          (this.data.statusActivities.slice(-1)[0] || {}).remark;
        break;
      default:
        break;
    }
  }

  sumSubTotal(item) {
    item.subGrossWeight = 0;
    item.subNetWeight = 0;
    item.subNetNetWeight = 0;
    const newDetails = item.details
      .map((d) => {
        return {
          carton1: d.carton1,
          carton2: d.carton2,
          cartonQuantity: d.cartonQuantity,
          grossWeight: d.grossWeight,
          netWeight: d.netWeight,
          netNetWeight: d.netNetWeight,
        };
      })
      .filter(
        (value, index, self) =>
          self.findIndex(
            (f) => value.carton1 == f.carton1 && value.carton2 == f.carton2
          ) === index
      );
    for (const detail of newDetails) {
      const cartonExist = false;
      const indexItem = this.data.items.indexOf(item);
      if (indexItem > 0) {
        for (let i = 0; i < indexItem; i++) {
          const item = this.data.items[i];
          for (const prevDetail of item.details) {
            if (
              detail.carton1 == prevDetail.carton1 &&
              detail.carton2 == prevDetail.carton2
            ) {
              cartonExist = true;
              break;
            }
          }
        }
      }
      if (!cartonExist) {
        item.subGrossWeight += detail.grossWeight * detail.cartonQuantity;
        item.subNetWeight += detail.netWeight * detail.cartonQuantity;
        item.subNetNetWeight += detail.netNetWeight * detail.cartonQuantity;
      }
    }
  }

  cancel(event) {
    this.router.navigateToRoute("list");
  }

  edit(event) {
    this.router.navigateToRoute("edit", { id: this.data.id });
  }

  delete(event) {
    if (confirm("Hapus?")) {
      this.service.delete(this.data).then((result) => {
        this.cancel();
      });
    }
  }
}
