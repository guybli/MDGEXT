/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.MatPlantStorageLoc", {

	oPlantStrgLocation: "",
	oPlantMrpTxt: "",
	oPlantMrpArea: "",
	oPlantPrdVersn: "",
	oPlantInspTyp: "",
	vNoDataTxt: "",
	vRouterName: "",
	result: "",
	Strg: "",
	RowId: 0,
	sRowId: 0,
	sAction: "",
	omatValAreaData: "",
	vBwtar: "",
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
	extHookmatHookModifygetChngStrgLocDtlData: null,
	extHookmatHookModifygetChngPrdVerDtlData: null,
	extHookmatHookModifygetChngMrpAreaDtlData: null,
	extHookmatHookModifygetChngInspTypDtlData: null,
	extHookmatHookModifygetStrgDetailsData: null,

	extHookMatmodifyPlantSubDetailsOnInit: null,
	extHookMatHideInspTypSection: null,
	extHookMatHideMrpAreaSection: null,
	extHookMatHidePrdVrsnSection: null,
	extHookMatHideStorgLocSection: null,
	extHookmatHookHidePlantValuationDataSection:null,

	onInit: function() {
		var oVal = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getInstance();
		if (oVal.oValuationInstance !== undefined && oVal.oValuationInstance !== "") {
			oVal.oValuationInstance.destroy();
		}
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		this.getView().byId("StorageLocation").setShowNavButton(true);

		// Get DataManager instance.
		this.oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();
		this.oRouter.attachRouteMatched(function(oEvent) {
			this.vNoDataTxt = this.i18n.getText("NodataCreate");
			switch (oEvent.getParameter("name")) {
				case "matStorageLocDetail":
					// Load Storage Location layout
					this.vRouterName = "matStorageLocDetail";
					this.setHdrObjhdr(oEvent);
					// Get and set the data in Storage Location detail form    
					this.getSetStrgLocDetails();
					break;
				case "matPlantMrpTextDetail":
					this.destroyInstance();
					// load Plant MRP Text detail fragment
					if (this.oPlantMrpTxt === "") {
						this.oPlantMrpTxt = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatPlantMrpTxt', fcg.mdg.approvecrv2.util.Formatter);
					} else {
						this.getView().byId("StorageLocation").removeContent(this.oPlantMrpTxt);
						this.oPlantMrpTxt = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatPlantMrpTxt', fcg.mdg.approvecrv2.util.Formatter);
					}
					this.getView().byId("StorageLocation").addContent(this.oPlantMrpTxt);
					// Set Object header
					this.result = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMrpTxtNavData();
					this.sAction = oEvent.getParameter('arguments').Action;

					var vMrpTxt = this.getView().getModel("i18n").getProperty("Plant_MRPTxt");
					this.getView().byId("StrgLocHdr").setTitle(vMrpTxt);

					var Plant = this.result[1].data.WERKS;
					var PlantTxt = this.result[1].data.WERKS__TXT;
					var PlantobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(Plant, PlantTxt);
					PlantobjDesc = this.i18n.getText("plant") + ": " + PlantobjDesc;
					this.getView().byId("PlantDetailHeader").setText(PlantobjDesc);

					var aMatResult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getPlantNavData();
					var vMaterial = aMatResult.MATERIAL;
					var vMaterialTxt = aMatResult.TXTMI;
					var MatobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vMaterial, vMaterialTxt);
					MatobjDesc = this.i18n.getText("Material") + ": " + MatobjDesc;
					this.getView().byId("MatrlHeader").setText(MatobjDesc);

					// Setting footer Approve and Reject buttons	
					var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
					var aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this);
					// this.getPage().destroyCustomHeader(); // Destroy custom header
					// Set Header and buttons
					// this.getView().byId("MatStrgBtnNext").setVisible(false);
					// this.getView().byId("MatStrgBtnPrev").setVisible(false);
					var MrpTxtTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr("MRP", '', vMrpTxt);
					this.setMatChngDataSubDtlHdr(MrpTxtTitle);
					sap.ui.getCore().byId("Txt_PlantMrp").setText(this.result[1].data.TXTMRP);
					if (this.sAction === "CREATE") {
						// var MrpTxtTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr("MRP", '', vMrpTxt);
						// this.getView().byId("StorageLocation").setTitle(MrpTxtTitle);
						// sap.ui.getCore().byId("Txt_PlantMrp").setText(this.result[1].data.TXTMRP);
					// } else {
						// var vChMrpTxtTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr("MRP", '', vMrpTxt);
						// this.getView().byId("StorageLocation").setTitle(vChMrpTxtTitle);
						// sap.ui.getCore().byId("Txt_PlantMrp").setText(this.result[1].data.TXTMRP);
						var sStyleClass = "text_bold";
						if(this.result[1].data.ChangeData.results !== undefined && this.result[1].data.ChangeData.results.length > 0 &&
							this.result[1].data.ChangeData.results[0].EntityAction !== "C") {
						sap.ui.getCore().byId("Txt_PlantMrp").addStyleClass(sStyleClass);
							}
					}
					break;
			  case "matValAreaDataDetail":
					this.vRouterName = "matValAreaDataDetail";
					this.loadStrgLocLayout();
					//	this.omatValAreaData = "";

					var sRowValId = oEvent.getParameter('arguments').RowId;
					this.RowId = sRowValId;

					var vBwkey = oEvent.getParameter('arguments').bwkey;
					this.vBwtar = oEvent.getParameter('arguments').bwtar;
					if (this.vBwtar === this.getView().getModel("i18n").getProperty("Valuation_Header")) {
						this.vBwtar = "";
					}

					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.getSetValDetailData(vBwkey, this.vBwtar, sRowValId, this, vNewVal);
					var aValAreaResult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getValuationData();
					this.result = aValAreaResult;
					// Setting footer Approve and Reject buttons	
					var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
					var aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this);
					this.setStrgLocHeader();
					this.setStrgLocObjHeader();
					break;
				case "matStrgLocChngDetail":
					// Load Storage Location layout
					this.vRouterName = "matStorageLocDetail";
					this.loadStrgLocLayout();
					this.setPlantSubEntityChangeData(oEvent, "Storage");
					var vStorgLoc = oEvent.getParameter('arguments').STRGLOC;
					var vNewVal = oEvent.getParameter('arguments').NwVal;
					// Get and set the data in Storage Location detail Change form 
					var vChngStrgLocResults = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getChngStrgLocDtlData(this.vMaterial, this.vPlant,
						vStorgLoc, this);
					this.getSetChngStrgLocDtl(vChngStrgLocResults, vNewVal);
					break;
				case "matValuationChngDetail":
					var RowId = oEvent.getParameter('arguments').RowId;
					var aResult = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.getValuationDetailData();
					this.result = aResult;
					var key = aResult.results[RowId].key;
					var vNewVal = aResult.results[RowId].NewValue;
					var plant = aResult.results[RowId].Plant;
					var plant_txt = aResult.results[RowId].plant_txt;
					var oVal = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getInstance();
					if (sap.ui.getCore().byId("matCreatevalutionLayout") !== undefined) {
						sap.ui.getCore().byId("matCreatevalutionLayout").destroy();
					}
	                   this.destroyInstance();
					if (oVal.oValuationInstance === "") {
						oVal.oValuationInstance = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatPlantValuationDetail', fcg.mdg.approvecrv2.util.Formatter);
					} else {
						// If already defined, remove it from detail page and instantiate it again
						if (oVal.oValuationInstance !== undefined) {
							oVal.oValuationInstance.destroy();
						}
						oVal.oValuationInstance = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatPlantValuationDetail', fcg.mdg.approvecrv2.util.Formatter);
					}
					if (key === this.getView().getModel("i18n").getProperty("Valuation_Header")) {
						key = "";
					}
					this.getView().byId("StorageLocation").addContent(oVal.oValuationInstance);
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.getSetValDetailData(plant, key, RowId, this, vNewVal);
					var aValChangedData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.getValDetailData();
					//  var sRequest = this.getView().getModel("i18n").getProperty("DETAIL_TITLE");
					// this.getView().byId("MatStrgBtnNext").setVisible(false);
					// this.getView().byId("MatStrgBtnPrev").setVisible(false);
					// this.getView().byId("StorageLocation").setTitle(this.i18n.getText("DETAIL_TITLE"));
              //if key is not null then the description will be always split else header			
				if(key!=="")
				{
					var key_txt = aResult.results[RowId].bwtar_txt;
					var key = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, key_txt);
				}
				else
				{
						key = this.getView().getModel("i18n").getProperty("Valuation_Header");
				}
					var valuationtext = this.getView().getModel("i18n").getProperty("Mat_Val_Type") + ": " + key;
					this.getView().byId("StrgLocHdr").setTitle(valuationtext);
					var Plant = plant;
					var PlantTxt = aResult.results[this.RowId].plant_txt;
					var PlantobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(Plant, PlantTxt);
					PlantobjDesc = this.i18n.getText("plant") + ": " + PlantobjDesc;
					this.getView().byId("PlantDetailHeader").setText(PlantobjDesc);

					var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
					var aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this);
					var vHdr = fcg.mdg.approvecrv2.util.Formatter.getChngPlantDetailHdr("Valuation");
					this.setMatChngDataSubDtlHdr(vHdr);
					// this.getPage().destroyCustomHeader(); // Destroy custom header
					//this.getView().byId("PlantDetail").setShowNavButton(true);
					//settiing the header plant , material and valuation type
					var aMatResult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
					var vMaterial = aMatResult.data.MATERIAL;
					var vMaterialTxt = aMatResult.data.TXTMI;
					var MatobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vMaterial, vMaterialTxt);
					MatobjDesc = this.i18n.getText("Material") + ": " + " " + MatobjDesc;
					this.getView().byId("MatrlHeader").setText(MatobjDesc);
					break;
					// }
				case "matInsTypDetail":
					// Load Inspection Type layout
					this.vRouterName = "matInsTypDetail";
					this.setHdrObjhdr(oEvent);
					// Get and set the data in Inspetion Type detail form  
					this.getSetInsTypDetails();
					break;
				case "matInspTypChngDetail":
					// Load Storage Location layout
					this.vRouterName = "matInsTypDetail";
					this.loadStrgLocLayout();
					this.setPlantSubEntityChangeData(oEvent, "InspctnType");
					var vInspType = oEvent.getParameter('arguments').InspType;
					var vNewVal = oEvent.getParameter('arguments').NwVal;

					// Get and set the data in Storage Location detail Change form 
					var vChngInspTypResults = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getChngInspTypDtlData(this.vMaterial, this.vPlant,
						vInspType, this);
					this.getSetChngInspTypDtl(vChngInspTypResults, vNewVal);
					break;
				case "matMrpAreaDetail":
					// Load Inspection Type layout
					this.vRouterName = "matMrpAreaDetail";
					this.setHdrObjhdr(oEvent);
					// Get and set the data in MRP Area detail form  
					this.getSetMrpAreaDetails();
					break;
				case "matMrpAreaChngDetail":
					// Load Inspection Type layout
					this.vRouterName = "matMrpAreaDetail";
					this.loadStrgLocLayout();
					this.setPlantSubEntityChangeData(oEvent, "MRPArea");
					var vMrpArea = oEvent.getParameter('arguments').MRPAREA;
					var vNewVal = oEvent.getParameter('arguments').NwVal;
					// Get and set the data in Storage Location detail Change form 
					var vChngMrpAreaResults = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getChngMrpAreaDtlData(this.vMaterial, this.vPlant,
						vMrpArea, this);
					this.getSetChngMrpAreaDtl(vChngMrpAreaResults, vNewVal);
					break;
				case "matPrdVrsnDetail":
					// Load Inspection Type layout
					this.vRouterName = "matPrdVrsnDetail";
					this.setHdrObjhdr(oEvent);
					// Get and set the data in MRP Area detail form  
					this.getSetPrdVerDetails();
					break;
				case "matPrdVerChngDetail":
					// Load Inspection Type layout
					this.vRouterName = "matPrdVrsnDetail";
					this.loadStrgLocLayout();
					this.setPlantSubEntityChangeData(oEvent, "PrdVersn");
					var vPrdVer = oEvent.getParameter('arguments').PRDVER;
					var vNewVal = oEvent.getParameter('arguments').NwVal;
					// Get and set the data in Storage Location detail Change form 
					var vChngPrdVerResults = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getChngPrdVerDtlData(this.vMaterial, this.vPlant,
						vPrdVer, this);
					this.getSetChngPrdVerDtl(vChngPrdVerResults, vNewVal);
					break;
			}
			//controller hook to bind the data with new fragment/section etc with importing param: this.result, oview; no return
			/**
			 * @ControllerHook To give an access to add another router or extend existing one
			 * Customer can modify the plant details or add another section for create/change
			 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookMatmodifyPlantSubDetailsOnInit
			 * @param {object} result Router name
			 * @param {object} result View
			 * @param {object} result Response
			 * @return { }
			 */
			if (this.extHookMatmodifyPlantSubDetailsOnInit) {
				this.extHookMatmodifyPlantSubDetailsOnInit(oEvent, this, this.result);
			}
		}, this);
	},

	// set Header, object header for Change data of Plant sub entity
	setPlantSubEntityChangeData: function(evt, sTxt) {
		var vSubEntity, vPlantObjHdr, vMatObjHdr;
		var vChngKey = evt.getParameter('arguments').ChangeKey;
		var vMatTxt = evt.getParameter('arguments').MatText;
		this.vPlant = evt.getParameter('arguments').PLANT;
		this.vMaterial = evt.getParameter('arguments').MATERIAL;
		var vObjhdr = vChngKey.split(",");

		// Setting footer Approve and Reject buttons
		var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
		var aDecisions = oS3Instance.getDecisions();
		oS3Instance.createDecisionButtons(aDecisions, this);
		// this.getPage().destroyCustomHeader(); // Destroy custom header

		// Setting Header Text and Buttons
		// this.getView().byId("MatStrgBtnNext").setVisible(false);
		// this.getView().byId("MatStrgBtnPrev").setVisible(false);
		var vHdr = fcg.mdg.approvecrv2.util.Formatter.getChngPlantDetailHdr(sTxt);
		this.setMatChngDataSubDtlHdr(vHdr);
		// this.getView().byId("StorageLocation").setTitle(vHdr);
		switch (this.vRouterName) {
			case "matInsTypDetail":
				vSubEntity = this.i18n.getText("Mat_InspctnType") + ": " + vObjhdr[0];
				break;
			case "matMrpAreaDetail":
				vSubEntity = this.i18n.getText("Mat_MRPArea") + ": " + vObjhdr[0];
				break;
			case "matPrdVrsnDetail":
				vSubEntity = this.i18n.getText("Mat_Prd_Ver") + ": " + vObjhdr[0];
				break;
			case "matStorageLocDetail":
				vSubEntity = this.i18n.getText("StorageLoctn") + ": " + vObjhdr[0];
				break;
		}
		vPlantObjHdr = this.i18n.getText("plant") + ": " + vObjhdr[1];
		vMatObjHdr = this.i18n.getText("MATERIAL") + ": " + vMatTxt;
		// Setting Object header
		this.getView().byId("StrgLocHdr").setTitle(vSubEntity);
		this.getView().byId("PlantDetailHeader").setText(vPlantObjHdr);
		this.getView().byId("MatrlHeader").setText(vMatObjHdr);

	},
	
	setMatChngDataSubDtlHdr: function (vHeaderTxt) {
					var vCstmHdr = this.getView().byId("StorageLocation").getCustomHeader();
					vCstmHdr.destroyContentMiddle();
					vCstmHdr.addContentMiddle(new sap.m.Text({
												text: vHeaderTxt
											}));
					if (sap.ui.getCore().byId("MatStrgBtnPrev") !== undefined && sap.ui.getCore().byId("MatStrgBtnNext") !== undefined) {	
					// this.getView().byId("PlantDetail").setTitle(vHdr);
					sap.ui.getCore().byId("MatStrgBtnPrev").setVisible(false);
					sap.ui.getCore().byId("MatStrgBtnNext").setVisible(false);
					}
		},

	setHdrObjhdr: function(oEvent) {
		this.loadStrgLocLayout();
		this.RowId = oEvent.getParameter('arguments').RowId;
		this.sAction = oEvent.getParameter('arguments').Action;
		switch (this.vRouterName) {
			case "matInsTypDetail":
				this.result = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getInspTypeNavData();
				break;
			case "matMrpAreaDetail":
				var vMrpAreaGlbl = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMrpTxtNavData();
				this.result = vMrpAreaGlbl[2];
				break;
			case "matPrdVrsnDetail":
				var vPrdVerGlbl = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMrpTxtNavData();
				this.result = vPrdVerGlbl[3];
				break;
			case "matStorageLocDetail":
				this.result = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getStorageLocNavData();
				break;
		}
		this.setStrgLocObjHeader();

		// Setting footer Approve and Reject buttons
		var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
		var aDecisions = oS3Instance.getDecisions();
		oS3Instance.createDecisionButtons(aDecisions, this);
		// this.getPage().destroyCustomHeader(); // Destroy custom header

		// Setting Header Text and Buttons
		// if (this.sAction === "CREATE") {
		this.setStrgLocHeader();
		// } else {
		// this.getView().byId("MatStrgBtnNext").setVisible(false);
		// this.getView().byId("MatStrgBtnPrev").setVisible(false);
		// this.getView().byId("StorageLocation").setTitle(this.i18n.getText("DETAIL_TITLE"));
		// }
	},

	//  load Storage Location layout	
	loadStrgLocLayout: function() {
		switch (this.vRouterName) {
			case "matInsTypDetail": // load Inspection type detail fragment
				this.destroyInstance();
				if (this.oPlantInspTyp === "") {
					this.oPlantInspTyp = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialInspectionType', fcg.mdg.approvecrv2.util.Formatter);
				} else {
					this.getView().byId("StorageLocation").removeContent(this.oPlantInspTyp);
					this.oPlantInspTyp = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialInspectionType', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("StorageLocation").addContent(this.oPlantInspTyp);
				break;
			case "matMrpAreaDetail": // load MRP Area detail fragment
				this.destroyInstance();
				if (this.oPlantMrpArea === "") {
					this.oPlantMrpArea = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialMRPAreas', fcg.mdg.approvecrv2.util.Formatter);
				} else {
					this.getView().byId("StorageLocation").removeContent(this.oPlantMrpArea);
					this.oPlantMrpArea = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialMRPAreas', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("StorageLocation").addContent(this.oPlantMrpArea);
				break;
			case "matPrdVrsnDetail": // load MRP Area detail fragment
				this.destroyInstance();
				if (this.oPlantPrdVersn === "") {
					this.oPlantPrdVersn = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialProductionVersions', fcg.mdg.approvecrv2.util.Formatter);
				} else {
					this.getView().byId("StorageLocation").removeContent(this.oPlantPrdVersn);
					this.oPlantPrdVersn = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialProductionVersions', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("StorageLocation").addContent(this.oPlantPrdVersn);
				break;
			case "matStorageLocDetail": // load Storage Location detail fragment
				this.destroyInstance();
				if (this.oPlantStrgLocation === "") {
					this.oPlantStrgLocation = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialPlantStorageLoc', fcg.mdg.approvecrv2.util.Formatter);
				} else {
					this.getView().byId("StorageLocation").removeContent(this.oPlantStrgLocation);
					this.oPlantStrgLocation = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialPlantStorageLoc', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("StorageLocation").addContent(this.oPlantStrgLocation);
				break;
			case "matValAreaDataDetail":
				var oVal = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getInstance();
				if (oVal.oValuationInstance === "") {
					this.destroyInstance();
					oVal.oValuationInstance = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatPlantValuationDetail', fcg.mdg.approvecrv2.util.Formatter);
				} else {
					this.destroyInstance();
					this.getView().byId("StorageLocation").removeContent(this.oPlantMrpTxt);
					// if (this.omatValAreaData !== undefined) {
					// 	this.omatValAreaData.destroy();
					// }
					oVal.oValuationInstance = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatPlantValuationDetail', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("StorageLocation").addContent(oVal.oValuationInstance);
				break;
		}
	},

	//  Set Storage Location Header with Iterative buttons
	setStrgLocHeader: function() {
		var sDtlTitle, vTotal;
		// this.getView().byId("MatStrgBtnNext").setVisible(true);
		// this.getView().byId("MatStrgBtnPrev").setVisible(true);
		this.sRowId = this.RowId;
		this.sRowId++;
		switch (this.vRouterName) {
			case "matInsTypDetail": // Set Header for Inspection type
				vTotal = this.result.data.MARCBASIC2QMATBASICRel.results.length;
				sDtlTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr("InspctnType", this.sRowId, vTotal);
				break;
			case "matMrpAreaDetail": // Set Header for MRP Area
				vTotal = this.result.data.MARCBASIC2MDMABASICRel.results.length;
				sDtlTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr("MRPArea", this.sRowId, vTotal);
				break;
			case "matPrdVrsnDetail": // Set Header for MRP Area
				vTotal = this.result.data.MARCBASIC2MKALBASICRel.results.length;
				sDtlTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr("PrdVersn", this.sRowId, vTotal);
				break;
			case "matStorageLocDetail": // Set Header for Storage Location
				vTotal = this.result.data.MARCBASIC2MARDRel.results.length;
				sDtlTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr("Storage", this.sRowId, vTotal);
				break;
			case "matValAreaDataDetail": // Set Header for Storage Location
				var aValAreaResult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getValuationData();
				vTotal = aValAreaResult.data.__batchResponses[0].data.MARCBASIC2MBEWVALUARel.results.length;
				sDtlTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr("Valuation", this.sRowId, vTotal);
				break;
		}
		var vCstmHdr = this.getView().byId("StorageLocation").getCustomHeader();
		vCstmHdr.destroyContentMiddle();
		
		vCstmHdr.addContentMiddle(new sap.m.Text({
						text: sDtlTitle
					}));
		var vlocalIns = this;
		if (sap.ui.getCore().byId("MatStrgBtnPrev") === undefined && sap.ui.getCore().byId("MatStrgBtnNext") === undefined) {	
		vCstmHdr.addContentRight(new sap.m.Button({
									id: "MatStrgBtnPrev", icon:"sap-icon://up", 
									press: function() {					// On click event of previous button  
										vlocalIns.loadStrgLocLayout();
										vlocalIns.RowId--;
										vlocalIns.setStrgLocObjHeader();
										vlocalIns.setStrgLocHeader();
										vlocalIns.getSetDetailData();
									}
								})
							);
		vCstmHdr.addContentRight(new sap.m.Button({
									id: "MatStrgBtnNext", icon:"sap-icon://down",
									press: function() {						// On click event of next button  
										vlocalIns.loadStrgLocLayout();
										vlocalIns.RowId++;
										vlocalIns.setStrgLocObjHeader();
										vlocalIns.setStrgLocHeader();
										vlocalIns.getSetDetailData();
									}
								})
							);
		}
		
		sap.ui.getCore().byId("MatStrgBtnPrev").setVisible(true);
		sap.ui.getCore().byId("MatStrgBtnNext").setVisible(true);
		if (this.sRowId === 1 && vTotal > 1) {
			sap.ui.getCore().byId("MatStrgBtnPrev").setEnabled(false);
			sap.ui.getCore().byId("MatStrgBtnNext").setEnabled(true);
		} else if (this.sRowId === 1 && this.sRowId === vTotal) {
			sap.ui.getCore().byId("MatStrgBtnNext").setVisible(false);
			sap.ui.getCore().byId("MatStrgBtnPrev").setVisible(false);
		} else if (this.sRowId > 1 && this.sRowId === vTotal) {
			sap.ui.getCore().byId("MatStrgBtnNext").setEnabled(false);
			sap.ui.getCore().byId("MatStrgBtnPrev").setEnabled(true);
		} else {
			sap.ui.getCore().byId("MatStrgBtnNext").setEnabled(true);
			sap.ui.getCore().byId("MatStrgBtnPrev").setEnabled(true);
		}
	},

	//  Set Storage Location Object header	
	setStrgLocObjHeader: function() {
		var matresult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getPlantNavData();
		switch (this.vRouterName) {
			case "matInsTypDetail": // Obj Header for Inspection Type
				var vInsPath = this.result.data.MARCBASIC2QMATBASICRel;
				var vInsp = vInsPath.results[this.RowId].ART;
				var vInspTxt = vInsPath.results[this.RowId].ART__TXT;
				var vInspobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vInsp, vInspTxt);
				vInspobjDesc = this.i18n.getText("Mat_InspctnType") + ": " + vInspobjDesc;
				this.getView().byId("StrgLocHdr").setTitle(vInspobjDesc);
				var Plant = this.result.data.WERKS;
				var PlantTxt = this.result.data.WERKS__TXT;
				var PlantobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(Plant, PlantTxt);
				PlantobjDesc = this.i18n.getText("plant") + ": " + PlantobjDesc;
				this.getView().byId("PlantDetailHeader").setText(PlantobjDesc);
				break;
			case "matMrpAreaDetail": // Obj Header for MRP Area
				var vMrpPath = this.result.data.MARCBASIC2MDMABASICRel;
				var vMrpArea = vMrpPath.results[this.RowId].BERID;
				var vMrpAreaTxt = vMrpPath.results[this.RowId].BERID__TXT;
				var vMrpAreaobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vMrpArea, vMrpAreaTxt);
				vMrpAreaobjDesc = this.i18n.getText("Mat_MRPArea") + ": " + vMrpAreaobjDesc;
				this.getView().byId("StrgLocHdr").setTitle(vMrpAreaobjDesc);
				var Plant = this.result.data.WERKS;
				var PlantTxt = this.result.data.WERKS__TXT;
				var PlantobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(Plant, PlantTxt);
				PlantobjDesc = this.i18n.getText("plant") + ": " + PlantobjDesc;
				this.getView().byId("PlantDetailHeader").setText(PlantobjDesc);
				break;
			case "matPrdVrsnDetail": // Obj Header for Production Version
				var vPrdPathPath = this.result.data.MARCBASIC2MKALBASICRel;
				var vPrdVer = vPrdPathPath.results[this.RowId].MKALBASIC;
				var vPrdVerobjDesc = this.i18n.getText("Mat_Prd_Ver") + ": " + vPrdVer;
				this.getView().byId("StrgLocHdr").setTitle(vPrdVerobjDesc);
				var Plant = this.result.data.WERKS;
				var PlantTxt = this.result.data.WERKS__TXT;
				var PlantobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(Plant, PlantTxt);
				PlantobjDesc = this.i18n.getText("plant") + ": " + PlantobjDesc;
				this.getView().byId("PlantDetailHeader").setText(PlantobjDesc);
				break;
			case "matStorageLocDetail": // Obj Header for Storage Location
				this.Strg = this.result.data.MARCBASIC2MARDRel.results[this.RowId].LGORT;
				var StrgTxt = this.result.data.MARCBASIC2MARDRel.results[this.RowId].LGORT__TXT;
				var StrgobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.Strg, StrgTxt);
				StrgobjDesc = this.i18n.getText("StorageLoctn") + ": " + StrgobjDesc;
				this.getView().byId("StrgLocHdr").setTitle(StrgobjDesc);
				var Plant = this.result.data.WERKS;
				var PlantTxt = this.result.data.WERKS__TXT;
				var PlantobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(Plant, PlantTxt);
				PlantobjDesc = this.i18n.getText("plant") + ": " + PlantobjDesc;
				this.getView().byId("PlantDetailHeader").setText(PlantobjDesc);
				break;
			case "matValAreaDataDetail":
				var aValAreaResult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getValuationData();
				var vBwtar = aValAreaResult.data.__batchResponses[0].data.MARCBASIC2MBEWVALUARel.results[this.RowId].BWTAR;
				if (vBwtar === "") {
					vBwtar =this.getView().getModel("i18n").getProperty("Valuation_Header");
				}
				else
				{
					vBwtar=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vBwtar, this.getView().getModel("i18n").getProperty("Mat_Val_Split"));
				}
				var valuationtext = this.getView().getModel("i18n").getProperty("Mat_Val_Type") + ": " + vBwtar;
				this.getView().byId("StrgLocHdr").setTitle(valuationtext);
				var Plant = aValAreaResult.data.__batchResponses[0].data.WERKS;
				var PlantTxt = aValAreaResult.data.__batchResponses[0].data.WERKS__TXT;
				var PlantobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(Plant, PlantTxt);
				PlantobjDesc = this.i18n.getText("plant") + ": " + PlantobjDesc;
				this.getView().byId("PlantDetailHeader").setText(PlantobjDesc);
				break;
		}

		var Material = matresult.MATERIAL;
		var MaterialTxt = matresult.TXTMI;
		var MatobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(Material, MaterialTxt);
		MatobjDesc = this.i18n.getText("Material") + ": " + MatobjDesc;
		this.getView().byId("MatrlHeader").setText(MatobjDesc);
	},

	// Get Inspection Type details and set the data to form
	getSetInsTypDetails: function() {
		var vPanelid = "";
		var oInsTypDtlModel = new sap.ui.model.json.JSONModel();
		var aInsTypResult = this.result.data.MARCBASIC2QMATBASICRel.results[this.RowId];
		oInsTypDtlModel.setData(aInsTypResult);
		sap.ui.getCore().byId("matPlntInspectTypeForm").setModel(oInsTypDtlModel);
		if (this.sAction !== "CREATE") {
			var vChInsRslt = aInsTypResult.ChangeData.results;
			if (vChInsRslt !== undefined) {
				if (vChInsRslt.length > 0 && vChInsRslt[0].EntityAction === "U") {
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(aInsTypResult, vPanelid);
				}
			}

		}
		this.hideStrgS5Title();
	},

	// Get MRP Area details and set the data to form
	getSetMrpAreaDetails: function() {
		var vPanelid = "";
		var oMrpAreaDtlModel = new sap.ui.model.json.JSONModel();
		var aMrpAreaResult = this.result.data.MARCBASIC2MDMABASICRel.results[this.RowId];
		oMrpAreaDtlModel.setData(aMrpAreaResult);
		sap.ui.getCore().byId("matMRPAreasForm").setModel(oMrpAreaDtlModel);
		if (this.sAction !== "CREATE") {
			var vChMrpAreaRslt = aMrpAreaResult.ChangeData.results;
			if (vChMrpAreaRslt !== undefined) {
				if (vChMrpAreaRslt.length > 0 && vChMrpAreaRslt[0].EntityAction === "U") {
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(aMrpAreaResult, vPanelid);
				}
			}

		}
		this.hideStrgS5Title();
	},

	// Get Production Version details and set the data to form
	getSetPrdVerDetails: function() {
		var vPanelid = "";
		var oPrdVerDtlModel = new sap.ui.model.json.JSONModel();
		var aPrdVerResult = this.result.data.MARCBASIC2MKALBASICRel.results[this.RowId];
		oPrdVerDtlModel.setData(aPrdVerResult);
		sap.ui.getCore().byId("matPrdctnVrsnForm").setModel(oPrdVerDtlModel);
		if (this.sAction !== "CREATE") {
			var vChPrdVerRslt = aPrdVerResult.ChangeData.results;
			if (vChPrdVerRslt !== undefined) {
				if (vChPrdVerRslt.length > 0 && vChPrdVerRslt[0].EntityAction === "U") {
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(aPrdVerResult, vPanelid);
				}
			}

		}
		this.hideStrgS5Title();
	},
	// Get Storage Location details and set the data to form
	getSetStrgLocDetails: function() {
		var vPanelid = "";
		var oStrgDtlModel = new sap.ui.model.json.JSONModel();
		var oStrgLocResult = this.result.data.MARCBASIC2MARDRel.results[this.RowId];
		oStrgDtlModel.setData(oStrgLocResult);
		sap.ui.getCore().byId("matPlntStLocForm").setModel(oStrgDtlModel);
		if (this.sAction !== "CREATE") {
			var oStrgResults = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getStrgDetailsData(this.Strg, this);
			var vChStrg = oStrgResults.data.__batchResponses[0].data.ChangeData.results;
			if (vChStrg !== undefined) {
				if (vChStrg.length > 0 && vChStrg[0].EntityAction === "U" && oStrgLocResult.ChangeData.results !== undefined && oStrgLocResult.ChangeData
					.results.length > 0) {
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(oStrgLocResult, vPanelid);
				}
			}
		}
		this.hideStrgS5Title();
	},
	// Get and set Change details for MRP Area
	getSetChngMrpAreaDtl: function(vChMrpArResults, vNew) {
		var vPanelid = "";
		var vAdded = this.i18n.getText("PC_ADDED");
		var vMrpArResults = vChMrpArResults.data.__batchResponses[0].data;
		var oMrpArDtlModel = new sap.ui.model.json.JSONModel();
		oMrpArDtlModel.setData(vMrpArResults);
		sap.ui.getCore().byId("matMRPAreasForm").setModel(oMrpArDtlModel);
		if (vMrpArResults.ChangeData.results !== undefined) {
			if (vMrpArResults.ChangeData.results.length > 0 && vNew !== vAdded) {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(vMrpArResults, vPanelid);
			}
		}
		this.hideStrgS5Title();
	},
	// Get and set Change details for Production version
	getSetChngPrdVerDtl: function(vChPrdVerResults, vNew) {
		var vPanelid = "";
		var vAdded = this.i18n.getText("PC_ADDED");
		var vDeleted = this.i18n.getText("PC_DELETED");
		var vPrdResults = vChPrdVerResults.data.__batchResponses[0].data;
		var oPrdDtlModel = new sap.ui.model.json.JSONModel();
		oPrdDtlModel.setData(vPrdResults);
		sap.ui.getCore().byId("matPrdctnVrsnForm").setModel(oPrdDtlModel);
		if (vPrdResults.ChangeData.results !== undefined) {
			if (vPrdResults.ChangeData.results.length > 0 && vNew !== vAdded && vNew !== vDeleted) {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(vPrdResults, vPanelid);
			}
		}
		this.hideStrgS5Title();
	},
	// Get and set Change details for Inspection Type
	getSetChngInspTypDtl: function(vChInsTypResults, vNew) {
		var vPanelid = "";
		var vAdded = this.i18n.getText("PC_ADDED");
		var vDeleted = this.i18n.getText("PC_DELETED");
		var vInspTypResults = vChInsTypResults.data.__batchResponses[0].data;
		var oInspTypDtlModel = new sap.ui.model.json.JSONModel();
		oInspTypDtlModel.setData(vInspTypResults);
		sap.ui.getCore().byId("matPlntInspectTypeForm").setModel(oInspTypDtlModel);
		if (vInspTypResults.ChangeData.results !== undefined) {
			if (vInspTypResults.ChangeData.results.length > 0 && vNew !== vAdded && vNew !== vDeleted) {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(vInspTypResults, vPanelid);
			}
		}
		this.hideStrgS5Title();
	},

	// Get and set Change details for Storage Location
	getSetChngStrgLocDtl: function(vChStrgLocResults, vNew) {
		var vPanelid = "";
		var vAdded = this.i18n.getText("PC_ADDED");
		var vStrgResults = vChStrgLocResults.data.__batchResponses[0].data;
		var oStrgDtlModel = new sap.ui.model.json.JSONModel();
		oStrgDtlModel.setData(vStrgResults);
		sap.ui.getCore().byId("matPlntStLocForm").setModel(oStrgDtlModel);
		if (vStrgResults.ChangeData.results !== undefined) {
			if (vStrgResults.ChangeData.results.length > 0 && vNew !== vAdded) {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.setBoldPlantGenData(vStrgResults, vPanelid);
			}
		}
		this.hideStrgS5Title();
	},

	//  Hide sections for which no data available	
	hideStrgS5Title: function() {
		var vFormid;
		switch (this.vRouterName) {
			case "matInsTypDetail":
				/**
				 * @ControllerHook To hide Inspection Type detail data for plant
				 * Customer can hide the Inspection Type detail data for plant create/change
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookMatHideInspTypSection
				 */
				if (this.extHookMatHideInspTypSection) {
					this.extHookMatHideInspTypSection();
				} else {
					if (sap.ui.getCore().byId("Txt_INSMK_Q").getVisible() === false &&
						sap.ui.getCore().byId("Txt_AFR").getVisible() === false &&
						sap.ui.getCore().byId("Txt_SPEZUEBER").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PPL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MS_FLAG").getVisible() === false &&
						sap.ui.getCore().byId("Txt_CONF").getVisible() === false &&
						sap.ui.getCore().byId("Txt_APP").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MER").getVisible() === false &&
						sap.ui.getCore().byId("Txt_STICHPRVE").getVisible() === false &&
						sap.ui.getCore().byId("Txt_HPZ").getVisible() === false &&
						sap.ui.getCore().byId("Txt_SPROZ").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MST").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MPB").getVisible() === false &&
						sap.ui.getCore().byId("Txt_DYNREGEL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_DYN").getVisible() === false &&
						sap.ui.getCore().byId("Txt_AVE").getVisible() === false &&
						sap.ui.getCore().byId("Txt_EIN").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MPDAU").getVisible() === false &&
						sap.ui.getCore().byId("Txt_QKZVERF").getVisible() === false &&
						sap.ui.getCore().byId("Txt_QPMAT").getVisible() === false &&
						sap.ui.getCore().byId("Txt_CHG").getVisible() === false &&
						sap.ui.getCore().byId("Txt_KZPRFKOST").getVisible() === false &&
						sap.ui.getCore().byId("Txt_AUFNR_CO").getVisible() === false) {
						vFormid = sap.ui.getCore().byId("matPlntInspectTypeForm");
						fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(vFormid, this.vNoDataTxt);
					}
				}
				break;
			case "matMrpAreaDetail":
				/**
				 * @ControllerHook To hide MRP Area detail data for plant
				 * Customer can hide the MRP Area detail data for plant create/change
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookMatHideMrpAreaSection
				 */
				if (this.extHookMatHideMrpAreaSection) {
					this.extHookMatHideMrpAreaSection();
				} else {
					if (sap.ui.getCore().byId("Txt_DGRMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Mat_MrpAreaGenDta") !== undefined) {
						sap.ui.getCore().byId("Mat_MrpAreaGenDta").destroy();
					}
					if (sap.ui.getCore().byId("Txt_DISMMMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MINBEMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_LFRMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_APOKZMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_FXHORMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_DISMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Mat_MrpPrcdr") !== undefined) {
						sap.ui.getCore().byId("Mat_MrpPrcdr").destroy();
					}
					if (sap.ui.getCore().byId("Txt_DISLSMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_RDPMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_BSTRFMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_BSTMAMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_BSTMIMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_BSTFEMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MABSTMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_LOSFXMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_LAGMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_AUSSSMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_TAKZTMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Mat_MrpLotSizeData") !== undefined) {
						sap.ui.getCore().byId("Mat_MrpLotSizeData").destroy();
					}
					if (sap.ui.getCore().byId("Txt_SOBMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_LGPMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_LGFMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Mat_MrpPrcrmnt") !== undefined) {
						sap.ui.getCore().byId("Mat_MrpPrcrmnt").destroy();
					}
					if (sap.ui.getCore().byId("Txt_MRPMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLIFZMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLIFZX").getVisible() === false &&
						sap.ui.getCore().byId("Mat_MRPSchdlng") !== undefined) {
						sap.ui.getCore().byId("Mat_MRPSchdlng").destroy();
					}
					if (sap.ui.getCore().byId("Txt_EISBEMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_LGRADMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_RWPMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_SHFLGMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_SHZETMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_SHPMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_AHDISMDMA").getVisible() === false &&
						sap.ui.getCore().byId("Mat_MrpNetReqCalc") !== undefined) {
						sap.ui.getCore().byId("Mat_MrpNetReqCalc").destroy();
					}
					if (sap.ui.getCore().byId("Mat_MrpAreaGenDta") === undefined &&
						sap.ui.getCore().byId("Mat_MrpPrcdr") === undefined &&
						sap.ui.getCore().byId("Mat_MrpLotSizeData") === undefined &&
						sap.ui.getCore().byId("Mat_MrpPrcrmnt") === undefined &&
						sap.ui.getCore().byId("Mat_MRPSchdlng") === undefined &&
						sap.ui.getCore().byId("Mat_MrpNetReqCalc") === undefined) {
						vFormid = sap.ui.getCore().byId("matMRPAreasForm");
						fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(vFormid, this.vNoDataTxt);
					}
				}
				break;
			case "matPrdVrsnDetail":
				/**
				 * @ControllerHook To hide Production Version detail data for plant
				 * Customer can hide the Production Version detail data for plant create/change
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookMatHidePrdVrsnSection
				 */
				if (this.extHookMatHidePrdVrsnSection) {
					this.extHookMatHidePrdVrsnSection();
				} else {
					if (sap.ui.getCore().byId("Txt_TEXT1MKAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MKSPMKAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_BSTMIMKAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_BSTMAMKAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_ADATUMKAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_BDATUMKAL").getVisible() === false &&
						sap.ui.getCore().byId("Mat_BasicData") !== undefined) {
						sap.ui.getCore().byId("Mat_BasicData").destroy();
					}
					if (sap.ui.getCore().byId("Txt_PLNTYP").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNNRP").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNALP").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNNRP__TXT").getVisible() === false &&
						sap.ui.getCore().byId("Mat_DtlPlng") !== undefined) {
						sap.ui.getCore().byId("Mat_DtlPlng").destroy();
					}
					if (sap.ui.getCore().byId("Txt_PLNTYG").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNNRG").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNALG").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNNRG__TXT").getVisible() === false &&
						sap.ui.getCore().byId("Mat_RateBsdPlng") !== undefined) {
						sap.ui.getCore().byId("Mat_RateBsdPlng").destroy();
					}
					if (sap.ui.getCore().byId("Txt_PLNTYM").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNNRM").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNALM").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PLNNRM__TXT").getVisible() === false &&
						sap.ui.getCore().byId("Mat_RoughCutPlng") !== undefined) {
						sap.ui.getCore().byId("Mat_RoughCutPlng").destroy();
					}
					if (sap.ui.getCore().byId("Txt_STAMKALBA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_STLANMKAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_CSPMKALBA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_STAMKALBA__TXT").getVisible() === false &&
						sap.ui.getCore().byId("Mat_PrdVrsn_BOM") !== undefined) {
						sap.ui.getCore().byId("Mat_PrdVrsn_BOM").destroy();
					}
					if (sap.ui.getCore().byId("Txt_SERKZMKAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MDV01MKAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_MDVMKALBA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_ELPMKALBA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_ALOMKALBA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_PRVMKALBA").getVisible() === false &&
						sap.ui.getCore().byId("Mat_PrdVrsn_REM") !== undefined) {
						sap.ui.getCore().byId("Mat_PrdVrsn_REM").destroy();
					}
					if (sap.ui.getCore().byId("Txt_MATKOMKAL").getVisible() === false &&
						sap.ui.getCore().byId("Txt_VERMKALBA").getVisible() === false &&
						sap.ui.getCore().byId("Txt_UCMATMKAL").getVisible() === false &&
						sap.ui.getCore().byId("Mat_AddData") !== undefined) {
						sap.ui.getCore().byId("Mat_AddData").destroy();
					}
					if (sap.ui.getCore().byId("Mat_BasicData") === undefined &&
						sap.ui.getCore().byId("Mat_DtlPlng") === undefined &&
						sap.ui.getCore().byId("Mat_RateBsdPlng") === undefined &&
						sap.ui.getCore().byId("Mat_RoughCutPlng") === undefined &&
						sap.ui.getCore().byId("Mat_PrdVrsn_BOM") === undefined &&
						sap.ui.getCore().byId("Mat_PrdVrsn_REM") === undefined &&
						sap.ui.getCore().byId("Mat_AddData") === undefined) {
						vFormid = sap.ui.getCore().byId("matPrdctnVrsnForm");
						fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(vFormid, this.vNoDataTxt);
					}
				}
				break;
			case "matStorageLocDetail":
				/**
				 * @ControllerHook To hide Storage Location detail data for plant
				 * Customer can hide the Storage Location detail data for plant create/change
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookMatHideStorgLocSection
				 */
				if (this.extHookMatHideStorgLocSection) {
					this.extHookMatHideStorgLocSection();
				} else {
					if (sap.ui.getCore().byId("Txt_LWMMARDST").getVisible() === false &&
						sap.ui.getCore().byId("Txt_LGPBE").getVisible() === false &&
						sap.ui.getCore().byId("CreateStLocGenData") !== undefined) {
						sap.ui.getCore().byId("CreateStLocGenData").destroy();
					}
					if (sap.ui.getCore().byId("Txt_LSOMARDMR").getVisible() === false &&
						sap.ui.getCore().byId("Txt_DISKZ").getVisible() === false &&
						sap.ui.getCore().byId("Txt_LMINB").getVisible() === false &&
						sap.ui.getCore().byId("Txt_LBSTF").getVisible() === false &&
						sap.ui.getCore().byId("CreateStLocMRP") !== undefined) {
						sap.ui.getCore().byId("CreateStLocMRP").destroy();
					}
					if (sap.ui.getCore().byId("CreateStLocGenData") === undefined &&
						sap.ui.getCore().byId("CreateStLocMRP") === undefined) {
						vFormid = sap.ui.getCore().byId("matPlntStLocForm");
						fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(vFormid, this.vNoDataTxt);
					}
				}
				break;
		}
		// controller hook for hide section with router name as importing
	},
	// On click event of previous button	
	// onClickPrevious: function() {
	// 	this.loadStrgLocLayout();
	// 	this.RowId--;
	// 	this.setStrgLocObjHeader();
	// 	this.setStrgLocHeader();
	// 	this.getSetDetailData();
	// },

	// // On click event of next button        
	// onClickNext: function() {
	// 	this.loadStrgLocLayout();
	// 	this.RowId++;
	// 	this.setStrgLocObjHeader();
	// 	this.setStrgLocHeader();
	// 	this.getSetDetailData();
	// },

	getSetDetailData: function() {
		switch (this.vRouterName) {
			case "matInsTypDetail":
				this.getSetInsTypDetails();
				break;
			case "matMrpAreaDetail":
				this.getSetMrpAreaDetails();
				break;
			case "matPrdVrsnDetail":
				this.getSetPrdVerDetails();
				break;
			case "matStorageLocDetail":
				this.getSetStrgLocDetails();
				break;
			case "matValAreaDataDetail":
				var aValAreaResult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getValuationData();
				var vBwkey = aValAreaResult.data.__batchResponses[0].data.MARCBASIC2MBEWVALUARel.results[this.RowId].BWKEY;
				var vBwtar = aValAreaResult.data.__batchResponses[0].data.MARCBASIC2MBEWVALUARel.results[this.RowId].BWTAR;
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.getSetValDetailData(vBwkey, vBwtar, this.RowId, this);
				break;
		}
	},

	destroyInstance: function() {
		if (this.oPlantStrgLocation !== undefined && this.oPlantStrgLocation !== "") {
			this.oPlantStrgLocation.destroy();
		}
		if (this.oPlantMrpTxt !== undefined && this.oPlantMrpTxt !== "") {
			this.oPlantMrpTxt.destroy();
		}
		if (this.oPlantMrpArea !== undefined && this.oPlantMrpArea !== "") {
			this.oPlantMrpArea.destroy();
		}
		if (this.oPlantPrdVersn !== undefined && this.oPlantPrdVersn !== "") {
			this.oPlantPrdVersn.destroy();
		}
		if (this.oPlantInspTyp !== undefined && this.oPlantInspTyp !== "") {
			this.oPlantInspTyp.destroy();
		}
		if (this.omatValAreaData !== undefined && this.omatValAreaData !== "") {
			this.omatValAreaData.destroy();
		}
		var oVal = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getInstance();
		if (oVal.oValuationInstance !== undefined && oVal.oValuationInstance !== "") {
			oVal.oValuationInstance.destroy();
		}
	},
	matHookModifygetChngStrgLocDtlData: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifygetChngStrgLocDtlData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifygetChngStrgLocDtlData) {
			var extModifiedData = this.extHookmatHookModifygetChngStrgLocDtlData(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookModifygetChngPrdVerDtlData: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifygetChngPrdVerDtlData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifygetChngPrdVerDtlData) {
			var extModifiedData = this.extHookmatHookModifygetChngPrdVerDtlData(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookModifygetChngMrpAreaDtlData: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifygetChngMrpAreaDtlData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifygetChngMrpAreaDtlData) {
			var extModifiedData = this.extHookmatHookModifygetChngMrpAreaDtlData(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookModifygetChngInspTypDtlData: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifygetChngInspTypDtlData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifygetChngInspTypDtlData) {
			var extModifiedData = this.extHookmatHookModifygetChngInspTypDtlData(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookModifygetStrgDetailsData: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifygetStrgDetailsData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifygetStrgDetailsData) {
			var extModifiedData = this.extHookmatHookModifygetStrgDetailsData(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookHidePlantValuationDataSection: function() {
		/**
		 * @ControllerHook To hide valuation detail data sections in Plant Valuation details screen
		 * Customer can hide valuation detail data sections in Plant Valuation details screen
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenControlle~extHookmatHookHidePlantValuationDataSection
		 * @return {string}
		 */
		if (this.extHookmatHookHidePlantValuationDataSection) {
			this.extHookmatHookHidePlantValuationDataSection();
			return true;
		}
		else {
			return false;
		}
	},
});