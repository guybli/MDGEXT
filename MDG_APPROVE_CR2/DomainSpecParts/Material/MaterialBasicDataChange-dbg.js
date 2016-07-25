/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange = {
	//Declare global variables
	oGeneralTable: "",
	omatDimTable: "",
	omatClassTable: "",
	omatPurchTable: "",
	omatIntComntNotesTable: "",
	omatBasicTxtNotesTable: "",
	aClassificationDetailData: "",
	omatDescNotesTable: "",
	omatPurchONotesTable: "",
	omatQualityInsNotesTable: "",
	oS3Controller: "",
	oGeneralChangedPanelData: "",
	materialheader1: "", 
	unitmsraddedflag: 0,
	unitmsrdeletedflag: 0,
	vGtinflag: 0,
	vgtinflag: 0,
	vVaidFromflag: 0,
	aNetWeightData: "",
	
	aIntDetComntNotesData: {
		results: []
	},
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
	aBasicTxtDetNotesData: {
		results: []
	},
	aDescDetNotesData: {
		results: []
	},
	aQualityInsDetNotesData: {
		results: []
	},
	ostrResults: {
		dataitems: []
	},
	aGtinSortedData: {
		results: []
	},
	aGtinChangedResponse: {
		results: []
	},
	aGtinDetData: {
		results: []
	},
	aNotesDetailData: "",
	oItemTemp: "",
	vUomChngData: "",
	aGrossWeightData:"",

	// Initializing tables and adding them to layouts 
	initialize_General_Tables: function(oS3Controller) {
		this.aClassificationDetailData = "";
		this.oS3Controller = oS3Controller;
		//delete all UI contents if present for create layout
		sap.ui.getCore().byId("materialChangedDataLayout").removeAllContent();

		//Table first column header text for General, Communication, Address and Indicators Section 

		//initialize general section table and load the fragment into appropriate layout
		sap.ui.getCore().byId("materialChangedDataLayout").removeAllContent();
		var vPurchFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('E');
		if (vPurchFlag === false) {
			if (sap.ui.getCore().byId("matPurchasingChangedPanel") !== undefined) {
				sap.ui.getCore().byId("matPurchasingChangedPanel").destroy();
			}
		}
		//CHECKING FOR CLASSIFICATION HIDE/UNHIDE
		var vClassFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('C');
		if (vClassFlag === false) {
			if (sap.ui.getCore().byId("matClassificationChangedPanel") !== undefined) {
				sap.ui.getCore().byId("matClassificationChangedPanel").destroy();
			}
		}
		//Table first column header text for General, Communication, Address and Indicators Section 

		//initialize general section table and load the fragment into appropriate layout
		sap.ui.getCore().byId("materialChangedDataLayout").removeAllContent();
		this.oGeneralTable = "";
		this.oGeneralTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
		sap.ui.getCore().byId("materialChangedDataLayout").addContent(this.oGeneralTable);
		//destroying the create layout
		if (sap.ui.getCore().byId("materialDataLayout") !== undefined) {
			sap.ui.getCore().byId("materialDataLayout").destroy();
		}
		//events triggered navigation from s3 to s4
		sap.ui.getCore().byId("matGtinChangedPanel").attachExpand("", oS3Controller.onPanelExpand, oS3Controller);
		if (sap.ui.getCore().byId("matClassificationChangedPanel") !== undefined) {
			sap.ui.getCore().byId("matClassificationChangedPanel").attachExpand("", oS3Controller.onPanelExpand, oS3Controller);
		}
		if (sap.ui.getCore().byId("matPurchasingChangedPanel") !== undefined) {
			sap.ui.getCore().byId("matPurchasingChangedPanel").attachExpand("", oS3Controller.onPanelExpand, oS3Controller);
		}
		sap.ui.getCore().byId("matNotesChangedPanel").attachExpand("", oS3Controller.onPanelExpand, oS3Controller);
	},
	InitializePanelData: function(aResult, vPanelid, oView) {
		//string for no data maintained
		var sNodata = this.i18n.getText("Nodata");
		var i, j;

		switch (vPanelid) {
			case "matGtinChangedPanel":
				//craeting s3 for gtin
				this.getSetGtinData(aResult, oView, sNodata);
				break;
			case "matClassificationChangedPanel":
				this.getSetClassificationChangedData(aResult, vPanelid, oView);

				break;
			case "matPurchasingChangedPanel":
				//initialize Purchasing panel panel
				sap.ui.getCore().byId("matPurchasingChangedPanel").destroyContent();
				this.omatPurchTable = "";
				this.omatPurchTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
				sap.ui.getCore().byId("matPurchasingChangedPanel").addContent(
					this.omatPurchTable);
				this.omatPurchTable.setGrowing(true);
				var oItemTempPurch = this.createTableTemplate(); // Get the item template
				oItemTempPurch.attachPress({
					name: 'matPurchChangedDetail'
				}, oView.navtoSubDetail, oView);
				var aPurchData = {
					results: []
				};

				var generalchangedata = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
				var MaterialTxtgeneral = generalchangedata.data.TXTMI;
				var MaterialTitle = this.i18n.getText("MATERIAL");
				if (aResult.length > 0) {
					if (aResult[0].data.ChangeData.results.length > 0 || aResult[1].data.ChangeData.results.length > 0) {
						for (j = 0; j < aResult.length; j++) {

							for (i = 0; i < aResult[j].data.ChangeData.results.length; i++) {
								sAttr = aResult[j].data.ChangeData.results[i].Attribute;
								if (sAttr === 'BSTME' || sAttr === 'VABME' || sAttr === 'EKWSL' || sAttr === 'MFRPN' || sAttr === 'MPROF' || sAttr === 'MFRNR' || sAttr === 'QMPUR' || sAttr === 'RBNRM') {
									//for this field remove leading zeroes
									if (sAttr === 'MFRNR') {
										aResult[j].data.ChangeData.results[i].OldValue = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(aResult[j].data.ChangeData
											.results[i].OldValue);
										aResult[j].data.ChangeData.results[i].NewValue = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(aResult[j].data.ChangeData
											.results[i].NewValue);
									}
									//for this field if text is there but value is not there then
									if (sAttr === 'VABME') {
										if (aResult[j].data.ChangeData.results[i].OldValue === "" && aResult[j].data.ChangeData.results[i].OldValueText !== "") {
											aResult[j].data.ChangeData.results[i].OldValue = aResult[j].data.ChangeData.results[i].OldValueText; //if nothing is maintained in the field when it was initially created
											aResult[j].data.ChangeData.results[i].OldValueText = "";
										}
										if (aResult[j].data.ChangeData.results[i].NewValue === "" && aResult[j].data.ChangeData.results[i].NewValueText !== "") {
											aResult[j].data.ChangeData.results[i].NewValue = aResult[j].data.ChangeData.results[i].NewValueText; //if nothing is maintained in the field when it was initially created
											aResult[j].data.ChangeData.results[i].NewValueText = "";
										}
									}

									if (aResult[j].data.ChangeData.results[i].NewValue !== aResult[j].data.ChangeData.results[i].OldValue) {

										//To show the description of value and code together in a single row, concatenate the values
										aResult[j].data.ChangeData.results[i].OldValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aResult[j].data.ChangeData.results[
											i].OldValue, aResult[j].data.ChangeData.results[i].OldValueText);
										//To show the description of value and code together in a single row, concatenate the values
										aResult[j].data.ChangeData.results[i].NewValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aResult[j].data.ChangeData.results[
											i].NewValue, aResult[j].data.ChangeData.results[i].NewValueText);

										// If a new value is empty but old value is not empty, set the text to 'DELETED'
										if (aResult[j].data.ChangeData.results[i].NewValue === "" && aResult[j].data.ChangeData.results[i].OldValue !== "")

										{
											aResult[j].data.ChangeData.results[i].NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeletedAttributeString();
										}
										if (aResult[j].data.ChangeData.results[i].OldValue === "") {
											aResult[j].data.ChangeData.results[i].OldValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getNotMaintString(); //if nothing is maintained in the field when it was initially created
										}
										//removing leading zeroes if its there in the material no.
										aResult[j].data.MATERIAL = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(aResult[j].data.MATERIAL);
										aResult[j].data.ChangeData.results[i].ChangeKey = MaterialTxtgeneral + " " + "(" + aResult[j].data.MATERIAL + ")";
										aResult[j].data.ChangeData.results[i].Entity = MaterialTitle;
										aPurchData.results.push(aResult[j].data.ChangeData.results[i]);
									}
								}
							}
						}
					}

					for (var j = 0; j < generalchangedata.data.ChangeData.results.length; j++) {
						var sAttr = generalchangedata.data.ChangeData.results[j].Attribute;
						if (sAttr === 'NRFHG') {

							if (generalchangedata.data.ChangeData.results[j].NewValue !== generalchangedata.data
								.ChangeData.results[j].OldValue) {
								if (generalchangedata.data.ChangeData.results[j].OldValue === "" && generalchangedata.data.ChangeData.results[j].OldValueText !==
									"") {
									generalchangedata.data.ChangeData.results[j].OldValue = generalchangedata.data.ChangeData.results[j].OldValueText; //if nothing is maintained in the field when it was initially created
									generalchangedata.data.ChangeData.results[j].OldValueText = "";
								}
								if (generalchangedata.data.ChangeData.results[j].NewValue === "" && generalchangedata.data.ChangeData.results[j].NewValueText !==
									"") {
									generalchangedata.data.ChangeData.results[j].NewValue = generalchangedata.data.ChangeData.results[j].NewValueText; //if nothing is maintained in the field when it was initially created
									generalchangedata.data.ChangeData.results[j].NewValueText = "";
								}
								generalchangedata.data.ChangeData.results[j].Entity = "";
								if (generalchangedata.data.ChangeData.results[j].OldValue === "" && generalchangedata
									.data.ChangeData.results[j].OldValueText ===
									"") {
									generalchangedata.data.ChangeData.results[j].OldValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
										.getNotMaintString(); //if nothing is maintained in the field when it was initially created
								}
								//To show the description of value and code together in a single row, concatenate the values
								generalchangedata.data.ChangeData.results[j].OldValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(generalchangedata.data.ChangeData
									.results[j].OldValue, generalchangedata.data.ChangeData.results[j].OldValueText);
								//To show the description of value and code together in a single row, concatenate the values
								generalchangedata.data.ChangeData.results[j].NewValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(generalchangedata.data.ChangeData
									.results[j].NewValue,
									generalchangedata.data.ChangeData.results[j].NewValueText);

								if (generalchangedata.data.ChangeData.results[j].OldValueText !== "" && generalchangedata.data.ChangeData.results[
									j].OldValue === "") {
									generalchangedata.data.ChangeData.results[j].OldValue = generalchangedata.data.ChangeData
										.results[j].OldValueText;
								}

								// If a new value is empty but old value is not empty, set the text to 'DELETED'
								if (generalchangedata.data.ChangeData.results[j].NewValue === "" && generalchangedata.data.ChangeData.results[j].OldValue !==
									"" ||
									generalchangedata.data.ChangeData.results[j].EntityAction === fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
									.getDeleteEntityAction())

								{
									generalchangedata.data.ChangeData.results[j].NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
										.getDeletedAttributeString();
								}
								generalchangedata.data.MATERIAL = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(generalchangedata.data.MATERIAL);
								generalchangedata.data.ChangeData.results[j].ChangeKey = MaterialTxtgeneral + " " + "(" + generalchangedata.data.MATERIAL +
									")";
								generalchangedata.data.ChangeData.results[j].Entity = MaterialTitle;
								aPurchData.results.push(generalchangedata.data.ChangeData.results[j]);
							}
						}

					}
					if (aPurchData.results.length > 0) {
						//Binding 
						var oPurchModel = new sap.ui.model.json.JSONModel();
						oPurchModel.setData(aPurchData);

						this.omatPurchTable.setModel(oPurchModel);
						this.omatPurchTable.bindItems('/results', oItemTempPurch, '', '');
					} else {

						var paneldim = sap.ui.getCore().byId("matPurchasingChangedPanel");
						fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(paneldim, sNodata);
					}
				}

				//	}
				break;
			case "matNotesChangedPanel":
				//getting the changed data from one entity and segregating it into 5 different text models
				this.getSetNotesChangedData(aResult, vPanelid, oView);
				break;
		}
		//controller hook defined in S3 controller with panel id, aresult and oview: no return param
		this.oS3Controller.matHookModifyBindPanelChangedData(aResult, vPanelid, oView);
	},
	getNotestChangeData: function() {
		return this.aNotesDetailData;
	},
	getClassificationChangeData: function() {
		return this.aClassificationDetailData;
		//	this.aClassificationDetailData="";

	},
	getInstance: function() {
		return this;
		//	this.aClassificationDetailData="";

	},

	displayGeneralTabData: function(aResult, oInstance, oView) { // EXC_JSHINT_047

		if (aResult.data.MATERIAL2MATCHGMNGRel.results.length > 0) {
			if (aResult.data.MATERIAL2MATCHGMNGRel.results[0].VALID_FROM !== "" && aResult.data.MATERIAL2MATCHGMNGRel.results[0].VALID_FROM !== null) {
				var vValidFrom = aResult.data.MATERIAL2MATCHGMNGRel.results[0].VALID_FROM;
				aResult.data.MATERIAL2MATCHGMNGRel.results[0].VALID_FROM = fcg.mdg.approvecrv2.util.Formatter.matDateFormat(
					vValidFrom);
			}
			if (aResult.data.MATERIAL2MATCHGMNGRel.results[0].ECOCHGMNG !== "") {
				aResult.data.MATERIAL2MATCHGMNGRel.results[0].ECOCHGMNG = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aResult.data.MATERIAL2MATCHGMNGRel
					.results[0].ECOCHGMNG,
					aResult.data.MATERIAL2MATCHGMNGRel.results[0].ECOCHGMNG__TXT);
			}
			var ChngmgmtModel = new sap.ui.model.json.JSONModel();
			ChngmgmtModel.setData(aResult.data.MATERIAL2MATCHGMNGRel.results[0]);
			sap.ui.getCore().byId("matchngmgmtchngForm").setModel(ChngmgmtModel);
			this.hideChngmgmtSection();
		} else {
			sap.ui.getCore().byId("materialchgmngLayout").destroy();
		}

		var oItemTemp = this.createTableTemplate(); // Get the item template
		oItemTemp.attachPress({
			name: 'matGenChangedDetail'
		}, oView.navtoSubDetail, oView);
		var aGeneralData = {
			results: []
		};
	     	//clearing the buffered for next cr
	             this.aNetWeightData="";
				 this.aGrossWeightData="";
		//looping to get the changed data of general data
		for (var j = 0; j < aResult.data.ChangeData.results.length; j++) {
			var sAttr = aResult.data.ChangeData.results[j].Attribute;
			//storing the change of netweight and gross weight for dimension and gtin
				if(sAttr === 'NTGEW')
			{
				this.aNetWeightData="";
		        this.aNetWeightData =$.extend(true, {}, aResult.data.ChangeData.results[j]);
			}
			if(sAttr === 'GROES')
			{        this.aGrossWeightData="";
				this.aGrossWeightData =$.extend(true, {}, aResult.data.ChangeData.results[j]);
			}
			if (sAttr === 'MATERIAL' || sAttr === 'MEINS' || sAttr === 'MTART' || sAttr === 'MBRSH' || sAttr === 'MATKL' || sAttr === 'BISMT' ||
				sAttr === 'BEGRU' || sAttr === 'MSTAE' || sAttr === 'MSTDE' || sAttr === 'XCHPFMARA' || sAttr === 'XGCHPMARA' || sAttr === 'SPART' ||
				sAttr === 'KOSCH' || sAttr === 'EXTWG' || sAttr === 'PRDHA' || sAttr === 'MTPOSMARA' || sAttr === 'MAGRVMARA' || sAttr === 'LABOR' ||
				sAttr === 'NORMT' || sAttr === 'WRKST' || sAttr === 'FERTH' || sAttr === 'FORMT' || sAttr === 'CADKZ' || sAttr === 'SATNR' || sAttr ===
				'KZKFG' || sAttr === 'KZUMW' || sAttr === 'PROFL' || sAttr === 'XCHPFMARA' || sAttr === 'XGCHPMARA' || sAttr === 'SPART' || sAttr ===
				'KOSCH' || sAttr === 'EXTWG' || sAttr === 'PRDHA' || sAttr === 'SERLV' || sAttr === 'MTPOSMARA' || sAttr === 'MAGRVMARA' || sAttr ===
				'LABOR' 
			) {
		
				if(sAttr === "MEINS") {
					this.vUomChngData = "";
					this.vUomChngData = aResult.data.ChangeData.results[j];
				}
				//removing the leading zeroes
				if (sAttr === 'SATNR') {
					aResult.data.ChangeData.results[j].OldValue = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(aResult.data.ChangeData
						.results[j].OldValue);
					aResult.data.ChangeData.results[j].NewValue = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(aResult.data.ChangeData
						.results[j].NewValue);
				}
				//handling of serialization level if olvalue is null but text is there then to show it
				if (sAttr === 'SERLV') {
					if (aResult.data.ChangeData.results[j].OldValueText !== "" && aResult.data.ChangeData.results[j].OldValue === "") {
						aResult.data.ChangeData.results[j].OldValue = aResult.data.ChangeData.results[j].OldValueText;
						aResult.data.ChangeData.results[j].OldValueText = "";
					}
					if (aResult.data.ChangeData.results[j].NewValueText !== "" && aResult.data.ChangeData.results[j].NewValue === "") {
						aResult.data.ChangeData.results[j].NewValue = aResult.data.ChangeData.results[j].NewValueText;
						aResult.data.ChangeData.results[j].NewValueText = "";
					}
				}
				//if datew is in the format 00.00.0000 then show it as not maintained or deleted
				if (sAttr === 'MSTDE') {
					aResult.data.ChangeData.results[j].NewValue = this.FormatDateNewVal(aResult.data.ChangeData.results[j].NewValue);
					aResult.data.ChangeData.results[j].OldValue = this.FormatDateOldVal(aResult.data.ChangeData.results[j].OldValue);
				}
				if (aResult.data.ChangeData.results[j].NewValue !== aResult.data.ChangeData.results[
					j].OldValue) {
					aResult.data.ChangeData.results[j].Entity = "";
					if (aResult.data.ChangeData.results[j].OldValue === "") {
						aResult.data.ChangeData.results[j].OldValueText = "";
						aResult.data.ChangeData.results[j].OldValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getNotMaintString(); //if nothing is maintained in the field when it was initially created
					}
					//To show the description of value and code together in a single row, concatenate the values

					aResult.data.ChangeData.results[j].OldValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aResult.data.ChangeData.results[j].OldValue,
						aResult.data.ChangeData.results[j].OldValueText);

					//To show the description of value and code together in a single row, concatenate the values

					aResult.data.ChangeData.results[j].NewValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aResult.data.ChangeData.results[j].NewValue,
						aResult.data.ChangeData.results[j].NewValueText);

					// If a new value is empty but old value is not empty, set the text to 'DELETED'
					if (aResult.data.ChangeData.results[j].NewValue === "" && aResult.data.ChangeData.results[
							j].OldValue !== "" ||
						aResult.data.ChangeData.results[j].EntityAction === fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeleteEntityAction()
					)

					{
						aResult.data.ChangeData.results[j].NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeletedAttributeString();
					}
				}
				aResult.data.ChangeData.results[j].ChangeKey = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aResult.data.MATERIAL,
					aResult.data.TXTMI);
				aGeneralData.results.push(aResult.data.ChangeData.results[j]);

			}

		}
		if (aGeneralData.results.length > 0) {
			//Binding 
			var oGeneralModel = new sap.ui.model.json.JSONModel();
			oGeneralModel.setData(aGeneralData);

			this.oGeneralTable.setModel(oGeneralModel);
			this.oGeneralTable.bindItems('/results', oItemTemp, '', '');
		} else {
			if (sap.ui.getCore().byId("materialChangedDataLayout") !== undefined) {
				sap.ui.getCore().byId("materialChangedDataLayout").destroy();
			}
		}

	},
	//Create generic table template 
	createTableTemplate: function() {
		var oItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.ObjectIdentifier({
					title: {
						path: "ChangeKey"
					},
					text: {
						path: "Entity"
					}
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
				})
			]
		});

		return oItemTemp;
	},
	//Create generic table template 
	createClassTableTemplate: function() {
		var oItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.ObjectIdentifier({
					title: {
						path: "ChangeKey"
					},
					text: {
						path: "Entity"
					}
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
				})

			]
		});
		var extoItemTemp = this.oS3Controller.matHookgetClassTableTemplate(oItemTemp);
		if (extoItemTemp !== undefined) {
			oItemTemp = extoItemTemp;
		}
		return oItemTemp;
	},

	// handling zeroes
	getoldValueZeroes: function(vOldValue) {
		var vOldValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vOldValue);
		if (vOldValBoln === false) {
			vOldValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getNotMaintString();
		}
		return vOldValue;
	},
	getnewValueZeroes: function(vNewValue) {
		var vNewValBoln = fcg.mdg.approvecrv2.util.Formatter.defaultValue(vNewValue);
		if (vNewValBoln === false) {
			vNewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeletedAttributeString();
		}
		return vNewValue;
	},

	getGtinDetailData: function() {
		return this.ostrResults;
	},
	getGtinChangedData: function() {
		return this.aGtinChangedResponse;
	},
	getIntComntData: function() {
		return this.aIntComntDetNotesData;
	},
	getBasicTxtData: function() {
		return this.aBasicTxtDetNotesData;
	},
	getDescData: function() {
		return this.aDescDetNotesData;
	},
	getQualityInsData: function() {
		return this.aQualityInsDetNotesData;
	},

	getSetGtinData: function(aResult, oView, sNodata) {
		//string for no data maintained
		var sNodata = this.i18n.getText("Nodata");
		var i, j,k,l, sAttr,vNewVal,vOldVal,vNewValTxt,vOldValTxt,vqteunittxt,vqteunit,UnitOfMeasure,vEntityAction,vEanupc,sAttributeDesc;
		var aGtinData = {
			results: []
		};
			var oDataItems = {
			EntityDesc: "",
			EntityName: "",
			AttributeDesc: "",
			NewValue: "",
			OldValue: "",
			NewValueText: "",
			OldValueText: "",
			ChangeKey: "",
			Entity: "",
			UnitOfMeasure:""
			
		};
		var sAttrTextValues = ["BRGEW", "LAENG", "BREIT", "HOEHE", "VOLUM", "GROES", "NTGEW", "UMREZ", "UMREN","GTIN_VAR2",
		"EAN_MARM","MEABM","VOLEH","GEWEI"];
		var sAttrUnitValues =["BRGEW", "LAENG", "BREIT", "HOEHE", "VOLUM"];
		var sAttrGtinValues =["HPEAN", "EANTP_MEA"];
		var generalchangedimensiondata = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
		var aUnitmsr=aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results;
		var aMeanGtinData=aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results;
		
		if (aUnitmsr.length > 0 || aMeanGtinData.length > 0 || generalchangedimensiondata!==undefined) {
			this.oItemTemp = this.createTableTemplate();
			//getting the key(unit of msr and ean/upc)full set from gtin and dimension table which used in create scenario
			this.ostrResults = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.getGtinData(aResult);
			//label of context description
			var sUnitMsrLabel = this.i18n.getText("Mat_Unit_Measure");
			var sEanUpcLabel = this.i18n.getText("Mat_UPC");
			var aContextLabel = sUnitMsrLabel + "," + " " + sEanUpcLabel;
			//looping through all the ean/upc and unito measure and getting the changes of dimensions
			for ( i = 0; i < this.ostrResults.dataitems.length; i++) {
				vqteunittxt = this.ostrResults.dataitems[i].unitofmeasure_txt;
				UnitOfMeasure = this.ostrResults.dataitems[i].unitofmeasure;
				vqteunit = vqteunittxt + " " + "(" + this.ostrResults.dataitems[i].unitofmeasure + ")";
				vEanupc = this.ostrResults.dataitems[i].eanupc;
					this.unitmsraddedflag = 0;
					this.unitmsrdeletedflag =0;
				for (j = 0; j < aUnitmsr.length; j++) {
				
             
					if (aUnitmsr[j].QTEUNIT__TXT + " " + "(" + aUnitmsr[j].QTEUNIT + ")" === vqteunit &&
						aUnitmsr[j].EAN_MARM === vEanupc
					) {
						var aUnitMsrChangeData=aUnitmsr[j].ChangeData.results;
					
						for (k = 0; k < aUnitMsrChangeData.length; k++) {
						if(this.unitmsraddedflag===0 && this.unitmsrdeletedflag===0 )
				      	{
								 sAttr = aUnitMsrChangeData[k].Attribute;
								 vNewVal=aUnitMsrChangeData[k].NewValue;
								 vOldVal=aUnitMsrChangeData[k].OldValue;
								 vOldValTxt = aUnitMsrChangeData[k].OldValueText;
								 vNewValTxt = aUnitMsrChangeData[k].NewValueText;
								 sAttributeDesc=aUnitMsrChangeData[k].AttributeDesc;
								if (sAttrTextValues.indexOf(sAttr) !== -1) {
                                       if (vEanupc === "") {
										oDataItems.ChangeKey = vqteunit;
										oDataItems.Entity = sUnitMsrLabel;
										oDataItems.UnitOfMeasure=UnitOfMeasure;
									} else {
										oDataItems.ChangeKey = vqteunit + "," + " " + vEanupc;
										oDataItems.Entity = aContextLabel;
										oDataItems.UnitOfMeasure=UnitOfMeasure;
									}
									switch (aUnitMsrChangeData[0].EntityAction) {
					              case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getCreateEntityAction():
										oDataItems.NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getAddedInstanceString();
										oDataItems.OldValue = "";
										oDataItems.AttributeDesc = "";
									//setting the flag so that no loop further
										this.unitmsraddedflag = 1;
											break;
								 case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeleteEntityAction():
										oDataItems.NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeletedInstanceString();
										oDataItems.OldValue = "";
										oDataItems.AttributeDesc = "";
									//ONCE THE DELETE ENTITY ACTION IT WILL GET IT WILL SET THE FLAG AND WILL NOT LOOP FURTHER
										this.unitmsrdeletedflag = 1;
								     break;
									case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getUpdateEntityAction():
										oDataItems.NewValue=vNewVal;
										oDataItems.OldValue=vOldVal;
										oDataItems.AttributeDesc=sAttributeDesc;
										oDataItems.NewValueText=vNewValTxt;
										oDataItems.OldValueText=vOldValTxt;
										if (sAttrUnitValues.indexOf(sAttr) !== -1) {
										oDataItems.OldValue = this.getoldValueZeroes(vOldVal);
										oDataItems.NewValue = this.getnewValueZeroes(vNewVal);
									
										//for dimension fields the text are if not assigned not maintained and deleted the execute next lines
										if (oDataItems.OldValue !== "" && oDataItems.OldValue !== "(" + this.i18n.getText("PC_NOT_MAIN") + ")")
										 {
										//OLD VALUE AND NEW VALUE DESCRIPTION COMES AS EX-centimeter (cm) so forming the old value with its text
										oDataItems.OldValue = vOldVal + " " + vOldValTxt;
											oDataItems.OldValueText = "";
										} else {
											//if old value is null then not maintained
											oDataItems.OldValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getNotMaintString();
										    oDataItems.OldValueText = "";
										}
										if (oDataItems.NewValue !== "") {
											oDataItems.NewValue = vNewVal + " " + vNewValTxt;
										   oDataItems.NewValueText = "";
										} else {
											oDataItems.NewValue= fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeletedAttributeString();
											oDataItems.NewValueText = "";
										}
									}
										if (oDataItems.OldValueText !== "") {
											oDataItems.OldValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vOldVal,vOldValTxt);
										}
										//To show the description of value and code together in a single row, concatenate the values
										if (oDataItems.NewValueText !== "") {
											oDataItems.NewValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vNewVal,vNewValTxt);
										}
										if (vNewVal === "" && vOldVal !== "" ){
											oDataItems.NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeletedAttributeString();	
											}
											if (vNewVal !== "" &&  vOldVal === "" ){
											oDataItems.OldValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getNotMaintString();	
											}
											break;
									}
									
									var oGtinodataitems =$.extend(true, {}, oDataItems);
									aGtinData.results.push(oGtinodataitems);

								}
						//	}
						}
						}
					var vBuom = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(generalchangedimensiondata.data.MEINS,generalchangedimensiondata.data.MEINS__TXT);
		var vAltUom = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(this.ostrResults.dataitems[i].unitofmeasure,this.ostrResults.dataitems[i].unitofmeasure_txt);
						var vEan = this.ostrResults.dataitems[i].eanupc;
						if(vAltUom===vBuom){
			//if the dimension value is updated  then add weight changes also
				if(this.unitmsraddedflag===0 && this.unitmsrdeletedflag===0){
					//geting and forming the changed data got from the general data
					if(this.aGrossWeightData!=="")
					{//assiginiung without the reference
						 var aGrosdata=$.extend(true, {}, this.aGrossWeightData);
							var oDataIGrossWeighttems=this.getChangedWeightData(aGrosdata,vEan,vAltUom,sUnitMsrLabel,aContextLabel,UnitOfMeasure);
				            	aGtinData.results.push(oDataIGrossWeighttems);
					}
				}
				if(this.unitmsraddedflag===0 && this.unitmsrdeletedflag===0){
						if(this.aNetWeightData!=="")
					{
						 var aNtWtdata=$.extend(true, {}, this.aNetWeightData);
							var oDataINetWeighttems=this.getChangedWeightData(aNtWtdata,vEan,vAltUom,sUnitMsrLabel,aContextLabel,UnitOfMeasure);
				            	aGtinData.results.push(oDataINetWeighttems);
					}
					}
					}
			
			
				}
				//getting the changes of size and dimension and net weight from general data changes if alternate unit of measure is equale to base unti of maesure
	
				}
		 oDataItems=[];
			}
		//	oDataItems=[];
			//LOOPING AROUNG THE KEY(UNIT OF MEASURE AND EAN/UPC) AND GETTING THE CHANGES OF GTIN TABLE AND MIXING IT TO THE CHANGES OF DIMENSION
			for (i = 0; i < this.ostrResults.dataitems.length; i++) {
				 vqteunittxt = this.ostrResults.dataitems[i].unitofmeasure_txt;
				  UnitOfMeasure= this.ostrResults.dataitems[i].unitofmeasure;
				vqteunit = vqteunittxt + " " + "(" + this.ostrResults.dataitems[i].unitofmeasure + ")";
				vEanupc = this.ostrResults.dataitems[i].eanupc;
				for (j = 0; j < aMeanGtinData.length; j++) {
					this.vgtinflag = 0;
					if (vqteunit === aMeanGtinData[j].QTEUNIT__TXT + " " + "(" + aMeanGtinData[j].QTEUNIT + ")" && vEanupc === aMeanGtinData[j].EAN) {
					var aMeanGtinChangedData=aMeanGtinData[j].ChangeData.results;
						for ( k = 0; k < aMeanGtinChangedData.length; k++) {
							if (this.vgtinflag === 0) {
								 sAttr = aMeanGtinChangedData[k].Attribute;
								vOldVal = aMeanGtinChangedData[k].OldValue;
								vOldValTxt = aMeanGtinChangedData[k].OldValueText;
								vNewVal = aMeanGtinChangedData[k].NewValue;
							   vNewValTxt = aMeanGtinChangedData[k].NewValueText;
							if (sAttrGtinValues.indexOf(sAttr) !== -1) {
										if (vEanupc === "") {
											oDataItems.ChangeKey = vqteunit;
											oDataItems.Entity = sUnitMsrLabel;
											oDataItems.UnitOfMeasure=UnitOfMeasure;
										} else {
											oDataItems.ChangeKey = vqteunit + "," + " " +
												vEanupc;
											oDataItems.Entity = aContextLabel;
											oDataItems.UnitOfMeasure=UnitOfMeasure;
										}
										this.vGtinDimPresentFlag = 0;
										var newvalue;
										for ( l = 0; l < aGtinData.results.length; l++) {
											if (aGtinData.results[l].ChangeKey === oDataItems.ChangeKey) {
												this.vGtinDimPresentFlag = 1;
										     newvalue=aGtinData.results[l].NewValue;
											}
										}
										//if the change is there in dimension table for the key then add the changes of gtin
										if (this.vGtinDimPresentFlag === 1 && newvalue!=="Added" && newvalue!=="Deleted" ) {
									switch (aMeanGtinChangedData[0].EntityAction) {
					              case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getCreateEntityAction():
					              	if(vOldVal === "")
					              	{
					              		oDataItems.OldValue=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getNotMaintString();
										oDataItems.OldValueText="";	
										oDataItems.NewValue=aMeanGtinChangedData[k].NewValue;
										oDataItems.NewValueText=aMeanGtinChangedData[k].NewValueText;
										oDataItems.AttributeDesc=aMeanGtinChangedData[k].AttributeDesc;
										
					              	}
										break;
										case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeleteEntityAction():
											oDataItems.NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeletedAttributeString();
											oDataItems.NewValueText="";
											oDataItems.OldValue=aMeanGtinChangedData[k].OldValue;
										oDataItems.OldValueText=aMeanGtinChangedData[k].OldValueText;
										oDataItems.AttributeDesc=aMeanGtinChangedData[k].AttributeDesc;
											break;
										case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getUpdateEntityAction():
											oDataItems.NewValue=vNewVal;
										oDataItems.OldValue=vOldVal;
										oDataItems.AttributeDesc=sAttributeDesc;
										oDataItems.NewValueText=vNewValTxt;
										oDataItems.OldValueText=vOldValTxt;
										
											break;
										}
										if (oDataItems.OldValueText !== "") {
												oDataItems.OldValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vOldVal, vOldValTxt);
											}
											//To show the description of value and code together in a single row, concatenate the values
											if (oDataItems.NewValueText !== "") {
												oDataItems.NewValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vNewVal, vNewValTxt);
											}
							
											
											var oMeanGtinodataitems =$.extend(true, {}, oDataItems);
									aGtinData.results.push(oMeanGtinodataitems);
										}
										//if changes are not there in dimension table and its newly added in gtin then show it as added or deleted
										else if(this.vGtinDimPresentFlag === 0) {
												switch (aMeanGtinChangedData[0].EntityAction) {
					                  case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getCreateEntityAction():
												oDataItems.NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getAddedInstanceString();
												oDataItems.OldValue = "";
												oDataItems.AttributeDesc = "";
												this.vgtinflag = 1;
												break;
										case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeleteEntityAction():
												oDataItems.NewValue = fcg.mdg.approvecrv2.DomainSpecParts
													.Material.Material.getDeletedInstanceString();
												oDataItems.OldValue = "";
												oDataItems.AttributeDesc = "";
										this.vgtinflag = 1;
										break;
												}
									
											var oMeanGtinodataitems =$.extend(true, {}, oDataItems);
									aGtinData.results.push(oMeanGtinodataitems);
										} //end of else
									}
								}
							}
						}
					}
			
				}
		
			this.aGtinDetData=aGtinData;
//getting the chnaged data for the detail page
			this.aGtinChangedResponse = this.aGtinDetData;
			if (this.aGtinChangedResponse.results.length > 0) {
				//initialize dim panel && loading fragment when data is there
				sap.ui.getCore().byId("matGtinChangedPanel").destroyContent();
				this.omatDimTable = "";
				this.omatDimTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
				sap.ui.getCore().byId("matGtinChangedPanel").addContent(
					this.omatDimTable);
				this.omatDimTable.setGrowing(true);
				//Binding 
				this.oItemTemp.attachPress({
					name: 'matDimGtinChangedDetail'
				}, oView.navtoSubDetail, oView);
				var oGTINModel = new sap.ui.model.json.JSONModel();
				oGTINModel.setData(this.aGtinDetData);
				this.omatDimTable.setModel(oGTINModel);
				var oGtinSorter = new sap.ui.model.Sorter('ChangeKey'); // Sort based on Plant
				this.omatDimTable.bindItems('/results', this.oItemTemp, oGtinSorter, '');
				this.aGtinSortedData = {
					results: []
				};
				this.aGtinDetData = {
					results: []
				};
			} else {
				var paneldim = sap.ui.getCore().byId("matGtinChangedPanel");
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(paneldim, sNodata);
			}
		}
	},
	hideChngmgmtSection: function() {
		if (sap.ui.getCore().byId("Txt_MatChange").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VALIDFROMCHANGE").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MATREVISION").getVisible() === false) {
			if (sap.ui.getCore().byId("CreateChngMgmttitchng") !== undefined) {
				sap.ui.getCore().byId("CreateChngMgmttitchng").destroy();
				sap.ui.getCore().byId("matchngmgmtchngForm").destroy();
			}
		}

	},
	getSetNotesChangedData: function(aResult, vPanelid, oView) {
		var i, j, sAttr;
		var sNodata = this.i18n.getText("Nodata");
		//assigning the notes data to another without assigning the reference so that can used for buffering for detail page
		this.aNotesDetailData = $.extend(true, {}, aResult);

		var oNotesResult = aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel;
		if (oNotesResult.results.length > 0) {
			var aIntComntNotesData = {
				results: []
			};
			var aBasicTxtNotesData = {
				results: []
			};
			var aDescNotesData = {
				results: []
			};
			var aQualityInsNotesData = {
				results: []
			};
			var aPurchOrderNotesData = {
				results: []
			};

			sap.ui.getCore().byId("matNotesChangedPanel").destroyContent();
			this.omatBasicTxtNotesTable = "";
			this.omatBasicTxtNotesTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matNotesChangedPanel").addContent(
				this.omatBasicTxtNotesTable);
			this.omatBasicTxtNotesTable.setGrowing(true);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.omatBasicTxtNotesTable, this.i18n.getText("Mat_Basic_Txt"));
			this.omatIntComntNotesTable = "";
			this.omatIntComntNotesTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matNotesChangedPanel").addContent(
				this.omatIntComntNotesTable);
			this.omatIntComntNotesTable.setGrowing(true);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.omatIntComntNotesTable, this.i18n.getText(
				"Mat_Internal_Comment"));
			// initiating table for purchasing order text
			this.omatPurchONotesTable = "";
			this.omatPurchONotesTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matNotesChangedPanel").addContent(
				this.omatPurchONotesTable);
			this.omatPurchONotesTable.setGrowing(true);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.omatPurchONotesTable, this.i18n.getText(
				"Mat_Purch_Order_Txt"));
			// initiating table for quality inspection text
			this.omatQualityInsNotesTable = "";
			this.omatQualityInsNotesTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matNotesChangedPanel").addContent(
				this.omatQualityInsNotesTable);
			this.omatQualityInsNotesTable.setGrowing(true);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.omatQualityInsNotesTable, this.i18n.getText(
				"Mat_Quality_Inspection"));
			//looping to get the changes
			for (i = 0; i < oNotesResult.results.length; i++) {
				if (oNotesResult.results[i].ChangeData !== undefined) {
					for (j = 0; j < oNotesResult.results[i].ChangeData.results.length; j++) {
						sAttr = oNotesResult.results[i].ChangeData.results[j].Attribute;
						if (sAttr === 'NOTEINTCM' || sAttr === 'TXTMI' || sAttr === 'TXTPURCH' ||
							sAttr === 'NOTEBSCDA' || sAttr === 'TXTQINSP') {
							oNotesResult.results[i].ChangeData.results[j].ChangeKey = oNotesResult
								.results[i].LANGUCODE__TXT + " " + "(" +
								oNotesResult.results[i].LANGUCODE + ")";
							oNotesResult.results[i].ChangeData.results[j].Entity = "";
							// if (oNotesResult.results[i].ChangeData.results[j].NewValue !== oNotesResult
							// 	.results[i].ChangeData.results[j].OldValue) {
							if (oNotesResult.results[i].ChangeData.results[j].OldValue === "" &&
								oNotesResult.results[i].ChangeData.results[j].EntityAction === fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getCreateEntityAction()
							) {
								oNotesResult.results[i].ChangeData.results[j].NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getAddedInstanceString(); //if nothing is maintained in the field when it was initially created
								oNotesResult.results[i].ChangeData.results[j].AttributeDesc = "";
							}
							if (oNotesResult.results[i].ChangeData.results[j].OldValue !== "" &&
								oNotesResult.results[i].ChangeData.results[j].EntityAction === fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeleteEntityAction()
							) {
								oNotesResult.results[i].ChangeData.results[j].NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeletedInstanceString(); //if nothing is maintained in the field when it was initially created
								oNotesResult.results[i].ChangeData.results[j].Attribute = "";
								oNotesResult.results[i].ChangeData.results[j].AttributeDesc = "";
							}
							if (oNotesResult.results[i].ChangeData.results[j].OldValue === "" &&
								oNotesResult.results[i].ChangeData.results[j].EntityAction === fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getUpdateEntityAction()
							) {
								oNotesResult.results[i].ChangeData.results[j].OldValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getNotMaintString(); //if nothing is maintained in the field when it was initially created
								oNotesResult.results[i].ChangeData.results[j].Attribute = "";
							}
							if (oNotesResult.results[i].ChangeData.results[j].OldValue !== "") {
								oNotesResult.results[i].ChangeData.results[j].OldValue = fcg.mdg.approvecrv2.util.Formatter.Truncate(oNotesResult.results[i].ChangeData
									.results[j].OldValue);
							}
							if (oNotesResult.results[i].ChangeData.results[j].NewValue !== "") {
								oNotesResult.results[i].ChangeData.results[j].NewValue = fcg.mdg.approvecrv2.util.Formatter.Truncate(oNotesResult.results[i].ChangeData
									.results[j].NewValue);
							}
							var contextbasictxt = oNotesResult.results[i].MATERIAL + "/" + oNotesResult
								.results[i].LANGUCODE + "/" + "GRUN";
							//	contextbasictxt = contextbasictxt.replace(/\s+/g, '');
							var contextpurchorder = oNotesResult.results[i].MATERIAL + "/" + oNotesResult
								.results[i].LANGUCODE + "/" + "BEST";
							//	contextpurchorder = contextpurchorder.replace(/\s+/g, '');
							var contextcomnt = oNotesResult.results[i].MATERIAL + "/" + oNotesResult
								.results[i].LANGUCODE + "/" + "IVER";
							//	contextcomnt = contextcomnt.replace(/\s+/g, '');
							var contextdesc = oNotesResult.results[i].MATERIAL + "/" + oNotesResult
								.results[i].LANGUCODE + "/" + "DSCR";
							//	contextdesc = contextdesc.replace(/\s+/g, '');
							var contextquality = oNotesResult.results[i].MATERIAL + "/" + oNotesResult
								.results[i].LANGUCODE + "/" + "PRUE";
							//	contextquality = contextquality.replace(/\s+/g, '');

							//	var sContext=oNotesResult.results[i].ChangeData.results[j].Context;
							oNotesResult.results[i].ChangeData.results[j].Context = oNotesResult.results[i].ChangeData.results[j].Context.replace(/\s+/g, '');
							if (oNotesResult.results[i].ChangeData.results[j].Context === contextcomnt) {
								aIntComntNotesData.results.push(oNotesResult.results[i].ChangeData.results[j]);
							}

							if (oNotesResult.results[i].ChangeData.results[j].Context === contextbasictxt) {
								aBasicTxtNotesData.results.push(oNotesResult.results[i].ChangeData.results[j]);
							}
							if (oNotesResult.results[i].ChangeData.results[j].Context === contextpurchorder) {
								aPurchOrderNotesData.results.push(oNotesResult.results[i].ChangeData.results[j]);
							}

							if (oNotesResult.results[i].ChangeData.results[j].Context === contextdesc) {
								aDescNotesData.results.push(oNotesResult.results[i].ChangeData.results[j]);
							}

							if (oNotesResult.results[i].ChangeData.results[j].Context === contextquality) {
								aQualityInsNotesData.results.push(oNotesResult.results[i].ChangeData.results[j]);
							}

							// }
						}
					}
				}
			}

			if (aIntComntNotesData.results.length > 0) {
				//Binding intcomnt
				var oIntComntNotesModel = new sap.ui.model.json.JSONModel();
				oIntComntNotesModel.setData(aIntComntNotesData);
				var oItemTempIntComnt = this.createTableTemplate();
				oItemTempIntComnt.attachPress({
					name: 'matNotesChangedDetail',
					TableKey: "IntComnt",
					Entity: aIntComntNotesData
				}, oView.navtoSubDetail, oView);
				this.omatIntComntNotesTable.setModel(oIntComntNotesModel);
				this.omatIntComntNotesTable.bindItems('/results', oItemTempIntComnt, '', '');
				this.aIntDetComntNotesData = aIntComntNotesData;
			} else {
				this.omatIntComntNotesTable.setVisible(false);
			}
			if (aPurchOrderNotesData.results.length > 0) {
				//Binding intcomnt
				var opurchNotesModel = new sap.ui.model.json.JSONModel();
				opurchNotesModel.setData(aPurchOrderNotesData);
				var oItemTempPurchOrder = this.createTableTemplate();
				oItemTempPurchOrder.attachPress({
					name: 'matNotesChangedDetail',
					TableKey: "PurchOrder",
					Entity: aPurchOrderNotesData
				}, oView.navtoSubDetail, oView);
				this.omatPurchONotesTable.setModel(opurchNotesModel);
				this.omatPurchONotesTable.bindItems('/results', oItemTempPurchOrder, '', '');
				//	this.aPurchOrderNotesData = aIntComntNotesData;
			} else {
				this.omatPurchONotesTable.setVisible(false);
			}
			if (aBasicTxtNotesData.results.length > 0) {
				//basic text binding
				var oBasicTxtNotesModel = new sap.ui.model.json.JSONModel();
				oBasicTxtNotesModel.setData(aBasicTxtNotesData);
				var oItemTempBasicTxt = this.createTableTemplate();
				oItemTempBasicTxt.attachPress({
					name: 'matNotesChangedDetail',
					TableKey: "BasicTxt",
					Entity: aBasicTxtNotesData
				}, oView.navtoSubDetail, oView);
				this.omatBasicTxtNotesTable.setModel(oBasicTxtNotesModel);
				this.omatBasicTxtNotesTable.bindItems('/results', oItemTempBasicTxt, '', '');
				this.aBasicTxtDetNotesData = aBasicTxtNotesData;
			} else {
				this.omatBasicTxtNotesTable.setVisible(false);
			}
			if (aDescNotesData.results.length > 0) {
				//initialize text and comments panel panel
				//loading the fragment when data is there
				this.omatDescNotesTable = "";
				this.omatDescNotesTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
				sap.ui.getCore().byId("matNotesChangedPanel").addContent(
					this.omatDescNotesTable);
				this.omatDescNotesTable.setGrowing(true);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.omatDescNotesTable, this.i18n.getText("Mat_Txt_Description"));
				//description binding
				var oDescNotesModel = new sap.ui.model.json.JSONModel();
				oDescNotesModel.setData(aDescNotesData);
				var oItemTempDesc = this.createTableTemplate();
				oItemTempDesc.attachPress({
					name: 'matNotesChangedDetail',
					TableKey: 'Desc',
					Entity: aDescNotesData
				}, oView.navtoSubDetail, oView);
				this.omatDescNotesTable.setModel(oDescNotesModel);
				this.omatDescNotesTable.bindItems('/results', oItemTempDesc, '', '');
				this.aDescDetNotesData = aDescNotesData;
			}
			if (aQualityInsNotesData.results.length > 0) {
				//quality control inspection
				var oQualityInsNotesModel = new sap.ui.model.json.JSONModel();
				oQualityInsNotesModel.setData(aQualityInsNotesData);
				var oItemTempQualityIns = this.createTableTemplate();
				oItemTempQualityIns.attachPress({
					name: 'matNotesChangedDetail',
					TableKey: 'QualityIns',
					Entity: aQualityInsNotesData
				}, oView.navtoSubDetail, oView);
				this.omatQualityInsNotesTable.setModel(oQualityInsNotesModel);
				this.omatQualityInsNotesTable.bindItems('/results', oItemTempQualityIns, '', '');
				this.aQualityInsDetNotesData = aQualityInsNotesData;
			} else {
				this.omatQualityInsNotesTable.setVisible(false);
			}
			if (aIntComntNotesData.results.length === 0 && aBasicTxtNotesData.results.length == 0 &&
				aDescNotesData.results.length === 0 && aQualityInsNotesData.results.length === 0 && aPurchOrderNotesData.results.length === 0) {

				var paneldim = sap.ui.getCore().byId("matNotesChangedPanel");
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(paneldim, sNodata);
			}
		}

	},
	getSetClassificationChangedData: function(aResult, vPanelid, oView) {
		//string for no data maintained
		var sNodata = this.i18n.getText("Nodata");
		var i, j, sAttr;
		this.aClassificationDetailData = $.extend(true, {}, aResult);
		var sClasscontextdesc = this.i18n.getText("Mat_Class_Type") + "," + " " + this.i18n.getText(
			"Mat_Change_No");
		var aClassData = {
			results: []
		};
		var aCharData = {
			results: []
		};
			var oDataItems = {
			EntityDesc: "",
			Entity: "",
			AttributeDesc: "",
			Context:"",
			NewValue: "",
			OldValue: "",
			NewValueText: "",
			OldValueText: "",
			VALID_FROM: "",
			CLASSTYPE: "",
			CLASSTYPE__TXT:"",
			Change_Number:"",
			ChangeKey:""
		};
	if (aResult.data.MATERIAL2CLASSTYPERel.results.length > 0) {
			for (j = 0; j < aResult.data.MATERIAL2CLASSTYPERel.results.length; j++) {
				for (i = 0; i < aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results.length; i++) {
					sAttr = aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].Attribute;
					if (sAttr === 'CLASS') {
						//making the oldvalue null as for classes we are just showing just added or deleted
						aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].OldValue = "";
						if (aResult.data.MATERIAL2CLASSTYPERel.results[j].CHANGENO !== "" && aResult.data.MATERIAL2CLASSTYPERel.results[j].VALID_FROM !==
							"") {
							//converting the date in dd.mm.yyyy format
							aResult.data.MATERIAL2CLASSTYPERel.results[j].VALID_FROM = fcg.mdg.approvecrv2.util.Formatter.matDateFormat(
								aResult.data.MATERIAL2CLASSTYPERel.results[j].VALID_FROM);
						oDataItems.VALID_FROM=aResult.data.MATERIAL2CLASSTYPERel.results[j].VALID_FROM;
							this.vVaidFromflag = 1;
							oDataItems.ChangeKey = aResult.data.MATERIAL2CLASSTYPERel.results[j].CLASSTYPE__TXT
								+" " + "(" + aResult.data.MATERIAL2CLASSTYPERel.results[j].CLASSTYPE + ")" + "," + " " + aResult.data.MATERIAL2CLASSTYPERel.results[
									j].CHANGENO + " " + "(" + oDataItems.VALID_FROM + ")";
							oDataItems.Entity = sClasscontextdesc;
							oDataItems.EntityDesc = aResult.data.MATERIAL2CLASSTYPERel.results[j].CHANGENO;
							//To show the description of value and code together in a single row, concatenate the values
							oDataItems.AttributeDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(
								aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData
								.results[i].NewValue, aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].NewValueText);
						} else {
							
							oDataItems.ChangeKey = aResult.data.MATERIAL2CLASSTYPERel.results[j].CLASSTYPE__TXT +
								" " + "(" + aResult.data.MATERIAL2CLASSTYPERel.results[j].CLASSTYPE + ")";
							oDataItems.Entity = this.i18n.getText(
								"Mat_Class_Type");
								//if change no and valid from is not there then assign it not maintained
							oDataItems.EntityDesc = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
								.getNotMaintString();
							oDataItems.VALID_FROM=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
								.getNotMaintString();
							//To show the description of value and code together in a single row, concatenate the values
							oDataItems.AttributeDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].NewValue,
							 aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].NewValueText);
						}
						if (aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].EntityAction === fcg.mdg.approvecrv2.DomainSpecParts.Material
							.Material.getCreateEntityAction()) {

							oDataItems.NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
								.getAddedInstanceString();
						}
						if (aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].EntityAction === fcg.mdg.approvecrv2.DomainSpecParts.Material
							.Material.getDeleteEntityAction()) {
							oDataItems.NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
								.getDeletedInstanceString();
						}

						//setting the context as the class type to fetch the detail in the s4 page and getting the key from this field
						oDataItems.Context = aResult.data.MATERIAL2CLASSTYPERel.results[
							j].CLASSTYPE;
						//GETTING THE DESCRIPTION OF CLASSTYPE
						oDataItems.CLASSTYPE__TXT = aResult.data.MATERIAL2CLASSTYPERel.results[
							j].CLASSTYPE__TXT;
						var oDataClassItems =$.extend(true, {}, oDataItems);
						aClassData.results.push(oDataClassItems);
						//	oDataItems = [];

					} else {
						if (aResult.data.MATERIAL2CLASSTYPERel.results[j].CHANGENO !== "" && aResult.data.MATERIAL2CLASSTYPERel.results[j].VALID_FROM !==
							"") {
								oDataItems.AttributeDesc=aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].AttributeDesc;
							// if date already changed then no need to change again
							if (this.vVaidFromflag === 0) {
								aResult.data.MATERIAL2CLASSTYPERel.results[j].VALID_FROM = fcg.mdg.approvecrv2.util.Formatter.matDateFormat(
									aResult.data.MATERIAL2CLASSTYPERel.results[j].VALID_FROM);
							}
							oDataItems.VALID_FROM=aResult.data.MATERIAL2CLASSTYPERel.results[j].VALID_FROM;
							oDataItems.ChangeKey =
								aResult.data.MATERIAL2CLASSTYPERel.results[j].CLASSTYPE__TXT + " " + "(" + aResult.data.MATERIAL2CLASSTYPERel.results[
									j].CLASSTYPE + ")" + "," + " " + aResult.data.MATERIAL2CLASSTYPERel.results[j].CHANGENO + " " + "(" + aResult.data.MATERIAL2CLASSTYPERel
								.results[j].VALID_FROM + ")";

							oDataItems.Entity = this.i18n.getText("Mat_Class_Type") + "," + " " +this.i18n.getText("Mat_Change_No");
							
								
							oDataItems.EntityDesc = aResult.data.MATERIAL2CLASSTYPERel.results[
								j].CHANGENO;
							oDataItems.NewValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(
								aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData
								.results[i].NewValue, aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].NewValueText);
						oDataItems.OldValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].OldValue,
								 aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].OldValueText);
						} else {
							oDataItems.AttributeDesc=aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].AttributeDesc;
							oDataItems.ChangeKey = aResult.data.MATERIAL2CLASSTYPERel.results[j].CLASSTYPE__TXT +
								" " + "(" + aResult.data.MATERIAL2CLASSTYPERel.results[j].CLASSTYPE + ")";
							oDataItems.Entity = this.i18n.getText("Mat_Class_Type");
							oDataItems.EntityDesc = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
								.getNotMaintString();
								oDataItems.VALID_FROM=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
								.getNotMaintString();
						}
						if (aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].NewValue === "") {
							oDataItems.NewValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
								.getDeletedAttributeString();

						} else {
							oDataItems.NewValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(
								aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData
								.results[i].NewValue, aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData
								.results[i].NewValueText);
						}
						if (aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData.results[i].OldValue === "") {
							oDataItems.OldValue = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material
								.getNotMaintString();
						} else {
							oDataItems.OldValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(
								aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData
								.results[i].OldValue, aResult.data.MATERIAL2CLASSTYPERel.results[j].ChangeData
								.results[i].OldValueText);
						}
						oDataItems.Context = aResult.data.MATERIAL2CLASSTYPERel.results[
							j].CLASSTYPE;
						//GETTING THE DESCRIPTION OF CLASSTYPE
						oDataItems.CLASSTYPE__TXT = aResult.data.MATERIAL2CLASSTYPERel.results[
							j].CLASSTYPE__TXT;
								var oDataCharItems =$.extend(true, {}, oDataItems);
						aCharData.results.push(oDataCharItems);
						//	oDataItems = [];
					}
				}
			}
		}

			sap.ui.getCore().byId("matClassificationChangedPanel").removeAllContent();
		if (aClassData.results.length > 0) {
				var oItemTempClassification = this.createClassTableTemplate();
			//loading the fragment if the data is there
			this.omatClassTable = "";
			this.omatClassTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatClassifictionChangeTable', this);
			sap.ui.getCore().byId("matClassificationChangedPanel").addContent(
				this.omatClassTable);
			this.omatClassTable.setGrowing(true);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.omatClassTable, this.i18n.getText("Mat_Class"));
			//binding for classification  data
		
			oItemTempClassification.attachPress({
				Entity: aClassData,
				name: 'matClassChangedDetail'
			}, oView.navtoSubDetail, oView);
			var oClassModel = new sap.ui.model.json.JSONModel();
			oClassModel.setData(aClassData);
			this.omatClassTable.setModel(oClassModel);
			this.omatClassTable.bindItems('/results', oItemTempClassification, '', '');
		}
		if (aCharData.results.length > 0) { //loading the fragment if the data is there
			var oItemTempChar = this.createTableTemplate(); // Get the item template
			this.omatCharTable = "";
			this.omatCharTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matClassificationChangedPanel").addContent(
				this.omatCharTable);
			this.omatCharTable.setGrowing(true);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.omatCharTable, this.i18n.getText("Mat_Class_Characteristic"));
			//binding for characteristic data
			
			oItemTempChar.attachPress({
				Entity: aCharData,
				name: 'matCharChangedDetail'
			}, oView.navtoSubDetail, oView);
			var oCharModel = new sap.ui.model.json.JSONModel();
			oCharModel.setData(aCharData);
			this.omatCharTable.setModel(oCharModel);
			this.omatCharTable.bindItems('/results', oItemTempChar, '', '');
		}
		if (aCharData.results.length === 0 && aClassData.results.length === 0) {
			var oPanelclass = sap.ui.getCore().byId("matClassificationChangedPanel");
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(oPanelclass, sNodata);
		}
	},
	FormatDateNewVal: function(sNewValue) {
		if (sNewValue === "00.00.0000" || sNewValue === "00,00,0000") {
			return fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeletedAttributeString();
		} else {
			return sNewValue;
		}

	},
	FormatDateOldVal: function(sOldValue) {
		if (sOldValue === "00.00.0000" || sOldValue === "00,00,0000") {
			return "";
		} else {
			return sOldValue;
		}
	},
	getUomChangedData: function() {
		return this.vUomChngData;
	},
	getChangedWeightData: function(aWeightData,vEan,vAltUom,sUnitMsrLabel,aContextLabel,UnitOfMeasure)
	{
		var sAttr = aWeightData.Attribute;
					var	vNewVal=aWeightData.NewValue;
					var	vOldVal=aWeightData.OldValue;
					var	vNewValTxt=aWeightData.NewValueText;
					var	vOldValTxt=aWeightData.OldValueText;
						aWeightData.OldValue = this.getoldValueZeroes(vOldVal);
						aWeightData.NewValue = this.getnewValueZeroes(vNewVal);
								if (vOldVal !== "" && vOldValTxt !==""  && aWeightData.OldValue !== "(" + this.i18n.getText("PC_NOT_MAIN") + ")") {
								aWeightData.OldValue =aWeightData.OldValue + " " + aWeightData.OldValueText;
								aWeightData.OldValueText = "";
								}
									if (vNewVal !== "" && vNewValTxt !=="" && aWeightData.NewValue !== fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDeletedAttributeString()) {
								aWeightData.NewValue=aWeightData.NewValue  + " " + aWeightData.NewValueText;
								aWeightData.NewValueText = "";
								}
									if (vEan === "") {
										aWeightData.ChangeKey = vAltUom;
										aWeightData.Entity = sUnitMsrLabel;
									} else {
										aWeightData.ChangeKey = vAltUom + "," + " " +
											vEan;
										aWeightData.Entity = aContextLabel;
									}
									aWeightData.UnitOfMeasure=UnitOfMeasure;
							var aData=$.extend(true, {}, aWeightData);
								return aData;
	}

};