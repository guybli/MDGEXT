/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.GLAccount");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");


fcg.mdg.approvecrv2.DomainSpecParts.GLAccount = {
		//Declaring global variables for this class
		oBatchModel : "",
		oGLModel : "",
		sServiceURL: "",
		oS3Controller:null,
		oGLAData : "",
		oGLCCData : "",
		oVAction : "",
		oCCData : "",
		oCEData : "",
		

		// Loading the layout by instantiating object fragment
		loadLayout: function(s3Controller){
			//Delete all other object fragments from S3 page before adding gl fragment 
			s3Controller.getView().byId("page").removeContent(s3Controller.oCustomerDomain);			
			s3Controller.getView().byId("page").removeContent(s3Controller.profitCenterIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.oSupplierDomain);
			s3Controller.getView().byId("page").removeContent(s3Controller.costCenterIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.glAccountIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.oMaterialIconTab);
		
		    this.oGLModel = s3Controller.getView().getModel("MDG_GL_ACCOUNT");

			try{
			    sap.ui.getCore().byId("glFileUpload-1-uploader").destroy();
				//glFileUpload-uploader
			}
			catch(err){}
			try{
				sap.ui.getCore().byId("glFileUpload-uploader").destroy();
				//glFileUpload-uploader
	    	}
           catch(err){}
			this.oS3Controller = s3Controller;
			//Initialize the fragment. If already done, destroy and reinitialize to reset everything(tab selection...etc)
			if (s3Controller.glAccountIconTab === "") {
				s3Controller.glAccountIconTab = sap.ui
				.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccount',s3Controller);
			}
			else
			{
				s3Controller.glAccountIconTab.destroy();
				
				try{
					s3Controller.profitCenterIconTab.destroy();
				}catch(err){}
				
				try{
				    s3Controller.costCenterIconTab.destroy();
				}catch(err){}
				
				try{
				    s3Controller.oMaterialIconTab.destroy();
				}catch(err){}
				try{
				    s3Controller.oCustomerDomain.destroy();
				}catch(err){}
				try{
				    s3Controller.oSupplierDomain.destroy();
				}catch(err){}
				
				s3Controller.glAccountIconTab = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccount',s3Controller);
			}
			// Add the initialized fragment to Cost Center
			s3Controller.getView().byId("page").addContent(s3Controller.glAccountIconTab);
			this.oBatchModel = s3Controller.getView().getModel("MDG_GL_ACCOUNT");
			// oData Service for cost center fragment 
			this.sServiceURL = this.oBatchModel.sServiceUrl + "/"; 
		
		},

		// S3 instance instance is used by Detail page to create footer actions using generic methods defined on S3 Controller
		getS3Instance:function(){
			return this.oS3Controller;
		},	
		
		displayCCData : function(oView, aBatchOperation, vPath, vAction, s3Controller){
		   var oLocalIns = this;
		   var globalCCinst;
		   this.oVAction = vAction;
		   var sQuery = "";
		   if(this.oCCData === ""){
		   if(vAction === 'CREATE'){
		       sQuery = fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.getCCQuery(this.sServiceURL,vPath,s3Controller);
		       	globalCCinst = this;
					this.oGLModel.read(
					    sQuery, 
						null, 
						null, 
						true, 
						function(result){
						    globalCCinst.oCCData = result;	
							fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.displayCCData(result, s3Controller);
							s3Controller.glHookModifyCompCodeCreateData(s3Controller,result);
							//this.oS3Controller.glHookModifyCompCodeCreateData(s3Controller,oResponse);
						}
					);
		   }
		   else if(vAction === 'CHANGE'){
		       sQuery = fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange.getCCQuery(this.sServiceURL,vPath,s3Controller);
		       	globalCCinst = this;
					this.oGLModel.read(
					    sQuery, 
						null, 
						null, 
						true, 
						function(result){
						    globalCCinst.oCCData = result;	
							fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange.displayCCChangeData(result, s3Controller);
							s3Controller.glHookModifyCompCodeChangeData(s3Controller,result);
						}
					);
		   }
		   }
		    
		},
		
		displayCEData : function(oView, aBatchOperation, vPath, vAction, s3Controller){
		    var oLocalIns = this;
		    var globalCEinst;
			this.oVAction = vAction;
			var sQuery = "";
			if(this.oCEData === ""){
		    if(vAction === 'CREATE'){
		       sQuery = fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.getCEQuery(this.sServiceURL,vPath,s3Controller);
		       	globalCEinst = this;
					this.oGLModel.read(
					    sQuery, 
						null, 
						null, 
						true, 
						function(result){
						    globalCEinst.oCEData = result;	
							fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.displayCEData(result, s3Controller);
							s3Controller.glHookModifyCECreateData(s3Controller,result);
						}
					);
		   }
		   else if(vAction === 'CHANGE'){
		       sQuery = fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange.getCEQuery(this.sServiceURL,vPath,s3Controller);
		       	globalCEinst = this;
					this.oGLModel.read(
					    sQuery, 
						null, 
						null, 
						true, 
						function(result){
						    globalCEinst.oCEData = result;	
							fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange.displayCEChangeData(result, s3Controller);
							s3Controller.glHookModifyCEChangeData(s3Controller,result);
						}
					);
		   }
			}
		},
		

		//Method to create queries and initializes data
		displayData : function(oView, aBatchOperation, vPath, vAction, s3Controller) {
			var oLocalIns = this;
			this.oVAction = vAction;

			var sQuery = "";
			var oInstNoteTab = sap.ui.getCore().byId("glAccountNotes");
		    var oInstAttachmentTab = sap.ui.getCore().byId("glAccountAttachments");	

			if (vAction === 'CHANGE') {
				// If logical action is CHANGE, get the query from change files
				sQuery = fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange.getGenQuery(this.sServiceURL,vPath,s3Controller);
			} 
			else if(vAction === 'CREATE') {
				// If logical action is CREATE, get the query from Create files 
				sQuery = fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.getGenQuery(this.sServiceURL,vPath,s3Controller);
			}
		
			// Add queries to batch calls via a utility method

			sQuery = "/" + sQuery;
			
			fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation );		

			// Derive change request number from context path coming from S3 view
			var aCrNumDerive = vPath.split("(");
			var aCrNum = aCrNumDerive[1].split(")");
			// Form decision, attachment and notes URLs and add them to batch call
			var url = "Decisions?Crequest="+ aCrNum[0];
			var sDecisionQuery = "/" +  url;
		
			if (!s3Controller.oApplicationFacade.isMock()){
				fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sDecisionQuery, aBatchOperation );	
			}
		
			fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel, s3Controller);
			// Get the response from batch call
			var oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData( );
			// Use batch response to create decision buttons on S3 page footer
			
			if (!s3Controller.oApplicationFacade.isMock()) {
				if(oResponse[1].headers !== undefined && oResponse[1].headers.usmd1a016 !== undefined){
					s3Controller.setCrLockError(oResponse[1].headers.usmd1a016);
					s3Controller.createDecisionButtons(oResponse[1].data.results, s3Controller, "", true);
				}
				else
				{				
				    if(oResponse[1].data !== undefined)
				    	s3Controller.createDecisionButtons(oResponse[1].data.results, s3Controller);
				    else
				        s3Controller.createDecisionButtons([], s3Controller);
				}
			}
			//Testing the new scenario
			if(oResponse[1].headers !== undefined && oResponse[1].headers.mdg_gw_approve_cr009 !== undefined){
				s3Controller.setCrRejected(oResponse[1].headers.mdg_gw_approve_cr009);
			}

			//Code Changed as per the new behavior to handle the notes and attachments 
			s3Controller.setNoteAttachIconTab(oInstNoteTab, oInstAttachmentTab);
	
			this.oGLAData = oResponse[0].data;
				if(oResponse[0] !== undefined && oResponse[0].data !== undefined){
				
					if(vAction === 'CREATE') {
						// If logical action is CREATE, initialize a Form
						fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.initialize_Forms(s3Controller);
						// Method to render data on the form
						fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.displayGenData(oResponse[0].data, s3Controller);
						s3Controller.glHookModifyAccCreateData(s3Controller, oResponse);
					}
					else if(vAction === 'CHANGE')
					{
						// If logical action is CHANGE, initialize a table
						fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange.initialize_Tables(s3Controller);
						//  Method to render data on the table
						fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange.displayGenChangeData(oResponse[0].data, s3Controller);
						s3Controller.glHookModifyAccChangeData(s3Controller, oResponse);
					}
				}
				else
				{
					//If no data returned, hide the general section tab
					sap.ui.getCore().byId("glAccountrGenTab").setVisible(false);
				}
},
	ResetGLABufferedBatchData: function(){
			//This method is to just clear the buffered data
			//Caller: S3
			//No other code to be added here except clearing related statements.
			this.oGLAData = "";
			this.oCCData = "";
			this.oCEData = "";
		}
};