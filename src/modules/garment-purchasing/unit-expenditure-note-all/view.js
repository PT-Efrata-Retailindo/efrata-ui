import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service,ProductionService } from './service';

@inject(Router, Service,ProductionService)
export class View {
    hasCancel = true;
    hasEdit = true;
    hasDelete = true;

    constructor(router, service,productionService) {
        this.router = router;
        this.service = service;
        this.productionService=productionService;
    }
    async activate(params) {
        var id = params.id;
        this.data = await this.service.getById(id);
        this.unitDeliveryOrder = { UnitDONo:this.data.UnitDONo};
        this.data.Storage.toString = function () {
            return [this.code, this.name]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        }

        this.data.StorageRequest.toString = function () {
            return [this.code, this.name]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        }

        this.data.UnitRequest.toString = function () {
            return [this.Code, this.Name]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        }

        this.data.UnitSender.toString = function () {
            return [this.Code, this.Name]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        }

        if (this.data.Items) {
            for (let item of this.data.Items) {
                item.IsSave = true;
            }
        }
        if(this.data.ExpenditureType === "EXTERNAL"){
            this.hasDelete=false;
            this.hasEdit=false;
        }
        if(this.data.IsPreparing){
            this.hasDelete=false;
            this.hasEdit=false;
        }
        
        if(this.data.IsTransfered){
            this.hasEdit = false;
            this.hasDelete = false;
           
        }
        else if(!this.data.IsTransfered && this.data.ExpenditureType === "TRANSFER"){
            
            var uen= await this.service.getUENById(this.data.Id);
            if(!uen.IsPreparing){
                this.hasEdit = false;
                this.hasDelete = true;
            }
            else{
                this.hasEdit = false;
                this.hasDelete = false;
            }
        }

        if(this.data.ExpenditureType==="TRANSFER"){
            let unitDOResult = await this.service.searchUnitDO({ size: 1, filter: JSON.stringify({ UENFromId: this.data.Id }) });
            let unitDO = unitDOResult.data[0];
            if(unitDO){
                let DRResult= await this.productionService.getGarmentDR({ size: 1, filter: JSON.stringify({ UnitDOId: unitDO.Id }) });
                let DR=DRResult.data[0];
                if(DR){
                    this.hasEdit = false;
                    this.hasDelete = false;
                }
            }
        }

        
        this.hasEdit = false;
        this.hasDelete = false;
    }

    cancel(event) {
        var r = confirm("Apakah anda yakin akan keluar?")
        if ( r == true) {
            this.router.navigateToRoute('list');
        }
    }

    edit(event) {
        var r = confirm("Apakah anda yakin akan mengubah data ini?")
        if (r == true) {
            this.router.navigateToRoute('edit', { id: this.data.Id });
        }
    }

    delete(event) {
        var r = confirm("Apakah anda yakin akan menghapus data ini?")
        if (r == true) {
            this.service.delete(this.data).then(result => {
                this.cancel();
            });
        }
    }

}
