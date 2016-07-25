/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the BP Group detail view page in change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPChange");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.GeneralGroupDetail", {
	extHookModifyGroupDetailFormData:null,
    extHookModifyGroupStyleClass:null,
    
	onInit: function() {
		var result = "";
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("generalGroupPage").setShowNavButton(true);
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "generalGroupDetail") {
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				// This code will be executed when the user navigates to Group detail screen.
				var vDomain = oEvent.getParameter('arguments').Domain;
				if(vDomain === 'Customer')
				{
					//add footer
					var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getS3Instance();
					var aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail'); 
					 result = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();
				}
				
				if(vDomain === 'Supplier'){
					var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();
					var aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail'); 
					result = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();
				}
						
				//To set the Page header
				var groupHeader = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
				this.getView().byId("groupDetailHeader").setTitle(groupHeader);
				
				 /**
                 * @ControllerHook To modify the data of the form if it is not done via direct binding
                 * Customer can modify the data as per his requirements before binding it to a form
                 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyGroupDetailFormData
                 * @param {object} detailData Holds data
                 * @return {object} detailData Modified Data
                 */
                if(this.extHookModifyGroupDetailFormData){
                        var extModifiedData = this.extHookModifyGroupDetailFormData(result);
                        if(extModifiedData !== undefined){
                        	result = extModifiedData;
                        }
                }

				var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
				oModel.setData(result); 

				var vElement = this.getView().byId("SimpleFormGeneralGroup");
				vElement.setModel(oModel);	

				//Bolding of the changed Data
				if (result.BP_GroupRel.ChangeData.results !== undefined || result.ChangeData.results !== undefined )
				{		var sTextName = "";			
						var  sStyleClass = "text_bold";
						var	sLabelName = "";
						var oLblIns = "";
						/**
	                     * @ControllerHook To modify the style class
	                     * Customer can modify the style class to influence text fields
	                     * the format of data shown in this description table                                                        
	                      * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyGroupStyleClass
	                     * @param {string} sStyleClass style class
	                     * @return {string} sStyleClass modified style class
	                     */
	                     if(this.extHookModifyGroupStyleClass)
	                     {
	                            var sNewStyleClass = this.extHookModifyGroupStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
	                            if(sNewStyleClass !== undefined){
	                                   sStyleClass = sNewStyleClass;
	                            }
	                     }
	                     
	                    var l = "";
	                     if(result.BP_GroupRel.ChangeData.results.length > 0 )
						{
						
						for ( l=0; l<result.BP_GroupRel.ChangeData.results.length; l++)
						{						
							sLabelName = "lblG" + result.BP_GroupRel.ChangeData.results[l].Attribute;
							 oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}

							//var sTextName;    
								sTextName = "G" + result.BP_GroupRel.ChangeData.results[l].Attribute;
							if(this.getView().byId(sTextName) !== undefined){
								this.getView().byId(sTextName).addStyleClass(sStyleClass);
							}
						}
						}
					if(result.ChangeData.results.length > 0)
						{
						for ( l=0; l<result.ChangeData.results.length; l++)
						{ 
								sLabelName = "lblG" + result.ChangeData.results[l].Attribute;
							 oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}

							//var sTextName;    
								sTextName = "G" + result.ChangeData.results[l].Attribute;
							if(this.getView().byId(sTextName) !== undefined){
								this.getView().byId(sTextName).addStyleClass(sStyleClass);
							}
						}
						}
					
				}

				this.getView().rerender();

			}
		}, this);
	},

	//To initialize view so that hidden attributes are not shown on the UI
	onAfterRendering:function(){
		this.hideSection();
	},

	//If values are not filled then hide the respective section
	hideSection: function()
	{  var grp = "";
		if(this.getView().byId("GGROUPTYPE").getText() === "" && this.getView().byId("GAUTHORIZATIONGROUP").getText() === ""  &&
				this.getView().byId("GroupData") !== undefined) 
		{								
			 grp = this.getView().byId('GroupData').getId();
			$('#'+grp).hide();
		}
		if(this.getView().byId("GTITLE_KEY").getText() === "" && this.getView().byId("GNAMEGROUP1").getText() === ""  &&
				this.getView().byId("GNAMEGROUP2").getText() === "" && this.getView().byId("GSEARCHTERM1").getText() === ""  &&
				this.getView().byId("GSEARCHTERM2").getText() === ""  && this.getView().byId("GGeneral") !== undefined) 
		{								
			 grp = this.getView().byId('GGeneral').getId();
			$('#'+grp).hide();
		}

	}
});