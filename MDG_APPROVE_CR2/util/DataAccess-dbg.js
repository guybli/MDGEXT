/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.util.DataAccess");

fcg.mdg.approvecrv2.util.DataAccess = {
		aData:[],
		oBaseController:"",
		vApprovePopup:"",
		sIndex:"",
		aEntities: [],
		vCReq : "",
		vRemoveProcessedCR: "",
		vCRData : { ChangeRequest: "" , Entities : []},
		aSyncData : [],

		initialize: function(oBaseController){
			this.oBaseController = oBaseController;
		},

		removeItemFromTaskModel : function (oModel, sCtxPath) {
			// find the next item to select
			this.sIndex = this.oBaseController.findNextVisibleItem(oModel, sCtxPath);//sOrigin, sInstanceId
		},

		addBatchOperation: function (oModel, vPath ,aBatchOperation){
			var oBatchOperation = oModel.createBatchOperation(vPath, "GET");
			aBatchOperation.push(oBatchOperation);
			oModel.clearBatch();
			oModel.addBatchReadOperations(aBatchOperation);  
		},           

		performSubmitBatch : function(oModel,oS3Controller) {
			var oLocalIns = this;
			var vError = false;
			var i = "";
			this.aData = [];
			oModel
			.submitBatch(
					function(odata, response) {
						var errorMessage = "";
						var vCode = "";
						for (  i = 0; i < response.data.__batchResponses.length; i++) {
							var sData = response.data.__batchResponses[i];
							oLocalIns.aData.push(sData);
							if(sData.response !== undefined){
								for (  i = 0; i < jQuery
								.parseJSON(sData.response.body).error.innererror.errordetails.length; i++) {
									if (errorMessage !== "") {
										errorMessage = errorMessage + "\n";
									}
									errorMessage = errorMessage
									+ jQuery.parseJSON(sData.response.body).error.innererror.errordetails[i].message;
										vCode = vCode +  jQuery.parseJSON(sData.response.body).error.innererror.errordetails[i].code;
									vError = true;
								}
							}
						}
						if(oS3Controller !== undefined){
							oS3Controller.setFinOdataError(vError,
									errorMessage,vCode);// call the setter function
							// to set these values
						}
					}, null, false);
		},

		//Setter Methods
		setTaskStatusCompleted:function(){
			if(this.sIndex !== "-1"){
				var vText = this.oBaseController.getView().getModel("i18n").getProperty("SUBMITTED");				
				this.oBaseController.getList().getItems()[this.sIndex].getAttributes()[1].setText(vText);
			}
		},

		setObjectKey:function(objectKey){
			if (fcg.mdg.approvecrv2.view.S2.prototype.oObjectKey !== "")
			{
				fcg.mdg.approvecrv2.view.S2.prototype.oObjectKey = "";
				fcg.mdg.approvecrv2.view.S2.prototype.oObjectKey = objectKey;
			}
			else
				fcg.mdg.approvecrv2.view.S2.prototype.oObjectKey = objectKey;
		},

		setApprovePopup : function( approvePopup ){
			//to read url parameter approve_popup to set whether popup should appear on click of approve button
			//Reading URL Parameters
			this.vApprovePopup = approvePopup;
		},

		//Set the Relevant Entity List for the CR
		setRelevantEntitiesForCR: function(vChangeRequest, vObjectList){ 
			this.vCRData.ChangeRequest = vChangeRequest;
			if(vObjectList !== undefined)
				this.vCRData.Entities = vObjectList.split("&");
		},

		//Set the value for Remove Processed CR
		setRemoveProcessedCR: function( vRemoveProcessedCR ){
			this.vRemoveProcessedCR = vRemoveProcessedCR;
		},

		//Getter Methods
		getBatchData:function(){
			return this.aData;
		},           

		getObjectKey : function(){
			var objectKey =       fcg.mdg.approvecrv2.view.S2.prototype.oObjectKey;
			return objectKey;
		}, 

		getApprovePopup : function(){            
			return this.vApprovePopup;
		},

		getRemoveProcessedCR: function(){
			return this.vRemoveProcessedCR;
		},

		isEntityRelevant : function(vChangeRequest, vEntityName){
			if(this.vCRData.ChangeRequest === vChangeRequest){
				for(var i=0; i<this.vCRData.Entities.length; i++){
					if(vEntityName === this.vCRData.Entities[i]){
						return true;
					}    		
				}
			}
			else{
				//The entities corresponding to the requested Change Request are not fetched. Hence, query on all entities.
				return true;
			}
			//if the entity is not present, only then the below statement is executed.
			return false;
		},

		resetAllContent: function(){
			this.aData = [];
			this.oBaseController ="";
			this.vApprovePopup="";
			this.sIndex="";
			this.vCRData.ChangeRequest="";
			this.vCRData.Entities="";    	 
		},
		
		readData: function(oDataModel,queryString )
		{   var oResult = null ;
		oDataModel.read(
				queryString, 
				null, //this.getView().getModel().createBindingContext(queryString), 
				null, //[]			,
				false, 
				function(oData,response){
					oResult = response;
				},
				function(e){
				}
		); 
		return oResult;  
		},
		
		performAsyncSubmitBatch : function(oModel,oS3Controller) {
			var oLocalIns = this;
			var vError = false;
			var i = "";
			this.aSyncData = [];
			oModel
			.submitBatch(
					function(odata, response) {
						var errorMessage = "";
						var vCode = "";
						for (  i = 0; i < response.data.__batchResponses.length; i++) {
							var sData = response.data.__batchResponses[i];
							oLocalIns.aSyncData.push(sData);
							if(sData.response !== undefined){
								for (  i = 0; i < jQuery
								.parseJSON(sData.response.body).error.innererror.errordetails.length; i++) {
									if (errorMessage !== "") {
										errorMessage = errorMessage + "\n";
									}
									errorMessage = errorMessage
									+ jQuery.parseJSON(sData.response.body).error.innererror.errordetails[i].message;
										vCode = vCode +  jQuery.parseJSON(sData.response.body).error.innererror.errordetails[i].code;
									vError = true;
								}
							}
						}
						if(oS3Controller !== undefined){
							oS3Controller.setFinOdataError(vError,
									errorMessage,vCode);// call the setter function
							// to set these values
						}
					}, null, true);
		},
		
		getAsyncBatchData:function(){
			return this.aSyncData;
		},
		setAsyncBatchData:function(){
			this.aSyncData = "";	
		}
};

sap.ui.base.EventProvider.extend("fcg.mdg.approvecrv2.util.Access",fcg.mdg.approvecrv2.util.DataAccess);