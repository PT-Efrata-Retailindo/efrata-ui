import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class Edit {
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }
isEdit=true;
    async activate(params) {
        const decoded = Base64Helper.decode(params.id);
        var id = decoded;
        this.data = await this.service.getById(id);
        // this.hasItems=false;
        // if(this.data.Items)
        //     if(this.data.Items.length>0){
        //         for(var item of this.data.Items){
        //             item.Uom=this.data.Uom.Unit;
        //             item.PricePerUnit=this.data.Uom.Unit;
        //         }
        //         this.hasItems=true;
        //     }
    }

    view(data) {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    save() {
        this.service.update(this.data).then(result => {
            this.view();
        }).catch(e => {
            this.error = e;
        })
    }
}