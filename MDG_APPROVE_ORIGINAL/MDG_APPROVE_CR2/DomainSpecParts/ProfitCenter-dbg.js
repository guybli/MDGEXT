/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenter");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenter = {

		//declare global variables
		oBatchModel : "",
		sPctrServiceUrl: "",
		oS3Controller:null,
 
		// Loading the layout by instantiating object fragment
		loadLayout: function(s3Controller){
			s3Controller.getView().byId("page").removeContent(s3Controller.oCustomerDomain);			
			s3Controller.getView().byId("page").removeContent(s3Controller.costCenterIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.oSupplierDomain);
			s3Controller.getView().byId("page").removeContent(s3Controller.profitCenterIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.glAccountIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.oMaterialIconTab);

			//Special handling for destroying file upload control
			try{
				sap.ui.getCore().byId("pcFileUpload-1-uploader").destroy();
			}
			catch(err){}
			try{
				sap.ui.getCore().byId("pcFileUpload-uploader").destroy();
			}
			catch(err){}

			this.oS3Controller = s3Controller;//if profit center icon tab is not initialized, then load it with the fragment else remove the fragment and initialize again
			if (s3Controller.profitCenterIconTab === "") {
				s3Controller.profitCenterIconTab = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ProfitCenter',s3Controller);
			}
			else
			{
				s3Controller.profitCenterIconTab.destroy();
				try{
					s3Controller.costCenterIconTab.destroy();
					s3Controller.oMaterialIconTab.destroy();
					s3Controller.oCustomerDomain.destroy();
					s3Controller.oSupplierDomain.destroy();
					s3Controller.glAccountIconTab.destroy();
				}catch(err){}				
				s3Controller.profitCenterIconTab = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ProfitCenter',s3Controller);
			}

			s3Controller.getView().byId("page").addContent(s3Controller.profitCenterIconTab);
			this.oBatchModel = s3Controller.getView().getModel("MDG_FINANCIALS");

			this.sPctrServiceUrl = this.oBatchModel.sServiceUrl + "/"; 
			var extQuery = s3Controller.pcHookPCCustomService(this.sPctrServiceUrl);
			if(extQuery !== undefined){
				this.sPctrServiceUrl = extQuery;
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

			var vInstNoteTab = sap.ui.getCore().byId("profitCenterNotes");
			var vInstAttachmentTab = sap.ui.getCore().byId("profitCenterAttachments");
			
			//Code Changed as per the new behavior to handle the notes and attachments 
			s3Controller.setNoteAttachIconTab(vInstNoteTab, vInstAttachmentTab);

			if (vAction === "CHANGE") {//Get query for change scenario
				sQuery = fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange.getQueries(this.sPctrServiceUrl,vPath,s3Controller);
			} 
			else if(vAction === 'CREATE') {//Get query for create scenario
				sQuery = fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterCreate.getQueries(this.sPctrServiceUrl,vPath,s3Controller);
			}

			sQuery = "/" + sQuery;
			fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sQuery, aBatchOperation );		

			var aCrNumDerive = vPath.split("(");
			var aCrNum = aCrNumDerive[1].split(")");

			var url = "Decisions?Crequest="+aCrNum[0];
			var sDecisionQuery =   "/" + url;

			//Add all the queries to the batch Odata call so that data can be fetched at one shot
			if(!s3Controller.oApplicationFacade.isMock()){
				fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oBatchModel, sDecisionQuery, aBatchOperation );}	

			fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oBatchModel,s3Controller);
			var oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData( );
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

				if(vAction === 'CREATE') { //for create scenario, form should be displayed 
					fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterCreate.initialize_Forms(this.oS3Controller);
					fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterCreate.displayFormData(oResponse[0].data, oLocalIns, s3Controller);
				}
				else if(vAction === 'CHANGE') //for change scenario(including change and addition), table should be rendered
				{
					fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange.initialize_Tables(this.oS3Controller);
					fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange.displayTableData(oResponse[0].data, oLocalIns, s3Controller);
				}
			}
			else{
				sap.ui.getCore().byId("profitCenterGenTab").setVisible(false);
			}
		},


		//Hiding section if there are no values present in the field present in this section
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
		}
};