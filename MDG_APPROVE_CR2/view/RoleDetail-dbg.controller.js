/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the Role detail view page  change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.RoleDetail", {
	extHookModifyRoleDetailFormData:null,

	onInit: function() { 
		var result = "";
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("roleDetailPage").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			var oS3Instance = "";
			var aDecisions = "";
			if (oEvent.getParameter("name") === "roleDetail") {
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				var roleHeader = this.getView().getModel("i18n").getProperty("Roles");
				var roleAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();

				this.getView().byId("roleDetailHeader").setTitle(roleHeader);
				this.getView().byId("roleAttrHeader").setText(roleAttribute);
				
				var vDomain = oEvent.getParameter('arguments').Domain;
				if(vDomain === 'Customer')
				{
					//add footer
					oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getS3Instance();
					aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail'); 
					result = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();
				}
				
				if(vDomain === 'Supplier')
				{
					//add footer
					oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();
					aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail'); 
					result = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();
				}
				/**
				 * @ControllerHook To modify the data of the form if it is not done via direct binding
				 * Customer can modify the data as per his requirements before binding it to a form
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyRoleDetailFormData
				 * @param {object} detailData Holds data
				 * @return {object} detailData Modified Data
				 */
				if(this.extHookModifyRoleDetailFormData){
					var extModifiedData = this.extHookModifyRoleDetailFormData(result);
					if(extModifiedData !== undefined){
						result = extModifiedData;
					}
				}
				var oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
				oModel.setData(result);

				var vElement = this.getView().byId("roleResults");				
				vElement.setModel(oModel); 

				var oItemTemp = new sap.m.ColumnListItem({
					cells: [	      				
					        new sap.m.Text({
					        	text:{
					        		path:"PARTNERROLE",
					        		formatter: function() {
					        			var desc = oModel.getProperty("PARTNERROLE__TXT", this.getBindingContext());
					        			var key = oModel.getProperty("PARTNERROLE", this.getBindingContext());
					        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "PARTNERROLE" );					        			
					        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
					        		}
					        	}
					        })  
					        ]
				});  

				vElement.bindItems("/results", oItemTemp); 

			}
		}, this);
	}
});