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
        
            // Cargar datos desde archivos JSON locales
            oModelEmployees.loadData("model/mockdata_employees.json", {}, false);
            oModelDemos.loadData("model/mockdata_demos.json", {}, false);
        
            // Establecer modelos en la vista
            this.getView().setModel(oModelEmployees, "mEmployees");
            this.getView().setModel(oModelDemos, "mDemos");
        
            // Obtener datos de empleados
            var oModel = this.getView().getModel("mEmployees");
            var aEmployees = oModel.getProperty("/employees") || [];
        
            // Calcular el progreso para cada empleado
            aEmployees.forEach(function (oEmployee) {
                var aCourses = oEmployee.courses || [];
                var aADO = oEmployee.accesoADO || [];
                var aBTP = oEmployee.accesoBTP || [];
                var aSAP = oEmployee.accesoSAP || [];
                var iTotalCourses = aCourses.length;
                var iTotalADO = aADO.length;
                var iTotalBTP = aBTP.length;
                var iTotalSAP = aSAP.length;
        
                // Contar cursos "En Progreso" y "Completado"
                var iRelevantCourses = aCourses.filter(course => 
                    course.estado === "Error" || course.estado === "En Progreso" || course.estado === "Completo"
                ).length;

                var iRelevantADO = aADO.filter(accesoADO => 
                    accesoADO.status === "Si" || accesoADO.status === "Solicitado"
                ).length;

                var iRelevantBTP = aBTP.filter(accesoBTP => 
                    accesoBTP.status === "Si" || accesoBTP.status === "Solicitado"
                ).length;

                var iRelevantSAP = aSAP.filter(accesoSAP => 
                    accesoSAP.status === "Si" || accesoSAP.status === "Solicitado"
                ).length;
        
                // Calcular progreso como porcentaje
                oEmployee.progressTrainings = iTotalCourses > 0 ? Math.round((iRelevantCourses / iTotalCourses) * 100) : 0;
                oEmployee.progressADO = iTotalCourses > 0 ? Math.round((iRelevantADO / iTotalADO) * 100) : 0;
                oEmployee.progressBTP = iTotalCourses > 0 ? Math.round((iRelevantBTP / iTotalBTP) * 100) : 0;
                oEmployee.progressSAP = iTotalCourses > 0 ? Math.round((iRelevantSAP / iTotalSAP) * 100) : 0;
            });
        
            // Actualizar el modelo con los nuevos valores
            oModel.setProperty("/employees", aEmployees);
        },
        

        onFilter1: function () {
            var filters = [];
            var eid = this.getView().byId("SearchField1").getValue();
            var position = this.getView().byId("SearchField2").getValue();
            var tabla = this.getView().byId("masterTable1");
            var binding = tabla.getBinding("items");
            if (eid && eid.length > 0) {
                filters.push(new Filter("eid", FilterOperator.Contains, eid));
            };
            if (position && position.length > 0) {
                filters.push(new Filter("cargo", FilterOperator.Contains, position));
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
            var selectedEID = selectedItem.getBindingContext("mEmployees").getProperty("eid");
            var mEmployees = oDataModel.getProperty("/employees") || [];
            var selectedEmployee = mEmployees.find(emp => emp.eid === selectedEID);
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
