/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Customer");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CustomerDelete");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPChange");

fcg.mdg.approvecrv2.DomainSpecParts.Customer = {
		oCommunicationTable:"",
		oFormCommunication:"",
		oBankTable:"",
		oFormBank:"",
		oCompcodeTable:"",
		oFormCompcode:"",
		oSalesTable:"",
		oFormSales:"",
		oCustomerDomain:"",
		caIconTab:"",
		vModel:"",
		oModel:"",
		oPath:"",
		oEntity:"",
		oCreate:"",
		aBatchOperation:[],
		oBatchModel:"",
		sContextPath:"",
		oFormTax:"",
		oFormIndustry:"",
		oFormIdentification:"",
		oFormAddress:"",
		sModel:"",
		oCustomerModel:"",
		_dataOnNav:"",
		oGeneralData:"",
		oCompanyCodeData:"",
		oObsoleteDataCustGen:"",
		oObsoleteDataCustCC:"",
		oObsoleteDataCustSale:"",
		oRelData:"",
		oSalesData:"",
		queryString:"",
		oS3Controller:"",
		vCrequest:"",
		vShowDeletions:"",
		oOtc: "",

		LoadLayout: function(vPath,vModel,vAction,vOTC,s3Controller){
			//this.queryString = "/sap/opu/odata/sap/MDG_CUSTOMER_GENIL_SRV/";
			this.oOtc=vOTC;

			this.oCustomerModel = s3Controller.getView().getModel("MDG_CUSTOMER");
			//new sap.ui.model.odata.ODataModel(this.queryString);
			this.oS3Controller = s3Controller;
			if(s3Controller.oCustomerDomain === "")
				s3Controller.oCustomerDomain = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Customer',s3Controller);
			var oCustomerTabBar = sap.ui.getCore().byId("CustomerTabBar");
			var oGeneralTab = sap.ui.getCore().byId("CGeneralDataSection");
			oCustomerTabBar.setSelectedItem(oGeneralTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.oMaterialIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.accountIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.glAccountIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.costCenterIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.profitCenterIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.oSupplierDomain);

//			try{
//				sap.ui.getCore().byId("Cfileupload-1-uploader").destroy();
//			}
//			catch(err){}

			s3Controller.getView().byId("page").addContent(s3Controller.oCustomerDomain);

			//To remove all the layouts inside the IconTab Filter to avoid retaining of data 
			this.removeCustLayouts();
			//Work around for / in url
			this.queryString = "/" + this.oCustomerModel.sServiceUrl + "/";
//			this.vShowDeletions = "X";
			var extQuery = s3Controller.custHookCustomService(s3Controller,this.queryString);
			if(extQuery !== undefined){
				this.queryString = extQuery;
			}
			//this.queryString;
		},

		removeCustLayouts:function(s3Controller){
			//General Data
			try {
				sap.ui.getCore().byId("CGeneral").removeAllContent();
				sap.ui.getCore().byId("CRoles").removeAllContent();
				sap.ui.getCore().byId("CBank").removeAllContent();
				sap.ui.getCore().byId("CTax").removeAllContent();
				sap.ui.getCore().byId("CIdentification").removeAllContent();
				sap.ui.getCore().byId("CIndustries").removeAllContent();
				sap.ui.getCore().byId("CErpCustomer").removeAllContent();
				sap.ui.getCore().byId("CAddress").removeAllContent();
				sap.ui.getCore().byId("CAddressUsages").removeAllContent();

				sap.ui.getCore().byId("CGeneral").setVisible(false);
				sap.ui.getCore().byId("CRoles").setVisible(false);
				sap.ui.getCore().byId("CBank").setVisible(false);
				sap.ui.getCore().byId("CTax").setVisible(false);
				sap.ui.getCore().byId("CIdentification").setVisible(false);
				sap.ui.getCore().byId("CIndustries").setVisible(false);
				sap.ui.getCore().byId("CErpCustomer").setVisible(false);
				sap.ui.getCore().byId("CAddress").setVisible(false);
				sap.ui.getCore().byId("CAddressUsages").setVisible(false);

				s3Controller.custHookremovelayout();
			} catch (e) {

			}
		},

		getGeneralData: function(vPath, vAction,vOTC,s3Controller){	
			this.oOtc=vOTC;
			var vInstNoteTab = sap.ui.getCore().byId("CNotes");
			var vInstAttachmentTab = sap.ui.getCore().byId("CAttachmentCustomer");
			var aCrNumDerive = vPath.split("(");
			var aCrNum = aCrNumDerive[1].split(")");
			this.vCrequest = aCrNum[0];
			var url = "Decisions?Crequest="+aCrNum[0];
			var sDecisionQuery = this.queryString + url;
			var vCompletePath = "";
			var aBatchOperation = "";
			var oResponse = "";
			if (!s3Controller.oApplicationFacade.isMock())
			{
				vPath = this.queryString + vPath + '/?$expand=';
			}
			else
			{
				vPath = vPath + '/?$expand=';
			}			
			//Code Changed as per the new behavior to handle the notes and attachments 
			s3Controller.setNoteAttachIconTab(vInstNoteTab, vInstAttachmentTab);
			
			if(vAction === 'CHANGE')//Change
			{
				vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.BPChange.
				getGeneralData(this.oCustomerModel, vPath,sDecisionQuery,s3Controller, this.oOtc); 
				aBatchOperation = [];
				//Build the separate Mock Query in case of mock server
				if (s3Controller.oApplicationFacade.isMock())
				{
					vCompletePath = this.getMockQuery(vPath,vAction);
				}
				//Batch the Queries
				fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oCustomerModel, vCompletePath, aBatchOperation);
				//Do not add the decision query in case of the Mock server
				if (!s3Controller.oApplicationFacade.isMock())
				{
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oCustomerModel, sDecisionQuery, aBatchOperation );
				}

				//Submit Batch
				fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oCustomerModel,s3Controller);	
				oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData( );

				//Buffer the fetched result
				this.oGeneralData = oResponse;

				// Handling of the Locking
				if (!s3Controller.oApplicationFacade.isMock()) {
					if (oResponse[1].headers !== undefined && oResponse[1].headers.usmd1a016 !== undefined) {
						s3Controller.setCrLockError(oResponse[1].headers.usmd1a016);
						s3Controller.createDecisionButtons(oResponse[1].data.results, s3Controller, "", true);
					} else {
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

				fcg.mdg.approvecrv2.DomainSpecParts.BPChange.displayGeneralData(oResponse[0].data, s3Controller, this.oOtc );
				s3Controller.custHookModifyCustChangeGen(s3Controller,oResponse);	
			}
			else if(vAction === 'CREATE')//Create
			{
				vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.BPCreate.getGeneralData(this.oCustomerModel, vPath, sDecisionQuery, s3Controller,this.oOtc);
				aBatchOperation = [];
				//Build separate query in case of the mock server
				if (s3Controller.oApplicationFacade.isMock())
				{
					vCompletePath = this.getMockQuery(vPath,vAction);
				}
				//Batch the Queries
				fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oCustomerModel, vCompletePath, aBatchOperation);
				if (!s3Controller.oApplicationFacade.isMock())
				{
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oCustomerModel, sDecisionQuery, aBatchOperation );
				}			
				//Submit Batch
				fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oCustomerModel, s3Controller);
				oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData( );

//				Handling of the Locking 
				if (!s3Controller.oApplicationFacade.isMock()) {
					if (oResponse[1].headers !== undefined && oResponse[1].headers.usmd1a016 !== undefined) {
						s3Controller.setCrLockError(oResponse[1].headers.usmd1a016);
						s3Controller.createDecisionButtons( oResponse[1].data.results, s3Controller, "", true);
					} else {
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

				fcg.mdg.approvecrv2.DomainSpecParts.BPCreate.displayGeneralData(oResponse[0].data, s3Controller, this.oOtc);
				s3Controller.custHookModifyCustCreateGen(s3Controller,oResponse);
			}
			this.oGeneralData = oResponse;
		},

		getRelationshipData : function (vPath, vAction, vOTC, s3Controller)
		{
			var vCompletePath = "";
			var globalinst;
			vPath =  vPath + '/?$expand=';
			if(this.oRelData === "")
			{
				if(vAction === 'CHANGE')//Change
				{
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.BPChange.getRelationshipData(this.oCustomerModel, vPath, s3Controller, vOTC);
					globalinst = this;
					this.oCustomerModel.read(
						vCompletePath, 
						null, 
						null, 
						true, 
						function(result){
							fcg.mdg.approvecrv2.DomainSpecParts.BPChange.displayRelationshipData(result, s3Controller, vOTC, "relPanel");
							globalinst.oRelData = result;	
						}
					);
				}
				else if (vAction === 'CREATE')
				{
					//Get Relevant Queries
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.BPCreate.getRelationshipData(this.oCustomerModel, vPath, s3Controller, vOTC);
					globalinst = this;
					this.oCustomerModel.read(
						vCompletePath, 
						null, 
						null, 
						true, 
						function(result){
							fcg.mdg.approvecrv2.DomainSpecParts.BPCreate.displayRelationship(result, s3Controller, vOTC, "relPanel");	
							globalinst.oRelData = result;	
						}
					);
				}
			}
		},

		getCompanyCodeData: function(vPath, vAction, s3Controller){
			s3Controller.oCompCode={aCompCode:[]};
			var vCompletePath = "";
			var globalinst;
			vPath = vPath + '/?$expand=';

			if(this.oCompanyCodeData === ""){
				sap.ui.getCore().byId("CCompCodeLayout").removeAllContent();
				sap.ui.getCore().byId("CCompCodeLayout").setVisible(false);
				sap.ui.getCore().byId("CDunningLayout").removeAllContent();
				sap.ui.getCore().byId("CDunningLayout").setVisible(false);
				sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();
				sap.ui.getCore().byId("CWithhldTaxLayout").setVisible(false);

				if(vAction === 'CHANGE')//Change
				{
					//Get Relevant Queries
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getCompanyCodeData(this.oCustomerModel, vPath, s3Controller);
					//New Performance Change 
					globalinst = this;
					this.oCustomerModel.read(
							vCompletePath, 
							null, 
							null, 
							true, 
							function(result){
								if(result.ChangeRequestID === s3Controller.vCrId){
									fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.displayCompanyCodeData(result, s3Controller, 0 );
									globalinst.oCompanyCodeData = result;
									s3Controller.custHookModifyCustChangeComp(s3Controller,globalinst.oCompanyCodeData);
								}
							});
				}
				else if(vAction === 'CREATE')//Create
				{
					//Get Relevant Queries
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate.getCompanyCodeData(this.oCustomerModel, vPath, s3Controller);
					globalinst = this;
					this.oCustomerModel.read(
						vCompletePath, 
						null, 
						null, 
						true, 
						function(result){
							if(result.ChangeRequestID === s3Controller.vCrId){
								fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate.displayCompanyCodeData(result, s3Controller);
								globalinst.oCompanyCodeData = result;
								s3Controller.custHookModifyCustCreateComp(s3Controller,globalinst.oCompanyCodeData);
							}
						}
					);
				}
			}
		},

		getSalesData: function(vPath, vAction, s3Controller){
			var vCompletePath = "";
			var globalinst = this;
			s3Controller.oSalesArea={aSalesArea:[]};			
			vPath = vPath + '/?$expand=';

			if(this.oSalesData === ""){
				sap.ui.getCore().byId("CSaleLayout").removeAllContent();
				sap.ui.getCore().byId("CSaleLayout").setVisible(false);	
				if(vAction === 'CHANGE')//Change
				{
					//Get Relevant Queries
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getSalesData(this.oCustomerModel, vPath, s3Controller);

					this.oCustomerModel.read(
							vCompletePath, 
							null, 
							null, 
							true, 
							function(result){
								if(result.ChangeRequestID === s3Controller.vCrId){
									fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.displaySalesData(result, s3Controller, 0 );
									globalinst.oSalesData = result;
									s3Controller.custHookModifyCustChangeSales(s3Controller,globalinst.oSalesData);
								}
							});
				}
				else if(vAction === 'CREATE')//Create
				{
					//Get Relevant Queries
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate.getSalesData(this.oCustomerModel, vPath, s3Controller);
					this.oCustomerModel.read(
						vCompletePath, 
						null, 
						null, 
						true, 
						function(result){
							if(result.ChangeRequestID === s3Controller.vCrId){
								fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate.displaySalesData(result, s3Controller);	
								globalinst.oSalesData = result;
								s3Controller.custHookModifyCustCreateSales(s3Controller,globalinst.oSalesData);
							}
						}
					);
				}
			}
		},

		getGeneralSectionObsoleteData: function(){

			var vCompletePath = 'ObsoleteDataCollection?$filter=' + 
			'((ChangeRequestId+eq+' + this.vCrequest + ')' + 'and' +
			'((Entity+eq+' + '\'BP_BKDTL\'' 	+ ')' + 'or' + 
			'(Entity+eq+'  + '\'BP_ROLE\'' 	+ ')' + 'or' + 
			'(Entity+eq+'  + '\'BP_TAXNUM\''   + ')' + 'or' +
			'(Entity+eq+'  + '\'BP_IDNUM\'' 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'BP_MLT_AS\'' 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'BP_REL\'' 		+ ')' + 'or' +
			'(Entity+eq+'  + '\'BP_CPGEN\'' 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'AD_MOB\''        + ')' + 'or' +
			'(Entity+eq+'  + '\'BP_WPAD\'' 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'WP_URL\'' 		+ ')' + 'or' +
			'(Entity+eq+'  + '\'WP_TEL\'' 		+ ')' + 'or' +
			'(Entity+eq+'  + '\'WP_MOB\'' 		+ ')' + 'or' +
			'(Entity+eq+'  + '\'WP_FAX\'' 		+ ')' + 'or' +
			'(Entity+eq+'  + '\'WP_EMAIL\'' 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'BP_INDSTR\'' 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'ADDRESS\'' 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'AD_EMAIL\'' 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'AD_FAX\''	 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'AD_NAME_P\'' 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'AD_NAME_O\'' 	+ ')' + 'or' +
			'(Entity+eq+'  + '\'AD_TEL\'' 		+ ')' + 'or' +
			'(Entity+eq+'  + '\'AD_URL\'' 		+ ')' + 'or' +
			'(Entity+eq+'  + '\'BP_ADDUSG\'' 	+ ')))'; 	
			return vCompletePath;
		},

		getBatchData : function (vPath, vAction, s3Controller)
		{

			sap.ui.getCore().byId("CSaleLayout").removeAllContent();
			sap.ui.getCore().byId("CSaleLayout").setVisible(false);	
			sap.ui.getCore().byId("CCompCodeLayout").removeAllContent();
			sap.ui.getCore().byId("CCompCodeLayout").setVisible(false);
			sap.ui.getCore().byId("CDunningLayout").removeAllContent();
			sap.ui.getCore().byId("CDunningLayout").setVisible(false);
			sap.ui.getCore().byId("CWithhldTaxLayout").removeAllContent();
			sap.ui.getCore().byId("CWithhldTaxLayout").setVisible(false);

			var oResponse = "";
			var vCompletePath = "";
			var aBatchOperation;
			s3Controller.oSalesArea={aSalesArea:[]};			

			if (!s3Controller.oApplicationFacade.isMock()){
				vPath = this.queryString + vPath + '/?$expand=';
			}
			else
			{
				vPath =  vPath + '/?$expand=';
			}

			if(this.oSalesData === "" || this.oCompanyCodeData === "" ){

				if(vAction === 'CHANGE')//Change
				{
					aBatchOperation = [];
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getCompanyCodeData(this.oCustomerModel, vPath, s3Controller);
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oCustomerModel, vCompletePath, aBatchOperation);
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getSalesData(this.oCustomerModel, vPath, s3Controller);
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oCustomerModel, vCompletePath, aBatchOperation);			
					fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oCustomerModel);
					oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData( );

					fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.displayCompanyCodeData(oResponse[0].data, s3Controller, 0 );
					fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.displaySalesData(oResponse[1].data, s3Controller, 0 );
					this.oSalesData = oResponse[1];
					this.oCompanyCodeData = oResponse[0];
				}

				else if(vAction === 'CREATE')//Create
				{
					aBatchOperation = [];
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate.getCompanyCodeData(this.oCustomerModel, vPath, s3Controller);
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oCustomerModel, vCompletePath, aBatchOperation);
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate.getSalesData(this.oCustomerModel, vPath, s3Controller);
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oCustomerModel, vCompletePath, aBatchOperation);

					fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oCustomerModel);
					oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData( );

					fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate.displayCompanyCodeData(oResponse[0].data, s3Controller);
					fcg.mdg.approvecrv2.DomainSpecParts.CustomerCreate.displaySalesData(oResponse[1].data, s3Controller);

					this.oSalesData = oResponse[1];
					this.oCompanyCodeData = oResponse[0];	
				}
			}
		},

		getCompanyCodeObosleteData:function(){
			//var vCompletePath = '';
			var vCompletePath = 'ObsoleteDataCollection?$filter=' + 
			'((ChangeRequestId+eq+' + this.vCrequest + ')' + 'and' +
			'((Entity+eq+' + '\'BP_CUS_CC\'' 		 + ')' + 'or' + 
			'(Entity+eq+'  + '\'BP_CUSDUN\'' 		 + ')' + 'or' +  
			'(Entity+eq+'  + '\'BP_CUSWHT\'' 		 + ')))';
			return vCompletePath;
		},
		getSalesAreaObsoleteData:function(){
			//var vCompletePath = '';
			var vCompletePath = 'ObsoleteDataCollection?$filter=' + 
			'((ChangeRequestId+eq+' + this.vCrequest + ')' + 'and' +
			'((Entity+eq+' + '\'BP_SALES\'' 	+ ')' + 'or' +  
			'(Entity+eq+' + '\'BP_CUSTAX\'' 	+ ')' + 'or' + 
			'(Entity+eq+'  + '\'BP_CUSFCN\'' 	+ ')))';
			return vCompletePath;
		},
		setNavData:function(data){
			this._dataOnNav = data;
		},
		getNavData:function(){
			return this._dataOnNav;
		},
		setRouter : function(Router)
		{
			this.oRouter = Router;
		},
		getRouter : function()
		{
			return this.oRouter;
		},
		setContextPath : function(contextPath)
		{
			this.contextPath = contextPath;
		},
		getContextPath : function()
		{
			return this.contextPath;
		},
		setChangeRequest : function(changeRequest)
		{
			this.changeRequest = changeRequest;
		},

		getchangeRequest : function()
		{
			return this.changeRequest;
		},

		hideCompcodeSection : function()
		{
			if(sap.ui.getCore().byId("compBUKRS").getText() === "" && 
					sap.ui.getCore().byId("CompCode") !== undefined){								
				sap.ui.getCore().byId("CompCode").destroy();
			}

			if(sap.ui.getCore().byId("AKONT").getText() === "" && sap.ui.getCore().byId("KNRZE").getText() === "" &&
					sap.ui.getCore().byId("BEGRU").getText() === "" && sap.ui.getCore().byId("WBRSL").getText() === "" &&
					sap.ui.getCore().byId("ZUAWA").getText() === "" && sap.ui.getCore().byId("FDGRV").getText() === "" &&
					sap.ui.getCore().byId("FRGRP").getText() === "" &&
					sap.ui.getCore().byId("AccontingInfo") !== undefined){								
				sap.ui.getCore().byId("AccontingInfo").destroy();
			}

			if(sap.ui.getCore().byId("VZSKZ").getText() === "" && sap.ui.getCore().byId("ZINRT").getText() === "" &&
					sap.ui.getCore().byId("ZINDT").getText() === "" && sap.ui.getCore().byId("DATLZ").getText() === "" &&
					sap.ui.getCore().byId("IntrestCalc") !== undefined){								
				sap.ui.getCore().byId("IntrestCalc").destroy();
			}

			if(sap.ui.getCore().byId("ALTKN").getText() === "" && sap.ui.getCore().byId("EKVBD").getText() === "" &&
					sap.ui.getCore().byId("PERNR").getText() === "0" && sap.ui.getCore().byId("ReferenceData") !== undefined){								
				sap.ui.getCore().byId("ReferenceData").destroy();
			}

			if(sap.ui.getCore().byId("ZTERM").getText() === "" && sap.ui.getCore().byId("GUZTE").getText() === "" &&
					sap.ui.getCore().byId("WAKON").getText() === "" && sap.ui.getCore().byId("KULTG").getText() === "0" &&
					sap.ui.getCore().byId("TOGRU").getText() === "" && sap.ui.getCore().byId("URLID").getText() === "" &&
					sap.ui.getCore().byId("CESSION_KZ").getText() === "" && sap.ui.getCore().byId("XZVER").getText() === "" && 
					sap.ui.getCore().byId("PaymentData") !== undefined){								
				sap.ui.getCore().byId("PaymentData").destroy();
			}

			if(sap.ui.getCore().byId("ZWELS").getText() === "" && sap.ui.getCore().byId("KNRZB").getText() === "" &&
					sap.ui.getCore().byId("WEBTR").getText() === "0.00" && sap.ui.getCore().byId("UZAWE").getText() === "" &&
					sap.ui.getCore().byId("REMIT").getText() === "" && sap.ui.getCore().byId("LOCKB").getText() === "" &&
					sap.ui.getCore().byId("ZAHLS").getText() === "" && sap.ui.getCore().byId("HBKID").getText() === "" && 
					sap.ui.getCore().byId("ZGRUP").getText() === "" && sap.ui.getCore().byId("XPORE").getText() === "" &&
					sap.ui.getCore().byId("XEDIP").getText() === "" && 
					sap.ui.getCore().byId("AautomaticPaymnt") !== undefined){								
				sap.ui.getCore().byId("AautomaticPaymnt").destroy();
			}

			if(sap.ui.getCore().byId("VRSDG").getText() === "" && sap.ui.getCore().byId("SREGL").getText() === "" &&
					sap.ui.getCore().byId("PaymntAdvce") !== undefined){								
				sap.ui.getCore().byId("PaymntAdvce").destroy();
			}

			if(sap.ui.getCore().byId("VRSNR").getText() === "" && (sap.ui.getCore().byId("VLIBB").getText().substring(0, 4) === "0.00" || sap.ui.getCore().byId("VLIBB").getText().substring(0, 4) === "0,00") &&
					sap.ui.getCore().byId("VRSZL").getText() === "0" && sap.ui.getCore().byId("VRBKZ").getText() === "" &&
					sap.ui.getCore().byId("VERDT").getText() === "" && sap.ui.getCore().byId("VRSPR").getText() === "0" &&
					sap.ui.getCore().byId("ExprtCreditIns") !== undefined){								
				sap.ui.getCore().byId("ExprtCreditIns").destroy();

			}

			if(sap.ui.getCore().byId("BUSAB").getText() === "" && sap.ui.getCore().byId("EIKTO").getText() === "" &&
					sap.ui.getCore().byId("TLFNS").getText() === "" && sap.ui.getCore().byId("XAUSZ").getText() === "" &&
					sap.ui.getCore().byId("PERKZ").getText() === "" && sap.ui.getCore().byId("XDEZV").getText() === "" &&
					sap.ui.getCore().byId("INTAD").getText() === "" && sap.ui.getCore().byId("TLFXS").getText() === "" && 
					sap.ui.getCore().byId("KVERM").getText() === "" && sap.ui.getCore().byId("ZSABE").getText() === "" &&
					sap.ui.getCore().byId("Correspondance") !== undefined){								
				sap.ui.getCore().byId("Correspondance").destroy();
			}

			if(sap.ui.getCore().byId("ZAMIR").getText() === "" && sap.ui.getCore().byId("ZAMIO").getText() === "" &&
					sap.ui.getCore().byId("ZAMIB").getText() === "" && sap.ui.getCore().byId("ZAMIV").getText() === "" &&
					sap.ui.getCore().byId("ZAMIM").getText() === "" &&
					sap.ui.getCore().byId("PaymntNoticeTo") !== undefined){								
				sap.ui.getCore().byId("PaymntNoticeTo").destroy();
			}

			if(sap.ui.getCore().byId("MGRUP").getText() === "" && 
					sap.ui.getCore().byId("DunningData") !== undefined){								
				sap.ui.getCore().byId("DunningData").destroy();
			}
		},
		hideSaleSection : function ()
		{
			if(sap.ui.getCore().byId("BZIRK").getText() === "" && sap.ui.getCore().byId("VKBUR").getText() === "" &&
					sap.ui.getCore().byId("VKGRP").getText() === "" && sap.ui.getCore().byId("KDGRP").getText() === "" &&
					sap.ui.getCore().byId("KLABC").getText() === "" && sap.ui.getCore().byId("WAERS").getText() === "" &&
					sap.ui.getCore().byId("RDOFF").getText() === "" && sap.ui.getCore().byId("AWAHR").getText() === "000" && 
					sap.ui.getCore().byId("BEGRU").getText() === "" && sap.ui.getCore().byId("VSORT").getText() === "" && 
					sap.ui.getCore().byId("MEGRU").getText() === "" && 
					sap.ui.getCore().byId("salesOrder") !== undefined){								
				sap.ui.getCore().byId("salesOrder").destroy();
			}

			if(sap.ui.getCore().byId("KONDA").getText() === "" && sap.ui.getCore().byId("PLTYP").getText() === "" &&
					sap.ui.getCore().byId("KALKS").getText() === "" && sap.ui.getCore().byId("VERSG").getText() === "" &&
					sap.ui.getCore().byId("pricingstatistic") !== undefined){								
				sap.ui.getCore().byId("pricingstatistic").destroy();
			}

			if(sap.ui.getCore().byId("AGREL").getText() === "" && sap.ui.getCore().byId("BLIND").getText() === "" &&
					sap.ui.getCore().byId("agencygrp") !== undefined){								
				sap.ui.getCore().byId("agencygrp").destroy();
			}

			if(sap.ui.getCore().byId("LPRIO").getText() === "00" && sap.ui.getCore().byId("VSBED").getText() === "" &&
					sap.ui.getCore().byId("VWERK").getText() === "" && sap.ui.getCore().byId("KZAZU").getText() === "" &&
					sap.ui.getCore().byId("PODKZ").getText() === "" && sap.ui.getCore().byId("PODTG").getText() === "" &&
					sap.ui.getCore().byId("shipping") !== undefined){								
				sap.ui.getCore().byId("shipping").destroy();
			}

			if(sap.ui.getCore().byId("AUTLF").getText() === "" && sap.ui.getCore().byId("KZTLF").getText() === "" &&
					sap.ui.getCore().byId("ANTLF").getText() === "0" && sap.ui.getCore().byId("UEBTK").getText() === "" &&
					sap.ui.getCore().byId("UNTTO").getText() === "0.0" && sap.ui.getCore().byId("UEBTO").getText() === "0.0" &&
					sap.ui.getCore().byId("partialdel") !== undefined){								
				sap.ui.getCore().byId("partialdel").destroy();
			}

			if(sap.ui.getCore().byId("MRNKZ").getText() === "" && sap.ui.getCore().byId("PERFK").getText() === "" &&
					sap.ui.getCore().byId("PERRL").getText() === "" && sap.ui.getCore().byId("PRFRE").getText() === "" &&
					sap.ui.getCore().byId("BOKRE").getText() === "" && 
					sap.ui.getCore().byId("billingdoc") !== undefined){								
				sap.ui.getCore().byId("billingdoc").destroy();
			}

			if(sap.ui.getCore().byId("INCO1").getText() === "" && sap.ui.getCore().byId("KABSS").getText() === "" &&
					sap.ui.getCore().byId("saleZTERM").getText() === "" && sap.ui.getCore().byId("KKBER").getText() === "" &&
					sap.ui.getCore().byId("salePaymntAdvce") !== undefined){								
				sap.ui.getCore().byId("salePaymntAdvce").destroy();
			}

			if(sap.ui.getCore().byId("KTGRD").getText() === "" && 
					sap.ui.getCore().byId("accounting") !== undefined){								
				sap.ui.getCore().byId("accounting").destroy();
			}

			if(sap.ui.getCore().byId("KVGR1").getText() === "" && sap.ui.getCore().byId("KVGR2").getText() === "" &&
					sap.ui.getCore().byId("KVGR3").getText() === "" && sap.ui.getCore().byId("KVGR4").getText() === "" &&
					sap.ui.getCore().byId("KVGR5").getText() === "" && 
					sap.ui.getCore().byId("custGrps") !== undefined){								
				sap.ui.getCore().byId("custGrps").destroy();
			}
		},
		getS3Instance:function(){
			return this.oS3Controller;
		},
		getData:function( vTab ){
			if ( vTab === "General" ){
				return this.oGeneralData;	
			}

		},
		//Returns the Query in case of the mock server.
		getMockQuery : function (vPath,Action)
		{
			var vMockPath = "";
			if (Action === "CHANGE")
			{
				vMockPath = vPath + "BP_Root/ChangeData,BP_Root/BP_BankAccountsRel/ChangeData,BP_Root/BP_TaxNumbersRel/ChangeData," +
				"BP_Root/BP_IndustryRel/ChangeData,BP_Root/BP_RolesRel/ChangeData,BP_Root/BP_IdentificationNumbersRel/ChangeData," +
				"BP_Root/BP_AddressesRel/ChangeData,BP_Root/BP_RelationsRel/ChangeData,BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/ChangeData,BP_Root/BP_AddressUsagesRel/ChangeData," +
				"BP_Root/CU_MultipleAssignmentsRel/CU_AssignedCustomerRel/ChangeData,Notes,Attachments";	
			}
			if (Action === "CREATE")
			{
				vMockPath = vPath + "BP_Root,BP_Root/BP_PersonRel,BP_Root/BP_PersonRel/CD_CORRESPONDLANGUAGE,BP_Root/BP_BankAccountsRel," +
				"BP_Root/BP_TaxNumbersRel,BP_Root/BP_IndustryRel,BP_Root/BP_RolesRel,BP_Root/BP_IdentificationNumbersRel,BP_Root/BP_AddressesRel,BP_Root/BP_RelationsRel,BP_Root/BP_AddressUsagesRel,BP_Root/CU_MultipleAssignmentsRel/CU_AssignedCustomerRel," +
				"Notes,Attachments";
			}
			return vMockPath;
		},
		ResetBufferedBatchData: function(){
			//This method is to just clear the buffered data
			//Caller: S3
			//No other code to be added here except clearing related statements.
			this.oRelData = "";
			this.oCompanyCodeData = "";
			this.oSalesData = "";
			this.oGeneralData = "";
			this.oObsoleteDataCustGen = "";
			this.oObsoleteDataCustCC = "";
			this.oObsoleteDataCustSale = "";
		}
};