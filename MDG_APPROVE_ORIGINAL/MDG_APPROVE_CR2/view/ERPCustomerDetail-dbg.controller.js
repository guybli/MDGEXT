/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the Erp Customer general detail view page in both create and change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.ERPCustomerDetail", {
	oresult:"",
	extHookModifyERPCustDetailFormData:null,
	extHookModifyERPCustStyleClass:null,
	
	onInit: function() {

		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("erpCustomerPage").setShowNavButton(true);
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "erpCustomerDetail") {
				
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getS3Instance();
				var aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail'); 

				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				var aErpDetails = fcg.mdg.approvecrv2.DomainSpecParts.Customer.
				oGeneralData[0].data.BP_Root.CU_MultipleAssignmentsRel;			
				//get the key
				var vErpID = oEvent.getParameter('arguments').ChangeKey; 
				var results = "";
				for(var i=0; i<aErpDetails.results.length; i++){
					if(aErpDetails.results[i].ASSIGNMENT_ID === vErpID){
						results = aErpDetails.results[i];
					}
				}	 

				//To set the Page header
				var erpCustHeader = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
				this.getView().byId("erpCustObjectKey").setText(erpCustHeader);
				var header="";			
				//To set the Object title
				if(!this.isNull(results.CU_AssignedCustomerRel)){
					if(!this.isNull(results.CU_AssignedCustomerRel.KUNNR)){
						var vKunnr = isNaN(parseInt(results.CU_AssignedCustomerRel.KUNNR)) ? results.CU_AssignedCustomerRel.KUNNR : parseInt(results.CU_AssignedCustomerRel.KUNNR);
						header = this.getView().getModel("i18n").getProperty("ERPCustomer") + ': ' + vKunnr;
					}
				}
				
				if(results.REASON_ID__TXT !== "" && results.REASON_ID__TXT !== undefined)
				{
					if(header !== "")
						header = header+", " + this.getView().getModel("i18n").getProperty("Reason")+": "+ results.REASON_ID__TXT; 
					else
						header = this.getView().getModel("i18n").getProperty("Reason")+": "+ results.REASON_ID__TXT; 
				}
				
				if(!this.isNull(results.CU_AssignedCustomerRel)){
					if(!this.isNull(results.CU_AssignedCustomerRel.KTOKD)){
						if(header !== "")
							header = header+", "+this.getView().getModel("i18n").getProperty("AccountGroup")+': '+results.CU_AssignedCustomerRel.KTOKD__TXT; 
						else
							header = this.getView().getModel("i18n").getProperty("AccountGroup")+': '+results.CU_AssignedCustomerRel.KTOKD__TXT;
					}
				}
				
				if(results.STANDARD !== "" && results.STANDARD !== undefined)
				{
					if(results.STANDARD === 'X'){
						if(header !== "")
							header = header+", "+this.getView().getModel("i18n").getProperty("Standard"); 
						else
							header = this.getView().getModel("i18n").getProperty("Standard");
					}
				}

				//To set the page title
				
				this.getView().byId("erpCustomerObjHeaderDet").setTitle(header);
				/**
				 * @ControllerHook To modify the data of the form if it is not done via direct binding
				 * Customer can modify the data as per his requirements before binding it to a form
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyERPCustDetailFormData
				 * @param {object} detailData Holds data
				 * @return {object} detailData Modified Data
				 */
				if(this.extHookModifyERPCustDetailFormData){
					var extModifiedData = this.extHookModifyERPCustDetailFormData(results);
					if(extModifiedData !== undefined){
						results = extModifiedData;
					}
				}
				var oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
				oModel.setData(results);
				
				var formControlData = this.getView().byId("SimpleFormControlData");
				formControlData.setModel(oModel);

				this.oresult = results;				
				this.highlight();
				//Trigger the View to hide or show the Core titles
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
		//Hide sections if data is not available
		var formExport = "";
		if(this.getView().byId("REASON_ID").getText() === "" && this.getView().byId("STANDARD").getText() === ""  &&
				this.getView().byId("multiassign") !== undefined) 
		{								
			var multiassign = this.getView().byId('multiassign').getId();
			$('#'+multiassign).hide();
		}

		if(this.getView().byId("BEGRU").getText() === "" && this.getView().byId("KONZS").getText() === "" &&
				this.getView().byId("VBUND").getText() === "" && this.getView().byId("LIFNR").getText() === "" &&
				this.getView().byId("AccountControl") !== undefined)
		{								
			var account = this.getView().byId('AccountControl').getId();
			$('#'+account).hide();
		}

		if(this.getView().byId("BAHNE").getText() === "" && this.getView().byId("BAHNS").getText() === "" &&
				this.getView().byId("LOCCO").getText() === "" &&
				this.getView().byId("ReferenceData") !== undefined)
		{								
			var reference = this.getView().byId('ReferenceData').getId();
			$('#'+reference).hide();
		}

		if(this.getView().byId("CITYC").getText() === "" && this.getView().byId("COUNC").getText() === "" &&
				this.getView().byId("FISKN").getText() === "" && this.getView().byId("FITYP").getText() === "" &&
				this.getView().byId("XSUBT").getText() === "" && this.getView().byId("J_1KFTBUS").getText() === "" &&
				this.getView().byId("J_1KFREPRE").getText() === "" &&
				this.getView().byId("STKZU").getText() === "" && this.getView().byId("STKZA").getText() === "" &&
				this.getView().byId("XICMS").getText() === "" && this.getView().byId("XXIPI").getText() === "" &&
				this.getView().byId("CFOPC").getText() === "" && this.getView().byId("J_1KFTIND").getText() === "" &&
				this.getView().byId("SimpleFormTaxInformation") !== undefined)
		{								
			var tax = this.getView().byId('SimpleFormTaxInformation').getId();
			$('#'+tax).hide();
		}

		if(this.getView().byId("DTAMS").getText() === "" && this.getView().byId("DTAWS").getText() === "" &&
				this.getView().byId("PaymentTransactions") !== undefined)
		{								
			var paytran = this.getView().byId('PaymentTransactions').getId();
			$('#'+paytran).hide();
		}

		if(this.getView().byId("XZEMP").getText() === "" && this.getView().byId("KNRZA").getText() === "" &&
				this.getView().byId("AlternativePayer") !== undefined)
		{								
			var altpay = this.getView().byId('AlternativePayer').getId();
			$('#'+altpay).hide();
		}

		if(this.getView().byId("NIELS").getText() === "" && this.getView().byId("KUKLA").getText() === "" &&
				this.getView().byId("BRAN1").getText() === "" && this.getView().byId("BRAN2").getText() === "" &&
				this.getView().byId("BRAN3").getText() === "" && this.getView().byId("BRAN4").getText() === "" &&
				this.getView().byId("BRAN5").getText() === "" &&
				this.getView().byId("MarkClassification") !== undefined)
		{											
			var markclas = this.getView().byId('MarkClassification').getId();
			$('#'+markclas).hide();
		}

		if((this.getView().byId("UMSA1").getText() === "0.00" || this.getView().byId("UMSA1").getText() === "0,00")&& this.getView().byId("UWAER").getText() === "" &&
				this.getView().byId("UMJAH").getText() === "0000" && this.getView().byId("JMZAH").getText() === "0" &&
				this.getView().byId("JMJAH").getText() === "0000" && this.getView().byId("PERIV").getText() === "" &&
				this.getView().byId("KeyFigures") !== undefined)
		{								
			var key = this.getView().byId('KeyFigures').getId();
			$('#'+key).hide();			
		}
		
		if(this.getView().byId("NIELS").getText() === "" && this.getView().byId("KUKLA").getText() === "" &&
				this.getView().byId("BRAN1").getText() === "" && this.getView().byId("BRAN2").getText() === "" &&
				this.getView().byId("BRAN3").getText() === "" && this.getView().byId("BRAN4").getText() === "" &&
				this.getView().byId("BRAN5").getText() === "" && this.isNull(this.getView().byId("UMSA1").getText()) && 
				this.getView().byId("UWAER").getText() === "" && this.isNull(this.getView().byId("UMJAH").getText()) && 
				this.isNull(this.getView().byId("JMZAH").getText()) && this.isNull(this.getView().byId("JMJAH").getText()) && 
				this.getView().byId("PERIV").getText() === "" && this.getView().byId("SimpleFormMarketing") !== undefined){
				var formMarket = this.getView().byId('SimpleFormMarketing').getId();
				$('#'+formMarket).hide();
		}
		if(this.getView().byId("CCC01").getText() === "" && this.getView().byId("CCC02").getText() === "" &&
				this.getView().byId("CCC03").getText() === "" && this.getView().byId("CCC04").getText() === "" &&
				this.getView().byId("ExpClassification") !== undefined)
		{											
			var expclas = this.getView().byId('ExpClassification').getId();
			$('#'+expclas).hide(); 
		}

		if(this.getView().byId("CIVVE").getText() === "" && this.getView().byId("MILVE").getText() === "" &&
				this.getView().byId("Usage") !== undefined)
		{								
			var usage = this.getView().byId('Usage').getId();
			$('#'+usage).hide();
		}		

		if(this.getView().byId("CIVVE").getText() === "" && this.getView().byId("MILVE").getText() === "" &&
				this.getView().byId("CCC01").getText() === "" && this.getView().byId("CCC02").getText() === "" &&
				this.getView().byId("CCC03").getText() === "" && this.getView().byId("CCC04").getText() === ""
					&& this.getView().byId("SimpleFormExportData") !== undefined)
		{
			 formExport = this.getView().byId('SimpleFormExportData').getId();
			$('#'+formExport).hide();
		}
		
		if(this.getView().byId("DTAMS").getText() === "" && this.getView().byId("DTAWS").getText() === "" &&
		  this.getView().byId("XZEMP").getText() === "" && this.getView().byId("KNRZA").getText() === "" &&
		  this.getView().byId("SimpleFormPaymentTransac") !== undefined)
		{
	         var formPay = this.getView().byId('SimpleFormPaymentTransac').getId();
	         $('#'+formPay).hide();
		}
		
		if(this.getView().byId("CIVVE").getText() === "" && this.getView().byId("MILVE").getText() === "" &&
				this.getView().byId("CCC01").getText() === "" && this.getView().byId("CCC02").getText() === "" &&
				this.getView().byId("CCC03").getText() === "" && this.getView().byId("CCC04").getText() === ""
					&& this.getView().byId("SimpleFormExportData") !== undefined)
		{
			 formExport = this.getView().byId('SimpleFormExportData').getId();
			$('#'+formExport).hide();
		}
		
		if(this.getView().byId("KATR1").getText() === "" && this.getView().byId("KATR2").getText() === "" &&
				this.getView().byId("KATR3").getText() === "" && this.getView().byId("KATR4").getText() === "" &&
				this.getView().byId("KATR5").getText() === "" && this.getView().byId("KATR6").getText() === "" &&
					this.getView().byId("KATR7").getText() === "" && this.getView().byId("KATR8").getText() === "" &&
					this.getView().byId("KATR9").getText() === "" && this.getView().byId("KATR10").getText() === "" &&
					this.getView().byId("KDKG1").getText() === "" && this.getView().byId("KDKG2").getText() === "" &&
					this.getView().byId("KDKG3").getText() === "" && this.getView().byId("KDKG4").getText() === "" &&
					this.getView().byId("KDKG5").getText() === "" 
                    && this.getView().byId("SimpleFormAdditionalData") !== undefined)
		{
			 formExport = this.getView().byId('SimpleFormAdditionalData').getId();
			$('#'+formExport).hide();
		}
		
		if(this.getView().byId("KATR1").getText() === "" && this.getView().byId("KATR2").getText() === "" &&
				this.getView().byId("KATR3").getText() === "" && this.getView().byId("KATR4").getText() === "" &&
				this.getView().byId("KATR5").getText() === "" && this.getView().byId("KATR6").getText() === "" &&
					this.getView().byId("KATR7").getText() === "" && this.getView().byId("KATR8").getText() === "" &&
					this.getView().byId("KATR9").getText() === "" && this.getView().byId("KATR10").getText() === "" 
						&& this.getView().byId("Attributes") !== undefined)
		{
			 formExport = this.getView().byId('Attributes').getId();
			$('#'+formExport).hide();
		}
		
		if(this.getView().byId("KDKG1").getText() === "" && this.getView().byId("KDKG2").getText() === "" &&
					this.getView().byId("KDKG3").getText() === "" && this.getView().byId("KDKG4").getText() === "" &&
					this.getView().byId("KDKG5").getText() === "" 
                    && this.getView().byId("ConditionGroups") !== undefined)
		{
			 formExport = this.getView().byId('ConditionGroups').getId();
			$('#'+formExport).hide();
		}
	},
	
	highlight:function(){
		//Bolding of the changed Data
		var  sStyleClass = "text_bold";
		if (this.oresult.ChangeData.results !== undefined && this.oresult.ChangeData.results !== null){
			for (var k=0; k<this.oresult.ChangeData.results.length; k++)
			{
				var changedLblName = "lbl" + this.oresult.ChangeData.results[k].Attribute;
				var changedLbl = this.getView().byId(changedLblName);
				if(changedLbl !== undefined){
					changedLbl.setDesign("Bold");
				}
				var changedTextName =this.oresult.ChangeData.results[k].Attribute;
				if(this.getView().byId(changedTextName) !== undefined){
					this.getView().byId(changedTextName).addStyleClass(sStyleClass);
				}
			}
		}
		if(!this.isNull(this.oresult.CU_AssignedCustomerRel)){
			if(!this.isNull(this.oresult.CU_AssignedCustomerRel.ChangeData.results)){
				if (this.oresult.CU_AssignedCustomerRel.ChangeData.results.length > 0)
				{
					/**
					 * @ControllerHook To modify the style class
					 * Customer can modify the style class to influence text fields
					 * the format of data shown in this description table									 
					 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyERPCustStyleClass
					 * @param {string} sStyleClass style class
					 * @return {string} sStyleClass modified style class
					 */
					if(this.extHookModifyERPCustStyleClass)
					{
						var sNewStyleClass = this.extHookModifyERPCustStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
						if(sNewStyleClass !== undefined){
							sStyleClass = sNewStyleClass;
						}
					}
					for (var l=0; l<this.oresult.CU_AssignedCustomerRel.ChangeData.results.length; l++)
					{
						var sLabelName = "lbl" + this.oresult.CU_AssignedCustomerRel.ChangeData.results[l].Attribute;
						var oLblIns = this.getView().byId(sLabelName);
						if(oLblIns !== undefined){
							oLblIns.setDesign("Bold");
						}
						var sTextName =this.oresult.CU_AssignedCustomerRel.ChangeData.results[l].Attribute;
						if(this.getView().byId(sTextName) !== undefined){
							this.getView().byId(sTextName).addStyleClass(sStyleClass);
						}
					}
				}
			}
		} 
		this.oresult = "";
	},
	
	isNull:function(value){
	    return typeof value === "undefined" || value === "unknown" || value === null || value === "null" || value === "" || parseInt(value) === 0;
	}
		
});