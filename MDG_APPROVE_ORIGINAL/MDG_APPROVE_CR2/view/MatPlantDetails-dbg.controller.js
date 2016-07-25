/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.MatPlantDetails", {

	oPlantDataDetails: "",
	os4view: null,
	vPlant: "",
	vMaterial: "",
	RowId: 0,
	sRowId: 0,
	result: "",
	isNavToDetail: "",
	vPlantCreated: "",
	oValuationDetail: "",
	vScrollToPanel: "",
	vNoScrollback: "",
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
	
	extHookMatmodifyPlantDetailsOnInit:null,
	extHookMatHidePlantGnrlDataSection:null,
	

	onInit: function() {
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("PlantDetail").setShowNavButton(true);
		// Get DataManager instance.
		this.oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();
		this.oRouter.attachRouteMatched(function(oEvent) {

			if (oEvent.getParameter("name") === "matPlantDataDetail") {
				if (this.isNavToDetail !== "X") { // Check if navigated back from storage Location or MRP Text detail
					// Load Plant Detail layout
					this.loadPlantDetailLayout();
					this.RowId = oEvent.getParameter('arguments').RowId;
					this.result = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getPlantNavData();
					// Set Plant object header
					this.setPlantObjHeader();

					// setting the footer
					var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
					var aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
					// this.getPage().destroyCustomHeader(); // destroy custom header
					// Setting Header Text and Buttons
					this.setPlantHeader();
					this.os4view = oS3Instance;
					// get plant Details and set the data to forms
					this.getSetPlantDetails();
				}
				this.isNavToDetail = "";
			} else if (oEvent.getParameter("name") === "matPlantPnlChngDetail") {
				if (this.isNavToDetail !== "X") { // Check if navigated back from storage Location or MRP Text detail
					this.vNoScrollback = "";
					// Load Plant Detail layout
					this.loadPlantDetailLayout();
					var vNewval = oEvent.getParameter('arguments').NwVal;
					if (vNewval === this.i18n.getText("PC_ADDED")) {
						this.vPlantCreated = "X";
					} else {
						this.vPlantCreated = "";
					}
					var vPanelID = oEvent.getParameter('arguments').PanelId;
					this.vPlant = oEvent.getParameter('arguments').PLANT;
					this.vMaterial = oEvent.getParameter('arguments').MATERIAL;
					var vPlantkeyDesc = oEvent.getParameter('arguments').ChangeKey;
					vPlantkeyDesc = this.i18n.getText("plant") + ": " + vPlantkeyDesc;
					this.getView().byId("PlantDetailHeader").setTitle(vPlantkeyDesc);
					var vMatkeyDesc = oEvent.getParameter('arguments').MatText;
					vMatkeyDesc = this.i18n.getText("MATERIAL") + ": " + vMatkeyDesc;
					this.getView().byId("MatrlHeader").setText(vMatkeyDesc);
					var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
					var aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this);
					// this.getPage().destroyCustomHeader(); // destroy custom header
					// Set the header
					var vHdr = fcg.mdg.approvecrv2.util.Formatter.getChngPlantDetailHdr("Plant");
					var vCstmHdr = this.getView().byId("PlantDetail").getCustomHeader();
					vCstmHdr.destroyContentMiddle();
		
					vCstmHdr.addContentMiddle(new sap.m.Text({
												text: vHdr
											}));
					if (sap.ui.getCore().byId("MatPlantBtnPrev") !== undefined && sap.ui.getCore().byId("MatPlantBtnNext") !== undefined) {	
					// this.getView().byId("PlantDetail").setTitle(vHdr);
					sap.ui.getCore().byId("MatPlantBtnPrev").setVisible(false);
					sap.ui.getCore().byId("MatPlantBtnNext").setVisible(false);
					}
					this.os4view = oS3Instance;
					this.getSetPlantDetails();
					if (vPanelID !== 'general') {
						sap.ui.getCore().byId(vPanelID).setExpanded(true);
						this.vScrollToPanel = vPanelID;
					} else {
						this.vScrollToPanel = "";
					}
					this.getView().addEventDelegate({ // Scroll after rendering the page
						onAfterShow: function() {
							if (this.os4view.sAction === "CHANGE" && this.vNoScrollback !== "X") {
								var oPage = this.getView().byId("PlantDetail");
								this.vNoScrollback = "X";
								if (this.vScrollToPanel !== 'general' && this.vScrollToPanel !== "") {
									var vElement = document.getElementById(this.vScrollToPanel);
									var vTop = vElement.offsetTop; // get lement height from top
									oPage.scrollTo(vTop, 300);
								} else {
									oPage.scrollTo(0, 300);
								}
							}
						}
					}, this);
				}
				this.isNavToDetail = "";
			}
			//controller hook to bind the data with new fragment/section etc with importing param: this.result, oview; no return

			/**
			 * @ControllerHook To give an access to add another router or extend existing one
			 * Customer can modify the plant details or add another section for create/change
			 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookMatmodifyPlantDetailsOnInit
			 * @param {object} result Router name
			 * @param {object} result View
			 * @param {object} result Response
			 * @return { }
			 */
			if (this.extHookMatmodifyPlantDetailsOnInit) {
				this.extHookMatmodifyPlantDetailsOnInit(oEvent, this, this.result);
			}
		}, this);
	},

	//  Navigate from s4 to s5	
	navtoSubDetail: function(oEvent, data) {
		var sPath = oEvent.getSource().getBindingContext().getPath();
		var sRowId = sPath.substr(sPath.lastIndexOf("/") + 1);
		this.isNavToDetail = "X";
		switch (data.name) {
			case "matStorageLocDetail": //Plant Storage Location Details navigation
				var vStrgLoc = data.Entity.MARCBASIC2MARDRel.results[sRowId].LGORT;
				this.oRouter.navTo("matStorageLocDetail", {
					LGORT: vStrgLoc,
					RowId: sRowId,
					Action: this.os4view.sAction
				});
				break;
			case "matPlantMrpTextDetail": //Plant MRP Text Details navigation 
				this.oRouter.navTo("matPlantMrpTextDetail", {
					Action: this.os4view.sAction
				});
				break;
			case "matInsTypDetail": //Plant Inspection Details navigation 
				this.oRouter.navTo("matInsTypDetail", {
					RowId: sRowId,
					Action: this.os4view.sAction
				});
				break;
			case "matMrpAreaDetail": //Plant MRP Area Details navigation 
				this.oRouter.navTo("matMrpAreaDetail", {
					RowId: sRowId,
					Action: this.os4view.sAction
				});
				break;
			case "matPrdVrsnDetail": //Plant production version Details navigation 
				this.oRouter.navTo("matPrdVrsnDetail", {
					RowId: sRowId,
					Action: this.os4view.sAction
				});
				break;
			case "matValAreaDataDetail": //Plant MRP Text Details navigation 
				var bwkey = data.Entity.results[sRowId].BWKEY;
				var bwtar = data.Entity.results[sRowId].BWTAR;
				if (bwtar === "") {
					bwtar = "Header";
				}
				this.oRouter.navTo("matValAreaDataDetail", {
					RowId: sRowId,
					bwkey: bwkey,
					bwtar: bwtar
				});
				break;
		}
	},

	//	Load Plant detail fragment
	loadPlantDetailLayout: function() {
		if (this.oPlantDataDetails === "") {
			this.oPlantDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialPlantDetails', fcg.mdg.approvecrv2.util.Formatter);
		} else {
			// If already defined, remove it from detail page and instantiate it again
			this.getView().byId("PlantDetail").removeContent(this.oPlantDataDetails);
			if (this.oPlantDataDetails !== undefined) {
				this.oPlantDataDetails.destroy();
			}
			this.oPlantDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialPlantDetails', fcg.mdg.approvecrv2.util.Formatter);
		}
		this.getView().byId("PlantDetail").addContent(this.oPlantDataDetails);
		fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.checkPanelVisibleFlag();
	},

	// Set Header for Plant with Iterative buttons
	setPlantHeader: function() {
		var TotalPlants = this.result.MATERIAL2MARCBASICRel.results.length;
		this.sRowId = this.RowId;
		this.sRowId++;
		
		var vCstmHdr = this.getView().byId("PlantDetail").getCustomHeader();
		vCstmHdr.destroyContentMiddle();
		var PlantDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr("Plant", this.sRowId, TotalPlants);
		
		vCstmHdr.addContentMiddle(new sap.m.Text({
						text: PlantDetailsTitle
					}));
		var vlocalIns = this;
		if (sap.ui.getCore().byId("MatPlantBtnPrev") === undefined && sap.ui.getCore().byId("MatPlantBtnNext") === undefined) {	
		vCstmHdr.addContentRight(new sap.m.Button({
									id: "MatPlantBtnPrev", icon:"sap-icon://up", 
									press: function() {					// On click event of previous button  
										vlocalIns.loadPlantDetailLayout();
										vlocalIns.RowId--;
										vlocalIns.setPlantObjHeader();
										vlocalIns.setPlantHeader();
										vlocalIns.getSetPlantDetails();
									}
								})
							);
		vCstmHdr.addContentRight(new sap.m.Button({
									id: "MatPlantBtnNext", icon:"sap-icon://down",
									press: function() {						// On click event of next button  
										vlocalIns.loadPlantDetailLayout();
										vlocalIns.RowId++;
										vlocalIns.setPlantObjHeader();
										vlocalIns.setPlantHeader();
										vlocalIns.getSetPlantDetails();
									}
								})
							);
		}
		
		sap.ui.getCore().byId("MatPlantBtnPrev").setVisible(true);
		sap.ui.getCore().byId("MatPlantBtnNext").setVisible(true);
		if (this.sRowId === 1) {
			sap.ui.getCore().byId("MatPlantBtnPrev").setEnabled(false);
			sap.ui.getCore().byId("MatPlantBtnNext").setEnabled(true);
		} else if (this.sRowId === TotalPlants) {
			sap.ui.getCore().byId("MatPlantBtnNext").setEnabled(false);
			sap.ui.getCore().byId("MatPlantBtnPrev").setEnabled(true);
		} else {
			sap.ui.getCore().byId("MatPlantBtnNext").setEnabled(true);
			sap.ui.getCore().byId("MatPlantBtnPrev").setEnabled(true);
		}
		// this.getView().byId("PlantDetail").setTitle(PlantDetailsTitle);
		// this.getView().byId("MatPlantBtnPrev").setVisible(true);
		// this.getView().byId("MatPlantBtnNext").setVisible(true);
		// if (this.sRowId === 1) {
		// 	this.getView().byId("MatPlantBtnPrev").setEnabled(false);
		// 	this.getView().byId("MatPlantBtnNext").setEnabled(true);
		// } else if (this.sRowId === TotalPlants) {
		// 	this.getView().byId("MatPlantBtnNext").setEnabled(false);
		// 	this.getView().byId("MatPlantBtnPrev").setEnabled(true);
		// } else {
		// 	this.getView().byId("MatPlantBtnNext").setEnabled(true);
		// 	this.getView().byId("MatPlantBtnPrev").setEnabled(true);
		// }
	},

	//  set Plant Object header	
	setPlantObjHeader: function() {
		this.vPlant = this.result.MATERIAL2MARCBASICRel.results[this.RowId].WERKS;
		var vPlantTxt = this.result.MATERIAL2MARCBASICRel.results[this.RowId].WERKS__TXT;
		var vPlantobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.vPlant, vPlantTxt);
		vPlantobjDesc = this.i18n.getText("plant") + ": " + vPlantobjDesc;
		this.getView().byId("PlantDetailHeader").setTitle(vPlantobjDesc);

		this.vMaterial = this.result.MATERIAL2MARCBASICRel.results[this.RowId].MATERIAL;
		var vMaterialTxt = this.result.TXTMI;
		var vMatHeader = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.vMaterial, vMaterialTxt);
		vMatHeader = this.i18n.getText("Material") + ": " + vMatHeader;
		this.getView().byId("MatrlHeader").setText(vMatHeader);
	},

	// 	 get Plant details and bind it      
	getSetPlantDetails: function() {
		var vPanelid = "";
		var plantResults = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getPlantDetailsData(this, this.vPlant, this.vMaterial);
		var oPlantDetailModel = new sap.ui.model.json.JSONModel();
		if (plantResults[0].data.WERKS !== undefined) {
			var aResult = plantResults[0].data;
			oPlantDetailModel.setData(aResult);
			sap.ui.getCore().byId("matPlantDataForm").setModel(oPlantDetailModel);
			sap.ui.getCore().byId("matPlantSalesForm").setModel(oPlantDetailModel);
			sap.ui.getCore().byId("matPlantFtrdForm").setModel(oPlantDetailModel);
			sap.ui.getCore().byId("matPlantPurchForm").setModel(oPlantDetailModel);
			// Set Quantity with unit
			var oBaseUom = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
			var vBaseUom = oBaseUom.data.MEINS;
			var vBaseUomDesc = oBaseUom.data.MEINS__TXT;
			if (sap.ui.getCore().byId("Txt_VBAMG").getVisible() !== false) {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.setQtyWithUnit(vBaseUom, vBaseUomDesc, "Txt_VBAMG");
			}
			sap.ui.getCore().byId("Txt_WERKS").setVisible(false); // Make plant invisible in case of multiple plant
			if (plantResults[1].data.MARCBASIC2MLANPURCHRel.results.length > 0) { // set mat tax indicator
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
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.hidePlantGnrlDataSection();
			if (this.os4view.sAction === 'CHANGE') {
				if (aResult.ChangeData.results[0] !== undefined && this.vPlantCreated === "") { // if plant is not created and change data exist
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(aResult, vPanelid);
				} 
				// else if (aResult.ChangeData.results[0] !== undefined && aResult.ChangeData.results[0].EntityAction === "C") { // if plant is created and change data exist
				// 	this.vPlantCreated = 'X';
				// } else if (aResult !== undefined && aResult.ChangeData.results[0] === undefined) { // if plant is created and change data exist
				// 	var aChPlant = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.getChangedPlant();
				// 	for (var p = 0; p < aChPlant.oDataChngd.length; p++) {
				// 		if (aChPlant.oDataChngd[p].vChngdPlant === this.vPlant) {
				// 		this.vPlantCreated = '';
				// 		} else {
				// 		this.vPlantCreated = 'X';	
				// 		}
				// 	}
				// } else {
				// 	this.vPlantCreated = '';
				// }
				if (this.vPlantCreated === "" && plantResults[1].data.MARCBASIC2MLANPURCHRel.results.length > 0 && // tax indicator change data
					plantResults[1].data.MARCBASIC2MLANPURCHRel.results[0].ChangeData.results[0] !== undefined) {
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(plantResults[1].data.MARCBASIC2MLANPURCHRel.results[
						0], vPanelid);
				}
			}
		} else {
			//Controller hook to add, hide or detroy fields/section with no importing parameters and no return param
			/**
			 * @ControllerHook To hide sections if no general data for plant details found
			 * Customer can hide the plant details general data section for create/change
			 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookMatHidePlantGnrlDataSection
			 */
			if (this.extHookMatHidePlantGnrlDataSection) {
				this.extHookMatHidePlantGnrlDataSection();
			} else {
			if (sap.ui.getCore().byId("matPlantDataForm") !== undefined &&
				sap.ui.getCore().byId("MatPlantCentral") !== undefined &&
				sap.ui.getCore().byId("matPlantSalesForm") !== undefined &&
				sap.ui.getCore().byId("Plnt_Sales") !== undefined &&
				sap.ui.getCore().byId("matPlantFtrdForm") !== undefined &&
				sap.ui.getCore().byId("Plant_FTrade") !== undefined &&
				sap.ui.getCore().byId("matPlantPurchForm") !== undefined &&
				sap.ui.getCore().byId("Plant_Purchsng_Data") !== undefined) {
				sap.ui.getCore().byId("matPlantDataForm").destroy();
				sap.ui.getCore().byId("MatPlantCentral").destroy();
				sap.ui.getCore().byId("matPlantSalesForm").destroy();
				sap.ui.getCore().byId("Plnt_Sales").destroy();
				sap.ui.getCore().byId("matPlantFtrdForm").destroy();
				sap.ui.getCore().byId("Plant_FTrade").destroy();
				sap.ui.getCore().byId("matPlantPurchForm").destroy();
				sap.ui.getCore().byId("Plant_Purchsng_Data").destroy();
			}
			}
		}
	},

	getCreatedPlantFlag: function() {
		return this.vPlantCreated;
	},

	// On click event of previous button	
	// onClickPrevious: function() {
	// 	this.loadPlantDetailLayout();
	// 	this.RowId--;
	// 	this.setPlantObjHeader();
	// 	this.setPlantHeader();
	// 	this.getSetPlantDetails();
	// },

	// On click event of next button        
	// onClickNext: function() {
	// 	this.loadPlantDetailLayout();
	// 	this.RowId++;
	// 	this.setPlantObjHeader();
	// 	this.setPlantHeader();
	// 	this.getSetPlantDetails();
	// },


	DestroyInstance: function() {
		if (this.oPlantDataDetails !== undefined && this.oPlantDataDetails !== "") {
			this.oPlantDataDetails.destroy();
		}
		if (this.oValuationDetail !== undefined && this.oValuationDetail !== "") {
			this.oValuationDetail.destroy();
		}
	}

});