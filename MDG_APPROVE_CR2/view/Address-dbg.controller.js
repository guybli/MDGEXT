/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("sap.fcg.mdg.lib.address.util.AddressLib");
jQuery.sap.require("sap.fcg.mdg.lib.address.util.AddressFormatter");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.Address", {
	vAddressDescription: "",
	vDomain: "",
	onInit: function() {
		var vElement = "";
		var oItemTemp = "";

		var oLocalizationModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: jQuery.sap
				.getModulePath("sap.fcg.mdg.lib.address") + "/i18n/i18n.properties"
		});

		oLocalizationModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);
		this.getView().byId('AddressVl').setModel(oLocalizationModel, "i18n");
		this.getView().getModel().setDefaultBindingMode("TwoWay");

		this.getView().byId("AddressPage").setShowNavButton(true);
		var oModel = "";
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "AddressDetail") {
				//Data Declarations
				var actCountry = "";
				var bpCat = "";
				var aDecisions = "";
				var vAdID = this.ChangeKey = oEvent.getParameter('arguments').ChangeKey;
				this.vDomain = oEvent.getParameter('arguments').Domain;

				oModel = new sap.ui.model.json.JSONModel();
				var oResponse = fcg.mdg.approvecrv2.DomainSpecParts[this.vDomain].getData('General');

				var aPhysicalAddress = oResponse[0].data.BP_Root.BP_AddressesRel; //3
				var bpCategory = oResponse[0].data.BP_Root.CATEGORY;
				var sPhysicalAddress = "";
				// Get the Header Element
				var vHeader = this.getView().byId("addrObjHeaderDet");

				//Reset Form Bolding
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());

				//Sub Header
				this.getView().byId("addrAttrHeader").setText(fcg.mdg.approvecrv2.util.DataAccess.getObjectKey());
				fcg.mdg.approvecrv2.DomainSpecParts[this.vDomain].setRouter(this.oRouter);

				//Add Footer
				if (this.vDomain === 'Customer') {
					this.oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Customer.getS3Instance();
					aDecisions = this.oS3Instance.getDecisions();
					this.oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				}

				if (this.vDomain === 'Supplier') {
					this.oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();
					aDecisions = this.oS3Instance.getDecisions();
					this.oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				}

				//Irrespective of number of characters present in Change Key, consider only first 10.
				if (vAdID.length > 10)
					vAdID = vAdID.slice(0, 10);
				vAdID = vAdID.split(" ")[0];
				//Get the Address Matching the AdID passed from S3
				for (var i = 0; i < aPhysicalAddress.results.length; i++) {
					if (aPhysicalAddress.results[i].AD_ID === vAdID) {
						sPhysicalAddress = aPhysicalAddress.results[i];
					}
				}

				//Set Title to Header
				vHeader.setTitle(this.getView().getModel("i18n").getProperty("CC_ADDRESS") + ": " + sPhysicalAddress.AD_ID__TXT);
				this.vAddressDescription = sPhysicalAddress.AD_ID__TXT;
				var country = sPhysicalAddress.COUNTRY;
				if (country === "US" || country === "CA" || country === "JP") {
					actCountry = country;
				}
				oModel.setData(sPhysicalAddress);

				var vVertLayoutElement = this.getView().byId("AddressVl");
				vVertLayoutElement.destroyContent();
				switch (bpCategory) {
					case "1":
						bpCat = "PERSON";
						break;
				}
				this.address_form = sap.fcg.mdg.lib.address.util.AddressLib.getDefaultAddressForm(this, actCountry, bpCat); // EXC_JSHINT_003

				vVertLayoutElement.addContent(this.address_form);
				vVertLayoutElement.setModel(oModel);

				if (sPhysicalAddress === "") {
					return;
				}

				//Bolding of the changed Data for address				
				if (sPhysicalAddress.ChangeData.results !== undefined && sPhysicalAddress.ChangeData.results !== null) {
					if (sPhysicalAddress.ChangeData.results.length > 0) {
						var sStyleClass = "text_bold";
						for (var l = 0; l < sPhysicalAddress.ChangeData.results.length; l++) {

							var sLabelName = "lbl" + sPhysicalAddress.ChangeData.results[l].Attribute;
							var oLblIns = sap.ui.getCore().byId(sLabelName);
							if (oLblIns !== undefined) {
								oLblIns.setDesign("Bold");
							}
							var sTextName = "txt" + sPhysicalAddress.ChangeData.results[l].Attribute;
							if (sap.ui.getCore().byId(sTextName) !== undefined) {
								sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
							}
						}
					}
				}
				//Address Usages		
				var aUsages = sPhysicalAddress.BP_UsagesOfAddressRel;
				if (aUsages.results !== undefined && aUsages.results.length !== 0) {

					for (var i = 0; i < aUsages.results.length; i++) {
						if (aUsages.results[i] !== undefined && aUsages.results[i].ADDRESSTYPE === "XXDEFAULT") {
							aUsages.results[i].STANDARDADDRESSUSAGE = 'X';
							aUsages.results[i].STANDARDADDRESSUSAGE__TXT = 'Yes';
						}
					}
					vElement = this.getView().byId("AddressUsages");
					vElement.setVisible(true);
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(aUsages);
					vElement.setModel(oModel);
					oItemTemp = this.getAddrUsageTemplate(oModel);
					vElement.bindItems('/results', oItemTemp, '', '');
				} else {
					vElement = this.getView().byId("AddressUsages");
					vElement.setVisible(false);
				}

				//Telephone Numbers
				var aTelNumbers = sPhysicalAddress.BP_CommPhoneRel;
				if (aTelNumbers.results !== undefined && aTelNumbers.results.length !== 0) {
					vElement = this.getView().byId("TelephoneNumbers");
					vElement.setVisible(true);
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(aTelNumbers);
					vElement.setModel(oModel);
					oItemTemp = this.getTelTemplate(oModel);
					vElement.bindItems('/results', oItemTemp, '', '');
				} else {
					vElement = this.getView().byId("TelephoneNumbers");
					vElement.setVisible(false);
				}

				//Mobile Numbers
				var aMobileNumbers = sPhysicalAddress.BP_CommMobileRel;
				if (aMobileNumbers.results !== undefined && aMobileNumbers.results.length !== 0) {
					vElement = this.getView().byId("MobileNumbers");
					vElement.setVisible(true);
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(aMobileNumbers);
					vElement.setModel(oModel);
					oItemTemp = this.getMobileTemplate(oModel);
					vElement.bindItems('/results', oItemTemp, '', '');
				} else {
					vElement = this.getView().byId("MobileNumbers");
					vElement.setVisible(false);
				}

				//Fax Numbers
				var aFaxNumbers = sPhysicalAddress.BP_CommFaxRel;
				if (aFaxNumbers.results !== undefined && aFaxNumbers.results.length !== 0) {
					vElement = this.getView().byId("FaxNumbers");
					vElement.setVisible(true);
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(aFaxNumbers);
					vElement.setModel(oModel);
					oItemTemp = this.getFaxTemplate(oModel);
					vElement.bindItems('/results', oItemTemp, '', '');
				} else {
					vElement = this.getView().byId("FaxNumbers");
					vElement.setVisible(false);
				}

				//E Mail
				var aEMail = sPhysicalAddress.BP_CommEMailRel;
				if (aEMail.results !== undefined && aEMail.results.length !== 0) {
					vElement = this.getView().byId("EMailAddresses");
					vElement.setVisible(true);
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(aEMail);
					vElement.setModel(oModel);
					oItemTemp = this.getEMailTemplate(oModel);
					vElement.bindItems('/results', oItemTemp, '', '');
				} else {
					vElement = this.getView().byId("EMailAddresses");
					vElement.setVisible(false);
				}

				//URL
				var aURL = sPhysicalAddress.BP_CommURIRel;
				if (aURL.results !== undefined && aURL.results.length !== 0) {
					vElement = this.getView().byId("URL");
					vElement.setVisible(true);
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(aURL);
					vElement.setModel(oModel);
					oItemTemp = this.getURLTemplate(oModel);
					vElement.bindItems('/results', oItemTemp, '', '');
				} else {
					vElement = this.getView().byId("URL");
					vElement.setVisible(false);
				}

				//IAV Org
				if (oResponse[0].data.BP_Root.CATEGORY !== "1") { //Organization or Group
					var aAdVersOrg = sPhysicalAddress.BP_AddressVersionsOrgRel;
					if (aAdVersOrg.results !== undefined && aAdVersOrg.results.length !== 0) {
						for (i = 0; i < aAdVersOrg.results.length; i++) {
							aAdVersOrg.results[i].Domain = this.vDomain;
						}
						vElement = this.getView().byId("IAV_O");
						vElement.setVisible(true);
						oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(aAdVersOrg);
						vElement.setModel(oModel);
						oItemTemp = this.getIAVTemplate(oModel);

						oItemTemp.attachPress({
							EntityData: aAdVersOrg,
							EntityName: 'IAVDetail',
							ChangeData: aAdVersOrg
						}, this.navtoIAVDetail, ' ');

						vElement.bindItems('/results', oItemTemp, '', '');
					} else {
						vElement = this.getView().byId("IAV_O");
						vElement.setVisible(false);
					}
					this.getView().byId("IAV_P").setVisible(false);
				}

				//IAV Pers pp  
				else if (oResponse[0].data.BP_Root.CATEGORY === "1") {
					var aAdVersPers = sPhysicalAddress.BP_AddressVersionsPersRel;
					if (aAdVersPers.results !== undefined && aAdVersPers.results.length !== 0) {
						for (i = 0; i < aAdVersPers.results.length; i++) {
							aAdVersPers.results[i].Domain = this.vDomain;
						}
						vElement = this.getView().byId("IAV_P");
						vElement.setVisible(true);
						oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(aAdVersPers);
						vElement.setModel(oModel);
						oItemTemp = this.getIAVPersonTemplate(oModel);

						oItemTemp.attachPress({
							EntityData: aAdVersPers,
							EntityName: 'IAVPersDetail',
							ChangeData: aAdVersPers
						}, this.navtoIAVDetail, ' ');

						vElement.bindItems('/results', oItemTemp, '', '');
					} else {
						vElement = this.getView().byId("IAV_P");
						vElement.setVisible(false);
					}
					this.getView().byId("IAV_O").setVisible(false);
				}
			}
		}, this);
	},

	PressBack: function() {
		//var vElement = this.getView().byId("SimpleFormAddress");
		var vElement = this.getView().byId("AddressVl");
		vElement.destroyContent();
	},

	getAddrUsageTemplate: function(oModel) {
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "ADDRESSTYPE",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "ADDRESSTYPE");
							var desc = oModel.getProperty("ADDRESSTYPE__TXT", this.getBindingContext());
							var key = oModel.getProperty("ADDRESSTYPE", this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "STANDARDADDRESSUSAGE",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STANDARDADDRESSUSAGE");
							var vStandard = oModel.getProperty("STANDARDADDRESSUSAGE", this.getBindingContext());
							if (vStandard === "X")
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
							else
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
							return vStandard;
						}
					}
				})
			]
		});

		return oItemTemp;
	},

	getTelTemplate: function(oModel) {
		var oThis = this;
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "COUNTRY__TXT",
						formatter: function() {
							var desc = oModel.getProperty("COUNTRY__TXT", this.getBindingContext());
							var key = oModel.getProperty("COUNTRY", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "COUNTRY");
							return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "TELEPHONE",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TELEPHONE");
							return oModel.getProperty('TELEPHONE', this.getBindingContext());
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "EXTENSION",
						formatter: function() {
							var extension = oModel.getProperty('EXTENSION', this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "EXTENSION");
							if (oThis.isNull(extension))
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							return extension;
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "STD_NO",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STD_NO");
							var vStandard = oModel.getProperty("STD_NO", this.getBindingContext());
							if (vStandard === "X")
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
							else
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
							return vStandard;
						}
					}
				})
			]
		});

		return oItemTemp;
	},

	getMobileTemplate: function(oModel) {
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "COUNTRY__TXT",
						formatter: function() {
							var desc = oModel.getProperty("COUNTRY__TXT", this.getBindingContext());
							var key = oModel.getProperty("COUNTRY", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "COUNTRY");
							return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "TELEPHONE",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TELEPHONE");
							return oModel.getProperty('TELEPHONE', this.getBindingContext());
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "STD_NO",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STD_NO");
							var vStandard = oModel.getProperty("STD_NO", this.getBindingContext());
							if (vStandard === "X")
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
							else
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
							return vStandard;
						}
					}
				})
			]
		});

		return oItemTemp;
	},

	getFaxTemplate: function(oModel) {
		var oThis = this;
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "COUNTRY__TXT",
						formatter: function() {
							var desc = oModel.getProperty("COUNTRY__TXT", this.getBindingContext());
							var key = oModel.getProperty("COUNTRY", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "COUNTRY");
							return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "FAX",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "FAX");
							return oModel.getProperty('FAX', this.getBindingContext());
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "EXTENSION",
						formatter: function() {
							var extension = oModel.getProperty('EXTENSION', this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "EXTENSION");
							if (oThis.isNull(extension))
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							return extension;
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "STD_NO",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STD_NO");
							var vStandard = oModel.getProperty("STD_NO", this.getBindingContext());
							if (vStandard === "X")
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
							else
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
							return vStandard;
						}
					}
				})
			]
		});

		return oItemTemp;
	},

	getEMailTemplate: function(oModel) {
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "E_MAIL",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "E_MAIL");
							return oModel.getProperty('E_MAIL', this.getBindingContext());
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "STD_NO",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STD_NO");
							var vStandard = oModel.getProperty("STD_NO", this.getBindingContext());
							if (vStandard === "X")
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
							else
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
							return vStandard;
						}
					}
				})
			]
		});

		return oItemTemp;
	},

	getURLTemplate: function(oModel) {
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "URI",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "URI");
							return oModel.getProperty('URI', this.getBindingContext());
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "STD_NO",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STD_NO");
							var vStandard = oModel.getProperty("STD_NO", this.getBindingContext());
							if (vStandard === "X")
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
							else
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
							return vStandard;
						}
					}
				})
			]
		});
		return oItemTemp;
	},

	getIAVTemplate: function(oModel) {
		var oThis = this;
		var oItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "ADDR_VERS",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "ADDR_VERS");
							return oModel.getProperty("ADDR_VERS__TXT", this.getBindingContext());
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "NAME",
						formatter: function() {
							var name = oModel.getProperty('NAME', this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "NAME");
							if (oThis.isNull(name))
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							return name;
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "AD_ID",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "AD_ID");
							return oModel.getProperty("AD_ID__TXT", this.getBindingContext());
						}
					}
				})
			]
		});
		return oItemTemp;
	},

	getIAVPersonTemplate: function(oModel) {
		var oThis = this;
		var oItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "ADDR_VERS",
						formatter: function() {
							var desc = oModel.getProperty("ADDR_VERS__TXT", this.getBindingContext());
							var key = oModel.getProperty("ADDR_VERS", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "ADDR_VERS");
							return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "BP_AddressPersonVersionRel/FIRSTNAME",
						formatter: function() {
							var fName = oModel.getProperty('BP_AddressPersonVersionRel/FIRSTNAME', this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "BP_AddressPersonVersionRel/FIRSTNAME");
							if (oThis.isNull(fName))
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							return fName;
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "BP_AddressPersonVersionRel/LASTNAME",
						formatter: function() {
							var lName = oModel.getProperty('BP_AddressPersonVersionRel/LASTNAME', this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "BP_AddressPersonVersionRel/LASTNAME");
							if (oThis.isNull(lName))
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							return lName;
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "AD_ID",
						formatter: function() {
							var vAdid = oModel.getProperty("AD_ID__TXT", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "AD_ID");
							if (oThis.isNull(vAdid))
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							return vAdid;
						}
					}
				})
			]
		});
		return oItemTemp;
	},

	checkBox: function(sValue) {
		var newVal = "";
		if (sValue === "X")
			newVal = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_CHECK_BOX_SET");
		else
			newVal = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_CHECK_BOX_RESET");
		return newVal;
	},
	navtoIAVDetail: function(oEvent) {
		this.bindingContext = oEvent.getSource("listItem").getBindingContext();
		if (this.bindingContext !== undefined)
			this.sPath = oEvent.getSource("listItem").getBindingContext().sPath;
		else {
			this.bindingContext = oEvent.getParameter("listItem").getBindingContext();
			this.sPath = oEvent.getParameter("listItem").getBindingContext().sPath;
		}
		var aPath = "";
		aPath = this.sPath.split("/");
		var vEntityData = this.bindingContext.oModel.oData.results[aPath[2]];
		var vAddrVersion = vEntityData.ADDR_VERS;
		var vAdID = vEntityData.AD_ID;
		var vADomain = vEntityData.Domain;

		this.oRouter = fcg.mdg.approvecrv2.DomainSpecParts[vADomain].getRouter();

		if (vAdID !== "") {
			if (fcg.mdg.approvecrv2.DomainSpecParts[vADomain].getData('General')[0].data.BP_Root.CATEGORY === "2" ||
				fcg.mdg.approvecrv2.DomainSpecParts[vADomain].getData('General')[0].data.BP_Root.CATEGORY === "3") { //Organization or Group
				this.oRouter.navTo("IAVDetail", {
					AddressId: vAdID,
					AddressVersion: vAddrVersion,
					Domain: vADomain
				});
			} else if (fcg.mdg.approvecrv2.DomainSpecParts[vADomain].getData('General')[0].data.BP_Root.CATEGORY === "1") {
				this.oRouter.navTo("IAVPersDetail", {
					AddressId: vAdID,
					AddressVersion: vAddrVersion,
					Domain: vADomain
				});
			}
		}
	},

	isNull: function(value) {
		return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || value === '' || parseInt(value) ===
			0;
	}
});