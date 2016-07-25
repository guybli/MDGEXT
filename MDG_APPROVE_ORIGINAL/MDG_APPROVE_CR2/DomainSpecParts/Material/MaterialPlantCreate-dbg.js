/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate = {

	oMaterialPlantTable: "",
	oMaterialPlantForm: "",
	vNoDataTxt: "",
	vBaseUom: "",
	vBaseUomDesc: "",
	oS3Controller: "",
	vCPlant: "",
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	// Load Plant Layout in s3
	initializePlantTabl: function(aResult, oS3ControllerCrt) {
		this.oS3Controller = oS3ControllerCrt;
		this.vNoDataTxt = this.i18n.getText("NodataCreate");
		// Load table if more than one plant exist	
		if (aResult.MATERIAL2MARCBASICRel.results.length > 1) {
			if (this.oMaterialPlantTable === "") {
				this.oMaterialPlantTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialPlantCreate', fcg.mdg.approvecrv2.util.Formatter);
			} else {
				this.oMaterialPlantTable.destroy();
				this.oMaterialPlantTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialPlantCreate', fcg.mdg.approvecrv2.util.Formatter);
			}
			sap.ui.getCore().byId("matCreatePlantDataLayout").removeAllContent();
			sap.ui.getCore().byId("matCreatePlantDataLayout").addContent(this.oMaterialPlantTable);
		} else { // Load Plant detail fragment in s3 if only single plant exists
			if (this.oMaterialPlantForm === "") {
				this.oMaterialPlantForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialPlantDetails', fcg.mdg.approvecrv2.util.Formatter);
			} else {
				this.oMaterialPlantForm.destroy();
				this.oMaterialPlantForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialPlantDetails', fcg.mdg.approvecrv2.util.Formatter);
			}
			sap.ui.getCore().byId("matCreatePlantDataLayout").removeAllContent();
			sap.ui.getCore().byId("matCreatePlantDataLayout").addContent(this.oMaterialPlantForm);
			this.checkPanelVisibleFlag(); // check and set the visibility flag for Panels
		}
		if (sap.ui.getCore().byId("matChangePlantDataLayout") !== undefined) {
			sap.ui.getCore().byId("matChangePlantDataLayout").destroy();
		}
	},

	//	set visibility flag
	checkPanelVisibleFlag: function() {
		//CHECKING FOR MRP panel HIDE/UNHIDE
		var vMrpVisbleFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('D');
		this.destroyPanel(vMrpVisbleFlag, "MatReqPlanningPanel");
		//CHECKING FOR Forecasting panel HIDE/UNHIDE
		var vFrcstVisbleFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('P');
		this.destroyPanel(vFrcstVisbleFlag, "MatForecastingPanel");
		//CHECKING FOR QM panel HIDE/UNHIDE
		var vQMVisbleFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('Q');
		this.destroyPanel(vQMVisbleFlag, "MatQltyMngmntPanel");
		//CHECKING FOR Work Scheduling panel HIDE/UNHIDE
		var vWsVisbleFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('A');
		this.destroyPanel(vWsVisbleFlag, "MatWorkSchdlngPanel");
	},
	// destroy panels based on the visibility flag
	destroyPanel: function(vPanelFlag, vPanelId) {
		if (vPanelFlag === false && sap.ui.getCore().byId(vPanelId) !== undefined) {
			sap.ui.getCore().byId(vPanelId).destroy();
		}
	},

	// Bind data to plant table frgment or plant detail fragment 
	displayPlantData: function(aResult, oView) {
		var oDataItems;
		var aPlantResults = {
			dataitems: []
		};
		// If more than one plant exist then display it in s3 in a table
		if (aResult.MATERIAL2MARCBASICRel.results.length > 1) {

			for (var i = 0; i < aResult.MATERIAL2MARCBASICRel.results.length; i++) {

				var plant = aResult.MATERIAL2MARCBASICRel.results[i].WERKS;
				var planttxt = aResult.MATERIAL2MARCBASICRel.results[i].WERKS__TXT;
				var matstatus = aResult.MATERIAL2MARCBASICRel.results[i].MMSTA;
				var matstatustxt = aResult.MATERIAL2MARCBASICRel.results[i].MMSTA__TXT;
				plant = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(plant, planttxt);
				matstatus = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(matstatus, matstatustxt);
				oDataItems = {
					"plant": plant,
					"matstatus": matstatus
				};
				// Controller hook for multiple Plants table binding with parameter aResult, oDataItems, return oDataItems
				var extPlantTableData = this.oS3Controller.matHookModifyBindPlantTable(oDataItems, aResult);
				if (extPlantTableData !== undefined) {
					oDataItems = extPlantTableData;
				}
				aPlantResults.dataitems.push(oDataItems);
			}
			// Plant Table Personalization
			// get the table control and the button control
			var oplntTabl = sap.ui.getCore().byId("MatPlantTable");
			var oPlantPersButton = sap.ui.getCore().byId("PlantpersIcon");
			var oItem = "/dataitems";
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oItem, oplntTabl, oPlantPersButton);
			var oplantModel = new sap.ui.model.json.JSONModel();
			oplantModel.setData(aPlantResults);
			var oplantTemp = this.createPlantTableTemplate(); // create table template for plant
			oplantTemp.attachPress({ // attach press event for table items
				Entity: aResult,
				name: "matPlantDataDetail"
			}, oView.navtoSubDetail, oView);
			oplntTabl.setModel(oplantModel);
			oplntTabl.bindItems('/dataitems', oplantTemp, '', ''); // bind data to plant table
		} else if (aResult.MATERIAL2MARCBASICRel.results.length === 1) { // If only one plant exists then display plant details in s3 in form
			var Plant = aResult.MATERIAL2MARCBASICRel.results[0].WERKS;
			var Material = aResult.MATERIAL2MARCBASICRel.results[0].MATERIAL;
			var vPlantTxt = aResult.MATERIAL2MARCBASICRel.results[0].WERKS__TXT;
			vPlantTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(Plant, vPlantTxt);
			vPlantTxt = this.i18n.getText("plant") + ": " + vPlantTxt;
			sap.ui.getCore().byId("Txt_WERKS").setText(vPlantTxt); // Set title incase Single Plant
			var plantResults = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getPlantDetailsData(oView, Plant, Material);
			var oPlantDetailModel = new sap.ui.model.json.JSONModel();
			var pResult = plantResults[0].data;
			oPlantDetailModel.setData(pResult);
			sap.ui.getCore().byId("matPlantDataForm").setModel(oPlantDetailModel);
			sap.ui.getCore().byId("matPlantSalesForm").setModel(oPlantDetailModel);
			sap.ui.getCore().byId("matPlantFtrdForm").setModel(oPlantDetailModel);
			sap.ui.getCore().byId("matPlantPurchForm").setModel(oPlantDetailModel);
			// set Base unit of measure
			var oBaseUom = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
			this.vBaseUom = oBaseUom.data.MEINS;
			this.vBaseUomDesc = oBaseUom.data.MEINS__TXT;
			if (sap.ui.getCore().byId("Txt_VBAMG").getVisible() !== false) {
				this.setQtyWithUnit(this.vBaseUom, this.vBaseUomDesc, "Txt_VBAMG");
			}
			// set Material Tax indicator value to the form
			if (plantResults[1].data.MARCBASIC2MLANPURCHRel.results.length > 0) {
				var vMatTaxInd = plantResults[1].data.MARCBASIC2MLANPURCHRel.results[0].TAIPURTAX;
				if (vMatTaxInd !== "") {
					var vMatTaxIndTxt = plantResults[1].data.MARCBASIC2MLANPURCHRel.results[0].TAIPURTAX__TXT;
					vMatTaxInd = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vMatTaxInd, vMatTaxIndTxt);
					sap.ui.getCore().byId("Txt_TAIPURTAX").setText(vMatTaxInd);
				} else {
					sap.ui.getCore().byId("Txt_TAIPURTAX").setVisible(false);
				}
			} else {
				sap.ui.getCore().byId("Txt_TAIPURTAX").setVisible(false);
			}
			this.hidePlantGnrlDataSection();
		} else { // if no plant found, display no data maintained
			var vNodat = sap.ui.getCore().byId("matCreatePlantDataLayout");
			var vNodata = this.i18n.getText("vNodata");
			var vLayout = new sap.m.VBox({
				items: [new sap.m.Text(),
					new sap.m.Text({
						text: vNodata
					}),
					new sap.m.Text()
				]
			});
			vLayout.setAlignItems("Center");
			vLayout.setJustifyContent("Center");
			vNodat.destroyContent();
			vNodat.addContent(vLayout);
		}
	},

	bindPanelData: function(aResult, vPanelId, oView) {
		var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
		if (this.oS3Controller === undefined || this.oS3Controller === "") {
			this.oS3Controller = oS3Instance;
		}
		this.vNoDataTxt = this.i18n.getText("NodataCreate");
		var oBaseUom = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
		this.vBaseUom = oBaseUom.data.MEINS;
		this.vBaseUomDesc = oBaseUom.data.MEINS__TXT;
		switch (vPanelId) {
			case "MatReqPlanningPanel": // Plant - Material requirement Planning panel is expanded
				this.getSetPlantPanelData(aResult, "", vPanelId, oView); // get the data and bind it to the forms and table
				break;
			case "MatForecastingPanel": // Plant - Forecasting panel is expanded
				this.getSetPlantPanelData(aResult, "MatPlantFrcstForm", vPanelId, oView); // get the data and bind it to the form
				break;
			case "MatQltyMngmntPanel": // Plant - Quality management panel is expanded
				var oDataItems, vActiveTxt;
				var aInspResults = {
					dataitems: []
				};
				for (var i = 0; i < aResult.length; i++) {
					if (i === 0) { // Bind data to QM Form
						if (aResult[i].data !== null) {
							var QMresult = aResult[i].data;
							var oQMModel = new sap.ui.model.json.JSONModel();
							oQMModel.setData(QMresult);
							sap.ui.getCore().byId("MatQMForm").setModel(oQMModel);
							if (QMresult.ChangeData.results !== undefined) {
								var vCrtdPlant = oView.getCreatedPlantFlag();
								if (vCrtdPlant !== "X") {
									fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(QMresult, vPanelId);
								}
							}
							this.hidePlantS4Title(vPanelId); // hide the QM Panel sections for which no data is found
						} else {
							sap.ui.getCore().byId("MatQMForm").setVisible(false);
						}
					}
					if (i === 1) { // Bind data to Inspection Setup Table
						if (aResult[i].data.MARCBASIC2QMATBASICRel.results.length > 0) {
							if (this.oS3Controller.sAction === "CREATE" || vCrtdPlant === "X") {
								for (var k = 0; k < aResult[i].data.MARCBASIC2QMATBASICRel.results.length; k++) {
									var vInspctnTyp = aResult[i].data.MARCBASIC2QMATBASICRel.results[k].ART;
									var vInspctnTypTxt = aResult[i].data.MARCBASIC2QMATBASICRel.results[k].ART__TXT;
									var vPrefInsTyp = aResult[i].data.MARCBASIC2QMATBASICRel.results[k].APA__TXT;
									var vActive = aResult[i].data.MARCBASIC2QMATBASICRel.results[k].AKTIV;
									if (vActive === "") {
										vActiveTxt = "(" + this.i18n.getText("CC_NOT_MAIN") + ")";
									} else {
										vActiveTxt = fcg.mdg.approvecrv2.util.Formatter.checkBox(vActive);
									}
									vInspctnTyp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vInspctnTyp, vInspctnTypTxt);

									var oDataItems = {
										"inspctTyp": vInspctnTyp,
										"prefInspctTyp": vPrefInsTyp,
										"active": vActiveTxt
									};
									// Controller hook for Inspection Setup table binding with parameter aResult, oDataItems, return oDataItems
									var extInsTypTableData = this.oS3Controller.matHookModifyBindInspTypTable(oDataItems, aResult);
									if (extInsTypTableData !== undefined) {
										oDataItems = extInsTypTableData;
									}
									aInspResults.dataitems.push(oDataItems);
								}
								var oInspctnTemp = this.createInspctnTemplate();
								this.bindPlantTablesData(aInspResults, oView, "MatInspectnSetup", oInspctnTemp, "matInsTypDetail");
								// var oInspctnTabl = sap.ui.getCore().byId("MatInspectnSetup");
								// var oInspctnModel = new sap.ui.model.json.JSONModel();
								// oInspctnModel.setData(aInspResults);
								// var oInspctnTemp = this.createInspctnTemplate();
								// oInspctnTemp.attachPress({
								// 	// Entity: aResult[i].data,
								// 	name: "matInsTypDetail"
								// }, oView.navtoSubDetail, oView);
								// oInspctnTabl.setModel(oInspctnModel);
								// oInspctnTabl.bindItems('/inspectItems', oInspctnTemp, '', '');
							} else if (this.oS3Controller.sAction === "CHANGE" && vCrtdPlant !== "X") {
								var oChResults = aResult[i].data.MARCBASIC2QMATBASICRel;
								var oInspTypModel = new sap.ui.model.json.JSONModel();
								oInspTypModel.setData(oChResults);
								var oChInspTemp = this.changeInspctnTemplate(oInspTypModel);
								this.bindPlantChTablesData(oView, "MatInspectnSetup", oChInspTemp, oInspTypModel, "matInsTypDetail");
							}
						} else {
							sap.ui.getCore().byId("MatInspectnSetup").setVisible(false);
						}
					}
				}
				if (sap.ui.getCore().byId("MatQMForm").getVisible() === false &&
					sap.ui.getCore().byId("MatInspectnSetup").getVisible() === false) {
					var panelsc = sap.ui.getCore().byId("MatQltyMngmntPanel");
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(panelsc, this.vNoDataTxt);
				}
				break;
			case "MatWorkSchdlngPanel": // Plant - Work Scheduling panel is expanded
				this.getSetPlantPanelData(aResult, "MatWorkSchdlngForm", vPanelId, oView); // get the data and bind it to the form
				break;
			case "MatStrgCstngPanel": // Plant - Storage and Costing panel is expanded
				this.getSetPlantPanelData(aResult, "", vPanelId, oView); // get the data and bind it to the forms and table
				break;
			case "MatValuationPanel": // Plant - valuation panel is expanded
				this.getSetPlantPanelData(aResult, "", vPanelId, oView); // get the data and bind it to the forms and table 
				break;
		}
		//Controller hook for panel data in S3 controller with paramter aresult, panelid and oView
		this.oS3Controller.matHookModifyPlantbindPanelData(vPanelId, oView, aResult);
	},

	// Bind data to the respective contents of panel expanded	
	getSetPlantPanelData: function(aPanelRslt, vFormId, vPlantPanelId, oPlantDtlView) {
		var oItem; // variable needed for Table Personalization
		var oDataItems;
		var ostrResults = {
			dataitems: []
		};
		//  Bind data to MRP panel Forms and table			
		switch (vPlantPanelId) {
			case "MatReqPlanningPanel":
				for (var i = 0; i < aPanelRslt.length; i++) {
					if (i === 0) { // get and set the data to the forms of MRP Panel 
						if (aPanelRslt[i].data !== null) {
							var MRPresult = aPanelRslt[i].data;
							var oMRPModel = new sap.ui.model.json.JSONModel();
							oMRPModel.setData(MRPresult);
							if (sap.ui.getCore().byId("MatPlntReqForm") !== undefined) {
								sap.ui.getCore().byId("MatPlntReqForm").setModel(oMRPModel);
							}
							if (sap.ui.getCore().byId("Txt_BSTMI").getVisible() !== false) {
								this.setQtyWithUnit(this.vBaseUom, this.vBaseUomDesc, "Txt_BSTMI");
							}
							if (sap.ui.getCore().byId("Txt_BSTMA").getVisible() !== false) {
								this.setQtyWithUnit(this.vBaseUom, this.vBaseUomDesc, "Txt_BSTMA");
							}
							if (sap.ui.getCore().byId("Txt_BSTFE").getVisible() !== false) {
								this.setQtyWithUnit(this.vBaseUom, this.vBaseUomDesc, "Txt_BSTFE");
							}
							if (sap.ui.getCore().byId("Txt_BSTRF").getVisible() !== false) {
								this.setQtyWithUnit(this.vBaseUom, this.vBaseUomDesc, "Txt_BSTRF");
							}
							if (sap.ui.getCore().byId("Txt_MABST").getVisible() !== false) {
								this.setQtyWithUnit(this.vBaseUom, this.vBaseUomDesc, "Txt_MABST");
							}
							if (MRPresult.ChangeData.results !== undefined) { // if change data exist
								var vCrtdPlant = oPlantDtlView.getCreatedPlantFlag(); // check if plant is created or changed
								if (vCrtdPlant !== 'X') {
									fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(MRPresult, vPlantPanelId);
								}
							}
							this.hidePlantS4Title(vPlantPanelId); // hide the MRP Panel sections for which no data is found
						} else {
							sap.ui.getCore().byId("MatPlntReqForm").setVisible(false);
						}
					}
					if (i === 1) { // get and set the data to the MRP text table of MRP Panel 
						if (aPanelRslt[i].data.TXTMRP !== "") {
							var oMrpTxtTemp;
							// if (this.oS3Controller.sAction === "CREATE" || vCrtdPlant === "X") {
							var mrptxt = aPanelRslt[i].data.TXTMRP;
							oDataItems = {
								"mrptxt": mrptxt
							};
							ostrResults.dataitems.push(oDataItems);
							// Controller hook for Mrp text table binding with parameter aPanelRslt, oDataItems, return oDataItems
							var extPlantMrpTxt = this.oS3Controller.matHookModifyBindMrpTxtTable(oDataItems, aPanelRslt);
							if (extPlantMrpTxt !== undefined) {
								oDataItems = extPlantMrpTxt;
							}
							var oMrpTxttable = sap.ui.getCore().byId("MatMrpTxttable");
							var oMrpTxtModel = new sap.ui.model.json.JSONModel();
							oMrpTxtModel.setData(ostrResults);
							if (this.oS3Controller.sAction === "CREATE" || vCrtdPlant === "X") {
								oMrpTxtTemp = this.createMrpTxtTemplate();
							} else if (this.oS3Controller.sAction === "CHANGE" && vCrtdPlant !== "X") {
								var oChResults = aPanelRslt[i];
								var oMrpTxtModl = new sap.ui.model.json.JSONModel();
								oMrpTxtModl.setData(oChResults);
								oMrpTxtTemp = this.changeMrpTxtTemplate(oMrpTxtModl);
							}
							oMrpTxtTemp.attachPress({ // attach press event for MRP Text table to navigate to S5
								Entity: aPanelRslt[i].data,
								name: "matPlantMrpTextDetail"
							}, oPlantDtlView.navtoSubDetail, oPlantDtlView);
							oMrpTxttable.setModel(oMrpTxtModel);
							oMrpTxttable.bindItems('/dataitems', oMrpTxtTemp, '', ''); // bind data to MRP text table
							// } 	else if (this.oS3Controller.sAction === "CHANGE" && vCrtdPlant !== "X") {
							// 	var oChResults = aPanelRslt[i];
							// 	var oMrpTxtModl = new sap.ui.model.json.JSONModel();
							// 	oMrpTxtModl.setData(oChResults);
							// 	var oChMrpTxtTemp = this.changeMrpTxtTemplate(oMrpTxtModl);
							// 	var oChMrptxtTbl = sap.ui.getCore().byId("MatMrpTxttable");
							// 	oChMrpTxtTemp.attachPress({ // attach press event for MRP Text table to navigate to S5
							// 		Entity: aPanelRslt[i].data,
							// 		name: "matPlantMrpTextDetail"
							// 	}, oPlantDtlView.navtoSubDetail, oPlantDtlView);
							// 	oChMrptxtTbl.setModel(oMrpTxtModl);
							// 	oChMrptxtTbl.bindItems('/data', oChMrpTxtTemp, '', '');
							// 	}
						} else {
							sap.ui.getCore().byId("MatMrpTxttable").setVisible(false);
						}
					}
					if (i === 2) { // Bind data to MRP Area Table
						if (aPanelRslt[i].data.MARCBASIC2MDMABASICRel.results.length > 0) {
							ostrResults = {
								dataitems: []
							};
							if (this.oS3Controller.sAction === "CREATE" || vCrtdPlant === "X") {
								for (var k = 0; k < aPanelRslt[i].data.MARCBASIC2MDMABASICRel.results.length; k++) {
									var vMrpArea = aPanelRslt[i].data.MARCBASIC2MDMABASICRel.results[k].BERID;
									var vMrpAreaTxt = aPanelRslt[i].data.MARCBASIC2MDMABASICRel.results[k].BERID__TXT;
									vMrpAreaTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vMrpArea, vMrpAreaTxt);
									var vMrpGrp = aPanelRslt[i].data.MARCBASIC2MDMABASICRel.results[k].DGRMDMA;
									var vMrpGrpTxt = aPanelRslt[i].data.MARCBASIC2MDMABASICRel.results[k].DGRMDMA__TXT;
									vMrpGrpTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vMrpGrp, vMrpGrpTxt);
									oDataItems = {
										"MrpArea": vMrpAreaTxt,
										"MrpGroup": vMrpGrpTxt
									};
									// Controller hook for Mrp Area table binding with parameter aPanelRslt, oDataItems, return oDataItems
									var extPlantMrpArea = this.oS3Controller.matHookModifyBindMrpAreaTable(oDataItems, aPanelRslt);
									if (extPlantMrpArea !== undefined) {
										oDataItems = extPlantMrpArea;
									}
									ostrResults.dataitems.push(oDataItems);
								}
								var oMrpAreaTemp = this.createMrpAreaTemplate();
								this.bindPlantTablesData(ostrResults, oPlantDtlView, "MatMrpAreaTable", oMrpAreaTemp, "matMrpAreaDetail");
								// var oMrpAreaTabl = sap.ui.getCore().byId("MatMrpAreaTable");
								// var oMrpAreaModel = new sap.ui.model.json.JSONModel();
								// oMrpAreaModel.setData(ostrResults);
								// var oMrpAreaTemp = this.createMrpAreaTemplate();
								// oMrpAreaTemp.attachPress({
								// 	name: "matMrpAreaDetail"
								// }, oPlantDtlView.navtoSubDetail, oPlantDtlView);
								// oMrpAreaTabl.setModel(oMrpAreaModel);
								// oMrpAreaTabl.bindItems('/dataitems', oMrpAreaTemp, '', '');
							} else if (this.oS3Controller.sAction === "CHANGE" && vCrtdPlant !== "X") {
								var oChResults = aPanelRslt[i].data.MARCBASIC2MDMABASICRel;
								var oMrpArModel = new sap.ui.model.json.JSONModel();
								oMrpArModel.setData(oChResults);
								var oChMrpArTemp = this.changeMrpAreaTemplate(oMrpArModel);
								this.bindPlantChTablesData(oPlantDtlView, "MatMrpAreaTable", oChMrpArTemp, oMrpArModel, "matMrpAreaDetail");
							}
						} else {
							sap.ui.getCore().byId("MatMrpAreaTable").setVisible(false);
						}
					}
					if (i === 3) { // Bind data to production Version Table
						if (aPanelRslt[i].data.MARCBASIC2MKALBASICRel.results.length > 0) {
							ostrResults = {
								dataitems: []
							};
							if (this.oS3Controller.sAction === "CREATE" || vCrtdPlant === "X") {
								for (var m = 0; m < aPanelRslt[i].data.MARCBASIC2MKALBASICRel.results.length; m++) {
									// var vEntActn = "X";
									var vPrdVrsn = aPanelRslt[i].data.MARCBASIC2MKALBASICRel.results[m].MKALBASIC;
									var vValidFrm = aPanelRslt[i].data.MARCBASIC2MKALBASICRel.results[m].ADATUMKAL;
									vValidFrm = fcg.mdg.approvecrv2.util.Formatter.matDateFormat(vValidFrm);
									var vValidTo = aPanelRslt[i].data.MARCBASIC2MKALBASICRel.results[m].BDATUMKAL;
									vValidTo = fcg.mdg.approvecrv2.util.Formatter.matDateFormat(vValidTo);
									var vRptvMnfAlwd = aPanelRslt[i].data.MARCBASIC2MKALBASICRel.results[m].SERKZMKAL;
									vRptvMnfAlwd = fcg.mdg.approvecrv2.util.Formatter.checkBox(vRptvMnfAlwd);
									// if(aPanelRslt[i].data.MARCBASIC2MKALBASICRel.results[m].ChangeData !== undefined && 
									// aPanelRslt[i].data.MARCBASIC2MKALBASICRel.results[m].ChangeData.results !== undefined &&
									// aPanelRslt[i].data.MARCBASIC2MKALBASICRel.results[m].ChangeData.results.length > 0){
									// 	vEntActn = aPanelRslt[i].data.MARCBASIC2MKALBASICRel.results[m].ChangeData.results[0].EntityAction;
									// }
									oDataItems = {
										"PrdVrsn": vPrdVrsn,
										"ValidFrm": vValidFrm,
										"ValidTo": vValidTo,
										"RptvMnfAlwd": vRptvMnfAlwd
										// "EntActn": vEntActn
									};
									// Controller hook for Production Version table binding with parameter aPanelRslt, oDataItems, return oDataItems
									var extPlantPrdVer = this.oS3Controller.matHookModifyBindPrdVerTable(oDataItems, aPanelRslt);
									if (extPlantPrdVer !== undefined) {
										oDataItems = extPlantPrdVer;
									}
									ostrResults.dataitems.push(oDataItems);
								}
								var oPrdVrsnTemp = this.createPrdVrsnTemplate();
								this.bindPlantTablesData(ostrResults, oPlantDtlView, "MatPrdVrsnTable", oPrdVrsnTemp, "matPrdVrsnDetail");
								// var oPrdVrsnTabl = sap.ui.getCore().byId("MatPrdVrsnTable");
								// var oPrdVrsnModel = new sap.ui.model.json.JSONModel();
								// oPrdVrsnModel.setData(ostrResults);
								// var oPrdVrsnTemp = this.createPrdVrsnTemplate();
								// oPrdVrsnTemp.attachPress({
								// 	name: "matPrdVrsnDetail"
								// }, oPlantDtlView.navtoSubDetail, oPlantDtlView);
								// oPrdVrsnTabl.setModel(oPrdVrsnModel);
								// oPrdVrsnTabl.bindItems('/dataitems', oPrdVrsnTemp, '', '');
							} else if (this.oS3Controller.sAction === "CHANGE" && vCrtdPlant !== "X") {
								var oChResults = aPanelRslt[i].data.MARCBASIC2MKALBASICRel;
								var oPrdVrsnModel = new sap.ui.model.json.JSONModel();
								oPrdVrsnModel.setData(oChResults);
								var oChPrdVrsnTemp = this.changePrdVrsnTemplate(oPrdVrsnModel);
								this.bindPlantChTablesData(oPlantDtlView, "MatPrdVrsnTable", oChPrdVrsnTemp, oPrdVrsnModel, "matPrdVrsnDetail");
								// var oPrdVrsnTabl = sap.ui.getCore().byId("MatPrdVrsnTable");
								// var oPrdVrsnModel = new sap.ui.model.json.JSONModel();
								// oPrdVrsnModel.setData(ostrResults);
								// var oPrdVrsnTemp = this.createPrdVrsnTemplate();
								// oPrdVrsnTemp.attachPress({
								// 	name: "matPrdVrsnDetail"
								// }, oPlantDtlView.navtoSubDetail, oPlantDtlView);
								// oPrdVrsnTabl.setModel(oPrdVrsnModel);
								// oPrdVrsnTabl.bindItems('/results', oPrdVrsnTemp, '', '');
							}
						} else {
							sap.ui.getCore().byId("MatPrdVrsnTable").setVisible(false);
						}
					}
				}
				if (sap.ui.getCore().byId("MatPlntReqForm").getVisible() === false &&
					sap.ui.getCore().byId("MatMrpAreaTable").getVisible() === false &&
					sap.ui.getCore().byId("MatPrdVrsnTable").getVisible() === false &&
					sap.ui.getCore().byId("MatMrpTxttable").getVisible() === false) {
					var panelmrp = sap.ui.getCore().byId("MatReqPlanningPanel");
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(panelmrp, this.vNoDataTxt);
				}
				break;
				// }
			case "MatValuationPanel": //  Bind data to VALUATION panel Forms and table
				if(aPanelRslt.data.__batchResponses[0].data.MARCBASIC2MBEWCSTNGRel.results.length>0 || aPanelRslt.data.__batchResponses[0].data.MARCBASIC2MBEWVALUARel.results.length>0)
			{
				// if (oPlantDtlView.os4view === undefined  && oPlantDtlView.sAction === "CREATE") {
				// 	this.vCPlant = "X";
				// } else if (oPlantDtlView.os4view.sAction === "CHANGE") {
				// this.vCPlant = oPlantDtlView.getCreatedPlantFlag(); // check if plant is created or changed
				// } else if (oPlantDtlView.os4view.sAction === "CREATE") {
				// this.vCPlant = "X"; // check if plant is created or changed
				// }
				this.vCPlant = oPlantDtlView.getCreatedPlantFlag();
				var oValuationModel = new sap.ui.model.json.JSONModel();
				oValuationModel.setData(aPanelRslt.data.__batchResponses[0].data.MARCBASIC2MBEWCSTNGRel.results[0]);
				sap.ui.getCore().byId("MatValForm").setModel(oValuationModel);
				if (aPanelRslt.data.__batchResponses[0].data.MARCBASIC2MBEWCSTNGRel.results[0]!== undefined && aPanelRslt.data.__batchResponses[0].data.MARCBASIC2MBEWCSTNGRel.results[0].ChangeData.results !== undefined) {
					this.setBoldCostingData(aPanelRslt.data.__batchResponses[0].data.MARCBASIC2MBEWCSTNGRel);
				}
				this.hideCostingSection();
				try {
					sap.ui.getCore().byId("matCreatevalutionLayout").destroy();
				} catch (err) {}
				// Table Personalization for Valuation Area table
				var oTable = sap.ui.getCore().byId("MatValAreatable");
				oItem = "/results"; 
				this.setPlantTablePersonalization("MatValAreatable", oItem);
				// end Table Personalization for Valuation Area table
				var oValTableModel = new sap.ui.model.json.JSONModel();
				oValTableModel.setData(aPanelRslt.data.__batchResponses[0].data.MARCBASIC2MBEWVALUARel);
				var oItemTemp = this.GetValAreaTableTemplate(oValTableModel); // Get the item template
				oItemTemp.attachPress({
					Entity: aPanelRslt.data.__batchResponses[0].data.MARCBASIC2MBEWVALUARel,
					name: 'matValAreaDataDetail'
				}, oPlantDtlView.navtoSubDetail, oPlantDtlView);
				oTable.setModel(oValTableModel);
				oTable.bindItems('/results', oItemTemp, '', '');
			}
			else
			{
				 var oPanelVal = sap.ui.getCore().byId("MatValuationPanel");
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(oPanelVal, this.vNoDataTxt);
			}

				break;
			case "MatStrgCstngPanel": //  Bind data to Storage and costing panel Forms and table
				for (var i = 0; i < aPanelRslt.length; i++) {
					if (i === 0) { // Bind data to Storage Form
						if (aPanelRslt[i].data !== null) {
							var Strgresult = aPanelRslt[i].data;
							var oStrgModel = new sap.ui.model.json.JSONModel();
							oStrgModel.setData(Strgresult);
							sap.ui.getCore().byId("MatPlantCostingForm").setModel(oStrgModel, "abc");
							if (Strgresult.ChangeData.results !== undefined) {
								var vCrtdPlant = oPlantDtlView.getCreatedPlantFlag();
								if (vCrtdPlant !== 'X') {
									fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(Strgresult, vPlantPanelId);
								}
							}
						} else {
							if (sap.ui.getCore().byId("PlntStrgDta") !== undefined) {
								sap.ui.getCore().byId("PlntStrgDta").destroy();
							}
						}
					}

					if (i === 1) { // Bind data to Storage Location Table
						if (aPanelRslt[i].data.MARCBASIC2MARDRel.results.length > 0) {
							if (this.oS3Controller.sAction === "CREATE" || vCrtdPlant === "X") {
								for (var k = 0; k < aPanelRslt[i].data.MARCBASIC2MARDRel.results.length; k++) {

									var strgloc = aPanelRslt[i].data.MARCBASIC2MARDRel.results[k].LGORT;
									var strgloctxt = aPanelRslt[i].data.MARCBASIC2MARDRel.results[k].LGORT__TXT;
									var mrpind = aPanelRslt[i].data.MARCBASIC2MARDRel.results[k].DISKZ;
									var mrpindtxt = aPanelRslt[i].data.MARCBASIC2MARDRel.results[k].DISKZ__TXT;
									strgloc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(strgloc, strgloctxt);
									mrpind = fcg.mdg.approvecrv2.util.Formatter.description(mrpind, mrpindtxt);

									oDataItems = {
										"strgloc": strgloc,
										"mrpind": mrpind
									};
									// Controller hook for Storage Location table binding with parameter aPanelRslt, oDataItems, return oDataItems
									var extPlantStrgLoc = this.oS3Controller.matHookModifyBindStrgLocTable(oDataItems, aPanelRslt);
									if (extPlantPrdVer !== undefined) {
										oDataItems = extPlantStrgLoc;
									}
									ostrResults.dataitems.push(oDataItems);
								}
								var oStrgLocTabl = sap.ui.getCore().byId("MatStrgLoctable");
								// Storage Location Table Personalization during Plant Create
								oItem = "/dataitems";
								this.setPlantTablePersonalization("MatStrgLoctable",oItem);
								// end of Storage Location Table Personalization during Plant Create
								var oStrgLocModel = new sap.ui.model.json.JSONModel();
								oStrgLocModel.setData(ostrResults);
								var oStrgLocTemp = this.createStrgLocTemplate(oStrgLocModel);
								oStrgLocTemp.attachPress({
									Entity: aPanelRslt[i].data,
									name: "matStorageLocDetail"
								}, oPlantDtlView.navtoSubDetail, oPlantDtlView);
								oStrgLocTabl.setModel(oStrgLocModel);
								oStrgLocTabl.bindItems('/dataitems', oStrgLocTemp, '', '');
							} else if (this.oS3Controller.sAction === "CHANGE" && vCrtdPlant !== "X") {
								var oChRsults = aPanelRslt[i].data.MARCBASIC2MARDRel;
								var oMardModel = new sap.ui.model.json.JSONModel();
								oMardModel.setData(oChRsults);
								var oChStrglocTemp = this.changeStrgLocTemplate(oMardModel);
								var oMatPlantAllTabl = sap.ui.getCore().byId("MatStrgLoctable");
								// Storage Location Table Personalization during Plant Change
								oItem = "/results";
								this.setPlantTablePersonalization("MatStrgLoctable",oItem);
								// Storage Location Table Personalization during Plant Change
								oChStrglocTemp.attachPress({
									Entity: aPanelRslt[i].data,
									name: "matStorageLocDetail"
								}, oPlantDtlView.navtoSubDetail, oPlantDtlView);
								oMatPlantAllTabl.setModel(oMardModel);
								oMatPlantAllTabl.bindItems('/results', oChStrglocTemp, '', '');
							}
						} else {
							sap.ui.getCore().byId("MatStrgLoctable").setVisible(false);
						}
					}
					if (i === 2) { // Bind data to Costing Form
						if (aPanelRslt[i].data !== null) {
							var Cstngresult = aPanelRslt[i].data;
							var oCstngModel = new sap.ui.model.json.JSONModel();
							oCstngModel.setData(Cstngresult);
							sap.ui.getCore().byId("MatPlantCostingForm").setModel(oCstngModel);
							if (sap.ui.getCore().byId("Txt_LOSGR").getVisible() !== false) {
								this.setQtyWithUnit(this.vBaseUom, this.vBaseUomDesc, "Txt_LOSGR");
							}
							if (Cstngresult.ChangeData.results !== undefined) { // check if change data exist
								var vCrtdPlant = oPlantDtlView.getCreatedPlantFlag(); // check for created or changed plant
								if (vCrtdPlant !== 'X') {
									fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(Cstngresult, vPlantPanelId);
								}
							}
						} else {
							sap.ui.getCore().byId("MatPlantCostingForm").setVisible(false);
							if (sap.ui.getCore().byId("PlntCostng") !== undefined) {
								sap.ui.getCore().byId("PlntCostng").destroy();
							}
						}
					}
				}
				this.hidePlantS4Title(vPlantPanelId);
				if (
					// sap.ui.getCore().byId("MatStrgForm").getVisible() === false &&
					sap.ui.getCore().byId("MatPlantCostingForm").getVisible() === false &&
					sap.ui.getCore().byId("MatStrgLoctable").getVisible() === false) {
					var panelsc = sap.ui.getCore().byId("MatStrgCstngPanel");
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(panelsc, this.vNoDataTxt);
				}
				break;
			default:
				if (aPanelRslt.__batchResponses.length > 0) {
					var oPanelResult = aPanelRslt.__batchResponses[0].data;
					var oPanelModel = new sap.ui.model.json.JSONModel();
					oPanelModel.setData(oPanelResult);
					if (sap.ui.getCore().byId(vFormId) !== undefined) {
						sap.ui.getCore().byId(vFormId).setModel(oPanelModel);
						if (vPlantPanelId === "MatWorkSchdlngPanel" && sap.ui.getCore().byId("Txt_BASMG").getVisible() !== false) {
							this.setQtyWithUnit(this.vBaseUom, this.vBaseUomDesc, "Txt_BASMG");
						}
						if (oPanelResult.ChangeData.results !== undefined) { // Check if change data exist
							var vCrtdPlant = oPlantDtlView.getCreatedPlantFlag(); // check for created or changed plant
							if (vCrtdPlant !== 'X') {
								fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(oPanelResult, vPlantPanelId);
							}
						}
						this.hidePlantS4Title(vPlantPanelId);
					}
				} else {
					var oPanelContnt = sap.ui.getCore().byId(vPlantPanelId);
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(oPanelContnt, this.vNoDataTxt);
				}
		}
	},
	bindPlantTablesData: function(oStrRslts, oPlntDtlView, vTblId, oTablTemp, oRouter) {
		var oMatPlantAllTabl = sap.ui.getCore().byId(vTblId);
		var oMatPlantAllTablModel = new sap.ui.model.json.JSONModel();
		var oItem = "/dataitems";
		oMatPlantAllTablModel.setData(oStrRslts);
		oTablTemp.attachPress({
			name: oRouter
		}, oPlntDtlView.navtoSubDetail, oPlntDtlView);
		oMatPlantAllTabl.setModel(oMatPlantAllTablModel);
		oMatPlantAllTabl.bindItems('/dataitems', oTablTemp, '', '');
		// Table Personalization for the various Plant tables
		this.setPlantTablePersonalization(vTblId,oItem);
	},
	bindPlantChTablesData: function(oPlantDtlView, vTblId, oChTblTmp, oMatPlantAllTablModel, oRouter) {
		var oMatPlantAllTabl = sap.ui.getCore().byId(vTblId);
		var oItem = "/results";
		oChTblTmp.attachPress({
			name: oRouter
		}, oPlantDtlView.navtoSubDetail, oPlantDtlView);
		oMatPlantAllTabl.setModel(oMatPlantAllTablModel);
		oMatPlantAllTabl.bindItems('/results', oChTblTmp, '', '');
		// Table Personalization for MRPArea, Production Version and Inspection Type
		this.setPlantTablePersonalization(vTblId,oItem);
	},
	createPlantTableTemplate: function() { // table templete for plant
		var oPlantTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "plant"
					}
				}),
				new sap.m.Text({
					text: {
						path: "matstatus",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookcreatePlantTableTemplate(oPlantTemp);
		if (extoItemTemp !== undefined) {
			oPlantTemp = extoItemTemp;
		}
		return oPlantTemp;
	},

	createMrpTxtTemplate: function() { // table templete for plant MRP text
		var oMRPTxtTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "mrptxt",
						formatter: fcg.mdg.approvecrv2.util.Formatter.Truncate
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookcreateMrpTxtTemplate(oMRPTxtTemp);
		if (extoItemTemp !== undefined) {
			oMRPTxtTemp = extoItemTemp;
		}
		return oMRPTxtTemp;
	},

	changeMrpTxtTemplate: function(oMrpTxtMdl) { // table templete for plant MRP text Change
		var oMRPTxtTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "mrptxt",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantMrpTxtCellBolding(this, oMrpTxtMdl, "TXTMRP");
							var key = oMrpTxtMdl.oData.data.TXTMRP;
							return fcg.mdg.approvecrv2.util.Formatter.Truncate(key);
						}
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookChangeMrpTxtTemplate(oMRPTxtTemp, oMrpTxtMdl);
		if (extoItemTemp !== undefined) {
			oMRPTxtTemp = extoItemTemp;
		}
		return oMRPTxtTemp;
	},
	
	changeMrpAreaTemplate: function(oMrpAreaModl) {		// table templete for MRP Area Change
		var oMrpAreaTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "BERID",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oMrpAreaModl, "BERID");
							var key = oMrpAreaModl.getProperty("BERID", this.getBindingContext());
							var desc = oMrpAreaModl.getProperty("BERID__TXT", this.getBindingContext());
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
						path: "DGRMDMA",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oMrpAreaModl, "DGRMDMA");
							var key = oMrpAreaModl.getProperty("DGRMDMA", this.getBindingContext());
							var desc = oMrpAreaModl.getProperty("DGRMDMA__TXT", this.getBindingContext());
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
		var extoItemTemp = this.oS3Controller.matHookChangeMrpAreaTemplate(oMrpAreaTemp, oMrpAreaModl);
		if (extoItemTemp !== undefined) {
			oMrpAreaTemp = extoItemTemp;
		}
		return oMrpAreaTemp;
	},

	createMrpAreaTemplate: function() {		// table templete for MRP Area 
		var oMrpAreaTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "MrpArea"
					}
				}),
				new sap.m.Text({
					text: {
						path: "MrpGroup",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookcreateMrpAreaTemplate(oMrpAreaTemp);
		if (extoItemTemp !== undefined) {
			oMrpAreaTemp = extoItemTemp;
		}
		return oMrpAreaTemp;
	},

	changePrdVrsnTemplate: function(oPrdVrsnModel) {	// table templete for Production version Change
		var oPrdVerTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "MKALBASIC",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oPrdVrsnModel, "MKALBASIC");
							var key = oPrdVrsnModel.getProperty("MKALBASIC", this.getBindingContext());
							return key;
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "ADATUMKAL",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oPrdVrsnModel, "ADATUMKAL");
							var key = oPrdVrsnModel.getProperty("ADATUMKAL", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.matDateFormat(key);
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "BDATUMKAL",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oPrdVrsnModel, "BDATUMKAL");
							var key = oPrdVrsnModel.getProperty("BDATUMKAL", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.matDateFormat(key);
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "SERKZMKAL",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oPrdVrsnModel, "SERKZMKAL");
							var key = oPrdVrsnModel.getProperty("SERKZMKAL", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.checkBox(key);
							}
						}
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookChangePrdVrsnTemplate(oPrdVerTemp, oPrdVrsnModel);
		if (extoItemTemp !== undefined) {
			oPrdVerTemp = extoItemTemp;
		}
		return oPrdVerTemp;
	},
	createPrdVrsnTemplate: function() {		// table templete for Production version
		var oPrdVerTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "PrdVrsn"
					}
				}),
				new sap.m.Text({
					text: {
						path: "ValidFrm",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				}),
				new sap.m.Text({
					text: {
						path: "ValidTo",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				}),
				new sap.m.Text({
					text: {
						path: "RptvMnfAlwd",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				})
			]
		});

		var extoItemTemp = this.oS3Controller.matHookcreatePrdVrsnTemplate(oPrdVerTemp);
		if (extoItemTemp !== undefined) {
			oPrdVerTemp = extoItemTemp;
		}
		return oPrdVerTemp;
	},

	changeInspctnTemplate: function(oInspMdl) {		// table templete for Inspection Setup Change
		var oInsTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "ART",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oInspMdl, "ART");
							var key = oInspMdl.getProperty("ART", this.getBindingContext());
							var desc = oInspMdl.getProperty("ART__TXT", this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "APA__TXT",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oInspMdl, "APA");
							var key = oInspMdl.getProperty("APA__TXT", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return key;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "AKTIV",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oInspMdl, "AKTIV");
							var key = oInspMdl.getProperty("AKTIV", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.checkBox(key);
							}
						}
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookChangeInspctnTemplate(oInsTemp, oInspMdl);
		if (extoItemTemp !== undefined) {
			oInsTemp = extoItemTemp;
		}
		return oInsTemp;
	},

	createInspctnTemplate: function() {			// table templete for Inspection Setup
		var oInsTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "inspctTyp"
					}
				}),
				new sap.m.Text({
					text: {
						path: "prefInspctTyp",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				}),
				new sap.m.Text({
					text: {
						path: "active",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookcreateInspctnTemplate(oInsTemp);
		if (extoItemTemp !== undefined) {
			oInsTemp = extoItemTemp;
		}
		return oInsTemp;
	},

	changeStrgLocTemplate: function(oSLModl) { // table templete for storage location Change
		var oStrgTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "LGORT",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleStrgLocCellBolding(this, oSLModl, "LGORT", "MARDSTOR");
							var key = oSLModl.getProperty("LGORT", this.getBindingContext());
							var desc = oSLModl.getProperty("LGORT__TXT", this.getBindingContext());
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
						path: "DISKZ",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleStrgLocCellBolding(this, oSLModl, "DISKZ", "MARDMRP");
							var key = oSLModl.getProperty("DISKZ", this.getBindingContext());
							var desc = oSLModl.getProperty("DISKZ__TXT", this.getBindingContext());
							if (key === "" && desc === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.description(key, desc);
							}
						}
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookChangeStrgLocTemplate(oStrgTemp,oSLModl);
		if (extoItemTemp !== undefined) {
			oStrgTemp = extoItemTemp;
		}
		return oStrgTemp;
	},

	createStrgLocTemplate: function() { // table templete for storage location
		var oStrgTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "strgloc"
					}
				}),
				new sap.m.Text({
					text: {
						path: "mrpind",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookcreateStrgLocTemplate(oStrgTemp);
		if (extoItemTemp !== undefined) {
			oStrgTemp = extoItemTemp;
		}
		return oStrgTemp;
	},
	// Set Quantity with Unit and Description	
	setQtyWithUnit: function(vBaseUom, vBaseUomDesc, txtId) {
		var vBaseQty = sap.ui.getCore().byId(txtId).getText();
		var vBaseQtyUom = fcg.mdg.approvecrv2.util.Formatter.getUnitDesc(vBaseQty, vBaseUom, vBaseUomDesc);
		sap.ui.getCore().byId(txtId).setText(vBaseQtyUom);
	},
	// Hide sections for Plant Detail where no data exist 
	hidePlantS4Title: function(vPanelId) {
		switch (vPanelId) {
			case "MatQltyMngmntPanel": // Hide sections for Qualtiy management panel
				var extQMHidePanel = this.oS3Controller.matHookhidePlantQMPanelSection(); // Controller hook
				if (extQMHidePanel === false) {
					if (sap.ui.getCore().byId("Txt_PRFRQ").getVisible() === false &&
						sap.ui.getCore().byId("Txt_QMATA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MKZDKZ").getVisible() === false &&
						sap.ui.getCore().byId("qm_Central") !== undefined) {
						sap.ui.getCore().byId("qm_Central").destroy();
					}
					if (sap.ui.getCore().byId("Txt_QZGTP").getVisible() === false &&
						sap.ui.getCore().byId("Txt_QSSYS").getVisible() === false &&
						sap.ui.getCore().byId("Txt_SSQSS").getVisible() === false &&
						sap.ui.getCore().byId("PlntQltyMngmnt_Prcrmnt") !== undefined) {
						sap.ui.getCore().byId("PlntQltyMngmnt_Prcrmnt").destroy();
					}
					if (sap.ui.getCore().byId("qm_Central") === undefined &&
						sap.ui.getCore().byId("PlntQltyMngmnt_Prcrmnt") === undefined) {
						sap.ui.getCore().byId("MatQMForm").setVisible(false);
					}
				}
				break;
			case "MatForecastingPanel": // Hide sections for Forecasting panel
				var extFRHidePanel = this.oS3Controller.matHookhidePlantFRPanelSection(); // Controller hook
				if (extFRHidePanel === false) {
					if (sap.ui.getCore().byId("Txt_VRBDT").getVisible() === false &&
						sap.ui.getCore().byId("Txt_VRBFK").getVisible() === false &&
						sap.ui.getCore().byId("Txt_VRBMT").getVisible() === false &&
						sap.ui.getCore().byId("Txt_VRBWK").getVisible() === false &&
						sap.ui.getCore().byId("t_Central") !== undefined) {
						sap.ui.getCore().byId("t_Central").destroy();
					}
					if (sap.ui.getCore().byId("Txt_PERAN").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PERIN").getVisible() === false &&
						sap.ui.getCore().byId("Txt_ANZPR").getVisible() === false &&
						sap.ui.getCore().byId("Txt_FIMON").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PERIO").getVisible() === false &&
						sap.ui.getCore().byId("PlntFrcstng_NoPeriodReq") !== undefined) {
						sap.ui.getCore().byId("PlntFrcstng_NoPeriodReq").destroy();
					}
					if (sap.ui.getCore().byId("Txt_AUTRU").getVisible() === false &&
						sap.ui.getCore().byId("Txt_KZKFK").getVisible() === false &&
						sap.ui.getCore().byId("PlntFrcstng_CtrlDta") !== undefined) {
						sap.ui.getCore().byId("PlntFrcstng_CtrlDta").destroy();
					}
					if (sap.ui.getCore().byId("Txt_PRMOD").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PRDAT").getVisible() === false &&
						sap.ui.getCore().byId("Txt_KZINI").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MODAW").getVisible() === false &&
						sap.ui.getCore().byId("Txt_KZPAR").getVisible() === false &&
						sap.ui.getCore().byId("Txt_OPGRA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_SIGGR").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MODAV").getVisible() === false &&
						sap.ui.getCore().byId("Txt_GEWMARCPA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_ALPHA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_BETA1").getVisible() === false &&
						sap.ui.getCore().byId("Txt_GAMMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_DELTA").getVisible() === false &&
						sap.ui.getCore().byId("OthrCtrlData") !== undefined) {
						sap.ui.getCore().byId("OthrCtrlData").destroy();
					}
					if (sap.ui.getCore().byId("t_Central") === undefined &&
						sap.ui.getCore().byId("PlntFrcstng_NoPeriodReq") === undefined &&
						sap.ui.getCore().byId("PlntFrcstng_CtrlDta") === undefined &&
						sap.ui.getCore().byId("OthrCtrlData") === undefined) {
						var noDataPanelFR = sap.ui.getCore().byId(vPanelId);
						fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(noDataPanelFR, this.vNoDataTxt);
					}
				}
				break;
			case "MatWorkSchdlngPanel": // Hide sections for work scheduling panel
				var extWSHidePanel = this.oS3Controller.matHookhidePlantWSPanelSection(); // Controller hook
				if (extWSHidePanel === false) {
					if (sap.ui.getCore().byId("Txt_FEVMARCWR").getVisible() === false &&
						sap.ui.getCore().byId("Txt_FRTME").getVisible() === false &&
						sap.ui.getCore().byId("Txt_KZPRO").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MATGR").getVisible() === false &&
						sap.ui.getCore().byId("Txt_OCMPF").getVisible() === false &&
						sap.ui.getCore().byId("Txt_SFCMARCWR").getVisible() === false &&
						sap.ui.getCore().byId("ws_Central") !== undefined) {
						sap.ui.getCore().byId("ws_Central").destroy();
					}
					if (sap.ui.getCore().byId("Txt_UEETK").getVisible() === false &&
						sap.ui.getCore().byId("Txt_UEETO").getVisible() === false &&
						sap.ui.getCore().byId("Txt_UNETO").getVisible() === false &&
						sap.ui.getCore().byId("PlntWrkSchdl_TolrncDta") !== undefined) {
						sap.ui.getCore().byId("PlntWrkSchdl_TolrncDta").destroy();
					}
					if (sap.ui.getCore().byId("Txt_DZEIT").getVisible() === false &&
						sap.ui.getCore().byId("LotsizeInd") !== undefined) {
						sap.ui.getCore().byId("LotsizeInd").destroy();
					}
					if (sap.ui.getCore().byId("Txt_BEARZ").getVisible() === false &&
						sap.ui.getCore().byId("Txt_BASMG").getVisible() === false &&
						sap.ui.getCore().byId("Txt_RUEZT").getVisible() === false &&
						sap.ui.getCore().byId("Txt_TRANZ").getVisible() === false &&
						sap.ui.getCore().byId("LotSizeDep") !== undefined) {
						sap.ui.getCore().byId("LotSizeDep").destroy();
					}
					if (sap.ui.getCore().byId("LotSizeDep") === undefined &&
						sap.ui.getCore().byId("LotsizeInd") === undefined &&
						sap.ui.getCore().byId("PlntInHouse_Prdctntime") !== undefined) {
						sap.ui.getCore().byId("PlntInHouse_Prdctntime").destroy();
					}
					if (sap.ui.getCore().byId("ws_Central") === undefined &&
						sap.ui.getCore().byId("PlntWrkSchdl_TolrncDta") === undefined &&
						sap.ui.getCore().byId("PlntInHouse_Prdctntime") === undefined &&
						sap.ui.getCore().byId("PlntInHsePrdctnTime_LtSzDpndnt") === undefined) {
						var noDataPanelWS = sap.ui.getCore().byId(vPanelId);
						fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(noDataPanelWS, this.vNoDataTxt);
					}
				}
				break;
			case "MatReqPlanningPanel": // Hide sections for material Requirement Planning panel
				var extMRPHidePanel = this.oS3Controller.matHookhidePlantMRPPanelSection(); // Controller hook
				if (extMRPHidePanel === false) {
					this.hideMrpPanelSection();
				}
				break;
			case "MatStrgCstngPanel": // Hide sections for storage and costing panel
				var extStrCstHidePanel = this.oS3Controller.matHookhidePlantStrCstPanelSection(); // Controller hook
				if (extStrCstHidePanel === false) {
					if (sap.ui.getCore().byId("Txt_AUSME").getVisible() === false &&
						sap.ui.getCore().byId("Txt_ROTATION").getVisible() === false &&
						sap.ui.getCore().byId("Txt_UCHKZ").getVisible() === false &&
						sap.ui.getCore().byId("Txt_ABCMARCST").getVisible() === false &&
						sap.ui.getCore().byId("Txt_CCFIX").getVisible() === false &&
						sap.ui.getCore().byId("PlntStrgDta") !== undefined) {
						sap.ui.getCore().byId("PlntStrgDta").destroy();
					}

					if (sap.ui.getCore().byId("Txt_AWSMARCCS").getVisible() === false &&
						sap.ui.getCore().byId("Txt_NCOST").getVisible() === false &&
						sap.ui.getCore().byId("CostngGeneral") !== undefined) {
						sap.ui.getCore().byId("CostngGeneral").destroy();
					}
					if (sap.ui.getCore().byId("Txt_APLAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_FXPRU").getVisible() === false &&
						sap.ui.getCore().byId("Txt_KZKUP").getVisible() === false &&
						sap.ui.getCore().byId("Txt_LOSGR").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNNR").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNTY").getVisible() === false &&
						sap.ui.getCore().byId("Txt_SOBMARCCS").getVisible() === false &&
						sap.ui.getCore().byId("Txt_STLAN").getVisible() === false &&
						sap.ui.getCore().byId("Txt_STLAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_FVIDK").getVisible() === false &&
						sap.ui.getCore().byId("QtyStrctData") !== undefined) {
						sap.ui.getCore().byId("QtyStrctData").destroy();
					}
					if (sap.ui.getCore().byId("CostngGeneral") === undefined &&
						sap.ui.getCore().byId("QtyStrctData") === undefined &&
						sap.ui.getCore().byId("PlntCostng") !== undefined) {
						sap.ui.getCore().byId("PlntCostng").destroy();
					}
					if (sap.ui.getCore().byId("CostngGeneral") === undefined &&
						sap.ui.getCore().byId("QtyStrctData") === undefined &&
						sap.ui.getCore().byId("PlntCostng") === undefined &&
						sap.ui.getCore().byId("PlntStrgDta") === undefined) {
						sap.ui.getCore().byId("MatPlantCostingForm").setVisible(false);
					}
				}
				break;
		}
		//Controller hook defined in S3 to control the hiding of fields parameters: panelid
		this.oS3Controller.matHookModifyhidePlantS4Title(vPanelId);
	},

	hideMrpPanelSection: function() {
		if (sap.ui.getCore().byId("Txt_DISPR").getVisible() === false &&
			sap.ui.getCore().byId("Txt_DGRMRPPP").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MAABC").getVisible() === false &&
			sap.ui.getCore().byId("PlantMrpGeneral") !== undefined) {
			sap.ui.getCore().byId("PlantMrpGeneral").destroy();
		}
		if (sap.ui.getCore().byId("Txt_FHOMRPPP").getVisible() === false &&
			sap.ui.getCore().byId("PlantMrpSchdlng") !== undefined) {
			sap.ui.getCore().byId("PlantMrpSchdlng").destroy();
		}
		if (sap.ui.getCore().byId("Txt_DISMM").getVisible() === false &&
			sap.ui.getCore().byId("Txt_DISMRPPP").getVisible() === false &&
			sap.ui.getCore().byId("Txt_FXHOR").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LFRMRPPP").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MINBE").getVisible() === false &&
			sap.ui.getCore().byId("PlantMrpPrcdr") !== undefined) {
			sap.ui.getCore().byId("PlantMrpPrcdr").destroy();
		}
		if (sap.ui.getCore().byId("Txt_RWPMRPLS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_SHFLG").getVisible() === false &&
			sap.ui.getCore().byId("Txt_SHPMRPLS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_SHZET").getVisible() === false &&
			sap.ui.getCore().byId("Txt_EISBE").getVisible() === false &&
			sap.ui.getCore().byId("Txt_EISLO").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LGRAD").getVisible() === false &&
			sap.ui.getCore().byId("PlntLotSizDta_Calc") !== undefined) {
			sap.ui.getCore().byId("PlntLotSizDta_Calc").destroy();
		}
		if (sap.ui.getCore().byId("Txt_DISLS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MRPMRPSP").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BSTMI").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BSTMA").getVisible() === false &&
			sap.ui.getCore().byId("Txt_AUSSS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BSTFE").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BSTRF").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LAGMRPLS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MABST").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MEGMRPLS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_RDPMRPLS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_TAKZT").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LOSFX").getVisible() === false &&
			sap.ui.getCore().byId("PlntLotSizDta_Calc") === undefined &&
			sap.ui.getCore().byId("Plnt_LotSizeData") !== undefined) {
			sap.ui.getCore().byId("Plnt_LotSizeData").destroy();
		}
		if (sap.ui.getCore().byId("Txt_FABKZ").getVisible() === false &&
			sap.ui.getCore().byId("Txt_USEQU").getVisible() === false &&
			sap.ui.getCore().byId("Txt_WEBAZ").getVisible() === false &&
			sap.ui.getCore().byId("Txt_PLIFZ").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LGFMRPSP").getVisible() === false &&
			sap.ui.getCore().byId("PlntPrcurmnt_Purchsng") !== undefined) {
			sap.ui.getCore().byId("PlntPrcurmnt_Purchsng").destroy();
		}
		if (sap.ui.getCore().byId("Txt_BESKZ").getVisible() === false &&
			sap.ui.getCore().byId("Txt_SOBMRPSP").getVisible() === false &&
			sap.ui.getCore().byId("Txt_EPRMRPSP").getVisible() === false &&
			sap.ui.getCore().byId("Txt_KZECH").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LGPMRPSP").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VSPMRPSP").getVisible() === false &&
			sap.ui.getCore().byId("Txt_RGEKZ").getVisible() === false &&
			sap.ui.getCore().byId("Txt_SCHGT").getVisible() === false &&
			sap.ui.getCore().byId("PlntPrcurmnt_Purchsng") === undefined &&
			sap.ui.getCore().byId("PlntProcurement") !== undefined) {
			sap.ui.getCore().byId("PlntProcurement").destroy();
		}
		if (sap.ui.getCore().byId("Txt_MWZEIT").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MMTVFP").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MKZPSP").getVisible() === false &&
			sap.ui.getCore().byId("PlntPlng_ATP") !== undefined) {
			sap.ui.getCore().byId("PlntPlng_ATP").destroy();
		}
		if (sap.ui.getCore().byId("Txt_MISKZ").getVisible() === false &&
			sap.ui.getCore().byId("Txt_STRGR").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VINT1").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VINT2").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VRMOD").getVisible() === false &&
			sap.ui.getCore().byId("Txt_PRGPRODG").getVisible() === false &&
			sap.ui.getCore().byId("Txt_PRWPRODG").getVisible() === false &&
			sap.ui.getCore().byId("Txt_UMREF").getVisible() === false &&
			sap.ui.getCore().byId("PlntPlng_ATP") === undefined &&
			sap.ui.getCore().byId("PlantPlng") !== undefined) {
			sap.ui.getCore().byId("PlantPlng").destroy();
		}
		if (sap.ui.getCore().byId("Txt_ALTSL").getVisible() === false &&
			sap.ui.getCore().byId("Txt_KAUSF").getVisible() === false &&
			sap.ui.getCore().byId("Txt_KZBED").getVisible() === false &&
			sap.ui.getCore().byId("Txt_SBDKZ").getVisible() === false &&
			sap.ui.getCore().byId("Txt_AHDIS").getVisible() === false &&
			sap.ui.getCore().byId("PlntMnfctrng_BOM") !== undefined) {
			sap.ui.getCore().byId("PlntMnfctrng_BOM").destroy();
		}
		if (sap.ui.getCore().byId("Txt_MDAMRPMI").getVisible() === false &&
			sap.ui.getCore().byId("Txt_SAUFT").getVisible() === false &&
			sap.ui.getCore().byId("Txt_SFEPR").getVisible() === false &&
			sap.ui.getCore().byId("Reptitve_Manfactrng") !== undefined) {
			sap.ui.getCore().byId("Reptitve_Manfactrng").destroy();
		}
		if (sap.ui.getCore().byId("Txt_AUSDT").getVisible() === false &&
			sap.ui.getCore().byId("Txt_KZAUS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_NFMAT").getVisible() === false &&
			sap.ui.getCore().byId("PlntMnfctrng_DscntnudParts") !== undefined) {
			sap.ui.getCore().byId("PlntMnfctrng_DscntnudParts").destroy();
		}
		if (sap.ui.getCore().byId("PlntMnfctrng_BOM") === undefined &&
			sap.ui.getCore().byId("Reptitve_Manfactrng") === undefined &&
			sap.ui.getCore().byId("PlntMnfctrng_DscntnudParts") === undefined &&
			sap.ui.getCore().byId("PlntMnfctrng") !== undefined) {
			sap.ui.getCore().byId("PlntMnfctrng").destroy();
		}
		if (sap.ui.getCore().byId("PlantMrpGeneral") === undefined &&
			sap.ui.getCore().byId("PlantMrpSchdlng") === undefined &&
			sap.ui.getCore().byId("PlantMrpPrcdr") === undefined &&
			sap.ui.getCore().byId("Plnt_LotSizeData") === undefined &&
			sap.ui.getCore().byId("PlntProcurement") === undefined &&
			sap.ui.getCore().byId("PlantPlng") === undefined &&
			sap.ui.getCore().byId("PlntMnfctrng") === undefined) {
			sap.ui.getCore().byId("MatPlntReqForm").setVisible(false);
		}
		//Controller hook defined in S3 to control the hiding of fields parameters none
	},

	hidePlantGnrlDataSection: function() {
		var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
		if (this.oS3Controller === undefined || this.oS3Controller === "") {
			this.oS3Controller = oS3Instance;
		}
		var extHideGnrlData = this.oS3Controller.matHookhidePlantGnrlDataSection(); // Controller hook
		if (extHideGnrlData === false) {
			if (sap.ui.getCore().byId("Txt_AUFMRPFC").getVisible() === false &&
				sap.ui.getCore().byId("Txt_PERIV").getVisible() === false &&
				sap.ui.getCore().byId("Txt_PERMRPFC").getVisible() === false &&
				sap.ui.getCore().byId("Frcst_Rqmnt") !== undefined) {
				sap.ui.getCore().byId("Frcst_Rqmnt").destroy();
			}
			if (sap.ui.getCore().byId("Txt_WZEIT").getVisible() === false &&
				sap.ui.getCore().byId("Txt_MTVFP").getVisible() === false &&
				sap.ui.getCore().byId("Txt_KZPSP").getVisible() === false &&
				sap.ui.getCore().byId("ATP") !== undefined) {
				sap.ui.getCore().byId("ATP").destroy();
			}
			if (sap.ui.getCore().byId("Txt_MMSTA").getVisible() === false && // General data Form
				sap.ui.getCore().byId("Txt_MMSTD").getVisible() === false &&
				sap.ui.getCore().byId("Txt_MXCHPF").getVisible() === false &&
				sap.ui.getCore().byId("Txt_LOGGR").getVisible() === false &&
				sap.ui.getCore().byId("Txt_PRCMARCBA").getVisible() === false &&
				sap.ui.getCore().byId("Txt_SERNP").getVisible() === false &&
				sap.ui.getCore().byId("Txt_KZDKZ").getVisible() === false &&
				sap.ui.getCore().byId("Txt_XMCNG").getVisible() === false &&
				sap.ui.getCore().byId("Frcst_Rqmnt") === undefined &&
				sap.ui.getCore().byId("ATP") === undefined &&
				sap.ui.getCore().byId("matPlantDataForm") !== undefined &&
				sap.ui.getCore().byId("MatPlantCentral") !== undefined) {
				sap.ui.getCore().byId("matPlantDataForm").destroy();
				sap.ui.getCore().byId("MatPlantCentral").destroy();
			}
			if (sap.ui.getCore().byId("Txt_ATPKZ").getVisible() === false &&
				sap.ui.getCore().byId("Txt_MFRGR").getVisible() === false &&
				sap.ui.getCore().byId("PlantSalesGeneral") !== undefined) {
				sap.ui.getCore().byId("PlantSalesGeneral").destroy();
			}
			if (sap.ui.getCore().byId("Txt_LADGR").getVisible() === false &&
				sap.ui.getCore().byId("Txt_VBAMG").getVisible() === false &&
				sap.ui.getCore().byId("Txt_VBEAZ").getVisible() === false &&
				sap.ui.getCore().byId("Txt_VRVEZ").getVisible() === false &&
				sap.ui.getCore().byId("Plnt_SalesShip") !== undefined) {
				sap.ui.getCore().byId("Plnt_SalesShip").destroy();
			}
			if (sap.ui.getCore().byId("PlantSalesGeneral") === undefined && // Plant Sales Form
				sap.ui.getCore().byId("Plnt_SalesShip") === undefined &&
				sap.ui.getCore().byId("matPlantSalesForm") !== undefined &&
				sap.ui.getCore().byId("Plnt_Sales") !== undefined) {
				sap.ui.getCore().byId("matPlantSalesForm").destroy();
				sap.ui.getCore().byId("Plnt_Sales").destroy();
			}
			if (sap.ui.getCore().byId("Txt_CASMARCFT").getVisible() === false &&
				sap.ui.getCore().byId("Txt_STEMARCFT").getVisible() === false &&
				sap.ui.getCore().byId("Txt_GPNMARCFT").getVisible() === false &&
				sap.ui.getCore().byId("Txt_HERKL").getVisible() === false &&
				sap.ui.getCore().byId("Txt_HERMARCFT").getVisible() === false &&
				sap.ui.getCore().byId("Txt_MTVER").getVisible() === false &&
				sap.ui.getCore().byId("Txt_STAMARCFT").getVisible() === false &&
				sap.ui.getCore().byId("Txt_EXPME").getVisible() === false &&
				sap.ui.getCore().byId("PlantFTradeGeneral") !== undefined) {
				sap.ui.getCore().byId("PlantFTradeGeneral").destroy();
			}
			if (sap.ui.getCore().byId("Txt_MOGMARCFT").getVisible() === false &&
				sap.ui.getCore().byId("Txt_MOWMARCFT").getVisible() === false &&
				sap.ui.getCore().byId("Plant_FTrade_CAP") !== undefined) {
				sap.ui.getCore().byId("Plant_FTrade_CAP").destroy();
			}
			if (sap.ui.getCore().byId("Txt_ITARK").getVisible() === false &&
				sap.ui.getCore().byId("Txt_PRENC").getVisible() === false &&
				sap.ui.getCore().byId("Txt_PREND").getVisible() === false &&
				sap.ui.getCore().byId("Txt_PRENO").getVisible() === false &&
				sap.ui.getCore().byId("Plant_Ftrd_ExpLc") !== undefined) {
				sap.ui.getCore().byId("Plant_Ftrd_ExpLc").destroy();
			}
			if (sap.ui.getCore().byId("Txt_PREFE").getVisible() === false &&
				sap.ui.getCore().byId("Txt_PRENE").getVisible() === false &&
				sap.ui.getCore().byId("Txt_PRENG").getVisible() === false &&
				sap.ui.getCore().byId("Plnt_FTrd_Pref") !== undefined) {
				sap.ui.getCore().byId("Plnt_FTrd_Pref").destroy();
			}
			if (sap.ui.getCore().byId("PlantFTradeGeneral") === undefined && // Plant Foreign Trade Form
				sap.ui.getCore().byId("Plant_FTrade_CAP") === undefined &&
				sap.ui.getCore().byId("Plant_Ftrd_ExpLc") === undefined &&
				sap.ui.getCore().byId("Plnt_FTrd_Pref") === undefined &&
				sap.ui.getCore().byId("matPlantFtrdForm") !== undefined &&
				sap.ui.getCore().byId("Plant_FTrade") !== undefined) {
				sap.ui.getCore().byId("matPlantFtrdForm").destroy();
				sap.ui.getCore().byId("Plant_FTrade").destroy();
			}
			if (sap.ui.getCore().byId("Txt_EKGRP").getVisible() === false &&
				sap.ui.getCore().byId("Txt_KAUTB").getVisible() === false &&
				sap.ui.getCore().byId("Txt_KORDB").getVisible() === false &&
				sap.ui.getCore().byId("Txt_TAIPURTAX").getVisible() === false &&
				sap.ui.getCore().byId("PlantPurchGeneral") !== undefined) {
				sap.ui.getCore().byId("PlantPurchGeneral").destroy();
			}
			if (sap.ui.getCore().byId("Txt_INSMK").getVisible() === false &&
				sap.ui.getCore().byId("Txt_KZKRI").getVisible() === false &&
				sap.ui.getCore().byId("PurchOtherData") !== undefined) {
				sap.ui.getCore().byId("PurchOtherData").destroy();
			}
			if (sap.ui.getCore().byId("PlantPurchGeneral") === undefined &&
				sap.ui.getCore().byId("PurchOtherData") === undefined &&
				sap.ui.getCore().byId("matPlantPurchForm") !== undefined &&
				sap.ui.getCore().byId("Plant_Purchsng_Data") !== undefined) {
				sap.ui.getCore().byId("matPlantPurchForm").destroy();
				sap.ui.getCore().byId("Plant_Purchsng_Data").destroy();
			}
		}
	},
	GetValAreaTableTemplate: function(oValModel) {
		var that = this;
		var oItemTempNotes = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "BWTAR",
						formatter: function() {
							if (that.vCPlant !== "X" && that.vCPlant !== undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oValModel, "BWTAR");
							}
						//	var desc = oValModel.getProperty("BWTTY__TXT", this.getBindingContext());
							var key = oValModel.getProperty("BWTAR", this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.getValuationHeader(key);
						}
						
					}
				}),
				new sap.m.Text({
					text: {
						path: "BWTTY",
						formatter: function() {
							if (that.vCPlant !== "X" && that.vCPlant !== undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handlePlantCellBolding(this, oValModel, "BWTAR");
							}
							var desc = oValModel.getProperty("BWTTY__TXT", this.getBindingContext());
							var key = oValModel.getProperty("BWTTY", this.getBindingContext());
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
		var extoItemTemp = this.oS3Controller.matHookGetValAreaTableTemplate(oItemTempNotes);
		if (extoItemTemp !== undefined) {
			oItemTempNotes = extoItemTemp;
		}
		return oItemTempNotes;
	},

	setBoldCostingData: function(aValuationRslt) {
		var sStyleClass = "text_bold";
		//	for (var i = 0; i < aValuationRslt.results.length; i++) {
		for (var j = 0; j < aValuationRslt.results.length; j++) {
			for (var k = 0; k < aValuationRslt.results[j].ChangeData.results.length; k++) { // loop at changedata and create log
			if(aValuationRslt.results[j].ChangeData.results[k].EntityAction==="U")
			{
				var sLabelName = "Lbl_" + aValuationRslt.results[j].ChangeData.results[k].Attribute;
				var oLblIns = sap.ui.getCore().byId(sLabelName);
				if (oLblIns !== undefined) {
					oLblIns.setDesign("Bold");
				}
				var sTextName = "Txt_" + aValuationRslt.results[j].ChangeData.results[k].Attribute;
				if (sap.ui.getCore().byId(sTextName) !== undefined) {
					sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
				}
			}
			}
		}
	},
	hideCostingSection: function() {
		var extHideCstng = this.oS3Controller.matHookhidePlantValCostingSection();	// Controller hook
		if(extHideCstng === false) {
				if (sap.ui.getCore().byId("Txt_EKALR").getVisible() === false &&
				sap.ui.getCore().byId("QtyStrctDatavaluationCreate") !== undefined) {
			sap.ui.getCore().byId("QtyStrctDatavaluationCreate").destroy();
		}
     }
     if (sap.ui.getCore().byId("Txt_HKMAT").getVisible() === false &&
         sap.ui.getCore().byId("Txt_HRKCSTNG").getVisible() === false &&
         sap.ui.getCore().byId("Txt_KOSCSTNG").getVisible() === false &&
				sap.ui.getCore().byId("GenDatavaluationCreate") !== undefined &&
				sap.ui.getCore().byId("PlntCostngvaluationCreate") !== undefined) {
			sap.ui.getCore().byId("GenDatavaluationCreate").destroy();
			sap.ui.getCore().byId("PlntCostngvaluationCreate").destroy();
		}
		 if (sap.ui.getCore().byId("Txt_HKMAT").getVisible() === false &&
         sap.ui.getCore().byId("Txt_HRKCSTNG").getVisible() === false &&
         sap.ui.getCore().byId("Txt_KOSCSTNG").getVisible() === false &&
         sap.ui.getCore().byId("Txt_EKALR").getVisible() === false &&
				sap.ui.getCore().byId("MatValForm") !== undefined) {
			sap.ui.getCore().byId("MatValForm").destroy();
		}
     
	},
	setPlantTablePersonalization: function(vTblId,oItem){
	// function to set the Table Personalization for various tables in Plant - MRPArea, Production Version, Inspection Type,
	// Storage Location, Valuation Area
		var oMatPlantAllTabl = sap.ui.getCore().byId(vTblId);
		var oMatTablPersButton;		
		switch (vTblId){
			case "MatPrdVrsnTable":
				{
				    oMatTablPersButton = sap.ui.getCore().byId("PlantPrdVrsnpersIcon");
					break;	
				}
			case "MatMrpAreaTable":
				{
					oMatTablPersButton = sap.ui.getCore().byId("PlantMRPAreapersIcon");
					break;
				}
			case "MatInspectnSetup":
				{
					oMatTablPersButton = sap.ui.getCore().byId("PlantInspctnSetuppersIcon");
					break;
				}
			case "MatValAreatable":	
				{
					oMatTablPersButton = sap.ui.getCore().byId("PlantValAreapersIcon");
					break;
				}
			case "MatStrgLoctable":
				{
					oMatTablPersButton = sap.ui.getCore().byId("PlantStrgLocpersIcon");
					break;
				}
		}// end switch
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oItem, oMatPlantAllTabl, oMatTablPersButton);
	}
};