/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate = {
    
    oMaterialWarehouseTable: "",
	oMaterialWarehouseForm: "",
	vNoDataTxt: "",
	aWarehouseDetailData:"",
	awhStorageTypeData:"",
	oS3Controller:"",
	
    i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
   
   // Load Warehouse Table Layout in s3
   
	initializeWarehouseTabl: function(aResult, oS3Controller) {
		this.oS3Controller = oS3Controller;
		this.vNoDataTxt = this.i18n.getText("NodataCreate");
		// Load table if more than one warehouse exist	
		if (aResult.results.length > 1) {
			if (this.oMaterialWarehouseTable === "") {
				this.oMaterialWarehouseTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialWarehouseCreate', fcg.mdg.approvecrv2.util.Formatter);
			} else {
				this.oMaterialWarehouseTable.destroy();
				this.oMaterialWarehouseTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialWarehouseCreate', fcg.mdg.approvecrv2.util.Formatter);
			}
			sap.ui.getCore().byId("matCreateWarehouseDataLayout").removeAllContent();
			sap.ui.getCore().byId("matCreateWarehouseDataLayout").addContent(this.oMaterialWarehouseTable);
		} else {		 // Load Warehouse detail fragment in s3 if only single warehouse exists
			if (this.oMaterialWarehouseForm === "") {
				this.oMaterialWarehouseForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialWarehouseDetails', fcg.mdg.approvecrv2.util.Formatter);
			} else {
				this.oMaterialWarehouseForm.destroy();
				this.oMaterialWarehouseForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialWarehouseDetails', fcg.mdg.approvecrv2.util.Formatter);
			}
			sap.ui.getCore().byId("matCreateWarehouseDataLayout").removeAllContent();
			sap.ui.getCore().byId("matCreateWarehouseDataLayout").addContent(this.oMaterialWarehouseForm);
			}
		
				if(sap.ui.getCore().byId("matChangeWarehouseDataLayout")!== undefined){
				sap.ui.getCore().byId("matChangeWarehouseDataLayout").destroy();
					
				}
	},
//*******************************************************************************************************************************	
	// Bind data to warehouse table frgment or warehouse detail fragment 
	displayWarehouseData: function(aResult, oView) {
		var oDataItems;
		var aWarehouseResults = {
			dataitems: []
		};
		var oWarehouseModel = new sap.ui.model.json.JSONModel();
		// If more than one warehiuse exist then display it in s3 in a table
		if (aResult.results.length > 1) {

			for (var i = 0; i < aResult.results.length; i++) {
				var oWarehouseDesc = aResult.results[i].LGNUM__TXT;
				var oWarehouseNum = aResult.results[i].LGNUM;
			    oWarehouseDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oWarehouseNum, oWarehouseDesc);
				 
				oDataItems = {
					"warehousestatus": oWarehouseDesc
				};
					var extoDataItems = this.oS3Controller.matHookgetWarehouseDataItems(oDataItems);
			if(extoDataItems !== undefined){
				oDataItems = extoDataItems;
		}
//hook to add more fields to odata items defined in s3, importing odata items and return odata items
				aWarehouseResults.dataitems.push(oDataItems);
			}
			
			// Warehouse Table Personalization
			// get the table control and the button control
			var oWarehouseTabl = sap.ui.getCore().byId("MatWarehouseTable");
			var oWarehousePersButton = sap.ui.getCore().byId("WarehousepersIcon");
			var oItem = "/dataitems";
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oItem, oWarehouseTabl, oWarehousePersButton);
					
			oWarehouseModel.setData(aWarehouseResults);
			var oWarehouseTemp = this.createWarehouseTableTemplate(); // create table template for warehouse
			oWarehouseTemp.attachPress({ // attach press event for table items
				Entity: aResult,
				name: "matWarehouseDataDetail"
			}, oView.navtoSubDetail, oView);
			oWarehouseTabl.setModel(oWarehouseModel);
			oWarehouseTabl.bindItems('/dataitems', oWarehouseTemp, '', ''); // bind data to Warehouse table
		} else if (aResult.results.length === 1) { // If only one Warehouse exists then display warehouse details in s3 in form
			var warehouseResults =fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialWarehouseCreate.getWarehouseDetailData(0);
			var oWarehouseDetailModel= new sap.ui.model.json.JSONModel();
			if(warehouseResults.L2SKR ===""){
			warehouseResults.L2SKR = warehouseResults.L2SKR__TXT;
			warehouseResults.L2SKR__TXT="";
		}
			oWarehouseDetailModel.setData(warehouseResults);
			 var vWarehouseHeader= this.setGetWarehouseHeader(aResult);
			  sap.ui.getCore().byId("Txt_WAREHOUSEDETAILS").setText(vWarehouseHeader); 
			sap.ui.getCore().byId("matWarehouseDataForm").setModel(oWarehouseDetailModel);
			var aWarehouseStorageTypeData = warehouseResults.MLGNSTOR2MLGTSTORRel;
		    // Table Personalization in case of a single Warehouse
			// get the table control and the button control
			var oSTable = sap.ui.getCore().byId("MatWarehouseStorageTypeTable");
			var oStoragePersButton = sap.ui.getCore().byId("StorageTypepersIcon");
			var oStorageItem = "/results";
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oStorageItem,oSTable,oStoragePersButton);
		    this.bindStorageTypeData(aWarehouseStorageTypeData);
			// hide those sections without any data	
			this.hideWarehouseSection();
	} else { // if no Warehouse found, display no data maintained
			var vNodatLayout = sap.ui.getCore().byId("matCreateWarehouseDataLayout");
		    fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(vNodatLayout,this.vNoDataTxt);
		}
	},
//********************************************************************************************************************	
	//Table Template for Warehouse S3 Screen
	createWarehouseTableTemplate: function() { // table templete for warehouse
		var oWarehouseTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				    new sap.m.Text({
					text: {
						path: "warehousestatus",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
					
			})
			]
		});
			var extoWarehouseTemp = this.oS3Controller.matHookgetWarehouseTemplate(oWarehouseTemp);
			if(extoWarehouseTemp !== undefined){
				oWarehouseTemp = extoWarehouseTemp;
			}
		
		return oWarehouseTemp;
	},
//**********************************************************************************************************************
	
	//bind storage type data
		bindStorageTypeData: function(aResult) { 	
		var oWarehouseStorageTypeTable = sap.ui.getCore().byId("MatWarehouseStorageTypeTable");
		if (aResult.results.length >= 1) {
			   var oDisModel = new sap.ui.model.json.JSONModel();
			   oDisModel.setData(aResult);
			   var oItemTemp = this.getStorageTypeTableTemplate(oDisModel,"",this.oS3Controller,"");
			   oWarehouseStorageTypeTable.setModel(oDisModel);
			   oWarehouseStorageTypeTable.bindItems('/results', oItemTemp, '', '');
		} 
		else{
			    oWarehouseStorageTypeTable.destroy();
		}
		},
//*******************************************************************************************************************
	//create storage type template
		getStorageTypeTableTemplate: function(oStorageTypeModel, oStorageTypeChangedModel,oS3Controller,vEnAction){
			var oStmodel=new sap.ui.model.json.JSONModel();
			var oItemTemp = new sap.m.ColumnListItem({
			cells: [
					new sap.m.Text({
					text: {
						path: "LGTYP",
						formatter: function() {
							
								if (oStorageTypeChangedModel !== "" && oStorageTypeChangedModel !== undefined) {
									
								fcg.mdg.approvecrv2.util.Formatter.handleMatCellBolding(this, oStorageTypeChangedModel, "LGTYP",vEnAction);
							    oStmodel=oStorageTypeChangedModel;
								}
								else
								{
									oStmodel=oStorageTypeModel;
								}
							    var key = oStmodel.getProperty('LGTYP', this.getBindingContext());
							    var desc = oStmodel.getProperty('LGTYP__TXT', this.getBindingContext());
							   return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
								}
						
					}
				}),
				new sap.m.Text({
					text: {
						path: "LGPMLGTST",
						formatter: function() {
								if (oStorageTypeChangedModel !== "" && oStorageTypeChangedModel!==undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handleMatCellBolding(this, oStorageTypeChangedModel, "LGPMLGTST",vEnAction);
							      oStmodel=oStorageTypeChangedModel;
								}
								else
								{
									oStmodel=oStorageTypeModel;
								}
							    var oLgpm = oStmodel.getProperty('LGPMLGTST', this.getBindingContext());
							    return fcg.mdg.approvecrv2.util.Formatter.defaultMatValueChange(oLgpm);
								}
						
					}
				}),
			new sap.m.Text({
					text: {
						path: "KOBMLGTST",
						formatter: function() {
								if (oStorageTypeChangedModel !== "" && oStorageTypeChangedModel!==undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handleMatCellBolding(this, oStorageTypeChangedModel, "KOBMLGTST",vEnAction);
                                
								  oStmodel=oStorageTypeChangedModel;
								}
								else
								{
									oStmodel=oStorageTypeModel;
								}
							var oKob = oStmodel.getProperty('KOBMLGTST', this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.defaultMatValueChange(oKob);
								}
						}
					
				}),
				new sap.m.Text({
					text: {
						path: "LPMIN",
						formatter: function() {
								if (oStorageTypeChangedModel !== "" && oStorageTypeChangedModel!==undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handleMatCellBolding(this, oStorageTypeChangedModel, "LPMIN",vEnAction);
                                  oStmodel=oStorageTypeChangedModel;
								}
								else
								{
									oStmodel=oStorageTypeModel;
								}
								
							var oLpmin = oStmodel.getProperty('LPMIN', this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.defaultMatValueChange(oLpmin);
						
						}
					}
				}),
					new sap.m.Text({
					text: {
						path: "LPMAX",
						formatter: function() {
								if (oStorageTypeChangedModel !== "" && oStorageTypeChangedModel!==undefined) 
							        {
							      	fcg.mdg.approvecrv2.util.Formatter.handleMatCellBolding(this, oStorageTypeChangedModel, "LPMAX",vEnAction);
							     oStmodel=oStorageTypeChangedModel;
						           }
						          else
								{
									oStmodel=oStorageTypeModel;
								}
							var oLpmax = oStmodel.getProperty('LPMAX', this.getBindingContext());
						
					    	return fcg.mdg.approvecrv2.util.Formatter.defaultMatValueChange(oLpmax);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "MAMNG",
						formatter: function() {
								if (oStorageTypeChangedModel !== "" && oStorageTypeChangedModel!==undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handleMatCellBolding(this, oStorageTypeChangedModel, "MAMNG",vEnAction);
                                  oStmodel=oStorageTypeChangedModel;
								}
								else
								{
									oStmodel=oStorageTypeModel;
								}
							var oMamng = oStmodel.getProperty('MAMNG', this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.defaultMatValueChange(oMamng);
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "NSMNG",
						formatter: function() {
								if (oStorageTypeChangedModel !== "" && oStorageTypeChangedModel!==undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handleMatCellBolding(this, oStorageTypeChangedModel, "NSMNG",vEnAction);
                                 oStmodel=oStorageTypeChangedModel;
								}
								else
								{
									oStmodel=oStorageTypeModel;
								}
							var oNsmng = oStmodel.getProperty('NSMNG', this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.defaultMatValueChange(oNsmng);
						}
					}
				}),
					new sap.m.Text({
					text: {
						path: "RDMNG",
						formatter: function() {
								if (oStorageTypeChangedModel !== "" && oStorageTypeChangedModel!==undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handleMatCellBolding(this, oStorageTypeChangedModel, "RDMNG",vEnAction);
                                oStmodel=oStorageTypeChangedModel;
								}
								else
								{
									oStmodel=oStorageTypeModel;
								}
							var oRdmng = oStmodel.getProperty('RDMNG', this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.defaultMatValueChange(oRdmng);
						}
					}
					//controller hook
				})
			]
		});
			var extoItemTemp = oS3Controller.matHookgetWarehouseStorageTypeTemplate(oItemTemp);
			if(extoItemTemp !== undefined){
				oItemTemp = extoItemTemp;
		}
		return oItemTemp;	
	},
//*************************************************************************************************************************
	//get the detailed data for  including storage type data
		getWarehouseDetailData: function(sRowId) { 
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.executeWarehouseDetailQuery(sRowId);
		this.aWarehouseDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getWarehouseDetailsData();
		return this.aWarehouseDetailData;
	},

//****************************************************************************************************************************	
	hideWarehouseSection: function() { 	//hide sections for General  data, Palletization Data and Storage Strategies
	//Hook with no importng and return param true or false defined in s3
	// hide the General Section
		this.oS3Controller=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
	if(!this.oS3Controller.matHookHideWarehouseCentralSection()){
		if (sap.ui.getCore().byId("Txt_LVSME").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VOMEM").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MKAPV").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BEZME").getVisible() === false &&
			sap.ui.getCore().byId("Txt_PLKMLGNST").getVisible() === false &&
			sap.ui.getCore().byId("MatWarehouseCentral") !== undefined
		)       {
			    sap.ui.getCore().byId("MatWarehouseCentral").destroy();
		        }
	}
	    // hide the Palletization Data section
	   	if(!this.oS3Controller.matHookHideWarehousePalletSection()){
		if (sap.ui.getCore().byId("Txt_LHMG1").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LE1MLGNST").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LHMG2").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LE2MLGNST").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LHMG3").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LE3MLGNST").getVisible() === false &&
			sap.ui.getCore().byId("Mat_Pallet_Data") !== undefined
		)      {
			      sap.ui.getCore().byId("Mat_Pallet_Data").destroy();
		       }
	   	}
	   		if(!this.oS3Controller.matHookHideWarehouseStorageSection()){
		// hide Storage Strategies section
	
		if (sap.ui.getCore().byId("Txt_LTAMLGNST").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LTEMLGNST").getVisible() === false &&
			sap.ui.getCore().byId("Txt_LGBMLGNST").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BLOMLGNST").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BSSMLGNST").getVisible() === false &&
			sap.ui.getCore().byId("Txt_L2SKR").getVisible() === false && 
			sap.ui.getCore().byId("Txt_KZMBF").getVisible() === false &&
			sap.ui.getCore().byId("Txt_KZZUL").getVisible() === false &&
			sap.ui.getCore().byId("Mat_Storage_Strategies") !== undefined
		)      {
			      sap.ui.getCore().byId("Mat_Storage_Strategies").destroy();
		       }
		       
	   		}
		       //Controller hook
	},
	//******************************************************************************************************************
	setGetWarehouseHeader: function(aResult) { //get WarehouseHeadr for setting when only one warehouse is there.
	    var vWarehouseNum = aResult.results[0].LGNUM;
	    var vWarehouseDesc = aResult.results[0].LGNUM__TXT;
	    var vWarehouseobjDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vWarehouseNum, vWarehouseDesc);
		vWarehouseobjDesc = this.i18n.getText("Warehouse") + ": " + vWarehouseobjDesc;
		return vWarehouseobjDesc;

	}
//*************************************************************************************************************************
};