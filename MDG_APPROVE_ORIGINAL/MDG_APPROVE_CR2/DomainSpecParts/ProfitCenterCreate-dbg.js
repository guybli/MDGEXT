/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenter");
/*
 * This method takes care of initializing Forms, forming queries to fetch newly created data and displaying data for create scenarios of Cost center
 * */
fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterCreate = {

		//Declare global variables
		oProfitCenterCreateForm:"",
		oS3Controller:"",
		i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

		//Initialize the profit Center Create fragment and load it into the create layout of S3 screen
		initialize_Forms : function(oS3Controller) {
			this.oS3Controller = oS3Controller;
			if(this.oProfitCenterCreateForm === ""){  
				this.oProfitCenterCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ProfitCenterCreate', fcg.mdg.approvecrv2.util.Formatter);
			}
			else{
				this.oProfitCenterCreateForm.destroy();
				this.oProfitCenterCreateForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ProfitCenterCreate', fcg.mdg.approvecrv2.util.Formatter);
			}
			sap.ui.getCore().byId("pcCreateDataLayout").removeAllContent();
			sap.ui.getCore().byId("pcCreateDataLayout").addContent(this.oProfitCenterCreateForm);
		},

		//Fetch the query for Create scenario
		getQueries:function(sServiceUrl,sPath,s3Controller){
			this.oS3Controller = s3Controller;
			//var aQuery = [];sServiceUrl +
			var sQuery =  sPath + "?$expand=PCTR,PCTR/PCTR2DTxtPCTRRel,PCTR/PCTR2PCCCASSRel,PCTR/PCTR2AtthPCTRRel," + 
			"PCTR/CD_PCTRPCTRN,PCTR/CD_PCTRRESPU,PCTR/CD_COAREA,PCTR/CD_PC_LAND1,PCTR/CD_PC_REGION,PCTR/CD_PC_SPRAS,PCTR/CD_PCTRTXJCD,PCTR/CD_PCTRSEG,PCTR/PCTR2DTxtPCTRRel/CD_LANGU,PCTR/PCTR2PCCCASSRel/CD_COMPCODE,PCTR/PCTR2AtthPCTRRel/CD_USMD_ACREATED_BY";
			//aQuery.push(sQuery);
			var extQuery = this.oS3Controller.pcHookPCCreateQuery(sQuery);
			if(extQuery !== undefined){
				sQuery = extQuery;
			}
			return sQuery; 
		},


		//Bind the data to the create form and render it
		displayFormData : function(aResult) {
			var extModifiedData = this.oS3Controller.pcHookModifyPCCreateFormData(aResult);
			var extOItemTemp = "";
			if(extModifiedData !== undefined){
				aResult = extModifiedData;
			}
			//Create Json Model and set the control to Json model
			var oDetailModel = new sap.ui.model.json.JSONModel();
			oDetailModel.setData(aResult);
			sap.ui.getCore().byId("pcCreateSimpleForm").setModel(oDetailModel);
			sap.ui.getCore().byId("pcDescriptionTable").setModel(oDetailModel);
			sap.ui.getCore().byId("pcCompCodeTable").setModel(oDetailModel);
			
			//this._getDescriptions(aResult);//to set the value of the fields with Code and Description

			//Item descriptor for Description table
			var oItemDescrTemp = new sap.m.ColumnListItem({
				cells: [
				        new sap.m.Text({
				        	text:"{CD_LANGU/Description} ({CD_LANGU/Code})"//Concatenate Language description and code
				        }),	 
				        new sap.m.Text({
				        	text:{
				        		path:"TXTSH",
				        		formatter:fcg.mdg.approvecrv2.util.Formatter.noValue//formatter function to set the value to Not Maintained for empty values
				        	}
				        }),	 			                       
				        new sap.m.Text({
				        	text:{
				        		path:"TXTMI",
				        		formatter:fcg.mdg.approvecrv2.util.Formatter.noValue//formatter function to set the value to Not Maintained for empty values
				        	}
				        })	                         
				        ]});
			sap.ui.getCore().byId("pcDescriptionTable").bindItems('/PCTR/PCTR2DTxtPCTRRel/results', oItemDescrTemp, '', '');//bind items to the table with the path of Json model and item template
			
			 extOItemTemp = this.oS3Controller.pcHookPCCreateDescTemplate(oItemDescrTemp);
			if(extOItemTemp !== undefined){
				oItemDescrTemp = extOItemTemp;
			}

			//Item descriptor for Company Code table
			var oCompCodeDescrTemp = new sap.m.ColumnListItem({
				cells: [
				        new sap.m.Text({
				        	text : "{CD_COMPCODE/Description} ({COMPCODE})"//Concatenate company code description and code
				        }),	
				        new sap.m.Text({
				        	text: {
				        		path:"PCTRCCASS",
				        		formatter:fcg.mdg.approvecrv2.util.Formatter.checkBox //formatter function to set the value of check box to YES or NO 
				        	}
				        })	 			                       	                         
				        ]});

			sap.ui.getCore().byId("pcCompCodeTable").bindItems('/PCTR/PCTR2PCCCASSRel/results', oCompCodeDescrTemp, '', '');//Bind the data to the table with the path of the Json model and item template

			 extOItemTemp = this.oS3Controller.pcHookPCCreateCompCodeTemplate(oCompCodeDescrTemp);
			if(extOItemTemp !== undefined){
				oCompCodeDescrTemp = extOItemTemp;
			}
			
			//attachments in list control
			if(aResult.PCTR.PCTR2AtthPCTRRel.results.length !== 0)
				this._createPcAttachmentList(aResult);
			this.oS3Controller.pcHookAddPCData(aResult);

			this.hideSections(aResult);//Hide the sections for general, communication, indicators etc if there is no data
			this.hideTable(aResult);//Hide the tables of description and company code if there is no data
		},

		//This section deals with attachment handling
		//if its a link USMD_LINK will be filled else __metadata.media_src field will have the value. 
		//if the file has __metadata.media_src as the link, it will call the Odata method GET_STREAM() to get the file content and download it to the desktop
		//if the file has web url as the link, it will not trigger the Odata and will simply open the link in new tab
		_createPcAttachmentList:function(aResult){

			var oAttachList = sap.ui.getCore().byId("pcAttachFileUpload");//Get the Attachment List Control
			var oCustomListItem = new sap.m.CustomListItem({});//create custom list item

			for(var i=0;i<aResult.PCTR.PCTR2AtthPCTRRel.results.length;i++ )
			{
				var vLink = "";
				if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_LINK !== "")
					vLink = aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_LINK;
				else
					vLink = aResult.PCTR.PCTR2AtthPCTRRel.results[i].__metadata.media_src;

				var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_ACREATED_AT) + " " 
				+ this.i18n.getText('AttachBy') + " ";
				var vContributor = " " + aResult.PCTR.PCTR2AtthPCTRRel.results[i].CD_USMD_ACREATED_BY.Description + "(" + aResult.PCTR.PCTR2AtthPCTRRel.results[i].CD_USMD_ACREATED_BY.Code + ")";

				var oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor });//concatenate the date created at and the contributor name
				var oAttach = new sap.m.Link({
					text : aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_TITLE,
					target : "_blank",
					href : vLink,
					wrapping : true,
					subtle : false,
					emphasized : false
				}).addStyleClass("padding_bottom");//add style class to get space in the bottom

				//Create a vertical box in which Link and Contributor text is added
				var vl = new sap.m.VBox({
					items:[oAttach,oContributor]}).addStyleClass("padding_left");//added style class to get space on the left hand side

				var vIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_FILE_TYPE);//formatter class to get the icon type based on file type

				//Create an icon for the file with the size 3.0 so that it covers the Vertical box on the right hand side
				var oIcon = new sap.ui.core.Icon({
					src: vIcon,
					size: "3.0em"});

				//Create a horizontal box and insert icon and vertical box side by side
				var h1 = new sap.m.HBox({
					items:
						[oIcon,vl]}).addStyleClass("Hbox_padding");//Spacing around the Box is required in custom list item since it creates a flex item

				oCustomListItem.addContent(h1);//add the Hbox into the list item
				oAttachList.addItem(oCustomListItem);//add the list item into the list
			}
		},

        // Hiding a section if there are no values present for the fields present in this section
		hideSections: function(aResults){
			//hide address data
			if(aResults.PCTR.PC_ANRED === "" &&
					aResults.PCTR.PC_NAME1 === "" &&
					aResults.PCTR.PC_NAME2 === "" &&
					aResults.PCTR.PC_NAME3 === "" &&
					aResults.PCTR.PC_NAME4 === "" &&
					aResults.PCTR.PC_STRAS === "" &&
					aResults.PCTR.PC_PSTLZ === "" &&
					aResults.PCTR.PC_ORT01 === "" &&
					aResults.PCTR.PC_ORT02 === "" && 
					aResults.PCTR.PC_LAND1 === "" &&
					aResults.PCTR.PC_REGION === "" &&
					aResults.PCTR.PC_PSTL2 === "" &&
					aResults.PCTR.PCTRTXJCD === ""){
				this.oS3Controller.pcHookPCHideCreateAddressSection();

			}

			//hide communication data
			if(aResults.PCTR.PC_TELF1 === "" &&
					aResults.PCTR.PC_SPRAS === "" &&
					aResults.PCTR.PC_DATLT === "" &&
					aResults.PCTR.PC_TELF2 === "" &&
					aResults.PCTR.PC_TELFX === "" &&
					aResults.PCTR.PC_TELTX === "" &&
					aResults.PCTR.PC_TELX1 === "" &&
					aResults.PCTR.PC_TELBX === "" &&
					aResults.PCTR.PC_DRNAM === "" ){
				this.oS3Controller.pcHookHidePCCreateCommSection(); 
			}
			if(aResults.PCTR.PCTRLKIND === ""){
				sap.ui.getCore().byId("pcInd").destroy();
			}
		},
		
		//Hide description table if no data is present
		hideTable: function(aResults){//Hide description and company code table if no data is returned
			if(aResults.PCTR.PCTR2PCCCASSRel.results.length === 0)
				sap.ui.getCore().byId("pcCompCodeTable").setVisible(false);
			if(aResults.PCTR.PCTR2DTxtPCTRRel.results.length === 0)
				sap.ui.getCore().byId("pcDescriptionTable").setVisible(false);
			if(aResults.PCTR.PCTR2AtthPCTRRel.results.length === 0)
				sap.ui.getCore().byId("pcAttachFileUpload").setVisible(false);
		}

};