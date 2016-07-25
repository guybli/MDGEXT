/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccount");fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate={oGLAccounDescTable:"",oGLAccounCreateFrag:"",oS3Controller:"",i18n:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),initialize_Forms:function(s){this.oS3Controller=s;},getGenQuery:function(s,p,a){this.oS3Controller=a;var q=p+"?$expand=ACCOUNT/ACCOUNT2AtthACCOUNTRel,ACCOUNT/ACCOUNT2DTxtACCOUNTRel";return q;},getCCQuery:function(s,p,a){this.oS3Controller=a;var q=p+"?$expand=ACCOUNT/ACCOUNT2ACCCCDETRel,ACCOUNT/ACCOUNT2ACCCCDETRel/ACCCCDET2AtthACCCCDETRel";return q;},getCEQuery:function(s,p,a){var q="";this.oS3Controller=a;if(a.oApplicationFacade.isMock())q=p+"?$expand=ACCOUNT/ACCOUNT2CELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2DTxtCELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2AtthCELEMRel";else q=p+"?$expand=ACCOUNT/ACCOUNT2CELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2DTxtCELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2AtthCELEMRel,ACCOUNT/ACCOUNT2CELEMRel/CELEM2ACCOUNTRel";return q;},displayData:function(r,s){var d=new sap.ui.model.json.JSONModel();d.setData(r);this.displayGenData(d,r,s);this.displayCCData(d,r);this.displayCEData(d,r);},displayGenData:function(r,s){var S=fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.getS3Instance();var d=new sap.ui.model.json.JSONModel();d.setData(r);if(S.oGlAccountGenForm===""){S.oGlAccountGenForm=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccountCreate');}else{sap.ui.getCore().byId("glGeneralDataLayout").removeContent(S.oGlAccountGenForm);if(S.oGlAccountGenForm!==undefined){S.oGlAccountGenForm.destroy();}S.oGlAccountGenForm=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccountCreate');}sap.ui.getCore().byId("glGeneralDataLayout").addContent(S.oGlAccountGenForm);sap.ui.getCore().byId("glCreateMainDataForm").setModel(d);if(r.ACCOUNT.ACCOUNT2DTxtACCOUNTRel.results.length>0){sap.ui.getCore().byId("glDescTab").setModel(d);var D=this.getDescTemplate();sap.ui.getCore().byId("glDescTab").bindItems('/ACCOUNT/ACCOUNT2DTxtACCOUNTRel/results',D,'','');}else{sap.ui.getCore().byId('glDescTab').destroy();}if(r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results.length>0){this.getGenAttachmentList(r);}else{sap.ui.getCore().byId('glAttachFileList').destroy();}this.hideSection();},displayCCData:function(r,s){this.oS3Controller=s;var d=new sap.ui.model.json.JSONModel();d.setData(r);sap.ui.getCore().byId("glCCDataLayout").removeAllContent();if(this.oS3Controller.oGlAccountCompTable){this.oS3Controller.oGlAccountCompTable.destroy();}if(r.ACCOUNT.ACCOUNT2ACCCCDETRel.results.length===0){var n=new sap.m.Text("glCCNoData");n.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NodataCreate"));sap.ui.getCore().byId("glCCDataLayout").addContent(n);}else if(r.ACCOUNT.ACCOUNT2ACCCCDETRel.results.length>1){if(this.oS3Controller.oGlAccountCompTable){this.oS3Controller.oGlAccountCompTable.destroy();}this.oS3Controller.oGlAccountCompTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccountCCTable');sap.ui.getCore().byId("glCCDataLayout").addContent(this.oS3Controller.oGlAccountCompTable);this.oS3Controller.oGlAccountCompTable.setGrowing(true);this.oS3Controller.oGlAccountCompTable.setModel(d);var c=this.getCompCodeTemplate();c.attachPress({Entity:r,name:'GLCompanyCode'},this.oS3Controller.navtoSubDetail,this.oS3Controller);this.oS3Controller.oGlAccountCompTable.bindItems('/ACCOUNT/ACCOUNT2ACCCCDETRel/results',c,'','');}else if(r.ACCOUNT.ACCOUNT2ACCCCDETRel.results.length===1){if(this.oS3Controller.oGlAccountCompForm===""){this.oS3Controller.oGlAccountCompForm=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccCompCodeDetails');}else{if(this.oS3Controller.oGlAccountCompForm!==undefined){this.oS3Controller.oGlAccountCompForm.destroy();}this.oS3Controller.oGlAccountCompForm=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccCompCodeDetails');}this.displaySingleCCData(r.ACCOUNT.ACCOUNT2ACCCCDETRel.results[0]);sap.ui.getCore().byId("glCCDataLayout").addContent(this.oS3Controller.oGlAccountCompForm);}},displaySingleCCData:function(r){if(r.ACCICFREQ.Code==="00"){r.ACCICFREQ.Code="";}var c=new sap.ui.model.json.JSONModel();c.setData(r);sap.ui.getCore().byId("glCCControlData").setModel(c);sap.ui.getCore().byId("LBL_COMPCODE").addStyleClass("sapThemeFont");sap.ui.getCore().byId("TXT_COMPCODE").addStyleClass("sapThemeFont");var C=fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oCCData.ACCOUNT.ACCOUNT2ACCCCDETRel.results[0].ACCCCDET2AtthACCCCDETRel;if(C.results.length>0){this.getglCCAttachmentList(C);}else{sap.ui.getCore().byId('glCCAttach').destroy();}this.hidesectionCC();},hidesectionCC:function(){if(sap.ui.getCore().byId("TXT_CURRACC").getText()===""&&sap.ui.getCore().byId("TXT_ACCTAXCAT").getText()===""&&sap.ui.getCore().byId("TXT_ACCBALLC").getText()===""&&sap.ui.getCore().byId("TXT_ACCEXCHRD").getText()===""&&sap.ui.getCore().byId("TXT_ACCVALGRP").getText()===""&&sap.ui.getCore().byId("TXT_ACCALTACC").getText()===""&&sap.ui.getCore().byId("TXT_ACCINFKEY").getText()===""&&sap.ui.getCore().byId("TXT_ACCTOLGRP").getText()===""&&sap.ui.getCore().byId("TXT_ACCRECIND").getText()===""){sap.ui.getCore().byId("glDetACCCntrlCC").destroy();}if(sap.ui.getCore().byId("TXT_ACCLIDISP").getText()===""&&sap.ui.getCore().byId("TXT_ACCSRTKEY").getText()===""&&sap.ui.getCore().byId("TXT_ACCAUTHGP").getText()===""){sap.ui.getCore().byId("glDetACCMgmntCC").destroy();}if(sap.ui.getCore().byId("TXT_ACCFSTGRP").getText()===""&&sap.ui.getCore().byId("TXT_ACCAUTPOS").getText()===""){sap.ui.getCore().byId("glDetCntrlDocCreatn").destroy();}if(sap.ui.getCore().byId("TXT_ACCPLLEV").getText()===""&&sap.ui.getCore().byId("TXT_ACCCASHFL").getText()===""&&sap.ui.getCore().byId("TXT_ACCHOUSBK").getText()===""){sap.ui.getCore().byId("glDetBankFinCC").destroy();}if(sap.ui.getCore().byId("TXT_ACCICIND").getText()===""&&sap.ui.getCore().byId("TXT_ACCICFREQ").getText()===""){sap.ui.getCore().byId("glDetInterestCalc").destroy();}},getglCCAttachmentList:function(r){var o=sap.ui.getCore().byId("glCCAttach");var c=new sap.m.CustomListItem({});for(var i=0;i<r.results.length;i++){var l="";if(r.results[i].USMD_LINK!==""){l=r.results[i].USMD_LINK;}else l=r.results[i].__metadata.media_src;var f=fcg.mdg.approvecrv2.util.Formatter.dateFormatter(r.results[i].USMD_ACREATED_AT)+" "+this.i18n.getText('AttachBy')+" ";var C=" "+r.results[i].USMD_ACREATED_BY__TXT+"("+r.results[i].USMD_ACREATED_BY+")";var a=new sap.m.Text({text:f+" "+C});var L=false;var A=new sap.m.Link({text:r.results[i].USMD_TITLE,target:"_blank",href:l,wrapping:true,subtle:false,emphasized:L}).addStyleClass("padding_bottom");var v=new sap.m.VBox({items:[A,a]}).addStyleClass("padding_left");var I=fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(r.results[i].USMD_FILE_TYPE);I=new sap.ui.core.Icon({src:I,size:"3.0em"});var h=new sap.m.HBox({items:[I,v]}).addStyleClass("Hbox_padding");c.addContent(h);o.addItem(c);}if(o.getItems().length===0){sap.ui.getCore().byId("glCCAttach").destroy();}},displayCEData:function(r,s){this.oS3Controller=s;var d=new sap.ui.model.json.JSONModel();d.setData(r);sap.ui.getCore().byId("glCEDataLayout").removeAllContent();if(r.ACCOUNT.ACCOUNT2CELEMRel.results.length===0){var n=new sap.m.Text("glCENoData");n.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NodataCreate"));sap.ui.getCore().byId("glCEDataLayout").addContent(n);}else if(r.ACCOUNT.ACCOUNT2CELEMRel.results.length>1){if(this.oS3Controller.oGlAccountCelemTable){this.oS3Controller.oGlAccountCelemTable.destroy();}this.oS3Controller.oGlAccountCelemTable=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccountCETable');sap.ui.getCore().byId("glCEDataLayout").addContent(this.oS3Controller.oGlAccountCelemTable);this.oS3Controller.oGlAccountCelemTable.setGrowing(true);this.oS3Controller.oGlAccountCelemTable=sap.ui.getCore().byId("glCostElTab");this.oS3Controller.oGlAccountCelemTable.setModel(d);var c=this.getCostElTemplate(d);c.attachPress({Entity:r,name:'GLCostEl'},this.oS3Controller.navtoSubDetail,this.oS3Controller);this.oS3Controller.oGlAccountCelemTable.bindItems('/ACCOUNT/ACCOUNT2CELEMRel/results',c,'','');}else if(r.ACCOUNT.ACCOUNT2CELEMRel.results.length===1){if(this.oS3Controller.oGlAccountCelemForm){this.oS3Controller.oGlAccountCelemForm.destroy();}this.oS3Controller.oGlAccountCelemForm=sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.GLAccCostElDetails');this.displaySingleCEData(r.ACCOUNT.ACCOUNT2CELEMRel.results[0]);sap.ui.getCore().byId("glCEDataLayout").addContent(this.oS3Controller.oGlAccountCelemForm);sap.ui.getCore().byId("glCEDetails").setTitle("");}},displaySingleCEData:function(r){var c=new sap.ui.model.json.JSONModel();c.setData(r);sap.ui.getCore().byId("glCEDetails").setModel(c);sap.ui.getCore().byId("glDetCCGenTitle").destroy();sap.ui.getCore().byId("LBL_CELEM").addStyleClass("sapThemeFont");sap.ui.getCore().byId("TXT_CELEM").addStyleClass("sapThemeFont");var C=fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oCEData.ACCOUNT.ACCOUNT2CELEMRel.results[0].CELEM2AtthCELEMRel;var a;if(fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(r.CELEM2ACCOUNTRel.ACCOUNT)===fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(r.CELEM)){a=this.i18n.getText("GL_TXT_CLAS");}else{a=this.i18n.getText("GL_TXT_CLAS_SEC");}sap.ui.getCore().byId("TXT_DET_CLASSIFICATION").setText(a);if(r.CELEM2DTxtCELEMRel.results.length>0){sap.ui.getCore().byId("glCostElDescTab").setModel(c);var d=this.getCEDescTemplate();sap.ui.getCore().byId("glCostElDescTab").bindItems('/CELEM2DTxtCELEMRel/results',d,'','');}else{sap.ui.getCore().byId('glCostElDescTab').destroy();}if(C.results.length>0){this.getglCEAttachmentList(C);}else{sap.ui.getCore().byId('glCostElAttach').destroy();}sap.ui.getCore().byId("glDetCCGenData").destroy();this.hideCEsection();},hideCEsection:function(){if(sap.ui.getCore().byId("TXT_COAREA").getText()===""&&sap.ui.getCore().byId("TXT_CELEM").getText()===""&&sap.ui.getCore().byId("TXT_CELEMCAT").getText()===""&&sap.ui.getCore().byId("TXT_DET_CLASSIFICATION").getText()===""){sap.ui.getCore().byId("glDetCCGenData").destroy();}if((sap.ui.getCore().byId("TXT_CCTRCELEM").getText()===""&&sap.ui.getCore().byId("TXT_CELEMORD").getText()==="")||(sap.ui.getCore().byId("TXT_CCTRCELEM").getText()===undefined&&sap.ui.getCore().byId("TXT_CELEMORD").getText()==="")||(sap.ui.getCore().byId("TXT_CCTRCELEM").getText()===""&&sap.ui.getCore().byId("TXT_CELEMORD").getText()===undefined)||(sap.ui.getCore().byId("TXT_CCTRCELEM").getText()===undefined&&sap.ui.getCore().byId("TXT_CELEMORD").getText()===undefined)){sap.ui.getCore().byId("glDetDefAccAsst").destroy();}if(sap.ui.getCore().byId("TXT_CELEMINDQ").getText()===""&&sap.ui.getCore().byId("TXT_UOMCELEM").getText()===""){sap.ui.getCore().byId("glCostElInd").destroy();}},getCEDescTemplate:function(m){var d=new sap.m.ColumnListItem({cells:[new sap.m.Text({text:"{LANGU__TXT}"}),new sap.m.Text({text:{path:"TXTSH",formatter:fcg.mdg.approvecrv2.util.Formatter.noValue}}),new sap.m.Text({text:{path:"TXTMI",formatter:fcg.mdg.approvecrv2.util.Formatter.noValue}})]});var e=this.oS3Controller.glHookgetCEDescTemplate(d);if(e!==undefined){d=e;}return d;},getglCEAttachmentList:function(r){var o=sap.ui.getCore().byId("glCostElAttach");var c=new sap.m.CustomListItem({});for(var i=0;i<r.results.length;i++){var l="";if(r.results[i].USMD_LINK!==""){l=r.results[i].USMD_LINK;}else l=r.results[i].__metadata.media_src;var f=fcg.mdg.approvecrv2.util.Formatter.dateFormatter(r.results[i].USMD_ACREATED_AT)+" "+this.i18n.getText('AttachBy')+" ";var C=r.results[i].USMD_ACREATED_BY__TXT+"("+r.results[i].USMD_ACREATED_BY+")";var a=new sap.m.Text({text:f+" "+C});var L=false;var A=new sap.m.Link({text:r.results[i].USMD_TITLE,target:"_blank",href:l,wrapping:true,subtle:false,emphasized:L}).addStyleClass("padding_bottom");var v=new sap.m.VBox({items:[A,a]}).addStyleClass("padding_left");var I=fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(r.results[i].USMD_FILE_TYPE);I=new sap.ui.core.Icon({src:I,size:"3.0em"});var h=new sap.m.HBox({items:[I,v]}).addStyleClass("Hbox_padding");c.addContent(h);o.addItem(c);}if(o.getItems().length===0){sap.ui.getCore().byId("glCostElAttach").destroy();}},hideSection:function(){if(sap.ui.getCore().byId("TXT_ACCGRPACC").getText()===""&&sap.ui.getCore().byId("TXT_ACCTYP").getText()===""&&sap.ui.getCore().byId("TXT_ACCPLTYP").getText()===""){sap.ui.getCore().byId("LBL_CNTRL_DATA").destroy();}if(sap.ui.getCore().byId("TXT_ACCNEWACC").getText()===""&&sap.ui.getCore().byId("TXT_ACCRESPU").getText()===""&&sap.ui.getCore().byId("TXT_ACCRESPP").getText()===""){sap.ui.getCore().byId("LBL_ADM_TYPE").destroy();}if(sap.ui.getCore().byId("TXT_USMD_ENT_CRTD_BY").getText()===""&&sap.ui.getCore().byId("TXT_USMD_ENT_CRTD_AT").getText()===""&&sap.ui.getCore().byId("TXT_USMD_ENT_CHNG_BY").getText()===""&&sap.ui.getCore().byId("TXT_USMD_ENT_CHNG_AT").getText()===""){sap.ui.getCore().byId("LBL_AUD_INFO").destroy();}if(sap.ui.getCore().byId("TXT_COMPACC").getText()===""&&sap.ui.getCore().byId("TXT_FSIACC").getText()===""&&sap.ui.getCore().byId("TXT_FSIACCSTA").getText()===""){sap.ui.getCore().byId("AccConsDetails").destroy();}},getCompCodeTemplate:function(){var c=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.Text({text:"{COMPCODE__TXT} ({COMPCODE})"})]});var e=this.oS3Controller.glHookgetCompCodeTemplate(c);if(e!==undefined){c=e;}return c;},getCostElTemplate:function(m){var c=new sap.m.ColumnListItem({type:"Navigation",cells:[new sap.m.Text({text:"{COAREA__TXT} ({COAREA})"}),new sap.m.Text({text:"{CELEM__TXT} ({CELEM})"}),new sap.m.Text({text:{path:"{FUNCCELEM}",formatter:function(){var k=m.getProperty("FUNCCELEM",this.getBindingContext());var a=m.getProperty("FUNCCELEM__TXT",this.getBindingContext());if(k!==""&&a!==""){return fcg.mdg.approvecrv2.util.Formatter.descriptionWithRemoveZeros(k,a);}else{return fcg.mdg.approvecrv2.util.Formatter.noValue(k);}}}}),new sap.m.Text({text:"{CELEMCAT__TXT} ({CELEMCAT})"})]});var e=this.oS3Controller.glHookgetCostElTemplate(c);if(e!==undefined){c=e;}return c;},getDescTemplate:function(){var d=new sap.m.ColumnListItem({cells:[new sap.m.Text({text:"{LANGU__TXT}"}),new sap.m.Text({text:{path:"TXTSH",formatter:fcg.mdg.approvecrv2.util.Formatter.noValue}}),new sap.m.Text({text:{path:"TXTLG",formatter:fcg.mdg.approvecrv2.util.Formatter.noValue}})]});var e=this.oS3Controller.glHookgetDescTemplate(d);if(e!==undefined){d=e;}return d;},getGenAttachmentList:function(r){var a=sap.ui.getCore().byId("glAttachFileList");var c=new sap.m.CustomListItem({});var C;var l;for(var i=0;i<r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results.length;i++){var L="";if(r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_LINK!==""){L=r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_LINK;}else L=r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].__metadata.media_src;var f=fcg.mdg.approvecrv2.util.Formatter.dateFormatter(r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_ACREATED_AT)+" "+this.i18n.getText('AttachBy')+" ";var v=" "+r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_ACREATED_BY__TXT+"("+r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_ACREATED_BY+")";if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction==='CHANGE'&&r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results.length!==0){for(var j=0;j<r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results.length;j++){if(r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].EntityAction==='D'){C=new sap.m.Text({text:f+" "+v}).addStyleClass("sapThemeText");l=true;}else{C=new sap.m.Text({text:f+" "+v}).addStyleClass("text_bold");l=true;}}}else{C=new sap.m.Text({text:f+" "+v});l=false;}var A=new sap.m.Link({text:r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_TITLE,target:"_blank",href:L,wrapping:true,subtle:false,emphasized:l}).addStyleClass("padding_bottom");if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction==='CHANGE'&&r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results.length!==0){for(var j=0;j<r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results.length;j++){if(r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].ChangeData.results[j].EntityAction==='D'){A.setHref("");A.addStyleClass("sapThemeText");}}}var b=new sap.m.VBox({items:[A,C]}).addStyleClass("padding_left");var I=fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(r.ACCOUNT.ACCOUNT2AtthACCOUNTRel.results[i].USMD_FILE_TYPE);I=new sap.ui.core.Icon({src:I,size:"3.0em"});var h=new sap.m.HBox({items:[I,b]}).addStyleClass("Hbox_padding");c.addContent(h);a.addItem(c);}if(a.getItems().length===0){sap.ui.getCore().byId("glAttachFileList").destroy();}}};