/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.MatBasicDataDetails", {

	oBasicDAtaGtinDetails: "",
	oBasicDAtaNotesDetails: "",
	oGeneralDataDetails: "",
	oGtinChangedDataDetails: "",
	oClassificationChangedDataDetails: "",
	oNotesChangedDataDetails: "",
	oPurchChangedDataDetails: "",
	flag: 0,
	vUnitOfMsrflag: 0,
	vUnitOfMeasure: "",
	vUnitOfMeasure__Txt: "",
	materialheader1: "",
	vGtinRowid: 0,
	oView: "",
	vRoutername: "",
	vTotalGtin: 0,
	sTableKey: "",
	Netweightsetflag: 0,
	extHookmatHookModifyRouting: null,
	extHookHideDetailDimensionSection: null,
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	onInit: function() {

		// Execute onInit of base class.
		var result = "";
		var materialheader1;
		var oS3Instance, aDecisions;
		this.Netweightsetflag = 0;
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);

		//                            // Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("MatBasicDataDetailPage").setShowNavButton(true);

		this.oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();

		this.oRouter.attachRouteMatched(function(oEvent) {

			// Get DataManager instance.
			if (oEvent.getParameter("name") === "matGtinDataDetail") {
				this.vRoutername = "matGtinDataDetail";
				// This code will be executed when the user navigates to Detail's screen.
				//setting the footer of the detail page
				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this);
				this.loadFragment();
				//geting the row no. for which row  clicked 
				var sRowId = oEvent.getParameter('arguments').Rowid;
				this.getsetGtinData(sRowId);
			}
			if (oEvent.getParameter("name") === "matNotesDetail") {

				//setting the footer of the detail page
				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this);
				this.vRoutername = "matNotesDetail";
				this.loadFragment();

				//setting the header of the detail page
				var TableKey = oEvent.getParameter('arguments').TableKey;
				var RowIdNotes = oEvent.getParameter('arguments').RowId;
				this.getsetNotesData(TableKey, RowIdNotes);

			} else if (oEvent.getParameter("name") === "matGenChangedDetail") {
				this.vRoutername = "matGenChangedDetail";
				// This code will be executed when the user navigates to Detail's screen.
				//setting the footer of the detail page
				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this);
				try {
					sap.ui.getCore().byId("Mat_Basic_Data_title").destroy();
					sap.ui.getCore().byId("matCreateLayout").destroy();

				} catch (err) {}
				this.DestroyInstance();
				if (this.oGeneralDataDetails === "") {

					this.oGeneralDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialBasicDataCreate', fcg.mdg.approvecrv2.util.Formatter);
				} else {
					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("MatBasicDataDetailPage").removeContent(this.oGeneralDataDetails);
					if (this.oGeneralDataDetails !== undefined) {
						this.oGeneralDataDetails.destroy();
						this.DestroyInstance();

					}
					this.oGeneralDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialBasicDataCreate', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.setPageTitleFooter("Material");
				//destroying the  title headers and extra panels which is not required
				this.getView().byId("MatBasicDataDetailPage").addContent(this.oGeneralDataDetails);
				sap.ui.getCore().byId("Mat_Basic_Data_title").destroy();
				sap.ui.getCore().byId("CreateMatATPTitle").destroy();
				sap.ui.getCore().byId("idGrouping").destroy();
				sap.ui.getCore().byId("idmatDesign_Data").destroy();
				sap.ui.getCore().byId("idMat_Configuration").destroy();
				sap.ui.getCore().byId("idMat_Environment").destroy();
				sap.ui.getCore().byId("matGtinPanel").destroy();
				sap.ui.getCore().byId("matClassificationPanel").destroy();
				sap.ui.getCore().byId("matPurchasingPanel").destroy();
				sap.ui.getCore().byId("matNotesPanel").destroy();
				sap.ui.getCore().byId("CreateChngMgmttit").destroy();

				//setting the header of the detail page
				var oGeneralresult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
				var Materialgeneral = oGeneralresult.data.MATERIAL;
				var MaterialTxtgeneral = oGeneralresult.data.TXTMI;
				var MaterialTitle = this.getView().getModel("i18n").getProperty("MATERIAL");
				var sMaterial = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(Materialgeneral,
					MaterialTxtgeneral);
				this.materialheader1 = MaterialTitle + ":" + " " + sMaterial;
				this.getView().byId("MatBasicDataDetailHeader").setTitle(this.materialheader1);
				if (this.getView().byId("materialheader") !== undefined) {
					this.getView().byId("materialheader").setText("");
				}
				result = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
				var oS3Controller;
				oS3Controller = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				this.setBoldGenData(result);
				var oDetailGeneralModel = new sap.ui.model.json.JSONModel();
				oDetailGeneralModel.setData(result.data);
				sap.ui.getCore().byId("matBasicDataForm").setModel(oDetailGeneralModel);
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.hideSection(oS3Controller);

			} else if (oEvent.getParameter("name") === "matDimGtinChangedDetail") {
				var i, j, k, keytxt, key;
				//setting the header of the detail page
				this.setPageTitleFooter("Dimension");
				this.vRoutername = "matDimGtinChangedDetail";
				//setting the footer of the detail page
				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this);
				//DESTROYING OTHER INSTANCES
				this.DestroyInstance();
				// This code will be executed when the user navigates to Detail's screen.
				// Initialize the Gtin fragment
				if (this.oGtinChangedDataDetails === "") {
					this.oGtinChangedDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatBasicDataGtinDetails', fcg.mdg.approvecrv2.util
						.Formatter);
				} else {
					if (this.oGeneralDataDetails !== "") {
						this.oGeneralDataDetails.destroy();
					}
					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("MatBasicDataDetailPage").removeContent(this.oGtinChangedDataDetails);
					if (this.oGtinChangedDataDetails !== undefined) {
						this.oGtinChangedDataDetails.destroy();
					}
					this.oGtinChangedDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatBasicDataGtinDetails', fcg.mdg.approvecrv2.util
						.Formatter);
				}
				this.destroyContent();
				this.getView().byId("MatBasicDataDetailPage").addContent(this.oGtinChangedDataDetails);
				this.setHeader();
				var aResultgtin;
				var args = oEvent.getParameter("arguments");
				var RowId = args.RowId;
				result = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getGtinChangedData();
				var Dimensionresult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDetailGtinChangedData();
				var Gtinkey = result.results[RowId].ChangeKey;
				var vNewvalue = result.results[RowId].NewValue;
				for (k = 0; k < Dimensionresult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results.length; k++) {
					var oGtinChangedData = Dimensionresult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[k];
					var Meinh = oGtinChangedData.QTEUNIT;
					if (oGtinChangedData.EAN_MARM === "") {
						keytxt = oGtinChangedData.QTEUNIT__TXT;
						key = keytxt + " " + "(" + oGtinChangedData.QTEUNIT + ")";
					} else {
						keytxt = oGtinChangedData.QTEUNIT__TXT;
						key = keytxt + " " + "(" + oGtinChangedData.QTEUNIT + ")" + "," + " " + oGtinChangedData.EAN_MARM;
					}
					if (key === Gtinkey) {
						var oDetailGTINChangedModel = new sap.ui.model.json.JSONModel();
						var vDimensionRes = Dimensionresult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[k];
						//mapping the decription by call the method Mapdimensiondesc
						vDimensionRes.BREIT = this.MapDimensionDesc(vDimensionRes.BREIT, vDimensionRes.MEABM__TXT, vDimensionRes.MEABM);
						vDimensionRes.LAENG = this.MapDimensionDesc(vDimensionRes.LAENG, vDimensionRes.MEABM__TXT, vDimensionRes.MEABM);
						vDimensionRes.HOEHE = this.MapDimensionDesc(vDimensionRes.HOEHE, vDimensionRes.MEABM__TXT, vDimensionRes.MEABM);
						vDimensionRes.VOLUM = this.MapDimensionDesc(vDimensionRes.VOLUM, vDimensionRes.VOLEH__TXT, vDimensionRes.VOLEH);
						vDimensionRes.BRGEW = this.MapDimensionDesc(vDimensionRes.BRGEW, vDimensionRes.GEWEI__TXT, vDimensionRes.GEWEI);
						aResultgtin = vDimensionRes;
						oDetailGTINChangedModel.setData(aResultgtin);
						sap.ui.getCore().byId("GtinDetailForm").setModel(oDetailGTINChangedModel);

						aResultgtin = vDimensionRes;
						this.getSizeDimNetWtData(Meinh, vDimensionRes.GEWEI__TXT, vDimensionRes.GEWEI);
						vDimensionRes.MEABM__TXT = "";
						vDimensionRes.MEABM = "";
						vDimensionRes.VOLEH = "";
						vDimensionRes.VOLEH__TXT = "";
						vDimensionRes.GEWEI__TXT = "";
						vDimensionRes.GEWEI = "";
						this.vUnitOfMsrflag = 1;
					}
				}
				//if thekey is not present in dimension table but its unit of base unit of measure then set netweighr and size and dimension
				if (this.vUnitOfMsrflag === 0) {
					var oGtinodataitems = {
						results: []
					};
					var generalresult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
					var generaldata = $.extend(true, {}, generalresult);
					var vUnitOfMsr = result.results[RowId].UnitOfMeasure;
					if (generaldata.data.MEINS === vUnitOfMsr && vNewvalue !== this.getView().getModel("i18n").getProperty("PC_DELETED")) {
						if (this.Netweightsetflag === 1) {
							generaldata.data.GEWEI_MAT__TXT = "";
							generaldata.data.GEWEI_MAT = "";
						}
						generaldata.data.NTGEW = this.MapDimensionDesc(generaldata.data.NTGEW, generaldata.data.GEWEI_MAT__TXT, generaldata.data.GEWEI_MAT);
						var oDataItems = {
							"NTGEW": generaldata.data.NTGEW,
							"GROES": generaldata.data.GROES,
							"LAENG": "",
							"BREIT": "",
							"HOEHE": "",
							"VOLUM": "",
							"BRGEW": ""
						};
						var oGtinodata = $.extend(true, {}, oDataItems);
						oGtinodataitems.results.push(oGtinodata);
						var oNetweightModel = new sap.ui.model.json.JSONModel();
						oNetweightModel.setData(oGtinodataitems.results[0]);
						sap.ui.getCore().byId("GtinDetailForm").setModel(oNetweightModel);
						this.setBoldGenData(generalresult);

					} else {
						if (sap.ui.getCore().byId("GtinDetailForm") !== undefined) {
							sap.ui.getCore().byId("GtinDetailForm").destroy();
						}
					}
				}
				if (this.vUnitOfMsrflag === 1) {

					if (vNewvalue !== this.getView().getModel("i18n").getProperty("PC_ADDED") && vNewvalue !== this.getView().getModel("i18n").getProperty(
						"PC_DELETED")) {
						this.setBoldDimData(aResultgtin);
					}
				}

				this.vUnitOfMsrflag = 0;

				var ostrResultschanged = {
					dataitems: []
				};
				var ostrResult = {
					results: []
				};
				ostrResultschanged = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getGtinDetailData();
				for (j = 0; j < ostrResultschanged.dataitems.length; j++) {
					if (ostrResultschanged.dataitems[j].eanupc === "") {
						keytxt = ostrResultschanged.dataitems[j].unitofmeasure_txt;
						key = keytxt + " " + "(" + ostrResultschanged.dataitems[j].unitofmeasure + ")";
					} else {
						keytxt = ostrResultschanged.dataitems[j].unitofmeasure_txt;
						key = keytxt + " " + "(" + ostrResultschanged.dataitems[j].unitofmeasure + ")" + "," + " " + ostrResultschanged.dataitems[j].eanupc;
					}
					if (Gtinkey === key) {
						this.vUnitOfMeasure = ostrResultschanged.dataitems[j].unitofmeasure;
						this.vUnitOfMeasure__Txt = ostrResultschanged.dataitems[j].unitofmeasure_txt;
						ostrResult.results.push(ostrResultschanged.dataitems[j]);
					}
				}
				//Setting of the header 
				var GtinHeader = this.getView().getModel("i18n").getProperty("Gtin_Unit_Measure");
				var GtinobjDesc = GtinHeader + ":" + " " + this.vUnitOfMeasure__Txt + " " + "(" + this.vUnitOfMeasure + ")";
				this.getView().byId("MatBasicDataDetailHeader").setTitle(GtinobjDesc);
				var ogtinres = ostrResult.results[0];
				var oGtinRes = {
					results: []
				};
				var oDataItems;
				oDataItems = {
					"UMREN": ogtinres.quantity,
					"QTEUNIT": ogtinres.unitofmeasure,
					"QTEUNIT__TXT": ogtinres.unitofmeasure_txt,
					"UMREZ": ogtinres.basequantity,
					"baseunitofmeasure": ogtinres.baseunitofmeasure,
					"baseunitofmeasure_txt": ogtinres.baseunitofmeasure_txt,
					"EAN": ogtinres.eanupc,
					"HPEAN": ogtinres.hpean,
					"EANTP_MEA": ogtinres.eancategory,
					"EANTP_MEA__TXT": ogtinres.eancategory_txt,
					"GTIN_VAR2": ogtinres.eanvariant
				};
				oGtinRes.results.push(oDataItems);
				//oGtinRes.results[0].GTIN_VAR2 = fcg.mdg.approvecrv2.util.Formatter.checkBox(oGtinRes.results[0].GTIN_VAR2);                      
				var oGtinFormchang = sap.ui.getCore().byId("GtinEanDetailForm");
				var oGTINModelchang = new sap.ui.model.json.JSONModel();
				oGTINModelchang.setData(oGtinRes.results[0]);
				var oGtinData, oDimensionData;
				oGtinData = Dimensionresult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel;
				oDimensionData = Dimensionresult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel;
				var sUnitofmesaure = oGtinRes.results[0].QTEUNIT;
				var sEan = oGtinRes.results[0].EAN;
				if (vNewvalue !== this.getView().getModel("i18n").getProperty("PC_ADDED") && vNewvalue !== this.getView().getModel("i18n").getProperty(
					"PC_DELETED")) {
					this.setBoldEanData(oGtinData, oDimensionData, sUnitofmesaure, sEan);
				}
				oGtinData = Dimensionresult.data.__batchResponses[0].data.MATERIAL2MEAN_GTINRel;
				oDimensionData = Dimensionresult.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel;
				oGtinFormchang.setModel(oGTINModelchang);
				if (sap.ui.getCore().byId("GtinDetailForm") !== undefined) {
					this.hideDimensionForm();
				}

			} else if (oEvent.getParameter("name") === "matCharChangedDetail") {
				//setting the footer of the detail page
				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this);
				this.vRoutername = "matCharChangedDetail";
				//Getting and binding the detail data of classification
				var args = oEvent.getParameter("arguments");
				this.getClassificationdetailData(args);
			} else if (oEvent.getParameter("name") === "matClassChangedDetail") {
				//setting the footer of the detail page
				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this);
				this.vRoutername = "matClassChangedDetail";
				//Getting and binding the detail data of classification
				var args = oEvent.getParameter("arguments");
				this.getClassificationdetailData(args);

			} else if (oEvent.getParameter("name") === "matPurchChangedDetail") {
				//setting the footer of the detail page
				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this);
				this.vRoutername = "matPurchChangedDetail";
				this.DestroyInstance();
				//setting the title of the page and hiding the visibility of iterator buttons
				this.setPageTitleFooter("Purchasing");
				// This code will be executed when the user navigates to Detail's screen.
				// Initialize the purchasing fragment
				if (this.oPurchChangedDataDetails === "") {
					if (this.oGeneralDataDetails !== "") {
						this.oGeneralDataDetails.destroy();
					}
					this.oPurchChangedDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatPurchChangedDetail', fcg.mdg.approvecrv2.util
						.Formatter);
				} else {
					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("MatBasicDataDetailPage").removeContent(this.oPurchChangedDataDetails);
					if (this.oPurchChangedDataDetails !== undefined) {
						this.oPurchChangedDataDetails.destroy();
					}
					this.oPurchChangedDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatPurchChangedDetail', fcg.mdg.approvecrv2.util
						.Formatter);
				}
				this.destroyContent();
				this.getView().byId("MatBasicDataDetailPage").addContent(this.oPurchChangedDataDetails);
				var oGeneralresult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
				var MaterialPurchTitle = this.getView().getModel("i18n").getProperty("MATERIAL");
				var Material = oGeneralresult.data.MATERIAL;
				var MaterialTxt = oGeneralresult.data.TXTMI;
				this.materialheader1 = MaterialPurchTitle + ":" + " " + MaterialTxt + " " + "(" + Material + ")";
				this.getView().byId("MatBasicDataDetailHeader").setTitle(this.materialheader1);
				try {
					this.getView().byId("materialheader").setText("");
				} catch (err) {}
				result = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getPurchaseDetailData();
				var generaldata = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
				this.setBoldPurchData(result);
				this.setBoldGenData(generaldata);
				if (result[0].data.VABME === "" && result[0].data.VABME__TXT !== "") {
					result[0].data.VABME = result[0].data.VABME__TXT;
					result[0].data.VABME__TXT = "";
				}
				if (generaldata.data.NRFHG === "" && generaldata.data.NRFHG__TXT !== "") {
					generaldata.data.NRFHG = generaldata.data.NRFHG__TXT;
					generaldata.data.NRFHG__TXT = "";
				}
				var oDetailPurchModel = new sap.ui.model.json.JSONModel();
				oDetailPurchModel.setData(result[0].data);
				sap.ui.getCore().byId("matpurchchangedform").setModel(oDetailPurchModel);

				var generalmodel = new sap.ui.model.json.JSONModel();
				generalmodel.setData(generaldata.data);
				sap.ui.getCore().byId("Txt_NRFHG").setModel(generalmodel);
				var qtmngoDetailModel = new sap.ui.model.json.JSONModel();
				qtmngoDetailModel.setData(result[1].data);
				sap.ui.getCore().byId("Txt_QMPUR").setModel(qtmngoDetailModel);
				sap.ui.getCore().byId("Txt_RBNRM").setModel(qtmngoDetailModel);
				var oS3Controller;
				oS3Controller = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.hideGeneralPurchSection(oS3Controller);
				this.setPageTitleFooter("Purchasing");

			} else if (oEvent.getParameter("name") === "matNotesChangedDetail") {
				//setting the footer of the detail page
				oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
				aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this);
				this.vRoutername = "matNotesChangedDetail";
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

				var oNotesResult = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialBasicDataChange.getNotestChangeData();

				for (var i = 0; i < oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results.length; i++) {

					for (var j = 0; j < oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].ChangeData.results.length; j++) {
						var sAttr = oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].ChangeData.results[j].Attribute;
						if (sAttr === 'NOTEINTCM' ||
							sAttr === 'NOTEBSCDA' || sAttr === 'TXTQINSP' || sAttr === 'TXTMI' || sAttr === 'TXTPURCH') {
							var contextbasictxt = oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].MATERIAL + "/" + oNotesResult.data
								.__batchResponses[0].data.MATERIAL2LONGTEXTSRel
								.results[i].LANGUCODE + "/" + "GRUN";
							var contextcomnt = oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].MATERIAL + "/" + oNotesResult.data.__batchResponses[
									0].data.MATERIAL2LONGTEXTSRel
								.results[i].LANGUCODE + "/" + "IVER";
							var contextpurchorder = oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].MATERIAL + "/" + oNotesResult.data
								.__batchResponses[
									0].data.MATERIAL2LONGTEXTSRel
								.results[i].LANGUCODE + "/" + "BEST";
							var contextdesc = oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].MATERIAL + "/" + oNotesResult.data.__batchResponses[
									0].data.MATERIAL2LONGTEXTSRel
								.results[i].LANGUCODE + "/" + "DSCR";
							var contextquality = oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].MATERIAL + "/" + oNotesResult.data
								.__batchResponses[0].data.MATERIAL2LONGTEXTSRel
								.results[i].LANGUCODE + "/" + "PRUE";
							var sContext = oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].ChangeData.results[j].Context;

							sContext = sContext.replace(/\s+/g, '');

							if (sContext === contextcomnt) {
								aIntComntNotesData.results.push(oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].ChangeData.results[j]);
							}

							if (sContext === contextbasictxt) {
								aBasicTxtNotesData.results.push(oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].ChangeData.results[j]);
							}
							if (sContext === contextdesc) {
								aDescNotesData.results.push(oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].ChangeData.results[j]);
							}
							if (sContext === contextpurchorder) {
								aPurchOrderNotesData.results.push(oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].ChangeData.results[
									j]);
							}
							if (sContext === contextquality) {
								aQualityInsNotesData.results.push(oNotesResult.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[i].ChangeData.results[
									j]);
							}

						}
					}

				}

				// This code will be executed when the user navigates to Detail's screen.
				this.DestroyInstance();
				if (this.oNotesChangedDataDetails === "") {
					try {
						sap.ui.getCore().byId("Txt_NewValue").destroy();
					} catch (err) {}

					if (this.oGeneralDataDetails !== "") {
						this.oGeneralDataDetails.destroy();
					}
					this.oNotesChangedDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatNotesChangedDetails', fcg.mdg.approvecrv2.util
						.Formatter);
				} else {
					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("MatBasicDataDetailPage").removeContent(this.oNotesChangedDataDetails);
					if (this.oNotesChangedDataDetails !== undefined) {
						this.oNotesChangedDataDetails.destroy();
					}
					this.oNotesChangedDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatNotesChangedDetails', fcg.mdg.approvecrv2.util
						.Formatter);
				}

				this.destroyContent();
				this.getView().byId("MatBasicDataDetailPage").addContent(this.oNotesChangedDataDetails);
				//setting the header of the detail page
				var RowIdChangedNotes = oEvent.getParameter('arguments').RowId;
				var TableKeyNotes = oEvent.getParameter('arguments').TableKey;
				var sNewVal = oEvent.getParameter('arguments').newvalue;
				var key = oEvent.getParameter('arguments').key;
				if (TableKeyNotes === "Desc") {
					var NotesDescrHeader = this.getView().getModel("i18n").getProperty("Language") + ":" + " " + key;
					this.getView().byId("MatBasicDataDetailHeader").setTitle(NotesDescrHeader);
					this.setHeader();
					//setting footer and hiding visibility of iterator
					this.setPageTitleFooter("Descr");
					var oDetailDescrChangedModel = new sap.ui.model.json.JSONModel();
					if (aDescNotesData.results[RowIdChangedNotes].NewValue === "") {
						aDescNotesData.results[RowIdChangedNotes].NewValue = aDescNotesData.results[RowIdChangedNotes].OldValue;
					}
					var aDataDescrChangedresult = aDescNotesData.results[RowIdChangedNotes];
					oDetailDescrChangedModel.setData(aDataDescrChangedresult);
					sap.ui.getCore().byId("mattextChangeddetail").setModel(oDetailDescrChangedModel);
					// sap.ui.getCore().byId("Txt_NewValue").addStyleClass("text_bold");
				}
				if (TableKeyNotes === "BasicTxt") {
					var NotesBasicTextHeader = this.getView().getModel("i18n").getProperty("Language") + ":" + " " + key;
					this.getView().byId("MatBasicDataDetailHeader").setTitle(NotesBasicTextHeader);
					if (this.getView().byId("materialheader") !== undefined) {
						this.getView().byId("materialheader").setText(materialheader1);
					}
					this.setHeader();
					//setting footer and hiding visibility of iterator
					this.setPageTitleFooter("BasicTxt");
					var oDetailBasicTxtModel = new sap.ui.model.json.JSONModel();
					if (aBasicTxtNotesData.results[RowIdChangedNotes].NewValue === "") {
						aBasicTxtNotesData.results[RowIdChangedNotes].NewValue = aBasicTxtNotesData.results[RowIdChangedNotes].OldValue;
					}
					var aDataBasicTxtresult = aBasicTxtNotesData.results[RowIdChangedNotes];
					oDetailBasicTxtModel.setData(aDataBasicTxtresult);
					sap.ui.getCore().byId("mattextChangeddetail").setModel(oDetailBasicTxtModel);
					// sap.ui.getCore().byId("Txt_NewValue").addStyleClass("text_bold");
				}
				if (TableKeyNotes === "IntComnt") {
					var NotesIntComntHeader = this.getView().getModel("i18n").getProperty("Language") + ":" + " " + key;
					this.getView().byId("MatBasicDataDetailHeader").setTitle(NotesIntComntHeader);
					this.setHeader();
					//setting footer and hiding visibility of iterator
					this.setPageTitleFooter("IntComnt");
					var oDetailintcomntChangedModel = new sap.ui.model.json.JSONModel();
					if (aIntComntNotesData.results[RowIdChangedNotes].NewValue === "") {
						aIntComntNotesData.results[RowIdChangedNotes].NewValue = aIntComntNotesData.results[RowIdChangedNotes].OldValue;
					}

					var aDataIntComntChangedresult = aIntComntNotesData.results[RowIdChangedNotes];
					oDetailintcomntChangedModel.setData(aDataIntComntChangedresult);
					sap.ui.getCore().byId("mattextChangeddetail").setModel(oDetailintcomntChangedModel);
					// sap.ui.getCore().byId("Txt_NewValue").addStyleClass("text_bold");
				}

				if (TableKeyNotes === "PurchOrder") {

					var NotesPurchHeader = this.getView().getModel("i18n").getProperty("Language") + ":" + " " + key;
					this.getView().byId("MatBasicDataDetailHeader").setTitle(NotesPurchHeader);
					//setting footer and hiding visibility of iterator
					this.setPageTitleFooter("PurchOrderTxt");
					this.setHeader();
					var oDetailPurchChangedModel = new sap.ui.model.json.JSONModel();
					if (aPurchOrderNotesData.results[RowIdChangedNotes].NewValue === "") {
						aPurchOrderNotesData.results[RowIdChangedNotes].NewValue = aPurchOrderNotesData.results[RowIdChangedNotes].OldValue;
					}
					var aDetailPurchChangedresult = aPurchOrderNotesData.results[RowIdChangedNotes];
					oDetailPurchChangedModel.setData(aDetailPurchChangedresult);
					sap.ui.getCore().byId("mattextChangeddetail").setModel(oDetailPurchChangedModel);
					// sap.ui.getCore().byId("Txt_NewValue").addStyleClass("text_bold");
				}
				if (TableKeyNotes === "QualityIns") {
					//setting footer and hiding visibility of iterator
					this.setPageTitleFooter("Quality");
					var NotesQualityHeader = this.getView().getModel("i18n").getProperty("Language") + ":" + " " + key;
					this.getView().byId("MatBasicDataDetailHeader").setTitle(NotesQualityHeader);
					this.setHeader();
					var oDetailintQualityInsChangedModel = new sap.ui.model.json.JSONModel();
					if (aQualityInsNotesData.results[RowIdChangedNotes].NewValue === "") {
						aQualityInsNotesData.results[RowIdChangedNotes].NewValue = aQualityInsNotesData.results[RowIdChangedNotes].OldValue;
					}
					var aDataQualityInsChangedresult = aQualityInsNotesData.results[RowIdChangedNotes];
					oDetailintQualityInsChangedModel.setData(aDataQualityInsChangedresult);
					sap.ui.getCore().byId("mattextChangeddetail").setModel(oDetailintQualityInsChangedModel);

				}
				if (sNewVal !== this.getView().getModel("i18n").getProperty("PC_ADDED") && sNewVal !== this.getView().getModel("i18n").getProperty(
					"PC_DELETED")) {
					sap.ui.getCore().byId("Txt_NewValue").addStyleClass("text_bold");
				}

			}
			//Controller hook defined here with importing param: this.vRoutername,this; no return param
			this.matHookModifyRouting(this.vRoutername, this);
		}, this);
	},
	matHookModifyRouting: function(vRoutername, oView) {
		/**
		 * @ControllerHook To modify the existing s4 data of the panel
		 * Customer can modify the existing s4 data of the panel
		 * @callback fcg.mdg.approvecrv2.view.S3~extHookmatHookModifyRouting
		 * @param {object} result Holds routername
		 * @param {object} instance
		 * @return {void}
		 */
		if (this.extHookmatHookModifyRouting) {
			this.extHookmatHookModifyRouting(vRoutername, oView);
		}
	},
	setHeader: function() {
		var result = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
		var Materialgeneral = result.data.MATERIAL;
		var MaterialTxtgeneral = result.data.TXTMI;
		var MaterialTitle = this.getView().getModel("i18n").getProperty("MATERIAL");

		this.materialheader1 = MaterialTitle + ":" + " " + MaterialTxtgeneral + " " + "(" + Materialgeneral + ")";
		this.getView().byId("materialheader").setText(this.materialheader1);
	},
	destroyContent: function() {
		this.getView().byId("MatBasicDataDetailPage").removeContent(this.oBasicDAtaNotesDetails);
		this.getView().byId("MatBasicDataDetailPage").removeContent(this.oBasicDAtaGtinDetails);
		this.getView().byId("MatBasicDataDetailPage").removeContent(this.oGeneralDataDetails);
		this.getView().byId("MatBasicDataDetailPage").removeContent(this.oGtinChangedDataDetails);
		this.getView().byId("MatBasicDataDetailPage").removeContent(this.oPurchChangedDataDetails);
		this.getView().byId("MatBasicDataDetailPage").removeContent(this.oNotesChangedDataDetails);
	},
	hideDimensionForm: function() {
		//Check dimension Section
		/**
		 * @ControllerHook To hide the address section
		 * Customer can add their own fields to influence hiding of this address section by
		 * adjusting the fields in the IF condition
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookHideDetailDimensionSection
		 * @param { }
		 * @return { }
		 */
		if (this.extHookHideDetailDimensionSection) {
			this.extHookHideDetailDimensionSection();
		} else {

			if (sap.ui.getCore().byId("Txt_LAENG").getVisible() === false &&
				sap.ui.getCore().byId("Txt_BREIT").getVisible() === false &&
				sap.ui.getCore().byId("Txt_HOEHE").getVisible() === false &&
				sap.ui.getCore().byId("Txt_VOLUM").getVisible() === false &&
				sap.ui.getCore().byId("Txt_BRGEW").getVisible() === false &&
				sap.ui.getCore().byId("Txt_NTGEW").getVisible() === false &&
				sap.ui.getCore().byId("Txt_GROES").getVisible() === false) {
				sap.ui.getCore().byId("GtinDetailForm").destroy();
			}
		}
	},
	setBoldGenData: function(aResult) {

		var sStyleClass = "text_bold";

		//if the data has been changed for a field, set the text of the field and the label to bold
		//Bolding for General data
		for (var i = 0; i < aResult.data.ChangeData.results.length; i++) {
			var sLabelName = "Lbl_" + aResult.data.ChangeData.results[i].Attribute;
			var oLblIns = sap.ui.getCore().byId(sLabelName);
			if (oLblIns !== undefined) {
				oLblIns.setDesign("Bold");
			}
			var sTextName = "Txt_" + aResult.data.ChangeData.results[i].Attribute;
			if (sap.ui.getCore().byId(sTextName) !== undefined) {
				sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
			}
		}
	},
	setBoldPurchData: function(aResult) {

		var sStyleClass = "text_bold";

		//if the data has been changed for a field, set the text of the field and the label to bold
		//Bolding for General data
		for (var i = 0; i < aResult.length; i++) {
			for (var j = 0; j < aResult[i].data.ChangeData.results.length; j++) {
				var sLabelName = "Lbl_" + aResult[i].data.ChangeData.results[j].Attribute;
				var oLblIns = sap.ui.getCore().byId(sLabelName);
				if (oLblIns !== undefined) {
					oLblIns.setDesign("Bold");
				}
				var sTextName = "Txt_" + aResult[i].data.ChangeData.results[j].Attribute;
				if (sap.ui.getCore().byId(sTextName) !== undefined) {
					sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
				}
			}
		}
	},
	setBoldDimData: function(aResult) {

		var sStyleClass = "text_bold";

		for (var j = 0; j < aResult.ChangeData.results.length; j++) {
			if (aResult.ChangeData.results[j].EntityAction !== "D") {
				if (aResult.ChangeData.results[j].Attribute === 'GEWEI') {
					sap.ui.getCore().byId("Txt_BRGEW").addStyleClass(sStyleClass);
					sap.ui.getCore().byId("Lbl_BRGEW").addStyleClass(sStyleClass);
					sap.ui.getCore().byId("Txt_NTGEW").addStyleClass(sStyleClass);
					sap.ui.getCore().byId("Lbl_NTGEW").addStyleClass(sStyleClass);
				}

				if (aResult.ChangeData.results[j].Attribute === 'MEABM') {
					sap.ui.getCore().byId("Txt_BREIT").addStyleClass(sStyleClass);
					sap.ui.getCore().byId("Lbl_BREIT").addStyleClass(sStyleClass);
					sap.ui.getCore().byId("Txt_LAENG").addStyleClass(sStyleClass);
					sap.ui.getCore().byId("Lbl_LAENG").addStyleClass(sStyleClass);
					sap.ui.getCore().byId("Txt_HOEHE").addStyleClass(sStyleClass);
					sap.ui.getCore().byId("Lbl_HOEHE").addStyleClass(sStyleClass);
				}
				if (aResult.ChangeData.results[j].Attribute === 'VOLEH') {
					sap.ui.getCore().byId("Txt_VOLUM").addStyleClass(sStyleClass);
					sap.ui.getCore().byId("Lbl_VOLUM").addStyleClass(sStyleClass);

				}
				var sLabelName = "Lbl_" + aResult.ChangeData.results[j].Attribute;
				var oLblIns = sap.ui.getCore().byId(sLabelName);
				if (oLblIns !== undefined) {
					oLblIns.setDesign("Bold");
				}
				var sTextName = "Txt_" + aResult.ChangeData.results[j].Attribute;
				if (sap.ui.getCore().byId(sTextName) !== undefined) {
					sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
				}
			}
		}
		var result = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
		this.setBoldGenData(result);

		//  }

	},

	setBoldEanData: function(aGtinData, aUnitMsrData, sUOM, sEan) {

		var sStyleClass = "text_bold";
		//Bolding for gtin data
		for (var i = 0; i < aGtinData.results.length; i++) {

			for (var j = 0; j < aGtinData.results[i].ChangeData.results.length; j++) {
				if (aGtinData.results[i].ChangeData.results[j].EntityAction !== "D") {
					var sAttr = aGtinData.results[i].ChangeData.results[j].Attribute;
					if (aGtinData.results[i].QTEUNIT === sUOM && aGtinData.results[i].EAN === sEan) {
						if (sAttr === 'HPEAN' || sAttr === 'EANTP_MEA') {
							var sLabelName = "Lbl_" + aGtinData.results[i].ChangeData.results[j].Attribute;
							var oLblIns = sap.ui.getCore().byId(sLabelName);
							if (oLblIns !== undefined) {
								oLblIns.setDesign("Bold");
							}
							var sTextName = "Txt_" + aGtinData.results[i].ChangeData.results[j].Attribute;
							if (sap.ui.getCore().byId(sTextName) !== undefined) {
								sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
							}
						}
					}
				}
			}
		}
		for (var i = 0; i < aUnitMsrData.results.length; i++) {

			for (var j = 0; j < aUnitMsrData.results[i].ChangeData.results.length; j++) {
				var sAttr = aUnitMsrData.results[i].ChangeData.results[j].Attribute;
				if (aUnitMsrData.results[i].QTEUNIT === sUOM && aUnitMsrData.results[i].EAN === sEan) {
					if (sAttr === 'UMREZ' || sAttr === 'UMREN' || sAttr === 'GTIN_VAR2' || sAttr === 'EAN_MARM') {
						var sLabelName = "Lbl_" + aUnitMsrData.results[i].ChangeData.results[j].Attribute;
						var oLblIns = sap.ui.getCore().byId(sLabelName);
						if (oLblIns !== undefined) {
							oLblIns.setDesign("Bold");
						}
						var sTextName = "Txt_" + aUnitMsrData.results[i].ChangeData.results[j].Attribute;
						if (sap.ui.getCore().byId(sTextName) !== undefined) {
							sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
						}
					}
				}
			}
		}

	},
	//destroying the instance which is not required before loading other fragmnet
	DestroyInstance: function() {
		var oS3Ins = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
		if (this.oGtinChangedDataDetails !== undefined && this.oGtinChangedDataDetails !== "") {
			this.oGtinChangedDataDetails.destroy();
		}
		if (this.oNotesChangedDataDetails !== undefined && this.oNotesChangedDataDetails !== "") {
			this.oNotesChangedDataDetails.destroy();
		}
		//the basicdata create fragmnent is used for detail s4 in change scenario and s3 in create scenario so to remove the duplicate id issue
		if (oS3Ins.sAction === "CREATE") {
			if (this.oGeneralDataDetails !== undefined && this.oGeneralDataDetails !== "") {
				this.oGeneralDataDetails.removeAllContent();
			}

		} else {
			if (this.oGeneralDataDetails !== undefined && this.oGeneralDataDetails !== "") {
				this.oGeneralDataDetails.destroy();
			}
		}
		if (this.oPurchChangedDataDetails !== undefined && this.oPurchChangedDataDetails !== "") {
			this.oPurchChangedDataDetails.destroy();
		}
		if (sap.ui.getCore().byId("matClassificationChangeLayout") !== undefined) {
			sap.ui.getCore().byId("matClassificationChangeLayout").destroy();
		}
		if (this.oClassificationChangedDataDetails !== undefined && this.oClassificationChangedDataDetails !== "") {
			this.oClassificationChangedDataDetails.destroy();
		}

		if (this.oBasicDAtaGtinDetails !== undefined && this.oBasicDAtaGtinDetails !== "") {
			this.oBasicDAtaGtinDetails.destroy();
		}
		if (this.oBasicDAtaNotesDetails !== undefined && this.oBasicDAtaNotesDetails !== "") {
			this.oBasicDAtaNotesDetails.destroy();
		}
	},
	getClassificationdetailData: function(args) {
		//setting the title of the page and hiding the visibility of iterator buttons
		this.setPageTitleFooter("Classification");
		var ClassobjDesc;
		// This code will be executed when the user navigates to Detail's screen.
		// Initialize the classification fragment
		this.DestroyInstance();
		if (this.oClassificationChangedDataDetails === "") {
			//destroying other instances
			if (this.oGeneralDataDetails !== undefined && this.oGeneralDataDetails !== "") {
				this.oGeneralDataDetails.destroy();
			}
			this.oClassificationChangedDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatClassifictaionChange', fcg.mdg.approvecrv2
				.util.Formatter);
		} else {
			if (this.oGeneralDataDetails !== undefined && this.oGeneralDataDetails !== "") {
				this.oGeneralDataDetails.destroy();
			}
			// If already defined, remove it from detail page and instantiate it again
			this.getView().byId("MatBasicDataDetailPage").removeContent(this.oClassificationChangedDataDetails);
			if (this.oClassificationChangedDataDetails !== undefined) {
				this.oClassificationChangedDataDetails.destroy();
			}
			this.oClassificationChangedDataDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatClassifictaionChange', fcg.mdg.approvecrv2
				.util.Formatter);
		}
		this.getView().byId("MatBasicDataDetailPage").addContent(this.oClassificationChangedDataDetails);
		//destroying other instances from s4 page
		this.destroyContent();
		//setting the header of material title
		this.setHeader();
		//getting the key to form the query

		var vChangeno = args.key;
		var vclasstype = args.context;
		var vClasstypetext = args.Classtype_text;
		var Valid_from = args.Valid_from;
		var sChangnoHeader = this.getView().getModel("i18n").getProperty("Mat_Chng_no");
		var sClassTypeHeader = this.getView().getModel("i18n").getProperty("Mat_Class_Type");
		//if change no came as not maintaintained  then we will pass it as null in the query
		if (vChangeno === "(" + this.getView().getModel("i18n").getProperty("CC_NOT_MAIN") + ")") {
			vChangeno = "";
			ClassobjDesc = sClassTypeHeader + ":" + " " + vClasstypetext + " " + "(" + vclasstype + ")";
		} else {
			ClassobjDesc = sChangnoHeader + ":" + " " + vChangeno + " (" + Valid_from + ")" + "," + " " + sClassTypeHeader + ":" + " " +
				vClasstypetext + " " + "(" +
				vclasstype + ")";
		}
		//setting the header of s4 page
		this.getView().byId("MatBasicDataDetailHeader").setTitle(ClassobjDesc);
		//setting the instance of the table of s4 page
		var oTablechar = sap.ui.getCore().byId("CharDetailsTable");
		var oTableclass = sap.ui.getCore().byId("ClassDetailsTable");

		//binding the data of the table of s4 page
		var result = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.getDataOnSelection(vclasstype, vChangeno, oTableclass,
			oTablechar);

	},
	MapDimensionDesc: function(sValue, Desc, Key) {
		var vFlag = fcg.mdg.approvecrv2.util.Formatter.defaultValue(sValue);
		if (vFlag === true) {
			if (Desc !== "" && Key !== "") {
				sValue = sValue + " " + Desc + " " + "(" + Key + ")";
			}
			return sValue;
		} else {
			return sValue;
		}
	},

	getnextdatadetail: function() {
		if (this.vRoutername === "matGtinDataDetail") {
			this.loadFragment();
			this.getsetGtinData(this.vGtinRowid);

		}
		if (this.vRoutername === "matNotesDetail") {
			this.loadFragment();
			this.getsetNotesData(this.sTableKey, this.vGtinRowid);
		}

	},
	loadFragment: function() {
		if (this.vRoutername === "matGtinDataDetail") {
			this.DestroyInstance();
			if (this.oBasicDAtaGtinDetails === "") {

				this.oBasicDAtaGtinDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatBasicDataGtinDetails', fcg.mdg.approvecrv2.util
					.Formatter);
			} else {
				// If already defined, remove it from detail page and instantiate it again
				this.getView().byId("MatBasicDataDetailPage").removeContent(this.oBasicDAtaGtinDetails);
				if (this.oBasicDAtaGtinDetails !== undefined) {
					this.oBasicDAtaGtinDetails.destroy();
				}
				this.oBasicDAtaGtinDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatBasicDataGtinDetails', fcg.mdg.approvecrv2.util
					.Formatter);
			}
			//	this.getView().byId("MatBasicDataDetailPage").removeContent(this.oBasicDAtaNotesDetails);
			this.getView().byId("MatBasicDataDetailPage").addContent(this.oBasicDAtaGtinDetails);

		}
		if (this.vRoutername === "matNotesDetail") {
			this.DestroyInstance();
			if (this.oBasicDAtaNotesDetails === "") {
				this.oBasicDAtaNotesDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatBasicDataNotesDetails', fcg.mdg.approvecrv2.util
					.Formatter);
			} else {
				// If already defined, remove it from detail page and instantiate it again
				this.getView().byId("MatBasicDataDetailPage").removeContent(this.oBasicDAtaNotesDetails);
				if (this.oBasicDAtaNotesDetails !== undefined) {
					this.oBasicDAtaNotesDetails.destroy();
				}
				this.oBasicDAtaNotesDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatBasicDataNotesDetails', fcg.mdg.approvecrv2.util
					.Formatter);
			}
			this.getView().byId("MatBasicDataDetailPage").removeContent(this.oBasicDAtaGtinDetails);
			this.getView().byId("MatBasicDataDetailPage").addContent(this.oBasicDAtaNotesDetails);
		}
	},
	getsetGtinData: function(sRowId) {
		//setting the header of the detail page
		var GtinHeader = this.getView().getModel("i18n").getProperty("Gtin_Unit_Measure");
		//data of gtin adn dimension detail from the entity
		var result = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDetailGtinData();
		var oGtinDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.getGtinDetailData();

		this.vTotalGtin = oGtinDetailData.dataitems.length;

		this.vGtinRowid = sRowId;
		var Meinh = oGtinDetailData.dataitems[sRowId].unitofmeasure;
		var EanUpc = oGtinDetailData.dataitems[sRowId].eanupc;
		var quantity = oGtinDetailData.dataitems[sRowId].quantity;
		var unitofmeasure_txt = oGtinDetailData.dataitems[sRowId].unitofmeasure_txt;
		var basequantity = oGtinDetailData.dataitems[sRowId].basequantity;
		var baseunitofmeasure = oGtinDetailData.dataitems[sRowId].baseunitofmeasure;
		var baseunitofmeasure_txt = oGtinDetailData.dataitems[sRowId].baseunitofmeasure_txt;
		var eancategory = oGtinDetailData.dataitems[sRowId].eancategory;
		var eanvariant = oGtinDetailData.dataitems[sRowId].eanvariant;
		var eancategory_txt = oGtinDetailData.dataitems[sRowId].eancategory_txt;
		var hpean = oGtinDetailData.dataitems[sRowId].hpean;
		//setting the header of s4 page
		if (unitofmeasure_txt === "") {
			var GtinobjDesc = GtinHeader + ":" + " " + Meinh;
		} else {
			var GtinobjDesc = GtinHeader + ":" + " " + unitofmeasure_txt + " " + "(" + Meinh + ")";
		}
		this.getView().byId("MatBasicDataDetailHeader").setTitle(GtinobjDesc);
		sRowId++;
		//setting the header of the page with the iterator buttons
		this.setPageTitleFooter("Dimension", sRowId, this.vTotalGtin);
		//setting the material title
		this.setHeader();
		var oDataItems;
		var ostrResults = {
			dataitems: []
		};
		var j;
		oDataItems = {
			"UMREN": quantity,
			"QTEUNIT": Meinh,
			"QTEUNIT__TXT": unitofmeasure_txt,
			"UMREZ": basequantity,
			"baseunitofmeasure": baseunitofmeasure,
			"baseunitofmeasure_txt": baseunitofmeasure_txt,
			"EAN": EanUpc,
			"HPEAN": hpean,
			"EANTP_MEA": eancategory,
			"EANTP_MEA__TXT": eancategory_txt,
			"GTIN_VAR2": eanvariant
		};
		ostrResults.dataitems.push(oDataItems);
		var oGtinDetailForm = sap.ui.getCore().byId("GtinEanDetailForm");
		var oGTINModel = new sap.ui.model.json.JSONModel();
		oGTINModel.setData(ostrResults.dataitems[0]);
		oGtinDetailForm.setModel(oGTINModel);
		for (var j = 0; j < result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results.length; j++) {
			if (Meinh === result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].QTEUNIT && EanUpc === result.data.__batchResponses[
					0].data.MATERIAL2UNITOFMSRRel
				.results[j].EAN_MARM) {
				var oDetailModel = new sap.ui.model.json.JSONModel();
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].BREIT = this.MapDimensionDesc(result.data.__batchResponses[0]
					.data.MATERIAL2UNITOFMSRRel.results[j].BREIT, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM);
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].LAENG = this.MapDimensionDesc(result.data.__batchResponses[0]
					.data.MATERIAL2UNITOFMSRRel.results[j].LAENG, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM);
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].HOEHE = this.MapDimensionDesc(result.data.__batchResponses[0]
					.data.MATERIAL2UNITOFMSRRel.results[j].HOEHE, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM);
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].VOLUM = this.MapDimensionDesc(result.data.__batchResponses[0]
					.data.MATERIAL2UNITOFMSRRel.results[j].VOLUM, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].VOLEH__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].VOLEH);
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].BRGEW = this.MapDimensionDesc(result.data.__batchResponses[0]
					.data.MATERIAL2UNITOFMSRRel.results[j].BRGEW, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI);
				//getting size and dimension for base unit of measure
				this.getSizeDimNetWtData(Meinh, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI);
				var aResult = result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j];
				oDetailModel.setData(aResult);
				sap.ui.getCore().byId("GtinDetailForm").setModel(oDetailModel);
				this.flag = 1;
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM__TXT = "";
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM = "";
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].VOLEH = "";
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].VOLEH__TXT = "";
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI__TXT = "";
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI = "";

			} else if (Meinh === result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].QTEUNIT && (EanUpc === "(" + this.getView()
				.getModel("i18n").getProperty("CC_NOT_MAIN") + ")")) {

				//mapping the decription by call the method Mapdimensiondesc
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].BREIT = this.MapDimensionDesc(result.data.__batchResponses[0]
					.data.MATERIAL2UNITOFMSRRel.results[j].BREIT, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM);
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].LAENG = this.MapDimensionDesc(result.data.__batchResponses[0]
					.data.MATERIAL2UNITOFMSRRel.results[j].LAENG, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM);
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].HOEHE = this.MapDimensionDesc(result.data.__batchResponses[0]
					.data.MATERIAL2UNITOFMSRRel.results[j].HOEHE, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM);
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].VOLUM = this.MapDimensionDesc(result.data.__batchResponses[0]
					.data.MATERIAL2UNITOFMSRRel.results[j].VOLUM, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].VOLEH__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].VOLEH);
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].BRGEW = this.MapDimensionDesc(result.data.__batchResponses[0]
					.data.MATERIAL2UNITOFMSRRel.results[j].BRGEW, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI__TXT,
					result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI);

				var aResult = result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j];
				//	var vBaseuntmsr = generalresult.data.__batchResponses[0].data.MEINS;
				//if unit of msr of the row is equal to base unit of measure then setting the model for net weight na size dimension from basic data
				this.getSizeDimNetWtData(Meinh, result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI__TXT, result.data.__batchResponses[
					0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI);
				var oDetailModel = new sap.ui.model.json.JSONModel();
				oDetailModel.setData(aResult);
				sap.ui.getCore().byId("GtinDetailForm").setModel(oDetailModel);
				this.flag = 1;
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM__TXT = "";
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].MEABM = "";
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].VOLEH = "";
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].VOLEH__TXT = "";
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI__TXT = "";
				result.data.__batchResponses[0].data.MATERIAL2UNITOFMSRRel.results[j].GEWEI = "";
			}

		}
		if (this.flag === 0) {
			sap.ui.getCore().byId("GtinDetailForm").destroy();
		}
		this.flag = 0;
		if (sap.ui.getCore().byId("GtinDetailForm") !== undefined) {
			this.hideDimensionForm();
		}

	},
	getsetNotesData: function(TableKey, RowIdNotes) {
		this.vGtinRowid = RowIdNotes;
		this.sTableKey = TableKey;
		var result = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDetailNotesData();
		var NotesData = [];
		var aDatabasic = [];
		var aDatacomnt = [];
		var aDataDescr = [];
		var aDataQuality = [];
		var aDataPurch = [];
		var Row;
		var oDetailDescrModel;
		var aDataDescrresult;
		NotesData = result.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results;

		for (var i = 0; i < NotesData.length; i++) {

			if (NotesData[i].TEXT_ID === "GRUN") {
				if (NotesData[i].LONGTEXT !== "") {
					aDatabasic.push(i);
				}
			}
			if (NotesData[i].TEXT_ID === "IVER") {
				if (NotesData[i].LONGTEXT !== "") {
					aDatacomnt.push(i);

				}
			}
			if (NotesData[i].TEXT_ID === "DSCR") {
				if (NotesData[i].LONGTEXT !== "") {
					aDataDescr.push(i);
				}
			}
			if (NotesData[i].TEXT_ID === "BEST") {
				if (NotesData[i].LONGTEXT !== "") {
					aDataPurch.push(i);
				}
			}
			if (NotesData[i].TEXT_ID === "PRUE") {
				if (NotesData[i].LONGTEXT !== "") {
					aDataQuality.push(i);
				}
			}

		}
		if (TableKey === "Descr") {

			this.setHeader();
			Row = aDataDescr[RowIdNotes];
			RowIdNotes++;
			var vDescTotal = aDataDescr.length;
			//setting the header of the page with the iterator buttons
			this.setPageTitleFooter("Descr", RowIdNotes, vDescTotal);
			oDetailDescrModel = new sap.ui.model.json.JSONModel();
			aDataDescrresult = result.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[Row];
			this.setLangHeader(aDataDescrresult);
			oDetailDescrModel.setData(aDataDescrresult);
			sap.ui.getCore().byId("mattextdetail").setModel(oDetailDescrModel);
		}
		if (TableKey === "BasicTxt") {
			this.setHeader();
			Row = aDatabasic[RowIdNotes];
			RowIdNotes++;
			var vDatabasicTotal = aDatabasic.length;
			//setting the header of the page with the iterator buttons
			this.setPageTitleFooter("BasicTxt", RowIdNotes, vDatabasicTotal);
			var oDetailbasModel = new sap.ui.model.json.JSONModel();
			var aDatabasicresult = result.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[Row];
			oDetailbasModel.setData(aDatabasicresult);
			this.setLangHeader(aDatabasicresult);
			sap.ui.getCore().byId("mattextdetail").setModel(oDetailbasModel);
		}
		if (TableKey === "IntComnt") {
			this.setHeader();
			Row = aDatacomnt[RowIdNotes];
			RowIdNotes++;
			var vIntComntTotal = aDatacomnt.length;
			//setting the header of the page with the iterator buttons
			this.setPageTitleFooter("IntComnt", RowIdNotes, vIntComntTotal);
			var oDetailintcomntModel = new sap.ui.model.json.JSONModel();
			var aDatacomntresult = result.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[Row];
			oDetailintcomntModel.setData(aDatacomntresult);
			this.setLangHeader(aDatacomntresult);
			sap.ui.getCore().byId("mattextdetail").setModel(oDetailintcomntModel);
		}
		if (TableKey === "Quality") {
			this.setHeader();
			Row = aDataQuality[RowIdNotes];
			RowIdNotes++;
			var vQualityTotal = aDataQuality.length;
			//setting the header of the page with the iterator buttons
			this.setPageTitleFooter("Quality", RowIdNotes, vQualityTotal);
			var oDetailQualityModel = new sap.ui.model.json.JSONModel();
			var aDataQualityresult = result.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[Row];
			oDetailQualityModel.setData(aDataQualityresult);
			this.setLangHeader(aDataQualityresult);
			sap.ui.getCore().byId("mattextdetail").setModel(oDetailQualityModel);
		}
		if (TableKey === "PurchOrderTxt") {
			this.setHeader();
			Row = aDataPurch[RowIdNotes];
			RowIdNotes++;
			var vPurchTotal = aDataPurch.length;
			//setting the header of the page with the iterator buttons
			this.setPageTitleFooter("PurchOrderTxt", RowIdNotes, vPurchTotal);
			var oDetailPurchModel = new sap.ui.model.json.JSONModel();
			var aDataPurchresult = result.data.__batchResponses[0].data.MATERIAL2LONGTEXTSRel.results[Row];
			oDetailPurchModel.setData(aDataPurchresult);
			this.setLangHeader(aDataPurchresult);
			sap.ui.getCore().byId("mattextdetail").setModel(oDetailPurchModel);
		}
	},
	setLangHeader: function(aData) {
		var sLangucode = aData.LANGUCODE__TXT + " " + "(" + aData.LANGUCODE + ")";
		var NotesHeader = this.getView().getModel("i18n").getProperty("Language") + ":" + " " + sLangucode;
		this.getView().byId("MatBasicDataDetailHeader").setTitle(NotesHeader);
	},
	getSizeDimNetWtData: function(Meinh, gewei_txt, gewei) {

		var generalresult = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getGeneralDetailData();
		var vBaseuntmsr = generalresult.data.MEINS;
		//if unit of msr of the row is equal to base unit of measure then setting the model for net weight na size dimension from basic data
		if (Meinh === vBaseuntmsr) {
			generalresult.data.NTGEW = this.MapDimensionDesc(generalresult.data.NTGEW, gewei_txt, gewei);
			var oDetailgeneralModel = new sap.ui.model.json.JSONModel();
			oDetailgeneralModel.setData(generalresult.data);
			sap.ui.getCore().byId("Txt_NTGEW").setModel(oDetailgeneralModel);
			sap.ui.getCore().byId("Txt_GROES").setModel(oDetailgeneralModel);
			this.Netweightsetflag = 1;
		}

	},

	setPageTitleFooter: function(sTitle, RowId, Total) {
		var GeneralDetailsTitle;
		var vCstmHdr = this.getPage().getCustomHeader();
		vCstmHdr.destroyContentMiddle();
		if (RowId !== undefined && Total !== undefined) {
			GeneralDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr(sTitle, RowId, Total);
			vCstmHdr.addContentMiddle(new sap.m.Text({
				text: GeneralDetailsTitle
			}));
			var vlocalIns = this;
			if (sap.ui.getCore().byId("MatBasicDataBtnPrev") === undefined && sap.ui.getCore().byId("MatBasicDataBtnNext") === undefined) {
				vCstmHdr.addContentRight(new sap.m.Button({
					id: "MatBasicDataBtnPrev",
					icon: "sap-icon://up",
					press: function() { // On click event of previous button  
						if (vlocalIns.vRoutername === "matGtinDataDetail") {
							vlocalIns.vGtinRowid--;
							// var iIteratornext = this.getView().byId("MatBasicDataBtnPrev");
							vlocalIns.getnextdatadetail();
						} else if (vlocalIns.vRoutername === "matNotesDetail") {
							vlocalIns.vGtinRowid--;
							vlocalIns.getnextdatadetail();
						}

					}
				}));
				vCstmHdr.addContentRight(new sap.m.Button({
					id: "MatBasicDataBtnNext",
					icon: "sap-icon://down",
					press: function() { // On click event of next button  
						if (vlocalIns.vRoutername === "matGtinDataDetail") {

							vlocalIns.vGtinRowid++;
							vlocalIns.getnextdatadetail();
						} else if (vlocalIns.vRoutername === "matNotesDetail") {
							vlocalIns.vGtinRowid++;
							vlocalIns.getnextdatadetail();
						}
					}
				}));
			}

			sap.ui.getCore().byId("MatBasicDataBtnPrev").setVisible(true);
			sap.ui.getCore().byId("MatBasicDataBtnNext").setVisible(true);
			if (RowId === 1 && RowId === Total) {
				sap.ui.getCore().byId("MatBasicDataBtnPrev").setVisible(false);
				sap.ui.getCore().byId("MatBasicDataBtnNext").setVisible(false);
			} else if (RowId !== 1 && RowId === Total) {
				sap.ui.getCore().byId("MatBasicDataBtnNext").setEnabled(false);
				sap.ui.getCore().byId("MatBasicDataBtnPrev").setEnabled(true);
			} else if (RowId === 1 && Total > 1) {
				sap.ui.getCore().byId("MatBasicDataBtnNext").setEnabled(true);
				sap.ui.getCore().byId("MatBasicDataBtnPrev").setEnabled(false);
			} else {
				sap.ui.getCore().byId("MatBasicDataBtnNext").setEnabled(true);
				sap.ui.getCore().byId("MatBasicDataBtnPrev").setEnabled(true);
			}
		} else {
			GeneralDetailsTitle = fcg.mdg.approvecrv2.util.Formatter.getPlantDetailHdr(sTitle);
			vCstmHdr.addContentMiddle(new sap.m.Text({
				text: GeneralDetailsTitle
			}));
			if (sap.ui.getCore().byId("MatBasicDataBtnPrev") !== undefined && sap.ui.getCore().byId("MatBasicDataBtnNext") !== undefined) {
				sap.ui.getCore().byId("MatBasicDataBtnPrev").setVisible(false);
				sap.ui.getCore().byId("MatBasicDataBtnNext").setVisible(false);
			}
		}
	}

});