sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "../model/formatter"
], (Controller, JSONModel, UIComponent, formatter) => {
    "use strict";

    return Controller.extend("constants.model.routes.controllers.Master", {
        formatter: formatter,
        onInit() {
            var oModel = new JSONModel();
            oModel.loadData("model/mockdata.json", {}, false);
            this.getView().setModel(oModel, "mEmployees");
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
