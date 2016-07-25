/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CostCenterCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CostCenterChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CostCenter");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.CcDetail", {
	aDetailData:"",
	commHeaderIndex:"",
	oAddTitle:"",
	oCostCenterDetails:"",
	extHookModifyDetailFormData:null,
	extHookDetailDescTemplate:null,
	extHookHideDetailAddressSection:null,
	extHookHideDetailCommSection:null,
	extHookModifyStyleClass:null,
	extHookDetDescriptionTable:null,
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
	
	onInit: function() {
		// Execute onInit of base class.
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);

		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("ccDetail").setShowNavButton(true);

		// Get DataManager instance.
		this.oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "ccItemDetail") {
				// This code will be executed when the user navigates to Detail's screen.
				// Initialize the cost center fragment
				if(this.oCostCenterDetails === ""){
					this.oCostCenterDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CostCenterDetailsForm', fcg.mdg.approvecrv2.util.Formatter);
				}
				else{
					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("ccDetail").removeContent(this.oCostCenterDetails);
					if(this.oCostCenterDetails !== undefined){
						this.oCostCenterDetails.destroy();
					}
		            this.oCostCenterDetails = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CostCenterDetailsForm', fcg.mdg.approvecrv2.util.Formatter);
				}
				this.getView().byId("ccDetail").addContent(this.oCostCenterDetails);
				// Get the CHANGE data and ACTIVE data that should be shown on Detail screen
				var detailData = "";
				 detailData = fcg.mdg.approvecrv2.DomainSpecParts.CostCenterChange.getDetailData();				
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.CostCenter.getS3Instance();
				//Get decisions from S3 screen as the footer should hold the same decisions
				var aDecisions = oS3Instance.getDecisions();
				//Create decisions on footer of Detail screen
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');

				/**
				 * @ControllerHook To modify the data of the form if it is not done via direct binding
				 * Customer can modify the data as per his requirements before binding it to a form
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyDetailFormData
				 * @param {object} detailData Holds data
				 * @return {object} detailData Modified Data
				 */
				if(this.extHookModifyDetailFormData){
					var extModifiedData = this.extHookModifyDetailFormData(detailData);
					if(extModifiedData !== undefined){
						detailData = extModifiedData;
					}
				}
				
				//this.aDetailData = detailData;
				var oDetailModel = new sap.ui.model.json.JSONModel();
				
				oDetailModel.setData(detailData);
				//Bind the change data to Simple form instantiated with detail screen
				sap.ui.getCore().byId("ccDetailSimpleForm").setModel(oDetailModel);								
				this.getView().byId("ccObjHeaderDet").setModel(oDetailModel);
				//Object header should have both Controlling area key and Cost center key
				this.getView().byId("ccObjHeaderDet").setTitle(detailData.CCTR.TXTSH + "(" + detailData.CCTR.COAREA + "/" + detailData.CCTR.CCTR + ")");
				//Derive code and description for respective fields
				//this.getDescriptions(detailData);
				this.getView().byId("ccDetail").setTitle(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_ID"));
		        
				var sStyleClass = "text_bold";
				/**
				 * @ControllerHook To modify the style class
				 * Customer can modify the style class to influence text fields
				 * the format of data shown in this description table									 
				 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyStyleClass
				 * @param {string} sStyleClass style class
				 * @return {string} sStyleClass modified style class
				 */
				if(this.extHookModifyStyleClass)
				{
					var sNewStyleClass = this.extHookModifyStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
					if(sNewStyleClass !== undefined){
						sStyleClass = sNewStyleClass;
					}
				}
				//Handle description table
			    var oTable = sap.ui.getCore().byId("CcDetailDescriptionTable");
				//var oNoText = new sap.m.Text({text:"(" + this.i18n.getText("CC_NOT_MAIN") + ")"});
			    //Ext class for Style class
			    if(detailData.CCTR.CCTR2DTxtCCTRRel.results.length > 0){
					/**
					 * @ControllerHook To give an access to influence description table
					 * Customer can modify the description table to modify the new fields									 
					 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookDetDescriptionTable
					 * @param {object} detailData Contains detail data
					 * @param {object} oTable Table Instance
					 * @return { } 
					 */
					if(this.extHookDetDescriptionTable)
					{
						this.extHookDetDescriptionTable(detailData,oTable); //HOOK METHOD FOR Key Search
					}
					else{
						var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
						oModel.setData(detailData.CCTR.CCTR2DTxtCCTRRel);
						
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
		     }
			 //If there is no data, hide the table
		     else
		     {
		    	 this.hideTable();
		     }
		     // Loop at the CHANGE data and add the style class to make the LABEL and TEXT as BOLD   		                
			 for(var i=0; i< detailData.CCTR.ChangeData.results.length;i++)
			 {
					var sLabelName = "LBL_CCDET_" + detailData.CCTR.ChangeData.results[i].Attribute;
					var oLblIns = sap.ui.getCore().byId(sLabelName);
					if(oLblIns !== undefined){
						oLblIns.setDesign("Bold");
					}
					var sTextName = "DET_" + detailData.CCTR.ChangeData.results[i].Attribute;
				//	var oTextIns = sap.ui.getCore().byId(sTextName);
					if(sap.ui.getCore().byId(sTextName) !== undefined){
						sap.ui.getCore().byId(sTextName).addStyleClass(sStyleClass);
					}
			 }
			 this.hideSection();				
			 this.createCcDetAttachmentList(detailData);
		 }
		}, this);

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
	
    //Hiding a section if there are no values present for the fields present in this section
	hideSection:function(){
		//this.getView().rerender();
		//Check Address Section
		/**
		 * @ControllerHook To delete the address section
		 * Customer can add their own fields to influence hiding of this address section by 
		 * adjusting the fields in the IF condition									 
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookHideDetailAddressSection
		 * @param { } 
		 * @return { } 
		 */
		if(this.extHookHideDetailAddressSection)
		{
			this.extHookHideDetailAddressSection();
		}
		else
		{
			if(sap.ui.getCore().byId("DET_CC_STRAS").getText() === "" && sap.ui.getCore().byId("DET_CC_PSTLZ").getText() === "" &&
			   sap.ui.getCore().byId("DET_CC_ORT01").getText() === "" && sap.ui.getCore().byId("DET_CC_ORT02").getText() === "" &&
			   sap.ui.getCore().byId("DET_CC_LAND1").getText() === "" && sap.ui.getCore().byId("DET_CC_REGION").getText() === "" &&
			   sap.ui.getCore().byId("DET_CC_PSTL2").getText() === "" && sap.ui.getCore().byId("DET_CCTRTXJCD").getText() === "" && 
			   sap.ui.getCore().byId("DET_CC_ANRED").getText() === "" && sap.ui.getCore().byId("DET_CC_NAME1").getText() === "" &&
			   sap.ui.getCore().byId("DET_CC_NAME2").getText() === "" && sap.ui.getCore().byId("DET_CC_NAME3").getText() === "" &&
			   sap.ui.getCore().byId("DET_CC_NAME4").getText() === "" && 
			   sap.ui.getCore().byId("AddressTitle") !== undefined){								
						sap.ui.getCore().byId("AddressTitle").destroy();
				}

		}

/*		else if(sap.ui.getCore().byId("AddressTitle") === undefined){
			sap.ui.getCore().byId("ccDetailSimpleForm").insertContent(this.oAddTitle,this.commHeaderIndex);
		}*/
		/**
		 * @ControllerHook To delete the address section
		 * Customer can add their own fields to influence hiding of this communication section by 
		 * adjusting the fields in the IF condition									 
		 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookHideDetailCommSection
		 * @param { } 
		 * @return { } 
		 */
		if(this.extHookHideDetailCommSection)
		{
			this.extHookHideDetailCommSection();
		}
		else
		{
			if(sap.ui.getCore().byId("DET_CC_SPRAS").getText() === "" && sap.ui.getCore().byId("DET_CC_TELF1").getText() === "" &&
			   sap.ui.getCore().byId("DET_CC_TELF2").getText() === "" && sap.ui.getCore().byId("DET_CC_TELFX").getText() === "" &&
			   sap.ui.getCore().byId("DET_CC_TELTX").getText() === "" && sap.ui.getCore().byId("DET_CC_TELX1").getText() === "" &&
			   sap.ui.getCore().byId("DET_CC_TELBX").getText() === "" && sap.ui.getCore().byId("DET_CC_DRNAM").getText() === "" &&
			   sap.ui.getCore().byId("DET_CC_DATLT").getText() === "" &&
			   sap.ui.getCore().byId("CommunicationTitle") !== undefined){
				sap.ui.getCore().byId("CommunicationTitle").destroy();
			}	

		}
		if(sap.ui.getCore().byId("DET_CCTRQTYRQ").getText() === "" && sap.ui.getCore().byId("DET_CCTRLKAPP").getText() === "" &&
				   sap.ui.getCore().byId("DET_CCTRLKASC").getText() === "" && sap.ui.getCore().byId("DET_CCTRLKPPC").getText() === "" &&
				   sap.ui.getCore().byId("DET_CCTRLKPSC").getText() === "" && sap.ui.getCore().byId("DET_CCTRLKARP").getText() === "" &&
				   sap.ui.getCore().byId("DET_CCTRLKPRV").getText() === "" && sap.ui.getCore().byId("DET_CCTRLKCUP").getText() === "" &&
				   sap.ui.getCore().byId("IndicatorsTitle") !== undefined){
					sap.ui.getCore().byId("IndicatorsTitle").destroy();
		}	
		
	},
	
	// Hide Description table if no data is present
	hideTable:function(){
		sap.ui.getCore().byId("CcDetailDescriptionTable").setVisible(false);
	},	
	
	//Validity formatter to handle dates
    validityFormatter: function(oValidFrom,oValidTo)
	{
    	var vFrom = "";
    	var vTo = "";
		if(oValidFrom === "" || oValidFrom === null || oValidFrom === undefined || oValidTo === "" || oValidTo === null || oValidTo === undefined)
			return "";
		
		if(oValidFrom){
    		 vFrom = sap.ca.ui.model.format.DateFormat.getDateInstance().format(oValidFrom);
    	}
		
		if(oValidTo){
    		 vTo = sap.ca.ui.model.format.DateFormat.getDateInstance().format(oValidTo);
    	}
		
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Validity") + ": " + vFrom + " - " + vTo;
		
	},
	
	//Handle Attachments
	createCcDetAttachmentList:function(aResult){
		var oAttachList = sap.ui.getCore().byId("ccAttachFileUpload");
		var oCustomListItem = new sap.m.CustomListItem({});
		var oContributor = "";
		var vLinkemphasized = "";
		for(var i=0;i<aResult.CCTR.CCTR2AtthCCTRRel.results.length;i++ )
		{
			var vLink = "";
			if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_LINK !== "")
				vLink = aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_LINK;
			else
				vLink = aResult.CCTR.CCTR2AtthCCTRRel.results[i].__metadata.media_src;

			var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_ACREATED_AT) + " " 
			+ this.i18n.getText('AttachBy') + " ";
			var vContributor = " " + aResult.CCTR.CCTR2AtthCCTRRel.results[i].CD_USMD_ACREATED_BY.Description + "(" + aResult.CCTR.CCTR2AtthCCTRRel.results[i].CD_USMD_ACREATED_BY.Code +")";
			var vContri = "";
			for(var j=0;j<aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results.length;j++ ){
				vContri = vForamtdate + " " + vContributor;
				break;
			}

			if(vContri !== "")				
				{ oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("text_bold");
				 vLinkemphasized = true;
				 for(var j=0;j<aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results.length;j++ ){
			     if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].EntityAction === 'D')
			       oContributor.addStyleClass('sapThemeText');
				 }
				}
			else {
				 oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor });
				 vLinkemphasized = false;	
			}

				var oAttach = new sap.m.Link({
					text : aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_TITLE,
					target : "_blank",
					href : vLink,
					wrapping : true,
					subtle : false,
					emphasized : vLinkemphasized
				}).addStyleClass("padding_bottom");
				
			for(var j=0;j<aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results.length;j++ ){
			  if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].EntityAction === 'D'){
			    oAttach.setHref("");
			    oAttach.addStyleClass('sapThemeText');
			  	
			  }
				
			}
				
			var vl = new sap.m.VBox({
				 items:[oAttach,oContributor]}).addStyleClass("padding_left");

			var oIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_FILE_TYPE);
			 oIcon = new sap.ui.core.Icon({
				src: oIcon,
				size: "3.0em"});

			var h1 = new sap.m.HBox({
				items:
					[oIcon,vl]}).addStyleClass("Hbox_padding");

			//
			/*var oCustomListItem = new sap.m.ColumnListItem({
				type:"Active",
					cells:[h1]});
			;*/
			
			oCustomListItem.addContent(h1);
			oAttachList.addItem(oCustomListItem);
		}

		if(oAttachList.getItems().length === 0){
			sap.ui.getCore().byId("ccAttachFileUpload").destroy();
		}

	}
	
});