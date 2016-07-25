/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*Formatter.js has functions for modifying the values on the screen
 * or the properties of the fields except S2 list and s3 header
 */

jQuery.sap.declare("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
// NLUN - CodeScan Changes - Global variable / Bad definition
fcg.mdg.approvecrv2.util.Formatter = { // view code and description
	descriptionAndCode: function(sDesc, sCode) {
		if ((sDesc === "" || sDesc === undefined || sDesc === null) && (sCode === "" || sCode === undefined || sCode === null)) {
			return false;
		} else {
			if (sDesc !== "" && sCode === "")
				return sDesc;
			else if (sDesc === "" && sCode !== "")
				return sCode;
			else if (sDesc !== "" && sCode !== "")
				return sDesc + '(' + sCode + ')';
		}
	},
	// Date and time in user format
	dateTime: function(sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return false;
		} else {
			var locale = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application
				.getImpl().getResourceBundle().sLocale);
			var vDate = sap.ca.ui.model.format.DateFormat.getDateInstance(locale)
				.format(sValue);
			var vTime = sap.ca.ui.model.format.DateFormat.getTimeInstance()
				.format(sValue);
			var vtimestamp = vDate + " " + vTime;

			return vtimestamp;
		}
	},
	getMatVisibiltyBasedOnParameter: function(ch) {
		var vPSTAT = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getPSTAT();
		if (vPSTAT === "") {
			return true;
		}
		if (vPSTAT.indexOf(ch) >= 0) {
			return true;
		} else {
			return false;
		}

	},

	// Date and time in user format
	matPurchDays: function(sValue) {
		if (sValue !== '') {
			var oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
			var oI18nModel = oApplicationImplementation.AppI18nModel;
			var sPurchDays = sValue + ' ' + oI18nModel.getProperty('MAT_PURCH_DAYS');
			return sPurchDays;
		}
	},

	// Check box show yes or no
	checkBox: function(sValue) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application
			.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;

		var newVal = "";
		if (sValue === "X") {
			newVal = oI18nModel.getProperty('PC_YES');
		}
		return newVal;
	},

	//formatting for the validity period
	validityFormatter: function(oValidFrom, oValidTo) {

		var oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;
		var vFrom = "";
		var vTo = "";
		var locale = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application
			.getImpl().getResourceBundle().sLocale);
		if (oValidFrom === "" || oValidFrom === null || oValidFrom === undefined || oValidTo === "" || oValidTo === null || oValidTo ===
			undefined)
			return "";

		if (oValidFrom) {
			vFrom = sap.ca.ui.model.format.DateFormat.getDateInstance(locale).format(oValidFrom);
		}

		if (oValidTo) {
			vTo = sap.ca.ui.model.format.DateFormat.getDateInstance(locale).format(oValidTo);
		}

		var resultValidity = oI18nModel.getProperty("Validity") + ": " + vFrom + " - " + vTo;
		return resultValidity;
		//	return this.getView().getModel("i18n").getProperty("Validity") + ": " + vFrom + " - " + vTo;
	},

	description: function(sValue1, sValue2) {
		if (sValue1 === null && sValue2 === null)
			return "";
		if (sValue1 !== undefined && sValue2 !== undefined) {
			var finalValue = "";
			if (sValue1 !== "" && sValue2 !== "") {
				finalValue = sValue2 + " (" + sValue1 + ")";
			} else if (sValue1 === "" && sValue2 !== "") {
				finalValue = sValue2;
			} else if (sValue1 !== "" && sValue2 === "") {
				finalValue = sValue1;
			}

			return finalValue;
		}
	},

	// Currency formatter
	currency: function(sValue1, sValue2) {
		if (sValue1 !== undefined) {
			var finalValue = "";
			if (sValue1 !== "0.00" && sValue1 !== "0,00" && sValue2 !== undefined && sValue2 !== "") {
				finalValue = sap.ca.ui.model.format.AmountFormat
					.FormatAmountStandard(sValue1) + " " + sValue2;
				return finalValue;

			} else if (sValue1 !== "0.00" && sValue1 !== "0,00" && sValue1 !== "") {
				finalValue = sap.ca.ui.model.format.AmountFormat
					.FormatAmountStandard(sValue1);
				return finalValue;
			}

			return sValue1;
		}
	},

	// Set default value for formatters
	defaultValue: function(sValue) {
		if (sValue === "00000000" || sValue === "0.0" || sValue === "0,0" || sValue === "00" || sValue === "0" || sValue === "0.00" || sValue ===
			"0,00" || sValue === "0,000" || sValue ===
			"000" || sValue === "0.000" || sValue === "0,000" || sValue === "0.0000" || sValue === "0,0000" || sValue === "0000" || sValue ===
			"000000" || sValue === "" || sValue === null) {
			return false;
		} else {
			return true;
		}
	},
	// Default value change for not maintained
	defaultValueChange: function(sValue) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application
			.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;

		if (sValue === "00000000" || sValue === "0.0" || sValue === "00" || sValue === "0" || sValue === "0.00" || sValue === "000" || sValue ===
			"0000" || sValue === "000000" || sValue === "00.00.0000" || sValue === "00/00/0000" || sValue === "00-00-0000" || sValue ===
			"0000.00.00" || sValue === "0000/00/00" || sValue === "0000-00-00" || sValue === "000.00.00" || sValue === "000/00/00" || sValue ===
			"000-00-00") {
			var result = '(' + oI18nModel.getProperty('CC_NOT_MAIN') + ')';
			return result;
		} else
			return "";
	},
	// No value formatter

	noValue: function(sValue) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application
			.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;

		var newVal = "";
		if (sValue === "") {
			newVal = "(" + oI18nModel.getProperty("CC_NOT_MAIN") + ")";
		} else {
			newVal = sValue;
		}
		return newVal;
	},

	// Default value change for not maintained
	defaultMatValueChange: function(sValue) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application
			.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;
		if (sValue === "00000000" || sValue === "0.0" || sValue === "0,0" || sValue === "00" || sValue === "0" || sValue === "0.00" || sValue ===
			"0,00" || sValue === "000" || sValue === "0.000" || sValue === "0,000" || sValue === "0.0000" || sValue === "0,0000" || sValue ===
			"0000" || sValue === "000000" || sValue === "" || sValue === null) {
			var result = '(' + oI18nModel.getProperty('CC_NOT_MAIN') + ')';
			return result;
		} else {
			return sValue;
		}
	},
	// No value formatter

	noValueNull: function(sValue) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application
			.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;

		var newVal = "";
		if (sValue === "" || sValue === null) {
			newVal = "(" + oI18nModel.getProperty("CC_NOT_MAIN") + ")";
		} else {
			newVal = sValue;
		}
		return newVal;
	},
	// Modify attribute description
	ModifyAttributeDescriptions: function(vEntityName, aChangeData) {
		if (vEntityName === 'Address') {
			for (var i = 0; i < aChangeData.length; i++) {
				// Handle Removal of Irrelevant Attributes from Change Log.
				/*
				 * switch (aChangeData[i].Attribute) { case "TEL_NO":
				 * aChangeData.splice(i, 1); break; case "FAX_NO":
				 * aChangeData.splice(i, 1); break; case "URI_TYPE":
				 * aChangeData.splice(i, 1); break; }
				 */
				if (aChangeData[i].Attribute === "TEL_NO") {
					aChangeData.splice(i, 1);
					break;
				} else if (aChangeData[i].Attribute === "FAX_NO") {
					aChangeData.splice(i, 1);
					break;
				} else if (aChangeData[i].Attribute === "URI_TYPE") {
					aChangeData.splice(i, 1);
					break;
				}

				if (aChangeData[i].Entity === "BP_PersonVersion") {
					if (aChangeData[i].Attribute === "ADDR_VERS") {
						aChangeData.splice(i, 1);
						break;
					} else if (aChangeData[i].Attribute === "SORT1_P") {
						aChangeData.splice(i, 1);
						break;
					} else if (aChangeData[i].Attribute === "SORT2_P") {
						aChangeData.splice(i, 1);
						break;
					}
				}
				// Alter Descriptions Using this.
				if (aChangeData[i] !== undefined)
					aChangeData[i].AttributeDesc = this
					.getAttrbibuteDescription(aChangeData[i].Attribute,
						aChangeData[i].AttributeDesc);
			}
		}
		return aChangeData;
	},
	// Attribute Description
	getAttrbibuteDescription: function(attribute, vAttributeDesc) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application
			.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;

		var attributedesc = "";
		if (attribute === 'REFLEXIVE') {
			attributedesc = oI18nModel.getProperty('samepartner');
		} else if (attribute === 'Responsible Institn') {
			attributedesc = oI18nModel.getProperty('ResponsibleInst');
		} else if (attribute === 'URI') {
			attributedesc = oI18nModel.getProperty('WebSite');
		} else if (attribute === 'ZSABE') {
			attributedesc = oI18nModel.getProperty('ClerkaTCust');
		} else if (attribute === 'PERRL') {
			attributedesc = oI18nModel.getProperty('InvoicingDateList');
		} else if (attribute === 'EIKTO') {
			attributedesc = oI18nModel.getProperty('AcntCust');
		} else if (attribute === 'LIPRE') {
			attributedesc = oI18nModel.getProperty('SP_PriceMarking');
		} else if (attribute === 'STENR') {
			attributedesc = oI18nModel.getProperty('TaxNum');
		} else if (attribute === 'TIME_ZONE') {
			attributedesc = oI18nModel.getProperty('TIME_ZONE');
		} else if (attribute === 'TRANSPZONE') {
			attributedesc = oI18nModel.getProperty('TRANSPZONE');
		} else if (attribute === 'LIFN2') {
			attributedesc = oI18nModel.getProperty('Partner');
		} else if (attribute === 'XERSR') {
			attributedesc = oI18nModel.getProperty('Evalrecsettlereturn');
		} else if (attribute === 'XERSY') {
			attributedesc = oI18nModel.getProperty('Evalrecdel');
		} else if (attribute === 'KTGRD') {
			attributedesc = oI18nModel.getProperty('AcntAsigmntGrp');
		} else if (attribute === 'FISKU') {
			attributedesc = oI18nModel.getProperty('TaxOffice');
		} else if (attribute === 'ESRNR') {
			attributedesc = oI18nModel.getProperty('ISRNumber');
		} else if (attribute === 'TITLE_ACA1') {
			attributedesc = oI18nModel.getProperty('AcademicTitle');
		} else
			attributedesc = vAttributeDesc;

		return attributedesc;
	},
	// View visibility formatter
	visibility: function(sValue1, sValue2) {
		if ((sValue1 === undefined || sValue1 === "" || sValue1 === null || sValue1 === "|#|" || sValue1 === "|#-#|") && (sValue2 === undefined ||
			sValue2 === "" || sValue2 === null || sValue1 === "|#|" || sValue1 === "|#-#|")) {
			return false;
		} else {
			return true;
		}
	},
	visibilityERPTitle: function(sValue1, sValue2, sValue3) {
		if (sValue1 === "" && sValue2 === "" && sValue3 === "") {
			return false;
		} else {
			return true;
		}
	},
	getPlantDetailHdr: function(sText, vSelected, vTotal) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;
		var sRequest = oI18nModel.getProperty("DETAIL_TITLE");
		var sMaterial = oI18nModel.getProperty("MATERIAL");
		var sPlant = oI18nModel.getProperty("plant");
		var vDetailsHdrTxt = "";
		if (sText === "Plant") {
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " (" + vSelected + "/" + vTotal + ")";
			return vDetailsHdrTxt;
		} else if (sText === "Storage") {
			var StrgDtlTitle = oI18nModel.getProperty("StorageLoctn");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + StrgDtlTitle + " (" + vSelected + "/" + vTotal + ")";
			return vDetailsHdrTxt;
		} else if (sText === "MRP") {
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + vTotal;
			return vDetailsHdrTxt;
		} else if (sText === "InspctnType") {
			var InspTitle = oI18nModel.getProperty("Mat_InspctnType");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + InspTitle + " (" + vSelected + "/" + vTotal + ")";
			return vDetailsHdrTxt;
		} else if (sText === "MRPArea") {
			var MrpAreaTitle = oI18nModel.getProperty("Mat_PlntMRPArea");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + MrpAreaTitle + " (" + vSelected + "/" + vTotal + ")";
			return vDetailsHdrTxt;
		} else if (sText === "PrdVersn") {
			var PrdVerTitle = oI18nModel.getProperty("Mat_Prd_Ver");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + PrdVerTitle + " (" + vSelected + "/" + vTotal + ")";
			return vDetailsHdrTxt;
		} else if (sText === "Valuation") {
			var ValuationTitle = oI18nModel.getProperty("Mat_Val_Type");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + ValuationTitle + " (" + vSelected + "/" + vTotal + ")";
			//	vDetailsHdrTxt = ValuationTitle + " (" + vSelected + "/" + vTotal + ")";
			return vDetailsHdrTxt;
		} else if (sText === "Dimension") {
			var DimTitle = oI18nModel.getProperty("Mat_Dimension");
			if (vSelected !== undefined && vTotal !== undefined) {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + DimTitle + " (" + vSelected + "/" + vTotal + ")";
			} else {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + DimTitle;
			}
			return vDetailsHdrTxt;
		} else if (sText === "BasicTxt") {
			var BasicTxtTitle = oI18nModel.getProperty("Mat_Basic_Txt");
			if (vSelected !== undefined && vTotal !== undefined) {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + BasicTxtTitle + " (" + vSelected + "/" + vTotal + ")";
			} else {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + BasicTxtTitle;
			}
			return vDetailsHdrTxt;
		} else if (sText === "Descr") {
			var DescrTitle = oI18nModel.getProperty("Mat_Txt_Description");
			if (vSelected !== undefined && vTotal !== undefined) {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + DescrTitle + " (" + vSelected + "/" + vTotal + ")";
			} else {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + DescrTitle;
			}
			return vDetailsHdrTxt;
		} else if (sText === "PurchOrderTxt") {
			var PurchTitle = oI18nModel.getProperty("Mat_Purch_Order_Txt");
			if (vSelected !== undefined && vTotal !== undefined) {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + PurchTitle + " (" + vSelected + "/" + vTotal + ")";
			} else {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + PurchTitle;
			}
			return vDetailsHdrTxt;
		} else if (sText === "IntComnt") {
			var IntComntitle = oI18nModel.getProperty("Mat_Internal_Comment");
			if (vSelected !== undefined && vTotal !== undefined) {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + IntComntitle + " (" + vSelected + "/" + vTotal + ")";
			} else {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + IntComntitle;
			}
			return vDetailsHdrTxt;
		} else if (sText === "Quality") {
			var QualityTitle = oI18nModel.getProperty("Mat_Quality_Inspection");
			if (vSelected !== undefined && vTotal !== undefined) {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + QualityTitle + " (" + vSelected + "/" + vTotal + ")";
			} else {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + QualityTitle;
			}
			return vDetailsHdrTxt;
		} else if (sText === "Material") {
			vDetailsHdrTxt = sRequest + ": " + sMaterial;
			return vDetailsHdrTxt;
		} else if (sText === "Purchasing") {
			var sPurchasingtitle = oI18nModel.getProperty("Mat_Purchasing");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPurchasingtitle;
			return vDetailsHdrTxt;
		} else if (sText === "Classification") {
			var sClassification = oI18nModel.getProperty("Mat_Classification");
			if (vSelected !== undefined && vTotal !== undefined) {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sClassification + " (" + vSelected + "/" + vTotal + ")";
			} else {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sClassification;
			}
			return vDetailsHdrTxt;
		}
	},

	getChngPlantDetailHdr: function(sText) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;
		var sRequest = oI18nModel.getProperty("DETAIL_TITLE");
		var sMaterial = oI18nModel.getProperty("MATERIAL");
		var sPlant = oI18nModel.getProperty("plant");
		var sMrptxt = oI18nModel.getProperty("Plant_MRPTxt");
		var vDetailsHdrTxt = "";
		if (sText === "Plant") {
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant;
			return vDetailsHdrTxt;
		} else if (sText === "Storage") {
			var StrgDtlTitle = oI18nModel.getProperty("StorageLoctn");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + StrgDtlTitle;
			return vDetailsHdrTxt;
		} else if (sText === "MRP") {
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + sMrptxt;
			return vDetailsHdrTxt;
		} else if (sText === "InspctnType") {
			var InspTitle = oI18nModel.getProperty("Mat_InspctnType");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + InspTitle;
			return vDetailsHdrTxt;
		} else if (sText === "MRPArea") {
			var MrpAreaTitle = oI18nModel.getProperty("Mat_PlntMRPArea");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + MrpAreaTitle;
			return vDetailsHdrTxt;
		} else if (sText === "PrdVersn") {
			var PrdVerTitle = oI18nModel.getProperty("Mat_Prd_Ver");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + PrdVerTitle;
			return vDetailsHdrTxt;
		} else if (sText === "Valuation") {
			var ValuationTitle = oI18nModel.getProperty("Mat_Val_Type");
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sPlant + " - " + ValuationTitle;
			return vDetailsHdrTxt;
		}
	},

	getWsPnlCntntTtl: function(sPrefix, stitle) {
		var sTitle = "";
		sTitle = sPrefix + " - " + stitle;
		return sTitle;
	},

	Date: function(oValue) {
		if (oValue) {
			return sap.ca.ui.model.format.DateFormat.getDateInstance().format(
				oValue);
		} else {
			return "";
		}
	},

	/*
	 * currencycode: function (value1) { if(value1){ return
	 * sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("UNWEIGHTED_VOLUME_IN",[value1]); }
	 * else{ return ""; } },
	 */
	// Status State formatter
	statusState: function(value) {

		if (value) {
			if (value === "E0001") {
				return "None";
			}
			if (value === "E0002") {
				return "Warning";
			}
			if (value === "E0003") {
				return "Success";
			}
			if (value === "E0004") {
				return "Error";
			}

		} else
			return "None";
	},
	// Date formatter
	dateFormatter: function(oValue) {
		if (oValue === "" || oValue === null || oValue === undefined)
			return "";
		var locale = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application
			.getImpl().getResourceBundle().sLocale);
		var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
			style: "medium"
		}, locale);
		return formatter.format(oValue);

	},

	// Mime type formatter for the icons
	mimeTypeFormatter: function(value) { // icon
		var sIcon = "";
		if (!value) {
			return "sap-icon://document";
		}
		if (value.indexOf('image') === 0) {
			sIcon = "sap-icon://attachment-photo";
		} else if (value.indexOf('video') === 0) {
			sIcon = "sap-icon://attachment-video";
		} else if (value.indexOf('text') === 0) {
			sIcon = "sap-icon://attachment-text-file";
		} else if (value.indexOf('audio') === 0) {
			sIcon = "sap-icon://attachment-audio";
		} else if (value.indexOf('application') === 0) {

			switch (value) {
				case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
				case 'application/vnd.ms-powerpoint':
				case 'application/vnd.openxmlformats-officedocument.presentationml.template':
					sIcon = "sap-icon://ppt-attachment";
					break;
				case 'application/msword':
				case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
					sIcon = "sap-icon://doc-attachment";
					break;
				case 'application/vnd.ms-excel':
				case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				case 'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
					sIcon = "sap-icon://excel-attachment";
					break;
					/*
					 * case 'image/jpeg': case 'image/png': case 'image/tiff': case
					 * 'image/gif': return 'jpg'; break;
					 */
				case 'application/pdf':
					sIcon = "sap-icon://pdf-attachment";
					break;
				case 'application/xhtml+xml':
					sIcon = "sap-icon://attachment-html";
					break;
				case 'application/zip':
				case 'application/gzip':
					sIcon = "sap-icon://attachment-zip-file";
					break;
					/*
					 * case 'text/plain': return 'txt'; break;
					 */
				default:
					sIcon = "sap-icon://document";
			}
		} else {
			sIcon = "sap-icon://document";
		}
		return sIcon;
	},

	// medium date
	mediumDate: function(oValue) {
		if (oValue) {
			return sap.ca.ui.model.format.DateFormat.getDateInstance({
				style: "medium"
			}).format(oValue);
		} else {
			return "";
		}
	},

	// Handle Cell Bolding
	handleCellBolding: function(oCell, oModel, vElement) {
		var sStyleClass = "text_bold";
		var sRedClass = "sapThemeText";
		oCell.removeStyleClass(sStyleClass);
		//oCell.addStyleClass();
		var ctx = oCell.getBindingContext();
		if (oModel.oData.hasOwnProperty('results') === true) {

			// Get the Data of the Current Row
			var i = ctx.sPath.slice(9, 12);

			if (i < oModel.oData.results.length) {
				// The cases where i > oModel.oData.results.length are illegal
				// Shouldn't have come till here as the table is bound to a
				// Model which has max length of
				// oModel.oData.results.length only and template shouldn't have
				// made this call. Ignore those illegal ones.
				if (oModel.oData.results.length > 0 && oModel.oData.results[i].hasOwnProperty('ChangeData') === true) {
					var aChangeData = oModel.oData.results[i].ChangeData;
					if (aChangeData.results !== undefined && aChangeData.results.length !== 0) {
						// Loop across the ChangeData Table
						for (var j = 0; j < aChangeData.results.length; j++) {
							if ((aChangeData.results[j].Attribute === vElement && aChangeData.results[j].OldValue !== aChangeData.results[j].NewValue) || (
								aChangeData.results[j].Attribute === "" && aChangeData.results[j].EntityAction === "C")) {
								oCell.addStyleClass(sStyleClass);
							} else if ((aChangeData.results[j].Attribute === vElement && aChangeData.results[j].OldValue !== aChangeData.results[j].NewValue) ||
								(
									aChangeData.results[j].Attribute === "" && aChangeData.results[j].EntityAction === "D")) {
								oCell.addStyleClass(sRedClass);
							}

						}
					}
				}

			}
		}
	},

	// Handle Cell Bolding
	handleMatCellBolding: function(oCell, oModel, vElement, vEnAction) {
		var sStyleClass = "text_bold";
		var sRedClass = "sapThemeText";
		oCell.removeStyleClass(sStyleClass);
		// oCell.addStyleClass();
		var ctx = oCell.getBindingContext();
		if (oModel.oData.hasOwnProperty('results') === true) {

			// Get the Data of the Current Row
			var i = ctx.sPath.slice(9, 12);

			if (i < oModel.oData.results.length) {
				// The cases where i > oModel.oData.results.length are illegal
				// Shouldn't have come till here as the table is bound to a
				// Model which has max length of
				// oModel.oData.results.length only and template shouldn't have
				// made this call. Ignore those illegal ones.
				if (oModel.oData.results.length > 0 && oModel.oData.results[i].hasOwnProperty('ChangeData') === true) {
					var aChangeData = oModel.oData.results[i].ChangeData;
					if (aChangeData.results !== undefined && aChangeData.results.length !== 0) {
						// Loop across the ChangeData Table
						for (var j = 0; j < aChangeData.results.length; j++) {
							if (aChangeData.results[j].Attribute === vElement && aChangeData.results[j].EntityAction === "U") {
								oCell.addStyleClass(sStyleClass);
							} else if (vEnAction === "U" && aChangeData.results[j].EntityAction === "C") {
								oCell.addStyleClass(sStyleClass);
							} else if ((vEnAction === "C" && aChangeData.results[j].EntityAction === "C")) {
								return;
							} else if ((aChangeData.results[j].Attribute === vElement && aChangeData.results[j].OldValue !== aChangeData.results[j].NewValue) ||
								(
									aChangeData.results[j].Attribute === "" && aChangeData.results[j].EntityAction === "D")) {
								oCell.addStyleClass(sRedClass);
							}

						}
					}
				}

			}
		}
	},

	// Cell Bolding for dunning area and withholding taxes
	handleCellBoldingDunningTax: function(oCell, oModel) {
		oCell.removeStyleClass();
		oCell.addStyleClass();
		var sPath = oCell.getBindingContext().getPath().split("/")[2];
		for (var j = 0; j < oModel.oData.ChangeData.length; j++) {
			if (oModel.oData.dataitems[sPath] !== undefined) {
				if (oModel.oData.dataitems[sPath].Dunning === oModel.oData.ChangeData[j].changeId || oModel.oData.dataitems[sPath].withhld === oModel.oData
					.ChangeData[j].changeId) {
					var sStyleClass = "text_bold";
					oCell.addStyleClass(sStyleClass);
				}
			}
		}
	},

	// Reset Bold in Forms
	resetFormBolding: function(oView) {
		var oViewContent = oView.getContent();
		var vHasContent = '';
		var i = "";
		// Recursive Logic to get all the contents of the Form till the element
		// level
		for (i = 0; i < oViewContent.length; i++) {
			try {
				vHasContent = 'X';
				oViewContent[i].getContent();
			} catch (err) {
				vHasContent = '';
			}
			if (vHasContent === 'X') {
				oViewContent = oViewContent
					.concat(oViewContent[i].getContent());
			}
		}
		// Remove Design and style class from all the UI elements. 
		for (i = 0; i < oViewContent.length; i++) {
			try {
				oViewContent[i].setDesign("Standard");
			} catch (err) {
				//
			}
			try {
				oViewContent[i].removeStyleClass("text_bold");
			} catch (err) {
				//
			}
		}
	},

	// Get the concatenated value of the Distribution Chain 
	getSalesOrgHeader: function(key1, desc1, key2, desc2) {

		return desc1 + ' (' + key1 + ')/' + desc2 + ' (' + key2 + ' )';

	},

	// Get the concatenated value of the supplied key and description 
	getKeyDesc: function(key, desc) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application
			.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;
		if (key === "X" && desc === oI18nModel.getProperty('PC_YES')) {
			return oI18nModel.getProperty('PC_YES');
		}
		if (desc === "" || desc === undefined || desc === null) {
			return key;
		} else if (key === "" || key === undefined || key === null) {
			return key;
		} else {
			return desc + ' (' + key + ')';
		}
	},
	getValuationDesc: function(key, desc) {
		if (key === "X" && desc !== "") {
			var sDesc = desc;
			return sDesc;
		} else {
			return desc;
		}
	},

	getUnitDesc: function(value, unit, desc) {
		if (desc === "" || desc === undefined || desc === null)
			return value + ' ' + unit;
		else
			return value + ' ' + desc + ' (' + unit + ')';
	},

	Truncate: function(Txt) {
		if (Txt.length > 40) {
			var trimmedText = Txt.substring(0, 30) + "...";
			return trimmedText;
		} else {
			return Txt;
		}
	},
	checkBoxTable: function(sValue) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application
			.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;

		var newVal = "";
		if (sValue === "X") {
			newVal = oI18nModel.getProperty('PC_YES');
		} else {
			newVal = oI18nModel.getProperty('PC_NO');
		}
		return newVal;
	},

	removeLeadingZeros: function(sValue) {

		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		}
		var res = isNaN(parseInt(sValue), 10) ? sValue : parseInt(sValue, 10);
		return res;
	},

	descriptionWithRemoveZeros: function(sValue1, sValue2) {
		if (sValue1 === null && sValue2 === null)
			return "";
		if (sValue1 !== undefined && sValue2 !== undefined) {
			var finalValue = "";
			sValue1 = isNaN(parseInt(sValue1, 10)) ? sValue1 : parseInt(sValue1, 10);
			sValue2 = isNaN(parseInt(sValue2, 10)) ? sValue2 : parseInt(sValue2, 10);
			if (sValue1 !== "" && sValue2 !== "") {
				finalValue = sValue2 + " (" + sValue1 + ")";
			} else if (sValue1 === "" && sValue2 !== "") {
				finalValue = sValue2;
			} else if (sValue1 !== "" && sValue2 === "") {
				finalValue = sValue1;
			}

			return finalValue;
		}
	},

	handleCellBoldingSubrange: function(oCell, oModel) {
		oCell.removeStyleClass();
		oCell.addStyleClass();
		var sPath = oCell.getBindingContext().getPath().split("/")[2];
		for (var j = 0; j < oModel.oData.ChangeData.length; j++) {
			if (oModel.oData.dataitems[sPath] !== undefined) {
				if (oModel.oData.dataitems[sPath].Key === oModel.oData.ChangeData[j].changeId ||
					oModel.oData.dataitems[sPath].Key.indexOf(oModel.oData.ChangeData[j].changeId) > -1) {
					var sStyleClass = "text_bold";
					oCell.addStyleClass(sStyleClass);
				}
				if (oModel.oData.dataitems[sPath].SubrangeDeleted) {
					var sStyleClass = "sapThemeText";
					oCell.addStyleClass(sStyleClass);
				}
			}
		}
	},

	visibilityERPTitleFour: function(sValue1, sValue2, sValue3, sValue4) {
		if (fcg.mdg.approvecrv2.util.Formatter.isNull(sValue1) && fcg.mdg.approvecrv2.util.Formatter.isNull(sValue2) && fcg.mdg.approvecrv2.util.Formatter
			.isNull(sValue3) && fcg.mdg.approvecrv2.util.Formatter.isNull(sValue4)) {
			return false;
		} else {
			return true;
		}
	},

	visibilityERPTitleFive: function(sValue1, sValue2, sValue3, sValue4, sValue5) {
		if (sValue1 === "" && sValue2 === "" && sValue3 === "" && sValue4 === "" && sValue5 === "") {
			return false;
		} else {
			return true;
		}
	},

	visibilityERPTitleSix: function(sValue1, sValue2, sValue3, sValue4, sValue5, sValue6) {
		if (fcg.mdg.approvecrv2.util.Formatter.isNull(sValue1) && fcg.mdg.approvecrv2.util.Formatter.isNull(sValue2) && fcg.mdg.approvecrv2.util.Formatter
			.isNull(sValue3) && fcg.mdg.approvecrv2.util.Formatter.isNull(sValue4) && fcg.mdg.approvecrv2.util.Formatter.isNull(sValue5) && fcg.mdg.approvecrv2
			.util.Formatter.isNull(sValue6)) {
			return false;
		} else {
			return true;
		}
	},

	isNull: function(value) {
		return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || value === '' || parseInt(value) === 0;
	},

	visibilityERPTitleSeven: function(sValue1, sValue2, sValue3, sValue4, sValue5, sValue6, sValue7) {
		if (sValue1 === "" && sValue2 === "" && sValue3 === "" && sValue4 === "" && sValue5 === "" && sValue6 === "" && sValue7 === "") {
			return false;
		} else {
			return true;
		}
	},

	visibilityERPTitleTen: function(sValue1, sValue2, sValue3, sValue4, sValue5, sValue6, sValue7, sValue8, sValue9, sValue10) {
		if (sValue1 === "" && sValue2 === "" && sValue3 === "" && sValue4 === "" && sValue5 === "" && sValue6 === "" && sValue7 === "" && sValue8 ===
			"" && sValue9 === "" && sValue10 === "") {
			return false;
		} else {
			return true;
		}
	},
	handleCellMatBolding: function(oCell, oModel, vElement, vNewvalue) {
		if (vNewvalue !== "Added" && vNewvalue !== "Deleted") {
			var sStyleClass = "text_bold";
			oCell.removeStyleClass(sStyleClass);
			// oCell.addStyleClass();
			var ctx = oCell.getBindingContext();
			if (oModel.oData.hasOwnProperty('results') === true) {
				// Get the Data of the Current Row
				var k = ctx.sPath.slice(9, 10);
				if (k < oModel.oData.results.length) {
					// Loop across the ChangeData Table
					for (var i = 0; i < oModel.oData.results.length; i++) {
						for (var j = 0; j < oModel.oData.results[i].ChangeData.results.length; j++) {
							if ((oModel.oData.results[i].ChangeData.results[j].Attribute === vElement && oModel.oData.results[i].ChangeData.results[j].OldValue !==
								oModel.oData.results[i].ChangeData.results[j].NewValue) || (oModel.oData.results[i].ChangeData.results[j].Attribute === "" &&
								oModel.oData.results[i].ChangeData.results[j].EntityAction === "C")) {
								oCell.addStyleClass(sStyleClass);
							}
						}
					}
				}
			}
		}
	},
	handleCellMatclassBolding: function(oCell, oModel, vElement, oClasschangedModel) {
		if (oClasschangedModel !== undefined) {
			//bolding the changed data row
			var sStyleClass = "text_bold";
			oCell.removeStyleClass(sStyleClass);
			var ctx = oCell.getBindingContext();
			//getting the row no.
			var k = ctx.sPath.slice(11, 12);
			var classtext = oModel.oData.dataitems[k].classdata;
			// Loop across the ChangeData Table
			for (var i = 0; i < oClasschangedModel.oData.data.MATERIAL2CLASSTYPERel.results.length; i++) {
				for (var j = 0; j < oClasschangedModel.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results.length; j++) {
					if ((oClasschangedModel.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results[j].Attribute === vElement && oClasschangedModel
						.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results[j].NewValue === classtext
					)) {
						oCell.addStyleClass(sStyleClass);
					}
				}
			}
			//	}
			//	}
		}
	},
	handleCellMatcharBolding: function(oCell, oModel, vElement, oClasschangedModel) {
		if (oClasschangedModel !== undefined) {
			//bolding the changed data row
			var sStyleClass = "text_bold";
			oCell.removeStyleClass(sStyleClass);
			var ctx = oCell.getBindingContext();
			//getting the row no.
			var k = ctx.sPath.slice(11, 12);
			var charvalue = oModel.oData.dataitems[k].charvalue;
			// Loop across the ChangeData Table
			for (var i = 0; i < oClasschangedModel.oData.data.MATERIAL2CLASSTYPERel.results.length; i++) {
				for (var j = 0; j < oClasschangedModel.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results.length; j++) {
					if ((oClasschangedModel.oData.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results[j].Entity === vElement && oClasschangedModel.oData
						.data.MATERIAL2CLASSTYPERel.results[i].ChangeData.results[j].NewValue === charvalue
					)) {
						oCell.addStyleClass(sStyleClass);
					}
				}
			}
			//	}
			//	}
		}
	},
	// Date Format (dd.MM.yyyy)
	matDateFormat: function(sValue) {
		if (sValue) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd.MM.yyyy"
			});
			return oDateFormat.format(new Date(sValue));
		} else {
			return sValue;
		}
	},
	MatZerovisibility: function(sValue1) {
		if (sValue1 === undefined || sValue1 === "" || sValue1 === "0.00" || sValue1 === "0.000" || sValue1 === null || sValue1 === "|#|" ||
			sValue1 === "|#-#|" || sValue1 ==="0,00" || sValue1 ==="0,000") {
			return false;
		} else {
			return true;
		}
	},
	ParseObjKey: function(sValue1) {
		var n = sValue1.lastIndexOf("(");
		var j = sValue1.lastIndexOf(")");
		var key = sValue1.substring(n + 1, j);
		key = key.replace(/\s+/g, '');
		return key;
	},

	// Setting of the Warehouse Header in the S4 Detail Page  	

	getWarehouseDetailHdr: function(sText, vSelected, vTotal) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;
		var sRequest = oI18nModel.getProperty("DETAIL_TITLE");
		var sMaterial = oI18nModel.getProperty("MATERIAL");
		var sWarehouse = oI18nModel.getProperty("Warehouse");
		var vDetailsHdrTxt = "";
		if (sText === "Warehouse") {
			vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sWarehouse + " (" + vSelected + "/" + vTotal + ")";
			return vDetailsHdrTxt;
		}
	},
	// Setting the Document Header in the S4 Detail Page	
	getDocAssignmentDetailHdr: function(sText, vSelected, vTotal) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;
		var sRequest = oI18nModel.getProperty("DETAIL_TITLE");
		var sMaterial = oI18nModel.getProperty("MATERIAL");
		var sDocument = oI18nModel.getProperty("Mat_Document");
		var sTextTitle = oI18nModel.getProperty("Mat_Txt");
		var vDetailsHdrTxt = "";
		if (sText === "Document Assignment") {
			if (vSelected !== undefined && vTotal !== undefined) {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sDocument + " (" + vSelected + "/" + vTotal + ")";

			} else {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sDocument;
			}
			return vDetailsHdrTxt;
		} else if (sText === "Text") {
			if (vSelected !== undefined && vTotal !== undefined) {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sDocument + " - " + sTextTitle + " (" + vSelected + "/" + vTotal + ")";
			} else {
				vDetailsHdrTxt = sRequest + ": " + sMaterial + " - " + sDocument + " - " + sTextTitle;
			}
			return vDetailsHdrTxt;
		}
	},
   getValuationHeader: function(sValue) {
		var oApplicationImplementation = sap.ca.scfld.md.app.Application
			.getImpl();
		var oI18nModel = oApplicationImplementation.AppI18nModel;

		var newVal = "";
		if (sValue === "") {
			newVal = oI18nModel.getProperty("Valuation_Header");
		} else {
			newVal = oI18nModel.getProperty("Mat_Val_Split")+" ("+sValue+")";
		}
		return newVal;
	},

	handleCellMatSalesBolding: function(oCell, oModel, vUpdatedEntity) {
		var sStyleClass = "text_bold";
		oCell.removeStyleClass(sStyleClass);
		if (oModel.oData.hasOwnProperty('items') === true) {
			for (var i = 0; i < oModel.oData.items.length; i++) {
				if (oModel.oData.items[i].EntityAction === vUpdatedEntity) {
					oCell.addStyleClass(sStyleClass);
				} // end if
			} // end for
		} // end if
	}, // end handleCellMatSalesBolding
	matDateDoc: function(sValue) {

		if (sValue !== null && sValue !== "" && sValue !== undefined && sValue !== '00000000000000') {
			var sYear = sValue.substring(0, 4);
			var sMonth = sValue.substring(4, 6);
			var sDay = sValue.substring(6, 8);
			var sDate = sDay + "." + sMonth + "." + sYear;
			return sDate;
		} else {
			return "";
		}
	},
	//converting bytes 
	convertBytesToHigherOrder: function(byteToConvert) {

		var valueInBytes = typeof byteToConvert === "string" ? parseInt(byteToConvert) : byteToConvert;
		var exponent = parseInt(Math.log(valueInBytes) / Math.log(1024));
		var convertedValue = (valueInBytes / Math.pow(1024, exponent)).toFixed(2);
		switch (exponent) {
			case 0:
				if (convertedValue < 100) {
					return parseInt(convertedValue) + "bytes";
				} else {
					var convertedValue = (convertedValue / 1024).toFixed(2);
					var sIntConVal = parseInt(convertedValue) + 1;
					return sIntConVal + " KB";
				}
			case 1:
				return parseInt(convertedValue) + " KB";

			case 2:
				return parseInt(convertedValue) + " MB";
			case 3:
				return parseInt(convertedValue) + " GB";
			case 4:
				return parseInt(convertedValue) + " TB";
			case 5:
				return parseInt(convertedValue) + " PB";
			case 6:
				return parseInt(convertedValue) + " EB";
			case 7:
				return parseInt(convertedValue) + " ZB";
			case 8:
				return parseInt(convertedValue) + " YB";
		}
	},

	// Handle Cell Bolding for tables under plant
	handlePlantCellBolding: function(oCell, oModel, vElement) {
		var sStyleClass = "text_bold";
		var sRedClass = "sapThemeText";
		oCell.removeStyleClass(sStyleClass);
		oCell.removeStyleClass(sRedClass);
		//oCell.addStyleClass();
		var ctx = oCell.getBindingContext();
		if (oModel.oData.hasOwnProperty('results') === true) {

			// Get the Data of the Current Row
			var i = ctx.sPath.slice(9, 12);

			if (i < oModel.oData.results.length) {
				// The cases where i > oModel.oData.results.length are illegal
				// Shouldn't have come till here as the table is bound to a
				// Model which has max length of
				// oModel.oData.results.length only and template shouldn't have
				// made this call. Ignore those illegal ones.
				if (oModel.oData.results.length > 0 && oModel.oData.results[i].hasOwnProperty('ChangeData') === true) {
					var aChangeData = oModel.oData.results[i].ChangeData;
					if (aChangeData.results !== undefined && aChangeData.results.length !== 0) {
						if (aChangeData.results[0].EntityAction === 'D') {
							oCell.addStyleClass(sRedClass);
						} else if (aChangeData.results[0].EntityAction === 'C') {
							oCell.addStyleClass(sStyleClass);
						} else if (aChangeData.results[0].EntityAction === 'U') {
							// Loop across the ChangeData Table
							for (var j = 0; j < aChangeData.results.length; j++) {
								if (aChangeData.results[j].Attribute === vElement) {
									oCell.addStyleClass(sStyleClass);
								}
							}
						}
					}
				}
			}
		}
	},
	// Handle Plant MRP text Cell Bolding
	handlePlantMrpTxtCellBolding: function(oCell, oModel, vElement) {
		var sStyleClass = "text_bold";
		oCell.removeStyleClass(sStyleClass);
		if (oModel.oData.hasOwnProperty('data') === true) {
			if (oModel.oData.data !== null && oModel.oData.data.hasOwnProperty('ChangeData') === true) {
				var aChangeData = oModel.oData.data.ChangeData;
				if (aChangeData.results !== undefined && aChangeData.results.length !== 0) {
					if (aChangeData.results[0].EntityAction === 'C') {
						oCell.addStyleClass(sStyleClass);
					} else if (aChangeData.results[0].EntityAction === 'U') {
						// Loop across the ChangeData Table
						for (var j = 0; j < aChangeData.results.length; j++) {
							if (aChangeData.results[j].Attribute === vElement) {
								oCell.addStyleClass(sStyleClass);
							}
						}
					}
				}
			}
		}
	},
	// Handle Cell Bolding for plant storage location table
	handleStrgLocCellBolding: function(oCell, oModel, vElement, vEntity) {
		var sStyleClass = "text_bold";
		oCell.removeStyleClass(sStyleClass);
		var ctx = oCell.getBindingContext();
		if (oModel.oData.hasOwnProperty('results') === true) {

			// Get the Data of the Current Row
			var i = ctx.sPath.slice(9, 12);
			if (i < oModel.oData.results.length) {
				if (oModel.oData.results.length > 0 && oModel.oData.results[i].hasOwnProperty('ChangeData') === true) {
					var aChangeData = oModel.oData.results[i].ChangeData;
					if (aChangeData.results !== undefined && aChangeData.results.length !== 0) {
							for (var j = 0; j < aChangeData.results.length; j++) {
								if (aChangeData.results[j].Entity === vEntity && aChangeData.results[j].Attribute === vElement) {
									oCell.removeStyleClass(sStyleClass);
									oCell.addStyleClass(sStyleClass);
								}
							}
								if (vEntity === "MARDMRP" && aChangeData.results[0].Entity === "MARDSTOR" && aChangeData.results[0].EntityAction === "C"){
									oCell.removeStyleClass(sStyleClass);
									oCell.addStyleClass(sStyleClass);
								}
						}
					}
			}
		}
	},
	
		// Handle Cell Bolding for tables under plant
	handlePlantvalLdgrCellBolding: function(oCell, oModel, vElement) {
		var sStyleClass = "text_bold";
		oCell.removeStyleClass(sStyleClass);
		//oCell.addStyleClass();
		var ctx = oCell.getBindingContext();
		if (oModel.oData.hasOwnProperty('results') === true) {

			// Get the Data of the Current Row
			var i = ctx.sPath.slice(9, 12);

			if (i < oModel.oData.results.length) {
				// The cases where i > oModel.oData.results.length are illegal
				// Shouldn't have come till here as the table is bound to a
				// Model which has max length of
				// oModel.oData.results.length only and template shouldn't have
				// made this call. Ignore those illegal ones.
				if (oModel.oData.results.length > 0 && oModel.oData.results[i].hasOwnProperty('ChangeData') === true) {
					var aChangeData = oModel.oData.results[i].ChangeData;
					if (aChangeData.results !== undefined && aChangeData.results.length !== 0) {
						if (aChangeData.results[0].EntityAction === 'U') {
							// Loop across the ChangeData Table
							for (var j = 0; j < aChangeData.results.length; j++) {
								if (aChangeData.results[j].Attribute === vElement) {
									oCell.addStyleClass(sStyleClass);
								}
							}
						}
					}
				}
			}
		}
	}
};