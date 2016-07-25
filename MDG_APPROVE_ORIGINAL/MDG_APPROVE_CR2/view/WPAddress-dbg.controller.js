/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//Workplace address controller for create and change of relation and contact person
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("sap.fcg.mdg.lib.address.util.AddressLib");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Supplier");

sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.WPAddress", {
	extHookModifyWPAddressDetailFormData:null,
	extHookModifyWPAddressStyleClass:null,
	vsimpleform:"",
	vDomain:"",
	onInit: function(){
		// Setting the navigate back visible true for moving back to S3 controller		
		this.getView().byId("WPAddressPage").setShowNavButton(true);
		this.oRouter.attachRouteMatched(function(oEvent) {

			if (oEvent.getParameter("name") === "WPAddressDetail") {
				//Reset Form Bold
				this.vDomain = oEvent.getParameter('arguments').Domain;
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts[this.vDomain].getS3Instance();
				
				var aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
				
				fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());

				var args = oEvent.getParameter("arguments");
//				var aRelDetails = fcg.mdg.approvecrv2.DomainSpecParts[this.vDomain].oRelData[0].data.BP_Root.BP_RelationsRel;
				var aRelDetails = fcg.mdg.approvecrv2.DomainSpecParts[this.vDomain].oRelData.BP_Root.BP_RelationsRel;
				//Display WP address Data with parameters
				this.displayWPAddressData(aRelDetails,args);
				this.getView().rerender(); 
			}
		}, this);

	},
//	Navigate back to contact person screen
	PressBack: function(){
		var vElement = this.getView().byId("SimpleFormWPAddress");				
		vElement.destroyContent();
	},
	
	//To initialize view so that hidden attributes are not shown on the UI
	onAfterRendering:function(){
		this.hideSection();
	},
	
//	Prepare data for workplace address
	displayWPAddressData: function(aRelDetails, args){
		var vAddrnumber = args.Address_number;
		var vCat = args.Category;
		var vPartner1 = args.Partner1;
		var vPartner2 = isNaN(parseInt(args.Partner2)) ? args.Partner2 : parseInt(args.Partner2); 
		for(var i=0; i<aRelDetails.results.length; i++)
		{

			if(aRelDetails.results[i].BP_RelationContactPersonRel !== null)
			{
				for(var j=0;j<aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results.length;j++)
				{
					var addResult = aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j];
					var vAdd_no = addResult.ADDRESS_NUMBER;
					var vPart1 = addResult.PARTNER1;
					var vPart2 = isNaN(parseInt(addResult.PARTNER2)) ? addResult.PARTNER2 : parseInt(addResult.PARTNER2);
					var vCategory = addResult.RELATIONSHIPCATEGORY;
					if( vPart1 === vPartner1 && vPart2 === vPartner2 && vCategory === vCat && vAdd_no === vAddrnumber)
					{
						var sRelDetail = "";
						var oModel = "";
						var oTable = "";
						var strResults = "";
						var k = "";
						var oItemMobile = "";

						sRelDetail = aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j];
						//contact person
						/**
						 * @ControllerHook To modify the data of the form if it is not done via direct binding
						 * Customer can modify the data as per his requirements before binding it to a form
						 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyWPAddressDetailFormData
						 * @param {object} detailData Holds data
						 * @return {object} detailData Modified Data
						 */
						if(this.extHookModifyWPAddressDetailFormData){
							var extModifiedData = this.extHookModifyWPAddressDetailFormData(sRelDetail);
							if(extModifiedData !== undefined){
								sRelDetail = extModifiedData;
							}
						}

						oModel = new sap.ui.model.json.JSONModel();        //Create a model and set the result data in it
						oModel.setData(sRelDetail);
						var vElement = this.getView().byId("SimpleFormWPAddress");
						vElement.setModel(oModel); 

						//Bolding of the changed Data
						if (sRelDetail.ChangeData.results !== undefined )
						{
							if (sRelDetail.ChangeData.results.length > 0)
							{
								var  sStyleClass = "text_bold";
								/**
								 * @ControllerHook To modify the style class
								 * Customer can modify the style class to influence text fields
								 * the format of data shown in this description table									 
								 * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookModifyWPAddressStyleClass
								 * @param {string} sStyleClass style class
								 * @return {string} sStyleClass modified style class
								 */
								if(this.extHookModifyWPAddressStyleClass)
								{
									var sNewStyleClass = this.extHookModifyWPAddressStyleClass(sStyleClass); //HOOK METHOD FOR Key Search
									if(sNewStyleClass !== undefined){
										sStyleClass = sNewStyleClass;
									}
								}
								for (var l=0; l<sRelDetail.ChangeData.results.length; l++)
								{
									var sLabelName = "lbl" + sRelDetail.ChangeData.results[l].Attribute;
									var oLblIns = this.getView().byId(sLabelName);
									if(oLblIns !== undefined){
										oLblIns.setDesign("Bold");
									}
									var sTextName =sRelDetail.ChangeData.results[l].Attribute;
									if(this.getView().byId(sTextName) !== undefined){
										this.getView().byId(sTextName).addStyleClass(sStyleClass);
									}
								}
							}
						}

						//Header description
						var vpart2 = sRelDetail.PARTNER2.replace(/^0+/, "");//remove zeroes
						var relHeader = this.getView().getModel("i18n").getProperty("WorkPlaceAddress")+":"+sRelDetail.ADDRESS_NUMBER__TXT;
						var relHeaderParent =	this.getView().getModel("i18n").getProperty("ContactPersonText")+":"+aRelDetails.results[i].PARTNER2__TXT+ "," + this.getView().getModel("i18n").getProperty("RelDetails")+":"+sRelDetail.RELATIONSHIPCATEGORY__TXT+"("
						+sRelDetail.RELATIONSHIPCATEGORY+")";
						
                        this.getView().byId("wpAttrHeader").setText(relHeaderParent);
						var vHeader = this.getView().byId("wpDetailHeader");	
						vHeader.setTitle(relHeader);

						var relAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
						this.getView().byId("wpAttrHeaderParent").setText(relAttribute);
						//wpaddress email BP_WorkplaceCommEMailsRel
						if(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results !== undefined && 
								aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results.length !== 0)
						{
							strResults = {results:[]};
							for(k=0;k<aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results.length;k++)
							{
								strResults.results.push(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommEMailsRel.results[k]);
							}
							//Prepare for Email Address
							if(strResults.results.length !== 0){
								oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
								oModel.setData(strResults); 
								oTable = this.getView().byId("WPEMailAddresses");
								oTable.setVisible(true);
								oTable.setModel(oModel); 
								//this.oItemWorkplace.attachPress({EntityName: 'BP_WorkplaceAddress'},this.handles5);
								var oItemAddress = this.getEMailTemplate(oModel);
								oTable.bindItems("/results", oItemAddress );
							}else{
								//hide email address if initial
								oTable = this.getView().byId("WPEMailAddresses");
								oTable.setVisible(false);
							}
						}
						else{
							//hide email address if initial
							oTable = this.getView().byId("WPEMailAddresses");
							oTable.setVisible(false);
						}

						//wpaddress telephone
						if(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results !== undefined && 
								aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results.length !== 0)
						{
							strResults = {results:[]};
							for(k=0;k<aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results.length;k++)
							{
								if(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results[k].TELEPHONE !== "")
									strResults.results.push(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommPhonesRel.results[k]);
							}
							if(strResults.results.length !== 0){
								oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
								oModel.setData(strResults); 
								oTable = this.getView().byId("WPTelephoneNumbers");
								oTable.setVisible(true);
								oTable.setModel(oModel); 
								//this.oItemWorkplace.attachPress({EntityName: 'BP_WorkplaceAddress'},this.handles5);
								var oItemTel = this.getTelTemplate(oModel);
								oTable.bindItems("/results", oItemTel);
							}else{
								//hide telephone table
								oTable = this.getView().byId("WPTelephoneNumbers");
								oTable.setVisible(false);
							}
						}
						else{
							//hide telephone table
							oTable = this.getView().byId("WPTelephoneNumbers");
							oTable.setVisible(false);
						}	
						//wpaddress fax
						if(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results !== undefined && 
								aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results.length !== 0)
						{
							strResults = {results:[]};
							for(k=0;k<aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results.length;k++)
							{
								if(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results[k].FAX !== "")
									strResults.results.push(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommFaxesRel.results[k]);
							}
							if(strResults.results.length !== 0){
								oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
								oModel.setData(strResults); 
								oTable = this.getView().byId("WPFaxNumbers");
								oTable.setVisible(true);
								oTable.setModel(oModel); 
								//this.oItemWorkplace.attachPress({EntityName: 'BP_WorkplaceAddress'},this.handles5);
								var oItemFax = this.getFaxTemplate(oModel);
								oTable.bindItems("/results", oItemFax);
							}
							else{
								oTable = this.getView().byId("WPFaxNumbers");
								oTable.setVisible(false);
							}
						}
						else{
							oTable = this.getView().byId("WPFaxNumbers");
							oTable.setVisible(false);
						}

						//wpaddress mobiles
						if(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results !== undefined && 
								aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results.length !== 0)
						{
							strResults = {results:[]};
							for(k=0;k<aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results.length;k++)
							{
								if(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results[k].TELEPHONE !== "")
									strResults.results.push(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommMobilesRel.results[k]);
							}
							if(strResults.results.length !== 0){
								oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
								oModel.setData(strResults); 
								oTable = this.getView().byId("WPMobileNumbers");
								oTable.setVisible(true);
								oTable.setModel(oModel); 
								//this.oItemWorkplace.attachPress({EntityName: 'BP_WorkplaceAddress'},this.handles5);
								oItemMobile = this.getMobileTemplate(oModel);
								oTable.bindItems("/results", oItemMobile);
							}
							else{
								oTable = this.getView().byId("WPMobileNumbers");
								oTable.setVisible(false);
							}
						}
						else{
							oTable = this.getView().byId("WPMobileNumbers");
							oTable.setVisible(false);
						}

						//wpaddress uris
						if(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results !== undefined && 
								aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results.length !== 0)
						{
							strResults = {results:[]};
							for(k=0;k<aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results.length;k++)
							{
								if(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results[k].URI !== "")
									strResults.results.push(aRelDetails.results[i].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[j].BP_WorkplaceCommURIsRel.results[k]);
							}
							oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
							oModel.setData(strResults); 
							oTable = this.getView().byId("WPURL");
							oTable.setVisible(true);
							oTable.setModel(oModel); 
							//this.oItemWorkplace.attachPress({EntityName: 'BP_WorkplaceAddress'},this.handles5);
							oItemMobile = this.getURLTemplate(oModel);
							oTable.bindItems("/results", oItemMobile);
						}
						else{
							oTable = this.getView().byId("WPURL");
							oTable.setVisible(false);
						}

					}
				}
			}
		}

	},

	getTelTemplate: function(oModel){
		var oThis = this;
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
			        new sap.m.Text({
			        	text:{
			        		path:"COUNTRY__TXT",
			        		formatter: function(){
			        			var desc = oModel.getProperty("COUNTRY__TXT", this.getBindingContext());
			        			var key = oModel.getProperty("COUNTRY", this.getBindingContext());			        			
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "COUNTRY" );
			        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);			        			
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text: {
			        		path: "TELEPHONE",
			        		formatter: function(){
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TELEPHONE" );
			        			return oModel.getProperty('TELEPHONE', this.getBindingContext());
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text: {
			        		path: "EXTENSION",
			        		formatter: function(){
			        			var extension = oModel.getProperty('EXTENSION', this.getBindingContext());
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "EXTENSION" );
			        			if(oThis.isNull(extension))
			        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
			        			return extension;
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text:{
			        		path:"STD_NO",
			        		formatter: function(){
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STD_NO" );
			        			var vStandard = oModel.getProperty("STD_NO", this.getBindingContext());
			        			if(vStandard ===  "X")
			        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
			        			else
			        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
			        			return vStandard;	        
			        		}
			        	}
			        })                        
			        ]});

		return oItemTemp;		
	},
	getFaxTemplate: function(oModel){
		var oThis = this;
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
			        new sap.m.Text({
			        	text:{
			        		path:"COUNTRY__TXT",
			        		formatter: function(){
			        			var desc = oModel.getProperty("COUNTRY__TXT", this.getBindingContext());
			        			var key = oModel.getProperty("COUNTRY", this.getBindingContext());			        			
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "COUNTRY" );
			        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);			        			
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text: {
			        		path: "FAX",
			        		formatter: function(){			        			
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "FAX" );
			        			return oModel.getProperty('FAX', this.getBindingContext());			        			
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text: {
			        		path: "EXTENSION",
			        		formatter: function(){
			        			var extension = oModel.getProperty('EXTENSION', this.getBindingContext());
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "EXTENSION" );
			        			if(oThis.isNull(extension))
			        				return fcg.mdg.approvecrv2.util.Formatter.noValue("");
			        			return extension;
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text:{
			        		path:"STD_NO",
			        		formatter: function(){
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STD_NO" );
			        			var vStandard = oModel.getProperty("STD_NO", this.getBindingContext());
			        			if(vStandard ===  "X")
			        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
			        			else
			        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
			        			return vStandard;	        
			        		}
			        	}
			        })                      
			        ]});

		return oItemTemp;		
	},
	getMobileTemplate: function(oModel){
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
			        new sap.m.Text({
			        	text:{
			        		path:"COUNTRY__TXT",
			        		formatter: function(){
			        			var desc = oModel.getProperty("COUNTRY__TXT", this.getBindingContext());
			        			var key = oModel.getProperty("COUNTRY", this.getBindingContext());			        			
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "COUNTRY" );
			        			return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);			        			
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text: {
			        		path: "TELEPHONE",
			        		formatter: function(){
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TELEPHONE" );
			        			return oModel.getProperty('TELEPHONE', this.getBindingContext());
			        		}			        		
			        	}
			        }),

			        new sap.m.Text({
			        	text:{
			        		path:"STD_NO",
			        		formatter: function(){
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STD_NO" );
			        			var vStandard = oModel.getProperty("STD_NO", this.getBindingContext());
			        			if(vStandard ===  "X")
			        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
			        			else
			        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
			        			return vStandard;	        
			        		}
			        	}
			        })                        
			        ]});

		return oItemTemp;		
	},
	getEMailTemplate: function(oModel){
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
			        new sap.m.Text({
			        	text:{
			        		path:"E_MAIL",
			        		formatter: function(){			        			
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "E_MAIL" );
			        			return oModel.getProperty('E_MAIL', this.getBindingContext());			        			
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({			        	
			        	text:{
			        		path:"STD_NO",
			        		formatter: function(){
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STD_NO" );
			        			var vStandard = oModel.getProperty("STD_NO", this.getBindingContext());
			        			if(vStandard ===  "X")
			        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
			        			else
			        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
			        			return vStandard;	        
			        		}
			        	}
			        })                      
			        ]});

		return oItemTemp;		
	},	

	getURLTemplate: function(oModel){
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
			        new sap.m.Text({
			        	text:{
			        		path:"URI",
			        		formatter: function(){			        			
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "URI" );
			        			return oModel.getProperty('URI', this.getBindingContext());
			        		}
			        	}
			        }),
			        new sap.m.Text({			        	
			        	text:{
			        		path:"STD_NO",
			        		formatter: function(){
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "STD_NO" );
			        			var vStandard = oModel.getProperty("STD_NO", this.getBindingContext());
			        			if(vStandard ===  "X")
			        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_YES');
			        			else
			        				vStandard = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PC_NO');
			        			return vStandard;                                                                           
			        		}
			        	}
			        })                        
			        ]			
		});
		return oItemTemp;
	},


	checkBox:function(sValue){
		var newVal = "";
		if(sValue === "X")
			newVal = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_CHECK_BOX_SET");
		else
			newVal = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_CHECK_BOX_RESET");
		return newVal;
	},
	
	hideSection : function() {
		
		if(this.getView().byId("FUNCTION").getText() === "" && this.getView().byId("DEPARTMENT").getText() === "" &&
				this.getView().byId("ROOM_NO").getText() === "" && this.getView().byId("FLOOR").getText() === "" &&
				this.getView().byId("BUILDING_P").getText() === "")
		{								
			var workPPDet = this.getView().byId('wppersondetails').getId();
			$('#'+workPPDet).hide();
		}
		
		if(this.getView().byId("COMM_TYPE").getText() === "" && this.getView().byId("wppercomm") !== undefined)
		{								
			var workPComm = this.getView().byId('wppercomm').getId();
			$('#'+workPComm).hide();
		}
		
		if(this.getView().byId("FUNCTION").getText() === "" && this.getView().byId("DEPARTMENT").getText() === "" &&
				this.getView().byId("ROOM_NO").getText() === "" && this.getView().byId("FLOOR").getText() === "" &&
				this.getView().byId("BUILDING_P").getText() === "" && this.getView().byId("COMM_TYPE").getText() === "" &&
				this.getView().byId("SimpleFormWPAddress") !== undefined)
		{								
			var SimpleFormWPAddress = this.getView().byId('SimpleFormWPAddress').getId();
			$('#'+SimpleFormWPAddress).hide();
		}
	},
	
	isNull:function(value){
	    return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || value === '' || parseInt(value) === 0;
	}
});