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


this.ExperimentsDetailsEditController = RouteController.extend({
	template: "ExperimentsDetails",

	yieldTemplates: {
		'ExperimentsDetailsEdit': { to: 'ExperimentsDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("ExperimentsDetails"); this.render("loading", { to: "ExperimentsDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("devices"),
			Meteor.subscribe("experiment_details", this.params.experimentId),
			Meteor.subscribe("common_command_set"),
			Meteor.subscribe("experiment_command", this.params.commandId)
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		
        //var experiment = Experiments.findOne({ _id: this.params.experimentId }, {});
        //var command = ExperimentCommands.findOne({ _id: this.params.commandId }, {});
		//var device = Devices.findOne({_id: command.deviceId});  
		//var qry = '{"' + device.silaDeviceClassId + '": { "$in": [ "M", "R", "O" ] } }';
		//var qryJSON = JSON.parse(qry);

		return {
			params: this.params || {},
			devices: Devices.find({}, {}),
			experiment_details: Experiments.findOne({_id:this.params.experimentId}, {}),
            common_command_set: CommonCommandSet.find({}, { sort: { createdAt: 1 } }),
			experiment_command: ExperimentCommands.findOne({_id:this.params.commandId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});