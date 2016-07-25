/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("sap.m.TablePersoController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentChange");



fcg.mdg.approvecrv2.DomainSpecParts.Material.Material = {
	oValuationInstance: "",
	oValuationChangedresponse: "",
	oBatchModel: "",
	oS3Controller: null,
	oPlantDtlController: null,
	aSalesDetaildata: "",
	aSalesdata: "",
	matNum: "",
	cNum: "",
	oDistResponse: "",
	oSalesBasicDataResponse: "",
	aSalesDistOrgData: "",
	oSalesBatchModel: "",
	sCreateEntityAction: "C",
	sUpdateEntityAction: "U",
	sDeleteEntityAction: "D",
	sDeletedInstance: "",
	sAddedInstance: "",
	sNotMaint: "",
	sAddedAttribute: "",
	sDeletedAttribute: "",
	Classificationdetailresponse: "",
	salesOrgController: "",
	oMaterialCreateForm: "",
	vContextPath: "",
	Response: "",
	oGtinResponse: "",
	oNotesResponse: "",
	oResponse: "",
	oPlantResponse: "",
	oValuationresponse: "",
	oStrgResponse: "",
	vPlant: "",
	vMaterial: "",
	vCId: "",
	vMatAction: "",
	vMatPlantIconTabSel: "",
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
	aBatchOperation: [],
	gtinresponse: "",
	notesresponse: "",
	PurchasingResponse: "",
	Classificationresponse: "",
	gtinchangedresponse: "",
	Classificationchangedresponse: "",
	Purchasingchangedresponse: "",
	Noteschangedresponse: "",
	ResponseData: "",
	oMRPresponse: "",
	oForcastingresponse: "",
	oQMresponse: "",
	oInspResponse: "",
	oWorkSdresponse: "",
	oStrgCstngresponse: "",
	oStrgCstngChngresponse: "",
	oWorkSdChngresponse: "",
	oQMChngresponse: "",
	oForcastingChngresponse: "",
	oMRPChngresponse: "",
	aMARASalesData: "",
	aSalesnDisbData: "",
	aSalesTaxData: "",
	aSalesTextData: "",
	aBufferedDataDoc: "",
	vNewEntity: "C",
	vUpdatedEntity: "U",
	vDeletedEntity: "D",
	aWarehousedata: "",
	oWarehouseChangeModel: "",
	oWarehouseCreateModel: "",
	awhChangedData: "",
	aDocAssignmentData: "",
	aDocAssignmentOriginalsData: "",
	aDocAssignmentTextData: "",
	sPSTAT: "",
	vPlantnext: "",
	vMatSalesIconTabSel: "",
	vMatWarehouseIconTabSel: "",
	vMatDocAssignIconTabSel: "",
	aPlantSyncData: "",
	oWarehouseCreateResponse: "",
	oWarehouseChangeResponse: "",
	whCreatequery: "",
	aSalesSyncData: "",
	aWhouseSyncData: "",
	aDocSyncData: "",

	// Loading the layout by instantiating object fragment
	loadLayout: function(s3Controller) {
		s3Controller.getView().byId("page").removeContent(s3Controller.oCustomerDomain);
		s3Controller.getView().byId("page").removeContent(s3Controller.costCenterIconTab);
		s3Controller.getView().byId("page").removeContent(s3Controller.oSupplierDomain);
		s3Controller.getView().byId("page").removeContent(s3Controller.profitCenterIconTab);
		s3Controller.getView().byId("page").removeContent(s3Controller.oMaterialIconTab);
		s3Controller.getView().byId("page").removeContent(s3Controller.glAccountIconTab);
		if (this.oValuationInstance !== undefined && this.oValuationInstance !== "") {
			this.oValuationInstance.destroy();
		}
		try {
			sap.ui.getCore().byId("matCreatevalutionLayout").destroy();
		} catch (err) {}
		this.gtinresponse = "";
		this.notesresponse = "";
		this.PurchasingResponse = "";
		this.Classificationresponse = "";
		this.aBufferedDataDoc = "";
		this.vMatPlantIconTabSel = "";
		this.vMatSalesIconTabSel = "";
		this.vMatWarehouseIconTabSel = "";
		this.gtinchangedresponse = "";
		this.Classificationchangedresponse = "";
		this.Purchasingchangedresponse = "";
		this.Noteschangedresponse = "";
		this.ResponseData = "";
		this.Classificationdetailresponse = "";
		this.oValuationresponse = "";
		this.oValuationChangedresponse = "";
		this.aDocAssignmentData = "";
		//deleted and added sting for instance
		this.sDeletedInstance = this.i18n.getText("PC_DELETED");
		this.sAddedInstance = this.i18n.getText("PC_ADDED");
		this.sNotMaint = "(" + this.i18n.getText("PC_NOT_MAIN") + ")";
		this.sAddedAttribute = "(" + this.i18n.getText("PC_ADDED") + ")";
		this.sDeletedAttribute = "(" + this.i18n.getText("PC_DELETED") + ")";
		try {
			sap.ui.getCore().byId("matFileUpload-1-uploader").destroy();
		} catch (err) {}

		try {
			sap.ui.getCore().byId("matFileUpload-uploader").destroy();
		} catch (err) {}
		try {
			sap.ui.getCore().byId("Txt_MatChange").destroy();
		} catch (err) {}
		try {
			sap.ui.getCore().byId("matchngmgmtchngForm").destroy();
		} catch (err) {}
		try {
			sap.ui.getCore().byId("matPurchasingChangeLayout").destroy();
		} catch (err) {}

		try {
			sap.ui.getCore().byId("Mat_Basic_Data_title").destroy();
			sap.ui.getCore().byId("matCreateLayout").destroy();
			s3Controller.oMaterialIconTab.destroy();
		} catch (err) {}
		if (sap.ui.getCore().byId("CreateChngMgmttit") !== undefined) {
			sap.ui.getCore().byId("CreateChngMgmttit").destroy();
		}
		if (sap.ui.getCore().byId("Txt_ECOCHGMNG") !== undefined) {
			sap.ui.getCore().byId("Txt_ECOCHGMNG").destroy();
		}
		if (sap.ui.getCore().byId("Txt_VALID_FROM") !== undefined) {
			sap.ui.getCore().byId("Txt_VALID_FROM").destroy();
		}
		if (sap.ui.getCore().byId("Txt_REVCHGMNG") !== undefined) {
			sap.ui.getCore().byId("Txt_REVCHGMNG").destroy();
		}
		this.oS3Controller = s3Controller; //if profit center icon tab is not initialized, then load it with the fragment else remove the fragment and initialize again
		if (s3Controller.oMaterialIconTab === "") {
			s3Controller.oMaterialIconTab = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.Material', s3Controller);
		} else {
			s3Controller.oMaterialIconTab.destroy();
			try {
				s3Controller.costCenterIconTab.destroy();
				s3Controller.oCustomerDomain.destroy();
				s3Controller.profitCenterIconTab.destroy();
				s3Controller.oSupplierDomain.destroy();
				s3Controller.glAccountIconTab.destroy();
			} catch (err) {}
			s3Controller.oMaterialIconTab = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.Material', s3Controller);
		}
		s3Controller.getView().byId("page").addContent(s3Controller.oMaterialIconTab);
		fcg.mdg.approvecrv2.util.DataAccess.setAsyncBatchData();
		if (this.aPlantSyncData !== undefined) {
			this.aPlantSyncData = "";
		}
		if (this.aSalesSyncData !== undefined) {
			this.aSalesSyncData = "";
		}
		if (this.aWhouseSyncData !== undefined) {
			this.aWhouseSyncData = "";
		}
		if (this.aDocSyncData !== undefined) {
			this.aDocSyncData = "";
		}
	},

	// S3 instance instance is used by Detail page to create footer actions using generic methods defined on S3 Controller
	getS3Instance: function() {
		return this.oS3Controller;
	},

	getGeneralData: function(oView, aBatchOperation, vPath, vAction, s3Controller) {

		this.oBatchModel = s3Controller.getView().getModel("MDG_MATERIAL");
		this.oBatchChangedModel = s3Controller.getView().getModel("MDG_MATERIAL");
		this.setRequestHdrNull(this.oBatchModel);
		var oResponse;
		var oLocalIns = this;
		var sQuery = "";
		var sNoOfQueries = "";
//		var material = s3Controller.getObjectKey();
		var material = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		var matnum =   fcg.mdg.approvecrv2.util.Formatter.ParseObjKey(material);
		this.matNum = matnum;
		this.vContextPath = vPath;
		this.vCId = s3Controller.vCrId;
		this.vMatAction = vAction;
		var vInstNoteTab = sap.ui.getCore().byId("MaterialNotesTab");
		var vInstAttachmentTab = sap.ui.getCore().byId("MaterialAttachmentsTab");
		var vSalesTab = sap.ui.getCore().byId("matSalesIconTab");
		//	var vPlantTab = sap.ui.getCore().byId("");
		var vWarehouseTab = sap.ui.getCore().byId("matWarehouseIconTab");

		var aCrNumDerive = vPath.split("(");
		var aCrNum = aCrNumDerive[1].split(")");
		var sQueryBasicData;
		var url = "Decisions?Crequest=" + aCrNum[0];
		var sDecisionQuery = "/" + url;
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sDecisionQuery, aBatchOperation);

		if (vAction === 'CHANGE') {
			// If logical action is CHANGE, get the query from change files
			sQueryBasicData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.getGeneralDataQuery(this.matNum);
			sQuery = sQueryBasicData + "?$expand=ChangeData,MATERIAL2MATCHGMNGRel";
		this.setRequestHeaderCr(this.oBatchModel);
			if (this.ResponseData === "") {
				fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation);
				// Trigger the batch call
				fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel, s3Controller);
				// Get the response from batch call
				oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
				// Controller Hook method call
				var oExtResponse = this.oS3Controller.matHookModifyMatGeneralChangeData(sQuery, sQueryBasicData, oResponse);
				if (oExtResponse !== undefined) {
					oResponse = oExtResponse;
				}
				this.ResponseData = oResponse[1];
			}
		} else if (vAction === 'CREATE') {

			// If logical action is CREATE, get the query from Create files
			sQueryBasicData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.getGeneralDataQuery(this.matNum);
			sQuery = sQueryBasicData + "?$expand=MATERIAL2MATCHGMNGRel";
			if (this.ResponseData === "") {
			this.setRequestHeaderCr(this.oBatchModel);
				fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation);
				// Trigger the batch call
				fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel, s3Controller);
				// Get the response from batch call
				oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
				// Controller Hook method call
				var oExtCreateResponse = this.oS3Controller.matHookModifyMatGeneralCreateData(sQuery, sQueryBasicData, oResponse,this.matNum);
				if (oExtResponse !== undefined) {
					oResponse = oExtCreateResponse;
				}
				this.ResponseData = oResponse[1];
				// this.ResponseData = oResponse[1];
			}

		}
		if (this.ResponseData !== undefined) {
			this.PSTAT = this.ResponseData.data.MTARTPSTAT;
		}
		// Use batch response to create decision buttons on S3 page footer
		if (oResponse[0].headers !== undefined && oResponse[0].headers.usmd1a016 !== undefined) {
			s3Controller.setCrLockError(oResponse[0].headers.usmd1a016);
			s3Controller.createDecisionButtons(oResponse[0].data.results, s3Controller, "", true);
		} else {
			s3Controller.createDecisionButtons(oResponse[0].data.results, s3Controller);
		}
		//Testing the new scenario
		if (oResponse[0].headers !== undefined && oResponse[0].headers.mdg_gw_approve_cr009 !== undefined) {
			s3Controller.setCrRejected(oResponse[0].headers.mdg_gw_approve_cr009);
		}

		//Code Changed as per the new behavior to handle the notes and attachments 
		s3Controller.setNoteAttachIconTab(vInstNoteTab, vInstAttachmentTab);

		if (fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter("S") === false) {
			vWarehouseTab.setVisible(false);
		}

		if (oResponse[1] !== undefined && oResponse[1].data !== undefined) {
			if (vAction === 'CREATE') { //for create scenario, form should be displayed 
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.load_General_Data(this.oS3Controller);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.displayGeneralData(
					oResponse[1], s3Controller);
			} else if (vAction === 'CHANGE') //for change scenario(including change and addition), table should be rendered
			{
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.initialize_General_Tables(this.oS3Controller);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange
					.displayGeneralTabData(
						oResponse[1],
						oLocalIns, s3Controller);
			}
			//Controller hook; define hook method in s3Controller with parameters: s3Controller instance and oResponse with no return
	      this.oS3Controller.matHookModifyGeneralCreateChangeData(this.oS3Controller,oResponse,vAction);
		} else {
			//If no data returned, hide the general section tab
			sap.ui.getCore().byId("matGenIconTab").setVisible(false);
		}
		if (oResponse[1] !== undefined) {
			var vPrvMat = oResponse[1].data.MATERIAL;
		}
		return vPrvMat;
	},

	getMatClassData: function(classtype, changeno) {
		var oClassdata;
		var sKey = "/CLASSTYPECollection" + "(MATERIAL='" + this.matNum + "',CLASSTYPE='" + classtype + "',CHANGENO='" + changeno + "')";
		var sQuery = sKey + "?$expand=CLASSTYPE2CLASSASGNRel,CLASSTYPE2VALUATIONRel";
		this.setRequestHdrNull(this.oBatchModel);
		var oClassdata = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		// Controller Hook method call
		var oExtClassResponse = this.oS3Controller.matHookModifyMatClassificationCreateData(sQuery, oClassdata);
		if (oExtClassResponse !== undefined) {
			oClassdata = oExtClassResponse;
		}
		return oClassdata.data;
	},
	getValuationAcntData: function(vBwkey, vBwtar) {
		//MBEWVALUACollection(BWKEY='ML01',BWTAR='EIGEN',MATERIAL='$4842')?$expand=MBEWVALUA2MBEWMLACRel,MBEWVALUA2MBEWMLVALRel
		if (this.vMatAction == "CREATE") {
			var sKey = "/MBEWVALUACollection" + "(BWKEY='" + vBwkey + "',BWTAR='" + vBwtar + "',MATERIAL='" + this.matNum + "')";
			var sQuery = sKey + "?$expand=MBEWVALUA2MBEWVALCTNGRel,MBEWVALUA2MBEWMLACRel,MBEWVALUA2MBEWMLVALRel";
		} else {
			var sKey = "/MBEWVALUACollection" + "(BWKEY='" + vBwkey + "',BWTAR='" + vBwtar + "',MATERIAL='" + this.matNum + "')";
			var sQuery = sKey + "?$expand=MBEWVALUA2MBEWVALCTNGRel/ChangeData,MBEWVALUA2MBEWMLACRel/ChangeData,MBEWVALUA2MBEWMLVALRel/ChangeData";
		}
		sQuery=encodeURI(sQuery);
		this.setRequestHeaderCr(this.oBatchModel);
		var oDetailAcntdata = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		// Controller Hook method call
		var oExtResponse = this.oS3Controller.matHookModifyMatPlantValuationAcntData(sQuery, oDetailAcntdata);
		if (oExtResponse !== undefined) {
			oDetailAcntdata = oExtResponse;
		}
		return oDetailAcntdata;
	},
	getPanelData: function(vPanelId) {
	
		var sPurKey = "(MATERIAL='" + this.matNum + "')";
		var sPurChangedKey = "(MATERIAL='" + this.matNum + "')";
		var vMatkey = "/MATERIALCollection('" + this.matNum + "')";
		var sKey = "(MATERIAL='" + this.vMaterial + "'," + "WERKS='" + this.vPlant + "')";
		var sChngData = "?$expand=ChangeData";
		if (vPanelId === 'matGtinPanel') {
			if (this.gtinresponse === "") {
				this.setMatGtinPanel(vMatkey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.bindPanelData(this.gtinresponse, vPanelId, this.oS3Controller);
			}

		} else if (vPanelId === 'matClassificationPanel') {
			if (this.Classificationresponse === "") {
				this.setMatClassificationPanel(vMatkey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.bindPanelData(this.Classificationresponse, vPanelId, this.oS3Controller);
			}
		} else if (vPanelId === 'matPurchasingPanel') {
			if (this.PurchasingResponse === "") {
				this.setMatPurchasingPanel(sPurKey, sPurChangedKey);
			}
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.bindPanelData(this.PurchasingResponse, vPanelId, this.oS3Controller);

		} else if (vPanelId === 'matNotesPanel') {
			if (this.notesresponse === "") {
				this.setMatNotesPanel(vMatkey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.bindPanelData(this.notesresponse, vPanelId, this.oS3Controller);
			}

		} else if (vPanelId === 'matGtinChangedPanel') {
			if (this.gtinchangedresponse === "") {
				this.setMatGtinChangedPanel();
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.InitializePanelData(this.gtinchangedresponse, vPanelId, this.oS3Controller);
			}

			//	fcg.mdg.approvecrv2.DomainSpecParts.MaterialBasicDataChange.InitializePanelData(this.gtinchangedresponse, vPanelId, this.oS3Controller);

		} else if (vPanelId === 'matClassificationChangedPanel') {
			if (this.Classificationchangedresponse === "") {
				this.setMatClassificationChangedPanel(vMatkey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.InitializePanelData(this.Classificationchangedresponse, vPanelId,
					this.oS3Controller);
			}
		} else if (vPanelId === 'matPurchasingChangedPanel') {
			if (this.Purchasingchangedresponse === "") {
				this.setMatPurchasingChangedPanel(sPurChangedKey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.InitializePanelData(this.Purchasingchangedresponse, vPanelId, this
					.oS3Controller);
			}
		} else if (vPanelId === 'matNotesChangedPanel') {
			if (this.Noteschangedresponse === "") {
				this.setMatNotesChangedPanel();
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.InitializePanelData(this.Noteschangedresponse, vPanelId, this.oS3Controller);
			}
		} else if (vPanelId === 'MatReqPlanningPanel') {
			if (this.oMRPresponse === "") {
				this.setMatReqPlanningPanel(sKey, sChngData);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.bindPanelData(this.oMRPresponse, vPanelId, this.oPlantDtlController);
			}
		} else if (vPanelId === 'MatForecastingPanel') {
			if (this.oForcastingresponse === "") {
				this.setMatForecastingPanel(sKey, sChngData);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.bindPanelData(this.oForcastingresponse.data, vPanelId, this.oPlantDtlController);
			}
		} else if (vPanelId === 'MatQltyMngmntPanel') {
			if (this.oQMresponse === "") {
				this.setMatQltyMngmntPanel(sKey, sChngData);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.bindPanelData(this.oQMresponse, vPanelId, this.oPlantDtlController);
			}
		} else if (vPanelId === 'MatWorkSchdlngPanel') {
			if (this.oWorkSdresponse === "") {
				this.setMatWorkSchdlngPanel(sKey, sChngData);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.bindPanelData(this.oWorkSdresponse.data, vPanelId, this.oPlantDtlController);
			}
		} else if (vPanelId === 'MatStrgCstngPanel') {
			if (this.oStrgCstngresponse === "") {
				this.setMatStrgCstngPanel(sKey, sChngData);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.bindPanelData(this.oStrgCstngresponse, vPanelId, this.oPlantDtlController);
			}
		} else if (vPanelId === 'MatReqPlanningPanelChng') {
			if (this.oMRPChngresponse === "") {
				this.setMatReqPlanningPanelChng(vMatkey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.initializePanelData(this.oMRPChngresponse, vPanelId, this.oS3Controller);
			}
		} else if (vPanelId === 'MatForecastingPanelChng') {
			if (this.oForcastingChngresponse === "") {
				this.setMatForecastingPanelChng(vMatkey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.initializePanelData(this.oForcastingChngresponse.data.__batchResponses[
						0]
					.data, vPanelId, this.oS3Controller);
			}
		} else if (vPanelId === 'MatQltyMngmntPanelChng') {
			if (this.oQMChngresponse === "") {
				this.setMatQltyMngmntPanelChng(vMatkey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.initializePanelData(this.oQMChngresponse.data.__batchResponses[0].data,
					vPanelId, this.oS3Controller);
			}
		} else if (vPanelId === 'MatWorkSchdlngPanelChng') {
			if (this.oWorkSdChngresponse === "") {
				this.setMatWorkSchdlngPanelChng(vMatkey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.initializePanelData(this.oWorkSdChngresponse.data.__batchResponses[0].data,
					vPanelId, this.oS3Controller);
			}
		} else if (vPanelId === 'MatStrgCstngPanelChng') {
			if (this.oStrgCstngChngresponse === "") {
				this.setMatStrgCstngPanelChng(vMatkey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.initializePanelData(this.oStrgCstngChngresponse.data.__batchResponses[
						0].data,
					vPanelId, this.oS3Controller);
			}
		}
		//VALUATION PANEL IN PLANT
		else if (vPanelId === 'MatValuationPanel') {
			if (this.vPlantnext !== this.vPlant) {
				this.oValuationresponse = "";
			}
			if (this.oValuationresponse === "") {
				this.setMatValuationPanel();
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.bindPanelData(this.oValuationresponse, vPanelId, this.oPlantDtlController);
			}
			// fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.bindPanelData(this.oValuationresponse, vPanelId, this.oPlantDtlController);

		} else if (vPanelId === 'MatValuationPanelChng') {
			if (this.oValuationChangedresponse === "") {
				this.setMatValuationPanelChng(vMatkey);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.initializePanelData(this.oValuationChangedresponse, vPanelId, this.oS3Controller);
			}
		}
	//Controller hook with panel id as importing parameter defined in S3 controller
		this.oS3Controller.matHookModifyPanelData(vPanelId,this.matNum);
	},

	getValuationData: function() {
		//get valuation Detail Data
		return this.oValuationresponse;
	},
	getDetailGtinData: function() {
		return this.oGtinResponse;
	},
	getDetailNotesData: function() {
		return this.oNotesResponse;
	},

	getDetailData: function() {
		return this.Response;
	},
	getGeneralDetailData: function() {
		return this.ResponseData;
	},
	getPurchaseDetailData: function() {
		return this.Purchasingchangedresponse;
	},

	getDetailGtinChangedData: function() {
		return this.gtinchangedresponse;
	},
	setRequestHdrNull: function(oMatBatchModel) {
		if (oMatBatchModel.mCustomHeaders !== null) {
			oMatBatchModel.mCustomHeaders = null;
			oMatBatchModel.setUseBatch(false);
			return oMatBatchModel;
		}
	},
	setRequestHeaderCr: function(oMatrlBatchModel) {
		if (oMatrlBatchModel.mCustomHeaders === null) {
			var mheaders = {};
			mheaders.crequest = this.vCId;
			oMatrlBatchModel.setHeaders(mheaders);
			oMatrlBatchModel.setUseBatch(true);
			return oMatrlBatchModel;
		}
	},
	
	getAsyncPlantData: function(vPath, vAction, oS3Controller) {
		var sPlantInitialQuery = "";
		this.setRequestHeaderCr(this.oBatchModel);
		if (vAction === 'CHANGE') {
					sPlantInitialQuery = "/MATERIALCollection('" + this.matNum + "')" +
						"?$expand=MATERIAL2MARCRel/ChangeData,MATERIAL2MARCBASICRel/MARCBASIC2MLANPURCHRel/ChangeData";
					this.getMatAsyncData(this.oBatchModel, sPlantInitialQuery,"Plant");
			} else if (vAction === 'CREATE') {
					sPlantInitialQuery = "/MATERIALCollection('" + this.matNum + "')" + "?$expand=MATERIAL2MARCBASICRel";
					this.getMatAsyncData(this.oBatchModel, sPlantInitialQuery,"Plant");
			}
	},
	
	getAsyncSalesData: function(vPath, vAction, oS3Controller) {
		var sSalesInitialQuery = "";
		this.setRequestHeaderCr(this.oBatchModel);
		if (vAction === 'CHANGE') {
					var aBatchOperation = [];	
					var sMARASalesquery = "MARASALESCollection(MATERIAL='" + this.matNum + "')?$expand=ChangeData";
					var sSalesNDisbquery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MVKERel/ChangeData";
					var sSalesTaxQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MVKESALESRel/MVKESALES2MLANSALESRel/ChangeData";
					var sSalesTextQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MVKESALESRel/MVKESALES2SALESTXTRel/ChangeData";
			
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sMARASalesquery, aBatchOperation);
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sSalesNDisbquery, aBatchOperation);
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sSalesTaxQuery, aBatchOperation);
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sSalesTextQuery, aBatchOperation);
					// Controller hook method call	
						var oExtAsyncBatchModel = this.oS3Controller.matHookModifyMatAsyncSalesChBatchCall(this.oBatchModel,sMARASalesquery,sSalesNDisbquery,sSalesTaxQuery,sSalesTextQuery,aBatchOperation);
						if (oExtAsyncBatchModel !== undefined) {
							this.oBatchModel = oExtAsyncBatchModel;
						}
					fcg.mdg.approvecrv2.util.DataAccess.performAsyncSubmitBatch(this.oBatchModel, oS3Controller);
			} else if (vAction === 'CREATE') {
					sSalesInitialQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MARASALESRel,MATERIAL2MVKESALESRel";
					this.getMatAsyncData(this.oBatchModel, sSalesInitialQuery,"Sales");
			}
	},
	getAsyncWhouseData: function(vPath, vAction, oS3Controller) {
		var sWhouseInitialQuery = "";
		this.setRequestHeaderCr(this.oBatchModel);
		if (vAction === 'CHANGE') {
					sWhouseInitialQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MLGNSTORRel/ChangeData,MATERIAL2MLGNSTORRel/MLGNSTOR2MLGTSTORRel/ChangeData";
					this.getMatAsyncData(this.oBatchModel, sWhouseInitialQuery,"Whouse");
			} else if (vAction === 'CREATE') {
					sWhouseInitialQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MLGNSTORRel";
					this.getMatAsyncData(this.oBatchModel, sWhouseInitialQuery,"Whouse");
			}
	},
	getAsyncDocData: function(vPath, vAction, oS3Controller) {
		var sDocInitialQuery = "";
		this.setRequestHeaderCr(this.oBatchModel);
		if (vAction === 'CHANGE') {
					sDocInitialQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2DRADBASICRel/ChangeData,MATERIAL2DRADBASICRel/DRADBASIC2DRADTXTRel/ChangeData";
					this.getMatAsyncData(this.oBatchModel, sDocInitialQuery,"Doc");
			} else if (vAction === 'CREATE') {
					sDocInitialQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2DRADBASICRel";
					this.getMatAsyncData(this.oBatchModel, sDocInitialQuery,"Doc");
			}
	},
	getMatAsyncData: function(oDataModel,sQueryBasicData,vTab) {
	// Controller hook method call	
		var oExtAsyncQuery = this.oS3Controller.matHookModifyMatAsyncQueryCall(sQueryBasicData);
		if (oExtAsyncQuery !== undefined) {
			sQueryBasicData = oExtAsyncQuery;
		}
		oDataModel.read(
			sQueryBasicData,
			null, //this.getView().getModel().createBindingContext(queryString), 
			null, //[]			,
			true,
			function(oData, response) {
				if (vTab === "Sales") {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setSalesSyncData(response);
				} else if (vTab === "Plant") {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setPlantSyncData(response);
				} else if (vTab === "Whouse") {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setWhouseSyncData(response);
				} else if (vTab === "Doc") {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setDocSyncData(response);
				}
			},
			function(e) {}
		);
	},

	// get Plant Data for s3
	getPlantData: function(oView, vPath, vAction, s3Controller) {
		if (this.vMatPlantIconTabSel === "") { // check if buffered or not
			this.oMRPresponse = "";
			this.oForcastingresponse = "";
			this.oQMresponse = "";
			this.oWorkSdresponse = "";
			this.oStrgCstngresponse = "";
			this.oStrgCstngChngresponse = "";
			this.oWorkSdChngresponse = "";
			this.oQMChngresponse = "";
			this.oForcastingChngresponse = "";
			this.oMRPChngresponse = "";
			this.oS3Controller = s3Controller;
			var sQueryBasicData = "";
			this.oBatchModel = s3Controller.getView().getModel("MDG_MATERIAL");
			this.setRequestHeaderCr(this.oBatchModel);
			var vSyncPlantData = this.aPlantSyncData;
			// if (vSyncAllTabData !== undefined && vSyncAllTabData !== "") {
			// 	var vSyncPlantData = vSyncAllTabData.data.__batchResponses[0].data.MATERIAL2MARCBASICRel.results;
			// 	var vSyncPlantChngData = vSyncAllTabData.data.__batchResponses[0].data.MATERIAL2MARCRel.results;
			// }
			if (vAction === 'CHANGE') {
				if (vSyncPlantData !== undefined && vSyncPlantData !== "" && vSyncPlantData !== null) {
					this.oPlantResponse = vSyncPlantData;
				} else {
					sQueryBasicData = "/MATERIALCollection('" + this.matNum + "')" +
						"?$expand=MATERIAL2MARCRel/ChangeData,MATERIAL2MARCBASICRel/MARCBASIC2MLANPURCHRel/ChangeData";
					this.oPlantResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQueryBasicData);
				}
			} else if (vAction === 'CREATE') {
				if (vSyncPlantData !== undefined && vSyncPlantData !== "" && vSyncPlantData !== null) {
					this.oPlantResponse = vSyncPlantData;
				} else {
					sQueryBasicData = "/MATERIALCollection('" + this.matNum + "')" + "?$expand=MATERIAL2MARCBASICRel";
					this.oPlantResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQueryBasicData);
				}
			}
			// Controller Hook method call
			if(sQueryBasicData !== "") {
			var oExtPlantResponse = this.oS3Controller.matHookModifygetPlantData(sQueryBasicData, this.oPlantResponse);
			if (oExtPlantResponse !== undefined) {
				this.oPlantResponse = oExtPlantResponse;
			}
			}
			if (vAction === 'CREATE') {
				// check and destroy the Plant detail fragment if already loaded 
				if (this.oPlantDtlController !== null) {
					if (this.oPlantDtlController.oPlantDataDetails !== undefined) {
						this.oPlantDtlController.oPlantDataDetails.destroy();
					}
				}
				if (this.oPlantResponse.data.__batchResponses[0].data.MATERIAL2MARCBASICRel.results.length > 0) {
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.initializePlantTabl(this.oPlantResponse.data.__batchResponses[0].data,
						this.oS3Controller);
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantCreate.displayPlantData(this.oPlantResponse.data.__batchResponses[0].data,
						s3Controller);
				} else {
					if (sap.ui.getCore().byId("matChangePlantDataLayout") !== undefined) {
						sap.ui.getCore().byId("matChangePlantDataLayout").destroy();
					}
					var vNoDataTxt = this.i18n.getText("NodataCreate");
					var oPlantTab = sap.ui.getCore().byId("matCreatePlantDataLayout");
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(oPlantTab, vNoDataTxt);
				}
			} else if (vAction === 'CHANGE') {
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.initializePlantChangetabl(this.oS3Controller);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialPlantChange.displayPlantChangeData(this.oPlantResponse.data.__batchResponses[0].data,
					s3Controller);
			}
			this.vMatPlantIconTabSel = "X"; // set to buffered
		}
	},

	getPlantNavData: function() {
		return this.oPlantResponse.data.__batchResponses[0].data;
	},
	getMrpTxtNavData: function() {
		return this.oMRPresponse;
	},
	// Get Plant Detail data    
	getPlantDetailsData: function(plantDtlController, oPlant, oMat) {
		this.oPlantDtlController = plantDtlController;
		var aBatchOperation = [];
		this.vPlant = oPlant;
		this.vMaterial = oMat;
		this.oMRPresponse = "";
		this.oForcastingresponse = "";
		this.oQMresponse = "";
		this.oWorkSdresponse = "";
		this.oStrgCstngresponse = "";
		var sQuery = "";
		var sMatTaxQuery = "";
		var oPlantDtlResponse = "";
		this.setRequestHeaderCr(this.oBatchModel);
		if (this.vMatAction === 'CREATE') {
			sQuery = "/MARCCollection(MATERIAL='" + oMat + "'," + "WERKS='" + oPlant + "')";
			sMatTaxQuery = "/MARCBASICCollection(MATERIAL='" + oMat + "'," + "WERKS='" + oPlant + "')?$expand=MARCBASIC2MLANPURCHRel";
		} else if (this.vMatAction === 'CHANGE') {
			sQuery = "/MARCCollection(MATERIAL='" + oMat + "'," + "WERKS='" + oPlant + "')?$expand=ChangeData";
			sMatTaxQuery = "/MARCBASICCollection(MATERIAL='" + oMat + "'," + "WERKS='" + oPlant + "')?$expand=MARCBASIC2MLANPURCHRel/ChangeData";
		}
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sMatTaxQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel, this.oS3Controller);
		oPlantDtlResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
		// Controller Hook method call
		var oExtPlantDtlResponse = this.oS3Controller.matHookModifygetPlantDetailsData(sQuery, sMatTaxQuery, oPlantDtlResponse);
		if (oExtPlantDtlResponse !== undefined) {
			oPlantDtlResponse = oExtPlantDtlResponse;
		}
		if (sap.ui.getCore().byId("MatReqPlanningPanel") !== undefined) {
			sap.ui.getCore().byId("MatReqPlanningPanel").attachExpand(this.oS3Controller.onPanelExpand, this);
		}
		if (sap.ui.getCore().byId("MatForecastingPanel") !== undefined) {
			sap.ui.getCore().byId("MatForecastingPanel").attachExpand(this.oS3Controller.onPanelExpand, this);
		}
		if (sap.ui.getCore().byId("MatQltyMngmntPanel") !== undefined) {
			sap.ui.getCore().byId("MatQltyMngmntPanel").attachExpand(this.oS3Controller.onPanelExpand, this);
		}
		if (sap.ui.getCore().byId("MatWorkSchdlngPanel") !== undefined) {
			sap.ui.getCore().byId("MatWorkSchdlngPanel").attachExpand(this.oS3Controller.onPanelExpand, this);
		}
		if (sap.ui.getCore().byId("MatStrgCstngPanel") !== undefined) {
			sap.ui.getCore().byId("MatStrgCstngPanel").attachExpand(this.oS3Controller.onPanelExpand, this);
		}
		if (sap.ui.getCore().byId("MatValuationPanel") !== undefined) {
			sap.ui.getCore().byId("MatValuationPanel").attachExpand(this.oS3Controller.onPanelExpand, this);
		}
		return oPlantDtlResponse;
	},

	getStorageLocNavData: function() {
		return this.oStrgResponse;
	},

	getInspTypeNavData: function() {
		return this.oInspResponse;
	},

	// Get Storage Location Change Data	to check whether it is created or changed
	getStrgDetailsData: function(vStorage,s4Controller) {
		var sStLocQuery = "/MARDSTORCollection(MATERIAL='" + this.vMaterial + "'," + "WERKS='" + this.vPlant + "'," + "LGORT='" + vStorage +
			"')?$expand=ChangeData";
		var oSLocResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sStLocQuery);
		// Controller Hook method call
		var oExtSLocResponse = s4Controller.matHookModifygetStrgDetailsData(sStLocQuery, oSLocResponse);
		if (oExtSLocResponse !== undefined) {
			oSLocResponse = oExtSLocResponse;
		}
		return oSLocResponse;
	},
	// Get Inspection Type Change Data
	getChngInspTypDtlData: function(vMaterial, vPlant, vInspTyp, s4Controller) {
		this.setRequestHeaderCr(this.oBatchModel);
		var sInspQuery = "/QMATBASICCollection(MATERIAL='" + vMaterial + "'," + "WERKS='" + vPlant + "'," + "ART='" + vInspTyp +
			"')?$expand=ChangeData";
		var oInspTypeResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sInspQuery);
		// Controller Hook method call
		var oExtInspTypeResponse = s4Controller.matHookModifygetChngInspTypDtlData(sInspQuery, oInspTypeResponse);
		if (oExtInspTypeResponse !== undefined) {
			oInspTypeResponse = oExtInspTypeResponse;
		}
		return oInspTypeResponse;
	},
	// Get MRP Area Change Data
	getChngMrpAreaDtlData: function(vMaterial, vPlant, vMrpArea, s4Controller) {
		this.setRequestHeaderCr(this.oBatchModel);
		var sMrpAreaQuery = "/MDMABASICCollection(MATERIAL='" + vMaterial + "'," + "WERKS='" + vPlant + "'," + "BERID='" + vMrpArea +
			"')?$expand=ChangeData";
		var oMrpAreaResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sMrpAreaQuery);
		// Controller Hook method call
		var oExtMrpAreaResponse = s4Controller.matHookModifygetChngMrpAreaDtlData(sMrpAreaQuery, oMrpAreaResponse);
		if (oExtMrpAreaResponse !== undefined) {
			oMrpAreaResponse = oExtMrpAreaResponse;
		}
		return oMrpAreaResponse;
	}, 
	// Get Production Version Change Data
	getChngPrdVerDtlData: function(vMaterial, vPlant, vPrdVer, s4Controller) {
		this.setRequestHeaderCr(this.oBatchModel);
		var sPrdQuery = "/MKALBASICCollection(MATERIAL='" + vMaterial + "'," + "WERKS='" + vPlant + "'," + "MKALBASIC='" + vPrdVer +
			"')?$expand=ChangeData";
		var oPrdResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sPrdQuery);
		// Controller Hook method call
		var oExtPrdResponse = s4Controller.matHookModifygetChngPrdVerDtlData(sPrdQuery, oPrdResponse);
		if (oExtPrdResponse !== undefined) {
			oPrdResponse = oExtPrdResponse;
		}
		return oPrdResponse;
	},
	// Get Storage Location Change Data
	getChngStrgLocDtlData: function(vMaterial, vPlant, vStorgLoc, s4Controller) {
		this.setRequestHeaderCr(this.oBatchModel);
		var sQuery = "/MARDCollection(MATERIAL='" + vMaterial + "'," + "WERKS='" + vPlant + "'," + "LGORT='" + vStorgLoc +
			"')?$expand=ChangeData";
		var oSLocResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		// Controller Hook method call
		var oExtSLocResponse = s4Controller.matHookModifygetChngStrgLocDtlData(sQuery, oSLocResponse);
		if (oExtSLocResponse !== undefined) {
			oSLocResponse = oExtSLocResponse;
		}
		return oSLocResponse;
	},

	getSalesData: function(oView, vPath, vAction, s3Controller) {
		// If logical action is CHANGE, get the query from change files
		//get Sales data for S3 screen 
		if (this.vMatSalesIconTabSel === "") {
			this.oBatchModel = s3Controller.getView().getModel("MDG_MATERIAL");
			this.vContextPath = vPath;
			var oLocalIns = this;
			if (vAction === 'CHANGE') {
				this.executeSalesChangeQuery();
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesChange.initializeTables(this.oS3Controller);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesChange
					.displayTableData(
						oLocalIns, s3Controller);
			} else if (vAction === 'CREATE') {
				// If logical action is CREATE, get the query from Create files
				if (this.oBatchModel !== undefined) {
					this.setRequestHeaderCr(this.oBatchModel);
					this.executeSalesCreateGeneralQuery();
					this.aSalesdata = this.oSalesBasicDataResponse.data.__batchResponses[0].data.MATERIAL2MARASALESRel;
					this.aSalesDistOrgData = this.oSalesBasicDataResponse.data.__batchResponses[0];
				}
				if (this.oSalesBasicDataResponse !== undefined) {
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.initialize_SalesForms(this.oS3Controller);
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.displaySalesFormData(
						this.aSalesdata);
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate.bindSalesTableData(this.aSalesDistOrgData, s3Controller);
				}
			}
			this.vMatSalesIconTabSel = "X";
			//Controller hook defined in S3 with importing s3Controller 
		}
	},

	getSalesTableData: function(tRowId) {
		//get data for S4 screen for respective Sales Org and Distribution Channel.
		this.oSalesBatchModel = this.oS3Controller.getView().getModel("MDG_MATERIAL");
		this.executeSalesCreateQuery(tRowId);
		this.aSalesDetailData = this.oSalesresponse[0];
		this.aSalesTaxData = this.oSalesresponse[1];

	},
	executeSalesCreateGeneralQuery: function() {
			var vSyncSalesData = this.aSalesSyncData;
			if (vSyncSalesData !== undefined && vSyncSalesData !== "" && vSyncSalesData !== null) {
		// 		var vSyncSalesData = vSyncAllTabData.data.__batchResponses[0].data.MATERIAL2MARASALESRel;
		// 		var vSyncSalesOrgData = vSyncAllTabData.data.__batchResponses[0].data.MATERIAL2MVKESALESRel.results;
		// 	}
		// if ((vSyncAllTabData !== undefined && vSyncAllTabData !== "" && vSyncSalesData !== undefined && vSyncSalesData !== "")||
		// 	(vSyncAllTabData !== undefined && vSyncAllTabData !== "" && vSyncSalesOrgData !== undefined && vSyncSalesOrgData !== "")) {
					this.oSalesBasicDataResponse = vSyncSalesData;
		} else {
		var Salesquery = "MARASALESCollection(MATERIAL='" + this.matNum + "')";
		var salesOrgQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MARASALESRel,MATERIAL2MVKESALESRel";
		this.oSalesBasicDataResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, salesOrgQuery);
		}
		// Controller Hook method call
		if (salesOrgQuery !== undefined) {
		var oExtMatSalesCreateResponse = this.oS3Controller.matHookModifyMatSalesCreateData(Salesquery, salesOrgQuery, this.oSalesBasicDataResponse);
		if (oExtMatSalesCreateResponse !== undefined) {
			this.oSalesBasicDataResponse = oExtMatSalesCreateResponse;
		}
		}
	},

	executeSalesCreateQuery: function(tRowId) {
		var aBatchOperation = [];
		var vkorg = this.aSalesDistOrgData.data.MATERIAL2MVKESALESRel.results[tRowId].VKORG;
		var vtweg = this.aSalesDistOrgData.data.MATERIAL2MVKESALESRel.results[tRowId].VTWEG;
		this.setRequestHeaderCr(this.oSalesBatchModel);
		var Salesquery = "MVKECollection(MATERIAL='" + this.matNum + "',VKORG='" + vkorg + "',VTWEG='" + vtweg + "')";
		var sTaxQuery = "MVKESALESCollection(MATERIAL='" + this.matNum + "',VKORG='" + vkorg + "',VTWEG='" + vtweg +
			"')?$expand=MVKESALES2MLANSALESRel,MVKESALES2SALESTXTRel";
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oSalesBatchModel, Salesquery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oSalesBatchModel, sTaxQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oSalesBatchModel, this.oS3Controller);
		this.oSalesresponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
	},

	getSalesDetailData: function() {
		//get SalesOrg Detail Data

		return this.aSalesDetailData;
	},
	getSalesTaxData: function() {
		//get Sales Tax and Text Data
		return this.aSalesTaxData;
	},
	setMatSalesOrgInstance: function(salesOrgController) {
		//set MatSalesOrg Instance
		this.salesOrgController = salesOrgController;
	},
	getMatSalesOrgInstance: function() {
		//set MatSalesOrg Instance
		return this.salesOrgController;
	},
	//Query for Sales change data in a single Batch Operation
	executeSalesChangeQuery: function() {
		var oSalesChResponse = fcg.mdg.approvecrv2.util.DataAccess.getAsyncBatchData();
		if (oSalesChResponse === null || oSalesChResponse === "" || oSalesChResponse === undefined || oSalesChResponse.length === 0) {
		var aBatchOperation = [];
		this.oSalesBatchModel = this.oS3Controller.getView().getModel("MDG_MATERIAL");
		this.setRequestHeaderCr(this.oSalesBatchModel);
		var sMARASalesquery = "MARASALESCollection(MATERIAL='" + this.matNum + "')?$expand=ChangeData";
		var sSalesNDisbquery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MVKERel/ChangeData";
		var sSalesTaxQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MVKESALESRel/MVKESALES2MLANSALESRel/ChangeData";
		var sSalesTextQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MVKESALESRel/MVKESALES2SALESTXTRel/ChangeData";

		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oSalesBatchModel, sMARASalesquery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oSalesBatchModel, sSalesNDisbquery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oSalesBatchModel, sSalesTaxQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oSalesBatchModel, sSalesTextQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oSalesBatchModel, this.oS3Controller);
		this.oSalesresponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
		} else {
			this.oSalesresponse = oSalesChResponse;
		}
		this.aMARASalesData = this.oSalesresponse[0];
		this.aSalesnDisbData = this.oSalesresponse[1];
		this.aSalesTaxData = this.oSalesresponse[2];
		this.aSalesTextData = this.oSalesresponse[3];
		
		// Controller Hook method call
		var oExtMatSalesChangeResponse = this.oS3Controller.matHookModifyMatSalesChangedData(sMARASalesquery, sSalesNDisbquery, sSalesTaxQuery, sSalesTextQuery, this.oSalesresponse);
		if (oExtMatSalesChangeResponse !== undefined) {
			this.oSalesresponse = oExtMatSalesChangeResponse;
		}	

	}, // end of executeSalesChangeQuery

	getMARASalesDetailData: function() {
		//get SalesOrg Detail Data

		return this.aMARASalesData;
	},
	getSalesNDisbDetailData: function() {
		return this.aSalesnDisbData;
	},

	getMVKESalesTaxDetailData: function() {
		return this.aSalesTaxData;
	},
	getMVKESalesTextDetailData: function() {
		return this.aSalesTextData;
	},
	setHeaderToolbar: function(oTabInstance, sText) {
		var oTitle = new sap.m.Title();
		oTitle.setText(sText);
		oTitle.addStyleClass("sapThemeFontSize");
		var oHeaderToolBar = new sap.m.Toolbar();
		oHeaderToolBar.addContent(oTitle);
		oTabInstance.setHeaderToolbar(oHeaderToolBar);

	},

	// perform a binarysearch to find the element in the array
	binarySearchSalesNDisb: function(strSalesKey, strDisbKey, salesNdisbdata) {
		var stop = salesNdisbdata.results.length;
		var last, p = 0;
		var delta = 0;

		do {
			last = p;

			if (salesNdisbdata.results[p].VKORG > strSalesKey && salesNdisbdata.results[p].VTWEG > strDisbKey) {
				stop = p + 1;
				p -= delta;
			} else if (salesNdisbdata.results[p].VKORG === strSalesKey && salesNdisbdata.results[p].VTWEG === strDisbKey) {
				// FOUND A MATCH!, return the correct row.
				return salesNdisbdata.results[p];
			}

			delta = Math.floor((stop - p) / 2);
			p += delta; //if delta = 0, p is not modified and loop exits

		} while (last !== p);

		return -1; //nothing found

	},
	getCreateEntityAction: function() {
		return this.sCreateEntityAction;
	},
	getDeleteEntityAction: function() {
		return this.sDeleteEntityAction;
	},
	getUpdateEntityAction: function() {
		return this.sUpdateEntityAction;
	},
	getDeletedInstanceString: function() {
		return this.sDeletedInstance;
	},
	getAddedInstanceString: function() {
		return this.sAddedInstance;
	},
	getNotMaintString: function() {
		return this.sNotMaint;
	},
	getDeletedAttributeString: function() {
		return this.sDeletedAttribute;
	},
	getAddedAttributeString: function() {
		return this.sAddedAttribute;
	},

	//************************************************************************************************************************************************************************
	getWarehouseData: function(oView, vPath, vAction, s3Controller) {
		//get Warehouse data for S3 screen 
		if (this.vMatWarehouseIconTabSel === "") {

			this.vContextPath = vPath;
			if (vAction === 'CREATE') {
				// If logical action is CREATE, get the query from Create files
				this.oWarehouseCreateModel = s3Controller.getView().getModel("MDG_MATERIAL");
				if (this.oWarehouseCreateModel !== undefined) {

					this.executeWarehouseCreateQuery();
				}
				if (this.awhCreateData !== undefined) {
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.initializeWarehouseTabl(this.awhCreateData, this.oS3Controller);
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.displayWarehouseData(this.awhCreateData, this.oS3Controller);
				}
			} else if (vAction === 'CHANGE') {
				//if vAction is CHANGE
				this.oWarehouseChangeModel = s3Controller.getView().getModel("MDG_MATERIAL");
				this.executeWarehouseChangeQuery(); //call warehouse change query.
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseChange.initializeWarehouseChangeTables(this.oS3Controller);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseChange.displayWarehouseChangedTableData(s3Controller);
			}
		}
		//controller hook defined in s3 with param:action,this.owarehosuereposnse,this.oS3Controller
		this.vMatWarehouseIconTabSel = "X";
	},
	//*******************************************************************************************************************************************************************************
	//execute warehouse query to get warehouse types
	executeWarehouseCreateQuery: function() {
		var vSyncWHData = this.aWhouseSyncData;
		if (vSyncWHData !== undefined && vSyncWHData !== "" && vSyncWHData !== null) {
			this.oWarehouseCreateResponse = vSyncWHData;
		// }
		// if (vSyncAllTabData !== undefined && vSyncAllTabData !== "" && vSyncWarehouseCreateData !== undefined && vSyncWarehouseCreateData !== "" && vSyncWarehouseCreateData.length >0) {
		// 	this.oWarehouseCreateResponse = vSyncAllTabData;
		} else {
			this.setRequestHeaderCr(this.oWarehouseCreateModel);
			this.whCreatequery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2MLGNSTORRel";

			this.oWarehouseCreateResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oWarehouseCreateModel, this.whCreatequery);
			var oExtoWarehouseCreateResponse = this.oS3Controller.matHookModifyMatWarehouseCreateData(this.whCreatequery, this.oWarehouseCreateResponse);
			if (oExtoWarehouseCreateResponse !== undefined) {
				this.oWarehouseCreateResponse = oExtoWarehouseCreateResponse;
			}
		}
		this.awhCreateData = this.oWarehouseCreateResponse.data.__batchResponses[0].data.MATERIAL2MLGNSTORRel;

	},
	//*******************************************************************************************************************************************************************************
	//execute warehouse detail query to get detailed data of respective warehouse
	executeWarehouseDetailQuery: function(tRowId) {

		var whDetailsCreatequery = "MLGNSTORCollection(LGNUM='" + this.awhCreateData.results[tRowId].LGNUM + "',MATERIAL='" + this.matNum +
			"')?$expand=MLGNSTOR2MLGTSTORRel";
		this.setRequestHeaderCr(this.oWarehouseCreateModel);
		this.oWarehouseDetailResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oWarehouseCreateModel, whDetailsCreatequery);
		var oExtoWarehouseDetailResponse = this.oS3Controller.matHookModifyMatWarehouseDetailData(whDetailsCreatequery, this.oWarehouseDetailResponse);
		if (oExtoWarehouseDetailResponse !== undefined) {
			this.oWarehouseDetailResponse = oExtoWarehouseDetailResponse;
		}
		this.awhDetailData = this.oWarehouseDetailResponse.data;

	},

	//******************************************************************************************************
	executeWarehouseChangeQuery: function() {
		//Query formation and getting response object for Warehouse Change
		var vSyncWhChData = this.aWhouseSyncData;
		if (vSyncWhChData !== undefined && vSyncWhChData !== "" && vSyncWhChData !== null) {
			this.oWarehouseChangeResponse = vSyncWhChData;
		// if (vSyncAllTabData !== undefined && vSyncAllTabData !== "") {

		// 	var vSyncWarehouseChangeData = vSyncAllTabData.data.__batchResponses[0].data.MATERIAL2MLGNSTORRel.results;
		// }
		// if (vSyncAllTabData !== undefined && vSyncAllTabData !== "" && vSyncWarehouseChangeData !== undefined && vSyncWarehouseChangeData !== "" && vSyncWarehouseChangeData.length>0) {
		// 	this.oWarehouseChangeResponse = vSyncAllTabData;
		} else {
			this.setRequestHeaderCr(this.oWarehouseChangeModel);
			var whChangeQuery = "MATERIALCollection('" + this.matNum +
				"')?$expand=MATERIAL2MLGNSTORRel/ChangeData,MATERIAL2MLGNSTORRel/MLGNSTOR2MLGTSTORRel/ChangeData";
			this.oWarehouseChangeResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oWarehouseChangeModel, whChangeQuery);

			var oExtoWarehouseChangeResponse = this.oS3Controller.matHookModifyMatWarehouseChangeData(whChangeQuery, this.oWarehouseChangeResponse);
			if (oExtoWarehouseChangeResponse !== undefined) {
				this.oWarehouseChangeResponse = oExtoWarehouseChangeResponse;
			}
		}
		this.awhChangedData = this.oWarehouseChangeResponse.data.__batchResponses[0].data.MATERIAL2MLGNSTORRel;
	},
	//********************************************************************************************************
	//generic method for iterator visibility
	setMatIteratorVisibility: function(sRowId, matBtnPrev, matBtnNext, total) {
		matBtnPrev.setVisible(true);
		matBtnNext.setVisible(true);
		if (sRowId === 1 && total > 1) {
			matBtnPrev.setEnabled(false);
			matBtnNext.setEnabled(true);
		} else if (sRowId === total && sRowId === 1) {
			matBtnPrev.setVisible(false);
			matBtnNext.setVisible(false);
		} else if (sRowId === total && total > 1) {
			matBtnPrev.setEnabled(true);
			matBtnNext.setEnabled(false);
		} else {
			matBtnPrev.setEnabled(true);
			matBtnNext.setEnabled(true);
		}

	},
	//**********************************************************************************************************
	getWarehouseDetailsData: function() {
		return this.awhDetailData.__batchResponses[0].data;
	},
	getWarehouseCreateData: function() {
		return this.awhCreateData;
	},
	getWarehouseChangedData: function() {
		return this.awhChangedData;

	},
	//***********************************************************************************************************
	getPSTAT: function() {
		return this.PSTAT;
	},
	//*******************************************************************************************************
	getDocumenAssignmentData: function(oView, vPath, vAction, s3Controller) {
		//get Document Assignment data for S3 screen 

		this.oBatchModel = s3Controller.getView().getModel("MDG_MATERIAL");
		this.vContextPath = vPath;
		var strDocAssignmentQuery = "";

		if (vAction === 'CREATE') {
			// If logical action is CREATE, get the query from Create files
			if (this.oBatchModel !== undefined) {
				if (this.aDocAssignmentData === "") {
					this.getsetDocCreateData();
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate.initializeDocAssignmentTabl(this.aDocAssignmentData.data,
						this.oS3Controller);
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate.displayDocAssignmentData(this.aDocAssignmentData.data, this.oS3Controller);
				}

			} // endif Batchmodel != undefined
		}
		if (vAction === 'CHANGE') {
			// If logical action is CREATE, get the query from Create files

			if (this.oBatchModel !== undefined) {
				if (this.aDocAssignmentData === "") {
					this.getsetDocChangeData();
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentChange.initializeDocTables(this.aDocAssignmentData.data,
						this.oS3Controller);
					fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentChange.displayTableData(this.oS3Controller);
				}

			} // endif Batchmodel != undefined
		}

	},
	// =======================================================================================================================================================================================================
	getsetDocCreateData: function() {
		var vSyncDocData = this.aDocSyncData;
		if (vSyncDocData !== undefined && vSyncDocData !== "" && vSyncDocData !== null) {
			this.aDocAssignmentData = vSyncDocData;
		// 	var vSyncDocCreateData = vSyncAllTabData.data.__batchResponses[0].data.MATERIAL2DRADBASICRel.results;
		// }
		// if (vSyncAllTabData !== undefined && vSyncAllTabData !== "" && vSyncDocCreateData !== undefined && vSyncDocCreateData !== "" &&vSyncDocCreateData.length>0) {
		// 	this.aDocAssignmentData = vSyncAllTabData;
		} else {
			this.setRequestHeaderCr(this.oBatchModel);
			var strDocAssignmentQuery = "MATERIALCollection('" + this.matNum + "')?$expand=MATERIAL2DRADBASICRel";
			this.aDocAssignmentData = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, strDocAssignmentQuery);
			// Controller Hook method call
			var oExtDocCreateResponse = this.oS3Controller.matHookModifyMatDocumentCreateData(strDocAssignmentQuery, this.aDocAssignmentData);
			if (oExtDocCreateResponse !== undefined) {
				this.aDocAssignmentData = oExtDocCreateResponse;
			}

		}

	},
	// ===================================================================================================================================
	getsetDocChangeData: function() {
		var vSyncDocChData = this.aDocSyncData;
		if (vSyncDocChData !== undefined && vSyncDocChData !== "" && vSyncDocChData !== null) {
			this.aDocAssignmentData = vSyncDocChData;
		// 	var vSyncDocChangeData = vSyncAllTabData.data.__batchResponses[0].data.MATERIAL2DRADBASICRel.results;
		// }
		// if (vSyncAllTabData !== undefined && vSyncAllTabData !== "" && vSyncDocChangeData !== undefined && vSyncDocChangeData !== "" && vSyncDocChangeData.length>0) {
		// 	this.aDocAssignmentData = vSyncAllTabData;
		} else {
			this.setRequestHeaderCr(this.oBatchModel);
			var strDocAssignmentQuery = "MATERIALCollection('" + this.matNum +
				"')?$expand=MATERIAL2DRADBASICRel/ChangeData,MATERIAL2DRADBASICRel/DRADBASIC2DRADTXTRel/ChangeData";
			this.aDocAssignmentData = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, strDocAssignmentQuery);
			// Controller Hook method call
			var oExtDocChangeResponse = this.oS3Controller.matHookModifyMatDocumentChangeData(strDocAssignmentQuery, this.aDocAssignmentData);
			if (oExtDocChangeResponse !== undefined) {
				this.aDocAssignmentData = oExtDocChangeResponse;
			}

		}
	},

	//***************************************************************************************************************************************8
	getDocAssignmentData: function(vDocno, vDocType, vDocversion, vDocpart) {
		var sDockey = "/DRADBASICCollection" + "(DOKAR='" + vDocType + "',DOKNR='" + vDocno + "',DOKTL='" + vDocpart + "',DOKVR='" + vDocversion +
			"',MATERIAL='" + this.matNum + "')";
		var sDocQuery;
		if (this.vMatAction === "CREATE") {
			sDocQuery = sDockey + "?$expand=DRADBASIC2DRADTXTRel,DRADBASIC2ORIGINALSRel";
		} else {
			sDocQuery = sDockey + "?$expand=DRADBASIC2DRADTXTRel/ChangeData,DRADBASIC2ORIGINALSRel";
		}
		this.setRequestHeaderCr(this.oBatchModel);
		var isSingleFlag = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate.getIsSingleFlag();
		if (this.aBufferedDataDoc === "" && isSingleFlag==="X" && this.vMatAction==="CREATE") {
			this.aBufferedDataDoc = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sDocQuery);
		}
		if (isSingleFlag !== "X" || this.vMatAction==="CHANGE" ) {
        this.aBufferedDataDoc = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sDocQuery);
		}
		// Controller Hook method call
		var oExtDocDetailResponse = this.oS3Controller.matHookModifyMatDocumentDetailData(sDocQuery, this.aBufferedDataDoc);
		if (oExtDocDetailResponse !== undefined) {
			this.aBufferedDataDoc = oExtDocDetailResponse;
		}
		return this.aBufferedDataDoc;
	},

	getDocAssignmentDetailsData: function() {
		return this.aDocAssignmentData;
	},
	// perform a binarysearch to find the element in the array
	binarySearchDocAssignment: function(strDocNum, strDocType, docAssignmentdata) {
		var stop = docAssignmentdata.data.MATERIAL2DRADBASICRel.results.length;
		var last, p = 0;
		var delta = 0;

		do {
			last = p;

			if (docAssignmentdata.data.MATERIAL2DRADBASICRel.results[p].DOKNR > strDocNum) {
				stop = p + 1;
				p -= delta;
			} else if (docAssignmentdata.data.MATERIAL2DRADBASICRel.results[p].DOKNR === strDocNum && docAssignmentdata.data.MATERIAL2DRADBASICRel.results[
				p].DOKAR === strDocType) {
				// FOUND A MATCH!, return the correct row.
				return docAssignmentdata.data.MATERIAL2DRADBASICRel.results[p];
			}

			delta = Math.floor((stop - p) / 2);
			p += delta; //if delta = 0, p is not modified and loop exits

		} while (last !== p);

		return -1; //nothing found

	},
	getInstance: function() {
		var that = this;
		return that;
	},

	setMatGtinPanel: function(sKey) {
		this.oBatchModel = this.oS3Controller.getView().getModel("MDG_MATERIAL");
		var sQuery = sKey + "?$expand=MATERIAL2MEAN_GTINRel,MATERIAL2UNITOFMSRRel";
		this.setRequestHeaderCr(this.oBatchModel);
		this.oGtinResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		this.gtinresponse = this.oGtinResponse;
		// Controller Hook method call
		var oExtGtinCreateResponse = this.oS3Controller.matHookModifyMatgtincreateData(sQuery, this.oGtinResponse);
		if (oExtGtinCreateResponse !== undefined) {
			this.oGtinResponse = oExtGtinCreateResponse;
		}
	},

	setMatClassificationPanel: function(sKey) {
		// sKey = "/MATERIALCollection" + "('" + this.matNum + "')";
		var sQuery = sKey + "?$expand=MATERIAL2CLASSTYPERel/CLASSTYPE2CLASSASGNRel,MATERIAL2CLASSTYPERel/CLASSTYPE2VALUATIONRel";
		//this.oBatchModel.setUseBatch(false);
		this.setRequestHdrNull(this.oBatchModel);
		this.Classificationresponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		// Controller Hook method call
		var oExtClassificationCreateResponse = this.oS3Controller.matHookClassificationCreate(sQuery, this.Classificationresponse);
		if (oExtClassificationCreateResponse !== undefined) {
			this.Classificationresponse = oExtClassificationCreateResponse;
		}
	},

	setMatPurchasingPanel: function(sPurKy, sPurChangedKy) {
		var aBatchOperation = [];
		var sQtmngquery = "";
		var sQuery = "";
		sQuery = "/MARAPURCHCollection" + sPurKy;
		sQtmngquery = "/MARAQTMNGCollection" + sPurChangedKy;
	    	this.setRequestHeaderCr(this.oBatchModel);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQtmngquery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel, this.oS3Controller);
		this.Response = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
		this.PurchasingResponse = this.Response;
		// Controller Hook method call
		var oExtPurchasingCreateResponse = this.oS3Controller.matHookModifyMatPurchasingcreateData(sQuery,sQtmngquery, this.Response);
		if (oExtPurchasingCreateResponse !== undefined) {
			this.PurchasingResponse = oExtPurchasingCreateResponse;
		}
	},

	setMatNotesPanel: function(sKey) {
		this.oBatchModel = this.oS3Controller.getView().getModel("MDG_MATERIAL");
		var sQuery = sKey + "?$expand=MATERIAL2LONGTEXTSRel";
		this.setRequestHeaderCr(this.oBatchModel);
		this.oNotesResponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		this.notesresponse = this.oNotesResponse;
		// Controller Hook method call
		var oExtNotesCreateResponse = this.oS3Controller.matHookModifyMatNotesCreateData(sQuery, this.notesresponse);
		if (oExtNotesCreateResponse !== undefined) {
			this.notesresponse = oExtNotesCreateResponse;
		}
		
	},

	setMatGtinChangedPanel: function() {
		this.oBatchModel = this.oS3Controller.getView().getModel("MDG_MATERIAL");
		var sQueryBasicData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.getGeneralDataQuery(this.matNum);
		var sQuery = sQueryBasicData + "?$expand=MATERIAL2UNITOFMSRRel/ChangeData,MATERIAL2MEAN_GTINRel/ChangeData";
		this.setRequestHeaderCr(this.oBatchModel);
		//	this.setRequestHdrNull(this.oBatchModel);
		this.Response = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		this.gtinchangedresponse = this.Response;
    // Controller Hook method call
		var oExtGtinChangedResponse = this.oS3Controller.matHookModifyMatGtinChangedData(sQuery, this.gtinchangedresponse);
		if (oExtGtinChangedResponse !== undefined) {
			this.gtinchangedresponse = oExtGtinChangedResponse;
		}
	},

	setMatClassificationChangedPanel: function(sKey) {
		this.oBatchModel = this.oS3Controller.getView().getModel("MDG_MATERIAL");
		// sKey = "/MATERIALCollection" + "('" + this.matNum + "')";
		var sQuery = sKey + "?$expand=MATERIAL2CLASSTYPERel/ChangeData";
	    this.setRequestHdrNull(this.oBatchModel);
		this.Classificationchangedresponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
	// Controller Hook method call
		var oExtClassificationChangedResponse = this.oS3Controller.matHookModifyMatClassificationChangedData(sQuery,this.Classificationchangedresponse);
		if (oExtClassificationChangedResponse !== undefined) {
			this.Classificationchangedresponse = oExtClassificationChangedResponse;
		}

	},

	setMatPurchasingChangedPanel: function(sPurChangedKy) {
		var aBatchOperation = [];
		this.oBatchModel = this.oS3Controller.getView().getModel("MDG_MATERIAL");
		var sQuery = "";
		var sQtmngquery = "";
		sQuery = "/MARAPURCHCollection" + sPurChangedKy + "?$expand=ChangeData";
		sQtmngquery = "/MARAQTMNGCollection" + sPurChangedKy + "?$expand=ChangeData";
		this.setRequestHeaderCr(this.oBatchModel);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQtmngquery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel, this.oS3Controller);
		this.Response = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
		//this.Response = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		this.Purchasingchangedresponse = this.Response;
// Controller Hook method call
		var oExtPurchChangedResponse = this.oS3Controller.matHookModifyMatPurchChangedData(sQuery,sQtmngquery, this.Purchasingchangedresponse);
		if (oExtPurchChangedResponse !== undefined) {
			this.Purchasingchangedresponse = oExtPurchChangedResponse;
		}
	},

	setMatNotesChangedPanel: function() {
		this.oBatchModel = this.oS3Controller.getView().getModel("MDG_MATERIAL");
		var sQueryBasicData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.getGeneralDataQuery(this.matNum);
		var sQuery = sQueryBasicData + "?$expand=MATERIAL2LONGTEXTSRel/ChangeData";
		this.setRequestHeaderCr(this.oBatchModel);
		this.Response = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		this.Noteschangedresponse = this.Response;
      // Controller Hook method call
		var oExtNotesChangedResponse = this.oS3Controller.matHookModifyMatNotesChangedData(sQuery, this.notesresponse);
		if (oExtNotesChangedResponse !== undefined) {
			this.Noteschangedresponse = oExtNotesChangedResponse;
		}
	},
	setMatReqPlanningPanel: function(sPlantKey, sChData) {
		var sQuery, mrpQuery, mrpAreaQry, prdVrsnQry;
		var aBatchOperation = [];
		if (this.vMatAction === 'CREATE') {
			sQuery = "/MARCMRPCollection" + sPlantKey;
			mrpQuery = "/MRPTXTCollection" + sPlantKey;
			mrpAreaQry = "/MARCBASICCollection" + sPlantKey + "?$expand=MARCBASIC2MDMABASICRel";
			prdVrsnQry = "/MARCBASICCollection" + sPlantKey + "?$expand=MARCBASIC2MKALBASICRel";
		} else if (this.vMatAction === 'CHANGE') {
			sQuery = "/MARCMRPCollection" + sPlantKey + sChData;
			mrpQuery = "/MRPTXTCollection" + sPlantKey + sChData;
			mrpAreaQry = "/MARCBASICCollection" + sPlantKey + "?$expand=MARCBASIC2MDMABASICRel/ChangeData";
			prdVrsnQry = "/MARCBASICCollection" + sPlantKey + "?$expand=MARCBASIC2MKALBASICRel/ChangeData";
		}
		this.setRequestHeaderCr(this.oBatchModel);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, mrpQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, mrpAreaQry, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, prdVrsnQry, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel, this.oS3Controller);
		this.oMRPresponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
		// Controller Hook method call
		var oExtMRPresponse = this.oS3Controller.matHookModifyMatReqPlanningPanel(sQuery, mrpQuery, mrpAreaQry, prdVrsnQry, this.oMRPresponse);
		if (oExtMRPresponse !== undefined) {
			this.oMRPresponse = oExtMRPresponse;
		}
	},

	setMatForecastingPanel: function(sPlantKey, sChData) {
		var sQuery = "";
		if (this.vMatAction === 'CREATE') {
			sQuery = "/MARCFRCollection" + sPlantKey;
		} else if (this.vMatAction === 'CHANGE') {
			sQuery = "/MARCFRCollection" + sPlantKey + sChData;
		}
		this.setRequestHeaderCr(this.oBatchModel);
		this.oForcastingresponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		// Controller Hook method call
		var oExtForcastingresponse = this.oS3Controller.matHookModifyMatForecastingPanel(sQuery, this.oForcastingresponse);
		if (oExtForcastingresponse !== undefined) {
			this.oForcastingresponse = oExtForcastingresponse;
		}
	},

	setMatQltyMngmntPanel: function(sPlantKey, sChData) {
		var sQuery, sInsPctQuery;
		var aBatchOperation = [];
		if (this.vMatAction === 'CREATE') {
			sQuery = "/MARCQTMNGCollection" + sPlantKey;
			sInsPctQuery = "/MARCBASICCollection" + sPlantKey + "?$expand=MARCBASIC2QMATBASICRel";
		} else if (this.vMatAction === 'CHANGE') {
			sQuery = "/MARCQTMNGCollection" + sPlantKey + sChData;
			sInsPctQuery = "/MARCBASICCollection" + sPlantKey + "?$expand=MARCBASIC2QMATBASICRel/ChangeData";
		}
		this.setRequestHeaderCr(this.oBatchModel);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sInsPctQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel, this.oS3Controller);
		this.oQMresponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
		// Controller Hook method call
		var oExtInspResponse = this.oS3Controller.matHookModifyMatQltyMngmntPanel(sQuery, sInsPctQuery, this.oQMresponse);
		if (oExtInspResponse !== undefined) {
			this.oQMresponse = oExtInspResponse;
		}
		this.oInspResponse = this.oQMresponse[1];
	},

	setMatWorkSchdlngPanel: function(sPlantKey, sChData) {
		var sQuery;
		if (this.vMatAction === 'CREATE') {
			sQuery = "/MARCWRKSDCollection" + sPlantKey;
		} else if (this.vMatAction === 'CHANGE') {
			sQuery = "/MARCWRKSDCollection" + sPlantKey + sChData;
		}
		this.setRequestHeaderCr(this.oBatchModel);
		this.oWorkSdresponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		// Controller Hook method call
		var oExtWorkSdresponse = this.oS3Controller.matHookModifyMatWorkSchdlngPanel(sQuery, this.oWorkSdresponse);
		if (oExtWorkSdresponse !== undefined) {
			this.oWorkSdresponse = oExtWorkSdresponse;
		}
	},

	setMatStrgCstngPanel: function(sPlantKey, sChData) {
		var sQuery, strgQuery, cstngQuery;
		var aBatchOperation = [];
		if (this.vMatAction === 'CREATE') {
			sQuery = "/MARCSTORECollection" + sPlantKey;
			strgQuery = "/MARCBASICCollection" + sPlantKey + "?$expand=MARCBASIC2MARDRel";
			cstngQuery = "/MARCCSTNGCollection" + sPlantKey;
		} else if (this.vMatAction === 'CHANGE') {
			sQuery = "/MARCSTORECollection" + sPlantKey + sChData;
			strgQuery = "/MARCBASICCollection" + sPlantKey + "?$expand=MARCBASIC2MARDRel/ChangeData";
			cstngQuery = "/MARCCSTNGCollection" + sPlantKey + sChData;
		}
		this.setRequestHeaderCr(this.oBatchModel);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, strgQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, cstngQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel, this.oS3Controller);
		this.oStrgCstngresponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
		// Controller Hook method call
		var oExtStrgCstngresponse = this.oS3Controller.matHookModifyMatStrgCstngPanel(sQuery, strgQuery, cstngQuery, this.oStrgCstngresponse);
		if (oExtStrgCstngresponse !== undefined) {
			this.oStrgCstngresponse = oExtStrgCstngresponse;
		}
		this.oStrgResponse = this.oStrgCstngresponse[1];
	},

	setMatReqPlanningPanelChng: function(sKey) {
		var aBatchOperation = [];
		var sQuery = sKey + '?$expand=MATERIAL2MARCMRPRel/ChangeData,MATERIAL2MRPTXTRel/ChangeData';
		var sMrpAreaPrdVrsnQry = sKey +
			'?$expand=MATERIAL2MARCBASICRel/MARCBASIC2MDMABASICRel/ChangeData,MATERIAL2MARCBASICRel/MARCBASIC2MKALBASICRel/ChangeData';
		this.setRequestHeaderCr(this.oBatchModel);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sMrpAreaPrdVrsnQry, aBatchOperation);
		fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel, this.oS3Controller);
		this.oMRPChngresponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData();
		// Controller Hook method call
		var oExtMRPChngresponse = this.oS3Controller.matHookModifyMatReqPlanningPanelChng(sQuery, sMrpAreaPrdVrsnQry, this.oMRPChngresponse);
		if (oExtMRPChngresponse !== undefined) {
			this.oMRPChngresponse = oExtMRPChngresponse;
		}
	},

	setMatForecastingPanelChng: function(sKey) {
		var sQuery = sKey + '?$expand=MATERIAL2MARCFRRel/ChangeData';
		this.setRequestHeaderCr(this.oBatchModel);
		this.oForcastingChngresponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		// Controller Hook method call
		var oExtForcastingChngresponse = this.oS3Controller.matHookModifyMatForecastingPanelChng(sQuery, this.oForcastingChngresponse);
		if (oExtForcastingChngresponse !== undefined) {
			this.oForcastingChngresponse = oExtForcastingChngresponse;
		}
	},

	setMatQltyMngmntPanelChng: function(sKey) {
		var sQuery = sKey + '?$expand=MATERIAL2MARCQTMNGRel/ChangeData,MATERIAL2MARCBASICRel/MARCBASIC2QMATBASICRel/ChangeData';
		this.setRequestHeaderCr(this.oBatchModel);
		this.oQMChngresponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		// Controller Hook method call
		var oExtQMChngresponse = this.oS3Controller.matHookModifyMatQltyMngmntPanelChng(sQuery, this.oQMChngresponse);
		if (oExtQMChngresponse !== undefined) {
			this.oQMChngresponse = oExtQMChngresponse;
		}
	},

	setMatWorkSchdlngPanelChng: function(sKey) {
		var sQuery = sKey + '?$expand=MATERIAL2MARCWRKSDRel/ChangeData';
		this.setRequestHeaderCr(this.oBatchModel);
		this.oWorkSdChngresponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		// Controller Hook method call
		var oExtWorkSdChngresponse = this.oS3Controller.matHookModifyMatWorkSchdlngPanelChng(sQuery, this.oWorkSdChngresponse);
		if (oExtWorkSdChngresponse !== undefined) {
			this.oWorkSdChngresponse = oExtWorkSdChngresponse;
		}
	},

	setMatStrgCstngPanelChng: function(sKey) {
		var sQuery = sKey +
			'?$expand=MATERIAL2MARCSTORERel/ChangeData,MATERIAL2MARCCSTNGRel/ChangeData,MATERIAL2MARCBASICRel/MARCBASIC2MARDMRPRel/ChangeData,MATERIAL2MARCBASICRel/MARCBASIC2MARDSTORRel/ChangeData';
		this.setRequestHeaderCr(this.oBatchModel);
		this.oStrgCstngChngresponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, sQuery);
		// Controller Hook method call
		var oExtStrgCstngChngresponse = this.oS3Controller.matHookModifyMatStrgCstngPanelChng(sQuery, this.oStrgCstngChngresponse);
		if (oExtStrgCstngChngresponse !== undefined) {
			this.oStrgCstngChngresponse = oExtStrgCstngChngresponse;
		}
	},

	setMatValuationPanel: function() {
		this.oBatchModel = this.oS3Controller.getView().getModel("MDG_MATERIAL");
		var sQuery, svaluationQuery;
		this.vPlantnext = this.vPlant;
		if (this.vMatAction === 'CREATE') {
			sQuery = "/MARCBASICCollection" + "(MATERIAL='" + this.matNum + "',WERKS='" + this.vPlant + "')";
			svaluationQuery = sQuery + "?$expand=MARCBASIC2MBEWCSTNGRel,MARCBASIC2MBEWVALUARel";
		}
		if (this.vMatAction === 'CHANGE') {
			sQuery = "/MARCBASICCollection" + "(MATERIAL='" + this.matNum + "',WERKS='" + this.vPlant + "')";
			svaluationQuery = sQuery + "?$expand=MARCBASIC2MBEWCSTNGRel/ChangeData,MARCBASIC2MBEWVALUARel/ChangeData";
		}
		this.setRequestHeaderCr(this.oBatchModel);
		this.oValuationresponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, svaluationQuery);
	},

	setMatValuationPanelChng: function(sKey) {
		var svaluationQuery = sKey +
			"?$expand=MATERIAL2MARCBASICRel/MARCBASIC2MBEWCSTNGRel/ChangeData,MATERIAL2MARCBASICRel/MARCBASIC2MBEWVALUARel/MBEWVALUA2MBEWVALCTNGRel/ChangeData,MATERIAL2MARCBASICRel/MARCBASIC2MBEWVALUARel/MBEWVALUA2MBEWMLACRel/ChangeData,MATERIAL2MARCBASICRel/MARCBASIC2MBEWVALUARel/MBEWVALUA2MBEWMLVALRel/ChangeData";

		this.setRequestHeaderCr(this.oBatchModel);
		this.oValuationChangedresponse = fcg.mdg.approvecrv2.util.DataAccess.readData(this.oBatchModel, svaluationQuery);
	},

	setPlantSyncData: function(aSyncRslt) {
		this.aPlantSyncData = "";
		this.aPlantSyncData = aSyncRslt;
	},
	
	setSalesSyncData: function(aSyncRslt) {
		this.aSalesSyncData = "";
		this.aSalesSyncData = aSyncRslt;
	},
	
	setWhouseSyncData: function(aSyncRslt) {
		this.aWhouseSyncData = "";
		this.aWhouseSyncData = aSyncRslt;
	},
	
	setDocSyncData: function(aSyncRslt) {
		this.aDocSyncData = "";
		this.aDocSyncData = aSyncRslt;
	},
	// getMatAsyncData: function(s3Controller, oDataModel, vMaterial) {
	// 	var sQueryBasicData = "";
	// 	if (s3Controller.sAction === "CREATE") {
	// 		sQueryBasicData = "/MATERIALCollection('" + vMaterial + "')" +
	// 			"?$expand=MATERIAL2MARASALESRel,MATERIAL2MVKESALESRel,MATERIAL2MARCBASICRel,MATERIAL2MLGNSTORRel,MATERIAL2DRADBASICRel";
	// 	} else {
	// 		sQueryBasicData = "/MATERIALCollection('" + vMaterial + "')" +
	// 			"?$expand=MATERIAL2MARCRel/ChangeData,MATERIAL2MARCBASICRel/MARCBASIC2MLANPURCHRel/ChangeData,MATERIAL2MLGNSTORRel/ChangeData,MATERIAL2MLGNSTORRel/MLGNSTOR2MLGTSTORRel/ChangeData,MATERIAL2DRADBASICRel/ChangeData,MATERIAL2DRADBASICRel/DRADBASIC2DRADTXTRel/ChangeData";
	// 	}
	// 	oDataModel.read(
	// 		sQueryBasicData,
	// 		null, //this.getView().getModel().createBindingContext(queryString), 
	// 		null, //[]			,
	// 		true,
	// 		function(oData, response) {
	// 			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setSyncData(response);
	// 		},
	// 		function(e) {}
	// 	);
	// }

  setTablePersonalization: function(oItem,oTable,oPersButton){
  		// Generic function for Table personalization
					// create the persistence key
					
					var oTypePersId = {
						container: "fcg.mdg.approvecrv2",
						item: oItem
					};

					// get a Personalizer
					var oPersonalizer = sap.ushell.Container.getService("Personalization").getPersonalizer(oTypePersId);
					// create a table personalization controller
					var oTablePersoController = new sap.m.TablePersoController({
						table: oTable,
						persoService: oPersonalizer
					});
					// use the personalization data to configure the table accordingly
					oTablePersoController.activate();
					// Attach the personalization button in the table to the personalization pop up
					oPersButton.attachPress(function() {
						oTablePersoController.openDialog();
					});
					// End Table Personalization
  }, // end function setTablePersonalization
  
  getLastCr: function(){
  	return this.vCId;
  }
};