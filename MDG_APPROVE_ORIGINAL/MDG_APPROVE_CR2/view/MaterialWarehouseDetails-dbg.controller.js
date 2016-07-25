/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.TablePersoController");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseChange");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.MaterialWarehouseDetails", {

	oWarehouseDataDetails: "",
	vWarehouse: "",
	vMaterial: "",
	RowId: 0,
	sRowId: 0,
	result: "",
	isNavToDetail: "",
	oS3Instance: "",
	oDecisions: "",
	aWhChangedDetailData: "",
	oStorageType: "",
	extHookmatHookModifyWarehouseRouting: null,
	vSWarehouseNum: "",
	vStorageType: "",
	req: "",
	mat: "",
	wh: "",
	vCreated: "",
	vTotalWarehouses: "",
	vMatkeyDesc: "",
	aWarehouseGeneralData: "",
	aWarehouseDetailData: "",

	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	onInit: function() {
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("WarehouseDetail").setShowNavButton(true);
		this.oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
		this.aDecisions = this.oS3Instance.getDecisions();
		this.req = this.i18n.getText("DETAIL_TITLE");
		this.mat = this.i18n.getText("MATERIAL");
		this.wh = this.i18n.getText("Warehouse");
		this.vCreated = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getCreateEntityAction();

		this.oRouter.attachRouteMatched(function(oEvent) {
			switch (oEvent.getParameter("name")) {
				case "matWarehouseDataDetail":
					// Load Warehouse Detail layout
					this.loadWarehouseDetailLayout();
					this.RowId = oEvent.getParameter('arguments').RowId;
					this.aWarehouseGeneralData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getWarehouseCreateData();
					this.bindWarehouseDetailData();
					// Table Personalization
					// get the table control and the button control
					var oSTable = sap.ui.getCore().byId("MatWarehouseStorageTypeTable");
					var oStoragePersButton = sap.ui.getCore().byId("StorageTypepersIcon");
					var oItem = "/results";
					fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oItem, oSTable, oStoragePersButton);
					// Set Warehouse object header
					this.setRowIdAndWarehouse();
					this.oS3Instance.createDecisionButtons(this.aDecisions, this);
					// setting the footer
					// Setting Header Text and Buttons
					this.setWarehouseHeader();
					break;
				case "matWarehouseChangeDataDetail":
					if (this.isNavToDetail !== "X") { // Check if navigation is from Warehouse

						this.aWhChangedDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getWarehouseChangedData();
						this.loadWarehouseDetailLayout();
						this.vWarehouseNum = oEvent.getParameter('arguments').LGNUM;
						this.vMatkeyDesc = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
						var whHeader = this.req + ": " + this.mat + " - " + this.wh;
						this.getView().byId("WarehouseDetail").setTitle(whHeader);
						fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
						this.bindWarehouseChangedDetailData();
						// Table Personalization
						// get the table control and the button control
						var oChngSTable = sap.ui.getCore().byId("MatWarehouseStorageTypeTable");
						var oChngStoragePersButton = sap.ui.getCore().byId("StorageTypepersIcon");
						var oChngItem = "/results";
						fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oChngItem, oChngSTable, oChngStoragePersButton);
						this.oS3Instance.createDecisionButtons(this.aDecisions, this);
						if (sap.ui.getCore().byId("MatWarehouseBtnPrev") !== undefined && sap.ui.getCore().byId("MatWarehouseBtnNext") !== undefined) {
							sap.ui.getCore().byId("MatWarehouseBtnPrev").setVisible(false);
							sap.ui.getCore().byId("MatWarehouseBtnNext").setVisible(false);
						}
					}
					break;
				case "matStorageTypeChangeDataDetail":
					if (this.isNavToDetail !== "X") { // Check if navigation is from Storage Type

						this.aWhChangedDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getWarehouseChangedData();
						this.loadStorageTypeDetailLayout();
						var storType = this.i18n.getText("Mat_Warehouse_StorageType");
						var storTypeHeader = this.req + ": " + this.mat + " - " + this.wh + " - " + storType;
						this.getView().byId("WarehouseDetail").setTitle(storTypeHeader);
						this.vSWarehouseNum = oEvent.getParameter('arguments').LGNUM;
						this.vStorageType = oEvent.getParameter('arguments').LGTYP;
						this.vSWarehouseDesc = oEvent.getParameter('arguments').LGNUM__TXT;
						this.vStorageTypeDesc = oEvent.getParameter('arguments').LGTYP__TXT;
						fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
						this.oS3Instance.createDecisionButtons(this.aDecisions, this);
						var vMatHeaderTxt = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
						this.setStorageTypeObjHeader(this.vSWarehouseDesc, this.vStorageTypeDesc, vMatHeaderTxt);
						if (sap.ui.getCore().byId("MatWarehouseBtnPrev") !== undefined && sap.ui.getCore().byId("MatWarehouseBtnNext") !== undefined){
							sap.ui.getCore().byId("MatWarehouseBtnPrev").setVisible(false);
							sap.ui.getCore().byId("MatWarehouseBtnNext").setVisible(false);
						}
						this.bindStorageTypeChangedDetailData();
					}
					break;

			}
			this.isNavToDetail = "";
			this.matHookModifyWarehouseRouting(oEvent.getParameter("name"), this);
		}, this);
	},

	matHookModifyWarehouseRouting: function(vRoutername, oView) {
		/**
		 * @ControllerHook To modify the existing s4 data of the panel
		 * Customer can modify the existing s4 data of the panel
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyWarehouseRouting
		 * @param {object} result Holds routername
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookmatHookModifyWarehouseRouting) {
			this.extHookmatHookModifyWarehouseRouting(vRoutername, oView);
		}
	},
	//	Load Warehouse detail fragment
	loadWarehouseDetailLayout: function() {
		if (this.oWarehouseDataDetails !== undefined && this.oWarehouseDataDetails !== "") {
			this.getView().byId("WarehouseDetail").removeContent(this.oWarehouseDataDetails);
			try {
				this.oWarehouseDataDetails.destroy();
			} catch (err) {}
		}
		if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.oMaterialWarehouseForm === "") {
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.oMaterialWarehouseForm =
				sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialWarehouseDetails', fcg.mdg.approvecrv2.util.Formatter);
		} else {
			// If already defined, remove it from detail page and instantiate it again
			this.getView().byId("WarehouseDetail").removeContent(fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.oMaterialWarehouseForm);

			if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.oMaterialWarehouseForm !== undefined) {
				try {
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.oMaterialWarehouseForm.destroy();
				} catch (err) {}
			}
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.oMaterialWarehouseForm = sap.ui.xmlfragment(
				'fcg.mdg.approvecrv2.frag.Material.MaterialWarehouseDetails', fcg.mdg.approvecrv2.util.Formatter);
		}
		this.getView().byId("WarehouseDetail").addContent(fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.oMaterialWarehouseForm);
		try {
			sap.ui.getCore().byId("Txt_WAREHOUSEDETAILS").setVisible(false);
		} catch (err) {}
	},
	loadStorageTypeDetailLayout: function() {
		if (fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.oMaterialWarehouseForm !== undefined && fcg.mdg.approvecrv2.DomainSpecParts
			.Material.MaterialWarehouseCreate.oMaterialWarehouseForm !== ""
		) {
			this.getView().byId("WarehouseDetail").removeContent(fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.oMaterialWarehouseForm);
			try {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.oMaterialWarehouseForm.destroy();
			} catch (err) {}
		}
		if (this.oWarehouseDataDetails === "") {
			this.oWarehouseDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialStorageTypeChange', fcg.mdg.approvecrv2.util
				.Formatter);
		} else {
			// If already defined, remove it from detail page and instantiate it again
			this.getView().byId("WarehouseDetail").removeContent(this.oWarehouseDataDetails);

			if (this.oWarehouseDataDetails !== undefined) {
				try {
					this.oWarehouseDataDetails.destroy();
				} catch (err) {}
			}
			this.oWarehouseDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialStorageTypeChange', fcg.mdg.approvecrv2.util
				.Formatter);
		}
		this.getView().byId("WarehouseDetail").addContent(this.oWarehouseDataDetails);
	},

	bindWarehouseDetailData: function() {

		this.aWarehouseDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.getWarehouseDetailData(this.RowId);
		var oDetailModel = new sap.ui.model.json.JSONModel();
		if (this.aWarehouseDetailData.L2SKR === "") {
			this.aWarehouseDetailData.L2SKR = this.aWarehouseDetailData.L2SKR__TXT;
			this.aWarehouseDetailData.L2SKR__TXT = "";
		}
		if (this.aWarehouseDetailData.VOMEM === "") {
			this.aWarehouseDetailData.VOMEM = this.aWarehouseDetailData.VOMEM__TXT;
			this.aWarehouseDetailData.VOMEM__TXT = "";
		}
		oDetailModel.setData(this.aWarehouseDetailData);
		var vElement = this.getView().byId("WarehouseDetail");
		this.aWarehouseStorageTypeData = this.aWarehouseDetailData.MLGNSTOR2MLGTSTORRel;
		fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.bindStorageTypeData(this.aWarehouseStorageTypeData);
		vElement.setModel(oDetailModel);
		fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.hideWarehouseSection();

	},

	// Set Header for Warehouse with Iterative buttons
	setWarehouseHeader: function() {
		// Iterator buttons and Back Button changes
		var vCstmHdr = this.getView().byId("WarehouseDetail").getCustomHeader();
		vCstmHdr.destroyContentMiddle();
		var WarehouseDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getWarehouseDetailHdr(this.i18n.getText("Warehouse"), this.sRowId, this.vTotalWarehouses);
		vCstmHdr.addContentMiddle(new sap.m.Text({
			text: WarehouseDetailsTitle
		}));
		var vlocalIns = this;
		if (sap.ui.getCore().byId("MatWarehouseBtnPrev") === undefined && sap.ui.getCore().byId("MatWarehouseBtnNext") === undefined) {
			vCstmHdr.addContentRight(new sap.m.Button({
				id: "MatWarehouseBtnPrev",
				icon: "sap-icon://up",
				press: function() { // On click event of previous button  
					vlocalIns.loadWarehouseDetailLayout();
					vlocalIns.RowId--;
					vlocalIns.setRowIdAndWarehouse();
					vlocalIns.setWarehouseHeader();
					fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
						.setMatIteratorVisibility(vlocalIns.sRowId, sap.ui.getCore().byId("MatWarehouseBtnPrev"), sap.ui.getCore().byId(
								"MatWarehouseBtnNext"),
							vlocalIns.vTotalWarehouses);
					vlocalIns.bindWarehouseDetailData();
				}
			}));
			vCstmHdr.addContentRight(new sap.m.Button({
				id: "MatWarehouseBtnNext",
				icon: "sap-icon://down",
				press: function() { // On click event of next button  
					vlocalIns.loadWarehouseDetailLayout();
					vlocalIns.RowId++;
					vlocalIns.setRowIdAndWarehouse();
					vlocalIns.setWarehouseHeader();
					fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
						.setMatIteratorVisibility(vlocalIns.sRowId, sap.ui.getCore().byId("MatWarehouseBtnPrev"), sap.ui.getCore().byId(
								"MatWarehouseBtnNext"),
							vlocalIns.vTotalWarehouses);
					vlocalIns.bindWarehouseDetailData();
				}
			}));

		}
		// End Iterator Buttons
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
			.setMatIteratorVisibility(this.sRowId, sap.ui.getCore().byId("MatWarehouseBtnPrev"), sap.ui.getCore().byId("MatWarehouseBtnNext"), this
				.vTotalWarehouses);

		this.getView().byId("WarehouseDetail").setTitle(this.WarehouseDetailsTitle);
		var vWarehouse = this.aWarehouseGeneralData.results[this.RowId].LGNUM;
		var vWarehouseTxt = this.aWarehouseGeneralData.results[this.RowId].LGNUM__TXT;
		var vMatHeaderTxt = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		this.setWarehouseObjHeader(vWarehouse, vWarehouseTxt, vMatHeaderTxt);
	},
	setRowIdAndWarehouse: function() {
		this.sRowId = this.RowId;
		this.sRowId++;
		this.vTotalWarehouses = this.aWarehouseGeneralData.results.length;

	},
	//  set Warehouse Object header	
	setWarehouseObjHeader: function(vWarehouseNum, vWarehouseDesc, vMatkeyDesc) {

		var vWarehouseobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vWarehouseNum, vWarehouseDesc);
		vWarehouseobjDesc = this.i18n.getText("Warehouse") + ": " + vWarehouseobjDesc;
		this.getView().byId("MatWarehouseMainHeader").setTitle(vWarehouseobjDesc);
		var vMatHeader = this.i18n.getText("Material") + ": " + vMatkeyDesc;
		this.getView().byId("MatrlWarehouseHeader").setText(vMatHeader);
	},
	//set storage type object header
	setStorageTypeObjHeader: function(vWarehouseDesc, vStorageTypeNum, vMatkeyDesc) {
		vMatkeyDesc = this.i18n.getText("MATERIAL") + ": " + vMatkeyDesc;
		this.vStorageTypeDesc = this.i18n.getText("Mat_Warehouse_StorageType") + ": " + this.vStorageTypeDesc;
		this.vSWarehouseDesc = this.i18n.getText("Warehouse") + ": " + this.vSWarehouseDesc;
		this.getView().byId("MatWarehouseMainHeader").setTitle(this.vStorageTypeDesc);
		this.getView().byId("MatWarehouseSubHeader").setText(this.vSWarehouseDesc);
		this.getView().byId("MatrlWarehouseHeader").setText(vMatkeyDesc);

	},

	setBoldWarehouseData: function(aResult) {

		var sStyleClass = "text_bold";
		for (var j = 0; j < aResult.ChangeData.results.length; j++) {

			if (aResult.ChangeData.results[j].Attribute === "LHME1") {

				if (sap.ui.getCore().byId("LBL_LHMG1") !== undefined) {
					sap.ui.getCore().byId("LBL_LHMG1").setDesign("Bold");
				}

				if (sap.ui.getCore().byId("Txt_LHMG1") !== undefined) {
					sap.ui.getCore().byId("Txt_LHMG1").addStyleClass(sStyleClass);
				}
			}

			if (aResult.ChangeData.results[j].Attribute === "LHME2") {

				if (sap.ui.getCore().byId("LBL_LHMG2") !== undefined) {
					sap.ui.getCore().byId("LBL_LHMG2").setDesign("Bold");
				}

				if (sap.ui.getCore().byId("Txt_LHMG2") !== undefined) {
					sap.ui.getCore().byId("Txt_LHMG2").addStyleClass(sStyleClass);
				}
			}

			if (aResult.ChangeData.results[j].Attribute === "LHME3") {

				if (sap.ui.getCore().byId("LBL_LHMG3") !== undefined) {
					sap.ui.getCore().byId("LBL_LHMG3").setDesign("Bold");
				}

				if (sap.ui.getCore().byId("Txt_LHMG3") !== undefined) {
					sap.ui.getCore().byId("Txt_LHMG3").addStyleClass(sStyleClass);
				}
			}
			if (aResult.ChangeData.results[j].Attribute === "BEZME") {

				if (sap.ui.getCore().byId("LBL_MKAPV") !== undefined) {
					sap.ui.getCore().byId("LBL_MKAPV").setDesign("Bold");
				}

				if (sap.ui.getCore().byId("Txt_MKAPV") !== undefined) {
					sap.ui.getCore().byId("Txt_MKAPV").addStyleClass(sStyleClass);
				}
			}

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

	bindStorageTypeData: function(aResult) {
		var oStorageTypeModel = new sap.ui.model.json.JSONModel();
		oStorageTypeModel.setData(aResult.MLGNSTOR2MLGTSTORRel);
		var vStorageTypeTable = sap.ui.getCore().byId("MatWarehouseStorageTypeTable");
		var oStorageTypeItemTemp = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.getStorageTypeTableTemplate("",
			oStorageTypeModel, this.oS3Instance, aResult.ChangeData.results[0].EntityAction);
		vStorageTypeTable.setModel(oStorageTypeModel);
		vStorageTypeTable.bindItems('/results', oStorageTypeItemTemp, '', '');

	},
	// On click event of previous button	
	onClickPrevious: function() {
		this.loadWarehouseDetailLayout();
		this.RowId--;
		this.setRowIdAndWarehouse();
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
			.setMatIteratorVisibility(this.sRowId, this.getView().byId("MatWarehouseBtnPrev"), this.getView().byId("MatWarehouseBtnNext"), this.vTotalWarehouses);
		this.setWarehouseHeader();
		this.bindWarehouseDetailData();
	},

	// On click event of next button        
	onClickNext: function() {
		this.loadWarehouseDetailLayout();
		this.RowId++;
		this.setRowIdAndWarehouse();
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
			.setMatIteratorVisibility(this.sRowId, this.getView().byId("MatWarehouseBtnPrev"), this.getView().byId("MatWarehouseBtnNext"), this.vTotalWarehouses);
		this.setWarehouseHeader();
		this.bindWarehouseDetailData();
	},
	//**************************************************************************************************************************************************

	//bind warehouse changed data 
	bindWarehouseChangedDetailData: function() {
		var oWarehouseDetailModel = new sap.ui.model.json.JSONModel();
		var vWHElement = sap.ui.getCore().byId("matWarehouseDataForm");
		var whData = this.aWhChangedDetailData.results;
		var whChData;
		for (var i = 0; i < whData.length; i++) {
			whChData = whData[i].ChangeData.results;
			if (whData[i].LGNUM === this.vWarehouseNum) {
				var vWarehouseTxt = whData[i].LGNUM__TXT;
				this.setWarehouseObjHeader(this.vWarehouseNum, vWarehouseTxt, this.vMatkeyDesc);
				this.getView().byId("MatWarehouseSubHeader").setText("");
				if (whChData[0].EntityAction !== this.vCreated) {
					this.setBoldWarehouseData(whData[i]);
				}
				if (whData[i].L2SKR === "") {
					whData[i].L2SKR = whData[i].L2SKR__TXT;
					whData[i].L2SKR__TXT = "";
				}
				if (whData[i].VOMEM === "") {
					whData[i].VOMEM = whData[i].VOMEM__TXT;
					whData[i].VOMEM__TXT = "";
				}
				this.bindStorageTypeData(whData[i]);
				oWarehouseDetailModel.setData(whData[i]);
				vWHElement.setModel(oWarehouseDetailModel);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.hideWarehouseSection();
				return;
			} //end if
		} // end for i
	},
	//*****************************************************************************************************************************************************
	//bind Storage Type Data For Change Scenario
	bindStorageTypeChangedDetailData: function() {
		var oStorageTypeDetailModel = new sap.ui.model.json.JSONModel();
		var vSTDetailElement = sap.ui.getCore().byId("matStorageTypeChangeForm");
		var whData = this.aWhChangedDetailData.results;
		var stChangeData;
		for (var i = 0; i < whData.length; i++) {
			stChangeData = whData[i].MLGNSTOR2MLGTSTORRel.results;
			for (var j = 0; j < stChangeData.length; j++) {
				if (stChangeData[j].LGNUM === this.vSWarehouseNum &&
					stChangeData[j].LGTYP === this.vStorageType) {
					if (stChangeData[j].ChangeData.results[0].EntityAction !== "C") {
						this.setBoldWarehouseData(stChangeData[j]);
					}
					oStorageTypeDetailModel.setData(stChangeData[j]);
					vSTDetailElement.setModel(oStorageTypeDetailModel);
					return;
				} //end if
			} //end j
		} // end for i
	}

	//*********************************************************************************************************************************************************
});