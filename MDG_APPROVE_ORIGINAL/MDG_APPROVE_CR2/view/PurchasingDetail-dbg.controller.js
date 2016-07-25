/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//Controller for the companyCode detail page. The respective CompanyCode detail page will be loaded when the user clicks on the CompanyCode in the detail page.
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange");
sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.PurchasingDetail", {
	compCode: "",
	oItemTemp: "",
	oCompCodeDetails: "",
	oSalesDetail: "",
	bindingContext: "",
	sPath: "",
	oS3Instance: "",
	subheader: "",
	extHooknavtoDetail: null,
	extHookModifyStyleClass: null,
	extHookWithhldTable: null,
	extHookDunningTable: null,
	extHookdisplayCompCodedata: null,
	changerequestId: "",

	onInit: function() {
		//Remove Style Class
		var sStyleClass = "text_bold";
		this.getView().byId("PurchasingPage").removeStyleClass(sStyleClass);

		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("PurchasingPage").setShowNavButton(true);
		this.oRouter.attachRouteMatched(function(oEvent) {

			if (oEvent.getParameter("name") === "Purchase") {

				this.oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();
				var aDecisions = this.oS3Instance.getDecisions();
				this.oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				var args = oEvent.getParameter("arguments");
				this.CompCode = args.Key;
				this.changerequestId = args.ChangeRequestID;
				this.contextPath = args.contextPath;
				var result = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();

				fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setRouter(this.oRouter);
				fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setContextPath(this.changerequestId);
				fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setChangeRequest(this.contextPath);

				this.result = result;
				
				//Handling of the Fragments...Since the same fragment is being used for both the detail page and display of the single CompanyCode record in create scenario the fragment is destroyed initially. 
				if (this.oS3Instance.oPurchaseCreateForm !== "") {
					this.oS3Instance.oPurchaseCreateForm.destroy();
				}

				if (this.oS3Instance.oPurchaseDetail === "" || this.oS3Instance.oPurchaseDetail === undefined) {
					this.oS3Instance.oPurchaseDetail = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.PurchasingDetail', fcg.mdg.approvecrv2.util.Formatter);
				} else {
					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("FormPurchase").removeContent(this.oS3Instance.oPurchaseDetail);
					if (this.oS3Instance.oPurchaseDetail !== undefined) {
						this.oS3Instance.oPurchaseDetail.destroy();
					}
					this.oS3Instance.oPurchaseDetail = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.PurchasingDetail', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("FormPurchase").addContent(this.oS3Instance.oPurchaseDetail);
				this.displayPurchasedata(result);
			}

		}, this);
	},

	//Table for sub-Range which involves 2 colums Sub Range and Plant information
	getSubrangeTemplate: function(oModel) {
		var oItemsubrange = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [new sap.m.Text({
				text: {
					path: "SubrangeDesc",
					formatter: function() {
						var desc = oModel.getProperty("SubrangeDesc", this.getBindingContext());
						if (desc !== "|#-#|" && desc !== "|#|") {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBoldingSubrange(this, oModel);
							return desc;
						} else
							return "";
					}
				}
			}), new sap.m.Text({
				text: {
					path: "Plant",
					formatter: function() {
						var desc = oModel.getProperty("Plant", this.getBindingContext());
						if (desc !== "|#-#|" && desc !== "|#|") {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBoldingSubrange(this, oModel);
							return desc;
						} else
							return "";
					}
				}
			})]
		});
		return oItemsubrange;
	},

	//Table template for the partner function table. Which involves columns:Parner Function,Same Partner,Parner and Default Partner along with the key and description.
	getPartnerFuncTemplate: function(oModel) {
		var oThis = this;
		var oItemTempPf = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "PARVW__TXT",
						formatter: function() {
							var desc = oModel.getProperty("PARVW__TXT", this.getBindingContext());
							var key = oModel.getProperty("PARVW", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "PARVW");
							return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "REFLEXIVE__TXT",
						formatter: function() {
							var desc = oModel.getProperty("REFLEXIVE__TXT", this.getBindingContext());
							if (desc !== "") {
								fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "REFLEXIVE");
								return desc;
							} else {
								fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "REFLEXIVE");
								return oThis.getView().getModel("i18n").getProperty("PC_NO");
							}
						}

					}
				}),

				new sap.m.Text({
					text: {
						path: "LIFN2__TXT",
						formatter: function() {
							var desc = oModel.getProperty("LIFN2__TXT", this.getBindingContext());
							var key = oModel.getProperty("LIFN2", this.getBindingContext());
							if (desc !== "" && key !== "") {
								fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "LIFN2");
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
							var KunnDesc = oModel.getProperty("KUNN2__TXT", this.getBindingContext());
							var KunnKey = oModel.getProperty("KUNN2", this.getBindingContext());
							if ((KunnKey !== "" && KunnKey !== undefined) && KunnDesc !== "") {
								fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "KUNN2");
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(KunnKey, KunnDesc);
							}
							var contactdesc = oModel.getProperty("PARNR__TXT", this.getBindingContext());
							var contactkey = oModel.getProperty("PARNR", this.getBindingContext());
							if (contactdesc !== "" && (contactkey !== "" && contactkey !== undefined)) {
								fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "PARNR");
								return fcg.mdg.approvecrv2.util.Formatter.descriptionWithRemoveZeros(contactkey, contactdesc);
							}
							var personaldesc = oModel.getProperty("PERNR__TXT", this.getBindingContext());
							var personalnum = oModel.getProperty("PERNR", this.getBindingContext());
							if ((personalnum !== "" && personalnum !== undefined) && personaldesc !== "") {
								personalnum = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(personalnum);
								fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "PERNR");
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(personalnum, personaldesc);
							}
						}

					}
				}),

				new sap.m.Text({
					text: {
						path: "DEFPA__TXT",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "DEFPA");
							return oModel.getProperty("DEFPA__TXT", this.getBindingContext());
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "LTSNR__TXT",
						formatter: function() {
							var desc = oModel.getProperty("LTSNR__TXT", this.getBindingContext());
							var key = oModel.getProperty("LTSNR", this.getBindingContext());
							if (key !== "|#-#|" && key !== "|#|") {
								fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "LTSNR");
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							} else if (desc !== "|#-#|") {
								fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "LTSNR");
								return desc;
							} else
								return "";
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "WERKS__TXT",
						formatter: function() {
							var desc = oModel.getProperty("WERKS__TXT", this.getBindingContext());
							var key = oModel.getProperty("WERKS", this.getBindingContext());
							if (key !== "|#|") {
								fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "WERKS");
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							} else {
								fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "WERKS");
								return desc;
							}
						}

					}
				})
			]
		});
		return oItemTempPf;
	},

	navtoSubRangeDetail: function(oEvent) {
		this.bindingContext = oEvent.getSource("listItem").getBindingContext();
		if (this.bindingContext !== undefined) {
			this.sPath = oEvent.getSource("listItem").getBindingContext().sPath;
		} else {
			this.bindingContext = oEvent.getParameter("listItem").getBindingContext();
			this.sPath = oEvent.getParameter("listItem").getBindingContext().sPath;
		}
		var aPath = "";
		aPath = this.sPath.split("/");
		var entityData = this.bindingContext.oModel.oData.dataitems[aPath[2]];

		this.result = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();
		fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(this.result);
		this.oRouter = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getRouter();
		this.changerequestId = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getchangeRequest();
		this.contextPath = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getContextPath();

		this.oRouter.navTo("SubRange", {
			ChangeRequestID: this.changerequestId,
			contextPath: this.contextPath,
			Key: entityData.Key
		});
	},
	//CompanyCode fragment is being loaded if the CompanyCode id matches the CompanyCode which the user has clicked.Here the CompanyCode id is the combination of the assignment id and the CompanyCode id
	displayPurchasedata: function(result) {
		var vElement = "";
		var oModel = "";
		var strResults = "";
		var k = "";
		var assignmntid = "";
		var oDataItems = "";
		var ChangeData = "";
		var accgrp = "";
		for (var i = 0; i < result.results.length; i++) {
			//Setting of the header in case of multiple ERP customers exists.
			if (result.results.length > 1) {
				if (result.results[i].SP_AssignedSupplierRel !== undefined && result.results[i].SP_AssignedSupplierRel.KTOKK !== undefined && result.results[
					i].SP_AssignedSupplierRel.KTOKK__TXT !== undefined) {
					accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(result.results[i].SP_AssignedSupplierRel.KTOKK, result.results[i].SP_AssignedSupplierRel
						.KTOKK__TXT);
				}
				this.subheader = fcg.mdg.approvecrv2.DomainSpecParts.SupplierCreate.getSubheaderWithAccGrp(result.results[i].STANDARD, result.results[
						i].OBJECT_ID__TXT,
					result.results[i].REASON_ID__TXT, accgrp);
			} else {
				this.subheader = "";
			}

			for (var j = 0; j < result.results[i].SP_AssignedPurchasingOrgsRel.results.length; j++) {
				var oAssignedPurchaseOrg = result.results[i].SP_AssignedPurchasingOrgsRel.results[j];

				var key = oAssignedPurchaseOrg.ASSIGNMENT_ID + oAssignedPurchaseOrg.EKORG;
				if (key === this.CompCode) {
					var purchaseorg = this.getView().getModel("i18n").getProperty("SP_purchorg") + ": " + oAssignedPurchaseOrg.EKORG__TXT + "(" +
						oAssignedPurchaseOrg.EKORG + ")";
					this.getView().byId("PurchaseObjHeaderDet").setTitle(purchaseorg);
					var bpdesc = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
					this.getView().byId("purchasebpdesc").setText(bpdesc);
					this.getView().byId("erpVendPurchase").setText(this.subheader);

					var FinalResult = result.results[i].SP_AssignedPurchasingOrgsRel.results[j];
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(FinalResult);
					vElement = sap.ui.getCore().byId("SimpleFormPurchase");
					vElement.setModel(oModel);

					//Bolding of the changed data is done for both the label and the texts.
					if (oAssignedPurchaseOrg.ChangeData.results !== undefined) {
						if (oAssignedPurchaseOrg.ChangeData.results.length > 0) {
							var sStyleClass = "text_bold";

							for (var l = 0; l < oAssignedPurchaseOrg.ChangeData.results.length; l++) {
								var sLabelName = "lblPur" + oAssignedPurchaseOrg.ChangeData.results[l].Attribute;
								var oLblIns = sap.ui.getCore().byId(sLabelName);
								if (oLblIns !== undefined) {
									oLblIns.setDesign("Bold");
								}
								var sTextName = "pur" + oAssignedPurchaseOrg.ChangeData.results[l].Attribute;
								if (sap.ui.getCore().byId(sTextName) !== undefined) {
									sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
								}
							}
						}
					}

					//Hiding of the sections in case no values are being maintained for all the texts in the sections.
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.hidePurchaseSection();
					
					//Hiding of the redundant Company Code information.
					var vElementcompCodelbl = sap.ui.getCore().byId("lblSuppPurchdEKORG");
					vElementcompCodelbl.setVisible(false);
					var vElementerpcustlbl = sap.ui.getCore().byId("lblSuppPurchdVendor");
					vElementerpcustlbl.setVisible(false);
					var vElementCompcode = sap.ui.getCore().byId("SuppPurchdEKORG");
					vElementCompcode.setVisible(false);

					//Binding of the partner function details to the table for matching sales organization details. Else the section  is hidden.
					if (oAssignedPurchaseOrg.SP_PurchOrgPartnerFunctionsRel.results !== undefined && oAssignedPurchaseOrg.SP_PurchOrgPartnerFunctionsRel.results
						.length > 0) {
						strResults = oAssignedPurchaseOrg.SP_PurchOrgPartnerFunctionsRel;
						oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
						oModel.setData(strResults);
						vElement = sap.ui.getCore().byId("supppartnerfunc");
						vElement.setVisible(true);
						vElement.setModel(oModel);
						this.oItemTempPf = this.getPartnerFuncTemplate(oModel);
						vElement.bindItems("/results", this.oItemTempPf);
					} else {
						sap.ui.getCore().byId("supppartnerfunc").setVisible(false);
					}

					//Binding of the Sub Range Table
					if (oAssignedPurchaseOrg.SP_PurchOrgPurchasingOrg2Rel.results !== undefined && oAssignedPurchaseOrg.SP_PurchOrgPurchasingOrg2Rel.results
						.length > 0) {
						strResults = {
							dataitems: [],
							ChangeData: []
						};
						for (k = 0; k < oAssignedPurchaseOrg.SP_PurchOrgPurchasingOrg2Rel.results.length; k++) {
							var oSubranges = oAssignedPurchaseOrg.SP_PurchOrgPurchasingOrg2Rel.results[k];
							var plant = oSubranges.WERKS;
							var plant_desc = oSubranges.WERKS__TXT;

							var subrange = oSubranges.LTSNR;
							var finalSubrange = "";
							var subrangeDeleted = false;
							if (oSubranges.LTSNR !== '|#-#|' && oSubranges.LTSNR !== '') {
								finalSubrange = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oSubranges.LTSNR, oSubranges.LTSNR__TXT);
							}

							if (oSubranges.ChangeData !== undefined && oSubranges.ChangeData.results !== undefined) {
								for (var s = 0; s < oSubranges.ChangeData.results.length; s++) {
									if (oSubranges.ChangeData.results[s].EntityAction === "D") {
										subrangeDeleted = true;
									}
								}
							}

							var finalPlant = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(plant, plant_desc);
							assignmntid = oSubranges.ASSIGNMENT_ID;
							oDataItems = {
								"SubrangeDesc": finalSubrange,
								"Plant": finalPlant,
								"Key": assignmntid + oSubranges.EKORG + subrange + plant,
								"SubrangeDeleted": subrangeDeleted
							};
							strResults.dataitems.push(oDataItems);
							
							if (oSubranges.ChangeData.results !== undefined && oSubranges.ChangeData.results.length > 0) {
								ChangeData = {
									"changeId": assignmntid + oSubranges.EKORG + subrange + plant
								};
								strResults.ChangeData.push(ChangeData);
							}
						}
						oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
						oModel.setData(strResults);
						vElement = this.getView().byId("suppsubrangetable");
						vElement.setVisible(true);
						vElement.setModel(oModel);
						this.oSubrangeTemplate = this.getSubrangeTemplate(oModel);
						this.oSubrangeTemplate.attachPress({
							Entity: "SubRange", 
							Key: strResults.dataitems,
							EntityData: result
						}, this.navtoSubRangeDetail);
						vElement.bindItems("/dataitems", this.oSubrangeTemplate);
						vElement.setVisible(true);
					} else {
						this.getView().byId("suppsubrangetable").setVisible(false);
					}
				}
			}

		}
	}
});