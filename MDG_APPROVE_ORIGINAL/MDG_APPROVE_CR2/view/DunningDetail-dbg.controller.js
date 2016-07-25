/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//Dunning detail page for the navigation from both the detail page and sub-detail page.

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.DunningDetail", {
	compCode:"",
	subheader:"",
	oItemTemp:"",
	extHookModifyStyleClass:null,
	extHookdisplayDunningData:null,

	onInit: function() {
		var oS3Instance = "";
		var aDecisions = "";
		var args = "";
		var result = "";
		// Setting the navigate back visible true for moving back to S3 controller
		this.getView().byId("dunningPage").setShowNavButton(true);


		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "Dunning") {

				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getS3Instance();
				aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');

				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());

				args = oEvent.getParameter("arguments");
				this.dunningarea = args.Key;

				result = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();
				this.displayDunningData(result);
				/**
				 * @ControllerHook To modify and bind the results of the OData service
				 * Customer can modify the data as per his requirements before binding it to a form or Table
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookdisplayDunningData
				 * @param {object} result holds the data
				 * @return { } Launches the page
				 */
				if(this.extHookdisplayDunningData){
					this.extHookdisplayDunningData(result);
				}
			}
			//Supplier
			if (oEvent.getParameter("name") === "SuppDunning") {

				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();
				aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');

				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());

				args = oEvent.getParameter("arguments");
				this.dunningarea = args.Key;

				result = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();
				this.displaySuppDunningData(result);
		
			}
		}, this);
	},

	//Binding of the dunning details in case dunning id matches the dunning id clicked by the user which is a combination of assignmentiId,CompanyCode and Dunning Id.
	displayDunningData : function(result)
	{
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
				this.subheader = fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange.getSubheaderWithAccGrp(result.results[i].STANDARD, result.results[i].OBJECT_ID, result.results[i].REASON_ID__TXT, accgrp);
			}
			else
			{
				this.subheader = "";
			}

			for ( var j=0; j<result.results[i].CU_AssignedCompanyCodesRel.results.length;j++)
			{
				var oAssignedCompCodes = result.results[i].CU_AssignedCompanyCodesRel.results[j];

				for ( var k=0; k<oAssignedCompCodes.CU_CompDunningAreasRel.results.length; k++)
				{
					var oDunningAreas = oAssignedCompCodes.CU_CompDunningAreasRel.results[k];

					var compCode = oDunningAreas.BUKRS;
					var dunning = oDunningAreas.MABER;
					var key = oDunningAreas.ASSIGNMENT_ID+compCode+dunning;

					if (key === this.dunningarea)
					{
						//Setting of the header in the detail page which is a combination of Company Code with the Dunning area description.
						var compCodeDesc = oAssignedCompCodes.BUKRS__TXT;
						compCodeDesc = this.getView().getModel("i18n").getProperty("GL_COMP_CODE") +": " +compCodeDesc + "("+ compCode + ")";
						var dunningDesc = "";
						if(oDunningAreas.MABER !== ""){
						 dunningDesc = this.getView().getModel("i18n").getProperty("DunningArea") +": " +oDunningAreas.MABER__TXT + "(" + oDunningAreas.MABER + ")";
						}
						else{
							dunningDesc = this.getView().getModel("i18n").getProperty("DunningArea") +": " +oDunningAreas.MABER__TXT;
						}
						if (dunningDesc === this.getView().getModel("i18n").getProperty("DunningArea") +": ")
						{
							dunningDesc = this.getView().getModel("i18n").getProperty("DunningArea") +": " + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DefaultDunning");
						}
						this.getView().byId("dunObjHeaderDet").setTitle(dunningDesc);
						this.getView().byId("erpCCDunning").setText(compCodeDesc);
						var bpdesc = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
						this.getView().byId("bpdesc").setText(bpdesc);
						this.getView().byId("erpCustDunning").setText(this.subheader);


						var FinalResult = oDunningAreas;
						var oModel = new sap.ui.model.json.JSONModel(); 
						oModel.setData(FinalResult);
						var vElement = this.getView().byId("SimpleFormDunning");
						vElement.setModel(oModel);

						var  sStyleClass = "text_bold";
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
							var sNewStyleClass = this.extHookModifyStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
							if(sNewStyleClass !== undefined){
								sStyleClass = sNewStyleClass;
							}
						}

						this.removeStyleClass(sStyleClass);

						//Bolding of the changed data for both the texts and labels
						if (oDunningAreas.ChangeData.results !== undefined && oDunningAreas.ChangeData.results.length > 0 )
						{
							for (var l=0; l<oDunningAreas.ChangeData.results.length; l++)
							{
								var sLabelName = "lbl" + oDunningAreas.ChangeData.results[l].Attribute;
								var oLblIns = this.getView().byId(sLabelName);
								if(oLblIns !== undefined){
									oLblIns.setDesign("Bold");
								}
								var sTextName = oDunningAreas.ChangeData.results[l].Attribute;
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

	removeStyleClass : function(stylClass)
	{
		this.getView().byId("KNRMA").removeStyleClass(stylClass);
		this.getView().byId("lblKNRMA").setDesign("Standard");
		this.getView().byId("BUSAB").removeStyleClass(stylClass);
		this.getView().byId("lblBUSAB").setDesign("Standard");
		this.getView().byId("MANSP").removeStyleClass(stylClass);
		this.getView().byId("lblMANSP").setDesign("Standard");
		this.getView().byId("MADAT").removeStyleClass(stylClass);
		this.getView().byId("lblMADAT").setDesign("Standard");
		this.getView().byId("MAHNA").removeStyleClass(stylClass);
		this.getView().byId("lblMAHNA").setDesign("Standard");
		this.getView().byId("GMVDT").removeStyleClass(stylClass);
		this.getView().byId("lblGMVDT").setDesign("Standard");

	},
//	Supplier Dunnig Data
	displaySuppDunningData: function(result)
	{
		for(var i=0; i<result.results.length;i++)
		{
			//Setting of the header in case of multiple ERP customers exists.
			if ( result.results.length > 1 )
			{
				var accgrp="";
				if(result.results[i] !== undefined && result.results[i].SP_AssignedSupplierRel.KTOKK !== undefined && result.results[i].SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
					var supp = result.results[i].SP_AssignedSupplierRel;
					accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( supp.KTOKK,supp.KTOKK__TXT);
				}
				this.subheader = fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange.getSubheaderWithAccGrp(result.results[i].STANDARD,result.results[i].OBJECT_ID,result.results[i].REASON_ID__TXT,accgrp);
			
				//this.subheader = fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange.getSubheader(result.results[i].STANDARD,result.results[i].OBJECT_ID,result.results[i].REASON_ID__TXT);
			}
			else
			{
				this.subheader = "";
			}

			for ( var j=0; j<result.results[i].SP_AssignedCompanyCodesRel.results.length;j++)
			{
				var oAssignedCompCodes = result.results[i].SP_AssignedCompanyCodesRel.results[j];

				for ( var k=0; k<oAssignedCompCodes.SP_CompDunningAreasRel.results.length; k++)
				{
					var oDunningAreas = oAssignedCompCodes.SP_CompDunningAreasRel.results[k];

					var compCode = oDunningAreas.BUKRS;
					var dunning = oDunningAreas.MABER;
					var key = oDunningAreas.ASSIGNMENT_ID+compCode+dunning;

					if (key === this.dunningarea)
					{
						//Setting of the header in the detail page which is a combination of Company Code with the Dunning area description.
						var compCodeDesc = oAssignedCompCodes.BUKRS__TXT; 
						compCodeDesc = this.getView().getModel("i18n").getProperty("GL_COMP_CODE") +": " + compCodeDesc + "("+ compCode + ")";
						//var dunningDesc = this.getView().getModel("i18n").getProperty("DunningArea") +": " +oDunningAreas.MABER__TXT + "(" + oDunningAreas.MABER + ")";
						var dunningDesc = "";
						if(oDunningAreas.MABER !== ""){
						 dunningDesc = this.getView().getModel("i18n").getProperty("DunningArea") +": " +oDunningAreas.MABER__TXT + "(" + oDunningAreas.MABER + ")";
						}
						else{
							dunningDesc = this.getView().getModel("i18n").getProperty("DunningArea") +": " +oDunningAreas.MABER__TXT;
						}
						if (dunningDesc === this.getView().getModel("i18n").getProperty("DunningArea") +": ")
						{
							dunningDesc = this.getView().getModel("i18n").getProperty("DunningArea") +": " + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DefaultDunning");
						} 
						this.getView().byId("dunObjHeaderDet").setTitle(dunningDesc);
						this.getView().byId("erpCCDunning").setText(compCodeDesc);
						var bpdesc = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
						this.getView().byId("bpdesc").setText(bpdesc);
						this.getView().byId("erpCustDunning").setText(this.subheader);


						var FinalResult = oDunningAreas;
						var oModel = new sap.ui.model.json.JSONModel(); 
						oModel.setData(FinalResult);
						var vElement = this.getView().byId("SimpleFormDunning");
						vElement.setModel(oModel);

						var  sStyleClass = "text_bold";


						this.removeStyleClass(sStyleClass);

						//Bolding of the changed data for both the texts and labels
						if (oDunningAreas.ChangeData.results !== undefined && oDunningAreas.ChangeData.results.length > 0 )
						{
							for (var l=0; l<oDunningAreas.ChangeData.results.length; l++)
							{
								var sLabelName = "lbl" + oDunningAreas.ChangeData.results[l].Attribute;
								var oLblIns = this.getView().byId(sLabelName);
								if(oLblIns !== undefined){
									oLblIns.setDesign("Bold");
								}
								var sTextName = oDunningAreas.ChangeData.results[l].Attribute;
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
	
	isNull: function(value){
	    return typeof value === "undefined" || value === "unknown" || value === null || value === "null" || parseInt(value) === 0;
	}
});