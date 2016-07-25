/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccount");
/*
* This method takes care of initializing Forms, forming queries to fetch newly created GL Account and displaying
 * */

fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate = {
	oGLAccounDescTable: "",
	oGLAccounCreateFrag: "",
	oS3Controller: "",
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	//Initialize forms
	initialize_Forms: function(oS3Controller) {
		this.oS3Controller = oS3Controller;
	},

	getGenQuery: function(sServiceUrl, sPath, s3Controller){
	    this.oS3Controller = s3Controller;
	    
	    var sQuery = sPath + "?$expand=ACCOUNT/ACCOUNT2AtthACCOUNTRel,ACCOUNT/ACCOUNT2DTxtACCOUNTRel"; 
	     return sQuery;
	},
	
	getCCQuery: function(sServiceUrl, sPath, s3Controller){
	    this.oS3Controller = s3Controller;
	    var sQuery = sPath + "?$expand=ACCOUNT/ACCOUNT2ACCCCDETRel,ACCOUNT/ACCOUNT2ACCCCDETRel/ACCCCDET2AtthACCCCDETRel"; 
	     return sQuery;
	}, 
	
	getCEQuery: function(sServiceUrl, sPath, s3Controller){
		var sQuery = "";
	     this.oS3Controller = s3Controller;
	     if (s3Controller.oApplicationFacade.isMock())
	    	 sQuery = sPath + "?$expand=ACCOUNT/ACCOUNT2CELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2DTxtCELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2AtthCELEMRel";
	     else
	    	 sQuery = sPath + "?$expand=ACCOUNT/ACCOUNT2CELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2DTxtCELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2AtthCELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2ACCOUNTRel";
	     
	     return sQuery;
	},
	
	displayData : function(result, s3Controller){
	    var oDetailModel = new sap.ui.model.json.JSONModel();
		oDetailModel.setData(result);
	    this.displayGenData(oDetailModel,result,s3Controller);
	    this.displayCCData(oDetailModel, result);
		this.displayCEData(oDetailModel, result);
	} ,

	//Method to display form data Method edited by AKR
	displayGenData: function(result, s3Controller) {
		var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.getS3Instance();
        var oDetailModel = new sap.ui.model.json.JSONModel();
		oDetailModel.setData(result);

			if (oS3Instance.oGlAccountGenForm === "") {
			   	oS3Instance.oGlAccountGenForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccountCreate');
			}
			else{
			    sap.ui.getCore().byId("glGeneralDataLayout").removeContent(oS3Instance.oGlAccountGenForm);
			    if(oS3Instance.oGlAccountGenForm !== undefined){
			        oS3Instance.oGlAccountGenForm.destroy();
			    }
			    oS3Instance.oGlAccountGenForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccountCreate');
			}
	
				sap.ui.getCore().byId("glGeneralDataLayout").addContent(oS3Instance.oGlAccountGenForm);
			

        sap.ui.getCore().byId("glCreateMainDataForm").setModel(oDetailModel);
		if (result.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results.length > 0) {
			sap.ui.getCore().byId("glDescTab").setModel(oDetailModel);
			var oDescTemp = this.getDescTemplate();
			sap.ui.getCore().byId("glDescTab").bindItems('/ACCOUNT/ACCOUNT2DTxtACCOUNTRel/results', oDescTemp, '', '');
		} else {
			sap.ui.getCore().byId('glDescTab').destroy();
		}

		if (result.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results.length > 0) {
			this.getGenAttachmentList(result);
		} else {
			sap.ui.getCore().byId('glAttachFileList').destroy();
		}

		this.hideSection();
	
	},

	//displaying CC data in separate tab
	displayCCData: function(result, s3Controller) {
	    this.oS3Controller = s3Controller;
	    var oDetailModel = new sap.ui.model.json.JSONModel();
		oDetailModel.setData(result);
		sap.ui.getCore().byId("glCCDataLayout").removeAllContent();
		if (this.oS3Controller.oGlAccountCompTable) {
			this.oS3Controller.oGlAccountCompTable.destroy();
		}
		if (result.ACCOUNT.ACCOUNT2ACCCCDETRel.results.length === 0) {
			//show No data maintained
			var noCCDataText = new sap.m.Text("glCCNoData");
			noCCDataText.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NodataCreate"));
			sap.ui.getCore().byId("glCCDataLayout").addContent(noCCDataText);

		} else if (result.ACCOUNT.ACCOUNT2ACCCCDETRel.results.length > 1) {

			if (this.oS3Controller.oGlAccountCompTable) {
				this.oS3Controller.oGlAccountCompTable.destroy();
			}
			this.oS3Controller.oGlAccountCompTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccountCCTable');
			sap.ui.getCore().byId("glCCDataLayout").addContent(this.oS3Controller.oGlAccountCompTable);
			this.oS3Controller.oGlAccountCompTable.setGrowing(true);
			this.oS3Controller.oGlAccountCompTable.setModel(oDetailModel);
			var oCompCodeTemp = this.getCompCodeTemplate();
			//add press event to the table template
			oCompCodeTemp.attachPress({
				Entity: result,
				name: 'GLCompanyCode'
			}, this.oS3Controller.navtoSubDetail, this.oS3Controller);
			this.oS3Controller.oGlAccountCompTable.bindItems('/ACCOUNT/ACCOUNT2ACCCCDETRel/results', oCompCodeTemp, '', '');

		} else if (result.ACCOUNT.ACCOUNT2ACCCCDETRel.results.length === 1) {
		    
		    
			if (this.oS3Controller.oGlAccountCompForm === "") {
			   	this.oS3Controller.oGlAccountCompForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccCompCodeDetails');
			}
			else{
			    if(this.oS3Controller.oGlAccountCompForm !== undefined){
			        this.oS3Controller.oGlAccountCompForm.destroy();
			    }
			    this.oS3Controller.oGlAccountCompForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccCompCodeDetails');
			}
			
			this.displaySingleCCData(result.ACCOUNT.ACCOUNT2ACCCCDETRel.results[0]);
			sap.ui.getCore().byId("glCCDataLayout").addContent(this.oS3Controller.oGlAccountCompForm);
		}

	},
	displaySingleCCData: function(result) {

		//header section - added
		if (result.ACCICFREQ.Code === "00"){
		    result.ACCICFREQ.Code = "";
		}
		var oCCModel = new sap.ui.model.json.JSONModel();
		oCCModel.setData(result);
		sap.ui.getCore().byId("glCCControlData").setModel(oCCModel);
		sap.ui.getCore().byId("LBL_COMPCODE").addStyleClass("sapThemeFont");
		sap.ui.getCore().byId("TXT_COMPCODE").addStyleClass("sapThemeFont");

		var oCCAttach = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oCCData.ACCOUNT.ACCOUNT2ACCCCDETRel.results[0].ACCCCDET2AtthACCCCDETRel;

		if (oCCAttach.results.length > 0) {
			this.getglCCAttachmentList(oCCAttach);
		} else {
			sap.ui.getCore().byId('glCCAttach').destroy();
		}

		this.hidesectionCC();

	},

	hidesectionCC: function() {

		if (sap.ui.getCore().byId("TXT_CURRACC").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCTAXCAT").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCBALLC").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCEXCHRD").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCVALGRP").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCALTACC").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCINFKEY").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCTOLGRP").getText() === "" &&
		    sap.ui.getCore().byId("TXT_ACCRECIND").getText() === ""	) {
			sap.ui.getCore().byId("glDetACCCntrlCC").destroy();
		}

		if (sap.ui.getCore().byId("TXT_ACCLIDISP").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCSRTKEY").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCAUTHGP").getText() === "") {
			sap.ui.getCore().byId("glDetACCMgmntCC").destroy();

		}

		if (sap.ui.getCore().byId("TXT_ACCFSTGRP").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCAUTPOS").getText() === "") {
			sap.ui.getCore().byId("glDetCntrlDocCreatn").destroy();
		}

		if (sap.ui.getCore().byId("TXT_ACCPLLEV").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCCASHFL").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCHOUSBK").getText() === "") {
			sap.ui.getCore().byId("glDetBankFinCC").destroy();
		}

		if (sap.ui.getCore().byId("TXT_ACCICIND").getText() === "" &&
		sap.ui.getCore().byId("TXT_ACCICFREQ").getText() === "" ) {
			sap.ui.getCore().byId("glDetInterestCalc").destroy();
		}

	},

	getglCCAttachmentList: function(aResult) {

		var oglAttachList = sap.ui.getCore().byId("glCCAttach");
		var oCustomListItem = new sap.m.CustomListItem({});
		for (var i = 0; i < aResult.results.length; i++) {
			var vLink = "";
			if (aResult.results[i].USMD_LINK !== "") {
				vLink = aResult.results[i].USMD_LINK;
			} else
				vLink = aResult.results[i].__metadata.media_src;

			var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.results[i].USMD_ACREATED_AT) + " " + this.i18n.getText(
				'AttachBy') + " ";
			var vContributor = " " + aResult.results[i].USMD_ACREATED_BY__TXT + "(" + aResult.results[i].USMD_ACREATED_BY + ")";

			var oContributor = new sap.m.Text({
				text: vForamtdate + " " + vContributor
			});
			var vLinkemphasized = false;

			var oAttach = new sap.m.Link({
				text: aResult.results[i].USMD_TITLE,
				target: "_blank",
				href: vLink,
				wrapping: true,
				subtle: false,
				emphasized: vLinkemphasized
			}).addStyleClass("padding_bottom");

			var vl = new sap.m.VBox({
				items: [oAttach, oContributor]
			}).addStyleClass("padding_left");

			var oIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.results[i].USMD_FILE_TYPE);
			oIcon = new sap.ui.core.Icon({
				src: oIcon,
				size: "3.0em"
			});

			var h1 = new sap.m.HBox({
				items: [oIcon, vl]
			}).addStyleClass("Hbox_padding");

			oCustomListItem.addContent(h1);
			oglAttachList.addItem(oCustomListItem);
		}

		if (oglAttachList.getItems().length === 0) {
			sap.ui.getCore().byId("glCCAttach").destroy();
		}

	},

	displayCEData: function(result,s3Controller) {
	    this.oS3Controller = s3Controller;
	    var oDetailModel = new sap.ui.model.json.JSONModel();
		oDetailModel.setData(result);
		sap.ui.getCore().byId("glCEDataLayout").removeAllContent();
	

		if (result.ACCOUNT.ACCOUNT2CELEMRel.results.length === 0) {
			var noCEDataText = new sap.m.Text("glCENoData");
			noCEDataText.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NodataCreate"));
			sap.ui.getCore().byId("glCEDataLayout").addContent(noCEDataText);
		} else if (result.ACCOUNT.ACCOUNT2CELEMRel.results.length > 1) {

			if (this.oS3Controller.oGlAccountCelemTable) {
				this.oS3Controller.oGlAccountCelemTable.destroy();
			}
			this.oS3Controller.oGlAccountCelemTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccountCETable');
			sap.ui.getCore().byId("glCEDataLayout").addContent(this.oS3Controller.oGlAccountCelemTable);
			this.oS3Controller.oGlAccountCelemTable.setGrowing(true);
			this.oS3Controller.oGlAccountCelemTable = sap.ui.getCore().byId("glCostElTab"); 
			this.oS3Controller.oGlAccountCelemTable.setModel(oDetailModel);

			var oCostElTemp = this.getCostElTemplate(oDetailModel);
			//add press event to the table template
			oCostElTemp.attachPress({
				Entity: result,
				name: 'GLCostEl'
			}, this.oS3Controller.navtoSubDetail, this.oS3Controller);
			this.oS3Controller.oGlAccountCelemTable.bindItems('/ACCOUNT/ACCOUNT2CELEMRel/results', oCostElTemp, '', '');
		} else if (result.ACCOUNT.ACCOUNT2CELEMRel.results.length === 1) {
			if (this.oS3Controller.oGlAccountCelemForm) {
				this.oS3Controller.oGlAccountCelemForm.destroy();
			}
			this.oS3Controller.oGlAccountCelemForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccCostElDetails');

			this.displaySingleCEData(result.ACCOUNT.ACCOUNT2CELEMRel.results[0]);
			sap.ui.getCore().byId("glCEDataLayout").addContent(this.oS3Controller.oGlAccountCelemForm);
			sap.ui.getCore().byId("glCEDetails").setTitle("");
		}

	},

	displaySingleCEData: function(result) {

		var oCEModel = new sap.ui.model.json.JSONModel();
		oCEModel.setData(result);
		sap.ui.getCore().byId("glCEDetails").setModel(oCEModel);
		sap.ui.getCore().byId("glDetCCGenTitle").destroy();
		sap.ui.getCore().byId("LBL_CELEM").addStyleClass("sapThemeFont");
		sap.ui.getCore().byId("TXT_CELEM").addStyleClass("sapThemeFont");
		var oCEAttach = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oCEData.ACCOUNT.ACCOUNT2CELEMRel.results[0].CELEM2AtthCELEMRel;

		var classText;
		if(fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.CELEM2ACCOUNTRel.ACCOUNT) === fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.CELEM)){
			classText = this.i18n.getText("GL_TXT_CLAS");
		}
		else{
			classText = this.i18n.getText("GL_TXT_CLAS_SEC");
		}
		sap.ui.getCore().byId("TXT_DET_CLASSIFICATION").setText(classText);
		
		if (result.CELEM2DTxtCELEMRel.results.length > 0) {
			sap.ui.getCore().byId("glCostElDescTab").setModel(oCEModel);
			var oDescTemp = this.getCEDescTemplate();
			sap.ui.getCore().byId("glCostElDescTab").bindItems('/CELEM2DTxtCELEMRel/results', oDescTemp, '', '');
		} else {
			sap.ui.getCore().byId('glCostElDescTab').destroy();
		}

		if (oCEAttach.results.length > 0) {
			this.getglCEAttachmentList(oCEAttach);
		} else {
			sap.ui.getCore().byId('glCostElAttach').destroy();
		}
		sap.ui.getCore().byId("glDetCCGenData").destroy();

		this.hideCEsection();

	},

	hideCEsection: function() {

		if (sap.ui.getCore().byId("TXT_COAREA")
			.getText() === "" && sap.ui.getCore().byId("TXT_CELEM")
			.getText() === "" && sap.ui.getCore().byId("TXT_CELEMCAT")
			.getText() === "" && sap.ui.getCore().byId(
				"TXT_DET_CLASSIFICATION").getText() === "") {
			sap.ui.getCore().byId("glDetCCGenData").destroy();
		}

		if ((sap.ui.getCore().byId("TXT_CCTRCELEM").getText() === "" &&
		sap.ui.getCore().byId("TXT_CELEMORD").getText() === "") || 
		(sap.ui.getCore().byId("TXT_CCTRCELEM").getText() === undefined &&
		sap.ui.getCore().byId("TXT_CELEMORD").getText() === "") ||
		(sap.ui.getCore().byId("TXT_CCTRCELEM").getText() === "" &&
		sap.ui.getCore().byId("TXT_CELEMORD").getText() === undefined) ||
		(sap.ui.getCore().byId("TXT_CCTRCELEM").getText() === undefined &&
		sap.ui.getCore().byId("TXT_CELEMORD").getText() === undefined)) {
			sap.ui.getCore().byId("glDetDefAccAsst").destroy();
		}

		if (sap.ui.getCore().byId("TXT_CELEMINDQ").getText() === "" && sap.ui.getCore().byId("TXT_UOMCELEM").getText() === "") {
			sap.ui.getCore().byId("glCostElInd").destroy();
			}

	},

	getCEDescTemplate: function(oModel) {
		var oDescTemp = new sap.m.ColumnListItem({
			cells: [
				    		       new sap.m.Text({
					text: "{LANGU__TXT}"

				}),
				    		       new sap.m.Text({
					text: {
						path: "TXTSH",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				}),
				    		       new sap.m.Text({
					text: {
						path: "TXTMI",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				})
				        ]
		});
		var extoItemTemp = this.oS3Controller.glHookgetCEDescTemplate(oDescTemp);
			if(extoItemTemp !== undefined){
				oDescTemp = extoItemTemp;
		}
		return oDescTemp;

	},

	getglCEAttachmentList: function(aResult) {

		var oglCEAttachList = sap.ui.getCore().byId("glCostElAttach");
		var oCustomListItem = new sap.m.CustomListItem({});
		for (var i = 0; i < aResult.results.length; i++) {
			var vLink = "";
			if (aResult.results[i].USMD_LINK !== "") {
				vLink = aResult.results[i].USMD_LINK;
			} else
				vLink = aResult.results[i].__metadata.media_src;

			var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.results[i].USMD_ACREATED_AT) + " " + this.i18n.getText(
				'AttachBy') + " ";

			//directly fetching the name from the general data

			var vContributor = aResult.results[i].USMD_ACREATED_BY__TXT + "(" + aResult.results[i].USMD_ACREATED_BY + ")";

			var oContributor = new sap.m.Text({
				text: vForamtdate + " " + vContributor
			});
			var vLinkemphasized = false;

			var oAttach = new sap.m.Link({
				text: aResult.results[i].USMD_TITLE,
				target: "_blank",
				href: vLink,
				wrapping: true,
				subtle: false,
				emphasized: vLinkemphasized
			}).addStyleClass("padding_bottom");

			var vl = new sap.m.VBox({
				items: [oAttach, oContributor]
			}).addStyleClass("padding_left");

			var oIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.results[i].USMD_FILE_TYPE);
			oIcon = new sap.ui.core.Icon({
				src: oIcon,
				size: "3.0em"
			});

			var h1 = new sap.m.HBox({
				items: [oIcon, vl]
			}).addStyleClass("Hbox_padding");

			oCustomListItem.addContent(h1);
			oglCEAttachList.addItem(oCustomListItem);
		}

		if (oglCEAttachList.getItems().length === 0) {
			sap.ui.getCore().byId("glCostElAttach").destroy();
		}

	},

	//Hiding a section if there are no values present for the fields present in this section
	hideSection: function() {

		if (sap.ui.getCore().byId("TXT_ACCGRPACC").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCTYP").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCPLTYP").getText() === "") {
			sap.ui.getCore().byId("LBL_CNTRL_DATA").destroy();
		}

		if (sap.ui.getCore().byId("TXT_ACCNEWACC").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCRESPU").getText() === "" &&
			sap.ui.getCore().byId("TXT_ACCRESPP").getText() === "") {
			sap.ui.getCore().byId("LBL_ADM_TYPE").destroy();

		}

		if (sap.ui.getCore().byId("TXT_USMD_ENT_CRTD_BY").getText() === "" &&
			sap.ui.getCore().byId("TXT_USMD_ENT_CRTD_AT").getText() === "" &&
			sap.ui.getCore().byId("TXT_USMD_ENT_CHNG_BY").getText() === "" &&
			sap.ui.getCore().byId("TXT_USMD_ENT_CHNG_AT").getText() === "") {
			sap.ui.getCore().byId("LBL_AUD_INFO").destroy();
		}

		if (sap.ui.getCore().byId("TXT_COMPACC").getText() === "" &&
			sap.ui.getCore().byId("TXT_FSIACC").getText() === "" &&
			sap.ui.getCore().byId("TXT_FSIACCSTA").getText() === "") {
			sap.ui.getCore().byId("AccConsDetails").destroy();
		}

	},

	getCompCodeTemplate: function() {
		var oCompCodeDescrTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
	    		       new sap.m.Text({
					text: "{COMPCODE__TXT} ({COMPCODE})"

				})
	        ]
		});
		var extoItemTemp = this.oS3Controller.glHookgetCompCodeTemplate(oCompCodeDescrTemp);
			if(extoItemTemp !== undefined){
				oCompCodeDescrTemp = extoItemTemp;
		}
	 return oCompCodeDescrTemp;

	},

	getCostElTemplate: function(oModel) {
		var oCostElTemp = new sap.m.ColumnListItem({

			type: "Navigation",
			cells: [
	    		       new sap.m.Text({
						text: "{COAREA__TXT} ({COAREA})"
					}),
		    		       new sap.m.Text({
						text: "{CELEM__TXT} ({CELEM})"
					}),
		    		      new sap.m.Text({
						text: {
							path: "{FUNCCELEM}",
							formatter: function(){
						    	var key = oModel.getProperty("FUNCCELEM", this.getBindingContext());			        			
						    	var key1 = oModel.getProperty("FUNCCELEM__TXT", this.getBindingContext());			        			
			        			if(key !== "" && key1 !== "")		{
			        			    return fcg.mdg.approvecrv2.util.Formatter.descriptionWithRemoveZeros(key,key1);
			        			}
			        			else{
			        			     return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
			        			}
							}
						}
					}),
		    		       new sap.m.Text({
						text: "{CELEMCAT__TXT} ({CELEMCAT})"
					})
	        ]
		});
		
		var extoItemTemp = this.oS3Controller.glHookgetCostElTemplate(oCostElTemp);
			if(extoItemTemp !== undefined){
				oCostElTemp = extoItemTemp;
		}
		return oCostElTemp;

	},

	getDescTemplate: function() {
		var oDescTemp = new sap.m.ColumnListItem({
			cells: [
		    		       new sap.m.Text({
					text: "{LANGU__TXT}"
				}),
		    		       new sap.m.Text({
					text: {
						path: "TXTSH",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				}),
		    		       new sap.m.Text({
					text: {
						path: "TXTLG",
						formatter: fcg.mdg.approvecrv2.util.Formatter.noValue
					}
				})
		        ]
		});
		var extoItemTemp = this.oS3Controller.glHookgetDescTemplate(oDescTemp);
			if(extoItemTemp !== undefined){
				oDescTemp = extoItemTemp;
		}
		return oDescTemp;

	},

	getGenAttachmentList: function(aResult) {

		var oAttachList = sap.ui.getCore().byId("glAttachFileList");
		var oCustomListItem = new sap.m.CustomListItem({});
		var oContributor;
        var vLinkemphasized;
		for (var i = 0; i < aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results.length; i++) {
			var vLink = "";
			if (aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_LINK !== "") {
				vLink = aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_LINK;
			} else
				vLink = aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].__metadata.media_src;

			var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_ACREATED_AT) +
				" " + this.i18n.getText('AttachBy') + " ";
			var vContributor = " " + aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_ACREATED_BY__TXT+"("+aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_ACREATED_BY+")";
           
			if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results.length !== 0)				
			{
				for(var j = 0; j < aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results.length; j++){
				   if(aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].EntityAction === 'D'){	
				    oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("sapThemeText");//concatenate the date created at and the contributor name and set it to red and bold
				    vLinkemphasized = true;//Emphasize the link if attachment has been changed
				   	
				   }
				   else{
				    oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("text_bold");//concatenate the date created at and the contributor name and set it to bold
				    vLinkemphasized = true;//Emphasize the link if attachment has been changed
				   }	
				   }
				// oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("text_bold");//concatenate the date created at and the contributor name and set it to bold
				 
			}
			else {
				 oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor });
				 vLinkemphasized = false;	
			}
			var oAttach = new sap.m.Link({
				text: aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_TITLE,
				target: "_blank",
				href: vLink,
				wrapping: true,
				subtle: false,
				emphasized: vLinkemphasized
			}).addStyleClass("padding_bottom");
			
			if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results.length !== 0)				
			{
			for(var j = 0; j < aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results.length; j++){
			 if(aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].EntityAction === 'D'){
			  oAttach.setHref("");
			  oAttach.addStyleClass("sapThemeText");
			 	
			 }
			}
			}
			var vl = new sap.m.VBox({
				items: [oAttach, oContributor]
			}).addStyleClass("padding_left");

			var oIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_FILE_TYPE);
			oIcon = new sap.ui.core.Icon({
				src: oIcon,
				size: "3.0em"
			});

			var h1 = new sap.m.HBox({
				items: [oIcon, vl]
			}).addStyleClass("Hbox_padding");

			oCustomListItem.addContent(h1);
			oAttachList.addItem(oCustomListItem);
		}

		if (oAttachList.getItems().length === 0) {
			sap.ui.getCore().byId("glAttachFileList").destroy();
		}

	}

};