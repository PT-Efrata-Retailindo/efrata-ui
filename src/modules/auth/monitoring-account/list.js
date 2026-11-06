import {inject} from 'aurelia-framework';
import {Service} from "./service";
import {Router} from 'aurelia-router';

var AccountLoader = require('../../../loader/account-loader');

@inject(Router, Service)
export class List {
    info = {
        page: 1,
        size: 25
    };

    account = null;
    menu = null;
    filterAccount = {};

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    controlOptions = {
        label: {
            length: 4,
        },
        control: {
            length: 4,
        },
    };

    menuList = [
        "",
        "Auth",
        "accounting",
        "finance",
        "g-dashboard",
        "g-finance",
        "g-master-plan",
        "g-production",
        "g-purchasing",
        "g-sample",
        "g-shipping",
        "g-subcon",
        "Inventory",
        "master",
        "merchandiser",
        "Migration-Log",
        "purchasing"
    ];

    get accountLoader() {
        return AccountLoader;
    }

    ExportToExcel() {
        this.info = {
            userId: this.account ? this.account._id : 0,
            menu: this.menu
        };

        this.service.generateExcel(this.info);
    }

    reset() {
        this.account = null;
        this.menu = null;
    }
}
