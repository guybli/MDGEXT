/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the Identification detail view page in change scenario

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.IdentificationDetail", {
	extHookModifyIdentificationDetailFormData: null,

	onInit: function() {
		var result = "";
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("identificationDetailPage").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			var oS3Instance = "";
			var aDecisions = "";
			if (oEvent.getParameter("name") === "identificationDetail") {
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());

				// This code will be executed when the user navigates to Identification detail page.

				var indentiHeader = this.getView().getModel("i18n").getProperty("Identi");
				var indentiAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();

				this.getView().byId("identificationDetailHeader").setTitle(indentiHeader);
				this.getView().byId("identificationAttrHeader").setText(indentiAttribute);

				var vDomain = oEvent.getParameter('arguments').Domain;
				if (vDomain === 'Customer') {
					//add footer
					oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getS3Instance();
					aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
					result = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();
				}

				if (vDomain === 'Supplier') {
					//add footer
					oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();
					aDecisions = oS3Instance.getDecisions();
					oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
					result = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();
				}
				/**
				 * @ControllerHook To modify the data of the form if it is not done via direct binding
				 * Customer can modify the data as per his requirements before binding it to a form
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyIdentificationDetailFormData
				 * @param {object} detailData Holds data
				 * @return {object} detailData Modified Data
				 */
				if (this.extHookModifyIdentificationDetailFormData) {
					var extModifiedData = this.extHookModifyIdentificationDetailFormData(result);
					if (extModifiedData !== undefined) {
						result = extModifiedData;
					}
				}
				var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
				oModel.setData(result);

				var vElement = this.getView().byId("identificationResults");
				vElement.setModel(oModel);
				var oThis = this;

				var oItemTemp = new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							text: {
								path: "IDENTIFICATIONTYPE__TXT",
								formatter: function() {
									fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "IDENTIFICATIONTYPE");
									return oModel.getProperty("IDENTIFICATIONTYPE__TXT", this.getBindingContext());
								}
							}
						}),

						new sap.m.Text({
							text: {
								path: "IDENTIFICATIONNUMBER",
								formatter: function() {
									fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "IDENTIFICATIONNUMBER");
									return oModel.getProperty('IDENTIFICATIONNUMBER', this.getBindingContext());
								}
							}
						}),

						new sap.m.Text({
							text: {
								path: "IDINSTITUTE",
								formatter: function() {
									var vInstitute = oModel.getProperty('IDINSTITUTE', this.getBindingContext());
									fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "IDINSTITUTE");
									if (oThis.isNull(vInstitute))
										return fcg.mdg.approvecrv2.util.Formatter.noValue("");
									return vInstitute;
								}
							}
						}),
						new sap.m.Text({
							text: {
								path: "IDENTRYDATE",
								formatter: function() {
									var entryDate = oModel.getProperty("IDENTRYDATE", this.getBindingContext());
									fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "IDENTRYDATE");
									if (oThis.isNull(entryDate))
										return fcg.mdg.approvecrv2.util.Formatter.noValue("");
									else
										return fcg.mdg.approvecrv2.util.Formatter.Date(entryDate);
								}
							}
						}),
						new sap.m.Text({
							text: {
								path: "CD_COUNTRY/Description",
								formatter: function() {
									var desc = oModel.getProperty("COUNTRY__TXT", this.getBindingContext());
									var key = oModel.getProperty("COUNTRY", this.getBindingContext());
									fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "COUNTRY");
									if (oThis.isNull(key) && oThis.isNull(desc))
										return fcg.mdg.approvecrv2.util.Formatter.noValue("");
									return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
								}
							}
						}),
						new sap.m.Text({
							text: {
								path: "REGION",
								formatter: function() {
									var desc = oModel.getProperty("REGION__TXT", this.getBindingContext());
									var key = oModel.getProperty("REGION", this.getBindingContext());
									fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "REGION");
									if (oThis.isNull(key) && oThis.isNull(desc))
										return fcg.mdg.approvecrv2.util.Formatter.noValue("");
									return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
								}
							}
						}),
						new sap.m.Text({
							text: {
								path: "IDVALIDFROMDATE",
								formatter: function() {
									var entryDate = oModel.getProperty("IDVALIDFROMDATE", this.getBindingContext());
									fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "IDVALIDFROMDATE");
									if (oThis.isNull(entryDate))
										return fcg.mdg.approvecrv2.util.Formatter.noValue("");
									else
										return fcg.mdg.approvecrv2.util.Formatter.Date(entryDate);
								}
							}
						}),
						new sap.m.Text({
							text: {
								path: "IDVALIDTODATE",
								formatter: function() {
									var entryDate = oModel.getProperty("IDVALIDTODATE", this.getBindingContext());
									fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "IDVALIDTODATE");
									if (oThis.isNull(entryDate))
										return fcg.mdg.approvecrv2.util.Formatter.noValue("");
									else
										return fcg.mdg.approvecrv2.util.Formatter.Date(entryDate);
								}
							}
						})
					]
				});

				vElement.bindItems("/results", oItemTemp);

			}
		}, this);
	},

	isNull: function(value) {
		return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || value === '' || parseInt(value) ===
			0;
	}
});