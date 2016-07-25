/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccount");


sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.GLDetail", {
	aDetailData:"",
	commHeaderIndex:"",
	oAddTitle:"",
	oGLAccountDetails:"",
	extHookModifyDetailFormData:null,
	extHookDetailDescTemplate:null,
	extHookHideDetailAddressSection:null,
	extHookHideDetailCommSection:null,
	extHookModifyStyleClass:null,
	extHookDetDescriptionTable:null,
	extHookglHookgetDescTemplate: null,
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
	
	
	onInit: function() {
		// Execute onInit of base class.
	//sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);

		// Setting the navigate back visible true for moving back to S3 controller.
		this.getView().byId("GLDetail").setShowNavButton(true);

		// Get DataManager instance.
		this.oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "glItemDetail") {
			
				var aResult = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oGLAData;
				var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.getS3Instance();
                var aDecisions = oS3Instance.getDecisions();
				oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
		    	this.displayChangedGenData(aResult);
				fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange.setBoldGenData(aResult);
				// Get the CHANGE data and ACTIVE data that should be shown on Detail screen
			}
		}, this);

	},
	
	displayChangedGenData : function(aResult){
	    
	  			var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.getS3Instance();
     	    	if(oS3Instance.oGlAccountGenForm === ""){
					oS3Instance.oGlAccountGenForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccountCreate', fcg.mdg.approvecrv2.util.Formatter);
				}
				else{
					// If already defined, remove it from detail page and instantiate it again
					this.getView().byId("GLDetail").removeContent(oS3Instance.oGlAccountGenForm);
					if(oS3Instance.oGlAccountGenForm !== undefined){
						oS3Instance.oGlAccountGenForm.destroy();
					}
		            oS3Instance.oGlAccountGenForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccountCreate', fcg.mdg.approvecrv2.util.Formatter);
				}
				
	    
	     this.getView().byId("GLDetail").addContent(oS3Instance.oGlAccountGenForm);
	     
	     var oChangeGenModel = new sap.ui.model.json.JSONModel();
	     oChangeGenModel.setData(aResult);
		 sap.ui.getCore().byId("glCreateMainDataForm").setModel(oChangeGenModel);
	
		 if(aResult.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results.length > 0){
		        
            	var oTable = sap.ui.getCore().byId("glDescTab");
				this.setStyleForChangedTable(aResult, oTable);
		        
            }
            else{
                	sap.ui.getCore().byId('glDescTab').destroy();
            }

		 
		 
		  if(aResult.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results.length > 0){
		   
            	fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.getGenAttachmentList(aResult);
    
		  }    
            else{
            	sap.ui.getCore().byId('glAttachFileList').destroy();
            }
		 
		 fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.hideSection();
		 this.setHeader();

		
	},
	
	//Description change table
	setStyleForChangedTable:function(aResult, oTable){
		if(aResult.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results.length > 0){
			var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
			//var vdelFlag = false;
			
			/*for(var i = 0; i < aResult.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].length; i++){
				if(aResult.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData !== undefined){
					for(var j = 0; j < aResult.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results.length; j++ ){
						if(aResult.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results[i].ChangeData.results[j].EntityAction === 'D')
						  vdelFlag = true;
						  break;
					}
				}
				break;
			}*/
			  
			
			oModel.setData(aResult.ACCOUNT.ACCOUNT2DTxtACCOUNTRel); 
			oTable.setVisible(true);
			oTable.setModel(oModel); 
			var oItemDescTemp = this.getDescTemplate(oModel);
			oTable.bindItems("/results", oItemDescTemp);
		}
	},
	
	getDescTemplate: function(oModel){
		var oItemDescTemp = new sap.m.ColumnListItem({
			cells: [	      
			        new sap.m.Text({
			        	text:{
			        		path:"LANGU__TXT",
			        		formatter: function() {
			        			var desc = oModel.getProperty("LANGU__TXT", this.getBindingContext());
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "LANGU" );
			        			return fcg.mdg.approvecrv2.util.Formatter.noValue(desc);
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
			        		path:"TXTLG",
			        		formatter: function(){
			        			fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TXTLG" );
			        			return fcg.mdg.approvecrv2.util.Formatter.noValue(oModel.getProperty('TXTLG', this.getBindingContext()));
			        		}			        		
			        	}
			        })
			    ]
		});  
	
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.GLDetail~extHookglHookgetDescTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookglHookgetDescTemplate) {
			var extModifiedData = this.extHookglHookgetDescTemplate(oItemDescTemp);
			oItemDescTemp = extModifiedData;
		}
    	return oItemDescTemp;		
	},


	setHeader : function(){
	   	var glMainAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
		this.getView().byId("glObjHeaderDetS3").setTitle(glMainAttribute);

		var oEditionDataDet = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oGLAData.Edition;
		var glvalDet = fcg.mdg.approvecrv2.util.Formatter.validityFormatter(oEditionDataDet.UsmdVdateFrom, oEditionDataDet.UsmdVdateTo);

		this.getView().byId("glValDetS3").setText(glvalDet);
	}
});