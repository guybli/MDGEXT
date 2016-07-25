/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//define a root UIComponent which exposes the main view 
jQuery.sap.declare("fcg.mdg.approvecrv2.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("fcg.mdg.approvecrv2.Configuration");
jQuery.sap.require("sap.ui.core.routing.Router");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

(function() {
    var iIndex = window.location.pathname.indexOf("/ui5_ui5/");
    if (iIndex !== -1) {
        var sPath = window.location.pathname.slice(0, iIndex + 8);
        sPath += "/sap/MDG_LIB_ADDRESS/sap/fcg/mdg/lib/address";
        jQuery.sap.registerModulePath("sap.fcg.mdg.lib.address", sPath);
        
    }
}());

//new Component
sap.ca.scfld.md.ComponentBase.extend("fcg.mdg.approvecrv2.Component", {

	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		"name": "Approve Requests", // F0392
		"version" : "1.3.0-SNAPSHOT",
		"library" : "fcg.mdg.approvecrv2",
		"includes" : ["css/style.css"], 
		              "dependencies" : { 
		            	  "libs" : [ 
		            	            "sap.m",
		            	            "sap.me",
		            	            "sap.fcg.mdg.lib.address"
		            	            ],  
		            	            "components" : [ 
		            	                            ] 
		              },
		              "config" : {
		            	  "resourceBundle" : "i18n/i18n.properties",
		            	  "titleResource" : "SHELL_TITLE",
		            	  "icon" : "sap-icon://Fiori2/F0871",
		            	  "favIcon" : "./resources/sap/ca/ui/themes/base/img/favicon/Approve_Requests.ico" 
		              },

		              // Navigation related properties

		              viewPath : "fcg.mdg.approvecrv2.view",

		              detailPageRoutes : {
		            	  "detail" : {
		            		  "pattern": "detail/{ChangeRequestID}/{DataModel}/{contextPath}/{MainEntity}/{Action}/{Source}/{ChangeRequestDesc}/{NumberOfAttachments}/{NumberOfNotes}",
		            		  "view" : "S3"
		            	  },
		            	  "ccItemDetail"  :  {
		            		  "pattern": "ccItemDetail/{ChangeRequestID}/{DataModel}/{MainEntity}/{contextPath}",
		            		  "view"  : "CcDetail"		 
		            	  },
		            	  "pcItemDetail"  :  {
		            		  "pattern": "pcItemDetail/{ChangeRequestID}/{DataModel}/{MainEntity}/{contextPath}",
		            		  "view"  : "PcDetail"		 
		            	  },
		            	  "bankDetail"  :  {
		            		  "pattern": "bankDetail/{ChangeKey}/{Domain}",
		            		  "view"  : "BankDetail"		 
		            	  },
		            	  "RelDetail"  :  {
		            		  "pattern": "relDetail/{ChangeKey}/{Category}/{Domain}/{Partner1}/{Partner2}",
		            		  "view"  : "RelDetail"		 
		            	  },
		            	  "subDetail"  :  {
		            		  "pattern" : "subDetail/{contextPath}",
		            		  "view"  : "S4"
		            	  },
		            	  "CompCode"  :  {
		            		  "pattern": "CompCode/{ChangeRequestID}/{contextPath}/{Key}",
		            		  "view"  : "CompanyCodeDetail"         
		            	  },  
		            	  "SuppCompCode"  :  {
		            		  "pattern": "SuppCompCode/{ChangeRequestID}/{contextPath}/{Key}",
		            		  "view"  : "CompanyCodeDetail"         
		            	  },
		            	  "SubRange"  :  {
		            		  "pattern": "SubRange/{ChangeRequestID}/{contextPath}/{Key}",
		            		  "view"  : "SubRangeDetail"         
		            	  },
		            	  "Sales"  :  {
		            		  "pattern": "Sales/{ChangeRequestID}/{contextPath}/{Key}",
		            		  "view"  : "SalesDetail"                                
		            	  },
		            	  "Purchase"  :  {
		            		  "pattern": "Purchase/{ChangeRequestID}/{contextPath}/{Key}",
		            		  "view"  : "PurchasingDetail"                                
		            	  },
		            	  "Dunning"  :  {
		            		  "pattern": "Dunning/{ChangeRequestID}/{contextPath}/{Key}",
		            		  "view"  : "DunningDetail"         
		            	  },
		             	  "SuppDunning"  :  {
		            		  "pattern": "SuppDunning/{ChangeRequestID}/{contextPath}/{Key}",
		            		  "view"  : "DunningDetail"         
		            	  },
		            	  "SuppWithhldtax"  :  {
		            		  "pattern": "SuppWithhldtax/{ChangeRequestID}/{contextPath}/{Key}",
		            		  "view"  : "SuppExtendedTaxDetail"         
		            	  },
		            	  "Withhldtax"  :  {
		            		  "pattern": "Withhldtax/{ChangeRequestID}/{contextPath}/{Key}",
		            		  "view"  : "ExtendedTaxDetail"         
		            	  },
		            	  "roleDetail" : {
		            		  "pattern": "roleDetail/{Domain}",
		            		  "view" : "RoleDetail" 
		            	  },
		            	  "identificationDetail" : {
		            		  "pattern": "identificationDetail/{Domain}",
		            		  "view" : "IdentificationDetail" 
		            	  },
		            	  "taxDetail" : {
		            		  "pattern": "taxDetail/{Domain}",
		            		  "view" : "TaxDetail" 
		            	  },
		            	  "industryDetail" : {
		            		  "pattern": "industryDetail/{Domain}",
		            		  "view" : "IndustryDetail" 
		            	  },
		            	  "AddressDetail": {
		            		  "pattern": "AddressDetail/{ChangeKey}/{Domain}",
		            		  "view" : "Address"
		            	  },
		            	  "AddressUsages": {
		            		  "pattern": "AddressUsages/{ChangeKey}/{Domain}",
		            		  "view" : "AddressUsages"
		            	  },		            	  
		            	  "WPAddressDetail": {
		            		  "pattern": "WPAddressDetail/{Category}/{Domain}/{Partner1}/{Partner2}/{Address_number}",
		            		  "view" : "WPAddress"
		            	  },
		            	  "generalOrgDetail" : {
		            		  "pattern": "generalOrgDetail/{Domain}",
		            		  "view" : "GeneralOrgDetail" 
		            	  },
		            	  "generalPersonDetail" : {
		            		  "pattern": "generalPersonDetail/{Domain}",
		            		  "view" : "GeneralPersonDetail" 
		            	  },
		            	  "generalGroupDetail" : {
		            		  "pattern": "generalGroupDetail/{Domain}",
		            		  "view" : "GeneralGroupDetail" 
		            	  },
		            	  "erpCustomerDetail" : {
		            		  "pattern": "erpCustomerDetail/{ChangeKey}",
		            		  "view" : "ERPCustomerDetail" 
		            	  },
		            	  "erpSupplierDetail" : {
		            		  "pattern": "erpSupplierDetail/{ChangeKey}",
		            		  "view" : "ERPSupplierDetail" 
		            	  },
		            	  "IAVDetail" : {
		            		  "pattern": "IAVDetail/{AddressId}/{AddressVersion}/{Domain}",
		            		  "view" : "IAVDetail" 
		            	  },
		            	  "IAVPersDetail" : {
		            		  "pattern": "IAVPersDetail/{AddressId}/{AddressVersion}/{Domain}",
		            		  "view" : "IAVPersDetail" 
		            	  },		            	  
		            	  "Back": {
		            		  "pattern" : "Back",
		            		  "view" : "S3"
		            	  },
		             "matGtinDataDetail":{
		            		  "pattern": "matGtinDataDetail/{Rowid}",
		            		  "view"  : "MatBasicDataDetails"		 
		            	  },
		            	  
		            	  "matNotesDetail":{
		            		  "pattern": "matNotesDetail/{TableKey}/{RowId}",
		            		  "view"  : "MatBasicDataDetails"		 
		            	  },
		            	  "matPlantDataDetail":{
		            		  "pattern": "matPlantDataDetail/{WERKS}/{RowId}",
		            		  "view"  : "MatPlantDetails"		 
		            	  },
		            	  "matStorageLocDetail":{
		            		  "pattern": "matStorageLocDetail/{LGORT}/{RowId}/{Action}",
		            		  "view"  : "MatPlantStorageLoc"		 
		            	  },
		            	  "matInsTypDetail": {
		            			"pattern": "matInsTypDetail/{RowId}/{Action}",
		            			"view"  : "MatPlantStorageLoc"
		            	  },
		            	  "matPlantMrpTextDetail":{
                                "pattern": "matPlantMrpTextDetail/{Action}",
                                 "view"  : "MatPlantStorageLoc"                        
                           },
                             "matValAreaDataDetail":{
		            		  "pattern": "matValAreaDataDetail/{RowId}/{bwtar}/{bwkey}",
		            		  "view"  : "MatPlantStorageLoc"		 
		            	  },
		            	  "matValuationChngDetail":{
		            		  "pattern": "matValuationChngDetail/{RowId}",
		            		  "view"  : "MatPlantStorageLoc"		 
		            	  },
                           "matMrpAreaDetail": {
		            			"pattern": "matMrpAreaDetail/{RowId}/{Action}",
		            			"view"  : "MatPlantStorageLoc"
		            	  },
		            	  "matPrdVrsnDetail": {
		            			"pattern": "matPrdVrsnDetail/{RowId}/{Action}",
		            			"view"  : "MatPlantStorageLoc"
		            	  },
		            	  "matSalesTextDetail":{
                             "pattern": "matSalesTextDetail/{ChangeRequestID}/{RowId}/{VKORG}/{VTWEG}/{LANGUCODE}",
                                 "view"  : "MatSalesLongText"                      
                           },
                          "matSalesChangeDataDetail" : {
		            		  "pattern" : "matSalesChangeDataDetail/{ChangeRequestID}",
		            		  "view" : "MatSalesOrg"
		            	  },
		            	  "matSalesNDisbChangeDataDetail":{
                                "pattern": "matSalesNDisbChangeDataDetail/{RowId}/{VKORG}/{VTWEG}",
                                 "view"  :"MatSalesOrg"                       
                           },
                           "matSalesTaxChangeDataDetail":{
                                "pattern": "matSalesTaxChangeDataDetail/{RowId}/{VKORG}/{VTWEG}/{ALAND}/{TATYP}",
                                 "view"  : "MatSalesOrg"                       
                           },
                           "matSalesTextChangeDetail":{
                                "pattern": "matSalesTextChangeDetail/{RowId}/{VKORG}/{VTWEG}/{LANGUCODE}",
                                 "view"  :  "MatSalesLongText"                        
                           },
		            	  "matGenChangedDetail":{
		            		  "pattern": "matGenChangedDetail/{ChangeRequestID}/{contextPath}/{RowId}",
		            		  "view"  : "MatBasicDataDetails"		 
		            	  },
		            	    "matDimGtinChangedDetail":{
		            		  "pattern": "matDimGtinChangedDetail/{RowId}",
		            		  "view"  : "MatBasicDataDetails"		 
		            	  },
		            	  "matClassChangedDetail":{
		            		  "pattern": "matClassChangedDetail/{key}/{context}/{Classtype_text}/{Valid_from}",
		            		  "view"  : "MatBasicDataDetails"		 
		            	  },
		            	    "matCharChangedDetail":{
		            		  "pattern": "matCharChangedDetail/{key}/{context}/{Classtype_text}/{Valid_from}",
		            		  "view"  : "MatBasicDataDetails"		 
		            	  },
		            	   "matPurchChangedDetail":{
		            		  "pattern": "matPurchChangedDetail/{ChangeRequestID}/{contextPath}/{RowId}",
		            		  "view"  : "MatBasicDataDetails"		 
		            	  },
		            	   "matNotesChangedDetail":{
		            		  "pattern": "matNotesChangedDetail/{TableKey}/{RowId}/{key}/{newvalue}",
		            		  "view"  : "MatBasicDataDetails"		 
		            	  },
		            	    "matPlantPnlChngDetail":{
		            		  "pattern": "matPlantPnlChngDetail/{PanelId}/{ChangeKey}/{MatText}/{PLANT}/{MATERIAL}/{NwVal}",
		            		  "view"  : "MatPlantDetails"		 
		            	  },
		            	    "matStrgLocChngDetail":{
		            		  "pattern": "matStrgLocChngDetail/{PanelId}/{ChangeKey}/{MatText}/{PLANT}/{MATERIAL}/{STRGLOC}/{NwVal}",
		            		  "view"  : "MatPlantStorageLoc"		 
		            	  },
		            	  "matInspTypChngDetail":{
		            		  "pattern": "matInspTypChngDetail/{PanelId}/{ChangeKey}/{MatText}/{PLANT}/{MATERIAL}/{InspType}/{NwVal}",
		            		  "view"  : "MatPlantStorageLoc"		 
		            	  },
		            	  "matMrpAreaChngDetail":{
		            		  "pattern": "matMrpAreaChngDetail/{PanelId}/{ChangeKey}/{MatText}/{PLANT}/{MATERIAL}/{MRPAREA}/{NwVal}",
		            		  "view"  : "MatPlantStorageLoc"		 
		            	  },
		            	  "matPrdVerChngDetail":{
		            		  "pattern": "matPrdVerChngDetail/{PanelId}/{ChangeKey}/{MatText}/{PLANT}/{MATERIAL}/{PRDVER}/{NwVal}",
		            		  "view"  : "MatPlantStorageLoc"		 
		            	  },
		            		"matWarehouseDataDetail" : {
		            		  "pattern" : "matWarehouseDataDetail/{ChangeRequestID}/{RowId}",
		            		  "view" : "MaterialWarehouseDetails"
		            	  },
		            	  "matWarehouseChangeDataDetail" : {
		            		  "pattern" : "matWarehouseChangeDataDetail/{ChangeRequestID}/{LGNUM}/{MatText}",
		            		  "view" : "MaterialWarehouseDetails"
		            	  },
		            	  "matStorageTypeChangeDataDetail" : {
		            		  "pattern" : "matStorageTypeChangeDataDetail/{ChangeRequestID}/{LGNUM}/{LGNUM__TXT}/{LGTYP}/{LGTYP__TXT}/{MatText}",
		            		  "view" : "MaterialWarehouseDetails"
		            	  },
		            	   "matDocAssignmentDataDetail" : {
		            		  "pattern" : "matDocAssignmentDataDetail/{RowId}",
		            		  "view" : "MaterialDocAssignmentDetails"
		            	  },
		            	  "matDocAssignmentTextDataDetail":{
                                "pattern": "matDocAssignmentTextDataDetail/{RowId}",
                                 "view"  : "MaterialDocAssignmentTextDataDetail"                        
                           },
                           "matDocAssignmentChangeDataDetail" : {
		            		  "pattern" : "matDocAssignmentChangeDataDetail/{RowId}",
		            		  "view" : "MaterialDocAssignmentDetails"
		            	  },
		            	  "matDocAssignmentChangeTextDataDetail":{
                                "pattern": "matDocAssignmentChangeTextDataDetail/{RowId}",
                                 "view"  : "MaterialDocAssignmentTextDataDetail"                        
                           },
		            	  //gl account
		            	  "GLCompanyCode" :{
		            		  "pattern" : "GLCompanyCode/{ChangeRequestID}/{GLAccComp}",
		            		  "view"    : "GLAccCompCodeDetail"
		            	  },
		            	  
		            	  "GLCostEl" :{
		            		  "pattern" : "GLCostEl/{ChangeRequestID}/{GLAccCOA}",
		            		  "view"    : "GLAccCostElDetail"
		            	  },
		            	   "matSalesDataDetail" : {
		            		  "pattern" : "matSalesDataDetail/{ChangeRequestID}/{RowId}",
		            		  "view" : "MatSalesOrg"
		            	  },
		            	  
		            	  "glItemDetail" : {
		            		  "pattern" : "glItemDetail/{ChangeRequestID}",
		            		  "view" : "GLDetail"
		            	  }
		              }, 

		              
		              fullScreenPageRoutes : {
		            	  "detail_deep" : {
		            		  "pattern" : "detail_deep/{SAP__Origin}/{InstanceID}/{contextPath}",
		            		  "view" : "S3"
		            	  }	
		              }

	}),

	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
		var oViewData = {component: this};

		return sap.ui.view({
			viewName : "fcg.mdg.approvecrv2.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	},

	setDataManager : function(oDataManager) {
		this.oDataManager = oDataManager;
	},

	getDataManager : function() {
		return this.oDataManager;
	}
});