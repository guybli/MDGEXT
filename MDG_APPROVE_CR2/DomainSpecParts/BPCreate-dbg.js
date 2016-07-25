/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/* Here all the BP queries are included which are required to get the necessary Created data from the backend. 
 Once the query is successful then the corresponding entities
section will be filled with the respective data in the attributes.  */

jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.BPCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.util.BPQuery");

fcg.mdg.approvecrv2.DomainSpecParts.BPCreate = {
	otitle: "",
	oauthorization: "",
	oS3Controller: "",
	oOtc: "",

	getGeneralData: function(oCustomerModel, vPath, sDecisionQuery, s3Controller, vOTC) {
		this.oS3Controller = s3Controller;
		this.oOtc = vOTC;

		var vCompletePath = vPath;
		var vCommaSeperator = ',';
		var vBasePath = 'BP_Root/';

		var vChangeData = "";

		//General section Queries 
		vCompletePath = fcg.mdg.approvecrv2.util.BPQuery.getBPQuery(vCompletePath, vCommaSeperator, vBasePath, vChangeData, this.oOtc);

		//Others
		vCompletePath = vCompletePath + this.getAddressData(oCustomerModel, vBasePath, s3Controller);
		var extQuery = s3Controller.custHookCreateGenQuery(vCompletePath);
		if (extQuery !== undefined) {
			vCompletePath = extQuery;
		}
		return vCompletePath;

	},

	//Newly added to check the performance
	getRelationshipData: function(oCustomerModel, vPath, s3Controller, vOTC) {

		this.oS3Controller = s3Controller;
		this.oOtc = vOTC;

		// vCompletePath = vPath;
		var vCommaSeperator = ',';
		var vBasePath = 'BP_Root/';

		var vChangeData = "",

			//General section Queries 
			vCompletePath = fcg.mdg.approvecrv2.util.BPQuery.getBPRelationshipQuery(vPath, vCommaSeperator, vBasePath, vChangeData, s3Controller);
		return vCompletePath;
	},

	getAddressData: function(oCustomerModel, vBasePath, s3Controller) {
		this.oS3Controller = s3Controller;
		vBasePath = vBasePath + 'BP_AddressesRel/';
		var vCompletePath = "";
		var vCommaSeperator = ',';

		//BP_AddressVersionsOrg
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_AddressVersionsOrgRel';

		//BP_AddressVersionsPers
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_AddressVersionsPersRel';
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_AddressVersionsPersRel/BP_AddressPersonVersionRel';

		//BP_CommEMailRel
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_CommEMailRel';

		//BP_CommFax
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_CommFaxRel';

		//BP_CommMobile
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_CommMobileRel';
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_CommPhoneRel';
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_CommURIRel';
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_StandardCommEMailRel';
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_StandardCommFaxRel';
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_StandardCommMobileRel';
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_StandardCommPhoneRel';
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_StandardCommURIRel';
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_UsagesOfAddressRel';
		var extQuery = s3Controller.custHookCreateAddressQuery(vCompletePath);
		if (extQuery !== undefined) {
			vCompletePath = extQuery;
		}
		return vCompletePath;
	},

	displayGeneralData: function(result, s3Controller, vOTC) {
		this.oS3Controller = s3Controller;
		this.oOtc = vOTC;

		//BP Categories
		var bpOrganization = "2";
		var bpPerson = "1";
		var bpGroup = "3";

		var extoDataItems = s3Controller.custHookCreateOrgData(result.BP_Root, this);
		if (extoDataItems !== undefined) {
			result.BP_Root = extoDataItems;
		}
		var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it 
		oModel.setData(result.BP_Root); //insert complete data
		var vElement = " ";
		//Organization data

		if (result.BP_Root.BP_OrganizationRel !== null && result.BP_Root.CATEGORY === bpOrganization) {
			if (s3Controller.oGeneralCreateForm !== "")
				s3Controller.oGeneralCreateForm.destroy(); //Clear the fragment id's

			s3Controller.oGeneralCreateForm = "";
			s3Controller.oGeneralCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.OrganizationFormCreate');
			//Remove Title if no values are present
			if (result.BP_Root.BP_OrganizationRel.LEGALORG === "" && result.BP_Root.BP_OrganizationRel.LEGALFORM === "" && result.BP_Root.BP_OrganizationRel
				.FOUNDATIONDATE === null && result.BP_Root.BP_OrganizationRel.LIQUIDATIONDATE === null && result.BP_Root.AUTHORIZATIONGROUP__TXT === ""
			) {
				sap.ui.getCore().byId("OFOrganizationalData").destroy();
			}
			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CGeneral").setVisible(true);
				sap.ui.getCore().byId("CGeneral").addContent(s3Controller.oGeneralCreateForm);
			} else if (this.oOtc === "266") {
				sap.ui.getCore().byId("SGeneral").setVisible(true);
				sap.ui.getCore().byId("SGeneral").addContent(s3Controller.oGeneralCreateForm);
			}
			vElement = sap.ui.getCore().byId("FormGeneralOrg");
			vElement.setModel(oModel);

		}

		//Person Data
		if (result.BP_Root.BP_PersonRel !== null && result.BP_Root.CATEGORY === bpPerson) {
			if (s3Controller.oGeneralCreateForm !== "")
				s3Controller.oGeneralCreateForm.destroy(); //Clear the fragment id's
			s3Controller.oGeneralCreateForm = "";
			s3Controller.oGeneralCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.PersonFormCreate');

			//To remove the Title
			if (result.BP_Root.BP_PersonRel.SEX === "" && result.BP_Root.BP_PersonRel.MARITALSTATUS === "" && result.BP_Root.BP_PersonRel.BIRTHDATE ===
				null && result.BP_Root.BP_PersonRel.BIRTHPLACE === "" &&
				result.BP_Root.BP_PersonRel.CORRESPONDLANGUAGE === "" && result.BP_Root.AUTHORIZATIONGROUP__TXT === "") {
				sap.ui.getCore().byId("PFPersonalData").destroy();
			}
			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CGeneral").setVisible(true);
				sap.ui.getCore().byId("CGeneral").addContent(s3Controller.oGeneralCreateForm);
			} else if (this.oOtc === "266") {
				sap.ui.getCore().byId("SGeneral").setVisible(true);
				sap.ui.getCore().byId("SGeneral").addContent(s3Controller.oGeneralCreateForm);
			}

			vElement = sap.ui.getCore().byId("FormGeneralPerson");
			vElement.setModel(oModel);

		}

		//Group Data
		if (result.BP_Root.BP_GroupRel !== null && result.BP_Root.CATEGORY === bpGroup) {
			if (s3Controller.oGeneralCreateForm !== "")
				s3Controller.oGeneralCreateForm.destroy(); //Clear the fragment id's
			s3Controller.oGeneralCreateForm = "";
			s3Controller.oGeneralCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GroupFormCreate');
			if (result.BP_Root.BP_GroupRel.GROUPTYPE === "" && result.BP_Root.AUTHORIZATIONGROUP__TXT === "") //Remove title
			{
				sap.ui.getCore().byId("GFGroupData").destroy();
			}
			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CGeneral").setVisible(true);
				sap.ui.getCore().byId("CGeneral").addContent(s3Controller.oGeneralCreateForm);
			} else if (this.oOtc === "266") {
				sap.ui.getCore().byId("SGeneral").setVisible(true);
				sap.ui.getCore().byId("SGeneral").addContent(s3Controller.oGeneralCreateForm);
			}

			vElement = sap.ui.getCore().byId("FormGeneralGrp");
			vElement.setModel(oModel);

		}

		//Role
		if (result.BP_Root.BP_RolesRel.results !== undefined && result.BP_Root.BP_RolesRel.results.length > 0) {
			oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
			oModel.setData(result.BP_Root.BP_RolesRel);

			var oItemRoleTemp = this.RoleValueTemplate(oModel); //Create a template
			if (s3Controller.oRoleCreateTable !== "") {
				s3Controller.oRoleCreateTable.destroy();
			}
			//Clear the fragment id's
			s3Controller.oRoleCreateTable = "";
			s3Controller.oRoleCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.RoleTableCreate');
			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CRoles").setVisible(true);
				sap.ui.getCore().byId("CRoles").addContent(s3Controller.oRoleCreateTable);
			} else if (this.oOtc === "266") {
				sap.ui.getCore().byId("SRoles").setVisible(true);
				sap.ui.getCore().byId("SRoles").addContent(s3Controller.oRoleCreateTable);
			}
			s3Controller.oRoleCreateTable.setGrowing(true);
			s3Controller.oRoleCreateTable.removeAllItems();
			s3Controller.oRoleCreateTable.setModel(oModel);

			s3Controller.oRoleCreateTable.bindItems('/results', oItemRoleTemp, '', ''); //Bind the data to the template
		}

		//			Bank
		if (result.BP_Root.BP_BankAccountsRel.results !== undefined && result.BP_Root.BP_BankAccountsRel.results.length > 0) {
			oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
			oModel.setData(result.BP_Root.BP_BankAccountsRel);
			var oItemBankTemp = this.BankValueTemplate(oModel); //Get the template

			if (s3Controller.oBankCreateTable !== "") {
				s3Controller.oBankCreateTable.destroy();
			} //Clear the fragment id's
			s3Controller.oBankCreateTable = "";
			s3Controller.oBankCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.BankTableCreate');

			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CBank").setVisible(true);
				sap.ui.getCore().byId("CBank").addContent(s3Controller.oBankCreateTable);
			} else if (this.oOtc === "266") {
				sap.ui.getCore().byId("SBank").setVisible(true);
				sap.ui.getCore().byId("SBank").addContent(s3Controller.oBankCreateTable);
			}
			s3Controller.oBankCreateTable.setGrowing(true);
			s3Controller.oBankCreateTable.removeAllItems();
			s3Controller.oBankCreateTable.setModel(oModel);
			if (this.oOtc === "159") {
				oItemBankTemp.attachPress({
					EntityData: result.BP_Root.BP_BankAccountsRel.results,
					EntityName: 'BP_BankAccount',
					Domain: "Customer",
					ChangeData: result.BP_Root.BP_BankAccountsRel.results
				}, s3Controller.navtoSubDetail, s3Controller);
			} else if (this.oOtc === "266") {
				oItemBankTemp.attachPress({
					EntityData: result.BP_Root.BP_BankAccountsRel.results,
					EntityName: 'BP_BankAccount',
					Domain: "Supplier",
					ChangeData: result.BP_Root.BP_BankAccountsRel.results
				}, s3Controller.navtoSubDetail, s3Controller);

			}
			s3Controller.oBankCreateTable.bindItems('/results', oItemBankTemp, '', ''); //bind the data to the template

		}

		//			Identification
		if (result.BP_Root.BP_IdentificationNumbersRel.results !== undefined && result.BP_Root.BP_IdentificationNumbersRel.results.length > 0) {
			oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
			oModel.setData(result.BP_Root.BP_IdentificationNumbersRel);

			var oItemIdentificationTemp = this.IdentificationValueTemplate(oModel); //Get the template                     
			if (s3Controller.oIndentificationCreateTable !== "") {
				s3Controller.oIndentificationCreateTable.destroy();
			} //Clear the fragment id's
			s3Controller.oIndentificationCreateTable = "";
			s3Controller.oIndentificationCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.IdentificationTableCreate');
			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CIdentification").setVisible(true);
				sap.ui.getCore().byId("CIdentification").addContent(s3Controller.oIndentificationCreateTable);
			} else if (this.oOtc === "266") {
				sap.ui.getCore().byId("SIdentification").setVisible(true);
				sap.ui.getCore().byId("SIdentification").addContent(s3Controller.oIndentificationCreateTable);
			}
			s3Controller.oIndentificationCreateTable.setGrowing(true);
			s3Controller.oIndentificationCreateTable.removeAllItems();
			s3Controller.oIndentificationCreateTable.setModel(oModel);
			s3Controller.oIndentificationCreateTable.bindItems('/results', oItemIdentificationTemp, '', '');
		}

		//			Tax
		if (result.BP_Root.BP_TaxNumbersRel.results !== undefined && result.BP_Root.BP_TaxNumbersRel.results.length > 0) {
			oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
			oModel.setData(result.BP_Root.BP_TaxNumbersRel);

			var oItemTaxTemp = this.TaxValueTemplate(oModel); //Get the template   
			if (s3Controller.oTaxCreateTable !== "") {
				s3Controller.oTaxCreateTable.destroy();
			} //Clear the fragment id's
			s3Controller.oTaxCreateTable = "";
			s3Controller.oTaxCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.TaxTableCreate');

			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CTax").setVisible(true);
				sap.ui.getCore().byId("CTax").addContent(s3Controller.oTaxCreateTable);
			} else if (this.oOtc === "266") {
				sap.ui.getCore().byId("STax").setVisible(true);
				sap.ui.getCore().byId("STax").addContent(s3Controller.oTaxCreateTable);
			}
			s3Controller.oTaxCreateTable.setGrowing(true);
			s3Controller.oTaxCreateTable.removeAllItems();
			s3Controller.oTaxCreateTable.setModel(oModel);
			s3Controller.oTaxCreateTable.bindItems('/results', oItemTaxTemp, '', '');
		}

		//Industry
		if (result.BP_Root.BP_IndustryRel.results !== undefined && result.BP_Root.BP_IndustryRel.results.length > 0) {
			oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
			oModel.setData(result.BP_Root.BP_IndustryRel);
			var oItemIndusTemp = this.IndusValueTemplate(oModel); //Get the template 
			if (s3Controller.oIndusCreateTable !== "") {
				s3Controller.oIndusCreateTable.destroy();
			} //Clear the fragment id's
			s3Controller.oIndusCreateTable = "";
			s3Controller.oIndusCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.IndustryTableCreate');

			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CIndustries").setVisible(true);
				sap.ui.getCore().byId("CIndustries").addContent(s3Controller.oIndusCreateTable);
			} else if (this.oOtc === "266") {
				sap.ui.getCore().byId("SIndustries").setVisible(true);
				sap.ui.getCore().byId("SIndustries").addContent(s3Controller.oIndusCreateTable);
			}
			s3Controller.oIndusCreateTable.setGrowing(true);
			s3Controller.oIndusCreateTable.removeAllItems();
			s3Controller.oIndusCreateTable.setModel(oModel);
			s3Controller.oIndusCreateTable.bindItems('/results', oItemIndusTemp, '', '');
		}

		//ERP Customer

		if (this.oOtc === "159") {
			if (result.BP_Root.CU_MultipleAssignmentsRel.results !== undefined && result.BP_Root.CU_MultipleAssignmentsRel.results.length > 0) {
				oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
				oModel.setData(result.BP_Root.CU_MultipleAssignmentsRel);

				var oItemErpCustTemp = this.ErpCustomerValueTemplate(oModel); //Get the template 
				if (s3Controller.oErpCustomerCreateTable !== "") {
					s3Controller.oErpCustomerCreateTable.destroy();
				} //Clear the fragment id's
				s3Controller.oErpCustomerCreateTable = "";
				s3Controller.oErpCustomerCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ERPCustomerCreate');

				sap.ui.getCore().byId("CErpCustomer").setVisible(true);
				sap.ui.getCore().byId("CErpCustomer").addContent(s3Controller.oErpCustomerCreateTable);

				s3Controller.oErpCustomerCreateTable.setGrowing(true);
				s3Controller.oErpCustomerCreateTable.removeAllItems();
				s3Controller.oErpCustomerCreateTable.setModel(oModel);

				oItemErpCustTemp.attachPress({
					EntityData: result.BP_Root.CU_MultipleAssignmentsRel.results,
					ChangeData: result.BP_Root.CU_MultipleAssignmentsRel.results,
					EntityName: 'ERPCustomer'
				}, s3Controller.navtoSubDetail, s3Controller);

				s3Controller.oErpCustomerCreateTable.bindItems('/results', oItemErpCustTemp, '', '');
			}
		}

		//ERP Supplier

		if (this.oOtc === "266") {
			if (result.BP_Root.SP_MultipleAssignmentsRel.results !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results.length > 0) {
				oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
				oModel.setData(result.BP_Root.SP_MultipleAssignmentsRel);

				var oItemErpSupplTemp = this.ErpSupplierValueTemplate(oModel); //Get the template 
				if (s3Controller.oErpSupplierCreateTable !== "") {
					s3Controller.oErpSupplierCreateTable.destroy();
				} //Clear the fragment id's
				s3Controller.oErpSupplierCreateTable = "";
				s3Controller.oErpSupplierCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ERPSupplierCreate');
				sap.ui.getCore().byId("SErpSupplier").setVisible(true);
				sap.ui.getCore().byId("SErpSupplier").addContent(s3Controller.oErpSupplierCreateTable);
				s3Controller.oErpSupplierCreateTable.setGrowing(true);
				s3Controller.oErpSupplierCreateTable.removeAllItems();
				s3Controller.oErpSupplierCreateTable.setModel(oModel);

				oItemErpSupplTemp.attachPress({
					EntityData: result.BP_Root.SP_MultipleAssignmentsRel.results,
					ChangeData: result.BP_Root.SP_MultipleAssignmentsRel.results,
					EntityName: 'ERPSupplier'
				}, s3Controller.navtoSubDetail, s3Controller);

				s3Controller.oErpSupplierCreateTable.bindItems('/results', oItemErpSupplTemp, '', '');
			}
		}

		//Addresses
		if (result.BP_Root.BP_AddressesRel.results !== undefined && result.BP_Root.BP_AddressesRel.results.length > 0) {
			oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(result.BP_Root.BP_AddressesRel);

			var addrUsgs = result.BP_Root.BP_AddressUsagesRel.results;
			for (var i = 0; i < addrUsgs.length; i++) {
				if (addrUsgs[i] !== undefined && addrUsgs[i].ADDRESSTYPE === "XXDEFAULT") {
					for (var j = 0; j < oModel.oData.results.length; j++) {
						if (oModel.oData.results[j].AD_ID == addrUsgs[i].AD_ID && oModel.oData.results[j].AD_ID__TXT === addrUsgs[j].AD_ID__TXT)
							oModel.oData.results[j].STANDARDADDRESS = "X";
					}
				}
			}

			var oAddressTemp = this.AddressTemplate(oModel);
			if (s3Controller.oAddressCreateTable !== "")
				s3Controller.oAddressCreateTable.destroy();
			s3Controller.oAddressCreateTable = "";
			s3Controller.oAddressCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.AddressesTableCreate');

			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CAddress").setVisible(true);
				sap.ui.getCore().byId("CAddress").addContent(s3Controller.oAddressCreateTable);
			} else if (this.oOtc === "266") {
				sap.ui.getCore().byId("SAddress").setVisible(true);
				sap.ui.getCore().byId("SAddress").addContent(s3Controller.oAddressCreateTable);
			}
			s3Controller.oAddressCreateTable.setGrowing(true);
			s3Controller.oAddressCreateTable.removeAllItems();
			s3Controller.oAddressCreateTable.setModel(oModel);
			if (this.oOtc === "159") {
				oAddressTemp.attachPress({
					EntityData: result.BP_Root.BP_AddressesRel.results,
					EntityName: 'Address',
					Domain: "Customer",
					ChangeData: result.BP_Root.BP_AddressesRel.results
				}, s3Controller.navtoSubDetail, s3Controller);
			} else if (this.oOtc === "266") {
				oAddressTemp.attachPress({
					EntityData: result.BP_Root.BP_AddressesRel.results,
					EntityName: 'Address',
					Domain: "Supplier",
					ChangeData: result.BP_Root.BP_AddressesRel.results
				}, s3Controller.navtoSubDetail, s3Controller);
			}
			s3Controller.oAddressCreateTable.bindItems('/results', oAddressTemp, '', '');
		}

		//Addresses Usages
		if (result.BP_Root.BP_AddressUsagesRel.results !== undefined && result.BP_Root.BP_AddressUsagesRel.results.length > 0) {
			oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(result.BP_Root.BP_AddressUsagesRel);

			var addrUsgs = result.BP_Root.BP_AddressUsagesRel.results;
			for (var i = 0; i < addrUsgs.length; i++) {
				if (addrUsgs[i] !== undefined && addrUsgs[i].ADDRESSTYPE === "XXDEFAULT") {
					oModel.oData.results[i].STANDARDADDRESSUSAGE = "X";
					oModel.oData.results[i].STANDARDADDRESSUSAGE__TXT = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
				}
			}

			var oAddressUsagesTemp = this.getAddrUsageTemplate(oModel);
			if (s3Controller.oAddressUsagesCreateTable !== "")
				s3Controller.oAddressUsagesCreateTable.destroy();
			s3Controller.oAddressUsagesCreateTable = "";
			s3Controller.oAddressUsagesCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.AddressUsagesTableCreate');

			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CAddressUsages").setVisible(true);
				sap.ui.getCore().byId("CAddressUsages").addContent(s3Controller.oAddressUsagesCreateTable);
			} else if (this.oOtc === "266") {
				sap.ui.getCore().byId("SAddressUsages").setVisible(true);
				sap.ui.getCore().byId("SAddressUsages").addContent(s3Controller.oAddressUsagesCreateTable);
			}
			s3Controller.oAddressUsagesCreateTable.setGrowing(true);
			s3Controller.oAddressUsagesCreateTable.removeAllItems();
			s3Controller.oAddressUsagesCreateTable.setModel(oModel);
			if (this.oOtc === "159") {
				oAddressUsagesTemp.attachPress({
					EntityData: result.BP_Root.BP_AddressUsagesRel.results,
					EntityName: 'AddressUsages',
					Domain: "Customer",
					ChangeData: result.BP_Root.BP_AddressUsagesRel.results
				}, s3Controller.navtoSubDetail, s3Controller);
			} else if (this.oOtc === "266") {
				oAddressUsagesTemp.attachPress({
					EntityData: result.BP_Root.BP_AddressUsagesRel.results,
					EntityName: 'AddressUsages',
					Domain: "Supplier",
					ChangeData: result.BP_Root.BP_AddressUsagesRel.results
				}, s3Controller.navtoSubDetail, s3Controller);
			}

			s3Controller.oAddressUsagesCreateTable.bindItems('/results', oAddressUsagesTemp, '', '');
		}
	},

	displayRelationship: function(result, s3Controller, vOTC, layoutId) {
		//			Relationships
		if (result.BP_Root.BP_RelationsRel.results !== undefined && result.BP_Root.BP_RelationsRel.results.length > 0) {
			var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
			var relation = result.BP_Root.BP_RelationsRel;
			var partner = result.BP_Root.PARTNER;
			for (var i = 0; i < relation.results.length; i++) {
				if (relation.results[i].PARTNER2 === partner) {
					relation.results[i].PARTNER2 = relation.results[i].PARTNER1;
				}
			}
			oModel.setData(relation);

			var oItemRelTemp = this.RelValueTemplate(oModel); //Get the template

			s3Controller.oRelCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.RelationsTableCreate');
			sap.ui.getCore().byId(layoutId).setVisible(true);
			sap.ui.getCore().byId(layoutId).addContent(s3Controller.oRelCreateTable);
			s3Controller.oRelCreateTable.setGrowing(true);
			s3Controller.oRelCreateTable.removeAllItems();
			s3Controller.oRelCreateTable.setModel(oModel);

			if (vOTC === "159") {
				oItemRelTemp.attachPress({
					EntityData: result.BP_Root.BP_RelationsRel.results,
					EntityName: 'BP_Relation',
					Domain: "Customer",
					ChangeData: result.BP_Root.BP_RelationsRel.results
				}, s3Controller.navtoSubDetail, s3Controller);
			} else if (vOTC === "266") {
				oItemRelTemp.attachPress({
					EntityData: result.BP_Root.BP_RelationsRel.results,
					EntityName: 'BP_Relation',
					Domain: "Supplier",
					ChangeData: result.BP_Root.BP_RelationsRel.results
				}, s3Controller.navtoSubDetail, s3Controller);
			}

			s3Controller.oRelCreateTable.bindItems('/results', oItemRelTemp, '', '');
		} else {
			this.showNodataRelMsg(vOTC);
		}
	},

	//Returns the subheader in case of multiple assignment of ERP customer. Sub header here is a combination of the ERP customer name along with the reason for the mutiple assignments.
	//In case of the standard assignment header is shown as ERP-Customer,STANDARD.
	getSubheader: function(standard, objid, reason) {
		var subheader = "";
		if (standard === 'X') {
			subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("erpcust") + "," + sap.ca.scfld.md.app.Application.getImpl()
				.getResourceBundle().getText("Standard");
		}
		if (standard !== 'X' && objid !== "" && reason !== "") {
			subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("erpcust") + " (" + objid + ")," + reason;
		}
		if (standard !== 'X' && objid !== "" && reason === "") {
			subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("erpcust") + " (" + objid + ")";
		}
		if (standard !== 'X' && objid === "" && reason !== "") {
			subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("erpcust") + "," + reason;
		}
		if (standard !== 'X' && objid === "" && reason === "") {
			subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("erpcust");
		}
		return subheader;
	},

	//		Role
	RoleValueTemplate: function(model) {
		var oItemRoleTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "PARTNERROLE",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("PARTNERROLE__TXT", ctx);
							var key = model.getProperty("PARTNERROLE", ctx);
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				})
			]
		});
		var extoItemRoleTemp = this.oS3Controller.custHookRoleValueTemplate(oItemRoleTemp);
		if (extoItemRoleTemp !== undefined) {
			oItemRoleTemp = extoItemRoleTemp;
		}

		return oItemRoleTemp;
	},

	//		Bank
	BankValueTemplate: function(model) {
		var oItemBankTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "BANK_CTRY__TXT",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("BANK_CTRY__TXT", ctx);
							var key = model.getProperty("BANK_CTRY", ctx);
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "BANK_NAME",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("BANK_NAME", ctx);
							var key = model.getProperty("BANK_KEY", ctx);
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "BANK_ACCT"
					}
				}),
				new sap.m.Text({
					text: {
						path: "BANKACCOUNTNAME",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				}),
				new sap.m.Text({
					text: {
						path: "BANKDETAILVALIDFROM",
						formatter: function() {
							var ctx = this.getBindingContext();
							var validFromDate = model.getProperty("BANKDETAILVALIDFROM", ctx);
							if (validFromDate === "" || validFromDate === undefined || validFromDate === null)
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							else
								return fcg.mdg.approvecrv2.util.Formatter.Date(validFromDate);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "BANKDETAILVALIDTO",
						formatter: function() {
							var ctx = this.getBindingContext();
							var validToDate = model.getProperty("BANKDETAILVALIDTO", ctx);
							if (validToDate === "" || validToDate === undefined || validToDate === null)
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							else
								return fcg.mdg.approvecrv2.util.Formatter.Date(validToDate);
						}
					}
				})
			]
		});

		var extoItemBankTemp = this.oS3Controller.custHookBankValueTemplate(oItemBankTemp);
		if (extoItemBankTemp !== undefined) {
			oItemBankTemp = extoItemBankTemp;
		}
		return oItemBankTemp;
	},

	//		Relations
	RelValueTemplate: function(model) {
		var oItemRelTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "RELATIONSHIPCATEGORY__TXT",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("RELATIONSHIPCATEGORY__TXT", ctx);
							var key = model.getProperty("RELATIONSHIPCATEGORY", ctx);
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "PARTNER2__TXT",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("PARTNER2__TXT", ctx);
							var key = model.getProperty("PARTNER2", ctx);
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
						//formatter: fcg.mdg.approvecrv2.util.Formatter.description
					}
				}),

				new sap.m.Text({
					text: {
						path: "DEFAULTRELATIONSHIP",
						formatter: function() {
							var ctx = this.getBindingContext();
							var status = model.getProperty("DEFAULTRELATIONSHIP", ctx);
							if (status === "X") {
								status = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
							} else {
								status = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NO");
							}
							return status;
						}
					}
				})
			]
		});
		var extoItemRelTemp = this.oS3Controller.custHookRelValueTemplate(oItemRelTemp);
		if (extoItemRelTemp !== undefined) {
			oItemRelTemp = extoItemRelTemp;
		}

		return oItemRelTemp;
	},

	//		Identification  
	IdentificationValueTemplate: function(model) {
		var that = this;
		var oItemIdentificationTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "IDENTIFICATIONTYPE__TXT"
					}
				}),

				new sap.m.Text({
					text: {
						path: "IDENTIFICATIONNUMBER"
					}
				}),

				new sap.m.Text({
					text: {
						path: "IDINSTITUTE",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				}),

				new sap.m.Text({
					text: {
						path: "IDENTRYDATE",
						formatter: function() {
							var ctx = this.getBindingContext();
							var entryDate = model.getProperty("IDENTRYDATE", ctx);
							if (entryDate === "" || entryDate === undefined || entryDate === null)
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							else {
								return fcg.mdg.approvecrv2.util.Formatter.Date(entryDate);
							}
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "COUNTRY__TXT",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("COUNTRY__TXT", ctx);
							var key = model.getProperty("COUNTRY", ctx);
							if (that.isNull(desc) && that.isNull(key))
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "REGION", //"CD_REGION/Description"
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("REGION__TXT", ctx);
							var key = model.getProperty("REGION", ctx);
							if (that.isNull(desc) && that.isNull(key))
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "IDVALIDFROMDATE",
						formatter: function() {
							var ctx = this.getBindingContext();
							var validFromDate = model.getProperty("IDVALIDFROMDATE", ctx);
							if (validFromDate === "" || validFromDate === undefined || validFromDate === null)
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							else
								return fcg.mdg.approvecrv2.util.Formatter.Date(validFromDate);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "IDVALIDTODATE",
						formatter: function() {
							var ctx = this.getBindingContext();
							var validToDate = model.getProperty("IDVALIDTODATE", ctx);
							if (validToDate === "" || validToDate === undefined || validToDate === null)
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							else {
								return fcg.mdg.approvecrv2.util.Formatter.Date(validToDate);
							}
						}
					}
				})
			]
		});

		var extoItemRelTemp = this.oS3Controller.custHookIdentificationValueTemplate(oItemIdentificationTemp);
		if (extoItemRelTemp !== undefined) {
			oItemIdentificationTemp = extoItemRelTemp;
		}
		return oItemIdentificationTemp;

	},

	//		Tax
	TaxValueTemplate: function(model) {
		var oItemTaxTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "TAXTYPE",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("TAXTYPE__TXT", ctx);
							var key = model.getProperty("TAXTYPE", ctx);
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}

				}),
				new sap.m.Text({
					text: {
						path: "TAXNUMBER"
					}
				})
			]
		});
		var extoItemRelTemp = this.oS3Controller.custHookTaxValueTemplate(oItemTaxTemp);
		if (extoItemRelTemp !== undefined) {
			oItemTaxTemp = extoItemRelTemp;
		}
		return oItemTaxTemp;
	},

	//		Indutry
	IndusValueTemplate: function(model) {
		var oItemIndusTemp = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "INDUSTRYSECTOR__TXT",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("INDUSTRYSECTOR__TXT", ctx);
							var key = model.getProperty("INDUSTRYSECTOR", ctx);
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {

						path: "DEFAULTINDUSTRYSECTOR",
						formatter: function() {
							var ctx = this.getBindingContext();
							var status = model.getProperty("DEFAULTINDUSTRYSECTOR", ctx);
							if (status === "X") {
								status = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
							} else {
								status = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NO");
							}
							return status;
						}
					}
				})
			]
		});
		var extoItemRelTemp = this.oS3Controller.custHookIndusValueTemplate(oItemIndusTemp);
		if (extoItemRelTemp !== undefined) {
			oItemIndusTemp = extoItemRelTemp;
		}
		return oItemIndusTemp;
	},

	//		ErpCustomer
	ErpCustomerValueTemplate: function(model) {
		var oItemErpCustTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "CU_AssignedCustomerRel/KUNNR",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				}),

				new sap.m.Text({
					text: {
						path: "CU_AssignedCustomerRel/KTOKD",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("CU_AssignedCustomerRel/KTOKD__TXT", ctx);
							var key = model.getProperty("CU_AssignedCustomerRel/KTOKD", ctx);
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "REASON_ID",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("REASON_ID__TXT", ctx);
							var key = model.getProperty("REASON_ID", ctx);
							if (key === "")
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							else if ((key !== "") && (desc === "" || desc === undefined || desc === null))
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "STANDARD",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("STANDARD", ctx);
							if (desc === "X") {
								var Y = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
								return Y;
							} else {
								var N = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
								return N;
							}
						}
					}
				})
			]
		});

		var extoItemRelTemp = this.oS3Controller.custHookErpCustomerValueTemplate(oItemErpCustTemp);
		if (extoItemRelTemp !== undefined) {
			oItemErpCustTemp = extoItemRelTemp;
		}

		return oItemErpCustTemp;
	},

	//		ErpSupplier
	ErpSupplierValueTemplate: function(model) {
		var oItemErpSupplTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "SP_AssignedSupplierRel/LIFNR",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				}),

				new sap.m.Text({
					text: {
						path: "SP_AssignedSupplierRel/KTOKK",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("SP_AssignedSupplierRel/KTOKK__TXT", ctx);
							var key = model.getProperty("SP_AssignedSupplierRel/KTOKK", ctx);
							if (key === "")
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "REASON_ID",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("REASON_ID__TXT", ctx);
							var key = model.getProperty("REASON_ID", ctx);
							if (key === "")
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							else if ((key !== "") && (desc === "" || desc === undefined || desc === null))
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "STANDARD",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("STANDARD", ctx);
							if (desc === "X") {
								var Y = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
								return Y;
							} else {
								var N = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
								return N;
							}
						}
					}
				})
			]
		});

		var extoItemRelTemp = this.oS3Controller.custHookErpCustomerValueTemplate(oItemErpSupplTemp);
		if (extoItemRelTemp !== undefined) {
			oItemErpSupplTemp = extoItemRelTemp;
		}

		return oItemErpSupplTemp;
	},

	AddressTemplate: function(model) {
		var oAddressTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "AD_ID__TXT",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				}),
				new sap.m.Text({
					text: {
						path: "COUNTRY__TXT",
						formatter: function() {
							var ctx = this.getBindingContext();
							var desc = model.getProperty("COUNTRY__TXT", ctx);
							var key = model.getProperty("COUNTRY", ctx);
							if (desc === "" || desc === undefined || desc === null)
								return key;
							else {
								var result = desc + ' (' + key + ')';
								return result;
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "STANDARDADDRESS",
						formatter: function() {
							var ctx = this.getBindingContext();
							var vStandard = model.getProperty("STANDARDADDRESS", ctx);
							if (vStandard === "X") {
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
							} else {
								vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NO");
							}
							return vStandard;
						}
					}
				})
			]
		});
		var extoItemRelTemp = this.oS3Controller.custHookAddressTemplate(oAddressTemp);
		if (extoItemRelTemp !== undefined) {
			oAddressTemp = extoItemRelTemp;
		}
		return oAddressTemp;
	},

	getAddrUsageTemplate: function(oModel) {
		var oThis = this;
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
						path: "AD_ID",
						formatter: function() {
							var address = oModel.getProperty("AD_ID__TXT", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "AD_ID");
							if (oThis.isNull(address))
								return fcg.mdg.approvecrv2.util.Formatter.noValue("");
							return address;
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
		var extoItemRelTemp = this.oS3Controller.custHookgetAddrUsageTemplate(oItemTemp);
		if (extoItemRelTemp !== undefined) {
			oItemTemp = extoItemRelTemp;
		}
		return oItemTemp;
	},

	showNodataRelMsg: function(vOTC) {
		if (this.text)
			this.text.destroy();
		this.text = new sap.m.Text("noRelDataCreate");
		this.text.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NodataCreate"));
		if (vOTC === "159") {
			sap.ui.getCore().byId("relPanel").removeAllContent();
			sap.ui.getCore().byId("relPanel").addContent(this.text);
		} else if (vOTC === "266") {
			sap.ui.getCore().byId("suppRelPanel").removeAllContent();
			sap.ui.getCore().byId("suppRelPanel").addContent(this.text);
		}
	},

	/*eslint radix: 2*/
	isNull: function(value) {
		return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || value === '' || parseInt(value) === 0;
	}

};