/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/* Here all the queries are included which are required to get the necessary data from the backend. Once the query is successful then the corresponding entities
section will be filled with the data. */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");

fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate = {
		otitle:"",
		oauthorization :"",
		oS3Controller : "", 
		oOtc: "",
		i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

		getCompanyCodeData : function(oCustomerModel, vBasePath , s3Controller ){
			this.oS3Controller = s3Controller;
			var	vCompletePath = vBasePath;
			vBasePath = 'BP_Root/CU_MultipleAssignmentsRel/';
			var vCommaSeperator = ',';

			//Customer Related Entities       
			vCompletePath = vCompletePath + vBasePath + "CU_AssignedCompanyCodesRel";
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "CU_AssignedCustomerRel";
			
			//Dunning area details
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "CU_AssignedCompanyCodesRel/CU_CompDunningAreasRel"
			+ vCommaSeperator + vBasePath +"CU_AssignedCompanyCodesRel/CU_CompWithholdingTaxesRel";

			var extQuery = s3Controller.custHookCreateCompCodeQuery(vCompletePath);
			if(extQuery !== undefined){
				vCompletePath = extQuery;
			}
			return vCompletePath;
		},

		getSalesData : function(oCustomerModel, vBasePath, s3Controller){
			this.oS3Controller = s3Controller;
			var	vCompletePath = vBasePath;
			vBasePath = 'BP_Root/CU_MultipleAssignmentsRel/';
			var vCommaSeperator = ',';

			//Sales Area Query Formation
			vCompletePath =vCompletePath + vBasePath + "CU_AssignedSalesAreasRel"
			+ vCommaSeperator + "BP_Root/CU_MultipleAssignmentsRel/CU_AssignedSalesAreasRel/CU_SalesTaxIndicatorsRel"
			+ vCommaSeperator + "BP_Root/CU_MultipleAssignmentsRel/CU_AssignedSalesAreasRel/CU_SalesPartnerFunctionsRel";
			
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "CU_AssignedCustomerRel";
			var extQuery = s3Controller.custHookCreateSalesQuery(vCompletePath);
			if(extQuery !== undefined){
				vCompletePath = extQuery;
			}
			return vCompletePath;
		},

//		Displays the Company Code details in case of the create scenario. If no data is being maintained then a message is being shown upon click of the tab.
//		In case there are multiple company codes being maintained then all the company codes are shown in the form of table with company code key and description and navigation is provided.
//		If multiple ERP customers are maintained then a table header is shown mentioning the name of the ERP customer which is achieved using the sorter. 
//		In case of single company code fragment is loaded directly.		
		displayCompanyCodeData: function(result, s3Controller){//,vOTC
			this.oS3Controller = s3Controller;
			var isMultiassignmnt = false;
			var nodataexist = false;
			var extoDataItems = "";
			var keyValue = "";

			if (result.BP_Root.CU_MultipleAssignmentsRel.results !== undefined  && result.BP_Root.CU_MultipleAssignmentsRel.results.length > 0 )
			{  
				if (result.BP_Root.CU_MultipleAssignmentsRel.results.length > 1 )
				{
					isMultiassignmnt = true;
				}
				var ostrResults = {dataitems:[]};
				for (var i=0; i<result.BP_Root.CU_MultipleAssignmentsRel.results.length; i++ )
				{
					var oMutiassignments = result.BP_Root.CU_MultipleAssignmentsRel.results[i];
					if (oMutiassignments.CU_AssignedCompanyCodesRel.results !== undefined && oMutiassignments.CU_AssignedCompanyCodesRel.results.length > 0)
					{
						for(var j=0; j<oMutiassignments.CU_AssignedCompanyCodesRel.results.length; j++)
						{
							var oAssignedCompCodes = oMutiassignments.CU_AssignedCompanyCodesRel.results[j];

							var compKey = oAssignedCompCodes.BUKRS;
							var key = oAssignedCompCodes.ASSIGNMENT_ID+oAssignedCompCodes.BUKRS;
							if ( isMultiassignmnt === true )
							{
								var standard = oMutiassignments.STANDARD;
								var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMutiassignments.OBJECT_ID,oMutiassignments.OBJECT_ID__TXT);
								var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( oMutiassignments.REASON_ID,oMutiassignments.REASON_ID__TXT);
								var accgrp = "";
								var custRel = oMutiassignments.CU_AssignedCustomerRel;
								if(!this.isNull(custRel)){
									if(!this.isNull(custRel.KTOKD) && !this.isNull(custRel.KTOKD__TXT)){
										accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(custRel.KTOKD, custRel.KTOKD__TXT);
									}
								}
								keyValue = this.getSubheaderWithAccGrp(standard, objid, reason, accgrp);
							}
							else
							{
								keyValue = "";
							}
							//In case Company Code value is Space then not considered
							if (compKey !== "")
							{
								var oDataItems = {
										"CompCodeId":oAssignedCompCodes.BUKRS__TXT + "(" + compKey + ")",
										"Key":key,
										"KeyValue":keyValue,
										"Dunning":"",
										"Withhld":""
								};
								extoDataItems = s3Controller.custHookCreateMultAssign(oDataItems,this);
								if(extoDataItems !== undefined){
									oDataItems = extoDataItems;
								}

								ostrResults.dataitems.push(oDataItems);
							}
						}
					}
					else
					{
						nodataexist = true;
					}
				}
				//Loades the fragment in case only single company Code is being maintained.
				if (ostrResults.dataitems.length === 1)
				{
					this.loadCompCodefragment(result.BP_Root.CU_MultipleAssignmentsRel,s3Controller,isMultiassignmnt);
				}
				else
				{
					var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
					oModel.setData(ostrResults);  

					var  oItemCompCodeTemp = this.CompCodeValueTemplate();  //Get the template               
					sap.ui.getCore().byId("CCompCodeLayout").removeAllContent();
					sap.ui.getCore().byId("CDunningLayout").removeAllContent();
					sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();
					sap.ui.getCore().byId("CCompCodeLayout").setVisible(true);
					sap.ui.getCore().byId("CDunningLayout").setVisible(true);
					sap.ui.getCore().byId("CWithhldTaxLayout").setVisible(true);
					s3Controller.oCompCodeCreateTable = "";
					s3Controller.oCompCodeCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.DescriptionTableCreate'); 
					sap.ui.getCore().byId("CCompCodeLayout").addContent(s3Controller.oCompCodeCreateTable);
					s3Controller.oCompCodeCreateTable.setGrowing(true);
					s3Controller.oCompCodeCreateTable.removeAllItems();
					s3Controller.oCompCodeCreateTable.setModel(oModel);
					oItemCompCodeTemp.attachPress({Entity: "CompanyCode", 
						Key:ostrResults.dataitems,
						EntityData: result.BP_Root.CU_MultipleAssignmentsRel},s3Controller.navtoSubDetail, s3Controller); 
					if ( isMultiassignmnt === true )
					{
						var oSorter = new sap.ui.model.Sorter("KeyValue", true, true);
						s3Controller.oCompCodeCreateTable.bindItems('/dataitems', oItemCompCodeTemp, oSorter, '');
					}
					else
					{
						s3Controller.oCompCodeCreateTable.bindItems('/dataitems', oItemCompCodeTemp, '', '');
					}
				}
			}
			else
			{
				this.showNodataCCMsg();
				return;
			}
			//Displays the message 'No Data Maintained in this Section' in case no company code details are being added.
			if (ostrResults.dataitems.length === 0 && nodataexist === true)
			{
				this.showNodataCCMsg();
			}
		},

//		Displays sales area details in case of create scenario. In Case no data is maintained in this section a message is shown upon tab selection.
//		In case of multiple sales areas are present the details are shown in the form of a table listing all the sales areas along with below details.
//		They are: sales Organization,Distribution Channel and Division along with keys and descriptions and navigation is provided to the sub detail page.
//		In case single sales area exists fragment is loaded directly.In case of multiple assignment table header is shown mentioning the ERP customer details.		
		displaySalesData: function(result, s3Controller){
			this.oS3Controller = s3Controller;
			var isMultiassignmnt = false;
			var nodataexist = false;
			var extoDataItems = "";
			var keyValue = "";

			if (result.BP_Root.CU_MultipleAssignmentsRel.results !== undefined  && result.BP_Root.CU_MultipleAssignmentsRel.results.length > 0 )
			{
				if (result.BP_Root.CU_MultipleAssignmentsRel.results.length > 1 )
				{
					isMultiassignmnt = true;
				}
				var ostrResults = {dataitems:[]};
				for (var i=0; i<result.BP_Root.CU_MultipleAssignmentsRel.results.length; i++ )
				{		
					var oSaleMultiassignmnt = result.BP_Root.CU_MultipleAssignmentsRel.results[i];

					if (oSaleMultiassignmnt.CU_AssignedSalesAreasRel.results !== undefined && oSaleMultiassignmnt.CU_AssignedSalesAreasRel.results.length > 0 ) 
					{
						for(var j=0; j<oSaleMultiassignmnt.CU_AssignedSalesAreasRel.results.length; j++)
						{
							var oSalesAreas = oSaleMultiassignmnt.CU_AssignedSalesAreasRel.results[j];

							var sOrg = oSalesAreas.VKORG__TXT;
							var sOrgKey = oSalesAreas.VKORG;
							var dChannel = oSalesAreas.VTWEG__TXT;
							var dChannelKey = oSalesAreas.VTWEG;
							var division = oSalesAreas.SPART__TXT;
							var divisionKey = oSalesAreas.SPART;
							var assignmntid = oSalesAreas.ASSIGNMENT_ID;
							var salekey = sOrgKey+dChannelKey+divisionKey;
							if ( isMultiassignmnt === true )
							{
								var standard = oSaleMultiassignmnt.STANDARD;
								var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oSaleMultiassignmnt.OBJECT_ID,oSaleMultiassignmnt.OBJECT_ID__TXT);
								var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oSaleMultiassignmnt.REASON_ID,oSaleMultiassignmnt.REASON_ID__TXT);
								var accgrp = "";
								var custRel = oSaleMultiassignmnt.CU_AssignedCustomerRel;
								if(!this.isNull(custRel)){
									if(!this.isNull(custRel.KTOKD) && !this.isNull(custRel.KTOKD__TXT)){
										accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(custRel.KTOKD, custRel.KTOKD__TXT);
									}
								}
								keyValue = this.getSubheaderWithAccGrp(standard, objid, reason, accgrp);
							}
							else
							{
								keyValue = "";
							}
							//If the sales organization,Dischanel and Division is empty then not being considred
							if (salekey !== "")
							{
								var oDataItems = {
										"Organization": sOrg + "(" +sOrgKey + ")",
										"Distribution": dChannel + "(" +dChannelKey+ ")",
										"Division":     division + "(" +divisionKey+ ")",
										"Key":         assignmntid+sOrgKey+dChannelKey+divisionKey,
										"KeyValue":keyValue
								};
								extoDataItems = s3Controller.custHookCreateSalesArea(oDataItems,this);
								if(extoDataItems !== undefined){
									oDataItems = extoDataItems;
								}
								ostrResults.dataitems.push(oDataItems);
							}
						}
					}
					else
					{
						nodataexist = true;
					}
				}
				//Loades the fragment in case only one sales area is being maintained.
				if(ostrResults.dataitems.length === 1)
				{
					this.loadSalesfragment(result.BP_Root.CU_MultipleAssignmentsRel,s3Controller,isMultiassignmnt);
				}
				else
				{
					var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
					oModel.setData(ostrResults);  
					var  oSalesTemp = this.SalesValueTemplate();  //Get the template                     
					sap.ui.getCore().byId("CSaleLayout").removeAllContent();
					sap.ui.getCore().byId("CSaleLayout").setVisible(true);
					if(s3Controller.oSalesCreateTable !== "")
						s3Controller.oSalesCreateTable.removeAllItems();
					s3Controller.oSalesCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SalesCreate');          
					sap.ui.getCore().byId("CSaleLayout").addContent(s3Controller.oSalesCreateTable);
					s3Controller.oSalesCreateTable.setGrowing(true);
					s3Controller.oSalesCreateTable.removeAllItems();
					s3Controller.oSalesCreateTable.setModel(oModel);     
					oSalesTemp.attachPress({Entity: "SalesArea", 
						Key:ostrResults.dataitems,
						EntityData: result.BP_Root.CU_MultipleAssignmentsRel},s3Controller.navtoSubDetail, s3Controller); 
					if ( isMultiassignmnt === true )
					{
						var oSorter = new sap.ui.model.Sorter("KeyValue", true, true);
						s3Controller.oSalesCreateTable.bindItems('/dataitems', oSalesTemp, oSorter, '');
					}
					else
					{
						s3Controller.oSalesCreateTable.bindItems('/dataitems', oSalesTemp, '', '');
					}
				}
			}
			else
			{
				this.showNoDataSaleMsg();
				return;
			}
//			Display of the Message "No Data Maintained in this Section".
			if (ostrResults.dataitems.length === 0 && nodataexist === true)
			{
				this.showNoDataSaleMsg();
			}
		},

//		In case create scenario if only one company code is present then directly company code fragment is being loaded. It is the same fragment which is used for the detail page.
//		Here since there is navigation to the Sub detail page for the dunning area and withholding taxes these table are not being added in the fragment directly as navigation cannot be achieved. 
//		To achieve the navigation different table fragments are being used both for the dunning area and withholding tax type and navigation is being  achieved.		
		loadCompCodefragment : function (result,s3Controller,isMultiassignmnt)
		{
			var extoDataItems = "";
			var oModel = "";
			var	ostrResults = "";
			var assignmntid = "";
			var oDataItems = "";
			var k = "";

			for(var i=0; i < result.results.length;i++)
			{
				if  ( result.results[i].CU_AssignedCompanyCodesRel.results.length >= 1)
				{
					var oAssignedCompCodes = result.results[i].CU_AssignedCompanyCodesRel.results[0];
					//In case the Company Code value is empty then its not being loaded
					if (oAssignedCompCodes.BUKRS !== "")
					{
						//Binding of the Company Code General Data
						var FinalResult = oAssignedCompCodes;
						oModel = new sap.ui.model.json.JSONModel();  
						oModel.setData(FinalResult);

						//In case the fragment is being used in the detail page the fragment destroyed in the begining.
						sap.ui.getCore().byId("CCompCodeLayout").removeAllContent();
						sap.ui.getCore().byId("CCompCodeLayout").setVisible(true);
						sap.ui.getCore().byId("CDunningLayout").removeAllContent();
						sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();

						if (s3Controller.oCompCodeDetails !== "")
						{
							s3Controller.oCompCodeDetails.destroy();
						}

						if(s3Controller.oCompCodeCreateForm === ""){
							s3Controller.oCompCodeCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CompanyCodeDetail', s3Controller);
						}
						else{
							// If already defined, remove it from detail page and instantiate it again
							sap.ui.getCore().byId("CCompCodeLayout").removeContent(s3Controller.oCompCodeCreateForm);
							if(s3Controller.oCompCodeCreateForm !== undefined){
								s3Controller.oCompCodeCreateForm.destroy();
							}
							s3Controller.oCompCodeCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CompanyCodeDetail', s3Controller);
						}
						sap.ui.getCore().byId("CCompCodeLayout").addContent(s3Controller.oCompCodeCreateForm);
						var vElement = sap.ui.getCore().byId("SimpleFormCompcode");
						vElement.setModel(oModel);
						
						//If there are more than one ERP customers AND only one company code is being maintained in any of the ERP customer then ERP customer description is shown in the fragment. 
						if (isMultiassignmnt === true)
						{
							var oMultiObject = result.results[i];
							var standard = oMultiObject.STANDARD;
							var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiObject.OBJECT_ID, oMultiObject.OBJECT_ID__TXT);
							var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiObject.REASON_ID, oMultiObject.REASON_ID__TXT);
							var accgrp = "";
							var custRel = oMultiObject.CU_AssignedCustomerRel;
							if(!this.isNull(custRel)){
								if(!this.isNull(custRel.KTOKD) && !this.isNull(custRel.KTOKD__TXT)){
									accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(custRel.KTOKD, custRel.KTOKD__TXT);
								}
							}
							var keyValue = this.getSubheaderWithAccGrp(standard, objid, reason, accgrp);
							sap.ui.getCore().byId("lblerpcust").setVisible(true);
							sap.ui.getCore().byId("comperpcust").setText(keyValue);
						}
						else
						{
							sap.ui.getCore().byId("lblerpcust").setVisible(false);
						}
						//Hide the sections in case the data is not maintained for the attributes in the section
						fcg.mdg.approvecrv2.DomainSpecParts.Customer.hideCompcodeSection();

						//Binding of the Dunning Areas in the Comapany Code. Here the navigation is achieved using different fragment and navigation is done using dunning id.
						if (oAssignedCompCodes.CU_CompDunningAreasRel.results !== undefined && oAssignedCompCodes.CU_CompDunningAreasRel.results.length > 0 )
						{
							ostrResults = {dataitems:[],ChangeData:[]};
							for( k=0; k<oAssignedCompCodes.CU_CompDunningAreasRel.results.length; k++)
							{
								var oAssignedDunningAreas = oAssignedCompCodes.CU_CompDunningAreasRel.results[k];

								var dunningArea = oAssignedDunningAreas.MABER;
								assignmntid = oAssignedDunningAreas.ASSIGNMENT_ID;
								var dunningAreaDesc = oAssignedDunningAreas.MABER__TXT;
								if (dunningAreaDesc === "")
								{
									dunningAreaDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DefaultDunning");
								}
								var dunningValue = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(dunningArea,dunningAreaDesc);
								oDataItems = {
										"Id":dunningValue,
										"Withhld":"",
										"Dunning":assignmntid+oAssignedDunningAreas.BUKRS + dunningArea
								};
								extoDataItems = s3Controller.custHookCreateDunning(oDataItems,this);
								if(extoDataItems !== undefined){
									oDataItems = extoDataItems;
								}
								ostrResults.dataitems.push(oDataItems);
							}


							oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
							oModel.setData(ostrResults); 
							var dunningtemplate = this.getDunningTemplate();

							//Dunning table fragment is loaded.
							sap.ui.getCore().byId("CDunningLayout").removeAllContent();
							sap.ui.getCore().byId("CDunningLayout").setVisible(true);
							s3Controller.odunningCreateTable = "";
							s3Controller.odunningCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.DunningTableCreate'); 
							sap.ui.getCore().byId("CDunningLayout").addContent(s3Controller.odunningCreateTable);
							s3Controller.odunningCreateTable.removeAllItems();
							s3Controller.odunningCreateTable.setModel(oModel);
							dunningtemplate.attachPress({Entity: "CompanyCode", 
								Key:ostrResults.dataitems,
								EntityData: result},s3Controller.navtoSubDetail, s3Controller); 
							s3Controller.odunningCreateTable.bindItems('/dataitems', dunningtemplate, '', '');
						}
						else
						{
							//In case there is no dunnig areas maintained all the previous contents are being removed.
							sap.ui.getCore().byId("CDunningLayout").removeAllContent();
						}

						//Binding of the Extended Withholding Taxes within the Company Codes. Separate fragment is being used here and navigation to sub detail page is handled.
						if (oAssignedCompCodes.CU_CompWithholdingTaxesRel.results !== undefined && oAssignedCompCodes.CU_CompWithholdingTaxesRel.results.length > 0)
						{
							ostrResults = {dataitems:[]};
							for( k=0; k<oAssignedCompCodes.CU_CompWithholdingTaxesRel.results.length; k++)
							{
								var oAssignedWithTaxes = oAssignedCompCodes.CU_CompWithholdingTaxesRel.results[k];

								var withhldtax = oAssignedWithTaxes.WITHT;
								var compcode = oAssignedWithTaxes.BUKRS;
								assignmntid = oAssignedWithTaxes.ASSIGNMENT_ID;
								var withhldtaxDesc = oAssignedWithTaxes.WITHT__TXT;
								var withhldValue = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(withhldtax,withhldtaxDesc);
								oDataItems = {
										"Id":withhldValue,
										"Dunning":"",
										"Withhld":assignmntid+compcode+withhldtax
								};
								extoDataItems = s3Controller.custHookCreateWithTax(oDataItems,this);
								if(extoDataItems !== undefined){
									oDataItems = extoDataItems;
								}
								ostrResults.dataitems.push(oDataItems);
							}
							oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
							oModel.setData(ostrResults); 
							var withTaxtemplate = this.getDunningTemplate();

							//Withholding tax fragment is loaded.
							sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();
							sap.ui.getCore().byId("CWithhldTaxLayout").setVisible(true);
							s3Controller.oexTaxCreateTable = "";
							s3Controller.oexTaxCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ExtendedTaxTableCreate'); 
							sap.ui.getCore().byId("CWithhldTaxLayout").addContent(s3Controller.oexTaxCreateTable);
							s3Controller.oexTaxCreateTable.removeAllItems();
							s3Controller.oexTaxCreateTable.setModel(oModel);
							withTaxtemplate.attachPress({Entity: "CompanyCode", 
								Key:ostrResults.dataitems,
								EntityData: result},s3Controller.navtoSubDetail, s3Controller); 
							s3Controller.oexTaxCreateTable.bindItems('/dataitems', withTaxtemplate, '', '');
						}
						else
						{
							sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();
						}
					}
				}
			}
		},

//		In case if single sales Area is being maintained in the create scenario then directly a fragment is being loaded. Same fragment as that of the detail page is being used.	
//		No separate table fragments are being used here for partner functions and tax classifications the tables are included in the fragment itself.
		loadSalesfragment : function (result, s3Controller, isMultiassignmnt)
		{
			var	ostrResults = "";
			var oModel = "";
			for(var i=0; i<result.results.length;i++)
			{
				//Binding of the Sales General Data
				if (result.results[i].CU_AssignedSalesAreasRel.results.length >= 1)
				{
					var oAssignedSalesArea = result.results[i].CU_AssignedSalesAreasRel.results[0];
					var salekey = oAssignedSalesArea.VKORG+oAssignedSalesArea.VTWEG+oAssignedSalesArea.SPART;
					var vElement = "";
					if (salekey !== "")
					{
						var FinalResult = oAssignedSalesArea;
						oModel = new sap.ui.model.json.JSONModel();  
						oModel.setData(FinalResult);

						//The fragment used in the detail page is destroyed if its already been used to avoid the duplicate id issue.
						sap.ui.getCore().byId("CSaleLayout").removeAllContent();
						sap.ui.getCore().byId("CSaleLayout").setVisible(true);

						if (s3Controller.oSalesDetail !== "")
						{
							s3Controller.oSalesDetail.destroy();
						}

						if(s3Controller.oSalesCreateForm === ""){
							s3Controller.oSalesCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SalesDetail',s3Controller );
						}
						else{

							// If already defined, remove it from detail page and instantiate it again
							sap.ui.getCore().byId("CSaleLayout").removeContent(s3Controller.oSalesCreateForm);
							if(s3Controller.oSalesCreateForm !== undefined){
								s3Controller.oSalesCreateForm.destroy();
							}
							s3Controller.oSalesCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SalesDetail', s3Controller);
						}
						sap.ui.getCore().byId("CSaleLayout").addContent(s3Controller.oSalesCreateForm); 					
						vElement = sap.ui.getCore().byId("SimpleFormSales");
						vElement.setModel(oModel);

						//If there are more than one ERP customers AND only one company code is being maintained in any of the ERP customer then ERP customer description is shown in the fragment. 
						if (isMultiassignmnt === true)
						{
							var oMultiObject = result.results[i];
							var standard = oMultiObject.STANDARD;
							var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiObject.OBJECT_ID,oMultiObject.OBJECT_ID__TXT);
							var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiObject.REASON_ID,oMultiObject.REASON_ID__TXT);
							var accgrp = "";
							var custRel = oMultiObject.CU_AssignedCustomerRel;
							if(!this.isNull(custRel)){
								if(!this.isNull(custRel.KTOKD) && !this.isNull(custRel.KTOKD__TXT)){
									accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(custRel.KTOKD, custRel.KTOKD__TXT);
								}
							}
							var keyValue = this.getSubheaderWithAccGrp(standard, objid, reason, accgrp);
							sap.ui.getCore().byId("lblSalesErpcust").setVisible(true);
							sap.ui.getCore().byId("saleerpcust").setText(keyValue);
						}
						else
						{
							sap.ui.getCore().byId("lblSalesErpcust").setVisible(false);
						}

						//Hide the respective sections in case no values are maintained for the texts under that section.
						fcg.mdg.approvecrv2.DomainSpecParts.Customer.hideSaleSection();

						//Binding of the Partner Function Table. If no value exists then the table is hidden.
						if (oAssignedSalesArea.CU_SalesPartnerFunctionsRel.results !== undefined && oAssignedSalesArea.CU_SalesPartnerFunctionsRel.results.length > 0)
						{
							ostrResults = oAssignedSalesArea.CU_SalesPartnerFunctionsRel;
							oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
							oModel.setData(ostrResults); 
							vElement = sap.ui.getCore().byId("partnerfunc");
							vElement.setVisible(true);
							vElement.setModel(oModel); 
							var partnerfunctemplate = this.getPartnerFuncTemplate(oModel);
							vElement.bindItems("/results", partnerfunctemplate);
						}
						else
						{
							sap.ui.getCore().byId("partnerfunc").setVisible(false);
						}
						//Binding of the TaxIndicator Table. If no value exists then the table is hidden.
						if (oAssignedSalesArea.CU_SalesTaxIndicatorsRel.results !== undefined && oAssignedSalesArea.CU_SalesTaxIndicatorsRel.results.length > 0)
						{
							ostrResults = oAssignedSalesArea.CU_SalesTaxIndicatorsRel;
							oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
							oModel.setData(ostrResults); 
							vElement = sap.ui.getCore().byId("taxindic");
							vElement.setVisible(true);
							vElement.setModel(oModel); 
							var taxclasstemplate = this.getTaxClassTemplate(oModel);
							vElement.bindItems("/results", taxclasstemplate);
						}	
						else
						{
							sap.ui.getCore().byId("taxindic").setVisible(false);
						}
					}
				}
			}
		},

		//Table template for the dunning table which involves all the dunning areas assigned to the company codes along with its key and description.
		getDunningTemplate : function ()
		{
			var oItemTempComp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [	      
				        new sap.m.Text({
				        	text:{
				        		path:"Id"	
				        	}
				        })
				        ]
			});
			var extoItemRelTemp = this.oS3Controller.custHookgetDunningTemplate(oItemTempComp);
			if(extoItemRelTemp !== undefined){
				oItemTempComp = extoItemRelTemp;
			}
			return oItemTempComp;
		},

		//Table template for the partner function table. Which involves columns:Parner Function,Same Partner,Parner and Default Partner along with the key and description.
		getPartnerFuncTemplate : function (oModel)
		{
			var oThis = this;
			var oItemTempPf = new sap.m.ColumnListItem({
				cells: [	
				        new sap.m.Text({
				        	text:{
				        		path:"PARVW__TXT",
				        		formatter: function(){
				        			var desc = oModel.getProperty("PARVW__TXT", this.getBindingContext());
				        			var key = oModel.getProperty("PARVW", this.getBindingContext());			        			
				        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);			        			
				        		}	
				        	}
				        }),
				        new sap.m.Text({
				        	text:{
				        		path:"REFLEXIVE__TXT",
				        		formatter: function(){	
				        			var desc = oModel.getProperty("REFLEXIVE__TXT", this.getBindingContext());
				        			if(desc !== "")
				        				return desc;
				        			else
				        				return oThis.i18n.getText("PC_NO");
				        		}	

				        	}
				        }),
				        new sap.m.Text({
				        	text:{
				        		path:"KUNN2__TXT",
				        		formatter: function(){
				        			var desc = oModel.getProperty("KUNN2__TXT", this.getBindingContext());
				        			var key = oModel.getProperty("KUNN2", this.getBindingContext()); 
				        			var contactdesc = oModel.getProperty("PARNR__TXT", this.getBindingContext());
				        			var contactkey = oModel.getProperty("PARNR", this.getBindingContext());
				        			var personaldesc = oModel.getProperty("PERNR__TXT", this.getBindingContext());
				        			var personalnum = oModel.getProperty("PERNR", this.getBindingContext());
				        			var vendorDec = oModel.getProperty("LIFNR__TXT", this.getBindingContext());
				        			var vendorNo = oModel.getProperty("LIFNR", this.getBindingContext());
				        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "KUNN2" );
				        			contactkey = (parseInt(contactkey) === 0)?"":parseInt(contactkey, 10);
				        			personalnum = (parseInt(personalnum) === 0)?"":parseInt(personalnum, 10);
				        			
				        			if((oThis.isNull(contactdesc) || contactdesc === "") && (oThis.isNull(contactkey) || contactkey === "") &&
				        					(oThis.isNull(key) || key === "") && (oThis.isNull(desc) || desc === "") &&
				        					(oThis.isNull(personalnum) || personalnum === "") && (oThis.isNull(personaldesc) || personaldesc === "") &&
				        					(oThis.isNull(vendorNo) || vendorNo === "") && (oThis.isNull(vendorDec) || vendorDec === ""))
				        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
				        			
				        			if ( contactdesc !== "" && contactkey !== ""  )
				        			{
				        				return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(contactkey, contactdesc);
				        			}
				        			if (key !== "" && desc !== "")
				        			{
				        				return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
				        			}      
				        			if ( personalnum !== "" && personaldesc !== "")
				        			{
				        				return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(personalnum, personaldesc);
				        			}	
				        			if ( vendorNo !== "" || vendorDec !== "")
				        			{	
				        				return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vendorNo, vendorDec);
				        			}
				        		}
				        	}
				        }),
				        new sap.m.Text({
				        	text:{
				        		path:"KNREF",
				        		formatter: function(){
				        			var valKnref = oModel.getProperty("KNREF", this.getBindingContext());		
				        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "KNREF" );
				        			if(oThis.isNull(valKnref) || valKnref === "")
				        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
				        			return	oModel.getProperty("KNREF", this.getBindingContext());
				        		}	

				        	}
				        }),
				        new sap.m.Text({
				        	text:{
				        		path:"DEFPA__TXT",
				        		formatter: function(){		
				        			var key = oModel.getProperty("DEFPA", this.getBindingContext()); 
				        			if(key === 'X')
				        				return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
				        			if(oThis.isNull(key) || key === "")
				        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
				        		}
				        	}
				        })]
			});
			var extoItemRelTemp = this.oS3Controller.custHookgetPartnerFuncTemplate(oItemTempPf);
			if(extoItemRelTemp !== undefined){
				oItemTempPf = extoItemRelTemp;
			}
			return oItemTempPf;
		},

		//Table template for tax classification which involves colums:Country,Tax Type and Tax Category along with the keys and descriptions.
		getTaxClassTemplate : function (oModel)
		{
			var oItemTempTax = new sap.m.ColumnListItem({
				cells: [	      
				        new sap.m.Text({
				        	text:{
				        		path:"ALAND__TXT",
				        		formatter: function(){
				        			var desc = oModel.getProperty("ALAND__TXT", this.getBindingContext());
				        			var key = oModel.getProperty("ALAND", this.getBindingContext());			        			
				        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);	
				        		}
				        	}
				        }),
				        new sap.m.Text({
				        	text:{
				        		path:"TATYP__TXT",
				        		formatter: function(){
				        			var desc = oModel.getProperty("TATYP__TXT", this.getBindingContext());
				        			var key = oModel.getProperty("TATYP", this.getBindingContext());			        			
				        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);	
				        		}
				        	}
				        }),
				        new sap.m.Text({
				        	text:{
				        		path:"TAXKD__TXT",
				        		formatter: function(){
				        			var desc = oModel.getProperty("TAXKD__TXT", this.getBindingContext());
				        			var key = oModel.getProperty("TAXKD", this.getBindingContext());			        			
				        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);	
				        		}
				        	}
				        })
				        ]
			});  
			return oItemTempTax;
		},

		//Sales
		SalesValueTemplate: function(){
			var oItemSalesTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				        new sap.m.Text({
				        	text:{
				        		path:"Organization",
				        		formatter:fcg.mdg.approvecrv2.util.Formatter.noValue
				        	}
				        }),                               
				        new sap.m.Text({
				        	text:{
				        		path:"Distribution",
				        		formatter:fcg.mdg.approvecrv2.util.Formatter.noValue
				        	}
				        }),                               
				        new sap.m.Text({
				        	text:{
				        		path:"Division",
				        		formatter:fcg.mdg.approvecrv2.util.Formatter.noValue
				        	}
				        })                              
				        ]});
			var extoItemSalesTemp = this.oS3Controller.custHookSalesValueTemplate(oItemSalesTemp);
			if(extoItemSalesTemp !== undefined){
				oItemSalesTemp = extoItemSalesTemp;
			}
			return oItemSalesTemp;
		},
//		company code
		CompCodeValueTemplate: function(){
			var oItemCompCodeTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				        new sap.m.Text({
				        	text:{
				        		path:"CompCodeId"
				        	}
				        }) 
				        ]});
			var extoItemCompCodeTemp = this.oS3Controller.custHookCompCodeValueTemplate(oItemCompCodeTemp);
			if(extoItemCompCodeTemp !== undefined){
				oItemCompCodeTemp = extoItemCompCodeTemp;
			}
			return oItemCompCodeTemp;
		},
		CompanyValueTemplate: function(){
			var oCompTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				        new sap.m.Text({
				        	text:{
				        		path:"CompanyCode"

				        	}
				        }), 
				        new sap.m.Text({
				        	text:{
				        		path:"Description"

				        	}
				        })
				        ]});
			var extoCompTemp = this.oS3Controller.custHookCompanyValueTemplate(oCompTemp);
			if(extoCompTemp !== undefined){
				oCompTemp = extoCompTemp;
			}

			return oCompTemp;
		},
		showNodataCCMsg : function() {
			if (this.ccText)
				this.ccText.destroy();
			this.ccText = new sap.m.Text("ccTxtCreate");
			this.ccText.setText(sap.ca.scfld.md.app.Application.getImpl()
					.getResourceBundle().getText("NodataCreate"));
			sap.ui.getCore().byId("CCompCodeLayout").removeAllContent();
			sap.ui.getCore().byId("CDunningLayout").removeAllContent();
			sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();
			sap.ui.getCore().byId("CCompCodeLayout").setVisible(true);
			sap.ui.getCore().byId("CCompCodeLayout").addContent(this.ccText);
		},
	
		showNoDataSaleMsg : function() {
			if (this.saleText)
				this.saleText.destroy();
			this.saleText = new sap.m.Text("saleTxtCreate");
			this.saleText.setText(sap.ca.scfld.md.app.Application.getImpl()
					.getResourceBundle().getText("NodataCreate"));
			sap.ui.getCore().byId("CSaleLayout").removeAllContent();
			sap.ui.getCore().byId("CSaleLayout").setVisible(true);
			sap.ui.getCore().byId("CSaleLayout").addContent(this.saleText);
		},
		
		//Returns the subheader in case of multiple assignment of ERP customer. Sub header here is a combination of the ERP customer name along with the reason for the mutiple assignments.
		//In case of the standard assignment header is shown as ERP-Customer,STANDARD.
		// This header returns the sub header in the format : ERP, reason, Account Group, Standard  
		getSubheaderWithAccGrp : function (standard, objid, reason, accgrp )
		{
			var subheader = "";
			var reasonLbl = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Reason");
			var accgrpLbl = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("AccountGroup");
			var erpCustomerLbl = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERPCustomer");
			var standardLbl = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Standard");
			subheader = erpCustomerLbl; 
			if(objid!==""){
				if(subheader!== "")
					subheader = subheader + ", " + "(" +objid+ ")";
				else
					subheader =  erpCustomerLbl+"(" +objid+ ")";
			}
			
			if(reason!==""){
				if(subheader!== "")
					subheader = subheader + ", " + reasonLbl+": " +reason;
				else
					subheader =  reasonLbl +": " +reason;
			}
			
			if(accgrp!==""){
				if(subheader!== "")
					subheader = subheader + ", " + accgrpLbl+": " +accgrp;
				else
					subheader =  accgrpLbl+": " +accgrp;
			}
			
			if ( standard === 'X')
			{
				if(subheader!== "")
					subheader = subheader + ", " + standardLbl;
				else
					subheader =  standardLbl;
				
			}
			return subheader;
		},
		
		/*eslint radix: 2*/ 
		isNull:function(value){
		    return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || parseInt(value) === 0;
		}
};