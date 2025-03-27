sap.ui.define([], function () {
    "use strict";
    return {
        formatState: function (percentValue) {
            if (percentValue >= 75) {
                return "Success";
            } else if (percentValue >= 25) {
                return "Information";
            } else {
                return "None";
            }
        },
        formatStateDemos: function (percentValue) {
            if (percentValue == 100) {
                return "Success";
            } else if (percentValue == 0) {
                return "None";
            } else {
                return "Information";
            }
        },
        formatStateSelect1: function (statusValue) {
            if (!statusValue) {
                return "None";
            }
            var normalizedStatus = statusValue.toLowerCase();
            if (normalizedStatus === "completo" || normalizedStatus === "en progreso") {
                return "Success";
            } else if (normalizedStatus === "error") {
                return "Error";
            } else {
                return "None";
            }
        },
        formatStatePriority: function (priorityValue) {
            if (!priorityValue) {
                return "None";
            }
            var normalizedStatus = priorityValue.toLowerCase();
            if (normalizedStatus === "muy alta" || normalizedStatus === "alta") {
                return "Error";
            } else if (normalizedStatus === "media") {
                return "Warning";
            } else {
                return "Success";
            }
        },
        formatStateSelect2: function (statusValue) {
            if (!statusValue) {
                return "None";
            }
            var normalizedStatus = statusValue.toLowerCase();
            if (normalizedStatus === "si" || normalizedStatus === "solicitado") {
                return "Success";
            } else {
                return "Error";
            }
        },
        formatStateTextSelect1: function (statusValue) {
            if (!statusValue) {
                return "Select a state";
            }
            var normalizedStatus = statusValue.toLowerCase();
            if (normalizedStatus === "completo" || normalizedStatus === "en progreso") {
                return "The course is complete or in process";
            } else if (normalizedStatus === "error") {
                return "The course is inactive or an issue occurs with its completeness";
            } else {
                return "";
            }
        },
        formatStateTextSelect2: function (statusValue) {
            if (!statusValue) {
                return "Select a state";
            }
            var normalizedStatus = statusValue.toLowerCase();
            if (normalizedStatus === "si" || normalizedStatus === "solicitado") {
                return "The access has been required or obtained";
            } else if (normalizedStatus === "no") {
                return "The access is unavailable";
            } else {
                return "";
            }
        }
    };
});