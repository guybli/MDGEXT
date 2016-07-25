/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.MatSalesOrg", {

	oView: "",
	sRowId: "",
	sRow: "",
	aSalesDetailData: "",
	aSalesTaxTextData: "",
	SalesDetailsTitle: "",
	isNavToDetail: "",
	os4view: "",
	sCrId: "",
	counter: "",
	sFormatted: false,
	aMVKERelDetailData: "",
	aMARASalesDetailData: "",
	aSalesNDisbDetailData: "",
	aMVKESALESRelDetailData: "",
	extHookmatHookModifySalesOrgRouting: null,
	flag: "",
	aSalesTaxData: "",
	aSalesTextData: "",
	strSalesKey: "",
	strDisbKey: "",
	aSalesNDisbData: "",
	strTaxCountry: "",
	strTaxType: "",
	aSalestextData: "",
	aSalesTextDetailData: "",
	vRouterName: "",

	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	onInit: function() { // Execute onInit of base class.
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		this.getView().byId("SalesDataDetailPage").setShowNavButton(true);
		this.oRouter.attachRouteMatched(function(oEvent) {
			var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
			var aDecisions = oS3Instance.getDecisions();
			switch (oEvent.getParameter("name")) {
				case "matSalesDataDetail":
					{
						if (this.isNavToDetail !== "X") {
							this.vRouterName = "matSalesDataDetail";
							this.loadSalesDetailsLayout();
							this.sRowId = oEvent.getParameter('arguments').RowId;
							fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
							// Setting Header Text and Buttons
							this.os4view = oS3Instance;
							oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
							this.setSalesHeader();
							this.setSalesObjHeader();
							this.bindSalesDetailData();
							this.setSalesTaxTablePersonalization();
							fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.hideSalesOrgDetailSection();
						} // end if (this.isNavToDetail)
						this.isNavToDetail = "";
						break;
					} // end case "matSalesDataDetail" - create sales scenario
				case "matSalesChangeDataDetail":
					{
						// Change Scenario - Load MARASales data in S4, navigating from S3
						try {
							fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm.destroy();
						} catch (err) {

						}
						this.vRouterName = "matSalesChangeDataDetail";
						this.loadMARASalesDetailsLayout();
						this.sRowId = oEvent.getParameter('arguments').RowId;
						this.sCrId = oEvent.getParameter('arguments').vCrId;
						this.matNum = oEvent.getParameter('arguments').matNum;
						this.os4view = oS3Instance;
						this.setSalesObjHeaderMARASales();
						fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
						// Setting Header Text and Buttons
						oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
						this.setChangeSalesHeader();
						this.bindMARASalesChangeDetailData();
						fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.hideSalesSection();
						break;

					}
				case "matSalesNDisbChangeDataDetail":
					{
						this.vRouterName = "matSalesNDisbChangeDataDetail";
						this.loadChangeSalesTaxDetailsLayout();
						this.sRowId = oEvent.getParameter('arguments').RowId;
						this.sCrId = oEvent.getParameter('arguments').vCrId;
						this.matNum = oEvent.getParameter('arguments').matNum;
						this.strSalesKey = oEvent.getParameter('arguments').VKORG;
						this.strDisbKey = oEvent.getParameter('arguments').VTWEG;
						this.os4view = oS3Instance;
						fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
						// Setting Header Text and Buttons
						oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
						this.setSalesTaxTablePersonalization();
						//Set UI Focus to top of the page when loaded
						this.setUIFocusTo();
						this.setChangeSalesTaxHeader();
						this.bindMVKERelDetailData();
						this.bindSalesTaxNTextData();
						break;
					}
				case "matSalesTaxChangeDataDetail":
					{
						// Change scenario, load the corresponding Distribution Chain data, with Focus on the Tax table
						this.vRouterName = "matSalesTaxChangeDataDetail";
						this.loadChangeSalesTaxDetailsLayout();
						this.sRowId = oEvent.getParameter('arguments').RowId;
						this.sCrId = oEvent.getParameter('arguments').vCrId;
						this.matNum = oEvent.getParameter('arguments').matNum;
						this.strSalesKey = oEvent.getParameter('arguments').VKORG;
						this.strDisbKey = oEvent.getParameter('arguments').VTWEG;
						this.strTaxCountry = oEvent.getParameter('arguments').ALAND;
						this.strTaxType = oEvent.getParameter('arguments').TATYP;
						this.os4view = oS3Instance;
						fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
						// Setting Header Text and Buttons
						oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
						this.setSalesTaxTablePersonalization();
						//Set UI Focus to Tax Table when loaded
						this.setUIFocusTo();
						this.setChangeSalesTaxHeader();
						this.bindMVKERelDetailData();
						this.bindSalesTaxNTextData();
						break;
					}
			} // end switch
			this.matHookModifySalesOrgRouting(oEvent.getParameter("name"), this);
		}, this);
	},
	matHookModifySalesOrgRouting: function(vRoutername, oView) {
		/**
		 * @ControllerHook To modify the existing s4 data of the panel
		 * Customer can modify the existing s4 data of the panel
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifySalesOrgRouting
		 * @param {object} result Holds routername
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookmatHookModifySalesOrgRouting) {
			this.extHookmatHookModifySalesOrgRouting(vRoutername, oView);
		}
	},
	//***************************************************************************************************************

	loadSalesDetailsLayout: function() { //load the fragment to the Sales Detailed instance
		if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details === "") {
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details = sap.ui.xmlfragment(
				'fcg.mdg.approvecrv2.frag.Material.MatSalesOrgDetails',
				fcg.mdg.approvecrv2.util.Formatter);
		} else {

			this.getView().byId("SalesDataDetailPage").removeContent(fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details);
			if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details !== undefined) {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details.destroy();
			}
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details = sap.ui.xmlfragment(
				'fcg.mdg.approvecrv2.frag.Material.MatSalesOrgDetails', fcg.mdg.approvecrv2.util.Formatter);
		}
		this.getView().byId("SalesDataDetailPage").addContent(fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details); //adding the instance to the page of the view

	},
	//********************************************************************************************************************
	destroyInstance: function() {
		if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details !== undefined &&
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details !== "") {
			var vInst = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details;
			vInst.destroy();
		}

		if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableForm !== undefined &&
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableForm !== "") {
			var vInstSales = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableForm;
			vInstSales.destroy();
		}
		if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm !== undefined &&
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm !== "") {
			var vInstMARASales = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm;
			vInstMARASales.destroy();
		}
	},

	loadMARASalesDetailsLayout: function() {
		// this method is called during Change Sales scenario
		//load the Material Sales Create fragment only with the MARASales data minus the Distribution Chain table
		// to the oSalesTableS4details instance
		// Also destroy the Distribution Channel details if it is loaded initially.
		try {
			this.destroyInstance();
			if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details !== undefined || fcg.mdg.approvecrv2.DomainSpecParts
				.Material.MaterialSalesCreate.oSalesTableS4Details === "") {
				var oSalesTableForm = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details;
				oSalesTableForm.destroy();
			}
		} catch (err) {}

		if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm === "") {

			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm = sap.ui.xmlfragment(
				'fcg.mdg.approvecrv2.frag.Material.MaterialSalesCreate',
				fcg.mdg.approvecrv2.util.Formatter);
			sap.ui.getCore().byId("MatSalesDistChainTable").destroy();
		} else {

			this.getView().byId("SalesDataDetailPage").removeContent(fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm);
			if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm !== undefined) {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm.destroy();
			}
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm = sap.ui.xmlfragment(
				'fcg.mdg.approvecrv2.frag.Material.MaterialSalesCreate',
				fcg.mdg.approvecrv2.util.Formatter);
			sap.ui.getCore().byId("MatSalesDistChainTable").destroy();

		}
		this.getView().byId("SalesDataDetailPage").addContent(fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oMaterialSalesForm);
	},

	setChangeSalesHeader: function() {
		// setting the Sales Header during the Change scenario
		var vCstmHdr = this.getView().byId("SalesDataDetailPage").getCustomHeader();
		vCstmHdr.destroyContentMiddle();
		var vREQ = this.i18n.getText("DETAIL_TITLE");
		vREQ = vREQ + ": " + this.i18n.getText("MATERIAL");
		vCstmHdr.addContentMiddle(new sap.m.Text({
			text: vREQ
		}));
		this.getView().byId("materialheader").setText("");
		// hide the iterator buttons in S4 in the Change Scenario
		if (sap.ui.getCore().byId("salesBtnPrev") !== undefined && sap.ui.getCore().byId("salesBtnNext") !== undefined) {
			sap.ui.getCore().byId("salesBtnPrev").setVisible(false);
			sap.ui.getCore().byId("salesBtnNext").setVisible(false);
		}

	},
	setChangeSalesTaxHeader: function() {
		// setting the Sales Header during the Change scenario
		var vCstmHdr = this.getView().byId("SalesDataDetailPage").getCustomHeader();
		vCstmHdr.destroyContentMiddle();
		var vREQ = this.i18n.getText("DETAIL_TITLE");
		vREQ = vREQ + ": " + this.i18n.getText("MATERIAL") + " - " + this.i18n.getText("SL_DIST_CHN");
		vCstmHdr.addContentMiddle(new sap.m.Text({
			text: vREQ
		}));
		this.getView().byId("materialheader").setText("");
		// hide the iterator buttons in S4 in the Change Scenario
		if (sap.ui.getCore().byId("salesBtnPrev") !== undefined && sap.ui.getCore().byId("salesBtnNext") !== undefined) {
			sap.ui.getCore().byId("salesBtnPrev").setVisible(false);
			sap.ui.getCore().byId("salesBtnNext").setVisible(false);
		}
	},
	setSalesObjHeaderMARASales: function() {
		var vSalesAttribute = this.i18n.getText("MATERIAL") + ": " + fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		this.getView().byId("MatBasicDataDetailHeader").setTitle(vSalesAttribute);
	},

	bindMARASalesChangeDetailData: function() {
		//binding data for S4 screen - MARASales Change data - in the Change scenario
		var sFormatted1 = false;
		this.aMARASalesDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMARASalesDetailData();
		var vCrossDisDate = this.aMARASalesDetailData.data.MSTDV + " ";
		if (sFormatted1 === false && vCrossDisDate.length > 11) {
			this.aMARASalesDetailData.data.MSTDV = fcg.mdg.approvecrv2.util.Formatter.matDateFormat(vCrossDisDate);
			sFormatted1 = true;
		}
		var oMARASalesDetailModel = new sap.ui.model.json.JSONModel();
		var vMARASalesElement = sap.ui.getCore().byId("matSalesDataForm");
		this.setBoldSalesData(this.aMARASalesDetailData.data);
		oMARASalesDetailModel.setData(this.aMARASalesDetailData.data);
		vMARASalesElement.setModel(oMARASalesDetailModel);
	},

	setBoldSalesData: function(aResult) {
		// Bolding the MARASales Screen with the Changed data highlighted
		var sStyleClass = "text_bold";
		for (var j = 0; j < aResult.ChangeData.results.length; j++) {
			var sLabelName = "LBL_" + aResult.ChangeData.results[j].Attribute;
			var oLblIns = sap.ui.getCore().byId(sLabelName);
			if (oLblIns !== undefined) {
				oLblIns.setDesign("Bold");
			}
			var sTextName = "Txt_" + aResult.ChangeData.results[j].Attribute;
			if (sap.ui.getCore().byId(sTextName) !== undefined) {
				sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
			}
		}

	},

	loadChangeSalesTaxDetailsLayout: function() {
		//load the fragment to the oSalesTableS4details instance
		try {
			this.destroyInstance();
			if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details === "") {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details = sap.ui.xmlfragment(
					'fcg.mdg.approvecrv2.frag.Material.MatSalesOrgDetails', fcg.mdg.approvecrv2.util.Formatter);
			} else {
				this.getView().byId("SalesDataDetailPage").removeContent(fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details = sap.ui.xmlfragment(
					'fcg.mdg.approvecrv2.frag.Material.MatSalesOrgDetails', fcg.mdg.approvecrv2.util.Formatter);
			}
			this.getView().byId("SalesDataDetailPage").addContent(fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.oSalesTableS4Details);
		} catch (err) {}
	}, // end loadChangeSalesTaxDetailsLayout

	//setting S4 Header information for Sales Tax and Sales Text in the Change scenario
	setChangeSalesTaxObjHeader: function(aResult) {
		var vDistChainLbl = this.i18n.getText("SL_DIST_CHN");
		var strSalesOrgHeaderTxt = vDistChainLbl + ": " + aResult.VKORG__TXT + " (" + aResult.VKORG + ") / " + " " + aResult.VTWEG__TXT + " (" +
			aResult.VTWEG + ")";
		return strSalesOrgHeaderTxt;
	},

	bindMVKERelDetailData: function() {
		//binding data for S5 screen - MVKERel data
		var sFormatted2 = false;
		this.aMVKERelDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getSalesNDisbDetailData();
		this.aSalesNDisbData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.binarySearchSalesNDisb(this.strSalesKey, this.strDisbKey,
			this.aMVKERelDetailData.data.MATERIAL2MVKERel);
		var vCrossDisDate = this.aSalesNDisbData.VMSTD + " ";
		if (sFormatted2 === false && vCrossDisDate.length > 11) {
			this.aSalesNDisbData.VMSTD = fcg.mdg.approvecrv2.util.Formatter.matDateFormat(vCrossDisDate);
			sFormatted2 = true;
		}
		var oMVKERelDetailModel = new sap.ui.model.json.JSONModel();
		var vMVKERelDetailElement = sap.ui.getCore().byId("matSalesTableS4Form");
		this.setBoldMVKERelData(this.aSalesNDisbData);
		oMVKERelDetailModel.setData(this.aSalesNDisbData);
		vMVKERelDetailElement.setModel(oMVKERelDetailModel);

		// Since the aSalesTaxData also contains the MVKESALESReldata, using the same variable to bind the MVKESALESRel data like Grouping Data etc.,
		var oMVKESalesRelModel = new sap.ui.model.json.JSONModel();
		oMVKESalesRelModel.setData(this.aSalesNDisbData);
		var vMVKESalesRelElement = sap.ui.getCore().byId("matSalesTableS4Form2");
		vMVKESalesRelElement.setModel(oMVKESalesRelModel);

		// Setting the Header data
		var vSalesAttribute = this.i18n.getText("MATERIAL") + ": " + fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		var strHeaderTxt = this.setChangeSalesTaxObjHeader(this.aSalesNDisbData);
		this.getView().byId("MatBasicDataDetailHeader").setTitle(strHeaderTxt);
		this.getView().byId("materialheader").setText(vSalesAttribute);
		fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.hideSalesOrgDetailSection();
		// Destroying the label and the text field as both are repetitive in the Change scenario. They are required only in the 
		// Create scenario
		sap.ui.getCore().byId("Txt_SALESORG").destroy();
		sap.ui.getCore().byId("Txt_DISTCHANNEL").destroy();
	},

	bindSalesTaxNTextData: function() {
		//binding data for S4 screen - Sales Tax data in the 
		this.aMVKESALESRelDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMVKESalesTaxDetailData();
		this.aSalesTaxData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.binarySearchSalesNDisb(this.strSalesKey, this.strDisbKey,
			this.aMVKESALESRelDetailData
			.data.MATERIAL2MVKESALESRel);
		// Display the Sales Tax table only if there is atleast one record	
		if (this.aSalesTaxData.MVKESALES2MLANSALESRel.results.length > 0) {
			var oSalesTaxModel = new sap.ui.model.json.JSONModel();
			oSalesTaxModel.setData(this.aSalesTaxData.MVKESALES2MLANSALESRel);
			var vSalesTaxTable = sap.ui.getCore().byId("MatSalestaxTable");
			vSalesTaxTable.setModel(oSalesTaxModel);
			vSalesTaxTable.bindItems('/results', this.getSalesTaxTableTemplate(oSalesTaxModel), '', '');
		} // end if this.aSalesTaxData.MVKESALES2MLANSALESRel.results.length > 0
		else {
			// if there is no Sales Tax data retieved
			sap.ui.getCore().byId("MatSalestaxTable").destroy();
		}
		// bind the Sales Text table        
		this.aMVKESALESRelDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMVKESalesTextDetailData();
		this.aSalesTextData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.binarySearchSalesNDisb(this.strSalesKey, this.strDisbKey,
			this.aMVKESALESRelDetailData.data.MATERIAL2MVKESALESRel);
		// Display the Sales Text table only if there is atleast one record	
		if (this.aSalesTextData.MVKESALES2SALESTXTRel.results.length > 0) {
			var oSalesTextModel = new sap.ui.model.json.JSONModel();
			oSalesTextModel.setData(this.aSalesTextData.MVKESALES2SALESTXTRel);
			var vSalesTextTable = sap.ui.getCore().byId("MatSalestextTable");
			var oSalesTextItemTemp = this.getSalesTextTableTemplate(oSalesTextModel);
			oSalesTextItemTemp.attachPress({
				Entity: this.aSalesTextData.MVKESALES2SALESTXTRel,
				name: 'matSalesTextDetail'
			}, this.os4view.navtoSubDetail, this.os4view);
			vSalesTextTable.setModel(oSalesTextModel);
			vSalesTextTable.bindItems('/results', oSalesTextItemTemp, '', '');
		} // if (this.aSalesTextData.MVKESALES2SALESTXTRel.results.length > 0)	
		else {
			// if there is no Sales Text results retrived
			sap.ui.getCore().byId("MatSalestextTable").destroy();
		}
	},

	setBoldMVKERelData: function(aResult) {

		var sStyleClass = "text_bold";
		for (var j = 0; j < aResult.ChangeData.results.length; j++) {

			var sTextName = "Txt_" + aResult.ChangeData.results[j].Attribute;
			var sAttrValue = aResult.ChangeData.results[j].NewValue;
			// do not bold elements if Disb Chain is newly added	
			if (aResult.ChangeData.results[j].EntityAction !== fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vNewEntity) {
				if (sap.ui.getCore().byId(sTextName) !== undefined) {

					if (sAttrValue !== "" && sAttrValue !== "0,000") {
						sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
						var sLabelName = "LBL_" + aResult.ChangeData.results[j].Attribute;
						var oLblIns = sap.ui.getCore().byId(sLabelName);
						if (oLblIns !== undefined) {
							oLblIns.setDesign("Bold");
						}
					}
				} // end if (sTextName)
			} // end if do not bold if element is newly added. 	
		} // end for

	},

	getSalesTaxTableTemplate: function(oSalesTaxModel) {
		var vUpdatedEntity = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vUpdatedEntity;
		var oItemTemp = new sap.m.ColumnListItem({
			//			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "ALAND",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oSalesTaxModel, "ALAND");
							var desc = oSalesTaxModel.getProperty("ALAND__TXT", this.getBindingContext());
							var key = oSalesTaxModel.getProperty("ALAND", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "TATYP",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oSalesTaxModel, "TATYP");
							var desc = oSalesTaxModel.getProperty("TATYP__TXT", this.getBindingContext());
							var key = oSalesTaxModel.getProperty("TATYP", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "TAXSALTAX",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oSalesTaxModel, "TAXSALTAX");
							var desc = oSalesTaxModel.getProperty("TAXSALTAX__TXT", this.getBindingContext());
							var key = oSalesTaxModel.getProperty("TAXSALTAX", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				})
			]
		});
		return oItemTemp;
	},
	getSalesTextTableTemplate: function(oSalesTextModel) {
		var vUpdatedEntity = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vUpdatedEntity;
		var oItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "LANGUCODE",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oSalesTextModel, "LANGUCODE");
							var desc = oSalesTextModel.getProperty("LANGUCODE__TXT", this.getBindingContext());
							var key = oSalesTextModel.getProperty("LANGUCODE", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "TXTSALES",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oSalesTextModel, "TXTSALES");
							var desc = oSalesTextModel.getProperty("TXTSALES", this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.Truncate(desc);
						}
					}
				})
			]
		});
		return oItemTemp;
	},

	//**************************************************************************************************************************
	setSalesObjHeader: function() { //setting Sales Object Header
		var vSalesAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		var mat = this.i18n.getText("MATERIAL");
		vSalesAttribute = mat + ": " + vSalesAttribute;
		var headerTxt = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.setGetSalesObjHeader(this.sRowId);
		this.getView().byId("MatBasicDataDetailHeader").setTitle(headerTxt);
		this.getView().byId("materialheader").setText(vSalesAttribute);
	},
	//*******************************************************************************************************************
	navtoSubDetail: function(oEvent, data) { //navigating from s4 to s5
		this.isNavToDetail = "X";
		var sPath = oEvent.getSource().getBindingContext().getPath();
		var sR = sPath.substr(sPath.lastIndexOf("/") + 1);
		var cR = this.os4view.vCrId;
		try {
			var strSalesKey = oEvent.getParameter('arguments').VKORG;
			var strDisbKey = oEvent.getParameter('arguments').VTWEG;
			var strLangucode = oEvent.getParameter('arguments').LANGUCODE;
		} catch (err) {

		}
		try {
			var vSales = oEvent.getSource().getBindingContext().getObject().VKORG;
			var vDisb = oEvent.getSource().getBindingContext().getObject().VTWEG;
			var vLang = oEvent.getSource().getBindingContext().getObject().LANGUCODE;
		} catch (err) {

		}
		if (data.name === "matSalesTextDetail") {
			this.oRouter.navTo("matSalesTextDetail", {
				ChangeRequestID: cR,
				RowId: sR,
				VKORG: vSales,
				VTWEG: vDisb,
				LANGUCODE: vLang
			});
		} else if (data.name === "matSalesTextChangeDetail") {
			this.oRouter.navTo("matSalesTextChangeDetail", {
				ChangeRequestID: cR,
				RowId: sR,
				VKORG: strSalesKey,
				VTWEG: strDisbKey,
				LANGUCODE: strLangucode
			});
		}
	},
	//******************************************************************************************************************
	setSalesHeader: function() { //setting sales header
		// Adding Iterator buttons

		var vCstmHdr = this.getView().byId("SalesDataDetailPage").getCustomHeader();
		vCstmHdr.destroyContentMiddle();
		var TotalSales = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.aSalesdata.results.length;
		var vlocalIns = this;

		vlocalIns.SalesDetailsTitle = this.getView().getModel("i18n").getProperty("SL_DIST_CHN");
		var TotalSales = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.aSalesdata.results.length;
		this.sRow = this.sRowId;
		this.sRow++;
		var vREQ = this.i18n.getText("DETAIL_TITLE");
		var vmat = this.getView().getModel("i18n").getProperty("MATERIAL");
		this.SalesDetailsTitle = vREQ + ": " + vmat + " - " + this.SalesDetailsTitle + " (" + this.sRow + "/" + TotalSales + ")";
		//	this.getView().byId("SalesDataDetailPage").setTitle(this.SalesDetailsTitle);
		vCstmHdr.addContentMiddle(new sap.m.Text({
			text: vlocalIns.SalesDetailsTitle
		}));

		if (sap.ui.getCore().byId("salesBtnPrev") === undefined && sap.ui.getCore().byId("salesBtnNext") === undefined) {
			vCstmHdr.addContentRight(new sap.m.Button({
				id: "salesBtnPrev",
				icon: "sap-icon://up",
				press: function() { // On click event of previous button  
					vlocalIns.loadSalesDetailsLayout();
					vlocalIns.sRowId--;
					vlocalIns.setSalesObjHeader();
					vlocalIns.setSalesHeader();
					vlocalIns.bindSalesDetailData();
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.hideSalesOrgDetailSection();
				}
			}));
			vCstmHdr.addContentRight(new sap.m.Button({
				id: "salesBtnNext",
				icon: "sap-icon://down",
				press: function() { // On click event of next button  
					vlocalIns.loadSalesDetailsLayout();
					vlocalIns.sRowId++;
					vlocalIns.setSalesObjHeader();
					vlocalIns.setSalesHeader();
					vlocalIns.bindSalesDetailData();
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.hideSalesOrgDetailSection();
				}
			}));
		}

		sap.ui.getCore().byId("salesBtnPrev").setVisible(true);
		sap.ui.getCore().byId("salesBtnNext").setVisible(true);

		if (this.sRow === 1) {
			sap.ui.getCore().byId("salesBtnPrev").setEnabled(false);
			sap.ui.getCore().byId("salesBtnNext").setEnabled(true);
		} else if (this.sRow === TotalSales) {
			sap.ui.getCore().byId("salesBtnNext").setEnabled(false);
			sap.ui.getCore().byId("salesBtnPrev").setEnabled(true);
		} else {
			sap.ui.getCore().byId("salesBtnNext").setEnabled(true);
			sap.ui.getCore().byId("salesBtnPrev").setEnabled(true);
		}

		// End of Adding Iterator buttons

	},

	bindSalesDetailData: function() { //binding data for S4 screen including tax and text data
		sap.ui.getCore().byId("Txt_SALESORG").setVisible(false);
		sap.ui.getCore().byId("Txt_DISTCHANNEL").setVisible(false);
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setMatSalesOrgInstance(this);
		this.aSalesDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.getSalesDetailData(this.sRowId);
		var vVMSTD = this.aSalesDetailData.VMSTD;
		this.aSalesDetailData.VMSTD = fcg.mdg.approvecrv2.util.Formatter.matDateFormat(vVMSTD);
		var oDetailModel = new sap.ui.model.json.JSONModel();
		oDetailModel.setData(this.aSalesDetailData);
		var vElement = this.getView().byId("SalesDataDetailPage");
		this.aSalesTaxTextData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getSalesTaxData();
		fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.bindSalesTaxTextData(this.aSalesTaxTextData);
		vElement.setModel(oDetailModel);

	},

	setUIFocusTo: function() {
		// function to put the focus on Tax table when loaded	
		var vScrollTo = "MatSalestaxTable";
		this.getView().addEventDelegate({ // Scroll after rendering the page
			onAfterShow: function() {
				var oPage = this.getView().byId("SalesDataDetailPage");
				if (this.os4view.sAction === "CHANGE" && this.vRouterName === "matSalesTaxChangeDataDetail") {
					if (vScrollTo === 'MatSalestaxTable') {
						var vElement = document.getElementById("MatSalestaxTable");
						var vTop = vElement.offsetTop; // get lement height from top
						oPage.scrollTo(vTop, 300);
					}
				} else if (this.os4view.sAction === "CHANGE" && this.vRouterName !== "matSalesTaxChangeDataDetail") {
					oPage.scrollTo(0, 300);
				}
			}
		}, this);
	},

	setSalesTaxTablePersonalization: function() {
		// function to set the Sales Tax Table Personalization
		// get the table control and the button control
		var oSalesTaxTable = sap.ui.getCore().byId("MatSalestaxTable");
		var oSalesTaxPersButton = sap.ui.getCore().byId("SalesTaxpersIcon");
		var oItem = "/results";
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oItem, oSalesTaxTable, oSalesTaxPersButton);
	}
	//******************************************************************************************************************
});