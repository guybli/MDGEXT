/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//jQuery.sap.require("fcg.mdg.approvemasterdata.view.Utility");
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.CostCenterCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CostCenter");
/*
 * This method takes care of initializing Forms, forming queries to fetch newly created data and displaying data for create scenarios of Cost center
* */

fcg.mdg.approvecrv2.DomainSpecParts.CostCenterCreate = {
		
		oCostCenterGeneralForm : "",
		oCostCenterAddressForm : "",
		oCostCenterCommForm : "",	
		oCostCenterIndForm: "",
		oCostCenterDescTable: "",
		oCostCenterCreateForm: "",
		oS3Controller:"",
		i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
				
		//Initialize forms
		initialize_Forms : function(oS3Controller) {
			this.oS3Controller = oS3Controller;
			if(this.oCostCenterCreateForm === ""){
				this.oCostCenterCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CostCenterCreate', fcg.mdg.approvecrv2.util.Formatter);
			}
			else{
				this.oCostCenterCreateForm.destroy();
	            this.oCostCenterCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CostCenterCreate', fcg.mdg.approvecrv2.util.Formatter);
			}
			sap.ui.getCore().byId("ccCreateDataLayout").removeAllContent();
			sap.ui.getCore().byId("ccCreateDataLayout").addContent(this.oCostCenterCreateForm);							
		},
		
		//Form query to fetch newly created data for a given change request
		getQueries:function(sServiceUrl,sPath,s3Controller){
			this.oS3Controller = s3Controller;
			//var aQuery = [];sServiceUrl +
			var sQuery =  sPath + "?$expand=CCTR,CCTR/CCTR2DTxtCCTRRel,CCTR/CCTR2AtthCCTRRel,CCTR/CD_CCTRRESPU,CCTR/CD_COAREA,CCTR/CD_CCTRCGY,CCTR/CD_CCODECCTR,CCTR/CD_CCTRBAREA,CCTR/CD_FUNCCCTR,CCTR/CD_CURRCCTR,"
				+"CCTR/CD_CC_LAND1,CCTR/CD_CC_REGION,CCTR/CD_CC_SPRAS,CCTR/CCTR2DTxtCCTRRel/CD_LANGU,CCTR/CCTR2AtthCCTRRel/CD_USMD_ACREATED_BY," +
				"CCTR/CCTR2PCTRCCTRRel,CCTR/CCTR2NEWCCTRRel";//,CCTR/CD_CCTRCCTR,CCTR/CD_CCTRCCTRN";
			var extQuery = this.oS3Controller.ccHookCreateQuery(sQuery);
			if(extQuery !== undefined){
				sQuery = extQuery;
			}
			return sQuery;
		},
		
		//Method to display form data
		displayFormData : function(result) {	
			var oDetailModel = new sap.ui.model.json.JSONModel();	
			var extModifiedData = this.oS3Controller.ccHookModityCreateFormData(result);
			if(extModifiedData !== undefined){
				result = extModifiedData;
			}
			oDetailModel.setData(result);
			sap.ui.getCore().byId("ccCreateSimpleForm").setModel(oDetailModel);

            if(result.CCTR.CCTR2DTxtCCTRRel.results.length > 0){
				sap.ui.getCore().byId("CreateDescriptionTable").setModel(oDetailModel);
		        var oItemDescrTemp = this.descrValueTemplate();
		        var extOItemTemp = this.oS3Controller.ccHookCreateDescTemplate(oItemDescrTemp);
				if(extOItemTemp !== undefined){
					oItemDescrTemp = extOItemTemp;
				}		       	
		        sap.ui.getCore().byId("CreateDescriptionTable").bindItems('/CCTR/CCTR2DTxtCCTRRel/results', oItemDescrTemp, '', '');
            }
            else
            {
            	this.hideTable();
            }
            //Hiding a section if there are no values present for the fields present in this section
	        this.hideSection();	 
	        
	        this.createCcAttachmentList(result);
	        this.oS3Controller.ccHookAddCCData(result);
		},
		
        //Hiding a section if there are no values present for the fields present in this section
		hideSection:function(){
			//Check Address Section
			if(sap.ui.getCore().byId("ccTitle").getText() === "" && sap.ui.getCore().byId("ccName1").getText() === "" &&
			   sap.ui.getCore().byId("ccName2").getText() === "" && sap.ui.getCore().byId("ccName3").getText() === "" && sap.ui.getCore().byId("ccName4").getText() === "" &&
			   sap.ui.getCore().byId("Street").getText() === "" && sap.ui.getCore().byId("PostalCode").getText() === "" &&
			   sap.ui.getCore().byId("City").getText() === "" && sap.ui.getCore().byId("District").getText() === "" &&
			   sap.ui.getCore().byId("Country").getText() === "" && sap.ui.getCore().byId("Region").getText() === "" &&
			   sap.ui.getCore().byId("POBoxPostalCode").getText() === "" && sap.ui.getCore().byId("TaxJurisdiction").getText() === "" &&
			   sap.ui.getCore().byId("POBox").getText() === "" && sap.ui.getCore().byId("CreateAddressTitle") !== undefined){
				this.oS3Controller.ccHookHideCreateAddressSection();
				//sap.ui.getCore().byId("CreateAddressTitle").destroy();
			}
			if(sap.ui.getCore().byId("Language").getText() === "" && sap.ui.getCore().byId("Telephone1").getText() === "" &&
					   sap.ui.getCore().byId("Telephone2").getText() === "" && sap.ui.getCore().byId("FaxNumber").getText() === "" &&
					   sap.ui.getCore().byId("TeletexNumber").getText() === "" && sap.ui.getCore().byId("TelexNumber").getText() === "" &&
					   sap.ui.getCore().byId("TeleboxNumber").getText() === "" && sap.ui.getCore().byId("PrinterName").getText() === "" &&
					    sap.ui.getCore().byId("ccDataLine").getText() === "" &&
					   sap.ui.getCore().byId("CreateCommunicationTitle") !== undefined){
				this.oS3Controller.ccHookHideCreateCommSection();
				//sap.ui.getCore().byId("CreateCommunicationTitle").destroy();
			}		
			if(sap.ui.getCore().byId("RecordQtyIndicator").getText() === "" && sap.ui.getCore().byId("ccActualPrimaryCostsIndicator").getText() === "" &&
					   sap.ui.getCore().byId("ccActualSecondaryCosts").getText() === "" && sap.ui.getCore().byId("ccPlanPrimaycostIndicator").getText() === "" &&
					   sap.ui.getCore().byId("ccPlanSecondaryCosts").getText() === "" && sap.ui.getCore().byId("ActualRevenuesIndicator").getText() === "" &&
					   sap.ui.getCore().byId("PlanRevenuesIndicator").getText() === "" && sap.ui.getCore().byId("CommitmentUpdateIndicator").getText() === "" &&
					   sap.ui.getCore().byId("CreateIndicatorsTitle") !== undefined){
				//this.oS3Controller.ccHookHideCreateCommSection();
				sap.ui.getCore().byId("CreateIndicatorsTitle").destroy();
			}				
		},
		
		//Hiding a description table
		hideTable:function(){
			sap.ui.getCore().byId("CreateDescriptionTable").setVisible(false);
		},
			
		//create a template for description table
	    descrValueTemplate: function(){
	           var oItemDescrTemp = new sap.m.ColumnListItem({
	                 // type:"Navigation",
	                  cells: [
	                          new sap.m.Text({
	                                text:"{CD_LANGU/Description} ({CD_LANGU/Code})"
	                          }), 	                          
	                          new sap.m.Text({
	                                text:{
	                                       path:"TXTSH",
	                                       formatter:fcg.mdg.approvecrv2.util.Formatter.noValue
	                                }
	                          }),	                          
	                          new sap.m.Text({
	                                text:{
	                                       path:"TXTMI",
	                                       formatter:fcg.mdg.approvecrv2.util.Formatter.noValue
	                                }
	                          })	                         
	          ]});
	          return oItemDescrTemp;
	    },
		 
		 //Create attachment list
			createCcAttachmentList:function(aResult){
				var oAttachList = sap.ui.getCore().byId("ccCreateAttachFileUpload");
				var oCustomListItem = new sap.m.CustomListItem({});
				for(var i = 0;i < aResult.CCTR.CCTR2AtthCCTRRel.results.length;i++ )
				{
					var vLink = "";
					if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_LINK !== "")
						{ vLink = aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_LINK; }
					else
						vLink = aResult.CCTR.CCTR2AtthCCTRRel.results[i].__metadata.media_src;

					var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_ACREATED_AT) + " " 
					+ this.i18n.getText('AttachBy') + " ";
					var vContributor = " " + aResult.CCTR.CCTR2AtthCCTRRel.results[i].CD_USMD_ACREATED_BY.Description + "(" + aResult.CCTR.CCTR2AtthCCTRRel.results[i].CD_USMD_ACREATED_BY.Code + ")";
		
						var oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor });
						var vLinkemphasized = false;	
					
						var oAttach = new sap.m.Link({
							text : aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_TITLE,
							target : "_blank",
							href : vLink,
							wrapping : true,
							subtle : false,
							emphasized : vLinkemphasized
						}).addStyleClass("padding_bottom");
						
					var vl = new sap.m.VBox({
						items:[oAttach,oContributor]}).addStyleClass("padding_left");

					var oIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_FILE_TYPE);
					 oIcon = new sap.ui.core.Icon({
						src: oIcon,
						size: "3.0em"});

					var h1 = new sap.m.HBox({
						items:
							[oIcon,vl]}).addStyleClass("Hbox_padding");
					
					oCustomListItem.addContent(h1);
					oAttachList.addItem(oCustomListItem);
				}

				if(oAttachList.getItems().length === 0){
					sap.ui.getCore().byId("ccCreateAttachFileUpload").destroy();
				}

			}
};