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
        onInit: function () {
            var oModelEmployees = new JSONModel();
            var oModelDemos = new JSONModel();

            oModelEmployees.loadData("model/mockdata_employees.json", {}, false);
            oModelDemos.loadData("model/mockdata_demos.json", {}, false);

            this.getView().setModel(oModelEmployees, "mEmployees");
            this.getView().setModel(oModelDemos, "mDemos");
        },


        onFilter1: function () {
            var filters = [];
            var eid = this.getView().byId("SearchField1").getValue();
            var tabla = this.getView().byId("masterTable1");
            var binding = tabla.getBinding("items");
            if (eid && eid.length > 0) {
                filters.push(new Filter("employee_eid", FilterOperator.Contains, eid));
            };
            binding.filter(filters);
        },
        onFilter2: function () {
            var filters = [];
            var solution = this.getView().byId("SearchField3").getValue();
            var tabla = this.getView().byId("masterTable2");
            var binding = tabla.getBinding("items");
            if (solution && solution.length > 0) {
                filters.push(new Filter("solution", FilterOperator.Contains, solution));
            };
            binding.filter(filters);
        },

        handleListPress1: function (oEvent) {
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
            var selectedEID = selectedItem.getBindingContext("mEmployees").getProperty("employee_eid");
            var mEmployees = oDataModel.getProperty("/employees") || [];
            var selectedEmployee = mEmployees.find(emp => emp.employee_eid === selectedEID);
            if (!selectedEmployee) {
                console.error(this.getView().getModel("i18n").getProperty("EIDNotFound"), selectedEID);
                return;
            }

            var aCourses = selectedEmployee.courses || [];
            var iTotalCourses = aCourses.length;
            var iRelevantCourses = aCourses.filter(course =>
                course.estado === "Error" || course.estado === "En Progreso" || course.estado === "Completo"
            ).length;
            selectedEmployee.progress = iTotalCourses > 0 ? Math.round((iRelevantCourses / iTotalCourses) * 100) : 0;

            var oEmployeeModel = this.getView().getModel("mEmployee");
            if (!oEmployeeModel) {
                oEmployeeModel = new JSONModel();
                this.getView().setModel(oEmployeeModel, "mEmployee");
            }
            oEmployeeModel.setData(selectedEmployee);
            oRouter.navTo("RouteEmployeeDetail", {});
        },

        handleListPress2: function (oEvent) {
            var oRouter = UIComponent.getRouterFor(this);
            var oDataModel = this.getView().getModel("mDemos");
            if (!oDataModel) {
                console.error(this.getView().getModel("i18n").getProperty("modelUnavailable"));
                return;
            }
            var selectedItem = oEvent.getSource().getSelectedItem();
            if (!selectedItem) {
                console.error(this.getView().getModel("i18n").getProperty("EIDNotSelected"));
                return;
            }
            var selectedEID = selectedItem.getBindingContext("mDemos").getProperty("solution");
            var mEmployees = oDataModel.getProperty("/demos") || [];
            var selectedEmployee = mEmployees.find(emp => emp.solution === selectedEID);
            if (!selectedEmployee) {
                console.error(this.getView().getModel("i18n").getProperty("EIDNotFound"), selectedEID);
                return;
            }
            var oEmployeeModel = this.getView().getModel("mDemo");
            if (!oEmployeeModel) {
                oEmployeeModel = new JSONModel();
                this.getView().setModel(oEmployeeModel, "mDemo");
            }
            oEmployeeModel.setData(selectedEmployee);
            oRouter.navTo("RouteDemoDetail", {});
        }
    });
});
