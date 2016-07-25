/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the BP Organization detail view page in change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPChange");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.GeneralOrgDetail", {
	extHookModifyOrganizationDetailFormData:null,
    extHookModifyOrganizationStyleClass:null,


	onInit: function() {
		var result = "";
        var sLabelName = "";
        var sTextName = "";
        var oS3Instance = "";
		var aDecisions = "";
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("generalOrgPage").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "generalOrgDetail") {
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				// This code will be executed when the user navigates to Organization detail screen.

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
			
				//To set the Page header
				var orgHeader = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
				this.getView().byId("orgDetailHeader").setTitle(orgHeader);
				
				 /**
                 * @ControllerHook To modify the data of the form if it is not done via direct binding
                 * Customer can modify the data as per his requirements before binding it to a form
                 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyOrganizationDetailFormData
                 * @param {object} detailData Holds data
                 * @return {object} detailData Modified Data
                 */
                if(this.extHookModifyOrganizationDetailFormData){
                        var extModifiedData = this.extHookModifyOrganizationDetailFormData(result);
                        if(extModifiedData !== undefined){
                        	result = extModifiedData;
                        }
                }
				
				var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
				oModel.setData(result);

				var vElement = this.getView().byId("SimpleFormGeneralOrg");
				vElement.setModel(oModel);	

				//Bolding of the changed Data
				if (result.BP_OrganizationRel.ChangeData.results !== undefined || result.ChangeData.results !== undefined)
				{	var oLblIns = "";			
					var  sStyleClass = "text_bold";
					
					/**
                     * @ControllerHook To modify the style class
                     * Customer can modify the style class to influence text fields
                     * the format of data shown in this description table                                                        
                      * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyOrganizationStyleClass
                     * @param {string} sStyleClass style class
                     * @return {string} sStyleClass modified style class
                     */
                     if(this.extHookModifyOrganizationStyleClass)
                     {
                            var sNewStyleClass = this.extHookModifyOrganizationStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
                            if(sNewStyleClass !== undefined){
                                   sStyleClass = sNewStyleClass;
                            }
                     }
                     var l = "";
					if (result.BP_OrganizationRel.ChangeData.results.length > 0)
					{
						for ( l=0; l < result.BP_OrganizationRel.ChangeData.results.length; l++)
						{
							sLabelName = "lblO" + result.BP_OrganizationRel.ChangeData.results[l].Attribute;
							 oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}
							 sTextName ="O" + result.BP_OrganizationRel.ChangeData.results[l].Attribute;
							if(this.getView().byId(sTextName) !== undefined){
								this.getView().byId(sTextName).addStyleClass(sStyleClass);

							}
						}
					}
					if( result.ChangeData.results.length > 0) 
					{
						for ( l=0; l < result.ChangeData.results.length; l++)
						{
							 sLabelName = "lblO" + result.ChangeData.results[l].Attribute;
							 oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}
							 sTextName = "O" + result.ChangeData.results[l].Attribute;
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
	{ var org = "";
		if(this.getView().byId("OLEGALORG").getText() === "" && this.getView().byId("OLEGALFORM").getText() === ""  &&
				this.getView().byId("OFOUNDATIONDATE").getText() === "" && this.getView().byId("OLIQUIDATIONDATE").getText() === ""   &&
				this.getView().byId("OAUTHORIZATIONGROUP").getText() === "" && 
				this.getView().byId("OrganizationalData") !== undefined) 
		{								
			 org = this.getView().byId('OrganizationalData').getId();
			$('#'+org).hide();
		}
		
		if(this.getView().byId("OTITLE_KEY").getText() === "" && this.getView().byId("ONAME1").getText() === ""  &&
				this.getView().byId("ONAME2").getText() === "" && this.getView().byId("OTITLELETTER").getText() === ""   &&
				this.getView().byId("OSEARCHTERM1").getText() === "" &&  this.getView().byId("OSEARCHTERM2").getText() === "" &&
				this.getView().byId("OGeneral") !== undefined) 
		{								
			 org = this.getView().byId('OGeneral').getId();
			$('#'+org).hide();
		}

	}

});