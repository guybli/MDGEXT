/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/* Here all the queries are included which are required to get the necessary data from the backend. Once the query is successful then the corresponding entities
section will be filled with the data.  */
//jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPChange");

fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange = {
		oChangetitle:"",
		oChangeauthorization:"",
		vAddrTabResults : {aAddressDetails:[]},
		vAddrUsgResults : {aAddrUsages:[]},
		oAddressItemTemp : "",
		aAddresses: [],
		aAddressUsages: [],
		noCompcodeData :"",
		noSalesData:"",
		vRelTabResults : {aRelDetails:[]},
		oItemTempRel : "",
		aRelations:[],
		oS3Controller : "",

		//Returns the overall query for the Company Code Change scenario including all the attributes
		getSuppCompanyCodeData : function(oSupplierModel, vPath , s3Controller){
			this.oS3Controller = s3Controller;
			var vCompletePath = vPath; //The URL till $expand=ChangeRequestCollection(""); 
			var vBasePath = 'BP_Root/SP_MultipleAssignmentsRel/';
			var vCommaSeperator = ',';
			var vChangeData = '/ChangeData';

			//Supplier Related Entities       
			vCompletePath = vCompletePath + vBasePath + "SP_AssignedCompanyCodesRel" + vChangeData+ vCommaSeperator;		
			vCompletePath = vCompletePath + vBasePath + "SP_AssignedSupplierRel" + vChangeData;
			//+ vCommaSeperator + vBasePath + "CD_OBJECT_ID";		
			//Dunning area details
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "SP_AssignedCompanyCodesRel/SP_CompDunningAreasRel" + vChangeData;
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "SP_AssignedCompanyCodesRel/SP_CompWithholdingTaxesRel" + vChangeData;
			var extQuery = s3Controller.custHookChangeCompCodeQuery(vCompletePath);
			if(extQuery !== undefined){
				vCompletePath = extQuery;
			}
			return vCompletePath;
		},

		//	Returns the overall query for the sales entity in case of change scenario.
		getPurchaseData : function(oSupplierModel, vPath ,s3Controller ){
			this.oS3Controller = s3Controller;
			var vCompletePath = vPath; //The URL till $expand=ChangeRequestCollection("");
			var vBasePath = 'BP_Root/SP_MultipleAssignmentsRel/';
			var vChangeData = '/ChangeData';
			var vCommaSeperator = ',';

			vCompletePath = vCompletePath + vBasePath + "SP_AssignedPurchasingOrgsRel" + vChangeData + vCommaSeperator;
			vCompletePath = vCompletePath + vBasePath + "SP_AssignedSupplierRel" + vChangeData;
			//	+ vCommaSeperator + vBasePath + "CD_OBJECT_ID";		
			//Partner Function
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "SP_AssignedPurchasingOrgsRel/SP_PurchOrgPurchasingOrg2Rel" + vChangeData;
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "SP_AssignedPurchasingOrgsRel/SP_PurchOrgPartnerFunctionsRel" + vChangeData;
			var extQuery = s3Controller.custHookChangeSalesQuery(vCompletePath);
			if(extQuery !== undefined){
				vCompletePath = extQuery;
			}
			return vCompletePath;
		},

//		Loades the company code data in case of the change scenario. Along with the company code data dunning data and withhld tax data is also binded together to the table. 
//		The table here involves context description New value and Old value with new value bolded. Even the navigation is handled here for each of the rows. 
//		In case of multiple assignment a table header will be shown along with the details of the Supplier.		
		displaySuppCompanyCodeData: function(result, s3Controller){
			var isMultiassignmnt = false;
			var keyValue = "";
			var oItemTemp = this.getTableTemplate();
			var newValue = "";
			var oldValue = "";
			var newValueTxt = "";
			var oldValueTxt = "";
			var newValueText1 = "";
			var oldValueText1 = "";
			var assignmentid = "";
			var standard = "";
			var vAttribute="";
			var objid = "";
			var reason = "";
			var oDataItems = "";
			var compcode = "";
			var keyValueText;
			var keyValueTxt = "";
			var key = "";
			var l,k;
			var accgrp="";
			var aSorter = [];
			var oSorterKey, oSorterContx;
			var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();

			if (result.BP_Root.SP_MultipleAssignmentsRel.results !== undefined  && result.BP_Root.SP_MultipleAssignmentsRel.results.length>0 )
			{
				if( result.BP_Root.SP_MultipleAssignmentsRel.results.length > 1 ) 
				{
					isMultiassignmnt = true;
				}
				var ostrResults = {dataitems:[]};
				for (var i=0; i<result.BP_Root.SP_MultipleAssignmentsRel.results.length; i++ )
				{
					if (result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedCompanyCodesRel.results !== undefined )
					{
						for (var j=0; j<result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedCompanyCodesRel.results.length;j++)
						{
							var oAssignedCompCodes = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedCompanyCodesRel.results[j];

							if (oAssignedCompCodes.ChangeData.results !== undefined )
							{
								oDataItems = "";
								//Company Code Changes are moved to a array 
								for(k=0; k<oAssignedCompCodes.ChangeData.results.length; k++)
								{  
									newValue =     oAssignedCompCodes.ChangeData.results[k].NewValue;
									oldValue =     oAssignedCompCodes.ChangeData.results[k].OldValue;
									newValueTxt =  oAssignedCompCodes.ChangeData.results[k].NewValueText;
									oldValueTxt =  oAssignedCompCodes.ChangeData.results[k].OldValueText;
									vAttribute =   oAssignedCompCodes.ChangeData.results[k].Attribute;
									assignmentid = oAssignedCompCodes.ASSIGNMENT_ID;
									var compKey =      oAssignedCompCodes.BUKRS;
									key =          assignmentid+compKey;
									
									newValueText1 = this.getValue(newValue,newValueTxt,vAttribute,"new");
									oldValueText1 = this.getValue(oldValue,oldValueTxt,vAttribute,"old");

									if ( isMultiassignmnt === true )
									{
										standard = result.BP_Root.SP_MultipleAssignmentsRel.results[i].STANDARD;
										objid = result.BP_Root.SP_MultipleAssignmentsRel.results[i].OBJECT_ID__TXT;
										reason = result.BP_Root.SP_MultipleAssignmentsRel.results[i].REASON_ID__TXT;
										
										if(result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
											var supp = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel;
											accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( supp.KTOKK,supp.KTOKK__TXT);
										}
										keyValue = this.getSubheaderWithAccGrp(standard,objid,reason,accgrp);
									}
									else
									{
										keyValue = "";
									}
									//Handling of the attribute descriptions in case the descriptions are different from that of the UI 
									var attribute = oAssignedCompCodes.ChangeData.results[k].Attribute;
									var attributeDesc = oAssignedCompCodes.ChangeData.results[k].AttributeDesc;
									var AttributeDesc = '';
									
									if(attribute === 'ZSABE' || attribute === 'EIKTO'){
									  AttributeDesc = oAssignedCompCodes.ChangeData.results[k].AttributeDesc;}
									else{
									 AttributeDesc = fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(attribute,attributeDesc);}

									oDataItems = {   
											"Context":oAssignedCompCodes.ChangeData.results[k].Context, 
											"EntityDesc":oBundle.getText("GL_COMP_CODE"),
											"Dunning":"",
											"Key":key,
											"Withhld":"",
											"KeyValue":keyValue,
											"AttributeDesc":AttributeDesc,
											"EntityAction": oAssignedCompCodes.ChangeData.results[k].EntityAction,
											"NewValueText":newValueText1,
											"OldValue":oldValueText1,
											"ParentContext" : "",
											"ParentEntityDesc" : "",
											"ParentEntityVisible" : false
									};		

									ostrResults.dataitems.push(oDataItems);
									s3Controller.oSuppCompCode.aSuppCompCode.push(oDataItems);      
								}
							}	
							//Dunning Area Changes  are also moved to the same array in which all the company code changes are pushed.
							if ( oAssignedCompCodes.SP_CompDunningAreasRel.results !== undefined && oAssignedCompCodes.SP_CompDunningAreasRel.results.length>0 ) 
							{
								oDataItems = "";
								for (k=0; k<oAssignedCompCodes.SP_CompDunningAreasRel.results.length;k++)
								{
									var oDunningAreas = oAssignedCompCodes.SP_CompDunningAreasRel.results[k];

									if (oDunningAreas.ChangeData.results  !== undefined)
									{	
										for(l=0; l<oDunningAreas.ChangeData.results.length; l++)
										{  
											newValue = oDunningAreas.ChangeData.results[l].NewValue;
											oldValue = oDunningAreas.ChangeData.results[l].OldValue;
											newValueTxt = oDunningAreas.ChangeData.results[l].NewValueText;
											oldValueTxt = oDunningAreas.ChangeData.results[l].OldValueText;
											vAttribute = oDunningAreas.ChangeData.results[l].Attribute;
											newValueText1 = this.getValue(newValue,newValueTxt,vAttribute,"new");
											oldValueText1 = this.getValue(oldValue,oldValueTxt,vAttribute,"old");

											var dunningid = oDunningAreas.MABER;
											keyValueTxt = oDunningAreas.MABER__TXT;

											//If there is no description maintained for the dunning area then a default description is Shown.
											if(keyValueTxt === "")
											{
												keyValueTxt = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DefaultDunning");
											}

											compcode = oDunningAreas.BUKRS;
											assignmentid = oDunningAreas.ASSIGNMENT_ID;
											var dunningKey = assignmentid+compcode+dunningid;
											var Key = assignmentid+compcode;
											keyValueText = this.getValue(dunningid,keyValueTxt);
											var CCKey =  oAssignedCompCodes.BUKRS__TXT + "("+ oAssignedCompCodes.BUKRS + ")";
											//In case parent doesn't have any changed data in such cases context of child is followed by context of the parent
											if (oAssignedCompCodes.ChangeData.results.length === 0)
											{
												if (keyValueText === "")
												{
													keyValueText = oDunningAreas.ChangeData.results[l].Context;
												}
												else
												{
													keyValueText = keyValueText ;
												}
											}
											if ( isMultiassignmnt === true )
											{
												standard = result.BP_Root.SP_MultipleAssignmentsRel.results[i].STANDARD;
												objid = result.BP_Root.SP_MultipleAssignmentsRel.results[i].OBJECT_ID__TXT;
												reason = result.BP_Root.SP_MultipleAssignmentsRel.results[i].REASON_ID__TXT;
												if(result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
													var supp = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel;
													accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( supp.KTOKK,supp.KTOKK__TXT);
												}
												keyValue = this.getSubheaderWithAccGrp(standard,objid,reason,accgrp);
												//keyValue = this.getSubheader(standard,objid,reason);
											}
											else
											{
												keyValue = "";
											}
											oDataItems = {   
													"Context":keyValueText,
													"Key":Key,
													"KeyValue":keyValue,
													"Dunning":dunningKey,
													"EntityDesc":oBundle.getText("DunningArea"),
													"Withhld":"",
													"AttributeDesc":oDunningAreas.ChangeData.results[l].AttributeDesc,
													"EntityAction": oDunningAreas.ChangeData.results[l].EntityAction,
													"NewValueText":newValueText1,
													"OldValue":oldValueText1,
													"ParentContext" : CCKey,
													"ParentEntityDesc" : oBundle.getText("GL_COMP_CODE"),
													"ParentEntityVisible" : true
											};

											ostrResults.dataitems.push(oDataItems);
											s3Controller.oSuppCompCode.aSuppCompCode.push(oDataItems);
										}  
									}	
								}
							}
							//With Holding Tax Changes moved to the same array where both company code and dunning changes exists.
							if ( oAssignedCompCodes.SP_CompWithholdingTaxesRel.results !== undefined && oAssignedCompCodes.SP_CompWithholdingTaxesRel.results.length>0 ) 
							{
								oDataItems = "";
								for (k=0; k<oAssignedCompCodes.SP_CompWithholdingTaxesRel.results.length;k++)
								{
									var oWithholdTaxes = oAssignedCompCodes.SP_CompWithholdingTaxesRel.results[k];
									//	{
									if (oWithholdTaxes.ChangeData.results !== undefined)
									{
										for(l=0; l<oWithholdTaxes.ChangeData.results.length; l++)
										{  
											newValue = oWithholdTaxes.ChangeData.results[l].NewValue;
											oldValue = oWithholdTaxes.ChangeData.results[l].OldValue;
											newValueTxt = oWithholdTaxes.ChangeData.results[l].NewValueText;
											oldValueTxt = oWithholdTaxes.ChangeData.results[l].OldValueText;
											vAttribute =   oWithholdTaxes.ChangeData.results[l].Attribute;
											newValueText1 = this.getValue(newValue,newValueTxt,vAttribute,"new");
											oldValueText1 = this.getValue(oldValue,oldValueTxt,vAttribute,"old");

											var withhldid = oWithholdTaxes.WITHT;
											keyValueTxt = oWithholdTaxes.WITHT__TXT;
											compcode = oWithholdTaxes.BUKRS;
											assignmentid = oWithholdTaxes.ASSIGNMENT_ID;
											var withhldKey = assignmentid+compcode+withhldid;
											Key = assignmentid+compcode;
											keyValueText = this.getValue(withhldid,keyValueTxt);
											var CCKey = oAssignedCompCodes.BUKRS__TXT + "("+ oAssignedCompCodes.BUKRS + ")";
											//In case parent doesn't have any changed data in such cases context of child is follwed by context of the parent
											if (oAssignedCompCodes.ChangeData.results.length === 0)
											{
												if (keyValueText === "")
												{
													keyValueText = oWithholdTaxes.ChangeData.results[l].Context ;
												}
												else
												{
													keyValueText = keyValueText ;
												}
											}

											if ( isMultiassignmnt === true )
											{
												standard = result.BP_Root.SP_MultipleAssignmentsRel.results[i].STANDARD;
												objid = result.BP_Root.SP_MultipleAssignmentsRel.results[i].OBJECT_ID__TXT;
												reason = result.BP_Root.SP_MultipleAssignmentsRel.results[i].REASON_ID__TXT;
												if(result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
													var supp = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel;
													accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( supp.KTOKK,supp.KTOKK__TXT);
												}
												keyValue = this.getSubheaderWithAccGrp(standard,objid,reason,accgrp);
											//	keyValue = this.getSubheader(standard,objid,reason);
											}
											else
											{
												keyValue = "";
											}
											oDataItems = {   
													"Context":keyValueText,
													"Key":Key,
													"KeyValue":keyValue,
													"Dunning":"",
													"EntityDesc":oBundle.getText("withhdtax"),
													"Withhld":withhldKey,
													"EntityAction": oWithholdTaxes.ChangeData.results[l].EntityAction,
													"AttributeDesc":oWithholdTaxes.ChangeData.results[l].AttributeDesc,
													"NewValueText":newValueText1,
													"OldValue":oldValueText1,
													"ParentContext" : CCKey,
													"ParentEntityDesc" : oBundle.getText("GL_COMP_CODE"),
													"ParentEntityVisible" : true
											};

											ostrResults.dataitems.push(oDataItems);
											s3Controller.oSuppCompCode.aSuppCompCode.push(oDataItems);
										}  
									}			
								}

							}
						}

					}

				}
//				Grouping of the all the records in the array is done based on the  company code key. In case of the multiple assignments table header is shown which is achieved using the sorter.
				var aCompCodes = [];
				s3Controller.compCodeResults = {dataitems:[]};
				for (l=0; l<s3Controller.oSuppCompCode.aSuppCompCode.length; l++ )
				{
					aCompCodes.push(s3Controller.oSuppCompCode.aSuppCompCode[l].Key);
				}
				aCompCodes.sort();                
				s3Controller.aUniqueCompcode = this.eliminateDuplicatesRecords(aCompCodes);

				for(var r=0; r<s3Controller.aUniqueCompcode.length; r++ )
				{
					for (l=0; l<s3Controller.oSuppCompCode.aSuppCompCode.length; l++)
					{
						if ( s3Controller.aUniqueCompcode[r] === s3Controller.oSuppCompCode.aSuppCompCode[l].Key )
						{
							s3Controller.compCodeResults.dataitems.push(s3Controller.oSuppCompCode.aSuppCompCode[l]);
						}
					}
				}

				s3Controller.compCodeResults.dataitems .sort();
				s3Controller.compCodeResults.dataitems.reverse();

				if (s3Controller.compCodeResults.dataitems.length > 0)
				{
					var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it  
					oModel.setData(s3Controller.compCodeResults);

					sap.ui.getCore().byId("SCompCodeLayout").removeAllContent();
					sap.ui.getCore().byId("SDunningLayout").removeAllContent();
					sap.ui.getCore().byId("SWithhldTaxLayout").removeAllContent();
					s3Controller.oCompcodeTable = "";
					s3Controller.oCompcodeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse',s3Controller); 
					sap.ui.getCore().byId("SCompCodeLayout").addContent(s3Controller.oCompcodeTable);
					s3Controller.oCompcodeTable.setGrowing(true);

					s3Controller.oCompcodeTable.setModel(oModel);
					oItemTemp.attachPress({Entity: "SuppCompanyCode", 
						Key:s3Controller.compCodeResults.dataitems,
						EntityData: result.BP_Root.SP_MultipleAssignmentsRel},s3Controller.navtoSubDetail, s3Controller); 
					if ( isMultiassignmnt === true )
					{
						aSorter = [];
						oSorterContx = new sap.ui.model.Sorter("KeyValue", false, true);	
						oSorterKey = new sap.ui.model.Sorter("Key", false, false);	
						aSorter.push(oSorterContx);
						aSorter.push(oSorterKey);
						s3Controller.oCompcodeTable.bindItems('/dataitems', oItemTemp, aSorter, '');
					}
					else
					{
						aSorter = [];
						oSorterKey = new sap.ui.model.Sorter("Key", true, false);	
						oSorterContx = new sap.ui.model.Sorter("Context", true, false);	
						aSorter.push(oSorterKey);
						aSorter.push(oSorterContx);
						s3Controller.oCompcodeTable.bindItems('/dataitems', oItemTemp, aSorter, '');
					}
				}
				else
				{
					/**Check if obsolete data is also initial and only then dispaly the no data messages**/
					this.showNodataCCMsg();
				}
				s3Controller.aUniqueCompcode = [];
				return;
			}
			else
			{
				/**Check if obsolete data is also initial and only then dispaly the no data messages**/
				this.showNodataCCMsg();
			}

			s3Controller.oSuppCompCode={aSuppCompCode:[]};
		},

//		Displayes the sales data in case of the change scenario. The changed data here involves context information New value and old value. 
//		Each row will have the navigation property and sub detail page is loaded on clicking of the row. 		
		displayPurchaseData: function(result, s3Controller){
			var isMultiassignmnt = false;
			var keyValue = "";
			var oItemTemp = this.getTableTemplate();
			
			var newValue = "";
			var oldValue = "";
			var newValueTxt = "";
			var oldValueTxt = "";
			var newValueText = "";
			var oldValueText = "";
			var assignmentid = "";
			var standard = "";
			var objid = "";
			var reason = "";
			var oDataItems = "";
			var attribute = "";
			var attributeDesc = "";
			var AttributeDesc = "";
			var vAttribute = "";
			var Key = "";
			var accgrp="";
			var l,k;
			var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
			if (result.BP_Root.SP_MultipleAssignmentsRel.results !== undefined  && result.BP_Root.SP_MultipleAssignmentsRel.results.length>0 )
			{
				if( result.BP_Root.SP_MultipleAssignmentsRel.results.length > 1 ) 
				{
					isMultiassignmnt = true;
				}
				var ostrResults = {dataitems:[]};
				for (var i=0; i<result.BP_Root.SP_MultipleAssignmentsRel.results.length; i++ )
				{
					if (result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedPurchasingOrgsRel.results !== undefined )
					{

						for (var j=0; j<result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedPurchasingOrgsRel.results.length;j++)
						{
							var oAssignedPurchaseArea = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedPurchasingOrgsRel.results[j];
                             var  vPOKey = oAssignedPurchaseArea.EKORG__TXT + " (" + oAssignedPurchaseArea.EKORG + ")";
							if (oAssignedPurchaseArea.ChangeData.results !== undefined )
							{
								oDataItems = "";
								//Sales area changes are moved to the array
								for(k=0; k<oAssignedPurchaseArea.ChangeData.results.length; k++)
								{  
									newValue = oAssignedPurchaseArea.ChangeData.results[k].NewValue;
									oldValue = oAssignedPurchaseArea.ChangeData.results[k].OldValue;
									newValueTxt = oAssignedPurchaseArea.ChangeData.results[k].NewValueText;
									oldValueTxt = oAssignedPurchaseArea.ChangeData.results[k].OldValueText;
									vAttribute =   oAssignedPurchaseArea.ChangeData.results[k].Attribute;

									assignmentid = oAssignedPurchaseArea.ASSIGNMENT_ID;
									Key = assignmentid+oAssignedPurchaseArea.EKORG;

									newValueText = this.getValue(newValue,newValueTxt,vAttribute,"new");
									oldValueText = this.getValue(oldValue,oldValueTxt,vAttribute,"old");

									/*	if (oAssignedPurchaseArea.ChangeData.results[k].Attribute === "AWAHR" && oAssignedPurchaseArea.ChangeData.results[k].NewValue === "000")
									{
										newValueText = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_DELETED");
									}*/
									if ( isMultiassignmnt === true )
									{
										standard = result.BP_Root.SP_MultipleAssignmentsRel.results[i].STANDARD;
										objid = result.BP_Root.SP_MultipleAssignmentsRel.results[i].OBJECT_ID;
										reason = result.BP_Root.SP_MultipleAssignmentsRel.results[i].REASON_ID__TXT;
										if(result.BP_Root.SP_MultipleAssignmentsRel.results[i] !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
											var supp = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel;
											accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( supp.KTOKK,supp.KTOKK__TXT);
										}
										keyValue = this.getSubheaderWithAccGrp(standard,objid,reason,accgrp);
										//keyValue = this.getSubheader(standard,objid,reason);
									}
									else
									{
										keyValue = "";
									}

									//Handling of the attribute descriptions in case the descriptions are different from that of the UI
									attribute = oAssignedPurchaseArea.ChangeData.results[k].Attribute;
									attributeDesc = oAssignedPurchaseArea.ChangeData.results[k].AttributeDesc;
									AttributeDesc = fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(attribute,attributeDesc);
									if(attribute === 'EIKTO'){
										  
										  AttributeDesc = oAssignedPurchaseArea.ChangeData.results[k].AttributeDesc;}
									oDataItems = {   
											"Context":oAssignedPurchaseArea.ChangeData.results[k].Context, 
											"Key": Key,
											"Subrange": "",
											"KeyValue":keyValue,
											"AttributeDesc":AttributeDesc,
											"EntityDesc":oBundle.getText("SP_purchorg"),
											"EntityAction": oAssignedPurchaseArea.ChangeData.results[k].EntityAction,
											"NewValueText":newValueText,
											"OldValue":oldValueText,
											"ParentContext": "",
										    "ParentEntityDesc" : "",
											"ParentEntityVisible" : false
									};	

									ostrResults.dataitems.push(oDataItems);
									s3Controller.oPurchaseArea.aPurchaseArea.push(oDataItems);      
								} 
							}
							//Partner Function Changes are also moved to the same array as that of the sales area changes and grouped at the end
							if ( oAssignedPurchaseArea.SP_PurchOrgPartnerFunctionsRel.results !== undefined && oAssignedPurchaseArea.SP_PurchOrgPartnerFunctionsRel.results.length>0 ) 
							{
								oDataItems = "";
								for (k=0; k<oAssignedPurchaseArea.SP_PurchOrgPartnerFunctionsRel.results.length;k++)
								{
									var oPartnerFunctions = oAssignedPurchaseArea.SP_PurchOrgPartnerFunctionsRel.results[k];

									for(l=0; l<oPartnerFunctions.ChangeData.results.length; l++)
									{  
										newValue = oPartnerFunctions.ChangeData.results[l].NewValue;
										oldValue = oPartnerFunctions.ChangeData.results[l].OldValue;
										newValueTxt = oPartnerFunctions.ChangeData.results[l].NewValueText;
										oldValueTxt = oPartnerFunctions.ChangeData.results[l].OldValueText;
										vAttribute =   oPartnerFunctions.ChangeData.results[l].Attribute;

										newValueText = this.getValue(newValue,newValueTxt,vAttribute,"new");
										oldValueText = this.getValue(oldValue,oldValueTxt,vAttribute,"old");
										assignmentid = oAssignedPurchaseArea.ASSIGNMENT_ID;


										var purchorg = oAssignedPurchaseArea.EKORG;
										Key = assignmentid+purchorg;
										var partnerfunckey = oPartnerFunctions.PARVW;
										var partnerfuncDesc = oPartnerFunctions.PARVW__TXT;
										var context = this.getValue(partnerfunckey,partnerfuncDesc);

										//In case parent doesn't have any changed data in such cases context of child is follwed by context of the parent
										if (oAssignedPurchaseArea.ChangeData.results.length === 0)
										{
											if (context === "")
											{
												context = oPartnerFunctions.ChangeData.results[l].Context ;
											}
											else
											{
												context = context ;
											}
										}

										if ( isMultiassignmnt === true )
										{
											standard = result.BP_Root.SP_MultipleAssignmentsRel.results[i].STANDARD;
											objid = result.BP_Root.SP_MultipleAssignmentsRel.results[i].OBJECT_ID;
											reason = result.BP_Root.SP_MultipleAssignmentsRel.results[i].REASON_ID__TXT;
											if(result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
												var supp = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel;
												accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( supp.KTOKK,supp.KTOKK__TXT);
											}
											keyValue = this.getSubheaderWithAccGrp(standard,objid,reason,accgrp);
											//keyValue = this.getSubheader(standard,objid,reason);
										}
										else
										{
											keyValue = "";
										}

										//Handling of the attribute descriptions in case the descriptions are different from that of the UI
										attribute = oPartnerFunctions.ChangeData.results[l].Attribute;
										attributeDesc = oPartnerFunctions.ChangeData.results[l].AttributeDesc;
										AttributeDesc = fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(attribute,attributeDesc);

										oDataItems = {   
												"Context":context,
												"Key":Key,
												"Subrange": "",
												"KeyValue":keyValue,
												"AttributeDesc": AttributeDesc, 
												"EntityAction": oPartnerFunctions.ChangeData.results[l].EntityAction,
												"NewValueText":newValueText,
												"EntityDesc":oBundle.getText("PartnerFunc"),
												"OldValue":oldValueText,
												"ParentContext": vPOKey,
												"ParentEntityDesc" : oBundle.getText("SP_purchorg"),
												"ParentEntityVisible" : true
										};

										ostrResults.dataitems.push(oDataItems);
										s3Controller.oPurchaseArea.aPurchaseArea.push(oDataItems);
									}  
								}			
							}
							//Sub Range changes are moved to the same array that contains Purchase area changes and partner func changes.
							if ( oAssignedPurchaseArea.SP_PurchOrgPurchasingOrg2Rel.results !== undefined && oAssignedPurchaseArea.SP_PurchOrgPurchasingOrg2Rel.results.length>0 ) 
							{
								oDataItems = "";
								for (k=0; k<oAssignedPurchaseArea.SP_PurchOrgPurchasingOrg2Rel.results.length;k++)
								{
									var oPurchaseSubranges = oAssignedPurchaseArea.SP_PurchOrgPurchasingOrg2Rel.results[k];

									for(l=0; l<oPurchaseSubranges.ChangeData.results.length; l++)
									{  
										newValue = oPurchaseSubranges.ChangeData.results[l].NewValue;
										oldValue = oPurchaseSubranges.ChangeData.results[l].OldValue;
										newValueTxt = oPurchaseSubranges.ChangeData.results[l].NewValueText;
										oldValueTxt = oPurchaseSubranges.ChangeData.results[l].OldValueText;
                                        
                                        attribute = oPurchaseSubranges.ChangeData.results[l].Attribute;
                                        attributeDesc = oPurchaseSubranges.ChangeData.results[l].AttributeDesc;

                                        AttributeDesc = fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(attribute,attributeDesc);

										newValueText = this.getValue(newValue,newValueTxt,attribute,"new");
										oldValueText = this.getValue(oldValue,oldValueTxt,attribute,"old");

										var PurchaseOrg = oAssignedPurchaseArea.EKORG;
										assignmentid = oAssignedPurchaseArea.ASSIGNMENT_ID;
										// If there is no name for subrange 
										// then we need to show the plant key and description
										var subrange = "";
										var flagLTSNR = false;
										var subrangelabel = oBundle.getText("SubRange");
										var plantlabel = oBundle.getText("plant");
										if(oPurchaseSubranges.LTSNR !== '|#-#|' && oPurchaseSubranges.LTSNR !== ''){
											subrange = subrangelabel +": "+   fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oPurchaseSubranges.LTSNR,oPurchaseSubranges.LTSNR__TXT);
											flagLTSNR = true;
	                                    }
										else if(oPurchaseSubranges.WERKS !== '|#-#|' && oPurchaseSubranges.WERKS !== ''){
	                                        if(flagLTSNR)
	                                        	subrange = subrange + "; ";
											subrange = subrange + plantlabel +" : "+oPurchaseSubranges.WERKS__TXT + "(" + oPurchaseSubranges.WERKS + ")";
	                                    }
//										if(oPurchaseSubranges.LTSNR__TXT === undefined || oPurchaseSubranges.LTSNR__TXT === "")
//											{
//											if(oPurchaseSubranges.LTSNR !== '|#-#|')
//											subrange = oPurchaseSubranges.LTSNR;
//											else{
//												subrange = "";
//											}
//											}
										Key = assignmentid+PurchaseOrg+ oPurchaseSubranges.LTSNR + oPurchaseSubranges.WERKS;
										if ( isMultiassignmnt === true )
										{
											standard = result.BP_Root.SP_MultipleAssignmentsRel.results[i].STANDARD;
											objid = result.BP_Root.SP_MultipleAssignmentsRel.results[i].OBJECT_ID;
											reason = result.BP_Root.SP_MultipleAssignmentsRel.results[i].REASON_ID__TXT;
											if(result.BP_Root.SP_MultipleAssignmentsRel.results[i] !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK !== undefined && result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel.KTOKK__TXT !== undefined ){
												var supp = result.BP_Root.SP_MultipleAssignmentsRel.results[i].SP_AssignedSupplierRel;
												accgrp = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc( supp.KTOKK,supp.KTOKK__TXT);
											}
											keyValue = this.getSubheaderWithAccGrp(standard,objid,reason,accgrp);
											//keyValue = this.getSubheader(standard,objid,reason);
											
										}
										else
										{
											keyValue = "";
										}
										
										oDataItems = {   
												"Context":subrange,
												"Key":Key,
												"KeyValue":keyValue,
												"AttributeDesc":AttributeDesc,
												"EntityAction": oPurchaseSubranges.ChangeData.results[l].EntityAction,
												"NewValueText":newValueText,
												"EntityDesc":oBundle.getText("diffpurchdata"),
												"OldValue":oldValueText,
												"ParentContext": vPOKey,
												"ParentEntityDesc" : oBundle.getText("SP_purchorg"),
												"ParentEntityVisible" : true
										};

										ostrResults.dataitems.push(oDataItems);
										s3Controller.oPurchaseArea.aPurchaseArea.push(oDataItems);
									}  
								}			
							}
						}	
					}
				}
				//	Grouping of Sales area and Partner Func and Tax classification changes based on the sales are key.
				var aPurchaseArea = [];
				s3Controller.PurchaseAreaResults = {dataitems:[]};
				for (l=0; l<s3Controller.oPurchaseArea.aPurchaseArea.length; l++ )
				{
					aPurchaseArea.push(s3Controller.oPurchaseArea.aPurchaseArea[l].Key);
				}
				aPurchaseArea.sort();                
				s3Controller.aUniqueCompcode = this.eliminateDuplicatesRecords(aPurchaseArea);

				for(var r=0; r<s3Controller.aUniqueCompcode.length; r++ )
				{
					for (l=0; l<s3Controller.oPurchaseArea.aPurchaseArea.length; l++)
					{
						if ( s3Controller.aUniqueCompcode[r] === s3Controller.oPurchaseArea.aPurchaseArea[l].Key )
						{
							s3Controller.PurchaseAreaResults.dataitems.push(s3Controller.oPurchaseArea.aPurchaseArea[l]);
						}
					}
				}
				if (s3Controller.PurchaseAreaResults.dataitems.length > 0 )
				{
					var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it  
					oModel.setData(s3Controller.PurchaseAreaResults);
					sap.ui.getCore().byId("SPurchaseLayout").removeAllContent();
					sap.ui.getCore().byId("SSubrangeLayout").removeAllContent();
					s3Controller.oSalesTable = "";
					s3Controller.oSalesTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse',s3Controller); 
					sap.ui.getCore().byId("SPurchaseLayout").addContent(s3Controller.oSalesTable);
					if (s3Controller.oApplicationFacade.isMock())
					{
						s3Controller.oSalesTable.setGrowing(false);
					}else{
						s3Controller.oSalesTable.setGrowing(true);
					}

					s3Controller.oSalesTable.setModel(oModel);
					oItemTemp.attachPress({Entity: "PurchaseData", 
						Key:s3Controller.PurchaseAreaResults.dataitems,
						EntityData: result.BP_Root.SP_MultipleAssignmentsRel},s3Controller.navtoSubDetail, s3Controller); 

					if ( isMultiassignmnt === true )
					{
						var aSorter = [];
						var oSorterContx = new sap.ui.model.Sorter("KeyValue", false, true);	
						var oSorterKey = new sap.ui.model.Sorter("Key", false, false);	
						aSorter.push(oSorterContx);
						aSorter.push(oSorterKey);
						s3Controller.oSalesTable.bindItems('/dataitems', oItemTemp, aSorter, '');
					}
					else
					{
						s3Controller.oSalesTable.bindItems('/dataitems', oItemTemp, '', '');
					}
				}
				else
				{
					/**Check if obsolete data is also initial and only then dispaly the no data messages**/
					this.showNodataPurchMsg();
				}
				s3Controller.aUniqueCompcode = [];
				return;
			}
			else
			{
				/**Check if obsolete data is also initial and only then dispaly the no data messages**/
				this.showNodataPurchMsg();
			}

			s3Controller.oPurchaseArea={aPurchaseArea:[]};
		},

		//Returns the subheader in case of multiple assignment of ERP Vendor. Sub header here is a combination of the ERP Vendor name along with the reason for the mutiple assignments.
		//In case of the standard assignment header is shown as ERP-Vendor,STANDARD.
		getSubheader : function (standard,objid,reason )
		{
			var subheader = "";
			var pcYes = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
			var reasonLbl = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Reason");
			if ( standard === 'X')
			{
				subheader = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ERP_Vendor")+","+sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Standard");
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


		getTableTemplate: function(){
			var oItemTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				        new sap.m.VBox({
				        items : [
				        new sap.m.ObjectIdentifier({
				        	text:"{EntityDesc}",
				        	title:"{Context}" 
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
		getPOTableTemplate: function(){
			var oItemTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				    new sap.m.VBox({
				        items : [
				        new sap.m.ObjectIdentifier({
				        	text:"{EntityDesc}",
				        	title:"{Context}" 
				        }).addStyleClass("objectIdentifier_text"),
				        new sap.m.ObjectIdentifier({
				        	text:"{POEntityDesc}",
				        	title:"{POContext}" ,
				        	visible : "{POVisible}"
				        }).addStyleClass("objIdentifier_margin").addStyleClass("objectIdentifier_text")
				        ]
				        }),

				        new sap.m.ObjectIdentifier({
				        	text: "{AttributeDesc}"          
				        	,

				        	title: "{NewValueText}"          
				        	

				        }), 

				        new sap.m.Text({
				        	text:"{OldValue}"
				        	
				        })                        
				        ]});


			return oItemTemp;
		},
		getAddressTableTemplate: function(oModel){
			var oItemTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				        new sap.m.ObjectIdentifier({
				        	text: {
				        		path: "Context"          
				        	},
				        	title: {
				        		path: "EntityDesc"          
				        	}
				        }), 
				        new sap.m.ObjectIdentifier({
				        	text: {
				        		path: "AttributeDesc"          
				        	},
				        	title: {
				        		path: "NewValueText",
				        		formatter: function(){
				        			var ctx = this.getBindingContext();
				        			var vNewVal = oModel.getProperty("NewValue", ctx);
				        			var vNewValTxt = oModel.getProperty("NewValueText", ctx);
				        			if(vNewVal === 'X')
				        				return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Y");				        			
				        			else if(vNewValTxt !== '' && vNewVal !== '')
				        				return vNewValTxt + '(' + vNewVal +')';
				        			else if(vNewVal === '' && vNewValTxt!=='')
				        				return vNewValTxt;
				        			else
				        				return vNewVal;
				        		}
				        	}
				        }), 
				        new sap.m.Text({
				        	text:{
				        		path:"OldValue",
				        		formatter: function(){
				        			var ctx = this.getBindingContext();
				        			var vOldVal = oModel.getProperty("OldValue", ctx);
				        			var vOldValTxt = oModel.getProperty("OldValueText", ctx);
				        			if(vOldVal === 'X')
				        				return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Y");				        			
				        			else if(vOldValTxt !== '' && vOldVal !== '')
				        				return vOldValTxt + '(' + vOldVal +')';
				        			else if(vOldVal === '' && vOldValTxt!=='')
				        				return vOldValTxt;				        			
				        			else
				        				return vOldVal;
				        		}				        			
				        	}
				        })                        
				        ]});



			return oItemTemp;
		},		

		//get change template
		getChangeTableTemplate: function(oModel){
			var oItemTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				        new sap.m.ObjectIdentifier({
				        	text: {
				        		path: "Context"          
				        	},
				        	title: {
				        		path: "EntityDesc"          
				        	}
				        }), 
				        new sap.m.ObjectIdentifier({
				        	text: {
				        		path: "AttributeDesc"          
				        	},
				        	title: {
				        		path: "NewValueText",
				        		formatter: function(){
				        			var ctx = this.getBindingContext();
				        			var vNewVal = oModel.getProperty("NewValue", ctx);
				        			var vNewValTxt = oModel.getProperty("NewValueText", ctx);
				        			if(vNewValTxt !== '' && vNewVal !== '')
				        				return vNewValTxt + '(' + vNewVal +')';
				        			else if(vNewVal === '' && vNewValTxt!=='')
				        				return vNewValTxt;
				        			else
				        				return vNewVal;
				        		}
				        	}
				        }), 
				        new sap.m.Text({
				        	text:{
				        		path:"OldValue",
				        		formatter: function(){
				        			var ctx = this.getBindingContext();
				        			var vOldVal = oModel.getProperty("OldValue", ctx);
				        			var vOldValTxt = oModel.getProperty("OldValueText", ctx);
				        			if(vOldValTxt !== '' && vOldVal !== '')
				        				return vOldValTxt + '(' + vOldVal +')';
				        			else if(vOldVal === '' && vOldValTxt!=='')
				        				return vOldValTxt;				        			
				        			else
				        				return vOldVal;
				        		}				        			
				        	}
				        })                        
				        ]});

			return oItemTemp;
		},	

		//Get Values
		getValue : function (Value,Value_Txt,Attribute,context)
		{
			var finalValue = "";
			if (Value !== "" && Value_Txt !== "") {
				if (Value === "X" || Attribute === "DTAMS" || Attribute === "PERIV" || Attribute === "KDKG1" || Attribute === "KDKG2" || Attribute === "KDKG3" 
						|| Attribute === "KDKG4" || Attribute === "KDKG5" || Attribute === "LEGALORG" || Attribute === "LEGALFORM" || Attribute === "J_1KFTIND" || Attribute === "FITYP"
						|| Attribute === "TITLE" || Attribute === "AUTHORIZATIONGROUP" || Attribute === "CFOPC" || Attribute === "J_1KFTBUS" || Attribute === "REASON_ID" 
						|| Attribute === "MARITALSTATUS" || Attribute === "SEX" || Attribute === "DLGRP"|| Attribute === "QSSYS" || Attribute === "TITLE_ACA1" || Attribute === "TITLE_KEY" 
						|| Attribute === "PODKZ" || Attribute === "TAXTYPE" || Attribute === "TAXBS" || Attribute === "FRGRP" || Attribute === "ZINRT" || Attribute === "QSBGR"
						|| Attribute === "ZGRUP" || Attribute === "MEPRF" || Attribute === "SKRIT" || Attribute === "KZABS" || Attribute === "PAPRF" || Attribute === "MEGRU" || Attribute === "ZOLLA"	)  
					finalValue = Value_Txt;
				else
					finalValue = Value_Txt +"(" +Value + ")";
			}
//			if ( Value !=="" && Value_Txt !=="" )
//			{
//				if(Value === "X")
//					finalValue = Value_Txt;
//				else
//					finalValue = Value_Txt +"(" +Value + ")";
//
//			}
			if ( Value ==="" && Value_Txt !=="" )
			{
				finalValue = Value_Txt;
			}
			if(Value !=="" && Value_Txt ==="" )
			{			
				if( Attribute !== "DTAWS")
				{
					var notMaintainedText = fcg.mdg.approvecrv2.util.Formatter.defaultValueChange(Value);  //To check attribute's ldefault values 
					if(notMaintainedText !== "")
					{
						finalValue = notMaintainedText;
					}
					else			
						finalValue = Value;
				}
				else			
					finalValue = Value;
			}
			if(Value === "X" && (Value_Txt === "" || Value_Txt === sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES")) )
			{
				finalValue = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES"); 
			}
			
			if ((Attribute === "QSSKZ" || Attribute === "EXPVZ" || Attribute === "ZOLLA" || Attribute === "CERDT" || Attribute === "KULTG" ||
					Attribute === "PERNR" || Attribute === "PLIFZ" || Attribute === "QSZDT" || Attribute === "ZINRT" )
				&& (Value === "00.00.0000" || Value === "0000.00.00" || Value === "0000" || parseInt(Value) === 0 || Value === "")
				&& Value_Txt === "") {
			
				if(context === "new")
				 finalValue = "("+ sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_DELETED") + ")";
				else if(context === "old")
					finalValue = "("+ sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NOT_MAIN") + ")";
		}
			return finalValue;
		},
		
		
		eliminateDuplicatesRecords : function(aIn) {  
			var i;    
			var iLength=aIn.length,      
			aOut=[],      
			oObj={};   
			for (i=0;i<iLength;i++)
				oObj[aIn[i]]=0; 
			for (i in oObj)
				aOut.push(i);  
			return aOut;
		},
		
		showNodataPurchMsg : function() {
			if (this.purchText)
				this.purchText.destroy();
			this.purchText = new sap.m.Text("purchTxt");
			this.purchText.setText(sap.ca.scfld.md.app.Application.getImpl()
					.getResourceBundle().getText("Nodata"));
			sap.ui.getCore().byId("SPurchaseLayout").removeAllContent();
			sap.ui.getCore().byId("SSubrangeLayout").removeAllContent();
			sap.ui.getCore().byId("SPurchaseLayout").addContent(this.purchText);
		},

		showNodataCCMsg : function() {
			if (this.ccSupText)
				this.ccSupText.destroy();
			this.ccSupText = new sap.m.Text("scTxt");
			this.ccSupText.setText(sap.ca.scfld.md.app.Application.getImpl()
					.getResourceBundle().getText("Nodata"));
			sap.ui.getCore().byId("SCompCodeLayout").removeAllContent();
			sap.ui.getCore().byId("SDunningLayout").removeAllContent();
			sap.ui.getCore().byId("SWithhldTaxLayout").removeAllContent();
			sap.ui.getCore().byId("SCompCodeLayout").addContent(this.ccSupText);
		}  
};