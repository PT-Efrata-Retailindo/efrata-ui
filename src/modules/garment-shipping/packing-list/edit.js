import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service, CoreService } from './service';

@inject(Router, Service, CoreService)
export class Edit {
  isEdit = true;

  constructor(router, service, coreService) {
    this.router = router;
    this.service = service;
    this.coreService = coreService;
  }

  async activate(params) {
    var id = params.id;
    this.data = await this.service.getById(id);
    this.error = {};
    var idx = 0;
    if (this.data.measurements) {
      for (var i of this.data.measurements) {
        i.MeasurementIndex = idx;
        idx++;
      }
    }

    if (this.data.section) {
      //this.selectedSection = await this.coreService.getSectionById(this.data.section.id);
      if(this.data.section.code == "MD01"){
        this.selectedSection = "MD01 – AYU RIMA"
      }
      else{
        this.selectedSection = "MD02 – NOYA KALISTANIA"
      }
    }
    if (this.data.invoiceType) {
      this.selectedInvoiceType = this.data.invoiceType;
    }

    if (this.data.items && this.data.items.length > 0) {
      for (const item of this.data.items) {
        item.buyerAgent = this.data.buyerAgent;
        item.section = this.data.section;
        this.sumSubTotal(item);
      }


      this.data.mode = "UPDATE";
    } else {
      this.data.mode = "CREATE";
    }

    this.isInvoice=false;
    var invoice = await this.service.getInvoiceByPLNo({ size: 1, keyword: this.data.invoiceNo, filter: JSON.stringify({ InvoiceNo: this.data.invoiceNo }) });
    if(invoice.data.length>0){
        this.isInvoice=true;
    }
  }

  cancelCallback(event) {
    this.router.navigateToRoute('view', { id: this.data.id });
  }

  saveCallback(event) {
    this.data.isShipping = true;
    this.service.update(this.data)
      .then(result => {
        this.router.navigateToRoute('view', { id: this.data.id });
      })
      .catch(e => {
        this.error = e;
      })
  }

  sumSubTotal(item) {
    item.subGrossWeight = 0;
    item.subNetWeight = 0;
    item.subNetNetWeight = 0;
    const newDetails = item.details.map(d => {
      return {
        carton1: d.carton1,
        carton2: d.carton2,
        cartonQuantity: d.cartonQuantity,
        grossWeight: d.grossWeight,
        netWeight: d.netWeight,
        netNetWeight: d.netNetWeight
      };
    }).filter((value, index, self) => self.findIndex(f => value.carton1 == f.carton1 && value.carton2 == f.carton2) === index);
    for (const detail of newDetails) {
      const cartonExist = false;
      const indexItem = this.data.items.indexOf(item);
      if (indexItem > 0) {
        for (let i = 0; i < indexItem; i++) {
          const item = this.data.items[i];
          for (const prevDetail of item.details) {
            if (detail.carton1 == prevDetail.carton1 && detail.carton2 == prevDetail.carton2) {
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
}
