/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/* Here all the BP queries are included which are required to get the necessary changed data from the backend. 
 Once the query is successful then the corresponding entities
section will be filled with the data in the respective attributes.  */

jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.BPChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.util.BPQuery");

fcg.mdg.approvecrv2.DomainSpecParts.BPChange = {
	oChangetitle : "",
	oChangeauthorization : "",
	vAddrTabResults : {
		aAddressDetails : []
	},
	vAddrUsgResults : {
		aAddrUsages : []
	},
	oAddressItemTemp : "",
	aAddressUsages : [],
	vRelTabResults : {
		aRelDetails : []
	},
	oItemTempRel : "",
	aRelations : [],
	oS3Controller : "",
	getGeneralData : function(oCustomerModel, vPath, sDecisionQuery,
			s3Controller, vOTC) {
		this.oS3Controller = s3Controller;
		this.oOtc = vOTC;
		var vCompletePath = vPath;
		var vCommaSeperator = ',';

		var vChangeData = '/ChangeData';
		var vBasePath = 'BP_Root/';

		vCompletePath = fcg.mdg.approvecrv2.util.BPQuery.getBPQuery(
				vCompletePath, vCommaSeperator, vBasePath, vChangeData,
				this.oOtc);

		// Others
		vCompletePath = vCompletePath + this.getAddressData(oCustomerModel, vBasePath, s3Controller);
		// vCompletePath = vCompletePath + vCommaSeperator + 'Attachments';
		// vCompletePath = vCompletePath + vCommaSeperator + 'Notes';
		var extQuery = s3Controller.custHookChangeGenQuery(vCompletePath);
		if (extQuery !== undefined) {
			vCompletePath = extQuery;
		}
		return vCompletePath;
	},

	// Newly added to check the performance
	getRelationshipData : function(oCustomerModel, vPath, s3Controller, vOTC) {

		this.oS3Controller = s3Controller;
		this.oOtc = vOTC;

		// vCompletePath = vPath;
		var vCommaSeperator = ',';
		var vBasePath = 'BP_Root/';

		var vChangeData = '/ChangeData';

		// General section Queries
		var vCompletePath = fcg.mdg.approvecrv2.util.BPQuery
				.getBPRelationshipQuery(vPath, vCommaSeperator, vBasePath,
						vChangeData, s3Controller);
		return vCompletePath;
	},

	getAddressData : function(oCustomerModel, vBasePath, s3Controller) {
		this.oS3Controller = s3Controller;
		var vChangeData = '/ChangeData';
		var vCommaSeperator = ',';
		var vCompletePath = "";
		vBasePath = vBasePath + 'BP_AddressesRel/';

		// BP_AddressVersionsOrg
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_AddressVersionsOrgRel' + vChangeData;

		// BP_AddressVersionsPers
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_AddressVersionsPersRel' + vChangeData;

		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_AddressVersionsPersRel/BP_AddressPersonVersionRel'
				+ vChangeData;

		// BP_CommEMailRel
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_CommEMailRel' + vChangeData;// 11

		// BP_CommFax
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_CommFaxRel' + vChangeData;

		// BP_CommMobile
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_CommMobileRel' + vChangeData;// 13

		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_CommPhoneRel' + vChangeData;// 14
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_CommURIRel' + vChangeData;
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_StandardCommEMailRel' + vChangeData;
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_StandardCommFaxRel' + vChangeData;
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_StandardCommMobileRel' + vChangeData;
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_StandardCommPhoneRel' + vChangeData;
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_StandardCommURIRel' + vChangeData;
		vCompletePath = vCompletePath + vCommaSeperator + vBasePath
				+ 'BP_UsagesOfAddressRel' + vChangeData;
		var extQuery = s3Controller.custHookChangeAddressQuery(vCompletePath);
		if (extQuery !== undefined) {
			vCompletePath = extQuery;
		}
		return vCompletePath;
	},

	displayGeneralData : function(result, s3Controller, vOTC) {
		this.oOtc = vOTC;
		var GroupFlag = "";
		var AddrUsageFlag = "";
		var ErpCustFlag = "";
		var AddrFlag = "";
		var oModel = "";
		var i, j;
		var BankFlag = "";
		var TaxFlag = "";
		var vAttribute = "";

		if (result.BP_Root.TITLE_KEY__TXT !== undefined
				&& result.BP_Root.TITLE_KEY__TXT !== null)
			this.oChangetitle = fcg.mdg.approvecrv2.util.Formatter.description(
					result.BP_Root.TITLE_KEY, result.BP_Root.TITLE_KEY__TXT);

		if (result.BP_Root.AUTHORIZATIONGROUP__TXT !== undefined
				&& result.BP_Root.AUTHORIZATIONGROUP__TXT !== null)
			this.oChangeauthorization = fcg.mdg.approvecrv2.util.Formatter
					.description(result.BP_Root.AUTHORIZATIONGROUP);

		// BP Categories
		var bpOrganization = "2";
		var bpPerson = "1";
		var bpGroup = "3";
		var newValue = "";
		var oldValue = "";
		var newValueTxt = "";
		var oldValueTxt = "";
		var extoDataItems = "";
		var oDataItems = "";
		var OrgFlag = "";
		var newValueText = "";
		var oldValueText = "";
		var attribute, attrDesc;

		// Organization
		if (result.BP_Root.BP_OrganizationRel !== null
				&& result.BP_Root.BP_OrganizationRel.ChangeData !== undefined
				&& result.BP_Root.BP_OrganizationRel.ChangeData.results !== undefined
				&& result.BP_Root.CATEGORY === bpOrganization
				&& result.BP_Root.ChangeData.results !== undefined) {
			var strResults = "";
			var oItemTempOrg = this.getTableTemplate(); // Get the template
			strResults = {
				dataitems : []
			};
			if (result.BP_Root.BP_OrganizationRel.ChangeData.results.length > 0) {
				for (i = 0; i < result.BP_Root.BP_OrganizationRel.ChangeData.results.length; i++) {
					newValue = result.BP_Root.BP_OrganizationRel.ChangeData.results[i].NewValue;
					oldValue = result.BP_Root.BP_OrganizationRel.ChangeData.results[i].OldValue;
					newValueTxt = result.BP_Root.BP_OrganizationRel.ChangeData.results[i].NewValueText;
					oldValueTxt = result.BP_Root.BP_OrganizationRel.ChangeData.results[i].OldValueText;
					vAttribute = result.BP_Root.BP_OrganizationRel.ChangeData.results[i].Attribute;

					newValueText = this.getValue(newValue, newValueTxt,	vAttribute,"new");
					oldValueText = this.getValue(oldValue, oldValueTxt,	vAttribute,"old");
					var partnerDesc = result.BP_Root.DESCRIPTION ;
					var partner =  fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.BP_Root.PARTNER);
					var ctx =  fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(partner,partnerDesc);
					oDataItems = {
						"Context" : ctx,
						"EntityDesc" : result.BP_Root.BP_OrganizationRel.ChangeData.results[i].EntityDesc,
						"AttributeDesc" : result.BP_Root.BP_OrganizationRel.ChangeData.results[i].AttributeDesc,
						"NewValueText" : newValueText,
						"OldValue" : oldValueText,
						"ChangeKey" : result.BP_Root.BP_OrganizationRel.ChangeData.results[i].ChangeKey
					};
					extoDataItems = s3Controller.custHookChangeOrgData(result,
							this);
					if (extoDataItems !== undefined) {
						oDataItems = extoDataItems;
					}
					strResults.dataitems.push(oDataItems);
				}
			}

			if (result.BP_Root.ChangeData.results.length > 0) {
				for (i = 0; i < result.BP_Root.ChangeData.results.length; i++) {
					newValue = result.BP_Root.ChangeData.results[i].NewValue;
					oldValue = result.BP_Root.ChangeData.results[i].OldValue;
					newValueTxt = result.BP_Root.ChangeData.results[i].NewValueText;
					oldValueTxt = result.BP_Root.ChangeData.results[i].OldValueText;
					vAttribute = result.BP_Root.ChangeData.results[i].Attribute;

					newValueText = this.getValue(newValue, newValueTxt, vAttribute,"new");
					oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute,"old");
					
					var partnerDesc = result.BP_Root.DESCRIPTION;
					var partner =  fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.BP_Root.PARTNER);
					var ctx =  fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(partner,partnerDesc);
					oDataItems = {
						"Context" : ctx,
						"EntityDesc" : result.BP_Root.ChangeData.results[i].EntityDesc,
						"AttributeDesc" : result.BP_Root.ChangeData.results[i].AttributeDesc,
						"NewValueText" : newValueText,
						"OldValue" : oldValueText,
						"ChangeKey" : result.BP_Root.ChangeData.results[i].ChangeKey
					};
					extoDataItems = s3Controller.custHookOrgResChangeData(
							result, this, s3Controller);
					if (extoDataItems !== undefined) {
						oDataItems = extoDataItems;
					}
					strResults.dataitems.push(oDataItems);
				}
			}
			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CGeneral").removeAllContent();
			}
			if (this.oOtc === "266") {
				sap.ui.getCore().byId("SGeneral").removeAllContent();
			}
			s3Controller.oCommunicationTable = "";

			if (strResults.dataitems.length !== 0) {

				oModel = new sap.ui.model.json.JSONModel(); // Create a model
				// and set the 
				// result data in it
				oModel.setData(strResults);

				if (this.oOtc === "159") {
					oItemTempOrg.attachPress({
						EntityData : result.BP_Root,
						EntityName : 'BP_Organization',
						Domain : "Customer",
						ChangeData : strResults.dataitems
					}, s3Controller.navtoSubDetail, s3Controller);
				}
				if (this.oOtc === "266") {
					oItemTempOrg.attachPress({
						EntityData : result.BP_Root,
						EntityName : 'BP_Organization',
						Domain : "Supplier",
						ChangeData : strResults.dataitems
					}, s3Controller.navtoSubDetail, s3Controller);
				}

				s3Controller.oCommunicationTable = sap.ui.xmlfragment(
						'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);
				if (this.oOtc === "159") {
					sap.ui.getCore().byId("CGeneral").setVisible(true);
					sap.ui.getCore().byId("CGeneral").addContent(
							s3Controller.oCommunicationTable);
				}
				if (this.oOtc === "266") {
					sap.ui.getCore().byId("SGeneral").setVisible(true);
					sap.ui.getCore().byId("SGeneral").addContent(
							s3Controller.oCommunicationTable);
				}
				s3Controller.oCommunicationTable.setGrowing(true);
				s3Controller.oCommunicationTable.setModel(oModel);
				s3Controller.oCommunicationTable.bindItems('/dataitems',
						oItemTempOrg, '', '');
			} else {
				OrgFlag = "X";
			}
		} else {
			OrgFlag = "X";
		}

		// Person
		if (result.BP_Root.BP_PersonRel !== null
				&& result.BP_Root.BP_PersonRel.ChangeData !== undefined
				&& result.BP_Root.BP_PersonRel.ChangeData.results !== undefined
				&& result.BP_Root.CATEGORY === bpPerson
				&& result.BP_Root.ChangeData.results !== undefined) {
			var PersonFlag = "";
			var oItemTempPerson = this.getTableTemplate(); // Get the template
			strResults = {
				dataitems : []
			};
			if (result.BP_Root.BP_PersonRel.ChangeData.results.length > 0) {
				for (i = 0; i < result.BP_Root.BP_PersonRel.ChangeData.results.length; i++) {
					newValue = result.BP_Root.BP_PersonRel.ChangeData.results[i].NewValue;
					oldValue = result.BP_Root.BP_PersonRel.ChangeData.results[i].OldValue;
					newValueTxt = result.BP_Root.BP_PersonRel.ChangeData.results[i].NewValueText;
					oldValueTxt = result.BP_Root.BP_PersonRel.ChangeData.results[i].OldValueText;
					vAttribute = result.BP_Root.BP_PersonRel.ChangeData.results[i].Attribute;

					newValueText = this.getValue(newValue, newValueTxt,vAttribute,"new");
					oldValueText = this.getValue(oldValue, oldValueTxt,vAttribute,"old");
					var vAttributedesc = result.BP_Root.BP_PersonRel.ChangeData.results[i].AttributeDesc;
					attrDesc = fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(vAttribute,vAttributedesc);
					var partnerDesc = result.BP_Root.DESCRIPTION;
					var partner =  fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.BP_Root.PARTNER);
					var ctx =  fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(partner,partnerDesc);
					
					oDataItems = {
						"Context" : ctx,
						"EntityDesc" : result.BP_Root.BP_PersonRel.ChangeData.results[i].EntityDesc,
						"AttributeDesc" : attrDesc,
						"NewValueText" : newValueText,
						"OldValue" : oldValueText,
						"ChangeKey" : result.BP_Root.BP_PersonRel.ChangeData.results[i].ChangeKey
					};
					extoDataItems = s3Controller.custHookPersonChangeData(
							result, this);
					if (extoDataItems !== undefined) {
						oDataItems = extoDataItems;
					}
					strResults.dataitems.push(oDataItems);
				}
			}

			if (result.BP_Root.ChangeData.results.length > 0) {
				for (i = 0; i < result.BP_Root.ChangeData.results.length; i++) {
					newValue = result.BP_Root.ChangeData.results[i].NewValue;
					oldValue = result.BP_Root.ChangeData.results[i].OldValue;
					newValueTxt = result.BP_Root.ChangeData.results[i].NewValueText;
					oldValueTxt = result.BP_Root.ChangeData.results[i].OldValueText;
					vAttribute = result.BP_Root.ChangeData.results[i].Attribute;

					newValueText = this.getValue(newValue, newValueTxt,vAttribute,"new");
					oldValueText = this.getValue(oldValue, oldValueTxt,vAttribute,"old");

					var partnerDesc = result.BP_Root.DESCRIPTION;
					var partner =  fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.BP_Root.PARTNER);
					var ctx =  fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(partner,partnerDesc);
					oDataItems = {
						"Context" : ctx,
						"EntityDesc" : result.BP_Root.ChangeData.results[i].EntityDesc,
						"AttributeDesc" : result.BP_Root.ChangeData.results[i].AttributeDesc,
						"NewValueText" : newValueText,
						"OldValue" : oldValueText,
						"ChangeKey" : result.BP_Root.ChangeData.results[i].ChangeKey
					};
					extoDataItems = s3Controller.custHookPersonResChangeData(
							result, this);
					if (extoDataItems !== undefined) {
						oDataItems = extoDataItems;
					}
					strResults.dataitems.push(oDataItems);
				}
			}

			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CGeneral").removeAllContent();
			}
			if (this.oOtc === "266") {
				sap.ui.getCore().byId("SGeneral").removeAllContent();
			}
			s3Controller.oCommunicationTable = "";

			if (strResults.dataitems.length !== 0) {

				oModel = new sap.ui.model.json.JSONModel(); // Create a model
				// and set the
				// result data in it
				oModel.setData(strResults);

				if (this.oOtc === "159") {
					oItemTempPerson.attachPress({
						EntityData : result.BP_Root,
						EntityName : 'BP_Person',
						Domain : "Customer",
						ChangeData : strResults.dataitems
					}, s3Controller.navtoSubDetail, s3Controller);
				}

				if (this.oOtc === "266") {
					oItemTempPerson.attachPress({
						EntityData : result.BP_Root,
						EntityName : 'BP_Person',
						Domain : "Supplier",
						ChangeData : strResults.dataitems
					}, s3Controller.navtoSubDetail, s3Controller);
				}

				s3Controller.oCommunicationTable = sap.ui.xmlfragment(
						'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);
				if (this.oOtc === "159") {
					sap.ui.getCore().byId("CGeneral").setVisible(true);
					sap.ui.getCore().byId("CGeneral").addContent(
							s3Controller.oCommunicationTable);
				}
				if (this.oOtc === "266") {
					sap.ui.getCore().byId("SGeneral").setVisible(true);
					sap.ui.getCore().byId("SGeneral").addContent(
							s3Controller.oCommunicationTable);
				}
				s3Controller.oCommunicationTable.setGrowing(true);
				s3Controller.oCommunicationTable.setModel(oModel);
				s3Controller.oCommunicationTable.bindItems('/dataitems',
						oItemTempPerson, '', '');
			} else {
				PersonFlag = "X";
			}
		} else {
			PersonFlag = "X";
		}

		// Group
		if (result.BP_Root.BP_GroupRel !== null
				&& result.BP_Root.BP_GroupRel.ChangeData !== undefined
				&& result.BP_Root.BP_GroupRel.ChangeData.results !== undefined
				&& result.BP_Root.CATEGORY === bpGroup
				&& result.BP_Root.ChangeData.results !== undefined) {
			var oItemTempGroup = this.getTableTemplate(); // Get the template
			strResults = {
				dataitems : []
			};
			if (result.BP_Root.BP_GroupRel.ChangeData.results.length > 0) {
				for (i = 0; i < result.BP_Root.BP_GroupRel.ChangeData.results.length; i++) {
					newValue = result.BP_Root.BP_GroupRel.ChangeData.results[i].NewValue;
					oldValue = result.BP_Root.BP_GroupRel.ChangeData.results[i].OldValue;
					newValueTxt = result.BP_Root.BP_GroupRel.ChangeData.results[i].NewValueText;
					oldValueTxt = result.BP_Root.BP_GroupRel.ChangeData.results[i].OldValueText;
					vAttribute = result.BP_Root.BP_GroupRel.ChangeData.results[i].Attribute;
					
					newValueText = this.getValue(newValue, newValueTxt,vAttribute,"new");
					oldValueText = this.getValue(oldValue, oldValueTxt,vAttribute,"old");
					
					var partnerDesc = result.BP_Root.DESCRIPTION ;
					var partner =  fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.BP_Root.PARTNER);
					var ctx =  fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(partner,partnerDesc);
					oDataItems = {
						"Context" : ctx,
						"EntityDesc" : result.BP_Root.BP_GroupRel.ChangeData.results[i].EntityDesc,
						"AttributeDesc" : result.BP_Root.BP_GroupRel.ChangeData.results[i].AttributeDesc,
						"NewValueText" : newValueText,
						"OldValue" : oldValueText,
						"ChangeKey" : result.BP_Root.BP_GroupRel.ChangeData.results[i].ChangeKey
					};
					extoDataItems = s3Controller.custHookGroupChangeData(
							result, this);
					if (extoDataItems !== undefined) {
						oDataItems = extoDataItems;
					}
					strResults.dataitems.push(oDataItems);
				}
			}

			if (result.BP_Root.ChangeData.results.length > 0) {
				for (i = 0; i < result.BP_Root.ChangeData.results.length; i++) {
					newValue = result.BP_Root.ChangeData.results[i].NewValue;
					oldValue = result.BP_Root.ChangeData.results[i].OldValue;
					newValueTxt = result.BP_Root.ChangeData.results[i].NewValueText;
					oldValueTxt = result.BP_Root.ChangeData.results[i].OldValueText;
					vAttribute = result.BP_Root.ChangeData.results[i].Attribute;
					newValueText = this.getValue(newValue, newValueTxt,vAttribute,"new");
					oldValueText = this.getValue(oldValue, oldValueTxt,vAttribute,"old");
					
					var partnerDesc = result.BP_Root.DESCRIPTION ;
					var partner =  fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.BP_Root.PARTNER);
					var ctx =  fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(partner,partnerDesc);
					
					oDataItems = {
						"Context" :ctx,
						"EntityDesc" : result.BP_Root.ChangeData.results[i].EntityDesc,
						"AttributeDesc" : result.BP_Root.ChangeData.results[i].AttributeDesc,
						"NewValueText" : newValueText,
						"OldValue" : oldValueText,
						"ChangeKey" : result.BP_Root.ChangeData.results[i].ChangeKey
					};
					extoDataItems = s3Controller.custHookGroupResChangeData(
							result, this);
					if (extoDataItems !== undefined) {
						oDataItems = extoDataItems;
					}
					strResults.dataitems.push(oDataItems);
				}
			}

			if (this.oOtc === "159") {
				sap.ui.getCore().byId("CGeneral").removeAllContent();
			}
			if (this.oOtc === "266") {
				sap.ui.getCore().byId("SGeneral").removeAllContent();
			}
			s3Controller.oCommunicationTable = "";

			if (strResults.dataitems.length !== 0) {

				oModel = new sap.ui.model.json.JSONModel(); // Create a model
				// and set the
				// result data in it
				oModel.setData(strResults);

				if (this.oOtc === "159") {
					oItemTempGroup.attachPress({
						EntityData : result.BP_Root,
						EntityName : 'BP_Group',
						Domain : "Customer",
						ChangeData : strResults.dataitems
					}, s3Controller.navtoSubDetail, s3Controller);
				}
				
				if (this.oOtc === "266") {
					oItemTempGroup.attachPress({
						EntityData : result.BP_Root,
						EntityName : 'BP_Group',
						Domain : "Supplier",
						ChangeData : strResults.dataitems
					}, s3Controller.navtoSubDetail, s3Controller);
				}

				s3Controller.oCommunicationTable = sap.ui.xmlfragment(
						'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);
				if (this.oOtc === "159") {
					sap.ui.getCore().byId("CGeneral").setVisible(true);
					sap.ui.getCore().byId("CGeneral").addContent(
							s3Controller.oCommunicationTable);
				}
				if (this.oOtc === "266") {
					sap.ui.getCore().byId("SGeneral").setVisible(true);
					sap.ui.getCore().byId("SGeneral").addContent(
							s3Controller.oCommunicationTable);
				}
				s3Controller.oCommunicationTable.setGrowing(true);
				s3Controller.oCommunicationTable.setModel(oModel);
				s3Controller.oCommunicationTable.bindItems('/dataitems',
						oItemTempGroup, '', '');
			} else {
				GroupFlag = "X";
			}
		} else {
			GroupFlag = "X";
		}

		// Role
		if (result.BP_Root.BP_RolesRel !== null
				&& result.BP_Root.BP_RolesRel.results !== undefined
				&& result.BP_Root.BP_RolesRel.results.length !== 0) {
			var RoleFlag = "";
			var oItemTempRole = this.getTableTemplate(); // Get the template
			if (result.BP_Root.BP_RolesRel.results[0].ChangeData.results !== undefined) {
				strResults = {
					dataitems : []
				};
				for (i = 0; i < result.BP_Root.BP_RolesRel.results.length; i++) {
					for (j = 0; j < result.BP_Root.BP_RolesRel.results[i].ChangeData.results.length; j++) {
						newValue = result.BP_Root.BP_RolesRel.results[i].ChangeData.results[j].NewValue;
						oldValue = result.BP_Root.BP_RolesRel.results[i].ChangeData.results[j].OldValue;
						newValueTxt = result.BP_Root.BP_RolesRel.results[i].ChangeData.results[j].NewValueText;
						oldValueTxt = result.BP_Root.BP_RolesRel.results[i].ChangeData.results[j].OldValueText;
						vAttribute = result.BP_Root.BP_RolesRel.results[i].ChangeData.results[j].Attribute;
						newValueText = this.getValue(newValue, newValueTxt,vAttribute,"new");
						oldValueText = this.getValue(oldValue, oldValueTxt,vAttribute,"old");

						oDataItems = {
							"Context" : result.BP_Root.BP_RolesRel.results[i].ChangeData.results[j].Context,
							"EntityDesc" : result.BP_Root.BP_RolesRel.results[i].ChangeData.results[j].EntityDesc,
							"AttributeDesc" : result.BP_Root.BP_RolesRel.results[i].ChangeData.results[j].AttributeDesc,
							"NewValueText" : newValueText,
							"EntityAction" : result.BP_Root.BP_RolesRel.results[i].ChangeData.results[j].EntityAction,
							"OldValue" : oldValueText,
							"ChangeKey" : result.BP_Root.BP_RolesRel.results[i].ChangeData.results[j].ChangeKey
						};
						extoDataItems = s3Controller.custHookRoleChangeData(
								result, this);
						if (extoDataItems !== undefined) {
							oDataItems = extoDataItems;
						}
						strResults.dataitems.push(oDataItems);
					}

				}

				if (this.oOtc === "159") {
					sap.ui.getCore().byId("CRoles").removeAllContent();
				}
				if (this.oOtc === "266") {
					sap.ui.getCore().byId("SRoles").removeAllContent();
				}
				s3Controller.oRoleTable = "";

				if (strResults.dataitems.length !== 0) {
					if (this.oOtc === "159") {
						oItemTempRole.attachPress({
							EntityData : result.BP_Root.BP_RolesRel,
							EntityName : 'BP_Role',
							Domain : "Customer",
							ChangeData : strResults.dataitems
						}, s3Controller.navtoSubDetail, s3Controller);
					}
					if (this.oOtc === "266") {
						oItemTempRole.attachPress({
							EntityData : result.BP_Root.BP_RolesRel,
							EntityName : 'BP_Role',
							Domain : "Supplier",
							ChangeData : strResults.dataitems
						}, s3Controller.navtoSubDetail, s3Controller);
					}
					oModel = new sap.ui.model.json.JSONModel(); // Create a
					// model and set
					// the result
					// data in it
					oModel.setData(strResults);

					s3Controller.oRoleTable = sap.ui
							.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse');
					if (this.oOtc === "159") {
						sap.ui.getCore().byId("CRoles").setVisible(true);
						sap.ui.getCore().byId("CRoles").addContent(
								s3Controller.oRoleTable);
					}
					if (this.oOtc === "266") {
						sap.ui.getCore().byId("SRoles").setVisible(true);
						sap.ui.getCore().byId("SRoles").addContent(
								s3Controller.oRoleTable);
					}
					s3Controller.oRoleTable.setGrowing(true);
					var roleToolbar = new sap.m.Toolbar({
						content : [ new sap.m.Label({
							text : sap.ca.scfld.md.app.Application.getImpl()
									.getResourceBundle().getText("Roles"),
							design : "Bold"
						}) ]
					});
					s3Controller.oRoleTable.setHeaderToolbar(roleToolbar);
					s3Controller.oRoleTable.setModel(oModel);
					s3Controller.oRoleTable.bindItems('/dataitems',
							oItemTempRole, '', '');
				} else {
					RoleFlag = "X";
				}
			}
		} else {
			RoleFlag = "X";
		}

		// Bank
		if (result.BP_Root.BP_BankAccountsRel !== null
				&& result.BP_Root.BP_BankAccountsRel.results !== undefined
				&& result.BP_Root.BP_BankAccountsRel.results.length !== 0) {
			var oItemTempBank = this.getTableTemplate(); // Get the template
			if (result.BP_Root.BP_BankAccountsRel.results[0].ChangeData.results !== undefined) {
				strResults = {
					dataitems : []
				};
				for (i = 0; i < result.BP_Root.BP_BankAccountsRel.results.length; i++) {
					for (j = 0; j < result.BP_Root.BP_BankAccountsRel.results[i].ChangeData.results.length; j++) {
						newValue = result.BP_Root.BP_BankAccountsRel.results[i].ChangeData.results[j].NewValue;
						oldValue = result.BP_Root.BP_BankAccountsRel.results[i].ChangeData.results[j].OldValue;
						newValueTxt = result.BP_Root.BP_BankAccountsRel.results[i].ChangeData.results[j].NewValueText;
						oldValueTxt = result.BP_Root.BP_BankAccountsRel.results[i].ChangeData.results[j].OldValueText;
						vAttribute = result.BP_Root.BP_BankAccountsRel.results[i].ChangeData.results[j].Attribute;

						newValueText = this.getValue(newValue, newValueTxt, vAttribute,"new");
						oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute,"old");
						oDataItems = {
							"Context" : result.BP_Root.BP_BankAccountsRel.results[i].ChangeData.results[j].Context,
							"EntityDesc" : result.BP_Root.BP_BankAccountsRel.results[i].ChangeData.results[j].EntityDesc,
							"AttributeDesc" : result.BP_Root.BP_BankAccountsRel.results[i].ChangeData.results[j].AttributeDesc,
							"NewValueText" : newValueText,
							"OldValue" : oldValueText,
							"ChangeKey" : result.BP_Root.BP_BankAccountsRel.results[i].ChangeData.results[j].ChangeKey
						};
						extoDataItems = s3Controller.custHookBankChangeData(
								result, this);
						if (extoDataItems !== undefined) {
							oDataItems = extoDataItems;
						}
						strResults.dataitems.push(oDataItems);
					}
				}

				if (this.oOtc === "159") {
					sap.ui.getCore().byId("CBank").removeAllContent();
				}
				if (this.oOtc === "266") {
					sap.ui.getCore().byId("SBank").removeAllContent();
				}
				s3Controller.oBankTable = "";

				BankFlag = "";

				if (strResults.dataitems.length !== 0) {
					if (this.oOtc === "159") {
						oItemTempBank.attachPress({
							EntityData : result.BP_Root.BP_BankAccountsRel,
							EntityName : 'BP_BankAccount',
							Domain : "Customer",
							ChangeData : strResults.dataitems
						}, s3Controller.navtoSubDetail, s3Controller);
					}

					if (this.oOtc === "266") {
						oItemTempBank.attachPress({
							EntityData : result.BP_Root.BP_BankAccountsRel,
							EntityName : 'BP_BankAccount',
							Domain : "Supplier",
							ChangeData : strResults.dataitems
						}, s3Controller.navtoSubDetail, s3Controller);
					}

					oModel = new sap.ui.model.json.JSONModel(); // Create a
					// model and set
					// the result
					// data in it
					oModel.setData(strResults);

					s3Controller.oBankTable = sap.ui.xmlfragment(
							'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);
					if (this.oOtc === "159") {
						sap.ui.getCore().byId("CBank").setVisible(true);
						sap.ui.getCore().byId("CBank").addContent(
								s3Controller.oBankTable);
					}
					if (this.oOtc === "266") {
						sap.ui.getCore().byId("SBank").setVisible(true);
						sap.ui.getCore().byId("SBank").addContent(
								s3Controller.oBankTable);
					}
					s3Controller.oBankTable.setGrowing(true);
					var bankToolbar = new sap.m.Toolbar({
						content : [ new sap.m.Label({
							text : sap.ca.scfld.md.app.Application.getImpl()
									.getResourceBundle()
									.getText("BankAccounts"),
							design : "Bold"
						}) ]
					});
					s3Controller.oBankTable.setHeaderToolbar(bankToolbar);
					s3Controller.oBankTable.setModel(oModel);
					s3Controller.oBankTable.bindItems('/dataitems',
							oItemTempBank, '', '');
				} else {
					BankFlag = "X";
				}
			}
		} else {
			BankFlag = "X";
		}

		// Tax Numbers
		if (result.BP_Root.BP_TaxNumbersRel !== null
				&& result.BP_Root.BP_TaxNumbersRel.results !== undefined
				&& result.BP_Root.BP_TaxNumbersRel.results.length !== 0) {
			var oItemTempTax = this.getTableTemplate(); // Get the template
			if (result.BP_Root.BP_TaxNumbersRel.results[0].ChangeData.results !== undefined) {
				strResults = {
					dataitems : []
				};
				for (i = 0; i < result.BP_Root.BP_TaxNumbersRel.results.length; i++) {
					for (j = 0; j < result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results.length; j++) {
						newValue = result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results[j].NewValue;
						oldValue = result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results[j].OldValue;
						newValueTxt = result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results[j].NewValueText;
						oldValueTxt = result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results[j].OldValueText;
						vAttribute = result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results[j].Attribute;
						
						/* TAXNUMXL attribute is not available in webdynbro application so we removed here */
						if(vAttribute === "TAXNUMXL")
							continue;

						newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
						oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute, "old");

						oDataItems = {
							"Context" : result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results[j].Context,
							"EntityDesc" : result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results[j].EntityDesc,
							"AttributeDesc" : result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results[j].AttributeDesc,
							"EntityAction" : result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results[j].EntityAction,
							"NewValueText" : newValueText,
							"OldValue" : oldValueText,
							"ChangeKey" : result.BP_Root.BP_TaxNumbersRel.results[i].ChangeData.results[j].ChangeKey
						};
						extoDataItems = s3Controller.custHookTaxChangeData(
								result, this);
						if (extoDataItems !== undefined) {
							oDataItems = extoDataItems;
						}
						strResults.dataitems.push(oDataItems);
					}
				}

				if (this.oOtc === "159") {
					sap.ui.getCore().byId("CTax").removeAllContent();
				}
				if (this.oOtc === "266") {
					sap.ui.getCore().byId("STax").removeAllContent();
				}
				s3Controller.oTaxTable = "";

				TaxFlag = "";

				if (strResults.dataitems.length !== 0) {
					if (this.oOtc === "159") {
						oItemTempTax.attachPress({
							EntityData : result.BP_Root.BP_TaxNumbersRel,
							EntityName : 'BP_TaxNumber',
							Domain : "Customer",
							ChangeData : strResults.dataitems
						}, s3Controller.navtoSubDetail, s3Controller);
					}
					if (this.oOtc === "266") {
						oItemTempTax.attachPress({
							EntityData : result.BP_Root.BP_TaxNumbersRel,
							EntityName : 'BP_TaxNumber',
							Domain : "Supplier",
							ChangeData : strResults.dataitems
						}, s3Controller.navtoSubDetail, s3Controller);
					}

					oModel = new sap.ui.model.json.JSONModel(); // Create a
					// model and set
					// the result
					// data in it
					oModel.setData(strResults);

					s3Controller.oTaxTable = sap.ui.xmlfragment(
							'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);
					if (this.oOtc === "159") {
						sap.ui.getCore().byId("CTax").setVisible(true);
						sap.ui.getCore().byId("CTax").addContent(
								s3Controller.oTaxTable);
					}
					if (this.oOtc === "266") {
						sap.ui.getCore().byId("STax").setVisible(true);
						sap.ui.getCore().byId("STax").addContent(
								s3Controller.oTaxTable);
					}
					s3Controller.oTaxTable.setGrowing(true);
					var taxToolbar = new sap.m.Toolbar({
						content : [ new sap.m.Label({
							text : sap.ca.scfld.md.app.Application.getImpl()
									.getResourceBundle().getText("TaxNums"),
							design : "Bold"
						}) ]
					});
					s3Controller.oTaxTable.setHeaderToolbar(taxToolbar);
					s3Controller.oTaxTable.setModel(oModel);
					s3Controller.oTaxTable.bindItems('/dataitems',
							oItemTempTax, '', '');
				} else {
					TaxFlag = "X";
				}
			}
		} else {
			TaxFlag = "X";
		}

		// Identification Numbers
		if (result.BP_Root.BP_IdentificationNumbersRel !== null
				&& result.BP_Root.BP_IdentificationNumbersRel.results !== undefined
				&& result.BP_Root.BP_IdentificationNumbersRel.results.length !== 0) {
			var oItemTempIdenti = this.getTableTemplate(); // Get the template
			if (result.BP_Root.BP_IdentificationNumbersRel.results[0].ChangeData.results !== undefined) {
				strResults = {
					dataitems : []
				};
				for (i = 0; i < result.BP_Root.BP_IdentificationNumbersRel.results.length; i++) {
					for (j = 0; j < result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results.length; j++) {
						newValue = result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].NewValue;
						oldValue = result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].OldValue;
						newValueTxt = result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].NewValueText;
						oldValueTxt = result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].OldValueText;
						vAttribute = result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].Attribute;

						newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
						oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute, "old");

						if (result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].AttributeDesc === "Responsible Institn") {
							attribute = result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].AttributeDesc;
							attrDesc = fcg.mdg.approvecrv2.util.Formatter
									.getAttrbibuteDescription(attribute);
							result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].AttributeDesc = attrDesc;
						}

						oDataItems = {
							"Context" : result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].Context,
							"EntityDesc" : result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].EntityDesc,
							"AttributeDesc" : result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].AttributeDesc,
							"EntityAction" : result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].EntityAction,
							"NewValueText" : newValueText,
							"OldValue" : oldValueText,
							"ChangeKey" : result.BP_Root.BP_IdentificationNumbersRel.results[i].ChangeData.results[j].ChangeKey
						};
						extoDataItems = s3Controller
								.custHookIdentificationChangeData(result, this);
						if (extoDataItems !== undefined) {
							oDataItems = extoDataItems;
						}
						strResults.dataitems.push(oDataItems);
					}
				}

				if (this.oOtc === "159") {
					sap.ui.getCore().byId("CIdentification").removeAllContent();
				}
				if (this.oOtc === "266") {
					sap.ui.getCore().byId("SIdentification").removeAllContent();
				}
				s3Controller.oIdentificationTable = "";

				var IdentificationFlag = "";

				if (strResults.dataitems.length !== 0) {
					if (this.oOtc === "159") {
						oItemTempIdenti
								.attachPress(
										{
											EntityData : result.BP_Root.BP_IdentificationNumbersRel,
											EntityName : 'BP_IdentificationNumber',
											Domain : "Customer",
											ChangeData : strResults.dataitems
										}, s3Controller.navtoSubDetail,
										s3Controller);
					}

					if (this.oOtc === "266") {
						oItemTempIdenti
								.attachPress(
										{
											EntityData : result.BP_Root.BP_IdentificationNumbersRel,
											EntityName : 'BP_IdentificationNumber',
											Domain : "Supplier",
											ChangeData : strResults.dataitems
										}, s3Controller.navtoSubDetail,
										s3Controller);
					}

					oModel = new sap.ui.model.json.JSONModel(); // Create a
					// model and set
					// the result
					// data in it
					oModel.setData(strResults);
					s3Controller.oIdentificationTable = sap.ui.xmlfragment(
							'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);

					if (this.oOtc === "159") {
						sap.ui.getCore().byId("CIdentification").setVisible(
								true);
						sap.ui.getCore().byId("CIdentification").addContent(
								s3Controller.oIdentificationTable);
					}
					if (this.oOtc === "266") {
						sap.ui.getCore().byId("SIdentification").setVisible(
								true);
						sap.ui.getCore().byId("SIdentification").addContent(
								s3Controller.oIdentificationTable);
					}
					s3Controller.oIdentificationTable.setGrowing(true);
					var identiToolbar = new sap.m.Toolbar({
						content : [ new sap.m.Label({
							text : sap.ca.scfld.md.app.Application.getImpl()
									.getResourceBundle().getText("Identi"),
							design : "Bold"
						}) ]
					});
					s3Controller.oIdentificationTable
							.setHeaderToolbar(identiToolbar);
					s3Controller.oIdentificationTable.setModel(oModel);
					s3Controller.oIdentificationTable.bindItems('/dataitems',
							oItemTempIdenti, '', '');
				} else {
					IdentificationFlag = "X";
				}
			}
		} else {
			IdentificationFlag = "X";
		}

		// Industry
		if (result.BP_Root.BP_IndustryRel !== null
				&& result.BP_Root.BP_IndustryRel.results !== undefined
				&& result.BP_Root.BP_IndustryRel.results.length !== 0) {
			var IndustryFlag = "";
			var oItemTempIndus = this.getTableTemplate(); // Get the template
			if (result.BP_Root.BP_IndustryRel.results[0].ChangeData.results !== undefined) {
				strResults = {
					dataitems : []
				};
				for (i = 0; i < result.BP_Root.BP_IndustryRel.results.length; i++) {
					for (j = 0; j < result.BP_Root.BP_IndustryRel.results[i].ChangeData.results.length; j++) {
						newValue = result.BP_Root.BP_IndustryRel.results[i].ChangeData.results[j].NewValue;
						oldValue = result.BP_Root.BP_IndustryRel.results[i].ChangeData.results[j].OldValue;
						newValueTxt = result.BP_Root.BP_IndustryRel.results[i].ChangeData.results[j].NewValueText;
						oldValueTxt = result.BP_Root.BP_IndustryRel.results[i].ChangeData.results[j].OldValueText;
						vAttribute = result.BP_Root.BP_IndustryRel.results[i].ChangeData.results[j].Attribute;

						newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
						oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute, "old");
						oDataItems = {
							"Context" : result.BP_Root.BP_IndustryRel.results[i].ChangeData.results[j].Context,
							"EntityDesc" : result.BP_Root.BP_IndustryRel.results[i].ChangeData.results[j].EntityDesc,
							"AttributeDesc" : result.BP_Root.BP_IndustryRel.results[i].ChangeData.results[j].AttributeDesc,
							"EntityAction" : result.BP_Root.BP_IndustryRel.results[i].ChangeData.results[j].EntityAction,
							"NewValueText" : newValueText,
							"OldValue" : oldValueText,
							"ChangeKey" : result.BP_Root.BP_IndustryRel.results[i].ChangeData.results[j].ChangeKey
						};
						extoDataItems = s3Controller
								.custHookIndustryChangeData(result, this);
						if (extoDataItems !== undefined) {
							oDataItems = extoDataItems;
						}
						strResults.dataitems.push(oDataItems);
					}
				}

				if (this.oOtc === "159") {
					sap.ui.getCore().byId("CIndustries").removeAllContent();
				}
				if (this.oOtc === "266") {
					sap.ui.getCore().byId("SIndustries").removeAllContent();
				}
				s3Controller.oIndustryTable = "";

				if (strResults.dataitems.length !== 0) {
					if (this.oOtc === "159") {
						oItemTempIndus.attachPress({
							EntityData : result.BP_Root.BP_IndustryRel,
							EntityName : 'BP_Industry',
							Domain : "Customer",
							ChangeData : strResults.dataitems
						}, s3Controller.navtoSubDetail, s3Controller);
					} else if (this.oOtc === "266") {
						oItemTempIndus.attachPress({
							EntityData : result.BP_Root.BP_IndustryRel,
							EntityName : 'BP_Industry',
							Domain : "Supplier",
							ChangeData : strResults.dataitems
						}, s3Controller.navtoSubDetail, s3Controller);
					}

					oModel = new sap.ui.model.json.JSONModel(); // Create a
					// model and set
					// the result
					// data in it
					oModel.setData(strResults);

					s3Controller.oIndustryTable = sap.ui.xmlfragment(
							'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);
					if (this.oOtc === "159") {
						sap.ui.getCore().byId("CIndustries").setVisible(true);
						sap.ui.getCore().byId("CIndustries").addContent(
								s3Controller.oIndustryTable);
					} else if (this.oOtc === "266") {
						sap.ui.getCore().byId("SIndustries").setVisible(true);
						sap.ui.getCore().byId("SIndustries").addContent(
								s3Controller.oIndustryTable);
					}
					s3Controller.oIndustryTable.setGrowing(true);
					var industryToolbar = new sap.m.Toolbar({
						content : [ new sap.m.Label({
							text : sap.ca.scfld.md.app.Application.getImpl()
									.getResourceBundle().getText("Industries"),
							design : "Bold"
						}) ]
					});
					s3Controller.oIndustryTable
							.setHeaderToolbar(industryToolbar);
					s3Controller.oIndustryTable.setModel(oModel);
					s3Controller.oIndustryTable.bindItems('/dataitems',
							oItemTempIndus, '', '');
				} else {
					IndustryFlag = "X";
				}
			}
		} else {
			IndustryFlag = "X";
		}

		// Begin of Address Usages
		if (result.BP_Root.BP_AddressUsagesRel.results !== undefined
				&& result.BP_Root.BP_AddressUsagesRel.results.length !== 0) {
			if (result.BP_Root.BP_AddressUsagesRel.results[0].ChangeData.results !== undefined) {
				this.vAddrUsgResults.aAddrUsages = [];

				var addrUsgs = result.BP_Root.BP_AddressUsagesRel.results;
				for ( var i = 0; i < addrUsgs.length; i++) {
					if (addrUsgs[i] !== undefined
							&& addrUsgs[i].ADDRESSTYPE === "XXDEFAULT") {
						result.BP_Root.BP_AddressUsagesRel.results[i].STANDARDADDRESSUSAGE = 'X';
						result.BP_Root.BP_AddressUsagesRel.results[i].STANDARDADDRESSUSAGE__TXT = sap.ca.scfld.md.app.Application
								.getImpl().getResourceBundle()
								.getText("PC_YES");
					}
				}

				for (i = 0; i < result.BP_Root.BP_AddressUsagesRel.results.length; i++) {
					if (result.BP_Root.BP_AddressUsagesRel.results[i].ChangeData.results !== undefined
							&& result.BP_Root.BP_AddressUsagesRel.results[i].ChangeData.results.length !== 0) {
						this.vAddrUsgResults.aAddrUsages = this.vAddrUsgResults.aAddrUsages
								.concat(result.BP_Root.BP_AddressUsagesRel.results[i].ChangeData.results);
					}
					if (this.oOtc === "159") {
						sap.ui.getCore().byId("CAddressUsages")
								.removeAllContent();
					}
					if (this.oOtc === "266") {
						sap.ui.getCore().byId("SAddressUsages")
								.removeAllContent();
					}
					s3Controller.oAddressUsagesTable = "";
				}
			}
			if (this.vAddrUsgResults.aAddrUsages.length !== 0) {
				oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(this.vAddrUsgResults);

				s3Controller.oAddressUsagesTable = sap.ui.xmlfragment(
						'fcg.mdg.approvecrv2.frag.TablereuseNoMerge',
						s3Controller);
				if (this.oOtc === "159") {
					sap.ui.getCore().byId("CAddressUsages").setVisible(true);
					sap.ui.getCore().byId("CAddressUsages").addContent(
							s3Controller.oAddressUsagesTable);
				}
				if (this.oOtc === "266") {
					sap.ui.getCore().byId("SAddressUsages").setVisible(true);
					sap.ui.getCore().byId("SAddressUsages").addContent(
							s3Controller.oAddressUsagesTable);
				}
				s3Controller.oAddressUsagesTable.setGrowing(true);
				var addrusgToolbar = new sap.m.Toolbar({
					content : [ new sap.m.Label({
						text : sap.ca.scfld.md.app.Application.getImpl()
								.getResourceBundle().getText("AddressUsages"),
						design : "Bold"
					}) ]
				});
				s3Controller.oAddressUsagesTable
						.setHeaderToolbar(addrusgToolbar);
				// s3Controller.oAddressUsagesTable.setHeaderText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("AddressUsages"));
				s3Controller.oAddressUsagesTable.setModel(oModel);
				var oAddressUsagesItemTemp = this
						.getAddressTableTemplate(oModel);

				if (this.oOtc === "159") {
					oAddressUsagesItemTemp.attachPress({
						EntityData : result,
						EntityName : "AddressUsages",
						Domain : "Customer",
						ChangeData : this.vAddrUsgResults.aAddrUsages
					}, s3Controller.navtoSubDetail, s3Controller);
				}
				if (this.oOtc === "266") {
					oAddressUsagesItemTemp.attachPress({
						EntityData : result,
						EntityName : "AddressUsages",
						Domain : "Supplier",
						ChangeData : this.vAddrUsgResults.aAddrUsages
					}, s3Controller.navtoSubDetail, s3Controller);
				}
				s3Controller.oAddressUsagesTable.bindItems('/aAddrUsages',
						oAddressUsagesItemTemp, '', '');
			} else {
				AddrUsageFlag = "X";
			}
		} else {
			AddrUsageFlag = "X";
		}
		// End of Address Usages

		// erp Customer
		var oItemTempCust = "";
		var erpToolbar = "";
		if (this.oOtc === "159") {
			if (result.BP_Root.CU_MultipleAssignmentsRel.results !== undefined
					&& result.BP_Root.CU_MultipleAssignmentsRel.results.length !== 0) {
				oItemTempCust = this.getTableTemplate(); // Get the template
				strResults = {
					dataitems : []
				};
				for ( var i = 0; i < result.BP_Root.CU_MultipleAssignmentsRel.results.length; i++) {
					if (result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results !== undefined && result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results.length > 0){
						for (var m = 0; m < result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results.length; m++) {
							newValue = result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results[m].NewValue;
							oldValue = result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results[m].OldValue;
							newValueTxt = result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results[m].NewValueText;
							oldValueTxt = result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results[m].OldValueText;
							vAttribute = result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results[m].Attribute;
							newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
							oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute, "old");
							if(vAttribute!== ""){
							var cust =result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel; 
                            var erpVendorLabel = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERPCustomer");
                            var reasonLabel = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Reason");
                            var accgrpLabel = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("AccountGroup");
                            var standardLabel = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Standard");
                            var ctx ="";
                            
                            ctx = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(cust.KUNNR);
                            if(ctx !== "" && ctx !== 0)
                                  ctx  = erpVendorLabel + ": " + ctx;

                            if(result.BP_Root.CU_MultipleAssignmentsRel.results[i].REASON_ID__TXT !== "" ){
                                  if(ctx.length >0)
                                        ctx = ctx +", ";
                                  ctx = ctx + reasonLabel+": "+ result.BP_Root.CU_MultipleAssignmentsRel.results[i].REASON_ID__TXT;
                            }
                            
                            if(cust.KTOKD__TXT !== ""){
                                  if(ctx.length >0)
                                        ctx = ctx +", ";
                                  ctx = ctx + accgrpLabel +": " + cust.KTOKD__TXT + " ("+cust.KTOKD+")";
                            }
                            
                            if(result.BP_Root.CU_MultipleAssignmentsRel.results[i].STANDARD !== ""){
                                  if(ctx.length >0)
                                        ctx = ctx +", ";
                                  ctx = ctx + ', ' + standardLabel;
                            }

							
							oDataItems = {
								"Context" : ctx,
								"EntityDesc" : result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results[m].EntityDesc,
								"AttributeDesc" : result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results[m].AttributeDesc,
								"NewValueText" : newValueText,
								"OldValue" : oldValueText,
								"ChangeKey" : result.BP_Root.CU_MultipleAssignmentsRel.results[i].ChangeData.results[m].ChangeKey
							};
							strResults.dataitems.push(oDataItems);
							}
						}
					}
					if (result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel !== null) {
						for (j = 0; j < result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel.ChangeData.results.length; j++) {
							newValue = result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel.ChangeData.results[j].NewValue;
							oldValue = result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel.ChangeData.results[j].OldValue;
							newValueTxt = result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel.ChangeData.results[j].NewValueText;
							oldValueTxt = result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel.ChangeData.results[j].OldValueText;

							vAttribute = result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel.ChangeData.results[j].Attribute;
							newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
							oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute, "old");
							oDataItems = {
								"Context" : result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel.ChangeData.results[j].Context,
								"EntityDesc" : result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel.ChangeData.results[j].EntityDesc,
								"AttributeDesc" : result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel.ChangeData.results[j].AttributeDesc,
								"NewValueText" : newValueText,
								"OldValue" : oldValueText,
								"ChangeKey" : result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCustomerRel.ChangeData.results[j].ChangeKey
							};
							extoDataItems = s3Controller
									.custHookERPCustChangeData(result, this);
							if (extoDataItems !== undefined) {
								oDataItems = extoDataItems;
							}
							strResults.dataitems.push(oDataItems);
						}
					}
				}

				sap.ui.getCore().byId("CErpCustomer").removeAllContent();
				s3Controller.oErpCustomerTable = "";

				if (strResults.dataitems.length !== 0) {
					oItemTempCust.attachPress({
						EntityData : result.BP_Root.CU_MultipleAssignmentsRel,
						EntityName : 'ERPCustomer',
						Domain : "Customer",
						ChangeData : strResults.dataitems
					}, s3Controller.navtoSubDetail, s3Controller);

					oModel = new sap.ui.model.json.JSONModel(); // Create a
					// model and set
					// the result
					// data in it
					oModel.setData(strResults);

					s3Controller.oErpCustomerTable = sap.ui.xmlfragment(
							'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);
					sap.ui.getCore().byId("CErpCustomer").setVisible(true);
					sap.ui.getCore().byId("CErpCustomer").addContent(
							s3Controller.oErpCustomerTable);
					s3Controller.oErpCustomerTable.setGrowing(true);
					erpToolbar = new sap.m.Toolbar({
						content : [ new sap.m.Label({
							text : sap.ca.scfld.md.app.Application.getImpl()
									.getResourceBundle()
									.getText("ERPCustomers"),
							design : "Bold"
						}) ]
					});
					s3Controller.oErpCustomerTable.setHeaderToolbar(erpToolbar);
					s3Controller.oErpCustomerTable.setModel(oModel);
					s3Controller.oErpCustomerTable.bindItems('/dataitems',
							oItemTempCust, '', '');
				} else {
					ErpCustFlag = "X";
				}

			} else {
				ErpCustFlag = "X";
			}
		}

		// erp Supplier
		if (this.oOtc === "266") {
			if (result.BP_Root.SP_MultipleAssignmentsRel.results !== undefined
					&& result.BP_Root.SP_MultipleAssignmentsRel.results.length !== 0) {
				oItemTempCust = this.getERPVendorTableTemplate(); // Get the template
				strResults = {
					dataitems : []
				};
				var oBundle = sap.ca.scfld.md.app.Application.getImpl()
						.getResourceBundle();
				for ( var i = 0; i < result.BP_Root.SP_MultipleAssignmentsRel.results.length; i++) {

					// For Handling ERP Vendor Subranges

					// This for handling subranges
					if (result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel !== undefined) {
						if (result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results.length !== 0) {
							for (j = 0; j < result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results.length; j++) {
								for ( var k = 0; k < result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results[j].ChangeData.results.length; k++) {
									newValue = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results[j].ChangeData.results[k].NewValue;
									oldValue = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results[j].ChangeData.results[k].OldValue;
									newValueTxt = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results[j].ChangeData.results[k].NewValueText;
									oldValueTxt = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results[j].ChangeData.results[k].OldValueText;
									
									var vAttributedesc = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results[j].ChangeData.results[k].AttributeDesc;
									vAttribute = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results[j].ChangeData.results[k].Attribute;
									attrDesc = fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(vAttribute, vAttributedesc);
									newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
									oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute, "old");
                                    var vSplitContext =  result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results[j].ChangeData.results[k].Context;
									var vSplitContextArray = vSplitContext.split(";");
                                 var   vParentContext = vSplitContextArray[1];
                                 var vChildContext = vSplitContextArray[0];
									oDataItems = {
											"Context" : result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results[j].ChangeData.results[k].Context,
										"ChildContext": vChildContext,
										"EntityDesc" : oBundle.getText("SubRange"),
										"ChildEntityDesc" : oBundle.getText("SubRange"),
										"AttributeDesc" : attrDesc,
										"NewValueText" : newValueText,
										"OldValue" : oldValueText,
										"ChangeKey" : result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSubrangesRel.results[j].ChangeData.results[k].ChangeKey,
										"ParentContext":vParentContext,
										"ParentEntityDesc" : oBundle.getText("ERPSupplier"),
										"ParentEntityVisible" : true
									};
									extoDataItems = s3Controller.custHookERPCustChangeData(result, this);
									if (extoDataItems !== undefined) {
										oDataItems = extoDataItems;
									}
									strResults.dataitems.push(oDataItems);

								}
							}
						}

					}

					// End of Subranges

					
					//For entities like Reason
					
					if (result.BP_Root.SP_MultipleAssignmentsRel.results[i]){
						for (j = 0; j < result.BP_Root.SP_MultipleAssignmentsRel.results[i].ChangeData.results.length; j++) {
							
							newValue = result.BP_Root.SP_MultipleAssignmentsRel.results[i].ChangeData.results[j].NewValue;
							oldValue = result.BP_Root.SP_MultipleAssignmentsRel.results[i].ChangeData.results[j].OldValue;
							newValueTxt = result.BP_Root.SP_MultipleAssignmentsRel.results[i].ChangeData.results[j].NewValueText;
							oldValueTxt = result.BP_Root.SP_MultipleAssignmentsRel.results[i].ChangeData.results[j].OldValueText;
							var vAttributedesc = result.BP_Root.SP_MultipleAssignmentsRel.results[i].ChangeData.results[j].AttributeDesc;
							vAttribute = result.BP_Root.SP_MultipleAssignmentsRel.results[i].ChangeData.results[j].Attribute;
							attrDesc = fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(vAttribute,vAttributedesc);
							newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
							oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute, "old");
							if(vAttribute !== ""){
							var supp =result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel; 
							var erpVendorLabel = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERPSupplier");
							var reasonLabel = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Reason");
							var accgrpLabel = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("AccountGroup");
							var standardLabel = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Standard");
							var ctx ="";
							
							if(parseInt(supp.LIFNR)>0){
								if(ctx.length >0)
									ctx = ctx +", ";
								ctx  = ctx + erpVendorLabel + ": " + parseInt(supp.LIFNR);}

							if(result.BP_Root.SP_MultipleAssignmentsRel.results[i].REASON_ID__TXT !== "" ){
								if(ctx.length >0)
									ctx = ctx +", ";
							ctx = ctx + reasonLabel+": "+ result.BP_Root.SP_MultipleAssignmentsRel.results[i].REASON_ID__TXT;}
							
							if(supp.KTOKK__TXT !== ""){
								if(ctx.length >0)
									ctx = ctx +", ";
							ctx = ctx + accgrpLabel +": " + supp.KTOKK__TXT + " ("+supp.KTOKK+")";}
							
							if(result.BP_Root.SP_MultipleAssignmentsRel.results[i].STANDARD !== ""){
								if(ctx.length >0)
									ctx = ctx +", ";
								 ctx = ctx + ', ' + standardLabel;}
							
							oDataItems = {
									"Context" : ctx,
									"ChildContext":ctx,
									"EntityDesc" : result.BP_Root.SP_MultipleAssignmentsRel.results[i].ChangeData.results[j].EntityDesc,
									"ChildEntityDesc" : oBundle.getText("ERPSupplier"),
									"AttributeDesc" : attrDesc,
									"NewValueText" : newValueText,
									"OldValue" : oldValueText,
									"ChangeKey" : result.BP_Root.SP_MultipleAssignmentsRel.results[i].ChangeData.results[j].ChangeKey,
									"ParentContext":"",
									"ParentEntityDesc" : "",
									"ParentEntityVisible" : false
								};
							strResults.dataitems.push(oDataItems);
							}
						}
					}
					
					
					//End for reason
					
					
					if (result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel !== null) {
						for (j = 0; j < result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results.length; j++) {
							newValue = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results[j].NewValue;
							oldValue = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results[j].OldValue;
							newValueTxt = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results[j].NewValueText;
							oldValueTxt = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results[j].OldValueText;

							var vAttributedesc = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results[j].AttributeDesc;
							vAttribute = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results[j].Attribute;
							attrDesc = fcg.mdg.approvecrv2.util.Formatter
									.getAttrbibuteDescription(vAttribute,
											vAttributedesc);
							newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
							oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute, "old");
							if(vAttribute === 'KUNNR'){
								attrDesc = oBundle.getText("Debitor");
							}
							oDataItems = {
								"Context" : result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results[j].Context,
								"ChildContext": result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results[j].Context,
								"EntityDesc" : result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results[j].EntityDesc,
								"ChildEntityDesc" : oBundle.getText("ERPSupplier"),
								"AttributeDesc" : attrDesc,
								"NewValueText" : newValueText,
								"OldValue" : oldValueText,
								"ChangeKey" : result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.ChangeData.results[j].ChangeKey,
								"ParentContext":"",
								"ParentEntityDesc" : "",
								"ParentEntityVisible" : false
							    
							};
							extoDataItems = s3Controller
									.custHookERPCustChangeData(result, this);
							if (extoDataItems !== undefined) {
								oDataItems = extoDataItems;
							}
							strResults.dataitems.push(oDataItems);
						}
					}
				}

				sap.ui.getCore().byId("SErpSupplier").removeAllContent();
				s3Controller.oErpCustomerTable = "";

				if (strResults.dataitems.length !== 0) {
				

					oModel = new sap.ui.model.json.JSONModel(); // Create a
					// model and set
					// the result
					// data in it
					oModel.setData(strResults);
					oItemTempCust = this.getERPVendorTableTemplate(oModel); // Get the template
	            oItemTempCust.attachPress({
						EntityData : result.BP_Root.SP_MultipleAssignmentsRel,
						EntityName : 'ERPSupplier',
						Domain : "Supplier",
						ChangeData : strResults.dataitems
					}, s3Controller.navtoSubDetail, s3Controller);
					s3Controller.oErpCustomerTable = sap.ui.xmlfragment(
							'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);
					sap.ui.getCore().byId("SErpSupplier").setVisible(true);
					sap.ui.getCore().byId("SErpSupplier").addContent(
							s3Controller.oErpCustomerTable);
					s3Controller.oErpCustomerTable.setGrowing(true);
					erpToolbar = new sap.m.Toolbar({
						content : [ new sap.m.Label({
							text : sap.ca.scfld.md.app.Application.getImpl()
									.getResourceBundle().getText("ERPVendor"),
							design : "Bold"
						}) ]
					});
					s3Controller.oErpCustomerTable.setHeaderToolbar(erpToolbar);
					s3Controller.oErpCustomerTable.setModel(oModel);
					s3Controller.oErpCustomerTable.bindItems('/dataitems',
							oItemTempCust, '', '');
				} else {
					ErpCustFlag = "X";
				}

			} else {
				ErpCustFlag = "X";
			}
		}

		this.oAddressItemTemp = this.getAddressDetailTableTemplate();
		// Address
		if (s3Controller.oAddressTable === undefined
				|| s3Controller.oAddressTable === "") {
			s3Controller.oAddressTable = sap.ui.xmlfragment(
					'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);
		}
		this.vAddrTabResults.aAddressDetails = [];
		if (result.BP_Root.BP_AddressesRel.results !== undefined
				&& result.BP_Root.BP_AddressesRel.results.length !== 0) {
			for (i = 0; i < result.BP_Root.BP_AddressesRel.results.length; i++) {
				if (result.BP_Root.BP_AddressesRel.results[i].ChangeData.results !== undefined
						&& result.BP_Root.BP_AddressesRel.results[i].ChangeData.results.length !== 0) {
					this.vAddrTabResults.aAddressDetails = this.vAddrTabResults.aAddressDetails
							.concat(result.BP_Root.BP_AddressesRel.results[i].ChangeData.results);
				}
				if (result.BP_Root.BP_AddressesRel.results[i].BP_CommEMailRel.results !== undefined
						&& result.BP_Root.BP_AddressesRel.results[i].BP_CommEMailRel.results.length !== 0) {
					for (j = 0; j < result.BP_Root.BP_AddressesRel.results[i].BP_CommEMailRel.results.length; j++) {
						if (result.BP_Root.BP_AddressesRel.results[i].BP_CommEMailRel.results[j].ChangeData.results !== undefined
								&& result.BP_Root.BP_AddressesRel.results[i].BP_CommEMailRel.results[j].ChangeData.results.length !== 0) {
							this.vAddrTabResults.aAddressDetails = this.vAddrTabResults.aAddressDetails
									.concat(result.BP_Root.BP_AddressesRel.results[i].BP_CommEMailRel.results[j].ChangeData.results);
						}
					}
				}
				if (result.BP_Root.BP_AddressesRel.results[i].BP_CommFaxRel.results !== undefined
						&& result.BP_Root.BP_AddressesRel.results[i].BP_CommFaxRel.results.length !== 0) {
					for (j = 0; j < result.BP_Root.BP_AddressesRel.results[i].BP_CommFaxRel.results.length; j++) {
						if (result.BP_Root.BP_AddressesRel.results[i].BP_CommFaxRel.results[j].ChangeData.results !== undefined
								&& result.BP_Root.BP_AddressesRel.results[i].BP_CommFaxRel.results[j].ChangeData.results.length !== 0) {
							this.vAddrTabResults.aAddressDetails = this.vAddrTabResults.aAddressDetails
									.concat(result.BP_Root.BP_AddressesRel.results[i].BP_CommFaxRel.results[j].ChangeData.results);
						}
					}
				}
				if (result.BP_Root.BP_AddressesRel.results[i].BP_CommMobileRel.results !== undefined
						&& result.BP_Root.BP_AddressesRel.results[i].BP_CommMobileRel.results.length !== 0) {
					for (j = 0; j < result.BP_Root.BP_AddressesRel.results[i].BP_CommMobileRel.results.length; j++) {
						if (result.BP_Root.BP_AddressesRel.results[i].BP_CommMobileRel.results[j].ChangeData.results !== undefined
								&& result.BP_Root.BP_AddressesRel.results[i].BP_CommMobileRel.results[j].ChangeData.results.length !== 0) {
							this.vAddrTabResults.aAddressDetails = this.vAddrTabResults.aAddressDetails
									.concat(result.BP_Root.BP_AddressesRel.results[i].BP_CommMobileRel.results[j].ChangeData.results);
						}
					}
				}
				if (result.BP_Root.BP_AddressesRel.results[i].BP_CommPhoneRel.results !== undefined
						&& result.BP_Root.BP_AddressesRel.results[i].BP_CommPhoneRel.results.length !== 0) {
					for (j = 0; j < result.BP_Root.BP_AddressesRel.results[i].BP_CommPhoneRel.results.length; j++) {
						if (result.BP_Root.BP_AddressesRel.results[i].BP_CommPhoneRel.results[j].ChangeData.results !== undefined
								&& result.BP_Root.BP_AddressesRel.results[i].BP_CommPhoneRel.results[j].ChangeData.results.length !== 0) {
							this.vAddrTabResults.aAddressDetails = this.vAddrTabResults.aAddressDetails
									.concat(result.BP_Root.BP_AddressesRel.results[i].BP_CommPhoneRel.results[j].ChangeData.results);
						}
					}
				}
				if (result.BP_Root.BP_AddressesRel.results[i].BP_CommURIRel.results !== undefined
						&& result.BP_Root.BP_AddressesRel.results[i].BP_CommURIRel.results.length !== 0) {
					for (j = 0; j < result.BP_Root.BP_AddressesRel.results[i].BP_CommURIRel.results.length; j++) {
						if (result.BP_Root.BP_AddressesRel.results[i].BP_CommURIRel.results[j].ChangeData.results !== undefined
								&& result.BP_Root.BP_AddressesRel.results[i].BP_CommURIRel.results[j].ChangeData.results.length !== 0) {
							this.vAddrTabResults.aAddressDetails = this.vAddrTabResults.aAddressDetails
									.concat(result.BP_Root.BP_AddressesRel.results[i].BP_CommURIRel.results[j].ChangeData.results);
						}
					}
				}
				if (result.BP_Root.CATEGORY === "2"
						|| result.BP_Root.CATEGORY === "3") {
					if (result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsOrgRel.results !== undefined
							&& result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsOrgRel.results.length !== 0) {
						for (j = 0; j < result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsOrgRel.results.length; j++) {
							if (result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsOrgRel.results[j].ChangeData.results !== undefined
									&& result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsOrgRel.results[j].ChangeData.results.length !== 0) {
								this.vAddrTabResults.aAddressDetails = this.vAddrTabResults.aAddressDetails
										.concat(result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsOrgRel.results[j].ChangeData.results);
							}
						}
					}
				} else if (result.BP_Root.CATEGORY === "1") {
					if (result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results !== undefined
							&& result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results.length !== 0) {
						for (j = 0; j < result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results.length; j++) {
							if (result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results[j].ChangeData.results !== undefined
									&& result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results[j].ChangeData.results.length !== 0) {
								this.vAddrTabResults.aAddressDetails = this.vAddrTabResults.aAddressDetails
										.concat(result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results[j].ChangeData.results);
							}
							/** ************************************************************************************************************************************************************ */
							if (result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results[j].BP_AddressPersonVersionRel !== null) {
								if (result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results[j].BP_AddressPersonVersionRel.ChangeData.results !== undefined
										&& result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results[j].BP_AddressPersonVersionRel.ChangeData.results.length !== 0) {
									this.vAddrTabResults.aAddressDetails = this.vAddrTabResults.aAddressDetails
											.concat(result.BP_Root.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results[j].BP_AddressPersonVersionRel.ChangeData.results);
								}
							}
							/** **************************************************************************************************************************************************************** */
						}
					}
				}
			}
			// this.vAddrTabResults.aAddressDetails =
			// fcg.mdg.approvecrv2.util.Formatter.
			// ModifyAttributeDescriptions('Address',
			// this.vAddrTabResults.aAddressDetails);

			if (this.vAddrTabResults.aAddressDetails.length !== 0) {
				oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(this.vAddrTabResults);
				s3Controller.oAddressTable.setGrowing(true);

				if (this.oOtc === "159") {
					sap.ui.getCore().byId("CAddress").setVisible(true);
					sap.ui.getCore().byId("CAddress").addContent(
							s3Controller.oAddressTable);
				}
				if (this.oOtc === "266") {
					sap.ui.getCore().byId("SAddress").setVisible(true);
					sap.ui.getCore().byId("SAddress").addContent(
							s3Controller.oAddressTable);
				}

				var addrToolbar = new sap.m.Toolbar({
					content : [ new sap.m.Label({
						text : sap.ca.scfld.md.app.Application.getImpl()
								.getResourceBundle().getText("AddressDetails"),
						design : "Bold"
					}) ]
				});
				s3Controller.oAddressTable.setHeaderToolbar(addrToolbar);
				// s3Controller.oAddressTable.setHeaderText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("AddressDetails"));
				s3Controller.oAddressTable.setModel(oModel);
				this.oAddressItemTemp = this
						.getAddressDetailTableTemplate(oModel);

				if (this.oOtc === "159") {
					this.oAddressItemTemp.attachPress({
						EntityData : result,
						EntityName : "Address",
						Domain : "Customer",
						ChangeData : this.vAddrTabResults.aAddressDetails
					}, s3Controller.navtoSubDetail, s3Controller);
				}
				if (this.oOtc === "266") {
					this.oAddressItemTemp.attachPress({
						EntityData : result,
						EntityName : "Address",
						Domain : "Supplier",
						ChangeData : this.vAddrTabResults.aAddressDetails
					}, s3Controller.navtoSubDetail, s3Controller);
				}
				s3Controller.oAddressTable.bindItems('/aAddressDetails',
						this.oAddressItemTemp, '', '');
			} else {
				AddrFlag = "X";
			}
		} else {
			AddrFlag = "X";
		}
		// To display Nodata if data is not changed in general section
		if (OrgFlag === "X" && PersonFlag === "X" && GroupFlag === "X"
				&& RoleFlag === "X" && BankFlag === "X" && TaxFlag === "X"
				&& IdentificationFlag === "X" && IndustryFlag === "X"
				&& ErpCustFlag === "X" && AddrUsageFlag === "X"
				&& AddrFlag === "X") {
			this.showNoDataGenralMsg(this.oOtc);
			return;
		}
	},

	displayRelationshipData : function(result, s3Controller, vOTC, layoutId) {
		// Relations data in change scenarion S3 view
		if (result.BP_Root.BP_RelationsRel.results !== undefined
				&& result.BP_Root.BP_RelationsRel.results.length !== 0) {
			// get change table template
			this.oItemTempRel = this.getChangeTableTemplate(); // Get the
			// template

			this.vRelTabResults.aRelDetails = [];
			// loop at the result of bp relations
			for ( var i = 0; i < result.BP_Root.BP_RelationsRel.results.length; i++) {
				// check if contact person 1:1 entity exists
				if (result.BP_Root.BP_RelationsRel.results[i].BP_RelationContactPersonRel !== null) {
					// fill relation entity details
					if (result.BP_Root.BP_RelationsRel.results[i].ChangeData.results !== undefined
							&& result.BP_Root.BP_RelationsRel.results[i].ChangeData.results.length !== 0) {
						this.vRelTabResults.aRelDetails = this.vRelTabResults.aRelDetails
								.concat(result.BP_Root.BP_RelationsRel.results[i].ChangeData.results);
						this.aRelations = this.aRelations
								.concat(result.BP_Root.BP_RelationsRel.results[i]);
					}
					var sCPDetails = result.BP_Root.BP_RelationsRel.results[i].BP_RelationContactPersonRel;
					// check and fill change data results of contact person
					if (sCPDetails.ChangeData.results !== undefined
							&& sCPDetails.ChangeData.results.length !== 0) {
						// contact person changes
						this.vRelTabResults.aRelDetails = this.vRelTabResults.aRelDetails
								.concat(sCPDetails.ChangeData.results);
						this.aRelations = this.aRelations.concat(sCPDetails);
					}

					// check and fill the workplace address change data
					if (sCPDetails.BP_ContactPersonWorkplacesRel.results !== undefined
							&& sCPDetails.BP_ContactPersonWorkplacesRel.results.length !== 0) {
						for ( var j = 0; j < sCPDetails.BP_ContactPersonWorkplacesRel.results.length; j++) {
							if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].ChangeData.results !== undefined
									&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].ChangeData.results.length !== 0) {
								this.vRelTabResults.aRelDetails = this.vRelTabResults.aRelDetails
										.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].ChangeData.results);
								this.aRelations = this.aRelations
										.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j]);
							}
							// check for workplace address email change data
							if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results !== undefined
									&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results.length !== 0) {
								for ( var z = 0; z < sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results.length; z++) {
									if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results[z].ChangeData.results !== undefined
											&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results[z].ChangeData.results.length !== 0) {
										this.vRelTabResults.aRelDetails = this.vRelTabResults.aRelDetails
												.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results[z].ChangeData.results);
										this.aRelations = this.aRelations
												.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results[z]);
									}
								}
							}
							// check for workplace address phones change data
							if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results !== undefined
									&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results.length !== 0) {
								for (z = 0; z < sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results.length; z++) {
									if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results[z].ChangeData.results !== undefined
											&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results[z].ChangeData.results.length !== 0) {
										this.vRelTabResults.aRelDetails = this.vRelTabResults.aRelDetails
												.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results[z].ChangeData.results);
										this.aRelations = this.aRelations
												.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results[z]);
									}

								}
							}
							// check for workplace adderss mobile change data
							if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results !== undefined
									&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results.length !== 0) {
								for (z = 0; z < sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results.length; z++) {
									if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results[z].ChangeData.results !== undefined
											&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results[z].ChangeData.results.length !== 0) {
										this.vRelTabResults.aRelDetails = this.vRelTabResults.aRelDetails
												.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results[z].ChangeData.results);
										this.aRelations = this.aRelations
												.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results[z]);
									}
								}
							}

							// check for workplace address URI change data
							if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results !== undefined
									&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results.length !== 0) {
								for (z = 0; z < sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results.length; z++) {
									if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results[z].ChangeData.results !== undefined
											&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results[z].ChangeData.results.length !== 0) {
										this.vRelTabResults.aRelDetails = this.vRelTabResults.aRelDetails
												.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results[z].ChangeData.results);
										this.aRelations = this.aRelations
												.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results[z]);
									}
								}

							}

							// check for workplace Fax data
							if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results !== undefined
									&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results.length !== 0) {
								for (z = 0; z < sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results.length; z++) {
									if (sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results[z].ChangeData.results !== undefined
											&& sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results[z].ChangeData.results.length !== 0) {
										this.vRelTabResults.aRelDetails = this.vRelTabResults.aRelDetails
												.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results[z].ChangeData.results);
										this.aRelations = this.aRelations
												.concat(sCPDetails.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results[z]);
									}

								}
							}
						}
					}
				}// close contact person
				else {
					// fill relation entity details
					if (result.BP_Root.BP_RelationsRel.results[i].ChangeData.results !== undefined
							&& result.BP_Root.BP_RelationsRel.results[i].ChangeData.results.length !== 0) {
						this.vRelTabResults.aRelDetails = this.vRelTabResults.aRelDetails
								.concat(result.BP_Root.BP_RelationsRel.results[i].ChangeData.results);
						this.aRelations = this.aRelations
								.concat(result.BP_Root.BP_RelationsRel.results[i]);
					}
				}

			}// close of relation

			if (this.vRelTabResults.aRelDetails.length !== 0) {
				var oModel = new sap.ui.model.json.JSONModel(); // Create a
				// model and set the result data in it
				oModel.setData(this.vRelTabResults);

				s3Controller.oRelTable = sap.ui.xmlfragment(
						'fcg.mdg.approvecrv2.frag.Tablereuse', s3Controller);
				sap.ui.getCore().byId(layoutId).setVisible(true);
				sap.ui.getCore().byId(layoutId).addContent(s3Controller.oRelTable);
				s3Controller.oRelTable.setGrowing(true);
				s3Controller.oRelTable.setModel(oModel);

				this.oItemTempRel = this.getChangeTableTemplate(oModel);
				if (vOTC === "159") {
					this.oItemTempRel.attachPress({
						EntityData : this.aRelations,
						EntityName : 'BP_Relation',
						Domain : "Customer",
						ChangeData : this.vRelTabResults.aRelDetails
					}, s3Controller.navtoSubDetail, s3Controller);
				} else {
					this.oItemTempRel.attachPress({
						EntityData : this.aRelations,
						EntityName : 'BP_Relation',
						Domain : "Supplier",
						ChangeData : this.vRelTabResults.aRelDetails
					}, s3Controller.navtoSubDetail, s3Controller);
				}
				s3Controller.oRelTable.bindItems('/aRelDetails',
						this.oItemTempRel, '', '');
			} else {
				this.showNodataRelMsg(this.oOtc);
			}
		} else {
			this.showNodataRelMsg(this.oOtc);
		}
	},
    getERPVendorTableTemplate: function(){
			var oItemTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				        new sap.m.VBox({
				        items : [
				        new sap.m.ObjectIdentifier({
				        	text:"{ChildEntityDesc}",
				        	title:"{ChildContext}" 
				        }).addStyleClass("objectIdentifier_text"),
				        new sap.m.ObjectIdentifier({
				        	text:"{ParentEntityDesc}",
				        	title:"{ParentContext}" ,
				        	visible : "{ParentEntityVisible}"
				        }).addStyleClass("objIdentifier_margin").addStyleClass("objectIdentifier_text")
				        ]
				        }),

				        new sap.m.ObjectIdentifier({
				        	text: {
				        		path: "AttributeDesc"          
				        	},

				        	title: {
				        		path: "NewValueText"          
				        	}

				        }), 

				        new sap.m.Text({
				        	text:{
				        		path:"OldValue"
				        	}
				        })                        
				        ]});


			return oItemTemp;
		},
	getTableTemplate : function() {
		var oItemTemp = new sap.m.ColumnListItem({
			type : "Navigation",
			cells : [ new sap.m.Text({
				text : {
					path : "Context"
				}
			}),

			new sap.m.ObjectIdentifier({
				text : {
					path : "AttributeDesc"
				},

				title : {
					path : "NewValueText"
				}

			}),

			new sap.m.Text({
				text : {
					path : "OldValue"
				}
			}) ]
		});
		var extoItemTemp = this.oS3Controller
				.custHookgetTableTemplate(oItemTemp);
		if (extoItemTemp !== undefined) {
			oItemTemp = extoItemTemp;
		}

		return oItemTemp;
	},
	getAddressTableTemplate : function(oModel) {
		var oItemTemp = new sap.m.ColumnListItem({
			type : "Navigation",
			cells : [
					new sap.m.ObjectIdentifier({
						text : {
							path : "EntityDesc"
						},
						title : {
							path : "Context"
						}
					}),
					new sap.m.ObjectIdentifier({
						text : {
							path : "AttributeDesc",
							formatter : function() {
								var ctx = this.getBindingContext();
								var attribute = oModel.getProperty("Attribute",
										ctx);
								var attrDesc = oModel.getProperty(
										"AttributeDesc", ctx);
								return fcg.mdg.approvecrv2.util.Formatter
										.getAttrbibuteDescription(attribute,
												attrDesc);
							}
						},
						title : {
							path : "NewValueText",
							formatter : function() {
								var ctx = this.getBindingContext();
								var vNewVal = oModel.getProperty("NewValue",
										ctx);
								var vNewValTxt = oModel.getProperty(
										"NewValueText", ctx);
								if (vNewVal === 'X')
									return sap.ca.scfld.md.app.Application
											.getImpl().getResourceBundle()
											.getText("PC_YES");
								else if (vNewValTxt !== '' && vNewVal !== '')
									return vNewValTxt + ' (' + vNewVal + ')';
								else if (vNewVal === '' && vNewValTxt !== '')
									return vNewValTxt;
								else
									return vNewVal;
							}
						}
					}),
					new sap.m.Text({
						text : {
							path : "OldValue",
							formatter : function() {
								var ctx = this.getBindingContext();
								var vOldVal = oModel.getProperty("OldValue",
										ctx);
								var vOldValTxt = oModel.getProperty(
										"OldValueText", ctx);
								if (vOldVal === 'X')
									return sap.ca.scfld.md.app.Application
											.getImpl().getResourceBundle()
											.getText("PC_YES");
								else if (vOldValTxt !== '' && vOldVal !== '')
									return vOldValTxt + ' (' + vOldVal + ')';
								else if (vOldVal === '' && vOldValTxt !== '')
									return vOldValTxt;
								else
									return vOldVal;
							}
						}
					}) ]
		});

		var extoItemTemp = this.oS3Controller
				.custHookgetAddressTableTemplate(oItemTemp);
		if (extoItemTemp !== undefined) {
			oItemTemp = extoItemTemp;
		}

		return oItemTemp;
	},
	getAddressDetailTableTemplate : function(oModel) {
		var oItemTemp = new sap.m.ColumnListItem(
				{
					type : "Navigation",
					cells : [
							new sap.m.VBox(
									{
										items : [
												new sap.m.ObjectIdentifier(
														{
															text : {
																path : "EntityDesc"

															},
															title : {
																path : "Context",
																formatter : function() {
																	var ctx = this
																			.getBindingContext();

																	var vEntityDesc = oModel
																			.getProperty(
																					"Context",
																					ctx);
																	if (vEntityDesc !== undefined
																			&& vEntityDesc
																					.indexOf(";") > -1) {
																		var vEntityDescArray = vEntityDesc
																				.split(";");
																		vEntityDesc = vEntityDescArray[0];

																		return vEntityDesc;
																	} else {
																		return vEntityDesc;
																	}
																}
															}
														}).addStyleClass("objectIdentifier_text"),
												new sap.m.ObjectIdentifier(
														{
															text : {
																path : "Context",
																formatter : function() {
																	var ctx = this
																			.getBindingContext();

																	var vEntityDesc = oModel
																			.getProperty(
																					"Context",
																					ctx);
																	if (vEntityDesc !== undefined
																			&& vEntityDesc
																					.indexOf(";") > -1) {
																		var vEntityDescArray = vEntityDesc
																				.split(";");
																		if (vEntityDescArray.length > 1) {
																			vEntityDesc = vEntityDescArray[1];
																			var vEntityAttrArray = vEntityDescArray[1]
																					.split(":");

																			return vEntityAttrArray[0];
																		} else {
																			return "";
																		}
																	} else {
																		return "";
																	}
																}
															},
															title : {
																path : "Context",
																formatter : function() {
																	var ctx = this
																			.getBindingContext();

																	var vEntityDesc = oModel
																			.getProperty(
																					"Context",
																					ctx);
																	if (vEntityDesc !== undefined
																			&& vEntityDesc
																					.indexOf(";") > -1) {
																		var vEntityDescArray = vEntityDesc
																				.split(";");
																		if (vEntityDescArray.length > 1) {
																			vEntityDesc = vEntityDescArray[1];
																			var vEntityAttrArray = vEntityDescArray[1]
																					.split(":");

																			return vEntityAttrArray[1];
																		} else {
																			return "";
																		}
																	} else {
																		return "";
																	}
																}
															},
															visible : {
																path : "Context",
																formatter : function() {
																	var ctx = this
																			.getBindingContext();

																	var vEntityDesc = oModel
																			.getProperty(
																					"Context",
																					ctx);
																	if (vEntityDesc !== undefined
																			&& vEntityDesc
																					.indexOf(";") > -1) {
																		var vEntityDescArray = vEntityDesc
																				.split(";");
																		if (vEntityDescArray.length > 1) {

																			return true;
																		} else {
																			return false;
																		}
																	} else {
																		return false;
																	}
																}
															}
														}).addStyleClass("objIdentifier_margin").addStyleClass("objectIdentifier_text") ]
									}),
							new sap.m.ObjectIdentifier(
									{
										text : {
											path : "AttributeDesc"
										},
										title : {
											path : "NewValueText",
											formatter : function() {
												var ctx = this
														.getBindingContext();
												var vNewVal = oModel
														.getProperty(
																"NewValue", ctx);
												var vNewValTxt = oModel
														.getProperty(
																"NewValueText",
																ctx);
												if (vNewVal === 'X')
													return sap.ca.scfld.md.app.Application
															.getImpl()
															.getResourceBundle()
															.getText("PC_YES");
												else if (vNewValTxt !== ''
														&& vNewVal !== '')
													return vNewValTxt + ' ('
															+ vNewVal + ')';
												else if (vNewVal === ''
														&& vNewValTxt !== '')
													return vNewValTxt;
												else
													return vNewVal;
											}
										}
									}),
							new sap.m.Text(
									{
										text : {
											path : "OldValue",
											formatter : function() {
												var ctx = this
														.getBindingContext();
												var vOldVal = oModel
														.getProperty(
																"OldValue", ctx);
												var vOldValTxt = oModel
														.getProperty(
																"OldValueText",
																ctx);
												if (vOldVal === 'X')
													return sap.ca.scfld.md.app.Application
															.getImpl()
															.getResourceBundle()
															.getText("PC_YES");
												else if (vOldValTxt !== ''
														&& vOldVal !== '')
													return vOldValTxt + ' ('
															+ vOldVal + ')';
												else if (vOldVal === ''
														&& vOldValTxt !== '')
													return vOldValTxt;
												else
													return vOldVal;
											}
										}
									}) ]
				});

		var extoItemTemp = this.oS3Controller
				.custHookgetAddressTableTemplate(oItemTemp);
		if (extoItemTemp !== undefined) {
			oItemTemp = extoItemTemp;
		}

		return oItemTemp;
	},
	// get change template
	getChangeTableTemplate : function(oModel) {
		var oItemTemp = new sap.m.ColumnListItem(
			{
				type : "Navigation",
				cells : [
					new sap.m.VBox({
						items : [
							new sap.m.ObjectIdentifier({
								text : {
									path : "EntityDesc",
									formatter : function() {
										var ctx = this.getBindingContext();	
										var vEntityDesc = oModel.getProperty("EntityDesc",ctx);
										if (vEntityDesc !== undefined && vEntityDesc.indexOf(":") > -1) {
											var vEntityDescArray = vEntityDesc.split(":");
												vEntityDesc = vEntityDescArray[1];	
												return vEntityDesc;
											} else {	
												return vEntityDesc;	
											}
										}
									},
								title : {
									path : "Context",
									formatter : function() {
										var ctx = this.getBindingContext();	
										var vEntityDesc = oModel.getProperty("Context", ctx);
										var vEntityDescText = oModel .getProperty("EntityDesc", ctx);
										if (vEntityDesc !== undefined && vEntityDesc.indexOf(":") > -1) {
											var vEntityDescArray = vEntityDesc.split(":");
											if (vEntityDescArray[0].indexOf("(") > -1 && vEntityDescArray[0].indexOf(")") > -1) {
												var vContext = vEntityDescArray[0].substring(vEntityDescArray[0].indexOf("(") + 1, vEntityDescArray[0].indexOf(")"));
												return vContext;
											} else {
												return vEntityDescArray[0];
											}
										} else {
											if (vEntityDescText === "Contact Person") {
												if (vEntityDesc !== undefined && vEntityDesc.indexOf("/") > -1) {
													var vEntityDescArray = vEntityDesc.substring(vEntityDesc.indexOf("/") + 1, vEntityDesc.length)
													+ " ;Relationship : " + vEntityDesc.substring(0, vEntityDesc.indexOf("/"));
													return vEntityDescArray;
												} else {
													return vEntityDesc;
												}
											} else {
												return vEntityDesc;
											}
										}
									}
								}
							}).addStyleClass("objectIdentifier_text"),
							new sap.m.ObjectIdentifier({
								text : {
									path : "EntityDesc",
									formatter : function() {
										var ctx = this.getBindingContext();	
										var vEntityDesc = oModel.getProperty("EntityDesc", ctx);
										if (vEntityDesc !== undefined && vEntityDesc.indexOf(":") > -1) {
											var vEntityDescArray = vEntityDesc.split(":");
											if (vEntityDescArray[0].indexOf("(") > -1 && vEntityDescArray[0].indexOf(")") > -1) {
												vEntityDesc = vEntityDescArray[0];	
												return vEntityDesc;
											} else {
												return vEntityDescArray[0];
											}
										} else {
											if (vEntityDesc === "Contact Person") {
												return "";
											} else {
												return "Relationship";
											}
										}
		
									}
								},
								title : {
									path : "Context",
									formatter : function() {
										var ctx = this.getBindingContext();	
										var vEntityDesc = oModel.getProperty("Context", ctx);
										if (vEntityDesc !== undefined && vEntityDesc.indexOf(":") > -1) {
											var vEntityDescArray = vEntityDesc.split(":");
											if (vEntityDescArray[0].indexOf("(") > -1 && vEntityDescArray[0].indexOf(")") > -1) {
												var vContext = vEntityDescArray[0].substring(0, vEntityDescArray[0].indexOf("("));
												return vContext;
											} else {
												return vEntityDescArray[1];
											}
										} else {
											return "";
										}
									}
								},
								visible : {
									path : "Context",
									formatter : function() {
										var ctx = this.getBindingContext();	
										var vEntityDesc = oModel.getProperty("Context", ctx);
										if (vEntityDesc !== undefined && vEntityDesc.indexOf(":") > -1) {
											return true;
										} else {
											return false;
										}
									}
								}
							}).addStyleClass("objIdentifier_margin").addStyleClass("objectIdentifier_text"),
							new sap.m.ObjectIdentifier({
								text : {
									path : "EntityDesc",
									formatter : function() {
										var ctx = this.getBindingContext();
										var vEntityDesc = oModel.getProperty("EntityDesc", ctx);
										if (vEntityDesc !== undefined && vEntityDesc.indexOf(":") > -1) {
											return "Relationship";
										} else {
											return "";
										}
									}
								},
								title : {
									path : "Context",
									formatter : function() {
										var ctx = this.getBindingContext();	
										var vEntityDesc = oModel.getProperty("Context", ctx);
										if (vEntityDesc !== undefined && vEntityDesc.indexOf(":") > -1) {
										var vEntityDescArray = vEntityDesc.split(":");
											if (vEntityDescArray[0].indexOf("(") > -1 && vEntityDescArray[0].indexOf(")") > -1) {
												return vEntityDescArray[1];
											} else {
												return "";
											}
										} else {
											return "";
										}
									}
								},
								visible : {
									path : "Context",
									formatter : function() {
										var ctx = this.getBindingContext();
										var vEntityDesc = oModel.getProperty("Context", ctx);
										if (vEntityDesc !== undefined && vEntityDesc.indexOf(":") > -1) {
											var vEntityDescArray = vEntityDesc.split(":");
											if (vEntityDescArray[0].indexOf("(") > -1 && vEntityDescArray[0].indexOf(")") > -1) {
												return true;
											} else {
												return false;
											}
										} else {
											return false;
										}
									}
								}
							}).addStyleClass("objIdentifier_margin").addStyleClass("objectIdentifier_text") ]
						}),
						new sap.m.ObjectIdentifier({
							text : {
								path : "AttributeDesc"
							},
							title : {
								path : "NewValueText",
								formatter : function() {
									var ctx = this.getBindingContext();
									var vNewVal = oModel.getProperty("NewValue", ctx);
									var vNewValTxt = oModel.getProperty("NewValueText", ctx);
									if (vNewValTxt === 'Yes' || vNewVal === 'X')
										return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
									if (vNewValTxt === 'No' && vNewVal === '')
										return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NO");
								
									if (vNewValTxt !== '' && vNewVal !== '')
										return vNewValTxt + ' (' + vNewVal + ')';
									else if (vNewVal === '' && vNewValTxt !== '')
										return vNewValTxt;
									else
										return vNewVal;
								}
							}
						}),
						new sap.m.Text({
							text : {
								path : "OldValue",
								formatter : function() {
									var ctx = this.getBindingContext();
									var vOldVal = oModel.getProperty("OldValue", ctx);
									var vOldValTxt = oModel.getProperty("OldValueText",ctx);
									if (vOldValTxt === 'Yes' || vOldVal === 'X')
									return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
									if (vOldValTxt === 'No' && vOldVal === '')
										return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NO");
									
									if (vOldValTxt !== '' && vOldVal !== '')
										return vOldValTxt + ' (' + vOldVal + ')';
									else if (vOldVal === '' && vOldValTxt !== '')
										return vOldValTxt;
									else
										return vOldVal;
									}
								}
							}) ]
				});
		var extoItemTemp = this.oS3Controller
				.custHookgetChangeTableTemplate(oItemTemp);
		if (extoItemTemp !== undefined) {
			oItemTemp = extoItemTemp;
		}
		return oItemTemp;
	},
	// Get Values

	getValue : function(Value, Value_Txt, Attribute,context) {
		var finalValue = "";
		if (Value !== "" && Value_Txt !== "") {
			if (Value === "X")
				finalValue = Value_Txt;
			if (Attribute === "DTAMS" || Attribute === "PERIV" || Attribute === "KDKG1" || Attribute === "KDKG2" || Attribute === "KDKG3" || Attribute === "KDKG4" || Attribute === "KDKG5"
					|| Attribute === "LEGALORG" || Attribute === "LEGALFORM" || Attribute === "J_1KFTIND" || Attribute === "FITYP" || Attribute === "TITLE"
					|| Attribute === "AUTHORIZATIONGROUP" || Attribute === "CFOPC" || Attribute === "J_1KFTBUS" || Attribute === "REASON_ID" || Attribute === "MARITALSTATUS"
					|| Attribute === "SEX" || Attribute === "TITLE_ACA1" || Attribute === "TITLE_KEY" || Attribute === "TAXBS")  
				finalValue = Value_Txt;
			else
				finalValue = Value_Txt +"(" +Value + ")";
		}
		
		if (Value === "" && Value_Txt !== "") {
			finalValue = Value_Txt;
		}
		if (Value !== "" && Value_Txt === "") {
			if (Attribute !== "DTAWS" && Attribute !== "BIRTHDATE" && Attribute !== "IDVALIDFROMDATE" && Attribute !== "IDVALIDTODATE") {
				var notMaintainedText = fcg.mdg.approvecrv2.util.Formatter
						.defaultValueChange(Value); // To check attribute'sldefault values								
				if (notMaintainedText !== "") 
					finalValue = notMaintainedText;
				else{
					if (/([0-9]{2,4}(\.|\/|\\)[0-9]{1,2}(\.|\/|\\)[0-9]{2,4})/.test(+Value)) 
						finalValue = parseInt(Value);
					else
						finalValue = Value;
				}
			} else 
				finalValue = Value;
		}
		if (Value === "X" && (Value_Txt === "" || Value_Txt === sap.ca.scfld.md.app.Application.getImpl()
				.getResourceBundle().getText("PC_YES") || Attribute === "NATPERS")) {
			finalValue = sap.ca.scfld.md.app.Application.getImpl()
					.getResourceBundle().getText("PC_YES");
		}

		// In case of identification the default value is the default date so it
		// must be shown as "deleted BANKDETAILVALIDTO
		if ((Attribute === "IDENTRYDATE" || Attribute === "LIQUIDATIONDATE" || Attribute === "JMZAH" || Attribute === "REVDB"
				|| Attribute === "FOUNDATIONDATE"  || Attribute === "IDVALIDFROMDATE" || Attribute === "UMSA1" || Attribute === "QSSYSDAT"
				|| Attribute === "IDVALIDTODATE" || Attribute === "UMJAH" || Attribute === "PERNR" || Attribute === "JMJAH"
				|| Attribute === "BANKDETAILVALIDFROM" || Attribute === "BANKDETAILVALIDTO" ||Attribute === "TAXBS" )
				&& (Value === "00.00.0000" || Value === "0000.00.00" || parseInt(Value) === 0  || Value.trim() === "0,00"
					|| Value.trim() === "0,0" || Value === "")
				&& Value_Txt === "") {

			if(context!==undefined || context !== ""){
				if(context === "new")
					finalValue = "("+ sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_DELETED") + ")";
				else if(context === "old")
					finalValue = "("+ sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NOT_MAIN") + ")";
				}
		}
		
	
		return finalValue;
	},

	showNoDataGenralMsg : function(vOtc) {
		if (this.genText)
			this.genText.destroy();
		this.genText = new sap.m.Text("genTxt");
		this.genText.setText(sap.ca.scfld.md.app.Application.getImpl()
				.getResourceBundle().getText("Nodata"));
		if (vOtc === "159") {
			sap.ui.getCore().byId("CGeneral").removeAllContent();
			sap.ui.getCore().byId("CGeneral").setVisible(true);
			sap.ui.getCore().byId("CGeneral").addContent(this.genText);
		}
		if (vOtc === "266") {
			sap.ui.getCore().byId("SGeneral").removeAllContent();
			sap.ui.getCore().byId("SGeneral").setVisible(true);
			sap.ui.getCore().byId("SGeneral").addContent(this.genText);
		}
	},

	showNodataRelMsg : function(vOTC) {
		if (this.text)
			this.text.destroy();
		this.text = new sap.m.Text("noRelDatachange");
		this.text.setText(sap.ca.scfld.md.app.Application.getImpl()
				.getResourceBundle().getText("Nodata"));
		// this.text.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Noreldata"));
		if (vOTC === "159") {
			sap.ui.getCore().byId("relPanel").removeAllContent();
			sap.ui.getCore().byId("relPanel").addContent(this.text);
		} else if (vOTC === "266") {
			sap.ui.getCore().byId("suppRelPanel").removeAllContent();
			sap.ui.getCore().byId("suppRelPanel").addContent(this.text);
		}
	}
};