import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import { Base64Helper } from '../../../utils/base-64-coded-helper';
var moment = require("moment");

@inject(Router, Service)
export class List {
    columns = [
        { field: "URNNo", title: "No. Bon Terima Unit" },
        {
            field: "ReceiptDate", title: "Tanggal Bon Terima Unit",
            formatter: (value, data) => {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "URNType", title: "Tipe Bon Terima Unit" },
        { field: "SupplierName", title: "Supplier" },
        { field: "DONo", title: "No. Surat Jalan" },
        { field: "DRNo", title: "No. Bukti Pengantar" },
        { field: "UENNo", title: "No. Bon Pengeluaran" }
    ];

    context = ["Rincian", "Cetak PDF"];

    today = new Date();

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    async activate() {

    }

    loader = (info) => {
        var order = {};

        if (info.sort)
            order[info.sort] = info.order;

        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order
        };

        return this.service.search(arg)
            .then(result => {
                result.data.map((data) => {
                    data.SupplierName = data.Supplier.Name;
                    return data;
                });

                return {
                    total: result.info.total,
                    data: result.data
                }
            });
    }

    back() {
        this.router.navigateToRoute('list');
    }

    create() {
        this.router.navigateToRoute('create');
    }

    contextClickCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        const encoded = Base64Helper.encode(data.Id);
        switch (arg.name) {
            case "Rincian":
                this.router.navigateToRoute('view', { id: encoded });
                break;
            case "Cetak PDF":
                this.service.getPdfById(data.Id);
                break;
        }
    }
}