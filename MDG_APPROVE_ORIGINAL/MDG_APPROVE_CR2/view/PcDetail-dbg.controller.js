/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenter");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.PcDetail", {

	//Global variable
	aDetailData:"",
	oProfitCenterDetails:"",
	extHookPCModifyDetailFormData:null,
	extHookPCModifyStyleClass:null,
	extHookPCHideDetailAddressSection:null,
	extHookPCHideDetailCommSection:null,
	extHookPCDetailDescTemplate:null,
	extHookPCDetDescriptionTable:null,
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),

	onInit: function() {
		//Execute onInit of base class.
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);

		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("pcDetail").setShowNavButton(true);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "pcItemDetail") {

				// This code will be executed when the user navigates to Detail's screen.
				if(this.oProfitCenterDetails === ""){
					this.oProfitCenterDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ProfitCenterDetails', fcg.mdg.approvecrv2.util.Formatter);
				}
				else{
					this.getView().byId("pcDetail").removeContent(this.oProfitCenterDetails);//.byId("ccDetail")
					this.oProfitCenterDetails.destroy();
					this.oProfitCenterDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ProfitCenterDetails', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("pcDetail").addContent(this.oProfitCenterDetails);

				// Read parameters.
				//var args = oEvent.getParameter("arguments");
				var detailData = fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange.getDetailData();
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenter.getS3Instance();
				var aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');//create Approve and Reject buttons on details screen
				/**
				 * @ControllerHook To modify the data of the form if it is not done via direct binding
				 * Customer can modify the data as per his requirements before binding it to a form
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookPCModifyDetailFormData
				 * @param {object} detailData Holds data
				 * @return {object} detailData Modified Data
				 */
				if(this.extHookPCModifyDetailFormData){
					var extModifiedData = this.extHookPCModifyDetailFormData(detailData);
					if(extModifiedData !== undefined){
						detailData = extModifiedData;
					}
				}
				this.aDetailData = detailData;
				var oDetailModel = new sap.ui.model.json.JSONModel();
				oDetailModel.setData(detailData);

				//Set the header text for the details page
				sap.ui.getCore().byId("pcDetailSimpleForm").setModel(oDetailModel);				
				this.getView().byId("objHeaderDet").setModel(oDetailModel);
				this.getView().byId("objHeaderDet").setTitle(detailData.PCTR.TXTSH + "(" + detailData.PCTR.COAREA + "/" + detailData.PCTR.PCTR + ")");
				//To set the values of the field with description and code
				//this._getDescriptions(detailData);

				var oTable = sap.ui.getCore().byId("pcDetDescriptionTable");
				this.setStyleForChangedTable(detailData, oTable);

				var oCompCodeTable = sap.ui.getCore().byId("pcDetCompCodeTable");
				this.setStyleForChangedCompTable(detailData, oCompCodeTable);

				//bold label and text in details screen
				var sStyleClass = "text_bold";
				/**
				 * @ControllerHook To modify the style class
				 * Customer can modify the style class to influence text fields
				 * the format of data shown in this description table									 
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookPCModifyStyleClass
				 * @param {string} sStyleClass style class
				 * @return {string} sStyleClass modified style class
				 */
				if(this.extHookPCModifyStyleClass)
				{
					var sNewStyleClass = this.extHookPCModifyStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
					if(sNewStyleClass !== undefined){
						sStyleClass = sNewStyleClass;
					}
				}

				//if the data has been changed for a field, set the text of the field and the label to bold
				for(var i=0; i< detailData.PCTR.ChangeData.results.length;i++)
				{
					var sLabelName = "LBL_" + detailData.PCTR.ChangeData.results[i].Attribute;
					var oLblIns = sap.ui.getCore().byId(sLabelName);
					if(oLblIns !== undefined){
						oLblIns.setDesign("Bold");
					}
					var sTextName = "TXT_" + detailData.PCTR.ChangeData.results[i].Attribute;
					if(sap.ui.getCore().byId(sTextName) !== undefined){
						sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
					}
				}

				//attachments
				this.createAttachmentList(this.aDetailData);

				this.hideSection(this.aDetailData);//This function is called to hide the section which does not have any changed data
				this.hideTable(this.aDetailData);//This function is called to hide the table which does not have any changed data

			}
		}, this);

	},

	hideSection: function(aResults){

		/**
		 * @ControllerHook To delete the address section
		 * Customer can add their own fields to influence hiding of this address section by 
		 * adjusting the fields in the IF condition									 
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookPCHideDetailAddressSection
		 * @param { } 
		 * @return { } 
		 */
		if(this.extHookPCHideDetailAddressSection)
		{
			this.extHookPCHideDetailAddressSection();
		}
		else
		{
//			Hide address data
			if(aResults.PCTR.PC_STRAS === "" &&
					aResults.PCTR.PC_PSTLZ === "" &&
					aResults.PCTR.PC_ORT01 === "" &&
					aResults.PCTR.PC_ORT02 === "" && 
					aResults.PCTR.PC_LAND1 === "" &&
					aResults.PCTR.PC_REGION === "" &&
					aResults.PCTR.PC_PSTL2 === "" &&
					aResults.PCTR.PCTRTXJCD === "" &&
					aResults.PCTR.PC_ANRED === "" &&
					aResults.PCTR.PC_NAME1 === "" &&
					aResults.PCTR.PC_NAME2 === "" &&
					aResults.PCTR.PC_NAME3 === "" &&
					aResults.PCTR.PC_NAME4 === ""){
				sap.ui.getCore().byId("pcDetAddress").destroy();
			}
		}
		//hide communication data
		/**
		 * @ControllerHook To delete the address section
		 * Customer can add their own fields to influence hiding of this communication section by 
		 * adjusting the fields in the IF condition									 
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookPCHideDetailCommSection
		 * @param { } 
		 * @return { } 
		 */
		if(this.extHookPCHideDetailCommSection)
		{
			this.extHookPCHideDetailCommSection();
		}
		else
		{

			if(aResults.PCTR.PC_TELF1 === "" &&
					aResults.PCTR.PC_DATLT === "" &&
					aResults.PCTR.PC_SPRAS === "" &&
					aResults.PCTR.PC_TELF2 === "" &&
					aResults.PCTR.PC_TELFX === "" &&
					aResults.PCTR.PC_TELTX === "" &&
					aResults.PCTR.PC_TELX1 === "" &&
					aResults.PCTR.PC_TELBX === "" &&
					aResults.PCTR.PC_DRNAM === "" ){
				sap.ui.getCore().byId("pcDetComm").destroy();
			}
		}
		if(aResults.PCTR.PCTRLKIND === ""){
			sap.ui.getCore().byId("pcDetInd").destroy();
		}

	},

	hideTable: function(aResults){

		if(aResults.PCTR.PCTR2PCCCASSRel.results.length === 0)
			sap.ui.getCore().byId("pcDetCompCodeTable").setVisible(false);
		if(aResults.PCTR.PCTR2DTxtPCTRRel.results.length === 0)
			sap.ui.getCore().byId("pcDetDescriptionTable").setVisible(false);
		if(aResults.PCTR.PCTR2AtthPCTRRel.results.length === 0)
			sap.ui.getCore().byId("pcDetAttachList").setVisible(false);
	},

	//Description change table
	setStyleForChangedTable:function(aResult, oTable){
		if(aResult.PCTR.PCTR2DTxtPCTRRel.results.length > 0){
			var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
		
			
			oModel.setData(aResult.PCTR.PCTR2DTxtPCTRRel); 
			
			for(var i = 0; i < oModel.oData.results.length; i++){
			    if(oModel.oData.results[i].ChangeData !== undefined){
			     for(var j = 0; j< oModel.oData.results[i].ChangeData.results.length; j++){
			      	if(oModel.oData.results[i].ChangeData.results[j].EntityAction === 'D')
			      oModel.oData.results[i].ChangeData.results[j].Attribute = "";
			  	  }	
			  	}
			  }	
			
			oTable.setVisible(true);
			oTable.setModel(oModel); 
			var oItemDescTemp = this.getDescTemplate(oModel);
			oTable.bindItems("/results", oItemDescTemp);
		}
	},

	getDescTemplate: function(oModel){
		var oItemDescTemp = new sap.m.ColumnListItem({
			//type:"Navigation",
			cells: [	      
			        new sap.m.Text({
			        	text:{
			        		path:"CD_LANGU/Description",
			        		formatter: function() {
			        			var desc = oModel.getProperty("CD_LANGU/Description", this.getBindingContext());
			        			var key = oModel.getProperty("CD_LANGU/Code", this.getBindingContext());
			        			
			        		   
			        		    fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "LANGU" );
			        			return fcg.mdg.approvecrv2.util.Formatter.noValue(fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc));
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text:{
			        		path:"TXTSH",
			        		formatter: function() {
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TXTSH" );
			        			return fcg.mdg.approvecrv2.util.Formatter.noValue(oModel.getProperty('TXTSH', this.getBindingContext()));
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text:{
			        		path:"TXTMI",
			        		formatter: function(){
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TXTMI" );
			        			return fcg.mdg.approvecrv2.util.Formatter.noValue(oModel.getProperty('TXTMI', this.getBindingContext()));
			        		}			        		
			        	}
			        })
			    ]
		});  
		return oItemDescTemp;		
	},		
	//Build company Code change table
	setStyleForChangedCompTable:function(aResult, oTable){ 
		if(aResult.PCTR.PCTR2PCCCASSRel.results.length > 0){
			var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
			oModel.setData(aResult.PCTR.PCTR2PCCCASSRel); 
			oTable.setVisible(true);
			oTable.setModel(oModel); 
			var oItemCompCodeTemp = this.getCompCodeTemplate(oModel);
			oTable.bindItems("/results", oItemCompCodeTemp);
		}

	},
	
	getCompCodeTemplate: function(oModel){
		var oItemCompCodeTemp = new sap.m.ColumnListItem({
			//type:"Navigation",
			cells: [	      
			        new sap.m.Text({
			        	text:{
			        		path:"CD_COMPCODE/Description",
			        		formatter: function() {
			        			var desc = oModel.getProperty("CD_COMPCODE/Description", this.getBindingContext());
			        			var key = oModel.getProperty("CD_COMPCODE/Code", this.getBindingContext());
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "COMPCODE" );
			        			return fcg.mdg.approvecrv2.util.Formatter.noValue(fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc));
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text:{
			        		path:"PCTRCCASS",
			        		formatter: function() {
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "PCTRCCASS" );
			        			var vPostable = oModel.getProperty('PCTRCCASS', this.getBindingContext());
			        			return fcg.mdg.approvecrv2.util.Formatter.noValue(fcg.mdg.approvecrv2.util.Formatter.checkBox(vPostable));
			        		}			        		
			        	}
			        })
			    ]
		});  
		return oItemCompCodeTemp;		
	},	
	validityFormatter: function(oValidFrom,oValidTo)
	{ 
		var vTo = "";
		var vFrom = "";
		if(oValidFrom === "" || oValidFrom === null || oValidFrom === undefined || oValidTo === "" || oValidTo === null || oValidTo === undefined)
			return "";

		if(oValidFrom){
			vFrom = sap.ca.ui.model.format.DateFormat.getDateInstance().format(oValidFrom);
		}

		if(oValidTo){
			vTo = sap.ca.ui.model.format.DateFormat.getDateInstance().format(oValidTo);
		}

		return this.i18n.getText("Validity")+ ": "+ vFrom + " - " + vTo;

	},	

	//Creates a list of attachments and set the attachments which has been changed to bold
	//This section deals with attachment handling
	//if its a link USMD_LINK will be filled else __metadata.media_src field will have the value. 
	//if the file has __metadata.media_src as the link, it will call the Odata method GET_STREAM() to get the file content and download it to the desktop
	//if the file has web url as the link, it will not trigger the Odata and will simply open the link in new tab
	createAttachmentList:function(aResult){
		var oAttachList = sap.ui.getCore().byId("pcDetAttachList");
		var oCustomListItem = new sap.m.CustomListItem({});
		var oContributor = "";
		var vLinkemphasized = "";
		
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
			var vContri = "";
			for(var j=0;j<aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results.length;j++ ){
				vContri = vForamtdate + " " + vContributor;
				break;
			}

			if(vContri !== "")				
			{
				 oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("text_bold");//concatenate the date created at and the contributor name and set it to bold
				 vLinkemphasized = true;//Emphasize the link if attachment has been changed
		        for(var j=0;j<aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results.length;j++ ){
			     if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].EntityAction === 'D')
			       oContributor.addStyleClass('sapThemeText');
				
			}      
			}
			else {
				 oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor });
				 vLinkemphasized = false;	
			}

			var oAttach = new sap.m.Link({
				text : aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_TITLE,
				target : "_blank",
				href : vLink,
				wrapping : true,
				subtle : false,
				emphasized : vLinkemphasized
			}).addStyleClass("padding_bottom");//add style class to get space in the bottom
			
			for(var j=0;j<aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results.length;j++ ){
			  if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].EntityAction === 'D'){
			    oAttach.setHref("");
			    oAttach.addStyleClass('sapThemeText');
			  	
			  }
				
			}

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
	}

});