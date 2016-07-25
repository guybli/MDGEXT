/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the Industry detail view page  in change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.IndustryDetail", {
	extHookModifyIndustryDetailFormData:null,
	onInit: function() {
		//Remove Style Class
		var sStyleClass = "text_bold";
		var result = "";
		this.getView().byId("industryDetailPage").removeStyleClass(sStyleClass);
		
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("industryDetailPage").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "industryDetail") {
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				// This code will be executed when the user navigates to industry detail page.			
				var indusHeader = this.getView().getModel("i18n").getProperty("Industries");
				var indusAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
							
				this.getView().byId("industryDetailHeader").setTitle(indusHeader);
				this.getView().byId("industryAttrHeader").setText(indusAttribute);
				
				var vDomain = oEvent.getParameter('arguments').Domain;
//				if(vDomain === 'Customer')
//				{
					//add footer
					var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts[vDomain].getS3Instance();
					var aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail'); 
					result = fcg.mdg.approvecrv2.DomainSpecParts[vDomain].getNavData();
//				}
				
				/**
				 * @ControllerHook To modify the data of the form if it is not done via direct binding
				 * Customer can modify the data as per his requirements before binding it to a form
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyIndustryDetailFormData
				 * @param {object} detailData Holds data
				 * @return {object} detailData Modified Data
				 */
				if(this.extHookModifyIndustryDetailFormData){
					var extModifiedData = this.extHookModifyIndustryDetailFormData(result);
					if(extModifiedData !== undefined){
						result = extModifiedData;
					}
				}
				var oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
				oModel.setData(result);

				var vElement = this.getView().byId("industryResults");
				vElement.setModel(oModel); 

				var oItemTemp = new sap.m.ColumnListItem({
					cells: [	      
					        new sap.m.Text({
					        	text:{
					        		path:"INDUSTRYSECTOR",
					        		formatter: function() {
					        			var desc = oModel.getProperty("INDUSTRYSECTOR__TXT", this.getBindingContext());
					        			var key = oModel.getProperty("INDUSTRYSECTOR", this.getBindingContext());
					        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "INDUSTRYSECTOR" );
					        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
					        		}
					        	}
					        }),
					        new sap.m.Text({
					        	text:{
					        		path:"DEFAULTINDUSTRYSECTOR",
					        		formatter: function() {
					        			var ctx = this.getBindingContext();
					        			var status = oModel.getProperty("DEFAULTINDUSTRYSECTOR", ctx);
					        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "DEFAULTINDUSTRYSECTOR" );
					        			return fcg.mdg.approvecrv2.util.Formatter.checkBoxTable(status);
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