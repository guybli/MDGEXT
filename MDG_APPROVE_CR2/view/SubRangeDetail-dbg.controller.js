/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//Extended Withholding tax detail page for the navigation from both the detail and subdetail page.

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Supplier");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.SubRangeDetail", {
	oItemTemp:"",
	subheader:"", 
	extHookdisplayWithhldTaxData:null,
	extHookModifyStyleClass:null,

	onInit: function() {
		// Setting the navigate back visible true for moving back to S3 controller
		this.getView().byId("SuppSubRangePage").setShowNavButton(true);
		this.oRouter.attachRouteMatched(function(oEvent) {
			//Supplier
			if (oEvent.getParameter("name") === "SubRange") {

				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();
				var aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');

				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());	
				var args = oEvent.getParameter("arguments");
				this.Subrange = args.Key;

				var result = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();
				this.displaySubRangeData(result);
				this.hideSubRangeSection();
				//Trigger the View to hide or show the Core titles
				this.getView().rerender(); 
			}
		}, this);
	},
	
	//To initialize view so that hidden attributes are not shown on the UI
	onAfterRendering:function(){
		this.hideSubRangeSection();
	},

	//Binding of the withholding tax details in case withhldid id matches the withhldid id clicked by the user which is a combination of assignmentiId,CompanyCode and withholding tax type.
	displaySubRangeData : function(result)
	{
		var sStyleClass = "";
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
		for ( var j=0; j<result.results[i].SP_AssignedPurchasingOrgsRel.results.length;j++)
		{
			var oAssignedPurchaseArea = result.results[i].SP_AssignedPurchasingOrgsRel.results[j];
			for ( var k=0; k<oAssignedPurchaseArea.SP_PurchOrgPurchasingOrg2Rel.results.length; k++)
			{
				var subranges = oAssignedPurchaseArea.SP_PurchOrgPurchasingOrg2Rel.results[k];
				var subrange = subranges.LTSNR;
				var purchorg = subranges.EKORG;
				var plant = subranges.WERKS;
				var key = subranges.ASSIGNMENT_ID+purchorg+subrange+plant;
		
				if (key === this.Subrange)
				{
					//Setting the header in the detail page which is a combination of the CompanyCode description and With holding tax type description
					var PurchOrgDesc = oAssignedPurchaseArea.EKORG__TXT;
					
					var finalSubrange = "";
					if (subrange !== "|#-#|" && subrange !== "|#|") {
					   finalSubrange = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(subranges.LTSNR, subranges.LTSNR__TXT);
					}
		
					var finalPlant = "";
					if (subranges.WERKS !== "|#-#|" && subranges.WERKS !== "|#|") {
					    finalPlant = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(subranges.WERKS, subranges.WERKS__TXT);
					}
					
					var objDesc = "";
					PurchOrgDesc = this.getView().getModel("i18n").getProperty("SP_purchorg") +": "+PurchOrgDesc + " (" + purchorg + ")";
		         
					if (finalSubrange.trim().length > 0) {
						objDesc = this.getView().getModel("i18n").getProperty("SubRange") + ": ";
						objDesc = objDesc + finalSubrange;
					}
					if (finalPlant.trim().length > 0) {
						objDesc = objDesc + " " +this.getView().getModel("i18n").getProperty("plant") + ': ';
						objDesc = objDesc + finalPlant;
					}
		
					this.getView().byId("SuppSubrangeObjHeaderDet").setTitle(objDesc);
					var bpdesc = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
					this.getView().byId("SuppSubrangebpdesc").setText(bpdesc);
					this.getView().byId("erpVendSubrange").setText(this.subheader);
					this.getView().byId("purchOrgDesc").setText(PurchOrgDesc);
		
					var FinalResult = subranges;
					var oModel = new sap.ui.model.json.JSONModel(); 
					oModel.setData(FinalResult);
					var vElement = this.getView().byId("SimpleSuppFormSubrange");
					vElement.setModel(oModel);
					sStyleClass = "text_bold";
		
					//Bolding of the changed data for both the labels and texts.
					if (subranges.ChangeData.results !== undefined && subranges.ChangeData.results.length > 0 )
					{
						sStyleClass = "text_bold";
						for (var l=0; l<subranges.ChangeData.results.length; l++)
						{
							var sLabelName = "lblSub" + subranges.ChangeData.results[l].Attribute;
							var oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}
							var sTextName = "sub" + subranges.ChangeData.results[l].Attribute;
								if(this.getView().byId(sTextName) !== undefined)
									this.getView().byId(sTextName).addStyleClass(sStyleClass);
							}
			
						}
					}
		
				}
			}
		}

	},


	hideSubRangeSection : function ()
	{
		var parentId;
		if(this.getView().byId("subWAERS").getText() === "" && this.getView().byId("subMINBW").getText() === "0.00" &&
				this.getView().byId("subBOPNR").getText() === "" && this.getView().byId("subZTERM").getText() === "" &&
				this.getView().byId("subINCO1").getText() === "" && this.getView().byId("subMEPRF").getText() === "" && 
				this.getView().byId("subINCO2").getText() === "" && this.getView().byId("suppconditions") !== undefined){	
			var suppconditions = this.getView().byId('suppconditions').getId();
			parentId = $('#'+suppconditions).closest("div").attr("id");
			$('#'+parentId).remove();
		}


		if(this.getView().byId("subEKGRP").getText() === "" && this.getView().byId("subBSTAE").getText() === "" &&
				this.getView().byId("subMEGRU").getText() === "" && this.getView().byId("subRDPRF").getText() === "" &&
				this.getView().byId("subPLIFZ").getText() === "0" && this.getView().byId("subDISPO").getText() === "" &&
				this.getView().byId("subMRPPP").getText() === "" && this.getView().byId("subLFRHY").getText() === "" &&
				this.getView().byId("SP_DefaultMat") !== undefined){								
			var defaultMat = this.getView().byId('SP_DefaultMat').getId();
			parentId = $('#'+defaultMat).closest("div").attr("id");
			$('#'+parentId).remove();
		}

		if(this.getView().byId("subLIPRE").getText() === "" && this.getView().byId("subLIBES").getText() === "" &&
				this.getView().byId("subLISER").getText() === "" &&
				this.getView().byId("SP_ServiceData") !== undefined){								
			var serviceData = this.getView().byId('SP_ServiceData').getId();
			parentId = $('#'+serviceData).closest("div").attr("id");
			$('#'+parentId).remove();
		}

		if(this.getView().byId("subVERKF").getText() === "" &&	this.getView().byId("suppsalesdata") !== undefined){								
			var suppsalesdata = this.getView().byId('suppsalesdata').getId();
			parentId = $('#'+suppsalesdata).closest("div").attr("id");
			$('#'+parentId).remove();
		}
		
		if(this.getView().byId("subLFABC").getText() === "" && this.getView().byId("subEXPVZ").getText() === "" &&
				this.getView().byId("subZOLLA").getText() === "" && this.getView().byId("subPAPRF").getText() === "" &&
				this.getView().byId("subXNBWY").getText() === "" && this.getView().byId("subLEBRE").getText() === "" &&
				this.getView().byId("subWEBRE").getText() === "" && this.getView().byId("subXERSY").getText() === "" &&
				this.getView().byId("subXERSR").getText() === "" && this.getView().byId("subKZABS").getText() === "" &&
				this.getView().byId("subKZAUT").getText() === "" && this.getView().byId("suppControlData") !== undefined){								
			var suppControlData = this.getView().byId('suppControlData').getId();
			parentId = $('#'+suppControlData).closest("div").attr("id");
			$('#'+parentId).remove();
		}
	}
});