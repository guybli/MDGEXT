/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//To handle the behavior of the Erp Customer general detail view page in both create and change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Supplier");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.ERPSupplierDetail", {
	oresult: "",
	extHookModifyERPCustDetailFormData: null,
	extHookModifyERPCustStyleClass: null,

	onInit: function() {

		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("erpSupplierPage").setShowNavButton(true);
		var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();
		var aDecisions = oS3Instance.getDecisions();
		oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "erpSupplierDetail") {

				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());

				var aErpDetails = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.
				oGeneralData[0].data.BP_Root.SP_MultipleAssignmentsRel;
				//get the key
				var vErpID = oEvent.getParameter('arguments').ChangeKey;
				var results = "";
				vErpID = vErpID.substring(0, 12);
				for (var i = 0; i < aErpDetails.results.length; i++) {
					if (aErpDetails.results[i].ASSIGNMENT_ID === vErpID) {
						results = aErpDetails.results[i];
					}
				}

				//To set the Page header
				var erpCustHeader = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
				this.getView().byId("erpSupplObjectKey").setText(erpCustHeader);
				var header = "";
				header = this.getView().getModel("i18n").getProperty("ERP_Vendor");

				if (results.SP_AssignedSupplierRel !== undefined) {
					var erpNumber = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(results.SP_AssignedSupplierRel.LIFNR);

					var erpVendor = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(erpNumber, results.SP_AssignedSupplierRel.LIFNR__TXT);
					header = header + ': ' + erpVendor;
				}
				//To set the Object title
				if (results.REASON_ID__TXT !== "" && results.REASON_ID__TXT !== undefined) {
					if (header !== "")
						header = header + ", " + this.getView().getModel("i18n").getProperty("Reason") + ': ' + results.REASON_ID__TXT;
					else
						header = header + this.getView().getModel("i18n").getProperty("Reason") + ": " + results.REASON_ID__TXT;
				}

				if (results.SP_AssignedSupplierRel.KTOKK !== "" && results.SP_AssignedSupplierRel.KTOKK !== undefined) {
					if (header !== "")
						header = header + ", " + this.getView().getModel("i18n").getProperty("AccountGroup") + ': ' + results.SP_AssignedSupplierRel.KTOKK__TXT +
						' (' + results.SP_AssignedSupplierRel.KTOKK + ')';
					else
						header = this.getView().getModel("i18n").getProperty("AccountGroup") + ': ' + results.SP_AssignedSupplierRel.KTOKK__TXT + ' (' +
						results.SP_AssignedSupplierRel.KTOKK + ')';
				}

				if (results.STANDARD !== "" && results.STANDARD !== undefined) {
					if (results.STANDARD === 'X') {
						if (header !== "")
							header = header + ", " + this.getView().getModel("i18n").getProperty("Standard");
						else
							header = this.getView().getModel("i18n").getProperty("Standard");
					}
				}

				//To set the page title

				this.getView().byId("erpSupplierObjHeaderDet").setTitle(header);

				var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
				oModel.setData(results);

				var formControlData = this.getView().byId("SimpleFormControlData");
				formControlData.setModel(oModel);

				//				var formReferenceData = this.getView().byId("SimpleFormReferenceData");
				//				formReferenceData.setModel(oModel);
				//
				//				var formTaxInformation = this.getView().byId("SimpleFormTaxInformation");
				//				formTaxInformation.setModel(oModel);
				//
				//				var formPaymentTransac = this.getView().byId("SimpleFormPaymentTransac");
				//				formPaymentTransac.setModel(oModel);

				//				var formMarketing = this.getView().byId("SimpleFormMarketing");
				//				formMarketing.setModel(oModel);

				//				var formExportData = this.getView().byId("SimpleFormExportData");
				//				formExportData.setModel(oModel);

				//				var additionalData = this.getView().byId("SimpleFormAdditionalPurchasingData");
				//				additionalData.setModel(oModel);

				//Binding of the Sub Range Table
				if (results.SP_AssignedSubrangesRel.results !== undefined && results.SP_AssignedSubrangesRel.results.length > 0) {
					var strResults = {
						dataitems: [],
						ChangeData: []
					};
					for (var k = 0; k < results.SP_AssignedSubrangesRel.results.length; k++) {
						var oSubranges = results.SP_AssignedSubrangesRel.results[k];
						if (oSubranges.ASSIGNMENT_ID === vErpID) {
							var subrange = oSubranges.LTSNR;
							var subrangeDesc = oSubranges.LTSBZ;
							var Subvalue = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(subrange, subrangeDesc);
							var langkey = oSubranges.SPRAS;
							var langdesc = oSubranges.SPRAS__TXT;
							var description = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(langkey, langdesc);
							var newlyCreated = false;
							var subrangedescChanged = false;
							var langChanged = false;
							var subrangeDeleted = false;
							if (oSubranges.ChangeData !== undefined && oSubranges.ChangeData.results !== undefined && oSubranges.ChangeData.results.length > 0) {
								for (var s = 0; s < oSubranges.ChangeData.results.length; s++) {
									if (oSubranges.ChangeData.results[s].EntityAction === "C") {
										newlyCreated = true;
									}
									if (oSubranges.ChangeData.results[s].Attribute === "LTSBZ" && oSubranges.ChangeData.results[s].OldValue !== oSubranges.ChangeData
										.results[s].NewValue) {
										subrangedescChanged = true;
									}
									if (oSubranges.ChangeData.results[s].Attribute === "SPRAS" && oSubranges.ChangeData.results[s].OldValue !== langkey) {
										langChanged = true;
									}
									if (oSubranges.ChangeData.results[s].EntityAction === "D") {
										subrangeDeleted = true;
									}
								}
							}

							var oDataItems = {
								"Language": description,
								"SubrangeDesc": Subvalue,
								"NewlyCreated": newlyCreated,
								"SubrangeChanged": subrangedescChanged,
								"LanguageChanged": langChanged,
								"SubrangeDeleted": subrangeDeleted
							};
							//strResults.ChangeData.push(results.SP_AssignedSubrangesRel.results[k].ChangeData.results);
							strResults.dataitems.push(oDataItems);
						}
					}
					oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
					oModel.setData(strResults);
					var vElement = this.getView().byId("subranges");
					vElement.setVisible(true);
					vElement.setModel(oModel);
					this.oSubrangeTemplate = this.getSubrangeTableTemplate(oModel);
					vElement.bindItems("/dataitems", this.oSubrangeTemplate);
					vElement.setVisible(true);
				} else {
					this.getView().byId("subranges").setVisible(false);
				}
				this.oresult = results;
				this.highlight();
				//Trigger the View to hide or show the Core titles
				this.getView().rerender();

			}
		}, this);
	},

	//To initialize view so that hidden attributes are not shown on the UI
	onAfterRendering: function() {
		this.hideSection();
	},

	//Table for sub-Range which involves 2 colums Sub Range and Plant information
	getSubrangeTableTemplate: function(oModel) {
		var oItemsubrange = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {

						path: "Language",
						formatter: function() {
							var ctx = this.getBindingContext();

							var vNewlyCreated = oModel.getProperty("NewlyCreated", ctx);
							var vLangChanged = oModel.getProperty("LanguageChanged", ctx);
							var vSubrangeDeleted = oModel.getProperty("SubrangeDeleted", ctx);
							if (vNewlyCreated || vLangChanged) {
								this.addStyleClass("text_bold");
							}
							if (vSubrangeDeleted) {
								this.addStyleClass("sapThemeText");
							}
							return oModel.getProperty("Language", this.getBindingContext());
						}
					}
				}),
				new sap.m.Text({
					text: {

						path: "SubrangeDesc",
						formatter: function() {
							var ctx = this.getBindingContext();

							var vNewlyCreated = oModel.getProperty("NewlyCreated", ctx);
							var vSubrangeChanged = oModel.getProperty("SubrangeChanged", ctx);
							var vSubrangeDeleted = oModel.getProperty("SubrangeDeleted", ctx);
							if (vNewlyCreated || vSubrangeChanged) {
								this.addStyleClass("text_bold");
							}
							if (vSubrangeDeleted) {
								this.addStyleClass("sapThemeText");
							}
							return oModel.getProperty("SubrangeDesc", this.getBindingContext());
						}
					}
				})
			]
		});
		return oItemsubrange;
	},

	//If values are not filled then hide the respective section
	hideSection: function() {
		//Hide sections if data is not available
		if (this.getView().byId("REASON_ID").getText() === "" && this.getView().byId("STANDARD").getText() === "" &&
			this.getView().byId("KUNNR").getText() === "" && this.getView().byId("KTOKK").getText() === "" &&
			this.getView().byId("BEGRU").getText() === "" && this.getView().byId("KONZS").getText() === "" &&
			this.getView().byId("VBUND").getText() === "" && this.getView().byId("PLKAL").getText() === "" &&
			this.getView().byId("SimpleFormCustControlData") !== undefined) {
			var ctrlData = this.getView().byId('SimpleFormCustControlData').getId();
			$('#' + ctrlData).hide();
		}

		if (this.getView().byId("BAHNS").getText() === "" && this.getView().byId("EMNFR").getText() === "" &&
			this.getView().byId("PODKZB").getText() === "" && this.getView().byId("SCACD").getText() === "" &&
			this.getView().byId("QSSYS").getText() === "" && this.getView().byId("SFRGR").getText() === "" &&
			this.getView().byId("DLGRP").getText() === "" && this.getView().byId("KRAUS").getText() === "" &&
			this.getView().byId("REVDB").getText() === "" && this.getView().byId("STGDL").getText() === "" &&
			this.getView().byId("QSSYSDAT").getText() === "" && this.getView().byId("SimpleFormReferenceData") !== undefined) {
			var reference = this.getView().byId('SimpleFormReferenceData').getId();
			$('#' + reference).hide();
		}

		if (this.getView().byId("FISKU").getText() === "" && this.getView().byId("STENR").getText() === "" &&
			this.getView().byId("FISKN").getText() === "" && this.getView().byId("FITYP").getText() === "" &&
			(this.getView().byId("TAXBS").getText() === "0" || this.getView().byId("TAXBS").getText() === "") && this.getView().byId("J_1KFTBUS").getText() ===
			"" &&
			this.getView().byId("J_1KFREPRE").getText() === "" && this.getView().byId("STKZU").getText() === "" &&
			this.getView().byId("STKZA").getText() === "" && this.getView().byId("IPISP").getText() === "" &&
			this.getView().byId("REGSS").getText() === "" && this.getView().byId("ACTSS").getText() === "" &&
			this.getView().byId("J_1KFTIND").getText() === "" && this.getView().byId("SimpleFormTaxInformation") !== undefined) {
			var tax = this.getView().byId('SimpleFormTaxInformation').getId();
			$('#' + tax).hide();
		}

		if (this.getView().byId("WERKR").getText() === "" && this.getView().byId("LTSNA").getText() === "" &&
			this.getView().byId("ExpClassification") !== undefined && this.getView().byId("SimpleFormAdditionalPurchasingData") !== undefined) {
			var expclas = this.getView().byId('SimpleFormAdditionalPurchasingData').getId();
			$('#' + expclas).hide();
		}

		if (this.getView().byId("DTAMS").getText() === "" && this.getView().byId("XZEMP").getText() === "" && this.getView().byId("DTAWS").getText() ===
			"" && this.getView().byId("SimpleFormPaymentTransac") !== undefined) {
			var formPay = this.getView().byId('SimpleFormPaymentTransac').getId();
			$('#' + formPay).hide();
		}
	},

	highlight: function() {
		//Bolding of the changed Data
		if (this.oresult.SP_AssignedSupplierRel.ChangeData.results !== undefined && this.oresult.SP_AssignedSupplierRel.ChangeData.results !==
			null) {
			if (this.oresult.ChangeData.results.length > 0)
				for (var l = 0; l < this.oresult.ChangeData.results.length; l++) {
					var sStyleClass = "text_bold";
					var sLabelName = "lbl" + this.oresult.ChangeData.results[l].Attribute;
					var oLblIns = this.getView().byId(sLabelName);
					if (oLblIns !== undefined) {
						oLblIns.setDesign("Bold");
					}
					var sTextName = this.oresult.ChangeData.results[l].Attribute;
					if (this.getView().byId(sTextName) !== undefined) {
						this.getView().byId(sTextName).addStyleClass(sStyleClass);
					}
				}
			if (this.oresult.SP_AssignedSupplierRel.ChangeData.results.length > 0) {
				var sStyleClass = "text_bold";

				/**
				 * @ControllerHook To modify the style class
				 * Customer can modify the style class to influence text fields
				 * the format of data shown in this description table
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyERPCustStyleClass
				 * @param {string} sStyleClass style class
				 * @return {string} sStyleClass modified style class
				 */
				if (this.extHookModifyERPCustStyleClass) {
					var sNewStyleClass = this.extHookModifyERPCustStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
					if (sNewStyleClass !== undefined) {
						sStyleClass = sNewStyleClass;
					}
				}
				for (var l = 0; l < this.oresult.SP_AssignedSupplierRel.ChangeData.results.length; l++) {
					var sLabelName = "lbl" + this.oresult.SP_AssignedSupplierRel.ChangeData.results[l].Attribute;
					var oLblIns = this.getView().byId(sLabelName);
					if (oLblIns !== undefined) {
						oLblIns.setDesign("Bold");
					}
					var sTextName = this.oresult.SP_AssignedSupplierRel.ChangeData.results[l].Attribute;
					if (this.getView().byId(sTextName) !== undefined) {
						this.getView().byId(sTextName).addStyleClass(sStyleClass);
					}
				}
			}
		}
		this.oresult = "";
	}
});