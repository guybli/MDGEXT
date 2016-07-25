/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Customer");jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");jQuery.sap.require("fcg.mdg.approvecrv2.util.Formatter");sap.ca.scfld.md.controller.BaseDetailController.extend("fcg.mdg.approvecrv2.view.IAVPersDetail",{extHookModifyIAVPersDetailFormData:null,onInit:function(){var i="";var l="";var s="";var L="";var o="";var t="";this.getView().byId("IAVPersDetailPage").setShowNavButton(true);this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="IAVPersDetail"){fcg.mdg.approvecrv2.util.Formatter.resetFormBolding(this.getView());var I=fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();this.getView().byId("IAVPersAttrHeader").setText(I);var d=e.getParameter('arguments').Domain;var S=fcg.mdg.approvecrv2.DomainSpecParts[d].getS3Instance();var D=S.getDecisions();S.createDecisionButtons(D,this,'navFromDetail');var r=fcg.mdg.approvecrv2.DomainSpecParts[d].getData('General');var p=r[0].data.BP_Root.BP_AddressesRel;var a=e.getParameter('arguments').AddressId;var P='';for(i=0;i<p.results.length;i++){if(p.results[i].AD_ID===a){P=p.results[i];}}var A="";var v=e.getParameter('arguments').AddressVersion;var b=P.BP_AddressVersionsPersRel;A="";for(i=0;i<b.results.length;i++){if(b.results[i].AD_ID===a&&b.results[i].ADDR_VERS===v){A=b.results[i];}}var c=P.AD_ID__TXT;this.getView().byId("IAVPersDetailHeader").setTitle(c);var f=A;if(this.extHookModifyIAVPersDetailFormData){var g=this.extHookModifyIAVPersDetailFormData(f);if(g!==undefined){f=g;}}var m=new sap.ui.model.json.JSONModel();m.setData(f);var E=this.getView().byId("SimpleFormIAVPers");E.setModel(m);if(A.ChangeData.results!==undefined&&A.ChangeData.results!==null){if(A.ChangeData.results.length>0){s="text_bold";for(l=0;l<A.ChangeData.results.length;l++){L="lblp"+A.ChangeData.results[l].Attribute;o=this.getView().byId(L);if(o!==undefined){o.setDesign("Bold");}t="p"+A.ChangeData.results[l].Attribute;if(this.getView().byId(t)!==undefined){this.getView().byId(t).addStyleClass(s);}}}}if(A.BP_AddressPersonVersionRel!==null&&A.BP_AddressPersonVersionRel.ChangeData.results!==undefined&&A.ChangeData.results!==null){if(A.BP_AddressPersonVersionRel.ChangeData.results.length>0){s="text_bold";for(l=0;l<A.BP_AddressPersonVersionRel.ChangeData.results.length;l++){L="lbl"+A.BP_AddressPersonVersionRel.ChangeData.results[l].Attribute;o=this.getView().byId(L);if(o!==undefined){o.setDesign("Bold");}t=A.BP_AddressPersonVersionRel.ChangeData.results[l].Attribute;if(this.getView().byId(t)!==undefined){this.getView().byId(t).addStyleClass(s);}}}}this.getView().rerender();}},this);},onAfterRendering:function(){this.handleSectionVisibility();},handleSectionVisibility:function(){var i="";if(this.getView().byId('TITLE_P').getText()===""&&this.getView().byId('FIRSTNAME').getText()===""&&this.getView().byId('LASTNAME').getText()===""&&this.getView().byId('SORT1_P').getText()===""&&this.getView().byId('SORT2_P').getText()===""){i=this.getView().byId('IAVPers_Sect2').getId();$('#'+i).hide();var I=this.getView().byId('IAVPers_Sect3').getId();$('#'+I).hide();}if(this.getView().byId('pSTREET').getText()===""&&this.getView().byId('pHOUSE_NO').getText()===""&&this.getView().byId('pCITY').getText()===""){i=this.getView().byId('IAVPers_Sect2').getId();$('#'+i).hide();var v=this.getView().byId('IAVPers_Sect4').getId();$('#'+v).hide();}}});
