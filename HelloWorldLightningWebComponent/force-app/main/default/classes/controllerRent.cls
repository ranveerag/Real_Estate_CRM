public with sharing class controllerRent {
    @AuraEnabled(cacheable=true)
  public static List<Rent__c> getRentId(String optId) {

    return [SELECT Id FROM Rent__c where Opportunity_Name__c = :optId];
}
}