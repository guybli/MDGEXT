/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the BP Person detail view page in change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPChange");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.GeneralPersonDetail", {
	extHookModifyPersonDetailFormData:null,
    extHookModifyPersonStyleClass:null,

	onInit: function() { 
		var result = "";
		var sLabelName = "";
		var sTextName = "";
		var oLblIns = "";
		var oS3Instance = "";
		var aDecisions = "";
		
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("generalPersonPage").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "generalPersonDetail") {
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				// This code will be executed when the user navigates to Person detail screen.

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
				var personHeader = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
				this.getView().byId("personDetailHeader").setTitle(personHeader);
				
				/**
                 * @ControllerHook To modify the data of the form if it is not done via direct binding
                 * Customer can modify the data as per his requirements before binding it to a form
                 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyPersonDetailFormData
                 * @param {object} detailData Holds data
                 * @return {object} detailData Modified Data
                 */
                if(this.extHookModifyPersonDetailFormData){
                        var extModifiedData = this.extHookModifyPersonDetailFormData(result);
                        if(extModifiedData !== undefined){
                        	result = extModifiedData;
                        }
                }

				var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
				oModel.setData(result); 
				var vElement = this.getView().byId("SimpleFormGeneralPerson");
				vElement.setModel(oModel);		

				//Bolding of the changed Data
				if (result.BP_PersonRel.ChangeData.results !== undefined || result.ChangeData.results !== undefined)
				{	                  	                   
					var  sStyleClass = "text_bold";
					
					/**
                     * @ControllerHook To modify the style class
                     * Customer can modify the style class to influence text fields
                     * the format of data shown in this description table                                                        
                      * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyPersonStyleClass
                     * @param {string} sStyleClass style class
                     * @return {string} sStyleClass modified style class
                     */
                     if(this.extHookModifyPersonStyleClass)
                     {
                            var sNewStyleClass = this.extHookModifyPersonStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
                            if(sNewStyleClass !== undefined){
                                   sStyleClass = sNewStyleClass;
                            }
                     }
                    var l = "";
					if (result.BP_PersonRel.ChangeData.results.length > 0 )
					{
						for ( l=0; l < result.BP_PersonRel.ChangeData.results.length; l++)
						{
							sLabelName = "lblP" + result.BP_PersonRel.ChangeData.results[l].Attribute;
							oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}
							sTextName ="P"+result.BP_PersonRel.ChangeData.results[l].Attribute;
							if(this.getView().byId(sTextName) !== undefined){
								this.getView().byId(sTextName).addStyleClass(sStyleClass);
							}
						}
					}
					if(result.ChangeData.results.length > 0)
					{
						for ( l=0; l < result.ChangeData.results.length; l++)
						{
							sLabelName = "lblP" + result.ChangeData.results[l].Attribute;
							oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}
							sTextName = "P" + result.ChangeData.results[l].Attribute;
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
	{
		var person = "";
		if(this.getView().byId("PSEX").getText() === "" && this.getView().byId("PMARITALSTATUS").getText() === ""  &&
				this.getView().byId("PBIRTHDATE").getText() === "" && this.getView().byId("PBIRTHPLACE").getText() === ""  &&
				this.getView().byId("PCORRESPONDLANGUAGE").getText() === "" && this.getView().byId("PAUTHORIZATIONGROUP").getText() === ""  &&
				this.getView().byId("PersonalData") !== undefined) 
		{								
			 person = this.getView().byId('PersonalData').getId();
			$('#'+person).hide();
		}
		
		if(this.getView().byId("PTITLE_KEY").getText() === "" && this.getView().byId("PTITLE_ACA1").getText() === ""  &&
				this.getView().byId("PFIRSTNAME").getText() === "" && this.getView().byId("PLASTNAME").getText() === ""  &&
				this.getView().byId("PTITLELETTER").getText() === "" && this.getView().byId("PSEARCHTERM1").getText() === ""  &&
			    this.getView().byId("PSEARCHTERM2").getText() === ""  && this.getView().byId("PGeneral") !== undefined) 
		{								
			person = this.getView().byId('PGeneral').getId();
			$('#'+person).hide();
		}

	}
});