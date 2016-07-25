/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");

fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate = {
	oMaterialCreateForm: "",
	oMaterialPlantTable: "",
	oMaterialPlantForm: "",
//	oMaterialSalesForm: "",
	flag: 0,
	oSalesTableForm: "",
	aSales: "", 
	aSalesDetailData: "",
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
	oSalesTableS4Details: "",
	oS3View: "",
	aSalesdata: "",
	SalesOrgHeaderTxt: "",
	aSalesTaxTextData: "",
	vNoDataTxt: "",
	oS3Controller:"",
	oMatBasChangeController: "",
	//Initialize the material basic data create fragment and load it into the create layout of S3 screen
	load_General_Data: function(oS3Controller) {
		this.oMatBasChangeController = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getInstance();
		this.oMatBasChangeController.aClassificationDetailData = "";
		this.oS3Controller = oS3Controller;
		this.vNoDataTxt = this.i18n.getText("NodataCreate");
		//destroying the basicdata form to remove the duplicate id issue
		try {
			sap.ui.getCore().byId("matCreateLayout").destroy();
		} catch (err) {}
		if (this.oMaterialCreateForm === "") {
			this.oMaterialCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialBasicDataCreate', fcg.mdg.approvecrv2.util.Formatter);
		} else {
			this.oMaterialCreateForm.destroy();
			this.oMaterialCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialBasicDataCreate', fcg.mdg.approvecrv2.util.Formatter);
		}
		sap.ui.getCore().byId("materialDataLayout").removeAllContent();
		sap.ui.getCore().byId("materialchgmngLayout").removeAllContent();

		sap.ui.getCore().byId("materialDataLayout").addContent(this.oMaterialCreateForm);
			if (sap.ui.getCore().byId("materialPanelDataLayout") !== undefined) {
			sap.ui.getCore().byId("materialPanelDataLayout").destroy();
		}
			if (sap.ui.getCore().byId("materialChangedDataLayout") !== undefined) {
			sap.ui.getCore().byId("materialChangedDataLayout").destroy();
		}
			if (sap.ui.getCore().byId("materialchgmngLayout") !== undefined) {
			sap.ui.getCore().byId("materialchgmngLayout").destroy();
		}

		//CHECKING FOR PURCHASING HIDE/UNHIDE
		var vPurchFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('E');
		if (vPurchFlag === false) {
			if (sap.ui.getCore().byId("matPurchasingPanel") !== undefined) {
				sap.ui.getCore().byId("matPurchasingPanel").destroy();
			}
		}
		//CHECKING FOR cLASSIFICATION HIDE/UNHIDE
		var vClassFlag = fcg.mdg.approvecrv2.util.Formatter.getMatVisibiltyBasedOnParameter('C');
		if (vClassFlag === false) {
			if (sap.ui.getCore().byId("matClassificationPanel") !== undefined) {
				sap.ui.getCore().byId("matClassificationPanel").destroy();
			}
		}
	},
	//basic data display
		displayGeneralData: function(aResult, oView) {
		//Create Json Model and set the control to Json model
		if (aResult.data.MATERIAL2MATCHGMNGRel.results.length > 0) {
			//change management data is there then destroy core title
			var oChngMgmtModel = new sap.ui.model.json.JSONModel();
			oChngMgmtModel.setData(aResult.data.MATERIAL2MATCHGMNGRel.results[0]);
			sap.ui.getCore().byId("Txt_ECOCHGMNG").setModel(oChngMgmtModel);
			sap.ui.getCore().byId("Txt_VALID_FROM").setModel(oChngMgmtModel);
			sap.ui.getCore().byId("Txt_REVCHGMNG").setModel(oChngMgmtModel);
			sap.ui.getCore().byId("CreateMatATPCoreTitle").destroy();
			sap.ui.getCore().byId("idGroupingCoreTitle").destroy();
			sap.ui.getCore().byId("idmatDesign_DataCoreTitle").destroy();
			sap.ui.getCore().byId("idMat_ConfigurationCoreTitle").destroy();
			sap.ui.getCore().byId("idMat_EnvironmentCoreTitle").destroy();

		}
		// if change management data  is not  there then destroy title
		else {
			sap.ui.getCore().byId("CreateMatATPTitle").destroy();
			sap.ui.getCore().byId("idGrouping").destroy();
			sap.ui.getCore().byId("idmatDesign_Data").destroy();
			sap.ui.getCore().byId("idMat_Configuration").destroy();
			sap.ui.getCore().byId("idMat_Environment").destroy();
		}
		//bindinding general data
		var oDetailModel = new sap.ui.model.json.JSONModel();
		//HANDLING SERIALIZATION LEVEL IF THE VALUE IS NULL AND HAVE SOME DESCRIPTION
		if (aResult.data.SERLV === "") {
			aResult.data.SERLV = aResult.data.SERLV__TXT;
			aResult.data.SERLV__TXT = "";
		}
		oDetailModel.setData(aResult.data);
		sap.ui.getCore().byId("matBasicDataForm").setModel(oDetailModel);
		this.hideSection(this.oS3Controller);
		sap.ui.getCore().byId("matGtinPanel").attachExpand("", oView.onPanelExpand, oView);
		if (sap.ui.getCore().byId("matPurchasingPanel") !== undefined) {
			sap.ui.getCore().byId("matPurchasingPanel").attachExpand("", oView.onPanelExpand, oView);
		}
		sap.ui.getCore().byId("matNotesPanel").attachExpand("", oView.onPanelExpand, oView);
		if (sap.ui.getCore().byId("matClassificationPanel") !== undefined) {
			sap.ui.getCore().byId("matClassificationPanel").attachExpand("", oView.onPanelExpand, oView);
		}
			//extension hook for expanding the new added panel 
   this.oS3Controller.matHookModifyPanelExpand(oView);
	},
	//bindinding the panel data
	bindPanelData: function(aResult, vPanelId, oView) {
		if (vPanelId === 'matGtinPanel') { //Create GTIN table

			var ostrResults = {
				dataitems: []
			};
			if (aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results.length > 0 || aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel
				.results.length > 0) {

				ostrResults = this.getGtinData(aResult);
				this.getGtiinModel(ostrResults, oView);
			// Dimension Table Personalization
			// get the table control and the button control
			var oDimensionTabl = sap.ui.getCore().byId("matDimensionTable");
			var oDimensionPersButton = sap.ui.getCore().byId("DimensionpersIcon");
			var oItem = "/dataitems";
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oItem, oDimensionTabl, oDimensionPersButton);
			} else {
				var paneldim = sap.ui.getCore().byId("matGtinPanel");
				this.setNoDataText(paneldim, this.vNoDataTxt);
			}
		}
		if (vPanelId === 'matClassificationPanel') {
			var ocombobox = sap.ui.getCore().byId("Combo_Class_Type");
			var oClfChangeno = sap.ui.getCore().byId("matClfChangeno");
			var oDataItems;
			var vNoCC = "";
			if (aResult !== null && aResult.data.MATERIAL2CLASSTYPERel.results.length > 0 && aResult !== undefined) {
				oDataItems = [];
				var oclassdata = [];
				ostrResults = {
					dataitems: []
				};
				var oDataItemschangeno = [];
				var ochngedata = [];

				for (var i = 0; i < aResult.data.MATERIAL2CLASSTYPERel.results.length; i++) {
					ochngedata = {
						"changeno": aResult.data.MATERIAL2CLASSTYPERel.results[i].CHANGENO,
						"validfrom": aResult.data.MATERIAL2CLASSTYPERel.results[i].VALID_FROM
					};

					if (oDataItemschangeno.length !== 0) {
						var vFound = false;
						for (var j = 0; j < oDataItemschangeno.length; j++) {
							if (oDataItemschangeno[j].changeno === ochngedata.changeno) {
								vFound = true;
								break;
							}
						}
						if (vFound === false) {
							oDataItemschangeno.push(ochngedata);
						}
					} else {
						oDataItemschangeno.push(ochngedata);
					}

					oclassdata = {
						"classtype": aResult.data.MATERIAL2CLASSTYPERel.results[i].CLASSTYPE,
						"classtype_txt": aResult.data.MATERIAL2CLASSTYPERel.results[i].CLASSTYPE + " - " + aResult.data.MATERIAL2CLASSTYPERel.results[i].CLASSTYPE__TXT
					};

					if (oDataItems.length !== 0) {
						var vFound = false;
						for (var j = 0; j < oDataItems.length; j++) {
							if (oDataItems[j].classtype === oclassdata.classtype) {
								vFound = true;
								break;
							}
						}
						if (vFound === false) {
							oDataItems.push(oclassdata);
						}
					} else {
						oDataItems.push(oclassdata);
					}
					if (aResult.data.MATERIAL2CLASSTYPERel.results[i].DEFAULT_CLASSTYPE === true) {
						var vSelClassType = aResult.data.MATERIAL2CLASSTYPERel.results[i].CLASSTYPE;
						ocombobox.setSelectedKey(vSelClassType);
						var vSelChangeno = aResult.data.MATERIAL2CLASSTYPERel.results[i].CHANGENO;
						oClfChangeno.setSelectedKey(vSelChangeno);
						sap.ui.getCore().byId("matCCValidity").setValue(fcg.mdg.approvecrv2.util.Formatter.matDateFormat(aResult.data.MATERIAL2CLASSTYPERel.results[
							i].VALID_FROM));
						var oTableChar = sap.ui.getCore().byId("idCharacteristicTable");
						var oTableClass = sap.ui.getCore().byId("idClasificationTable");
						this.getDataOnSelection(vSelClassType, vSelChangeno, oTableClass, oTableChar, aResult.data.MATERIAL2CLASSTYPERel.results[i]);
					}
				}

				var sObjclass = {
					results: oDataItems
				};
				var sObjchnge = {
					results: oDataItemschangeno
				};

				if (sObjchnge.results.length !== 0) {
					// check for change n    
					var changeNo = sObjchnge.results;

					if (sObjchnge.results.length === 1 && changeNo[0].changeno === "") {
						oClfChangeno.setVisible(false);
						sap.ui.getCore().byId("matCCValidity").setVisible(false);
					} else {
						oClfChangeno.bindProperty("editable", "false");
						var oDetailModelchnge = new sap.ui.model.json.JSONModel();
						oDetailModelchnge.setData(sObjchnge);
						oClfChangeno.setModel(oDetailModelchnge);
						var oItemTemplate1 = new sap.ui.core.ListItem();
						oItemTemplate1.bindProperty("text", "changeno");
						oItemTemplate1.bindProperty("key", "changeno");
						oClfChangeno.bindItems('/results', oItemTemplate1, '', '');
						oClfChangeno.attachSelectionChange({
							Entity: aResult
						}, this.onChangeNoselection, this);
					}
				} else {
					oClfChangeno.setVisible(false);
					sap.ui.getCore().byId("matCCValidity").setVisible(false);
				}

				ocombobox.bindProperty("editable", "false");
				var oDetailModel = new sap.ui.model.json.JSONModel();
				oDetailModel.setData(sObjclass);
				ocombobox.setModel(oDetailModel);
				var oItemTemplate2 = new sap.ui.core.ListItem();
				oItemTemplate2.bindProperty("text", "classtype_txt");
				oItemTemplate2.bindProperty("key", "classtype");
				ocombobox.bindItems('/results', oItemTemplate2, '', '');
				// if(sObjclass.results.length === 1){
				// 	ocombobox.setEnabled(false);
				// }
				sap.ui.getCore().byId("Combo_Class_Type").attachSelectionChange({
					Entity: aResult
				}, this.OnFilterCombo, this);
			} else {

				var vPanelid = sap.ui.getCore().byId("matClassificationPanel");
				this.setNoDataText(vPanelid, this.vNoDataTxt);
			}
		}
		if (vPanelId === 'matPurchasingPanel') {
			var generaldata = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
			if (aResult[0].data !== null || aResult.data !== undefined) {
					//binding data fo purchasing from different entities
			if(aResult[0].data.VABME==="" && aResult[0].data.VABME__TXT!=="")
			{
			aResult[0].data.VABME=aResult[0].data.VABME__TXT;
			aResult[0].data.VABME__TXT="";
			}
			if(generaldata.data.NRFHG==="" && generaldata.data.NRFHG__TXT!=="")
			{
			generaldata.data.NRFHG=generaldata.data.NRFHG__TXT;
			generaldata.data.NRFHG__TXT="";
			}
			
				var Result = aResult[0].data;
				oDetailModel = new sap.ui.model.json.JSONModel();
				oDetailModel.setData(Result);
				sap.ui.getCore().byId("matpurchasingform").setModel(oDetailModel);
				var qtmngoDetailModel = new sap.ui.model.json.JSONModel();
				qtmngoDetailModel.setData(aResult[1].data);
			
				var generalmodel = new sap.ui.model.json.JSONModel();
				generalmodel.setData(generaldata.data);
				sap.ui.getCore().byId("Txt_NRFHG").setModel(generalmodel);
				sap.ui.getCore().byId("Txt_QMPUR").setModel(qtmngoDetailModel);
				sap.ui.getCore().byId("Txt_RBNRM").setModel(qtmngoDetailModel);
				this.hideGeneralPurchSection(this.oS3Controller);
			} else {
				var panelpur = sap.ui.getCore().byId("matPurchasingPanel");
				this.setNoDataText(panelpur, this.vNoDataTxt);
			}

		}
		if (vPanelId === 'matNotesPanel') {
			this.GetNotesData(aResult, oView);
		}
		
		//controller hook to add new panel :define hook method in S3 controller with parameters: aResult, vPanelId, oView
     this.oS3Controller.matHookModifyBindPanelData(aResult,vPanelId, oView);

	},
	//getting general data query for create scenario
	getGeneralDataQuery: function(matNum) {
		var sQueryBasicData;
		sQueryBasicData = "/MATERIALCollection" + "('" + matNum + "')";
		return sQueryBasicData;

	},
	//binding the dat after selecting class type from combo box 
	OnFilterCombo: function(oEvent, data) {
		var sClassType = oEvent.getSource().getSelectedKey();
		var sChangeno = sap.ui.getCore().byId("matClfChangeno").getSelectedKey();
		var oTableChar = sap.ui.getCore().byId("idCharacteristicTable");
		var oTableClass = sap.ui.getCore().byId("idClasificationTable");
		this.getDataOnSelection(sClassType, sChangeno, oTableClass, oTableChar);
	},
	// OnInputHelp:function(oEvent,data)
	// {

	onChangeNoselection: function(oEvent, data) {
		var oSelectedItem = oEvent.getSource().getSelectedItem();
		var sPath = oSelectedItem.getBindingContext().getPath().slice(9.10);
		var sValidfrom = data.Entity.data.MATERIAL2CLASSTYPERel.results[sPath].VALID_FROM;
		sap.ui.getCore().byId("matCCValidity").setValue(fcg.mdg.approvecrv2.util.Formatter.matDateFormat(sValidfrom));
		var oTableChar = sap.ui.getCore().byId("idCharacteristicTable");
		var oTableClass = sap.ui.getCore().byId("idClasificationTable");
		var sChangeno = oEvent.getSource().getSelectedKey();
		var sClassType = sap.ui.getCore().byId("Combo_Class_Type").getSelectedKey();
		this.getDataOnSelection(sClassType, sChangeno, oTableClass, oTableChar);
	},

	getDataOnSelection: function(classtype, changeno, classtable, chartable, data) {
		var oDataItemschar;
		var oDataItemsclass;
		var ostrResultschar = {
			dataitems: []
		};
		var ostrResultsclass = {
			dataitems: []
		};
		var oData;
		this.oS3Controller=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
		if (data === undefined) {
			oData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMatClassData(classtype, changeno);
		} else {
			oData = data;
		}
		for (var i = 0; i < oData.CLASSTYPE2CLASSASGNRel.results.length; i++) {

			var classdata = oData.CLASSTYPE2CLASSASGNRel.results[i].CLASS;
			var class__txt = oData.CLASSTYPE2CLASSASGNRel.results[i].CLINT__TXT;
			var classstatustxt = oData.CLASSTYPE2CLASSASGNRel.results[i].STATUS__TXT;
			var classstatus = oData.CLASSTYPE2CLASSASGNRel.results[i].CLSTATUS;
			var classLongTxt = oData.CLASSTYPE2CLASSASGNRel.results[i].CLASS__TXT;
			oDataItemsclass = {
				"classdata": classdata,
				"classtatus": classstatus,
				"classtatxt": classstatustxt,
				"class__txt": class__txt,
				"classlongtxt": classLongTxt
			};
			ostrResultsclass.dataitems.push(oDataItemsclass);
		
		}
		for (var j = 0; j < oData.CLASSTYPE2VALUATIONRel.results.length; j++) {

			var characteristic = oData.CLASSTYPE2VALUATIONRel.results[j].CHARID;
			var charvalue = oData.CLASSTYPE2VALUATIONRel.results[j].ATWRT;
			var valueText = oData.CLASSTYPE2VALUATIONRel.results[j].ATAWE__TXT;
			// }
			if (charvalue !== "") {
				oDataItemschar = {
					"characteristic": characteristic,
					"charvaluetext": valueText,
					"charvalue": charvalue
				};
				ostrResultschar.dataitems.push(oDataItemschar);
			}
			//                                            }
		}
		//getting the changed data used for bolding the cell
		var classchangeddata = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getClassificationChangeData();
		var oClassChangedModel;
		if (classchangeddata !== "") {
			oClassChangedModel = new sap.ui.model.json.JSONModel();
			oClassChangedModel.setData(classchangeddata);
		}
		if (ostrResultschar.dataitems.length > 0) {
			var oCharModel = new sap.ui.model.json.JSONModel();
			oCharModel.setData(ostrResultschar);
			var oItemTemp1 = this.GetCharTableTemplate(oCharModel, oClassChangedModel,this.oS3Controller);
			chartable.setModel(oCharModel);
			chartable.bindItems('/dataitems', oItemTemp1, '', '');
			chartable.setVisible(true);
		} else {
			chartable.setVisible(false);

		}

		if (ostrResultsclass.dataitems.length > 0) {
			var oClassModel = new sap.ui.model.json.JSONModel();
			oClassModel.setData(ostrResultsclass);
			var oItemTemp = this.GetClassTableTemplate(oClassModel, oClassChangedModel,this.oS3Controller); // Get the item template
			classtable.setModel(oClassModel);
			classtable.bindItems('/dataitems', oItemTemp, '', '');
			classtable.setVisible(true);
		} else {
			classtable.setVisible(false);
		}
		//in change scenario if no class and characteristic is there for the class type then show no class assigned
		if(classtable.getVisible() === false && chartable.getVisible() === false)
		{
			if(sap.ui.getCore().byId("matClassificationChangeLayout")!==undefined)
			{
				var oLayout=sap.ui.getCore().byId("matClassificationChangeLayout");
				var sNoClassAssigned=this.i18n.getText("Mat_No_Class");
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(oLayout,sNoClassAssigned);
			}
		}
	},

	GetClassTableTemplate: function(oClassModel, oClassChangedModel,oS3Controller) {
		var oItemTempNotes = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: 'classdata',
						formatter: function() {
							var desc = oClassModel.getProperty("class__txt", this.getBindingContext());
							var key = oClassModel.getProperty("classdata", this.getBindingContext());
							if (key === "" && desc === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								if (oClassChangedModel !== "" || oClassChangedModel !== undefined) {
									fcg.mdg.approvecrv2.util.Formatter.handleCellMatclassBolding(this, oClassModel, "CLASS", oClassChangedModel);

								}
								return fcg.mdg.approvecrv2.util.Formatter.noValue(fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc));
								//	return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),
				new sap.m.Text({ //Column which identifies each record with Language code and Description
					text: {
						path: "classtatus",
						formatter: function() {
							var desc = oClassModel.getProperty("classtatxt", this.getBindingContext());
							var key = oClassModel.getProperty("classtatus", this.getBindingContext());
							if (key === "" && desc === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								if (oClassChangedModel !== "" || oClassChangedModel !== undefined) {
									fcg.mdg.approvecrv2.util.Formatter.handleCellMatclassBolding(this, oClassModel, "CLASS", oClassChangedModel);

								}
								return fcg.mdg.approvecrv2.util.Formatter.noValue(fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc));
							}
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "classlongtxt",
						//	formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
						formatter: function() {
							if (oClassChangedModel !== "" || oClassChangedModel !== undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handleCellMatclassBolding(this, oClassModel, "CLASS", oClassChangedModel);

							}
							return fcg.mdg.approvecrv2.util.Formatter.noValue(oClassModel.getProperty('classlongtxt', this.getBindingContext()));
							//	return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
						}
					}
				})
			]
		});
					var extoItemTemp = oS3Controller.matHookGetClassificationTableTemplate(oItemTempNotes);
			if(extoItemTemp !== undefined){
				oItemTempNotes = extoItemTemp;
		}
		return oItemTempNotes;
	},
	GetCharTableTemplate: function(oCharModel, oClassChangedModel,oS3Controller) {
		var oItemTempNotes = new sap.m.ColumnListItem({
			cells: [
				new sap.m.Text({
					text: {
						path: "characteristic",
						formatter: function() {
							if (oClassChangedModel !== "" || oClassChangedModel !== undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handleCellMatcharBolding(this, oCharModel, "VALUATION", oClassChangedModel);
							}
							return fcg.mdg.approvecrv2.util.Formatter.noValue(oCharModel.getProperty('characteristic', this.getBindingContext()));
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "charvalue",
						formatter: function() {
							if (oClassChangedModel !== "" || oClassChangedModel !== undefined) {
								fcg.mdg.approvecrv2.util.Formatter.handleCellMatcharBolding(this, oCharModel, "VALUATION", oClassChangedModel);
							}
							//return fcg.mdg.approvecrv2.util.Formatter.noValue(oCharModel.getProperty('charvalue', this.getBindingContext()));
							var key = oCharModel.getProperty("charvalue", this.getBindingContext());
							var desc = oCharModel.getProperty("charvaluetext", this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.noValue(fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc));
						}
					}
				})
			]
		});
			var extoItemTemp = oS3Controller.matHookGetCharTableTemplate(oItemTempNotes);
			if(extoItemTemp !== undefined){
				oItemTempNotes = extoItemTemp;
		}
		return oItemTempNotes;
	},

	//	no data setting if no data will be there for the panel
	setNoDataText: function(vPanelId, vNoData) {
		var vLayout = new sap.m.VBox({
			items: [new sap.m.Text(),
				new sap.m.Text({
					text: vNoData
				}),
				new sap.m.Text()
			]
		});
		vLayout.setAlignItems("Center");
		vLayout.setJustifyContent("Center");
		vPanelId.destroyContent();
		vPanelId.addContent(vLayout);
	},

	GetNotesTableTemplate: function(oGTINTxtModel) {
		var oItemTempNotes = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: "{LANGUCODE__TXT} ({LANGUCODE})"
				}),
				new sap.m.Text({ //Column which identifies each record with Language code and Description
					text: {
						path: "LONGTEXT",
						formatter: function() {
							var desc = oGTINTxtModel.getProperty("LONGTEXT", this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.Truncate(desc);
						}
					}
				})
			]
		});
		var extoItemTemp = this.oS3Controller.matHookgetNotesTableTemplate(oItemTempNotes);
			if(extoItemTemp !== undefined){
			oItemTempNotes = extoItemTemp;
			}
		return oItemTempNotes;
	},

	GetGTINTableTemplate: function(oGTINModel) {
		var oItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
				new sap.m.Text({
					text: {
						path: "quantity"
					}
				}),
				new sap.m.Text({ //Column which identifies each record with Language code and Description
					text: {
						path: 'unitofmeasure',
						formatter: function() {
							var desc = oGTINModel.getProperty("unitofmeasure_txt", this.getBindingContext());
							var key = oGTINModel.getProperty("unitofmeasure", this.getBindingContext());
							if (key === "" && desc === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),
				new sap.m.Text({
					text: {
						path: "basequantity"
					}
				}),

				new sap.m.Text({
					text: {
						path: 'baseunitofmeasure',
						formatter: function() {
							var desc = oGTINModel.getProperty("baseunitofmeasure_txt", this.getBindingContext());
							var key = oGTINModel.getProperty("baseunitofmeasure", this.getBindingContext());
							if (key === "" && desc === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),

				new sap.m.Text({
					text: {
						path: "eanupc"
					}
				}),
				new sap.m.Text({
					text: {
						path: "hpean",
						formatter: fcg.mdg.approvecrv2.util.Formatter.checkBoxTable
					}
				})

			]
		});
			var extoItemTemp = this.oS3Controller.matHookgetGtinTableTemplate(oItemTemp,oGTINModel);
			if(extoItemTemp !== undefined){
			oItemTemp = extoItemTemp;
			}
		return oItemTemp;
	},
	//Hiding a section if there are no values present for the fields present in this section
	hideSection: function(oS3Controller) {
		
		//Controller hook here by just calling the method without any parameters except change management	:refer ccdetail.controller.js		//ChANGE MANAGEMENT
		
			if (
				sap.ui.getCore().byId("Txt_ECOCHGMNG").getVisible() === false&&
				sap.ui.getCore().byId("Txt_VALID_FROM").getVisible() === false &&
				sap.ui.getCore().byId("Txt_REVCHGMNG").getVisible() === false) {
				//	this.oS3Controller.ccHookHideCreateAddressSection();
				if (sap.ui.getCore().byId("CreateChngMgmttit") !== undefined) {
				 sap.ui.getCore().byId("CreateChngMgmttit").destroy();
			sap.ui.getCore().byId("Mat_Basic_Data_title").destroy();
				}
		}
		var vAtpFlag=oS3Controller.matHideATPSection();
		if(vAtpFlag===false)
		{
		
		// 			atp
		if (sap.ui.getCore().byId("Txt_KOSCH").getVisible() === false) {
			//	this.oS3Controller.ccHookHideCreateCommSection();
			if (sap.ui.getCore().byId("CreateMatATPTitle") !== undefined) {
				sap.ui.getCore().byId("CreateMatATPTitle").destroy();
			}
			if (sap.ui.getCore().byId("CreateMatATPCoreTitle") !== undefined) {
				sap.ui.getCore().byId("CreateMatATPCoreTitle").destroy();
			}
		}
		}
			var vGroupingFlag=oS3Controller.matHideGroupingSection();
		if(vGroupingFlag===false)
		{
		// 			grouping
		if (sap.ui.getCore().byId("Txt_EXTWG").getVisible() === false &&
			sap.ui.getCore().byId("Txt_PRDHA").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MTPOSMARA").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MAGRVMARA").getVisible() === false) {
			//	this.oS3Controller.ccHookHideCreateAddressSection();
			if (sap.ui.getCore().byId("idGrouping") !== undefined) {
				sap.ui.getCore().byId("idGrouping").destroy();
			}
			if (sap.ui.getCore().byId("idGroupingCoreTitle") !== undefined) {
				sap.ui.getCore().byId("idGroupingCoreTitle").destroy();
			}
		}
}
	var vDesignFlag=oS3Controller.matHideDesignDataSection();
		if(vDesignFlag===false)
		{
		// 			design data
		if (sap.ui.getCore().byId("Txt_LABOR").getText() === "" &&
			sap.ui.getCore().byId("Txt_NORMT").getText() === "" &&
			sap.ui.getCore().byId("Txt_WRKST").getText() === "" &&
			sap.ui.getCore().byId("Txt_FERTH").getText() === "" &&
			sap.ui.getCore().byId("Txt_FORMT").getText() === "" &&
			sap.ui.getCore().byId("Txt_CADKZ").getVisible() === false) {
			//	this.oS3Controller.ccHookHideCreateAddressSection();
			if (sap.ui.getCore().byId("idmatDesign_Data") !== undefined) {
				sap.ui.getCore().byId("idmatDesign_Data").destroy();
			}
			if (sap.ui.getCore().byId("idmatDesign_DataCoreTitle") !== undefined) {
				sap.ui.getCore().byId("idmatDesign_DataCoreTitle").destroy();
			}

		}
		}
			var vConfigFlag=oS3Controller.matHideConfigurationSection();
		if(vConfigFlag===false)
		{
		// 			configuration
		if (sap.ui.getCore().byId("Txt_SATNR").getVisible() === false &&
			sap.ui.getCore().byId("Txt_KZKFG").getVisible() === false) {
			if (sap.ui.getCore().byId("idMat_Configuration") !== undefined) {
				sap.ui.getCore().byId("idMat_Configuration").destroy();
			}
			if (sap.ui.getCore().byId("idMat_ConfigurationCoreTitle") !== undefined) {
				sap.ui.getCore().byId("idMat_ConfigurationCoreTitle").destroy();
			}
		}
		}
		var vEnvFlag=oS3Controller.matHideEnvironmentSection();
		if(vEnvFlag===false)
		{
		// 			environment
		if (sap.ui.getCore().byId("Txt_KZUMW").getVisible() === false &&
			sap.ui.getCore().byId("Txt_PROFL").getVisible() === false) {
			if (sap.ui.getCore().byId("idMat_EnvironmentCoreTitle") !== undefined) {
				sap.ui.getCore().byId("idMat_EnvironmentCoreTitle").destroy();
			}
			if (sap.ui.getCore().byId("idMat_Environment") !== undefined) {
				sap.ui.getCore().byId("idMat_Environment").destroy();
			}
		}
		}
	},

	hideGeneralPurchSection: function(oS3Controller) {
	var vProcurementFlag=oS3Controller.matHideProcurementSection();
		if(vProcurementFlag===false)
		{
		// procurement
		if (sap.ui.getCore().byId("Txt_MFRPN").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MPROF").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MFRNR").getVisible() === false) {
			if (sap.ui.getCore().byId("idPur_Procurement") !== undefined) {
				sap.ui.getCore().byId("idPur_Procurement").destroy();
			}
		}
		}
			var vQualityFlag=oS3Controller.matHideQualitySection();
		if(vQualityFlag===false)
		{
		// quality
		if (sap.ui.getCore().byId("Txt_QMPUR").getVisible() === false &&
			sap.ui.getCore().byId("Txt_RBNRM").getVisible() === false) {
			if (sap.ui.getCore().byId("idPur_Quality_Management") !== undefined) {
				sap.ui.getCore().byId("idPur_Quality_Management").destroy();
			}
		}
		}
		if (sap.ui.getCore().byId("Txt_BSTME").getVisible() === false &&
			sap.ui.getCore().byId("Txt_NRFHG").getVisible() === false &&
			sap.ui.getCore().byId("Txt_BSTME").getVisible() === false &&
			sap.ui.getCore().byId("Txt_EKWSL").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MAHN1").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MAHN2").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MAHN3").getVisible() === false &&
			sap.ui.getCore().byId("Txt_WELFZ").getVisible() === false &&
			sap.ui.getCore().byId("Txt_UNTTO").getVisible() === false &&
			sap.ui.getCore().byId("Txt_UEBTO").getVisible() === false &&
			sap.ui.getCore().byId("Txt_WEPRZ").getVisible() === false &&
			sap.ui.getCore().byId("Txt_UEBTK").getVisible() === false &&
			sap.ui.getCore().byId("Txt_KZABS").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MPROF").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MFRNR").getVisible() === false &&
			sap.ui.getCore().byId("Txt_MFRPN").getVisible() === false &&
			sap.ui.getCore().byId("Txt_RBNRM").getVisible() === false &&
			sap.ui.getCore().byId("Txt_QMPUR").getVisible() === false) {
			//	sap.ui.getCore().byId("matpurchasingform").destroy();
			var panelpur = sap.ui.getCore().byId("matPurchasingPanel");
			this.setNoDataText(panelpur, this.vNoDataTxt);
		}
//provide controller hook here by just calling the method without any paramters
	},
	getGtinData: function(aResult) {
		var ostrResults = {
			dataitems: []
		};
		var i,j,vqteunit,vEanUpc,oDataItems,quantity,unitofmeasure,basequantity,baseunitofmeasure,eanupc,hpean,unitofmeasure_txt,baseunitofmeasure_txt,eancategory,
		eancategory_txt,eanvariant,vBaseUom,vBaseUom_txt,sorter;
		//getting the general data from material to get the base unit of measure
	     	var generaldata = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
				if(generaldata.data.MEINS!=="")
				{
					vBaseUom=generaldata.data.MEINS;
					vBaseUom_txt=generaldata.data.MEINS__TXT;
				}
			 else
			 	{
					 vBaseUom="";
				     vBaseUom_txt="";
				}
		for (i = 0; i < aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results.length; i++) {
			this.flag = 0;
			 vqteunit = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].QTEUNIT;
			vEanUpc = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].EAN_MARM;
			for ( j = 0; j < aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results.length; j++) {
				if (vqteunit === aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[j].QTEUNIT &&
					vEanUpc === aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[j].EAN) {

					quantity = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].UMREN;
					unitofmeasure = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].QTEUNIT;
					unitofmeasure_txt = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].QTEUNIT__TXT;
					basequantity = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].UMREZ;
					baseunitofmeasure = vBaseUom;
					baseunitofmeasure_txt = vBaseUom_txt;
					eanupc = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[j].EAN;
					hpean = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[j].HPEAN;
					eancategory = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[j].EANTP_MEA;
					eancategory_txt = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[j].EANTP_MEA__TXT;
					eanvariant = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].GTIN_VAR2;
				    sorter="ab" + unitofmeasure;
			 	//getting the oDataitem which will be binded with the table
			  oDataItems=this.getGtinoDataItems(quantity,unitofmeasure,unitofmeasure_txt,basequantity,baseunitofmeasure,baseunitofmeasure_txt,eanupc,hpean,eancategory,eancategory_txt,eanvariant,sorter);
					ostrResults.dataitems.push(oDataItems);
					this.flag = 1;
				}

			}
			if (this.flag === 0) {
				quantity = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].UMREN;
				unitofmeasure = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].QTEUNIT;
				unitofmeasure_txt = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].QTEUNIT__TXT;
				basequantity = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].UMREZ;
				baseunitofmeasure = vBaseUom;
				baseunitofmeasure_txt = vBaseUom_txt;
				eanupc = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].EAN_MARM;
				eancategory = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].NUMTP2;
				eancategory_txt = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].NUMTP2__TXT;
				eanvariant = aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[i].GTIN_VAR2;
				hpean = "";
				sorter="ab" + unitofmeasure;
				if (eanupc === undefined || eanupc === null) {
					eanupc = "";
				}
					//getting the oDataitem which will be binded with the table
				oDataItems=this.getGtinoDataItems(quantity,unitofmeasure,unitofmeasure_txt,basequantity,baseunitofmeasure,baseunitofmeasure_txt,eanupc,hpean,eancategory,eancategory_txt,eanvariant,sorter);
				ostrResults.dataitems.push(oDataItems);

			}

		}
		for (i = 0; i < aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results.length; i++) {
			this.vGtinflag = 0;
			vqteunit = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[i].QTEUNIT;
			vEanUpc = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[i].EAN;
			for (var j = 0; j < aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results.length; j++) {
				if (vqteunit === aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].QTEUNIT &&
					vEanUpc === aResult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].EAN_MARM) {
					this.vGtinflag = 1;
				}

			}
			if (this.vGtinflag === 0) {
				quantity = "";
				unitofmeasure = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[i].QTEUNIT;
				unitofmeasure_txt = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[i].QTEUNIT__TXT;
				basequantity = "";
				baseunitofmeasure = vBaseUom;
				baseunitofmeasure_txt = vBaseUom_txt;
				eanupc = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[i].EAN;
				hpean = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[i].HPEAN;
				eancategory = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[i].EANTP_MEA;
				eancategory_txt = aResult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel.results[i].EANTP_MEA__TXT;
				eanvariant = "";
				sorter="ab" + unitofmeasure;
				if (eanupc === undefined || eanupc === null) {
					eanupc = "";
				}
				//getting the oDataitem which will be binded with the table
				oDataItems=this.getGtinoDataItems(quantity,unitofmeasure,unitofmeasure_txt,basequantity,baseunitofmeasure,baseunitofmeasure_txt,eanupc,hpean,eancategory,eancategory_txt,eanvariant,sorter);
				ostrResults.dataitems.push(oDataItems);

			}
 
		}
		//in the dimension and gtin table first row should be the unit of measure and the others should be sorted on alternative unit of measure 
			for ( i = 0; i < ostrResults.dataitems.length; i++) {
				if(ostrResults.dataitems[i].unitofmeasure===baseunitofmeasure)
				{
					ostrResults.dataitems[i].sorter="aa"+ostrResults.dataitems[i].unitofmeasure;
				}
			}
		this.oGtinDetailData=ostrResults;
		return ostrResults;
	},
	getGtinDetailData:function(){
	     return this.oGtinDetailData;	
	},
		getGtiinModel: function(ostrResults, oView) {
		var oTable = sap.ui.getCore().byId("matDimensionTable");
		var oGTINModel = new sap.ui.model.json.JSONModel();
      //sorting the data items on the unit of meeasure and first row will be base unit of measure
		ostrResults.dataitems.sort(function(a,b){if(a.sorter<b.sorter){return 0;} else {return 1;} });
		oGTINModel.setData(ostrResults);
		var oItemTemp = this.GetGTINTableTemplate(oGTINModel); // Get the item template
		oItemTemp.attachPress({
			Entity: ostrResults,
			name: 'matGtinDataDetail'
		}, oView.navtoSubDetail, oView);
		oTable.setModel(oGTINModel);
		oTable.bindItems('/dataitems', oItemTemp, "", '');
	},
GetNotesData: function(aResult, oView) {
		var NotesData = [];
		var aDatabasic = [];
		var aDatacomnt = [];
		var aDataDescr = [];
		var aDataQuality = [];
		var aDataPurchOrder = [];
		//  var ODataBasic = [];
		NotesData = aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results;
		if (NotesData.length > 0) {
			for (var i = 0; i < NotesData.length; i++) {
				if (NotesData[i].TEXT_ID === "GRUN") {
					if(aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].LONGTEXT!=="")
					{
					aDatabasic.push(aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i]);
					}
				}
				if (NotesData[i].TEXT_ID === "IVER") {
					if(aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].LONGTEXT!=="")
					{
					aDatacomnt.push(aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i]);
					}
				}
				if (NotesData[i].TEXT_ID === "DSCR") {
					if(aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].LONGTEXT!=="")
					{
					aDataDescr.push(aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i]);
					}
				}
				if (NotesData[i].TEXT_ID === "PRUE") {
					if(aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].LONGTEXT!=="")
					{
					aDataQuality.push(aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i]);
					}
				}
				if (NotesData[i].TEXT_ID === "BEST") {
					if(aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].LONGTEXT!=="")
					{
					aDataPurchOrder.push(aResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i]);
					}
				}
			}
			//binding the data for basic text
			if (aDatabasic.length > 0) {
				var sObjtxt = {
					results: aDatabasic
				};
				var oTableBasicText = sap.ui.getCore().byId("matNotesBasTxtTable");
				var oGTINTxtModel = new sap.ui.model.json.JSONModel();
				oGTINTxtModel.setData(sObjtxt);
				oTableBasicText.setModel(oGTINTxtModel);
				var oItemTempNotes = this.GetNotesTableTemplate(oGTINTxtModel);
				oItemTempNotes.attachPress({
					Entity: aResult,
					name: 'matNotesDetail',
					TableKey: "BasicTxt"
				}, oView.navtoSubDetail, oView);
				oTableBasicText.bindItems('/results', oItemTempNotes, '', '');
			} else {
				sap.ui.getCore().byId("matNotesBasTxtTable").setVisible(false);
			}
			//binding the data for internal coments
			if (aDatacomnt.length > 0) {
				var sObjcomnt = {
					results: aDatacomnt
				};
				var oTableIntComent = sap.ui.getCore().byId("matNotesIntComntTable");
				var oGTINComntModel = new sap.ui.model.json.JSONModel();
				oGTINComntModel.setData(sObjcomnt);
				oTableIntComent.setModel(oGTINComntModel);
				var oItemTempIntComntNotes = this.GetNotesTableTemplate(oGTINComntModel);
				oItemTempIntComntNotes.attachPress({
					Entity: aResult,
					name: 'matNotesDetail',
					TableKey: "IntComnt"
				}, oView.navtoSubDetail, oView);
				oTableIntComent.bindItems('/results', oItemTempIntComntNotes, '', '');
			} else {
				sap.ui.getCore().byId("matNotesIntComntTable").setVisible(false);
			}
			if (aDataDescr.length > 0) {
				var sObjDescr = {
					results: aDataDescr
				};
				var oTableDescr = sap.ui.getCore().byId("matNotesDescTable");
				var oGTINDescrModel = new sap.ui.model.json.JSONModel();
				oGTINDescrModel.setData(sObjDescr);
				oTableDescr.setModel(oGTINDescrModel);
				var oItemTempDescr = this.GetNotesTableTemplate(oGTINDescrModel);
				oItemTempDescr.attachPress({
					Entity: aResult,
					name: 'matNotesDetail',
					TableKey: "Descr"
				}, oView.navtoSubDetail, oView);
				oTableDescr.bindItems('/results', oItemTempDescr, '', '');
			} else {
				sap.ui.getCore().byId("matNotesDescTable").setVisible(false);
			}
			if (aDataPurchOrder.length > 0) {
				var sObjPurch = {
					results: aDataPurchOrder
				};
				var oTablePurch = sap.ui.getCore().byId("matNotesPurchasingOrderTable");
				var oGTINPurchModel = new sap.ui.model.json.JSONModel();
				oGTINPurchModel.setData(sObjPurch);
				oTablePurch.setModel(oGTINPurchModel);
				var oItemTempPurch = this.GetNotesTableTemplate(oGTINPurchModel);
				oItemTempPurch.attachPress({
					Entity: aResult,
					name: 'matNotesDetail',
					TableKey: "PurchOrderTxt"
				}, oView.navtoSubDetail, oView);
				oTablePurch.bindItems('/results', oItemTempPurch, '', '');
			} else {
				sap.ui.getCore().byId("matNotesPurchasingOrderTable").setVisible(false);
			}
			if (aDataQuality.length > 0) {
				var sObjQuality = {
					results: aDataQuality
				};
				var oTableQuality = sap.ui.getCore().byId("matNotesQualityTable");
				var oGTINQualityModel = new sap.ui.model.json.JSONModel();
				oGTINQualityModel.setData(sObjQuality);
				oTableQuality.setModel(oGTINQualityModel);
				var oItemTempQualityNotes = this.GetNotesTableTemplate(oGTINQualityModel);
				oItemTempQualityNotes.attachPress({
					Entity: aResult,
					name: 'matNotesDetail',
					TableKey: "Quality"
				}, oView.navtoSubDetail, oView);
				oTableQuality.bindItems('/results', oItemTempQualityNotes, '', '');
			} else {
				sap.ui.getCore().byId("matNotesQualityTable").setVisible(false);
			}
		} else {
			var panelnotes = sap.ui.getCore().byId("matNotesPanel");
			this.setNoDataText(panelnotes, this.vNoDataTxt);
		}
	},
	//getting the oDataitem which will be binded with the table
	getGtinoDataItems:function(quantity,unitofmeasure,unitofmeasure_txt,basequantity,baseunitofmeasure,baseunitofmeasure_txt,eanupc,hpean,eancategory,eancategory_txt,eanvariant,sorter)
	{
		var oDataItems;
	    oDataItems = {
					"quantity": quantity,
					"unitofmeasure": unitofmeasure,
					"unitofmeasure_txt": unitofmeasure_txt,
					"basequantity": basequantity,
					"baseunitofmeasure": baseunitofmeasure,
					"baseunitofmeasure_txt": baseunitofmeasure_txt,
					"eanupc": eanupc,
					"hpean": hpean,
					"eancategory": eancategory,
					"eancategory_txt": eancategory_txt,
					"eanvariant": eanvariant,
					"sorter": sorter
				};
				return oDataItems;
	
	}
};