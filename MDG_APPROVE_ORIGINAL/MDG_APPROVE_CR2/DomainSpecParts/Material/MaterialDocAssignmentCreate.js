/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate");jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate={oMaterialDocAssignmentTable:"",oMaterialDocAssignmentForm:"",vNoDataTxt:"",aDocAssignmentData:"",oS3Controller:"",aTextData:"",IsSingle:"",i18n:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),initializeDocAssignmentTabl:function(r,s){this.oS3Controller=s;this.vNoDataTxt=this.i18n.getText("NodataCreate");if(sap.ui.getCore().byId("matChangeDocAssignmentDataLayout")!==undefined){sap.ui.getCore().byId("matChangeDocAssignmentDataLayout").destroy();}if(r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length>1){if(this.oMaterialDocAssignmentTable===""){this.oMaterialDocAssignmentTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssignmentCreate',fcg.mdg.approvecrv2.util.Formatter);}else{this.oMaterialDocAssignmentTable.destroy();this.oMaterialDocAssignmentTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssignmentCreate',fcg.mdg.approvecrv2.util.Formatter);}sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").removeAllContent();sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").addContent(this.oMaterialDocAssignmentTable);var d=sap.ui.getCore().byId("MatDocAssignmentTable");var D=sap.ui.getCore().byId("DocAssignmentpersIcon");var i="/dataitems";fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(i,d,D);}else if(r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length===1){if(sap.ui.getCore().byId("Dfileupload")!==undefined){sap.ui.getCore().byId("Dfileupload").destroy();}if(sap.ui.getCore().byId("MatDocAssignmentTextTable")!==undefined){sap.ui.getCore().byId("MatDocAssignmentTextTable").destroy();}if(sap.ui.getCore().byId("Txt_Document")!==undefined){sap.ui.getCore().byId("Txt_Document").destroy();}if(this.oMaterialDocAssignmentForm===""){this.oMaterialDocAssignmentForm=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssignmentDetails',fcg.mdg.approvecrv2.util.Formatter);}else{this.oMaterialDocAssignmentForm.destroy();this.oMaterialDocAssignmentForm=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialDocAssignmentDetails',fcg.mdg.approvecrv2.util.Formatter);}sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").removeAllContent();sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").addContent(this.oMaterialDocAssignmentForm);}},displayDocAssignmentData:function(r,v){var d;var D={dataitems:[]};var o=new sap.ui.model.json.JSONModel();if(r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length>1){for(var i=0;i<r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length;i++){var a=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKAR,r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKAR__TXT);var b=r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKNR;var c=r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKTL;var e=r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKVR;var f=r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[i].DOKAR;d={"Document":b,"DocumentType":a,"DocumentPart":c,"DocumentVersion":e,"DOKNR":b,"DOKAR":f};var E=this.oS3Controller.matHookModifyDocCreateData(d);if(E!==undefined){d=E;}D.dataitems.push(d);}this.aDocAssignmentData=D;var g=sap.ui.getCore().byId("MatDocAssignmentTable");o.setData(D);var h=this.createDocAssignmentTableTemplate();h.attachPress({Entity:r,name:"matDocAssignmentDataDetail"},v.navtoSubDetail,v);g.setModel(o);g.bindItems('/dataitems',h,'','');}else if(r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results.length===1){this.IsSingle='X';var j=r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[0].DOKNR;var k=r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[0].DOKAR;var l=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(k,r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[0].DOKAR__TXT);var m=r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[0].DOKVR;var n=r.__batchResponses[0].data.MATERIAL2DRADBASICRel.results[0].DOKTL;var p=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getDocAssignmentData(j,k,m,n);var K=this.i18n.getText("Mat_Doc_key")+": "+l+"/"+j+"/"+m+"/"+n;sap.ui.getCore().byId("Txt_Document").setText(K);this.getsetDocData(p,v);}else{sap.ui.getCore().byId("matCreateDocAssignmentDataLayout").removeAllContent();var N=this.i18n.getText("NodataCreate");var q=sap.ui.getCore().byId("matCreateDocAssignmentDataLayout");fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(q,N);}},getIsSingleFlag:function(){return this.IsSingle;},createDocAssignmentTableTemplate:function(){var d=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.Text({text:{path:"Document",formatter:fcg.mdg.approvecrv2.util.Formatter.noValue}}),new sap.m.Text({text:{path:"DocumentType",formatter:fcg.mdg.approvecrv2.util.Formatter.noValue}}),new sap.m.Text({text:{path:"DocumentPart",formatter:fcg.mdg.approvecrv2.util.Formatter.noValue}}),new sap.m.Text({text:{path:"DocumentVersion",formatter:fcg.mdg.approvecrv2.util.Formatter.noValue}})]});var e=this.oS3Controller.matHookcreateDocAssignmentTableTemplate(d);if(e!==undefined){d=e;}return d;},getDocAssignmentData:function(){return this.aDocAssignmentData;},loadDocAttachments:function(r,s){this.oFileUpload=sap.ui.getCore().byId("Dfileupload");var m={dataitems:[]};var c=r.results.length;var l="";var u="";if(c!==0){for(var i=0;i<r.results.length;i++){var A="";if(r.results[i].CHANGEDAT!==undefined&&r.results[i].CHANGEDAT!==null&&r.results[i].CHANGEDAT!==""){A=fcg.mdg.approvecrv2.util.Formatter.matDateDoc(r.results[i].CHANGEDAT);}else{A=fcg.mdg.approvecrv2.util.Formatter.matDateDoc(r.results[i].CREATEDAT);}if(r.results[i].CHANGEDBY!==undefined&&r.results[i].CHANGEDBY!==null&&r.results[i].CHANGEDBY!==""){u=r.results[i].CHANGEDBY__TXT;}else{u=r.results[i].CREATEDBY__TXT;}if(r.results[i].FILE_ID!==""){l=this.buildLink(r.results[i],s);}if(r.results[i].FILESIZE!==""){var f=fcg.mdg.approvecrv2.util.Formatter.convertBytesToHigherOrder(r.results[i].FILESIZE);u=u+"   "+f;}var a={"mimeType":r.results[i].WSAPPLICATION,"contributor":u,"uploaded":A,"filename":r.results[i].DOCFILE,"url":l};m.dataitems.push(a);}var b=new sap.ui.model.json.JSONModel();b.setData(m);this.oFileUpload.setModel(b,"json");}},getsetDocData:function(d,v){var t={results:[]};var D=d.data.__batchResponses[0].data.DRADBASIC2ORIGINALSRel;var a=d.data.__batchResponses[0].data.DRADBASIC2DRADTXTRel;this.oS3Controller=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialDocAssignmentCreate.loadDocAttachments(D,this.oS3Controller);var b=sap.ui.getCore().byId("MatDocAssignmentTextTable");for(var i=0;i<a.results.length;i++){if(a.results[i].TXTDRAD!==""){t.results.push(a.results[i]);}}if(t.results.length>0){var o=new sap.ui.model.json.JSONModel();o.setData(t);this.aTextData=t;b.setModel(o);var c=this.createDocAssignmentcreateTextTemplate(o);c.attachPress({Entity:t,name:'matDocAssignmentTextDataDetail'},v.navtoSubDetail,v);b.bindItems('/results',c,'','');}else{sap.ui.getCore().byId("MatDocAssignmentTextTable").destroy();}this.oS3Controller.matHookModifyDocDetail(d,v);},buildLink:function(r,s){var u="";var m=s.getView().getModel("MDG_MATERIAL");u=m.sServiceUrl;u=u+"/ORIGINALCONTENTCollection(DOCUMENTTYPE=";u=u+"'"+r.DOCUMENTTYPE+"',DOCUMENTNUMBER='"+r.DOCUMENTNUMBER+"',DOCUMENTPART='"+r.DOCUMENTPART+"',DOCUMENTVERSION='";u=u+r.DOCUMENTVERSION+"',APPLICATION_ID='"+r.APPLICATION_ID+"',FILE_ID='"+r.FILE_ID+"')/$value";return u;},createDocAssignmentcreateTextTemplate:function(o){var a=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.Text({text:{path:"LANGUCODE",formatter:function(){fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this,o,"LANGUCODE");var d=o.getProperty("LANGUCODE__TXT",this.getBindingContext());var k=o.getProperty("LANGUCODE",this.getBindingContext());if(k===""){return fcg.mdg.approvecrv2.util.Formatter.noValue(k);}else{return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(k,d);}}}}),new sap.m.Text({text:{path:"TXTDRAD",formatter:function(){var d=o.getProperty("TXTDRAD",this.getBindingContext());fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this,o,"TXTDRAD");return fcg.mdg.approvecrv2.util.Formatter.Truncate(d);}}})]});var e=this.oS3Controller.matHookcreateDocAssignmentcreateTextTemplate(a);if(e!==undefined){a=e;}return a;},getTextData:function(){return this.aTextData;}};