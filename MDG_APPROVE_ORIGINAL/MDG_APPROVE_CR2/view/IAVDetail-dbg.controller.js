/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the IAV detail view page  change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.IAVDetail", {
	extHookModifyIAVDetailFormData:null,

	onInit: function() {
		
		// Setting the navigate back visible true for moving back to S3 controller.
		
		var i = "";
		this.getView().byId("IAVPage").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "IAVDetail") {
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				var vIAVAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
				this.getView().byId("IAVAttrParentHeader").setText(vIAVAttribute);
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
				var aAdVersion   = sPhysicalAddress.BP_AddressVersionsOrgRel;
				sAdVersion   = "";
				for( i=0; i<aAdVersion.results.length; i++){
					if(aAdVersion.results[i].AD_ID === vAdID && 
							aAdVersion.results[i].ADDR_VERS === vAddrVersion ){
						sAdVersion = aAdVersion.results[i];
					}
				}
				//Set Header				
				var vIAVAttr = this.getView().getModel("i18n").getProperty("CC_ADDRESS") +": " +  sPhysicalAddress.AD_ID__TXT;
				var vIAVHeader = this.getView().getModel("i18n").getProperty("IAVTitle") +": " + sAdVersion.ADDR_VERS__TXT;
				this.getView().byId("IAVDetailHeader").setTitle(vIAVHeader);
				this.getView().byId("IAVAttrHeader").setText(vIAVAttr);
				
				var result = sAdVersion;					
				/**
				 * @ControllerHook To modify the data of the form if it is not done via direct binding
				 * Customer can modify the data as per his requirements before binding it to a form
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyIAVDetailFormData
				 * @param {object} detailData Holds data
				 * @return {object} detailData Modified Data
				 */
				if(this.extHookModifyIAVDetailFormData){
					var extModifiedData = this.extHookModifyIAVDetailFormData(result);
					if(extModifiedData !== undefined){
						result = extModifiedData;
					}
				}
				var oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
				oModel.setData(result);

				var vElement = this.getView().byId("SimpleFormIAV");				
				vElement.setModel(oModel);
				
			
				

			//	this.handleSectionVisibility();

				//Bolding for International Address Versions				
				if (sAdVersion.ChangeData.results !== undefined && sAdVersion.ChangeData.results !== null)
				{
					if (sAdVersion.ChangeData.results.length > 0)
					{
						var  sStyleClass = "text_bold";
						for (var l=0; l<sAdVersion.ChangeData.results.length; l++)
						{
							
							var sLabelName = "lbl" + sAdVersion.ChangeData.results[l].Attribute;							
							var oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}
							var sTextName = sAdVersion.ChangeData.results[l].Attribute;
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
		//Hide sections if data is not present.
		//var vIAV_Sect2 = "";
		
		if(this.getView().byId('TITLE').getText() === "" && this.getView().byId('NAME').getText() === "" && this.getView().byId('NAME_2').getText() === "" && 
				this.getView().byId('SORT1').getText() === "" && this.getView().byId('SORT2').getText() === "")
		{
			 var simpleFormIAVContainer = this.getView().byId("SimpleFormIAV");
		     var vIAV_Sect3 = this.getView().byId('IAV_Sect3');
		     simpleFormIAVContainer.removeContent(vIAV_Sect3);
		}	
		
		if(this.getView().byId('STREET').getText() === "" && this.getView().byId('HOUSE_NO').getText() === "" && 
				this.getView().byId('CITY').getText() === "" )
		{
		/*	 vIAV_Sect2 = this.getView().byId('IAV_Sect2').getId();
			$('#'+vIAV_Sect2).hide();*/
			var vIAV_Sect4 = this.getView().byId('IAV_Sect4').getId();
			$('#'+vIAV_Sect4).hide();
		}
	}
});