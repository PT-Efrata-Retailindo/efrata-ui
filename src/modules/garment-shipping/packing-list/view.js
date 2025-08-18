import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service, CoreService } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service, CoreService)
export class View {

    constructor(router, service, coreService) {
        this.router = router;
        this.service = service;
        this.coreService = coreService;
    }

    async activate(params) {
        const decoded = Base64Helper.decode(params.id);
        var id = decoded;
        this.data = await this.service.getById(id);
        var idx=0;
        if(this.data.measurements){
            for(var i of this.data.measurements){
                i.MeasurementIndex=idx;
                idx++;
            }
        }
        if(this.data.isUsed){
            // this.editCallback=null;
            this.deleteCallback=null;
        }
        if(this.data.isSampleDelivered)
        {
            this.hasUnpost = true;
        }

        if (this.data.section) {
            //this.selectedSection = await this.coreService.getSectionById(this.data.section.id);
            if(this.data.section.code == "MD01"){
                this.selectedSection = "MD01 – AYU RIMA"
            }else{
                this.selectedSection = "MD02 – NOYA KALISTANIA"
            }
        }
        if(this.data.invoiceType){
            this.selectedInvoiceType= this.data.invoiceType;
        }
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    editCallback(event) {
        const encoded = Base64Helper.encode(this.data.id);
        this.router.navigateToRoute('edit', { id: encoded });
    }

    deleteCallback(event) {
        if (confirm("Hapus?")) {
            this.service.delete(this.data).then(result => {
                this.cancelCallback();
            });
        }
    }
    unpostCallback(event) {
        if (confirm(`Yakin Unpost Data ini ?`)) {
            var ids = [];
            ids.push(this.data.id)
            console.log(this.data);
            var dataToBeUnPosted = {
                id: ids,
                isSampleDelivered: false
            }
            this.service.unpost(dataToBeUnPosted)
                .then(result => {
                    this.cancelCallback();
                })
                .catch(e => {
                    this.error = e;
                    if (typeof (this.error) == "string") {
                        alert(this.error);
                    } else {
                        alert("Missing Some Data");
                    }
                })
        }

    }

}
