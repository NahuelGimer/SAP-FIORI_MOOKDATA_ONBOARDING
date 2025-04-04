sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "../model/formatter"
], (BaseController, JSONModel, MessageBox, Fragment, formatter) => {
    "use strict";

    return BaseController.extend("constants.model.routes.controllers.EmployeeDetail", {
        formatter: formatter,
        onInit() {
            var oModelEmployees = new JSONModel();
            var oModelDemos = new JSONModel();

            oModelEmployees.loadData("model/mockdata_employees.json", {}, false);
            oModelDemos.loadData("model/mockdata_demos.json", {}, false);

            this.getView().setModel(oModelEmployees, "mEmployees");
            this.getView().setModel(oModelDemos, "mDemos");
        },

        onNavPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.getOwnerComponent().getModel("mEmployee").setData([]);
            oRouter.navTo("RouteMaster", {}, true);
        },

        onLiveChangeInputComment: function (oEvent) {
            var input = oEvent.getSource();
            var value = input.getValue();
            var that = this;

            if (value.length > 0) {
                input.setValueState(this.getView().getModel("i18n").getProperty("informationSelection"));
                input.setValueStateText(this.getView().getModel("i18n").getProperty("maxInputLength"));
            } else {
                input.setValueState(this.getView().getModel("i18n").getProperty("noneSelection"));
            }

            clearTimeout(this._inputTimeout);
            this._inputTimeout = setTimeout(function () {
                if (input.getValue().trim().length > 0) {
                    input.setValueState(that.getView().getModel("i18n").getProperty("successSelection"));
                } else {
                    input.setValueState(that.getView().getModel("i18n").getProperty("noneSelection"));
                }
            }, 1000);
        },

        handleResizablePopoverPress: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView(),
                oModel = this.getOwnerComponent().getModel("mEmployee"); 

            if (!this._pResizablePopover) {
                this._pResizablePopover = Fragment.load({
                    id: oView.getId(),
                    name: "app.utils.fragments.nomenclatureDialogAdvocate",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);

                    oPopover.setBindingContext(new sap.ui.model.Context(oModel, "/0"));
                    return oPopover;
                });
            }

            this._pResizablePopover.then(function (oPopover) {
                oPopover.openBy(oButton);
            });
        },

        handleClose: function () {
            this.byId("myResizablePopover").close();
        },

        onChangeSelect: function (oEvent) {
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext("mEmployee");

            if (!oContext) {
                console.error(this.getView().getModel("i18n").getProperty("noCollectionData"));
                return;
            }

            var oEmployeeModel = this.getView().getModel("mEmployee");
            var oEmployeeData = oEmployeeModel.getData();
            var oModelEmployees = this.getOwnerComponent().getModel("mEmployees");
            var aEmployees = oModelEmployees.getProperty("/employees") || [];

            var sNewStatus = oSelectedItem.getSelectedKey();
            var sPath = oContext.getPath();
            var iIndex = parseInt(sPath.split("/").pop(), 10);

            var aCollection = [];
            var sProgressProperty = "";

            switch (sPath.split("/")[1]) {
                case "Trainings":
                    aCollection = oEmployeeData.Trainings || [];
                    sProgressProperty = "progressTraining";
                    break;
                case "ADOPermissions":
                    aCollection = oEmployeeData.ADOPermissions || [];
                    sProgressProperty = "progressADO";
                    break;
                case "BTPPermissions":
                    aCollection = oEmployeeData.BTPPermissions || [];
                    sProgressProperty = "progressBTP";
                    break;
                case "SAPAccessPermissionsDetails":
                    aCollection = oEmployeeData.SAPAccessPermissionsDetails || [];
                    sProgressProperty = "progressSAPAccess";
                    break;
                case "SSAPAmbientPermissionsDetails":
                    aCollection = oEmployeeData.SSAPAmbientPermissionsDetails || [];
                    sProgressProperty = "progressSAPAmbient";
                    break;
                default:
                    console.error(this.getView().getModel("i18n").getProperty("noCollectionData"));
                    return;
            }

            if (!isNaN(iIndex) && aCollection[iIndex]) {
                aCollection[iIndex].status = sNewStatus;
            }

            var iTotalItems = aCollection.length;
            var iCompletedItems = aCollection.filter(item => item.status === "Si" || item.status === "Solicitado" || item.status === "Completo").length;
            var iNewProgress = iTotalItems > 0 ? Math.round((iCompletedItems / iTotalItems) * 100) : 0;

            oEmployeeData[sProgressProperty] = iNewProgress;
            oEmployeeModel.setData(oEmployeeData);

            var oUpdatedEmployee = aEmployees.find(emp => emp.employee_eid === oEmployeeData.employee_eid);
            if (oUpdatedEmployee) {
                oUpdatedEmployee[sProgressProperty] = iNewProgress;
            }
            oModelEmployees.setProperty("/employees", aEmployees);

            var oSaveButton = this.getView().byId("idButtonSave");
            if (oSaveButton) {
            oSaveButton.setEnabled(true);
    }
        },


        onSave: function () {
            MessageBox.information(this.getView().getModel("i18n").getProperty("functionInImplementationDescription"), {
                title: this.getView().getModel("i18n").getProperty("functionInImplementationTitle"),
                actions: [MessageBox.Action.OK],
            });
        },
    });
});