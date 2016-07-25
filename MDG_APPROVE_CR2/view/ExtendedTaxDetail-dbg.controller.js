/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//Extended Withholding tax detail page for the navigation from both the detail and subdetail page.

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.ExtendedTaxDetail", {
	compCode:"",
	oItemTemp:"",
	subheader:"",
	extHookdisplayWithhldTaxData:null,
	extHookModifyStyleClass:null,

	onInit: function() {
		// Setting the navigate back visible true for moving back to S3 controller
		this.getView().byId("ExtendedTaxPage").setShowNavButton(true);
		var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getS3Instance();
		var aDecisions = oS3Instance.getDecisions();
		oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "Withhldtax") {

				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());	
				var args = oEvent.getParameter("arguments");
				this.withtax = args.Key;

				var result = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();
				this.displayWithhldTaxData(result);

				
				/**
				 * @ControllerHook To modify and bind the results of the OData service
				 * Customer can modify the data as per his requirements before binding it to a form or Table
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookdisplayWithhldTaxData
				 * @param {object} result holds the data
				 * @return { } Launches the page
				 */
				if(this.extHookdisplayWithhldTaxData){
					this.extHookdisplayWithhldTaxData(result);
				}
				
			}
		}, this);
	},


	//Binding of the withholding tax details in case withhldid id matches the withhldid id clicked by the user which is a combination of assignmentiId,CompanyCode and withholding tax type.
	displayWithhldTaxData : function(result)
	{
		var sNewStyleClass = "";
		var sStyleClass = "";
		for(var i=0; i<result.results.length;i++)
		{
			//Setting of the header in case of multiple ERP customers exists.
			if ( result.results.length > 1 )
			{
				var accgrp="";
				if(!this.isNull(result.results[i].CU_AssignedCustomerRel)){
					var custRel = result.results[i].CU_AssignedCustomerRel;
					if(!this.isNull(custRel.KTOKD) && !this.isNull(custRel.KTOKD__TXT)){
						accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(custRel.KTOKD, custRel.KTOKD__TXT);
					}
				}
				this.subheader = fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate.getSubheaderWithAccGrp(result.results[i].STANDARD,result.results[i].OBJECT_ID,result.results[i].REASON_ID__TXT, accgrp);
			}
			else
			{
				this.subheader = "";
			}
			for ( var j=0; j<result.results[i].CU_AssignedCompanyCodesRel.results.length;j++)
			{
				var oAssignedCompCodes = result.results[i].CU_AssignedCompanyCodesRel.results[j];

				for ( var k=0; k<oAssignedCompCodes.CU_CompWithholdingTaxesRel.results.length; k++)
				{
					var oCompWithtaxes = oAssignedCompCodes.CU_CompWithholdingTaxesRel.results[k];
					var compCode = oCompWithtaxes.BUKRS;

					var withtax = oCompWithtaxes.WITHT;
					var key = oCompWithtaxes.ASSIGNMENT_ID+compCode+withtax;

					if (key === this.withtax)
					{
						//Setting the header in the detail page which is a combination of the CompanyCode description and With holding tax type description  
						var compCodeDesc = oAssignedCompCodes.BUKRS__TXT;
						compCodeDesc = compCodeDesc + "("+ compCode + ")";
						var withtaxDesc = oCompWithtaxes.WITHT__TXT;
						var objDesc =  withtaxDesc + "("+ withtax +")";
						this.getView().byId("exTaxObjHeaderDet").setTitle(objDesc);
						this.getView().byId("erpCompCode").setText(compCodeDesc);
						var bpdesc = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
						this.getView().byId("bpdesc").setText(bpdesc);
						this.getView().byId("erpCustTax").setText(this.subheader);

						var FinalResult = oCompWithtaxes;
						var oModel = new sap.ui.model.json.JSONModel(); 
						oModel.setData(FinalResult);
						var vElement = this.getView().byId("SimpleFormExTax");
						vElement.setModel(oModel);

						  sStyleClass = "text_bold";

						/**
						 * @ControllerHook To modify the style class
						 * Customer can modify the style class to influence text fields
						 * the format of data shown in this description table									 
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyStyleClass
						 * @param {string} sStyleClass style class
						 * @return {string} sStyleClass modified style class
						 */
						if(this.extHookModifyStyleClass)
						{
						    sNewStyleClass = this.extHookModifyStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
							if(sNewStyleClass !== undefined){
								sStyleClass = sNewStyleClass;
							}
						}

						this.removeStyleClass(sStyleClass);

						//Bolding of the changed data for both the labels and texts.
						if (oCompWithtaxes.ChangeData.results !== undefined && oCompWithtaxes.ChangeData.results.length > 0 )
						{
							  sStyleClass = "text_bold";
							for (var l=0; l<oCompWithtaxes.ChangeData.results.length; l++)
							{
								var sLabelName = "lbl" + oCompWithtaxes.ChangeData.results[l].Attribute;
								var oLblIns = this.getView().byId(sLabelName);
								if(oLblIns !== undefined){
									oLblIns.setDesign("Bold");
								}
								var sTextName = oCompWithtaxes.ChangeData.results[l].Attribute;
								if(this.getView().byId(sTextName) !== undefined){
									this.getView().byId(sTextName).addStyleClass(sStyleClass);
								}
							}

						}

					}

				}
			}
		}

	},

	//Removes the style class for the texts and sets the design to standard. If not set in case of  create also bold will be shown.
	removeStyleClass : function(stylClass)
	{
		this.getView().byId("WT_WTSTCD").removeStyleClass(stylClass);
		this.getView().byId("lblWT_WTSTCD").setDesign("Standard");
		this.getView().byId("WT_AGTDF").removeStyleClass(stylClass);
		this.getView().byId("lblWT_AGTDF").setDesign("Standard");
		this.getView().byId("WT_WITHCD").removeStyleClass(stylClass);
		this.getView().byId("lblWT_WITHCD").setDesign("Standard");
		this.getView().byId("WT_AGENT").removeStyleClass(stylClass);
		this.getView().byId("lblWT_AGENT").setDesign("Standard");
		this.getView().byId("WT_AGTDT").removeStyleClass(stylClass);
		this.getView().byId("lblWT_AGTDT").setDesign("Standard");
	},
	
	isNull:function(value){
	    return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || parseInt(value) === 0;
	}
});