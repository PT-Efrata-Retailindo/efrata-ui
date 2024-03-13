import { inject, bindable } from "aurelia-framework";
import { Service } from "./service";
import { Router } from "aurelia-router";
var moment = require("moment");

@inject(Router, Service)
export class List {
  constructor(router, service) {
    this.service = service;
    this.router = router;
    this.today = new Date();
  }

  info = { page: 1, size: 50 };

  controlOptions = {
    label: {
      length: 4,
    },
    control: {
      length: 4,
    },
  };

  @bindable UnitItem;
  @bindable KtgrItem;

  KategoriItems = ["", "BAHAN BAKU", "BAHAN EMBALANCE", "BAHAN PENDUKUNG"];
  UnitItems = ["EFRATA"];

  search() {
    this.info.page = 1;
    this.info.total = 0;
  }

  activate() {}
  tableData = [];
  searching() {
    this.error = {};
    if (
      this.dateTo == null ||
      this.dateTo == "" ||
      this.dateFrom == null ||
      this.dateFrom == ""
    ) {
      this.error.dateFrom =
        this.dateFrom == null ? "Tanggal Awal Harus Di isi" : null;
      this.error.dateTo =
        this.dateTo == null ? "Tanggal Akhir Harus Di isi" : null;
    } else {
      var args = {
        page: this.info.page,
        size: this.info.size,
        dateFrom: this.dateFrom
          ? moment(this.dateFrom).format("YYYY-MM-DD")
          : "",
        dateTo: this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : "",
        unitcode: this.unit ? this.unit : "",
        category: this.category ? this.category : "",
        planPo: this.PlanPO ? this.PlanPO : "",
        //suppliertype : this.Tipe
      };
      console.log(args);
      this.service.search(args).then((result) => {
        this.data = [];

        for (var _data of result.data) {
          _data.ReceiptPurchasePrice =
            _data.ReceiptPurchasePrice.toLocaleString("en-EN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          _data.BeginningBalancePrice =
            _data.BeginningBalancePrice.toLocaleString("en-EN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          _data.EndingBalancePrice = _data.EndingBalancePrice.toLocaleString(
            "en-EN",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          );
          // _data.ExpendKon1APrice = _data.ExpendKon1APrice.toLocaleString(
          //   "en-EN",
          //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          // );
          // _data.ExpendKon2APrice = _data.ExpendKon2APrice.toLocaleString(
          //   "en-EN",
          //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          // );
          // _data.ExpendKon2BPrice = _data.ExpendKon2BPrice.toLocaleString(
          //   "en-EN",
          //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          // );
          // _data.ExpendKon2CPrice = _data.ExpendKon2CPrice.toLocaleString(
          //   "en-EN",
          //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          // );
          // _data.ExpendKon1BPrice = _data.ExpendKon1BPrice.toLocaleString(
          //   "en-EN",
          //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          // );
          _data.ExpendProcessPrice = _data.ExpendProcessPrice.toLocaleString(
            "en-EN",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          );
          _data.ExpendRestPrice = _data.ExpendRestPrice.toLocaleString(
            "en-EN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          );
          _data.ExpendReturPrice = _data.ExpendReturPrice.toLocaleString(
            "en-EN",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          );
          _data.ExpendSamplePrice = _data.ExpendSamplePrice.toLocaleString(
            "en-EN",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          );
          _data.ReceiptCorrectionPrice =
            _data.ReceiptCorrectionPrice.toLocaleString("en-EN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          // _data.ReceiptKon1APrice = _data.ReceiptKon1APrice.toLocaleString(
          //   "en-EN",
          //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          // );
          // _data.ReceiptKon2APrice = _data.ReceiptKon2APrice.toLocaleString(
          //   "en-EN",
          //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          // );
          // _data.ReceiptKon2BPrice = _data.ReceiptKon2BPrice.toLocaleString(
          //   "en-EN",
          //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          // );
          // _data.ReceiptKon2CPrice = _data.ReceiptKon2CPrice.toLocaleString(
          //   "en-EN",
          //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          // );
          // _data.ReceiptKon1BPrice = _data.ReceiptKon1BPrice.toLocaleString(
          //   "en-EN",
          //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          // );
          _data.ReceiptProcessPrice = _data.ReceiptProcessPrice.toLocaleString(
            "en-EN",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          );
          _data.ReceiptPurchasePrice =
            _data.ReceiptPurchasePrice.toLocaleString("en-EN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          this.data.push(_data);
        }

        this.info.total = result.info.total;
      });
    }
  }

  reset() {
    (this.dateFrom = ""),
      (this.dateTo = ""),
      (this.KtgrItem = ""),
      (this.UnitItem = "");
  }

  ExportToExcel() {
    this.error = {};
    if (
      this.dateTo == null ||
      this.dateTo == "" ||
      this.dateFrom == null ||
      this.dateFrom == ""
    ) {
      this.error.dateFrom =
        this.dateFrom == null ? "Tanggal Awal Harus Di isi" : null;
      this.error.dateTo =
        this.dateTo == null ? "Tanggal Akhir Harus Di isi" : null;
    } else {
      let args = {
        dateFrom: this.dateFrom
          ? moment(this.dateFrom).format("YYYY-MM-DD")
          : "",
        dateTo: this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : "",
        unitcode: this.unit ? this.unit : "",
        unitname: this.unitname ? this.unitname : "",
        category: this.category ? this.category : "",
        categoryname: this.categoryname ? this.categoryname : "",
        planPo: this.PlanPO ? this.PlanPO : "",
      };

      this.service.generateExcel(args);
    }
  }

  dateFromChanged(e) {
    var _startDate = new Date(e.srcElement.value);
    var _endDate = new Date(this.dateTo);
    this.dateMin = moment(_startDate).format("YYYY-MM-DD");

    if (_startDate > _endDate || !this.dateTo) {
      this.dateTo = e.srcElement.value;
    }
  }

  UnitItemChanged(newvalue) {
    if (newvalue) {
      if (newvalue === "EFRATA") {
        this.unit = "EFR";
        this.unitname = "EFRATA";
      } else {
        this.unit = "";
        this.unitname = "";
      }
    }
    // }else{
    //     this.unit = "";
    //     this.unitname = "";
    // }
  }

  KtgrItemChanged(newvalue) {
    if (newvalue) {
      if (newvalue === "BAHAN BAKU") {
        this.category = "BB";
        this.categoryname = "BAHAN BAKU";
      } else if (newvalue === "BAHAN PENDUKUNG") {
        this.category = "BP";
        this.categoryname = "BAHAN PENDUKUNG";
      } else if (newvalue === "BAHAN EMBALANCE") {
        this.category = "BE";
        this.categoryname = "BAHAN EMBALANCE";
      } else {
        this.category = "";
        this.categoryname = "";
      }
    } else {
      this.unit = "";
      this.unitname = "";
    }
  }
  changePage(e) {
    var page = e.detail;
    this.info.page = page;
    this.searching();
  }
}
