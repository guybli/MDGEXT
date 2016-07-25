/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the bank detail view page in both create and change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.BankDetail", {
	oBankDetail:"",
	extHookModifyBankDetailFormData:null,
	extHookModifyBankStyleClass:null,
	onInit: function() {
		//Remove Style Class
		var sStyleClass = "text_bold";
		var aBankDetails = "";
		this.getView().byId("bankPage").removeStyleClass(sStyleClass);		
		
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("bankPage").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "bankDetail") {
				
				//Reset Form Bolding
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				var vDomain = oEvent.getParameter('arguments').Domain;
				//add footer
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts[vDomain].getS3Instance();
				var aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail'); 
				
				 aBankDetails = fcg.mdg.approvecrv2.DomainSpecParts[vDomain].
				oGeneralData[0].data.BP_Root.BP_BankAccountsRel;    //5

				var vBKID = oEvent.getParameter('arguments').ChangeKey; 
				var sBankDetail = "";
				for(var i=0; i < aBankDetails.results.length; i++){
					if(aBankDetails.results[i].BANKDETAILID.trim() === vBKID.trim()){
						sBankDetail = aBankDetails.results[i];
					}
				}				

				//To set the Page header
				var bankHeader="";

				if(sBankDetail.BANK_NAME !== "" && sBankDetail.BANK_NAME !== undefined)
					bankHeader = sBankDetail.BANK_NAME;
				if(sBankDetail.BANK_CTRY__TXT !== "" && sBankDetail.BANK_CTRY__TXT !== undefined)
				{
					if(bankHeader !== "")
						bankHeader = bankHeader+", "+sBankDetail.BANK_CTRY__TXT;
					else
						bankHeader = sBankDetail.BANK_CTRY__TXT;
				}
				if(sBankDetail.BANK_ACCT !== "" && sBankDetail.BANK_ACCT !== undefined)
				{
					if(bankHeader !== "")
						bankHeader = bankHeader+" ("+ this.getView().getModel("i18n").getProperty("Account") + ": "+  sBankDetail.BANK_ACCT +")";
					else
						bankHeader = this.getView().getModel("i18n").getProperty("Account") + ": "+  sBankDetail.BANK_ACCT;
				}

				var bankAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();

				this.getView().byId("bankDetailHeader").setTitle(bankHeader);
				this.getView().byId("bankAttrHeader").setText(bankAttribute);

				
				/**
				 * @ControllerHook To modify the data of the form if it is not done via direct binding
				 * Customer can modify the data as per his requirements before binding it to a form
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyBankDetailFormData
				 * @param {object} detailData Holds data
				 * @return {object} detailData Modified Data
				 */
				if(this.extHookModifyBankDetailFormData){
					var extModifiedData = this.extHookModifyBankDetailFormData(sBankDetail);
					if(extModifiedData !== undefined){
						sBankDetail = extModifiedData;
					}
				}
				var oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
				oModel.setData(sBankDetail);
				var vElement = this.getView().byId("SimpleFormBank");
				vElement.setModel(oModel);

				this.oBankDetail = sBankDetail;				
				this.highlight();  // To bold changed data				
				this.getView().rerender();
			}
		}, this);
	},

	//To initialize view so that hidden attributes are not shown on the UI
	onAfterRendering:function(){
		this.hideSection();
	},


	//If values are not filled then hide the BankData section
	hideSection: function()
	{
		if(this.getView().byId("BANK_CTRY").getText() === "" && this.getView().byId("BANK_KEY").getText() === ""  &&
				this.getView().byId("BANK_NAME").getText() === "" && this.getView().byId("STREET").getText() === ""  &&
				this.getView().byId("CITY").getText() === "" &&  this.getView().byId("SWIFT_CODE").getText() === "" &&
				this.getView().byId("BankData") !== undefined) 
		{								
			var bank = this.getView().byId('BankData').getId();
			$('#'+bank).hide();
		}

	},

	highlight:function(){
		//Bolding of the changed Data
		if (this.oBankDetail.ChangeData.results !== undefined && this.oBankDetail.ChangeData.results !== null)
		{
			if (this.oBankDetail.ChangeData.results.length > 0)
			{
				var  sStyleClass = "text_bold";
				/**
				 * @ControllerHook To modify the style class
				 * Customer can modify the style class to influence text fields
				 * the format of data shown in this description table									 
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyBankStyleClass
				 * @param {string} sStyleClass style class
				 * @return {string} sStyleClass modified style class
				 */
				if(this.extHookModifyBankStyleClass)
				{
					var sNewStyleClass = this.extHookModifyBankStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
					if(sNewStyleClass !== undefined){
						sStyleClass = sNewStyleClass;
					}
				}
				for (var l=0; l<this.oBankDetail.ChangeData.results.length; l++)
				{
					var sLabelName = "lbl" + this.oBankDetail.ChangeData.results[l].Attribute;
					var oLblIns = this.getView().byId(sLabelName);
					if(oLblIns !== undefined){
						oLblIns.setDesign("Bold");
					}
					var sTextName =this.oBankDetail.ChangeData.results[l].Attribute;
					if(this.getView().byId(sTextName) !== undefined){
						this.getView().byId(sTextName).addStyleClass(sStyleClass);
					}
				}
			}
		} 
		this.oBankDetail = "";
	}


});