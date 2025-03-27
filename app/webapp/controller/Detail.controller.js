sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
], (BaseController, formatter) => {
    "use strict";

    return BaseController.extend("constants.model.routes.controllers.Master", {
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
    });
});