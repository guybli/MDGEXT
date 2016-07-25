/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.BankDetail",{oBankDetail:"",extHookModifyBankDetailFormData:null,extHookModifyBankStyleClass:null,onInit:function(){var s="text_bold";var b="";this.getView().byId("bankPage").removeStyleClass(s);this.getView().byId("bankPage").setShowNavButton(true);this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="bankDetail"){fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());var d=e.getParameter('arguments').Domain;var S=fcg.mdg.approvecrv2.DomainSpecParts[d].getS3Instance();var D=S.getDecisions();S.createDecisionButtons(D,this,'navFromDetail');b=fcg.mdg.approvecrv2.DomainSpecParts[d].oGeneralData[0].data.BP_Root.BP_BankAccountsRel;var B=e.getParameter('arguments').ChangeKey;var a="";for(var i=0;i<b.results.length;i++){if(b.results[i].BANKDETAILID.trim()===B.trim()){a=b.results[i];}}var c="";if(a.BANK_NAME!==""&&a.BANK_NAME!==undefined)c=a.BANK_NAME;if(a.BANK_CTRY__TXT!==""&&a.BANK_CTRY__TXT!==undefined){if(c!=="")c=c+", "+a.BANK_CTRY__TXT;else c=a.BANK_CTRY__TXT;}if(a.BANK_ACCT!==""&&a.BANK_ACCT!==undefined){if(c!=="")c=c+" ("+this.getView().getModel("i18n").getProperty("Account")+": "+a.BANK_ACCT+")";else c=this.getView().getModel("i18n").getProperty("Account")+": "+a.BANK_ACCT;}var f=fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();this.getView().byId("bankDetailHeader").setTitle(c);this.getView().byId("bankAttrHeader").setText(f);if(this.extHookModifyBankDetailFormData){var g=this.extHookModifyBankDetailFormData(a);if(g!==undefined){a=g;}}var m=new sap.ui.model.json.JSONModel();m.setData(a);var E=this.getView().byId("SimpleFormBank");E.setModel(m);this.oBankDetail=a;this.highlight();this.getView().rerender();}},this);},onAfterRendering:function(){this.hideSection();},hideSection:function(){if(this.getView().byId("BANK_CTRY").getText()===""&&this.getView().byId("BANK_KEY").getText()===""&&this.getView().byId("BANK_NAME").getText()===""&&this.getView().byId("STREET").getText()===""&&this.getView().byId("CITY").getText()===""&&this.getView().byId("SWIFT_CODE").getText()===""&&this.getView().byId("BankData")!==undefined){var b=this.getView().byId('BankData').getId();$('#'+b).hide();}},highlight:function(){if(this.oBankDetail.ChangeData.results!==undefined&&this.oBankDetail.ChangeData.results!==null){if(this.oBankDetail.ChangeData.results.length>0){var s="text_bold";if(this.extHookModifyBankStyleClass){var n=this.extHookModifyBankStyleClass(s);if(n!==undefined){s=n;}}for(var l=0;l<this.oBankDetail.ChangeData.results.length;l++){var L="lbl"+this.oBankDetail.ChangeData.results[l].Attribute;var o=this.getView().byId(L);if(o!==undefined){o.setDesign("Bold");}var t=this.oBankDetail.ChangeData.results[l].Attribute;if(this.getView().byId(t)!==undefined){this.getView().byId(t).addStyleClass(s);}}}}this.oBankDetail="";}});
