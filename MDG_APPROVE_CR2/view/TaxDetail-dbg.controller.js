/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the Tax detail view page  change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.TaxDetail", {
	extHookModifyTaxDetailFormData:null,
	onInit: function() {	
		var result = "";
		this.getView().byId("taxDetailPage").setShowNavButton(true);
		
		this.oRouter.attachRouteMatched(function(oEvent) {
			var oS3Instance = "";
			var aDecisions = "";
			if (oEvent.getParameter("name") === "taxDetail") {
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				//To set the Page header
				var taxHeader = this.getView().getModel("i18n").getProperty("TaxNums");
				var taxAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
							
				this.getView().byId("taxDetailHeader").setTitle(taxHeader);
				this.getView().byId("taxAttrHeader").setText(taxAttribute);
				
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
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyTaxDetailFormData
				 * @param {object} detailData Holds data
				 * @return {object} detailData Modified Data
				 */
				if(this.extHookModifyTaxDetailFormData){
					var extModifiedData = this.extHookModifyTaxDetailFormData(result);
					if(extModifiedData !== undefined){
						result = extModifiedData;
					}
				}
				var oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
				oModel.setData(result);

				var vElement = this.getView().byId("taxResults");
				vElement.setModel(oModel);

				var oItemTemp = new sap.m.ColumnListItem({
					cells: [	      

					        new sap.m.Text({
					        	text:{
					        		path:"TAXTYPE",  
					        		formatter: function() {
					        			var desc = oModel.getProperty("TAXTYPE__TXT", this.getBindingContext());
					        			var key = oModel.getProperty("TAXTYPE", this.getBindingContext());
					        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TAXTYPE" );
					        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
					        		}
					        	}

					        }),
					        new sap.m.Text({
					        	text:{
					        		path:"TAXNUMBER",
					        		formatter: function() {
					        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TAXNUMBER" );
					        			return oModel.getProperty('TAXNUMBER', this.getBindingContext());
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