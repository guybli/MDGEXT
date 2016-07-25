/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate = {

	oMaterialDocAssignmentTable: "",
	oMaterialDocAssignmentForm: "",
	vNoDataTxt: "",
	aDocAssignmentData:"",
	oS3Controller:"",
	aTextData:"",
    IsSingle:"",
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	// Load Document Assignment Table Layout in s3
	initializeDocAssignmentTabl: function(aResult, oS3Controller) {
		this.oS3Controller = oS3Controller;
		this.vNoDataTxt = this.i18n.getText("NodataCreate");
		// Load table if more than one plant exist	
		if(sap.ui.getCore().byId("matChangeDocAssignmentDataLayout")!==undefined)
		{
			sap.ui.getCore().byId("matChangeDocAssignmentDataLayout").destroy();
		}
		if (aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length > 1) {
			if (this.oMaterialDocAssignmentTable === "") {
				this.oMaterialDocAssignmentTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssignmentCreate', fcg.mdg.approvecrv2
					.util
					.Formatter);
			} else {
				this.oMaterialDocAssignmentTable.destroy();
				this.oMaterialDocAssignmentTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssignmentCreate', fcg.mdg.approvecrv2
					.util
					.Formatter);
			}
			sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").removeAllContent();
			sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").addContent(this.oMaterialDocAssignmentTable);
			// Document Assignment Table Personalization
			// get the table control and the button control
			var oDocAssignmentTabl = sap.ui.getCore().byId("MatDocAssignmentTable");
			var oDocAssignmentPersButton = sap.ui.getCore().byId("DocAssignmentpersIcon");
			var oItem = "/dataitems";
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oItem, oDocAssignmentTabl, oDocAssignmentPersButton);
			// end of Document Assignment Table Personalization
		} else if(aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length===1)
		{ // Load Document Assignmet detail fragment in s3 if only single Document Assignment exists
		if(sap.ui.getCore().byId("Dfileupload")!==undefined)
		{
		sap.ui.getCore().byId("Dfileupload").destroy();	
		}
			if(sap.ui.getCore().byId("MatDocAssignmentTextTable")!==undefined)
		{
		sap.ui.getCore().byId("MatDocAssignmentTextTable").destroy();	
		}
			if(sap.ui.getCore().byId("Txt_Document")!==undefined)
		{
		sap.ui.getCore().byId("Txt_Document").destroy();	
		}
			if (this.oMaterialDocAssignmentForm === "") {
				this.oMaterialDocAssignmentForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssignmentDetails', fcg.mdg.approvecrv2
					.util
					.Formatter);
			} else {
				this.oMaterialDocAssignmentForm.destroy();
				this.oMaterialDocAssignmentForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssignmentDetails', fcg.mdg.approvecrv2
					.util
					.Formatter);
			}
			sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").removeAllContent();
			sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").addContent(this.oMaterialDocAssignmentForm);
		}
	},

	// Bind data to Document Assignment table or Document Assignment detail fragment 
	displayDocAssignmentData: function(aResult, oView) {
		var oDataItems;
		var aDocAssignmentResults = {
			dataitems: []
		};
		var oDocAssignmentModel = new sap.ui.model.json.JSONModel();
		// If more than one Document Assignment exist then display it in s3 in a table
		if (aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length > 1) {

			for (var i = 0; i < aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length; i++) {
				var oDocumentTypeDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKAR, aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel
					.results[i].DOKAR__TXT);
				var oDocumentNum = aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKNR;
				var oDocumentPart = aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKTL;
				var oDocumentVersion = aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKVR;
				var oDocumentType = aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKAR;

				oDataItems = {
					"Document": oDocumentNum,
					"DocumentType": oDocumentTypeDesc,
					"DocumentPart": oDocumentPart,
					"DocumentVersion": oDocumentVersion,
					"DOKNR": oDocumentNum,
					"DOKAR": oDocumentType
				};
//controller hook in S3 with importing odata items and return also odata items
    var oExtDocResponse = this.oS3Controller.matHookModifyDocCreateData(oDataItems);
		if (oExtDocResponse !== undefined) {
			oDataItems = oExtDocResponse;
		}
				aDocAssignmentResults.dataitems.push(oDataItems);
			} // end for
			this.aDocAssignmentData =aDocAssignmentResults;
			var oDocAssignmentTabl = sap.ui.getCore().byId("MatDocAssignmentTable");
			oDocAssignmentModel.setData(aDocAssignmentResults);
			var oDocAssinmentTemp = this.createDocAssignmentTableTemplate(); // create table template for Document Assignment
			oDocAssinmentTemp.attachPress({ // attach press event for table items
				Entity: aResult,
				name: "matDocAssignmentDataDetail"
			}, oView.navtoSubDetail, oView);
			oDocAssignmentTabl.setModel(oDocAssignmentModel);
			oDocAssignmentTabl.bindItems('/dataitems', oDocAssinmentTemp, '', ''); // bind data to Document Assignment table

		} 
		else if (aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length === 1) { // If only one Document Assignment exists then display the details in s3 form
			// show the list of documents in S3 itself
			// and the document text too
		 	// getting the Document Originals data	
		 	this.IsSingle='X';
		 	var vDocno = aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[0].DOKNR;
				var vDocType = aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[0].DOKAR;
			var vDocTypTxt =fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vDocType, aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[0].DOKAR__TXT);
				var vDocversion = aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[0].DOKVR;
				var vDocpart = aResult.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[0].DOKTL;
		 		var aDocDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDocAssignmentData(vDocno,vDocType,vDocversion,vDocpart);
	  
	  var vKey=this.i18n.getText("Mat_Doc_key")+": "+vDocTypTxt+"/"+vDocno+"/"+vDocversion+"/"+vDocpart;
	  
	    sap.ui.getCore().byId("Txt_Document").setText(vKey); 
	       this.getsetDocData(aDocDetailData,oView);
	
		} else { // if no Document Assignement found, display no data maintained
			 sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").removeAllContent();
			var vNoDataTxt = this.i18n.getText("NodataCreate");
			var oDocumentTextLayout = sap.ui.getCore().byId("matCreateDocAssignmentDataLayout");
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(oDocumentTextLayout, vNoDataTxt);
		}
	},
getIsSingleFlag: function()
{
	return this.IsSingle;
},
	createDocAssignmentTableTemplate: function() { // table templete for plant
		var oDocAssignmentTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "Document",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}

				}),
				new sap.m.Text({
					text: {
						path: "DocumentType",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}

				}),
				new sap.m.Text({
					text: {
						path: "DocumentPart",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}

				}),
				new sap.m.Text({
					text: {
						path: "DocumentVersion",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}

				})
			]
		});
			var extoItemTemp = this.oS3Controller.matHookcreateDocAssignmentTableTemplate(oDocAssignmentTemp);
			if(extoItemTemp !== undefined){
				oDocAssignmentTemp = extoItemTemp;
		}
		return oDocAssignmentTemp;
	},
getDocAssignmentData:function(){
	return this.aDocAssignmentData;
},
		loadDocAttachments: function(response, oS3Controller) {
		this.oFileUpload = sap.ui.getCore().byId("Dfileupload");
		var mockData = {
			dataitems: []
		};
		var count = response.results.length;
		var link = "";
		var uploadedby = "";
	//	var fileSize;

		if (count !== 0) {
			for (var i = 0; i < response.results.length; i++) {
				var AttachDate = "";
				if (response.results[i].CHANGEDAT !== undefined && response.results[i].CHANGEDAT !== null && response.results[i].CHANGEDAT !== "") {
					AttachDate =fcg.mdg.approvecrv2.util.Formatter.matDateDoc(response.results[i].CHANGEDAT);
					
					//fcg.mdg.approvecrv2.util.Formatter.matDateFormat(response.results[i].CHANGEDAT);
				} else {
					AttachDate =fcg.mdg.approvecrv2.util.Formatter.matDateDoc(response.results[i].CREATEDAT);
					
					//fcg.mdg.approvecrv2.util.Formatter.matDateFormat(response.results[i].CREATEDAT);
				}
				if (response.results[i].CHANGEDBY !== undefined && response.results[i].CHANGEDBY !== null && response.results[i].CHANGEDBY !== "") {
					uploadedby = response.results[i].CHANGEDBY__TXT;
				} else {
					uploadedby = response.results[i].CREATEDBY__TXT;
				}
				if (response.results[i].FILE_ID !== "") {
					link = this.buildLink(response.results[i], oS3Controller);
				}
				if (response.results[i].FILESIZE !== "") {
					var fileSize =fcg.mdg.approvecrv2.util.Formatter.convertBytesToHigherOrder(response.results[i].FILESIZE);
			     	uploadedby=uploadedby+"   "+fileSize;
				}
				var oAttach = {
					"mimeType": response.results[i].WSAPPLICATION,
					"contributor": uploadedby,
					"uploaded": AttachDate,
					"filename": response.results[i].DOCFILE,
					"url": link
				};
				mockData.dataitems.push(oAttach);
			}
			var mockDataModel = new sap.ui.model.json.JSONModel();
			mockDataModel.setData(mockData);
			this.oFileUpload.setModel(mockDataModel, "json");
		}
	},
	getsetDocData:function(docAssignmentOrgResults,oView)
	{

	var aTextData = {
			results: []
		};
	var vDocAssignmentOriginals = docAssignmentOrgResults.data.__batchResponses[0].data.DRADBASIC2ORIGINALSRel;
	var vDocAssignmentTextResults = docAssignmentOrgResults.data.__batchResponses[0].data.DRADBASIC2DRADTXTRel;
	this.oS3Controller=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
	
		// load the Attachment related data
		fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate.loadDocAttachments(vDocAssignmentOriginals,this.oS3Controller);
		// load the Document Assignment Text Data
		var vDocAssignmentTextTable = sap.ui.getCore().byId("MatDocAssignmentTextTable");
			for (var i = 0; i < vDocAssignmentTextResults.results.length; i++) {
				if(vDocAssignmentTextResults.results[i].TXTDRAD!=="")
				{
					aTextData.results.push(vDocAssignmentTextResults.results[i]);
				}
			}
		// do not show the Text table if there are no text data
		if (aTextData.results.length > 0){
		var oDocAssignmentTextModel = new sap.ui.model.json.JSONModel();
	
		//  Get the corresponding Text data for the particular Document Assignment 
		oDocAssignmentTextModel.setData(aTextData);
		this.aTextData=aTextData;
			vDocAssignmentTextTable.setModel(oDocAssignmentTextModel);
				var oDocAssignmentTextItemTemp = this.createDocAssignmentcreateTextTemplate(oDocAssignmentTextModel);
			oDocAssignmentTextItemTemp.attachPress({
				Entity: aTextData,
				name: 'matDocAssignmentTextDataDetail'
			}, oView.navtoSubDetail, oView);
		vDocAssignmentTextTable.bindItems('/results', oDocAssignmentTextItemTemp, '', '');

	 }// end if there are one or more texts
	 else{
	 	// destroy the Text table
			sap.ui.getCore().byId("MatDocAssignmentTextTable").destroy();
	 }	
	 //controller hook to bind data to extra forms/fiels/section: param: oview, result ; no return param defined in s3 controller
  this.oS3Controller.matHookModifyDocDetail(docAssignmentOrgResults,oView);
	},
	buildLink: function(response, oS3Controller) {
		// Build the url link needed to open the documents.
		var url = "";
		var oModel = oS3Controller.getView().getModel("MDG_MATERIAL");
		url = oModel.sServiceUrl;
		url = url + "/ORIGINALCONTENTCollection(DOCUMENTTYPE=";
		url = url + "'" + response.DOCUMENTTYPE + "',DOCUMENTNUMBER='" + response.DOCUMENTNUMBER + "',DOCUMENTPART='" + response.DOCUMENTPART +
			"',DOCUMENTVERSION='";
		url = url + response.DOCUMENTVERSION + "',APPLICATION_ID='" + response.APPLICATION_ID + "',FILE_ID='" + response.FILE_ID + "')/$value";
		return url;
	},
		createDocAssignmentcreateTextTemplate: function(omodel) { //create document assignment Text Template
		var otextTemp = new sap.m.ColumnListItem({

			type: "Navigation",
			cells: [
				new sap.m.Text({
				text: { //"{LANGUCODE__TXT} ({LANGUCODE})"
					path: "LANGUCODE",
						formatter: function() {
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, omodel, "LANGUCODE");
							var desc = omodel.getProperty("LANGUCODE__TXT", this.getBindingContext());
							var key = omodel.getProperty("LANGUCODE", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
				 }	
				}),
				new sap.m.Text({ //Column which identifies each record with Language code and Description
					text: {
						path: "TXTDRAD",
						formatter: function() {
							var desc = omodel.getProperty("TXTDRAD", this.getBindingContext());
							fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, omodel, "TXTDRAD");
							return fcg.mdg.approvecrv2.util.Formatter.Truncate(desc);
						}
					}
				})
			]
		});
			var extoItemTemp = this.oS3Controller.matHookcreateDocAssignmentcreateTextTemplate(otextTemp);
			if(extoItemTemp !== undefined){
				otextTemp = extoItemTemp;
		}
		return otextTemp;

	},
	getTextData:function()
	{
		return this.aTextData;

	}
	
	
};