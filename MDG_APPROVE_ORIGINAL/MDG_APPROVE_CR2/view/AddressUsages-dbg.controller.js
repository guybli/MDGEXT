/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.AddressUsages", {

	onInit: function() {
		
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("AddrUsgDetailPage").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "AddressUsages") {

				//Reset Form Bolding
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				var AddrUsgHeader = this.getView().getModel("i18n").getProperty("AddressUsages");
				var AddrUsgAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();

				this.getView().byId("AddrUsgDetailHeader").setTitle(AddrUsgHeader);
				this.getView().byId("AddrUsgAttrHeader").setText(AddrUsgAttribute);

				var vDomain = oEvent.getParameter('arguments').Domain;
				var result = "";
				//if(vDomain === 'Customer')
				//{
					//add footer
					var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts[vDomain].getS3Instance();
					var aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail'); 
			//	}
				var oResponse = fcg.mdg.approvecrv2.DomainSpecParts[vDomain].getData( 'General' );
				result = oResponse[0].data.BP_Root.BP_AddressUsagesRel;

				var oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
				oModel.setData(result);

				var vElement = this.getView().byId("AddrUsgResults");				
				vElement.setModel(oModel); 

				var oItemTemp = new sap.m.ColumnListItem({
					cells: [
					        new sap.m.Text({
					        	text:{
					        		path:"ADDRESSTYPE",
					        		formatter: function(){			        			
					        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "ADDRESSTYPE" );
					        			var desc = oModel.getProperty("ADDRESSTYPE__TXT", this.getBindingContext());
					        			var key = oModel.getProperty("ADDRESSTYPE", this.getBindingContext());
					        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
					        		}
					        	}
					        }),
					        new sap.m.Text({
					        	text:{
					        		path:"AD_ID",
					        		formatter: function(){			        			
					        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "AD_ID" );
					        			return oModel.getProperty("AD_ID__TXT", this.getBindingContext());
					        		}
					        	}
					        }),					        
					        new sap.m.Text({			        	
					        	text:{
					        		path:"STANDARDADDRESSUSAGE",
					        		formatter: function(){
					        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STANDARDADDRESSUSAGE" );
					        			var vStandard = oModel.getProperty("STANDARDADDRESSUSAGE", this.getBindingContext());
					        			if(vStandard ===  "X")
					        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
					        			else
					        			vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
					        			var vType = oModel.getProperty("ADDRESSTYPE", this.getBindingContext());
					        			if(vType === "XXDEFAULT")
					        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
					        			return vStandard;                                                                           
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