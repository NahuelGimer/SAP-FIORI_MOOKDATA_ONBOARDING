sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter"
], (Controller, JSONModel, UIComponent, Filter,
    FilterOperator, formatter) => {
    "use strict";

    return Controller.extend("constants.model.routes.controllers.Master", {
        formatter: formatter,
        onInit() {
            var oModel = new JSONModel();
            oModel.loadData("model/mockdata.json", {}, false);
            this.getView().setModel(oModel, "mEmployees");
        },

        onFilter: function () {
            var filters = [];
            var eid = this.getView().byId("SearchField1").getValue();
            var position = this.getView().byId("SearchField2").getValue();
            var tabla = this.getView().byId("masterTable");
            var binding = tabla.getBinding("items");
            if (eid && eid.length > 0) {
                filters.push(new Filter("eid", FilterOperator.Contains, eid));
            };
            if (position && position.length > 0) {
                filters.push(new Filter("cargo", FilterOperator.Contains, position));
            };
            binding.filter(filters);
        },

        handleListPress: function (oEvent) {
            var oRouter = UIComponent.getRouterFor(this);
            var oDataModel = this.getView().getModel("mEmployees");
            if (!oDataModel) {
                console.error(this.getView().getModel("i18n").getProperty("modelUnavailable"));
                return;
            }
            var selectedItem = oEvent.getSource().getSelectedItem();
            if (!selectedItem) {
                console.error(this.getView().getModel("i18n").getProperty("EIDNotSelected"));
                return;
            }
            var selectedEID = selectedItem.getBindingContext("mEmployees").getProperty("eid");
            var mEmployees = oDataModel.getProperty("/employees") || [];
            var selectedEmployee = mEmployees.find(emp => emp.eid === selectedEID);
            if (!selectedEmployee) {
                console.error(this.getView().getModel("i18n").getProperty("EIDNotFound"), selectedEID);
                return;
            }
            var oEmployeeModel = this.getView().getModel("mEmployee");
            if (!oEmployeeModel) {
                oEmployeeModel = new JSONModel();
                this.getView().setModel(oEmployeeModel, "mEmployee");
            }
            oEmployeeModel.setData(selectedEmployee);
            oRouter.navTo("RouteDetail", {});
        }
    });
});
