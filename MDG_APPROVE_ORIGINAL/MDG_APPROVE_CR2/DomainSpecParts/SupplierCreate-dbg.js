/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/* Here all the queries are included which are required to get the necessary data from the backend. Once the query is successful then the corresponding entities
section will be filled with the data. */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.SupplierCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Supplier");

fcg.mdg.approvecrv2.DomainSpecParts.SupplierCreate = {
		otitle:"",
		oauthorization :"",
		oS3Controller : "",
 
		getSuppCompanyCodeData : function(oCustomerModel, vBasePath , s3Controller ){
			this.oS3Controller = s3Controller;
			var vCompletePath = vBasePath;
			vBasePath = 'BP_Root/SP_MultipleAssignmentsRel/';
			var vCommaSeperator = ',';

			//Customer Related Entities       
			vCompletePath = vCompletePath + vBasePath + "SP_AssignedCompanyCodesRel"
			+ vCommaSeperator + vBasePath + "SP_AssignedCompanyCodesRel/SP_CompDunningAreasRel"
			+ vCommaSeperator + vBasePath + "SP_AssignedCompanyCodesRel/SP_CompWithholdingTaxesRel";
			
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "SP_AssignedSupplierRel";
			
			var extQuery = s3Controller.custHookCreateCompCodeQuery(vCompletePath);
			if(extQuery !== undefined){
				vCompletePath = extQuery;
			}
			return vCompletePath;
		},

		getPurchaseData : function(oCustomerModel, vBasePath, s3Controller){
			this.oS3Controller = s3Controller;
			var vCompletePath = vBasePath;
			vBasePath = 'BP_Root/SP_MultipleAssignmentsRel/';
			var vCommaSeperator = ',';

			//Purchase Area Query Formation
			vCompletePath =vCompletePath + vBasePath + "SP_AssignedPurchasingOrgsRel"
			+ vCommaSeperator + vBasePath + "SP_AssignedPurchasingOrgsRel/SP_PurchOrgPurchasingOrg2Rel"
			+ vCommaSeperator + vBasePath + "SP_AssignedPurchasingOrgsRel/SP_PurchOrgPartnerFunctionsRel";
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "SP_AssignedSupplierRel";
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
		displaySuppCompanyCodeData: function(result, s3Controller){
			this.oS3Controller = s3Controller;
			var isMultiassignmnt = false;
			var nodataexist = false;

			if (result.BP_Root.SP_MultipleAssignmentsRel.results !== undefined  && result.BP_Root.SP_MultipleAssignmentsRel.results.length > 0 )
			{  
				if (result.BP_Root.SP_MultipleAssignmentsRel.results.length > 1 )
				{
					isMultiassignmnt = true;
				}
				var ostrResults = {dataitems:[]};
				for (var i=0; i<result.BP_Root.SP_MultipleAssignmentsRel.results.length; i++ )
				{
					var oMutiassignments = result.BP_Root.SP_MultipleAssignmentsRel.results[i];
					if (oMutiassignments.SP_AssignedCompanyCodesRel.results !== undefined && oMutiassignments.SP_AssignedCompanyCodesRel.results.length > 0)
					{
						for(var j=0; j<oMutiassignments.SP_AssignedCompanyCodesRel.results.length; j++)
						{
							var oAssignedCompCodes = oMutiassignments.SP_AssignedCompanyCodesRel.results[j];

							var compKey = oAssignedCompCodes.BUKRS;
							var key = oAssignedCompCodes.ASSIGNMENT_ID+oAssignedCompCodes.BUKRS;
							if ( isMultiassignmnt === true )
							{
								var standard = oMutiassignments.STANDARD;
								var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMutiassignments.OBJECT_ID,oMutiassignments.OBJECT_ID__TXT);
								var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( oMutiassignments.REASON_ID,oMutiassignments.REASON_ID__TXT);
								var accgrp = "";
								if(oMutiassignments.SP_AssignedSupplierRel !== undefined && oMutiassignments.SP_AssignedSupplierRel.KTOKK !== undefined && oMutiassignments.SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
									accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( oMutiassignments.SP_AssignedSupplierRel.KTOKK,  oMutiassignments.SP_AssignedSupplierRel.KTOKK__TXT);
								}
								//var keyValue = this.getSubheader(standard,objid,reason);
								var keyValue = this.getSubheaderWithAccGrp(standard,objid,reason,accgrp);
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
								var extoDataItems = s3Controller.custHookCreateMultAssign(oDataItems,this);
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
					this.loadSuppCompCodefragment(result.BP_Root.SP_MultipleAssignmentsRel,s3Controller,isMultiassignmnt);
				}
				else
				{
					var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
					oModel.setData(ostrResults); 
					var  oItemCompCodeTemp = this.CompCodeValueTemplate();  //Get the template               
					sap.ui.getCore().byId("SCompCodeLayout").removeAllContent();
					sap.ui.getCore().byId("SDunningLayout").removeAllContent();
					sap.ui.getCore().byId("SWithhldTaxLayout").removeAllContent();
					s3Controller.oCompCodeCreateTable = "";
					s3Controller.oCompCodeCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.DescriptionTableCreate'); 
					sap.ui.getCore().byId("SCompCodeLayout").addContent(s3Controller.oCompCodeCreateTable);
					s3Controller.oCompCodeCreateTable.setGrowing(true);
					s3Controller.oCompCodeCreateTable.removeAllItems();
					s3Controller.oCompCodeCreateTable.setModel(oModel);
					oItemCompCodeTemp.attachPress({Entity: "SuppCompanyCode", 
						Key:ostrResults.dataitems,
						EntityData: result.BP_Root.SP_MultipleAssignmentsRel},s3Controller.navtoSubDetail, s3Controller); 
					if ( isMultiassignmnt === true )
					{
						var oSorter = new sap.ui.model.Sorter("KeyValue", true, true);
						s3Controller.oCompCodeCreateTable.bindItems('/dataitems', oItemCompCodeTemp, oSorter, '');
					}
					else
					{
						if(sap.ui.getCore().byId("lblSuppPurchdVendor")!==undefined)
						sap.ui.getCore().byId("lblSuppPurchdVendor").setVisible(false);
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
		displayPurchaseData: function(result, s3Controller){
			this.oS3Controller = s3Controller;
			var isMultiassignmnt = false;
			var nodataexist = false;
			if (result.BP_Root.SP_MultipleAssignmentsRel.results !== undefined  && result.BP_Root.SP_MultipleAssignmentsRel.results.length > 0 )
			{
				if (result.BP_Root.SP_MultipleAssignmentsRel.results.length > 1 )
				{
					isMultiassignmnt = true;
				}
				var ostrResults = {dataitems:[]};
				for (var i=0; i<result.BP_Root.SP_MultipleAssignmentsRel.results.length; i++ )
				{                              
					var oPurchaseMultiassignmnt = result.BP_Root.SP_MultipleAssignmentsRel.results[i];

					if (oPurchaseMultiassignmnt.SP_AssignedPurchasingOrgsRel.results !== undefined && oPurchaseMultiassignmnt.SP_AssignedPurchasingOrgsRel.results.length > 0 ) 
					{
						for(var j=0; j<oPurchaseMultiassignmnt.SP_AssignedPurchasingOrgsRel.results.length; j++)
						{
							var oPurchaseAreas = oPurchaseMultiassignmnt.SP_AssignedPurchasingOrgsRel.results[j];

							var PurchOrg = oPurchaseAreas.EKORG__TXT;
							var PurchOrgKey = oPurchaseAreas.EKORG;
							var assignmntid = oPurchaseAreas.ASSIGNMENT_ID;
							var Purchasekey = PurchOrg+PurchOrgKey;
							if ( isMultiassignmnt === true )
							{
								var standard = oPurchaseMultiassignmnt.STANDARD;
								var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oPurchaseMultiassignmnt.OBJECT_ID,oPurchaseMultiassignmnt.OBJECT_ID__TXT);
								var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oPurchaseMultiassignmnt.REASON_ID,oPurchaseMultiassignmnt.REASON_ID__TXT);
								
								var accgrp = "";
								if(oPurchaseMultiassignmnt.SP_AssignedSupplierRel !== undefined && oPurchaseMultiassignmnt.SP_AssignedSupplierRel.KTOKK !== undefined && oPurchaseMultiassignmnt.SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
									accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( oPurchaseMultiassignmnt.SP_AssignedSupplierRel.KTOKK,  oPurchaseMultiassignmnt.SP_AssignedSupplierRel.KTOKK__TXT);
								}
								var keyValue = this.getSubheaderWithAccGrp(standard,objid,reason,accgrp);
								
							}
							else
							{
								keyValue = "";
							}
							//If the sales organization,Dischanel and Division is empty then not being considred
							if (Purchasekey !== "")
							{
								var oDataItems = {
										"CompCodeId": PurchOrg + "(" + PurchOrgKey + ")",
										"Key":         assignmntid+PurchOrgKey,
										"Subrange": "",
										"KeyValue":keyValue
								};

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
					this.loadPurchasefragment(result.BP_Root.SP_MultipleAssignmentsRel,s3Controller,isMultiassignmnt);
				}
				else
				{
					var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
					oModel.setData(ostrResults);  
					//var  oSalesTemp = this.SalesValueTemplate();  //Get the template     
					var  oItemPurchaseTemp = this.CompCodeValueTemplate();
					sap.ui.getCore().byId("SPurchaseLayout").removeAllContent();
					sap.ui.getCore().byId("SSubrangeLayout").removeAllContent();

					if(s3Controller.PurchaseCreateTable !== "")
						s3Controller.PurchaseCreateTable.removeAllItems();
					s3Controller.PurchaseCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.PurchaseTableCreate');          
					sap.ui.getCore().byId("SPurchaseLayout").addContent(s3Controller.PurchaseCreateTable);
					s3Controller.PurchaseCreateTable.setGrowing(true);
					s3Controller.PurchaseCreateTable.removeAllItems();
					s3Controller.PurchaseCreateTable.setModel(oModel);     
					oItemPurchaseTemp.attachPress({Entity: "PurchaseData", 
						Key:ostrResults.dataitems,
						EntityData: result.BP_Root.SP_MultipleAssignmentsRel},s3Controller.navtoSubDetail, s3Controller); 
					if ( isMultiassignmnt === true )
					{
						var oSorter = new sap.ui.model.Sorter("KeyValue", true, true);
						s3Controller.PurchaseCreateTable.bindItems('/dataitems', oItemPurchaseTemp, oSorter, '');
					}
					else
					{
						s3Controller.PurchaseCreateTable.bindItems('/dataitems', oItemPurchaseTemp, '', '');
					}
				}
			}
			else
			{
				this.showNodataPurchMsg();
				return;
			}
//			Display of the Message "No Data Maintained in this Section".
if (ostrResults.dataitems.length === 0 && nodataexist === true)
{
	this.showNodataPurchMsg();
}
		},

//		In case create scenario if only one company code is present then directly company code fragment is being loaded. It is the same fragment which is used for the detail page.
//Here since there is navigation to the Sub detail page for the dunning area and withholding taxes these table are not being added in the fragment directly as navigation cannot be achieved. 
//		To achieve the navigation different table fragments are being used both for the dunning area and withholding tax type and navigation is being  achieved.                  
		loadSuppCompCodefragment : function (result,s3Controller,isMultiassignmnt)
		{
			var oModel = "";
			var ostrResults = "";
			var assignmntid = ""; 
			var oDataItems = "";
			var extoDataItems = "";
			var k;
			for(var i=0; i<result.results.length;i++)
			{
				if  ( result.results[i].SP_AssignedCompanyCodesRel.results.length >= 1)
				{
					var oAssignedCompCodes = result.results[i].SP_AssignedCompanyCodesRel.results[0];
					//In case the Company Code value is empty then its not being loaded
					if (oAssignedCompCodes.BUKRS !== "")
					{
						//Binding of the Company Code General Data
						var FinalResult = oAssignedCompCodes;
						oModel = new sap.ui.model.json.JSONModel();  
						oModel.setData(FinalResult);

						//In case the fragment is being used in the detail page the fragment destroyed in the begining.
						sap.ui.getCore().byId("SCompCodeLayout").removeAllContent();
						sap.ui.getCore().byId("SDunningLayout").removeAllContent();
						sap.ui.getCore().byId("SWithhldTaxLayout").removeAllContent();

						if (s3Controller.oSuppCompCodeDetails !== "")
						{
							s3Controller.oSuppCompCodeDetails.destroy();
						}

						if(s3Controller.oSuppCompCodeCreateForm === ""){
							s3Controller.oSuppCompCodeCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SupplierCompanyCodeDetail', s3Controller);
						}
						else{
							// If already defined, remove it from detail page and instantiate it again
							sap.ui.getCore().byId("SCompCodeLayout").removeContent(s3Controller.oSuppCompCodeCreateForm);
							if(s3Controller.oSuppCompCodeCreateForm !== undefined){
								s3Controller.oSuppCompCodeCreateForm.destroy();
							}
							s3Controller.oSuppCompCodeCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SupplierCompanyCodeDetail', s3Controller);
						}
						sap.ui.getCore().byId("SCompCodeLayout").addContent(s3Controller.oSuppCompCodeCreateForm);
						var vElement = sap.ui.getCore().byId("SimpleFormSupplierCompcode");
						vElement.setModel(oModel);
						
						var oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
						var oI18nModel = oApplicationImplementation.AppI18nModel;
						var reasonText = oI18nModel.getProperty('Reason');
						var accGrpText = oI18nModel.getProperty('AccountGroup');
						
						//If there are more than one ERP customers AND only one company code is being maintained in any of the ERP customer then ERP customer description is shown in the fragment. 
						if (isMultiassignmnt === true)
						{
							var Objectid = result.results[i].OBJECT_ID;

//							if (Objectid === "" && result.results[i].STANDARD === "X")
//							{
//								Objectid = accGrpText + " - "+ result.results[i].SP_AssignedSupplierRel.KTOKK__TXT;
//								Objectid =  Objectid + "("+result.results[i].SP_AssignedSupplierRel.KTOKK+")";
//								Objectid = Objectid + ", " + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Standard"); 
//								sap.ui.getCore().byId("lblSuppCompervend").setVisible(true);
//								sap.ui.getCore().byId("compcodeSupperpvend").setText(Objectid);
//							}
//							else
//							{
//								var reasondesc =  reasonText +" - "+result.results[i].REASON_ID__TXT;
//								if (Objectid !== "" && reasondesc !=="" )
//								{
//									Objectid = Objectid + ","+ accGrpText+" - "+result.results[i].SP_AssignedSupplierRel.KTOKK__TXT;
//									Objectid =  Objectid + "("+result.results[i].SP_AssignedSupplierRel.KTOKK+")";
//									Objectid =  Objectid + ", " + reasondesc;
//								}
//								if (Objectid === "" && reasondesc !=="" )
//								{
//									Objectid = accGrpText + " - "+result.results[i].SP_AssignedSupplierRel.KTOKK__TXT;
//									Objectid =  Objectid + "("+result.results[i].SP_AssignedSupplierRel.KTOKK+")";
//									Objectid =  Objectid + ", "+ reasondesc;
//								}
//								if (Objectid === "" && reasondesc ==="" )
//								{
//									Objectid = accGrpText+" - " + result.results[i].SP_AssignedSupplierRel.KTOKK__TXT;
//									Objectid =  Objectid + "("+result.results[i].SP_AssignedSupplierRel.KTOKK+")";
//								}
							
								var standard = result.results[i].STANDARD;
								var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(result.results[i].OBJECT_ID,result.results[i].OBJECT_ID__TXT);
								var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(result.results[i].REASON_ID,result.results[i].REASON_ID__TXT);
								var accgrp = "";
								if(result.results[i].SP_AssignedSupplierRel !== undefined && result.results[i].SP_AssignedSupplierRel.KTOKK !== undefined && result.results[i].SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
									accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( result.results[i].SP_AssignedSupplierRel.KTOKK,  result.results[i].SP_AssignedSupplierRel.KTOKK__TXT);
								}
								//var keyValue = this.getSubheader(standard,objid,reason);
								var keyValue = this.getSubheaderWithAccGrp(standard,objid,reason,accgrp);
								
								sap.ui.getCore().byId("lblSuppCompervend").setVisible(true);
								sap.ui.getCore().byId("compcodeSupperpvend").setText(keyValue);

//							}
						}else{
							if(sap.ui.getCore().byId("lblSuppCompervend")!==undefined)
							sap.ui.getCore().byId("lblSuppCompervend").setVisible(false);
						}

						//Hide the sections in case the data is not maintained for the attributes in the section
						fcg.mdg.approvecrv2.DomainSpecParts.Supplier.hideSuppCompcodeSection();

						//Binding of the Dunning Areas in the Comapany Code. Here the navigation is achieved using different fragment and navigation is done using dunning id.
						if (oAssignedCompCodes.SP_CompDunningAreasRel.results !== undefined && oAssignedCompCodes.SP_CompDunningAreasRel.results.length > 0 )
						{
							oDataItems = "";
							ostrResults = {dataitems:[],ChangeData:[]};
							for(k=0; k<oAssignedCompCodes.SP_CompDunningAreasRel.results.length; k++)
							{
								var oAssignedDunningAreas = oAssignedCompCodes.SP_CompDunningAreasRel.results[k];

								var dunningArea = oAssignedDunningAreas.MABER;
								assignmntid = oAssignedDunningAreas.ASSIGNMENT_ID;
								var dunningAreaDesc = "";
								if(oAssignedDunningAreas.MABER__TXT!==undefined)
									dunningAreaDesc = oAssignedDunningAreas.MABER__TXT;
//								var dunningAreaDesc = "";
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
							sap.ui.getCore().byId("SDunningLayout").removeAllContent();
							s3Controller.odunningCreateTable = "";
							s3Controller.odunningCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.DunningTableCreate'); 
							sap.ui.getCore().byId("SDunningLayout").addContent(s3Controller.odunningCreateTable);
							s3Controller.odunningCreateTable.removeAllItems();
							s3Controller.odunningCreateTable.setModel(oModel);
							dunningtemplate.attachPress({Entity: "SuppCompanyCode", 
								Key:ostrResults.dataitems,
								EntityData: result},s3Controller.navtoSubDetail, s3Controller); 
							s3Controller.odunningCreateTable.bindItems('/dataitems', dunningtemplate, '', '');
						}
						else
						{
							//In case there is no dunnig areas maintained all the previous contents are being removed.
							sap.ui.getCore().byId("SDunningLayout").removeAllContent();
						}

						//Binding of the Extended Withholding Taxes within the Company Codes. Separate fragment is being used here and navigation to sub detail page is handled.
						if (oAssignedCompCodes.SP_CompWithholdingTaxesRel.results !== undefined && oAssignedCompCodes.SP_CompWithholdingTaxesRel.results.length > 0)
						{
							oDataItems = "";
							ostrResults = {dataitems:[]};
							for(k=0; k<oAssignedCompCodes.SP_CompWithholdingTaxesRel.results.length; k++)
							{
								var oAssignedWithTaxes = oAssignedCompCodes.SP_CompWithholdingTaxesRel.results[k];

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
							sap.ui.getCore().byId("SWithhldTaxLayout").removeAllContent();
							s3Controller.oexTaxCreateTable = "";
							s3Controller.oexTaxCreateTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ExtendedTaxTableCreate'); 
							sap.ui.getCore().byId("SWithhldTaxLayout").addContent(s3Controller.oexTaxCreateTable);
							s3Controller.oexTaxCreateTable.removeAllItems();
							s3Controller.oexTaxCreateTable.setModel(oModel);
							withTaxtemplate.attachPress({Entity: "SuppCompanyCode", 
								Key:ostrResults.dataitems,
								EntityData: result},s3Controller.navtoSubDetail, s3Controller); 
							s3Controller.oexTaxCreateTable.bindItems('/dataitems', withTaxtemplate, '', '');
						}
						else
						{
							sap.ui.getCore().byId("SWithhldTaxLayout").removeAllContent();
						}
					}
				}
			}
		},

//		In case if single sales Area is being maintained in the create scenario then directly a fragment is being loaded. Same fragment as that of the detail page is being used. 
//		No separate table fragments are being used here for partner functions and tax classifications the tables are included in the fragment itself.
		loadPurchasefragment : function (result,s3Controller,isMultiassignmnt)
		{
			var oModel = "";
			var ostrResults = "";
			var vElement;
			for(var i=0; i<result.results.length;i++)
			{
				//Binding of the Sales General Data
				if (result.results[i].SP_AssignedPurchasingOrgsRel.results.length >= 1)
				{
					var oAssignedPurchaseArea = result.results[i].SP_AssignedPurchasingOrgsRel.results[0];
					var Purchasekey = oAssignedPurchaseArea.EKORG;

					if (Purchasekey !== "")
					{
						var FinalResult = oAssignedPurchaseArea;
						oModel = new sap.ui.model.json.JSONModel();  
						oModel.setData(FinalResult);

						//The fragment used in the detail page is destroyed if its already been used to avoid the duplicate id issue.
						sap.ui.getCore().byId("SPurchaseLayout").removeAllContent();

						if (s3Controller.oPurchaseDetail !== "")
						{
							s3Controller.oPurchaseDetail.destroy();
						}

						if(s3Controller.oPurchaseCreateForm === ""){
							s3Controller.oPurchaseCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.PurchasingDetail',s3Controller );
						}
						else{

							// If already defined, remove it from detail page and instantiate it again
							sap.ui.getCore().byId("SPurchaseLayout").removeContent(s3Controller.oSalesCreateForm);
							if(s3Controller.oPurchaseCreateForm !== undefined){
								s3Controller.oPurchaseCreateForm.destroy();
							}
							s3Controller.oPurchaseCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.PurchasingDetail', s3Controller);
						}
						sap.ui.getCore().byId("SPurchaseLayout").addContent(s3Controller.oPurchaseCreateForm);                                                                     
						vElement = sap.ui.getCore().byId("SimpleFormPurchase");
						vElement.setModel(oModel);
						var oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
						var oI18nModel = oApplicationImplementation.AppI18nModel;
						var reasonText = oI18nModel.getProperty('Reason');
						var accGrpText = oI18nModel.getProperty('AccountGroup');
						

//						If there are more than one ERP customers AND only one company code is being maintained in any of the ERP customer then ERP customer description is shown in the fragment. 
						if (isMultiassignmnt === true)
						{
							var Objectid = result.results[i].OBJECT_ID;

							
//							if (Objectid === "" && result.results[i].STANDARD === "X")
//							{
//								Objectid =  accGrpText + " - " +result.results[i].SP_AssignedSupplierRel.KTOKK__TXT;
//								Objectid =  Objectid + "("+result.results[i].SP_AssignedSupplierRel.KTOKK+")";
//								Objectid = Objectid + ", " + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Standard"); 
//								sap.ui.getCore().byId("lblSuppPurchdVendor").setVisible(true);
//								sap.ui.getCore().byId("SuppPurchdVendor").setText(Objectid);
//							}
//							else
//							{
//								var reasondesc =  reasonText +" - "+result.results[i].REASON_ID__TXT;
//								if (Objectid !== "" && reasondesc !=="" )
//								{
//									Objectid = Objectid + ","+ accGrpText+" - "+result.results[i].SP_AssignedSupplierRel.KTOKK__TXT;
//									Objectid =  Objectid + "("+result.results[i].SP_AssignedSupplierRel.KTOKK+")";
//									Objectid =  Objectid + ", " + reasondesc;
//								}
//								if (Objectid === "" && reasondesc !=="" )
//								{
//									Objectid = accGrpText + " - "+result.results[i].SP_AssignedSupplierRel.KTOKK__TXT;
//									Objectid =  Objectid + "("+result.results[i].SP_AssignedSupplierRel.KTOKK+")";
//									Objectid =  Objectid + ", "+ reasondesc;
//								}
//								if (Objectid === "" && reasondesc ==="" )
//								{
//									Objectid = accGrpText+" - " + result.results[i].SP_AssignedSupplierRel.KTOKK__TXT;
//									Objectid =  Objectid + "("+result.results[i].SP_AssignedSupplierRel.KTOKK+")";
//								}

								var standard = result.results[i].STANDARD;
								var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(result.results[i].OBJECT_ID,result.results[i].OBJECT_ID__TXT);
								var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(result.results[i].REASON_ID,result.results[i].REASON_ID__TXT);
								var accgrp = "";
								if(result.results[i].SP_AssignedSupplierRel !== undefined && result.results[i].SP_AssignedSupplierRel.KTOKK !== undefined && result.results[i].SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
									accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( result.results[i].SP_AssignedSupplierRel.KTOKK,  result.results[i].SP_AssignedSupplierRel.KTOKK__TXT);
								}
								//var keyValue = this.getSubheader(standard,objid,reason);
								var keyValue = this.getSubheaderWithAccGrp(standard,objid,reason,accgrp);
								
								sap.ui.getCore().byId("lblSuppPurchdVendor").setVisible(true);
								sap.ui.getCore().byId("SuppPurchdVendor").setText(keyValue);
//							}
							
						}else{
							sap.ui.getCore().byId("lblSuppPurchdVendor").setVisible(false);
						}

						//Hide the respective sections in case no values are maintained for the texts under that section.
						fcg.mdg.approvecrv2.DomainSpecParts.Supplier.hidePurchaseSection();

						//Binding of the Partner Function Table. If no value exists then the table is hidden.
						if (oAssignedPurchaseArea.SP_PurchOrgPartnerFunctionsRel.results !== undefined && oAssignedPurchaseArea.SP_PurchOrgPartnerFunctionsRel.results.length > 0)
						{
							ostrResults = oAssignedPurchaseArea.SP_PurchOrgPartnerFunctionsRel;
							oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
							oModel.setData(ostrResults); 
							vElement = sap.ui.getCore().byId("supppartnerfunc");
							vElement.setVisible(true);
							vElement.setModel(oModel); 
							var partnerfunctemplate = this.getPartnerFuncTemplate(oModel);
							vElement.bindItems("/results", partnerfunctemplate);
						}
						else
						{
							sap.ui.getCore().byId("supppartnerfunc").setVisible(false);
						}
						//Binding of the Sub range Table. If no value exists then the table is hidden.
						if (oAssignedPurchaseArea.SP_PurchOrgPurchasingOrg2Rel.results !== undefined && oAssignedPurchaseArea.SP_PurchOrgPurchasingOrg2Rel.results.length > 0)
						{
							ostrResults = {dataitems:[]};

							for(var k=0; k<oAssignedPurchaseArea.SP_PurchOrgPurchasingOrg2Rel.results.length; k++)
							{
								var oAssignedSubranges = oAssignedPurchaseArea.SP_PurchOrgPurchasingOrg2Rel.results[k];

								var subrange = oAssignedSubranges.LTSNR;
								var subrange_desc = oAssignedSubranges.LTSNR__TXT;
								var finalSubrange = "";

								if (subrange!== "|#-#|" && subrange!=="|#|")
								{
									finalSubrange = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(subrange, subrange_desc);
								}


								var purchorg = oAssignedSubranges.EKORG;
								var assignmntid = oAssignedSubranges.ASSIGNMENT_ID;

								var plant = oAssignedSubranges.WERKS;
								var plant_desc = oAssignedSubranges.WERKS__TXT;
								var finalPlant = "";
								if (plant!== "|#-#|" && plant!=="|#|")
								{
									finalPlant = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(plant, plant_desc);
								}


								//            var withhldtaxDesc = oAssignedWithTaxes.CD_WITHT.Description;
								//            var withhldValue = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(withhldtax,withhldtaxDesc);
								var oDataItems = {
										"SubrangeDesc":finalSubrange,
										"Plant":finalPlant,
										"Key":assignmntid+purchorg+subrange+plant
								};

								ostrResults.dataitems.push(oDataItems);
							}
							oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
							oModel.setData(ostrResults); 
							var subrangetemplate = this.getSubrangeTemplate(oModel);
							sap.ui.getCore().byId("SSubrangeLayout").removeAllContent();
							s3Controller.subrangetable = "";
							s3Controller.subrangetable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SubRangeTableCreate'); 
							sap.ui.getCore().byId("SSubrangeLayout").addContent(s3Controller.subrangetable);
							s3Controller.subrangetable.removeAllItems();
							s3Controller.subrangetable.setModel(oModel);
							subrangetemplate.attachPress({Entity: "SubRange", 
								Key:ostrResults.dataitems,
								EntityData: result},s3Controller.navtoSubDetail, s3Controller); 
							s3Controller.subrangetable.bindItems('/dataitems', subrangetemplate, '', '');
						}
						else
						{
							sap.ui.getCore().byId("SSubrangeLayout").removeAllContent();
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
			var extoItemRelTemp = this.oS3Controller.suppHookgetDunningTemplate(oItemTempComp);
			if(extoItemRelTemp !== undefined){
				oItemTempComp = extoItemRelTemp;
			}
			return oItemTempComp;
		},

		//Table template for the partner function table. Which involves columns:Parner Function,Same Partner,Parner and Default Partner along with the key and description.
		getPartnerFuncTemplate : function (oModel)
		{
			var that = this;
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
				        			return   oModel.getProperty("REFLEXIVE__TXT", this.getBindingContext());
				        		}              
				        	}
				        }),

				        new sap.m.Text({
				        	text:{
				        		path:"LIFN2__TXT",
				        		formatter: function(){                                                                                    
				        			var desc = oModel.getProperty("LIFN2__TXT", this.getBindingContext());
				        			var key = oModel.getProperty("LIFN2", this.getBindingContext()); 
				        			if(that.isNull(key) && that.isNull(desc))
				        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
				        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);    
				        		}              
				        	}
				        }),

				        new sap.m.Text({
				        	text:{
				        		path:"DEFPA__TXT",
				        		formatter: function(){   
				        			var defPartner = oModel.getProperty("DEFPA__TXT", this.getBindingContext());
				        			if(that.isNull(defPartner))
				        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
				        			return defPartner;                                                                                           
				        		}
				        	}
				        }),

				        new sap.m.Text({
				        	text:{
				        		path:"LTSNR__TXT",
				        		formatter: function(){                                                                                    
				        			var desc = oModel.getProperty("LTSNR__TXT", this.getBindingContext());
				        			var key = oModel.getProperty("LTSNR", this.getBindingContext());                                                                                           
				        			if (key!== "|#-#|" && key!=="|#|")
				        				return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
				        			else
				        			{
				        				if(desc !== "|#-#|" && desc !== "|#-#|")
					        				return desc;
					        			else
					        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
				        			}
				        		}              

				        	}
				        }),

				        new sap.m.Text({
				        	text:{
				        		path:"WERKS__TXT",
				        		formatter: function(){                                                                                    
				        			var desc = oModel.getProperty("WERKS__TXT", this.getBindingContext());
				        			var key = oModel.getProperty("WERKS", this.getBindingContext());                                                                                           
				        			if (key!== "|#-#|" && key!=="|#|")
				        				return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
				        			else
				        			{
				        				if(desc !== "|#-#|" && desc !== "|#-#|")
					        				return desc;
					        			else
					        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
				        			}
				        		}              
				        	}
				        })]
			});
			var extoItemRelTemp = this.oS3Controller.suppHookgetPartnerFuncTemplate(oItemTempPf);
			if(extoItemRelTemp !== undefined){
				oItemTempPf = extoItemRelTemp;
			}
			return oItemTempPf;
		},

		//Table for sub-Range which involves 2 colums Sub Range and Plant information
		getSubrangeTemplate : function (oModel)
		{
			var oItemsubrange = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [         
				        new sap.m.Text({
				        	text:{
				        		path:"SubrangeDesc",
				        		formatter:fcg.mdg.approvecrv2.util.Formatter.noValue
				        	}
				        }),
				        new sap.m.Text({
				        	text:{
				        		path:"Plant",
				        		formatter:fcg.mdg.approvecrv2.util.Formatter.noValue
				        	}
				        })
				        ]
			});  
			var extoItemSubrangeTemp = this.oS3Controller.suppHookgetSubrangeTemplate(oItemsubrange);
			if(extoItemSubrangeTemp !== undefined){
				oItemsubrange = extoItemSubrangeTemp;
			}
			return oItemsubrange;
		},

		//Returns the subheader in case of multiple assignment of ERP customer. Sub header here is a combination of the ERP customer name along with the reason for the mutiple assignments.
		//In case of the standard assignment header is shown as ERP-Customer,STANDARD.
		getSubheader : function (standard,objid,reason )
		{
			var subheader = "";
			var pcYes = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
			var reasonLbl = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Reason");
			if ( standard === 'X')
			{
				subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERP_Vendor")+","+sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Standard")+": "+pcYes;
			}
			if ( standard !== 'X' && objid !== "" && reason !==""  )
			{
				subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERP_Vendor")+"(" +objid+ "),"+reasonLbl+": "+reason;
			}
			if ( standard !== 'X' && objid !== "" && reason ===""  )
			{
				subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERP_Vendor")+"(" +objid+ ")";
			}
			if (standard !== 'X' && objid === "" && reason !=="" )
			{
				subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERP_Vendor")+ ","+reasonLbl+": "+reason;
			}
			if (standard !== 'X' && objid === "" && reason ==="" )
			{
				subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERP_Vendor");
			}
			return subheader;
		},
		
		
		//Returns the subheader in case of multiple assignment of ERP customer. Sub header here is a combination of the ERP customer name along with the reason for the mutiple assignments.
		//In case of the standard assignment header is shown as ERP-Customer,STANDARD.
		// This header returns the sub header in the format : ERP, reason, Account Group, Standard  
		getSubheaderWithAccGrp : function (standard,objid,reason,accgrp )
		{
			var subheader = "";
			var reasonLbl = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Reason");
			var accgrpLbl = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("AccountGroup");
			var erpvendorLbl = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERP_Vendor");
			var standardLbl = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Standard");
			subheader = erpvendorLbl; 
			if(objid!==""){
				if(subheader!== "")
					subheader = subheader + ", " + "(" +objid+ ")";
				else
					subheader =  erpvendorLbl+"(" +objid+ ")";
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
			var extoItemCompCodeTemp = this.oS3Controller.supptHookCompCodeValueTemplate(oItemCompCodeTemp);
			if(extoItemCompCodeTemp !== undefined){
				oItemCompCodeTemp = extoItemCompCodeTemp;
			}
			return oItemCompCodeTemp;
		},

		showNodataPurchMsg : function() {
			if (this.purchText)
				this.purchText.destroy();
			this.purchText = new sap.m.Text("purchTxtCreate");
			this.purchText.setText(sap.ca.scfld.md.app.Application.getImpl()
					.getResourceBundle().getText("NodataCreate"));
			sap.ui.getCore().byId("SPurchaseLayout").removeAllContent();
			sap.ui.getCore().byId("SSubrangeLayout").removeAllContent();
			sap.ui.getCore().byId("SPurchaseLayout").addContent(this.purchText);
		},

		showNodataCCMsg : function() {
			if (this.ccSupText)
				this.ccSupText.destroy();
			this.ccSupText = new sap.m.Text("scTxtCreate");
			this.ccSupText.setText(sap.ca.scfld.md.app.Application.getImpl()
					.getResourceBundle().getText("NodataCreate"));
			sap.ui.getCore().byId("SCompCodeLayout").removeAllContent();
			sap.ui.getCore().byId("SDunningLayout").removeAllContent();
			sap.ui.getCore().byId("SWithhldTaxLayout").removeAllContent();
			sap.ui.getCore().byId("SCompCodeLayout").addContent(this.ccSupText);
		},
		
		/*eslint radix: 2*/ 
		isNull:function(value){
		    return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || value ==='' || parseInt(value) === 0;
		}

};