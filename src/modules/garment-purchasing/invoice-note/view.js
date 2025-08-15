import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {
    hasCancel = true;
    hasEdit = true;
    hasDelete = true;
    totalData = 0;
    size = 5;
    items = [];

    constructor(router, service) {
        this.router = router;
        this.service = service;

    }

    async activate(params) {
        
        const decoded = Base64Helper.decode(params.id);
        var id = decoded;
        this.data = await this.service.getById(id);
        this.supplier = this.data.supplier;
        this.currency = this.data.currency;
        this.incomeTax={Id:this.data.incomeTaxId,name:this.data.incomeTaxName,rate:this.data.incomeTaxRate};
        this.vatTax={Id:this.data.vatId, Rate:this.data.vatRate};
        console.log(this.data.hasInternNote);
        //this.vat = this.data.vat;
        this.items = this.data.items;
        this.totalData = this.items.length;
        for(var item in this.data.items)
        { 
            //this.data.deliveryOrder.totalAmount=item.totalAmount.toLocaleString('en-EN', { maximumFractionDigits: 2,minimumFractionDigits:2});
        }
        if(this.data.hasInternNote ===true)
        {
            this.hasEdit = false;
            this.hasDelete = false;
        }else
        {
            this.hasEdit = true;
            this.hasDelete = true;
        }
    }

    cancel(event) {
        this.router.navigateToRoute('list');
    }

    edit(event) {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('edit', { id: encoded });
    }

    delete(event) {

        var itemTemp = [];
        for (var i = 0; i < this.size; i++) {
            if (this.items[i] != undefined) {
                itemTemp.push(this.items[i]);
            }
        }
        this.data.items = itemTemp;
        this.items = this.items.slice(itemTemp.length);

        this.service.delete(this.data).then(result => {
            if (this.size < this.totalData) {
                this.size += this.size;
                this.delete(event);
            }
            this.cancel();
        });
    }
}
