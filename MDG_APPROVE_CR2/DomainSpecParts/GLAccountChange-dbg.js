/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccount");
 
//This method takes care of initializing tables, forming queries and displaying data for change scenarios of GL Account
fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange = {
	//Declaring global variables for this class
	oGLAccountGeneralTable: "",
	oGLAccountGeneralDescTable: "",
	oGLAccountChangeForm: "",
	oGLAccountCompCodeTable: "",
	oGLAccountCostElemTable: "",
	oGLAccountCostElemDescTable: "",
	oGLAccountIndTable: "",
	oGLAccountDescTable: "",
	aDetailData: "",
	nodata: "",
	oGlAttachment: "",
	oCCAttachment: "",
	oCEAttachment: "",
	vLinkPressed: "",
	oS3Controller: "",
	oItemTemp: "",
	oItemTemp2: "",
	oItemTemp3: "",
	sStyleClass: "",
	newValue: "",
	oldValue: "",
	newValueTxt: "",
	oldValueTxt: "",
	vAttachmentDataFlag:false,
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
	// Initializing tables and adding them to layouts 
	initialize_Tables: function(oS3Controller) {
		this.sStyleClass = "text_bold";
		this.oS3Controller = oS3Controller;
		//delete all UI contents if present for create layout
		//initialize general section table and load the fragment into appropriate layout
		if (sap.ui.getCore().byId("glGeneralDataLayout") !== "") {
			sap.ui.getCore().byId("glGeneralDataLayout").removeAllContent();
		}
		this.oGLAccountGeneralTable = "";
		this.oGLAccountGeneralTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
		sap.ui.getCore().byId("glGeneralDataLayout").addContent(
			this.oGLAccountGeneralTable);
		this.oGLAccountGeneralDescTable = "";
		this.oGLAccountGeneralDescTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);

		sap.ui.getCore().byId("glGeneralDataDescLayout").addContent(
			this.oGLAccountGeneralDescTable);
		this.oGLAccountGeneralDescTable.setGrowing(true);
		sap.ui.getCore().byId("glGeneralAttachment").removeAllContent();
		this.oGlAttachment = "";
		this.oGlAttachment = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
		sap.ui.getCore().byId("glGeneralAttachment").addContent(this.oGlAttachment);
		var aAttachColumns = this.oGlAttachment.getColumns();
		var oHeaderLabel = new sap.m.Label({
			text: this.i18n.getText("PC_DESCRIPTION")
		});
		aAttachColumns[0].setHeader(oHeaderLabel);
		var oAttachHeaderLabel = new sap.m.Label({
			text: this.i18n.getText("GL_TT_ACC_ATT")
		});
		aAttachColumns[0].setHeader(oAttachHeaderLabel);
		this.oGlAttachment.setGrowing(true);
		this.oGlAttachment.setHeaderText(this.i18n.getText("PC_TIT_ATTACH"));

		// Fetch the columns to set the header text for context
	},
	// To return CHANGE data and ACTUAL data to details screen(S4)
	getDetailData: function() {
		return this.aDetailData;
	},

	getGenQuery: function(sServiceUrl, sPath, s3Controller) {
		this.oS3Controller = s3Controller;
		var changeQuery =
			",ACCOUNT/ChangeData,ACCOUNT/ACCOUNT2DTxtACCOUNTRel/ChangeData,ACCOUNT/ACCOUNT2AtthACCOUNTRel/ChangeData";
		var sQuery = sPath + "?$expand=ACCOUNT/ACCOUNT2AtthACCOUNTRel,ACCOUNT/ACCOUNT2DTxtACCOUNTRel" +
			changeQuery;

		return sQuery;
	},

	
	getCCQuery: function(sServiceUrl, sPath, s3Controller) {
		this.oS3Controller = s3Controller;
		var changeQuery = ",ACCOUNT/ACCOUNT2ACCCCDETRel/ChangeData,ACCOUNT/ACCOUNT2ACCCCDETRel/ACCCCDET2AtthACCCCDETRel/ChangeData";
		var sQuery = sPath +
			"?$expand=ACCOUNT/ACCOUNT2ACCCCDETRel,ACCOUNT/ACCOUNT2ACCCCDETRel/ACCCCDET2AtthACCCCDETRel" +
			changeQuery;

		return sQuery;
	},

	getCEQuery: function(sServiceUrl, sPath, s3Controller) {
		this.oS3Controller = s3Controller;
		var changeQuery =
			",ACCOUNT/ACCOUNT2CELEMRel/ChangeData,ACCOUNT/ACCOUNT2CELEMRel/CELEM2DTxtCELEMRel/ChangeData,ACCOUNT/ACCOUNT2CELEMRel/CELEM2AtthCELEMRel/ChangeData";
		var sQuery = sPath +
			"?$expand=ACCOUNT/ACCOUNT2CELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2AtthCELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2DTxtCELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2ACCOUNTRel" +
			changeQuery;

		return sQuery;
	},

	displayGenChangeData: function(result, oView) {
		var aGenData = {
			results: []
		};

		var aGenDesc = {
			results: []
		};

		if (result.ACCOUNT.ChangeData !== undefined) {
			for (var i = 0; i < result.ACCOUNT.ChangeData.results.length; i++) {
				result.ACCOUNT.ChangeData.results[i].EntityDesc = result.ACCOUNT.TXTSH + " (" + result.ACCOUNT.COA + "/" + result.ACCOUNT.ACCOUNT + ")";
				// General Data
				var newValue = result.ACCOUNT.ChangeData.results[i].NewValue;
				var oldValue = result.ACCOUNT.ChangeData.results[i].OldValue;
				var newValueTxt = result.ACCOUNT.ChangeData.results[i].NewValueText;
				var oldValueTxt = result.ACCOUNT.ChangeData.results[i].OldValueText;
				result.ACCOUNT.ChangeData.results[i].NewValue = this.getValue(newValue, newValueTxt);
				result.ACCOUNT.ChangeData.results[i].OldValue = this.getValue(oldValue, oldValueTxt);
				aGenData.results.push(result.ACCOUNT.ChangeData.results[i]);
			}
		}

		if (result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel !== undefined) {

			for (i = 0; i < result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results.length; i++) {
				if (result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData !== undefined) {
					for (var j = 0; j < result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results.length; j++) {

						newValue = result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results[j].NewValue;
						oldValue = result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results[j].OldValue;
						newValueTxt = result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results[j].NewValueText;
						oldValueTxt = result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results[j].OldValueText;
						result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results[j].NewValue = this.getValue(newValue, newValueTxt);
						result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results[j].OldValue = this.getValue(oldValue, oldValueTxt);
						//	aGenData.results.push(result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results[j]);
						aGenDesc.results.push(result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results[j]);
					}
				}
			}
		}

		if (aGenData.results.length === 0) {
			//If no ChangeData is there then destroy the table
			sap.ui.getCore().byId("glGeneralDataLayout").removeAllContent();
		} else {
			var oGenDataModel = new sap.ui.model.json.JSONModel();
			oGenDataModel.setData(aGenData);
			this.oGLAccountGeneralTable.setModel(oGenDataModel);
			this.oItemTemp = this.changeTableTemplate();
			this.oItemTemp.attachPress({
				Entity: result,
				name: "glItemDetail"
			}, oView.navtoSubDetail, oView);
			this.oGLAccountGeneralTable.bindItems('/results', this.oItemTemp, '', '');
		}

		if (aGenDesc.results.length === 0) {
			//If no ChangeData is there then destroy the table
			sap.ui.getCore().byId("glGeneralDataDescLayout").removeAllContent();

		} else {
			var oGenDescModel = new sap.ui.model.json.JSONModel();
			oGenDescModel.setData(aGenDesc);
			this.oGLAccountGeneralDescTable.setModel(oGenDescModel);
			this.oItemTemp = this.changeTableTemplate();
			this.oItemTemp.attachPress({
				Entity: result,
				name: "glItemDetail"
			}, oView.navtoSubDetail, oView);
			this.oGLAccountGeneralDescTable.bindItems('/results', this.oItemTemp, '', '');
			this.oGLAccountGeneralDescTable.setHeaderText(this.i18n.getText("PC_DESC_COL_NAME"));
		}
	
		this.vAttachmentDataFlag = false;
		this.changeAccAttachmentTable(result, oView);
		if (aGenData.results.length === 0 && aGenDesc.results.length === 0 && this.vAttachmentDataFlag) {
			var noDatagen = new sap.m.Text("glNoGenData");
			noDatagen.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NodataCreate"));
			sap.ui.getCore().byId("glGeneralDataLayout").addContent(noDatagen);
		}
		

	},

	displayCCChangeData: function(result, oView) {

		//initialize Company Code section table and load the fragment into appropriate layout
		if (sap.ui.getCore().byId("glCCDataLayout") !== "") {
			sap.ui.getCore().byId("glCCDataLayout").removeAllContent();
		}
		this.oGLAccountCompCodeTable = "";
		this.oGLAccountCompCodeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
		sap.ui.getCore().byId("glCCDataLayout").addContent(
			this.oGLAccountCompCodeTable);
		this.oGLAccountCompCodeTable.setGrowing(true);

		sap.ui.getCore().byId("glCCAttachment").removeAllContent();
		this.oCCAttachment = "";
		this.oCCAttachment = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
		sap.ui.getCore().byId("glCCAttachment").addContent(this.oCCAttachment);
		var aAttachCCColumns = this.oCCAttachment.getColumns();
		var oHeaderCCLabel = new sap.m.Label({
			text: this.i18n.getText("PC_DESCRIPTION")
		});
		aAttachCCColumns[0].setHeader(oHeaderCCLabel);
		var oAttachCCHeaderLabel = new sap.m.Label({
			text: this.i18n.getText("ConDescr")
		});
		aAttachCCColumns[0].setHeader(oAttachCCHeaderLabel);
		this.oCCAttachment.setGrowing(true);
		this.oCCAttachment.setHeaderText(this.i18n.getText("PC_TIT_ATTACH"));

		var aCompCode = {
			results: []
		};

		//Company Code
		if (result.ACCOUNT.ACCOUNT2ACCCCDETRel !== undefined) {
			for (var i = 0; i < result.ACCOUNT.ACCOUNT2ACCCCDETRel.results.length; i++) {
				if (result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData !== undefined) {
					for (var j = 0; j < result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results.length; j++) {
						var newValue;
						if (result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].Attribute === "ACCICFREQ" &&
							result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].NewValue === "00") {
							newValue = "(" + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_DELETED") + ")";
						} else {
							newValue = result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].NewValue;
						}

						//var oldValue =   result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].OldValue;
						var oldValue = "";
						if (result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].Attribute === "ACCICFREQ" &&
							result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].OldValue === "00") {
							oldValue = "(" + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NOT_MAIN") + ")";
						} else {
							oldValue = result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].OldValue;
						}

						var newValueTxt = result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].NewValueText;
						var oldValueTxt = result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].OldValueText;
						result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].NewValue = this.getValue(newValue, newValueTxt);
						result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j].OldValue = this.getValue(oldValue, oldValueTxt);
						aCompCode.results.push(result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ChangeData.results[j]);

					}
				}
			}
		}

		if (aCompCode.results.length === 0) {
			//If no ChangeData is there then destroy the table
			sap.ui.getCore().byId("glCCDataLayout").removeAllContent();
		}
		
		 else {
			var oCompCodeModel = new sap.ui.model.json.JSONModel();
			oCompCodeModel.setData(aCompCode);
			this.oGLAccountCompCodeTable.setModel(oCompCodeModel);
			this.oItemTemp2 = this.changeTableTemplate();
			this.oItemTemp2.attachPress({
				Entity: aCompCode,
				name: "GLCompanyCode"
			}, oView.navtoSubDetail, oView);
			this.oGLAccountCompCodeTable.bindItems('/results', this.oItemTemp2, '');
		}
		
		//attachments for CC
        this.vAttachmentDataFlag = false;
		this.changeCCAttachmentTable(result, oView);
		
		if(aCompCode.results.length === 0 && this.vAttachmentDataFlag){
			var noDataCC = new sap.m.Text("glNoCCData");
			noDataCC.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NodataCreate"));
			sap.ui.getCore().byId("glCCDataLayout").addContent(noDataCC);
		}

	},

	displayCEChangeData: function(result, oView) {

	//initialize Cost Element section table and load the fragment into appropriate layout
		if (sap.ui.getCore().byId("glCEDataLayout") !== "") {
			sap.ui.getCore().byId("glCEDataLayout").removeAllContent();
		}
		this.oGLAccountCostElemTable = "";
		this.oGLAccountCostElemTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
		sap.ui.getCore().byId("glCEDataLayout").addContent(
			this.oGLAccountCostElemTable);
		this.oGLAccountCostElemTable.setGrowing(true);

		this.oGLAccountCostElemDescTable = "";
		this.oGLAccountCostElemDescTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
		sap.ui.getCore().byId("glCEDescDataLayout").addContent(
			this.oGLAccountCostElemDescTable);
		this.oGLAccountCostElemTable.setGrowing(true);

		sap.ui.getCore().byId("glCEAttachment").removeAllContent();
		this.oCEAttachment = "";
		this.oCEAttachment = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
		sap.ui.getCore().byId("glCEAttachment").addContent(this.oCEAttachment);
		var aAttachCEColumns = this.oCEAttachment.getColumns();
		var oHeaderCELabel = new sap.m.Label({
			text: this.i18n.getText("PC_DESCRIPTION")
		});
		aAttachCEColumns[0].setHeader(oHeaderCELabel);
		var oAttachCEHeaderLabel = new sap.m.Label({
			text: this.i18n.getText("ConDescr")
		});
		aAttachCEColumns[0].setHeader(oAttachCEHeaderLabel);
		this.oCEAttachment.setGrowing(true);
		this.oCEAttachment.setHeaderText(this.i18n.getText("PC_TIT_ATTACH"));

		var aCelem = {
			results: []
		};

		var aCelemDesc = {
			results: []
		};

		//Cost Element
		if (result.ACCOUNT.ACCOUNT2CELEMRel !== undefined) {
			for (var i = 0; i < result.ACCOUNT.ACCOUNT2CELEMRel.results.length; i++) {
				if (result.ACCOUNT.ACCOUNT2CELEMRel.results[i].ChangeData !== undefined) {
					for (var j = 0; j < result.ACCOUNT.ACCOUNT2CELEMRel.results[i].ChangeData.results.length; j++) {
						var newValue = result.ACCOUNT.ACCOUNT2CELEMRel.results[i].ChangeData.results[j].NewValue;
						var oldValue = result.ACCOUNT.ACCOUNT2CELEMRel.results[i].ChangeData.results[j].OldValue;
						var newValueTxt = result.ACCOUNT.ACCOUNT2CELEMRel.results[i].ChangeData.results[j].NewValueText;
						var oldValueTxt = result.ACCOUNT.ACCOUNT2CELEMRel.results[i].ChangeData.results[j].OldValueText;
						result.ACCOUNT.ACCOUNT2CELEMRel.results[i].ChangeData.results[j].NewValue = this.getValue(newValue, newValueTxt);
						result.ACCOUNT.ACCOUNT2CELEMRel.results[i].ChangeData.results[j].OldValue = this.getValue(oldValue, oldValueTxt);
						aCelem.results.push(result.ACCOUNT.ACCOUNT2CELEMRel.results[i].ChangeData.results[j]);
					}
				}
			}
		}
	
    //for text description for CELEM
		if (result.ACCOUNT.ACCOUNT2CELEMRel !== undefined) {
			for (i = 0; i < result.ACCOUNT.ACCOUNT2CELEMRel.results.length; i++) {
				if (result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel !== undefined) {
					for (j = 0; j < result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel.results.length; j++) {
						if (result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel.results[j].ChangeData !== undefined) {
							for (var k = 0; k < result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel.results[j].ChangeData.results.length; k++) {

                                newValue =   result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel.results[j].ChangeData.results[k].NewValue;
			    		        oldValue =   result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel.results[j].ChangeData.results[k].OldValue;
				    	        newValueTxt = result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel.results[j].ChangeData.results[k].NewValueText;
				    	        oldValueTxt =  result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel.results[j].ChangeData.results[k].OldValueText;
			                    result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel.results[j].ChangeData.results[k].NewValue = this.getValue(newValue,newValueTxt);
					            result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel.results[j].ChangeData.results[k].OldValue = this.getValue(oldValue,oldValueTxt);
				    	     	aCelemDesc.results.push(result.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2DTxtCELEMRel.results[j].ChangeData.results[k]);

								}
							}
						}
					}
				}
			}

		if (aCelem.results.length === 0) {
			//If no ChangeData is there then destroy the table
			sap.ui.getCore().byId("glCEDataLayout").removeAllContent();
		} else {
			var oCostElemModel = new sap.ui.model.json.JSONModel();
			oCostElemModel.setData(aCelem);
			this.oGLAccountCostElemTable.setModel(oCostElemModel);
			this.oItemTemp3 = this.changeTableTemplate();
			this.oItemTemp3.attachPress({
				Entity: aCelem,
				name: "GLCostEl"
			}, oView.navtoSubDetail, oView);
			this.oGLAccountCostElemTable.bindItems('/results', this.oItemTemp3, '');
		}

		if (aCelemDesc.results.length === 0) {
			//If no ChangeData is there then destroy the table
			sap.ui.getCore().byId("glCEDescDataLayout").removeAllContent();
		} else {
			var oCostElemDescModel = new sap.ui.model.json.JSONModel();
			oCostElemDescModel.setData(aCelemDesc);
			this.oGLAccountCostElemDescTable.setModel(oCostElemDescModel);
			this.oItemTemp3 = this.getCEDescTableTemplate(oCostElemDescModel);
			this.oItemTemp3.attachPress({
				Entity: aCelemDesc,
				name: "GLCostEl"
			}, oView.navtoSubDetail, oView);
			this.oGLAccountCostElemDescTable.bindItems('/results', this.oItemTemp3, '');
			this.oGLAccountCostElemDescTable.setHeaderText(this.i18n.getText("PC_DESC_COL_NAME"));
		}
		
		//for attachments for CELEM
		this.vAttachmentDataFlag = false;
		this.changeCEAttachmentTable(result, oView);
		
		if (aCelem.results.length === 0 && aCelemDesc.results.length === 0 && this.vAttachmentDataFlag) {
			var noDataCE = new sap.m.Text("glNoCEData");
			noDataCE.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NodataCreate"));
			sap.ui.getCore().byId("glCEDataLayout").addContent(noDataCE);
		}
	},

	//Get Values
	getValue: function(Value, Value_Txt) {
		var finalValue = "";
		if (Value !== "" && Value_Txt !== "") {
			if (Value === "X" && Value_Txt === sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES")) {
				finalValue = Value_Txt;
			} else {
				finalValue = Value_Txt + "(" + Value + ")";
			}

		}
		if (Value === "" && Value_Txt !== "") {
			finalValue = Value_Txt;
		}
		if (Value !== "" && Value_Txt === "") {
			finalValue = Value;
		}
		if (Value === "X" && Value_Txt === "") {
			finalValue = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
		}
		return finalValue;
	},

	changeTableTemplate: function() {
		var oItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				      new sap.m.Text({
					text: "{Context}"
				}).addStyleClass("text_bold"),
				          new sap.m.ObjectIdentifier({
					text: {
						path: "AttributeDesc"
					},
					title: {
						path: "NewValue"
					}
				}),
				         new sap.m.Text({
					text: {
						path: "OldValue"
					}
				})]
		});
		var extoItemTemp = this.oS3Controller.glHookchangeTableTemplate(oItemTemp);
		if(extoItemTemp !== undefined){
			oItemTemp = extoItemTemp;
	}

		return oItemTemp;
	},

	setBoldGenData: function(aResult) {
		//if the data has been changed for a field, set the text of the field and the label to bold
		//Bolding for General data
		for (var i = 0; i < aResult.ACCOUNT.ChangeData.results.length; i++) {
			var sLabelName = "LBL_" + aResult.ACCOUNT.ChangeData.results[i].Attribute;
			if (aResult.ACCOUNT.ChangeData.results[i].Attribute === "TXTSH") {
				//special handling for Account Name and Number combination
				sLabelName = "LBL_ACCOUNT";
			}
			var oLblIns = sap.ui.getCore().byId(sLabelName);
			if (oLblIns !== undefined) {
				oLblIns.setDesign("Bold");
			}
			var sTextName = "TXT_" + aResult.ACCOUNT.ChangeData.results[i].Attribute;
			if (aResult.ACCOUNT.ChangeData.results[i].Attribute === "TXTSH") {
				//special handling for Account Name and Number combination
				sTextName = "TXT_ACCOUNT";
			}
			if (sap.ui.getCore().byId(sTextName) !== undefined) {
				sap.ui.getCore().byId(sTextName).addStyleClass(this.sStyleClass);
			}
		}

	},

	setBoldCCData: function(aResult) {
		//Bolding for Company code data
		for (var j = 0; j < aResult.ChangeData.results.length; j++) {
			var sLabelName = "LBL_" + aResult.ChangeData.results[j].Attribute;
			var oLblIns = sap.ui.getCore().byId(sLabelName);
			if (oLblIns !== undefined) {
				oLblIns.setDesign("Bold");
			}
			var sTextName = "TXT_" + aResult.ChangeData.results[j].Attribute;
			if (sap.ui.getCore().byId(sTextName) !== undefined) {
				sap.ui.getCore().byId(sTextName).addStyleClass(this.sStyleClass);
			}
		}
	},

	setBoldCEData: function(aResult) {
		//Bolding for Cost Element data
		for (var j = 0; j < aResult.ChangeData.results.length; j++) {
			if(aResult.ChangeData.results[j].Attribute === 'TXTSH')
			var sLabelName = "LBL_CELEM";
			else
			var sLabelName = "LBL_" + aResult.ChangeData.results[j].Attribute;
			var oLblIns = sap.ui.getCore().byId(sLabelName);
			if (oLblIns !== undefined) {
				oLblIns.setDesign("Bold");
			}
			if(aResult.ChangeData.results[j].Attribute === 'TXTSH')
			var sTextName = "TXT_CELEM";
			else
			var sTextName = "TXT_" + aResult.ChangeData.results[j].Attribute;
			if (sap.ui.getCore().byId(sTextName) !== undefined) {
				sap.ui.getCore().byId(sTextName).addStyleClass(this.sStyleClass);
			}
		}
	},

	changeAccAttachmentTable: function(aResult, oView) {
		//Add navigation handler for list item of the attachment table
		var vOldValue = "";
		var vNewValue = "";
		var vAttrDesc = "";
		var oOldValue = "";
		var oNewValue = "";
		var oListItem = "";
		this.oGlAttachment.attachItemPress({
			Entity: aResult,
			name: 'glItemDetail'
		}, oView.navtoSubDetail, oView);
		for (var i = 0; i < aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results.length; i++) {
			for (var j = 0; j < aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results.length; j++) {
				var oGlobal = this;
				var vLink = "";
				if(aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].EntityAction !== 'D'){
				if (aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_LINK !== "") {
					vLink = aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_LINK;
				} else {
					vLink = aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].__metadata.media_src;
				}
				}
				var oAttach = new sap.m.Link({
					text: aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_TITLE,
					target: "_blank",
					href: vLink,
					wrapping: true,
					subtle: false,
					emphasized: false,
					press: function() {
						oGlobal.setLinkPress('X');
					}
				}).addStyleClass("padding_bottom"); //add style class to get space in the bottom

				var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_ACREATED_AT) +
					" " + this.i18n.getText('AttachBy') + " ";
				var vContributor = " " + aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_ACREATED_BY__TXT + "(" + aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_ACREATED_BY + ")" ;
				var oContributor = new sap.m.Text({
					text: vForamtdate + " " + vContributor
				}); //concatenate the date created at and the contributor name

				//Create a vertical box in which Link and Contributor text is added
				var vl = new sap.ui.layout.VerticalLayout({
					content: [oAttach, oContributor]
				}).addStyleClass("padding_left"); //added style class to get space on the left hand side

				var vIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_FILE_TYPE); //formatter class to get the icon type based on file type
				//Create an icon for the file with the size 3.0 so that it covers the Vertical box on the right hand side
				var oIcon = new sap.ui.core.Icon({
					src: vIcon,
					size: "3.0em"
				});

				//Create a horizontal box and insert icon and vertical box side by side
				var h1 = new sap.m.HBox({
					items: [oIcon, vl]
				});

				//If a new attachment has been added, then new value is shown as "Added"
				if (aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].EntityAction === 'C') {
					oNewValue = new sap.m.ObjectIdentifier({
						text: " ",
						title: this.i18n.getText("PC_ADDED")
					});

					oOldValue = new sap.m.Text({
						text: ""
					});
					oListItem = new sap.m.ColumnListItem({ //create an item for the table
						type: "Navigation",
						mergeDuplicates: true,
						cells: [h1,
							        oNewValue,
							        oOldValue
							        ]
					});

					this.oGlAttachment.addItem(oListItem); //Add the list item to the table
					//break;
				}
				
				//If an attachment has been deleted, then new value is shown as "Deleted"
				else if (aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].EntityAction === 'D') {
					oNewValue = new sap.m.ObjectIdentifier({
						text: " ",
						title: this.i18n.getText("PC_DELETED")
					});

					oOldValue = new sap.m.Text({
						text: ""
					});
					oListItem = new sap.m.ColumnListItem({ //create an item for the table
						type: "Navigation",
						mergeDuplicates: true,
						cells: [h1,
							        oNewValue,
							        oOldValue
							        ]
					});

					this.oGlAttachment.addItem(oListItem); //Add the list item to the table
					//break;
				}
				
				else {
					//Check if comment or language of the attachment has been changed
					if (aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].Attribute === 'USMD_EXPLANATION' ||
						aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].Attribute === 'USMD_LANGUAGE') {

						if (aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].OldValue === "") {
							vOldValue = "(" + this.i18n.getText("PC_NOT_MAIN") + ")"; //Old value as "Not maintained" in case of the earlier value was empty for this field
						} else {
							vOldValue = aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].OldValue;
						}
						if (aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].NewValue === "" && aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel
							.results[i].ChangeData.results[j].OldValue !== "") {
							vNewValue = this.i18n.getText("PC_DELETED"); //Display New value as "Deleted" in case no value is contained now for thsi field
						} else if (aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].NewValue !== "") {
							vNewValue = aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].NewValue;
						}

						if (aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].Attribute === 'USMD_EXPLANATION') {
							vAttrDesc = this.i18n.getText("ATTACH_COMMENT"); //Get the attribute name for comment
						} else {
							vAttrDesc = this.i18n.getText("Language"); //Get the attribute name for Language
						}
						oNewValue = new sap.m.ObjectIdentifier({
							text: vAttrDesc,
							title: vNewValue
						});
						oOldValue = new sap.m.Text({
							text: vOldValue
						});

						oListItem = new sap.m.ColumnListItem({ //create a an item for the table
							type: "Navigation",
							mergeDuplicates: true,
							cells: [h1,
								        oNewValue,
								        oOldValue
								        ]
						});

						this.oGlAttachment.addItem(oListItem); //Add the list item to the table
						
					}
				}
			}
		}

		if (this.oGlAttachment.getItems().length === 0) {
			this.vAttachmentDataFlag = true;
			//Remove the table if no data has been changed in attachment section
			sap.ui.getCore().byId("glGeneralAttachment").removeAllContent();
			sap.ui.getCore().byId("glGeneralAttachment").destroy();
		}

	},

	changeCCAttachmentTable: function(aResult, oView) {
	//Add navigation handler for list item of the attachment table
		var vOldValue = "";
		var vNewValue = "";
		var vAttrDesc = "";
		var oOldValue = "";
		var oNewValue = "";
		var oListItem = "";
		this.oCCAttachment.attachItemPress({
			Entity: aResult,
			name: "GLCompanyCodeAttach"
		}, oView.navtoSubDetail, oView);

		for (var i = 0; i < aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results.length; i++) {
			for (var j = 0; j < aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results.length; j++) {
				for (var k = 0; k < aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results.length; k++) {
					var oGlobal = this;
					var vLink = "";
					if(aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].EntityAction !== 'D'){
					if (aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].USMD_LINK !== "") {
						vLink = aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].USMD_LINK;
					} else {
						vLink = aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].__metadata.media_src;
					}
					}
					var oAttach = new sap.m.Link({
						text: aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].USMD_TITLE,
						target: "_blank",
						href: vLink,
						wrapping: true,
						subtle: false,
						emphasized: false,
						press: function() {
							oGlobal.setLinkPress('X');
						}
					}).addStyleClass("padding_bottom"); //add style class to get space in the bottom

					var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel
						.results[j].USMD_ACREATED_AT) + " " + this.i18n.getText('AttachBy') + " ";
					var vContributor = " " + aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].USMD_ACREATED_BY__TXT + "(" + aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].USMD_ACREATED_BY + ")";
					var oContributor = new sap.m.Text({
						text: vForamtdate + " " + vContributor
					}); //concatenate the date created at and the contributor name
				
					var vTitle =aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].COMPCODE__TXT+ " (" + aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].COMPCODE + ")";
					var vObjIdentifier = new sap.m.ObjectIdentifier({
						text : this.i18n.getText("CC_CCODE"),
						title : vTitle
					}).addStyleClass("objIdentifier_margin").addStyleClass("objectIdentifier_text");
					//Create a vertical box in which Link and Contributor text is added
					var vl = new sap.ui.layout.VerticalLayout({
						content: [oAttach, oContributor,vObjIdentifier]
					}).addStyleClass("padding_left"); //added style class to get space on the left hand side

					var vIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel
						.results[j].USMD_FILE_TYPE); //formatter class to get the icon type based on file type
					//Create an icon for the file with the size 3.0 so that it covers the Vertical box on the right hand side
					var oIcon = new sap.ui.core.Icon({
						src: vIcon,
						size: "3.0em"
					});

					//Create a horizontal box and insert icon and vertical box side by side
					var h1 = new sap.m.HBox({
						items: [oIcon, vl]
					});

					//If a new attachment has been added, then new value is shown as "Added"
					if (aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].EntityAction === 'C') {
						oNewValue = new sap.m.ObjectIdentifier({
							text: " ",
							title: this.i18n.getText("PC_ADDED")
						});

						oOldValue = new sap.m.Text({
							text: ""
						});
						oListItem = new sap.m.ColumnListItem({ //create an item for the table
						id : "idattachment_" + i+"_"+j,
							type: "Navigation",
							mergeDuplicates: true,
							cells: [h1,
							        oNewValue,
							        oOldValue
							        ]
						});

						this.oCCAttachment.addItem(oListItem); //Add the list item to the table
						//break;
					}
					
					//If an attachment has been deleted, then it is shown as "Deleted"
					else if (aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].EntityAction === 'D') {
						oNewValue = new sap.m.ObjectIdentifier({
							text: " ",
							title: this.i18n.getText("PC_DELETED")
						});

						oOldValue = new sap.m.Text({
							text: ""
						});
						oListItem = new sap.m.ColumnListItem({ //create an item for the table
						id : "idattachment_" + i+"_"+j,
							type: "Navigation",
							mergeDuplicates: true,
							cells: [h1,
							        oNewValue,
							        oOldValue
							        ]
						});

						this.oCCAttachment.addItem(oListItem); //Add the list item to the table
						//break;
					}
					
					else {
						//Check if comment or language of the attachment has been changed
						if (aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].Attribute ===
							'USMD_EXPLANATION' ||
							aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].Attribute ===
							'USMD_LANGUAGE') {

							if (aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].OldValue === "") {
								vOldValue = "(" + this.i18n.getText("PC_NOT_MAIN") + ")"; //Old value as "Not maintained" in case of the earlier value was empty for this field
							} else {
								vOldValue = aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].OldValue;
							}
							if (aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].NewValue === "" &&
								aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].OldValue !== "") {
								vNewValue = this.i18n.getText("PC_DELETED"); //Display New value as "Deleted" in case no value is contained now for thsi field
							} else if (aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].NewValue !== "") {
								vNewValue = aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].NewValue;
							}
							if (aResult.ACCOUNT.ACCOUNT2ACCCCDETRel.results[i].ACCCCDET2AtthACCCCDETRel.results[j].ChangeData.results[k].Attribute ===
								'USMD_EXPLANATION') {
								vAttrDesc = this.i18n.getText("ATTACH_COMMENT"); //Get the attribute name for comment
							} else {
								vAttrDesc = this.i18n.getText("Language"); //Get the attribute name for Language
							}
							oNewValue = new sap.m.ObjectIdentifier({
								text: vAttrDesc,
								title: vNewValue
							});
							oOldValue = new sap.m.Text({
								text: vOldValue
							});

							oListItem = new sap.m.ColumnListItem({ //create a an item for the table
							id : "idattachment_" + i+"_"+j,
								type: "Navigation",
								mergeDuplicates: true,
								cells: [h1,
								        oNewValue,
								        oOldValue
								        ]
							});

							this.oCCAttachment.addItem(oListItem); //Add the list item to the table
						}

					}
				}
			}
		}

		if (this.oCCAttachment.getItems().length === 0) { //Remove the table if no data has been changed in attachment section
		    this.vAttachmentDataFlag = true;
			sap.ui.getCore().byId("glCCAttachment").removeAllContent();
			sap.ui.getCore().byId("glCCAttachment").destroy();
		}

	},

	changeCEAttachmentTable: function(aResult, oView) {
			//Add navigation handler for list item of the attachment table
		var vOldValue = "";
		var vNewValue = "";
		var vAttrDesc = "";
		var oOldValue = "";
		var oNewValue = "";
		var oListItem = "";
		var aCEAttachModel = {
			results: []
		};
	this.oCEAttachment.attachItemPress({
			Entity: aResult,
			name: 'GLCostElAttach'
		}, oView.navtoSubDetail, oView);
		for (var i = 0; i < aResult.ACCOUNT.ACCOUNT2CELEMRel.results.length; i++) {
			for (var j = 0; j < aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results.length; j++) {
				for (var k = 0; k < aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results.length; k++) {
					var oGlobal = this;
					var vLink = "";
					if(aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].EntityAction !== 'D'){
					if (aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].USMD_LINK !== "") {
						vLink = aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].USMD_LINK;
					} else {
						vLink = aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].__metadata.media_src;
					}
					}
					var oAttach = new sap.m.Link({
						text: aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].USMD_TITLE,
						target: "_blank",
						href: vLink,
						wrapping: true,
						subtle: false,
						emphasized: false,
						press: function() {
							oGlobal.setLinkPress('X');
						}
					}).addStyleClass("padding_bottom"); //add style class to get space in the bottom

					var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[
						j].USMD_ACREATED_AT) + " " + this.i18n.getText('AttachBy') + " ";
					var vContributor = " " + aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].USMD_ACREATED_BY__TXT + "(" + aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].USMD_ACREATED_BY + ")" ;
					var oContributor = new sap.m.Text({
						text: vForamtdate + " " + vContributor
					}); //concatenate the date created at and the contributor name
					var vTitle =aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM__TXT+ " (" + aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].COAREA + "/"+fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM) + ")";
					var vObjIdentifier = new sap.m.ObjectIdentifier({
						text : this.i18n.getText("CostElem"),
						title : vTitle
					}).addStyleClass("objIdentifier_margin").addStyleClass("objectIdentifier_text");
					//Create a vertical box in which Link and Contributor text is added
					var vl = new sap.ui.layout.VerticalLayout({
						content: [oAttach, oContributor,vObjIdentifier]
					}).addStyleClass("padding_left"); //added style class to get space on the left hand side

					var vIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[
						j].USMD_FILE_TYPE); //formatter class to get the icon type based on file type
					//Create an icon for the file with the size 3.0 so that it covers the Vertical box on the right hand side
					var oIcon = new sap.ui.core.Icon({
						src: vIcon,
						size: "3.0em"
					});

					//Create a horizontal box and insert icon and vertical box side by side
					var h1 = new sap.m.HBox({
						items: [oIcon, vl]
					});

					//If a new attachment has been added, then new value is shown as "Added"
					if (aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].EntityAction === 'C') {
						oNewValue = new sap.m.ObjectIdentifier({
							text: " ",
							title: this.i18n.getText("PC_ADDED")
						});

						oOldValue = new sap.m.Text({
							text: ""
						});
						oListItem = new sap.m.ColumnListItem({ //create an item for the table
						id : "idattachments_" + i+"_"+j,
							type: "Navigation",
							mergeDuplicates: true,
							cells: [h1,
							        oNewValue,
							        oOldValue
							        ]
						});

						this.oCEAttachment.addItem(oListItem); //Add the list item to the table
						 aCEAttachModel.results.push(aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k]);
						//break;
					}
					
					//If an attachment has been deleted, then it is shown as "Deleted"
					else if (aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].EntityAction === 'D') {
						oNewValue = new sap.m.ObjectIdentifier({
							text: " ",
							title: this.i18n.getText("PC_DELETED")
						});

						oOldValue = new sap.m.Text({
							text: ""
						});
						oListItem = new sap.m.ColumnListItem({ //create an item for the table
						id : "idattachments_" + i+"_"+j,
							type: "Navigation",
							mergeDuplicates: true,
							cells: [h1,
							        oNewValue,
							        oOldValue
							        ]
						});

						this.oCEAttachment.addItem(oListItem); //Add the list item to the table
						 aCEAttachModel.results.push(aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k]);
						//break;
					}
					
					else {
						//Check if comment or language of the attachment has been changed
						if (aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].Attribute === 'USMD_EXPLANATION' ||
							aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].Attribute === 'USMD_LANGUAGE') {

							if (aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].OldValue === "") {
								vOldValue = "(" + this.i18n.getText("PC_NOT_MAIN") + ")"; //Old value as "Not maintained" in case of the earlier value was empty for this field
							} else {
								vOldValue = aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].OldValue;
							}
							if (aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].NewValue === "" && aResult.ACCOUNT
								.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].OldValue !== "") {
								vNewValue = this.i18n.getText("PC_DELETED"); //Display New value as "Deleted" in case no value is contained now for thsi field
							} else if (aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].NewValue !== "") {
								vNewValue = aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].NewValue;
							}

							if (aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k].Attribute === 'USMD_EXPLANATION') {
								vAttrDesc = this.i18n.getText("ATTACH_COMMENT"); //Get the attribute name for comment
							} else {
								vAttrDesc = this.i18n.getText("Language"); //Get the attribute name for Language
							}
							oNewValue = new sap.m.ObjectIdentifier({
								text: vAttrDesc,
								title: vNewValue
							});
							oOldValue = new sap.m.Text({
								text: vOldValue
							});

							oListItem = new sap.m.ColumnListItem({ //create a an item for the table
							id : "idattachments_" + i+"_"+j,
								type: "Navigation",
								mergeDuplicates: true,
								cells: [h1,
								        oNewValue,
								        oOldValue
								        ]
							});
							
                            aCEAttachModel.results.push(aResult.ACCOUNT.ACCOUNT2CELEMRel.results[i].CELEM2AtthCELEMRel.results[j].ChangeData.results[k]);
					this.oCEAttachment.addItem(oListItem);
						}

					}
				}
			}
		}
		if (this.oCEAttachment.getItems().length === 0) { //Remove the table if no data has been changed in attachment section
			this.vAttachmentDataFlag = true;
			sap.ui.getCore().byId("glCEAttachment").removeAllContent();
			sap.ui.getCore().byId("glCEAttachment").destroy();
		}
		// else{
		//     this.oCEAttachment.setModel(aCEAttachModel);
  //      			oListItem.attachPress({
  //      			Entity: aCEAttachModel,
  //      			name: "GLCostEl"
  //      		}, oView.navtoSubDetail, oView);
		// 					this.oCEAttachment.bindItems('/results', oListItem, '', '');
		// }
	
	},

	getChangeGenAttachmentList: function(aResult) {
		var oAttachList = sap.ui.getCore().byId("glAttachFileList");
		var oCustomListItem = new sap.m.CustomListItem({});
		var oContributor = "";
		var vLinkemphasized = "";

		for (var i = 0; i < aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results.length; i++) {
			var vLink = "";
			if (aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_LINK !== "")
				vLink = aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_LINK;
			else
				vLink = aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].__metadata.media_src;

			var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_ACREATED_AT) +
				" " + this.i18n.getText('AttachBy') + " ";
			var vContributor = " " + aResult.ACCOUNT.USMD_ENT_CHNG__TXT;
			var vContri = "";
			for (var j = 0; j < aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results.length; j++) {
				vContri = vForamtdate + " " + vContributor;
				break;
			}

			if (vContri !== "") {
				oContributor = new sap.m.Text({
					text: vForamtdate + " " + vContributor
				}).addStyleClass("text_bold"); //concatenate the date created at and the contributor name and set it to bold
				vLinkemphasized = true; //Emphasize the link if attachment has been changed
			} else {
				oContributor = new sap.m.Text({
					text: vForamtdate + " " + vContributor
				});
				vLinkemphasized = false;
			}

			var oAttach = new sap.m.Link({
				text: aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_TITLE,
				target: "_blank",
				href: vLink,
				wrapping: true,
				subtle: false,
				emphasized: vLinkemphasized
			}).addStyleClass("padding_bottom"); //add style class to get space in the bottom

			//Create a vertical box in which Link and Contributor text is added
			var vl = new sap.m.VBox({
				items: [oAttach, oContributor]
			}).addStyleClass("padding_left"); //added style class to get space on the left hand side

			var vIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_FILE_TYPE); //formatter class to get the icon type based on file type
			//Create an icon for the file with the size 3.0 so that it covers the Vertical box on the right hand side
			var oIcon = new sap.ui.core.Icon({
				src: vIcon,
				size: "3.0em"
			});

			//Create a horizontal box and insert icon and vertical box side by side
			var h1 = new sap.m.HBox({
				items: [oIcon, vl]
			}).addStyleClass("Hbox_padding"); //Spacing around the Box is required in custom list item since it creates a flex item

			oCustomListItem.addContent(h1); //add the Hbox into the list item
			oAttachList.addItem(oCustomListItem); //add the list item into the list
		}
	},

	getChangeCEAttachmentList: function(oCEAttach) {

		var oAttachList = sap.ui.getCore().byId("glCostElAttach");
		var oCustomListItem = new sap.m.CustomListItem({});
		var oContributor = "";
		var vLinkemphasized = "";

		for (var i = 0; i < oCEAttach.results.length; i++) {
			var vLink = "";
			if (oCEAttach.results[i].USMD_LINK !== "")
				vLink = oCEAttach.results[i].USMD_LINK;
			else
				vLink = oCEAttach.results[i].__metadata.media_src;

			var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(oCEAttach.results[i].USMD_ACREATED_AT) + " " + this.i18n.getText(
				'AttachBy') + " ";
			var vContributor = " " +  fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oCEData.ACCOUNT.USMD_ENT_CRTD_BY__TXT;
			var vContri = "";
			for (var j = 0; j < oCEAttach.results[i].ChangeData.results.length; j++) {
				vContri = vForamtdate + " " + vContributor;
				break;
			}

			if (vContri !== "") {
				oContributor = new sap.m.Text({
					text: vForamtdate + " " + vContributor
				}).addStyleClass("text_bold"); //concatenate the date created at and the contributor name and set it to bold
				vLinkemphasized = true; //Emphasize the link if attachment has been changed
			} else {
				oContributor = new sap.m.Text({
					text: vForamtdate + " " + vContributor
				});
				vLinkemphasized = false;
			}

			var oAttach = new sap.m.Link({
				text: oCEAttach.results[i].USMD_TITLE,
				target: "_blank",
				href: vLink,
				wrapping: true,
				subtle: false,
				emphasized: vLinkemphasized
			}).addStyleClass("padding_bottom"); //add style class to get space in the bottom

			//Create a vertical box in which Link and Contributor text is added
			var vl = new sap.m.VBox({
				items: [oAttach, oContributor]
			}).addStyleClass("padding_left"); //added style class to get space on the left hand side

			var vIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(oCEAttach.results[i].USMD_FILE_TYPE); //formatter class to get the icon type based on file type
			//Create an icon for the file with the size 3.0 so that it covers the Vertical box on the right hand side
			var oIcon = new sap.ui.core.Icon({
				src: vIcon,
				size: "3.0em"
			});

			//Create a horizontal box and insert icon and vertical box side by side
			var h1 = new sap.m.HBox({
				items: [oIcon, vl]
			}).addStyleClass("Hbox_padding"); //Spacing around the Box is required in custom list item since it creates a flex item

			oCustomListItem.addContent(h1); //add the Hbox into the list item
			oAttachList.addItem(oCustomListItem); //add the list item into the list
		}
	},

	getChangeCCAttachmentList: function(oCCAttach) {
		var oAttachList = sap.ui.getCore().byId("glCCAttach");
		var oCustomListItem = new sap.m.CustomListItem({});
		var oContributor = "";
		var vLinkemphasized = "";

		for (var i = 0; i < oCCAttach.results.length; i++) {
			var vLink = "";
			if (oCCAttach.results[i].USMD_LINK !== "")
				vLink = oCCAttach.results[i].USMD_LINK;
			else
				vLink = oCCAttach.results[i].__metadata.media_src;

			var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(oCCAttach.results[i].USMD_ACREATED_AT) + " " + this.i18n.getText(
				'AttachBy') + " ";
			var vContributor = " " + fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oCCData.ACCOUNT.USMD_ENT_CRTD_BY__TXT;
			var vContri = "";
			for (var j = 0; j < oCCAttach.results[i].ChangeData.results.length; j++) {
				vContri = vForamtdate + " " + vContributor;
				break;
			}

			if (vContri !== "") {
				oContributor = new sap.m.Text({
					text: vForamtdate + " " + vContributor
				}).addStyleClass("text_bold"); //concatenate the date created at and the contributor name and set it to bold
				vLinkemphasized = true; //Emphasize the link if attachment has been changed
			} else {
				oContributor = new sap.m.Text({
					text: vForamtdate + " " + vContributor
				});
				vLinkemphasized = false;
			}

			var oAttach = new sap.m.Link({
				text: oCCAttach.results[i].USMD_TITLE,
				target: "_blank",
				href: vLink,
				wrapping: true,
				subtle: false,
				emphasized: vLinkemphasized
			}).addStyleClass("padding_bottom"); //add style class to get space in the bottom

			//Create a vertical box in which Link and Contributor text is added
			var vl = new sap.m.VBox({
				items: [oAttach, oContributor]
			}).addStyleClass("padding_left"); //added style class to get space on the left hand side

			var vIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(oCCAttach.results[i].USMD_FILE_TYPE); //formatter class to get the icon type based on file type
			//Create an icon for the file with the size 3.0 so that it covers the Vertical box on the right hand side
			var oIcon = new sap.ui.core.Icon({
				src: vIcon,
				size: "3.0em"
			});

			//Create a horizontal box and insert icon and vertical box side by side
			var h1 = new sap.m.HBox({
				items: [oIcon, vl]
			}).addStyleClass("Hbox_padding"); //Spacing around the Box is required in custom list item since it creates a flex item

			oCustomListItem.addContent(h1); //add the Hbox into the list item
			oAttachList.addItem(oCustomListItem); //add the list item into the list
		}
	},

	getCEDescTableTemplate: function(oModel) {
		var oItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
			        new sap.m.VBox({
					items: [
                                                                                                                                                                                                new sap
						.m.ObjectIdentifier({
							text: {
								path: "Context",
								formatter: function() {
									var ctx = this.getBindingContext();
									var vContext = oModel.getProperty("Context", ctx);
									if (vContext !== undefined && vContext
										.indexOf(";") > -1) {
										var vContextArray = vContext
											.split(";");
										var vCEArray = vContextArray[0].split(":");

										return vCEArray[1];
									} else {
										if (vContext !== undefined && vContext.indexOf(":") > -1) {
											var vContextArray = vContext.split(":");
											return vContextArray[1];
										}
									}
								}
							},
							title: {
								path: "Context",
								formatter: function() {
									var ctx = this.getBindingContext();
									var vContext = oModel.getProperty("Context", ctx);
									if (vContext !== undefined && vContext
										.indexOf(";") > -1) {
										var vContextArray = vContext
											.split(";");
										var vCEArray = vContextArray[0].split(":");

										return vCEArray[0];
									} else {
										if (vContext !== undefined && vContext.indexOf(":") > -1) {
											var vContextArray = vContext.split(":");
											return vContextArray[0];
										}
									}
								}
							}
						}).addStyleClass("objectIdentifier_text"),
                                                                                                                                                                                                                                                                                                                                                  new sap
						.m.ObjectIdentifier({
							text: {
								path: "Context",
								formatter: function() {
									var ctx = this.getBindingContext();
									var vContext = oModel.getProperty("Context", ctx);
									if (vContext !== undefined && vContext
										.indexOf(";") > -1) {
										var vContextArray = vContext
											.split(";");
										var vCEArray = vContextArray[1].split(":");

										return vCEArray[1];
									} else {
										return "";

									}
								}
							},
							title: {
								path: "Context",
								formatter: function() {
									var ctx = this.getBindingContext();
									var vContext = oModel.getProperty("Context", ctx);
									if (vContext !== undefined && vContext
										.indexOf(";") > -1) {
										var vContextArray = vContext
											.split(";");
										var vCEArray = vContextArray[1].split(":");

										return vCEArray[0];
									} else {
										return "";

									}
								}
							},
							visible: {
								path: "Context",
								formatter: function() {
									var ctx = this.getBindingContext();
									var vContext = oModel.getProperty("Context", ctx);
									if (vContext !== undefined && vContext
										.indexOf(";") > -1) {
										return true;
									} else {
										return false;

									}
								}
							}
						}).addStyleClass("objIdentifier_margin").addStyleClass("objectIdentifier_text")
                                                                                                                                                                                                                                                                                                                                                ]
				}),
                                                                        new sap.m.ObjectIdentifier({
					text: {
						path: "AttributeDesc"
					},
					title: {
						path: "NewValue"
					}
				}),
                                                                         new sap.m.Text({
					text: {
						path: "OldValue"
					}
				})]
		});

		return oItemTemp;
	},

	setLinkPress: function(value) { //Set the value to identify Link has been pressed
		this.vLinkPressed = value;
	},

	getLinkPress: function() { //Get the value to identify Link has been pressed
		return this.vLinkPressed;
	}

};