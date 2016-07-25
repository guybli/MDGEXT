/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//To handle the behavior of the IAV detail view page  change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.IAVPersDetail", {
	extHookModifyIAVPersDetailFormData:null,

	onInit: function() {
		// Setting the navigate back visible true for moving back to S3 controller. 		
		var i = "";
		var l = "";
		var  sStyleClass = "";
		var sLabelName = "";
		var oLblIns = "";
		var sTextName = "";
		
		this.getView().byId("IAVPersDetailPage").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "IAVPersDetail") {
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());

				var vIAVPersAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
				this.getView().byId("IAVPersAttrHeader").setText(vIAVPersAttribute);
				var vDomain = oEvent.getParameter('arguments').Domain;

				//add footer
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts[vDomain].getS3Instance();
				var aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail'); 
				var oResponse = fcg.mdg.approvecrv2.DomainSpecParts[vDomain].getData( 'General' );
				var aPhysicalAddress = oResponse[0].data.BP_Root.BP_AddressesRel;
				var vAdID = oEvent.getParameter('arguments').AddressId;
				var sPhysicalAddress = '';
				//Get the Address Matching the AdID passed from S3
				for( i=0; i<aPhysicalAddress.results.length; i++){
					if(aPhysicalAddress.results[i].AD_ID === vAdID){
						sPhysicalAddress = aPhysicalAddress.results[i];
					}
				}
				var sAdVersion = "";
				var vAddrVersion = oEvent.getParameter('arguments').AddressVersion;
				var aAdVersion   = sPhysicalAddress.BP_AddressVersionsPersRel;
				sAdVersion   = "";
				for( i=0; i<aAdVersion.results.length; i++){
					if(aAdVersion.results[i].AD_ID === vAdID && 
							aAdVersion.results[i].ADDR_VERS === vAddrVersion ){
						sAdVersion = aAdVersion.results[i];
					}
				}
				//Set Header				
				var vIAVPersHeader = sPhysicalAddress.AD_ID__TXT;
				this.getView().byId("IAVPersDetailHeader").setTitle(vIAVPersHeader);

				var result = sAdVersion;	
				/**
				 * @ControllerHook To modify the data of the form if it is not done via direct binding
				 * Customer can modify the data as per his requirements before binding it to a form
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyIAVPersDetailFormData
				 * @param {object} detailData Holds data
				 * @return {object} detailData Modified Data 
				 */
				if(this.extHookModifyIAVPersDetailFormData){
					var extModifiedData = this.extHookModifyIAVPersDetailFormData(result);
					if(extModifiedData !== undefined){
						result = extModifiedData;
					}
				}
				var oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
				oModel.setData(result);

				var vElement = this.getView().byId("SimpleFormIAVPers");				
				vElement.setModel(oModel);

				//Bolding for International Address Versions				
				if (sAdVersion.ChangeData.results !== undefined && sAdVersion.ChangeData.results !== null)
				{
					if (sAdVersion.ChangeData.results.length > 0)
					{
						  sStyleClass = "text_bold";
						for ( l=0; l<sAdVersion.ChangeData.results.length; l++)
						{

							 sLabelName = "lblp" + sAdVersion.ChangeData.results[l].Attribute;							
							 oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}
							 sTextName = "p" + sAdVersion.ChangeData.results[l].Attribute;
							if(this.getView().byId(sTextName) !== undefined){
								this.getView().byId(sTextName).addStyleClass(sStyleClass);
							}
						}
					}
				}
				//Bolding for International Address Versions				
				if (sAdVersion.BP_AddressPersonVersionRel !== null && sAdVersion.BP_AddressPersonVersionRel.ChangeData.results !== undefined && sAdVersion.ChangeData.results !== null)
				{
					if (sAdVersion.BP_AddressPersonVersionRel.ChangeData.results.length > 0)
					{
						  sStyleClass = "text_bold";
						for ( l=0; l<sAdVersion.BP_AddressPersonVersionRel.ChangeData.results.length; l++)
						{

							 sLabelName = "lbl" + sAdVersion.BP_AddressPersonVersionRel.ChangeData.results[l].Attribute;							
							 oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}
							 sTextName = sAdVersion.BP_AddressPersonVersionRel.ChangeData.results[l].Attribute;
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
	onAfterRendering:function(){
		this.handleSectionVisibility();
	},
	handleSectionVisibility: function(){
		var vIAV_Sect2 = "";
		//Hide sections if data is not present.
		if(this.getView().byId('TITLE_P').getText() === "" && this.getView().byId('FIRSTNAME').getText() === "" && 
		this.getView().byId('LASTNAME').getText() === "" && this.getView().byId('SORT1_P').getText() === "" && 
		this.getView().byId('SORT2_P').getText() === "")
		{
			vIAV_Sect2 = this.getView().byId('IAVPers_Sect2').getId();
			$('#'+vIAV_Sect2).hide();
			var vIAV_Sect3 = this.getView().byId('IAVPers_Sect3').getId();
			$('#'+vIAV_Sect3).hide();
		}	
		
		if(this.getView().byId('pSTREET').getText() === "" && this.getView().byId('pHOUSE_NO').getText() === "" && 
				this.getView().byId('pCITY').getText() === "" )
		{
			vIAV_Sect2 = this.getView().byId('IAVPers_Sect2').getId();
			$('#'+vIAV_Sect2).hide();
			var vIAV_Sect4 = this.getView().byId('IAVPers_Sect4').getId();
			$('#'+vIAV_Sect4).hide();
		}
	}
});