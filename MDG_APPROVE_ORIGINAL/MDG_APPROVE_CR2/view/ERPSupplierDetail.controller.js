/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Supplier");sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.ERPSupplierDetail",{oresult:"",extHookModifyERPCustDetailFormData:null,extHookModifyERPCustStyleClass:null,onInit:function(){this.getView().byId("erpSupplierPage").setShowNavButton(true);var S=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.getS3Instance();var d=S.getDecisions();S.createDecisionButtons(d,this,'navFromDetail');this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="erpSupplierDetail"){fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());var E=fcg.mdg.approvecrv2.DomainSpecParts.Supplier.oGeneralData[0].data.BP_Root.SP_MultipleAssignmentsRel;var v=e.getParameter('arguments').ChangeKey;var r="";v=v.substring(0,12);for(var i=0;i<E.results.length;i++){if(E.results[i].ASSIGNMENT_ID===v){r=E.results[i];}}var a=fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();this.getView().byId("erpSupplObjectKey").setText(a);var h="";h=this.getView().getModel("i18n").getProperty("ERP_Vendor");if(r.SP_AssignedSupplierRel!==undefined){var b=fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(r.SP_AssignedSupplierRel.LIFNR);var c=fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(b,r.SP_AssignedSupplierRel.LIFNR__TXT);h=h+': '+c;}if(r.REASON_ID__TXT!==""&&r.REASON_ID__TXT!==undefined){if(h!=="")h=h+", "+this.getView().getModel("i18n").getProperty("Reason")+': '+r.REASON_ID__TXT;else h=h+this.getView().getModel("i18n").getProperty("Reason")+": "+r.REASON_ID__TXT;}if(r.SP_AssignedSupplierRel.KTOKK!==""&&r.SP_AssignedSupplierRel.KTOKK!==undefined){if(h!=="")h=h+", "+this.getView().getModel("i18n").getProperty("AccountGroup")+': '+r.SP_AssignedSupplierRel.KTOKK__TXT+' ('+r.SP_AssignedSupplierRel.KTOKK+')';else h=this.getView().getModel("i18n").getProperty("AccountGroup")+': '+r.SP_AssignedSupplierRel.KTOKK__TXT+' ('+r.SP_AssignedSupplierRel.KTOKK+')';}if(r.STANDARD!==""&&r.STANDARD!==undefined){if(r.STANDARD==='X'){if(h!=="")h=h+", "+this.getView().getModel("i18n").getProperty("Standard");else h=this.getView().getModel("i18n").getProperty("Standard");}}this.getView().byId("erpSupplierObjHeaderDet").setTitle(h);var m=new sap.ui.model.json.JSONModel();m.setData(r);var f=this.getView().byId("SimpleFormControlData");f.setModel(m);if(r.SP_AssignedSubrangesRel.results!==undefined&&r.SP_AssignedSubrangesRel.results.length>0){var g={dataitems:[],ChangeData:[]};for(var k=0;k<r.SP_AssignedSubrangesRel.results.length;k++){var o=r.SP_AssignedSubrangesRel.results[k];if(o.ASSIGNMENT_ID===v){var j=o.LTSNR;var l=o.LTSBZ;var n=fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(j,l);var p=o.SPRAS;var q=o.SPRAS__TXT;var t=fcg.mdg.approvecrv2.DomainSpecParts.CustomerChange.getValue(p,q);var u=false;var w=false;var x=false;var y=false;if(o.ChangeData!==undefined&&o.ChangeData.results!==undefined&&o.ChangeData.results.length>0){for(var s=0;s<o.ChangeData.results.length;s++){if(o.ChangeData.results[s].EntityAction==="C"){u=true;}if(o.ChangeData.results[s].Attribute==="LTSBZ"&&o.ChangeData.results[s].OldValue!==o.ChangeData.results[s].NewValue){w=true;}if(o.ChangeData.results[s].Attribute==="SPRAS"&&o.ChangeData.results[s].OldValue!==p){x=true;}if(o.ChangeData.results[s].EntityAction==="D"){y=true;}}}var D={"Language":t,"SubrangeDesc":n,"NewlyCreated":u,"SubrangeChanged":w,"LanguageChanged":x,"SubrangeDeleted":y};g.dataitems.push(D);}}m=new sap.ui.model.json.JSONModel();m.setData(g);var z=this.getView().byId("subranges");z.setVisible(true);z.setModel(m);this.oSubrangeTemplate=this.getSubrangeTableTemplate(m);z.bindItems("/dataitems",this.oSubrangeTemplate);z.setVisible(true);}else{this.getView().byId("subranges").setVisible(false);}this.oresult=r;this.highlight();this.getView().rerender();}},this);},onAfterRendering:function(){this.hideSection();},getSubrangeTableTemplate:function(m){var i=new sap.m.ColumnListItem({cells:[new sap.m.Text({text:{path:"Language",formatter:function(){var c=this.getBindingContext();var n=m.getProperty("NewlyCreated",c);var l=m.getProperty("LanguageChanged",c);var s=m.getProperty("SubrangeDeleted",c);if(n||l){this.addStyleClass("text_bold");}if(s){this.addStyleClass("sapThemeText");}return m.getProperty("Language",this.getBindingContext());}}}),new sap.m.Text({text:{path:"SubrangeDesc",formatter:function(){var c=this.getBindingContext();var n=m.getProperty("NewlyCreated",c);var s=m.getProperty("SubrangeChanged",c);var S=m.getProperty("SubrangeDeleted",c);if(n||s){this.addStyleClass("text_bold");}if(S){this.addStyleClass("sapThemeText");}return m.getProperty("SubrangeDesc",this.getBindingContext());}}})]});return i;},hideSection:function(){if(this.getView().byId("REASON_ID").getText()===""&&this.getView().byId("STANDARD").getText()===""&&this.getView().byId("KUNNR").getText()===""&&this.getView().byId("KTOKK").getText()===""&&this.getView().byId("BEGRU").getText()===""&&this.getView().byId("KONZS").getText()===""&&this.getView().byId("VBUND").getText()===""&&this.getView().byId("PLKAL").getText()===""&&this.getView().byId("SimpleFormCustControlData")!==undefined){var c=this.getView().byId('SimpleFormCustControlData').getId();$('#'+c).hide();}if(this.getView().byId("BAHNS").getText()===""&&this.getView().byId("EMNFR").getText()===""&&this.getView().byId("PODKZB").getText()===""&&this.getView().byId("SCACD").getText()===""&&this.getView().byId("QSSYS").getText()===""&&this.getView().byId("SFRGR").getText()===""&&this.getView().byId("DLGRP").getText()===""&&this.getView().byId("KRAUS").getText()===""&&this.getView().byId("REVDB").getText()===""&&this.getView().byId("STGDL").getText()===""&&this.getView().byId("QSSYSDAT").getText()===""&&this.getView().byId("SimpleFormReferenceData")!==undefined){var r=this.getView().byId('SimpleFormReferenceData').getId();$('#'+r).hide();}if(this.getView().byId("FISKU").getText()===""&&this.getView().byId("STENR").getText()===""&&this.getView().byId("FISKN").getText()===""&&this.getView().byId("FITYP").getText()===""&&(this.getView().byId("TAXBS").getText()==="0"||this.getView().byId("TAXBS").getText()==="")&&this.getView().byId("J_1KFTBUS").getText()===""&&this.getView().byId("J_1KFREPRE").getText()===""&&this.getView().byId("STKZU").getText()===""&&this.getView().byId("STKZA").getText()===""&&this.getView().byId("IPISP").getText()===""&&this.getView().byId("REGSS").getText()===""&&this.getView().byId("ACTSS").getText()===""&&this.getView().byId("J_1KFTIND").getText()===""&&this.getView().byId("SimpleFormTaxInformation")!==undefined){var t=this.getView().byId('SimpleFormTaxInformation').getId();$('#'+t).hide();}if(this.getView().byId("WERKR").getText()===""&&this.getView().byId("LTSNA").getText()===""&&this.getView().byId("ExpClassification")!==undefined&&this.getView().byId("SimpleFormAdditionalPurchasingData")!==undefined){var e=this.getView().byId('SimpleFormAdditionalPurchasingData').getId();$('#'+e).hide();}if(this.getView().byId("DTAMS").getText()===""&&this.getView().byId("XZEMP").getText()===""&&this.getView().byId("DTAWS").getText()===""&&this.getView().byId("SimpleFormPaymentTransac")!==undefined){var f=this.getView().byId('SimpleFormPaymentTransac').getId();$('#'+f).hide();}},highlight:function(){if(this.oresult.SP_AssignedSupplierRel.ChangeData.results!==undefined&&this.oresult.SP_AssignedSupplierRel.ChangeData.results!==null){if(this.oresult.ChangeData.results.length>0)for(var l=0;l<this.oresult.ChangeData.results.length;l++){var s="text_bold";var L="lbl"+this.oresult.ChangeData.results[l].Attribute;var o=this.getView().byId(L);if(o!==undefined){o.setDesign("Bold");}var t=this.oresult.ChangeData.results[l].Attribute;if(this.getView().byId(t)!==undefined){this.getView().byId(t).addStyleClass(s);}}if(this.oresult.SP_AssignedSupplierRel.ChangeData.results.length>0){var s="text_bold";if(this.extHookModifyERPCustStyleClass){var n=this.extHookModifyERPCustStyleClass(s);if(n!==undefined){s=n;}}for(var l=0;l<this.oresult.SP_AssignedSupplierRel.ChangeData.results.length;l++){var L="lbl"+this.oresult.SP_AssignedSupplierRel.ChangeData.results[l].Attribute;var o=this.getView().byId(L);if(o!==undefined){o.setDesign("Bold");}var t=this.oresult.SP_AssignedSupplierRel.ChangeData.results[l].Attribute;if(this.getView().byId(t)!==undefined){this.getView().byId(t).addStyleClass(s);}}}}this.oresult="";}});
