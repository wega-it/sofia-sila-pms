//=========================================================================
// Copyright (c) 2015 wega Informatik AG | Erick Bastidas
//
// This file is part of SOFIA.
//
// SOFIA is free software: you can redistribute it and/or modify it under 
// the terms of the GNU General Public License as published by the 
// Free Software Foundation, either version 3 of the License, or (at your 
// option) any later version.
//
// SOFIA is distributed in the hope that it will be useful, but WITHOUT 
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public 
// License for more details.
//
// You should have received a copy of the GNU General Public License 
// along with SOFIA. If not, see <http://www.gnu.org/licenses/>.
//
//======================================================
// Copyright details
//======================================================
//   Company: wega Informatik AG
//   Address: Aeschengraben 20, 4051 Basel, Switzerland
//   Website: http://www.wega-it.com
//   Author: Erick Bastidas
//   Email: ebastidas3@gmail.com
//=========================================================================


var pageSession = new ReactiveDict();

Template.ExperimentsDetailsEdit.rendered = function() {
	
};

Template.ExperimentsDetailsEdit.events({
	
});

Template.ExperimentsDetailsEdit.helpers({
	
});

Template.ExperimentsDetailsEditEditForm.rendered = function() {
	

	pageSession.set("experimentsDetailsEditEditFormInfoMessage", "");
	pageSession.set("experimentsDetailsEditEditFormErrorMessage", "");


    var devId = this.data.experiment_command.deviceId;
    pageSession.set("selectedDeviceId", this.data.experiment_command.deviceId);

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();			
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[autofocus]").focus();
};

Template.ExperimentsDetailsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("experimentsDetailsEditEditFormInfoMessage", "");
		pageSession.set("experimentsDetailsEditEditFormErrorMessage", "");
		
		var self = this;

		function submitAction(msg) {
			if(!t.find("#form-cancel-button")) {
				var message = msg || "Saved.";
				pageSession.set("experimentsDetailsEditEditFormInfoMessage", message);
			}

			Router.go("experiments.details", {experimentId: self.params.experimentId});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("experimentsDetailsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				
				ExperimentCommands.update({ _id: t.data.experiment_command._id }, { $set: values }, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();
		Router.go("experiments.details", {experimentId: this.params.experimentId});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	},
    "change #selectDevId": function (e, t) {
        e.preventDefault();
        pageSession.set("selectedDeviceId", $(e.target).val());
	}

});

Template.ExperimentsDetailsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("experimentsDetailsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("experimentsDetailsEditEditFormErrorMessage");
    },
    "device_command_set": function () {
        
        var device = Devices.findOne({ _id: pageSession.get("selectedDeviceId") });
        var qry = '{"' + device.silaDeviceClassId + '": { "$in": [ "M", "R", "O" ] } }';
        var qryJSON = JSON.parse(qry);

        return CommonCommandSet.find(qryJSON, { sort: { createdAt: 1 } });
	}
});
