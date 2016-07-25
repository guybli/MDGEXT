/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentChange = {
	//Declaring global variables for this class
	oMaterialDocumentsTable: "",
	oMaterialDocTextTable: "",
	aDocumentsData: "",
	aDocTextData: "",
	nodata: "",
	oAttachment: "",
	vLinkPressed: "",
	oS3Controller: "",
	strDocuments: "",
	strDocText: "", 
	oMaterialS4DocForm: "",
	oDocTableS4Details: "",
	vAdded: "",
	vNotMaint: "",
	vDeleted: "",
	aDocChangedData:"",
	vTxtAddedflag:0,

	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	// Initializing tables and adding them to layouts 
	initializeDocTables: function(oDocData,oS3Controller) {
		this.oS3Controller = oS3Controller;
		//delete all UI contents if present for create layout
		sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").removeAllContent();
		sap.ui.getCore().byId("matChangeDocAssignmentDataLayout").removeAllContent();
if(sap.ui.getCore().byId("matCreateDocAssignmentDataLayout")!==undefined)
{
	sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").destroy();
}

		 this.aDocumentsData = oDocData;
			// initialize the table only if there is content available	
			this.oMaterialDocumentsTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matChangeDocAssignmentDataLayout").addContent(
				this.oMaterialDocumentsTable);
			this.oMaterialDocumentsTable.setGrowing(true);
			this.strDocuments = this.i18n.getText("Mat_Documents");
	 fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.oMaterialDocumentsTable,this.i18n.getText("Mat_Documents"));
		
			this.oMaterialDocTextTable = "";
			this.oMaterialDocTextTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matChangeDocAssignmentDataLayout").addContent(
				this.oMaterialDocTextTable);
			this.oMaterialDocTextTable.setGrowing(true);
			this.strDocText = this.i18n.getText("Mat_Txt");
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.oMaterialDocTextTable,this.i18n.getText("Mat_Txt"));
		this.vAdded = this.i18n.getText("PC_ADDED");
		this.vNotMaint = "(" + this.i18n.getText("PC_NOT_MAIN") + ")";
		this.vDeleted = this.i18n.getText("PC_DELETED");
	},

	//Function to map the table data on S3 and display it accordingly
	displayTableData: function(oView) { // EXC_JSHINT_047
		// Create item template
	
		// Bind data to Documents and Document Text related changes to a table
		this.bindDocumentsTextDataTable(oView,this.aDocumentsData);
	},

	// 		//Bind data to Documents and DocText tables
	bindDocumentsTextDataTable: function(oView) {
		var oDataItems = {
			EntityDesc: "",
			EntityName: "",
			AttributeDesc: "",
			NewValue: "",
			OldValue: "",
			NewValueText: "",
			OldValueText: "",
			DOKNR: "",
			DOKAR: "",
			DOKVR:"",
			DOKTL:"",
			DOKAR__TXT:"",
			LANGUCODE: "",
			LANGUCODE_TXT: "",
		    TXTDRAD:""
		};
		// Loop thru the obtained MARASales data, appropriately structure the UI and bind the data for the template for MARASales
		this.workOnDocumentsData(oDataItems,oView);

		// Loop on the Document Text table and Bind the data
		oDataItems = [];
		this.workOnDocumentsTextData(oDataItems, oView);
	}, // end of function bindSalesNDistributionChainTable

	workOnDocumentsData: function(oDataItems, oView) {
		var strDocumentResults = {
			dataitems: []
		};
		var strDocTxt = "";

		// Instead of using the entire path from the results every time and every where assigning the path of the data to a variable and
		// using that variable every where; This improves readbility and maintainability.

		var oDocumentChangeData;
   var aDocData=this.aDocumentsData.__batchResponses[0].data.MATERIAL2DRADBASICRel;
		for (var i = 0; i < aDocData.results.length; i++) {
			for (var j = 0; j < aDocData.results[i].ChangeData.results.length; j++) {
				oDocumentChangeData = aDocData.results[i].ChangeData.results[j];
				switch (oDocumentChangeData.EntityAction) {
					case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vNewEntity:
						{
							// A new document has been added
							oDataItems.NewValue = this.vAdded;
							oDataItems.OldValue = "";
							oDataItems.AttributeDesc = "";
							oDataItems.DOKNR = aDocData.results[i].DOKNR;
							oDataItems.DOKAR = aDocData.results[i].DOKAR;
						    oDataItems.DOKAR__TXT = aDocData.results[i].DOKAR__TXT;
							oDataItems.DOKTL=aDocData.results[i].DOKTL;
							oDataItems.DOKVR=aDocData.results[i].DOKVR;
							strDocTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aDocData.results[i].DOKAR, aDocData.results[i].DOKAR__TXT);
							oDataItems.EntityDesc = strDocTxt + "/" + aDocData.results[i].DOKNR +"/"+aDocData.results[i].DOKVR + "/" + aDocData.results[i].DOKTL;
							oDataItems.EntityName = this.i18n.getText("Mat_Doc_key");
							strDocumentResults.dataitems.push(oDataItems);
							oDataItems = [];
							break;
						} // end case entityaction == newEntity
					case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vDeletedEntity:
						{
							// An existing document has been deleted 
							oDataItems.NewValue = this.vDeleted;
							oDataItems.OldValue = "";
							oDataItems.AttributeDesc = "";
							oDataItems.DOKNR = aDocData.results[i].DOKNR;
							oDataItems.DOKAR = aDocData.results[i].DOKAR;
							oDataItems.DOKAR__TXT = aDocData.results[i].DOKAR__TXT;
							oDataItems.DOKTL=aDocData.results[i].DOKTL;
							oDataItems.DOKVR=aDocData.results[i].DOKVR;
							strDocTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aDocData.results[i].DOKAR, aDocData.results[i].DOKAR__TXT);
							oDataItems.EntityDesc = strDocTxt + "/" + aDocData.results[i].DOKNR +"/"+aDocData.results[i].DOKVR + "/" + aDocData.results[i].DOKTL;
							oDataItems.EntityName = this.i18n.getText("Mat_Doc_key");
							strDocumentResults.dataitems.push(oDataItems);
							oDataItems = [];
							break;
						} // end case entityaction == deletedEntity
				} // end switch case statement	
				break;
			} // end for j	
		} // end  i oDocumentChangeData loop
		this.aDocChangedData = strDocumentResults;
    	this.bindDocumentsData(strDocumentResults,oView);
    
	
	}, // end work on Documents
getDocAssignmentData:function() {
	return this.aDocChangedData;
},

	//Bind Documents data
	bindDocumentsData: function(aDocData,oView) {
		if (aDocData.dataitems.length === 0) {
			if(this.oMaterialDocumentsTable!==undefined)
			{
				this.oMaterialDocumentsTable.destroy();
			}
		} else {
			 var oItemTempDocuments = this.createTableTemplate();
			var oDocumentsGenDataModel = new sap.ui.model.json.JSONModel();
			oDocumentsGenDataModel.setData(aDocData);
			this.oMaterialDocumentsTable.setModel(oDocumentsGenDataModel);
			oItemTempDocuments.attachPress({
			name: 'matDocAssignmentChangeDataDetail'
		}, oView.navtoSubDetail, oView);
			this.oMaterialDocumentsTable.bindItems('/dataitems', oItemTempDocuments, '', '');
			
		}
	},

	//Bind Document Text data

	bindDocTextData: function(aTextData, oView) {
		if (aTextData.results.length === 0) {
			if(this.oMaterialDocTextTable!==undefined)
			{
				this.oMaterialDocTextTable.destroy();
			}
			
		} else {
				 var oItemTempDocText = this.createTableTemplate();
			oItemTempDocText.attachPress({
			Entity: this.oMaterialDocTextTable,
			name: 'matDocAssignmentChangeTextDataDetail'
		}, oView.navtoSubDetail, oView);
			var oDocTextDataModel = new sap.ui.model.json.JSONModel();
			oDocTextDataModel.setData(aTextData);
			this.oMaterialDocTextTable.setModel(oDocTextDataModel);
			this.oMaterialDocTextTable.bindItems('/results', oItemTempDocText, '', '');
		}
		if(aTextData.results.length === 0 && this.aDocChangedData.dataitems.length===0)
		{
			 sap.ui.getCore().byId("matChangeDocAssignmentDataLayout").removeAllContent();
			var vNoDataTxt = this.i18n.getText("NodataChanged");
			var oDocumentTextLayout = sap.ui.getCore().byId("matChangeDocAssignmentDataLayout");
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(oDocumentTextLayout, vNoDataTxt);
		}
	},

	workOnDocumentsTextData: function(oDataItems,oView) {

		var strResults = {
			results: []
		};
			var strTempResults = {
			results: []
		};
		
   var sAttr;
   var vEntityAction,vNewVal,vOldVal,languCode,sDokartxt,aDocText;
		 var aDoctextData=this.aDocumentsData.__batchResponses[0].data.MATERIAL2DRADBASICRel;
		for (var i = 0; i < aDoctextData.results.length; i++) {
			for (var j = 0; j < aDoctextData.results[i].DRADBASIC2DRADTXTRel.results.length; j++) {
				for(var k = 0; k < aDoctextData.results[i].DRADBASIC2DRADTXTRel.results[j].ChangeData.results.length; k++) {
	        aDocText = aDoctextData.results[i].DRADBASIC2DRADTXTRel.results[j];
			sAttr =aDocText.ChangeData.results[k].Attribute;
			vEntityAction=aDocText.ChangeData.results[k].EntityAction;
		   vNewVal=aDocText.ChangeData.results[k].NewValue;
		   vOldVal=aDocText.ChangeData.results[k].OldValue;
		   languCode=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aDocText.LANGUCODE,aDocText.LANGUCODE__TXT);
			
		   sDokartxt=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aDocText.DOKAR,aDocText.DOKAR__TXT);
				
				if(sAttr==='TXTDRAD' )
				{
					if(vEntityAction===fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getUpdateEntityAction())
					{
					vNewVal=fcg.mdg.approvecrv2.util.Formatter.Truncate(vNewVal);
					vOldVal=fcg.mdg.approvecrv2.util.Formatter.Truncate(vOldVal);
					oDataItems.NewValue=vNewVal;
					oDataItems.OldValue=vOldVal;
					}
					if(vEntityAction===fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getCreateEntityAction())
					{
					oDataItems.NewValue=this.vAdded;
					oDataItems.OldValue="";
					oDataItems.AttributeDesc="";
					}
					if(vEntityAction===fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeleteEntityAction())
					{
					oDataItems.NewValue=this.vDeleted;
					vOldVal=fcg.mdg.approvecrv2.util.Formatter.Truncate(vOldVal);
					oDataItems.OldValue=vOldVal;
					oDataItems.AttributeDesc="";
					}
					oDataItems.DOKAR=aDocText.DOKAR;
					oDataItems.DOKAR__TXT=aDocText.DOKAR__TXT;
					oDataItems.DOKNR=aDocText.DOKNR;
					oDataItems.DOKVR=aDocText.DOKVR;
					oDataItems.DOKTL=aDocText.DOKTL;
					oDataItems.TXTDRAD=aDocText.TXTDRAD;
					oDataItems.LANGUCODE=aDocText.LANGUCODE;
						oDataItems.LANGUCODE__TXT=aDocText.LANGUCODE__TXT;
			oDataItems.EntityDesc=languCode+", "+ sDokartxt+"/"+oDataItems.DOKNR+"/"+oDataItems.DOKVR+"/"+oDataItems.DOKTL;
			oDataItems.EntityName=this.i18n.getText("Language")+", "+this.i18n.getText("Mat_Doc_key");
				
				}
			}
				strTempResults.results.push(oDataItems);
				oDataItems = [];
			}
		}
		//removing the texts of those docs which are added
		for (var i = 0; i <strTempResults.results.length; i++) {
			for (var j = 0; j <this.aDocChangedData.dataitems.length; j++) {
		if(strTempResults.results[i].DOKAR===this.aDocChangedData.dataitems[j].DOKAR &&
		strTempResults.results[i].DOKNR===this.aDocChangedData.dataitems[j].DOKNR &&
		strTempResults.results[i].DOKTL===this.aDocChangedData.dataitems[j].DOKTL &&
		strTempResults.results[i].DOKVR===this.aDocChangedData.dataitems[j].DOKVR)
		{
			this.vTxtAddedflag=1;
		}
			}
			if(this.vTxtAddedflag===0 && strTempResults.results[i].LANGUCODE!==undefined)
			{
			strResults.results.push(strTempResults.results[i]);	
			}
			this.vTxtAddedflag=0; 
		}
		
		
		this.aDocTextData=strResults;
		
		this.bindDocTextData(strResults,oView);
	}, // end work on SalesTextData	
getTextDetailData: function()
{
return this.aDocTextData;	
},
	//Create generic table template 
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
	 var extoItemTemp = this.oS3Controller.matHookcreateTableTemplate(oItemTemp);
			if(extoItemTemp !== undefined){
			oItemTemp = extoItemTemp;
			}
		return oItemTemp;
	}

};