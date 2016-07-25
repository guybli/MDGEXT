/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");jQuery.sap.require("sap.ca.ui.message.message");jQuery.sap.require("sap.ca.ui.model.type.DateTime");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange");sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.CompanyCodeDetail",{compCode:"",oItemTemp:"",oCompCodeDetails:"",oSalesDetail:"",bindingContext:"",sPath:"",oS3Instance:"",subheader:"",extHooknavtoDetail:null,extHookModifyStyleClass:null,extHookWithhldTable:null,extHookDunningTable:null,extHookdisplayCompCodedata:null,changerequestId:"",onInit:function(){var d="";var a="";var r="";var s="text_bold";this.getView().byId("companyCodePage").removeStyleClass(s);this.getView().byId("companyCodePage").setShowNavButton(true);this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="CompCode"){this.oS3Instance=fcg.mdg.approvecrv2.DomainSpecParts.Customer.getS3Instance();d=this.oS3Instance.getDecisions();this.oS3Instance.createDecisionButtons(d,this,'navFromDetail');a=e.getParameter("arguments");this.CompCode=a.Key;this.changerequestId=a.ChangeRequestID;this.contextPath=a.contextPath;r=fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();fcg.mdg.approvecrv2.DomainSpecParts.Customer.setRouter(this.oRouter);fcg.mdg.approvecrv2.DomainSpecParts.Customer.setContextPath(this.changerequestId);fcg.mdg.approvecrv2.DomainSpecParts.Customer.setChangeRequest(this.contextPath);this.result=r;if(this.oS3Instance.oCompCodeCreateForm!==""){this.oS3Instance.oCompCodeCreateForm.destroy();}if(this.oS3Instance.oCompCodeDetails===""){this.oS3Instance.oCompCodeDetails=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CompanyCodeDetail',fcg.mdg.approvecrv2.util.Formatter);if(this.oS3Instance.oSuppCompCodeDetails!==undefined){this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oSuppCompCodeDetails);}}else{if(this.oS3Instance.oSuppCompCodeDetails!==undefined){this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oSuppCompCodeDetails);}this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oCompCodeDetails);if(this.oS3Instance.oCompCodeDetails!==undefined){this.oS3Instance.oCompCodeDetails.destroy();}this.oS3Instance.oCompCodeDetails=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.CompanyCodeDetail',fcg.mdg.approvecrv2.util.Formatter);}this.getView().byId("CompCodeForm").addContent(this.oS3Instance.oCompCodeDetails);this.displayCompCodedata(r);if(this.extHookdisplayCompCodedata){this.extHookdisplayCompCodedata(r);}}if(e.getParameter("name")==="SuppCompCode"){this.oS3Instance=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();d=this.oS3Instance.getDecisions();this.oS3Instance.createDecisionButtons(d,this,'navFromDetail');a=e.getParameter("arguments");this.CompCode=a.Key;this.changerequestId=a.ChangeRequestID;this.contextPath=a.contextPath;r=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setRouter(this.oRouter);fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setContextPath(this.changerequestId);fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setChangeRequest(this.contextPath);this.result=r;if(this.oS3Instance.oSuppCompCodeCreateForm!==""){this.oS3Instance.oSuppCompCodeCreateForm.destroy();}if(this.oS3Instance.oSuppCompCodeDetails===""){this.oS3Instance.oSuppCompCodeDetails=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SupplierCompanyCodeDetail',fcg.mdg.approvecrv2.util.Formatter);if(this.oS3Instance.oCompCodeDetails!==undefined){this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oCompCodeDetails);}}else{if(this.oS3Instance.oCompCodeDetails!==undefined){this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oCompCodeDetails);}this.getView().byId("CompCodeForm").removeContent(this.oS3Instance.oSuppCompCodeDetails);if(this.oS3Instance.oSuppCompCodeDetails!==undefined){this.oS3Instance.oSuppCompCodeDetails.destroy();}this.oS3Instance.oSuppCompCodeDetails=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.SupplierCompanyCodeDetail',fcg.mdg.approvecrv2.util.Formatter);}this.getView().byId("CompCodeForm").addContent(this.oS3Instance.oSuppCompCodeDetails);this.displaySuppCompCodedata(r);}},this);},getDunningTemplate:function(m){var i=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.Text({text:{path:"Id",formatter:function(){var d=m.getProperty("DunningAreaDeleted",this.getBindingContext());fcg.mdg.approvecrv2.util.Formatter.handleCellBoldingDunningTax(this,m,"MABER");if(d){this.addStyleClass("sapThemeText");}return m.getProperty("Id",this.getBindingContext());}}})]});if(this.extHookDunningTable){i=this.extHookDunningTable(m);}return i;},getWithTaxTemplate:function(m){var i=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.Text({text:{path:"Id",formatter:function(){fcg.mdg.approvecrv2.util.Formatter.handleCellBoldingDunningTax(this,m,"WITHT");return m.getProperty("Id",this.getBindingContext());}}})]});if(this.extHookWithhldTable){i=this.extHookWithhldTable(m);}return i;},navtoSuppDunningDetail:function(e,E){this.result=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getNavData();fcg.mdg.approvecrv2.DomainSpecParts.Supplier.setNavData(this.result);this.oRouter=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getRouter();this.changerequestId=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getchangeRequest();this.contextPath=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getContextPath();if(E.Dunning!==""&&E.withhld===""){this.oRouter.navTo("SuppDunning",{ChangeRequestID:this.changerequestId,contextPath:this.contextPath,Key:E.Dunning});}if(E.Dunning===""&&E.withhld!==""){this.oRouter.navTo("SuppWithhldtax",{ChangeRequestID:this.changerequestId,contextPath:this.contextPath,Key:E.withhld});}},navtoDunningDetail:function(e){this.bindingContext=e.getSource("listItem").getBindingContext();if(this.bindingContext!==undefined){this.sPath=e.getSource("listItem").getBindingContext().sPath;}else{this.bindingContext=e.getParameter("listItem").getBindingContext();this.sPath=e.getParameter("listItem").getBindingContext().sPath;}var p="";p=this.sPath.split("/");var a=this.bindingContext.oModel.oData.dataitems[p[2]];if(a.Entity==="Supp"){this.navtoSuppDunningDetail(e,a);}else{this.result=fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(this.result);this.oRouter=fcg.mdg.approvecrv2.DomainSpecParts.Customer.getRouter();this.changerequestId=fcg.mdg.approvecrv2.DomainSpecParts.Customer.getchangeRequest();this.contextPath=fcg.mdg.approvecrv2.DomainSpecParts.Customer.getContextPath();if(a.Dunning!==""&&a.withhld===""){this.oRouter.navTo("Dunning",{ChangeRequestID:this.changerequestId,contextPath:this.contextPath,Key:a.Dunning});}if(a.Dunning===""&&a.withhld!==""){this.oRouter.navTo("Withhldtax",{ChangeRequestID:this.changerequestId,contextPath:this.contextPath,Key:a.withhld});}}if(this.extHooknavtoDetail){this.extHooknavtoDetail(a,p);}},navtoExtTaxDetail:function(e){this.bindingContext=e.getSource("listItem").getBindingContext();if(this.bindingContext!==undefined){this.sPath=e.getSource("listItem").getBindingContext().sPath;}else{this.bindingContext=e.getParameter("listItem").getBindingContext();this.sPath=e.getParameter("listItem").getBindingContext().sPath;}var p="";p=this.sPath.split("/");var a=this.bindingContext.oModel.oData.dataitems[p[2]];this.result=fcg.mdg.approvecrv2.DomainSpecParts.Customer.getNavData();fcg.mdg.approvecrv2.DomainSpecParts.Customer.setNavData(this.result);this.oRouter=fcg.mdg.approvecrv2.DomainSpecParts.Customer.getRouter();this.changerequestId=fcg.mdg.approvecrv2.DomainSpecParts.Customer.getchangeRequest();this.contextPath=fcg.mdg.approvecrv2.DomainSpecParts.Customer.getContextPath();if(a.Dunning===""&&a.withhld!==""&&a.Entity==="Supp"){this.oRouter=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getRouter();this.changerequestId=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getchangeRequest();this.contextPath=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getContextPath();this.oRouter.navTo("SuppWithhldtax",{ChangeRequestID:this.changerequestId,contextPath:this.contextPath,Key:a.withhld});}else{this.oRouter.navTo("Withhldtax",{ChangeRequestID:this.changerequestId,contextPath:this.contextPath,Key:a.withhld});}},displayCompCodedata:function(r){var e="";var m="";var s="";var k="";var a="";var D="";var C="";for(var i=0;i<r.results.length;i++){if(r.results.length>1){var b="";if(!this.isNull(r.results[i].CU_AssignedCustomerRel)){var c=r.results[i].CU_AssignedCustomerRel;if(!this.isNull(c.KTOKD)&&!this.isNull(c.KTOKD__TXT)){b=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(c.KTOKD,c.KTOKD__TXT);}}this.subheader=fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getSubheaderWithAccGrp(r.results[i].STANDARD,r.results[i].OBJECT_ID__TXT,r.results[i].REASON_ID__TXT,b);}else{this.subheader="";}for(var j=0;j<r.results[i].CU_AssignedCompanyCodesRel.results.length;j++){var A=r.results[i].CU_AssignedCompanyCodesRel.results[j];var f=A.ASSIGNMENT_ID+A.BUKRS;if(f===this.CompCode){var g=this.getView().getModel("i18n").getProperty("GL_COMP_CODE")+": "+A.BUKRS__TXT+"("+A.BUKRS+")";this.getView().byId("ccObjHeaderDet").setTitle(g);var h=fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();this.getView().byId("bpdesc").setText(h);this.getView().byId("erpCustCompCode").setText(this.subheader);var F=r.results[i].CU_AssignedCompanyCodesRel.results[j];m=new sap.ui.model.json.JSONModel();m.setData(F);e=sap.ui.getCore().byId("SimpleFormCompcode");e.setModel(m);if(A.ChangeData.results!==undefined){if(A.ChangeData.results.length>0){var S="text_bold";if(this.extHookModifyStyleClass){var n=this.extHookModifyStyleClass(S);if(n!==undefined){S=n;}}for(var l=0;l<A.ChangeData.results.length;l++){var L="lbl"+A.ChangeData.results[l].Attribute;var o=sap.ui.getCore().byId(L);if(o!==undefined){o.setDesign("Bold");}var t=A.ChangeData.results[l].Attribute;if(sap.ui.getCore().byId(t)!==undefined){sap.ui.getCore().byId(t).addStyleClass(S);}}}}fcg.mdg.approvecrv2.DomainSpecParts.Customer.hideCompcodeSection();var E=sap.ui.getCore().byId("lblcompBUKRS");E.setVisible(false);var v=sap.ui.getCore().byId("lblerpcust");v.setVisible(false);var p=sap.ui.getCore().byId("compBUKRS");p.setVisible(false);if(A.CU_CompDunningAreasRel.results!==undefined&&A.CU_CompDunningAreasRel.results.length>0){s={dataitems:[],ChangeData:[]};for(k=0;k<A.CU_CompDunningAreasRel.results.length;k++){var q=A.CU_CompDunningAreasRel.results[k];var u=q.MABER;a=q.ASSIGNMENT_ID;var w=q.MABER__TXT;var x=false;if(w===""){w=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DefaultDunning");}var y=fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(u,w);if(q.ChangeData.results!==undefined){for(var d=0;d<q.ChangeData.results.length;d++){if(q.ChangeData.results[d].EntityAction==="D")x=true;}}D={"Id":y,"withhld":"","Dunning":a+q.BUKRS+u,"DunningAreaDeleted":x};s.dataitems.push(D);if(q.ChangeData.results!==undefined&&q.ChangeData.results.length>0){C={"changeId":a+q.BUKRS+u};s.ChangeData.push(C);}}m=new sap.ui.model.json.JSONModel();m.setData(s);e=this.getView().byId("DunningArea");e.setVisible(true);e.setModel(m);this.oItemTempComp=this.getDunningTemplate(m);this.oItemTempComp.attachPress({Entity:"Dunning",Key:s.dataitems,EntityData:r},this.navtoDunningDetail);e.bindItems("/dataitems",this.oItemTempComp);e.setVisible(true);}else{this.getView().byId("DunningArea").setVisible(false);}if(A.CU_CompWithholdingTaxesRel.results!==undefined&&A.CU_CompWithholdingTaxesRel.results.length>0){s={dataitems:[],ChangeData:[]};for(k=0;k<A.CU_CompWithholdingTaxesRel.results.length;k++){var W=A.CU_CompWithholdingTaxesRel.results[k];var z=W.WITHT;a=W.ASSIGNMENT_ID;var B=W.WITHT__TXT;var G=fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(z,B);D={"Id":G,"Dunning":"","withhld":a+W.BUKRS+z};s.dataitems.push(D);if(W.ChangeData.results!==undefined&&W.ChangeData.results.length>0){C={"changeId":a+W.BUKRS+z};s.ChangeData.push(C);}}m=new sap.ui.model.json.JSONModel();m.setData(s);e=this.getView().byId("ExtendWthhldTax");e.setVisible(true);e.setModel(m);this.oItemTempTax=this.getWithTaxTemplate(m);this.oItemTempTax.attachPress({Entity:"WithhldTax",Key:s.dataitems,EntityData:r},this.navtoExtTaxDetail);e.bindItems("/dataitems",this.oItemTempTax);e.setVisible(true);}else{this.getView().byId("ExtendWthhldTax").setVisible(false);}}}}},displaySuppCompCodedata:function(r){var e="";var m="";var s="";var k="";var a="";var d="";var C="";var b="";for(var i=0;i<r.results.length;i++){if(r.results.length>1){if(r.results[i].SP_AssignedSupplierRel!==undefined&&r.results[i].SP_AssignedSupplierRel.KTOKK!==undefined&&r.results[i].SP_AssignedSupplierRel.KTOKK__TXT!==undefined){b=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(r.results[i].SP_AssignedSupplierRel.KTOKK,r.results[i].SP_AssignedSupplierRel.KTOKK__TXT);}this.subheader=fcg.mdg.approvecrv2.DomainSpecParts.SupplierCreate.getSubheaderWithAccGrp(r.results[i].STANDARD,r.results[i].OBJECT_ID__TXT,r.results[i].REASON_ID__TXT,b);}else{this.subheader="";}for(var j=0;j<r.results[i].SP_AssignedCompanyCodesRel.results.length;j++){var A=r.results[i].SP_AssignedCompanyCodesRel.results[j];var c=A.ASSIGNMENT_ID+A.BUKRS;if(c===this.CompCode){var f=this.getView().getModel("i18n").getProperty("GL_COMP_CODE")+": "+A.BUKRS__TXT+"("+A.BUKRS+")";this.getView().byId("ccObjHeaderDet").setTitle(f);var g=fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();this.getView().byId("bpdesc").setText(g);this.getView().byId("erpCustCompCode").setText(this.subheader);var F=r.results[i].SP_AssignedCompanyCodesRel.results[j];m=new sap.ui.model.json.JSONModel();m.setData(F);e=sap.ui.getCore().byId("SimpleFormSupplierCompcode");e.setModel(m);if(A.ChangeData.results!==undefined){if(A.ChangeData.results.length>0){var S="text_bold";for(var l=0;l<A.ChangeData.results.length;l++){var L="lblSupp"+A.ChangeData.results[l].Attribute;var o=sap.ui.getCore().byId(L);if(o!==undefined){o.setDesign("Bold");}var t="Supp"+A.ChangeData.results[l].Attribute;if(sap.ui.getCore().byId(t)!==undefined){sap.ui.getCore().byId(t).addStyleClass(S);}}}}fcg.mdg.approvecrv2.DomainSpecParts.Supplier.hideSuppCompcodeSection();var E=sap.ui.getCore().byId("lblSuppcompBUKRS");E.setVisible(false);var v=sap.ui.getCore().byId("lblSuppCompervend");v.setVisible(false);var h=sap.ui.getCore().byId("SuppcompcodeBUKRS");h.setVisible(false);if(A.SP_CompDunningAreasRel.results!==undefined&&A.SP_CompDunningAreasRel.results.length>0){s={dataitems:[],ChangeData:[]};for(k=0;k<A.SP_CompDunningAreasRel.results.length;k++){var n=A.SP_CompDunningAreasRel.results[k];var p=n.MABER;a=n.ASSIGNMENT_ID;var q=n.MABER__TXT;if(q===""){q=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DefaultDunning");}var u=fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(p,q);d={"Id":u,"withhld":"","Dunning":a+n.BUKRS+p,"Entity":"Supp"};s.dataitems.push(d);if(n.ChangeData.results!==undefined&&n.ChangeData.results.length>0){C={"changeId":a+n.BUKRS+p};s.ChangeData.push(C);}}m=new sap.ui.model.json.JSONModel();m.setData(s);e=this.getView().byId("DunningArea");e.setVisible(true);e.setModel(m);this.oItemTempComp=this.getDunningTemplate(m);e.bindItems("/dataitems",this.oItemTempComp);e.setVisible(true);}else{this.getView().byId("DunningArea").setVisible(false);}if(A.SP_CompWithholdingTaxesRel.results!==undefined&&A.SP_CompWithholdingTaxesRel.results.length>0){s={dataitems:[],ChangeData:[]};for(k=0;k<A.SP_CompWithholdingTaxesRel.results.length;k++){var w=A.SP_CompWithholdingTaxesRel.results[k];var x=w.WITHT;a=w.ASSIGNMENT_ID;var y=w.WITHT__TXT;var z=fcg.mdg.approvecrv2.DomainSpecParts.SupplierChange.getValue(x,y);d={"Id":z,"Entity":"Supp","Dunning":"","withhld":a+w.BUKRS+x};s.dataitems.push(d);if(w.ChangeData.results!==undefined&&w.ChangeData.results.length>0){C={"changeId":a+w.BUKRS+x};s.ChangeData.push(C);}}m=new sap.ui.model.json.JSONModel();m.setData(s);e=this.getView().byId("ExtendWthhldTax");e.setVisible(true);e.setModel(m);this.oItemTempTax=this.getWithTaxTemplate(m);this.oItemTempTax.attachPress({Entity:"SuppWithhldTax",Key:s.dataitems,EntityData:r},this.navtoExtTaxDetail);e.bindItems("/dataitems",this.oItemTempTax);e.setVisible(true);}else{this.getView().byId("ExtendWthhldTax").setVisible(false);}}}}},isNull:function(v){return typeof v==="undefined"||v==="unknown"||v===null||v==="null"||parseInt(v)===0;}});