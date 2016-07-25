/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.MaterialDocAssignmentTextDataDetail", {

	oDocAssignmentTextDetails: "",
	oDocAssignmentDetails: "",
	flag: 0,
	oSalesOrgInstance: "",
	sRowId: "",
	sRow: "",
	strDocNum: "",
	strDocType: "",
	strLangucode: "",
	textData: "",
	aDocAssignmentDataLen: "",
	SalesDetailsTextTitle: "",
	vRouter: "",

	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	onInit: function() {
		// Execute onInit of base class.

		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("DocAssignmentTextDetailPage").setShowNavButton(true);

		// Get DataManager instance.
		this.oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();

		this.oRouter.attachRouteMatched(function(oEvent) {
			// var oS3Instance = "";
			// var aDecisions = "";
			if (oEvent.getParameter("name") === "matDocAssignmentTextDataDetail") {
				this.vRouter = "matDocAssignmentTextDataDetail";
				// This code will be executed when the user navigates to Detail's screen.
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				var aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				this.loadDocAssignmentTextLayout();
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				// Setting Header Text and Buttons
				this.sRowId = oEvent.getParameter('arguments').RowId;
				// this.setHeaderFooter();
				this.bindTextData();
				this.setDocAssignmentHeader();

				// this.setDocAssignmentHeader();
				this.setDocAssignmentObjHeader();
				//	this.bindDocAssignmentTextData();
			} else if (oEvent.getParameter("name") === "matDocAssignmentChangeTextDataDetail") {
				this.vRouter = "matDocAssignmentChangeTextDataDetail";
				// This code will be executed when the user navigates to Detail's screen.
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				var aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				var DocAssignmentDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getDocAssignmentDetailHdr("Text");
				var vCstmHdr = this.getView().byId("DocAssignmentTextDetailPage").getCustomHeader();
				vCstmHdr.destroyContentMiddle();
				vCstmHdr.addContentMiddle(new sap.m.Text({
											text: DocAssignmentDetailsTitle
										}));
				
				this.loadDocAssignmentTextLayout();
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				// Setting Header Text and Buttons
				this.sRowId = oEvent.getParameter('arguments').RowId;
				// this.setHeaderFooter();
				this.bindTextData();
				this.setDocAssignmentObjHeader();
				if (sap.ui.getCore().byId("MatDocAssignmentTxtBtnPrev") !== undefined && sap.ui.getCore().byId("MatDocAssignmentTxtBtnNext") !== undefined) {
				sap.ui.getCore().byId("MatDocAssignmentTxtBtnPrev").setVisible(false);
				sap.ui.getCore().byId("MatDocAssignmentTxtBtnNext").setVisible(false);
				}
				// var DocAssignmentDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getDocAssignmentDetailHdr("Text");
				// this.getView().byId("DocAssignmentTextDetailPage").setTitle(DocAssignmentDetailsTitle);
			}
				//controller hook 
		}, this);
	},

	loadDocAssignmentTextLayout: function() {
		//Load the fragment for Long Text
		if (this.oDocAssignmentDetails === "") {
			this.oDocAssignmentDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssigmentTextDetails', fcg.mdg.approvecrv2
				.util
				.Formatter);
		} else {
			// If already defined, remove it from detail page and instantiate it again
			this.getView().byId("DocAssignmentTextDetailPage").removeContent(this.oDocAssignmentDetails);
			if (this.oDocAssignmentDetails !== undefined) {
				this.oDocAssignmentDetails.destroy();
			}
			this.oDocAssignmentDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssigmentTextDetails', fcg.mdg.approvecrv2
				.util
				.Formatter);
		}
		this.getView().byId("DocAssignmentTextDetailPage").removeContent(this.oDocAssignmentDetails);
		this.getView().byId("DocAssignmentTextDetailPage").addContent(this.oDocAssignmentDetails);

	},
	setDocAssignmentObjHeader: function() {
		//setting Object Header
		var headerTxt;
		var docHeaderTxt;
		var vDocAssignmentAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		var mat = this.i18n.getText("MATERIAL");
		vDocAssignmentAttribute = mat + ": " + vDocAssignmentAttribute;
		var languTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.oDocAssignmentTextDetails.results[this.sRowId].LANGUCODE, this.oDocAssignmentTextDetails
			.results[this.sRowId].LANGUCODE__TXT);
		var langulabel = this.i18n.getText("Language");
		headerTxt = langulabel + ": " + languTxt;

		docHeaderTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.oDocAssignmentTextDetails.results[this.sRowId].DOKAR, this.oDocAssignmentTextDetails
			.results[this.sRowId].DOKAR__TXT);
		docHeaderTxt = this.i18n.getText("Mat_Document") + ": " + docHeaderTxt + "/" + this.oDocAssignmentTextDetails.results[this.sRowId].DOKNR+"/"+this.oDocAssignmentTextDetails.results[this.sRowId].DOKVR+"/"
		+this.oDocAssignmentTextDetails.results[this.sRowId].DOKTL;
		this.getView().byId("DocAssignmentTextDetailHeader").setTitle(headerTxt);
		this.getView().byId("DocumentNameHeader").setText(docHeaderTxt);
		this.getView().byId("DocAssignmentHeader").setText(vDocAssignmentAttribute);
	},
	// Set Header for Doc Assignment with Iterative buttons
	setDocAssignmentHeader: function() {
		var TotalDocAssignmentTxts = this.oDocAssignmentTextDetails.results.length;
		var tRowId = this.sRowId;
		tRowId++;
		
		var vCstmHdr = this.getView().byId("DocAssignmentTextDetailPage").getCustomHeader();
		vCstmHdr.destroyContentMiddle();
		var DocAssignmentDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getDocAssignmentDetailHdr("Text", tRowId, TotalDocAssignmentTxts);
		vCstmHdr.addContentMiddle(new sap.m.Text({
						text: DocAssignmentDetailsTitle
					}));
		var vlocalIns = this;
		if (sap.ui.getCore().byId("MatDocAssignmentTxtBtnPrev") === undefined && sap.ui.getCore().byId("MatDocAssignmentTxtBtnNext") === undefined) {	
		vCstmHdr.addContentRight(new sap.m.Button({
									id: "MatDocAssignmentTxtBtnPrev", icon:"sap-icon://up", 
									press: function() {					// On click event of previous button  
										vlocalIns.loadDocAssignmentTextLayout();
										vlocalIns.sRowId--;
										vlocalIns.bindTextData();
										vlocalIns.setDocAssignmentHeader();
										vlocalIns.setDocAssignmentObjHeader();
									}
								})
							);
		vCstmHdr.addContentRight(new sap.m.Button({
									id: "MatDocAssignmentTxtBtnNext", icon:"sap-icon://down",
									press: function() {						// On click event of next button  
									vlocalIns.loadDocAssignmentTextLayout();
									vlocalIns.sRowId++; 
									vlocalIns.bindTextData();
									vlocalIns.setDocAssignmentHeader();
									vlocalIns.setDocAssignmentObjHeader();
									}
								})
							);
		}
		sap.ui.getCore().byId("MatDocAssignmentTxtBtnPrev").setVisible(true);
		sap.ui.getCore().byId("MatDocAssignmentTxtBtnNext").setVisible(true);
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setMatIteratorVisibility(tRowId, sap.ui.getCore().byId(
				"MatDocAssignmentTxtBtnPrev"),
			sap.ui.getCore().byId("MatDocAssignmentTxtBtnNext"), TotalDocAssignmentTxts);
		
		
		
		// var DocAssignmentDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getDocAssignmentDetailHdr("Text", tRowId, TotalDocAssignmentTxts);
		// this.getView().byId("DocAssignmentTextDetailPage").setTitle(DocAssignmentDetailsTitle);
		// this.getView().byId("MatDocAssignmentTxtBtnPrev").setVisible(true);
		// this.getView().byId("MatDocAssignmentTxtBtnNext").setVisible(true);
		// fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setMatIteratorVisibility(tRowId, this.getView().byId("MatDocAssignmentTxtBtnPrev"),
		// 	this.getView().byId("MatDocAssignmentTxtBtnNext"), TotalDocAssignmentTxts);
	},
	// On click event of previous button	
	// onClickPrevious: function() {
	// 	this.loadDocAssignmentTextLayout();
	// 	this.sRowId--;
	// 	this.bindTextData();
	// 	this.setDocAssignmentHeader();
	// 	this.setDocAssignmentObjHeader();
	// 	this.bindDocAssignmentTextData();
	// },

	// // On click event of next button        
	// onClickNext: function() {
	// 	this.loadDocAssignmentTextLayout();
	// 	this.sRowId++; 
	// 	this.bindTextData();
	// 	this.setDocAssignmentHeader();
	// 	this.setDocAssignmentObjHeader();
	// 	this.bindDocAssignmentTextData();
	// },
//setting the footer 
	// setHeaderFooter: function() {

	// 	var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
	// 	var aDecisions = oS3Instance.getDecisions();
	// 	oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
	// 	this.getPage().destroyCustomHeader();
	// },
	bindTextData: function() {

		if (this.vRouter === "matDocAssignmentChangeTextDataDetail") {
			this.oDocAssignmentTextDetails = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentChange.getTextDetailData();
			var vNewVal = this.oDocAssignmentTextDetails.results[this.sRowId].NewValue;
			var sText = this.oDocAssignmentTextDetails.results[this.sRowId].TXTDRAD;
			sap.ui.getCore().byId("Txt_TXTDRAD").setText(sText);
			if (vNewVal !== "Added" && vNewVal !== "Deleted") {
				sap.ui.getCore().byId("Txt_TXTDRAD").addStyleClass("text_bold");
			}
		} else if (this.vRouter === "matDocAssignmentTextDataDetail") {
			this.oDocAssignmentTextDetails = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate.getTextData();
			var sText = this.oDocAssignmentTextDetails.results[this.sRowId].TXTDRAD;
			sap.ui.getCore().byId("Txt_TXTDRAD").setText(sText);
		}

	}
});