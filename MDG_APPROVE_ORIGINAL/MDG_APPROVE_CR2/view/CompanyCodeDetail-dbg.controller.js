/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//Controller for the companyCode detail page. The respective CompanyCode detail page will be loaded when the user clicks on the CompanyCode in the detail page.

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange");
sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.CompanyCodeDetail", {
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
		var aDecisions = "";
		var args = "";
		var result = "";
		var sStyleClass = "text_bold";
		this.getView().byId("companyCodePage").removeStyleClass(sStyleClass);

		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("companyCodePage").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "CompCode") {

				this.oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getS3Instance();
				aDecisions = this.oS3Instance.getDecisions();
				this.oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				args = oEvent.getParameter("arguments");
				this.CompCode = args.Key;
				this.changerequestId = args.ChangeRequestID;
				this.contextPath = args.contextPath;
				result = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();

				fcg.mdg.approvecrv2.DomainSpecParts.Customer.setRouter(this.oRouter);
				fcg.mdg.approvecrv2.DomainSpecParts.Customer.setContextPath(this.changerequestId);
				fcg.mdg.approvecrv2.DomainSpecParts.Customer.setChangeRequest(this.contextPath);

				this.result = result;

				//				Handling of the Fragments...Since the same fragment is being used for both the detail page and display of the single CompanyCode record in create scenario the fragment is destroyed initially. 
				if (this.oS3Instance.oCompCodeCreateForm !== "") {
					this.oS3Instance.oCompCodeCreateForm.destroy();
				}

				if (this.oS3Instance.oCompCodeDetails === "") {
					this.oS3Instance.oCompCodeDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CompanyCodeDetail', fcg.mdg.approvecrv2.util.Formatter);
					if (this.oS3Instance.oSuppCompCodeDetails !== undefined) {
						this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oSuppCompCodeDetails);
					}
				} else {

					if (this.oS3Instance.oSuppCompCodeDetails !== undefined) {
						this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oSuppCompCodeDetails);
					}

					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oCompCodeDetails);
					if (this.oS3Instance.oCompCodeDetails !== undefined) {
						this.oS3Instance.oCompCodeDetails.destroy();
					}
					this.oS3Instance.oCompCodeDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CompanyCodeDetail', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("CompCodeForm").addContent(this.oS3Instance.oCompCodeDetails);
				this.displayCompCodedata(result);
				/**
				 * @ControllerHook To modify and bind the results of the OData service
				 * Customer can modify the data as per his requirements before binding it to a form or Table
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookdisplayCompCodedata
				 * @param {object} result holds the data
				 * @return { } Launches the page
				 */
				if (this.extHookdisplayCompCodedata) {
					this.extHookdisplayCompCodedata(result);
				}
			}
			//Supplier
			if (oEvent.getParameter("name") === "SuppCompCode") {

				this.oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();
				aDecisions = this.oS3Instance.getDecisions();
				this.oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				args = oEvent.getParameter("arguments");
				this.CompCode = args.Key;
				this.changerequestId = args.ChangeRequestID;
				this.contextPath = args.contextPath;
				result = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();

				fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setRouter(this.oRouter);
				fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setContextPath(this.changerequestId);
				fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setChangeRequest(this.contextPath);

				this.result = result;

				//				Handling of the Fragments...Since the same fragment is being used for both the detail page and display of the single CompanyCode record in create scenario the fragment is destroyed initially. 
				if (this.oS3Instance.oSuppCompCodeCreateForm !== "") {
					this.oS3Instance.oSuppCompCodeCreateForm.destroy();
				}

				if (this.oS3Instance.oSuppCompCodeDetails === "") {
					this.oS3Instance.oSuppCompCodeDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SupplierCompanyCodeDetail', fcg.mdg.approvecrv2
						.util.Formatter);
					if (this.oS3Instance.oCompCodeDetails !== undefined) {
						this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oCompCodeDetails);
					}
				} else {
					if (this.oS3Instance.oCompCodeDetails !== undefined) {
						this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oCompCodeDetails);
					}

					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oSuppCompCodeDetails);
					if (this.oS3Instance.oSuppCompCodeDetails !== undefined) {
						this.oS3Instance.oSuppCompCodeDetails.destroy();
					}
					this.oS3Instance.oSuppCompCodeDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SupplierCompanyCodeDetail', fcg.mdg.approvecrv2
						.util.Formatter);
				}
				this.getView().byId("CompCodeForm").addContent(this.oS3Instance.oSuppCompCodeDetails);
				this.displaySuppCompCodedata(result);

			}

		}, this);
	},

	//	Dunning Table Template. All the dunning areas inside the CompanyCode are shown in the form of table and navigation is provided to the respective detail screen.
	//Table cell bolding in case of change scenario is achieved by the formatter used in the template.
	getDunningTemplate: function(oModel) {
		var oItemTempComp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "Id",
						formatter: function() {
							var vDunningAreaDeleted = oModel.getProperty("DunningAreaDeleted", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBoldingDunningTax(this, oModel, "MABER");
							if (vDunningAreaDeleted) {
								this.addStyleClass("sapThemeText");
							}
							return oModel.getProperty("Id", this.getBindingContext());
						}
					}
				})
			]
		});
		/**
		 * @ControllerHook Hook For Extending Dunning Table Template
		 * Description on Controller Hook usage here.
		 * This method is called when there are any enhancements for table with additional Columns
		 * The hook must be documented like:
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenControllerr~extHookDunningTable
		 * @param {object} oModel
		 * @return {object} oItemTempComp
		 */
		if (this.extHookDunningTable) { // check whether any extension has implemented the hook...
			oItemTempComp = this.extHookDunningTable(oModel); // ...and call it
		}

		return oItemTempComp;
	},

	//Withholding Tax detail template. All the Withholding taxes under the CompanyCodes are shown in the form of table along with their description.
	getWithTaxTemplate: function(oModel) {
		var oItemTempTax = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "Id",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBoldingDunningTax(this, oModel, "WITHT");
							return oModel.getProperty("Id", this.getBindingContext());
						}
					}
				})
			]
		});
		/**
		 * @ControllerHook Hook For Extending Withholding Tax Table Template
		 * Description on Controller Hook usage here.
		 * This method is called when there are any enhancements for table with additional Columns
		 * The hook must be documented like:
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenControllerr~extHookWithhldTable
		 * @param {object} oModel
		 * @return {object} oItemTempTax
		 */
		if (this.extHookWithhldTable) { // check whether any extension has implemented the hook...
			oItemTempTax = this.extHookWithhldTable(oModel); // ...and call it
		}

		return oItemTempTax;
	},

	navtoSuppDunningDetail: function(oEvent, Entitydata) {
		this.result = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();
		fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(this.result);
		this.oRouter = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getRouter();
		this.changerequestId = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getchangeRequest();
		this.contextPath = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getContextPath();

		if (Entitydata.Dunning !== "" && Entitydata.withhld === "") {
			this.oRouter.navTo("SuppDunning", {
				ChangeRequestID: this.changerequestId,
				contextPath: this.contextPath,
				Key: Entitydata.Dunning
			});
		}

		if (Entitydata.Dunning === "" && Entitydata.withhld !== "") {
			this.oRouter.navTo("SuppWithhldtax", {
				ChangeRequestID: this.changerequestId,
				contextPath: this.contextPath,
				Key: Entitydata.withhld
			});
		}
	},

	//Navigation to respective level 1 sub detail page is handled here based in the dunnig id and withholding tax id.Here the aPath will return the row which the user has selected
	navtoDunningDetail: function(oEvent) {
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

		if (entityData.Entity === "Supp") {
			this.navtoSuppDunningDetail(oEvent, entityData);

		} else {
			this.result = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();
			fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(this.result);
			this.oRouter = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getRouter();
			this.changerequestId = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getchangeRequest();
			this.contextPath = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getContextPath();

			if (entityData.Dunning !== "" && entityData.withhld === "") {
				this.oRouter.navTo("Dunning", {
					ChangeRequestID: this.changerequestId,
					contextPath: this.contextPath,
					Key: entityData.Dunning
				});
			}

			if (entityData.Dunning === "" && entityData.withhld !== "") {
				this.oRouter.navTo("Withhldtax", {
					ChangeRequestID: this.changerequestId,
					contextPath: this.contextPath,
					Key: entityData.withhld
				});
			}
		}
		/**
		 * @ControllerHook To Navigate to any other Level2 SubDetail page
		 * Customer can modify the navigation to any other route
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHooknavtoDetail
		 * @param {object} Entity Data
		 * @param {object} Path of the Event
		 * @return { } Navigates to the new route
		 */
		if (this.extHooknavtoDetail) {
			this.extHooknavtoDetail(entityData, aPath);
		}
	},

	navtoExtTaxDetail: function(oEvent) {
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

		this.result = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();
		fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(this.result);
		this.oRouter = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getRouter();
		this.changerequestId = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getchangeRequest();
		this.contextPath = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getContextPath();

		if (entityData.Dunning === "" && entityData.withhld !== "" && entityData.Entity === "Supp") {
			this.oRouter = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getRouter();
			this.changerequestId = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getchangeRequest();
			this.contextPath = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getContextPath();
			this.oRouter.navTo("SuppWithhldtax", {
				ChangeRequestID: this.changerequestId,
				contextPath: this.contextPath,
				Key: entityData.withhld
			});
		} else {
			this.oRouter.navTo("Withhldtax", {
				ChangeRequestID: this.changerequestId,
				contextPath: this.contextPath,
				Key: entityData.withhld
			});
		}
	},

	//CompanyCode fragment is being loaded if the CompanyCode id matches the CompanyCode which the user has clicked. Here the CompanyCode id is the combination of the assignment id and the CompanyCode id. 
	displayCompCodedata: function(result) {
		var vElement = "";
		var oModel = "";
		var strResults = "";
		var k = "";
		var assignmntid = "";
		var oDataItems = "";
		var ChangeData = "";
		for (var i = 0; i < result.results.length; i++) {
			//Setting of the header in case of multiple ERP customers exists.
			if (result.results.length > 1) {
				var accgrp = "";
				if (!this.isNull(result.results[i].CU_AssignedCustomerRel)) {
					var custRel = result.results[i].CU_AssignedCustomerRel;
					if (!this.isNull(custRel.KTOKD) && !this.isNull(custRel.KTOKD__TXT)) {
						accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(custRel.KTOKD, custRel.KTOKD__TXT);
					}
				}
				this.subheader = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getSubheaderWithAccGrp(result.results[i].STANDARD, result.results[
					i].OBJECT_ID__TXT, result.results[i].REASON_ID__TXT, accgrp);
			} else {
				this.subheader = "";
			}

			for (var j = 0; j < result.results[i].CU_AssignedCompanyCodesRel.results.length; j++) {
				var oAssignedCompCodes = result.results[i].CU_AssignedCompanyCodesRel.results[j];

				var key = oAssignedCompCodes.ASSIGNMENT_ID + oAssignedCompCodes.BUKRS;
				if (key === this.CompCode) {
					var compCode = this.getView().getModel("i18n").getProperty("GL_COMP_CODE") + ": " + oAssignedCompCodes.BUKRS__TXT + "(" +
						oAssignedCompCodes.BUKRS + ")";
					this.getView().byId("ccObjHeaderDet").setTitle(compCode);
					var bpdesc = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
					this.getView().byId("bpdesc").setText(bpdesc);
					this.getView().byId("erpCustCompCode").setText(this.subheader);

					var FinalResult = result.results[i].CU_AssignedCompanyCodesRel.results[j];
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(FinalResult);
					vElement = sap.ui.getCore().byId("SimpleFormCompcode");
					vElement.setModel(oModel);

					//Bolding of the changed data is done for both the label and the texts.
					if (oAssignedCompCodes.ChangeData.results !== undefined) {
						if (oAssignedCompCodes.ChangeData.results.length > 0) {
							var sStyleClass = "text_bold";
							/**
							 * @ControllerHook To modify the style class
							 * Customer can modify the style class to influence text fields
							 * the format of data shown in this description table
							 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyStyleClass
							 * @param {string} sStyleClass style class
							 * @return {string} sStyleClass modified style class
							 */
							if (this.extHookModifyStyleClass) {
								var sNewStyleClass = this.extHookModifyStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
								if (sNewStyleClass !== undefined) {
									sStyleClass = sNewStyleClass;
								}
							}

							for (var l = 0; l < oAssignedCompCodes.ChangeData.results.length; l++) {
								var sLabelName = "lbl" + oAssignedCompCodes.ChangeData.results[l].Attribute;
								var oLblIns = sap.ui.getCore().byId(sLabelName);
								if (oLblIns !== undefined) {
									oLblIns.setDesign("Bold");
								}
								var sTextName = oAssignedCompCodes.ChangeData.results[l].Attribute;
								if (sap.ui.getCore().byId(sTextName) !== undefined) {
									sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
								}
							}
						}
					}

					//Hiding of the sections in case no values are being maintained for all the texts in the sections.
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.hideCompcodeSection();

					//Hiding of the redundant Company Code information.
					var vElementcompCodelbl = sap.ui.getCore().byId("lblcompBUKRS");
					vElementcompCodelbl.setVisible(false);
					var vElementerpcustlbl = sap.ui.getCore().byId("lblerpcust");
					vElementerpcustlbl.setVisible(false);
					var vElementCompcode = sap.ui.getCore().byId("compBUKRS");
					vElementCompcode.setVisible(false);

					//Binding of the dunning data to the table based on the matched Company Code. Otherwise the dunning table is hidden.
					if (oAssignedCompCodes.CU_CompDunningAreasRel.results !== undefined && oAssignedCompCodes.CU_CompDunningAreasRel.results.length > 0) {
						strResults = {
							dataitems: [],
							ChangeData: []
						};
						for (k = 0; k < oAssignedCompCodes.CU_CompDunningAreasRel.results.length; k++) {
							var oAssignedDunningAreas = oAssignedCompCodes.CU_CompDunningAreasRel.results[k];

							var dunningArea = oAssignedDunningAreas.MABER;
							assignmntid = oAssignedDunningAreas.ASSIGNMENT_ID;
							var dunningAreaDesc = oAssignedDunningAreas.MABER__TXT;
							var vDunningAreaDeleted = false;
							if (dunningAreaDesc === "") {
								dunningAreaDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DefaultDunning");
							}
							var dunningValue = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(dunningArea, dunningAreaDesc);
							if(oAssignedDunningAreas.ChangeData.results !== undefined){
								for (var d = 0; d < oAssignedDunningAreas.ChangeData.results.length; d++) {
									if (oAssignedDunningAreas.ChangeData.results[d].EntityAction === "D") 
										vDunningAreaDeleted = true;
								}
							}
							oDataItems = {
								"Id": dunningValue,
								"withhld": "",
								"Dunning": assignmntid + oAssignedDunningAreas.BUKRS + dunningArea,
								"DunningAreaDeleted": vDunningAreaDeleted
							};
							strResults.dataitems.push(oDataItems);

							if (oAssignedDunningAreas.ChangeData.results !== undefined && oAssignedDunningAreas.ChangeData.results.length > 0) {
								ChangeData = {
									"changeId": assignmntid + oAssignedDunningAreas.BUKRS + dunningArea
								};
								strResults.ChangeData.push(ChangeData);
							}
						}
						oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
						oModel.setData(strResults);
						vElement = this.getView().byId("DunningArea");
						vElement.setVisible(true);
						vElement.setModel(oModel);
						this.oItemTempComp = this.getDunningTemplate(oModel);
						this.oItemTempComp.attachPress({
							Entity: "Dunning", //s3Controller.compCodeResults.dataitems[i].Key
							Key: strResults.dataitems,
							EntityData: result
						}, this.navtoDunningDetail);
						vElement.bindItems("/dataitems", this.oItemTempComp);
						vElement.setVisible(true);
					} else {
						this.getView().byId("DunningArea").setVisible(false);
					}

					//Binding of the  Extended withholding Tax data to the table based on the matched Company Code. Otherwise the withholding tax  table is hidden.
					if (oAssignedCompCodes.CU_CompWithholdingTaxesRel.results !== undefined && oAssignedCompCodes.CU_CompWithholdingTaxesRel.results.length >
						0) {
						strResults = {
							dataitems: [],
							ChangeData: []
						};
						for (k = 0; k < oAssignedCompCodes.CU_CompWithholdingTaxesRel.results.length; k++) {
							var oWithholdTaxes = oAssignedCompCodes.CU_CompWithholdingTaxesRel.results[k];

							var withhldtax = oWithholdTaxes.WITHT;
							assignmntid = oWithholdTaxes.ASSIGNMENT_ID;
							var withhldtaxDesc = oWithholdTaxes.WITHT__TXT;
							var withhldValue = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(withhldtax, withhldtaxDesc);
							oDataItems = {
								"Id": withhldValue,
								"Dunning": "",
								"withhld": assignmntid + oWithholdTaxes.BUKRS + withhldtax
							};
							strResults.dataitems.push(oDataItems);
							if (oWithholdTaxes.ChangeData.results !== undefined && oWithholdTaxes.ChangeData.results.length > 0) {
								ChangeData = {
									"changeId": assignmntid + oWithholdTaxes.BUKRS + withhldtax
								};
								strResults.ChangeData.push(ChangeData);
							}
						}
						oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
						oModel.setData(strResults);
						vElement = this.getView().byId("ExtendWthhldTax");
						vElement.setVisible(true);
						vElement.setModel(oModel);
						this.oItemTempTax = this.getWithTaxTemplate(oModel);
						this.oItemTempTax.attachPress({
							Entity: "WithhldTax", //s3Controller.compCodeResults.dataitems[i].Key
							Key: strResults.dataitems,
							EntityData: result
						}, this.navtoExtTaxDetail);
						vElement.bindItems("/dataitems", this.oItemTempTax);
						vElement.setVisible(true);
					} else {
						this.getView().byId("ExtendWthhldTax").setVisible(false);
					}

				}

			}

		}
	},

	displaySuppCompCodedata: function(result) {
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

			for (var j = 0; j < result.results[i].SP_AssignedCompanyCodesRel.results.length; j++) {
				var oAssignedCompCodes = result.results[i].SP_AssignedCompanyCodesRel.results[j];

				var key = oAssignedCompCodes.ASSIGNMENT_ID + oAssignedCompCodes.BUKRS;
				if (key === this.CompCode) {
					var compCode = this.getView().getModel("i18n").getProperty("GL_COMP_CODE") + ": " + oAssignedCompCodes.BUKRS__TXT + "(" +
						oAssignedCompCodes.BUKRS + ")";
					this.getView().byId("ccObjHeaderDet").setTitle(compCode);
					var bpdesc = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
					this.getView().byId("bpdesc").setText(bpdesc);
					this.getView().byId("erpCustCompCode").setText(this.subheader);

					var FinalResult = result.results[i].SP_AssignedCompanyCodesRel.results[j];
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(FinalResult);
					vElement = sap.ui.getCore().byId("SimpleFormSupplierCompcode");
					vElement.setModel(oModel);

					//Bolding of the changed data is done for both the label and the texts.
					if (oAssignedCompCodes.ChangeData.results !== undefined) {
						if (oAssignedCompCodes.ChangeData.results.length > 0) {
							var sStyleClass = "text_bold";

							for (var l = 0; l < oAssignedCompCodes.ChangeData.results.length; l++) {
								var sLabelName = "lblSupp" + oAssignedCompCodes.ChangeData.results[l].Attribute;
								var oLblIns = sap.ui.getCore().byId(sLabelName);
								if (oLblIns !== undefined) {
									oLblIns.setDesign("Bold");
								}
								var sTextName = "Supp" + oAssignedCompCodes.ChangeData.results[l].Attribute;
								if (sap.ui.getCore().byId(sTextName) !== undefined) {
									sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
								}
							}
						}
					}

					//Hiding of the sections in case no values are being maintained for all the texts in the sections.
					fcg.mdg.approvecrv2.DomainSpecParts.Supplier.hideSuppCompcodeSection();

					//Hiding of the redundant Company Code information.
					var vElementcompCodelbl = sap.ui.getCore().byId("lblSuppcompBUKRS");
					vElementcompCodelbl.setVisible(false);
					var vElementerpcustlbl = sap.ui.getCore().byId("lblSuppCompervend");
					vElementerpcustlbl.setVisible(false);
					var vElementCompcode = sap.ui.getCore().byId("SuppcompcodeBUKRS");
					vElementCompcode.setVisible(false);

					//Binding of the dunning data to the table based on the matched Company Code. Otherwise the dunning table is hidden.
					if (oAssignedCompCodes.SP_CompDunningAreasRel.results !== undefined && oAssignedCompCodes.SP_CompDunningAreasRel.results.length > 0) {
						strResults = {
							dataitems: [],
							ChangeData: []
						};
						for (k = 0; k < oAssignedCompCodes.SP_CompDunningAreasRel.results.length; k++) {
							var oAssignedDunningAreas = oAssignedCompCodes.SP_CompDunningAreasRel.results[k];

							var dunningArea = oAssignedDunningAreas.MABER;
							assignmntid = oAssignedDunningAreas.ASSIGNMENT_ID;
							var dunningAreaDesc = oAssignedDunningAreas.MABER__TXT;
							if (dunningAreaDesc === "") {
								dunningAreaDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DefaultDunning");
							}
							var dunningValue = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(dunningArea, dunningAreaDesc);
							oDataItems = {
								"Id": dunningValue,
								"withhld": "",
								"Dunning": assignmntid + oAssignedDunningAreas.BUKRS + dunningArea,
								"Entity": "Supp"
							};
							strResults.dataitems.push(oDataItems);

							if (oAssignedDunningAreas.ChangeData.results !== undefined && oAssignedDunningAreas.ChangeData.results.length > 0) {
								ChangeData = {
									"changeId": assignmntid + oAssignedDunningAreas.BUKRS + dunningArea
								};
								strResults.ChangeData.push(ChangeData);
							}
						}
						oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
						oModel.setData(strResults);
						vElement = this.getView().byId("DunningArea");
						vElement.setVisible(true);
						vElement.setModel(oModel);
						this.oItemTempComp = this.getDunningTemplate(oModel);
						vElement.bindItems("/dataitems", this.oItemTempComp);
						vElement.setVisible(true);
					} else {
						this.getView().byId("DunningArea").setVisible(false);
					}

					//Binding of the  Extended withholding Tax data to the table based on the matched Company Code. Otherwise the withholding tax  table is hidden.
					if (oAssignedCompCodes.SP_CompWithholdingTaxesRel.results !== undefined && oAssignedCompCodes.SP_CompWithholdingTaxesRel.results.length >
						0) {
						strResults = {
							dataitems: [],
							ChangeData: []
						};
						for (k = 0; k < oAssignedCompCodes.SP_CompWithholdingTaxesRel.results.length; k++) {
							var oWithholdTaxes = oAssignedCompCodes.SP_CompWithholdingTaxesRel.results[k];

							var withhldtax = oWithholdTaxes.WITHT;
							assignmntid = oWithholdTaxes.ASSIGNMENT_ID;
							var withhldtaxDesc = oWithholdTaxes.WITHT__TXT;
							var withhldValue = fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange.getValue(withhldtax, withhldtaxDesc);
							oDataItems = {
								"Id": withhldValue,
								"Entity": "Supp",
								"Dunning": "",
								"withhld": assignmntid + oWithholdTaxes.BUKRS + withhldtax
							};
							strResults.dataitems.push(oDataItems);
							if (oWithholdTaxes.ChangeData.results !== undefined && oWithholdTaxes.ChangeData.results.length > 0) {
								ChangeData = {
									"changeId": assignmntid + oWithholdTaxes.BUKRS + withhldtax
								};
								strResults.ChangeData.push(ChangeData);
							}
						}
						oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
						oModel.setData(strResults);
						vElement = this.getView().byId("ExtendWthhldTax");
						vElement.setVisible(true);
						vElement.setModel(oModel);
						this.oItemTempTax = this.getWithTaxTemplate(oModel);
						this.oItemTempTax.attachPress({
							Entity: "SuppWithhldTax", //s3Controller.compCodeResults.dataitems[i].Key
							Key: strResults.dataitems,
							EntityData: result
						}, this.navtoExtTaxDetail);
						vElement.bindItems("/dataitems", this.oItemTempTax);
						vElement.setVisible(true);
					} else {
						this.getView().byId("ExtendWthhldTax").setVisible(false);
					}
					//	this.getView().byId("ExtendWthhldTax").setVisible(false);
				}
			}

		}
	},

	isNull: function(value) {
		return typeof value === "undefined" || value === "unknown" || value === null || value === "null" || parseInt(value) === 0;
	}
});