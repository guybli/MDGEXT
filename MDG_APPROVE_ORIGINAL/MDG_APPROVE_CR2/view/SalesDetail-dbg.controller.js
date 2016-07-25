/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//Sales details controller Page is loaded when the user clicks on the respective sales area in the detail page.
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.SalesDetail", {
	salekey: "",
	oItemTempPf: "",
	oSalesDetail: "",
	oS3Instance: "",
	subheader: "",
	oCompCodeDetails: "",
	extHookdisplaySaleData: null,
	extHookModifyStyleClass: null,
	extHookTaxCategoryTable: null,
	extHookPartnerFuncTable: null,
	oItemTempTax: "",

	onInit: function() {
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("SalesPage").setShowNavButton(true);
		this.oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getS3Instance();

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "Sales") {
				var aDecisions = this.oS3Instance.getDecisions();
				this.oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());

				var args = oEvent.getParameter("arguments");
				this.salekey = args.Key;
				var result = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();

				//				Handling of the Fragments...Since the same fragment is being used for both the detail page and display of the single Sales organization record in create scenario the fragment is destroyed initially.
				if (this.oS3Instance.oSalesCreateForm !== "") {
					this.oS3Instance.oSalesCreateForm.destroy();
				}

				if (this.oS3Instance.oSalesDetail === "") {
					this.oS3Instance.oSalesDetail = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SalesDetail', fcg.mdg.approvecrv2.util.Formatter);
				} else {
					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("SalesPage").removeContent(this.oS3Instance.oSalesDetail);
					if (this.oS3Instance.oSalesDetail !== undefined) {
						this.oS3Instance.oSalesDetail.destroy();
					}
					this.oS3Instance.oSalesDetail = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SalesDetail', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("SalesPage").addContent(this.oS3Instance.oSalesDetail);

				this.displaySaleData(result);
				/**
				 * @ControllerHook To modify and bind the results of the OData service
				 * Customer can modify the data as per his requirements before binding it to a form or Table
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookdisplaySaleData
				 * @param {object} result holds the data
				 * @return { } Launches the page
				 */
				if (this.extHookdisplaySaleData) {
					this.extHookdisplaySaleData(result);
				}

			}
		}, this);
	},

	//Table template for the Tax Category table which contains columns: Country,Tax Type,Tax Category description along with the keys
	getTaxcategoryTemplate: function(oModel) {
		var oItemTempTax = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "ALAND__TXT",
						formatter: function() {
							var desc = oModel.getProperty("ALAND__TXT", this.getBindingContext());
							var key = oModel.getProperty("ALAND", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "ALAND");
							return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "TATYP__TXT",
						formatter: function() {
							var desc = oModel.getProperty("TATYP__TXT", this.getBindingContext());
							var key = oModel.getProperty("TATYP", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TATYP");
							return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "TAXKD__TXT",
						formatter: function() {
							var desc = oModel.getProperty("TAXKD__TXT", this.getBindingContext());
							var key = oModel.getProperty("TAXKD", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TAXKD");
							return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				})
			]
		});
		/**
		 * @ControllerHook Hook For Tax Category Template
		 * Description on Controller Hook usage here.
		 * This method is called when there are any enhancements for table with additional Columns
		 * The hook must be documented like:
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenControllerr~extHookTaxCategoryTable
		 * @param {object} oModel
		 * @return {object} oItemTempTax
		 */
		if (this.extHookTaxCategoryTable) { // check whether any extension has implemented the hook... unga veetla pidika
			oItemTempTax = this.extHookTaxCategoryTable(oModel); // ...and call it
		}
		return oItemTempTax;
	},

	//	Table template for the Partner Function Table. Here it contains columns:Partner Function,Same Partner,Partner,Default Partner along with the keys.   
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
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "REFLEXIVE");
							var desc = oModel.getProperty("REFLEXIVE__TXT", this.getBindingContext());
							if (desc !== "")
								return desc;
							else
								return oThis.getView().getModel("i18n").getProperty("PC_NO");
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "KUNN2__TXT",
						formatter: function() {
							var desc = oModel.getProperty("KUNN2__TXT", this.getBindingContext());
							var key = oModel.getProperty("KUNN2", this.getBindingContext());
							var contactdesc = oModel.getProperty("PARNR__TXT", this.getBindingContext());
							var contactkey = oModel.getProperty("PARNR", this.getBindingContext());
							var personaldesc = oModel.getProperty("PERNR__TXT", this.getBindingContext());
							var personalnum = oModel.getProperty("PERNR", this.getBindingContext());

							var vendorDec = oModel.getProperty("LIFNR__TXT", this.getBindingContext());
							var vendorNo = oModel.getProperty("LIFNR", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "KUNN2");
							contactkey = (parseInt(contactkey) === 0) ? "" : parseInt(contactkey, 10);
							personalnum = (parseInt(personalnum) === 0) ? "" : parseInt(personalnum, 10);

							if ((oThis.isNull(contactdesc) || contactdesc === "") && (oThis.isNull(contactkey) || contactkey === "") && (oThis.isNull(key) ||
								key === "") && (oThis.isNull(desc) || desc === "") && (oThis.isNull(personalnum) || personalnum === "") && (oThis.isNull(
								personaldesc) || personaldesc === "") && (oThis.isNull(vendorNo) || vendorNo === "") && (oThis.isNull(vendorDec) || vendorDec ===
								"")) {
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							}

							if (contactdesc !== "" || contactkey !== "") {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(contactkey, contactdesc);
							}
							if (key !== "" || desc !== "") {
								return fcg.mdg.approvecrv2.util.Formatter.description(key, desc);
							}
							if (personalnum !== "" || personaldesc !== "") {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(personalnum, personaldesc);
							}
							if (vendorNo !== "" || vendorDec !== "") {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vendorNo, vendorDec);
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "KNREF",
						formatter: function() {
							var partDesc = oModel.getProperty("KNREF", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "KNREF");
							if (oThis.isNull(partDesc) || partDesc === "")
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							return partDesc;
						}

					}
				}),
				new sap.m.Text({
					text: {
						path: "DEFPA__TXT",
						formatter: function() {
							var defPartner = oModel.getProperty("DEFPA__TXT", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "DEFPA");
							if (oThis.isNull(defPartner) || defPartner === "")
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							return defPartner;
						}
					}
				})
			]
		});
		/**
		 * @ControllerHook Hook For Partner Function Table Template
		 * Description on Controller Hook usage here.
		 * This method is called when there are any enhancements for table with additional Columns
		 * The hook must be documented like:
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenControllerr~extHookPartnerFuncTable
		 * @param {object} oModel
		 * @return {object} oItemTempPf
		 */
		if (this.extHookPartnerFuncTable) { // check whether any extension has implemented the hook...
			oItemTempPf = this.extHookPartnerFuncTable(oModel); // ...and call it
		}
		return oItemTempPf;
	},

	//Sales Detail fragment is being loaded if the Sales id matches the Sales Organization which the user has clicked. Here the Sales id is the combination of the assignment id,Sales Org id,Distribution Channel id and Division id.
	displaySaleData: function(result) {
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
				this.subheader = fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate.getSubheaderWithAccGrp(result.results[i].STANDARD, result.results[
					i].OBJECT_ID, result.results[i].REASON_ID__TXT, accgrp);
			} else {
				this.subheader = "";
			}
			for (var j = 0; j < result.results[i].CU_AssignedSalesAreasRel.results.length; j++) {

				var strResults = "";
				var vElement = "";
				var oModel = "";
				var oAssignedSalesAreas = result.results[i].CU_AssignedSalesAreasRel.results[j];

				var sOrg = oAssignedSalesAreas.VKORG;
				var dChanl = oAssignedSalesAreas.VTWEG;
				var divison = oAssignedSalesAreas.SPART;

				var key = oAssignedSalesAreas.ASSIGNMENT_ID + sOrg + dChanl + divison;
				if (key === this.salekey) {
					sOrg = oAssignedSalesAreas.VKORG__TXT + "(" + oAssignedSalesAreas.VKORG + ")";
					dChanl = oAssignedSalesAreas.VTWEG__TXT + "(" + oAssignedSalesAreas.VTWEG + ")";
					divison = oAssignedSalesAreas.SPART__TXT + "(" + oAssignedSalesAreas.SPART + ")";
					var headerText = sOrg + "," + dChanl + "," + divison;

					this.getView().byId("ccObjHeaderDet").setTitle(this.getView().getModel("i18n").getProperty("salesarea") + ": " + headerText);
					var bpdesc = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
					this.getView().byId("bpdesc").setText(bpdesc);
					this.getView().byId("erpCustSales").setText(this.subheader);

					var FinalResult = oAssignedSalesAreas;
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(FinalResult);
					vElement = sap.ui.getCore().byId("SimpleFormSales");
					vElement.setModel(oModel);

					//Bolding of the changed data for both the labels and texts.
					if (oAssignedSalesAreas.ChangeData.results !== undefined && oAssignedSalesAreas.ChangeData.results.length > 0) {
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

						for (var l = 0; l < oAssignedSalesAreas.ChangeData.results.length; l++) {
							var sLabelName = "lbl" + oAssignedSalesAreas.ChangeData.results[l].Attribute;
							var sChangeLabelName = "lblsale" + oAssignedSalesAreas.ChangeData.results[l].Attribute;
							var oLblIns = sap.ui.getCore().byId(sLabelName);
							var oNewlblIns = sap.ui.getCore().byId(sChangeLabelName);
							if (oLblIns !== undefined) {
								oLblIns.setDesign("Bold");
							}
							if (oNewlblIns !== undefined) {
								oNewlblIns.setDesign("Bold");
							}

							var sTextName = oAssignedSalesAreas.ChangeData.results[l].Attribute;
							var sNewText = "sale" + oAssignedSalesAreas.ChangeData.results[l].Attribute;
							if (sap.ui.getCore().byId(sTextName) !== undefined) {
								sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
							}
							if (sap.ui.getCore().byId(sNewText) !== undefined) {
								sap.ui.getCore().byId(sNewText).addStyleClass(sStyleClass);
							}
						}
					}
					//Hiding of the sections in case data is not maintained for all the texts under this section.
					fcg.mdg.approvecrv2.DomainSpecParts.Customer.hideSaleSection();

					//Hiding of the sales Org,Distribution Channel and Division label and texts since these details are already shown in the header. These details are needed in create scenario.
					//		sap.ui.getCore().byId("CustSaleArea").destroy();
					var vElementsalesorglbl = sap.ui.getCore().byId("lblVKORG");
					vElementsalesorglbl.setVisible(false);
					var vElementdischannellbl = sap.ui.getCore().byId("lblVTWEG");
					vElementdischannellbl.setVisible(false);
					var vElementdivisionlbl = sap.ui.getCore().byId("lblSPART");
					vElementdivisionlbl.setVisible(false);
					var vElementsalesorgText = sap.ui.getCore().byId("VKORG");
					vElementsalesorgText.setVisible(false);
					var vElementdischannelText = sap.ui.getCore().byId("VTWEG");
					vElementdischannelText.setVisible(false);
					var vElementdivisionText = sap.ui.getCore().byId("SPART");
					vElementdivisionText.setVisible(false);
					var vElementerpcust = sap.ui.getCore().byId("lblSalesErpcust");
					vElementerpcust.setVisible(false);

					//Binding of the partner function details to the table for matching sales organization details. Else the section  is hidden.
					if (oAssignedSalesAreas.CU_SalesPartnerFunctionsRel.results !== undefined && oAssignedSalesAreas.CU_SalesPartnerFunctionsRel.results.length >
						0) {
						strResults = oAssignedSalesAreas.CU_SalesPartnerFunctionsRel;
						oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
						oModel.setData(strResults);
						vElement = sap.ui.getCore().byId("partnerfunc");
						vElement.setVisible(true);
						vElement.setModel(oModel);
						this.oItemTempPf = this.getPartnerFuncTemplate(oModel);
						vElement.bindItems("/results", this.oItemTempPf);
					} else {
						sap.ui.getCore().byId("partnerfunc").setVisible(false);
					}

					//Binding of the sales tax details to the table for matching sales organization details. Else the section  is hidden.	
					if (oAssignedSalesAreas.CU_SalesTaxIndicatorsRel.results !== undefined && oAssignedSalesAreas.CU_SalesTaxIndicatorsRel.results.length >
						0) {
						strResults = oAssignedSalesAreas.CU_SalesTaxIndicatorsRel;
						oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
						oModel.setData(strResults);
						vElement = sap.ui.getCore().byId("taxindic");
						vElement.setVisible(true);
						vElement.setModel(oModel);
						this.oItemTempTax = this.getTaxcategoryTemplate(oModel);
						vElement.bindItems("/results", this.oItemTempTax);
					} else {
						sap.ui.getCore().byId("taxindic").setVisible(false);
					}
				}
			}
		}
	},

	isNull: function(value) {
		return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || parseInt(value) === 0;
	}
});