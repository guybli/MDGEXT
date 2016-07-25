/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//jQuery.sap.require("fcg.mdg.approvemasterdata.view.Utility");
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.CostCenter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CostCenterCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CostCenterChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");


fcg.mdg.approvecrv2.DomainSpecParts.CostCenter = {
		//Declaring global variables for this class
		oBatchModel : "",
		sServiceURL: "",
		oS3Controller:null,
 
		// Loading the layout by instantiating object fragment
		loadLayout: function(s3Controller){
			//Delete all other object fragments from S3 page before adding cost center fragment 
			s3Controller.getView().byId("page").removeContent(s3Controller.oCustomerDomain);			
			s3Controller.getView().byId("page").removeContent(s3Controller.profitCenterIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.oSupplierDomain);
			s3Controller.getView().byId("page").removeContent(s3Controller.costCenterIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.glAccountIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.oMaterialIconTab);
			
			//Special handling for destroying file upload control
			try{
				sap.ui.getCore().byId("ccFileUpload-1-uploader").destroy();
			}
			catch(err){}
				try{
			sap.ui.getCore().byId("ccFileUpload-uploader").destroy();
			//glFileUpload-uploader
		} catch (err) {}

			this.oS3Controller = s3Controller;
			//Initialize the fragment. If already done, destroy and reinitialize to reset everything(tab selection...etc)
			if (s3Controller.costCenterIconTab === "") {
				s3Controller.costCenterIconTab = sap.ui
				.xmlfragment('fcg.mdg.approvecrv2.frag.CostCenter',s3Controller);
			}
			else
			{
				s3Controller.costCenterIconTab.destroy();
				try{
					s3Controller.profitCenterIconTab.destroy();
					s3Controller.oMaterialIconTab.destroy();
					s3Controller.oCustomerDomain.destroy();
					s3Controller.oSupplierDomain.destroy();
					s3Controller.glAccountIconTab.destroy();
				}catch(err){}
				s3Controller.costCenterIconTab = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CostCenter',s3Controller);
			}
			// Add the initialized fragment to Cost Center
			s3Controller.getView().byId("page").addContent(s3Controller.costCenterIconTab);
			this.oBatchModel = s3Controller.getView().getModel("MDG_FINANCIALS");
			// oData Service for cost center fragment 
			this.sServiceURL = this.oBatchModel.sServiceUrl + "/"; 
			var extQuery = s3Controller.ccHookCustomService(this.sServiceURL);
			if(extQuery !== undefined){
				this.sServiceURL = extQuery;
			}
		},

		// S3 instance instance is used by Detail page to create footer actions using generic methods defined on S3 Controller
		getS3Instance:function(){
			return this.oS3Controller;
		},		

		//Method to create queries and initializes data
		displayData : function(oView, aBatchOperation, vPath, vAction, s3Controller) {
			var oLocalIns = this;
			//var aQuery = [];
			var sQuery = "";
			var sNoOfQueries = "";
			var oInstNoteTab = sap.ui.getCore().byId("costCenterNotes");
			var oInstAttachmentTab = sap.ui.getCore().byId("costCenterAttachments");	
			
			//Code Changed as per the new behavior to handle the notes and attachments 
			s3Controller.setNoteAttachIconTab(oInstNoteTab, oInstAttachmentTab);

			if (vAction === 'CHANGE') {
				// If logical action is CHANGE, get the query from change files
				sQuery = fcg.mdg.approvecrv2.DomainSpecParts.CostCenterChange.getQueries(this.sServiceURL,vPath,s3Controller);
			} 
			else if(vAction === 'CREATE') {
				// If logical action is CREATE, get the query from Create files 
				sQuery = fcg.mdg.approvecrv2.DomainSpecParts.CostCenterCreate.getQueries(this.sServiceURL,vPath,s3Controller);
			}
			// Initialize the model on which the batch will be executed
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
			// Trigger the batch call
			fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel,s3Controller);
			// Get the response from batch call
			var oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData( );
			// Use batch response to create decision buttons on S3 page footer
			
			if (!s3Controller.oApplicationFacade.isMock()){
				if(oResponse[1].headers !== undefined && oResponse[1].headers.usmd1a016 !== undefined){
					s3Controller.setCrLockError(oResponse[1].headers.usmd1a016);
					s3Controller.createDecisionButtons(oResponse[1].data.results, s3Controller, "", true);
				}
				else
				{				
					// Since the decision query is not executed this method is not called
					if (oResponse[1].data !== undefined) 
						s3Controller.createDecisionButtons(oResponse[1].data.results, s3Controller);
					else 
						s3Controller.createDecisionButtons([], s3Controller);
				}
				//Testing the new scenario
				if(oResponse[1].headers !== undefined && oResponse[1].headers.mdg_gw_approve_cr009 !== undefined){
					s3Controller.setCrRejected(oResponse[1].headers.mdg_gw_approve_cr009);
				}
			}
			
			if(oResponse[0] !== undefined && oResponse[0].data !== undefined ){
				if(vAction === 'CREATE') {
					// If logical action is CREATE, initialize a Form
					fcg.mdg.approvecrv2.DomainSpecParts.CostCenterCreate.initialize_Forms(s3Controller);
					// Method to render data on the form
					fcg.mdg.approvecrv2.DomainSpecParts.CostCenterCreate.displayFormData(oResponse[0].data, oLocalIns);
				}
				else if(vAction === 'CHANGE')
				{
					// If logical action is CHANGE, initialize a table
					fcg.mdg.approvecrv2.DomainSpecParts.CostCenterChange.initialize_Tables(s3Controller);
					//  Method to render data on the table
					fcg.mdg.approvecrv2.DomainSpecParts.CostCenterChange.displayTableData(oResponse[0].data,oLocalIns, s3Controller);
				}
			}
			else
			{
				//If no data returned, hide the general section tab
				sap.ui.getCore().byId("costCenterGenTab").setVisible(false);
			}
		}     

};