/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange = {

	oS3ControllerChng: "",
	oMatPlantChangeTable: "",
	oMatPlantChangePanelData: "",
	oMatValuationChangePanelData: "",
	vLblPlantValuationCurrency:"",
	aValChangedData: "",
	vNotMaint: "",
	vDeleted: "",
	vAdded: "",
	vValFlag:0,
	vMaterial: "",
	vLblPlant: "",
	vLblStrg: "",
	vLblInsp: "",
	vLblMrpAr: "",
	vLblPrdVer: "",
	vOldValChng: "",
	vNewValChng: "",
	oChangePlants: "",
	vNoDataTxt: "",
	oPlantChngTable: "",
	oChngItemTemp: "",
	vCreated: "C",
	vUpdated: "U",
	vEDeleted: "D",
	vEntDltd: "",
	aPlantChngd: {
		oDataChngd: []
	},
	oS3Controller: "",
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	// Load Change layout with all the panels and attach expand event to the panels
	initializePlantChangetabl: function(oS3Controller) {
		this.oS3ControllerChng = oS3Controller;
		this.vNoDataTxt = this.i18n.getText("Nodata");
		this.vNotMaint = "(" + this.i18n.getText("PC_NOT_MAIN") + ")";
		this.vDeleted = "(" + this.i18n.getText("PC_DELETED") + ")";
		this.vAdded = this.i18n.getText("PC_ADDED");
		this.vEntDltd = this.i18n.getText("PC_DELETED");
		this.vLblPlant = this.i18n.getText("plant");
		this.vLblStrg = this.i18n.getText("StorageLoctn") + ", " + this.vLblPlant;
		this.vLblInsp = this.i18n.getText("Mat_InspctnType") + ", " + this.vLblPlant;
		this.vLblMrpAr = this.i18n.getText("Mat_MRPArea") + ", " + this.vLblPlant;
		this.vLblPrdVer = this.i18n.getText("Mat_Prd_Ver") + ", " + this.vLblPlant;
		if (sap.ui.getCore().byId("matCreatePlantDataLayout") !== undefined) {
			sap.ui.getCore().byId("matCreatePlantDataLayout").destroy();
		}
	},

	// Display Plant general data change Log
	displayPlantChangeData: function(aResult, oView) {
		var vPlant, vPlantTxt, ChangeKey, sAttr, vOldVal, vOldValTxt, vNewVal, vNewValTxt, vAttrDsc, oPlantChangeItems;
		var oItemTemp = this.createChngLogTblTemplt(); // Get the item template
		oItemTemp.attachPress({
			Entity: 'general',
			name: 'matPlantPnlChngDetail'
		}, oView.navtoSubDetail, oView);

		var aPlantData = {
			oDataItems: []
		};
		this.aPlantChngd = {
			oDataChngd: []
		};
		this.vMaterial = aResult.MATERIAL;
		var aGenRslt = aResult.MATERIAL2MARCRel.results;
		for (var i = 0; i < aGenRslt.length; i++) {
			vPlant = aGenRslt[i].WERKS;
			vPlantTxt = aGenRslt[i].WERKS__TXT;
			ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
			if (aGenRslt[i].ChangeData.results.length > 0) {
				if (aGenRslt[i].ChangeData.results[0].EntityAction === this.vCreated) { // If Plant is created
					oPlantChangeItems = this.setChngBindingItms(ChangeKey, "", this.vAdded, "", vPlant);
					aPlantData.oDataItems.push(oPlantChangeItems);

				} else if (aGenRslt[i].ChangeData.results[0].EntityAction === this.vUpdated) { // if Plant is changed
					this.oChangePlants = {
						"vChngdPlant": vPlant
					};
					this.aPlantChngd.oDataChngd.push(this.oChangePlants); // Dataset of Changed Plants
					for (var j = 0; j < aGenRslt[i].ChangeData.results.length; j++) { // Check if Change data present for plant
						sAttr = aGenRslt[i].ChangeData.results[j].Attribute;
						vOldVal = aGenRslt[i].ChangeData.results[j].OldValue;
						vOldValTxt = aGenRslt[i].ChangeData.results[j].OldValueText;
						vNewVal = aGenRslt[i].ChangeData.results[j].NewValue;
						vNewValTxt = aGenRslt[i].ChangeData.results[j].NewValueText;
						vAttrDsc = aGenRslt[i].ChangeData.results[j].AttributeDesc;
						if (sAttr === 'MMSTA' || sAttr === 'XCHPF' || sAttr === 'LOGGR' || sAttr === 'MMSTA' ||
							sAttr === 'PRCMARCBA' || sAttr === 'SERNP' || sAttr === 'AUFMRPFC' || sAttr === 'PERIV' ||
							sAttr === 'MTVFP' || sAttr === 'MFRGR' || sAttr === 'LADGR' || sAttr === 'CASMARCFT' ||
							sAttr === 'STEMARCFT' || sAttr === 'GPNMARCFT' || sAttr === 'HERKL' || sAttr === 'HERMARCFT' ||
							sAttr === 'MTVER' || sAttr === 'STAMARCFT' || sAttr === 'EXPME' || sAttr === 'MOGMARCFT' ||
							sAttr === 'MOWMARCFT' || sAttr === 'PRENO' || sAttr === 'PREFE' || sAttr === 'PRENE' ||
							sAttr === 'EKGRP' || sAttr === 'TAIPURTAX') {
							this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							if(sAttr === 'MTVFP'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("Mat_Avl_ChkGrp");
							} else if(sAttr === 'PREFE'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("Mat_Pref_Ind");
							}
							oPlantChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
							aPlantData.oDataItems.push(oPlantChangeItems);
						} else if (sAttr === 'KZDKZ' || sAttr === 'XMCNG' || sAttr === 'ITARK' || // Handling Checkbox/Indicators
							sAttr === 'KAUTB' || sAttr === 'KORDB' || sAttr === 'INSMK' ||
							sAttr === 'KZKRI') {
							this.getCheckBoxValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							if(sAttr === 'KAUTB'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("Mat_AutoPO_Alwd");
							} else if(sAttr === 'KORDB'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("Mat_Src_Rqrmnt");
							}
							oPlantChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
							aPlantData.oDataItems.push(oPlantChangeItems);
						} else if (sAttr === 'VBAMG') { // Handling Quantity Fields
						var vUomChData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getUomChangedData();
						if (vUomChData !== "") {
							vOldValTxt = vUomChData.OldValue;
						}
							this.getQtyWithUnit(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							oPlantChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
							aPlantData.oDataItems.push(oPlantChangeItems);
						} else if (sAttr === 'VBEAZ' || sAttr === 'VRVEZ') { // handling 0's
							this.getValueZeroes(vOldVal, vNewVal);
							oPlantChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
							aPlantData.oDataItems.push(oPlantChangeItems);
						} else if (sAttr === 'MMSTD' || sAttr === 'PREND' || sAttr === 'PRENG') { // Handling Date
							this.getDate(vOldVal, vNewVal);
							oPlantChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
							aPlantData.oDataItems.push(oPlantChangeItems);
						} else if (sAttr === 'WZEIT') { // Handling 0's, Decimal and Days
							this.getTextDays(vOldVal, vNewVal);
							oPlantChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
							aPlantData.oDataItems.push(oPlantChangeItems);
						} else if (sAttr === 'ATPKZ' || sAttr === 'KZPSP' || sAttr === 'PRENC' || sAttr === 'PERMRPFC') { // Domain Specific values
							this.getDomSpcValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							oPlantChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
							aPlantData.oDataItems.push(oPlantChangeItems);
						}
					}
					var vBaseUomChData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getUomChangedData();
					if (vBaseUomChData !== "") {
						this.getTextOnly(vBaseUomChData.OldValue, vBaseUomChData.NewValue);
						oPlantChangeItems = this.setChngBindingItms(ChangeKey, vBaseUomChData.AttributeDesc, this.vNewValChng, this.vOldValChng, vPlant);
						aPlantData.oDataItems.push(oPlantChangeItems);
					}
				}
			} else {		// Plant exists but no changes
				this.oChangePlants = {
						"vChngdPlant": vPlant
					};
				this.aPlantChngd.oDataChngd.push(this.oChangePlants); // dataset of changed plants
			}
		}
		// Material Tax Indicator	
		for (var p = 0; p < this.aPlantChngd.oDataChngd.length; p++) { // loop at changed plants only to check for changed Material tax indicator
			for (var i = 0; i < aResult.MATERIAL2MARCBASICRel.results.length; i++) {
				vPlant = aResult.MATERIAL2MARCBASICRel.results[i].WERKS;
				if (vPlant === this.aPlantChngd.oDataChngd[p].vChngdPlant && // check if plant is changed and changed data exist
					aResult.MATERIAL2MARCBASICRel.results[i].MARCBASIC2MLANPURCHRel.results.length > 0 &&
					aResult.MATERIAL2MARCBASICRel.results[i].MARCBASIC2MLANPURCHRel.results[0].ChangeData.results[0] !== undefined) {
					vPlantTxt = aResult.MATERIAL2MARCBASICRel.results[i].WERKS__TXT;
					ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
					for (var j = 0; j < aResult.MATERIAL2MARCBASICRel.results[i].MARCBASIC2MLANPURCHRel.results[0].ChangeData.results.length; j++) {
						sAttr = aResult.MATERIAL2MARCBASICRel.results[i].MARCBASIC2MLANPURCHRel.results[0].ChangeData.results[j].Attribute;
						if (sAttr === 'TAIPURTAX') { // Material tax indicator with key and description
							vOldVal = aResult.MATERIAL2MARCBASICRel.results[i].MARCBASIC2MLANPURCHRel.results[0].ChangeData.results[j].OldValue;
							vOldValTxt = aResult.MATERIAL2MARCBASICRel.results[i].MARCBASIC2MLANPURCHRel.results[0].ChangeData.results[j].OldValueText;
							vNewVal = aResult.MATERIAL2MARCBASICRel.results[i].MARCBASIC2MLANPURCHRel.results[0].ChangeData.results[j].NewValue;
							vNewValTxt = aResult.MATERIAL2MARCBASICRel.results[i].MARCBASIC2MLANPURCHRel.results[0].ChangeData.results[j].NewValueText;
							vAttrDsc = aResult.MATERIAL2MARCBASICRel.results[i].MARCBASIC2MLANPURCHRel.results[0].ChangeData.results[j].AttributeDesc;
							this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							oPlantChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
							aPlantData.oDataItems.push(oPlantChangeItems);
						}
					}
				}
			}
		}
		if (aPlantData.oDataItems.length > 0) {
			sap.ui.getCore().byId("matChangePlantDataLayout").removeAllContent();
			this.oMatPlantChangeTable = "";
			this.oMatPlantChangeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matChangePlantDataLayout").addContent(this.oMatPlantChangeTable);
			this.oMatPlantChangeTable.setGrowing(true);
			this.initializePlantChangepanel(oView);
			var oPlantModel = new sap.ui.model.json.JSONModel();
			oPlantModel.setData(aPlantData);
			this.oMatPlantChangeTable.setModel(oPlantModel);
			var oPlantSorter = new sap.ui.model.Sorter('Plant'); // Sort based on Plant
			this.oMatPlantChangeTable.bindItems('/oDataItems', oItemTemp, oPlantSorter, '');
		} else {
			sap.ui.getCore().byId("matChangePlantDataLayout").removeAllContent();
			this.initializePlantChangepanel(oView);
		}
	},
	getChangedPlant: function() {
		return	this.aPlantChngd;
	},
	initializePlantChangepanel: function(oS3Controller) {
		this.oMatPlantChangePanelData = "";
		this.oMatPlantChangePanelData = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialPlantChange', this);
		sap.ui.getCore().byId("matChangePlantDataLayout").addContent(this.oMatPlantChangePanelData);
		this.checkPanelVisibleFlag();
		if (sap.ui.getCore().byId("MatReqPlanningPanelChng") !== undefined) {
			sap.ui.getCore().byId("MatReqPlanningPanelChng").attachExpand("", oS3Controller.onPanelExpand, oS3Controller);
		}
		if (sap.ui.getCore().byId("MatForecastingPanelChng") !== undefined) {
			sap.ui.getCore().byId("MatForecastingPanelChng").attachExpand("", oS3Controller.onPanelExpand, oS3Controller);
		}
		if (sap.ui.getCore().byId("MatQltyMngmntPanelChng") !== undefined) {
			sap.ui.getCore().byId("MatQltyMngmntPanelChng").attachExpand("", oS3Controller.onPanelExpand, oS3Controller);
		}
		if (sap.ui.getCore().byId("MatWorkSchdlngPanelChng") !== undefined) {
			sap.ui.getCore().byId("MatWorkSchdlngPanelChng").attachExpand("", oS3Controller.onPanelExpand, oS3Controller);
		}
		if (sap.ui.getCore().byId("MatStrgCstngPanelChng") !== undefined) {
			sap.ui.getCore().byId("MatStrgCstngPanelChng").attachExpand("", oS3Controller.onPanelExpand, oS3Controller);
		}
		if (sap.ui.getCore().byId("MatValuationPanelChng") !== undefined) {
			sap.ui.getCore().byId("MatValuationPanelChng").attachExpand("", oS3Controller.onPanelExpand, oS3Controller);
		}
	},

	checkPanelVisibleFlag: function() {
		//CHECKING FOR MRP panel HIDE/UNHIDE
		var vMrpVisbleFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('D');
		this.destroyPanel(vMrpVisbleFlag, "MatReqPlanningPanelChng");
		//CHECKING FOR Forecasting panel HIDE/UNHIDE
		var vFrcstVisbleFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('P');
		this.destroyPanel(vFrcstVisbleFlag, "MatForecastingPanelChng");
		//CHECKING FOR QM panel HIDE/UNHIDE
		var vQMVisbleFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('Q');
		this.destroyPanel(vQMVisbleFlag, "MatQltyMngmntPanelChng");
		//CHECKING FOR Work Scheduling panel HIDE/UNHIDE
		var vWsVisbleFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('A');
		this.destroyPanel(vWsVisbleFlag, "MatWorkSchdlngPanelChng");
	},

	destroyPanel: function(vPanelFlag, vPanelId) {
		if (vPanelFlag === false && sap.ui.getCore().byId(vPanelId) !== undefined) {
			sap.ui.getCore().byId(vPanelId).destroy();
		}
	},
	// Set Change data log to panels in s3
	initializePanelData: function(aPanelResult, vPanelid, oView) {
		var vPlant, vPlantTxt, ChangeKey, sAttr, oPlantPnlChangeItems, vOldVal, vNewVal, vNewValTxt, vOldValTxt, vAttrDsc;
		var aPlantPanelChngData = {
			oPlantPnlData: []
		};
		switch (vPanelid) {
			case "MatReqPlanningPanelChng": // MRP Panel Change
				var oMrpChangeTable;
				if (oMrpChangeTable === undefined) {
					oMrpChangeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
				}
				this.getPlantMrpChangelog(aPanelResult, vPanelid, oView, oMrpChangeTable);
				break;
			case "MatForecastingPanelChng": // Forecasting Panel Change
				var oFrcstChangeTable;
				if (oFrcstChangeTable === undefined) {
					oFrcstChangeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
				}
				var aFrcstRslt = aPanelResult.MATERIAL2MARCFRRel.results;
				for (var p = 0; p < this.aPlantChngd.oDataChngd.length; p++) { // loop at changed plants dataset
					for (var i = 0; i < aFrcstRslt.length; i++) { // loop at MARCFR entity for the no. of plants
						vPlant = aFrcstRslt[i].WERKS;
						if (vPlant === this.aPlantChngd.oDataChngd[p].vChngdPlant) { // check if the plant is changed or not
							if (aFrcstRslt[i].ChangeData.results[0] !== undefined) { // check change data exist for plant
								vPlantTxt = aFrcstRslt[i].WERKS__TXT;
								ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
								for (var j = 0; j < aFrcstRslt[i].ChangeData.results.length; j++) { // loop at changedata to create the change log
									sAttr = aFrcstRslt[i].ChangeData.results[j].Attribute;
									vOldVal = aFrcstRslt[i].ChangeData.results[j].OldValue;
									vOldValTxt = aFrcstRslt[i].ChangeData.results[j].OldValueText;
									vNewVal = aFrcstRslt[i].ChangeData.results[j].NewValue;
									vNewValTxt = aFrcstRslt[i].ChangeData.results[j].NewValueText;
									vAttrDsc = aFrcstRslt[i].ChangeData.results[j].AttributeDesc;
									if (sAttr === 'VRBMT' || sAttr === 'VRBWK' || sAttr === 'PRMOD' ||
										sAttr === 'KZINI' || sAttr === 'MODAW' || sAttr === 'OPGRA' || sAttr === 'MODAV') { // Get Key and desc.
										this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
										oPlantPnlChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'AUTRU' || sAttr === 'KZKFK' || sAttr === 'KZPAR') { // Handling Checkbox
										this.getCheckBoxValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
										oPlantPnlChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'VRBFK' || sAttr === 'PERAN' || sAttr === 'PERIN' || sAttr === 'ANZPR' || sAttr === 'FIMON' ||
										sAttr === 'PERIO' || sAttr === 'SIGGR' || sAttr === 'GEWMARCPA' || sAttr === 'ALPHA' || sAttr === 'BETA1' ||
										sAttr === 'GAMMA' || sAttr === 'DELTA') { // Handling 0's
										this.getValueZeroes(vOldVal, vNewVal);
										oPlantPnlChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'VRBDT' || sAttr === 'PRDAT') { // Handling Date
										this.getDate(vOldVal, vNewVal);
										oPlantPnlChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									}
								}
							}
						}
					}
				}
				this.setChangedDataPanel(aPlantPanelChngData, vPanelid, "MatForecastingPanel", oView, "Plant", oFrcstChangeTable); // Set the model to change table
				break;
				// } 
			case "MatQltyMngmntPanelChng": // QM Panel change
				var oQmChangeTable, vPlantSort, vInspTypeLngth, vInsTyp, vInsTypTxt;
				if (oQmChangeTable === undefined) {
					oQmChangeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
				}
				var aQMRslt = aPanelResult.MATERIAL2MARCQTMNGRel.results;
				var aPlants = aPanelResult.MATERIAL2MARCBASICRel.results;
				for (var i = 0; i < aQMRslt.length; i++) { // loop at MARCQTMNG entity for the no. of plants
					if (aQMRslt[i].ChangeData.results[0] !== undefined && // check if change data exists
						aQMRslt[i].ChangeData.results[0].EntityAction === this.vUpdated) { // check if plant is changed
						vPlant = aQMRslt[i].WERKS;
						vPlantTxt = aQMRslt[i].WERKS__TXT;
						ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
						vPlantSort = vPlant + "a" + "00000000";
						for (var j = 0; j < aQMRslt[i].ChangeData.results.length; j++) { // loop at changedata and create log
							sAttr = aQMRslt[i].ChangeData.results[j].Attribute;
							vOldVal = aQMRslt[i].ChangeData.results[j].OldValue;
							vOldValTxt = aQMRslt[i].ChangeData.results[j].OldValueText;
							vNewVal = aQMRslt[i].ChangeData.results[j].NewValue;
							vNewValTxt = aQMRslt[i].ChangeData.results[j].NewValueText;
							vAttrDsc = aQMRslt[i].ChangeData.results[j].AttributeDesc;
							if (sAttr === 'QMATA' || sAttr === 'QZGTP' || sAttr === 'QSSYS' || sAttr === 'SSQSS') {
								this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
								if(sAttr === 'QMATA'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("AuthrztnGrp_ActInQM");
								} else if(sAttr === 'QSSYS'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("RqrdQMSys_Vndr");
								}  
								oPlantPnlChangeItems = this.setQMBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vInsTyp, vPlantSort,
									this.vLblPlant);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							} else if (sAttr === 'KZDKZ') { // handling Checkbox
								this.getCheckBoxValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
								oPlantPnlChangeItems = this.setQMBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vInsTyp, vPlantSort,
									this.vLblPlant);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							} else if (sAttr === 'PRFRQ') { // handling 0's
								this.getValueZeroes(vOldVal, vNewVal);
								oPlantPnlChangeItems = this.setQMBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vInsTyp, vPlantSort,
									this.vLblPlant);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							}
						}
					}
				}
				/// INSPECTION SETUP
				for (var l = 0; l < this.aPlantChngd.oDataChngd.length; l++) { // loop at changed plants dataset
					for (var i = 0; i < aPlants.length; i++) { // loop for the no of plants
						vPlant = aPlants[i].WERKS;
						if (vPlant === this.aPlantChngd.oDataChngd[l].vChngdPlant) { // check if the plant is changed
							vPlantTxt = aPlants[i].WERKS__TXT;
							vPlantTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
							for (var k = 0; k < aPlants[i].MARCBASIC2QMATBASICRel.results.length; k++) { // loop for the no of Inspection Type
								vInsTyp = aPlants[i].MARCBASIC2QMATBASICRel.results[k].ART;
								vInsTypTxt = aPlants[i].MARCBASIC2QMATBASICRel.results[k].ART__TXT;
								vInsTypTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vInsTyp, vInsTypTxt);
								ChangeKey = vInsTypTxt + ", " + vPlantTxt;
								vInspTypeLngth = ("0000000" + vInsTyp).slice(-8);
								vPlantSort = vPlant + "b" + vInspTypeLngth;
								if (aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results[0] !==
									undefined) { // if change data for Inspection Type exist
									if (aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results[0].EntityAction ===
										this.vUpdated) { // if Inspection Type is changed
										for (var j = 0; j < aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results
											.length; j++) { // loop on changedata to get the log
											sAttr = aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results[j].Attribute;
											vOldVal = aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results[j].OldValue;
											vOldValTxt = aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results[j]
												.OldValueText;
											vNewVal = aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results[j].NewValue;
											vNewValTxt = aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results[j]
												.NewValueText;
											vAttrDsc = aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results[j].AttributeDesc;
											if (sAttr === 'APA') {
											this.getCheckBoxValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
											oPlantPnlChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vInsTyp,
													vPlantSort, this.vLblInsp);
											aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
											} else if (sAttr === 'STICHPRVE' || sAttr === 'DYNREGEL' || sAttr === 'QKZVERF' || sAttr === 'AUFNR_CO') {
												this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
												oPlantPnlChangeItems = this.setQMBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vInsTyp,
													vPlantSort, this.vLblInsp);
												aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
											} else if (sAttr === 'AKTIV' || sAttr === 'INSMK_Q' || sAttr === 'AFR' || sAttr === 'SPEZUEBER' || sAttr === 'PPL' ||
												sAttr === 'MS_FLAG' || sAttr === 'CONF' || sAttr === 'APP' || sAttr === 'MER' ||
												sAttr === 'HPZ' || sAttr === 'MST' || sAttr === 'MPB' || sAttr === 'DYN' ||
												sAttr === 'AVE' || sAttr === 'EIN' || sAttr === 'KZPRFKOST') { // handling Checkbox
												this.getCheckBoxDefValue(vOldVal, vNewVal);
												oPlantPnlChangeItems = this.setQMBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vInsTyp,
													vPlantSort, this.vLblInsp);
												aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
											} else if (sAttr === 'SPROZ' || sAttr === 'MPDAU' || sAttr === 'QPMAT') { // handling 0's
												this.getValueZeroes(vOldVal, vNewVal);
												oPlantPnlChangeItems = this.setQMBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vInsTyp,
													vPlantSort, this.vLblInsp);
												aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
											} else if (sAttr === 'CHG') { // Domain Specific values
												this.getDomSpcValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
												oPlantPnlChangeItems = this.setQMBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vInsTyp,
													vPlantSort, this.vLblInsp);
												aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
											}
										}
									} else if (aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results[0].EntityAction ===
										this.vCreated) { // if Inspection Type is cretaed
										oPlantPnlChangeItems = this.setQMBindingItms(ChangeKey, "", this.vAdded, "", vPlant, vInsTyp, vPlantSort, this.vLblInsp);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (aPlants[i].MARCBASIC2QMATBASICRel.results[k].ChangeData.results[0].EntityAction ===
										this.vEDeleted) { // if Inspection Type is deleted
										oPlantPnlChangeItems = this.setQMBindingItms(ChangeKey, "", this.vEntDltd, "", vPlant, vInsTyp, vPlantSort, this.vLblInsp);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									}
								}
							}
						}
					}
				}
				this.setChangedDataPanel(aPlantPanelChngData, vPanelid, "MatQltyMngmntPanel", oView, "PlantSort", oQmChangeTable); // Set the model to change table
				break;
				// } 
			case "MatWorkSchdlngPanelChng": // Work scheduling Panel change
				var oWsChangeTable;
				if (oWsChangeTable === undefined) {
					oWsChangeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
				}
				var aWsRslt = aPanelResult.MATERIAL2MARCWRKSDRel.results;
				for (var i = 0; i < aWsRslt.length; i++) { // loop at MARCWRKSD entity for the no. of plants
					if (aWsRslt[i].ChangeData.results[0] !== undefined && // check if change data exists
						aWsRslt[i].ChangeData.results[0].EntityAction === this.vUpdated) { // check if plant is changed
						vPlant = aWsRslt[i].WERKS;
						vPlantTxt = aWsRslt[i].WERKS__TXT;
						ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
						for (var j = 0; j < aWsRslt[i].ChangeData.results.length; j++) { // loop at changedata and create log
							sAttr = aWsRslt[i].ChangeData.results[j].Attribute;
							vOldVal = aWsRslt[i].ChangeData.results[j].OldValue;
							vOldValTxt = aWsRslt[i].ChangeData.results[j].OldValueText;
							vNewVal = aWsRslt[i].ChangeData.results[j].NewValue;
							vNewValTxt = aWsRslt[i].ChangeData.results[j].NewValueText;
							vAttrDsc = aWsRslt[i].ChangeData.results[j].AttributeDesc;
							if (sAttr === 'FEVMARCWR' || sAttr === 'FRTME' || sAttr === 'MATGR' || sAttr === 'OCMPF' || sAttr === 'SFCMARCWR') {
								this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
								oPlantPnlChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							} else if (sAttr === 'KZPRO' || sAttr === 'UEETK') { // Handling Checkbox
								this.getCheckBoxValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
								oPlantPnlChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							} else if (sAttr === 'BASMG') { // Handling Quantity
							var vUomChData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getUomChangedData();
							if (vUomChData !== "") {
								vOldValTxt = vUomChData.OldValue;
							}
								this.getQtyWithUnit(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
								oPlantPnlChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							} else if (sAttr === 'UEETO' || sAttr === 'UNETO' || sAttr === 'DZEIT' || sAttr === 'BEARZ' || sAttr === 'BASMG' ||
								sAttr === 'RUEZT' || sAttr === 'TRANZ') { // Handling 0's
								this.getValueZeroes(vOldVal, vNewVal);
								oPlantPnlChangeItems = this.setChngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							}
						}
					var vBaseUomChData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getUomChangedData();
					if (vBaseUomChData !== "") {
						this.getTextOnly(vBaseUomChData.OldValue, vBaseUomChData.NewValue);
						oPlantPnlChangeItems = this.setChngBindingItms(ChangeKey, vBaseUomChData.AttributeDesc, this.vNewValChng, this.vOldValChng, vPlant);
						aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
					}
					}
				}
				this.setChangedDataPanel(aPlantPanelChngData, vPanelid, "MatWorkSchdlngPanel", oView, "Plant", oWsChangeTable); // Set the model to change log table
				break;
			case "MatStrgCstngPanelChng": // Costing and storage Panel change
				var oCsChangeTable;
				if (oCsChangeTable === undefined) {
					oCsChangeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
				}
				this.getCstngStrgChngLog(aPanelResult, vPanelid, oView, oCsChangeTable);
				break;
			case "MatValuationPanelChng": // Valuation Panel change
				var plant = this.i18n.getText("plant");
				var valtype = this.i18n.getText("Mat_Val_Type");
				var vCurrency=this.i18n.getText("Mat_Val_Cur");
				this.vLblPlantValuation = valtype + ", " + plant;
				this.vLblPlantValuationCurrency= vCurrency+", "+ this.vLblPlantValuation ;
				sap.ui.getCore().byId("MatValuationPanelChng").destroyContent();
				this.oMatValuationChangePanelData = "";
				this.oMatValuationChangePanelData = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
				sap.ui.getCore().byId("MatValuationPanelChng").addContent(
					this.oMatValuationChangePanelData);
				this.oMatValuationChangePanelData.setGrowing(true);
				this.getValuationChngLog(aPanelResult, vPanelid, oView);
				break;
		}
	//controller hook defined in S3 controller to handle extra panel data with importing param:	aPanelResult, vPanelid, oView
		this.oS3ControllerChng.matHookModifyPlantChngPanelData(vPanelid, oView, aPanelResult);
	},

	getValuationChngLog: function(aPanelRslt, vPnlId, oS3View) {
		var vPlant, vPlantTxt, ChangeKey, sAttr, oPlantPnlChangeItems, vOldVal, vNewVal, vNewValTxt, vOldValTxt, vAttrDsc, vEntityAction,vBwtar;
		var aValuationPanelChngData = {
			results: []
		};
		var aValuationRslt = aPanelRslt.data.__batchResponses[0].data.MATERIAL2MARCBASICRel;
		this.aValChangedData = aValuationRslt;
		for (var p = 0; p < this.aPlantChngd.oDataChngd.length; p++) { // loop at changed plants dataset
		for (var i = 0; i < aValuationRslt.results.length; i++) {
			vPlant = aValuationRslt.results[i].WERKS;
				if (vPlant === this.aPlantChngd.oDataChngd[p].vChngdPlant) { 
			// changed data for costing for each plant
			for (var j = 0; j < aValuationRslt.results[i].MARCBASIC2MBEWCSTNGRel.results.length; j++) {
			
				vPlantTxt = aValuationRslt.results[i].WERKS__TXT;
				ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
				for (var k = 0; k < aValuationRslt.results[i].MARCBASIC2MBEWCSTNGRel.results[j].ChangeData.results.length; k++) { // loop at changedata and create log
					sAttr = aValuationRslt.results[i].MARCBASIC2MBEWCSTNGRel.results[j].ChangeData.results[k].Attribute;
					vOldVal = aValuationRslt.results[i].MARCBASIC2MBEWCSTNGRel.results[j].ChangeData.results[k].OldValue;
					vOldValTxt = aValuationRslt.results[i].MARCBASIC2MBEWCSTNGRel.results[j].ChangeData.results[k].OldValueText;
					vNewVal = aValuationRslt.results[i].MARCBASIC2MBEWCSTNGRel.results[j].ChangeData.results[k].NewValue;
					vNewValTxt = aValuationRslt.results[i].MARCBASIC2MBEWCSTNGRel.results[j].ChangeData.results[k].NewValueText;
					vAttrDsc = aValuationRslt.results[i].MARCBASIC2MBEWCSTNGRel.results[j].ChangeData.results[k].AttributeDesc;
					if (sAttr === 'HRKFT' || sAttr === 'KOSCSTNG' || sAttr === 'EKALR') {
						this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
						if(sAttr === 'EKALR'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("Mat_Cost_Quan_Str");
						} 
						oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlant,
							"Costing", aValuationRslt.results[i].WERKS__TXT);
						aValuationPanelChngData.results.push(oPlantPnlChangeItems);
					} 
					else if (sAttr === 'HKMAT') {
						this.getOriginDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
						oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlant,
							"Costing", aValuationRslt.results[i].WERKS__TXT);
						aValuationPanelChngData.results.push(oPlantPnlChangeItems);
					}
				}
			}
			//for accounting and general data
			for (var j = 0; j < aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results.length; j++) {
				// loop at MARCSTORE entity for the no. of plants
				var vFlag = 0;
				vPlant = aValuationRslt.results[i].WERKS;
				vPlantTxt = aValuationRslt.results[i].WERKS__TXT;
				var sPlant = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
		//once create action of the key valuationtype will get no need for looping further
				for (var l = 0; l < aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results.length; l++) {
					if(this.vValFlag===0)
			{
					   	sAttr = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results[l].Attribute;
					vEntityAction = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results[l].EntityAction;
					if (sAttr === "BWTAR") {
						vFlag = this.getNewValue(vEntityAction);
					}
					if (vFlag === 1 && sAttr === "BWTAR") {
					
						if (aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR === "") {
					        vBwtar =this.i18n.getText("Valuation_Header");
							aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR = this.i18n.getText("Valuation_Header");
						}
						else
						{
						vBwtar=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR,this.i18n.getText("Mat_Val_Split"));
						}
						ChangeKey = vBwtar + ", " + sPlant;
						//once create action of the key valuationtype will get no need for looping further
						this.vValFlag=1;
						oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, "", this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlantValuation,
							aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR, vPlantTxt, this.i18n.getText("Mat_Val_Split"));
						aValuationPanelChngData.results.push(oPlantPnlChangeItems);
					}
				}
			}
			//again resetting it for another valuation type
			this.vValFlag=0;
				if (vFlag === 0) {
					for (var k = 0; k < aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results.length; k++) { // loop at changedata and create log
						sAttr = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results[k].Attribute;
						vOldVal = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results[k].OldValue;
						vOldValTxt = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results[k].OldValueText;
						vNewVal = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results[k].NewValue;
						vNewValTxt = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results[k].NewValueText;
						vAttrDsc = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results[k].AttributeDesc;
					//if valuation type is null make it "header" else with valuation type and its description "split"
						if (aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR === "" || aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR===this.i18n.getText("Valuation_Header")) {
					        vBwtar =this.i18n.getText("Valuation_Header");
							aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR = this.i18n.getText("Valuation_Header");
						}
						else
						{
						vBwtar=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR,this.i18n.getText("Mat_Val_Split"));
						}
						ChangeKey = vBwtar + ", " + sPlant;
						vEntityAction = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWVALCTNGRel.ChangeData.results[k].EntityAction;
						if (sAttr === 'PEINH' || sAttr === 'EKLAS' || sAttr === 'QKLAS' || sAttr === 'BWTTY' || sAttr ===
							'BKLAS' || sAttr === 'MBEWMLMAA' || sAttr === 'MBEWMLAST' || sAttr ===
							'MYPACTNG'  ) {

							this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlantValuation,
								aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR, vPlantTxt, this.i18n.getText("Mat_Val_Split"));
							aValuationPanelChngData.results.push(oPlantPnlChangeItems);

						} else if (sAttr === 'VJBWH' || sAttr === 'BWPH1' || sAttr === 'BWPRH' || sAttr ===
							'VJBWS' || sAttr === 'BWPS1' || sAttr === 'BWPRS' || sAttr === 'BWPEI' || sAttr === 'ABWKZ' || sAttr ===
							'FZKPRS' || sAttr === 'FZPLPR' || sAttr === 'STPRS' || sAttr === 'VERPR' || sAttr === 'STPRV' || sAttr === 'FZPLP3' ||
							sAttr === 'FZPLP2' || sAttr === 'FZPLP1') { // handling 0's
							this.getValueZeroes(vOldVal, vNewVal);
							oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlantValuation,
								aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR, vPlantTxt, this.i18n.getText("Mat_Val_Split"));
							aValuationPanelChngData.results.push(oPlantPnlChangeItems);
						}
						else if (sAttr === 'FXLIFO') {///handling checkbox
						this.getOriginDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
						oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlantValuation,
								aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR, vPlantTxt, this.i18n.getText("Mat_Val_Split"));
							aValuationPanelChngData.results.push(oPlantPnlChangeItems);
					}
					else if (sAttr === 'FZKDAT' || sAttr === 'FZPLD1' || sAttr === 'FZPLD2' || sAttr === 'FZPLD3') { // Handling Date
							this.getDate(vOldVal, vNewVal);
							oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlantValuation,
								aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR, vPlantTxt, this.i18n.getText("Mat_Val_Split"));
							aValuationPanelChngData.results.push(oPlantPnlChangeItems);
					}
					}
				
		
					//price
				for (var k = 0; k < aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results.length; k++) { // loop at changedata and create log
					var vcurrKey = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].CURTP;
					for (var l= 0; l< aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].ChangeData.results.length; l++) { 
						var vsort = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].CURTP;
						sAttr = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].ChangeData.results[l].Attribute;
						vOldVal = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].ChangeData.results[l].OldValue;
						vOldValTxt = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].ChangeData.results[l].OldValueText;
						vNewVal = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].ChangeData.results[l].NewValue;
						vNewValTxt = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].ChangeData.results[l].NewValueText;
						vAttrDsc = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].ChangeData.results[l].AttributeDesc;
					//if valuation type is null make it "header" else with valuation type and its description "split"
						if (aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR === "" || aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR===this.i18n.getText("Valuation_Header")) {
					        vBwtar =this.i18n.getText("Valuation_Header");
							aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR = this.i18n.getText("Valuation_Header");
						}
						else
						{
						vBwtar=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR,this.i18n.getText("Mat_Val_Split"));
						}
						var curtp=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].CURTP,
						aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].CURTP__TXT);
						ChangeKey = curtp+", "+vBwtar + ", " + sPlant;
						vEntityAction = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLACRel.results[k].ChangeData.results[l].EntityAction;
						if (sAttr === 'PEINHMLAC' || sAttr === 'ZPRSDAT') {

							this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlantValuationCurrency,
								aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR, vPlantTxt, this.i18n.getText("Mat_Val_Split"),vsort);
					 	aValuationPanelChngData.results.push(oPlantPnlChangeItems);
						}
						 else if(sAttr === 'ZKPRS')
                         {
                         	this.getValueZeroes(vOldVal, vNewVal);
                         		oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlantValuationCurrency,
								aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR, vPlantTxt, this.i18n.getText("Mat_Val_Split"),vsort);
                        	aValuationPanelChngData.results.push(oPlantPnlChangeItems);
                         }
						
					
                                     //matledger.results.push(oPlantPnlChangeItems);
						
				}
				
				// check the period key
				//mat ledgre period
					for (var p = 0; p < aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results.length; p++) {
						if(vcurrKey===aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[p].CURTP)
						{// loop at changedata and create log
					for (var l= 0; l< aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[p].ChangeData.results.length; l++) { 
						var vsort = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[p].CURTP;
						sAttr = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[p].ChangeData.results[l].Attribute;
						vOldVal = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[p].ChangeData.results[l].OldValue;
						vOldValTxt = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[p].ChangeData.results[l].OldValueText;
						vNewVal = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[p].ChangeData.results[l].NewValue;
						vNewValTxt = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[p].ChangeData.results[l].NewValueText;
						vAttrDsc = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[p].ChangeData.results[l].AttributeDesc;
					//if valuation type is null make it "header" else with valuation type and its description "split"
						if (aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR === "" || aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR===this.i18n.getText("Valuation_Header")) {
					        vBwtar =this.i18n.getText("Valuation_Header");
							aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR = this.i18n.getText("Valuation_Header");
						}
						else
						{
						vBwtar=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR,this.i18n.getText("Mat_Val_Split"));
						}
						var curtp=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[k].CURTP,
						aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[k].CURTP__TXT);
						ChangeKey = curtp+", "+vBwtar + ", " + sPlant;
						vEntityAction = aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].MBEWVALUA2MBEWMLVALRel.results[p].ChangeData.results[l].EntityAction;
						if (sAttr === 'BDATJ' || sAttr === 'STPRSMLVL' || sAttr === 'PEINHMLVL'|| sAttr === 'VPRSVMLVL') {

							this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlantValuationCurrency,
								aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR, vPlantTxt, this.i18n.getText("Mat_Val_Split"),vsort);
						aValuationPanelChngData.results.push(oPlantPnlChangeItems);
						}
                         else if(sAttr === 'PVPRS')
                         {
                         	this.getValueZeroes(vOldVal, vNewVal);
                         		oPlantPnlChangeItems = this.setValuationBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, this.vLblPlantValuationCurrency,
								aValuationRslt.results[i].MARCBASIC2MBEWVALUARel.results[j].BWTAR, vPlantTxt, this.i18n.getText("Mat_Val_Split"),vsort);
                          	aValuationPanelChngData.results.push(oPlantPnlChangeItems);
                         }
                          //   matledger.results.push(oPlantPnlChangeItems);
                          
						
				}
				
					}
				
					}
					}
			
				}
		
				
				vFlag = 0;
			}
		}
	 }
}
		this.aValdetailchngddata = aValuationPanelChngData;
		if (aValuationPanelChngData.results.length > 0) {
			//binding costing data
			var oValCostingModel = new sap.ui.model.json.JSONModel();
			oValCostingModel.setData(aValuationPanelChngData);
			var oItemTempValuation = this.createChngLogTblTemplt();
			oItemTempValuation.attachPress({
				Entity: 'MatValuationPanel',
				name: 'matPlantPnlChngDetail'
			}, oS3View.navtoSubDetail, oS3View);
			this.oMatValuationChangePanelData.setModel(oValCostingModel);
			this.oMatValuationChangePanelData.bindItems('/results', oItemTempValuation, '', '');
		} else {
			var oPanelVal = sap.ui.getCore().byId("MatValuationPanelChng");
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(oPanelVal, this.vNoDataTxt);
		}
	},
	getValuationDetailData: function() {
		return this.aValdetailchngddata;
	},

	getCstngStrgChngLog: function(aCstngStrgRslt, vCstngStrgPnlId, oS3Cntrlr, oCsChngTbl) {
		var vStorageLoc, vPlantSort, aStrRslt, aCstngRslt, aStrgLocRslt;
		var vPlant, vPlantTxt, ChangeKey, sAttr, oPlantPnlChangeItems, vOldVal, vNewVal, vNewValTxt, vOldValTxt, vAttrDsc;
		var aPlantPanelChngData = {
			oPlantPnlData: []
		};
		aStrRslt = aCstngStrgRslt.MATERIAL2MARCSTORERel.results;
		aCstngRslt = aCstngStrgRslt.MATERIAL2MARCCSTNGRel.results;
		aStrgLocRslt = aCstngStrgRslt.MATERIAL2MARCBASICRel.results;
		for (var i = 0; i < aStrRslt.length; i++) { // loop at MARCSTORE entity for the no. of plants
			if (aStrRslt[i].ChangeData.results[0] !== undefined && // check if change data exists
				aStrRslt[i].ChangeData.results[0].EntityAction === this.vUpdated) { // check if plant is changed
				vPlant = aStrRslt[i].WERKS;
				vPlantTxt = aStrRslt[i].WERKS__TXT;
				ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
				vPlantSort = vPlant + "0000"; // ADDING 0000 TO PLANT FOR SORTING
				vStorageLoc = "";
				for (var j = 0; j < aStrRslt[i].ChangeData.results.length; j++) { // loop at changedata and create log
					sAttr = aStrRslt[i].ChangeData.results[j].Attribute;
					vOldVal = aStrRslt[i].ChangeData.results[j].OldValue;
					vOldValTxt = aStrRslt[i].ChangeData.results[j].OldValueText;
					vNewVal = aStrRslt[i].ChangeData.results[j].NewValue;
					vNewValTxt = aStrRslt[i].ChangeData.results[j].NewValueText;
					vAttrDsc = aStrRslt[i].ChangeData.results[j].AttributeDesc;
					if (sAttr === 'AUSME' || sAttr === 'ROTATION' || sAttr === 'ABCMARCST') {
						this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
						oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
							vPlantSort, this.vLblPlant);
						aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
					} else if (sAttr === 'CCFIX') {
						this.getCheckBoxValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
						oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
							vPlantSort, this.vLblPlant);
						aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
					} else if (sAttr === 'UCHKZ') { // Domain Specific values
						this.getDomSpcValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
						oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
							vPlantSort, this.vLblPlant);
						aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
					}
				}
			}
		}
		for (var i = 0; i < aCstngRslt.length; i++) { // loop at MARCCSTNG entity for the no. of plants
			if (aCstngRslt[i].ChangeData.results[0] !== undefined && // check if change data exists
				aCstngRslt[i].ChangeData.results[0].EntityAction === this.vUpdated) { // check if plant is changed
				vPlant = aCstngRslt[i].WERKS;
				vPlantTxt = aCstngRslt[i].WERKS__TXT;
				ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
				vPlantSort = vPlant + "0000"; // ADDING 0000 TO PLANT FOR SORTING
				vStorageLoc = "";
				for (var j = 0; j < aCstngRslt[i].ChangeData.results.length; j++) { // loop at changedata and create log
					sAttr = aCstngRslt[i].ChangeData.results[j].Attribute;
					vOldVal = aCstngRslt[i].ChangeData.results[j].OldValue;
					vOldValTxt = aCstngRslt[i].ChangeData.results[j].OldValueText;
					vNewVal = aCstngRslt[i].ChangeData.results[j].NewValue;
					vNewValTxt = aCstngRslt[i].ChangeData.results[j].NewValueText;
					vAttrDsc = aCstngRslt[i].ChangeData.results[j].AttributeDesc;
					if (sAttr === 'AWSMARCCS' || sAttr === 'APLAL' || sAttr === 'PLNNR' || sAttr === 'PLNTY' || 
						sAttr === 'SOBMARCCS' || sAttr === 'STLAN' || sAttr === 'STLAL' || sAttr === 'FVIDK') {
						this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
						oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
							vPlantSort, this.vLblPlant);
						aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
					} else if (sAttr === 'NCOST' || sAttr === 'FXPRU' || sAttr === 'KZKUP' ) { // Handling checkbox
						this.getCheckBoxValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
						oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
							vPlantSort, this.vLblPlant);
						aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
					} else if (sAttr === 'APLAL') { // Leading Zeroes
						this.getValueZeroes(vOldVal, vNewVal);
						oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
							vPlantSort, this.vLblPlant);
						aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
					} else if (sAttr === 'LOSGR') { // Handling Quantity
						var vUomChData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getUomChangedData();
						if (vUomChData !== "") {
								vOldValTxt = vUomChData.OldValue;
						}
						this.getQtyWithUnit(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
						oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
							vPlantSort, this.vLblPlant);
						aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
					}
				}
					var vBaseUomChData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getUomChangedData();
					if (vBaseUomChData !== "") {
						this.getTextOnly(vBaseUomChData.OldValue, vBaseUomChData.NewValue);
						oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vBaseUomChData.AttributeDesc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
							vPlantSort, this.vLblPlant);
						aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
					}
			}
		}
		/// Storage Location
		for (var l = 0; l < this.aPlantChngd.oDataChngd.length; l++) { // loop at changed plants dataset
			for (var i = 0; i < aStrgLocRslt.length; i++) { // loop for the no of plants
				vPlant = aStrgLocRslt[i].WERKS;
				if (vPlant === this.aPlantChngd.oDataChngd[l].vChngdPlant) { // check if the plant is changed
					vPlantTxt = aStrgLocRslt[i].WERKS__TXT;
					vPlantTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
					for (var k = 0; k < aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results.length; k++) { // loop for the no of storage locations
						vStorageLoc = aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].LGORT;
						var vStrgLocTxt = aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].LGORT__TXT;
						vStrgLocTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vStorageLoc, vStrgLocTxt);
						ChangeKey = vStrgLocTxt + ", " + vPlantTxt;
						vPlantSort = vPlant + vStorageLoc;
						if (aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].ChangeData.results[0] !==
							undefined) { // if change data for storage location exist
							if (aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].ChangeData.results[0].EntityAction ===
								this.vUpdated) { // if storage location is changed
								for (var j = 0; j < aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].ChangeData.results
									.length; j++) { // loop on changedata to get the log
									sAttr = aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].ChangeData.results[j].Attribute;
									vOldVal = aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].ChangeData.results[j].OldValue;
									vOldValTxt = aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].ChangeData.results[j]
										.OldValueText;
									vNewVal = aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].ChangeData.results[j].NewValue;
									vNewValTxt = aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].ChangeData.results[j]
										.NewValueText;
									vAttrDsc = aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].ChangeData.results[j].AttributeDesc;
									if (sAttr === 'LWMMARDST' || sAttr === 'LGPBE') {
										this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
										oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
											vPlantSort, this.vLblStrg);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									}
								}
							} else if (aStrgLocRslt[i].MARCBASIC2MARDSTORRel.results[k].ChangeData.results[0].EntityAction ===
								this.vCreated) { // if storage location is cretaed
								oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, "", this.vAdded, "", vPlant, vStorageLoc, vPlantSort, this.vLblStrg);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							}
						}
					}
					// MARDMRP Entity			
					for (var k = 0; k < aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results.length; k++) { // loop for the no of storage locations
						vStorageLoc = aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].LGORT;
						var vStrgLocTxt = aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].LGORT__TXT;
						vStrgLocTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vStorageLoc, vStrgLocTxt);
						ChangeKey = vStrgLocTxt + ", " + vPlantTxt;
						vPlantSort = vPlant + vStorageLoc;
						if (aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].ChangeData.results[0] !==
							undefined) { // if change data for storage location exist
							if (aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].ChangeData.results[0].EntityAction ===
								this.vUpdated) {
								for (var j = 0; j < aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].ChangeData.results
									.length; j++) { // if storage location is changed
									sAttr = aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].ChangeData.results[j].Attribute;
									vOldVal = aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].ChangeData.results[j].OldValue;
									vOldValTxt = aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].ChangeData.results[j]
										.OldValueText;
									vNewVal = aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].ChangeData.results[j].NewValue;
									vNewValTxt = aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].ChangeData.results[j]
										.NewValueText;
									vAttrDsc = aStrgLocRslt[i].MARCBASIC2MARDMRPRel.results[k].ChangeData.results[j].AttributeDesc;
									if (sAttr === 'LSOMARDMR' || sAttr === 'DISKZ') {
										this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
										oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
											vPlantSort, this.vLblStrg);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'LMINB' || sAttr === 'LBSTF') {
										this.getValueZeroes(vOldVal, vNewVal);
										oPlantPnlChangeItems = this.setStrgCstngBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vStorageLoc,
											vPlantSort, this.vLblStrg);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									}
								}
							}
						}
					}

				}
			}
		}
		this.setChangedDataPanel(aPlantPanelChngData, vCstngStrgPnlId, "MatStrgCstngPanel", oS3Cntrlr, "PlantSort", oCsChngTbl); // Set the model to change log table
	},
	// get change log for MRP panel
	getPlantMrpChangelog: function(aMrpResult, vMrpPanelid, oS3Cntrlr, oMrpChngTbl) {
		var vPlant, vPlantTxt, ChangeKey, sAttr, oPlantPnlChangeItems, vOldVal, vNewVal, vNewValTxt, vOldValTxt, vAttrDsc, vMrpArea, vPrdVrsn,
			vPlantSort, vPrdVerLngth, vMrpArLngth;
		var aPlantPanelChngData = {
			oPlantPnlData: []
		};
		var aMarcMrpResult = aMrpResult[0].data.MATERIAL2MARCMRPRel.results;
		var aMrpTxtResult = aMrpResult[0].data.MATERIAL2MRPTXTRel.results;
		var aMRPAreaResult = aMrpResult[1].data.MATERIAL2MARCBASICRel.results;
		for (var p = 0; p < this.aPlantChngd.oDataChngd.length; p++) { // loop at changed plants dataset
			for (var i = 0; i < aMarcMrpResult.length; i++) { // loop at MARCMRP entity for the no. of plants
				vPlant = aMarcMrpResult[i].WERKS;
				if (vPlant === this.aPlantChngd.oDataChngd[p].vChngdPlant && // check if the plant is changed or not
					aMarcMrpResult[i].ChangeData.results[0] !== undefined) { // check change data exist for plant
					vPlantTxt = aMarcMrpResult[i].WERKS__TXT;
					ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
					vPlantSort = vPlant + "a" + "0000000000";
					for (var j = 0; j < aMarcMrpResult[i].ChangeData.results.length; j++) { // loop at changedata to create the change log
						sAttr = aMarcMrpResult[i].ChangeData.results[j].Attribute;
						vOldVal = aMarcMrpResult[i].ChangeData.results[j].OldValue;
						vOldValTxt = aMarcMrpResult[i].ChangeData.results[j].OldValueText;
						vNewVal = aMarcMrpResult[i].ChangeData.results[j].NewValue;
						vNewValTxt = aMarcMrpResult[i].ChangeData.results[j].NewValueText;
						vAttrDsc = aMarcMrpResult[i].ChangeData.results[j].AttributeDesc;
						if (sAttr === 'DISPR' || sAttr === 'DGRMRPPP' || sAttr === 'MAABC' || sAttr === 'DISMM' || sAttr === 'DISMRPPP' ||
							sAttr === 'LFRMRPPP' || sAttr === 'DISLS' || sAttr === 'MRPMRPSP' || sAttr === 'LAGMRPLS' || sAttr === 'MEGMRPLS' ||
							sAttr === 'RDPMRPLS' || sAttr === 'RWPMRPLS' || sAttr === 'SHPMRPLS' || sAttr === 'SOBMRPSP' || sAttr === 'EPRMRPSP' ||
							sAttr === 'LGPMRPSP' || sAttr === 'VSPMRPSP' || sAttr === 'RGEKZ' || sAttr === 'USEQU' || sAttr === 'LGFMRPSP' ||
							sAttr === 'MISKZ' || sAttr === 'STRGR' || sAttr === 'VRMOD' || sAttr === 'PRGPRODG' || sAttr === 'PRWPRODG' ||
							sAttr === 'UMREF' || sAttr === 'MTVFP' || sAttr === 'KZPSP' || sAttr === 'KZBED' || sAttr === 'MDAMRPMI' ||
							sAttr === 'SFEPR' || sAttr === 'KZAUS' || sAttr === 'NFMAT' || sAttr === 'FHOMRPPP' || sAttr === 'TXTMRP') { // Get key and Desc.
							this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							if(sAttr === 'MTVFP'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("Mat_Avl_ChkGrp");
							}
							oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, "", vPlantSort, this.vLblPlant);
							aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
						} else if (sAttr === 'SCHGT' || sAttr === 'SAUFT') { // Handling Checkbox
							this.getCheckBoxValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, "", vPlantSort, this.vLblPlant);
							aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
						} else if (sAttr === 'BSTMI' || sAttr === 'BSTMA' || sAttr === 'BSTFE' || sAttr === 'BSTRF' || sAttr === 'MABST') { // Handling quantity
						var vUomChData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getUomChangedData();
						if (vUomChData !== "") {
							vOldValTxt = vUomChData.OldValue;
						}
							this.getQtyWithUnit(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, "", vPlantSort, this.vLblPlant);
							aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
						} else if (sAttr === 'MINBE' || sAttr === 'AUSSS' || sAttr === 'TAKZT' || sAttr === 'LOSFX' ||
							sAttr === 'EISBE' || sAttr === 'EISLO' || sAttr === 'LGRAD' || sAttr === 'VINT1' || sAttr === 'VINT2' ||
							sAttr === 'KAUSF' || sAttr === 'WEBAZ' ||  sAttr === 'PLIFZ' || sAttr === 'FXHOR' || sAttr === 'SHZET') { // Handling 0's
							this.getValueZeroes(vOldVal, vNewVal);
							if(sAttr === 'SHZET'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("SaftyTime");
							}
							oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, "", vPlantSort, this.vLblPlant);
							aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
						} else if (sAttr === 'AUSDT') { // Handling date
							this.getDate(vOldVal, vNewVal);
							oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, "", vPlantSort, this.vLblPlant);
							aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
						} else if (sAttr === 'WZEIT') { // Handling Days 
							this.getTextDays(vOldVal, vNewVal);
							oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, "", vPlantSort, this.vLblPlant);
							aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
						} else if (sAttr === 'AHDIS' || sAttr === 'ALTSL' || sAttr === 'SBDKZ' || sAttr === 'BESKZ' || sAttr === 'FABKZ' ||
							sAttr === 'KZECH' || sAttr === 'SHFLG') { // Domain Specific values
							this.getDomSpcValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							if(sAttr === 'SHFLG'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("SaftyTime");
							} else if(sAttr === 'FABKZ'){
								vAttrDsc = "";
								vAttrDsc = this.i18n.getText("JIT_DlvrySchdl");
							}
							oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, "", vPlantSort, this.vLblPlant);
							aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
						}
					}
					var vBaseUomChData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getUomChangedData();
					if (vBaseUomChData !== "") {
						this.getTextOnly(vBaseUomChData.OldValue, vBaseUomChData.NewValue);
						oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vBaseUomChData.AttributeDesc, this.vNewValChng, this.vOldValChng, vPlant, "", vPlantSort, this.vLblPlant);
						aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
					}
				}
			}
			// MRPTXT : Check and match with change Plant dataset 
			for (var k = 0; k < aMrpTxtResult.length; k++) {
				vPlant = aMrpTxtResult[k].WERKS;
				if (vPlant === this.aPlantChngd.oDataChngd[p].vChngdPlant &&
					aMrpTxtResult[k].ChangeData.results[0] !== undefined) {
					vPlantTxt = aMrpTxtResult[k].WERKS__TXT;
					ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
					vPlantSort = vPlant + "a" + "0000000000";
					for (var l = 0; l < aMrpTxtResult[k].ChangeData.results.length; l++) { // check MRPTXT changedata exist
						sAttr = aMrpTxtResult[k].ChangeData.results[l].Attribute;
						if (sAttr === 'TXTMRP') {
							vOldVal = aMrpTxtResult[k].ChangeData.results[l].OldValue;
							vOldValTxt = aMrpTxtResult[k].ChangeData.results[l].OldValueText;
							vNewVal = aMrpTxtResult[k].ChangeData.results[l].NewValue;
							vNewValTxt = aMrpTxtResult[k].ChangeData.results[l].NewValueText;
							vAttrDsc = aMrpTxtResult[k].ChangeData.results[l].AttributeDesc;
							this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
							oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, "", vPlantSort, this.vLblPlant);
							aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
						}
					}
				}
			}
			/// MRP Area
			for (var m = 0; m < aMRPAreaResult.length; m++) { // loop for the no of plants
				vPlant = aMRPAreaResult[m].WERKS;
				if (vPlant === this.aPlantChngd.oDataChngd[p].vChngdPlant) { // check if the plant is changed
					vPlantTxt = aMRPAreaResult[m].WERKS__TXT;
					vPlantTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
					for (var n = 0; n < aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results.length; n++) { // loop for the no of MRP Area
						vMrpArea = aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].BERID;
						var vMrpAreaTxt = aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].BERID__TXT;
						vMrpAreaTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vMrpArea, vMrpAreaTxt);
						ChangeKey = vMrpAreaTxt + ", " + vPlantTxt;
						vMrpArLngth = ("000000000" + vMrpArea).slice(-10);
						vPlantSort = vPlant + "b" + vMrpArLngth;
						if (aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].ChangeData.results[0] !==
							undefined) { // if change data for storage location exist
							if (aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].ChangeData.results[0].EntityAction ===
								this.vUpdated) { // if storage location is changed
								for (var r = 0; r < aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].ChangeData.results
									.length; r++) { // loop on changedata to get the log
									sAttr = aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].ChangeData.results[r].Attribute;
									vOldVal = aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].ChangeData.results[r].OldValue;
									vOldValTxt = aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].ChangeData.results[r].OldValueText;
									vNewVal = aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].ChangeData.results[r].NewValue;
									vNewValTxt = aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].ChangeData.results[r].NewValueText;
									vAttrDsc = aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].ChangeData.results[r].AttributeDesc;
									if (sAttr === 'DGRMDMA' || sAttr === 'DISMMMDMA' || sAttr === 'LFRMDMA' || sAttr === 'DISMDMA' || sAttr === 'DISLSMDMA' || sAttr ===
										'RDPMDMA' ||
										sAttr === 'LAGMDMA' || sAttr === 'SOBMDMA' || sAttr === 'LGPMDMA' || sAttr === 'LGFMDMA' || sAttr === 'MRPMDMA' ||
										sAttr === 'RWPMDMA' || sAttr === 'SHPMDMA') {
										this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
										oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vMrpArea,
											vPlantSort, this.vLblMrpAr);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'PLIFZX') { // handling Checkbox
										this.getCheckBoxDefValue(vOldVal, vNewVal);
										oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vMrpArea,
											vPlantSort, this.vLblMrpAr);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'MINBEMDMA' || sAttr === 'FXHORMDMA' || sAttr === 'BSTRFMDMA' || sAttr === 'BSTMAMDMA' || sAttr ===
										'BSTMIMDMA' ||
										sAttr === 'BSTFEMDMA' || sAttr === 'MABSTMDMA' || sAttr === 'LOSFXMDMA' || sAttr === 'AUSSSMDMA' || sAttr === 'TAKZTMDMA' ||
										sAttr === 'PLIFZMDMA' || sAttr === 'EISBEMDMA' || sAttr === 'LGRADMDMA') { // Handling 0's
										this.getValueZeroes(vOldVal, vNewVal);
										oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vMrpArea,
											vPlantSort, this.vLblMrpAr);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'APOKZMDMA' || sAttr === 'SHFLGMDMA' || sAttr === 'SHZETMDMA' || sAttr === 'AHDISMDMA') { // Handling Domain spec values
										this.getDomSpcValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
										oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vMrpArea,
											vPlantSort, this.vLblMrpAr);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									}
								}
							} else if (aMRPAreaResult[m].MARCBASIC2MDMABASICRel.results[n].ChangeData.results[0].EntityAction ===
								this.vCreated) { // if MRP Area is cretaed
								oPlantPnlChangeItems = this.setMrpBindingItms(ChangeKey, "", this.vAdded, "", vPlant, vMrpArea, vPlantSort, this.vLblMrpAr);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							}
						}
					}
				}
			}
			/// Production Version
			for (var s = 0; s < aMRPAreaResult.length; s++) { // loop for the no of plants
				vPlant = aMRPAreaResult[s].WERKS;
				if (vPlant === this.aPlantChngd.oDataChngd[p].vChngdPlant) { // check if the plant is changed
					vPlantTxt = aMRPAreaResult[s].WERKS__TXT;
					vPlantTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPlant, vPlantTxt);
					for (var t = 0; t < aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results.length; t++) { // loop for the no of Production zversions
						vPrdVrsn = aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].MKALBASIC;
						var vPrdVrsnTxt = aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].MKALBASIC__TXT;
						vPrdVrsnTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vPrdVrsn, vPrdVrsnTxt);
						ChangeKey = vPrdVrsnTxt + ", " + vPlantTxt;
						vPrdVerLngth = ("000000000" + vPrdVrsn).slice(-10);
						vPlantSort = vPlant + "c" + vPrdVerLngth;
						if (aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results[0] !==
							undefined) { // if change data for storage location exist
							if (aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results[0].EntityAction ===
								this.vUpdated) { // if storage location is changed
								for (var u = 0; u < aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results
									.length; u++) { // loop on changedata to get the log
									sAttr = aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results[u].Attribute;
									vOldVal = aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results[u].OldValue;
									vOldValTxt = aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results[u].OldValueText;
									vNewVal = aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results[u].NewValue;
									vNewValTxt = aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results[u].NewValueText;
									vAttrDsc = aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results[u].AttributeDesc;
									if (sAttr === 'TEXT1MKAL' || sAttr === 'PLNTYP' || sAttr === 'PLNNRP' || sAttr === 'PLNTYG' || sAttr === 'PLNNRG' ||
										sAttr === 'PLNTYM' || sAttr === 'PLNNRM' || sAttr === 'STAMKALBA' || sAttr === 'STLANMKAL' || sAttr === 'CSPMKALBA' ||
										sAttr === 'MDV01MKAL' || sAttr === 'MDVMKALBA' || sAttr === 'ELPMKALBA' || sAttr === 'ALOMKALBA' || sAttr === 'PRVMKALBA' ||
										sAttr === 'MATKOMKAL' || sAttr === 'VERMKALBA' || sAttr === 'UCMATMKAL') {
										this.getKeyDesc(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
										oPlantPnlChangeItems = this.setPrdVerBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vPrdVrsn,
											vPlantSort);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'SERKZMKAL') { // handling Checkbox
										this.getCheckBoxValue(vOldVal, vNewVal, vOldValTxt, vNewValTxt);
										oPlantPnlChangeItems = this.setPrdVerBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vPrdVrsn,
											vPlantSort);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'BSTMIMKAL' || sAttr === 'BSTMAMKAL' || sAttr === 'PLNALP' || sAttr === 'PLNALG' || sAttr === 'PLNALM') { // handling 0's
										this.getValueZeroes(vOldVal, vNewVal);
										oPlantPnlChangeItems = this.setPrdVerBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vPrdVrsn,
											vPlantSort);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'ADATUMKAL' || sAttr === 'BDATUMKAL') { // handling date
										this.getDate(vOldVal, vNewVal);
										oPlantPnlChangeItems = this.setPrdVerBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vPrdVrsn,
											vPlantSort);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									} else if (sAttr === 'MKSPMKAL') { // handling Texts only
										this.getTextOnly(vOldValTxt, vNewValTxt);
										oPlantPnlChangeItems = this.setPrdVerBindingItms(ChangeKey, vAttrDsc, this.vNewValChng, this.vOldValChng, vPlant, vPrdVrsn,
											vPlantSort);
										aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
									}
								}
							} else if (aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results[0].EntityAction ===
								this.vCreated) { // if Production Version is cretaed
								oPlantPnlChangeItems = this.setPrdVerBindingItms(ChangeKey, "", this.vAdded, "", vPlant, vPrdVrsn, vPlantSort);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							} else if (aMRPAreaResult[s].MARCBASIC2MKALBASICRel.results[t].ChangeData.results[0].EntityAction ===
								this.vEDeleted) { // if Production Version is cretaed
								oPlantPnlChangeItems = this.setPrdVerBindingItms(ChangeKey, "", this.vEntDltd, "", vPlant, vPrdVrsn, vPlantSort);
								aPlantPanelChngData.oPlantPnlData.push(oPlantPnlChangeItems);
							}
						}
					}
				}
			}

		}
		this.setChangedDataPanel(aPlantPanelChngData, vMrpPanelid, "MatReqPlanningPanel", oS3Cntrlr, "PlantSort", oMrpChngTbl);
	},

	// bind data to change log table inside panel 
	setChangedDataPanel: function(aPlantPnlChngData, vChngPnlId, vDtlPnlId, oS3View, vSorter, oChangeLogTable) {
		if (aPlantPnlChngData.oPlantPnlData.length > 0) {
			sap.ui.getCore().byId(vChngPnlId).destroyContent();
			sap.ui.getCore().byId(vChngPnlId).addContent(oChangeLogTable);
			oChangeLogTable.setGrowing(true);
			this.oChngItemTemp = this.createChngLogTblTemplt(); // Get the item template
			this.oChngItemTemp.attachPress({
				Entity: vDtlPnlId,
				name: 'matPlantPnlChngDetail'
			}, oS3View.navtoSubDetail, oS3View);

			var oPlantChngModel = new sap.ui.model.json.JSONModel();
			oPlantChngModel.setData(aPlantPnlChngData);
			oChangeLogTable.setModel(oPlantChngModel);
			var oPlantSorter = new sap.ui.model.Sorter(vSorter);
			oChangeLogTable.bindItems('/oPlantPnlData', this.oChngItemTemp, oPlantSorter, '');
		} else { // incase no change data found
			var noDataPanel = sap.ui.getCore().byId(vChngPnlId);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(noDataPanel, this.vNoDataTxt);
		}
	},

	// create change log table template	
	createChngLogTblTemplt: function() {
		var oChItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.ObjectIdentifier({
					text: {
						path: "PlantLbl"
					},
					title: {
						path: "ChangeKey"
					}
				}),
				new sap.m.ObjectIdentifier({
					text: {
						path: "AttributeDesc"
					},
					title: {
						path: "NewValue"
					}
				}), new sap.m.Text({
					text: {
						path: "OldValue"
					}
				})
			]
		});
		var extoItemTemp = this.oS3ControllerChng.matHookcreateChngLogTblTemplt(oChItemTemp);
			if(extoItemTemp !== undefined){
				oChItemTemp = extoItemTemp;
		}
		return oChItemTemp;
	},

	// set plant change data to bold
	setBoldPlantGenData: function(aChangeResult, vPlantPanelId) {
		var sPanelAttr, sLabelName, sTextName;
		//if the data has been changed for a field, set the text of the field and the label to bold
		if (aChangeResult.ChangeData.results[0] !== undefined) {
			if (vPlantPanelId === "MatReqPlanningPanel") {
				for (var i = 0; i < aChangeResult.ChangeData.results.length; i++) {
					sPanelAttr = aChangeResult.ChangeData.results[i].Attribute;
					if (sPanelAttr === "WZEIT" || sPanelAttr === "MTVFP" || sPanelAttr === "KZPSP") {
						sLabelName = "Lbl_M" + sPanelAttr;
						sTextName = "Txt_M" + sPanelAttr;
					} else {
						sLabelName = "Lbl_" + sPanelAttr;
						sTextName = "Txt_" + sPanelAttr;
					}
					this.setBoldLblTxt(sLabelName, sTextName);
				}
			} else if (vPlantPanelId === "MatQltyMngmntPanel") {
				for (var i = 0; i < aChangeResult.ChangeData.results.length; i++) {
					sPanelAttr = aChangeResult.ChangeData.results[i].Attribute;
					if (sPanelAttr === "KZDKZ") {
						sLabelName = "Lbl_M" + sPanelAttr;
						sTextName = "Txt_M" + sPanelAttr;
					} else {
						sLabelName = "Lbl_" + sPanelAttr;
						sTextName = "Txt_" + sPanelAttr;
					}
					this.setBoldLblTxt(sLabelName, sTextName);
				}
			} else {
				for (var i = 0; i < aChangeResult.ChangeData.results.length; i++) {
					sPanelAttr = aChangeResult.ChangeData.results[i].Attribute;
					if (sPanelAttr === "XCHPF") {
						sLabelName = "Lbl_M" + sPanelAttr;
						sTextName = "Txt_M" + sPanelAttr;
					} else {
						sLabelName = "Lbl_" + sPanelAttr;
						sTextName = "Txt_" + sPanelAttr;
					}
					this.setBoldLblTxt(sLabelName, sTextName);
				}
			}
		}
		
	var vBaseUomChData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getUomChangedData();
		if (vBaseUomChData !== "") {
			var sStyleClass = "text_bold";
			if (sap.ui.getCore().byId("Txt_VBAMG") !== undefined && sap.ui.getCore().byId("Txt_VBAMG").hasStyleClass(sStyleClass) === false) {
				sLabelName = "Lbl_VBAMG";
				sTextName = "Txt_VBAMG";
				this.setBoldUomLblTxt(sLabelName, sTextName, sStyleClass);
			}
			if (sap.ui.getCore().byId("Txt_BSTMI") !== undefined && sap.ui.getCore().byId("Txt_BSTMI").hasStyleClass(sStyleClass) === false) {
				sLabelName = "Lbl_BSTMI";
				sTextName = "Txt_BSTMI";
				this.setBoldUomLblTxt(sLabelName, sTextName, sStyleClass);
			}
			if (sap.ui.getCore().byId("Txt_BSTMA") !== undefined && sap.ui.getCore().byId("Txt_BSTMA").hasStyleClass(sStyleClass) === false) {
				sLabelName = "Lbl_BSTMA";
				sTextName = "Txt_BSTMA";
				this.setBoldUomLblTxt(sLabelName, sTextName, sStyleClass);
			}
			if (sap.ui.getCore().byId("Txt_BSTFE") !== undefined && sap.ui.getCore().byId("Txt_BSTFE").hasStyleClass(sStyleClass) === false) {
				sLabelName = "Lbl_BSTFE";
				sTextName = "Txt_BSTFE";
				this.setBoldUomLblTxt(sLabelName, sTextName, sStyleClass);
			}
			if (sap.ui.getCore().byId("Txt_BSTRF") !== undefined && sap.ui.getCore().byId("Txt_BSTRF").hasStyleClass(sStyleClass) === false) {
				sLabelName = "Lbl_BSTRF";
				sTextName = "Txt_BSTRF";
				this.setBoldUomLblTxt(sLabelName, sTextName, sStyleClass);
			}
			if (sap.ui.getCore().byId("Txt_MABST") !== undefined && sap.ui.getCore().byId("Txt_MABST").hasStyleClass(sStyleClass) === false) {
				sLabelName = "Lbl_MABST";
				sTextName = "Txt_MABST";
				this.setBoldUomLblTxt(sLabelName, sTextName, sStyleClass);
			}
			if (sap.ui.getCore().byId("Txt_LOSGR") !== undefined && sap.ui.getCore().byId("Txt_LOSGR").hasStyleClass(sStyleClass) === false) {
				sLabelName = "Lbl_LOSGR";
				sTextName = "Txt_LOSGR";
				this.setBoldUomLblTxt(sLabelName, sTextName, sStyleClass);
			}
			if (sap.ui.getCore().byId("Txt_BASMG") !== undefined && sap.ui.getCore().byId("Txt_BASMG").hasStyleClass(sStyleClass) === false) {
				sLabelName = "Lbl_BASMG";
				sTextName = "Txt_BASMG";
				this.setBoldUomLblTxt(sLabelName, sTextName, sStyleClass);
			}
		}
	},

	getTextOnly: function(vOldValue, vNewValue) {
		if (vNewValue !== vOldValue) {
			if (vOldValue === "") {
				this.vOldValChng = this.vNotMaint; //if nothing is maintained in the field when it was initially created
			} else {
				this.vOldValChng = vOldValue;
			}
			if (vNewValue === "" && vOldValue !== "") {
				this.vNewValChng = this.vDeleted;
			} else if (vNewValue !== "") {
				this.vNewValChng = vNewValue;
			}
		}
	},

	getKeyDesc: function(vOldValue, vNewValue, vOldValueTxt, vNewValueTxt) {
		if (vNewValue !== vOldValue) {
			if (vOldValue === "") {
				this.vOldValChng = this.vNotMaint; //if nothing is maintained in the field when it was initially created
			} else {
				this.vOldValChng = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vOldValue, vOldValueTxt);
			}
			if (vNewValue === "" && vOldValue !== "") {
				this.vNewValChng = this.vDeleted;
			} else if (vNewValue !== "") {
				this.vNewValChng = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vNewValue, vNewValueTxt);
			}
		}

	},
	getOriginDesc: function(vOldValue, vNewValue, vOldValueTxt, vNewValueTxt) {
		if (vNewValue !== vOldValue) {

			this.vOldValChng = vOldValueTxt;
			this.vNewValChng = vNewValueTxt;
		}

	},

	// handle domain specific values in change log	
	getDomSpcValue: function(vOldValue, vNewValue, vOldValueTxt, vNewValueTxt) {
		if (vNewValue !== vOldValue) {
			this.vOldValChng = fcg.mdg.approvecrv2.util.Formatter.description(vOldValue, vOldValueTxt);
			this.vNewValChng = fcg.mdg.approvecrv2.util.Formatter.description(vNewValue, vNewValueTxt);
		}
	},

	// handle checkbox values in change log as per the backend description
	getCheckBoxValue: function(vOldValue, vNewValue, vOldVluTxt, vNewVluTxt) {
		if (vNewValue !== vOldValue) {
			if (vOldValue === "") {
				this.vOldValChng = this.vNotMaint; //if nothing is maintained in the field when it was initially created
			} else {
				this.vOldValChng = vOldVluTxt;
			}
			if (vNewValue === "" && vOldValue !== "") {
				// this.vOldValChng = fcg.mdg.approvecrv2.util.Formatter.checkBox(vOldValue);
				this.vNewValChng = this.vDeleted;
			} else if (vNewValue !== "") {
				this.vNewValChng = vNewVluTxt;
			}
		}
	},
	// handle checkbox values in change log which return yes
	getCheckBoxDefValue: function(vOldValue, vNewValue) {
		if (vNewValue !== vOldValue) {
			if (vOldValue === "") {
				this.vOldValChng = this.vNotMaint; //if nothing is maintained in the field when it was initially created
			} else {
				this.vOldValChng = fcg.mdg.approvecrv2.util.Formatter.checkBox(vOldValue);
			}
			if (vNewValue === "" && vOldValue !== "") {
				// this.vOldValChng = fcg.mdg.approvecrv2.util.Formatter.checkBox(vOldValue);
				this.vNewValChng = this.vDeleted;
			} else if (vNewValue !== "") {
				this.vNewValChng = fcg.mdg.approvecrv2.util.Formatter.checkBox(vNewValue);
			}
		}
	},

	// handle quantity with unit and description in change log
	getQtyWithUnit: function(vOldValue, vNewValue, vOldValueTxt, vNewValueTxt) {
		if (vNewValue !== vOldValue) {
			var vOldValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vOldValue);
			var vNewValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vNewValue);
			if (vOldValBoln === false) {
				this.vOldValChng = this.vNotMaint;
			} else {
				this.vOldValChng = vOldValue + ' ' + vOldValueTxt;
			}
			if (vNewValBoln === false) {
				this.vNewValChng = this.vDeleted;
			} else {
				this.vNewValChng = vNewValue + ' ' + vNewValueTxt;
			}
		}
	},

	// handle zeroes in change log
	getValueZeroes: function(vOldValue, vNewValue) {
		if (vNewValue !== vOldValue) {
			var vOldValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vOldValue);
			var vNewValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vNewValue);
			if (vOldValBoln === false) {
				this.vOldValChng = this.vNotMaint;
			} else {
				this.vOldValChng = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(vOldValue);
			}
			if (vNewValBoln === false) {
				this.vNewValChng = this.vDeleted;
			} else {
				this.vNewValChng = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(vNewValue);
			}
		}
	},

	// get date for change log
	getDate: function(vOldValue, vNewValue) {
		if (vNewValue !== vOldValue) {
			if (vOldValue === "" || vOldValue === "00.00.0000" || vOldValue === "00,00,0000") {
				this.vOldValChng = this.vNotMaint; //if nothing is maintained in the field when it was initially created
			} else {
				this.vOldValChng = vOldValue;
			}
			if (vNewValue === "" || vNewValue === "00.00.0000" || vNewValue === "00,00,0000") {
				this.vNewValChng = this.vDeleted;
			} else if (vNewValue !== "") {
				this.vNewValChng = vNewValue;
			}
		}
	},

	// Concatenate text - Days for change log
	getTextDays: function(vOldValue, vNewValue) {
		if (vNewValue !== vOldValue) {
			var vOldValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vOldValue);
			var vNewValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vNewValue);
			if (vOldValBoln === false) {
				this.vOldValChng = this.vNotMaint; //if nothing is maintained in the field when it was initially created
			} else {
				this.vOldValChng = fcg.mdg.approvecrv2.util.Formatter.matPurchDays(vOldValue);
			}
			if (vNewValBoln === false) {
				this.vNewValChng = this.vDeleted;
			} else {
				this.vNewValChng = fcg.mdg.approvecrv2.util.Formatter.matPurchDays(vNewValue);
			}
		}
	},
	// Bind change log items 
	setChngBindingItms: function(vChngKey, vAttrDisc, vNwVal, vOldVl, vPlant) {
		var oPlantChangeItems = {
			"ChangeKey": vChngKey,
			"AttributeDesc": vAttrDisc,
			"NewValue": vNwVal,
			"OldValue": vOldVl,
			"Plant": vPlant,
			"Material": this.vMaterial,
			"PlantLbl": this.vLblPlant
		};
		return oPlantChangeItems;
	},

	// Bind Costing and storage panel change log items
	setStrgCstngBindingItms: function(vChngKey, vAttrDisc, vNwVal, vOldVl, vPlant, vStrgLoc, vPlantSorter, vChngLbl) {
		var oPlantChangeItems = {
			"ChangeKey": vChngKey,
			"AttributeDesc": vAttrDisc,
			"NewValue": vNwVal,
			"OldValue": vOldVl,
			"Plant": vPlant,
			"StorgLoc": vStrgLoc,
			"PlantSort": vPlantSorter,
			"Material": this.vMaterial,
			"PlantLbl": vChngLbl
		};
		return oPlantChangeItems;
	},

	setQMBindingItms: function(vChngKey, vAttrDisc, vNwVal, vOldVl, vPlant, vInspTyp, vPlantSorter, vChngLbl) {
		var oPlantChangeItems = {
			"ChangeKey": vChngKey,
			"AttributeDesc": vAttrDisc,
			"NewValue": vNwVal,
			"OldValue": vOldVl,
			"Plant": vPlant,
			"InspType": vInspTyp,
			"PlantSort": vPlantSorter,
			"Material": this.vMaterial,
			"PlantLbl": vChngLbl
		};
		return oPlantChangeItems;
	},

	setMrpBindingItms: function(vChngKey, vAttrDisc, vNwVal, vOldVl, vPlant, vMrpAr, vPlantSorter, vChngLbl) {
		var oPlantChangeItems = {
			"ChangeKey": vChngKey,
			"AttributeDesc": vAttrDisc,
			"NewValue": vNwVal,
			"OldValue": vOldVl,
			"Plant": vPlant,
			"MrpArea": vMrpAr,
			"PlantSort": vPlantSorter,
			"Material": this.vMaterial,
			"PlantLbl": vChngLbl
		};
		return oPlantChangeItems;
	},

	setPrdVerBindingItms: function(vChngKey, vAttrDisc, vNwVal, vOldVl, vPlant, vPrdVr, vPlantSorter) {
		var oPlantChangeItems = {
			"ChangeKey": vChngKey,
			"AttributeDesc": vAttrDisc,
			"NewValue": vNwVal,
			"OldValue": vOldVl,
			"Plant": vPlant,
			"PrdVer": vPrdVr,
			"PlantSort": vPlantSorter,
			"Material": this.vMaterial,
			"PlantLbl": this.vLblPrdVer
		};
		return oPlantChangeItems;
	},

	// set label and text to bold
	setBoldLblTxt: function(sLblName, sTxtName) {
		var sStyleClass = "text_bold";
		var oLblIns = sap.ui.getCore().byId(sLblName);
		if (oLblIns !== undefined) {
			oLblIns.setDesign("Bold");
		}
		var oTxtIns = sap.ui.getCore().byId(sTxtName);
		if (oTxtIns !== undefined) {
			oTxtIns.addStyleClass(sStyleClass);
		}
	},
	
	setBoldUomLblTxt: function(sLblName, sTxtName, sBoldClass) {
		var oLblIns = sap.ui.getCore().byId(sLblName);
		oLblIns.setDesign("Bold");
		var oTxtIns = sap.ui.getCore().byId(sTxtName);
		oTxtIns.addStyleClass(sBoldClass);
	},
	// Bind Costing and storage panel change log items
	setValuationBindingItms: function(vChngKey, vAttrDisc, vNwVal, vOldVl, vPlant, vPlantLbl, key, plant_txt, bwtar_txt,vsort) {
		var oPlantChangeItems = {
			"ChangeKey": vChngKey,
			"AttributeDesc": vAttrDisc,
			"NewValue": vNwVal,
			"OldValue": vOldVl,
			"Plant": vPlant,
			"PlantLbl": vPlantLbl,
			"key": key,
			"plant_txt": plant_txt,
			"bwtar_txt": bwtar_txt,
			"Material": this.vMaterial,
			"sorter":vsort
		};
		return oPlantChangeItems;
	},
	createMatLedgerPerTemplate: function(oMatledgerperModel) { // table templete for plant MRP text
		var oMRPTxtTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: 'CURTP',
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerperModel, "CURTP");
							var desc = oMatledgerperModel.getProperty("CURTP__TXT", this.getBindingContext());
							var key = oMatledgerperModel.getProperty("CURTP", this.getBindingContext());
							if (key === "" && desc === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "POPER",
					//	formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerperModel, "POPER");
							var key = oMatledgerperModel.getProperty("POPER", this.getBindingContext());
							if (key === "" ) {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} 
							else{
						return key;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "BDATJ",
					//	formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerperModel, "BDATJ");
							var key = oMatledgerperModel.getProperty("BDATJ", this.getBindingContext());
							if (key === "" ) {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} 
							else{
						return key;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "STPRSMLVL",
					//	formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
				formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerperModel, "STPRSMLVL");
							var key = oMatledgerperModel.getProperty("STPRSMLVL", this.getBindingContext());
							if (key === "" ) {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} 
							else{
						return key;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "PVPRS",
					//	formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
				formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerperModel, "PVPRS");
							var key = oMatledgerperModel.getProperty("PVPRS", this.getBindingContext());
							if (key === "" ) {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} 
							else{
						return key;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "PEINHMLVL",
					//	formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerperModel, "PEINHMLVL");
							var key = oMatledgerperModel.getProperty("PEINHMLVL", this.getBindingContext());
							if (key === "" ) {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} 
							else{
						return key;
							}
						}
						
					}
				}),
				new sap.m.Text({
					text: {
						path: 'VPRSVMLVL',
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerperModel, "VPRSVMLVL");
							var desc = oMatledgerperModel.getProperty("VPRSVMLVL__TXT", this.getBindingContext());
							var key = oMatledgerperModel.getProperty("VPRSVMLVL", this.getBindingContext());
							if (key === "" && desc === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookcreateMatLedgerPerTemplate(oMRPTxtTemp);
		if (extoItemTemp !== undefined) {
			oMRPTxtTemp = extoItemTemp;
		}
		return oMRPTxtTemp;
	},
	createMatLedgerPriceTemplate: function(oMatledgerpriceModel) { // table templete for plant MRP text
		var oMRPTxtTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: 'CURTP',
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerpriceModel, "CURTP");
							var desc = oMatledgerpriceModel.getProperty("CURTP__TXT", this.getBindingContext());
							var key = oMatledgerpriceModel.getProperty("CURTP", this.getBindingContext());
							if (key === "" && desc === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "PEINHMLAC",
					//	formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
				formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerpriceModel, "PEINHMLAC");
							var key = oMatledgerpriceModel.getProperty("PEINHMLAC", this.getBindingContext());
							if (key === "" ) {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} 
							else{
						return key;
							}
				}
					}
				}),
				new sap.m.Text({
					text: {
						path: "ZKPRS",
					//	formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerpriceModel, "ZKPRS");
							var key = oMatledgerpriceModel.getProperty("ZKPRS", this.getBindingContext());
							if (key === "" ) {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} 
							else{
						return key;
							}
				}
					}
				}),
				new sap.m.Text({
					text: {
						path: 'ZPRSDAT',
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantvalLdgrCellBolding(this, oMatledgerpriceModel, "ZPRSDAT");
							var key = oMatledgerpriceModel.getProperty("ZPRSDAT", this.getBindingContext());
							if (key === "" || key === null) {
								if (key === null) {
									key = "";
								}
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.matDateFormat(key);
							}
						}
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookcreateMatLedgerPriceTemplate(oMRPTxtTemp);
		if (extoItemTemp !== undefined) {
			oMRPTxtTemp = extoItemTemp;
		}
		return oMRPTxtTemp;
	},
	hideValuationDataSection: function(oDtlController) {
		//controller hook to handle valuation data fields
		var extHideValuationData = oDtlController.matHookHidePlantValuationDataSection();	// Controller hook
			if(extHideValuationData === false) {
		// Valuation (Current Period)
		if (sap.ui.getCore().byId("Txt_FZKPRS").getVisible() === false &&
			sap.ui.getCore().byId("Plant_Val_Cur") !== undefined) {
			sap.ui.getCore().byId("Plant_Val_Cur").destroy();
		}
		// LIFO Data
		if (sap.ui.getCore().byId("Txt_MYPACTNG").getVisible() === false &&
			sap.ui.getCore().byId("Txt_FXLIFO").getVisible() === false &&
			sap.ui.getCore().byId("Plant_Lifo_Datat") !== undefined) {
			sap.ui.getCore().byId("Plant_Lifo_Datat").destroy();
		}
		// Determination of Lowest Value
		if (sap.ui.getCore().byId("Txt_ABWKZ").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BWPEI").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BWPRS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BWPS1").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VJBWS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BWPRH").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BWPH1").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VJBWH").getVisible() === false &&
			sap.ui.getCore().byId("Plant_Det_Low_Val") !== undefined) {
			sap.ui.getCore().byId("Plant_Det_Low_Val").destroy();
		}
		// General Data
		if (sap.ui.getCore().byId("Txt_MBEWMLAST").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MBEWMLMAA").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BKLAS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BWTTY").getVisible() === false &&
			sap.ui.getCore().byId("Txt_QKLAS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_EKLAS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_PEINH").getVisible() === false &&
			sap.ui.getCore().byId("Gen_Data_Title") !== undefined) {
			sap.ui.getCore().byId("Gen_Data_Title").destroy();
		}
		// Pricing
		if (sap.ui.getCore().byId("Txt_FZPLP1").getVisible() === false &&
			sap.ui.getCore().byId("Txt_FZPLP2").getVisible() === false &&
			sap.ui.getCore().byId("Txt_FZPLP3").getVisible() === false &&
			sap.ui.getCore().byId("idmatPricingTitle") !== undefined) {
			sap.ui.getCore().byId("idmatPricingTitle").destroy();
		}
		// Valuation (Current Period)
		if (sap.ui.getCore().byId("Txt_STPRS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_FZPLP3").getVisible() === false &&
			sap.ui.getCore().byId("idStd_Cost_EstTitle") !== undefined) {
			sap.ui.getCore().byId("idStd_Cost_EstTitle").destroy();
		}
		// Standard Cost Estimate
		if (sap.ui.getCore().byId("Txt_VERPR").getVisible() === false &&
			sap.ui.getCore().byId("Txt_STPRV").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VPRSV").getVisible() === false &&
			sap.ui.getCore().byId("idValuationCoreTitle") !== undefined) {
			sap.ui.getCore().byId("idValuationCoreTitle").destroy();
		}
		if (sap.ui.getCore().byId("Gen_Data_Title") === undefined &&
			sap.ui.getCore().byId("idmatPricingTitle") === undefined &&
			sap.ui.getCore().byId("idStd_Cost_EstTitle") === undefined &&
			sap.ui.getCore().byId("idValuationCoreTitle") === undefined &&
			sap.ui.getCore().byId("idValuationCoreTitle") === undefined) {
			sap.ui.getCore().byId("matvaluationForm").destroy();
		}
		if (sap.ui.getCore().byId("Plant_Val_Cur") === undefined &&
			sap.ui.getCore().byId("Plant_Lifo_Datat") === undefined &&
			sap.ui.getCore().byId("Plant_Det_Low_Val") === undefined &&
			sap.ui.getCore().byId("matvaluationdetailForm") !== undefined &&
			sap.ui.getCore().byId("Matvalacnt") !== undefined) {
			sap.ui.getCore().byId("matvaluationdetailForm").destroy();
			sap.ui.getCore().byId("Matvalacnt").destroy();
		}
	}
	},
	//valuation detail data binding for both create and change scenario
	getSetValDetailData: function(vBwkey, vBwtar, sRowValId, oDtlCntrlr, vNewval) {
            //getting the detail data passing the valuation type and plant
		var aValAreaAcntResult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getValuationAcntData(vBwkey, vBwtar);
		//getting s3 instance for callin the extension maethod in matledger and matledger price template
		this.oS3Controller = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
		//binding data for account and general dat
		var oValuationModel = new sap.ui.model.json.JSONModel();
		oValuationModel.setData(aValAreaAcntResult.data.__batchResponses[0].data.MBEWVALUA2MBEWVALCTNGRel);
		//binding data for material ledger period and price
		sap.ui.getCore().byId("matvaluationdetailForm").setModel(oValuationModel);
		sap.ui.getCore().byId("matvaluationForm").setModel(oValuationModel);
		//if create scenario no need to bold
		if (aValAreaAcntResult.data.__batchResponses[0].data.MBEWVALUA2MBEWVALCTNGRel.ChangeData.results !== undefined) {
			this.setBoldValData(aValAreaAcntResult.data.__batchResponses[0].data.MBEWVALUA2MBEWVALCTNGRel, vNewval);
		}
		//hiding the section without data
		this.hideValuationDataSection(oDtlCntrlr);
		//data bindind for material ledger period table
		if (aValAreaAcntResult.data.__batchResponses[0].data.MBEWVALUA2MBEWMLVALRel.results.length > 0) {
			var oTable = sap.ui.getCore().byId("Matledgerper");
			// Table Personalization for Valuation Ledger Period
			this.setValuationTablePersonalization("Matledgerper","/results");                         
			var oValTableModel = new sap.ui.model.json.JSONModel();
			oValTableModel.setData(aValAreaAcntResult.data.__batchResponses[0].data.MBEWVALUA2MBEWMLVALRel);
			var oItemTemp = this.createMatLedgerPerTemplate(oValTableModel); // Get the item template
			oTable.setModel(oValTableModel);
			oTable.bindItems('/results', oItemTemp, '', '');
		} else {
			if (sap.ui.getCore().byId("Matledgerper") !== undefined) {
				sap.ui.getCore().byId("Matledgerper").destroy();
			}
		}
	//data bindind for material ledger price table
		if (aValAreaAcntResult.data.__batchResponses[0].data.MBEWVALUA2MBEWMLACRel.results.length > 0) {
			var oMatLedPerTable = sap.ui.getCore().byId("Matplantledgerprice");
			// Table Personalization for Valuation Ledger Price
			this.setValuationTablePersonalization("Matplantledgerprice","/results"); 
			var oMatLedPerTableModel = new sap.ui.model.json.JSONModel();
			oMatLedPerTableModel.setData(aValAreaAcntResult.data.__batchResponses[0].data.MBEWVALUA2MBEWMLACRel);
			var oItemMatLedPriceTemp = this.createMatLedgerPriceTemplate(oMatLedPerTableModel); // Get the item template
			oMatLedPerTable.setModel(oMatLedPerTableModel);
			oMatLedPerTable.bindItems('/results', oItemMatLedPriceTemp, '', '');
		} else {
			if (sap.ui.getCore().byId("Matplantledgerprice") !== undefined) {
				sap.ui.getCore().byId("Matplantledgerprice").destroy();
			}
		}
	},
	setBoldValData: function(aValuationRslt, vNewval) {
		if (vNewval !== "Added" && vNewval !== "Deleted") {
			var sStyleClass = "text_bold";
			for (var k = 0; k < aValuationRslt.ChangeData.results.length; k++) { // loop at changedata and create log
			if(aValuationRslt.ChangeData.results[k].EntityAction==="U"){
				var sLabelName = "Lbl_" + aValuationRslt.ChangeData.results[k].Attribute;
				var oLblIns = sap.ui.getCore().byId(sLabelName);
				if (oLblIns !== undefined) {
					oLblIns.setDesign("Bold");
				}
				var sTextName = "Txt_" + aValuationRslt.ChangeData.results[k].Attribute;
				if (sap.ui.getCore().byId(sTextName) !== undefined) {
					sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
				}
			}
		}
		}

	},
	getValDetailData: function() {
		return this.aValChangedData;
	},
	getNewValue: function(vEntityAction) {
		
		var vFlag = 0;
		if (vEntityAction === 'C') {
			this.vNewValChng = "Added";
			this.vOldValChng = "";
			vFlag = 1;
		}
		if (vEntityAction === 'D') {
			this.vNewValChng = "Deleted";
			this.vOldValChng = "";
			vFlag = 1;
		}
		return vFlag;
	},
	setValuationTablePersonalization: function(vTblId,oItem){
	// function to set the Table Personalization for various tables in Plant - Valuation Ledger Price and Valuation Ledger Period
		var oMatPlantAllTabl = sap.ui.getCore().byId(vTblId);
		var oMatTablPersButton;		
		switch (vTblId){
			case "Matledgerper":
				{
					oMatTablPersButton = sap.ui.getCore().byId("PlantMatledgerpersIcon");
					break;
				}
			case "Matplantledgerprice":
				{
					oMatTablPersButton = sap.ui.getCore().byId("PlantMatplantledgerpricepersIcon");
					break;
				}	
		}// end switch
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oItem, oMatPlantAllTabl, oMatTablPersButton);
	}
};