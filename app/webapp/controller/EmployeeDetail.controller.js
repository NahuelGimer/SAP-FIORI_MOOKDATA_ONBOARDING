sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "../model/formatter"
], (BaseController, Fragment, formatter) => {
    "use strict";

    return BaseController.extend("constants.model.routes.controllers.EmployeeDetail", {
        formatter: formatter,
        onInit() {
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
                oModel = this.getOwnerComponent().getModel("mEmployee"); // Obtener el modelo mEmployee
            var oSelectedEmployee = oModel.getData([0]); // Suponiendo que el primer empleado es el seleccionado

            // Crear el popover solo una vez
            if (!this._pResizablePopover) {
                this._pResizablePopover = Fragment.load({
                    id: oView.getId(),
                    name: "app.utils.fragments.nomenclatureDialog",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);

                    // Enlazar el popover con el contexto del empleado
                    oPopover.setBindingContext(new sap.ui.model.Context(oModel, "/0")); // Enlazar al primer empleado
                    return oPopover;
                });
            }

            // Abrir el popover
            this._pResizablePopover.then(function (oPopover) {
                oPopover.openBy(oButton);
            });
        },

        handleClose: function () {
            this.byId("myResizablePopover").close();
        }
    });
});