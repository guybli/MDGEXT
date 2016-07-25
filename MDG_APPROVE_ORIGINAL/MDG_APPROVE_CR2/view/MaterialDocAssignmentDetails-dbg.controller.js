/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentChange");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.MaterialDocAssignmentDetails", {

	oDocAssignmentDataDetails: "",
	os4view: null,
	vDocAssignment: "",
	vMaterial: "",
	RowId: 0,
	sRowId: 0,
	docNum: 0,
	docType: "",
	docpart: "",
	docvs: "",
	result: "",
	isNavToDetail: "",
	oFileUpload: "",
	oS3Instance: "",
	vRouterName: "",
	extHookmatHookModifyDocRouting:null,
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	onInit: function() {
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("DocAssignmentDetail").setShowNavButton(true);

		// Get DataManager instance.
		this.oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();

		this.oRouter.attachRouteMatched(function(oEvent) {

			if (oEvent.getParameter("name") === "matDocAssignmentDataDetail") {
				// Load Document Assignment Detail layout
				if (this.isNavToDetail !== "X") {
				this.vRouterName = "matDocAssignmentDataDetail";
				this.RowId = oEvent.getParameter('arguments').RowId;
				this.oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				var aDecisions = this.oS3Instance.getDecisions();
				this.oS3Instance.createDecisionButtons(aDecisions, this);
				// Setting Header Text and Buttons and the title of the page
				this.setDocAssignmentHeader();
				this.getDocumentdata();
				this.loadDocAssignmentDetailLayout();
				//setting the buttons destroying the customheader
				// this.setHeaderFooter();

				//setting the data for s4 page
				this.getSetDocAssignmentDetails();
				//header of the page
				this.setDocAssignmentObjHeader();
				// get Doc Assignment Details and set the data to forms
				} // end if this.isNavToDetail !== "X"	
				this.isNavToDetail = "";
			} else if (oEvent.getParameter("name") === "matDocAssignmentChangeDataDetail") {
				// Load Doc Assignment Detail layout for the Change scenario
				//	this.loadDocAssignmentDetailLayout();
				this.vRouterName = "matDocAssignmentChangeDataDetail";
				this.RowId = oEvent.getParameter('arguments').RowId;
				
				this.oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				var aDecisions = this.oS3Instance.getDecisions();
				this.oS3Instance.createDecisionButtons(aDecisions, this);
				var DocAssignmentDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getDocAssignmentDetailHdr("Document Assignment");
				var vCstmHdr = this.getView().byId("DocAssignmentDetail").getCustomHeader();
				vCstmHdr.destroyContentMiddle();
				vCstmHdr.addContentMiddle(new sap.m.Text({
											text: DocAssignmentDetailsTitle
										}));
				
				this.getDocumentdata();
				this.loadDocAssignmentDetailLayout();
				//setting the buttons destroying the customheader
				// this.setHeaderFooter();
				
				//setting the data for s4 page
				this.getSetDocAssignmentDetails();
				//setting the headers and hiding the visibility of buttons
				if (sap.ui.getCore().byId("MatDocAssignmentBtnPrev") !== undefined && sap.ui.getCore().byId("MatDocAssignmentBtnNext") !== undefined) {
				sap.ui.getCore().byId("MatDocAssignmentBtnPrev").setVisible(false);
				sap.ui.getCore().byId("MatDocAssignmentBtnNext").setVisible(false);
				}
				// var DocAssignmentDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getDocAssignmentDetailHdr("Document Assignment");
				// this.getView().byId("DocAssignmentDetail").setTitle(DocAssignmentDetailsTitle);
				//header of the page
				this.setDocAssignmentObjHeader();
			}
			//controller hook 
			this.matHookModifyDocRouting(this.vRoutername,this);
			
		}, this);
	},
matHookModifyDocRouting: function(vRoutername,oView) {
		/**
		 * @ControllerHook To modify the existing s4 data of the panel 
		 * Customer can modify the existing s4 data of the panel 
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyDocRouting
		 * @param {object} result Holds routername
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookmatHookModifyDocRouting) {
			this.extHookmatHookModifyDocRouting(vRoutername,oView); 
		}
	},
	//	Load Doc Assignment detail fragment
	loadDocAssignmentDetailLayout: function() {
		if (sap.ui.getCore().byId("Txt_Document") !== undefined) {
			sap.ui.getCore().byId("Txt_Document").destroy();

		}
		if (this.oDocAssignmentDataDetails === "") {
			this.oDocAssignmentDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssignmentDetails', fcg.mdg.approvecrv2
				.util
				.Formatter);
		} else {
			// If already defined, remove it from detail page and instantiate it again
			this.getView().byId("DocAssignmentDetail").removeContent(this.oDocAssignmentDataDetails);
			if (this.oDocAssignmentDataDetails !== undefined) {
				this.oDocAssignmentDataDetails.destroy();
			}
			this.oDocAssignmentDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssignmentDetails', fcg.mdg.approvecrv2
				.util
				.Formatter);
		}
		this.getView().byId("DocAssignmentDetail").addContent(this.oDocAssignmentDataDetails);
	},

	// Set Header for Doc Assignment with Iterative buttons
	setDocAssignmentHeader: function() {

		var aDocData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDocAssignmentDetailsData();
		var TotalDocAssignments = aDocData.data.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length;
		this.sRowId = this.RowId;
		this.sRowId++;
		var vCstmHdr = this.getView().byId("DocAssignmentDetail").getCustomHeader();
		vCstmHdr.destroyContentMiddle();
		var DocAssignmentDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getDocAssignmentDetailHdr("Document Assignment", this.sRowId,
			TotalDocAssignments);
		// this.getView().byId("DocAssignmentDetail").setTitle(DocAssignmentDetailsTitle);
		vCstmHdr.addContentMiddle(new sap.m.Text({
						text: DocAssignmentDetailsTitle
					}));
		var vlocalIns = this;
		if (sap.ui.getCore().byId("MatDocAssignmentBtnPrev") === undefined && sap.ui.getCore().byId("MatDocAssignmentBtnNext") === undefined) {	
		vCstmHdr.addContentRight(new sap.m.Button({
									id: "MatDocAssignmentBtnPrev", icon:"sap-icon://up", 
									press: function() {					// On click event of previous button  
										vlocalIns.loadDocAssignmentDetailLayout();
										vlocalIns.RowId--;
										vlocalIns.getDocumentdata();
										vlocalIns.getSetDocAssignmentDetails();
										vlocalIns.setDocAssignmentObjHeader();
										vlocalIns.setDocAssignmentHeader();
									}
								})
							);
		vCstmHdr.addContentRight(new sap.m.Button({
									id: "MatDocAssignmentBtnNext", icon:"sap-icon://down",
									press: function() {						// On click event of next button  
										vlocalIns.loadDocAssignmentDetailLayout();
										vlocalIns.RowId++;
										vlocalIns.getDocumentdata();
										vlocalIns.getSetDocAssignmentDetails();
										vlocalIns.setDocAssignmentObjHeader();
										vlocalIns.setDocAssignmentHeader();
									}
								})
							);
		}
		sap.ui.getCore().byId("MatDocAssignmentBtnPrev").setVisible(true);
		sap.ui.getCore().byId("MatDocAssignmentBtnNext").setVisible(true);
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setMatIteratorVisibility(this.sRowId, sap.ui.getCore().byId(
				"MatDocAssignmentBtnPrev"),
			sap.ui.getCore().byId("MatDocAssignmentBtnNext"), TotalDocAssignments);

	},

	//  set Document Assignment Object header	
	setDocAssignmentObjHeader: function() {
		var vDocAssignmentDesc = this.i18n.getText("Mat_Document") + ": " + this.docType + "/" + this.docNum;
		this.getView().byId("DocAssignmentDetailHeader").setTitle(vDocAssignmentDesc);
		var vDocPartVs = this.i18n.getText("Mat_Doc_Part_Vs") + ": " + this.docvs + "/" + this.docpart;
		this.getView().byId("DocDHeader").setText(vDocPartVs);
		var generaldata = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
		this.vMaterial = generaldata.data.MATERIAL;
		var vMaterialTxt = generaldata.data.TXTMI;
		var vMatHeader = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.vMaterial, vMaterialTxt);
		vMatHeader = this.i18n.getText("Material") + ": " + vMatHeader;
		this.getView().byId("MatrlHeader").setText(vMatHeader);

	},

	// 	 get Document Assignment details and bind it      
	getSetDocAssignmentDetails: function() {
		// getting the Document Originals data	
		var docAssignmentOrgResults = this.results;
		fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate.getsetDocData(docAssignmentOrgResults, this);
	},

	// // On click event of previous button	
	// onClickPrevious: function() {
	// 	this.loadDocAssignmentDetailLayout();
	// 	this.RowId--;
	// 	this.getDocumentdata();
	// 	this.getSetDocAssignmentDetails();
	// 	this.setDocAssignmentObjHeader();
	// 	this.setDocAssignmentHeader();
	// },

	// // On click event of next button        
	// onClickNext: function() {
	// 	this.loadDocAssignmentDetailLayout();
	// 	this.RowId++;
	// 	this.getDocumentdata();
	// 	this.getSetDocAssignmentDetails();
	// 	this.setDocAssignmentObjHeader();
	// 	this.setDocAssignmentHeader();
	// },
	navtoSubDetail: function(oEvent, data) {
		//navigating from s4 to s5
		this.isNavToDetail = "X";
		var sPath = oEvent.getSource().getBindingContext().getPath();
		var sRowId = sPath.substr(sPath.lastIndexOf("/") + 1);
		var vDOKNR = oEvent.getSource().getBindingContext().getObject().DOKNR;
		var vDOKAR = oEvent.getSource().getBindingContext().getObject().DOKAR;
		var vLANGUCODE = oEvent.getSource().getBindingContext().getObject().LANGUCODE;

		if (data.name === "matDocAssignmentTextDataDetail") //Material Text Details navigation during Create Scenario
		{
			this.oRouter.navTo("matDocAssignmentTextDataDetail", {
				RowId: sRowId
			});
		} else if (data.name === "matDocAssignmentChangeTextDataDetail") //Material Text Details navigation during Change Scenario
		{
			this.oRouter.navTo("matDocAssignmentChangeTextDataDetail", {
				RowId: sRowId
			});
		}
	},
	//setting the buttons and destroying the custom header
	// setHeaderFooter: function() {
	// 	// setting the footer
	// 	this.oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
	// 	var aDecisions = this.oS3Instance.getDecisions();
	// 	this.oS3Instance.createDecisionButtons(aDecisions, this);
	// 	// this.getPage().destroyCustomHeader(); // destroy custom header	
	// },

	getDocumentdata: function() {
		var aDocAssignmentData;
		if (this.vRouterName === "matDocAssignmentChangeDataDetail") {
			aDocAssignmentData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentChange.getDocAssignmentData();
			this.docNum = aDocAssignmentData.dataitems[this.RowId].DOKNR;
			var vDocType = aDocAssignmentData.dataitems[this.RowId].DOKAR;
			this.docvs = aDocAssignmentData.dataitems[this.RowId].DOKVR;
			this.docpart = aDocAssignmentData.dataitems[this.RowId].DOKTL;
			this.docType = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aDocAssignmentData.dataitems[this.RowId].DOKAR,aDocAssignmentData.dataitems[this.RowId].DOKAR__TXT);
		} else if (this.vRouterName === "matDocAssignmentDataDetail") {
			aDocAssignmentData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate.getDocAssignmentData();
			this.docNum = aDocAssignmentData.dataitems[this.RowId].DOKNR;
			var vDocType = aDocAssignmentData.dataitems[this.RowId].DOKAR;
			this.docvs = aDocAssignmentData.dataitems[this.RowId].DocumentVersion;
			this.docpart = aDocAssignmentData.dataitems[this.RowId].DocumentPart;
			this.docType = aDocAssignmentData.dataitems[this.RowId].DocumentType;

		}
		var aDocDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDocAssignmentData(this.docNum, vDocType, this.docvs, this.docpart);
	//this result will be used entirely for navigation
		this.results = aDocDetailData;
	}

});