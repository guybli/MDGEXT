/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// To handle the behavior of the Relation Detail view page both create and change of customer relation data
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Supplier");
sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.RelDetail", {
	oItemWorkplace:"",
	wpstrResults: {dataitems:[]},
	extHookModifyRelDetailFormData:null,
	extHookModifyRelationStyleClass:null,
	extHookModifyWPTableFormData:null,
	sPath:"",
	vDomain:"",
	onInit: function() {	
		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("relPage").setShowNavButton(true);
		
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "RelDetail") {
		
				this.vDomain = oEvent.getParameter('arguments').Domain;
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts[this.vDomain].getS3Instance();

				var aDecisions = oS3Instance.getDecisions();

				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				//Reset Form Bold
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());
				
				//variables
	            var vCat = oEvent.getParameter('arguments').Category;
                var vPartner1 = oEvent.getParameter('arguments').Partner1;
				var vPartner2 = oEvent.getParameter('arguments').Partner2;
				var vChangeKey = oEvent.getParameter('arguments').ChangeKey;
				var aRelDetails = fcg.mdg.approvecrv2.DomainSpecParts[this.vDomain].oRelData.BP_Root.BP_RelationsRel;
				fcg.mdg.approvecrv2.DomainSpecParts[this.vDomain].setRouter(this.oRouter);
  /*call to generate data of detail page on navigation parameters like partner and relation category
  on navigation if contact person exists subsequent details are shown like workplace address*/
				this.displayRelDetails(aRelDetails,vPartner1,vPartner2,vCat,vChangeKey);
				this.getView().rerender(); 

			}
		}, this);
	},
	//function to navigate back to s3 screen
	  
	PressBack: function(){
		var vElement = this.getView().byId("SimpleFormRel");				
		vElement.destroyContent();
	},
	
	//To initialize view so that hidden attributes are not shown on the UI
	onAfterRendering:function(){
		this.hideSection();
	},
	
	// get the workplace address table template 
	getRelTemplate: function(oModel){
		var oThis = this;
		var oItemWorkplace = new sap.m.ColumnListItem({
			type:"Navigation",
			cells: [	      
		        new sap.m.Text({
		        	text:{
	        			path:"ADDRESS_NUMBER__TXT",
		        		formatter: function() {
		        			var addNo = oModel.getProperty('ADDRESS_NUMBER__TXT', this.getBindingContext());
		        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "ADDRESS_NUMBER" );
		        			if(oThis.isNull(addNo))
		        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
		        			return addNo;
		        		}
		        	}
		        }),
		        new sap.m.Text({
		        	text:{
		        		path:"BP_WorkplaceCommStandardPhoneR/TELEPHONE__TXT",
		        		formatter: function() {
		        			var wPhone = oModel.getProperty('BP_WorkplaceCommStandardPhoneR/TELEPHONE__TXT', this.getBindingContext());
		        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "BP_WorkplaceCommStandardPhoneR/TELEPHONE" );
		        			if(oThis.isNull(wPhone))
		        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
		        			return wPhone;
		        		}			        		
		        	}
		        }),
		        new sap.m.Text({
		        	text:{
		        		path:"BP_WorkplaceCommStandardMobile/TELEPHONE__TXT",
		        		formatter: function(){
		        			var wMobile = oModel.getProperty('BP_WorkplaceCommStandardMobile/TELEPHONE__TXT', this.getBindingContext());
		        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "BP_WorkplaceCommStandardMobile/TELEPHONE" );
		        			if(oThis.isNull(wMobile))
		        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
		        			return wMobile;
		        		}			        		
		        	}
		        }),
		        new sap.m.Text({
		        	text:{
		        		path:"BP_WorkplaceCommStandardEMailR/E_MAIL",
		        		formatter: function() {
		        			var wMail = oModel.getProperty('BP_WorkplaceCommStandardEMailR/E_MAIL', this.getBindingContext());
		        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "BP_WorkplaceCommStandardEMailR/E_MAIL" );
		        			if(oThis.isNull(wMail))
		        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
		        			return wMail;
		        		}					        		
		        	}			        		
		        }),
		        new sap.m.Text({
		        	text:{
		        		path:"STANDARDADDRESS",
		        		formatter: function() {
		        			var ctx = this.getBindingContext();
		        			var status = oModel.getProperty("STANDARDADDRESS", ctx);
		        			if(status ===  "X"){
		        				fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STANDARDADDRESS" );
		        				status = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_YES");
		        			}
		        			else{
		        				fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STANDARDADDRESS" );
		        				status = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_NO");
		        			}
		        			return status;                                                                           
		        		}
		        	}
		        })
			]
		});  

		return oItemWorkplace;		
	},
	
	/*call to generate data of detail page on navigation parameters like partner and relation category
	  on navigation if contact person exists subsequent details are shown like workplace address*/
	displayRelDetails : function(aRelDetails,vPartner1,vPartner2,vCat,vChangeKey)
	{   
		var extModifiedData = "";
	    var oModel	= "";
	    var vElement ="";
	    vPartner2 = isNaN(parseInt(vPartner2)) ? vPartner2 : parseInt(vPartner2);
	
	
		for(var i=0; i<aRelDetails.results.length; i++)
		{
			var sRelDetail = null;
			var strResults = "";
			var vPart1 = aRelDetails.results[i].PARTNER1;			
            var vPart2 = isNaN(parseInt(aRelDetails.results[i].PARTNER2)) ? aRelDetails.results[i].PARTNER2 : parseInt(aRelDetails.results[i].PARTNER2);
            var vCategory = aRelDetails.results[i].RELATIONSHIPCATEGORY;
            var vCategoryTxt = aRelDetails.results[i].RELATIONSHIPCATEGORY__TXT;
			if( vPart1 === vPartner1 && vPart2 === vPartner2 && vCategory === vCat  )
			{

				if(aRelDetails.results[i].BP_RelationContactPersonRel !== null)
				{
                 //exchange the bp_relation value to the bp_contact person value
					sRelDetail = aRelDetails.results[i].BP_RelationContactPersonRel;
					
					if (aRelDetails.results[i].DEFAULTRELATIONSHIP === 'X')
						sRelDetail.DEFAULTRELATIONSHIP = aRelDetails.results[i].DEFAULTRELATIONSHIP;
					
					sRelDetail.RELATIONSHIPCATEGORY__TXT = aRelDetails.results[i].RELATIONSHIPCATEGORY__TXT;
					
					/**
					 * @ControllerHook To modify the data of the form if it is not done via direct binding
					 * Customer can modify the data as per his requirements before binding it to a form
					 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyRelDetailFormData
					 * @param {object} detailData Holds data
					 * @return {object} detailData Modified Data
					 */
					if(this.extHookModifyRelDetailFormData){
						 extModifiedData = this.extHookModifyRelDetailFormData(sRelDetail);
						if(extModifiedData !== undefined){
							sRelDetail = extModifiedData;
						}
					}
					oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
					oModel.setData(sRelDetail);
					
					vElement = this.getView().byId("SimpleFormRel");
					if(vElement !== undefined)
						{ vElement.setModel(oModel); }
					strResults = aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel;
					//for entity 
					for (var j= 0; j < strResults.results.length; j++) {
						strResults.results[j].Domain = this.vDomain;
					}
					/**
					 * @ControllerHook To modify the data of the form if it is not done via direct binding
					 * Customer can modify the data as per his requirements before binding it to a form
					 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyWPTableFormData
					 * @param {object} detailData Holds data
					 * @return {object} detailData Modified Data
					 */
					if(this.extHookModifyWPTableFormData){
						 extModifiedData = this.extHookModifyWPTableFormData(strResults);
						if(extModifiedData !== undefined){
							strResults = extModifiedData;
						}
					}
					this.wpstrResults = strResults;
					//contact person
				}
				else{
					//if no contact person details exist
					/**
					 * @ControllerHook To modify the data of the form if it is not done via direct binding
					 * Customer can modify the data as per his requirements before binding it to a form
					 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyRelDetailFormData
					 * @param {object} detailData Holds data
					 * @return {object} detailData Modified Data
					 */
					if(this.extHookModifyRelDetailFormData){
						 extModifiedData = this.extHookModifyRelDetailFormData(sRelDetail);
						if(extModifiedData !== undefined){
							sRelDetail = extModifiedData;
						}
					}
					sRelDetail = aRelDetails.results[i];
					oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
					oModel.setData(sRelDetail);
					vElement = this.getView().byId("SimpleFormRel");
					if(vElement !== undefined)
					{ vElement.setModel(oModel); }
									
					strResults = " ";
					this.wpstrResults = strResults;
				}
		
				
				//Bolding of the changed Data
				if ( sRelDetail.ChangeData.results !== undefined )
				{
					if (sRelDetail.ChangeData.results.length > 0)
					{
						var  sStyleClass = "text_bold";
						var sLabelName = "";
						var oLblIns = "";
						var sTextName = "";
						var oTable = "";
						var l = "";
						
						/**
						 * @ControllerHook To modify the style class
						 * Customer can modify the style class to influence text fields
						 * the format of data shown in this description table									 
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyRelationStyleClass
						 * @param {string} sStyleClass style class
						 * @return {string} sStyleClass modified style class
						 */
						if(this.extHookModifyRelationStyleClass)
						{
							var sNewStyleClass = this.extHookModifyRelationStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
							if(sNewStyleClass !== undefined){
								sStyleClass = sNewStyleClass;
							}
						}
						
						//for contact person 
						for ( l=0; l<sRelDetail.ChangeData.results.length; l++)
						{
							 sLabelName = "lbl" + sRelDetail.ChangeData.results[l].Attribute;
							 oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}
							 sTextName =sRelDetail.ChangeData.results[l].Attribute;
							if(this.getView().byId(sTextName) !== undefined){
								this.getView().byId(sTextName).addStyleClass(sStyleClass);
							}
						}
						
						//for relationship changes
						for ( l=0; l<aRelDetails.results[i].ChangeData.results.length; l++)
						{
							sLabelName = "lbl" + aRelDetails.results[i].ChangeData.results[l].Attribute;
							oLblIns = this.getView().byId(sLabelName);
							if(oLblIns !== undefined){
								oLblIns.setDesign("Bold");
							}
							sTextName =aRelDetails.results[i].ChangeData.results[l].Attribute;
							if(this.getView().byId(sTextName) !== undefined){
								this.getView().byId(sTextName).addStyleClass(sStyleClass);
							}
						}
					}
				}
//				//set header description
				var relHeader = "";
                if(vChangeKey === "BP_ContactPerson")
                {
                    relHeader =this.getView().getModel("i18n").getProperty("ContactPersonText")+": "+sRelDetail.PARTNER2__TXT+ ", " + this.getView().getModel("i18n").getProperty("RelDetails")+": "+vCategoryTxt +"("
                    +sRelDetail.RELATIONSHIPCATEGORY+")";
                }
                else{
                	var partnerCode = isNaN(parseInt(sRelDetail.PARTNER2)) ? sRelDetail.PARTNER2 : parseInt(sRelDetail.PARTNER2);
	                relHeader = this.getView().getModel("i18n").getProperty("RelDetails")+": "+vCategoryTxt+"("
	                +sRelDetail.RELATIONSHIPCATEGORY+")"+", "+ this.getView().getModel("i18n").getProperty("ContactPersonText")+": "+sRelDetail.PARTNER2__TXT+
	                "("+partnerCode+")";
                }


				var vHeader = this.getView().byId("relDetailHeader");	
				vHeader.setTitle(relHeader);
                //set object description
				var relAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
				this.getView().byId("relAttrHeader").setText(relAttribute);
				//address
				if(strResults.results !== undefined && strResults.results.length !== 0)
				{
					oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
					oModel.setData(strResults); 

					var oItemRel = this.getRelTemplate(oModel);

					oItemRel.attachPress({EntityData: this.aRelations,
						EntityName: 'BP_WorkplaceAddress',
						ChangeData: strResults
					},	this.navigatetoWPAddress, ' ');

					oTable = this.getView().byId("wpaddress");
					oTable.setVisible(true);
					oTable.setModel(oModel); 
					oTable.bindItems("/results", oItemRel);
				}
				else
				{
					//hide workplace address table
					oTable = this.getView().byId("wpaddress");
					oTable.setVisible(false);	
				}
			}

			//}
		}
	},
//navigate funciton to workplace address detail from relation view
	navigatetoWPAddress : function(oEvent){
		//iphone issue
		this.bindingContext = oEvent.getSource("listItem").getBindingContext();	
		if (this.bindingContext !== undefined)
		{
			this.sPath = oEvent.getSource("listItem").getBindingContext().sPath; 
		}
		else
		{
			this.bindingContext = oEvent.getParameter("listItem").getBindingContext();
			this.sPath = oEvent.getParameter("listItem").getBindingContext().sPath;
		}
		
		var aPath = "";
		aPath = this.sPath.split("/");

		var aCurrentLine = this.bindingContext.oModel.oData.results[aPath[2]];
		var vAddrnumber = aCurrentLine.ADDRESS_NUMBER; //data.EntityData[sId].ADDRESS_NUMBER;
		var vPartner1 = aCurrentLine.PARTNER1;
        var vPartner2 = aCurrentLine.PARTNER2;
        var vCategory = aCurrentLine.RELATIONSHIPCATEGORY;
        var vEntity = aCurrentLine.Domain;
        
		this.oRouter = fcg.mdg.approvecrv2.DomainSpecParts[vEntity].getRouter();
		// call to router to check the router in component.js routes 
        if(vCategory!== "" && vPartner1!== "" && vPartner2!== "" && vAddrnumber!=="") {
        	this.oRouter.navTo("WPAddressDetail", {
				Category : vCategory,
				Domain : vEntity,
				Partner1 : vPartner1,
				Partner2 : vPartner2,
				Address_number : vAddrnumber
			});
        }
	},
	
	hideSection : function() {
		if(this.getView().byId("DEPARTMENT").getText() === "" && this.getView().byId("FUNCTION").getText() === "" &&
				this.getView().byId("AUTHORITY").getText() === "" && this.getView().byId("VIP").getText() === "" &&
				this.getView().byId("COMMENTS").getText() === "" && this.getView().byId("CPDetails") !== undefined)
		{								
			var vCPDetails = this.getView().byId('CPDetails').getId();
			$('#'+vCPDetails).hide();
		}
	},
	
	isNull:function(value){
	    return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || value === '' || parseInt(value) === 0;
	}

});