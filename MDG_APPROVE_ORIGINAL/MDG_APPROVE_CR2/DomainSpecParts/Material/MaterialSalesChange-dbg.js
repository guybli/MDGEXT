/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesChange = {
	//Declaring global variables for this class
	oMaterialMARASalesTable: "",
	oMaterialSalesDistributionChainTable: "",
	oMaterialSalesTaxTable: "",
	oMaterialSalesTextTable: "",
	aDetailData: "",
	nodata: "",
	oAttachment: "",
	vLinkPressed: "",
	oS3Controller: "",
	strDistributionChain: "",
	strSalesTax: "",
	strSalesText: "",
	oMaterialS4SalesForm: "",
	oSalesTableS4Details: "",
	vAdded: "",
	vNotMaint: "",
	vDeleted: "",
	vNewDisbChainsAdded: [],
	sMARAChangeresults: [],
	sDisbChainChangeresults: [],
	sTaxChangeresults: [],
	sTextChangeresults: [],

	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	//  Initializing tables and adding them to layouts 
	initializeTables: function(oS3Controller) {
		this.oS3Controller = oS3Controller;
		//delete all UI contents if present for create layout
		sap.ui.getCore().byId("matCreateSalesDataLayout").removeAllContent();
		sap.ui.getCore().byId("matCreateSalesDataLayout").destroy();
		sap.ui.getCore().byId("matChangeSalesDataLayout").removeAllContent();
		this.vAdded = this.i18n.getText("PC_ADDED");
		this.vNotMaint = "(" + this.i18n.getText("PC_NOT_MAIN") + ")";
		this.vDeleted = this.i18n.getText("PC_DELETED");

	},

	//Function to map the table data on S3 and display it accordingly
	displayTableData: function(oInstance, oView) { // EXC_JSHINT_047
		// Create item template
		var oItemTempMaraSales = this.createTableTemplate();
		var oItemTempSalesDist = this.createTableTemplate();
		var oItemTempSalesTax = this.createTableTemplate();
		var oItemTempSalesText = this.createSalesTextTableTemplate();
		// Bind data to a MARASales,Distribution Chain related changes to a table
		this.bindSalesNDistributionChainTable(oView, oItemTempMaraSales, oItemTempSalesDist, oItemTempSalesTax, oItemTempSalesText);
	},

	// 		//Bind data to MARASales, SalesNDisb, SalesTax, SalesText table
	bindSalesNDistributionChainTable: function(oView, oItemTempMaraSales, oItemTempSalesDist, oItemTempSalesTax, oItemTempSalesText) {
		var oDataItems = {
			Attr: "",
			EntityDesc: "",
			EntityName: "",
			AttributeDesc: "",
			NewValue: "",
			OldValue: "",
			NewValueText: "",
			OldValueText: "",
			VKORG: "",
			VTWEG: "",
			ALAND: "",
			TATYP: ""
		};

		var oMARASalesData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMARASalesDetailData();
		var oSalesnDisbData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getSalesNDisbDetailData();
		var oSalesTaxData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMVKESalesTaxDetailData();
		var oSalesTextData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMVKESalesTextDetailData();

		// Loop thru the obtained MARASales data, appropriately structure the UI and bind the data for the template for MARASales
		this.workOnMARASalesData(oMARASalesData, oDataItems, oItemTempMaraSales, oView);

		oDataItems = [];
		// Loop at the Sales Org, Distribution Chain Data changes, appropriately structure the UI and bind the data for template and SalesNDisb
		this.workOnSalesNDisbData(oSalesnDisbData, oDataItems, oItemTempSalesDist, oView);

		oDataItems = [];
		// Loop on the Sales Tax data and bind the Sales Tax table
		this.workOnSalesTaxData(oSalesTaxData, oDataItems, oItemTempSalesTax, oView);

		oDataItems = [];
		// Loop on the SalesText table and Bind the Sales Text Table
		this.workOnSalesTextData(oSalesTextData, oDataItems, oItemTempSalesText, oView);

		if (this.sMARAChangeresults.length === 0 && this.sDisbChainChangeresults.length === 0 && this.sTaxChangeresults.length === 0 && this.sTextChangeresults
			.length === 0) {
			sap.ui.getCore().byId("matChangeSalesDataLayout").removeAllContent();
			var vNoDataTxt = this.i18n.getText("NodataChanged");
			var oMARASalesLayout = sap.ui.getCore().byId("matChangeSalesDataLayout");
			fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(oMARASalesLayout, vNoDataTxt);
		}
	}, // end of function bindSalesNDistributionChainTable

	workOnMARASalesData: function(oMARASalesData, oDataItems, oItemTempMaraSales, oView) {
		var strMaraSalesResults = {
			results: []
		};
		// creating an array to check for attribute names instead of hard coding the names of the attributes,
		// so that new attributes can be added at only one place.
		var sAttrTextValues = ["MSTAV", "KUNNR", "TRAGR", "VHART"];
		var sAttrNumericValues = ["GEWTO", "VOLTO", "STFAK", "ERVOL", "ERGEW", "ERGEI", "ERVOE"];
		var sAttrDateValues = ["MSTDV"];
		var sAttrChkBoxValues = ["KZGVH"];
		var sAttr = "";
		var vOldVal = "";
		var vOldValTxt = "";
		var vNewVal = "";
		var vNewValTxt = "";
		var vOldValBoln = "";
		var vNewValBoln = "";
		var vUOMVolChng = false;
		var vVolChng = false;
		var vUOMWtChng = false;
		var vWtChng = false;
		var vUom;

		// Instead of using the entire path from the results every time and every where assigning the path of the data to a variable and
		// using that variable every where; This improves readbility and maintainability.

		var oMARASalesChangeData = oMARASalesData.data.ChangeData;
		// Get the Material Number Data
		var lEntityName = fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(oMARASalesData.data.MATERIAL);

		for (var k = 0; k < oMARASalesChangeData.results.length; k++) {
			if (oMARASalesChangeData.results[k].EntityAction === fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vUpdatedEntity) {
				oDataItems.AttributeDesc = oMARASalesChangeData.results[k].AttributeDesc;
				sAttr = oMARASalesChangeData.results[k].Attribute;
				oDataItems.Attr = sAttr;
				vOldVal = oMARASalesChangeData.results[k].OldValue;
				vOldValTxt = oMARASalesChangeData.results[k].OldValueText;
				vNewVal = oMARASalesChangeData.results[k].NewValue;
				vNewValTxt = oMARASalesData.data.ChangeData.results[k].NewValueText;
				if (sAttrTextValues.indexOf(sAttr) !== -1) {
					if (vNewVal !== vOldVal) {
						if (vOldVal === "") {
							vOldVal = this.vNotMaint; //if nothing is maintained in the field when it was initially created
						} else {
							vOldVal = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vOldVal, vOldValTxt);
						}
						if (vNewVal === "" && vOldVal !== "") {
							vNewVal = this.vDeleted;
						} else if (vNewVal !== "") {
							vNewVal = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vNewVal, vNewValTxt);
						}
					} // end if NewVal != OldVal
					oDataItems.NewValue = vNewVal;
					oDataItems.OldValue = vOldVal;
					oDataItems.EntityDesc = oMARASalesData.data.MATERIAL__TXT + " (" + lEntityName + ")";
					strMaraSalesResults.results.push(oDataItems);
					oDataItems = [];
				} // end if sAttr
				else if (sAttrNumericValues.indexOf(sAttr) !== -1) {
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
					// Even if only the value has changed for Allowed Package Weight and Allowed Package Volume
					// 1. Handling numeric and UOM changes for Allowed Package Volume
					if (sAttr === "ERVOL") {
						vVolChng = true;
						vUom = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMARASalesData.data.ERVOE, oMARASalesData.data.ERVOE__TXT);
						oDataItems.NewValue = vNewVal + " " + vUom;
						if (oMARASalesChangeData.results[k].OldValue !== "0,000") {
							// no need to add the Unit of measure if old numneric value was not maintained in ERVOE
							oDataItems.OldValue = vOldVal + " " + vOldValTxt;
						} else {
							oDataItems.OldValue = vOldVal;
						}
					} // end of Handling Package Volume Value field
					else if (sAttr === "ERGEW") {
						vWtChng = true;
						vUom = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMARASalesData.data.ERGEI, oMARASalesData.data.ERGEI__TXT);
						oDataItems.NewValue = vNewVal + " " + vUom;
						if (oMARASalesChangeData.results[k].OldValue !== "0,000") {
							// no need to add the Unit of measure if old numneric value was not maintained in ERGEI
							oDataItems.OldValue = vOldVal + " " + vOldValTxt;
						} else {
							oDataItems.OldValue = vOldVal;
						}
					} // end of Handling Package Weight Value field
					else if (sAttr === "ERVOE" || sAttr === "ERGEI") {
						if (sAttr === "ERVOE") {
							// set the flag which will be used later
							vUOMVolChng = true;
						}
						if (sAttr === "ERGEI") {
							vUOMWtChng = true;
						}
						oDataItems.NewValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vNewVal, vNewValTxt);
						if (oMARASalesChangeData.results[k].OldValue !== "") {
							oDataItems.OldValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(vOldVal, vOldValTxt);
						} else {
							oDataItems.OldValue = vOldVal;
						} // end old value handling for ERGEI and ERVOE	
					} // end of handling Package Weight and Volume related UOM fields
					else {
						oDataItems.NewValue = vNewVal;
						oDataItems.OldValue = vOldVal;
					}
					oDataItems.EntityDesc = oMARASalesData.data.MATERIAL__TXT + " (" + lEntityName + ")";
					strMaraSalesResults.results.push(oDataItems);
					oDataItems = [];
				} // end else if sAttr for Numeric Values
				else if (sAttrDateValues.indexOf(sAttr) !== -1) {
					if (vNewVal !== vOldVal) {
						if (vOldVal === "" || vOldVal === "00.00.0000" || vOldVal === "00,00,0000") {
							vOldVal = this.vNotMaint; //if nothing is maintained in the field when it was initially created
						}
						if (vNewVal === "" || vNewVal === "00.00.0000" || vNewVal === "00,00,0000") {
							vNewVal = this.vDeleted;
						}
					}
					oDataItems.NewValue = vNewVal;
					oDataItems.OldValue = vOldVal;
					oDataItems.EntityDesc = oMARASalesData.data.MATERIAL__TXT + " (" + lEntityName + ")";
					strMaraSalesResults.results.push(oDataItems);
					oDataItems = [];
				} // end if NewVal !== oldVal for attributes with date values	
				else if (sAttrChkBoxValues.indexOf(sAttr) !== -1) { // Handling Checkbox
					if (vNewVal !== vOldVal) {
						if (vOldVal === "") {
							vOldVal = this.vNotMaint; //if nothing is maintained in the field when it was initially created
						}
						if (vNewVal === "" && vOldVal !== "") {
							vOldVal = fcg.mdg.approvecrv2.util.Formatter.checkBox(vOldVal);
							vNewVal = "(" + this.vDeleted + ")";
						} else if (vNewVal !== "") {
							vNewVal = fcg.mdg.approvecrv2.util.Formatter.checkBox(vNewVal);
						}
					} // end if NewVal !== oldVal for check boxes
					oDataItems.NewValue = vNewVal;
					oDataItems.OldValue = vOldVal;
					oDataItems.EntityDesc = oMARASalesData.data.MATERIAL__TXT + " (" + lEntityName + ")";
					strMaraSalesResults.results.push(oDataItems);
					oDataItems = [];
				} // end else if of sAttr	
			} // end End of if EntityAction
		} // end MARASales loop

		// Remove Package Volume Unit and Weight Unit if both value and UoM have changed as the display is of one row inclusive of both the changes
		var i = strMaraSalesResults.results.length;
		if (vUOMVolChng === true && vVolChng === true) {
			while (i--) {
				if (strMaraSalesResults.results[i] && strMaraSalesResults.results[i].Attr === "ERVOE") {
					strMaraSalesResults.results.splice(i, 1);
					break;
				} // end if
			} // end while loop
		} // endif ERVOE and the checks for both Volume and UOM change

		if (vUOMWtChng === true && vWtChng === true) {
			i = strMaraSalesResults.results.length;
			while (i--) {
				if (strMaraSalesResults.results[i] && strMaraSalesResults.results[i].Attr === "ERGEI") {
					strMaraSalesResults.results.splice(i, 1);
					break;
				} // end if
			} // end while loop
		} // endif ERGEI and the checks for both Volume and UOM change

		oItemTempMaraSales.attachPress({
			Entity: oMARASalesData,
			name: 'matSalesChangeDataDetail'
		}, oView.navtoSubDetail, oView);
		// Controller hook with strMaraSalesResults, oItemTempMaraSales in S3
		// Providing Extensibility point - Controller hook with strMaraSalesResults in S3
		var extMaraSalesResults = this.oS3Controller.matHookgetMARASalesResults(strMaraSalesResults);
		if (extMaraSalesResults !== undefined) {
			strMaraSalesResults = extMaraSalesResults;
		}
		this.bindMaraSalesFormData(strMaraSalesResults, oItemTempMaraSales);
	}, // end work on MARASalesData,

	workOnSalesNDisbData: function(oSalesnDisbData, oDataItems, oItemTempSalesDist, oView) {
		var strResults = {
			results: []
		};
		var strSalesOrgTxt = "";
		var strDisbChnTxt = "";
		var strDisbChain = "";
		var sAttr = "";
		var vOldVal = "";
		var vOldValTxt = "";
		var vNewVal = "";
		var vNewValTxt = "";
		var vOldValBoln = "";
		var vNewValBoln = "";
		var sAttrTextValues = ["MTPOS", "DWERK", "VMSTA", "VRKME", "MEGRU", "SCHME", "RDPRF", "VERSG", "BONUS", "PROVG", "PMATN",
			"KONDM", "PRODH", "KTGRM",
			"MTPOS", "MVGR1", "MVGR2", "MVGR3", "MVGR4", "MVGR5", "WRKSALES", "PRAT1", "PRAT2", "PRAT3", "PRAT4", "PRAT5", "PRAT6", "PRAT7",
			"PRAT8", "PRAT9", "PRATA", "MEGSALES", "RDPSALES"
		];
		var sAttrChkBoxValues = ["SKTOF", "VAVME"];
		var sAttrNumValues = ["AUMNG", "LFMNG", "SCMNG", "EFMNG"];
		var sAttrDateValues = ["VMSTD"];

		// Instead of using the entire path from the results every time and every where assigning the path of the data to a variable and
		// using that variable every where; This improves readbility and maintainability.

		var oMATERIAL2MVKERel = oSalesnDisbData.data.MATERIAL2MVKERel;

		for (var i = 0; i < oMATERIAL2MVKERel.results.length; i++) {
			if (oMATERIAL2MVKERel.results[i].ChangeData.results.length > 0) {

				switch (oMATERIAL2MVKERel.results[i].ChangeData.results[0].EntityAction) {
					case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vNewEntity:
						{
							// A new entity has been added
							oDataItems.NewValue = this.vAdded;
							oDataItems.OldValue = "";
							oDataItems.AttributeDesc = "";
							oDataItems.VKORG = oMATERIAL2MVKERel.results[i].VKORG;
							oDataItems.VTWEG = oMATERIAL2MVKERel.results[i].VTWEG;
							strSalesOrgTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKERel.results[i].VKORG, oMATERIAL2MVKERel.results[i].VKORG__TXT);
							strDisbChnTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKERel.results[i].VTWEG, oMATERIAL2MVKERel.results[i].VTWEG__TXT);
							oDataItems.EntityDesc = strSalesOrgTxt + ", " + strDisbChnTxt;
							oDataItems.EntityName = this.i18n.getText("SL_DIST_CHN");
							strResults.results.push(oDataItems);
							strDisbChain = oMATERIAL2MVKERel.results[i].VKORG + oMATERIAL2MVKERel.results[i].VTWEG;
							this.vNewDisbChainsAdded.push(strDisbChain);
							oDataItems = [];
							break;
						}
					case fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.vUpdatedEntity:
						{
							// existing values of the entity has been changed. 
							for (var j = 0; j < oMATERIAL2MVKERel.results[i].ChangeData.results.length; j++) {
								oDataItems.AttributeDesc = oMATERIAL2MVKERel.results[i].ChangeData.results[j].AttributeDesc;
								sAttr = oMATERIAL2MVKERel.results[i].ChangeData.results[j].Attribute;
								vOldVal = oMATERIAL2MVKERel.results[i].ChangeData.results[j].OldValue;
								vOldValTxt = oMATERIAL2MVKERel.results[i].ChangeData.results[j].OldValueText;
								vNewVal = oMATERIAL2MVKERel.results[i].ChangeData.results[j].NewValue;
								vNewValTxt = oMATERIAL2MVKERel.results[i].ChangeData.results[j].NewValueText;

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
									strSalesOrgTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKERel.results[i].VKORG, oMATERIAL2MVKERel.results[i].VKORG__TXT);
									strDisbChnTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKERel.results[i].VTWEG, oMATERIAL2MVKERel.results[i].VTWEG__TXT);
									oDataItems.EntityDesc = strSalesOrgTxt + ", " + strDisbChnTxt;
									oDataItems.EntityName = this.i18n.getText("SL_DIST_CHN");
									oDataItems.VKORG = oMATERIAL2MVKERel.results[i].VKORG;
									oDataItems.VTWEG = oMATERIAL2MVKERel.results[i].VTWEG;
									strResults.results.push(oDataItems);
									oDataItems = [];
								} // end if with sAttr
								else if (sAttrChkBoxValues.indexOf(sAttr) !== -1) {
									if (vNewVal !== vOldVal) {
										if (vOldVal === "") {
											vOldVal = this.vNotMaint; //if nothing is maintained in the field when it was initially created
										}
										if (vNewVal === "" && vOldVal !== "") {
											vOldVal = fcg.mdg.approvecrv2.util.Formatter.checkBox(vOldVal);
											vNewVal = "(" + this.vDeleted + ")";
										} else if (vNewVal !== "") {
											vNewVal = fcg.mdg.approvecrv2.util.Formatter.checkBox(vNewVal);
										}
									} // end if NewVal !== oldVal for check boxes
									oDataItems.NewValue = vNewVal;
									oDataItems.OldValue = vOldVal;
									strSalesOrgTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKERel.results[i].VKORG, oMATERIAL2MVKERel.results[i].VKORG__TXT);
									strDisbChnTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKERel.results[i].VTWEG, oMATERIAL2MVKERel.results[i].VTWEG__TXT);
									oDataItems.EntityDesc = strSalesOrgTxt + ", " + strDisbChnTxt;
									oDataItems.EntityName = this.i18n.getText("SL_DIST_CHN");
									oDataItems.VKORG = oMATERIAL2MVKERel.results[i].VKORG;
									oDataItems.VTWEG = oMATERIAL2MVKERel.results[i].VTWEG;
									strResults.results.push(oDataItems);
									oDataItems = [];
								} // end else if of sAttr	
								else if (sAttrNumValues.indexOf(sAttr) !== -1) {
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
									if (sAttr === "SCMNG") {
										// this is done as a decision has been taken that we handle this field name in the UI only.
										oDataItems.AttributeDesc = this.i18n.getText("SL_DLVR_UNIT");
									}
									oDataItems.NewValue = vNewVal;
									oDataItems.OldValue = vOldVal;
									strSalesOrgTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKERel.results[i].VKORG, oMATERIAL2MVKERel.results[i].VKORG__TXT);
									strDisbChnTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKERel.results[i].VTWEG, oMATERIAL2MVKERel.results[i].VTWEG__TXT);
									oDataItems.EntityDesc = strSalesOrgTxt + ", " + strDisbChnTxt;
									oDataItems.EntityName = this.i18n.getText("SL_DIST_CHN");
									oDataItems.VKORG = oMATERIAL2MVKERel.results[i].VKORG;
									oDataItems.VTWEG = oMATERIAL2MVKERel.results[i].VTWEG;
									strResults.results.push(oDataItems);
									oDataItems = [];
								} // end else if of sAttr
								else if (sAttrDateValues.indexOf(sAttr) !== -1) {
									if (vNewVal !== vOldVal) {
										if (vOldVal === "" || vOldVal === "00.00.0000" || vOldVal === "00,00,0000") {
											vOldVal = this.vNotMaint; //if nothing is maintained in the field when it was initially created
										}
										if (vNewVal === "" || vNewVal === "00.00.0000" || vNewVal === "00,00,0000") {
											vNewVal = this.vDeleted;
										}
									}
									oDataItems.NewValue = vNewVal;
									oDataItems.OldValue = vOldVal;
									strSalesOrgTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKERel.results[i].VKORG, oMATERIAL2MVKERel.results[i].VKORG__TXT);
									strDisbChnTxt = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKERel.results[i].VTWEG, oMATERIAL2MVKERel.results[i].VTWEG__TXT);
									oDataItems.EntityDesc = strSalesOrgTxt + ", " + strDisbChnTxt;
									oDataItems.EntityName = this.i18n.getText("SL_DIST_CHN");
									oDataItems.VKORG = oMATERIAL2MVKERel.results[i].VKORG;
									oDataItems.VTWEG = oMATERIAL2MVKERel.results[i].VTWEG;
									strResults.results.push(oDataItems);
									oDataItems = [];
								} // end if sAttrDateValues
							} //	end for with var j
						} // end case for entity action == U
					default:
						break;
				} // end switch statement for entityaction	
			} // end if
		} // end for with var i
		//On click of a row in S3, navigate to S4
		oItemTempSalesDist.attachPress({
			Entity: oSalesnDisbData,
			name: 'matSalesNDisbChangeDataDetail'
		}, oView.navtoSubDetail, oView);
		// Controller hook with strResults in S3
		// Providing Extensibility point - Controller hook with strResults in S3
		var extChangeDisbchainResults = this.oS3Controller.matHookgetChangeDisbChainResults(strResults);
		if (extChangeDisbchainResults !== undefined) {
			strResults = extChangeDisbchainResults;
		}
		this.bindDistChainFormData(strResults, oItemTempSalesDist);
	}, // end work on SalesNDisbData

	workOnSalesTaxData: function(oSalesTaxData, oDataItems, oItemTempSalesTax, oView) {
		var vDisbChain;
		var strResults = {
			results: []
		};
		var oMATERIAL2MVKESALESRel = oSalesTaxData.data.MATERIAL2MVKESALESRel;
		for (var i = 0; i < oMATERIAL2MVKESALESRel.results.length; i++) {
			for (var j = 0; j < oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results.length; j++) {
				vDisbChain = oMATERIAL2MVKESALESRel.results[i].VKORG + oMATERIAL2MVKESALESRel.results[i].VTWEG;
				// If the Sales Tax is part of the newly added Distribution Chain, then do not add it.
				if ((this.vNewDisbChainsAdded.indexOf(vDisbChain) === -1)) {
					if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[0] !== undefined &&
						oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[0].EntityAction === fcg.mdg.approvecrv2
						.DomainSpecParts.Material.Material.vNewEntity) {
						oDataItems.NewValue = this.vAdded;
						oDataItems.OldValue = "";
						oDataItems.VKORG = oMATERIAL2MVKESALESRel.results[i].VKORG;
						oDataItems.VTWEG = oMATERIAL2MVKESALESRel.results[i].VTWEG;
						oDataItems.ALAND = oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ALAND;
						oDataItems.TATYP = oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].TATYP;
						oDataItems.EntityDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[
							j].ALAND, oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ALAND__TXT) + " / " +
							fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].TATYP,
								oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].TATYP__TXT) + ", " + fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(
								oMATERIAL2MVKESALESRel.results[i].VKORG, oMATERIAL2MVKESALESRel.results[i].VKORG__TXT) + " / " + fcg.mdg.approvecrv2.util.Formatter
							.getKeyDesc(
								oMATERIAL2MVKESALESRel.results[i].VTWEG, oMATERIAL2MVKESALESRel.results[i].VTWEG__TXT);
						oDataItems.EntityName = this.i18n.getText("taxcat") + ", " + this.i18n.getText("SL_DIST_CHN");
						strResults.results.push(oDataItems);
						oDataItems = [];
					} else if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[0] !== undefined &&
						oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[0].EntityAction === fcg.mdg.approvecrv2
						.DomainSpecParts.Material.Material.vUpdatedEntity) {
						for (var k = 0; k < oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results.length; k++) {
							oDataItems.AttributeDesc = oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k]
								.AttributeDesc;
							oDataItems.NewValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[
									j].ChangeData.results[k].NewValue, oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k]
								.NewValueText);
							oDataItems.OldValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[
									j].ChangeData.results[k].OldValue, oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k]
								.OldValueText);
							if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].OldValue === "") {
								oDataItems.OldValue = this.vNotMaint;
							} else {
								oDataItems.OldValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[
										j].ChangeData.results[k].OldValue, oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k]
									.OldValueText);
							}
							//if new value is empty and earlier it had values, then new value should display "Deleted"
							if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].NewValue === "" &&
								oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].OldValue !== "") {
								oDataItems.NewValue = this.vDeleted;
							} else if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k].NewValue !==
								"") {
								oDataItems.NewValue = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[
										j].ChangeData.results[k].NewValue, oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ChangeData.results[k]
									.NewValueText);
							}
							oDataItems.VKORG = oMATERIAL2MVKESALESRel.results[i].VKORG;
							oDataItems.VTWEG = oMATERIAL2MVKESALESRel.results[i].VTWEG;
							oDataItems.ALAND = oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ALAND;
							oDataItems.TATYP = oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].TATYP;
							oDataItems.EntityDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[
								j].ALAND, oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].ALAND__TXT) + " / " +
								fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].TATYP,
									oMATERIAL2MVKESALESRel.results[i].MVKESALES2MLANSALESRel.results[j].TATYP__TXT) + ", " + fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(
									oMATERIAL2MVKESALESRel.results[i].VKORG, oMATERIAL2MVKESALESRel.results[i].VKORG__TXT) + " / " + fcg.mdg.approvecrv2.util.Formatter
								.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].VTWEG, oMATERIAL2MVKESALESRel.results[i].VTWEG__TXT);
							oDataItems.EntityName = this.i18n.getText("taxcat") + ", " + this.i18n.getText("SL_DIST_CHN");
							strResults.results.push(oDataItems);
							oDataItems = [];
						} // end for with var k

					} // end else if entityaction
				} // end if which checks the condition if the Sales Tax is part of the newly added Disb Chain
			} // end for loop with 'j'				
		} //end loop of Sales Tax data

		oItemTempSalesTax.attachPress({
			Entity: oSalesTaxData,
			name: 'matSalesTaxChangeDataDetail'
		}, oView.navtoSubDetail, oView);
		// Controller hook with strResults in S3
		// Providing Extensibility point - Controller hook with strResults in S3
		var extChangeSalesTaxResults = this.oS3Controller.matHookgetChangeSalesTaxResults(strResults);
		if (extChangeSalesTaxResults !== undefined) {
			strResults = extChangeSalesTaxResults;
		}
		this.bindSalesTaxFormData(strResults, oItemTempSalesTax);
	}, // end work on SalesTaxData

	workOnSalesTextData: function(oSalesTextData, oDataItems, oItemTempSalesText, oView) {
		var vDisbChain;
		var strResults = {
			results: []
		};
		var oMATERIAL2MVKESALESRel = oSalesTextData.data.MATERIAL2MVKESALESRel;
		for (var i = 0; i < oMATERIAL2MVKESALESRel.results.length; i++) {

			for (var j = 0; j < oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results.length; j++) {
				vDisbChain = oMATERIAL2MVKESALESRel.results[i].VKORG + oMATERIAL2MVKESALESRel.results[i].VTWEG;
				if ((this.vNewDisbChainsAdded.indexOf(vDisbChain) === -1)) {
					if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0] !== undefined &&
						oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0].EntityAction === fcg.mdg.approvecrv2
						.DomainSpecParts.Material.Material.vNewEntity) {

						oDataItems.NewValue = this.vAdded;
						oDataItems.OldValue = "";
						oDataItems.EntityDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[
							j].LANGUCODE, oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE__TXT) +
							", " + fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].VKORG, oMATERIAL2MVKESALESRel.results[i].VKORG__TXT) +
							" / " +
							fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].VTWEG, oMATERIAL2MVKESALESRel.results[i].VTWEG__TXT);
						oDataItems.EntityName = this.i18n.getText("Mat_Language") + ", " + this.i18n.getText("SL_DIST_CHN");
						oDataItems.VKORG = oMATERIAL2MVKESALESRel.results[i].VKORG;
						oDataItems.VTWEG = oMATERIAL2MVKESALESRel.results[i].VTWEG;
						oDataItems.LANGUCODE = oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE;
						strResults.results.push(oDataItems);
						oDataItems = [];
					} else if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0] !== undefined &&
						oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0].EntityAction === fcg.mdg.approvecrv2
						.DomainSpecParts.Material.Material.vUpdatedEntity) {
						for (var k = 0; k < oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results.length; k++) {
							oDataItems.NewValue = fcg.mdg.approvecrv2.util.Formatter.Truncate(oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel
								.results[j].ChangeData.results[k].NewValue);
							oDataItems.OldValue = fcg.mdg.approvecrv2.util.Formatter.Truncate(oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel
								.results[j].ChangeData.results[k].OldValue);
							if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].OldValue === "") {
								oDataItems.OldValue = this.vNotMaint;
							} else {
								oDataItems.OldValue = fcg.mdg.approvecrv2.util.Formatter.Truncate(oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel
									.results[j].ChangeData.results[k].OldValue);
							}
							//if new value is empty and earlier it had values, then new value should display "Deleted"
							if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].NewValue === "" &&
								oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].OldValue !== "") {
								oDataItems.NewValue = this.vDeleted;
							} else if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[k].NewValue !== "") {
								oDataItems.NewValue = fcg.mdg.approvecrv2.util.Formatter.Truncate(oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel
									.results[j].ChangeData.results[k].NewValue);
							}

							oDataItems.EntityDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[
								j].LANGUCODE, oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE__TXT) +
								", " + fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].VKORG, oMATERIAL2MVKESALESRel.results[i].VKORG__TXT) +
								" / " +
								fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].VTWEG, oMATERIAL2MVKESALESRel.results[i].VTWEG__TXT);
							oDataItems.EntityName = this.i18n.getText("Mat_Language") + ", " + this.i18n.getText("SL_DIST_CHN");
							oDataItems.VKORG = oMATERIAL2MVKESALESRel.results[i].VKORG;
							oDataItems.VTWEG = oMATERIAL2MVKESALESRel.results[i].VTWEG;
							oDataItems.LANGUCODE = oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE;
							strResults.results.push(oDataItems);
							oDataItems = [];
						} // end for loop with k
					} // end if with condition on EntityAction == U
					else if (oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0] !== undefined &&
						oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].ChangeData.results[0].EntityAction === fcg.mdg.approvecrv2
						.DomainSpecParts.Material.Material.vDeletedEntity) {
						// Handling when an entire Sales Text is deleted
						oDataItems.NewValue = this.vDeleted;
						oDataItems.OldValue = oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].TXTSALES;
						oDataItems.EntityDesc = fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[
							j].LANGUCODE, oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE__TXT) +
							", " + fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].VKORG, oMATERIAL2MVKESALESRel.results[i].VKORG__TXT) +
							" / " +
							fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(oMATERIAL2MVKESALESRel.results[i].VTWEG, oMATERIAL2MVKESALESRel.results[i].VTWEG__TXT);
						oDataItems.EntityName = this.i18n.getText("Mat_Language") + ", " + this.i18n.getText("SL_DIST_CHN");

						oDataItems.VKORG = oMATERIAL2MVKESALESRel.results[i].VKORG;
						oDataItems.VTWEG = oMATERIAL2MVKESALESRel.results[i].VTWEG;
						oDataItems.LANGUCODE = oMATERIAL2MVKESALESRel.results[i].MVKESALES2SALESTXTRel.results[j].LANGUCODE;
						strResults.results.push(oDataItems);
						oDataItems = [];
					} // end if with condition on EntityAction == D
				} // end if which checks the condition if the Sales Tax is part of the newly added Disb Chain	
			} // end for loop with 'j'				

		} //end loop of Sales Text data

		oItemTempSalesText.attachPress({
			Entity: oSalesTextData,
			name: 'matSalesTextChangeDetail'
		}, oView.navtoSubDetail, oView);
		//controller hook with strResults in s3 controller
		// Providing Extensibility point - Controller hook with strResults in S3
		var extChangeSalesTextResults = this.oS3Controller.matHookgetChangeSalesTextResults(strResults);
		if (extChangeSalesTextResults !== undefined) {
			strResults = extChangeSalesTextResults;
		}
		this.bindSalesTextFormData(strResults, oItemTempSalesText);
	}, // end work on SalesTextData	

	//Bind MARASALES data
	bindMaraSalesFormData: function(aGenData, oItemTempMaraSales) {
		if (aGenData.results.length !== 0) {
			this.oMaterialMARASalesTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matChangeSalesDataLayout").addContent(
				this.oMaterialMARASalesTable);
			this.oMaterialMARASalesTable.setGrowing(true);
			var oSalesGenDataModel = new sap.ui.model.json.JSONModel();
			oSalesGenDataModel.setData(aGenData);
			this.oMaterialMARASalesTable.setModel(oSalesGenDataModel);
			this.oMaterialMARASalesTable.bindItems('/results', oItemTempMaraSales, '', '');
			this.sMARAChangeresults = aGenData;
		}
	},

	//Bind Sales and Distribution Chain data

	bindDistChainFormData: function(aGenData, oItemTempSalesDist) {
		// display the table only when it has data
		if (aGenData.results.length !== 0) {
			this.oMaterialSalesDistributionChainTable = "";
			this.strDistributionChain = this.i18n.getText("SL_DISTR");
			this.oMaterialSalesDistributionChainTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matChangeSalesDataLayout").addContent(
				this.oMaterialSalesDistributionChainTable);
			this.oMaterialSalesDistributionChainTable.setGrowing(true);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.oMaterialSalesDistributionChainTable, this.strDistributionChain);
			var oSalesGenDataModel = new sap.ui.model.json.JSONModel();
			oSalesGenDataModel.setData(aGenData);
			this.oMaterialSalesDistributionChainTable.setModel(oSalesGenDataModel);
			this.oMaterialSalesDistributionChainTable.bindItems('/results', oItemTempSalesDist, '', '');
			this.sDisbChainChangeresults = aGenData;
		}
	},
	//Bind Sales Tax data

	bindSalesTaxFormData: function(aGenData, oItemTempSalesTax) {
		// display the table only when it has data
		if (aGenData.results.length !== 0) {
			this.oMaterialSalesTaxTable = "";
			this.strSalesTax = this.i18n.getText("SL_TAX");
			this.oMaterialSalesTaxTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matChangeSalesDataLayout").addContent(
				this.oMaterialSalesTaxTable);
			this.oMaterialSalesTaxTable.setGrowing(true);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.oMaterialSalesTaxTable, this.strSalesTax);
			var oSalesGenDataModel = new sap.ui.model.json.JSONModel();
			oSalesGenDataModel.setData(aGenData);
			this.oMaterialSalesTaxTable.setModel(oSalesGenDataModel);
			this.oMaterialSalesTaxTable.bindItems('/results', oItemTempSalesTax, '', '');
			this.sTaxChangeresults = aGenData;
		}
	},

	//Bind Sales Text data

	bindSalesTextFormData: function(aGenData, oItemTempSalesText) {
		// display the table only when it has data	
		if (aGenData.results.length !== 0) {
			this.oMaterialSalesTextTable = "";
			this.strSalesText = this.i18n.getText("SL_TEXT");
			this.oMaterialSalesTextTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatChangeTableReuse', this);
			sap.ui.getCore().byId("matChangeSalesDataLayout").addContent(
				this.oMaterialSalesTextTable);
			this.oMaterialSalesTextTable.setGrowing(true);
			fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setHeaderToolbar(this.oMaterialSalesTextTable, this.strSalesText);
			var oSalesGenDataModel = new sap.ui.model.json.JSONModel();
			oSalesGenDataModel.setData(aGenData);
			this.oMaterialSalesTextTable.setModel(oSalesGenDataModel);
			this.oMaterialSalesTextTable.bindItems('/results', oItemTempSalesText, '', '');
			this.sTextChangeresults = aGenData;
		}
	},

	// 		//Create generic table template 
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
		// Controller hook in Table template
		var extoItemTemp = this.oS3Controller.matHookchangeMatSalesTableTemplate(oItemTemp);
		if (extoItemTemp !== undefined) {
			oItemTemp = extoItemTemp;
		}
		return oItemTemp;
	},

	// //Create a table template for the Sales Text 
	createSalesTextTableTemplate: function() {
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

				new sap.m.Text({
					text: {
						path: "NewValue"
					}
				}).addStyleClass("text_bold"),
				new sap.m.Text({
					text: {
						path: "OldValue"
					}
				})
			]
		});
		// Controller hook for table template
		var extoItemTemp = this.oS3Controller.matHookchangeMatSalesTextTableTemplate(oItemTemp);
		if (extoItemTemp !== undefined) {
			oItemTemp = extoItemTemp;
		}
		return oItemTemp;
	}
};