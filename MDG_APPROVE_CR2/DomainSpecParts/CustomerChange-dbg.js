/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/* Here all the queries are included which are required to get the necessary data from the backend. Once the query is successful then the corresponding entities
section will be filled with the data.  */
//jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPChange");

fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange = {
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
		getCompanyCodeData : function(oCustomerModel, vPath , s3Controller){
			this.oS3Controller = s3Controller;
			var vCompletePath = vPath; //The URL till $expand=ChangeRequestCollection(""); 
			var vBasePath = 'BP_Root/CU_MultipleAssignmentsRel/';
			var vCommaSeperator = ',';
			var vChangeData = '/ChangeData';

			//Customer Related Entities       
			vCompletePath = vCompletePath + vBasePath + "CU_AssignedCompanyCodesRel" + vChangeData;	
			//Dunning area details
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "CU_AssignedCompanyCodesRel/CU_CompDunningAreasRel" + vChangeData;
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "CU_AssignedCompanyCodesRel/CU_CompWithholdingTaxesRel" + vChangeData;
			var extQuery = s3Controller.custHookChangeCompCodeQuery(vCompletePath);
			if(extQuery !== undefined){
				vCompletePath = extQuery;
			}
			return vCompletePath;
		},

		//	Returns the overall query for the sales entity in case of change scenario.
		getSalesData : function(oCustomerModel, vPath ,s3Controller ){
			this.oS3Controller = s3Controller;
			var vCompletePath = vPath; //The URL till $expand=ChangeRequestCollection("");
			var vBasePath = 'BP_Root/CU_MultipleAssignmentsRel/';
			var vChangeData = '/ChangeData';
			var vCommaSeperator = ',';

			vCompletePath = vCompletePath + vBasePath + "CU_AssignedSalesAreasRel" + vChangeData;		
			//Partner Function
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "CU_AssignedSalesAreasRel/CU_SalesPartnerFunctionsRel" + vChangeData;
			vCompletePath = vCompletePath + vCommaSeperator + vBasePath + "CU_AssignedSalesAreasRel/CU_SalesTaxIndicatorsRel" + vChangeData;
			var extQuery = s3Controller.custHookChangeSalesQuery(vCompletePath);
			if(extQuery !== undefined){
				vCompletePath = extQuery;
			}
			return vCompletePath;
		},

//		Loades the company code data in case of the change scenario. Along with the company code data dunning data and withhld tax data is also binded together to the table. 
//		The table here involves context description New value and Old value with new value bolded. Even the navigation is handled here for each of the rows. 
//		In case of multiple assignment a table header will be shown along with the details of the customer.		
		displayCompanyCodeData: function(result, s3Controller, vHasObsData){
			var isMultiassignmnt = false;
			var keyValue = "";
			var newValue = "";
			var oldValue = "";
			var newValueTxt = "";
			var oldValueTxt = "";
			var newValueText1 = "";
			var oldValueText1 = "";
			var assignmentid  = "";
			var k,l;
			var oDataItems = "";
			var extoDataItems = "";
			var keyValueTxt = "";
			var compcode = "";
			var Key = "";
			var keyValueText = "";
			var vAttribute = "";
			var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();

			var oItemTemp = this.getTableTemplate();
			if (result.BP_Root.CU_MultipleAssignmentsRel.results !== undefined  && result.BP_Root.CU_MultipleAssignmentsRel.results.length>0 )
			{
				if( result.BP_Root.CU_MultipleAssignmentsRel.results.length > 1 ) 
				{
					isMultiassignmnt = true;

				}
				var ostrResults = {dataitems:[]};
				for (var i=0; i<result.BP_Root.CU_MultipleAssignmentsRel.results.length; i++ )
				{
					var oMultiassignments = result.BP_Root.CU_MultipleAssignmentsRel.results[i];
					if (result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCompanyCodesRel.results !== undefined )
					{
						for (var j=0; j<result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCompanyCodesRel.results.length;j++)
						{
							var oAssignedCompCodes = result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedCompanyCodesRel.results[j];

							if (oAssignedCompCodes.ChangeData.results !== undefined )
							{ var key = "";
							//Company Code Changes are moved to a array 
							for( k=0; k<oAssignedCompCodes.ChangeData.results.length; k++)
							{  
								newValue =     oAssignedCompCodes.ChangeData.results[k].NewValue;
								oldValue =     oAssignedCompCodes.ChangeData.results[k].OldValue;
								newValueTxt =  oAssignedCompCodes.ChangeData.results[k].NewValueText;
								oldValueTxt =  oAssignedCompCodes.ChangeData.results[k].OldValueText;
								vAttribute =   oAssignedCompCodes.ChangeData.results[k].Attribute;
								var compKey =      oAssignedCompCodes.BUKRS;
								assignmentid = oAssignedCompCodes.ASSIGNMENT_ID;
								key = assignmentid+compKey;

								newValueText1 = this.getValue(newValue, newValueTxt, vAttribute, "new");
								oldValueText1 = this.getValue(oldValue, oldValueTxt, vAttribute, "old");

								if (isMultiassignmnt === true)
								{
									var standard = oMultiassignments.STANDARD;
									var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.OBJECT_ID,oMultiassignments.OBJECT_ID__TXT);
									var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.REASON_ID,oMultiassignments.REASON_ID__TXT);
									var accgrp = "";
									var custRel = oMultiassignments.CU_AssignedCustomerRel;
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
								//Handling of the attribute descriptions in case the descriptions are different from that of the UI
								var attribute = oAssignedCompCodes.ChangeData.results[k].Attribute;
								var attributeDesc = oAssignedCompCodes.ChangeData.results[k].AttributeDesc;
								var AttributeDesc = fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(attribute,attributeDesc);

								oDataItems = {   
										"Context":oAssignedCompCodes.ChangeData.results[k].Context, 
										"Dunning":"",
										"Key":key,
										"Withhld":"",
										"KeyValue":keyValue,
										"EntityDesc":oBundle.getText("GL_COMP_CODE"),
										"AttributeDesc":AttributeDesc,
										"EntityAction": oAssignedCompCodes.ChangeData.results[k].EntityAction,
										"NewValueText":newValueText1,
										"OldValue":oldValueText1,
										"ParentContext" : "",
										"ParentEntityDesc" : "",
										"ParentEntityVisible" : false
								};		
								extoDataItems = s3Controller.custHookCompCodeChangeData(result,this);
								if(extoDataItems !== undefined){
									oDataItems = extoDataItems;
								}
								ostrResults.dataitems.push(oDataItems);
								s3Controller.oCompCode.aCompCode.push(oDataItems);      
							}
							}	
							//Dunning Area Changes  are also moved to the same array in which all the company code changes are pushed.
							if ( oAssignedCompCodes.CU_CompDunningAreasRel.results !== undefined && oAssignedCompCodes.CU_CompDunningAreasRel.results.length>0 ) 
							{
								for ( k=0; k<oAssignedCompCodes.CU_CompDunningAreasRel.results.length;k++)
								{
									var oDunningAreas = oAssignedCompCodes.CU_CompDunningAreasRel.results[k];

									if (oDunningAreas.ChangeData.results  !== undefined)
									{	
										for( l=0; l<oDunningAreas.ChangeData.results.length; l++)
										{  
											newValue = oDunningAreas.ChangeData.results[l].NewValue;
											oldValue = oDunningAreas.ChangeData.results[l].OldValue;
											newValueTxt = oDunningAreas.ChangeData.results[l].NewValueText;
											oldValueTxt = oDunningAreas.ChangeData.results[l].OldValueText;
											vAttribute = oDunningAreas.ChangeData.results[l].Attribute;

											newValueText1 = this.getValue(newValue, newValueTxt, vAttribute, "new");
											oldValueText1 = this.getValue(oldValue, oldValueTxt, vAttribute, "old");

											var dunningid = oDunningAreas.MABER;
											keyValueTxt = oDunningAreas.MABER__TXT;

											//If there is no description maintained for the dunning area then a default description is Shown.
											if(keyValueTxt === "")
											{
												keyValueTxt = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DefaultDunning");
											}
											var CCKey = oAssignedCompCodes.BUKRS__TXT + "("+ oAssignedCompCodes.BUKRS + ")";
											compcode = oDunningAreas.BUKRS;
											assignmentid = oDunningAreas.ASSIGNMENT_ID;
											var dunningKey = assignmentid+compcode+dunningid;
											Key = assignmentid+compcode;
											//var keyValueText;
											keyValueText = this.getValue(dunningid,keyValueTxt);

											//In case parent doesn't have any changed data in such cases context of child is followed by context of the parent
											if (oAssignedCompCodes.ChangeData.results.length === 0)
											{
												if (keyValueText === "")
												{
													keyValueText = oDunningAreas.ChangeData.results[l].Context ;
												}
											}
											if ( isMultiassignmnt === true )
											{
												var standard = oMultiassignments.STANDARD;
												var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.OBJECT_ID,oMultiassignments.OBJECT_ID__TXT);
												var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.REASON_ID,oMultiassignments.REASON_ID__TXT);
												var accgrp = "";
												var custRel = oMultiassignments.CU_AssignedCustomerRel;
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
											oDataItems = {   
													"Context":keyValueText,
													"Key":Key,
													"KeyValue":keyValue,
													"Dunning":dunningKey,
													"Withhld":"",
													"EntityDesc":oBundle.getText("DunningArea"),
													"AttributeDesc":oDunningAreas.ChangeData.results[l].AttributeDesc,
													"EntityAction": oDunningAreas.ChangeData.results[l].EntityAction,
													"NewValueText":newValueText1,
													"OldValue":oldValueText1,
													"ParentContext" : CCKey,
													"ParentEntityDesc" : oBundle.getText("GL_COMP_CODE"),
													"ParentEntityVisible" : true
											};
											extoDataItems = s3Controller.custHookDunningChangeData(result,this);
											if(extoDataItems !== undefined){
												oDataItems = extoDataItems;
											}
											ostrResults.dataitems.push(oDataItems);
											s3Controller.oCompCode.aCompCode.push(oDataItems);
										}  
									}	
								}
							}
							//With Holding Tax Changes moved to the same array where both company code and dunning changes exists.
							if ( oAssignedCompCodes.CU_CompWithholdingTaxesRel.results !== undefined && oAssignedCompCodes.CU_CompWithholdingTaxesRel.results.length>0 ) 
							{   
								for ( k=0; k<oAssignedCompCodes.CU_CompWithholdingTaxesRel.results.length;k++)
								{
									var oWithholdTaxes = oAssignedCompCodes.CU_CompWithholdingTaxesRel.results[k];
									//	{
									if (oWithholdTaxes.ChangeData.results !== undefined)
									{
										for( l=0; l<oWithholdTaxes.ChangeData.results.length; l++)
										{  
											newValue = oWithholdTaxes.ChangeData.results[l].NewValue;
											oldValue = oWithholdTaxes.ChangeData.results[l].OldValue;
											newValueTxt = oWithholdTaxes.ChangeData.results[l].NewValueText;
											oldValueTxt = oWithholdTaxes.ChangeData.results[l].OldValueText;
											vAttribute = oWithholdTaxes.ChangeData.results[l].Attribute;

											newValueText1 = this.getValue(newValue, newValueTxt, vAttribute, "new");
											oldValueText1 = this.getValue(oldValue, oldValueTxt, vAttribute, "old");

											var withhldid = oWithholdTaxes.WITHT;
											keyValueTxt = oWithholdTaxes.WITHT__TXT;
											compcode = oWithholdTaxes.BUKRS;
											assignmentid = oWithholdTaxes.ASSIGNMENT_ID;
											var withhldKey = assignmentid+compcode+withhldid;
											Key = assignmentid+compcode;
											//var keyValueText;
											keyValueText = this.getValue(withhldid,keyValueTxt);
											var CCKey = oAssignedCompCodes.BUKRS__TXT + "("+ oAssignedCompCodes.BUKRS + ")";
											//In case parent doesn't have any changed data in such cases context of child is follwed by context of the parent
											if (oAssignedCompCodes.ChangeData.results.length === 0)
											{
												if (keyValueText === "")
												{
													keyValueText = oWithholdTaxes.ChangeData.results[l].Context ;
												}
											}

											if ( isMultiassignmnt === true )
											{
												var standard = oMultiassignments.STANDARD;
												var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.OBJECT_ID,oMultiassignments.OBJECT_ID__TXT);
												var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.REASON_ID,oMultiassignments.REASON_ID__TXT);
												var accgrp = "";
												var custRel = oMultiassignments.CU_AssignedCustomerRel;
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
											oDataItems = {   
													"Context":keyValueText,
													"Key":Key,
													"KeyValue":keyValue,
													"Dunning":"",
													"Withhld":withhldKey,
													"EntityDesc":oBundle.getText("Withhldtax"),
													"EntityAction": oWithholdTaxes.ChangeData.results[l].EntityAction,
													"AttributeDesc":oWithholdTaxes.ChangeData.results[l].AttributeDesc,
													"NewValueText":newValueText1,
													"OldValue":oldValueText1,
													"ParentContext" : CCKey,
													"ParentEntityDesc" : oBundle.getText("GL_COMP_CODE"),
													"ParentEntityVisible" : true
											};
											extoDataItems = s3Controller.custHookWithTaxChangeData(result,this);
											if(extoDataItems !== undefined){
												oDataItems = extoDataItems;
											}
											ostrResults.dataitems.push(oDataItems);
											s3Controller.oCompCode.aCompCode.push(oDataItems);
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
				for ( l=0; l<s3Controller.oCompCode.aCompCode.length; l++ )
				{
					aCompCodes.push(s3Controller.oCompCode.aCompCode[l].Key);
				}
				aCompCodes.sort();                
				s3Controller.aUniqueCompcode = this.eliminateDuplicatesRecords(aCompCodes);

				for(var r=0; r<s3Controller.aUniqueCompcode.length; r++ )
				{
					for ( l=0; l<s3Controller.oCompCode.aCompCode.length; l++)
					{
						if ( s3Controller.aUniqueCompcode[r] === s3Controller.oCompCode.aCompCode[l].Key )
						{
							s3Controller.compCodeResults.dataitems.push(s3Controller.oCompCode.aCompCode[l]);
						}
					}
				}

				s3Controller.compCodeResults.dataitems .sort();
				s3Controller.compCodeResults.dataitems.reverse();

				if (s3Controller.compCodeResults.dataitems.length > 0)
				{  
					var aSorter= "";
					var oSorterContx = "";
					var oSorterKey = "";
					var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it  
					oModel.setData(s3Controller.compCodeResults);
		
					sap.ui.getCore().byId("CCompCodeLayout").removeAllContent();
					sap.ui.getCore().byId("CDunningLayout").removeAllContent();
					sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();
					sap.ui.getCore().byId("CCompCodeLayout").setVisible(true);
					sap.ui.getCore().byId("CDunningLayout").setVisible(true);
					sap.ui.getCore().byId("CWithhldTaxLayout").setVisible(true);
					s3Controller.oCompcodeTable = "";
					s3Controller.oCompcodeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse',s3Controller); 
					sap.ui.getCore().byId("CCompCodeLayout").addContent(s3Controller.oCompcodeTable);
					s3Controller.oCompcodeTable.setGrowing(true);

					s3Controller.oCompcodeTable.setModel(oModel);
					oItemTemp.attachPress({Entity: "CompanyCode", 
						Key:s3Controller.compCodeResults.dataitems,
						EntityData: result.BP_Root.CU_MultipleAssignmentsRel},s3Controller.navtoSubDetail, s3Controller); 
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

			s3Controller.oCompCode={aCompCode:[]};
		},

//		Displayes the sales data in case of the change scenario. The changed data here involves context information New value and old value. 
//		Each row will have the navigation property and sub detail page is loaded on clicking of the row. 		
		displaySalesData: function(result, s3Controller, vHasObsData){
			var isMultiassignmnt = false;
			var keyValue = "";
			var oItemTemp = this.getTableTemplate();
			var assignmentid = "";
			var k = "";
			var salesOrg = "";
			var disChannel = "";
			var division = "";
			var Key = "";
			var attribute = "";
			var attributeDesc = "";
			var AttributeDesc = "";
			var extoDataItems = "";
			var oDataItems = "";
			var l = "";
			var context = "";
			var newValue = "";
			var oldValue = "";
			var newValueTxt = "";
			var oldValueTxt = "";
			var vAttribute = "";
			var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();

			if (result.BP_Root.CU_MultipleAssignmentsRel.results !== undefined  && result.BP_Root.CU_MultipleAssignmentsRel.results.length>0 )
			{
				if( result.BP_Root.CU_MultipleAssignmentsRel.results.length > 1 ) 
				{
					isMultiassignmnt = true;

				}
				var ostrResults = {dataitems:[]};
				for (var i=0; i<result.BP_Root.CU_MultipleAssignmentsRel.results.length; i++ )
				{
					var oMultiassignments = result.BP_Root.CU_MultipleAssignmentsRel.results[i];
					if (result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedSalesAreasRel.results !== undefined )
					{

						for (var j=0; j<result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedSalesAreasRel.results.length;j++)
						{
							var oAssignedSalesAreas = result.BP_Root.CU_MultipleAssignmentsRel.results[i].CU_AssignedSalesAreasRel.results[j];

							if (oAssignedSalesAreas.ChangeData.results !== undefined )
							{
								//Sales area changes are moved to the array
								for( k=0; k<oAssignedSalesAreas.ChangeData.results.length; k++)
								{  
									newValue = oAssignedSalesAreas.ChangeData.results[k].NewValue;
									oldValue = oAssignedSalesAreas.ChangeData.results[k].OldValue;
									newValueTxt = oAssignedSalesAreas.ChangeData.results[k].NewValueText;
									oldValueTxt = oAssignedSalesAreas.ChangeData.results[k].OldValueText;
									vAttribute = oAssignedSalesAreas.ChangeData.results[k].Attribute;

									salesOrg = oAssignedSalesAreas.VKORG;
									disChannel = oAssignedSalesAreas.VTWEG;
									division = oAssignedSalesAreas.SPART;
									assignmentid = oAssignedSalesAreas.ASSIGNMENT_ID;
									Key = assignmentid+salesOrg+disChannel+division;
									var newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
									var oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute, "old");

									if ( isMultiassignmnt === true )
									{
										var standard = oMultiassignments.STANDARD;
										var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.OBJECT_ID,oMultiassignments.OBJECT_ID__TXT);
										var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.REASON_ID,oMultiassignments.REASON_ID__TXT);
										var accgrp = "";
										var custRel = oMultiassignments.CU_AssignedCustomerRel;
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

									//Handling of the attribute descriptions in case the descriptions are different from that of the UI
									attribute = oAssignedSalesAreas.ChangeData.results[k].Attribute;
									attributeDesc = oAssignedSalesAreas.ChangeData.results[k].AttributeDesc;
									AttributeDesc = fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(attribute,attributeDesc);

									oDataItems = {   
											"Context":oAssignedSalesAreas.ChangeData.results[k].Context, 
											"Key": Key,
											"KeyValue":keyValue,
											"AttributeDesc":AttributeDesc,
											"EntityDesc":oBundle.getText("salesarea"),
											"EntityAction": oAssignedSalesAreas.ChangeData.results[k].EntityAction,
											"NewValueText":newValueText,
											"OldValue":oldValueText,
											"ParentContext" : "",
											"ParentEntityDesc" : "",
											"ParentEntityVisible" : false
									};	
									extoDataItems = s3Controller.custHookSalesChangeData(result,this);
									if(extoDataItems !== undefined){
										oDataItems = extoDataItems;
									}
									ostrResults.dataitems.push(oDataItems);
									s3Controller.oSalesArea.aSalesArea.push(oDataItems);      
								} 
							}
							//Partner Function Changes are also moved to the same array as that of the sales area changes and grouped at the end
							if ( oAssignedSalesAreas.CU_SalesPartnerFunctionsRel.results !== undefined && oAssignedSalesAreas.CU_SalesPartnerFunctionsRel.results.length>0 ) 
							{
								for ( k=0; k<oAssignedSalesAreas.CU_SalesPartnerFunctionsRel.results.length;k++)
								{
									var oPartnerFunctions = oAssignedSalesAreas.CU_SalesPartnerFunctionsRel.results[k];

									for( l=0; l<oPartnerFunctions.ChangeData.results.length; l++)
									{  
										newValue = oPartnerFunctions.ChangeData.results[l].NewValue;
										oldValue = oPartnerFunctions.ChangeData.results[l].OldValue;
										newValueTxt = oPartnerFunctions.ChangeData.results[l].NewValueText;
										oldValueTxt = oPartnerFunctions.ChangeData.results[l].OldValueText;
										vAttribute = oPartnerFunctions.ChangeData.results[l].Attribute;

										newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
										oldValueText = this.getValue(oldValue,oldValueTxt, vAttribute, "old");

										salesOrg = oAssignedSalesAreas.VKORG;
										disChannel = oAssignedSalesAreas.VTWEG;
										division = oAssignedSalesAreas.SPART;
										assignmentid = oAssignedSalesAreas.ASSIGNMENT_ID;
										Key = assignmentid+salesOrg+disChannel+division;

										var partnerfunckey = oPartnerFunctions.PARVW;
										var partnerfuncDesc = oPartnerFunctions.PARVW__TXT;
										context = this.getValue(partnerfunckey,partnerfuncDesc);
										var SAKey = oAssignedSalesAreas.VKORG__TXT + "("+ salesOrg + ")" + "," 
										+ oAssignedSalesAreas.VTWEG__TXT + "("+ disChannel + ")" + "," +oAssignedSalesAreas.SPART__TXT + "("+ division + ")";
										//In case parent doesn't have any changed data in such cases context of child is follwed by context of the parent
										if (oAssignedSalesAreas.ChangeData.results.length === 0)
										{
											if (context === "")
											{
												context = oPartnerFunctions.ChangeData.results[l].Context ;
											}
										}

										if ( isMultiassignmnt === true )
										{
											var standard = oMultiassignments.STANDARD;
											var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.OBJECT_ID,oMultiassignments.OBJECT_ID__TXT);
											var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.REASON_ID,oMultiassignments.REASON_ID__TXT);
											var accgrp = "";
											var custRel = oMultiassignments.CU_AssignedCustomerRel;
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

										//Handling of the attribute descriptions in case the descriptions are different from that of the UI
										attribute = oPartnerFunctions.ChangeData.results[l].Attribute;
										attributeDesc = oPartnerFunctions.ChangeData.results[l].AttributeDesc;
										AttributeDesc = fcg.mdg.approvecrv2.util.Formatter.getAttrbibuteDescription(attribute,attributeDesc);

										oDataItems = {   
												"Context":context,
												"Key":Key,
												"KeyValue":keyValue,
												"AttributeDesc": AttributeDesc, 
												"EntityDesc":oBundle.getText("PartnerFunc"),
												"EntityAction": oPartnerFunctions.ChangeData.results[l].EntityAction,
												"NewValueText":newValueText,
												"OldValue":oldValueText,
												"ParentContext" : SAKey,
												"ParentEntityDesc" : oBundle.getText("salesarea"),
												"ParentEntityVisible" : true
										};
										extoDataItems = s3Controller.custHookPFChangeData(result,this);
										if(extoDataItems !== undefined){
											oDataItems = extoDataItems;
										}
										ostrResults.dataitems.push(oDataItems);
										s3Controller.oSalesArea.aSalesArea.push(oDataItems);
									}  
								}			
							}
							//Tax Clasification changes are moved to the same array that contains sales area changes and partner func changes.
							if ( oAssignedSalesAreas.CU_SalesTaxIndicatorsRel.results !== undefined && oAssignedSalesAreas.CU_SalesTaxIndicatorsRel.results.length>0 ) 
							{
								for ( k=0; k<oAssignedSalesAreas.CU_SalesTaxIndicatorsRel.results.length;k++)
								{
									var oSalesTaxIndicators = oAssignedSalesAreas.CU_SalesTaxIndicatorsRel.results[k];

									for( l=0; l<oSalesTaxIndicators.ChangeData.results.length; l++)
									{  
										newValue = oSalesTaxIndicators.ChangeData.results[l].NewValue;
										oldValue = oSalesTaxIndicators.ChangeData.results[l].OldValue;
										newValueTxt = oSalesTaxIndicators.ChangeData.results[l].NewValueText;
										oldValueTxt = oSalesTaxIndicators.ChangeData.results[l].OldValueText;
										vAttribute = oSalesTaxIndicators.ChangeData.results[l].Attribute;

										if ( oSalesTaxIndicators.ChangeData.results[l].Attribute === "TAXKD" )
										{
											if (newValue === '0')
											{
												newValueTxt = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("taxexempt");
												oldValueTxt = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("liabletax");
											}
											else
											{
												newValueTxt = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("liabletax");
												oldValueTxt = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("taxexempt");
											}
										}

										newValueText = this.getValue(newValue, newValueTxt, vAttribute, "new");
										oldValueText = this.getValue(oldValue, oldValueTxt, vAttribute, "old");

										salesOrg = oAssignedSalesAreas.VKORG;
										disChannel = oAssignedSalesAreas.VTWEG;
										division = oAssignedSalesAreas.SPART;
										assignmentid = oAssignedSalesAreas.ASSIGNMENT_ID;
										Key = assignmentid+salesOrg+disChannel+division;

										var taxclassey = oSalesTaxIndicators.TAXKD;
										var taxclassDesc = oSalesTaxIndicators.TAXKD__TXT;
										var countrykey = oSalesTaxIndicators.ALAND;
										var countryDesc =oSalesTaxIndicators.ALAND__TXT;
										var taxType = oSalesTaxIndicators.TATYP;
										var taxTypeDesc = oSalesTaxIndicators.TATYP__TXT;
										context =  this.getValue(countrykey,countryDesc) + "," + this.getValue(taxType,taxTypeDesc) + "," + this.getValue(taxclassey,taxclassDesc);
										var SAKey = oAssignedSalesAreas.VKORG__TXT + "("+ salesOrg + ")" + "," 
										+ oAssignedSalesAreas.VTWEG__TXT + "("+ disChannel + ")" + "," +oAssignedSalesAreas.SPART__TXT + "("+ division + ")";
										if ( isMultiassignmnt === true )
										{
											var standard = oMultiassignments.STANDARD;
											var objid = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.OBJECT_ID,oMultiassignments.OBJECT_ID__TXT);
											var reason = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMultiassignments.REASON_ID,oMultiassignments.REASON_ID__TXT);
											var accgrp = "";
											var custRel = oMultiassignments.CU_AssignedCustomerRel;
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
										oDataItems = {   
												"Context":context,
												"Key":Key,
												"KeyValue":keyValue,
												"EntityDesc":oBundle.getText("Tax Indicators"),
												"AttributeDesc":oSalesTaxIndicators.ChangeData.results[l].AttributeDesc,
												"EntityAction": oSalesTaxIndicators.ChangeData.results[l].EntityAction,
												"NewValueText":newValueText,
												"OldValue":oldValueText,
												"ParentContext" : SAKey,
												"ParentEntityDesc" : oBundle.getText("salesarea"),
												"ParentEntityVisible" : true
										};
										extoDataItems = s3Controller.custHookTaxClassChangeData(result,this);
										if(extoDataItems !== undefined){
											oDataItems = extoDataItems;
										}
										ostrResults.dataitems.push(oDataItems);
										s3Controller.oSalesArea.aSalesArea.push(oDataItems);
									}  
								}			
							}
						}	
					}
				}
				//	Grouping of Sales area and Partner Func and Tax classification changes based on the sales are key.
				var aSalesArea = [];
				s3Controller.SalesAreaResults = {dataitems:[]};
				for ( l=0; l<s3Controller.oSalesArea.aSalesArea.length; l++ )
				{
					aSalesArea.push(s3Controller.oSalesArea.aSalesArea[l].Key);
				}
				aSalesArea.sort();                
				s3Controller.aUniqueCompcode = this.eliminateDuplicatesRecords(aSalesArea);

				for(var r=0; r<s3Controller.aUniqueCompcode.length; r++ )
				{
					for ( l=0; l<s3Controller.oSalesArea.aSalesArea.length; l++)
					{
						if ( s3Controller.aUniqueCompcode[r] === s3Controller.oSalesArea.aSalesArea[l].Key )
						{
							s3Controller.SalesAreaResults.dataitems.push(s3Controller.oSalesArea.aSalesArea[l]);
						}
					}
				}
				if (s3Controller.SalesAreaResults.dataitems.length > 0 )
				{
					var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it  
					oModel.setData(s3Controller.SalesAreaResults);
					sap.ui.getCore().byId("CSaleLayout").removeAllContent();
					//	sap.ui.getCore().byId("CPartnerFuncLayout").removeAllContent();
					sap.ui.getCore().byId("CSaleLayout").setVisible(true);
					s3Controller.oSalesTable = "";
					s3Controller.oSalesTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse',s3Controller); 
					sap.ui.getCore().byId("CSaleLayout").addContent(s3Controller.oSalesTable);
					s3Controller.oSalesTable.setGrowing(true);

					s3Controller.oSalesTable.setModel(oModel);
					oItemTemp.attachPress({Entity: "SalesArea", 
						Key:s3Controller.SalesAreaResults.dataitems,
						EntityData: result.BP_Root.CU_MultipleAssignmentsRel},s3Controller.navtoSubDetail, s3Controller); 

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
					this.showNoDataSaleMsg();
				}
				s3Controller.aUniqueCompcode = [];
				return;
			}
			else
			{
				/**Check if obsolete data is also initial and only then dispaly the no data messages**/
				this.showNoDataSaleMsg();
			}

			s3Controller.oSalesArea={aSalesArea:[]};
		},

		getTableTemplate: function(){
			var oItemTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				        new sap.m.VBox({
				        	items : [
				        new sap.m.ObjectIdentifier({
				        	text:{
				        		path:"EntityDesc"
				        	},
				        	title: {
				        		path: "Context"          
				        	}
				        }).addStyleClass("objectIdentifier_text"),
				        new sap.m.ObjectIdentifier({
				        	text:{
				        		path:"ParentEntityDesc"
				        	},
				        	title: {
				        		path: "ParentContext"          
				        	},
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
			var extoItemTemp = this.oS3Controller.custHookgetTableTemplate(oItemTemp);
			if(extoItemTemp !== undefined){
				oItemTemp = extoItemTemp;
			}

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
				        				return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");				        			
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
				        				return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");				        			
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

			var extoItemTemp = this.oS3Controller.custHookgetAddressTableTemplate(oItemTemp);
			if(extoItemTemp !== undefined){
				oItemTemp = extoItemTemp;
			}

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
			var extoItemTemp = this.oS3Controller.custHookgetChangeTableTemplate(oItemTemp);
			if(extoItemTemp !== undefined){
				oItemTemp = extoItemTemp;
			}
			return oItemTemp;
		},	

		//Get Values 
		getValue : function (Value, Value_Txt, Attribute, context)
		{
			var finalValue = "";
			if ( Value !=="" && Value_Txt !=="")
			{
				if(Value === "X" || Attribute === "FRGRP" || Attribute === "KVGR1"
					|| Attribute === "ZINRT" || Attribute === "ZAHLS" || Attribute === "KVGR2" || Attribute === "KZTLF"
						|| Attribute === "XAUSZ" || Attribute === "VRSDG" || Attribute === "KVGR3" || Attribute === "PVKSM"
						|| Attribute === "MGRUP" || Attribute === "URLID" || Attribute === "KVGR4"
						|| Attribute === "SREGL" || Attribute === "ZGRUP" || Attribute === "KVGR5")
					finalValue = Value_Txt;
				else
					finalValue = Value_Txt +"(" +Value + ")";

			}
			if ( Value === "" && Value_Txt !== "") 
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
			if(Value ==="X" && (Value_Txt === "" || Value_Txt === sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES")) )
			{
				finalValue = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES"); 
			}
			
			// In case of identification the default value is the default date so it
			// must be shown as "deleted BANKDETAILVALIDTO 
			if ((Attribute === "WT_AGTDF" || Attribute === "WT_AGTDT" || Attribute === "WEBTR"
				|| Attribute === "LPRIO" || Attribute === "JMZAH" || Attribute === "VLIBB"
				|| Attribute === "AWAHR" || Attribute === "ANTLF" || Attribute === "VRSZL"
				|| Attribute === "UEBTO" || Attribute === "UNTTO" || Attribute === "VRSPR")
				&& (Value === "00.00.0000" || Value === "0000.00.00" || Value.trim() === "0,00"
						|| Value.trim() === "0,0" || parseInt(Value) === 0)
				&& Value_Txt === "") {
				if (context === "new")
					finalValue = "(" + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_DELETED") + ")";
				else if (context === "old")
					finalValue = "(" + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NOT_MAIN") + ")";
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
		
		showNodataCCMsg : function() {
			if (this.ccText)
				this.ccText.destroy();
			this.ccText = new sap.m.Text("ccTxt");
			this.ccText.setText(sap.ca.scfld.md.app.Application.getImpl()
					.getResourceBundle().getText("Nodata"));
			sap.ui.getCore().byId("CCompCodeLayout").removeAllContent();
			sap.ui.getCore().byId("CDunningLayout").removeAllContent();
			sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();
			sap.ui.getCore().byId("CCompCodeLayout").setVisible(true);
			sap.ui.getCore().byId("CCompCodeLayout").addContent(this.ccText);
		},
		
		showNoDataSaleMsg : function() {
			if (this.saleText)
				this.saleText.destroy();
			this.saleText = new sap.m.Text("saleTxt");
			this.saleText.setText(sap.ca.scfld.md.app.Application.getImpl()
					.getResourceBundle().getText("Nodata"));
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