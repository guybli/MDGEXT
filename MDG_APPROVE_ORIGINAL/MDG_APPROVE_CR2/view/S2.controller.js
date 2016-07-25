/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");sap.ca.scfld.md.controller.ScfldMasterController.extend("fcg.mdg.approvecrv2.view.S2",{extHookChangeFilterItems:null,extHookChangeSortConfig:null,extHookChangeGroupConfig:null,extHookGetCustomFilter:null,oObjectKey:"",aItemContextPathsToSelect:[],vFilterKey:"",isListComplete:"",deferred:"",sFilterPattern:"",vSearchCount:"",vTotalCount:"",vEventReason:"",isLiveSearchEnabled:"",aSorter:"",aFilter:"",vEventReasonsReason:"",vApprovePopup:"",vRemoveProcessedCR:"",sFilters:"",otcs:"",initializeLayout:function(){var s=this;var q="ChangeRequestCollection?$top=1&$skip=0&$filter=OTC eq '158' or OTC eq '159' or OTC eq '194' or OTC eq '229' or OTC eq '266' or OTC eq '892'";var d=jQuery.Deferred();s.aFilter=this.setFilter();d.then(function(s){s.loadInitialAppData(s.aSorter,s.aFilter);});this.getView().getModel().read(q,null,null,true,function(r,a){s.sFilters=a.headers.filters;if(r.results[0]!==undefined){d.resolve(s);fcg.mdg.approvecrv2.util.DataAccess.setRelevantEntitiesForCR(r.results[0].ChangeRequestID,r.results[0].ObjectList);var n=parseInt(r.results[0].NumberOfAttachments);s.oRouter.navTo("detail",{contextPath:r.results[0].__metadata.uri.split('MDG_APPROVE_CR/')[1],ChangeRequestID:r.results[0].ChangeRequestID,DataModel:r.results[0].DataModel,Action:r.results[0].Action,NumberOfAttachments:n,NumberOfNotes:parseInt(r.results[0].NumberOfNotes),MainEntity:r.results[0].MainEntity,Source:"Master",ChangeRequestDesc:encodeURIComponent(r.results[0].ChangeRequestDesc)});d.promise();}else{sap.ca.scfld.md.controller.ScfldMasterController.prototype.navToEmptyView.call(s);s.vTotalCount=0;s._oApplicationImplementation.oMHFHelper.setMasterTitle(s,s.vTotalCount);}});this.deferred=jQuery.Deferred();this.deferred.then(function(s){s.getView().getController().registerMasterListBind();});},setFilter:function(){var f=[];var F=new sap.ui.model.Filter("OTC","EQ",'194');f.push(F);F=new sap.ui.model.Filter("OTC","EQ",'158');f.push(F);F=new sap.ui.model.Filter("OTC","EQ",'159');f.push(F);F=new sap.ui.model.Filter("OTC","EQ",'229');f.push(F);F=new sap.ui.model.Filter("OTC","EQ",'266');f.push(F);F=new sap.ui.model.Filter("OTC","EQ",'892');f.push(F);return f;},onInit:function(){this.getView().getModel().attachRequestSent(jQuery.proxy(this.handleMasterRequestSent,this));this.getView().getModel().attachRequestCompleted(jQuery.proxy(this.handleMasterRequestCompleted,this));this.getView().getModel().attachRequestFailed(jQuery.proxy(this.handleRequestFailed,this));this.vEventReason='IntialLoad';this.initializeLayout();if(!this.oDataManager){fcg.mdg.approvecrv2.util.DataAccess.initialize(this);var c=sap.ui.core.Component.getOwnerIdFor(this.getView());var m=sap.ui.component(c);if(m&&m.getComponentData()&&m.getComponentData().startupParameters){if(m.getComponentData().startupParameters.APPROVE_POPUP!==undefined){this.vApprovePopup=m.getComponentData().startupParameters.APPROVE_POPUP[0];}if(m.getComponentData().startupParameters.REMOVE_PROCESSED_CR!==undefined){this.vRemoveProcessedCR=m.getComponentData().startupParameters.REMOVE_PROCESSED_CR[0];}}if(!this.oApplicationFacade.isMock()){fcg.mdg.approvecrv2.util.DataAccess.setApprovePopup(this.vApprovePopup);fcg.mdg.approvecrv2.util.DataAccess.setRemoveProcessedCR(this.vRemoveProcessedCR);}}},onRefresh:function(){if(this.aFilter===""){this.aFilter=this.setFilter();}jQuery.proxy(this.loadInitialAppData(this.aSorter,this.aFilter),this);this.vEventReason='ListRefreshed';},handleRequestFailed:function(){var l=this.getList();var n=this.oApplicationFacade.getUiLibResourceModel().getText("NO_ITEMS_AVAILABLE");l.setNoDataText(n);},handleMasterRequestSent:function(){},handleMasterRequestCompleted:function(){if(this.bDisplaySortOption)this.displayVisibleSortItems();var l=this.getList();if(l.getItems().length===0){this.navToEmptyView();this.oRouter.navTo("master",null,true);return;}var s=this.getView().byId("list");var i=-1;if(this.aItemContextPathsToSelect.length===0){this._selectItemByCtxtPath();}else{var I=false;for(var c in this.aItemContextPathsToSelect){var C=this.aItemContextPathsToSelect[c];for(var L in s.getItems()){if(s.getItems()[L].getBindingContextPath()===C){i=L;I=true;break;}}if(I){this.setListItem(s.getItems()[i]);this.aItemContextPathsToSelect=[];break;}}if(!I){if(this.aItemContextPathsToSelect.length===2&&this.aItemContextPathsToSelect[0]===this.aItemContextPathsToSelect[1]){this.setListItem(s.getItems()[s.getItems().length-1]);}this._selectItemByCtxtPath();}}},iconFormatter:function(v){if(v===""||v===null||v===undefined)return"";if(v==='CREATE')return"sap-icon://create";else return"";},crIdFormatter:function(c,C){if(c===""||c===null||c===undefined||C===""||C===null||C===undefined)return"";return this.getView().getModel("i18n").getProperty("ChangeRequest")+": "+c+" ("+C+")";},requestedBy:function(c){if(c===""||c===null||c===undefined)return"";else return this.getView().getModel("i18n").getProperty("RequestedBy")+": "+c;},s2EntityText:function(a,c){if(a==='CREATE'&&c==='159'){return this.getView().getModel("i18n").getProperty("Newcustomer");}else if(a==='CHANGE'&&c==='159'){return this.getView().getModel("i18n").getProperty("Changedcustomer");}else if(a==='CREATE'&&c==='158'){return this.getView().getModel("i18n").getProperty("CC_CCTRCCTRN");}else if(a==='CHANGE'&&c==='158'){return this.getView().getModel("i18n").getProperty("Changedcostcenter");}else if(a==='CREATE'&&c==='229'){return this.getView().getModel("i18n").getProperty("PC_NPC_ID");}else if(a==='CHANGE'&&c==='229'){return this.getView().getModel("i18n").getProperty("Changedprofitcenter");}else if(a==='CREATE'&&c==='266'){return this.getView().getModel("i18n").getProperty("Newsupplier");}else if(a==='CHANGE'&&c==='266'){return this.getView().getModel("i18n").getProperty("Changedsupplier");}else if(a==='CREATE'&&c==='892'){return this.getView().getModel("i18n").getProperty("NewGLA");}else if(a==='CHANGE'&&c==='892'){return this.getView().getModel("i18n").getProperty("ChangedGLA");}else if(a==='CREATE'&&c==='194'){return this.getView().getModel("i18n").getProperty("New_Material");}else if(a==='CHANGE'&&c==='194'){return this.getView().getModel("i18n").getProperty("Changed_Material");}},_selectItemByCtxtPath:function(){if(this.sBindingContextPath){var i=this.findItemByContextPath(this.sBindingContextPath);if(i){this.setListItem(i);}else{this.selectFirstItem();}}},findNextVisibleItem:function(m,c){var t="";try{var C=new sap.ui.model.context(m,c);}catch(e){C=c;}var s=this.getView().byId("list");var i=-1;var I=-1;this.aItemContextPathsToSelect=[];for(var l in s.getItems()){var a=s.getItems()[l].getBindingContextPath();if(a===C){i=l;var A=s.getItems()[i].getBindingContextPath();t=i;this.aItemContextPathsToSelect.push(A);}if((s.getItems()[l].getVisible())&&((I<=i)||(i===-1))){I=l;}}if((I===-1)&&(s.getItems().length>0)){I=0;}if(I>=0){this.aItemContextPathsToSelect.push(s.getItems()[I].getBindingContextPath());}this.vEventReason='FindNext';return t;},overrideMHFHelperSetMasterTitle:function(){sap.ca.scfld.md.app.Application.getImpl().oMHFHelper.setMasterTitle=function(c,C){if(!c._oControlStore.oMasterTitle){return;}var o=sap.ca.scfld.md.app.Application.getImpl().getComponent();this.oDataManager=o.getDataManager();if(!this.oDataManager){return;}if(!this.oDataManager.getScenarioConfig()||!this.oDataManager.getScenarioConfig().DisplayName){var b=this.oApplicationImplementation.AppI18nModel.getResourceBundle();this.sTitle=b.getText(c._oHeaderFooterOptions.sI18NMasterTitle,[C]);}else{this.sTitle=this.oDataManager.getScenarioConfig().DisplayName+" ("+C+")";}c._oControlStore.oMasterTitle.setText(this.sTitle);};},applySearchPatternToListItem:function(i,f){f=f.trim();if((i.getIntro()&&i.getIntro().toLowerCase().indexOf(f)!==-1)||(i.getTitle()&&i.getTitle().toLowerCase().indexOf(f)!==-1)||(i.getNumber()&&i.getNumber().toLowerCase().indexOf(f)!==-1)||(i.getNumberUnit()&&i.getNumberUnit().toLowerCase().indexOf(f)!==-1)||(i.getFirstStatus()&&i.getFirstStatus().getText().toLowerCase().indexOf(f)!==-1)||(i.getSecondStatus()&&i.getSecondStatus().getText().toLowerCase().indexOf(f)!==-1)){return true;}var a=i.getAttributes();for(var j=0;j<a.length;j++){if(a[j].getText().toLowerCase().indexOf(f)!==-1){return true;}}return false;},getHeaderFooterOptions:function(){var s=this;var f=[];var o={};o["None"]={text:this.getView().getModel("i18n").getProperty("NONE"),key:""};o["CCTR"]={text:this.getView().getModel("i18n").getProperty("CCTR"),key:"158"};o["PCTR"]={text:this.getView().getModel("i18n").getProperty("PCTR"),key:"229"};o["CUSTOMER"]={text:this.getView().getModel("i18n").getProperty("CUSTOMER"),key:"159"};o["SUPPLIER"]={text:this.getView().getModel("i18n").getProperty("SUPPLIER"),key:"266"};o["GLA"]={text:this.getView().getModel("i18n").getProperty("GL_ACCOUNT"),key:"892"};o["MATERIAL"]={text:this.getView().getModel("i18n").getProperty("MATERIAL"),key:"194"};if(this.sFilters!==undefined){this.otcs=this.sFilters.split('/');f=[];f.push(o["None"]);for(var i=0;i<this.otcs.length;i++){switch(this.otcs[i]){case"158":f.push(o["CCTR"]);break;case"229":f.push(o["PCTR"]);break;case"159":f.push(o["CUSTOMER"]);break;case"266":f.push(o["SUPPLIER"]);break;case"194":f.push(o["MATERIAL"]);break;case"892":f.push(o["GLA"]);break;default:}}}else{f.push(o["None"]);f.push(o["CCTR"]);f.push(o["PCTR"]);f.push(o["CUSTOMER"]);f.push(o["SUPPLIER"]);f.push(o["MATERIAL"]);f.push(o["GLA"]);}return{sI18NMasterTitle:this.getView().getModel("i18n").getProperty("MASTER_TITLE",[0]),onBack:"",oFilterOptions:{aFilterItems:f,sSelectedItemKey:"",onFilterSelected:function(k){var F=[];var S=[];if(k===""){F=s.setFilter();}else{var a=new sap.ui.model.Filter("OTC","EQ",k);F.push(a);}s.aFilter=F;if(s.sFilterPattern!==""){s.getList().setGrowingThreshold(9999);}s.getList().bindItems("/ChangeRequestCollection",s.getView().byId("MAIN_LIST_ITEM"),S,F);s.registerMasterListBind();s._oApplicationImplementation.oMHFHelper.setMasterTitle(s,s.vTotalCount);s.vFilterKey=k;s.vEventReason='Filter';jQuery.sap.log.info(k+" has been selected");if(k!==""){s.isListComplete="";}if(s.sFilterPattern!==""){s.vEventReasonsReason='Filter';s.applySearchPattern(s.sFilterPattern);}}}};},onUpdateStarted:function(e){var l=e.getSource();var n=this.oApplicationFacade.getResourceBundle().getText("XMSG_LOADING");l.setNoDataText(n);},onUpdateFinished:function(e){if(sap.ui.Device.system.phone&&e.getParameters().reason==="Refresh"&&this.vEventReason===""){this.loadCompleteData();return;}var l="";var n="";if(e.getParameters().reason==="Growing"){this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);}else{if(e.getParameters().reason==="Refresh"){if(this.vEventReason===''){this._oControlStore.oMasterSearchField.setValue("");this.onRefresh(this.oSorter,this.oFilter);this.isListComplete='';l=e.getSource();try{l.destroyInfoToolbar();}catch(a){}}else if(this.vEventReason==='ListRefreshed'){this.vEventReason="";}else if(this.vEventReason==='Finish'){this.onRefresh();this.isListComplete='';sap.ca.scfld.md.controller.ScfldMasterController.prototype.selectFirstItem.call(this);}else if(this.vEventReason==='IntialLoad'){if(navigator.userAgent.indexOf('Trident')!==-1&&navigator.userAgent.indexOf('MSIE')===-1){var s="#"+this._oControlStore.oMasterSearchField.getDomRef().firstChild.firstChild.id;$(s).focus();}l=e.getSource();var N=this.oApplicationFacade.getUiLibResourceModel().getText("NO_ITEMS_AVAILABLE");l.setNoDataText(N);sap.ca.scfld.md.controller.ScfldMasterController.prototype.selectFirstItem.call(this);this.vTotalCount=e.getParameter("total");this.vEventReason="";}else if(this.vEventReason==='Filter'||this.vEventReason==='FindNext'){this.setInfoToolBar(l,e);this._oControlStore.oMasterSearchField.setEnabled(true);this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);if(this.vEventReason==='FindNext'){this.vTotalCount=this.vTotalCount-1;this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);}this.vEventReason="";this.vEventReasonsReason="";}else if(this.vEventReason==='CompleteLoad'){if(this.vSearchCount!==""){if(this.vSearchCount===undefined)this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vSearchCount);this.vSearchCount="";}else if(this.vSearchCount==="9999"||this.vSearchCount===""){this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);if(this.vFilterKey!==""){this.setInfoToolBar(l,e);}}this.vEventReason="";}else if(this.vEventReason==='Search'){if(this.sFilterPattern===""){if(this.vSearchCount!=="9999"){this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.getList().getItems().length);}if(this.vFilterKey!==""){this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);}else if(this.vFilterKey===""){this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.getList().getItems().length);}}if(this.vEventReasonsReason==='Filter'||this.vFilterKey!==""){this.setInfoToolBar(l,e);}}if(this.getList().getItems().length===0||this.vSearchCount===0){l=e.getSource();n=this.getView().getModel("i18n").getProperty("NO_DATA");l.setNoDataText(n);}else{l=e.getSource();n=this.getView().getModel("i18n").getProperty("XMSG_LOADING");l.setNoDataText(n);}}}this._oControlStore.oMasterSearchField.setEnabled(true);},setInfoToolBar:function(l,e){l=e.getSource();var n="";if(this.vFilterKey!==""&&this.vSearchCount!==0){var b=new sap.m.Toolbar();var t=new sap.m.Text();if(this.vFilterKey==="158")t.setText(this.getView().getModel("i18n").getProperty("CCTR")+'('+e.getParameter("total")+')');else if(this.vFilterKey==="229")t.setText(this.getView().getModel("i18n").getProperty("PCTR")+'('+e.getParameter("total")+')');else if(this.vFilterKey==="159")t.setText(this.getView().getModel("i18n").getProperty("CUSTOMER")+'('+e.getParameter("total")+')');else if(this.vFilterKey==="266")t.setText(this.getView().getModel("i18n").getProperty("SUPPLIER")+'('+e.getParameter("total")+')');else if(this.vFilterKey==="892")t.setText(this.getView().getModel("i18n").getProperty("GL_ACCOUNT")+'('+e.getParameter("total")+')');else if(this.vFilterKey==="194"){t.setText(this.getView().getModel("i18n").getProperty("MATERIAL")+'('+e.getParameter("total")+')');}if(e.getParameter("total")==="0"){n=this.getView().getModel("i18n").getProperty("NO_DATA");l.setNoDataText(n);}else{n=this.getView().getModel("i18n").getProperty("XMSG_LOADING");l.setNoDataText(n);}b.addContent(t);l.setInfoToolbar(b);}else if(this.vSearchCount===0){if(this._emptyList.hasStyleClass("hiddenList")){this._emptyList.removeStyleClass("hiddenList");l.addStyleClass("hiddenList");}}else{l.destroyInfoToolbar();}},onDataLoaded:function(){},loadInitialAppData:function(s,f){this.getList().setGrowing(true);this.getList().setGrowingScrollToLoad(true);this.getList().setGrowingThreshold(10);this.registerMasterListBind();this.getList().bindItems("/ChangeRequestCollection",this.getView().byId("MAIN_LIST_ITEM"),s,f);this.registerMasterListBind();this.vTotalCount=0;this._oApplicationImplementation.oMHFHelper.setMasterTitle(this,this.vTotalCount);},deferResolve:function(e,s){s.deferred.resolve(s);},loadCompleteData:function(){var f=[];var s=[];this.getList().setGrowing(true);this.getList().setGrowingScrollToLoad(true);this.getList().setGrowingThreshold(9999);this.getList().setModel(this.getView().getModel());if(this.vFilterKey!==""){var F=new sap.ui.model.Filter("OTC","EQ",this.vFilterKey);f.push(F);}else{f=this.setFilter();}this.getList().bindItems("/ChangeRequestCollection",this.getView().byId("MAIN_LIST_ITEM"),s,f);this.registerMasterListBind();this.getView().getModel().attachRequestCompleted(this,this.deferResolve,"");this.vEventReason='CompleteLoad';},getDetailNavigationParameters:function(l){var e=this.getView().getModel().getProperty(l.getBindingContext().getPath());fcg.mdg.approvecrv2.util.DataAccess.setObjectKey(e.ObjectKey);return{contextPath:l.getBindingContext().getPath().substr(1),ChangeRequestID:e.ChangeRequestID,DataModel:e.DataModel,Action:e.Action,MainEntity:e.MainEntity,NumberOfAttachments:e.NumberOfAttachments,NumberOfNotes:e.NumberOfNotes,Source:"Master",ChangeRequestDesc:encodeURIComponent(e.ChangeRequestDesc)};},applySearchPattern:function(f){this.vEventReason='Search';this.sFilterPattern=f;if(this.isListComplete===""){this._oControlStore.oMasterSearchField.setEnabled(false);this.isListComplete='X';this.loadCompleteData();return;}var c=sap.ca.scfld.md.controller.ScfldMasterController.prototype.applySearchPattern.call(this,f);var k=(c>0||f==="")?"NO_ITEMS_AVAILABLE":"NO_MATCHING_ITEMS";var n=this.oApplicationFacade.getUiLibResourceModel().getText(k);this.getList().setNoDataText(n);this.vSearchCount=c;if(f===""){c=this.vTotalCount;}return c;},displayVisibleSortItems:function(){var c;var v;this.aVisibleSortItems=[];for(var s in this.oSortConfig){c=this.oSortConfig[s];v=c.getVisible?c.getVisible():true;if(v||s===this.sSortKey){this.aVisibleSortItems.push({key:s,text:c.text});}}this.aVisibleGroupItems=[];for(var g in this.oGroupConfig){c=this.oGroupConfig[g];v=c.getVisible?c.getVisible():true;if(v||g===this.sGroupKey){this.aVisibleGroupItems.push({key:g,text:c.text});}}this._oApplicationImplementation.oMHFHelper.defineMasterHeaderFooter(this);},handleFilter:function(f){var F=this.getFilter(f);this.getList().getBinding("items").filter(F);},handleSort:function(s){var S=this.configureSorters({sortKey:s,groupKey:this.sGroupKey});this.getList().getBinding("items").sort(S);},handleGroup:function(g){var s=this.configureSorters({sortKey:this.sSortKey,groupKey:g});this.getList().getBinding("items").sort(s);},configureSorters:function(k){var s;var g;var S;var a;var G;var c=null;var C=null;a=[];g=k.groupKey||this.sDefaultGroupKey;if(g!==this._GROUP_NOGROUP){G=this.oGroupConfig[g].formatter||true;S=new sap.ui.model.Sorter(g,this.oGroupConfig[g].descending,G);a.push(S);}s=k.sortKey||this.sDefaultSortKey;if(!this.oSortConfig[s]){s=this.sDefaultSortKey;}S=new sap.ui.model.Sorter(s,this.oSortConfig[s].descending);a.push(S);if(k.sortKey===this._SORT_COMPLETIONDEADLINE)c=this.completionDeadLineSorter;else if(k.sortKey===this._SORT_PRIORITY)c=this.prioritySorter;if(k.groupKey===this._SORT_COMPLETIONDEADLINE)C=this.completionDeadLineSorter;else if(k.groupKey===this._SORT_PRIORITY)C=this.prioritySorter;var m=this.getView().getModel();m.extFnCustomSorter=c?$.proxy(c,this):null;m.extFnCustomGrouper=C?$.proxy(C,this):null;m.extSGroupingProperty=g!==this._GROUP_NOGROUP?g:null;this.sSortKey=s;this.sGroupKey=g;return a;},isBackendDefaultSortKeyEqualsTo:function(s){return(this.sBackendDefaultSortKey===s);},completionDeadLineSorter:function(i,I){if(!i[this._SORT_COMPLETIONDEADLINE]){return 1;}if(!I[this._SORT_COMPLETIONDEADLINE]){return-1;}return(i[this._SORT_COMPLETIONDEADLINE]-I[this._SORT_COMPLETIONDEADLINE]);},prioritySorter:function(i,I){var p=i[this._SORT_PRIORITY];var P=I[this._SORT_PRIORITY];var a=this._PRIO_UNKNOWN;var b=this._PRIO_UNKNOWN;if((p!==null)&&(p in this._PRIO_MAPPING))a=this._PRIO_MAPPING[p];if((P!==null)&&(P in this._PRIO_MAPPING))b=this._PRIO_MAPPING[P];return(a-b);},getFilter:function(f){var F=null;var c=null;if(this.extHookGetCustomFilter){c=this.extHookGetCustomFilter(f);}return c?c:F;},isLiveSearch:function(){return false;}});