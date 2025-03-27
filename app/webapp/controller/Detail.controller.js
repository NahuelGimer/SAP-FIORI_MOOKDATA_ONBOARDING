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
        }
    });
});