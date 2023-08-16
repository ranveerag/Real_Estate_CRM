public class controllerRent {
  @AuraEnabled(cacheable=true)
  public static List<Rent__c> getRentId(String optId) {
      return [SELECT Id FROM Rent__c WHERE Opportunity_Name__c = :optId];
  }

  @AuraEnabled
    public static void createRentRecord(Id opportunityId) {
        Rent__c newRent = new Rent__c(Opportunity_Name__c = opportunityId);
        insert newRent;
    }
  
}
