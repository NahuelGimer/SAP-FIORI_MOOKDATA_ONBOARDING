sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "../model/formatter"
], (BaseController, Fragment, formatter) => {
  "use strict";

  return BaseController.extend("constants.model.routes.controllers.DemoDetail", {
      formatter: formatter,
      onInit() {
      },

      onNavPress: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          this.getOwnerComponent().getModel("mEmployee").setData([]);
          this.getOwnerComponent().getModel("mDemo").setData([]);
          oRouter.navTo("RouteMaster", {}, true);
      },

  });
});