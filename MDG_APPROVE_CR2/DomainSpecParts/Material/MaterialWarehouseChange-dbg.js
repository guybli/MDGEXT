/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseChange = {
	//Declaring global variables for this class
	oMaterialWHChangeTable: "",
	oMaterialSalesDistributionChainTable: "",
	oMaterialSalesTaxTable: "",
	oMaterialSalesTextTable: "",
	oMaterialStorageTypeChangeTable:"",
	vAdded:"",
	vNotMaint:"",
	vDeleted:"",
	oWhChangedData:"",
	oWHGenDataModel:"",
	oWHChangedLayout:"",
	strStorageType:"",
	vCreated:"",
	vUpdated: "",
	oS3Controller:"",
	
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	// Initializing Warehouse tables and adding them to layouts 
	initializeWarehouseChangeTables: function(oS3Controller) {
		this.oS3Controller = oS3Controller;
		//delete all UI contents if present for Warehouse create layout
		sap.ui.getCore().byId("matChangeWarehouseDataLayout").removeAllContent();
		this.oMaterialWHChangeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
		this.oMaterialStorageTypeChangeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
		sap.ui.getCore().byId("matChangeWarehouseDataLayout").addContent(this.oMaterialWHChangeTable);
		sap.ui.getCore().byId("matChangeWarehouseDataLayout").addContent(this.oMaterialStorageTypeChangeTable);
		if(sap.ui.getCore().byId("matCreateWarehouseDataLayout")!== undefined){
		sap.ui.getCore().byId("matCreateWarehouseDataLayout").destroy();
		}
	    this.oMaterialWHChangeTable.setGrowing(true);
		this.oMaterialStorageTypeChangeTable.setGrowing(true);
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.oMaterialStorageTypeChangeTable,this.i18n.getText("Mat_Warehouse_StorageType"));
		this.oMaterialStorageTypeChangeTable.setHeaderText(this.strStorageType);
		this.vCreated=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getCreateEntityAction();
		this.vUpdated=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getUpdateEntityAction();
		this.vAdded = this.i18n.getText("PC_ADDED");
		this.vNotMaint = "(" + this.i18n.getText("PC_NOT_MAIN") + ")";
		this.vDeleted = this.i18n.getText("PC_DELETED");
	},

//*************************************************************************************************************

	//Function to map the table data on S3 and display it accordingly for Warehouse Change
	displayWarehouseChangedTableData: function(oView) { 
		// Create item template
		this.bindWHTable(oView,this.createTableTemplate());
		this.bindStorageTypeTable(oView,this.createTableTemplate());
	},
	
//***************************************************************************************************************
	// Use generic table for creating template 
	createTableTemplate: function() {
		var oItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.ObjectIdentifier({
					text: {
						path: "EntityName"
					},
					title: {
						path: "EntityDesc"
					}
				}).addStyleClass("text_bold"),

				new sap.m.ObjectIdentifier({
					text: {
						path: "AttributeDesc"
					},
					title: {
						path: "NewValue"
					}
				}), new sap.m.Text({
					text: {
						path: "OldValue"
					}
				})
			]
		});
  	var extoItemTemp = this.oS3Controller.matHookgetWarehouseChangeTemplate(oItemTemp);
			if(extoItemTemp !== undefined){
				oItemTemp = extoItemTemp;
		}
		return oItemTemp;
		
	},
	
//***********************************************************************************************************
	// bind Storage Type Data
	bindStorageTypeTable: function(oView,oStorageTypeChangedTemplate) {
		var oDataItems = {
			EntityDesc: "",
			EntityName: "",
			AttributeDesc: "",
			NewValue: "",
			OldValue: "",
			NewValueText: "",
			OldValueText: "",
			LGNUM: "",
			LGTYP: ""
			
		};
		// Loop thru the obtained Storage Type data, appropriately structure the UI and bind the data for the template 
		this.workOnStorageTypeChangedData(this.oWhChangedData, oDataItems, oStorageTypeChangedTemplate, oView);
	},

//*****************************************************************************************************************	
      //Bind Warehouse Type Data
	bindWHTable: function(oView,oWhChangedTemplate) {
		var oDataItems = {
			EntityDesc: "",
			EntityName: "",
			AttributeDesc: "",
			NewValue: "",
			OldValue: "",
			NewValueText: "",
			OldValueText: "",
			LGNUM: "",
			LGTYP: ""
			
		};
		 this.oWhChangedData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getWarehouseChangedData();
		// Loop thru the obtained Warehouse data, appropriately structure the UI and bind the data for the template 
		this.workOnWHChangedData(this.oWhChangedData, oDataItems, oWhChangedTemplate, oView);
	},
	
//*****************************************************************************************************************
	//working on warehouse changed data	
	 workOnWHChangedData: function(oWhChangedData, oDataItems, oWhChangedTemplate, oView) {
		var strWarehouseResults = {
			results: []
		};
		// creating an array to check for attribute names instead of hard coding the names of the attributes,
		// so that new attributes can be added at only one place.
		var sAttrTextValues = ["LVSME", "VOMEM", "BEZME", "PLKMLGNST", "LHME1", "LE1MLGNST", "LHME2", "LE2MLGNST", "LHME3","LE3MLGNST",
		"LTAMLGNST","LTEMLGNST","LGBMLGNST","LGBKZ","BLOMLGNST","BSSMLGNST","L2SKR"];
		var sAttrNumericValues = ["MKAPV", "LHMG1","LHMG2","LHMG3"];
		var sAttrChkBoxValues = ["KZMBF", "KZZUL"];
		
		var sAttr = "";
		var vOldVal = "";
		var vOldValTxt = "";
		var vNewVal = "";
		var vNewValTxt = "";
		var vOldValBoln = "";
		var vNewValBoln = "";
		var strWarehouseTxt;
		var oWhData=oWhChangedData.results;
		var oWhchangeData;
		
			for (var i = 0; i < oWhData.length; i++) {
				oWhchangeData=oWhData[i].ChangeData.results;
			if (oWhchangeData.length > 0) {
				
				switch (oWhchangeData[0].EntityAction) {
					case this.vCreated:
						{
							// A new entity has been added
							oDataItems.NewValue = this.vAdded;
							oDataItems.OldValue = "";
							oDataItems.AttributeDesc = "";
							oDataItems.LGNUM = oWhData[i].LGNUM;
							oDataItems.LGTYP = oWhData[i].LGTYP;
							strWarehouseTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oWhData[i].LGNUM, oWhData[i].LGNUM__TXT);
							oDataItems.EntityDesc = strWarehouseTxt;
							oDataItems.EntityName = this.i18n.getText("Warehouse");
							strWarehouseResults.results.push(oDataItems);
							oDataItems = [];
							break;
						}
					case this.vUpdated:
						{
							// existing values of the entity has been changed. 
							for (var j = 0; j < oWhchangeData.length; j++) {
								
							
									if(oWhchangeData[j].Attribute === "LHMG1"){
									oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Load_Equip_Qty1");
								}
									else if(oWhchangeData[j].Attribute === "LHMG2"){
									oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Load_Equip_Qty2");
								}
									else if(oWhchangeData[j].Attribute === "LHMG3"){
									oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Load_Equip_Qty3");
									
								}
									else if(oWhchangeData[j].Attribute === "LE1MLGNST"){
									oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Storage_Unit_Type1");
									
								}
									else if(oWhchangeData[j].Attribute === "LE2MLGNST"){
									oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Storage_Unit_Type2");
									
								}
									else if(oWhchangeData[j].Attribute === "LE3MLGNST"){
									oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Storage_Unit_Type3");
									
								}
									else if(oWhchangeData[j].Attribute === "LGBMLGNST"){
									oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Storage_Section_Key");
									
								}
									else if(oWhchangeData[j].Attribute === "VOMEM"){
									oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Mat_Prop_UOM");
									
								}
								
								else
								{
										oDataItems.AttributeDesc = oWhchangeData[j].AttributeDesc;
								}
								
								
							
								sAttr = oWhchangeData[j].Attribute;
								vOldVal = oWhchangeData[j].OldValue;
								vOldValTxt = oWhchangeData[j].OldValueText;
								vNewVal = oWhchangeData[j].NewValue;
								vNewValTxt = oWhchangeData[j].NewValueText;
								if(vNewVal === "" || vNewVal ==="X")
								{
								vNewVal=vNewValTxt;
								vNewValTxt="";
								}
									if(vOldVal === "" || vOldVal === "X")
								{
								vOldVal=vOldValTxt;
								vOldValTxt="";
								}
								if (sAttrTextValues.indexOf(sAttr) !== -1) {
									if (vNewVal !== vOldVal) {
										if (vOldVal === "") {
											vOldVal = this.vNotMaint; //if nothing is maintained in the field when it was initially created
										} else {
											vOldVal = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vOldVal, vOldValTxt);
										}
										if (vNewVal === "" && vOldVal !== "") {
											vNewVal = "(" + this.vDeleted + ")";
										} else if (vNewVal !== "") {
											vNewVal = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vNewVal, vNewValTxt);
										}
									} // end if NewVal != OldVal
									oDataItems.NewValue = vNewVal;
									oDataItems.OldValue = vOldVal;
									oDataItems.LGNUM = oWhData[i].LGNUM;
							oDataItems.LGTYP = oWhData[i].LGTYP;
							strWarehouseTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oWhData[i].LGNUM, oWhData[i].LGNUM__TXT);
							oDataItems.EntityDesc = strWarehouseTxt;
							oDataItems.EntityName = this.i18n.getText("Warehouse");
							strWarehouseResults.results.push(oDataItems);
							oDataItems = [];
								} // end if with sAttr
								else if (sAttrChkBoxValues.indexOf(sAttr) !== -1) {
									if (vNewVal !== vOldVal) {
										if (vOldVal === "No") {
											vOldVal = this.vNotMaint; //if nothing is maintained in the field when it was initially created
										}
										if (vNewVal === "No") {
											vNewVal = "(" + this.vDeleted + ")";
										}
									} // end if NewVal !== oldVal for check boxes
									oDataItems.NewValue = vNewVal;
									oDataItems.OldValue = vOldVal;
								oDataItems.LGNUM = oWhData[i].LGNUM;
							oDataItems.LGTYP = oWhData[i].LGTYP;
							strWarehouseTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oWhData[i].LGNUM, oWhData[i].LGNUM__TXT);
							oDataItems.EntityDesc = strWarehouseTxt;
							oDataItems.EntityName = this.i18n.getText("Warehouse");
							strWarehouseResults.results.push(oDataItems);
							oDataItems = [];
								} // end else if of sAttr	
								else if (sAttrNumericValues.indexOf(sAttr) !== -1) {
									if (vNewVal !== vOldVal) {
										vOldValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vOldVal);
										vNewValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vNewVal);
										if (vOldValBoln === false) {
											vOldVal = this.vNotMaint;
										} else {
											vOldVal = vOldVal + ' ' + vOldValTxt;
										}
										if (vNewValBoln === false) {
											vNewVal = "(" + this.vDeleted + ")";
										} else {
											vNewVal = vNewVal + ' ' + vNewValTxt;
										}
									} // end if NewVal !== oldVal for attributes with numeric values
									oDataItems.NewValue = vNewVal;
									oDataItems.OldValue = vOldVal;
									oDataItems.LGNUM = oWhData[i].LGNUM;
							oDataItems.LGTYP = oWhData[i].LGTYP;
							strWarehouseTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oWhData[i].LGNUM, oWhData[i].LGNUM__TXT);
							oDataItems.EntityDesc = strWarehouseTxt;
							oDataItems.EntityName = this.i18n.getText("Warehouse");
							strWarehouseResults.results.push(oDataItems);
							oDataItems = [];
								} // end else if of sAttr
							} //	end for with var j
						} // end case for entity action == U
					default:
						break;
				} // end switch statement for entity Action	
			} // end if
		} // end for with var i
		
		
			var extWarehouseResults = this.oS3Controller.matHookgetWarehouseResults(strWarehouseResults);
			if(extWarehouseResults !== undefined){
				strWarehouseResults = extWarehouseResults;
		}
	
	//s3 controller hook: importing param: strWarehouseResults,oWhChangedTemplate with return same as imp
	    //On click of a row in S3, navigate to S4
		oWhChangedTemplate.attachPress({
			Entity: oWhChangedData,
			name: 'matWarehouseChangeDataDetail'
		}, oView.navtoSubDetail, oView);
		this.bindWarehouseFormData(strWarehouseResults,oWhChangedTemplate);
	}, 	// end work on workOnWHChangedData
//*****************************************************************************************************************	
    
    //Working on Storage Type Data
	workOnStorageTypeChangedData: function(oWhChangedData, oDataItems, oStorageTypeChangedTemplate, oView) {
		var strStorTypeResults = {
			results: []
		};
		
	var strWarehouseTxt;
	var strStorageTypeTxt;
	var sData;
	var sChData;
	var whData=oWhChangedData.results;
	var vNewVal;
	var vOldVal;
	var vOldValBoln;
	var vNewValBoln;
		for (var i = 0; i < whData.length; i++){
			    sData=whData[i].MLGNSTOR2MLGTSTORRel.results;
			    for (var j = 0; j < sData.length; j++) {
			    	sChData=sData[j].ChangeData.results;
				if (sChData[0] !== undefined &&
					sChData[0].EntityAction === this.vCreated && whData[i].ChangeData.results[0].EntityAction === this.vUpdated ) {
		          
		            	 //If Storage type has been added under a new Warehouse,no need to display
					      oDataItems.NewValue = this.vAdded;
					      oDataItems.OldValue = "";
						  oDataItems.LGNUM = whData[i].LGNUM;
						  oDataItems.LGTYP = sData[j].LGTYP;
					      strWarehouseTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(whData[i].LGNUM, whData[i].LGNUM__TXT);
					      strStorageTypeTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(sData[j].LGTYP, sData[j].LGTYP__TXT);
						  oDataItems.EntityDesc = strStorageTypeTxt +", "+strWarehouseTxt;
					      oDataItems.EntityName = this.i18n.getText("Mat_Warehouse_StorageType") + ", " + this.i18n.getText("Warehouse");
					      strStorTypeResults.results.push(oDataItems);
					      oDataItems = [];
		            	
				
		         } //end outer if
		         
		         else if (sChData[0] !== undefined &&
					sChData[0].EntityAction === this.vUpdated) {
					for (var k = 0; k < sChData.length; k++) {
						vNewVal = sChData[k].NewValue;
						vOldVal = sChData[k].OldValue;
						 	if (vNewVal !== vOldVal) {
										vOldValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vOldVal);
										vNewValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vNewVal);
										if (vOldValBoln === false) {
											vOldVal = this.vNotMaint;
										} else {
											vOldVal = vOldVal;
										}
										if (vNewValBoln === false) {
											vNewVal = "(" + this.vDeleted + ")";
										} else {
											vNewVal = vNewVal;
										}
									} // end if NewVal !== oldVal for attributes with numeric values
									oDataItems.NewValue = vNewVal;
									oDataItems.OldValue = vOldVal;
						
						    oDataItems.AttributeDesc = sChData[k].AttributeDesc;
						   
						     
					   oDataItems.LGNUM = whData[i].LGNUM;
					   oDataItems.LGTYP = sData[j].LGTYP;
					   strWarehouseTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(whData[i].LGNUM, whData[i].LGNUM__TXT);
					   strStorageTypeTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(sData[j].LGTYP, sData[j].LGTYP__TXT);
					   oDataItems.EntityDesc = strStorageTypeTxt +", "+ strWarehouseTxt;
					   oDataItems.EntityName = this.i18n.getText("Mat_Warehouse_StorageType") + ", " + this.i18n.getText("Warehouse");
					   strStorTypeResults.results.push(oDataItems);
					    oDataItems = [];
					   } // end for with var k
			 	    } // end else if entity action
			      } // end for loop with 'j'
			      //For Navigation from S3 to S4
			      	//s3 controller hook: importing param: strWarehouseResults,oWhChangedTemplate with return same as imp
			      		var extStorageTypeResults = this.oS3Controller.matHookgetStorageTypeResults(strStorTypeResults);
			if(extStorageTypeResults !== undefined){
				strStorTypeResults =extStorageTypeResults;
		}
	
	
				oStorageTypeChangedTemplate.attachPress({
			Entity: oWhChangedData,
			name: 'matStorageTypeChangeDataDetail'
		}, oView.navtoSubDetail, oView);
		this.bindStoargeTypeData(strStorTypeResults,oStorageTypeChangedTemplate);
	}
	}, // end work on StorageTypeData

//********************************************************************************************************************
	bindWarehouseFormData: function(aWHData, oWhChangedTemplate) {
		//bind Warehouse Data to the form
		if (aWHData.results.length === 0) {
			//If no changed Data is there,show no changed data
			sap.ui.getCore().byId("matChangeWarehouseDataLayout").removeAllContent();
			var vNoDataTxt = this.i18n.getText("NodataChanged");
			this.oWHChangedLayout = sap.ui.getCore().byId("matChangeWarehouseDataLayout");
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(this.oWHChangedLayout, vNoDataTxt);

		} else {
			var oWHGenDataModel = new sap.ui.model.json.JSONModel();
	        oWHGenDataModel.setData(aWHData);
			this.oMaterialWHChangeTable.setModel(oWHGenDataModel );
			this.oMaterialWHChangeTable.bindItems('/results', oWhChangedTemplate, '', '');
		}
	},
//**********************************************************************************************************************
	bindStoargeTypeData: function(aSTData, oStChangedTemplate) {
		//bind Storage Type Data
		if (aSTData.results.length !== 0) {
		   //If no changed Data is there,show no changed data
				var oSTDataModel = new sap.ui.model.json.JSONModel();
			oSTDataModel.setData(aSTData);
			this.oMaterialStorageTypeChangeTable.setModel(oSTDataModel);
			this.oMaterialStorageTypeChangeTable.bindItems('/results',oStChangedTemplate, '', '');
		}
		else{
			if(this.oMaterialStorageTypeChangeTable!==undefined){
				this.oMaterialStorageTypeChangeTable.destroy();
			}
		}
	}
//**************************************************************************************************************************
};