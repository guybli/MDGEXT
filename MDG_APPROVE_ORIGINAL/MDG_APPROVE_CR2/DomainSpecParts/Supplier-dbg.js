/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Supplier");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.SupplierCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.BPChange");

 
fcg.mdg.approvecrv2.DomainSpecParts.Supplier = {
		oCommunicationTable:"",
		oFormCommunication:"",
		oBankTable:"",
		oFormBank:"",
		oCompcodeTable:"",
		oFormCompcode:"",
		oSalesTable:"",
		oFormSales:"",
		oSupplierDomain:"",
		caIconTab:"",
		vModel:"",
		oModel:"",
		oPath:"",
		oEntity:"",
		vCrequest:"",
		oCreate:"",
		aBatchOperation:[],
		oBatchModel:"",
		sContextPath:"",
		oFormTax:"",
		oFormIndustry:"",
		oFormIdentification:"",
		oFormAddress:"",
		sModel:"",
		oSupplierModel:"",
		_dataOnNav:"",
		oRelData:"",
		oObsoleteData:"",
		oGeneralData:"",
		oCompanyCodeData:"",
		oSalesData:"",
		queryString:"",
		oSuppCompanyCodeData:"",
		oObsoleteDataGen:"",
		oObsoleteDataCC:"",
		oObsoleteDataPurch:"",
		opurchaseData:"",
		oS3Controller:"",
		oOtc: "",
		LoadLayout: function(vPath,vModel,vAction,vOTC,s3Controller){
			//this.queryString = "/sap/opu/odata/sap/MDG_CUSTOMER_GENIL_SRV/";
			this.oOtc=vOTC;
			this.oSupplierModel = s3Controller.getView().getModel("MDG_SUPPLIER");
			//new sap.ui.model.odata.ODataModel(this.queryString);
			this.oS3Controller = s3Controller;
			if(s3Controller.oSupplierDomain === "")
				s3Controller.oSupplierDomain = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Supplier',s3Controller);
			var oCustomerTabBar = sap.ui.getCore().byId("SupplierTabBar");
			var oGeneralTab = sap.ui.getCore().byId("SGeneralDataSection");
			oCustomerTabBar.setSelectedItem(oGeneralTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.oMaterialIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.accountIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.glAccountIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.costCenterIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.profitCenterIconTab);
			s3Controller.getView().byId("page").removeContent(s3Controller.oCustomerDomain);
			
			//Special handling for destroying file upload control
			try{
				sap.ui.getCore().byId("Sfileupload-1-uploader").destroy();
			}
			catch(err){}

			s3Controller.getView().byId("page").addContent(s3Controller.oSupplierDomain);

			//To remove all the layouts inside the IconTab Filter to avoid retaining of data 
			this.removeCustLayouts();
			//Work around for / in url
			this.queryString = "/" + this.oSupplierModel.sServiceUrl + "/";

			var extQuery = s3Controller.supplierHookCustomService(s3Controller,this.queryString);
			if(extQuery !== undefined){
				this.queryString = extQuery;
			}
			//this.queryString;
		},


		removeCustLayouts:function(s3Controller){
			//General Data
			try {
				sap.ui.getCore().byId("SGeneral").removeAllContent();
				sap.ui.getCore().byId("SRoles").removeAllContent();
				sap.ui.getCore().byId("SBank").removeAllContent();
				sap.ui.getCore().byId("STax").removeAllContent();
				sap.ui.getCore().byId("SIdentification").removeAllContent();
				sap.ui.getCore().byId("SIndustries").removeAllContent();
				sap.ui.getCore().byId("SErpSupplier").removeAllContent();
				sap.ui.getCore().byId("SAddress").removeAllContent();
				sap.ui.getCore().byId("SAddressUsages").removeAllContent();

				sap.ui.getCore().byId("SGeneral").setVisible(false);
				sap.ui.getCore().byId("SRoles").setVisible(false);
				sap.ui.getCore().byId("SBank").setVisible(false);
				sap.ui.getCore().byId("STax").setVisible(false);
				sap.ui.getCore().byId("SIdentification").setVisible(false);
				sap.ui.getCore().byId("SIndustries").setVisible(false);
				sap.ui.getCore().byId("SErpSupplier").setVisible(false);
				sap.ui.getCore().byId("SAddress").setVisible(false);
				sap.ui.getCore().byId("SAddressUsages").setVisible(false);

				s3Controller.supplierHookremovelayout();
			} catch (e) {
				// TODO: handle exception
			}
		},

		getGeneralData: function(vPath, vAction,vOTC,s3Controller){	
			this.oOtc = vOTC;
			var vCompletePath = "";
			var aBatchOperation;
			var oResponse = "";

			var aCrNumDerive = vPath.split("(");
			var aCrNum = aCrNumDerive[1].split(")");
			this.vCrequest = aCrNum[0];
			var url = "Decisions?Crequest="+aCrNum[0];
			var sDecisionQuery = this.queryString + url;		
			if (!s3Controller.oApplicationFacade.isMock())
			{
				vPath = this.queryString + vPath + '/?$expand=';
			}
			else
			{
				vPath =  vPath + '/?$expand=';
			}
			
			var vInstNoteTab = sap.ui.getCore().byId("SNotes");
			var vInstAttachmentTab = sap.ui.getCore().byId("SAttachmentSupplier");
			//Code Changed as per the new behavior to handle the notes and attachments 
			s3Controller.setNoteAttachIconTab(vInstNoteTab, vInstAttachmentTab);
			
			if(vAction === 'CHANGE')//Change
			{
				vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.BPChange.
				getGeneralData(this.oSupplierModel, vPath,sDecisionQuery,s3Controller,this.oOtc); 
				//Build the separate Mock Query in case of mock server
				if (s3Controller.oApplicationFacade.isMock())
				{
					vCompletePath = this.getMockQuery(vPath,vAction);
				}
				//Batch the Queries
				aBatchOperation = [];
				fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oSupplierModel, vCompletePath, aBatchOperation);
				//Do not add the decision query in case of the Mock server
				if (!s3Controller.oApplicationFacade.isMock())
				{
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oSupplierModel, sDecisionQuery, aBatchOperation );
				}
				//Submit Batch 
				fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oSupplierModel, s3Controller);
				oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData( );
				//Buffer the fetched result
				this.oGeneralData = oResponse;

				//Handling of the Locking 
				if (!s3Controller.oApplicationFacade.isMock()) {
					if(oResponse[1].headers !== undefined && oResponse[1].headers.usmd1a016 !== undefined){
						s3Controller.setCrLockError(oResponse[1].headers.usmd1a016);
						s3Controller.createDecisionButtons(oResponse[1].data.results, s3Controller, "", true);
					}
					else
					{
						//Since the decision query is not executed this method is not called
						if (!s3Controller.oApplicationFacade.isMock())
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
				}
				
				fcg.mdg.approvecrv2.DomainSpecParts.BPChange.displayGeneralData(oResponse[0].data, s3Controller, this.oOtc); 
				s3Controller.supplierHookModifySuppChangeGen(s3Controller,oResponse);
			}
			else if(vAction === 'CREATE')//Create
			{
				vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.BPCreate.getGeneralData(this.oSupplierModel, vPath,sDecisionQuery, s3Controller,this.oOtc);
				//Build separate query in case of the mock server
				if (s3Controller.oApplicationFacade.isMock())
				{
					vCompletePath = this.getMockQuery(vPath,vAction);
				}
				//Batch the Queries
				aBatchOperation = [];
				fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oSupplierModel, vCompletePath, aBatchOperation);
				if (!s3Controller.oApplicationFacade.isMock())
				{
					fcg.mdg.approvecrv2.util.DataAccess.addBatchOperation(this.oSupplierModel, sDecisionQuery, aBatchOperation );
				}
				//Submit Batch
				fcg.mdg.approvecrv2.util.DataAccess.performSubmitBatch(this.oSupplierModel, s3Controller);
				oResponse = fcg.mdg.approvecrv2.util.DataAccess.getBatchData( );
				//Handling of the Locking 
				if (!s3Controller.oApplicationFacade.isMock()) {
					if(oResponse[1].headers !== undefined && oResponse[1].headers.usmd1a016 !== undefined){
						s3Controller.setCrLockError(oResponse[1].headers.usmd1a016);
						s3Controller.createDecisionButtons(oResponse[1].data.results, s3Controller, "", true);
					}
					else
					{
						//Since the decision query is not executed this method is not called
						if (!s3Controller.oApplicationFacade.isMock())
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
				}

				fcg.mdg.approvecrv2.DomainSpecParts.BPCreate.displayGeneralData(oResponse[0].data, s3Controller,this.oOtc);
				s3Controller.suppliertHookModifySuppCreateGen(s3Controller,oResponse);
			}
			this.oGeneralData = oResponse;
		},
		
		getRelationshipData: function(vPath, vAction, vOTC, s3Controller) {
			var globalinst;
			var vCompletePath = "";
			vPath =  vPath + '/?$expand=';
			
			if(this.oRelData === ""){
				if(vAction === 'CHANGE'){
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.BPChange.getRelationshipData(this.oSupplierModel, vPath, s3Controller,this.oOtc);
					globalinst = this;
					this.oSupplierModel.read(
						vCompletePath, 
						null, 
						null, 
						true, 
						function(result){
							fcg.mdg.approvecrv2.DomainSpecParts.BPChange.displayRelationshipData(result, s3Controller, vOTC, "suppRelPanel");
							globalinst.oRelData = result;	
						}
					);
				}else if (vAction === 'CREATE'){
					//Get Relevant Queries
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.BPCreate.getRelationshipData(this.oSupplierModel, vPath, s3Controller,this.oOtc);
					globalinst = this;
					this.oSupplierModel.read(
						vCompletePath, 
						null, 
						null, 
						true, 
						function(result){
							fcg.mdg.approvecrv2.DomainSpecParts.BPCreate.displayRelationship(result, s3Controller, vOTC, "suppRelPanel");	
							globalinst.oRelData = result;	
							
						}
					);
				}
			}
		},

		getSuppCompanyCodeData: function(vPath, vAction, s3Controller){
			var vCompletePath = "";
			var globalinst;
			s3Controller.oSuppCompCode={aSuppCompCode:[]};
			vPath =  vPath + '/?$expand=';
			if(this.oSuppCompanyCodeData === ""){
				if(vAction === 'CHANGE')//Change
				{
					//Get Relevant Queries
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange.getSuppCompanyCodeData(this.oSupplierModel, vPath, s3Controller);
					globalinst = this;
					this.oSupplierModel.read(
						vCompletePath, 
						null, 
						null, 
						true, 
						function(result){
							if(result.ChangeRequestID === s3Controller.vCrId){
								fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange.displaySuppCompanyCodeData(result, s3Controller);
								globalinst.oSuppCompanyCodeData = result;	
								s3Controller.supplierHookModifySuppChangeComp(s3Controller,globalinst.oSuppCompanyCodeData);
							}
						}
					);
				}
				else if(vAction === 'CREATE')//Create
				{
					//Get Relevant Queries
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.SupplierCreate.getSuppCompanyCodeData(this.oSupplierModel, vPath, s3Controller);
					globalinst = this;
					this.oSupplierModel.read(
						vCompletePath, 
						null, 
						null, 
						true, 
						function(result){
							if(result.ChangeRequestID === s3Controller.vCrId){
								fcg.mdg.approvecrv2.DomainSpecParts.SupplierCreate.displaySuppCompanyCodeData(result, s3Controller);
								globalinst.oSuppCompanyCodeData = result;
								s3Controller.supplierHookModifySuppCreateComp(s3Controller,globalinst.oSuppCompanyCodeData);
							}
						}
					);
				}
			}
		},
		

		getPurchaseData: function(vPath, vAction, s3Controller){
			var vCompletePath = "";
			var globalinst;
			s3Controller.oPurchaseArea={aPurchaseArea:[]};
			vPath =  vPath + '/?$expand=';
			if(this.opurchaseData === ""){
				if(vAction === 'CHANGE')//Change
				{
					//Get Relevant Queries
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange.getPurchaseData(this.oSupplierModel, vPath, s3Controller);
					globalinst = this;
					this.oSupplierModel.read(
						vCompletePath, 
						null, 
						null, 
						true, 
						function(result){
							if(result.ChangeRequestID === s3Controller.vCrId){
								fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange.displayPurchaseData(result, s3Controller);
								globalinst.opurchaseData = result;	
								s3Controller.supplierHookModifySuppChangePurchOrg(s3Controller,globalinst.opurchaseData);
							}
						});
					
				}
				else if(vAction === 'CREATE')//Create
				{
					//Get Relevant Queries
					vCompletePath = fcg.mdg.approvecrv2.DomainSpecParts.SupplierCreate.getPurchaseData(this.oSupplierModel, vPath, s3Controller);
					globalinst = this;
					this.oSupplierModel.read(
						vCompletePath, 
						null, 
						null, 
						true, 
						function(result){
							if(result.ChangeRequestID === s3Controller.vCrId){
								fcg.mdg.approvecrv2.DomainSpecParts.SupplierCreate.displayPurchaseData(result, s3Controller);
								globalinst.opurchaseData = result;	
								s3Controller.supplierHookModifySuppCreatePurchOrg(s3Controller,globalinst.opurchaseData);
							}
						});
				}
			}
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

		hideSuppCompcodeSection : function()
		{
			if(sap.ui.getCore().byId("SuppcompcodeBUKRS").getText() === "" && 
					sap.ui.getCore().byId("SuppCompCode") !== undefined){								
				sap.ui.getCore().byId("SuppCompCode").destroy();
			}

			if(sap.ui.getCore().byId("SuppAKONT").getText() === "" && sap.ui.getCore().byId("SuppLNRZE").getText() === "" &&
					sap.ui.getCore().byId("SuppBEGRU").getText() === "" && sap.ui.getCore().byId("SuppMINDK").getText() === "" &&
					sap.ui.getCore().byId("SuppZUAWA").getText() === "" && sap.ui.getCore().byId("SuppFDGRV").getText() === "" &&
					sap.ui.getCore().byId("SuppFRGRP").getText() === "" && sap.ui.getCore().byId("SuppFDGRV").getText() === "" && 
					sap.ui.getCore().byId("SuppCERDT").getText() === "" &&
					sap.ui.getCore().byId("SuppAccontingInfo") !== undefined){								
				sap.ui.getCore().byId("SuppAccontingInfo").destroy();
			}

			if(sap.ui.getCore().byId("SuppQSSKZ").getText() === "" && sap.ui.getCore().byId("SuppQLAND").getText() === "" &&
					sap.ui.getCore().byId("SuppQSREC").getText() === "" && sap.ui.getCore().byId("SuppQSZNR").getText() === "" &&
					sap.ui.getCore().byId("SuppQSZDT").getText() === "" && sap.ui.getCore().byId("SuppQSBGR").getText() === "" &&
					sap.ui.getCore().byId("SuppWithTax") !== undefined){								
				sap.ui.getCore().byId("SuppWithTax").destroy();
			}


			if(sap.ui.getCore().byId("SuppVZSKZ").getText() === "" && (sap.ui.getCore().byId("SuppZINRT").getText() === "00" ||sap.ui.getCore().byId("SuppZINRT").getText()=== "") &&
					sap.ui.getCore().byId("SuppZINDT").getText() === "" && sap.ui.getCore().byId("SuppDATLZ").getText() === "" &&
					sap.ui.getCore().byId("SuppIntrestCalc") !== undefined){								
				sap.ui.getCore().byId("SuppIntrestCalc").destroy();
			}

			if (sap.ui.getCore().byId("SuppALTKN").getText() === ""
				&& (sap.ui.getCore().byId("SuppPERNR").getText() === "" || sap.ui.getCore().byId("SuppPERNR").getText() === "0")
				&& sap.ui.getCore().byId("SuppReferenceData") !== undefined) {
				sap.ui.getCore().byId("SuppReferenceData").destroy();
			}

			if(sap.ui.getCore().byId("SuppZTERM").getText() === "" && sap.ui.getCore().byId("SuppGUZTE").getText() === "" &&
					sap.ui.getCore().byId("SuppKULTG").getText() === "0" && sap.ui.getCore().byId("SuppTOGRU").getText() === "" && 
					sap.ui.getCore().byId("SuppREPRF").getText() === "" && sap.ui.getCore().byId("SuppPaymentData") !== undefined){								
				sap.ui.getCore().byId("SuppPaymentData").destroy();
			}

			if(sap.ui.getCore().byId("SuppZWELS").getText() === "" && sap.ui.getCore().byId("SuppLNRZB").getText() === "" &&
					sap.ui.getCore().byId("SuppZGRUP").getText() === "" && sap.ui.getCore().byId("SuppWEBTR").getText() === "" &&
					sap.ui.getCore().byId("SuppUZAWE").getText() === "" && sap.ui.getCore().byId("SuppZAHLS").getText() === "" &&
					sap.ui.getCore().byId("SuppHBKID").getText() === "" && sap.ui.getCore().byId("SuppXPORE").getText() === "" && 
					sap.ui.getCore().byId("SuppXEDIP").getText() === ""  && sap.ui.getCore().byId("SuppXVERR").getText() === ""  &&
					sap.ui.getCore().byId("SuppAautomaticPaymnt") !== undefined){								
				sap.ui.getCore().byId("SuppAautomaticPaymnt").destroy();
			}

			if(sap.ui.getCore().byId("SuppTOGRR").getText() === "" && 
					sap.ui.getCore().byId("SuppInvVerification") !== undefined){								
				sap.ui.getCore().byId("SuppInvVerification").destroy();
			}

			if(sap.ui.getCore().byId("SuppBUSAB").getText() === "" && sap.ui.getCore().byId("SuppEIKTO").getText() === "" &&
					sap.ui.getCore().byId("SuppZSABE").getText() === "" && sap.ui.getCore().byId("SuppTLFNS").getText() === "" &&
					sap.ui.getCore().byId("SuppINTAD").getText() === "" && sap.ui.getCore().byId("SuppXDEZV").getText() === "" &&
					sap.ui.getCore().byId("SuppXAUSZ").getText() === "" && sap.ui.getCore().byId("SuppKVERM").getText() === "" && 
					sap.ui.getCore().byId("SuppTLFXS").getText() === "" &&
					sap.ui.getCore().byId("SuppCorrespondance") !== undefined){								
				sap.ui.getCore().byId("SuppCorrespondance").destroy();
			}
			if(sap.ui.getCore().byId("SuppMGRUP").getText() === "" && 
					sap.ui.getCore().byId("SuppDunningData") !== undefined){								
				sap.ui.getCore().byId("SuppDunningData").destroy();
			}
		},
		hidePurchaseSection : function ()
		{
			if(sap.ui.getCore().byId("purWAERS").getText() === "" && sap.ui.getCore().byId("purZTERM").getText() === "" &&
					sap.ui.getCore().byId("purMINBW").getText() === "0.00" && sap.ui.getCore().byId("purKALSK").getText() === "" &&
					sap.ui.getCore().byId("purBOPNR").getText() === "" && sap.ui.getCore().byId("purMEPRF").getText() === "" &&
					sap.ui.getCore().byId("purINCO1").getText() === "" &&
					sap.ui.getCore().byId("SupplierCondition") !== undefined){								
				sap.ui.getCore().byId("SupplierCondition").destroy();
			}

			if(sap.ui.getCore().byId("purVERKF").getText() === "" && sap.ui.getCore().byId("purEIKTO").getText() === "" &&
					sap.ui.getCore().byId("salesdata") !== undefined){								
				sap.ui.getCore().byId("salesdata").destroy();
			}

			if(sap.ui.getCore().byId("purLIPRE").getText() === "" && sap.ui.getCore().byId("purVENSL").getText() === "0.0" &&
					sap.ui.getCore().byId("purLISER").getText() === "" && sap.ui.getCore().byId("purLIBES").getText() === "" &&
					sap.ui.getCore().byId("servicedata") !== undefined){								
				sap.ui.getCore().byId("servicedata").destroy();
			}

			if(sap.ui.getCore().byId("purEKGRP").getText() === "" && sap.ui.getCore().byId("purBSTAE").getText() === "" &&
					sap.ui.getCore().byId("purRDPRF").getText() === "" && sap.ui.getCore().byId("purPLIFZ").getText() === "0" &&
					sap.ui.getCore().byId("purMEGRU").getText() === "" && 
					sap.ui.getCore().byId("defaultdatamat") !== undefined){								
				sap.ui.getCore().byId("defaultdatamat").destroy();
			}

			if(sap.ui.getCore().byId("purLFABC").getText() === "" && sap.ui.getCore().byId("purEXPVZ").getText() === "" &&
					sap.ui.getCore().byId("purZOLLA").getText() === "" && sap.ui.getCore().byId("purSKRIT").getText() === "" &&
					sap.ui.getCore().byId("purPAPRF").getText() === "" && sap.ui.getCore().byId("purVSBED").getText() === "" &&
					sap.ui.getCore().byId("purXNBWY").getText() === " " && sap.ui.getCore().byId("purNRGEW").getText() === "" &&
					sap.ui.getCore().byId("purPRFRE").getText() === "" && sap.ui.getCore().byId("purAGREL").getText() === "" &&
					sap.ui.getCore().byId("purWEBRE").getText() === "" && sap.ui.getCore().byId("purXERSR").getText() === "" &&
					sap.ui.getCore().byId("purXERSY").getText() === "" && sap.ui.getCore().byId("purKZABS").getText() === "" &&
					sap.ui.getCore().byId("purKZAUT").getText() === "" && sap.ui.getCore().byId("purBOLRE").getText() === "" &&
					sap.ui.getCore().byId("purBOIND").getText() === "" && sap.ui.getCore().byId("purUMSAE").getText() === "" &&
					sap.ui.getCore().byId("purBLIND").getText() === "" && sap.ui.getCore().byId("purLEBRE").getText() === "" &&
					sap.ui.getCore().byId("controldata") !== undefined){								
				sap.ui.getCore().byId("controldata").destroy();
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
			'(Entity+eq+'  + '\'BP_VENSUB\'' 		+ ')' + 'or' +
			'(Entity+eq+'  + '\'BP_ADDUSG\'' 	+ ')))'; 	
			return vCompletePath;
		},

		getCompanyCodeObosleteData:function(){
			var vCompletePath = 'ObsoleteDataCollection?$filter=' + 
			'((ChangeRequestId+eq+' + this.vCrequest + ')' + 'and' +
			'((Entity+eq+' + '\'BP_COMPNY\'' 		 + ')' + 'or' + 
			'(Entity+eq+'  + '\'BP_DUNN\'' 		 + ')' + 'or' +  
			'(Entity+eq+'  + '\'BP_WHTAX\'' 		 + ')))';
			return vCompletePath;
		},
		getPurchaseOrgObsoleteData:function(){
			var vCompletePath = 'ObsoleteDataCollection?$filter=' + 
			'((ChangeRequestId+eq+' + this.vCrequest + ')' + 'and' +
			'((Entity+eq+' + '\'BP_PORG\'' 	+ ')' + 'or' +  
			'(Entity+eq+' + '\'BP_PORG2\'' 	+ ')' + 'or' + 
			'(Entity+eq+'  + '\'BP_VENFCN\'' 	+ ')))';
			return vCompletePath;
		},

//		Returns the Query in case of the mock server.
		getMockQuery : function (vPath,Action)
		{
			var vMockPath = "";
			if (Action === "CHANGE")
			{
				vMockPath = vPath + "BP_Root/ChangeData,BP_Root/BP_BankAccountsRel/ChangeData,BP_Root/BP_TaxNumbersRel/ChangeData," +
				"BP_Root/BP_IndustryRel/ChangeData,BP_Root/BP_RolesRel/ChangeData,BP_Root/BP_IdentificationNumbersRel/ChangeData," +
				"BP_Root/BP_AddressesRel/ChangeData,BP_Root/BP_RelationsRel/ChangeData,BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/ChangeData,BP_Root/BP_AddressUsagesRel/ChangeData," +
				"Notes,Attachments";
			}
			if (Action === "CREATE")
			{
				vMockPath = vPath + "BP_Root,BP_Root/BP_PersonRel,BP_Root/BP_PersonRel/CD_CORRESPONDLANGUAGE,BP_Root/BP_BankAccountsRel," +
				"BP_Root/BP_TaxNumbersRel,BP_Root/BP_IndustryRel,BP_Root/BP_RolesRel,BP_Root/BP_IdentificationNumbersRel,BP_Root/BP_AddressesRel,BP_Root/BP_RelationsRel,BP_Root/BP_AddressUsagesRel,BP_Root/SP_MultipleAssignmentsRel/SP_AssignedSupplierRel," +
				"Notes,Attachments";
			}
			return vMockPath;
		},
		ResetBufferedBatchData: function(){
			//This method is to just clear the buffered data
			//Caller: S3
			//No other code to be added here except clearing related statements.
			this.oRelData = "";
			this.oSuppCompanyCodeData = "";
			this.opurchaseData = "";
			this.oGeneralData = "";
			this.oObsoleteDataGen = "";
			this.oObsoleteDataPurch = "";
			this.oObsoleteDataCC = "";
		}
};