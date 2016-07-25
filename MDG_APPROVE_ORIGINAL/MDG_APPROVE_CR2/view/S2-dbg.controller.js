/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");

sap.ca.scfld.md.controller.ScfldMasterController.extend("fcg.mdg.approvecrv2.view.S2", {
//	Controller Hook method definitions
//	This hook method can be used to modify the list of properties
//	that are used for filtering of the S2 list items.
//	It is called when the application starts and the S2 list screen is displayed.
	extHookChangeFilterItems: null,

//	This hook method can be used to modify the list of properties
//	that are used for sorting the S2 list items.
//	It is called when the application starts and the S2 list screen is displayed.
	extHookChangeSortConfig: null,

//	This hook method can be used to modify the list of properties
//	that are used for grouping the S2 list items.
//	It is called when the application starts and the S2 list screen is displayed.
	extHookChangeGroupConfig: null,

//	This hook method can be used to replace the standard filter by a custom one based on the filterKey
//	It is called when a filter option is selected on the UI.
	extHookGetCustomFilter: null,

	oObjectKey:"",
	aItemContextPathsToSelect: [],
	vFilterKey:"",
	isListComplete:"",
	deferred:"",
	sFilterPattern:"",
	vSearchCount:"",
	vTotalCount:"",
	vEventReason:"",
	isLiveSearchEnabled:"",
	aSorter: "",
	aFilter: "",
	vEventReasonsReason:"",
	vApprovePopup:"",
	vRemoveProcessedCR:"",
	sFilters:"",
	otcs:"",

	initializeLayout:function(){
		// execute the onInit for the base class BaseDetailController
		var s2Controller = this;
		var queryString = "ChangeRequestCollection?$top=1&$skip=0&$filter=OTC eq '158' or OTC eq '159' or OTC eq '194' or OTC eq '229' or OTC eq '266' or OTC eq '892'";

		// create a deferred object
		var deferLoad = jQuery.Deferred();		
		// tell the deferred object what to do after a task which might be async is done

		s2Controller.aFilter = this.setFilter();		                	
		deferLoad.then(function(s2Controller){
			s2Controller.loadInitialAppData(s2Controller.aSorter, s2Controller.aFilter);
		});

		this.getView().getModel().read(
				queryString, 
				null, //this.getView().getModel().createBindingContext(queryString), 
				null, //[],
				true, 
				function(result, data){
					s2Controller.sFilters = data.headers.filters;
					if(result.results[0]!==undefined)
					{
						//Store the Header 'Filters'
						deferLoad.resolve(s2Controller);
						//Load the Relevant Entities for the selected CR
						fcg.mdg.approvecrv2.util.DataAccess.setRelevantEntitiesForCR(result.results[0].ChangeRequestID , result.results[0].ObjectList);
						var numOfAttachments = parseInt(result.results[0].NumberOfAttachments);
						s2Controller.oRouter.navTo("detail", {
							contextPath : result.results[0].__metadata.uri.
							split('MDG_APPROVE_CR/')[1],
							ChangeRequestID : result.results[0].ChangeRequestID,
							DataModel : result.results[0].DataModel,
							Action : result.results[0].Action,
							NumberOfAttachments:numOfAttachments,
							NumberOfNotes:parseInt(result.results[0].NumberOfNotes),
							MainEntity: result.results[0].MainEntity,
							Source: "Master",
							ChangeRequestDesc:encodeURIComponent(result.results[0].ChangeRequestDesc)
						}
						);
						deferLoad.promise();
					}
					else
					{
						sap.ca.scfld.md.controller.ScfldMasterController.prototype.navToEmptyView.call(s2Controller);
						s2Controller.vTotalCount = 0;
						s2Controller._oApplicationImplementation.oMHFHelper.setMasterTitle(s2Controller,s2Controller.vTotalCount);
					}
				}
		);

		// create a deferred object
		this.deferred = jQuery.Deferred();		
		// tell the deferred object what to do after a task which might be async is done
		this.deferred.then(function(s2Controller){
			//Here, trigger the search again as re-loading the list with complete data is finished.
			//s2Controller.applySearchPattern(s2Controller.sFilterPattern); -- Manually triggering search isn't giving the 
			//required output and Hence the below statement - It triggers the search from the framework
			s2Controller.getView().getController().registerMasterListBind();
		});		
	},
	
	//Set filter options
	setFilter: function(){
		// set the filter options
		var aFilter = [];
    	var oFilter = new sap.ui.model.Filter( "OTC", "EQ", '194');
    	aFilter.push(oFilter);
    	oFilter = new sap.ui.model.Filter( "OTC", "EQ", '158');
     	aFilter.push(oFilter);
        oFilter = new sap.ui.model.Filter( "OTC", "EQ", '159');
     	aFilter.push(oFilter);
    	oFilter = new sap.ui.model.Filter( "OTC", "EQ", '229');
    	aFilter.push(oFilter);
    	oFilter = new sap.ui.model.Filter( "OTC", "EQ", '266');
    	aFilter.push(oFilter);
    	oFilter = new sap.ui.model.Filter( "OTC", "EQ", '892');
    	aFilter.push(oFilter);
    	return aFilter;
	},
	onInit : function() {
		this.getView().getModel().attachRequestSent(jQuery.proxy(this.handleMasterRequestSent, this));
		this.getView().getModel().attachRequestCompleted(jQuery.proxy(this.handleMasterRequestCompleted, this));
		this.getView().getModel().attachRequestFailed(jQuery.proxy(this.handleRequestFailed, this));
		this.vEventReason = 'IntialLoad';
		this.initializeLayout();
		if(!this.oDataManager){
			fcg.mdg.approvecrv2.util.DataAccess.initialize(this);
	          //to read url parameter approve_popup to set whether popup should appear on click of approve button
            //Reading URL Parameters
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            var myComponent = sap.ui.component(sComponentId);

            if (myComponent && myComponent.getComponentData() && myComponent.getComponentData().startupParameters) {
                  if(myComponent.getComponentData().startupParameters.APPROVE_POPUP !== undefined)
                  {this.vApprovePopup = myComponent.getComponentData().startupParameters.APPROVE_POPUP[0];}
                  if(myComponent.getComponentData().startupParameters.REMOVE_PROCESSED_CR !== undefined)
                  {this.vRemoveProcessedCR = myComponent.getComponentData().startupParameters.REMOVE_PROCESSED_CR[0];}                  
            }
            if(!this.oApplicationFacade.isMock()){
            	fcg.mdg.approvecrv2.util.DataAccess.setApprovePopup( this.vApprovePopup );
                fcg.mdg.approvecrv2.util.DataAccess.setRemoveProcessedCR( this.vRemoveProcessedCR );
            }
		}
	},
	onRefresh: function(){
	if(this.aFilter === ""){
	this.aFilter = this.setFilter();
	}
		jQuery.proxy(this.loadInitialAppData(this.aSorter, this.aFilter), this);
		this.vEventReason = 'ListRefreshed';
	},

	handleRequestFailed: function() {
		var oList = this.getList();
		var sNoDataText = this.oApplicationFacade.getUiLibResourceModel().getText("NO_ITEMS_AVAILABLE");
		oList.setNoDataText(sNoDataText);
	},

	handleMasterRequestSent: function() {
		//Clear the decision options when list data is loaded - refresh
		//this.oDataManager.clearDecisionOptionsCache();
	},

	handleMasterRequestCompleted: function() {
		if (this.bDisplaySortOption)
			this.displayVisibleSortItems();

		var oList = this.getList();
		if (oList.getItems().length === 0) {
			this.navToEmptyView();
			this.oRouter.navTo("master", null, true);
			return;
		}

		var oS2List = this.getView().byId("list");
		var iItemIndexToSelect = -1;

		if (this.aItemContextPathsToSelect.length === 0) {
			//Deep link scenario handling
			this._selectItemByCtxtPath();

		} else {
			var bItemFound = false;
			for (var sCtxPathKey in this.aItemContextPathsToSelect) {
				var sCtxPath = this.aItemContextPathsToSelect[sCtxPathKey];
				for (var iListKey in oS2List.getItems()) {
					if (oS2List.getItems()[iListKey].getBindingContextPath() === sCtxPath) {
						iItemIndexToSelect = iListKey;
						bItemFound = true;
						break;
					}
				}
				if (bItemFound) {
					this.setListItem(oS2List.getItems()[iItemIndexToSelect]);
					this.aItemContextPathsToSelect = [];
					break;
				} 
			}
			if (!bItemFound) {
				//In case of last item processing: select the new last item instead of the first one
				if (this.aItemContextPathsToSelect.length === 2 && this.aItemContextPathsToSelect[0] === this.aItemContextPathsToSelect[1]) {
					this.setListItem(oS2List.getItems()[oS2List.getItems().length-1]);
				}

				//Deep link scenario handling
				this._selectItemByCtxtPath();
			}
		}
	},


	iconFormatter : function(oValue)
	{
		if(oValue === "" || oValue === null || oValue === undefined)
			return "";

		if(oValue === 'CREATE')
			return "sap-icon://create";
		else
			return "";
	},

	crIdFormatter:function(oCrDescValue,oCrIdValue)
	{
		if(oCrDescValue === "" || oCrDescValue === null || oCrDescValue === undefined || oCrIdValue === "" || oCrIdValue === null || oCrIdValue === undefined)
			return "";

		return   this.getView().getModel("i18n").getProperty("ChangeRequest")+ ": " +oCrDescValue+" ("+oCrIdValue+")";     
	},

	requestedBy:function(createdBy)
	{
		if(createdBy === "" || createdBy === null || createdBy === undefined )
			return "";
		else
			return   this.getView().getModel("i18n").getProperty("RequestedBy")+ ": " +createdBy;     
	},

	s2EntityText:function(oActionValue,oCode)
	{
        if(oActionValue === 'CREATE' && oCode === '159')
        { return this.getView().getModel("i18n").getProperty("Newcustomer"); }
        else if(oActionValue === 'CHANGE' && oCode === '159')
        { return this.getView().getModel("i18n").getProperty("Changedcustomer"); }
        else if(oActionValue === 'CREATE' && oCode === '158')
        {      return this.getView().getModel("i18n").getProperty("CC_CCTRCCTRN"); }
        else if(oActionValue === 'CHANGE' && oCode === '158')
        { return this.getView().getModel("i18n").getProperty("Changedcostcenter");   } 
        else if(oActionValue === 'CREATE' && oCode === '229')
        {      return this.getView().getModel("i18n").getProperty("PC_NPC_ID"); }
        else if(oActionValue === 'CHANGE' && oCode === '229')
        { return this.getView().getModel("i18n").getProperty("Changedprofitcenter");  }
        else if(oActionValue === 'CREATE' && oCode === '266')
        {      return this.getView().getModel("i18n").getProperty("Newsupplier"); }
        else if(oActionValue === 'CHANGE' && oCode === '266')
        { return this.getView().getModel("i18n").getProperty("Changedsupplier");  }
        else if(oActionValue === 'CREATE' && oCode === '892')
        { return this.getView().getModel("i18n").getProperty("NewGLA");  }
        else if(oActionValue === 'CHANGE' && oCode === '892')
        { return this.getView().getModel("i18n").getProperty("ChangedGLA");  }
         else if(oActionValue === 'CREATE' && oCode === '194')
        { return this.getView().getModel("i18n").getProperty("New_Material");  }
        else if(oActionValue === 'CHANGE' && oCode === '194')
        { return this.getView().getModel("i18n").getProperty("Changed_Material");  }
	},

	_selectItemByCtxtPath: function() {
		if (this.sBindingContextPath) {
			var oItem = this.findItemByContextPath(this.sBindingContextPath);
			if (oItem) {
				this.setListItem(oItem);
			} else {
				this.selectFirstItem();
			}
		}
	},

    findNextVisibleItem : function(sModel, sCtxPath) {
        var vTempiItemIndexToSelect = "";
        try{
        	var sContextPath = new sap.ui.model.context(sModel,sCtxPath);
        }catch(err){
            sContextPath = sCtxPath;
        }
        var oS2List = this.getView().byId("list");
        var iItemIndex = -1;
        var iItemIndexToSelect = -1;
        this.aItemContextPathsToSelect = [];
        for (var iListKey in oS2List.getItems()) {
               var sCurrentContextPath = oS2List.getItems()[iListKey].getBindingContextPath();
               if (sCurrentContextPath === sContextPath) {
				   iItemIndex = iListKey;
				   var sActualItemContextPath = oS2List.getItems()[iItemIndex].getBindingContextPath();
				   vTempiItemIndexToSelect = iItemIndex;
				   //add the actual/processed item ctx path to the array.
				   this.aItemContextPathsToSelect.push(sActualItemContextPath);
               }
               if ((oS2List.getItems()[iListKey].getVisible()) && ((iItemIndexToSelect <= iItemIndex) || (iItemIndex === -1))) {
                   iItemIndexToSelect = iListKey;
               }
        }
        if ((iItemIndexToSelect === -1) && (oS2List.getItems().length>0)) {
               iItemIndexToSelect = 0;
        }
        if (iItemIndexToSelect >= 0) {
               //add the ctx path of the first item or the next one to the actual item to the array.
               this.aItemContextPathsToSelect.push(oS2List.getItems()[iItemIndexToSelect].getBindingContextPath());
        }
        //If this method is triggered, approve or reject is completed
        this.vEventReason = 'FindNext';
        //The next line is added only to make sure that the next record isn't selected on approve or reject.
        //Temporary - Needs to be removed once performance changes are done and loading s2 becomes faster
        return vTempiItemIndexToSelect;
  },

	overrideMHFHelperSetMasterTitle : function() {
		// redefinition of setMasterTitle to be able to change the title of the screen dynamically
		
		sap.ca.scfld.md.app.Application.getImpl().oMHFHelper.setMasterTitle = function(oController, iCount) {
			if (!oController._oControlStore.oMasterTitle) {
				return;
			}

			var oComponent = sap.ca.scfld.md.app.Application.getImpl().getComponent();
			this.oDataManager = oComponent.getDataManager();

			if (!this.oDataManager) {return;}

			if (!this.oDataManager.getScenarioConfig() || !this.oDataManager.getScenarioConfig().DisplayName) {
				var oBundle = this.oApplicationImplementation.AppI18nModel.getResourceBundle();
				this.sTitle = oBundle.getText(oController._oHeaderFooterOptions.sI18NMasterTitle, [iCount]);				
			} else {
				this.sTitle = this.oDataManager.getScenarioConfig().DisplayName + " (" + iCount + ")";
			}

			oController._oControlStore.oMasterTitle.setText(this.sTitle);
		};
	},

	applySearchPatternToListItem : function(oItem, sFilterPattern) {
		// check UI elements(status, task tile)
        sFilterPattern = sFilterPattern.trim();
		if ((oItem.getIntro() && oItem.getIntro().toLowerCase().indexOf(sFilterPattern) !== -1)
				|| (oItem.getTitle() && oItem.getTitle().toLowerCase().indexOf(sFilterPattern) !== -1)
				|| (oItem.getNumber() && oItem.getNumber().toLowerCase().indexOf(sFilterPattern) !== -1)
				|| (oItem.getNumberUnit() && oItem.getNumberUnit().toLowerCase().indexOf(sFilterPattern) !== -1)
				|| (oItem.getFirstStatus() && oItem.getFirstStatus().getText().toLowerCase().indexOf(sFilterPattern) !== -1)
				|| (oItem.getSecondStatus() && oItem.getSecondStatus().getText().toLowerCase().indexOf(sFilterPattern) !== -1)) {
			return true;
		}
		// last source is attribute array (creator user name)
		var aAttributes = oItem.getAttributes();
		for ( var j = 0; j < aAttributes.length; j++) {
			if (aAttributes[j].getText().toLowerCase().indexOf(sFilterPattern) !== -1) {
				return true;
			}
		}
		return false;
	},

	//Get Header footer
	getHeaderFooterOptions : function() {
		//Domain Filters based on the user authorization
		var s2Controller = this;
		var	aFilterItemsObj = [];
		var	otcValue = {};
		
			otcValue["None"] =  {
				                	text : this.getView().getModel("i18n").getProperty("NONE"),
				                	key : ""
				                };
			otcValue["CCTR"] ={
			                	text : this.getView().getModel("i18n").getProperty("CCTR"), //"Cost Center",
			                	key  : "158"
			                };
			otcValue["PCTR"] = {
			                	text : this.getView().getModel("i18n").getProperty("PCTR"), //"Profit Center",
			                	key  : "229"
			                };
			otcValue["CUSTOMER"] = {
			                	text : this.getView().getModel("i18n").getProperty("CUSTOMER"), //"Customer",
			                	key  : "159" 
			                };
			otcValue["SUPPLIER"] ={
			                	text : this.getView().getModel("i18n").getProperty("SUPPLIER"),  
			                	key : "266"
			                };
			otcValue["GLA"] ={
			                	text : this.getView().getModel("i18n").getProperty("GL_ACCOUNT"),  
  			                	key : "892"
			                };
			otcValue["MATERIAL"] = {
			                	text : this.getView().getModel("i18n").getProperty("MATERIAL"),  
			                	key : "194"
			                };

			if (this.sFilters !== undefined){
				this.otcs = this.sFilters.split('/'); 
				aFilterItemsObj = [];
				aFilterItemsObj.push(otcValue["None"]);
				for(var i = 0 ; i < this.otcs.length ; i++){
					switch (this.otcs[i]) {
						case "158":   aFilterItemsObj.push(otcValue["CCTR"]);
							break;
						case "229":    aFilterItemsObj.push(otcValue["PCTR"]);
							break;
						case "159":	   aFilterItemsObj.push(otcValue["CUSTOMER"]);
							break;
						case "266":	    aFilterItemsObj.push(otcValue["SUPPLIER"]);
							break;
						case "194":      aFilterItemsObj.push(otcValue["MATERIAL"]);
							break;
						case "892":	     aFilterItemsObj.push(otcValue["GLA"]);
							break;
						default:
					}
				}
			}else {
				aFilterItemsObj.push(otcValue["None"]);
				aFilterItemsObj.push(otcValue["CCTR"]);
				aFilterItemsObj.push(otcValue["PCTR"]);
				aFilterItemsObj.push(otcValue["CUSTOMER"]);
				aFilterItemsObj.push(otcValue["SUPPLIER"]);
				aFilterItemsObj.push(otcValue["MATERIAL"]);
				aFilterItemsObj.push(otcValue["GLA"]);
			}
			
		
		
		return {
			sI18NMasterTitle : this.getView().getModel("i18n").getProperty("MASTER_TITLE",[0]),//"MASTER_TITLE",
			onBack:"",
			oFilterOptions : {
				aFilterItems : aFilterItemsObj,
                sSelectedItemKey : "",
                onFilterSelected : function(sKey) {
                	var aFilter = [];
                	var aSorter = [];
                	if(sKey === ""){
                		aFilter = s2Controller.setFilter();
                	}
                	else{
                	var oFilter = new sap.ui.model.Filter( "OTC", "EQ", sKey );
                	aFilter.push(oFilter);
                }
                	s2Controller.aFilter = aFilter;
                	if(s2Controller.sFilterPattern !== ""){
                		s2Controller.getList().setGrowingThreshold(9999);
                		//s2Controller._oControlStore.oMasterSearchField.setValue("");
                	}
                	
                	s2Controller.getList().bindItems("/ChangeRequestCollection", s2Controller.getView().byId("MAIN_LIST_ITEM"), aSorter , aFilter);
                	s2Controller.registerMasterListBind();				                	
                	s2Controller._oApplicationImplementation.oMHFHelper.setMasterTitle(s2Controller,s2Controller.vTotalCount);
                	s2Controller.vFilterKey = sKey;
                	s2Controller.vEventReason = 'Filter';
                	jQuery.sap.log.info(sKey + " has been selected");
                	if(sKey!==""){
                		s2Controller.isListComplete = "";
                	}
                	if(s2Controller.sFilterPattern !== ""){
                		s2Controller.vEventReasonsReason = 'Filter';
                		s2Controller.applySearchPattern(s2Controller.sFilterPattern);
                	}
                }
			}
		};
	},

	onUpdateStarted: function (oEvent) {
		var oList = oEvent.getSource();
		var sNoDataText = this.oApplicationFacade.getResourceBundle().getText("XMSG_LOADING");
		oList.setNoDataText(sNoDataText);
	},

	onUpdateFinished: function (oEvent) {
		if(sap.ui.Device.system.phone && oEvent.getParameters().reason === "Refresh" && this.vEventReason === ""  ){
            this.loadCompleteData();
            return;                 
		}
		var oList = "";
		var noDataText= "";
		if( oEvent.getParameters().reason === "Growing"){
			//Set the Count in the header to total Count
			this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);			
		}
		else{
			//An application level Request Reason variable had to be created as the framework
			//would supply Event Reason as "Refresh" itself in all the below cases.
			if (oEvent.getParameters().reason === "Refresh"){	
				if(this.vEventReason === ''){ 
					//Actual Refresh Button Clicked					
					this._oControlStore.oMasterSearchField.setValue("");                       
					this.onRefresh(this.oSorter, this.oFilter);
					this.isListComplete = '';
					//Destroy Info Tool Bar
					oList = oEvent.getSource();
					try{
						oList.destroyInfoToolbar();
					}catch(err){}
				}
				else if (this.vEventReason === 'ListRefreshed'){
					//Do Nothing - List is already Refreshed
					this.vEventReason = "";
				}
				else if(this.vEventReason === 'Finish'){ 
					//Approve or Reject Clicked.                       
					this.onRefresh();
					this.isListComplete = '';
					sap.ca.scfld.md.controller.ScfldMasterController.prototype.selectFirstItem.call(this);
				}				
				else if(this.vEventReason === 'IntialLoad'){
					//Initial Load of the List
					/*eslint no-unused-expressions: 2*/
					if(navigator.userAgent.indexOf('Trident') !== -1 && navigator.userAgent.indexOf('MSIE') === -1){
						var searchField = "#" + this._oControlStore.oMasterSearchField.getDomRef().firstChild.firstChild.id;			
						$(searchField).focus();
					} 
					oList = oEvent.getSource();
					var sNoDataText = this.oApplicationFacade.getUiLibResourceModel().getText("NO_ITEMS_AVAILABLE");
					oList.setNoDataText(sNoDataText);
					// Pointing to the first item on initial load is required.
					sap.ca.scfld.md.controller.ScfldMasterController.prototype.selectFirstItem.call(this);
					this.vTotalCount = oEvent.getParameter("total");
					this.vEventReason = "";					
				}
				else if(this.vEventReason === 'Filter' || this.vEventReason === 'FindNext'){
					//Filter Applied								
					this.setInfoToolBar(oList, oEvent);
					this._oControlStore.oMasterSearchField.setEnabled(true);
					this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);			

					if(this.vEventReason === 'FindNext'){
						//Reduce one from the total count 
						this.vTotalCount = this.vTotalCount - 1;
						this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);
					}

					this.vEventReason = "";
					this.vEventReasonsReason = "";
				}
				else if(this.vEventReason ==='CompleteLoad'){
					//The count of matching records after search changes to undefined at times. Handling that scenario
					if(this.vSearchCount !== ""){
						if(this.vSearchCount === undefined)
							this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vSearchCount);
						this.vSearchCount = "";
					}
					else if(this.vSearchCount === "9999" || this.vSearchCount === ""){
						this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);
						if(this.vFilterKey !== ""){
							this.setInfoToolBar(oList, oEvent);
						} 
					}
					this.vEventReason = "";
				}
				else if(this.vEventReason === 'Search'){
					//Reset the header count to total count in case search pattern is initial
					if(this.sFilterPattern === ""){
						if(this.vSearchCount !== "9999"){
							this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.getList().getItems().length);
						}
						//If the filter is already set, on search the header count should be the count of the total records and not the 
						//count of the filtered records. Thus, the below manipulation
						//By default, the header count will be the count of the no. of items in list.
						if(this.vFilterKey !== ""){
							this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);
						}
						else if(this.vFilterKey === ""){
							//If the filter key is initial, then the total count is the total no. of items in the list and is current count
							this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.getList().getItems().length);
						}

					}
					if( this.vEventReasonsReason === 'Filter'|| this.vFilterKey !== ""  ){
						this.setInfoToolBar(oList, oEvent);
					}
				}
				//Generic Handling of No Data Text
				if(this.getList().getItems().length === 0 || this.vSearchCount === 0){
					oList = oEvent.getSource();
					noDataText = this.getView().getModel("i18n").getProperty("NO_DATA");
					oList.setNoDataText(noDataText);
				}else{
					oList = oEvent.getSource();
					noDataText = this.getView().getModel("i18n").getProperty("XMSG_LOADING");
					oList.setNoDataText(noDataText);
				}
			}
		}
		this._oControlStore.oMasterSearchField.setEnabled(true);
	},
	
	setInfoToolBar:function(oList, oEvent){
		oList = oEvent.getSource();
		var noDataText = "";
		if(this.vFilterKey !== "" && this.vSearchCount !== 0 ){
			var oBar = new sap.m.Toolbar();
			var vText = new sap.m.Text();
			if(this.vFilterKey === "158")       		
				vText.setText(this.getView().getModel("i18n").getProperty("CCTR") + '(' + oEvent.getParameter("total") + ')');
			else if(this.vFilterKey === "229")
				vText.setText(this.getView().getModel("i18n").getProperty("PCTR") + '(' + oEvent.getParameter("total") + ')');
			else if(this.vFilterKey === "159")
				vText.setText(this.getView().getModel("i18n").getProperty("CUSTOMER") + '(' + oEvent.getParameter("total") + ')');
			else if(this.vFilterKey === "266")
				vText.setText(this.getView().getModel("i18n").getProperty("SUPPLIER") + '(' + oEvent.getParameter("total") + ')');
			else if(this.vFilterKey === "892")
				vText.setText(this.getView().getModel("i18n").getProperty("GL_ACCOUNT") + '(' + oEvent.getParameter("total") + ')');
			else if(this.vFilterKey === "194"){
				vText.setText(this.getView().getModel("i18n").getProperty("MATERIAL") + '(' + oEvent.getParameter("total") + ')');}
			if(oEvent.getParameter("total") === "0"){
				 noDataText = this.getView().getModel("i18n").getProperty("NO_DATA");
				oList.setNoDataText(noDataText);
			}
			else{
				 noDataText = this.getView().getModel("i18n").getProperty("XMSG_LOADING");
				oList.setNoDataText(noDataText);				
			}				
			oBar.addContent(vText);
			oList.setInfoToolbar(oBar);
		} else if( this.vSearchCount === 0){
			if(this._emptyList.hasStyleClass("hiddenList")){			
				this._emptyList.removeStyleClass("hiddenList");
				oList.addStyleClass("hiddenList");
			}	
		} else{
			oList.destroyInfoToolbar();
		}		
	},

	/*
	 * override BaseMasterController method, called when data is downloaded
	 */
	onDataLoaded : function() {
	},

	loadInitialAppData: function(aSorter, aFilter) {
		this.getList().setGrowing(true);
		this.getList().setGrowingScrollToLoad(true);
		this.getList().setGrowingThreshold(10);
		this.registerMasterListBind();
		this.getList().bindItems("/ChangeRequestCollection", this.getView().byId("MAIN_LIST_ITEM"), aSorter, aFilter);
		this.registerMasterListBind();
		//added for on load count of tile reset from 1 ->0
			this.vTotalCount = 0;
						this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);
	},

	deferResolve:function(oEvent,s2Controller){
		s2Controller.deferred.resolve(s2Controller);
	},
	loadCompleteData: function() {
		var aFilter = [];
		var aSorter = [];
		this.getList().setGrowing(true);
		this.getList().setGrowingScrollToLoad(true);
		this.getList().setGrowingThreshold(9999);
		this.getList().setModel(this.getView().getModel());		
		if(this.vFilterKey !==""){    	
			var oFilter = new sap.ui.model.Filter( "OTC", "EQ", this.vFilterKey );
			aFilter.push(oFilter);
		}
		else{
			aFilter = this.setFilter();
		}
		this.getList().bindItems("/ChangeRequestCollection", this.getView().byId("MAIN_LIST_ITEM"), aSorter , aFilter);		
		this.registerMasterListBind();
		this.getView().getModel().attachRequestCompleted(this,this.deferResolve,"");
		this.vEventReason = 'CompleteLoad';
	},

	/*
	 * override ScfldMasterController method, inject SAP__Origin and InstanceID
	 */
	getDetailNavigationParameters : function(oListItem) {
		var oEntry = this.getView().getModel().getProperty(oListItem.getBindingContext().getPath());
		fcg.mdg.approvecrv2.util.DataAccess.setObjectKey(oEntry.ObjectKey);  //set object key to the global variable(used in Detail screen header)
		return {
			contextPath : oListItem.getBindingContext().getPath().substr(1),
			ChangeRequestID : oEntry.ChangeRequestID,
			DataModel : oEntry.DataModel,
			Action : oEntry.Action,
			MainEntity: oEntry.MainEntity,
			NumberOfAttachments:oEntry.NumberOfAttachments,
			NumberOfNotes:oEntry.NumberOfNotes,
			Source: "Master",
			ChangeRequestDesc:encodeURIComponent(oEntry.ChangeRequestDesc)
		};

	},

	applySearchPattern : function(sFilterPattern) {
		//The below statements would be executed only for the first time search is performed.
		//There is a return call to this method on defer resolve as well.
		//This is to make sure the complete list of CRs are present when search is performed.
		this.vEventReason = 'Search';
		this.sFilterPattern = sFilterPattern; //Store the filter Pattern in a global variable
		if(this.isListComplete === ""){
			this._oControlStore.oMasterSearchField.setEnabled(false);
			this.isListComplete = 'X';
			this.loadCompleteData();
			return;
		}		
		var iCount = sap.ca.scfld.md.controller.ScfldMasterController.prototype.applySearchPattern.call(this, sFilterPattern);
		var sKey = (iCount > 0 || sFilterPattern === "") ? "NO_ITEMS_AVAILABLE" : "NO_MATCHING_ITEMS";
		var sNoDataText = this.oApplicationFacade.getUiLibResourceModel().getText(sKey);

		this.getList().setNoDataText(sNoDataText);
		this.vSearchCount = iCount;
		//Set the count to total count if all the characters are removed
		if(sFilterPattern === ""){
			iCount = this.vTotalCount;
		}		
		return iCount;
	},

	displayVisibleSortItems : function() {
		var oConfigItem;
		var bVisible;

		this.aVisibleSortItems = [];
		// Sort item is visible, if
		for (var sSortKey in this.oSortConfig) {
			oConfigItem = this.oSortConfig[sSortKey];
			// - it doesn't have getVisible method, or
			// - has getVisible method and it returns true, or
			bVisible = oConfigItem.getVisible ? oConfigItem.getVisible() : true;
			// - it is the current sort item (this.sSortKey).
			if (bVisible || sSortKey === this.sSortKey) {
				this.aVisibleSortItems.push({
					key: sSortKey,
					text: oConfigItem.text
				});
			}
		}

		this.aVisibleGroupItems = [];
		// Group item's visibility is determined as sort item's
		for (var sGroupKey in this.oGroupConfig) {
			oConfigItem = this.oGroupConfig[sGroupKey];
			bVisible = oConfigItem.getVisible ? oConfigItem.getVisible() : true;
			if (bVisible || sGroupKey === this.sGroupKey) {
				this.aVisibleGroupItems.push({
					key: sGroupKey,
					text: oConfigItem.text
				});
			}
		}

		// Refresh footer.
		this._oApplicationImplementation.oMHFHelper.defineMasterHeaderFooter(this);		
	},

	handleFilter : function(sFilterKey) {
		var oFilter = this.getFilter(sFilterKey);
		this.getList().getBinding("items").filter(oFilter);
	},

	handleSort : function(sSortKey) {
		var aSorters = this.configureSorters({sortKey: sSortKey, groupKey: this.sGroupKey});
		this.getList().getBinding("items").sort(aSorters);
	},

	handleGroup : function(sGroupKey) {
		var aSorters = this.configureSorters({sortKey: this.sSortKey, groupKey: sGroupKey});
		this.getList().getBinding("items").sort(aSorters);
	},

	configureSorters : function(oKeys) {
		var sSortKey;
		var sGroupKey;
		var oSorter;
		var aSorters;
		var vGroup;
		var fnCustomSorter = null;
		var fnCustomGrouper = null;

		aSorters = [];

		sGroupKey = oKeys.groupKey || this.sDefaultGroupKey;
		if (sGroupKey !== this._GROUP_NOGROUP) {
			vGroup = this.oGroupConfig[sGroupKey].formatter || true;
			oSorter = new sap.ui.model.Sorter(sGroupKey, this.oGroupConfig[sGroupKey].descending, vGroup);
			aSorters.push(oSorter);
		}


		// Default sort key if not configured on back-end (see loadInitialAppData).
		sSortKey = oKeys.sortKey || this.sDefaultSortKey;
		// If unknown sort key received from back-end, then we revert to default (see loadInitialAppData)
		if (!this.oSortConfig[sSortKey]) {
			sSortKey = this.sDefaultSortKey;
		}
		oSorter = new sap.ui.model.Sorter(sSortKey, this.oSortConfig[sSortKey].descending);
		aSorters.push(oSorter);


		// Client-side sorting needed for the following special cases:
		//  - CompletionDeadLine (ascending), and
		//  - Priority (descending).

		if (oKeys.sortKey === this._SORT_COMPLETIONDEADLINE)
			fnCustomSorter = this.completionDeadLineSorter;
		else if (oKeys.sortKey === this._SORT_PRIORITY)
			fnCustomSorter = this.prioritySorter;

		if (oKeys.groupKey === this._SORT_COMPLETIONDEADLINE)
			fnCustomGrouper = this.completionDeadLineSorter;
		else if (oKeys.groupKey === this._SORT_PRIORITY)
			fnCustomGrouper = this.prioritySorter;

		var oModel = this.getView().getModel();

		oModel.extFnCustomSorter = fnCustomSorter ? $.proxy(fnCustomSorter, this) : null;
		oModel.extFnCustomGrouper = fnCustomGrouper ? $.proxy(fnCustomGrouper, this) : null;
		oModel.extSGroupingProperty = sGroupKey !== this._GROUP_NOGROUP ? sGroupKey : null;

		this.sSortKey = sSortKey;
		this.sGroupKey = sGroupKey;

		return aSorters;
	},

	isBackendDefaultSortKeyEqualsTo: function (sSortKey) {
		return (this.sBackendDefaultSortKey === sSortKey);
	},

	completionDeadLineSorter: function (oItem1, oItem2) {
		if (!oItem1[this._SORT_COMPLETIONDEADLINE]) {
			return 1;
		}
		if (!oItem2[this._SORT_COMPLETIONDEADLINE]) {
			return -1;
		}
		return (oItem1[this._SORT_COMPLETIONDEADLINE] - oItem2[this._SORT_COMPLETIONDEADLINE]);
	},

	prioritySorter: function(oItem1, oItem2) {
		var sPrio1 = oItem1[this._SORT_PRIORITY];
		var sPrio2 = oItem2[this._SORT_PRIORITY];

		var iPrio1 = this._PRIO_UNKNOWN;
		var iPrio2 = this._PRIO_UNKNOWN;

		if ((sPrio1 !== null) && (sPrio1 in this._PRIO_MAPPING))
			iPrio1 = this._PRIO_MAPPING[sPrio1];
		if ((sPrio2 !== null) && (sPrio2 in this._PRIO_MAPPING))
			iPrio2 = this._PRIO_MAPPING[sPrio2];

		return (iPrio1 - iPrio2);
	},

	getFilter : function(sFilterKey) {
		var oFilter = null;
		var oCustomFilter = null;

		/**
		 * @ControllerHook Implement a custom filter
		 * This hook method can be used to replace the standard filter by a custom one based on the filterKey
		 * It is called when a filter option is selected on the UI.
		 * @callback fcg.mdg.approvemasterdata.view.S2~extHookGetCustomFilter
		 * @param {string} sFilterKey
		 * @return {sap.ui.model.Filter} oFilter
		 */
		if (this.extHookGetCustomFilter) {
			oCustomFilter = this.extHookGetCustomFilter(sFilterKey);
		}

		return oCustomFilter ? oCustomFilter : oFilter;
	},

	isLiveSearch: function(){
		return false;
	}

});