/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CostCenter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Supplier");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccount");


sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.S3", {
	vSetMat: "",
	vSyncFlag: "",
	glcoa: "",
	glacccomp: "",
	vAction: "",
	vCRCode: "",
	oGlAccountGenForm: "",
	oGlAccountCompTable: "",
	oGlAccountCompForm: "",
	oGlAccountCelemTable: "",
	oGlAccountCelemForm: "",
	oMaterialIconTab: "",
	oMatGtinData: "",
	oMatNotesData: "",
	oMatPurchasingData: "",
	vApprove_Popup: "",
	sObjectKey: "",
	oAddrUsageCreateTable: "",
	oSalesCreateTable: "",
	oGLDescChangeTable: "",
	oGLCompCreateTable: "",
	oGLCelemCreateTable: "",
	oAddressTable: "",
	oCompCodeDetails: "",
	oSubRangeDetails: "",
	oSalesDetail: "",
	oIdentificationTable: "",
	oTaxTable: "",
	mainEntityText: "",
	oIndustryTable: "",
	oCompcodeTable: "",
	oDunningTable: "",
	ChangedAt: "",
	numberAttachments: "",
	numberNotes: "",
	oTaxClassTable: "",
	oGLDescTable: "",
	actionText: "",
	oSalesTable: "",
	oCompCode: {
		aCompCode: []
	},
	compCodeResults: {
		dataitems: []
	},
	SalesAreaResults: {
		dataitems: []
	},
	oSalesArea: {
		aSalesArea: []
	},
	oPartnerFuncTable: "",
	oPurchaseOrgTable: "",
	costCenterIconTab: "",
	profitCenterIconTab: "",
	glAccountIconTab: "",
	oAddrCreateTable: "",
	oIndentificationCreateTable: "",
	oTaxCreateTable: "",
	oIndusCreateTable: "",
	oCompCodeCreateTable: "",
	oWHTaxCreateTable: "",
	oMaterialUnitTable: "",
	oFormMaterialUnit: "",
	oCommunicationTable: "",
	oFormCommunication: "",
	//oIndusCreateTable:"",
	//oCompCodeCreateTable:"",
	oBankCreateTable: "",
	oBankTable: "",
	oRelCreateTable: "",
	oRelTable: "",
	oHeaderFooterOptions: "",
	oFormBank: "",
	accountIconTab: "",
	oFormAccountUnit: "",
	oFormCostelemUnit: "",
	oFormCompanyUnit: "",
	oFormConsgrpUnit: "",
	oAccountUnitTable: "",
	oCompanyUnitTable: "",
	oCostElemUnitTable: "",
	oRoleTable: "",
	oFormWithhldTax: "",
	oFormTax: "",
	oFormDunning: "",
	oRoleCreateTable: "",
	objectKey: "",
	oSalesData: "",
	createdByDesc: "",
	//oCompcodeTable:"",
	oFormCompcode: "",
	//oSalesTable:"",
	oFormSales: "",
	oPCTable: "",
	oCCTable: "",
	oMatTable: "",
	oMuTable: "",
	matIconTab: "",
	oCustomerDomain: "",
	oSupplierDomain: "",
	caIconTab: "",
	vModel: "",
	attachurl: "",
	commenturl: "",
	oModel: "",
	oPath: "",
	oFileUpload: "",
	rejectError: "",
	isrejected: "",
	oNotes: "",
	oEntity: "",
	oCreate: "",
	i: "",
	aBatchOperation: [],
	oBatchModel: "",
	sContextPath: "",
	oFormIndustry: "",
	oFormIdentification: "",
	oFormAddress: "",
	sModel: "",
	sAction: "",
	result: "",
	sEntity: "",
	Model: "",
	oGeneralCreateForm: "",
	_selectedSection: "",
	LayoutRendered: "",
	aDecisions: "",
	aExpandEntitySets: "",
	vCrLocked: false,
	sLockError: "",
	isNavToDetail: "",
	oCompCodeCreateForm: "",
	oSalesCreateForm: "",
	vCrId: "",
	isApproved: "",
	odunningCreateTable: "",
	oexTaxCreateTable: "",
	sDisableAction: false,
	oAddressCreateTable: "",
	oAddressUsagesCreateTable: "",
	sCtxPath: "",
	oErpCustomerCreateTable: "",
	oErpSupplierCreateTable: "",
	oErpCustomerTable: "",
	oPurchaseDetail: "",
	oPurchasingDataTable: "",
	oPurchOrgCreateTable: "",
	oSuppCompCode: "",
	oPurchaseCreateForm: "",
	subrangetable: "",
	PurchaseCreateTable: "",
	oSuppCompCodeDetails: "",
	oSuppCompCodeCreateForm: "",
	oAddressUsagesTable: "",
	sFinOdataError: false,
	sFinOdataErrorMessage: "",
	oObsoleteDataTable: "",
	vFirstTimeFlag : "",
	extHookCCCustomService: null,
	extHookCustCustomService: null,
	extHookCCChangeQuery: null,
	extHookChangeLayout: null,
	extHookChangeDescTemplate: null,
	extHookCCCreateQuery: null,
	extHookModityCreateFormData: null,
	extHookCreateDescTemplate: null,
	extHookHideCreateAddressSection: null,
	extHookHideCreateCommSection: null,
	extHookAddCCData: null,
	extHookPCCustomService: null,
	extHookPCHideCreateAddressSection: null,
	extHookPCHideCreateCommSection: null,
	extHookPCChangeQuery: null,
	extHookPCChangeLayout: null,
	extHookPCChangeDescTemplate: null,
	extHookPCChangeCompCodeTemplate: null,
	extHookPCCreateCompCodeTemplate: null,
	extHookPCCreateQuery: null,
	extHookModifyPCCreateFormData: null,
	extHookPCCreateDescTemplate: null,
	extHookAddPCData: null,
	extHookHidePCCreateCommSection: null,
	extHookCCModifyChangeData: null,
	extHookPCModifyChangeData: null,
	extHookCCFillDataForChangeLayout: null,
	extHookPCFillDataForChangeLayout: null,
	extHookRouteToCustomDetailView: null,
	extHookCustCreateSalesQuery: null,
	extHookCustCreateCompCodeQuery: null,
	extHookCustCreateAddressQuery: null,
	extHookCustCreateGenQuery: null,
	extHookcustHookCreateOrgData: null,
	extHookcustHookCreatePersonData: null,
	extHookcustHookCreateGroupData: null,
	extHookcustHookCreateMultAssign: null,
	extHookcustHookCreateSalesArea: null,
	extHookcustHookCreateDunning: null,
	extHookcustHookCreateWithTax: null,
	extHookcustHookCompanyValueTemplate: null,
	extHookcustHookCompCodeValueTemplate: null,
	extHookcustHookSalesValueTemplate: null,
	extHookcustHookRoleValueTemplate: null,
	extHookcustHookBankValueTemplate: null,
	extHookcustHookRelValueTemplate: null,
	extHookcustHookgetAddrUsageTemplate: null,
	extHookcustHookAddressTemplate: null,
	extHookcustHookErpCustomerValueTemplate: null,
	extHookcustHookIndusValueTemplate: null,
	extHookcustHookTaxValueTemplate: null,
	extHookcustHookIdentificationValueTemplate: null,
	extHookcustHookgetDunningTemplate: null,
	extHookcustHookgetPartnerFuncTemplate: null,
	extHookcustHookgetChangeTableTemplate: null,
	extHookcustHookDeleteData: null,
	extHookcustHookgetAddressTableTemplate: null,
	extHookcustHookgetTableTemplate: null,
	extHookcustHookgetObsoleteTableTemplate: null,
	extHookCustChangeGenQuery: null,
	extHookCustChangeAddressQuery: null,
	extHookCustChangeCompCodeQuery: null,
	extHookCustChangeSalesQuery: null,
	extHookcustHookChangeOrgData: null,
	extHookccustHookOrgResChangeData: null,
	extHookcustHookPersonChangeData: null,
	extHookcustHookPersonResChangeData: null,
	extHookcustHookChangeGroupData: null,
	extHookcustHookGroupResChangeData: null,
	extHookcustHookRoleChangeData: null,
	extHookcustHookBankChangeData: null,
	extHookcustHookTaxChangeData: null,
	extHookcustHookIdentificationChangeData: null,
	extHookcustHookIndustryChangeData: null,
	extHookcustHookERPCustChangeData: null,
	extHookcustHookCompCodeChangeData: null,
	extHookcustHookDunningChangeData: null,
	extHookcustHookWithTaxChangeData: null,
	extHookcustHookPFChangeData: null,
	extHookcustHookTaxClassChangeData: null,
	extHookcustHookSalesChangeData: null,
	extHookcustHookremovelayout: null,
	extHookcustHookModifyCustCreateGen: null,
	extHookcustHookModifyCustChangeGen: null,
	extHookcustHookModifyCustChangeComp: null,
	extHookcustHookModifyCustCreateComp: null,
	extHookcustHookModifyCustCreateSales: null,
	extHookcustHookModifyCustChangeSales: null,
	extHookSupplierCustomService: null,
	extHooksuppHookremovelayout: null,
	extHooksuppliertHookModifySuppCreateGen: null,
	extHooksupplierHookModifySuppChangeGen: null,
	extHooksupplierHookModifySuppCreatePurchOrg: null,
	extHooksupplierHookModifySuppChangePurchOrg: null,
	extHooksupplierHookModifySuppCreateComp: null,
	extHooksupplierHookModifySuppChangeComp: null,
	extHooksuppHookgetDunningTemplate: null,
	extHooksuppHookgetPartnerFuncTemplate: null,
	extHooksuppHookgetSubrangeTemplate: null,
	extHooksupptHookCompCodeValueTemplate: null,
	extHookglHookgetCEDescTemplate: null,
	extHookglHookgetCompCodeTemplate: null,
	extHookglHookgetCostElTemplate: null,
	extHookglHookgetDescTemplate: null,
	extHookglHookchangeTableTemplate: null,
	extHookglHookModifyAccCreateData: null,
	extHookglHookModifyAccChangeData: null,
	extHookglHookModifyCompCodeCreateData: null,
	extHookglHookModifyCompCodeChangeData: null,
	extHookglHookModifyCEChangeData: null,
	extHookglHookModifyCECreateData: null,

	// Material Hook methods
	extHookmatHookgetSalesTaxTemplate: null,
	extHookmatHookHideSalesPackagingSection: null,
	extHookmatHookgetSalesTextTemplate: null,
	extHookmatHookgetSalesDistChainsTemplate: null,
	extHookmatHookgetWarehouseChangeTemplate: null,
	extHookmatModifyMatGeneralCreateData: null,
	extHookmatModifyMatGeneralChangeData: null,
	extHookmatModifyMatPlantValuationAcntData: null,
	extHookmatModifyMatPlantValuationCostData: null,
	extHookmatModifyMatClassificationCreateData: null,
	extHookmatHookgetGtinTableTemplate: null,
	extHookmatHookgetNotesTableTemplate: null,
	extHookmatHookgetClassTableTemplate: null,
	extHookmatHookGetClassificationTableTemplate: null,
	extHookmatHookGetCharTableTemplate: null,
	extHookmatHookgetWarehouseStorageTypeTemplate: null,
	extHookmatHookcreateDocAssignmentcreateTextTemplate: null,
	extHookmatHookcreateDocAssignmentTableTemplate: null,
	extHookmatHookcreateTableTemplate: null,
	extHookmatHookModifyMatDocumentCreateData: null,
	extHookmatHookModifyMatDocumentChangeData: null,
	extHookmatHookModifyMatDocumentDetailData: null,
	extHookmatHookModifyMatgtincreateData: null,
	extHookmatHookClassificationCreate: null,
	extHookmatHookModifyMatPurchasingcreateData: null,
	extHookmatHookModifyMatNotesCreateData: null,
	extHookmatHookModifyMatGtinChangedData: null,
	extHookmatHookModifyMatClassificationChangedData: null,
	extHookmatHookModifyMatPurchChangedData: null,
	extHookmatHookModifyMatNotesChangedData: null,
	extHookmatHookcreateMatLedgerPriceTemplate: null,
	extHookmatHookcreateMatLedgerPerTemplate: null,
	extHookmatHookModifyMatSalesCreateData: null,
	extHookmatHookModifyMatSalesChangedData: null,
	extHookmatcreatePlantTableTemplate: null,
	extHookmatcreateMrpTxtTemplate: null,
	extHookmatcreateMrpAreaTemplate: null,
	extHookmatcreatePrdVrsnTemplate: null,
	extHookmatcreateInspctnTemplate: null,
	extHookmatcreateStrgLocTemplate: null,
	extHookmatcreateChngLogTblTemplt: null,
	extHookmatHookModifyMatReqPlanningPanel: null,
	extHookmatHookModifyMatForecastingPanel: null,
	extHookmatHookModifyMatQltyMngmntPanel: null,
	extHookmatHookModifyMatWorkSchdlngPanel: null,
	extHookmatHookModifyMatStrgCstngPanel: null,
	extHookmatHookModifyMatReqPlanningPanelChng: null,
	extHookmatHookModifyMatForecastingPanelChng: null,
	extHookmatHookModifyMatQltyMngmntPanelChng: null,
	extHookmatHookModifyMatWorkSchdlngPanelChng: null,
	extHookmatHookModifyMatStrgCstngPanelChng: null,
	extHookmatHookModifygetPlantDetailsData: null,
	extHookmatHookModifygetPlantData: null,
	extHookmatHookgetWarehouseDataItems: null,
	extHookmatHookgetWarehouseTemplate: null,
	extHookmatHookModifyGeneralCreateChangeData: null,
	extHookmatHookModifyPanelData: null,
	extHookmatHookModifyBindPanelData: null,
	extHookmatHookModifyBindPanelChangedData: null,
	extHookmatHookModifyDocCreateData: null,
	extHookmatHookModifyDocDetail: null,
	extHookmatHideATPSection: null,
	extHookmatHideGroupingSection: null,
	extHookmatHideDesignDataSection: null,
	extHookmatHideConfigurationSection: null,
	extHookmatHideEnvironmentSection: null,
	extHookmatHideQualitySection: null,
	extHookmatHideProcurementSection: null,
	extHookmatHookgetWarehouseResults: null,
	extHookmatHookgetStorageTypeResults: null,
	extHookmatHookHideWarehouseCentralSection: null,
	extHookmatHookHideWarehousePalletSection: null,
	extHookmatHookHideWarehouseStorageSection: null,

	extHookmatHookGetValAreaTableTemplate: null,
	extHookmatHookModifyPlantbindPanelData: null,
	extHookmatHookModifyBindPlantTable: null,
	extHookmatHookModifyBindInspTypTable: null,
	extHookmatHookModifyBindMrpTxtTable: null,
	extHookmatHookModifyBindMrpAreaTable: null,
	extHookmatHookModifyBindPrdVerTable: null,
	extHookmatHookModifyBindStrgLocTable: null,
	extHookmatHookModifyhidePlantS4Title: null,
	extHookmatHookhidePlantQMPanelSection: null,
	extHookmatHookhidePlantFRPanelSection: null,
	extHookmatHookhidePlantWSPanelSection: null,
	extHookmatHookhidePlantMRPPanelSection: null,
	extHookmatHookhidePlantStrCstPanelSection: null,
	extHookmatHookhidePlantGnrlDataSection: null,
	extHookmatHookhidePlantValCostingSection: null,
	extHookmatHookModifyPlantChngPanelData: null,
	extHookmatHookgetMARASalesResults: null,
	extHookmatHookchangeMatSalesTextTableTemplate: null,
	extHookmatHookchangeMatSalesTableTemplate: null,
	extHookmatHookgetChangeDisbChainResults: null,
	extHookmatHookgetChangeSalesTaxResults: null,
	extHookmatHookgetChangeSalesTextResults: null,
	extHookmatHookModifyPanelExpand:null,
	extHookmatHookModifyTab:null,
	extHookmatHookModifyMatAsyncQueryCall:null,
	extHookmatHookModifyMatAsyncSalesChBatchCall:null,
	extHookmatHookChangePrdVrsnTemplate:null,
	extHookmatHookChangeMrpAreaTemplate:null,
	extHookmatHookChangeMrpTxtTemplate:null,
	extHookmatHookChangeInspctnTemplate:null,
	extHookmatHookChangeStrgLocTemplate: null,
	//	Controller Hook method definitions

	//	This hook method can be used to initialize additional tabs of the tab bar from code.
	//	It is called during S3 view initialization.  The controller extension should obtain   
	//	references to the new tabs, which can be used later in the configureAdditionalTabs 
	//	hook method.
	extHookInitAdditionalTabs: null,

	//	This hook method can be used to perform additional requests for example
	//	It is called in the success callback of the detail data fetch
	extHookOnDataLoaded: null,

	//	This hook method can be used to add custom related entities to the expand list of the detail data request
	//	It is called when the detail view is displayed and before the detail data fetch starts
	extHookGetEntitySetsToExpand: null,

	//	This hook method can be used to add additional tabs to the tab bar from code
	//	based on the received detail item information (oData) and to provide item count for the tabs.
	//	It is called when the detail (S3) navigation takes place and 
	//	in the success callback of the item detail data fetch.
	extHookConfigureAdditionalTabs: null,
	//	This hook method can be used to add and change buttons for the detail view footer
	//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,

	// the model of the detail view
	oModel2: null,

	onInit: function() {
		//to read url parameter approve_popup to set whether popup should appear on click of approve button
		//Reading URL Parameters
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var myComponent = sap.ui.component(sComponentId);

		if (myComponent && myComponent.getComponentData() && myComponent.getComponentData().startupParameters) {
			//	jQuery.sap.log.debug("startup parameters are " + JSON.stringify(myComponent.getComponentData().startupParameters));		
			if (myComponent.getComponentData().startupParameters.APPROVE_POPUP !== undefined) {
				this.vApprove_Popup = myComponent.getComponentData().startupParameters.APPROVE_POPUP[0];
			}

			//			if (myComponent.getComponentData().startupParameters.IS_PANEL_EXPANDED !== undefined) {
			//				this.vExpandAllPanel = myComponent.getComponentData().startupParameters.EXPAND_All_PANEL_BP[0];
			//			}

		}

		//execute the onInit for the base class BaseDetailController
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		this.vFirstTimeFlag = true;
		//-- set the default oData Model
		var oView = this.getView();

		this.i18nBundle = oView.getModel("i18n").getResourceBundle();

		this.oRouter.attachRouteMatched(this.handleNavToDetail, this);

		//};

		/**
		 * @ControllerHook Initialize the custom tabs
		 * added by the extension application.
		 * This hook method can be used to initialize additional tabs of the tab bar from code.
		 * It is called during S3 view initialization.  The controller extension should obtain
		 * references to the new tabs, which can be used later in the configureAdditionalTabs
		 * hook method.
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookInitAdditionalTabs
		 * @param {object} oTabBar - contains the tab bar object.
		 * @return {void}
		 */
		if (this.extHookInitAdditionalTabs) {
			this.extHookInitAdditionalTabs(this.oTabBar);
		}
	},

	//Navigation from S3 to S4 Done here
	navtoSubDetail: function(oEvent, data) {
		var sPath = oEvent.getSource().getBindingContext().getPath();
		var sRowId = sPath.substr(sPath.lastIndexOf("/") + 1);
		this.isNavToDetail = "X";
		var vPartner1 = "";
		var vPartner2 = "";
		var vCat = "";
		var vChangeKey = "";
		var vNoNavigation = "";
		var vDomain = "";
		var vChangeEntity = "";
		if (data.ChangeData !== undefined)
			vChangeKey = data.ChangeData[sRowId].ChangeKey;

		//Do not navigate in case of the Deletion
		/*if ((data.hasOwnProperty("ChangeData") === true) && data.ChangeData[sRowId].EntityAction === "D") {
			vNoNavigation = 'X';
		}

		if (data.Key !== undefined && data.Key[sRowId].EntityAction === 'D') {
			vNoNavigation = 'X';
		}*/

		if (vNoNavigation === "") {
			if (data.EntityName === 'BP_BankAccount') {
				if (vChangeKey === "" || vChangeKey === undefined || vChangeKey === null)
					vChangeKey = data.ChangeData[sRowId].BANKDETAILID;
				vDomain = data.Domain;
				if (vDomain === "Customer") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
				}
				if (vDomain === "Supplier") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				}
				this.oRouter.navTo("bankDetail", {
					ChangeKey: vChangeKey,
					Domain: vDomain
				});
			} else if (data.name === 'pcItemDetail') {
				if (fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange.getLinkPress() === 'X') {
					fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange.setLinkPress(' ');
					return;
				}
				//				oView = this.getView();
				this.oRouter.navTo("pcItemDetail", {
					contextPath: this.sContextPath,
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					MainEntity: this.oView.getBindingContext().getProperty("MainEntity"),
					DataModel: this.oView.getBindingContext().getProperty("DataModel")
				});
			} else if (data.name === 'ccItemDetail') {
				if (fcg.mdg.approvecrv2.DomainSpecParts.CostCenterChange.getLinkPress() === 'X') {
					fcg.mdg.approvecrv2.DomainSpecParts.CostCenterChange.setLinkPress(' ');
					return;
				}
				//				oView = this.getView();
				this.oRouter.navTo("ccItemDetail", {
					contextPath: this.sContextPath,
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					MainEntity: this.oView.getBindingContext().getProperty("MainEntity"),
					DataModel: this.oView.getBindingContext().getProperty("DataModel")
				});
			} else if (data.EntityName === "Address") {
				vDomain = data.Domain;
				if (vChangeKey === "" || vChangeKey === undefined || vChangeKey === null)
					vChangeKey = data.ChangeData[sRowId].AD_ID;
				if ((data.EntityData[sRowId] !== undefined && data.EntityData[sRowId].hasOwnProperty("ADDR_VERS")) ||
					((data.ChangeData[sRowId].hasOwnProperty("Entity") === true) &&
						(data.ChangeData[sRowId].Entity === 'BP_AddressVersion_Person' ||
							data.ChangeData[sRowId].Entity === 'BP_AddressVersion_Organization' ||
							data.ChangeData[sRowId].Entity === 'BP_PersonVersion')) //'BP_PersonVersion' To be handled Later
				)
				/******************************************************************************************/
				{
					var vAdID = vChangeKey.slice(0, 10).split(" ")[0];
					var vAddrVersion = vChangeKey.charAt(10);
					if (vAddrVersion === "") {
						var aAddresses = data.EntityData.BP_Root.BP_AddressesRel.results;
						for (var i = 0; i < aAddresses.length; i++) {
							if (aAddresses[i].BP_AddressVersionsPersRel !== undefined) {
								for (var j = 0; j < aAddresses[i].BP_AddressVersionsPersRel.results.length; j++) {
									if (aAddresses[i].BP_AddressVersionsPersRel.results[j].ADDR_VERS === vAdID) {
										vAddrVersion = aAddresses[i].BP_AddressVersionsPersRel.results[j].ADDR_VERS;
										vAdID = aAddresses[i].BP_AddressVersionsPersRel.results[j].AD_ID;
									}
								}
							}
						}
					}
					if (vAdID !== "") {
						if (fcg.mdg.approvecrv2.DomainSpecParts[vDomain].getData('General')[0].data.BP_Root.CATEGORY === "2" ||
							fcg.mdg.approvecrv2.DomainSpecParts[vDomain].getData('General')[0].data.BP_Root.CATEGORY === "3") { //Organization or Group
							this.oRouter.navTo("IAVDetail", {
								AddressId: vAdID,
								AddressVersion: vAddrVersion,
								Domain: vDomain
							});
						} else if (fcg.mdg.approvecrv2.DomainSpecParts[vDomain].getData('General')[0].data.BP_Root.CATEGORY === "1") {
							this.oRouter.navTo("IAVPersDetail", {
								AddressId: vAdID,
								AddressVersion: vAddrVersion,
								Domain: vDomain
							});
						}
					}
				}
				/******************************************************************************************/
				else {
					this.oRouter.navTo("AddressDetail", {
						ChangeKey: vChangeKey,
						Domain: vDomain
					});
				}
			} else if (data.EntityName === "AddressUsages") {
				if (vChangeKey === "" || vChangeKey === undefined || vChangeKey === null)
					vChangeKey = data.ChangeData[sRowId].AD_ID;
				vDomain = data.Domain;
				this.oRouter.navTo("AddressUsages", {
					ChangeKey: vChangeKey,
					Domain: vDomain
				});
			} else if (data.EntityName === 'BP_Organization') {
				vDomain = data.Domain;
				if (vDomain === "Customer") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
				}
				if (vDomain === "Supplier") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				}
				this.oRouter.navTo("generalOrgDetail", {
					Domain: vDomain
				});
			} else if (data.EntityName === 'BP_Person') {
				vDomain = data.Domain;
				if (vDomain === "Customer") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
				}
				if (vDomain === "Supplier") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				}
				this.oRouter.navTo("generalPersonDetail", {
					Domain: vDomain
				});
			} else if (data.EntityName === 'BP_Group') {
				vDomain = data.Domain;
				if (vDomain === "Customer") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
				}
				if (vDomain === "Supplier") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				}
				this.oRouter.navTo("generalGroupDetail", {
					Domain: vDomain
				});
			} else if (data.EntityName === 'BP_Role') {
				vDomain = data.Domain;
				if (vDomain === "Customer") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
				}
				if (vDomain === "Supplier") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				}
				this.oRouter.navTo("roleDetail", {
					Domain: vDomain
				});
			} else if (data.EntityName === 'BP_IdentificationNumber') {
				vDomain = data.Domain;
				if (vDomain === "Customer") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
				}
				if (vDomain === "Supplier") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				}
				this.oRouter.navTo("identificationDetail", {
					Domain: vDomain
				});
			} else if (data.EntityName === 'BP_TaxNumber') {
				vDomain = data.Domain;
				if (vDomain === "Customer") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
				}
				if (vDomain === "Supplier") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				}
				this.oRouter.navTo("taxDetail", {
					Domain: vDomain
				});
			} else if (data.EntityName === 'BP_Industry') {
				vDomain = data.Domain;
				if (vDomain === "Customer") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
				}
				if (vDomain === "Supplier") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				}
				this.oRouter.navTo("industryDetail", {
					Domain: vDomain
				});
			} else if (data.EntityName === 'ERPCustomer') {
				if (vChangeKey === "" || vChangeKey === undefined || vChangeKey === null)
					vChangeKey = data.ChangeData[sRowId].ASSIGNMENT_ID;
				fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
				this.oRouter.navTo("erpCustomerDetail", {
					ChangeKey: vChangeKey
				});
			} else if (data.EntityName === 'ERPSupplier') {
				if (vChangeKey === "" || vChangeKey === undefined || vChangeKey === null)
					vChangeKey = data.ChangeData[sRowId].ASSIGNMENT_ID;
				fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				this.oRouter.navTo("erpSupplierDetail", {
					ChangeKey: vChangeKey
				});
			} else if (data.EntityName === 'BP_Relation') {
				if (vChangeKey === "" || vChangeKey === undefined || vChangeKey === null) {
					//vChangeKey = data.EntityData[sRowId].BP_GUID;
					vChangeKey = data.EntityData[sRowId].PARTNER1;
					vDomain = data.Domain;
					vChangeEntity = "BP_Relation";
					vPartner1 = data.EntityData[sRowId].PARTNER1;
					vPartner2 = data.EntityData[sRowId].PARTNER2;
					vCat = data.EntityData[sRowId].RELATIONSHIPCATEGORY;
				} else {
					var vAddrnumber = "";

					vChangeKey = data.ChangeData[sRowId].ChangeKey;
					vChangeEntity = data.ChangeData[sRowId].Entity;
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
					vDomain = data.Domain;
					//get 
					vCat = vChangeKey.substring(8, 14);
					vPartner1 = vChangeKey.substring(24, 34);
					vPartner2 = vChangeKey.substring(14, 24);
				}
				if (vChangeKey.length > 44) {
					vAddrnumber = vChangeKey.substr(vChangeKey.length - 10);
				} else {
					vAddrnumber = vChangeKey.substring(34, 44);
				}

				if (vAddrnumber === "") {
					if (vCat !== "" && vPartner1 !== "" && vPartner2 !== "") {
						vPartner1 = vPartner1.split(" ")[0];
						vPartner2 = vPartner2.split(" ")[0];
						this.oRouter.navTo("RelDetail", {
							ChangeKey: vChangeEntity,
							Category: vCat,
							Domain: vDomain,
							Partner1: vPartner1,
							Partner2: vPartner2
						});
					}
				} else {
					if (vAddrnumber !== "" && vCat !== "" && vPartner1 !== "" && vPartner2 !== "") {
						vPartner1 = vPartner1.split(" ")[0];
						vPartner2 = vPartner2.split(" ")[0];
						vAddrnumber = vAddrnumber.split(" ")[0];
						this.oRouter.navTo("WPAddressDetail", {

							Category: vCat,
							Domain: vDomain,
							Partner1: vPartner1,
							Partner2: vPartner2,
							Address_number: vAddrnumber
						});
					}
				}
			} else if (data.Entity === 'CompanyCode') {
				if (data.Key[sRowId].Dunning === "" && data.Key[sRowId].Withhld === "") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
					this.oRouter.navTo("CompCode", {
						ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
						contextPath: this.sContextPath,
						Key: data.Key[sRowId].Key
					});
				}

				if (data.Key[sRowId].Dunning !== "" && data.Key[sRowId].Withhld === "") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
					this.oRouter.navTo("Dunning", {
						ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
						contextPath: this.sContextPath,
						Key: data.Key[sRowId].Dunning
					});
				}

				if (data.Key[sRowId].Dunning === "" && data.Key[sRowId].Withhld !== "") {
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
					this.oRouter.navTo("Withhldtax", {
						ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
						contextPath: this.sContextPath,
						Key: data.Key[sRowId].Withhld
					});
				}
			} else if (data.Entity === 'SuppCompanyCode') {
				if (data.Key[sRowId].Dunning === "" && data.Key[sRowId].Withhld === "") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
					this.oRouter.navTo("SuppCompCode", {
						ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
						contextPath: this.sContextPath,
						Key: data.Key[sRowId].Key
					});
				}

				if (data.Key[sRowId].Dunning !== "" && data.Key[sRowId].Withhld === "") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
					this.oRouter.navTo("SuppDunning", {
						ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
						contextPath: this.sContextPath,
						Key: data.Key[sRowId].Dunning
					});
				}

				if (data.Key[sRowId].Dunning === "" && data.Key[sRowId].Withhld !== "") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
					this.oRouter.navTo("SuppWithhldtax", {
						ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
						contextPath: this.sContextPath,
						Key: data.Key[sRowId].Withhld
					});
				}
			} else if (data.Entity === 'SalesArea') {
				fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(data.EntityData);
				this.oRouter.navTo("Sales", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					contextPath: this.sContextPath,
					Key: data.Key[sRowId].Key
				});
			} else if (data.Entity === 'SubRange') {
				fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				this.oRouter.navTo("SubRange", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					contextPath: this.sContextPath,
					Key: data.Key[sRowId].Key
				});
			} else if (data.Entity === 'PurchaseData') {
				if (data.Key[sRowId].Subrange === "") {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
					this.oRouter.navTo("Purchase", {
						ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
						contextPath: this.sContextPath,
						Key: data.Key[sRowId].Key
					});
				} else {
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
					this.oRouter.navTo("SubRange", {
						ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
						contextPath: this.sContextPath,
						Key: data.Key[sRowId].Key
					});
				}

			} else if (data.name === "matGtinDataDetail") //Material Details navigation
			{
				//	oView = this.getView();

				this.oRouter.navTo("matGtinDataDetail", {
					Rowid: sRowId
				});
			} else if (data.name === "matNotesDetail") //Material Details navigation
			{

				var TableKey = data.TableKey;

				//	var Material = data.Entity.data.MATERIAL.MATERIAL;
				this.oRouter.navTo("matNotesDetail", {
					TableKey: TableKey,
					RowId: sRowId

				});
			} else if (data.name === "matSalesDataDetail") //Material Details navigation
			{
				this.oRouter.navTo("matSalesDataDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					RowId: sRowId
				});
			} else if (data.name === "matSalesChangeDataDetail") //Material Sales Change Details navigation
			{
				this.oRouter.navTo("matSalesChangeDataDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					RowId: sRowId
				});
			} else if (data.name === "matSalesNDisbChangeDataDetail") //Material Sales and Disb Details navigation
			{
				var vSalesKey = oEvent.getSource().getBindingContext().getObject().VKORG;
				var vDisbKey = oEvent.getSource().getBindingContext().getObject().VTWEG;
				this.oRouter.navTo("matSalesNDisbChangeDataDetail", {
					RowId: sRowId,
					VKORG: vSalesKey,
					VTWEG: vDisbKey
				});
			} else if (data.name === "matSalesTaxChangeDataDetail") //Material Sales Tax Change Details navigation
			{
				var vSalesOrgKey = oEvent.getSource().getBindingContext().getObject().VKORG;
				var vDisbChnKey = oEvent.getSource().getBindingContext().getObject().VTWEG;
				var vTaxCountry = oEvent.getSource().getBindingContext().getObject().ALAND;
				var vTaxType = oEvent.getSource().getBindingContext().getObject().TATYP;
				this.oRouter.navTo("matSalesTaxChangeDataDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					RowId: sRowId,
					VKORG: vSalesOrgKey,
					VTWEG: vDisbChnKey,
					ALAND: vTaxCountry,
					TATYP: vTaxType
				});
			} else if (data.name === "matSalesTextChangeDetail") //Material Sales Text Change Details navigation
			{
				var vSales = oEvent.getSource().getBindingContext().getObject().VKORG;
				var vDisb = oEvent.getSource().getBindingContext().getObject().VTWEG;
				var vLang = oEvent.getSource().getBindingContext().getObject().LANGUCODE;
				this.oRouter.navTo("matSalesTextChangeDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					RowId: sRowId,
					VKORG: vSales,
					VTWEG: vDisb,
					LANGUCODE: vLang
				});
			} else if (data.name === "matGenChangedDetail") //Material Details navigation
			{
				this.oRouter.navTo("matGenChangedDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					contextPath: this.sContextPath,

					RowId: sRowId
				});
			} else if (data.name === "matNotesChangedDetail") //Material Details navigation
			{

				var TableKeyChanged = data.TableKey;
				var key = data.Entity.results[sRowId].ChangeKey;
				var newvalue = data.Entity.results[sRowId].NewValue;
				//	var Material = data.Entity.data.MATERIAL.MATERIAL;
				this.oRouter.navTo("matNotesChangedDetail", {
					TableKey: TableKeyChanged,
					RowId: sRowId,
					key: key,
					newvalue: newvalue

				});
			} else if (data.name === "matDimGtinChangedDetail") //Material Details navigation
			{
				this.oRouter.navTo("matDimGtinChangedDetail", {
					RowId: sRowId
				});

			} else if (data.name === "matCharChangedDetail") //Material Details navigation
			{
				var sCharChngnokey = data.Entity.results[sRowId].EntityDesc;
				var context = data.Entity.results[sRowId].Context;
				var sChartype_text = data.Entity.results[sRowId].CLASSTYPE__TXT;
				var Valid_from=data.Entity.results[sRowId].VALID_FROM;
				this.oRouter.navTo("matCharChangedDetail", {
					key: sCharChngnokey,
					context: context,
					Classtype_text: sChartype_text,
					Valid_from:Valid_from
				});

			} else if (data.name === "matClassChangedDetail") //Material Details navigation
			{
				var sChangnokey = data.Entity.results[sRowId].EntityDesc;
				var sClasscontext = data.Entity.results[sRowId].Context;
				var sClasstype_text = data.Entity.results[sRowId].CLASSTYPE__TXT;
				var Valid_from=data.Entity.results[sRowId].VALID_FROM;
				this.oRouter.navTo("matClassChangedDetail", {
					key: sChangnokey,
					context: sClasscontext,
					Classtype_text: sClasstype_text,
					Valid_from:Valid_from
				});

			} else if (data.name === "matPurchChangedDetail") //Material Details navigation
			{
				this.oRouter.navTo("matPurchChangedDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					contextPath: this.sContextPath,
					RowId: sRowId
				});

			} else if (data.name === "matPlantDataDetail") //Material Plant Details navigation
			{
				var vPlant = data.Entity.MATERIAL2MARCBASICRel.results[sRowId].WERKS;
				this.oRouter.navTo("matPlantDataDetail", {
					WERKS: vPlant,
					RowId: sRowId
				});
			} else if (data.name === "matValAreaDataDetail") { //Plant MRP Text Details navigation 
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
			} else if (data.name === "matPlantPnlChngDetail") //Material Plant Details navigation
			{
				var vChngPlant = oEvent.getSource().getBindingContext().getObject().Plant;
				var vChngMat = oEvent.getSource().getBindingContext().getObject().Material;
				var vChngKey = oEvent.getSource().getBindingContext().getObject().ChangeKey;
				var vStrgLocn = oEvent.getSource().getBindingContext().getObject().StorgLoc;
				var vNewVal = oEvent.getSource().getBindingContext().getObject().NewValue;
				var vInspType = oEvent.getSource().getBindingContext().getObject().InspType;
				var vMrpArea = oEvent.getSource().getBindingContext().getObject().MrpArea;
				var vPrdVer = oEvent.getSource().getBindingContext().getObject().PrdVer;
				var vkey = oEvent.getSource().getBindingContext().getObject().key;
				if (vStrgLocn !== "" && vStrgLocn !== undefined) {
					this.oRouter.navTo("matStrgLocChngDetail", {
						PanelId: data.Entity,
						ChangeKey: vChngKey,
						MatText: this.oModel2.oData.ObjectKey,
						PLANT: vChngPlant,
						MATERIAL: vChngMat,
						STRGLOC: vStrgLocn,
						NwVal: vNewVal
					});
				} else if (vInspType !== "" && vInspType !== undefined) {
					this.oRouter.navTo("matInspTypChngDetail", {
						PanelId: data.Entity,
						ChangeKey: vChngKey,
						MatText: this.oModel2.oData.ObjectKey,
						PLANT: vChngPlant,
						MATERIAL: vChngMat,
						InspType: vInspType,
						NwVal: vNewVal
					});
				} else if (vkey !== "" && vkey !== undefined && vkey !== "Costing") {
					this.oRouter.navTo("matValuationChngDetail", {
						RowId: sRowId
					});
				} else if (vMrpArea !== "" && vMrpArea !== undefined) {
					this.oRouter.navTo("matMrpAreaChngDetail", {
						PanelId: data.Entity,
						ChangeKey: vChngKey,
						MatText: this.oModel2.oData.ObjectKey,
						PLANT: vChngPlant,
						MATERIAL: vChngMat,
						MRPAREA: vMrpArea,
						NwVal: vNewVal
					});
				} else if (vPrdVer !== "" && vPrdVer !== undefined) {
					this.oRouter.navTo("matPrdVerChngDetail", {
						PanelId: data.Entity,
						ChangeKey: vChngKey,
						MatText: this.oModel2.oData.ObjectKey,
						PLANT: vChngPlant,
						MATERIAL: vChngMat,
						PRDVER: vPrdVer,
						NwVal: vNewVal
					});
				} else {
					if (vNewVal !== this.i18nBundle.getText("PC_ADDED")) {
						vNewVal = this.i18nBundle.getText("Change");
					}
					this.oRouter.navTo("matPlantPnlChngDetail", {
						PanelId: data.Entity,
						ChangeKey: vChngKey,
						MatText: this.oModel2.oData.ObjectKey,
						PLANT: vChngPlant,
						MATERIAL: vChngMat,
						NwVal: vNewVal
					});
				}
			} else if (data.name === "matStorageLocDetail") //Plant Storage Location Details navigation 
			{
				var vStrgLoc = data.Entity.MARCBASIC2MARDRel.results[sRowId].LGORT;
				this.oRouter.navTo("matStorageLocDetail", {
					LGORT: vStrgLoc,
					RowId: sRowId,
					Action: this.sAction
				});
			} else if (data.name === "matPlantMrpTextDetail") //Plant MRP Text navigation 
			{
				this.oRouter.navTo("matPlantMrpTextDetail", {
					Action: this.sAction
				});
			} else if (data.name === "matInsTypDetail") //Plant Storage Location Details navigation 
			{
				this.oRouter.navTo("matInsTypDetail", {
					RowId: sRowId,
					Action: this.sAction
				});
			} else if (data.name === "matMrpAreaDetail") //Plant MRP Area Details navigation 
			{
				this.oRouter.navTo("matMrpAreaDetail", {
					RowId: sRowId,
					Action: this.sAction
				});
			} else if (data.name === "matPrdVrsnDetail") //Plant MRP Area Details navigation 
			{
				this.oRouter.navTo("matPrdVrsnDetail", {
					RowId: sRowId,
					Action: this.sAction
				});
			} else if (data.name === "matSalesTextDetail") //Plant Storage Location Details navigation 
			{
				// oView = this.getView();
				var stSales = oEvent.getSource().getBindingContext().getObject().VKORG;
				var stDisb = oEvent.getSource().getBindingContext().getObject().VTWEG;
				var stLangucode = oEvent.getSource().getBindingContext().getObject().LANGUCODE;
				this.oRouter.navTo("matSalesTextDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					RowId: sRowId,
					VKORG: stSales,
					VTWEG: stDisb,
					LANGUCODE: stLangucode
				});
			} else if (data.name === "matWarehouseDataDetail") //Warehouse Details navigation to S4 page
			{
				this.oRouter.navTo("matWarehouseDataDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					RowId: sRowId
				});

			} else if (data.name === "matWarehouseChangeDataDetail") //Warehouse Details navigation to S4 page
			{
				var vWarehouseKey = oEvent.getSource().getBindingContext().getObject().LGNUM;
				this.oRouter.navTo("matWarehouseChangeDataDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					LGNUM: vWarehouseKey,
					MatText: this.oModel2.oData.ObjectKey
				});
			} else if (data.name === "matStorageTypeChangeDataDetail") //Warehouse Details navigation to S4 page
			{
				var vEntityDesc = oEvent.getSource().getBindingContext().getObject().EntityDesc;
				var vObjhdr = vEntityDesc.split(",");
				var vWareKey = oEvent.getSource().getBindingContext().getObject().LGNUM;
				var vStorageKeyDesc = vObjhdr[0];
				var vWareKeyDesc = vObjhdr[1];
				var vStorageKey = oEvent.getSource().getBindingContext().getObject().LGTYP;
				this.oRouter.navTo("matStorageTypeChangeDataDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					LGNUM: vWareKey,
					LGNUM__TXT: vWareKeyDesc,
					LGTYP: vStorageKey,
					LGTYP__TXT: vStorageKeyDesc,
					MatText: this.oModel2.oData.ObjectKey
				});
			} else if (data.name === "matDocAssignmentDataDetail") //Material Document Assignment Details navigation to S4 page
			{
				this.oRouter.navTo("matDocAssignmentDataDetail", {
					RowId: sRowId
				});
			} else if (data.name === "matDocAssignmentTextDataDetail") //Material Document Assignment Text Data Details navigation
			{

				this.oRouter.navTo("matDocAssignmentTextDataDetail", {
					RowId: sRowId

				});
			} else if (data.name === "matDocAssignmentChangeDataDetail") //Material Document Assignment Details navigation to S4 page
			{
				this.oRouter.navTo("matDocAssignmentChangeDataDetail", {
					RowId: sRowId
				});
			} else if (data.name === "matDocAssignmentChangeTextDataDetail") //Material Document Assignment Change Text Data Details navigation to S4 and S5
			{

				this.oRouter.navTo("matDocAssignmentChangeTextDataDetail", {
					RowId: sRowId
				});
			} else if (data.name === 'GLCompanyCode') {
				this.vAction = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction;
				if (this.vAction === 'CHANGE') {
					this.glacccomp = data.Entity.results[sRowId].ChangeKey.substring(0, 4);
				} else if (data.Entity.ACCOUNT.ACCOUNT2ACCCCDETRel.results !== undefined) {
					this.glacccomp = data.Entity.ACCOUNT.ACCOUNT2ACCCCDETRel.results[sRowId].COMPCODE;
				}

				//				oView = this.getView();
				this.oRouter.navTo("GLCompanyCode", {

					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					GLAccComp: this.glacccomp
				});

			} else if (data.name === 'GLCompanyCodeAttach') {
				var sId = oEvent.getParameter("listItem").getId();
				var sIdArray = sId.split("_");
				var vSelectedIndex = sIdArray[2];
				//var changeKeyLens = data.Entity.ACCOUNT.ACCOUNT2ACCCCDETRel.results[sIdArray[1]].ACCCCDET2AtthACCCCDETRel.results[vSelectedIndex].ChangeData.results[0].ChangeKey.length;
				this.glcoa = data.Entity.ACCOUNT.ACCOUNT2ACCCCDETRel.results[sIdArray[1]].ACCCCDET2AtthACCCCDETRel.results[vSelectedIndex].ChangeData.results[
					0].ChangeKey.substring(0, 4);

				this.oRouter.navTo("GLCompanyCode", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					GLAccComp: this.glcoa
				});
			} else if (data.name === 'GLCostEl') {
				this.vAction = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction;
				if (this.vAction === 'CHANGE') {
					var changeKeyLen = data.Entity.results[sRowId].ChangeKey.length;
					this.glcoa = data.Entity.results[sRowId].ChangeKey.substring(10, changeKeyLen);

				} else if (data.Entity.ACCOUNT.ACCOUNT2CELEMRel.results !== undefined) {
					this.glcoa = data.Entity.ACCOUNT.ACCOUNT2CELEMRel.results[sRowId].COAREA;
				}
				//				oView = this.getView();
				this.oRouter.navTo("GLCostEl", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					GLAccCOA: this.glcoa
				});
			} else if (data.name === 'GLCostElAttach') {
				var sId = oEvent.getParameter("listItem").getId();
				var sIdArray = sId.split("_");
				var vSelectedIndex = sIdArray[2];
				var changeKeyLens = data.Entity.ACCOUNT.ACCOUNT2CELEMRel.results[sIdArray[1]].CELEM2AtthCELEMRel.results[vSelectedIndex].ChangeData.results[
					0].ChangeKey.length;
				this.glcoa = data.Entity.ACCOUNT.ACCOUNT2CELEMRel.results[sIdArray[1]].CELEM2AtthCELEMRel.results[vSelectedIndex].ChangeData.results[0]
					.ChangeKey.substring(10, changeKeyLens);

				this.oRouter.navTo("GLCostEl", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID"),
					GLAccCOA: this.glcoa
				});
			} else if (data.name === 'glItemDetail') {
				//fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(data.EntityData);
				this.oRouter.navTo("glItemDetail", {
					ChangeRequestID: this.oView.getBindingContext().getProperty("ChangeRequestID")
					//contextPath   : this.sContextPath,
					//Key:data.Key[sRowId].Key
				});
			} else {
				/**
				 * @ControllerHook To navigate to a new view defined by customer
				 * Customer can navigate to his custom detail views by using the existing router
				 * @callback fcg.mdg.approvecrv2.view.S3~extHookRouteToCustomDetailView
				 * @param {object} this Instance of this controller
				 * @return {void}
				 */
				if (this.extHookRouteToCustomDetailView) {
					this.extHookRouteToCustomDetailView(this);
				}
			}
		}
	},
	//Naviagtion to Detail(S3) from S2 
	handleNavToDetail: function(oEvent) {
		if (oEvent.getParameter("name") === "detail") {
		this.getView().byId("page").setVisible(true);
			var oView = this.getView();
			var sCtxPath = "/" + oEvent.getParameters().arguments.contextPath;
			this.sCtxPath = sCtxPath;
			var oContext = new sap.ui.model.Context(oView.getModel(), sCtxPath);

			try {
				// Get Cr description and Id to place it in the S3 header section    			
				var value = this.getView().getModel("i18n").getProperty("ChangeRequest") + ": " + decodeURIComponent(oEvent.getParameters().arguments.ChangeRequestDesc) +
					' (' + oEvent.getParameters().arguments.ChangeRequestID + ')';
				oView.byId('crId').setText(value);
			} catch (err) {

			}

			this.queryString = this.getView().getModel().sServiceUrl + '/';
			this.attachurl = this.queryString + oEvent.getParameters().arguments.contextPath + "/Attachments";
			this.commenturl = this.queryString + oEvent.getParameters().arguments.contextPath + "/Notes";

			oView.setBindingContext(oContext);
			var oItem = oView.getModel().getData(null, oContext);
//			this.sObjectKey = oItem.ObjectKey;
			this.oModel2 = new sap.ui.model.json.JSONModel(oItem);
			oView.setModel(this.oModel2, "detail");

			/*
			 * Manual detail request via DataManager in batch with decision options together
			 * Automatic request with view binding would cause a S2 list re-rendering - SAPUI5 issue
			 */
			/**
			 * @ControllerHook Add additional entities related to the work item
			 * This hook method can be used to add custom related entities to the expand list of the detail data request
			 * It is called when the detail view is displayed and before the detail data fetch starts
			 * @callback fcg.mdg.approvecrv2.view.S3~extHookGetEntitySetsToExpand
			 * @return {array} aEntitySets - contains the names of the related entities
			 */
			if (this.extHookGetEntitySetsToExpand) {
				var aEntitySets = this.extHookGetEntitySetsToExpand();
				// append custom entity sets to the default list
				this.aExpandEntitySets.push.apply(this.aExpandEntitySets, aEntitySets);
			}

			this.sModel = oEvent.getParameter("arguments").DataModel;
			this.sContextPath = oEvent.getParameter("arguments").contextPath;
			this.actionText = "CREATE";
			this.sAction = oEvent.getParameter("arguments").Action;
			this.sEntity = oEvent.getParameter("arguments").MainEntity;
			this.numberAttachments = oEvent.getParameter("arguments").NumberOfAttachments;
			this.numberNotes = oEvent.getParameter("arguments").NumberOfNotes;
			if (this.vCrId !== oEvent.getParameter("arguments").ChangeRequestID) //this.isNavToDetail === ''
			{
				//Clear the customer Buffered Data
				fcg.mdg.approvecrv2.DomainSpecParts.Customer.ResetBufferedBatchData();
				fcg.mdg.approvecrv2.DomainSpecParts.Supplier.ResetBufferedBatchData();
				fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.ResetGLABufferedBatchData();
				this.vCrId = oEvent.getParameter("arguments").ChangeRequestID;
				//Change the status explicitly as view level setting the status isn't working after we set one record to submitted 
				// for approval or rejection.
				//The below condition is required because on load, by the time data call for the first record is processed, 
				//oData of the model wouldn't already contain complete data.
				if ((this.getView().getModel().oData[oEvent.getParameters().arguments.contextPath]) !== undefined) {
					this.getView().byId('s3Status1').setText(this.getView().getModel().oData[oEvent.getParameters().arguments.contextPath].StatusDesc);
					//Load the Relevant Entities for the selected CR. Applicable for all CRs except the one on initial load.
					var sObjectList = this.getView().getModel().oData[oEvent.getParameters().arguments.contextPath].ObjectList;
					if (!this.oApplicationFacade.isMock()) {
						fcg.mdg.approvecrv2.util.DataAccess.setRelevantEntitiesForCR(this.vCrId, sObjectList);
					}
				}
				this.vCrLocked = false;
				this.sDisableAction = false;
				this.setHeaderFooterOptions(); //Initializing the header footer options				
				this.loadLayout(this.sContextPath, this.sModel, this.sAction, this.sEntity);
				if (this.sEntity === "159") {
					sap.ui.getCore().byId("relPanel").removeAllContent();
					sap.ui.getCore().byId("relPanel").setExpanded(false);
				}

				if (this.sEntity === "266") {
					sap.ui.getCore().byId("suppRelPanel").removeAllContent();
					sap.ui.getCore().byId("suppRelPanel").setExpanded(false);
				}
			}
			this.isNavToDetail = "";
			this.vCrId = oEvent.getParameter("arguments").ChangeRequestID;
		}
	},
	getObjectKey: function() {
		return this.sObjectKey;
	},
	getResponseData: function() {
		return this.result;
	},

	getAttachments: function(vPath, vInstAttachment) {
		var globalinst = this;
		vPath = "AttachmentCollection/?$filter=" + jQuery.sap.encodeURL("ChangeRequestID eq '" + this.vCrId + "'");
		this.getView().getModel().read(
			vPath,
			null,
			null,
			true,
			function(result) {
				if (result.results[0] !== undefined) {
					globalinst.loadAttachments(result, vInstAttachment);
				}
			});
	},

	getNotes: function(vPath, vInstNote) {
		var globalinst = this;
		vPath = "NoteCollection/?$filter=" + jQuery.sap.encodeURL("ChangeRequestID eq '" + this.vCrId + "'");
		this.getView().getModel().read(
			vPath,
			null,
			null,
			true,
			function(result) {
				if (result.results[0] !== undefined) {
					globalinst.loadNotes(result, vInstNote);
				}
			}
		);
	},

	loadAttachments: function(response, vInstAttachment) {
		this.oFileUpload = sap.ui.getCore().byId(vInstAttachment);
		var mockData = {
			dataitems: []
		};
		var count = response.results.length;
		if (count !== 0) {
			for (var i = 0; i < response.results.length; i++) {
				var AttachDate = sap.ca.ui.model.format.DateFormat.getDateInstance().format(response.results[i].CreatedAt);
				var link = "";
				if (response.results[i].Link !== "") {
					link = response.results[i].Link;
				} else {
					link = response.results[i].__metadata.media_src;
				}
				var oAttach = {
					"mimeType": response.results[i].MimeType,
					"contributor": response.results[i].CreatedBy,
					"uploaded": AttachDate, //sDate,
					"filename": response.results[i].FileName,
					//	"url":response.results[i].__metadata.media_src,
					"url": link
				};
				mockData.dataitems.push(oAttach);
			}
			var mockDataModel = new sap.ui.model.json.JSONModel(mockData);
			this.oFileUpload.setModel(mockDataModel, "json");
		}
	},

	loadNotes: function(response, vInstNote) {

		this.oNotes = sap.ui.getCore().byId(vInstNote);
		//	var that = this;
		var odata = {
			Notes: []
		};
		var Count = response.results.length;
		if (Count !== 0) {
			for (var i = 0; i < response.results.length; i++) {
				var noteDate = sap.ca.ui.model.format.DateFormat.getDateInstance().format(response.results[i].CreatedAt);
				var noteTime = sap.ca.ui.model.format.DateFormat.getTimeInstance().format(response.results[i].CreatedAt);
				var notetimestamp = noteDate + " " + noteTime;

				var oComment = {
					sender: response.results[i].CreatedBy,
					//timestamp:fcg.mdg.approvecrv2.util.Formatter.dateFormatter(response.results[i].CreatedAt),
					timestamp: notetimestamp, //sap.ca.ui.model.format.DateFormat.getDateInstance().format(response.results[i].CreatedAt),
					text: response.results[i].Text,
					icon: "sap-icon://notes"
				};
				odata.Notes.push(oComment);
			}
			this.oModel = new sap.ui.model.json.JSONModel(odata);
			this.oNotes.setModel(this.oModel, "json");
		}
	},

	loadLayout: function(vPath, vModel, vAction, vEntity) { //vOTC
		//		var that = this;
		this.aBatchOperation = [];
		if (vEntity === "159") //Handle Customer
		{
			fcg.mdg.approvecrv2.DomainSpecParts.Customer.LoadLayout(vPath, vModel, vAction, vEntity, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Customer.getGeneralData(vPath, vAction, vEntity, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Customer.getRelationshipData(vPath, vAction, vEntity, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Customer.getCompanyCodeData(vPath, vAction, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Customer.getSalesData(vPath, vAction, this);
		}
		if (vEntity === "158") //Handle Cost Center
		{
			// Load Layout
			fcg.mdg.approvecrv2.DomainSpecParts.CostCenter.
			loadLayout(this);
			// This method will be called to display the data of cost center. The last exporting parameter will specify whether it is create OR change
			// If last exporting parameter value is 'X' then it is CREATE, else it is a CHANGE operation
			fcg.mdg.approvecrv2.DomainSpecParts.CostCenter.
			displayData(this.getView(), this.aBatchOperation, vPath, vAction, this);
			return;
		}
		if (vEntity === "229") //Handle Profit Center
		{
			// Load Layout
			fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenter.
			loadLayout(this);
			// This method will be called to display the data of profit center. The last exporting parameter will specify whether it is create OR change
			// If last exporting parameter value is 'X' then it is CREATE, else it is a CHANGE operation
			fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenter.displayData(this.getView(), this.aBatchOperation, vPath, vAction, this);
			return;
		}
		if (vEntity === "266") //Handle Supplier
		{
			fcg.mdg.approvecrv2.DomainSpecParts.Supplier.LoadLayout(vPath, vModel, vAction, vEntity, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getGeneralData(vPath, vAction, vEntity, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getRelationshipData(vPath, vAction, vEntity, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getSuppCompanyCodeData(vPath, vAction, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getPurchaseData(vPath, vAction, this);
		}

		if (vEntity === "892") //Handle GL Account
		{
			// Load Layout
			fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.
			loadLayout(this);
			// This method will be called to display the data of cost center. The last exporting parameter will specify whether it is create OR change
			// If last exporting parameter value is 'X' then it is CREATE, else it is a CHANGE operation
			fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.
			displayData(this.getView(), this.aBatchOperation, vPath, vAction, this);
			fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.
			displayCCData(this.getView(), this.aBatchOperation, vPath, vAction, this);
			fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.
			displayCEData(this.getView(), this.aBatchOperation, vPath, vAction, this);
			return;
		}

		if (vEntity === "194") //Handle Material
		{
			var vLastCr = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getLastCr();
			var vMaterial = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
			var vMatnum =   fcg.mdg.approvecrv2.util.Formatter.ParseObjKey(vMaterial);
			if (this.vSetMat === vMatnum && this.vSetMat !== "" && vMatnum !== "" && vLastCr !== this.vCrId) {
				this.getView().byId("page").setVisible(false);
			} else {
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.
			loadLayout(this);
			var vprvmat = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralData(this.getView(), this.aBatchOperation, vPath, vAction, this);
			
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getAsyncSalesData(vPath, vAction, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getAsyncPlantData(vPath, vAction, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getAsyncWhouseData(vPath, vAction, this);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getAsyncDocData(vPath, vAction, this);
			this.vSetMat = vprvmat;
			}
		}

	},
	getCreatedPlantFlag: function() {
		return undefined;
	},
	onPanelExpand: function(oEvent) {

		var vMatPanelid = oEvent.getParameters().id;

		var vMatPanelexpandevent = oEvent.getParameters().expand;

		if (vMatPanelexpandevent === true) {

			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getPanelData(vMatPanelid);

		}

	},
	setCrLockError: function(sError) {
		this.vCrLocked = true;
		this.sLockError = sError;
	},

	setCrRejected: function(sError) {
		this.isrejected = true;
		this.rejectError = sError;
	},

	onSelect: function(oEvent) {
		var sKey = oEvent.getParameter("selectedItem").getId();
		var vPath = this.sContextPath;
		var vAction = this.sAction;

		if (sKey === "CNotes") {
			var cNoteElement = sap.ui.getCore().byId("CNote");
			cNoteElement.setShowNoData(false);
			this.getNotes(vPath, "CNote");
		}
		if (sKey === "CAttachmentCustomer") {
			var cAttachmentElement = sap.ui.getCore().byId("Cfileupload");
			cAttachmentElement.setNoDataText(" ");
			this.getAttachments(vPath, "Cfileupload");
		}
		if (sKey === "SNotes") {
			var sNoteElement = sap.ui.getCore().byId("SNote");
			sNoteElement.setShowNoData(false);
			this.getNotes(vPath, "SNote");
		}
		if (sKey === "SAttachmentSupplier") {
			var sAttachmentElement = sap.ui.getCore().byId("Sfileupload");
			sAttachmentElement.setNoDataText(" ");
			this.getAttachments(vPath, "Sfileupload");
		}
		if (sKey === "profitCenterNotes") {
			this.getNotes(vPath, "profitCenterNote");
		}
		if (sKey === "profitCenterAttachments") {
			this.getAttachments(vPath, "pcFileUpload");
		}
		if (sKey === "MaterialNotesTab") {
			this.getNotes(vPath, "MaterialNote");
		}
		if (sKey === "MaterialAttachmentsTab") {
			this.getAttachments(vPath, "matFileUpload");
		}
		if (sKey === "costCenterNotes") {
			this.getNotes(vPath, "costCenterNote");
		}
		if (sKey === "costCenterAttachments") {
			this.getAttachments(vPath, "ccFileUpload");
		}
		if (sKey === "glAccountNotes") {
			var glNoteElement = sap.ui.getCore().byId("glAccountNote");
			glNoteElement.setShowNoData(false);
			this.getNotes(vPath, "glAccountNote");
		}
		if (sKey === "glAccountAttachments") {
			var glAttachmentElement = sap.ui.getCore().byId("glFileUpload");
			glAttachmentElement.setNoDataText(" ");
			this.getAttachments(vPath, "glFileUpload");
		}
		if (sKey === "matSalesIconTab") {
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getSalesData(this.getView(), vPath, vAction, this);

		}
		if (sKey === "matPlantIconTab") { // When Material Plant Icon is selected 
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getPlantData(this.getView(), vPath, vAction, this); // load Plant layout with data
		}
		if (sKey === "matWarehouseIconTab") { // When Material Plant Icon is selected 
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getWarehouseData(this.getView(), vPath, vAction, this); // load Warehouse layout with data
		}
		if (sKey === "matDocAssignmentIconTab") { // When Material Document Icon is selected 
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDocumenAssignmentData(this.getView(), vPath, vAction, this); // load Warehouse layout with data
		}
		/*	if( sKey === "glAccountCCTab"){
		    fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.displayCCData(this.getView(), this.aBatchOperation,vPath, vAction, this);
		    
		}
		if( sKey === "glAccountCETab"){
		    fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.displayCEData(this.getView(), this.aBatchOperation,vPath, vAction, this);
		}*/
		this._selectedSection = sKey;
			//hook for binding the data after selection on the new tab
			/**
		 * @ControllerHook To add a new panel
		 * Customer can add a new tab and can select the tab and bind the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyTab
		 * @param {string} result Holds skey
		 * @param {string} objectkey
		 * @return {void}
		 */
		if (this.extHookmatHookModifyTab) {
			this.extHookmatHookModifyTab(sKey,this.sObjectKey); //HOOK METHOD FOR adding a new layout in general data create and change scenario
		}
	},

	/*	_handleItemRemoved: function() {

		//Successful request processing - navigate back to list on phone
		if (jQuery.device.is.phone) {
			this.oRouter.navTo("master", {}, jQuery.device.is.phone);
			// after overwriting the history state that points to the
			// item which is not available any more, we can step back because
			// the previos history state is also the master list
			window.history.back();
		}
	},*/

	// Get the buttons and set them to positive, negative and others in the footer.
	createDecisionButtons: function(aDecisionOptions, oController, sFromDetail, sDisableAct) {
		var oPositiveAction = null;
		var oNegativeAction = null;
		var aButtonList = [];
		this.aDecisions = aDecisionOptions;
		var that = this;
		this.vSyncFlag = "";
		if (aDecisionOptions.length === 0) {
			this.isApproved = 'X';
		}

		//If the call comes from detail screen
		if (sFromDetail === undefined || sFromDetail === "") {
			if (sDisableAct === undefined) {
				this.sDisableAction = false;
			} else {
				this.sDisableAction = true;
			}
			//PP changed code
			if (this.sDisableAction === true) {
				this.sDisableAction = true;
			}
		}

		var oView = this.getView();
		oView.byId("crHeader").addEventDelegate({
			onAfterRendering: function() {
				var sSeverity = "";
				var sMessage = "";
				var sTitle = "";
				var sRaiseMsg = false;
				var oIns = "";

				if (that.isApproved === 'X' && that.vCrLocked === false && that.rejectError === "" && that.sFinOdataError === false) {
					sSeverity = "ERROR";
					sMessage = that.getView().getModel("i18n").getProperty("ObsoleteRequest");
					sTitle = that.getView().getModel("i18n").getProperty("Error");
					that.isApproved = "";
					oIns = that;
					sap.m.MessageBox.show(
						sMessage, {
							icon: sSeverity,
							title: sTitle,
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function() {
								var oModel = oIns.getView().getModel();
								fcg.mdg.approvecrv2.util.DataAccess.removeItemFromTaskModel(oModel, oIns.sCtxPath);
								oModel.setSizeLimit(10);
								oModel.refresh();
							}
						}

					);
					sRaiseMsg = true;
					//return;
				}
				if (that.vCrLocked === true) {
					sSeverity = "INFORMATION";
					sMessage = that.sLockError;
					sTitle = that.getView().getModel("i18n").getProperty("Info");
					that.isApproved = '';
					that.vCrLocked = false;
					that.sLockError = "";
					oIns = that;
					sap.m.MessageBox.show(
						sMessage, {
							icon: sSeverity,
							title: sTitle,
							actions: [sap.m.MessageBox.Action.OK]
						}

					);
					sRaiseMsg = true;
					//return;
				}
				//In case the CR is being rejected then the info message has to be shown and the refresh has to be performed
				if (that.isrejected === true) {
					sSeverity = "INFORMATION";
					sMessage = that.rejectError;
					sTitle = that.getView().getModel("i18n").getProperty("Info");
					that.isrejected = '';
					that.isrejected = false;
					//	that.rejectError = "";
					oIns = that;
					sap.m.MessageBox.show(
						sMessage, {
							icon: sSeverity,
							title: sTitle,
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function() {
								var oModel = oIns.getView().getModel();
								fcg.mdg.approvecrv2.util.DataAccess.removeItemFromTaskModel(oModel, oIns.sCtxPath);
								oModel.setSizeLimit(10);
								oModel.refresh();
							}
						}

					);
					sRaiseMsg = true;
					//return;
				}
				if (that.sFinOdataError === true) {
					sTitle = that.getView().getModel("i18n").getProperty("Httpreqfail");
					sSeverity = "ERROR";
					that.isApproved = "";
					that.vCrLocked = false;
					oIns = that;
					sap.m.MessageBox.show(
						that.sFinOdataErrorMessage, {
							icon: sSeverity,
							title: sTitle,
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function() {
								if (that.vCRCode.indexOf("MDG_GW_APPROVE_CR/009") > -1) {
									var oModel = oIns.getView().getModel();
									fcg.mdg.approvecrv2.util.DataAccess.removeItemFromTaskModel(oModel, oIns.sCtxPath);
									oModel.setSizeLimit(10);
									oModel.refresh();
								}
							}
						}
					);
					that.setFinOdataError(false, "", "");
					sRaiseMsg = true;
				}

				if (sRaiseMsg === true) {
					sRaiseMsg = false;
				}
			}
		});

		var fp = function(oDecision) {

			return function() {

				var message = that.getView().getModel("i18n").getProperty("ApproveMsg");
				var approvePopup = fcg.mdg.approvecrv2.util.DataAccess.getApprovePopup();

				if (approvePopup === "Y") {
					that.showDecisionDialog(oDecision, false, message, oController);
				} else if (approvePopup === "N") {
					that.handle_decision("", oDecision, oController);
				}

			};

		};

		var fn = function(oDecision) {
			return function() {
				var message = that.getView().getModel("i18n").getProperty("RejectMsg");
				that.showDecisionDialog(oDecision, true, message, oController);
			};
		};
		var fo = function(oDecision) {
			return function() {
				var message = that.getView().getModel("i18n").getProperty("MsgPouup");
				that.showDecisionDialog(oDecision, false, message, oController);
			};

		};
		for (var i = 0; i < aDecisionOptions.length; i++) {
			var oDecisionOption = aDecisionOptions[i];
			if (oDecisionOption.UsmdSequenceNr === "001") {
				oPositiveAction = {
					sBtnTxt: oDecisionOption.UsmdBtnTxt,
					bDisabled: this.sDisableAction,
					onBtnPressed: (fp)(oDecisionOption)
				};
			} else if (oDecisionOption.UsmdSequenceNr === "002") {
				oNegativeAction = {
					sBtnTxt: oDecisionOption.UsmdBtnTxt,
					bDisabled: this.sDisableAction,
					onBtnPressed: (fn)(oDecisionOption)
				};
			} else {
				aButtonList.push({
					sBtnTxt: oDecisionOption.UsmdBtnTxt,
					onBtnPressed: (fo)(oDecisionOption)
				});
			}
		}
		/*		oPositiveAction.attachPress({vMsg: that.getView().getModel("i18n").getProperty("ApproveMsg"), 
			vBool: false }, that.onDecisionPerformed, that );	*/
		var oButtonList = "";
		oButtonList.oPositiveAction = oPositiveAction;
		oButtonList.oNegativeAction = oNegativeAction;
		oButtonList.aButtonList = aButtonList;
		/**
		 * @ControllerHook Modify the footer buttons
		 * This hook method can be used to add and change buttons for the detail view footer
		 * It is called when the decision options for the detail item are fetched successfully
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookChangeFooterButtons
		 * @param {object} oButtonList - contains the positive, negative buttons and the additional button list.
		 * @return {void}
		 */
		if (this.extHookChangeFooterButtons) {
			this.extHookChangeFooterButtons(oButtonList);
			oPositiveAction = oButtonList.oPositiveAction;
			oNegativeAction = oButtonList.oNegativeAction;
			aButtonList = oButtonList.aButtonList;
		}
		var _oHeaderFooterOptions = "";
		if (sFromDetail !== undefined && sFromDetail === 'navFromDetail') {
			_oHeaderFooterOptions = jQuery.extend(oController._oHeaderFooterOptions, {
				oPositiveAction: oPositiveAction,
				oNegativeAction: oNegativeAction,
				onBack: function() {
					window.history.back();
				},
				buttonList: aButtonList,
				bSuppressBookmarkButton: false
			});
		} else {
			var vThisInstance = this;
			_oHeaderFooterOptions = jQuery.extend(oController._oHeaderFooterOptions, {
				oPositiveAction: oPositiveAction,
				oNegativeAction: oNegativeAction,
				buttonList: aButtonList,
				onBack: function() {
				if(sap.ui.Device.system.phone && vThisInstance.vFirstTimeFlag){
						vThisInstance.vFirstTimeFlag = false;
					window.history.go(-2);
					}
					else{
					window.history.back();
					} 
				},
				bSuppressBookmarkButton: false
			});
		}

		//if((sFromDetail === 'X' && aDecisionOptions.length !== 0) || (sFromDetail !== 'X')){//aDecisionOptions.length !== 0 &&
		oController.setHeaderFooterOptions(_oHeaderFooterOptions);
		//};
		/*		if(sFromDetail === 'X' && aDecisionOptions.length === 0){

		}
		else{
			oController.setHeaderFooterOptions(_oHeaderFooterOptions);
		}*/
	},

	showDecisionDialog: function(oDecision, noteMandt, message, oController) {
		var that = this;
		sap.ca.ui.dialog.confirmation.open({
			//question :oDecision.UsmdBtnTxt+" "+that.i18nBundle.getText("PopupMsg")+" "+that.mainEntityText+"-"+that.objectKey+" "+that.i18nBundle.getText("By")+" "+that.createdByDesc,
			question: message,
			showNote: true,
			noteMandatory: noteMandt,
			title: oDecision.UsmdBtnTxt,
			confirmButtonLabel: that.i18nBundle.getText("XBUT_OK")
		}, jQuery.proxy(function(oDecision, oResult) {
				if (oResult.isConfirmed) {
					this.handle_decision(oResult.sNote, oDecision, oController);
				}
			},
			this, oDecision));
	},

	//	Handle Approve or Reject
	handle_decision: function(Note, oDecision, oController) {
		var globalIns = oController;
		var that = this;
		var oCreate = this.getView().getModel();

		var chageRequestId = this.oView.getBindingContext().getProperty("ChangeRequestID");
		var vmodel = this.oView.getBindingContext().getProperty("DataModel");
		this.mainEntityText = this.oView.getBindingContext().getProperty("MainEntityText");
		this.objectKey = this.oView.getBindingContext().getProperty("ObjectKey");
		try {
			var ChangedAt = this.oView.getBindingContext().getProperty("ChangedAt").toISOString();
			var ChangedAtNew = ChangedAt.split('.');
			this.ChangedAt = ChangedAtNew[0];
			this.createdByDesc = this.oView.getBindingContext().getProperty("CreatedByDesc");
		} catch (err) {}

		//var Note = Note;
		var ActionCode = oDecision.UsmdCrAction;
		var RejectionReason = '$$';
		var PerfomAction = "PerformAction?ActionCode='" + ActionCode + "'" +
			"&ChangeRequestID='" + chageRequestId +
			"'&Model='" + vmodel +
			"'&Note='" + encodeURIComponent(Note) +
			"'&CreatedBy='" + this.createdByDesc +
			"'&LogicalAction='" + this.actionText +
			"'&ObjectDescription='" + encodeURIComponent(this.objectKey) +
			"'&MainEntity='" + this.mainEntityText +
			"'&ChangedAt=datetime'" + this.ChangedAt +
			"'&RejectionReasonCode='" + RejectionReason + "'";

		oCreate.create(
			PerfomAction,
			null,
			null,
			function(odata, response) {
				var message = response.data.PerformAction.MsgTxt; //"Success";
				sap.m.MessageToast.show(message, { //Show a success message for material created lasting for 5 secs
					duration: 5000
				});

				//to refresh the list on sucess
				var oModel = globalIns.getView().getModel();
				globalIns._oHeaderFooterOptions.oNegativeAction.bDisabled = true;
				globalIns._oHeaderFooterOptions.oPositiveAction.bDisabled = true;
				globalIns.setHeaderFooterOptions(globalIns._oHeaderFooterOptions);

				//Disable the buttons in the main page aswell
				that._oHeaderFooterOptions.oNegativeAction.bDisabled = true;
				that._oHeaderFooterOptions.oPositiveAction.bDisabled = true;
				that.setHeaderFooterOptions(that._oHeaderFooterOptions);

				that.getView().byId("s3Status1").setText(globalIns.getView().getModel("i18n").getProperty("SUBMITTED"));
				that.sDisableAction = true;
				fcg.mdg.approvecrv2.util.DataAccess.removeItemFromTaskModel(oModel, that.sCtxPath);
				fcg.mdg.approvecrv2.util.DataAccess.setTaskStatusCompleted();
				//If the URL parameter Remove_Processed_Cr is set to Y, then remove the CR from the list
				if (fcg.mdg.approvecrv2.util.DataAccess.getRemoveProcessedCR() === "Y") {
					that.getView().getModel().setSizeLimit(10);
					that.getView().getModel().refresh();
				}
			},

			function(oError) {
				var errorMessage = "";
				for (var i = 0; i < jQuery.parseJSON(oError.response.body).error.innererror.errordetails.length; i++) {
					if (errorMessage !== "") {
						errorMessage = errorMessage + "\n";
					}
					errorMessage = errorMessage + jQuery.parseJSON(oError.response.body).error.innererror.errordetails[i].message;
				}
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Error", //oGlobal.getView().getModel('i18n').getProperty("MAT_ERROR1"),
					details: errorMessage
				});
			});
	},

	//Lead selection
	/*  removeItemFromTaskModel : function (changeRequestId) {
           var oModel = this.getView().getModel();
                  oModel.refresh();
}, */

	//popover of cr details

	onOpenPopover: function(oEvent) {

		//Destroy the content if popover is already created
		if (this._oPopover !== "" && this._oPopover !== undefined) {
			this._oPopover.destroy();
			this._oPopover = "";
		}

		// create popover
		if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("fcg.mdg.approvecrv2.frag.CRdetails", this);
			this.getView().addDependent(this._oPopover);
		}

		// delay because addDependent will do a async rerendering and the popover will immediately close without it
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function() {
			this._oPopover.openBy(oButton);

		});
	},

	iconFormatterinS3: function(oValue) {
		if (oValue === "" || oValue === null || oValue === undefined)
			return "";

		if (oValue === 'CREATE')
			return "sap-icon://create";
		else
			return "";
	},

	_navBack: function() {
		this.getView().byId("page").destroyAllContent();
		this.destroyAllContent();
	},

	beforeExit: function() {
		this.getView().byId("page").destroyAllContent();
		this.destroyAllContent();
	},

	onExit: function() {
		try {
			if (this.costCenterIconTab !== "") {
				sap.ui.getCore().byId("ccFileUpload-uploader").destroy();
				this.costCenterIconTab.destroy();
			}
		} catch (err) {}
		try {
			if (this.profitCenterIconTab !== "") {
				sap.ui.getCore().byId("pcFileUpload-uploader").destroy();
				this.profitCenterIconTab.destroy();
			}
		} catch (err) {}
		try {
			if (this.oCustomerDomain !== "") {
				sap.ui.getCore().byId("Cfileupload-uploader").destroy();
				this.oCustomerDomain.destroy();
			}
		} catch (err) {}
		try {
			if (this.oSupplierDomain !== "") {
				sap.ui.getCore().byId("Sfileupload-uploader").destroy();
				this.oSupplierDomain.destroy();
			}
		} catch (err) {}
		try {
			if (this.glAccountIconTab !== "") {
				sap.ui.getCore().byId("glFileUpload-uploader").destroy();
				this.glAccountrIconTab.destroy();
			}
		} catch (err) {}
		//Reset All the variables in Data Access File
		fcg.mdg.approvecrv2.util.DataAccess.resetAllContent();
	},

	onAppExit: function() {
		this.getView().byId("page").destroyAllContent();
		this.destroyAllContent();
	},

	getDecisions: function() {
		return this.aDecisions;
	},

	setFinOdataError: function(vError, vErrorMsg, vCode) {
		this.sFinOdataError = vError;
		this.sFinOdataErrorMessage = vErrorMsg;
		this.vCRCode = vCode;
	},

	validityFormatter: function(oValidFrom, oValidTo) {
		var vFrom = "";
		var vTo = "";

		if (oValidFrom === "" || oValidFrom === null || oValidFrom === undefined || oValidTo === "" || oValidTo === null || oValidTo ===
			undefined)
			return "";

		if (oValidFrom) {
			vFrom = sap.ca.ui.model.format.DateFormat.getDateInstance().format(oValidFrom);
		}

		if (oValidTo) {
			vTo = sap.ca.ui.model.format.DateFormat.getDateInstance().format(oValidTo);
		}
		return this.getView().getModel("i18n").getProperty("Validity") + ": " + vFrom + " - " + vTo;
	},

	s3EntityText: function(oActionValue, oCode) {
		if (oActionValue === 'CREATE' && oCode === '159') {
			return this.getView().getModel("i18n").getProperty("Newcustomer");
		} else if (oActionValue === 'CHANGE' && oCode === '159') {
			return this.getView().getModel("i18n").getProperty("Changedcustomer");
		} else if (oActionValue === 'CREATE' && oCode === '158') {
			return this.getView().getModel("i18n").getProperty("CC_CCTRCCTRN");
		} else if (oActionValue === 'CHANGE' && oCode === '158') {
			return this.getView().getModel("i18n").getProperty("Changedcostcenter");
		} else if (oActionValue === 'CREATE' && oCode === '229') {
			return this.getView().getModel("i18n").getProperty("PC_NPC_ID");
		} else if (oActionValue === 'CHANGE' && oCode === '229') {
			return this.getView().getModel("i18n").getProperty("Changedprofitcenter");
		} else if (oActionValue === 'CREATE' && oCode === '266') {
			return this.getView().getModel("i18n").getProperty("Newsupplier");
		} else if (oActionValue === 'CHANGE' && oCode === '266') {
			return this.getView().getModel("i18n").getProperty("Changedsupplier");
		} else if (oActionValue === 'CREATE' && oCode === '892') {
			return this.getView().getModel("i18n").getProperty("NewGLA");
		} else if (oActionValue === 'CHANGE' && oCode === '892') {
			return this.getView().getModel("i18n").getProperty("ChangedGLA");
		} else if (oActionValue === 'CREATE' && oCode === '194') {
			return this.getView().getModel("i18n").getProperty("New_Material");
		} else if (oActionValue === 'CHANGE' && oCode === '194') {
			return this.getView().getModel("i18n").getProperty("Changed_Material");
		}

	},

	requestedBy: function(createdBy) {
		if (createdBy === "" || createdBy === null || createdBy === undefined)
			return "";
		else
			return this.getView().getModel("i18n").getProperty("RequestedBy") + ": " + createdBy;
	},

	setNoteAttachIconTab: function(vInstNoteTab, vInstAttachmentTab) {
		if (this.numberAttachments === "00" || this.numberAttachments === '0') {
			vInstAttachmentTab.setVisible(false);
		} else {
			vInstAttachmentTab.setVisible(true);
			vInstAttachmentTab.setCount(parseInt(this.numberAttachments));
		}
		if (this.numberNotes === "00" || this.numberNotes === '0') {
			vInstNoteTab.setVisible(false);
		} else {
			vInstNoteTab.setVisible(true);
			vInstNoteTab.setCount(parseInt(this.numberNotes));
		}
	},

	ccHookCustomService: function(sServiceURL) {
		/**
		 * @ControllerHook To modify the serviceUrl
		 * Customer can modify the service url to access his own service
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCCCustomService
		 * @param {string} this.sServiceURL Service Url
		 * @return {string} Modified service url
		 */
		if (this.extHookCCCustomService) {
			var extQuery = this.extHookCCCustomService(sServiceURL); //HOOK METHOD for custom service
			return extQuery;
			//			if(extQuery !== undefined){
			//			this.sServiceURL = extQuery;
			//}
		}
	},

	/* Issue: Save as Tile was not showing in the mobile devices
	 * Override this method in order to describe wether this view is the main detail (S3) screen or a screen on deeper hierarchy level
	 * Note: This method must only return true or false.
	 * The default implementation also returns other values for compatibility reasons
	 */
	isMainScreen: function() {

		/* if (this._oControlStore.oBackButton){
			return false;
		}
		// for compatibility reasons in order to distinguish from overridden cases
		return "X";*/
		//Above implementation of the method is commented out as a part of incident: 1482013299
		return true;
	},

	custHookCustomService: function(s3Controller, sServiceURL) {
		/**
		 * @ControllerHook To modify the serviceUrl
		 * Customer can modify the service url to access his own service
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCustCustomService
		 * @param {string} s3Controller instance
		 * @param {string} this.sServiceURL Service Url
		 * @return {string} Modified service url
		 */
		if (this.extHookCustCustomService) {
			var extQuery = this.extHookCustCustomService(s3Controller, sServiceURL); //HOOK METHOD for custom service
			return extQuery;
			//			if(extQuery !== undefined){
			//			this.sServiceURL = extQuery;
			//}
		}
	},

	ccHookChangeQuery: function(sQuery) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCCChangeQuery
		 * @param {string} Query Query to fetch data of created cost center
		 * @return {string} Modified Query
		 */
		if (this.extHookCCChangeQuery) {
			var extQuery = this.extHookCCChangeQuery(sQuery); //HOOK METHOD FOR Cost Center Change Query
			return extQuery;
		}

	},

	ccHookChangeLayout: function() {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookChangeLayout
		 * @return {void}
		 */
		if (this.extHookChangeLayout) {
			this.extHookChangeLayout(); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	ccHookDecTempForChange: function(oItemDescTemp) {
		/**
		 * @ControllerHook To modify the description table
		 * Customer can modify the description table by adding/deleting new columns or by influencing
		 * the format of data shown in this description table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookChangeDescTemplate
		 * @param {object} oItemTemp Item template of a table
		 * @return {object} oItemTemp Modified Item template of the description table
		 */
		if (this.extHookChangeDescTemplate) {
			var extOItemTemp = this.extHookChangeDescTemplate(oItemDescTemp); //HOOK METHOD FOR Description table template in change scenario
			return extOItemTemp;
		}
	},

	ccHookCreateQuery: function(sQuery) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCCCreateQuery
		 * @param {string} Query Query to fetch data of created cost center
		 * @return {string} Modified Query
		 */
		if (this.extHookCCCreateQuery) {
			var extQuery = this.extHookCCCreateQuery(sQuery); //HOOK METHOD FOR Cost Center Change Query
			return extQuery;
		}

	},

	custHookCreateSalesQuery: function(vCompletePath) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCustCreateSalesQuery
		 * @param {string} Query Query to fetch data of created customer
		 * @return {string} Modified Query
		 */
		if (this.extHookCustCreateSalesQuery) {
			var extQuery = this.extHookCustCreateSalesQuery(vCompletePath); //HOOK METHOD FOR Cost Center Change Query
			return extQuery;
		}

	},

	custHookCreateCompCodeQuery: function(vCompletePath) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCustCreateCompCodeQuery
		 * @param {string} Query Query to fetch data of created customer
		 * @return {string} Modified Query
		 */
		if (this.extHookCustCreateCompCodeQuery) {
			var extQuery = this.extHookCustCreateCompCodeQuery(vCompletePath); //HOOK METHOD FOR Cost Center Change Query
			return extQuery;
		}

	},

	custHookCreateAddressQuery: function(vCompletePath) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCustCreateAddressQuery
		 * @param {string} Query Query to fetch data of created customer
		 * @return {string} Modified Query
		 */
		if (this.extHookCustCreateAddressQuery) {
			var extQuery = this.extHookCustCreateAddressQuery(vCompletePath); //HOOK METHOD FOR Cost Center Change Query
			return extQuery;
		}

	},

	custHookCreateGenQuery: function(vCompletePath) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCustCreateGenQuery
		 * @param {string} Query Query to fetch data of created customer
		 * @return {string} Modified Query
		 */
		if (this.extHookCustCreateGenQuery) {
			var extQuery = this.extHookCustCreateGenQuery(vCompletePath); //HOOK METHOD FOR Cost Center Change Query
			return extQuery;
		}

	},

	custHookChangeSalesQuery: function(vCompletePath) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCustChangeSalesQuery
		 * @param {string} Query Query to fetch data of created customer
		 * @return {string} Modified Query
		 */
		if (this.extHookCustChangeSalesQuery) {
			var extQuery = this.extHookCustChangeSalesQuery(vCompletePath); //HOOK METHOD FOR Cost Center Change Query
			return extQuery;
		}

	},

	custHookChangeCompCodeQuery: function(vCompletePath) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCustChangeCompCodeQuery
		 * @param {string} Query Query to fetch data of created customer
		 * @return {string} Modified Query
		 */
		if (this.extHookCustChangeCompCodeQuery) {
			var extQuery = this.extHookCustChangeCompCodeQuery(vCompletePath); //HOOK METHOD FOR Cost Center Change Query
			return extQuery;
		}

	},

	custHookChangeAddressQuery: function(vCompletePath) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCustChangeAddressQuery
		 * @param {string} Query Query to fetch data of created customer
		 * @return {string} Modified Query
		 */
		if (this.extHookCustChangeAddressQuery) {
			var extQuery = this.extHookCustChangeAddressQuery(vCompletePath); //HOOK METHOD FOR Cost Center Change Query
			return extQuery;
		}

	},

	custHookChangeGenQuery: function(vCompletePath) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCustChangeGenQuery
		 * @param {string} Query Query to fetch data of created customer
		 * @return {string} Modified Query
		 */
		if (this.extHookCustChangeGenQuery) {
			var extQuery = this.extHookCustChangeGenQuery(vCompletePath); //HOOK METHOD FOR Cost Center Change Query
			return extQuery;
		}

	},

	ccHookModityCreateFormData: function(result) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookModityCreateFormData
		 * @param {object} detailData Holds data
		 * @return {object} detailData Modified Data
		 */
		if (this.extHookModityCreateFormData) {
			var extModifiedData = this.extHookModityCreateFormData(result);
			return extModifiedData;
		}
	},

	ccHookCreateDescTemplate: function(oItemDescrTemp) {
		/**
		 * @ControllerHook To modify the description table
		 * Customer can modify the description table by adding/deleting new columns or by influencing
		 * the format of data shown in this description table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCreateDescTemplate
		 * @param {object} oItemTemp Item template of a table
		 * @return {object} oItemTemp Modified Item template of the description table
		 */
		if (this.extHookCreateDescTemplate) {
			var extOItemTemp = this.extHookCreateDescTemplate(oItemDescrTemp); //HOOK METHOD FOR Description table template in create scenario
			return extOItemTemp;
		}
	},

	ccHookHideCreateAddressSection: function() {
		/**
		 * @ControllerHook To delete the address section
		 * Customer can add their own fields to influence hiding of this address section by
		 * adjusting the fields in the IF condition
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookHideCreateAddressSection
		 * @return {void}
		 */
		if (this.extHookHideCreateAddressSection) {
			this.extHookHideCreateAddressSection();
		} else {
			sap.ui.getCore().byId("CreateAddressTitle").destroy();
		}

	},

	ccHookHideCreateCommSection: function() {
		/**
		 * @ControllerHook To delete the address section
		 * Customer can add their own fields to influence hiding of this communication section by
		 * adjusting the fields in the IF condition
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookHideCreateCommSection
		 * @return {void}
		 */
		if (this.extHookHideCreateCommSection) {
			this.extHookHideCreateCommSection();
		} else {
			sap.ui.getCore().byId("CreateCommunicationTitle").destroy();
		}

	},

	ccHookAddCCData: function(result) {
		/**
		 * @ControllerHook To add more data in different tabs or layouts
		 * Customer can add more data in new tabs and layouts
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookAddCCData
		 * @param {object} detailData Holds data
		 * @return {void}
		 */
		if (this.extHookAddCCData) {
			this.extHookAddCCData(result);
		}
	},

	pcHookPCCustomService: function(pctrServiceUrl) {
		/**
		 * @ControllerHook To modify the serviceUrl
		 * Customer can modify the service url to access his own service
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCCustomService
		 * @param {string} this.sServiceURL Service Url
		 * @return {string} Modified service url
		 */
		if (this.extHookPCCustomService) {
			var extQuery = this.extHookPCCustomService(pctrServiceUrl); //HOOK METHOD for custom service of proit center
			return extQuery;
		}
	},

	pcHookPCChangeQuery: function(sQuery) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCChangeQuery
		 * @param {string} Query Query to fetch data of created cost center
		 * @return {string} Modified Query
		 */
		if (this.extHookPCChangeQuery) {
			var extQuery = this.extHookPCChangeQuery(sQuery); //HOOK METHOD FOR Profit Center Change Query
			return extQuery;
		}
	},

	pcHookPCChangeLayout: function() {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCChangeLayout
		 * @return {void}
		 */
		if (this.extHookPCChangeLayout) {
			this.extHookPCChangeLayout(); //HOOK METHOD FOR adding layouts to change scenario
		}
	},

	pcHookPCChangeDescTemplate: function(oItemDescTemp) {
		/**
		 * @ControllerHook To modify the description table
		 * Customer can modify the description table by adding/deleting new columns or by influencing
		 * the format of data shown in this description table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCChangeDescTemplate
		 * @param {object} oItemTemp Item template of a table
		 * @return {object} oItemTemp Modified Item template of the description table
		 */
		if (this.extHookPCChangeDescTemplate) {
			var extOItemTemp = this.extHookPCChangeDescTemplate(oItemDescTemp); //HOOK METHOD FOR profit center desc table in change scenario
			return extOItemTemp;
		}
	},

	pcHookPCCreateQuery: function(sQuery) {
		/**
		 * @ControllerHook To modify the query
		 * Customer can modify the query string to fetch the entity data that he/she needs
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCCreateQuery
		 * @param {string} Query Query to fetch data of created cost center
		 * @return {string} Modified Query
		 */
		if (this.extHookPCCreateQuery) {
			var extQuery = this.extHookPCCreateQuery(sQuery); //HOOK METHOD FOR fetching Query of Profit center create scenario
			return extQuery;
		}
	},

	pcHookModifyPCCreateFormData: function(aResult) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookModifyPCCreateFormData
		 * @param {object} detailData Holds data
		 * @return {object} detailData Modified Data
		 */
		if (this.extHookModifyPCCreateFormData) {
			var extModifiedData = this.extHookModifyPCCreateFormData(aResult);
			return extModifiedData;
		}
	},

	pcHookPCCreateDescTemplate: function(oItemDescrTemp) {
		/**
		 * @ControllerHook To modify the description table
		 * Customer can modify the description table by adding/deleting new columns or by influencing
		 * the format of data shown in this description table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCCreateDescTemplate
		 * @param {object} oItemTemp Item template of a table
		 * @return {object} oItemTemp Modified Item template of the description table
		 */
		if (this.extHookPCCreateDescTemplate) {
			var extOItemTemp = this.extHookPCCreateDescTemplate(oItemDescrTemp); //HOOK METHOD FOR Key Search
			return extOItemTemp;
		}
	},

	pcHookAddPCData: function(aResult) {
		/**
		 * @ControllerHook To add more data in different tabs or layouts
		 * Customer can add more data in new tabs and layouts
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookAddPCData
		 * @param {object} detailData Holds data
		 * @return {void}
		 */
		if (this.extHookAddPCData) {
			this.extHookAddPCData(aResult);
		}
	},

	pcHookPCHideCreateAddressSection: function() {
		/**
		 * @ControllerHook To delete the address section
		 * Customer can add their own fields to influence hiding of this address section by
		 * adjusting the fields in the IF condition
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCHideCreateAddressSection
		 * @return {void}
		 */
		if (this.extHookPCHideCreateAddressSection) {
			this.extHookPCHideCreateAddressSection();
		} else {
			if (sap.ui.getCore().byId("pcAddress") !== undefined) {
				sap.ui.getCore().byId("pcAddress").destroy();
			}
		}
	},

	pcHookHidePCCreateCommSection: function() {
		/**
		 * @ControllerHook To delete the address section
		 * Customer can add their own fields to influence hiding of this communication section by
		 * adjusting the fields in the IF condition
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookHidePCCreateCommSection
		 * @return {void}
		 */
		if (this.extHookHidePCCreateCommSection) {
			this.extHookHidePCCreateCommSection();
		} else {
			if (sap.ui.getCore().byId("pcComm") !== undefined)
				sap.ui.getCore().byId("pcComm").destroy();
		}
	},
	pcHookPCChangeCompCodeTemplate: function(oItemCompCodeTemp) {
		/**
		 * @ControllerHook To modify the company code table
		 * Customer can modify the description table by adding/deleting new columns or by influencing
		 * the format of data shown in this description table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCChangeCompCodeTemplate
		 * @param {object} oItemCompCodeTemp Item template of a table
		 * @return {object} oItemCompCodeTemp Modified Item template of the company code table
		 */
		if (this.extHookPCChangeCompCodeTemplate) {
			var extOItemTemp = this.extHookPCChangeCompCodeTemplate(oItemCompCodeTemp); //HOOK METHOD FOR Key Search
			return extOItemTemp;
		}
	},

	pcHookPCCreateCompCodeTemplate: function(oItemCompCodeTemp) {
		/**
		 * @ControllerHook To modify the company code table
		 * Customer can modify the description table by adding/deleting new columns or by influencing
		 * the format of data shown in this description table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCCreateCompCodeTemplate
		 * @param {object} oItemCompCodeTemp Item template of a table
		 * @return {object} oItemCompCodeTemp Modified Item template of the company code table
		 */
		if (this.extHookPCCreateCompCodeTemplate) {
			var extOItemTemp = this.extHookPCCreateCompCodeTemplate(oItemCompCodeTemp); //HOOK METHOD FOR Key Search
			return extOItemTemp;
		}
	},

	ccHookModifyChangeData: function(aGenData, aAddress, aCommData, aIndicators, result) {
		/**
		 * @ControllerHook To modify the data to be shown in change data
		 * Customer can modify the change data of a cost center by considering custom fields into it
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCCModifyChangeData
		 * @param {array} aGenData - contains general data changes
		 * @param {array} aAddress - contains address data changes
		 * @param {array} aCommData - contains communication data changes
		 * @param {array} aIndicators - contains indicators data changes
		 * @param {object} result Results from odata
		 * @return {array} aModifiedData Modified data
		 */
		if (this.extHookCCModifyChangeData) {
			var aModifiedData = this.extHookCCModifyChangeData(aGenData, aAddress, aCommData, aIndicators, result);
			return aModifiedData;
		}
	},

	pcHookModifyChangeData: function(aGenData, aAddress, aCommData, aIndicators, result) {
		/**
		 * @ControllerHook To modify the data to be shown in change data
		 * Customer can modify the change data of a profit center by considering custom fields into it
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCModifyChangeData
		 * @param {array} aGenData - contains general data changes
		 * @param {array} aAddress - contains address data changes
		 * @param {array} aCommData - contains communication data changes
		 * @param {array} aIndicators - contains indicators data changes
		 * @param {object} result Results from odata
		 * @return {array} aModifiedData Modified data
		 */
		if (this.extHookPCModifyChangeData) {
			var aModifiedData = this.extHookPCModifyChangeData(aGenData, aAddress, aCommData, aIndicators, result);
			return aModifiedData;
		}
	},

	ccHookFillDataForChangeLayout: function(result, oView) {
		/**
		 * @ControllerHook To add data for new layout
		 * Customer can add their own fields to new layout created for cost center change layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookCCFillDataForChangeLayout
		 * @param {object} result Contains change data
		 * @param {object} oView s3 view instance
		 * @return {void}
		 */
		if (this.extHookCCFillDataForChangeLayout) {
			this.extHookCCFillDataForChangeLayout(result, oView);
		}
	},

	pcHookFillDataForChangeLayout: function(result) {
		/**
		 * @ControllerHook To add data for new layout
		 * Customer can add their own fields to new layout created for cost center change layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookPCFillDataForChangeLayout
		 * @param {object} result Contains change data
		 * @return {void}
		 */
		if (this.extHookPCFillDataForChangeLayout) {
			this.extHookPCFillDataForChangeLayout(result);
		}
	},

	custHookCreateOrgData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookCreateOrgData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookCreateOrgData) {
			var extModifiedData = this.extHookcustHookCreateOrgData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookCreatePersonData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookCreatePersonData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookCreatePersonData) {
			var extModifiedData = this.extHookcustHookCreatePersonData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookCreateGroupData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookCreateGroupData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookCreateGroupData) {
			var extModifiedData = this.extHookcustHookCreateGroupData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookChangeOrgData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookChangeOrgData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookChangeOrgData) {
			var extModifiedData = this.extHookcustHookChangeOrgData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookPersonChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookPersonChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookPersonChangeData) {
			var extModifiedData = this.extHookcustHookPersonChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookGroupChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookChangeGroupData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookChangeGroupData) {
			var extModifiedData = this.extHookcustHookChangeGroupData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookOrgResChangeData: function(oDataItems, vthis, s3Controller) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookccustHookOrgResChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @param {object} s3controller
		 * @return {object} result Modified Data
		 */
		if (this.extHookccustHookOrgResChangeData) {
			var extModifiedData = this.extHookccustHookOrgResChangeData(oDataItems, vthis, s3Controller);
			return extModifiedData;
		}
	},

	custHookPersonResChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookPersonResChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookPersonResChangeData) {
			var extModifiedData = this.extHookcustHookPersonResChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookGroupResChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookGroupResChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookGroupResChangeData) {
			var extModifiedData = this.extHookcustHookGroupResChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},
	custHookCreateMultAssign: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookCreateMultAssign
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookCreateMultAssign) {
			var extModifiedData = this.extHookcustHookCreateMultAssign(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookCreateSalesArea: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookCreateSalesArea
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookCreateSalesArea) {
			var extModifiedData = this.extHookcustHookCreateSalesArea(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookCreateDunning: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookCreateDunning
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookCreateDunning) {
			var extModifiedData = this.extHookcustHookCreateDunning(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookCreateWithTax: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookCreateWithTax
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookCreateWithTax) {
			var extModifiedData = this.extHookcustHookCreateWithTax(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookCompanyValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookCompanyValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookCompanyValueTemplate) {
			var extModifiedData = this.extHookcustHookCompanyValueTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookCompCodeValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookCompCodeValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookCompCodeValueTemplate) {
			var extModifiedData = this.extHookcustHookCompCodeValueTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookSalesValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookSalesValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookSalesValueTemplate) {
			var extModifiedData = this.extHookcustHookSalesValueTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookRoleValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookRoleValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookRoleValueTemplate) {
			var extModifiedData = this.extHookcustHookRoleValueTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookBankValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookBankValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookBankValueTemplate) {
			var extModifiedData = this.extHookcustHookBankValueTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookRelValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookRelValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookRelValueTemplate) {
			var extModifiedData = this.extHookcustHookRelValueTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookgetAddrUsageTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookgetAddrUsageTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookgetAddrUsageTemplate) {
			var extModifiedData = this.extHookcustHookgetAddrUsageTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookAddressTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookAddressTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookAddressTemplate) {
			var extModifiedData = this.extHookcustHookAddressTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookErpCustomerValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookErpCustomerValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookErpCustomerValueTemplate) {
			var extModifiedData = this.extHookcustHookErpCustomerValueTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookIndusValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookIndusValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookIndusValueTemplate) {
			var extModifiedData = this.extHookcustHookIndusValueTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookTaxValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookTaxValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookTaxValueTemplate) {
			var extModifiedData = this.extHookcustHookTaxValueTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookIdentificationValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookIdentificationValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookIdentificationValueTemplate) {
			var extModifiedData = this.extHookcustHookIdentificationValueTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookgetDunningTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookgetDunningTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookgetDunningTemplate) {
			var extModifiedData = this.extHookcustHookgetDunningTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookgetPartnerFuncTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookgetPartnerFuncTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookgetPartnerFuncTemplate) {
			var extModifiedData = this.extHookcustHookgetPartnerFuncTemplate(oItems);
			return extModifiedData;
		}
	},

	//change 
	custHookRoleChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookRoleChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookRoleChangeData) {
			var extModifiedData = this.extHookcustHookRoleChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookBankChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookBankChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookBankChangeData) {
			var extModifiedData = this.extHookcustHookBankChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookTaxChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookTaxChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookTaxChangeData) {
			var extModifiedData = this.extHookcustHookTaxChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookIdentificationChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookIdentificationChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookIdentificationChangeData) {
			var extModifiedData = this.extHookcustHookIdentificationChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	//change

	custHookIndustryChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookIndustryChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookIndustryChangeData) {
			var extModifiedData = this.extHookcustHookIndustryChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookERPCustChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookERPCustChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookERPCustChangeData) {
			var extModifiedData = this.extHookcustHookERPCustChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookCompCodeChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookCompCodeChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookCompCodeChangeData) {
			var extModifiedData = this.extHookcustHookCompCodeChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookDunningChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookDunningChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookDunningChangeData) {
			var extModifiedData = this.extHookcustHookDunningChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	//change
	custHookWithTaxChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookWithTaxChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookWithTaxChangeData) {
			var extModifiedData = this.extHookcustHookWithTaxChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookPFChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookPFChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookPFChangeData) {
			var extModifiedData = this.extHookcustHookPFChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookTaxClassChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookTaxClassChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookTaxClassChangeData) {
			var extModifiedData = this.extHookcustHookTaxClassChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	custHookSalesChangeData: function(oDataItems, vthis) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookSalesChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookSalesChangeData) {
			var extModifiedData = this.extHookcustHookSalesChangeData(oDataItems, vthis);
			return extModifiedData;
		}
	},

	//change template
	custHookgetChangeTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookgetChangeTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookgetChangeTableTemplate) {
			var extModifiedData = this.extHookcustHookgetChangeTableTemplate(oItems);
			return extModifiedData;
		}
	},

	//delete navigation

	custHookDeleteData: function(oItems, vthis, vs3) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookDeleteData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @param {object} s3 controller
		 */
		if (this.extHookcustHookDeleteData) {
			this.extHookcustHookDeleteData(oItems, vthis, vs3);

		}
	},

	custHookgetAddressTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookgetAddressTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookgetAddressTableTemplate) {
			var extModifiedData = this.extHookcustHookgetAddressTableTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookgetTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookgetTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookgetTableTemplate) {
			var extModifiedData = this.extHookcustHookgetTableTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookgetObsoleteTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookgetObsoleteTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookcustHookgetObsoleteTableTemplate) {
			var extModifiedData = this.extHookcustHookgetObsoleteTableTemplate(oItems);
			return extModifiedData;
		}
	},

	custHookremovelayout: function() {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookremovelayout
		 * @return {void}
		 */
		if (this.extHookcustHookremovelayout) {
			this.extHookcustHookremovelayout(); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	custHookModifyCustCreateGen: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookModifyCustCreateGen
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookcustHookModifyCustCreateGen) {
			this.extHookcustHookModifyCustCreateGen(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	custHookModifyCustChangeGen: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookModifyCustChangeGen
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookcustHookModifyCustChangeGen) {
			this.extHookcustHookModifyCustChangeGen(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	custHookModifyCustChangeComp: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookModifyCustChangeComp
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookcustHookModifyCustChangeComp) {
			this.extHookcustHookModifyCustChangeComp(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	custHookModifyCustCreateComp: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookModifyCustCreateComp
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookcustHookModifyCustCreateComp) {
			this.extHookcustHookModifyCustCreateComp(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	custHookModifyCustCreateSales: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookModifyCustCreateSales
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */

		if (this.extHookcustHookModifyCustCreateSales) {
			this.extHookcustHookModifyCustCreateSales(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	custHookModifyCustChangeSales: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookcustHookModifyCustChangeSales
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */

		if (this.extHookcustHookModifyCustChangeSales) {
			this.extHookcustHookModifyCustChangeSales(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	//Supplier Related Extension points.	
	supplierHookCustomService: function(s3Controller, sServiceURL) {
		/**
		 * @ControllerHook To modify the serviceUrl for Supplier Service
		 * Customer can modify the service url to access his own service
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookSupplierCustomService
		 * @param {string} s3Controller instance
		 * @param {string} this.sServiceURL Service Url
		 * @return {string} Modified service url
		 */
		if (this.extHookSupplierCustomService) {
			var extQuery = this.extHookSupplierCustomService(s3Controller, sServiceURL); //HOOK METHOD for custom service
			return extQuery;
			//			if(extQuery !== undefined){
			//			this.sServiceURL = extQuery;
			//}
		}
	},

	supplierHookremovelayout: function() {
		/**
		 * @ControllerHook To remove the contents of new layout
		 * Customer can remove the contents of newly added layouts
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksupplierHookremovelayout
		 * @return {void}
		 */
		if (this.extHooksupplierHookremovelayout) {
			this.extHooksupplierHookremovelayout(); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	supplierHookModifySuppChangeGen: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksupplierHookModifySuppChangeGen
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHooksupplierHookModifySuppChangeGen) {
			this.extHooksupplierHookModifySuppChangeGen(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	suppliertHookModifySuppCreateGen: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksuppliertHookModifySuppCreateGen
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHooksuppliertHookModifySuppCreateGen) {
			this.extHooksuppliertHookModifySuppCreateGen(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	supplierHookModifySuppChangeComp: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksupplierHookModifySuppChangeComp
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHooksupplierHookModifySuppChangeComp) {
			this.extHooksupplierHookModifySuppChangeComp(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	supplierHookModifySuppCreateComp: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksupplierHookModifySuppCreateComp
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHooksupplierHookModifySuppCreateComp) {
			this.extHooksupplierHookModifySuppCreateComp(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	supplierHookModifySuppChangePurchOrg: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksupplierHookModifySuppChangePurchOrg
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHooksupplierHookModifySuppChangePurchOrg) {
			this.extHooksupplierHookModifySuppChangePurchOrg(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	supplierHookModifySuppCreatePurchOrg: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksupplierHookModifySuppCreatePurchOrg
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHooksupplierHookModifySuppCreatePurchOrg) {
			this.extHooksupplierHookModifySuppCreatePurchOrg(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	suppHookgetDunningTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksuppHookgetDunningTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHooksuppHookgetDunningTemplate) {
			var extModifiedData = this.extHooksuppHookgetDunningTemplate(oItems);
			return extModifiedData;
		}
	},

	suppHookgetPartnerFuncTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksuppHookgetPartnerFuncTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHooksuppHookgetPartnerFuncTemplate) {
			var extModifiedData = this.extHooksuppHookgetPartnerFuncTemplate(oItems);
			return extModifiedData;
		}
	},

	supptHookCompCodeValueTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksupptHookCompCodeValueTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHooksupptHookCompCodeValueTemplate) {
			var extModifiedData = this.extHooksupptHookCompCodeValueTemplate(oItems);
			return extModifiedData;
		}

	},

	suppHookgetSubrangeTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHooksuppHookgetSubrangeTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHooksuppHookgetSubrangeTemplate) {
			var extModifiedData = this.extHooksuppHookgetSubrangeTemplate(oItems);
			return extModifiedData;
		}
	},

	glHookgetCEDescTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookgetCEDescTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookglHookgetCEDescTemplate) {
			var extModifiedData = this.extHookglHookgetCEDescTemplate(oItems);
			return extModifiedData;
		}
	},

	glHookgetCompCodeTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookgetCompCodeTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookglHookgetCompCodeTemplate) {
			var extModifiedData = this.extHookglHookgetCompCodeTemplate(oItems);
			return extModifiedData;
		}
	},

	glHookgetCostElTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookgetCostElTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookglHookgetCostElTemplate) {
			var extModifiedData = this.extHookglHookgetCostElTemplate(oItems);
			return extModifiedData;
		}
	},

	glHookgetDescTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookgetDescTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookglHookgetDescTemplate) {
			var extModifiedData = this.extHookglHookgetDescTemplate(oItems);
			return extModifiedData;
		}
	},

	glHookchangeTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookchangeTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookglHookchangeTableTemplate) {
			var extModifiedData = this.extHookglHookchangeTableTemplate(oItems);
			return extModifiedData;
		}
	},

	glHookModifyAccCreateData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookModifyAccCreateData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookglHookModifyAccCreateData) {
			this.extHookglHookModifyAccCreateData(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in create scenario
		}
	},

	glHookModifyAccChangeData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookModifyAccChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookglHookModifyAccChangeData) {
			this.extHookglHookModifyAccChangeData(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in change scenario
		}
	},

	glHookModifyCompCodeCreateData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookModifyCompCodeCreateData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookglHookModifyCompCodeCreateData) {
			this.extHookglHookModifyCompCodeCreateData(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in create comp code scenario
		}
	},

	glHookModifyCompCodeChangeData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookModifyCompCodeChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookglHookModifyCompCodeChangeData) {
			this.extHookglHookModifyCompCodeChangeData(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in create comp code scenario
		}
	},

	glHookModifyCECreateData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookModifyCECreateData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookglHookModifyCECreateData) {
			this.extHookglHookModifyCECreateData(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in create comp code scenario
		}
	},

	glHookModifyCEChangeData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookglHookModifyCEChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookglHookModifyCEChangeData) {
			this.extHookglHookModifyCEChangeData(s3Controller, oResponse); //HOOK METHOD FOR adding a new layout in create comp code scenario
		}
	},
	matHookgetSalesTaxTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetSalesTaxTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetSalesTaxTemplate) {
			var extModifiedData = this.extHookmatHookgetSalesTaxTemplate(oItems);
			return extModifiedData;
		}
	},


		matHookHideSalesPackagingSection: function() {
		/**
		 * @ControllerHook To hide atp section in general data tab
		 * Customer can hide atp section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookHideSalesPackagingSection
		 * @return {string}
		 */
		if (this.extHookmatHookHideSalesPackagingSection) {
			this.extHookmatHookHideSalesPackagingSection();
			return true;
		} else {
			return false;
		}
	},

	matHookgetSalesTextTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetSalesTextTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetSalesTextTemplate) {
			var extModifiedData = this.extHookmatHookgetSalesTextTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookgetSalesDistChainsTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetSalesDistChainsTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetSalesDistChainsTemplate) {
			var extModifiedData = this.extHookmatHookgetSalesDistChainsTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookgetGtinTableTemplate: function(oItems,oGTINModel) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetGtinTableTemplate
		 * @param {object} result Holds data
		  * @param {object} result Holds model
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetGtinTableTemplate) {
			var extModifiedData = this.extHookmatHookgetGtinTableTemplate(oItems,oGTINModel);
			return extModifiedData;
		}
	},
	matHookcreateMatLedgerPriceTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookcreateMatLedgerPriceTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookcreateMatLedgerPriceTemplate) {
			var extModifiedData = this.extHookmatHookcreateMatLedgerPriceTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookcreateMatLedgerPerTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookcreateMatLedgerPerTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookcreateMatLedgerPerTemplate) {
			var extModifiedData = this.extHookmatHookcreateMatLedgerPerTemplate(oItems);
			return extModifiedData;
		}
	},

	matHookgetNotesTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetNotesTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetNotesTableTemplate) {
			var extModifiedData = this.extHookmatHookgetNotesTableTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookGetClassificationTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookGetClassificationTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookGetClassificationTableTemplate) {
			var extModifiedData = this.extHookmatHookGetClassificationTableTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookgetClassTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetClassTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetClassTableTemplate) {
			var extModifiedData = this.extHookmatHookgetClassTableTemplate(oItems);
			return extModifiedData;
		}
	},

	matHookGetCharTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookGetCharTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookGetCharTableTemplate) {
			var extModifiedData = this.extHookmatHookGetCharTableTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookgetWarehouseChangeTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetWarehouseChangeTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetWarehouseChangeTemplate) {
			var extModifiedData = this.extHookmatHookgetWarehouseChangeTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookgetWarehouseStorageTypeTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetWarehouseStorageTypeTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetWarehouseStorageTypeTemplate) {
			var extModifiedData = this.extHookmatHookgetWarehouseStorageTypeTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookModifyMatWarehouseCreateData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatWarehouseCreateData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatWarehouseCreateData) {
			var extModifiedData = this.extHookmatHookModifyMatWarehouseCreateData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatWarehouseChangeData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatWarehouseChangeData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatWarehouseChangeData) {
			var extModifiedData = this.extHookmatHookModifyMatWarehouseChangeData(s3Controller, oResponse);
			return extModifiedData;
		}
	},

	matHookModifyMatWarehouseDetailData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatWarehouseDetailData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatWarehouseDetailData) {
			var extModifiedData = this.extHookmatHookModifyMatWarehouseDetailData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookgetWarehouseDataItems: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetWarehouseDataItems
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetWarehouseDataItems) {
			var extModifiedData = this.extHookmatHookgetWarehouseDataItems(oItems);
			return extModifiedData;
		}
	},

	matHookgetWarehouseTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetWarehouseTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetWarehouseTemplate) {
			var extModifiedData = this.extHookmatHookgetWarehouseTemplate(oItems);
			return extModifiedData;
		}
	},

	matHookcreateDocAssignmentTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookcreateDocAssignmentTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookcreateDocAssignmentTableTemplate) {
			var extModifiedData = this.extHookmatHookcreateDocAssignmentTableTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookcreateDocAssignmentcreateTextTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookcreateDocAssignmentcreateTextTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookcreateDocAssignmentcreateTextTemplate) {
			var extModifiedData = this.extHookmatHookcreateDocAssignmentcreateTextTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookcreateTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookcreateTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookcreateTableTemplate) {
			var extModifiedData = this.extHookmatHookcreateTableTemplate(oItems);
			return extModifiedData;
		}
	},

	matHookModifyMatDocumentCreateData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatDocumentCreateData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatDocumentCreateData) {
			var extModifiedData = this.extHookmatHookModifyMatDocumentCreateData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatDocumentDetailData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatDocumentDetailData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatDocumentDetailData) {
			var extModifiedData = this.extHookmatHookModifyMatDocumentDetailData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatgtincreateData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatgtincreateData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatgtincreateData) {
			var extModifiedData = this.extHookmatHookModifyMatgtincreateData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookClassificationCreate: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookClassificationCreate
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookClassificationCreate) {
			var extModifiedData = this.extHookmatHookClassificationCreate(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatPurchasingcreateData: function(s3Controller, Query, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatPurchasingcreateData
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatPurchasingcreateData) {
			var extModifiedData = this.extHookmatHookModifyMatPurchasingcreateData(s3Controller, Query, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatNotesCreateData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatNotesCreateData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatNotesCreateData) {
			var extModifiedData = this.extHookmatHookModifyMatNotesCreateData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatGtinChangedData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatGtinChangedData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatGtinChangedData) {
			var extModifiedData = this.extHookmatHookModifyMatGtinChangedData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatClassificationChangedData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatClassificationChangedData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatClassificationChangedData) {
			var extModifiedData = this.extHookmatHookModifyMatClassificationChangedData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatPurchChangedData: function(s3Controller, Query, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatPurchChangedData
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatPurchChangedData) {
			var extModifiedData = this.extHookmatHookModifyMatPurchChangedData(s3Controller, Query, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatNotesChangedData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatNotesChangedData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatNotesChangedData) {
			var extModifiedData = this.extHookmatHookModifyMatNotesChangedData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookgetWarehouseResults: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetWarehouseResults
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetWarehouseResults) {
			var extModifiedData = this.extHookmatHookgetWarehouseResults(oItems);
			return extModifiedData;
		}
	},
	matHookgetStorageTypeResults: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetStorageTypeResults
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetStorageTypeResults) {
			var extModifiedData = this.extHookmatHookgetStorageTypeResults(oItems);

			return extModifiedData;
		}
	},
	matHookModifyMatDocumentChangeData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatDocumentChangeData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatDocumentChangeData) {
			var extModifiedData = this.extHookmatHookModifyMatDocumentChangeData(s3Controller, oResponse);
			return extModifiedData;
		}
	},

	matHookModifyMatGeneralCreateData: function(sQuery1, sQuery2, oResponse,matNum) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatModifyMatGeneralCreateData
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @param {object} result matNum
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatModifyMatGeneralCreateData) {
			var extModifiedData = this.extHookmatModifyMatGeneralCreateData(sQuery1, sQuery2, oResponse,matNum);
			return extModifiedData;
		}
	},

	matHookModifyMatGeneralChangeData: function(sQuery1, sQuery2, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatModifyMatGeneralChangeData
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatModifyMatGeneralChangeData) {
			var extModifiedData = this.extHookmatModifyMatGeneralChangeData(sQuery1, sQuery2, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatClassificationCreateData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatModifyMatClassificationCreateData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatModifyMatClassificationCreateData) {
			var extModifiedData = this.extHookmatModifyMatClassificationCreateData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatPlantValuationCostData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatModifyMatPlantValuationCostData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatModifyMatPlantValuationCostData) {
			var extModifiedData = this.extHookmatModifyMatPlantValuationCostData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatPlantValuationAcntData: function(s3Controller, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatModifyMatPlantValuationAcntData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatModifyMatPlantValuationAcntData) {
			var extModifiedData = this.extHookmatModifyMatPlantValuationAcntData(s3Controller, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyGeneralCreateChangeData: function(s3Controller, oResponse, vAction) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyGeneralCreateChangeData
		 * @param {object} result Holds data
		 * @param {object} instance
		 *  * @param {object} Action
		 * @return {void}
		 */
		if (this.extHookmatHookModifyGeneralCreateChangeData) {
			this.extHookmatHookModifyGeneralCreateChangeData(s3Controller, oResponse, vAction); //HOOK METHOD FOR adding a new layout in general data create and change scenario
		}
	},
	matHookModifyPanelData: function(vPanelId,matNum) {
		/**
		 * @ControllerHook To add a new panel
		 * Customer can add a new panel and can call respective bindind method from here
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyPanelData
		 * @param {object} results holds the panelId
		 *  *@param {object} results holds the matnumber
		 * @return {void}
		 */
		if (this.extHookmatHookModifyPanelData) {
			this.extHookmatHookModifyPanelData(vPanelId,matNum); //HOOK METHOD FOR adding a new layout in general data create and change scenario
		}
	},
			matHookModifyPanelExpand: function(oView) {
		/**
		 * @ControllerHook To add a new panel
		 * Customer can add a new panel and can call respective bindind method from here
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyPanelExpand
		 * @param {object} results holds the panelId
		 * @return {void}
		 */
		if (this.extHookmatHookModifyPanelExpand) {
			this.extHookmatHookModifyPanelExpand(oView); //HOOK METHOD FOR adding a new layout in general data create and change scenario
		}
	},
	matHookModifyBindPanelData: function(aResult, vPanelId, oView) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyBindPanelData
		 * @param {object} result Holds data
		 * @param {object} result Holds panel id
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookmatHookModifyBindPanelData) {
			this.extHookmatHookModifyBindPanelData(aResult, vPanelId, oView);
		}
	},
	matHookModifyBindPanelChangedData: function(aResult, vPanelId, oView) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyBindPanelChangedData
		 * @param {object} result Holds data
		 * @param {object} result Holds panel id
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookmatHookModifyBindPanelChangedData) {
			this.extHookmatHookModifyBindPanelChangedData(aResult, vPanelId, oView);
		}
	},
	matHookModifyDocDetail: function(aResult, oView) {
		/**
		 * @ControllerHook To add a new layout
		 * Customer can add a new layout and can instantiate the table within this layout
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyDocDetail
		 * @param {object} result Holds data
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookmatHookModifyDocDetail) {
			this.extHookmatHookModifyDocDetail(aResult, oView);
		}
	},
	matHideProcurementSection: function() {
		/**
		 * @ControllerHook To hide procuremwnt section in general data tab
		 * Customer can hide atp section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHideProcurementSection
		 * @return{boolean}
		 */
		if (this.extHookmatHideProcurementSection) {
			this.extHookmatHideProcurementSection();
			return true;
		} else {
			return false;
		}
	},
	matHideQualitySection: function() {
		/**
		 * @ControllerHook To hide quality section in general data tab
		 * Customer can hide quality section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHideQualitySection
		 * @return {string}
		 */
		if (this.extHookmatHideQualitySection) {
			this.extHookmatHideQualitySection();
			return true;
		} else {
			return false;
		}
	},
	matHideATPSection: function() {
		/**
		 * @ControllerHook To hide atp section in general data tab
		 * Customer can hide atp section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHideATPSection
		 * @return {string}
		 */
		if (this.extHookmatHideATPSection) {
			this.extHookmatHideATPSection();
			return true;
		} else {
			return false;
		}
	},

	matHookHideWarehouseStorageSection: function() {
		/**
		 * @ControllerHook To hide atp section in general data tab
		 * Customer can hide atp section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookHideWarehouseStorageSection
		 * @return {string}
		 */
		if (this.extHookmatHookHideWarehouseStorageSection) {
			this.extHookmatHookHideWarehouseStorageSection();
			return true;
		} else {
			return false;
		}
	},

	matHookHideWarehouseCentralSection: function() {
		/**
		 * @ControllerHook To hide atp section in general data tab
		 * Customer can hide atp section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookHideWarehouseCentralSection
		 * @return {string}
		 */
		if (this.extHookmatHookHideWarehouseCentralSection) {
			this.extHookmatHookHideWarehouseCentralSection();
			return true;
		} else {
			return false;
		}
	},

	matHookHideWarehousePalletSection: function() {
		/**
		 * @ControllerHook To hide atp section in general data tab
		 * Customer can hide atp section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookHideWarehousePalletSection
		 * @return {string}
		 */
		if (this.extHookmatHookHideWarehousePalletSection) {
			this.extHookmatHookHideWarehousePalletSection();
			return true;
		} else {
			return false;
		}
	},

	matHideGroupingSection: function() {
		/**
		 * @ControllerHook To hide grouping section in general data tab
		 * Customer can hide grouping section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHideGroupingSection
		 * @return {string}
		 */
		if (this.extHookmatHideGroupingSection) {
			this.extHookmatHideGroupingSection();
			return true;
		} else {
			return false;
		}
	},
	matHideDesignDataSection: function() {
		/**
		 * @ControllerHook To hide design data section in general data tab
		 * Customer can hide design data section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHideDesignDataSection
		 * @return {string}
		 */
		if (this.extHookmatHideDesignDataSection) {
			this.extHookmatHideDesignDataSection();
			return true;
		} else {
			return false;
		}
	},
	matHideConfigurationSection: function() {
		/**
		 * @ControllerHook To hide configuration section in general data tab
		 * Customer can hide configuration section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHideConfigurationSection
		 * @return {string}
		 */
		if (this.extHookmatHideConfigurationSection) {
			this.extHookmatHideConfigurationSection();
			return true;
		} else {
			return false;
		}
	},
	matHideEnvironmentSection: function() {
		/**
		 * @ControllerHook To hide configuration section in general data tab
		 * Customer can hide configuration section in general data tab
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHideEnvironmentSection
		 * @return {string}
		 */
		if (this.extHookmatHideEnvironmentSection) {
			this.extHookmatHideEnvironmentSection();
			return true;
		} else {
			return false;
		}
	},

	matHookModifyDocCreateData: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the table if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyDocCreateData
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyDocCreateData) {
			var extModifiedData = this.extHookmatHookModifyDocCreateData(oItems);
			return extModifiedData;
		}
	},
	matHookModifyMatSalesChangedData: function(sQuery1, sQuery2, sQuery3, sQuery4, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatSalesChangedData
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatSalesChangedData) {
			var extModifiedData = this.extHookmatHookModifyMatSalesChangedData(sQuery1, sQuery2, sQuery3, sQuery4, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatSalesCreateData: function(sQuery1, sQuery2, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data create scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and binding the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatSalesCreateData
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatSalesCreateData) {
			var extModifiedData = this.extHookmatHookModifyMatSalesCreateData(sQuery1, sQuery2, oResponse);
			return extModifiedData;
		}
	},
	matHookcreatePlantTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatcreatePlantTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatcreatePlantTableTemplate) {
			var extModifiedData = this.extHookmatcreatePlantTableTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookcreateMrpTxtTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatcreateMrpTxtTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatcreateMrpTxtTemplate) {
			var extModifiedData = this.extHookmatcreateMrpTxtTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookcreateMrpAreaTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatcreateMrpAreaTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatcreateMrpAreaTemplate) {
			var extModifiedData = this.extHookmatcreateMrpAreaTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookcreatePrdVrsnTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatcreatePrdVrsnTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatcreatePrdVrsnTemplate) {
			var extModifiedData = this.extHookmatcreatePrdVrsnTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookcreateInspctnTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatcreateInspctnTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatcreateInspctnTemplate) {
			var extModifiedData = this.extHookmatcreateInspctnTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookcreateStrgLocTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatcreateStrgLocTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatcreateStrgLocTemplate) {
			var extModifiedData = this.extHookmatcreateStrgLocTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookcreateChngLogTblTemplt: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatcreateChngLogTblTemplt
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatcreateChngLogTblTemplt) {
			var extModifiedData = this.extHookmatcreateChngLogTblTemplt(oItems);
			return extModifiedData;
		}
	},
	matHookModifyMatReqPlanningPanel: function(sQuery1, sQuery2, sQuery3, sQuery4, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatReqPlanningPanel
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatReqPlanningPanel) {
			var extModifiedData = this.extHookmatHookModifyMatReqPlanningPanel(sQuery1, sQuery2, sQuery3, sQuery4, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatForecastingPanel: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatForecastingPanel
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatForecastingPanel) {
			var extModifiedData = this.extHookmatHookModifyMatForecastingPanel(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatQltyMngmntPanel: function(sQuery1, sQuery2, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatQltyMngmntPanel
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatQltyMngmntPanel) {
			var extModifiedData = this.extHookmatHookModifyMatQltyMngmntPanel(sQuery1, sQuery2, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatWorkSchdlngPanel: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatWorkSchdlngPanel
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatWorkSchdlngPanel) {
			var extModifiedData = this.extHookmatHookModifyMatWorkSchdlngPanel(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatStrgCstngPanel: function(sQuery1, sQuery2, sQuery3, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatStrgCstngPanel
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatStrgCstngPanel) {
			var extModifiedData = this.extHookmatHookModifyMatStrgCstngPanel(sQuery1, sQuery2, sQuery3, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatReqPlanningPanelChng: function(sQuery1, sQuery2, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatReqPlanningPanelChng
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatReqPlanningPanelChng) {
			var extModifiedData = this.extHookmatHookModifyMatReqPlanningPanelChng(sQuery1, sQuery2, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatForecastingPanelChng: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatForecastingPanelChng
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatForecastingPanelChng) {
			var extModifiedData = this.extHookmatHookModifyMatForecastingPanelChng(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatQltyMngmntPanelChng: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatQltyMngmntPanelChng
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatQltyMngmntPanelChng) {
			var extModifiedData = this.extHookmatHookModifyMatQltyMngmntPanelChng(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatWorkSchdlngPanelChng: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatWorkSchdlngPanelChng
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatWorkSchdlngPanelChng) {
			var extModifiedData = this.extHookmatHookModifyMatWorkSchdlngPanelChng(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyMatStrgCstngPanelChng: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatStrgCstngPanelChng
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatStrgCstngPanelChng) {
			var extModifiedData = this.extHookmatHookModifyMatStrgCstngPanelChng(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookModifygetPlantDetailsData: function(sQuery1, sQuery2, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifygetPlantDetailsData
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifygetPlantDetailsData) {
			var extModifiedData = this.extHookmatHookModifygetPlantDetailsData(sQuery1, sQuery2, oResponse);
			return extModifiedData;
		}
	},
	matHookModifygetPlantData: function(sQuery1, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifygetPlantData
		 * @param {object} result Query
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifygetPlantData) {
			var extModifiedData = this.extHookmatHookModifygetPlantData(sQuery1, oResponse);
			return extModifiedData;
		}
	},
	matHookGetValAreaTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookGetValAreaTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookGetValAreaTableTemplate) {
			var extModifiedData = this.extHookmatHookGetValAreaTableTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookModifyPlantbindPanelData: function(vPanelId, oView, oResponse) {
		/**
		 * @ControllerHook To modify the panels for Plant create and change scenario and bind the response
		 * Customer can modify the data as per his requirements before expanding the panel and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyPlantbindPanelData
		 * @param {object} result Panel
		 * @param {object} result View
		 * @param {object} result Response
		 */
		if (this.extHookmatHookModifyPlantbindPanelData) {
			this.extHookmatHookModifyPlantbindPanelData(vPanelId, oView, oResponse);
		}
	},
	matHookModifyBindPlantTable: function(aDataItems, oResponse) {
		/**
		 * @ControllerHook To modify and bind the plant table in create scenario
		 * Customer can modify and bind the data as per his requirements to plant table in multiple plant case
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyBindPlantTable
		 * @param {object} result Data items
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyBindPlantTable) {
			var extModifiedData = this.extHookmatHookModifyBindPlantTable(aDataItems, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyBindInspTypTable: function(aDataItems, oResponse) {
		/**
		 * @ControllerHook To modify and bind the Plant Inspection Type table in create/change scenario
		 * Customer can modify and bind the data as per his requirements to Inspection Type table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyBindInspTypTable
		 * @param {object} result Data items
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyBindInspTypTable) {
			var extModifiedData = this.extHookmatHookModifyBindInspTypTable(aDataItems, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyBindMrpTxtTable: function(aDataItems, oResponse) {
		/**
		 * @ControllerHook To modify and bind the Plant MRP Text table in create/change scenario
		 * Customer can modify and bind the data as per his requirements to Plant MRP Text table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyBindMrpTxtTable
		 * @param {object} result Data items
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyBindMrpTxtTable) {
			var extModifiedData = this.extHookmatHookModifyBindMrpTxtTable(aDataItems, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyBindMrpAreaTable: function(aDataItems, oResponse) {
		/**
		 * @ControllerHook To modify and bind the Plant MRP Area table in create/change scenario
		 * Customer can modify and bind the data as per his requirements to Plant MRP Area table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyBindMrpAreaTable
		 * @param {object} result Data items
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyBindMrpAreaTable) {
			var extModifiedData = this.extHookmatHookModifyBindMrpAreaTable(aDataItems, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyBindPrdVerTable: function(aDataItems, oResponse) {
		/**
		 * @ControllerHook To modify and bind the Plant Production version table in create/change scenario
		 * Customer can modify and bind the data as per his requirements to Plant Production version table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyBindPrdVerTable
		 * @param {object} result Data items
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyBindPrdVerTable) {
			var extModifiedData = this.extHookmatHookModifyBindPrdVerTable(aDataItems, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyBindStrgLocTable: function(aDataItems, oResponse) {
		/**
		 * @ControllerHook To modify and bind the Plant Production version table in create/change scenario
		 * Customer can modify and bind the data as per his requirements to Plant Production version table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyBindStrgLocTable
		 * @param {object} result Data items
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyBindStrgLocTable) {
			var extModifiedData = this.extHookmatHookModifyBindStrgLocTable(aDataItems, oResponse);
			return extModifiedData;
		}
	},
	matHookModifyhidePlantS4Title: function(vPanel) {
		/**
		 * @ControllerHook To modify and bind the Plant Production version table in create/change scenario
		 * Customer can modify and bind the data as per his requirements to Plant Production version table
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyhidePlantS4Title
		 * @param {object} result Panel id
		 */
		if (this.extHookmatHookModifyhidePlantS4Title) {
			this.extHookmatHookModifyhidePlantS4Title(vPanel);
		}
	},
	matHookhidePlantQMPanelSection: function() {
		/**
		 * @ControllerHook To hide QM panel sections in plant details screen
		 * Customer can hide QM panel section in plant details screen
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookhidePlantQMPanelSection
		 * @return {string}
		 */
		if (this.extHookmatHookhidePlantQMPanelSection) {
			this.extHookmatHookhidePlantQMPanelSection();
			return true;
		} else {
			return false;
		}
	},
	matHookhidePlantFRPanelSection: function() {
		/**
		 * @ControllerHook To hide Forecasting panel sections in plant details screen
		 * Customer can hide Forecasting panel section in plant details screen
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookhidePlantFRPanelSection
		 * @return {string}
		 */
		if (this.extHookmatHookhidePlantFRPanelSection) {
			this.extHookmatHookhidePlantFRPanelSection();
			return true;
		} else {
			return false;
		}
	},
	matHookhidePlantWSPanelSection: function() {
		/**
		 * @ControllerHook To hide Work scheduling panel sections in plant details screen
		 * Customer can hide Work scheduling panel section in plant details screen
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookhidePlantWSPanelSection
		 * @return {string}
		 */
		if (this.extHookmatHookhidePlantWSPanelSection) {
			this.extHookmatHookhidePlantWSPanelSection();
			return true;
		} else {
			return false;
		}
	},
	matHookhidePlantMRPPanelSection: function() {
		/**
		 * @ControllerHook To hide MRP panel sections in plant details screen
		 * Customer can hide MRP panel section in plant details screen
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookhidePlantMRPPanelSection
		 * @return {string}
		 */
		if (this.extHookmatHookhidePlantMRPPanelSection) {
			this.extHookmatHookhidePlantMRPPanelSection();
			return true;
		} else {
			return false;
		}
	},
	matHookhidePlantStrCstPanelSection: function() {
		/**
		 * @ControllerHook To hide Costing and Storage panel sections in plant details screen
		 * Customer can hide Costing and Storage panel section in plant details screen
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookhidePlantStrCstPanelSection
		 * @return {string}
		 */
		if (this.extHookmatHookhidePlantStrCstPanelSection) {
			this.extHookmatHookhidePlantStrCstPanelSection();
			return true;
		} else {
			return false;
		}
	},
	matHookhidePlantGnrlDataSection: function() {
		/**
		 * @ControllerHook To hide General data sections in plant details screen
		 * Customer can hide General data section in plant details screen
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookhidePlantGnrlDataSection
		 * @return {string}
		 */
		if (this.extHookmatHookhidePlantGnrlDataSection) {
			this.extHookmatHookhidePlantGnrlDataSection();
			return true;
		} else {
			return false;
		}
	},
	matHookhidePlantValCostingSection: function() {
		/**
		 * @ControllerHook To hide General data sections in plant details screen
		 * Customer can hide General data section in plant details screen
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookhidePlantValCostingSection
		 * @return {string}
		 */
		if (this.extHookmatHookhidePlantValCostingSection) {
			this.extHookmatHookhidePlantValCostingSection();
			return true;
		} else {
			return false;
		}
	},
	matHookModifyPlantChngPanelData: function(vPanel, oView, oResponse) {
		/**
		 * @ControllerHook To modify the query for general data change scenario and modify the response
		 * Customer can modify the data as per his requirements before loading the layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyPlantChngPanelData
		 * @param {object} result Panel
		 * @param {object} result View
		 * @param {object} result Response
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyPlantChngPanelData) {
			var extModifiedData = this.extHookmatHookModifyPlantChngPanelData(vPanel, oView, oResponse);
			return extModifiedData;
		}
	},
	matHookgetMARASalesResults: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetMARASalesResults
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetMARASalesResults) {
			var extModifiedData = this.extHookmatHookgetMARASalesResults(oItems);
			return extModifiedData;
		}
	},
	matHookchangeMatSalesTextTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookchangeMatSalesTextTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookchangeMatSalesTextTableTemplate) {
			var extModifiedData = this.extHookmatHookchangeMatSalesTextTableTemplate(oItems);
			return extModifiedData;
		}
	},

	matHookchangeMatSalesTableTemplate: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookchangeMatSalesTableTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookchangeMatSalesTableTemplate) {
			var extModifiedData = this.extHookmatHookchangeMatSalesTableTemplate(oItems);
			return extModifiedData;
		}
	},
	matHookgetChangeDisbChainResults: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetChangeDisbChainResults
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetChangeDisbChainResults) {
			var extModifiedData = this.extHookmatHookgetChangeDisbChainResults(oItems);
			return extModifiedData;
		}
	},
	matHookgetChangeSalesTaxResults: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetChangeSalesTaxResults
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetChangeSalesTaxResults) {
			var extModifiedData = this.extHookmatHookgetChangeSalesTaxResults(oItems);
			return extModifiedData;
		}
	},
	matHookgetChangeSalesTextResults: function(oItems) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookgetChangeSalesTextResults
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookgetChangeSalesTextResults) {
			var extModifiedData = this.extHookmatHookgetChangeSalesTextResults(oItems);
			return extModifiedData;
		}
	},
	matHookModifyMatAsyncQueryCall: function(sQuery1) {
		/**
		 * @ControllerHook To modify the Asynchronus query all tab data and modify the response
		 * Customer can modify the data as per his requirements before tapping on other tabs than General
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatAsyncQueryCall
		 * @param {object} result Query
		 * @return {object} result Modified query
		 */
		if (this.extHookmatHookModifyMatAsyncQueryCall) {
			var extModifiedData = this.extHookmatHookModifyMatAsyncQueryCall(sQuery1);
			return extModifiedData;
		}
	},
	matHookModifyMatAsyncSalesChBatchCall: function(oModel,sSalesquery,sSalesDisbquery,sSalesTaxQuery,sSalesTextQuery,aBatchOprtn) {
		/**
		 * @ControllerHook To modify the Asynchronous call query for Sales change scenario and modify the response
		 * Customer can modify the buffered data as per his requirements before loading the Sales change layouts and bindging the data
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyMatAsyncSalesChBatchCall
		 * @param {object} result Model
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result Query
		 * @param {object} result array of batch operation
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookModifyMatAsyncSalesChBatchCall) {
			var extModifiedData = this.extHookmatHookModifyMatAsyncSalesChBatchCall(oModel,sSalesquery,sSalesDisbquery,sSalesTaxQuery,sSalesTextQuery,aBatchOprtn);
			return extModifiedData;
		}
	},
	matHookChangePrdVrsnTemplate: function(oItems,oModel) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookChangePrdVrsnTemplate
		 * @param {object} result Holds data
		 * @param {object} result Model
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookChangePrdVrsnTemplate) {
			var extModifiedData = this.extHookmatHookChangePrdVrsnTemplate(oItems,oModel);
			return extModifiedData;
		}
	},
	matHookChangeMrpAreaTemplate: function(oItems,oModel) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookChangeMrpAreaTemplate
		 * @param {object} result Holds data
		 * @param {object} result Model
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookChangeMrpAreaTemplate) {
			var extModifiedData = this.extHookmatHookChangeMrpAreaTemplate(oItems,oModel);
			return extModifiedData;
		}
	},
	matHookChangeMrpTxtTemplate: function(oItems,oModel) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookChangeMrpTxtTemplate
		 * @param {object} result Holds data
		 * @param {object} result Model
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookChangeMrpTxtTemplate) {
			var extModifiedData = this.extHookmatHookChangeMrpTxtTemplate(oItems,oModel);
			return extModifiedData;
		}
	},
	matHookChangeInspctnTemplate: function(oItems,oModel) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookChangeInspctnTemplate
		 * @param {object} result Holds data
		 * @param {object} result Model
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookChangeInspctnTemplate) {
			var extModifiedData = this.extHookmatHookChangeInspctnTemplate(oItems,oModel);
			return extModifiedData;
		}
	},
	matHookChangeStrgLocTemplate: function(oItems,oModel) {
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookChangeStrgLocTemplate
		 * @param {object} result Holds data
		 * @param {object} result Model
		 * @return {object} result Modified Data
		 */
		if (this.extHookmatHookChangeStrgLocTemplate) {
			var extModifiedData = this.extHookmatHookChangeStrgLocTemplate(oItems,oModel);
			return extModifiedData;
		}
	},
});