/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.MatSalesLongText", {

	oSalesDataTextDetails: "",
	flag: 0,
	oSalesOrgInstance: "",
	sRowId: "",
	sRow: "",
	textData: "",
	aSalesDataLen: "",
	vSalesTextDetailTitle: "",
	aSalesTextDetailData: "",
	vAction: "",
	routerName: "",
	extHookmatHookModifySalesTextRouting: null,

	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	onInit: function() {
		// Execute onInit of base class.

		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("SalesTextDetailPage").setShowNavButton(true);

		// Get DataManager instance.
		this.oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();

		this.oRouter.attachRouteMatched(function(oEvent) {
			var oS3Instance;
			var aDecisions;
			
			if (oEvent.getParameter("name") === "matSalesTextDetail") {
				// This code will be executed when the user navigates to Detail's screen. This same code is reused when user navigates from S4 to S5 screen
				// in Sales Change scenario - from Disb Chain and Tax Changes screens.
				this.routerName = oEvent.getParameter("name");
				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
			    aDecisions = oS3Instance.getDecisions();
			    this.vAction = oS3Instance.sAction;
			   	oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
			  	this.loadSalesTextLayout();
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				// Setting Header Text and Buttons
				this.sRowId = oEvent.getParameter('arguments').RowId;
				if (this.vAction === "CREATE") {
					this.strSalesKey = oEvent.getParameter('arguments').VKORG;
					this.strDisbKey = oEvent.getParameter('arguments').VTWEG;
					this.strLangucode = oEvent.getParameter('arguments').LANGUCODE;
					this.textData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getSalesTaxData();
					this.aSalesDataLen = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.getSalesDataLen();
				} else if (this.vAction === "CHANGE") {
					this.textData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMVKESalesTextDetailData();
					// need to get the SalesOrg and Disb Key as in this scenario the SalesOrg and DisbKey
					this.strSalesKey = oEvent.getParameter('arguments').VKORG;
					this.strDisbKey = oEvent.getParameter('arguments').VTWEG;
					this.strLangucode = oEvent.getParameter('arguments').LANGUCODE;
					this.aSalesTextDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.binarySearchSalesNDisb(this.strSalesKey, this.strDisbKey,
						this.textData.data.MATERIAL2MVKESALESRel);
					this.aSalesDataLen = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results.length;
				}
				this.setSalesObjHeader();
				this.setSalesHeader();
				//	this.getPage().destroyCustomHeader();
				this.bindLongTextData();
			} else if (oEvent.getParameter("name") === "matSalesTextChangeDetail") {
				// Load Sales Text data in S4 in Change scenario
				this.routerName = oEvent.getParameter("name");
				this.loadSalesTextLayout();
				this.sRowId = oEvent.getParameter('arguments').RowId;
				this.sCrId = oEvent.getParameter('arguments').vCrId;
				this.matNum = oEvent.getParameter('arguments').matNum;
				this.strSalesKey = oEvent.getParameter('arguments').VKORG;
				this.strDisbKey = oEvent.getParameter('arguments').VTWEG;
				this.strLangucode = oEvent.getParameter('arguments').LANGUCODE;
				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
			    aDecisions = oS3Instance.getDecisions();
			    this.vAction = oS3Instance.sAction;
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				this.textData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMVKESalesTextDetailData();
				this.aSalesTextDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.binarySearchSalesNDisb(this.strSalesKey, this.strDisbKey,
					this.textData.data.MATERIAL2MVKESALESRel);
				// Setting Header Text and Buttons
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
			//	this.getPage().destroyCustomHeader();
				this.setSalesObjHeader();
				this.setSalesHeader();
				this.bindSalesTextDetailData();
			}
			this.matHookModifySalesTextRouting(oEvent.getParameter("name"), this);
		}, this);
	},

	matHookModifySalesTextRouting: function(vRoutername, oView) {
		/**
		 * @ControllerHook To modify the existing s4 data of the panel
		 * Customer can modify the existing s4 data of the panel
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifySalesTextRouting
		 * @param {object} result Holds routername
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookmatHookModifySalesTextRouting) {
			this.extHookmatHookModifySalesTextRouting(vRoutername, oView);
		}
	},

	loadSalesTextLayout: function() {
		//Load the fragment for Long Text
		if (this.oSalesDataTextDetails === "") {
			this.oSalesDataTextDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatSalesTextDetails', fcg.mdg.approvecrv2.util.Formatter);
		} else {
			// If already defined, remove it from detail page and instantiate it again
			this.getView().byId("SalesTextDetailPage").removeContent(this.oSalesDataTextDetails);
			if (this.oSalesDataTextDetails !== undefined) {
				this.oSalesDataTextDetails.destroy();
			}
			this.oSalesDataTextDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatSalesTextDetails', fcg.mdg.approvecrv2.util.Formatter);
		}
		this.getView().byId("SalesTextDetailPage").removeContent(this.oSalesDataTextDetails);
		this.getView().byId("SalesTextDetailPage").addContent(this.oSalesDataTextDetails);

	},
	setSalesObjHeader: function() {
		//setting Object Header
		var headerTxt;
		var SalesDetailsTitle = this.getView().getModel("i18n").getProperty("SL_DIST_CHN");
		var vSalesAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		var mat = this.i18n.getText("MATERIAL");
		var Saleslang = this.i18n.getText("Sl_ln");
		var key;
		var desc;
		var textDesc;
		var strSaleskey;
		var strDisbkey;
		this.oSalesOrgInstance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMatSalesOrgInstance();
		// based on whether this method is called from the create / change scenario, the data structure changes
		if (this.vAction === "CREATE") {
			key = this.textData.data.MVKESALES2SALESTXTRel.results[this.sRowId].LANGUCODE;
			desc = this.textData.data.MVKESALES2SALESTXTRel.results[this.sRowId].LANGUCODE__TXT;
			textDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
			Saleslang = Saleslang + ": " + textDesc;
			vSalesAttribute = mat + ": " + vSalesAttribute;
			if (this.aSalesDataLen > 1) {
				headerTxt = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.setGetSalesObjHeader(this.oSalesOrgInstance.sRowId);
			} else {
				headerTxt = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.setGetSalesObjHeader(0);
			}
			this.getView().byId("SalesTextDetailHeader").setTitle(Saleslang);
			this.getView().byId("SalesOrgHeader").setText(headerTxt);
			this.getView().byId("MatrHeader").setText(vSalesAttribute);
		} else if (this.vAction === "CHANGE") {
			for (var j = 0; j < this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results.length; j++) {
				if (this.routerName === "matSalesTextChangeDetail") {
					textDesc = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[j].LANGUCODE;
				} else if (this.routerName === "matSalesTextDetail" && this.vAction === "CREATE") {
					textDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[j].LANGUCODE, this.aSalesTextDetailData
						.MVKESALES2SALESTXTRel.results[j].LANGUCODE__TXT);
				} else if (this.routerName === "matSalesTextDetail" && this.vAction === "CHANGE") {
					textDesc = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[j].LANGUCODE;
				} // end if routerNames and vAction conditions
				if (textDesc === this.strLangucode) {
					key = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[j].LANGUCODE;
					desc = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[j].LANGUCODE__TXT;
					textDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
					strSaleskey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[j].VKORG, this.aSalesTextDetailData
						.MVKESALES2SALESTXTRel.results[j].VKORG__TXT);
					strDisbkey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[j].VTWEG, this.aSalesTextDetailData
						.MVKESALES2SALESTXTRel.results[j].VTWEG__TXT);
					headerTxt = SalesDetailsTitle + ": " + strSaleskey + "/" + strDisbkey;
					Saleslang = Saleslang + ": " + textDesc;
				} // end inner if for LANGUCODE matching condition
			} // end for loop
			vSalesAttribute = mat + ": " + vSalesAttribute;
			this.getView().byId("SalesTextDetailHeader").setTitle(Saleslang);
			this.getView().byId("SalesOrgHeader").setText(headerTxt);
			this.getView().byId("MatrHeader").setText(vSalesAttribute);
		} // end if this.vAction === Change

	},

	bindLongTextData: function() {
		//binding Long Text
		var tData;
		if (this.vAction === "CREATE") {
			tData = this.textData.data.MVKESALES2SALESTXTRel.results[this.sRowId];

		} else if (this.vAction === "CHANGE") {
			tData = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[this.sRowId];
		}
		var oDetailModel = new sap.ui.model.json.JSONModel();
		oDetailModel.setData(tData);
		var vElement = this.getView().byId("SalesTextDetailPage");
		vElement.setModel(oDetailModel);
	},
	//******************************************************************************************************************
	setSalesHeader: function() { //setting sales header
		var vCstmHdr = this.getView().byId("SalesTextDetailPage").getCustomHeader();
		vCstmHdr.destroyContentMiddle();
		var vlocalIns = this;
		var TotalTexts;
		var vReq = this.getView().getModel("i18n").getProperty("DETAIL_TITLE");
		var vmat = this.getView().getModel("i18n").getProperty("MATERIAL");
		var vDis = this.getView().getModel("i18n").getProperty("SL_DIST_CHN");
		var txt = this.getView().getModel("i18n").getProperty("Sl_txt");
		this.vSalesTextDetailTitle = vReq + ": " + vmat + " - " + vDis;
		// The following if condition ensures that the iterator buttons are shown in case of create scenario and only in S5 of change scenario
		if (this.vAction === "CREATE" || this.routerName === "matSalesTextDetail") {
			// s5 of both create and change scenario
			if (this.vAction === "CREATE" && this.routerName === "matSalesTextDetail") {
				// create scenario S5
				TotalTexts = this.textData.data.MVKESALES2SALESTXTRel.results.length;
			} else if (this.vAction !== "CREATE" && this.routerName === "matSalesTextDetail") {
				// change scenario s5
				TotalTexts = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results.length;
			}

			// Iterator Buttons

			if (sap.ui.getCore().byId("salesTextBtnPrev") === undefined && sap.ui.getCore().byId("salesTextBtnNext") === undefined) {
				vCstmHdr.addContentRight(new sap.m.Button({
					id: "salesTextBtnPrev",
					icon: "sap-icon://up",
					press: function() { // On click event of previous button  
						vlocalIns.loadSalesTextLayout();
						vlocalIns.sRowId--;
						if (vlocalIns.vAction === "CREATE") {
							vlocalIns.setSalesObjHeader();
						} else if (vlocalIns.vAction === "CHANGE") {
							vlocalIns.setSalesChangeObjTextHeader();
						}
						vlocalIns.setSalesHeader();
						vlocalIns.bindLongTextData();

					}
				}));
				vCstmHdr.addContentRight(new sap.m.Button({
					id: "salesTextBtnNext",
					icon: "sap-icon://down",
					press: function() { // On click event of next button  
						vlocalIns.loadSalesTextLayout();
						vlocalIns.sRowId++;
						if (vlocalIns.vAction === "CREATE") {
							vlocalIns.setSalesObjHeader();
						} else if (vlocalIns.vAction === "CHANGE") {
							vlocalIns.setSalesChangeObjTextHeader();
						}
						vlocalIns.setSalesHeader();
						vlocalIns.bindLongTextData();
					}
				}));
			}

			// End Iterator Buttons
			sap.ui.getCore().byId("salesTextBtnNext").setVisible(true);
			sap.ui.getCore().byId("salesTextBtnPrev").setVisible(true);
			this.sRow = this.sRowId;
			this.sRow++;
			if (this.sRow === 1) {
				if (TotalTexts === 1) {
					sap.ui.getCore().byId("salesTextBtnNext").setVisible(false);
					sap.ui.getCore().byId("salesTextBtnPrev").setVisible(false);
				} // end if
				else {
					sap.ui.getCore().byId("salesTextBtnPrev").setEnabled(false);
					sap.ui.getCore().byId("salesTextBtnNext").setEnabled(true);
				}
			} else if (this.sRow === TotalTexts) {
				sap.ui.getCore().byId("salesTextBtnNext").setEnabled(false);
				sap.ui.getCore().byId("salesTextBtnPrev").setEnabled(true);
			} else {
				sap.ui.getCore().byId("salesTextBtnNext").setEnabled(true);
				sap.ui.getCore().byId("salesTextBtnPrev").setEnabled(true);
			}
			this.vSalesTextDetailTitle = this.vSalesTextDetailTitle + " - " + txt + " (" + this.sRow + "/" + TotalTexts + ")";
		} else if (this.vAction === "CHANGE") {

			// change scenario s4
			TotalTexts = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results.length;
			if (sap.ui.getCore().byId("salesTextBtnPrev") !== undefined && sap.ui.getCore().byId("salesTextBtnNext") !== undefined) {
				sap.ui.getCore().byId("salesTextBtnNext").setVisible(false);
				sap.ui.getCore().byId("salesTextBtnPrev").setVisible(false);
			} // end if	
			this.vSalesTextDetailTitle = this.vSalesTextDetailTitle + "-" + txt;
		}

		vCstmHdr.addContentMiddle(new sap.m.Text({
			text: this.vSalesTextDetailTitle
		}));
	},

	setChangeSalesHeader: function() {
		// setting the sales header during the Change scenario
		var vREQ = this.i18n.getText("DETAIL_TITLE");
		this.getView().byId("SalesTextDetailPage").setTitle(vREQ);

	},

	bindSalesTextDetailData: function() {
		//Retrieving data for S4 screen - Sales Text data
		// set the header data
		var vSalesAttribute = this.i18n.getText("MATERIAL") + ": " + fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		// Bind the S4 data for Sales Text
		var oSalesTextDetailModel = new sap.ui.model.json.JSONModel();
		var vSalesTextElement = sap.ui.getCore().byId("mattextSalesdetail");
		for (var i = 0; i < this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results.length; i++) {
			for (var j = 0; j < this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i].ChangeData.results.length; j++) {
				if (this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i].LANGUCODE === this.strLangucode && this.aSalesTextDetailData.MVKESALES2SALESTXTRel
					.results[i].ChangeData.results[j].Entity === "SALESTXT" && this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i].ChangeData.results[
						j].Attribute === "TXTSALES" && this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i].ChangeData.results[
						j].EntityAction !== "D") {
					this.setBoldSalesData(this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i]);
					oSalesTextDetailModel.setData(this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i]);
					vSalesTextElement.setModel(oSalesTextDetailModel);
					return;
				} else if (this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i].LANGUCODE === this.strLangucode && this.aSalesTextDetailData.MVKESALES2SALESTXTRel
					.results[i].ChangeData.results[j].Entity === "SALESTXT" && this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i].ChangeData.results[
						j].Attribute === "TXTSALES" && this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i].ChangeData.results[
						j].EntityAction === "D") {
					var tempTxt = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i].ChangeData.results[j].OldValue;
					this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i].TXTSALES = tempTxt;
					oSalesTextDetailModel.setData(this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[i]);
					vSalesTextElement.setModel(oSalesTextDetailModel);
					//	sap.ui.getCore().byId("mattextSalesdetail").setModel(oSalesTextDetailModel);                      
				}
			} // end for j
		} // end for i
	},
	//setting S4 / S5 Header information for Sales Text in the Change scenario
	setChangeSalesObjHeader: function(aResult) {
		var vDistChainLbl = this.i18n.getText("SL_DIST_CHN");
		var strSalesOrgHeaderTxt = vDistChainLbl + ": " + aResult.VKORG__TXT + " (" + aResult.VKORG + ") / " + " " + aResult.VTWEG__TXT + " (" +
			aResult.VTWEG + ")";
		return strSalesOrgHeaderTxt;
	},

	setBoldSalesData: function(aResult) {
		// Bolding the MARASales Screen with the Changed data highlighted
		var sStyleClass = "text_bold";
		for (var j = 0; j < aResult.ChangeData.results.length; j++) {
			var sLabelName = "LBL_" + aResult.ChangeData.results[j].Attribute;
			var oLblIns = sap.ui.getCore().byId(sLabelName);
			if (aResult.ChangeData.results[j].EntityAction !== fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vNewEntity) {
				if (oLblIns !== undefined) {
					oLblIns.setDesign("Bold");
				}
				var sTextName = "Txt_" + aResult.ChangeData.results[j].Attribute;
				if (sap.ui.getCore().byId(sTextName) !== undefined) {
					sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
				}
			} // end if EntityAction == Added
		} // end for

	},

	setSalesChangeObjTextHeader: function() {
		// setting S5 header during Change scenario only for texts when the Iterator is clicked.
		// As while loading the page, no matching is required for Langucode and the next or previous record should be loaded.
		// Hence, no need of a loop and this.sRowId can be directly used. So, not calling the SalesObjHeader
		var Saleslang = this.i18n.getText("Sl_ln");
		var key;
		var desc;
		var textDesc;
		var strSaleskey;
		var strDisbkey;
		var headerTxt;

		key = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[this.sRowId].LANGUCODE;
		desc = this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[this.sRowId].LANGUCODE__TXT;
		textDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
		strSaleskey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[this.sRowId].VKORG,
			this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[this.sRowId].VKORG__TXT);
		strDisbkey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[this.sRowId].VTWEG,
			this.aSalesTextDetailData.MVKESALES2SALESTXTRel.results[this.sRowId].VTWEG__TXT);
		headerTxt = this.getView().getModel("i18n").getProperty("SL_DIST_CHN") + ": " + strSaleskey + "/" + strDisbkey;
		Saleslang = Saleslang + ": " + textDesc;

		var vSalesAttribute = this.i18n.getText("MATERIAL") + ": " + fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		this.getView().byId("SalesTextDetailHeader").setTitle(Saleslang);
		this.getView().byId("SalesOrgHeader").setText(headerTxt);
		this.getView().byId("MatrHeader").setText(vSalesAttribute);

	}

});