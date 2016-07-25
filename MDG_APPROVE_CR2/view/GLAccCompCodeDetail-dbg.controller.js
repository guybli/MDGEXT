/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//Controller for the companyCode detail page. The respective CompanyCode detail page will be loaded when the user clicks on the CompanyCode in the detail page.

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccount");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.GLAccCompCodeDetail", {
	compCode: "",
	oCompCodeDetails: "",
	bindingContext: "",
	sPath: "",
	oS3Instance: "",
	extHooknavtoDetail: null,
	extHookModifyStyleClass: null,
	extHookWithhldTable: null,
	extHookDunningTable: null,
	extHookdisplayCompCodedata: null,
	changerequestId: "",
	oGlCompCodeDetails: "",
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
	onInit: function() {
		//  Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("glCompCodePage").setShowNavButton(true);
		this.oRouter.attachRouteMatched(function(oEvent) {
 
			if (oEvent.getParameter("name") === "GLCompanyCode") {
				// This code will be executed when the user navigates to Detail's screen.
				// Initialize the gl comp code fragment variables

				var vComp = oEvent.getParameter('arguments').GLAccComp;
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.getS3Instance();
                var aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				if (vComp !== "") {
					var oGLACompCodeResult = "";
					var oGLACompresults = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oCCData.ACCOUNT.ACCOUNT2ACCCCDETRel;
					for (var i = 0; i < oGLACompresults.results.length; i++) {
						if (oGLACompresults.results[i].COMPCODE === vComp)
							oGLACompCodeResult = oGLACompresults.results[i];
					}
				}
				if(oS3Instance.oGlAccountCompForm){
				    //sap.ui.getCore().byId("glDetACCCntrlCC").destroy();
				    oS3Instance.oGlAccountCompForm.destroy();
				}
				if (oS3Instance.oGlAccountCompForm === "") {
					oS3Instance.oGlAccountCompForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccCompCodeDetails', fcg.mdg.approvecrv2.util.Formatter);
				} else {
					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("glCompCodePage").removeContent(oS3Instance.oGlAccountCompForm);
				// 	if (oS3Instance.oGlAccountCompForm !== undefined) {
				// 	oS3Instance.oGlAccountCompForm.destroy();
				// 	}
					oS3Instance.oGlAccountCompForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccCompCodeDetails', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("glCompCodePage").addContent(oS3Instance.oGlAccountCompForm);
				this.displayData(oGLACompCodeResult);
				var vAction = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction;
				if (vAction === "CHANGE"){
				    fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange.setBoldCCData(oGLACompCodeResult);
				}
				
			}

		}, this);
	},
    PressBack : function()
    {
        if(this.oGlCompCodeDetails)
        {
       this.oGlCompCodeDetails.destroy();
        }
    },
     onExit : function()
    {
        if(this.oGlCompCodeDetails)
        {
       this.oGlCompCodeDetails.destroy();
        }
    },
	displayData: function(result) {

		//header section - added
		this.setHeader(result);
       	if (result.ACCICFREQ=== "00"){
		    result.ACCICFREQ = "";
		}
		var oCCModel = new sap.ui.model.json.JSONModel();

		oCCModel.setData(result);
		sap.ui.getCore().byId("glCCControlData").setModel(oCCModel);
		sap.ui.getCore().byId("TXT_COMPCODE").setVisible(false);

		var oCCAttach = result.ACCCCDET2AtthACCCCDETRel;

		if(oCCAttach !== undefined){
			if (oCCAttach.results.length > 0) {
				var vattachFlag = false;
				var vdelFlag = false;
				var done = false;
				var aDone = {results:[]};
					   
				if(result.ChangeData !== undefined && fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE'){
					for(var i = 0; i < result.ChangeData.results.length ; i++){
						if(result.ChangeData.results[i].EntityAction !== 'C')
							vattachFlag = true;
					   	break;
				   	}
				   	//var done = false;
				   	if(vattachFlag){
				   		for(var i = 0; i < oCCAttach.results.length; i++){
                            aDone.results[i] = false;   
				   			if(oCCAttach.results[i].ChangeData.length !== 0 || oCCAttach.results[i].ChangeData !== undefined){
				   				for(var j = 0; j < oCCAttach.results[i].ChangeData.results.length; j++){
				   					vdelFlag = false;
				   					vattachFlag = false;
				   					if(oCCAttach.results[i].ChangeData.results[j].EntityAction === 'C')
				   					  vattachFlag = true;
				   					else if(oCCAttach.results[i].ChangeData.results[j].EntityAction === 'D')
				   					  vdelFlag = true;
				   					
				   					var result = oCCAttach.results[i];
				   					this.getglCCAttachmentList_2(result,vattachFlag, vdelFlag);   
				   					aDone.results[i] = true;  
				   					done = true;
				   				}
				   				if(!aDone.results[i]){
				   					var result = oCCAttach.results[i];
				   					this.getglCCAttachmentList_2(result,false, false);   
				   				}

				   			}
				   		}
				   	}

			   	}
			   if(!done)
			   	this.getglCCAttachmentList(oCCAttach,vattachFlag, vdelFlag);
			}
			else 
				sap.ui.getCore().byId('glCCAttach').destroy();
		}
		else 
			sap.ui.getCore().byId('glCCAttach').destroy();		
		fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.hidesectionCC();
		
			
		},

	setHeader: function(result) {

		var ccHeader = result.COMPCODE__TXT + "(" + result.COMPCODE + ")";
		var glCCHeader = this.getView().byId("glObjHeaderDet");
		glCCHeader.setTitle(ccHeader);

		var glCCAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		this.getView().byId("glCOA").setText(glCCAttribute);

		var oEditionData = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oCCData.Edition;
		var glvalidity = fcg.mdg.approvecrv2.util.Formatter.validityFormatter(oEditionData.UsmdVdateFrom, oEditionData.UsmdVdateTo);

		this.getView().byId("glVal").setText(glvalidity);
	},

	getglCCAttachmentList: function( aResult, vattachFlag, vdelFlag) {

		var oglAttachList = sap.ui.getCore().byId("glCCAttach");
		var oCustomListItem = new sap.m.CustomListItem({});
		var oContributor;
        var vLinkemphasized;
		for (var i = 0; i < aResult.results.length; i++) {
			
			
			var vLink = "";
			if (aResult.results[i].USMD_LINK !== "") {
				vLink = aResult.results[i].USMD_LINK;
			} else
				vLink = aResult.results[i].__metadata.media_src;

			var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.results[i].USMD_ACREATED_AT) + " " + this.i18n.getText(
				'AttachBy') + " ";
			
			var vContributor = " " + aResult.results[i].USMD_ACREATED_BY__TXT + "(" + aResult.results[i].USMD_ACREATED_BY + ")";
           
			if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.results[i].ChangeData.results.length !== 0 && vattachFlag )				
			{   
				
			    		oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("text_bold");//concatenate the date created at and the contributor name and set it to bold
			    	    vLinkemphasized = true;//Emphasize the link if attachment has been changed
			}
			
			else {
				 oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor });
				 vLinkemphasized = false;	
			}
       
      
          
			var oAttach = new sap.m.Link({
				text: aResult.results[i].USMD_TITLE,
				target: "_blank",
				href: vLink,
				wrapping: true,
				subtle: false,
				emphasized: vLinkemphasized
			}).addStyleClass("padding_bottom");
			
			if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.results[i].ChangeData !== undefined && aResult.results[i].ChangeData.results.length !== 0){
				for(var j = 0; j < aResult.results[i].ChangeData.results.length; j++){
					if(aResult.results[i].ChangeData.results[j].EntityAction === 'D'){
						oContributor.addStyleClass('sapThemeText').addStyleClass('text_bold');
						oAttach.setHref("");
						oAttach.addStyleClass('sapThemeText').addStyleClass('text_bold');
					}

				}
			}
			
			

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
	
	getglCCAttachmentList_2: function( aResult, vattachFlag, vdelFlag) {

		var oglAttachList = sap.ui.getCore().byId("glCCAttach");
		var oCustomListItem = new sap.m.CustomListItem({});
		var oContributor;
        var vLinkemphasized;
	
			var vLink = "";
			if (aResult.USMD_LINK !== "") {
				vLink = aResult.USMD_LINK;
			} else
				vLink = aResult.__metadata.media_src;

			var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.USMD_ACREATED_AT) + " " + this.i18n.getText(
				'AttachBy') + " ";
			
			var vContributor = " " + aResult.USMD_ACREATED_BY__TXT+"("+aResult.USMD_ACREATED_BY+")";
           
            if(vdelFlag)// && fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.ChangeData.results.length !== 0 )				
			{
				 oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("sapThemeText");//concatenate the date created at and the contributor name and set it to bold
				 vLinkemphasized = true;//Emphasize the link if attachment has been changed
			}
			else if( vattachFlag)// && fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.results[i].ChangeData.results.length !== 0  )				
			{   
				
			    		oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("text_bold");//concatenate the date created at and the contributor name and set it to bold
			    	    vLinkemphasized = true;//Emphasize the link if attachment has been changed
			    		
			   
			}
		
			else {
				 oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor });
				 vLinkemphasized = false;	
			}
       
      
           
			var oAttach = new sap.m.Link({
				text: aResult.USMD_TITLE,
				target: "_blank",
				href: vLink,
				wrapping: true,
				subtle: false,
				emphasized: vLinkemphasized
			}).addStyleClass("padding_bottom");
           
		    if(vdelFlag){
		    	
		    oAttach.setHref("");
			 oAttach.addStyleClass("sapThemeText");
		    }
			
			var vl = new sap.m.VBox({
				items: [oAttach, oContributor]
			}).addStyleClass("padding_left");

			var oIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.USMD_FILE_TYPE);
			oIcon = new sap.ui.core.Icon({
				src: oIcon,
				size: "3.0em"
			});
			var h1 = new sap.m.HBox({
				items: [oIcon, vl]
			}).addStyleClass("Hbox_padding");

			oCustomListItem.addContent(h1);
			oglAttachList.addItem(oCustomListItem);
		
		if (oglAttachList.getItems().length === 0) {
			sap.ui.getCore().byId("glCCAttach").destroy();
		}

	}





});